#!/bin/bash

# ╔══════════════════════════════════════════════════════════════════════════════════════╗
# ║                           MaycolPlus - Hanako-kun Edition                            ║
# ║                               Hecho por SoyMaycol                                    ║
# ╚══════════════════════════════════════════════════════════════════════════════════════╝

# Colores para el tema Hanako-kun
RED='\033[1;31m'
BLUE='\033[1;34m'
CYAN='\033[1;36m'
YELLOW='\033[1;33m'
PURPLE='\033[1;35m'
WHITE='\033[1;37m'
GRAY='\033[1;30m'
GREEN='\033[1;32m'
NC='\033[0m' # Sin color

# Función para reproducir música
play_music() {
    if command -v mpv >/dev/null 2>&1; then
        mpv --no-video --volume=30 ~/maycolplus.mp3 >/dev/null 2>&1 &
        MUSIC_PID=$!
    elif command -v ffplay >/dev/null 2>&1; then
        ffplay -nodisp -autoexit -volume 30 ~/maycolplus.mp3 >/dev/null 2>&1 &
        MUSIC_PID=$!
    fi
}

# Función para detener música
stop_music() {
    if [ ! -z "$MUSIC_PID" ]; then
        kill $MUSIC_PID 2>/dev/null
    fi
    pkill -f "maycolplus.mp3" 2>/dev/null
}

# Banner ASCII de MaycolPlus
show_banner() {
    echo -e "${GRAY}
    ███╗   ███╗ █████╗ ██╗   ██╗ ██████╗ ██████╗ ██╗     ██████╗ ██╗     ██╗   ██╗███████╗
    ████╗ ████║██╔══██╗╚██╗ ██╔╝██╔════╝██╔═══██╗██║     ██╔══██╗██║     ██║   ██║██╔════╝
    ██╔████╔██║███████║ ╚████╔╝ ██║     ██║   ██║██║     ██████╔╝██║     ██║   ██║███████╗
    ██║╚██╔╝██║██╔══██║  ╚██╔╝  ██║     ██║   ██║██║     ██╔═══╝ ██║     ██║   ██║╚════██║
    ██║ ╚═╝ ██║██║  ██║   ██║   ╚██████╗╚██████╔╝███████╗██║     ███████╗╚██████╔╝███████║
    ╚═╝     ╚═╝╚═╝  ╚═╝   ╚═╝    ╚═════╝ ╚═════╝ ╚══════╝╚═╝     ╚══════╝ ╚═════╝ ╚══════╝${WHITE}
    
    ◆━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━◆
    ▌                            Hanako-kun Edition                                    ▐
    ▌                             Hecho por SoyMaycol                                 ▐
    ◆━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━◆${NC}
    "
}

# Función de instalación silenciosa
install_packages() {
    local packages=("$@")
    for package in "${packages[@]}"; do
        if ! dpkg -l | grep -q "^ii.*$package "; then
            echo -e "${CYAN}◆ ${WHITE}Instalando $package...${NC}"
            pkg install -y "$package" >/dev/null 2>&1
        fi
    done
}

# Crear comando maycolplus
create_command() {
    cat > $PREFIX/bin/maycolplus << 'EOF'
#!/bin/bash

# Colores
RED='\033[1;31m'
BLUE='\033[1;34m'
CYAN='\033[1;36m'
YELLOW='\033[1;33m'
PURPLE='\033[1;35m'
WHITE='\033[1;37m'
GRAY='\033[1;30m'
GREEN='\033[1;32m'
NC='\033[0m'

# Función para reproducir música
play_music() {
    if [ -f ~/maycolplus.mp3 ]; then
        if command -v mpv >/dev/null 2>&1; then
            mpv --no-video --volume=30 ~/maycolplus.mp3 >/dev/null 2>&1 &
            MUSIC_PID=$!
        elif command -v ffplay >/dev/null 2>&1; then
            ffplay -nodisp -autoexit -volume 30 ~/maycolplus.mp3 >/dev/null 2>&1 &
            MUSIC_PID=$!
        fi
    fi
}

stop_music() {
    if [ ! -z "$MUSIC_PID" ]; then
        kill $MUSIC_PID 2>/dev/null
    fi
    pkill -f "maycolplus.mp3" 2>/dev/null
}

hanako_header() {
    echo -e "${PURPLE}
    ◆━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━◆
    ▌                              MaycolPlus                                         ▐
    ▌                           Hanako-kun Edition                                   ▐
    ▌                            Hecho por SoyMaycol                                 ▐
    ◆━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━◆${NC}"
}

check_installation() {
    if [ ! -d ~/MaycolAIUltraMD ] && [ ! -d ~/MaycolPlus ]; then
        echo -e "${RED}✖ Error: ${WHITE}MaycolPlus no está instalado${NC}"
        echo -e "${CYAN}◆ ${WHITE}Ejecuta: ${YELLOW}maycolplus instalar${NC}"
        return 1
    fi
    return 0
}

case "$1" in
    "instalar")
        play_music
        hanako_header
        
        if [ -d ~/MaycolAIUltraMD ] || [ -d ~/MaycolPlus ]; then
            echo -e "${GREEN}✓ MaycolPlus ya está instalado${NC}"
            echo -e "${CYAN}◆ ${WHITE}Para desinstalar ejecuta: ${YELLOW}maycolplus desinstalar${NC}"
        else
            echo -e "${CYAN}◆ ${WHITE}Iniciando instalación de MaycolPlus...${NC}"
            curl https://raw.githubusercontent.com/SoySapo6/MaycolPlus/refs/heads/main/storage/scripts/instalar.sh | bash
        fi
        
        stop_music
        ;;
    
    "desinstalar")
        play_music
        hanako_header
        
        if check_installation; then
            echo -e "${YELLOW}◆ ${WHITE}Desinstalando MaycolPlus...${NC}"
            curl https://raw.githubusercontent.com/SoySapo6/MaycolPlus/refs/heads/main/storage/scripts/desinstalar.sh | bash
        fi
        
        stop_music
        ;;
    
    "iniciar")
        play_music
        hanako_header
        
        if check_installation; then
            echo -e "${GREEN}◆ ${WHITE}Iniciando MaycolPlus Bot...${NC}"
            if [ -d ~/MaycolPlus ]; then
                cd ~/MaycolPlus && exec node index.js
            elif [ -d ~/MaycolAIUltraMD ]; then
                cd ~/MaycolAIUltraMD && exec node index.js
            fi
        fi
        
        stop_music
        ;;
    
    "eliminarsesion")
        play_music
        hanako_header
        
        if check_installation; then
            echo -e "${YELLOW}◆ ${WHITE}Eliminando sesión...${NC}"
            if [ -d ~/MaycolPlus ]; then
                cd ~/MaycolPlus && rm -f maybots maybot
            elif [ -d ~/MaycolAIUltraMD ]; then
                cd ~/MaycolAIUltraMD && rm -f maybots maybot
            fi
            echo -e "${GREEN}✓ Sesión eliminada exitosamente${NC}"
        fi
        
        stop_music
        ;;
    
    "help"|"ayuda"|"")
        hanako_header
        echo -e "${WHITE}
    ◆━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━◆
    ▌                               COMANDOS DISPONIBLES                              ▐
    ◆━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━◆
    
    ${CYAN}◆ maycolplus instalar${WHITE}     - Instala el bot MaycolPlus
    ${CYAN}◆ maycolplus iniciar${WHITE}      - Inicia el bot MaycolPlus
    ${CYAN}◆ maycolplus desinstalar${WHITE}  - Desinstala completamente el bot
    ${CYAN}◆ maycolplus eliminarsesion${WHITE} - Elimina la sesión actual
    ${CYAN}◆ maycolplus help${WHITE}         - Muestra esta ayuda
    
    ◆━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━◆
    ▌                              Hecho por SoyMaycol                                ▐
    ◆━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━◆${NC}
        "
        ;;
    
    *)
        hanako_header
        echo -e "${RED}✖ Comando no reconocido: ${WHITE}$1${NC}"
        echo -e "${CYAN}◆ ${WHITE}Ejecuta ${YELLOW}maycolplus help${WHITE} para ver los comandos disponibles${NC}"
        ;;
esac
EOF

    chmod +x $PREFIX/bin/maycolplus
}

# Función principal de instalación
main_install() {
    clear
    show_banner
    
    echo -e "${CYAN}◆ ${WHITE}Descargando música temática...${NC}"
    curl -o ~/maycolplus.mp3 https://files.catbox.moe/slkd51.mp3 >/dev/null 2>&1
    
    play_music
    
    echo -e "${PURPLE}◆ ${WHITE}Instalando recursos necesarios...${NC}"
    
    # Actualizar repositorios silenciosamente
    pkg update >/dev/null 2>&1
    
    # Instalar paquetes necesarios
    install_packages "nodejs" "git" "curl" "wget" "ffmpeg" "mpv" "imagemagick" "figlet" "toilet" "lolcat" "python"
    
    echo -e "${GREEN}◆ ${WHITE}Configurando comandos del sistema...${NC}"
    create_command
    
    echo -e "${BLUE}◆ ${WHITE}Configurando inicio automático...${NC}"
    
    # Agregar al .bashrc para que esté disponible siempre
    if ! grep -q "maycolplus" ~/.bashrc 2>/dev/null; then
        echo "" >> ~/.bashrc
        echo "# MaycolPlus - Hanako-kun Edition" >> ~/.bashrc
        echo "export PATH=\$PATH:\$PREFIX/bin" >> ~/.bashrc
    fi
    
    stop_music
    
    clear
    show_banner
    
    echo -e "${GREEN}
    ◆━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━◆
    ▌                          INSTALACIÓN COMPLETADA                                ▐
    ◆━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━◆
    
    ✓ Todos los recursos han sido instalados correctamente
    ✓ El comando 'maycolplus' está disponible en todo el sistema
    ✓ Música temática de Hanako-kun configurada
    
    ${CYAN}Para instalar el bot ejecuta: ${YELLOW}maycolplus instalar
    ${CYAN}Para ver todos los comandos: ${YELLOW}maycolplus help
    
    ◆━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━◆
    ▌                              Hecho por SoyMaycol                                ▐
    ◆━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━◆${NC}
    "
}

# Verificar si estamos en Termux
if [ -z "$PREFIX" ]; then
    echo "Este script está diseñado para ejecutarse en Termux"
    exit 1
fi

# Ejecutar instalación principal
main_install
