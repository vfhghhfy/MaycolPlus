#!/bin/bash

clear

print_ascii() {
    echo -e "\e[37m"
    echo "╔══════════════════════════════════════════════════════════════╗"
    echo "║ ███╗   ███╗ █████╗ ██╗   ██╗ ██████╗ ██████╗ ██╗     ██████╗ ║"
    echo "║ ████╗ ████║██╔══██╗╚██╗ ██╔╝██╔════╝██╔═══██╗██║     ██╔══██╗║"
    echo "║ ██╔████╔██║███████║ ╚████╔╝ ██║     ██║   ██║██║     ██████╔╝║"
    echo "║ ██║╚██╔╝██║██╔══██║  ╚██╔╝  ██║     ██║   ██║██║     ██╔═══╝ ║"
    echo "║ ██║ ╚═╝ ██║██║  ██║   ██║   ╚██████╗╚██████╔╝███████╗██║     ║"
    echo "║ ╚═╝     ╚═╝╚═╝  ╚═╝   ╚═╝    ╚═════╝ ╚═════╝ ╚══════╝╚═╝     ║"
    echo "╚══════════════════════════════════════════════════════════════╝"
    echo -e "\e[0m"
    
    echo -e "\e[91m♥\e[93m♥\e[92m♥\e[96m♥\e[94m♥\e[95m♥\e[91m Hecho por SoyMaycol<3 \e[95m♥\e[94m♥\e[96m♥\e[92m♥\e[93m♥\e[91m♥\e[0m"
    echo ""
}

hanako_speak() {
    local message="$1"
    echo -e "\e[95m╔═══════════════════════════════════════════════════════════╗\e[0m"
    echo -e "\e[95m║\e[97m 👻 Hanako-kun dice: \e[95m                                 ║\e[0m"
    echo -e "\e[95m║\e[96m $message\e[95m ║\e[0m"
    echo -e "\e[95m╚═══════════════════════════════════════════════════════════╝\e[0m"
    echo ""
}

loading_animation() {
    local text="$1"
    local chars="⠋⠙⠹⠸⠼⠴⠦⠧⠇⠏"
    local delay=0.1
    
    for i in {1..20}; do
        for char in $(echo $chars | grep -o .); do
            echo -ne "\e[94m$char \e[97m$text\e[0m\r"
            sleep $delay
        done
    done
    echo -e "\e[92m✓ \e[97m$text - Completado!\e[0m"
}

detect_os() {
    if [[ "$PREFIX" == *"com.termux"* ]]; then
        echo "termux"
    elif [[ -f /etc/debian_version ]]; then
        if grep -q "Ubuntu" /etc/os-release 2>/dev/null; then
            echo "ubuntu"
        else
            echo "debian"
        fi
    else
        echo "unknown"
    fi
}

ask_os() {
    echo -e "\e[93m╭─────────────────────────────────────────────────────────╮\e[0m"
    echo -e "\e[93m│\e[97m 🎭 No pude detectar tu sistema :^.                     \e[93m│\e[0m"
    echo -e "\e[93m│\e[97m Por favor selecciona tu sistema operativo:             \e[93m│\e[0m"
    echo -e "\e[93m│\e[92m [1] Termux                                             \e[93m│\e[0m"
    echo -e "\e[93m│\e[92m [2] Ubuntu                                             \e[93m│\e[0m"
    echo -e "\e[93m│\e[92m [3] Debian                                             \e[93m│\e[0m"
    echo -e "\e[93m╰─────────────────────────────────────────────────────────╯\e[0m"
    echo -ne "\e[96m▶ Tu elección (1-3): \e[0m"
    read choice
    
    case $choice in
        1) echo "termux" ;;
        2) echo "ubuntu" ;;
        3) echo "debian" ;;
        *) echo "invalid" ;;
    esac
}

check_command() {
    command -v "$1" >/dev/null 2>&1
}

install_nodejs() {
    local os="$1"
    
    if check_command node && check_command npm; then
        hanako_speak "¡Ara ara~ Node.js ya está instalado! Qué eficiente... ♡"
        return 0
    fi
    
    hanako_speak "Hmm... parece que necesitas Node.js. ¡Vamos a instalarlo juntos! ♪"
    
    case $os in
        "termux")
            pkg update -y >/dev/null 2>&1 &
            loading_animation "Actualizando repositorios de Termux"
            wait
            pkg install -y nodejs >/dev/null 2>&1 &
            loading_animation "Instalando Node.js en Termux"
            wait
            ;;
        "ubuntu"|"debian")
            if ! check_command curl; then
                sudo apt update >/dev/null 2>&1 &
                loading_animation "Actualizando repositorios"
                wait
                sudo apt install -y curl >/dev/null 2>&1 &
                loading_animation "Instalando curl"
                wait
            fi
            curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash - >/dev/null 2>&1 &
            loading_animation "Configurando repositorio de Node.js"
            wait
            sudo apt install -y nodejs >/dev/null 2>&1 &
            loading_animation "Instalando Node.js"
            wait
            ;;
    esac
}

install_git() {
    local os="$1"
    
    if check_command git; then
        hanako_speak "Git ya está aquí... como yo siempre estoy esperando ♡"
        return 0
    fi
    
    hanako_speak "¡Oh! Necesitamos git para traer ese proyecto tan... interesante~"
    
    case $os in
        "termux")
            pkg install -y git >/dev/null 2>&1 &
            loading_animation "Instalando Git en Termux"
            wait
            ;;
        "ubuntu"|"debian")
            sudo apt install -y git >/dev/null 2>&1 &
            loading_animation "Instalando Git"
            wait
            ;;
    esac
}

clone_repository() {
    if [ -d "MaycolPlus" ]; then
        hanako_speak "¡Ara~ ya tienes MaycolPlus aquí! Como si me hubieras invocado antes... ♡"
        return 0
    fi
    
    hanako_speak "Ahora vamos a traer ese bot tan... especial~ ¿No te da curiosidad?"
    
    git clone https://github.com/SoySapo6/MaycolPlus.git >/dev/null 2>&1 &
    loading_animation "Clonando repositorio MaycolPlus"
    wait
    
    if [ ! -d "MaycolPlus" ]; then
        echo -e "\e[91m✗ Error al clonar el repositorio\e[0m"
        exit 1
    fi
}

install_dependencies() {
    hanako_speak "¡Hora de instalar las dependencias! Esto puede tomar un tiempo... como mis travesuras ♪"
    
    cd MaycolPlus
    npm install --force >/dev/null 2>&1 &
    loading_animation "Instalando dependencias del bot"
    wait
    cd ..
}

main() {
    print_ascii
    
    hanako_speak "¡Kyaa~! ¿Vienes a instalar MaycolPlus? Qué atrevido... ♡"
    
    echo -e "\e[94m╔══════════════════════════════════════════════════════════╗\e[0m"
    echo -e "\e[94m║\e[97m 🔮 Detectando tu sistema operativo...                  \e[94m║\e[0m"
    echo -e "\e[94m╚══════════════════════════════════════════════════════════╝\e[0m"
    
    OS=$(detect_os)
    
    if [ "$OS" = "unknown" ]; then
        hanako_speak "¡Ara ara~ no reconozco este lugar! ¿Dónde estamos exactamente? (Termux,Debian,Ubuntu)"
         OS=$(ask_os)
        
        if [ "$OS" = "invalid" ]; then
            hanako_speak "¡Hmph! Si no vas a cooperar, no puedo ayudarte... ¡Baka!"
            exit 1
        fi
    fi
    
    case $OS in
        "termux")
            hanako_speak "¡Oh! Estás en Termux~ Qué moderno y... portátil ♡"
            ;;
        "ubuntu")
            hanako_speak "Ubuntu, eh~ Un sistema bastante popular... como yo en el baño ♪"
            ;;
        "debian")
            hanako_speak "Debian... estable y confiable, justo como mis apariciones ♡"
            ;;
    esac
    
    echo ""
    echo -e "\e[96m╭─────────────────────────────────────────────────────────╮\e[0m"
    echo -e "\e[96m│\e[97m 🚀 Iniciando instalación de MaycolPlus...              \e[96m│\e[0m"
    echo -e "\e[96m╰─────────────────────────────────────────────────────────╯\e[0m"
    echo ""
    
    install_nodejs "$OS"
    install_git "$OS"
    clone_repository
    install_dependencies
    
    echo ""
    echo -e "\e[92m╔══════════════════════════════════════════════════════════╗\e[0m"
    echo -e "\e[92m║\e[97m ✨ ¡INSTALACIÓN COMPLETADA! ✨                         \e[92m║\e[0m"
    echo -e "\e[92m╚══════════════════════════════════════════════════════════╝\e[0m"
    
    hanako_speak "¡Kyaa~! Todo listo... ahora ejecuta estos comandos y... ¡diviértete! ♡"
    
    echo ""
    echo -e "\e[93m╭─────────────────────────────────────────────────────────╮\e[0m"
    echo -e "\e[93m│\e[97m 🎯 Para iniciar el bot, ejecuta:                       \e[93m│\e[0m"
    echo -e "\e[93m│\e[96m                                                         \e[93m│\e[0m"
    echo -e "\e[93m│\e[92m    cd MaycolPlus && npm start                          \e[93m│\e[0m"
    echo -e "\e[93m│\e[96m                                                         \e[93m│\e[0m"
    echo -e "\e[93m╰─────────────────────────────────────────────────────────╯\e[0m"
    
    echo ""
    hanako_speak "¡Nos vemos pronto... en el baño del bot! Ehehe~ ♡"
    
    echo -e "\e[95m◆━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━◆\e[0m"
}

main
