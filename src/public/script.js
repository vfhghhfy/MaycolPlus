class MaycolDashboard {
    constructor() {
        this.currentSection = 'system';
        this.data = null;
        this.refreshInterval = null;
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadData();
        this.startAutoRefresh();
    }

    setupEventListeners() {
        const navButtons = document.querySelectorAll('.nav-btn');
        navButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.switchSection(e.target.dataset.section);
            });
        });

        document.getElementById('refreshBtn').addEventListener('click', () => {
            this.loadData(true);
        });
    }

    switchSection(section) {
        this.currentSection = section;
        
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-section="${section}"]`).classList.add('active');

        document.querySelectorAll('.stats-section').forEach(sec => {
            sec.classList.remove('active');
        });
        document.getElementById(`${section}-section`).classList.add('active');

        this.animateNumbers();
    }

    async loadData(showLoading = false) {
        try {
            if (showLoading) {
                this.showLoading();
            }

            const response = await fetch('/api/status');
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            this.data = await response.json();
            this.updateUI();
            this.updateStatus('online');
            this.hideLoading();
            
        } catch (error) {
            console.error('Error loading data:', error);
            this.handleError();
        }
    }

    updateUI() {
        if (!this.data) return;

        this.updateSystemSection();
        this.updateBotSection();
        this.updateDatabaseSection();
        this.updateTimestamp();
        this.animateNumbers();
    }

    updateSystemSection() {
        const system = this.data.system;
        
        document.getElementById('platform').textContent = `${system.platform} ${system.arch}`;
        document.getElementById('cpus').textContent = `${system.cpus} cores`;
        document.getElementById('totalMemory').textContent = system.totalMemory;
        document.getElementById('freeMemory').textContent = system.freeMemory;

        this.updateLoadBars(system.loadAverage);
    }

    updateBotSection() {
        const bot = this.data.bot;
        
        document.getElementById('botStatus').textContent = bot.status;
        document.getElementById('uptime').textContent = bot.uptime;
        document.getElementById('messagesProcessed').textContent = bot.messagesProcessed.toLocaleString();
        document.getElementById('connections').textContent = bot.connections;
        document.getElementById('botUser').textContent = bot.user.name;
        
        const startTime = new Date(bot.startTime).toLocaleString();
        document.getElementById('startTime').textContent = startTime;
    }

    updateDatabaseSection() {
        const db = this.data.bot.database;
        const server = this.data.server;
        
        document.getElementById('users').textContent = db.users.toLocaleString();
        document.getElementById('chats').textContent = db.chats.toLocaleString();
        document.getElementById('messages').textContent = db.messages.toLocaleString();
        document.getElementById('serverPort').textContent = server.port;

        this.updateDataVisualization(db);
    }

    updateLoadBars(loadAverage) {
        const maxLoad = Math.max(...loadAverage, 1);
        
        document.getElementById('load1').style.width = `${(loadAverage[0] / maxLoad) * 100}%`;
        document.getElementById('load5').style.width = `${(loadAverage[1] / maxLoad) * 100}%`;
        document.getElementById('load15').style.width = `${(loadAverage[2] / maxLoad) * 100}%`;
    }

    updateDataVisualization(db) {
        const total = Math.max(db.users + db.chats + db.messages, 1);
        
        setTimeout(() => {
            document.getElementById('usersBar').style.setProperty('--width', `${(db.users / total) * 100}%`);
            document.getElementById('chatsBar').style.setProperty('--width', `${(db.chats / total) * 100}%`);
            document.getElementById('messagesBar').style.setProperty('--width', `${(db.messages / total) * 100}%`);
        }, 300);

        const style = document.createElement('style');
        style.textContent = `
            #usersBar::after { width: ${(db.users / total) * 100}% !important; }
            #chatsBar::after { width: ${(db.chats / total) * 100}% !important; }
            #messagesBar::after { width: ${(db.messages / total) * 100}% !important; }
        `;
        document.head.appendChild(style);
        
        setTimeout(() => document.head.removeChild(style), 2000);
    }

    updateStatus(status) {
        const statusIndicator = document.getElementById('statusIndicator');
        const statusText = document.getElementById('statusText');
        const pulse = statusIndicator.querySelector('.pulse');

        if (status === 'online') {
            statusText.textContent = 'Conectado';
            pulse.style.background = '#00ff00';
            statusIndicator.style.borderColor = 'rgba(0, 255, 0, 0.3)';
        } else {
            statusText.textContent = 'Desconectado';
            pulse.style.background = '#ff0000';
            statusIndicator.style.borderColor = 'rgba(255, 0, 0, 0.3)';
        }
    }

    updateTimestamp() {
        const now = new Date().toLocaleString('es-ES');
        document.getElementById('lastUpdate').textContent = now;
    }

    showLoading() {
        document.getElementById('loading').style.display = 'flex';
        document.querySelectorAll('.stats-section').forEach(section => {
            section.style.opacity = '0.5';
        });
    }

    hideLoading() {
        document.getElementById('loading').style.display = 'none';
        document.querySelectorAll('.stats-section').forEach(section => {
            section.style.opacity = '1';
        });
    }

    handleError() {
        this.updateStatus('offline');
        this.hideLoading();
        
        const errorData = {
            success: false,
            timestamp: new Date().toISOString(),
            system: {
                platform: "Error de conexión",
                arch: "-",
                nodeVersion: "-",
                totalMemory: "0 GB",
                freeMemory: "0 GB",
                cpus: 0,
                loadAverage: [0, 0, 0]
            },
            bot: {
                status: "desconectado",
                user: {
                    id: "",
                    name: "Error"
                },
                uptime: "0h 0m",
                startTime: new Date().toISOString(),
                messagesProcessed: 0,
                connections: 0,
                database: {
                    users: 0,
                    chats: 0,
                    messages: 0
                }
            },
            server: {
                port: 0,
                environment: "error"
            }
        };

        this.data = errorData;
        this.updateUI();
    }

    animateNumbers() {
        const numberElements = document.querySelectorAll('.stat-content p');
        
        numberElements.forEach(element => {
            const text = element.textContent;
            const number = parseFloat(text.replace(/[^\d.-]/g, ''));
            
            if (!isNaN(number) && number > 0) {
                element.style.transform = 'scale(1.1)';
                element.style.transition = 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
                
                setTimeout(() => {
                    element.style.transform = 'scale(1)';
                }, 300);
            }
        });
    }

    startAutoRefresh() {
        this.refreshInterval = setInterval(() => {
            this.loadData();
        }, 30000);
    }

    stopAutoRefresh() {
        if (this.refreshInterval) {
            clearInterval(this.refreshInterval);
            this.refreshInterval = null;
        }
    }

    addLoadingAnimation() {
        const refreshBtn = document.getElementById('refreshBtn');
        const originalText = refreshBtn.textContent;
        
        refreshBtn.textContent = '🔄 Actualizando...';
        refreshBtn.disabled = true;
        refreshBtn.style.opacity = '0.7';
        
        setTimeout(() => {
            refreshBtn.textContent = originalText;
            refreshBtn.disabled = false;
            refreshBtn.style.opacity = '1';
        }, 2000);
    }

    addParticleEffect() {
        const particles = document.createElement('div');
        particles.className = 'particles';
        particles.innerHTML = Array(20).fill(0).map(() => 
            '<div class="particle"></div>'
        ).join('');
        
        document.body.appendChild(particles);
        
        const style = document.createElement('style');
        style.textContent = `
            .particles {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                pointer-events: none;
                z-index: -1;
            }
            .particle {
                position: absolute;
                width: 2px;
                height: 2px;
                background: rgba(255, 255, 255, 0.5);
                border-radius: 50%;
                animation: float 8s infinite linear;
            }
            @keyframes float {
                0% { transform: translateY(100vh) rotate(0deg); opacity: 0; }
                10% { opacity: 1; }
                90% { opacity: 1; }
                100% { transform: translateY(-10px) rotate(360deg); opacity: 0; }
            }
        `;
        document.head.appendChild(style);
        
        const particleElements = particles.querySelectorAll('.particle');
        particleElements.forEach((particle, index) => {
            particle.style.left = Math.random() * 100 + '%';
            particle.style.animationDelay = Math.random() * 8 + 's';
            particle.style.animationDuration = (8 + Math.random() * 4) + 's';
        });
        
        setTimeout(() => {
            document.body.removeChild(particles);
            document.head.removeChild(style);
        }, 12000);
    }

    addGlowEffect() {
        const cards = document.querySelectorAll('.stat-card');
        cards.forEach(card => {
            card.style.transition = 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
            card.style.boxShadow = '0 0 30px rgba(255, 255, 255, 0.2)';
            
            setTimeout(() => {
                card.style.boxShadow = '0 15px 35px rgba(255, 255, 255, 0.1)';
            }, 500);
        });
    }

    addSuccessAnimation() {
        this.addLoadingAnimation();
        this.addParticleEffect();
        this.addGlowEffect();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const dashboard = new MaycolDashboard();
    
    document.getElementById('refreshBtn').addEventListener('click', () => {
        dashboard.addSuccessAnimation();
    });
    
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            dashboard.stopAutoRefresh();
        } else {
            dashboard.startAutoRefresh();
            dashboard.loadData();
        }
    });
    
    window.addEventListener('beforeunload', () => {
        dashboard.stopAutoRefresh();
    });
});