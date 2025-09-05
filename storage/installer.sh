#!/bin/bash

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
WHITE='\033[1;37m'
BLACK='\033[0;30m'
NC='\033[0m'
BOLD='\033[1m'

COLS=$(tput cols 2>/dev/null || echo 80)
ROWS=$(tput lines 2>/dev/null || echo 24)

DETECTED_OS=""
PKG_MANAGER=""
INSTALL_CMD=""

center_text() {
    local text="$1"
    local width=$COLS
    local len=${#text}
    local spaces=$(( (width - len) / 2 ))
    printf "%*s%s\n" $spaces "" "$text"
}

print_ascii_maycolplus() {
    clear
    echo
    if [ $COLS -ge 60 ]; then
        echo -e "${WHITE}"
        center_text "██╗  ██╗ █████╗ ██╗   ██╗ ██████╗ ██████╗ ██╗     ██████╗ ██╗   ██╗███████╗"
        center_text "██║ ██╔╝██╔══██╗╚██╗ ██╔╝██╔════╝██╔═══██╗██║     ██╔══██╗██║   ██║██╔════╝"
        center_text "█████╔╝ ███████║ ╚████╔╝ ██║     ██║   ██║██║     ██████╔╝██║   ██║███████╗"
        center_text "██╔═██╗ ██╔══██║  ╚██╔╝  ██║     ██║   ██║██║     ██╔═══╝ ██║   ██║╚════██║"
        center_text "██║  ██╗██║  ██║   ██║   ╚██████╗╚██████╔╝███████╗██║     ╚██████╔╝███████║"
        center_text "╚═╝  ╚═╝╚═╝  ╚═╝   ╚═╝    ╚═════╝ ╚═════╝ ╚══════╝╚═╝      ╚═════╝ ╚══════╝"
    else
        center_text "╔╦╗┌─┐┬ ┬┌─┐┌─┐┬  ╔═╗┬  ┬ ┬┌─┐"
        center_text "║║║├─┤└┬┘│  │ ││  ╠═╝│  │ │└─┐"
        center_text "╩ ╩┴ ┴ ┴ └─┘└─┘┴─╝╩  ┴─╘└─┘└─┘"
    fi
    
    echo -e "${NC}"
    echo
    # Texto arcoiris
    local rainbow_text="Hecho por SoyMaycol<3"
    local colors=(31 33 32 36 34 35)
    local color_index=0
    local centered_spaces=$(( (COLS - ${#rainbow_text}) / 2 ))
    printf "%*s" $centered_spaces ""
    
    for (( i=0; i<${#rainbow_text}; i++ )); do
        printf "\033[1;${colors[$color_index]}m${rainbow_text:$i:1}"
        color_index=$(( (color_index + 1) % ${#colors[@]} ))
    done
    echo -e "${NC}"
    echo
}

hanako_speak() {
    local message="$1"
    local mood="$2"
    
    case $mood in
        "pervert")
            echo -e "${PURPLE}┌─────────────────────────────────────────────────────────────────────┐${NC}"
            echo -e "${PURPLE}│${WHITE} Hanako-kun: ${YELLOW}Ara ara~ $message ${WHITE}ufufu~ (◕‿◕)${PURPLE} │${NC}"
            echo -e "${PURPLE}└─────────────────────────────────────────────────────────────────────┘${NC}"
            ;;
        "excited")
            echo -e "${CYAN}┌─────────────────────────────────────────────────────────────────────┐${NC}"
            echo -e "${CYAN}│${WHITE} Hanako-kun: ${GREEN}¡Kyaa! $message ${WHITE}(≧▽≦)${CYAN} │${NC}"
            echo -e "${CYAN}└─────────────────────────────────────────────────────────────────────┘${NC}"
            ;;
        "normal")
            echo -e "${BLUE}┌─────────────────────────────────────────────────────────────────────┐${NC}"
            echo -e "${BLUE}│${WHITE} Hanako-kun: ${WHITE}$message ${BLUE}│${NC}"
            echo -e "${BLUE}└─────────────────────────────────────────────────────────────────────┘${NC}"
            ;;
        "warning")
            echo -e "${RED}┌─────────────────────────────────────────────────────────────────────┐${NC}"
            echo -e "${RED}│${WHITE} Hanako-kun: ${YELLOW}¡Mou! $message ${WHITE}(>_<)${RED} │${NC}"
            echo -e "${RED}└─────────────────────────────────────────────────────────────────────┘${NC}"
            ;;
    esac
    echo
}

loading_animation() {
    local message="$1"
    local chars="⠋⠙⠹⠸⠼⠴⠦⠧⠇⠏"
    local delay=0.1
    
    echo -ne "${CYAN}${message}${NC}"
    
    for i in {1..20}; do
        for (( j=0; j<${#chars}; j++ )); do
            echo -ne " ${PURPLE}${chars:$j:1}${NC}"
            sleep $delay
            echo -ne "\b\b"
        done
    done
    echo -e " ${GREEN}✓${NC}"
}

# ═══════════════════════════════════════════════════════════════════════════════════════════════
# Detección de sistema operativo
# ═══════════════════════════════════════════════════════════════════════════════════════════════

detect_os() {
    if [ -n "$TERMUX_VERSION" ] || [ -d "/data/data/com.termux" ]; then
        DETECTED_OS="termux"
        PKG_MANAGER="pkg"
        INSTALL_CMD="pkg install -y"
    elif [ -f "/etc/debian_version" ]; then
        if grep -q "Ubuntu" /etc/os-release 2>/dev/null; then
            DETECTED_OS="ubuntu"
        else
            DETECTED_OS="debian"
        fi
        PKG_MANAGER="apt"
        INSTALL_CMD="apt update && apt install -y"
    else
        DETECTED_OS="unknown"
    fi
}

confirm_os() {
    if [ "$DETECTED_OS" = "unknown" ]; then
        hanako_speak "No pude detectar tu sistema... ¿podrías decirme cuál usas?" "warning"
        echo -e "${WHITE}Sistemas soportados:${NC}"
        echo -e "${GREEN}1)${NC} Termux"
        echo -e "${GREEN}2)${NC} Ubuntu"
        echo -e "${GREEN}3)${NC} Debian"
        echo
        echo -ne "${YELLOW}Selecciona tu sistema (1-3): ${NC}"
        read -r choice
        
        case $choice in
            1)
                DETECTED_OS="termux"
                PKG_MANAGER="pkg"
                INSTALL_CMD="pkg install -y"
                ;;
            2)
                DETECTED_OS="ubuntu"
                PKG_MANAGER="apt"
                INSTALL_CMD="apt update && apt install -y"
                ;;
            3)
                DETECTED_OS="debian"
                PKG_MANAGER="apt"
                INSTALL_CMD="apt update && apt install -y"
                ;;
            *)
                hanako_speak "¡Esa opción no existe! Saliendo..." "warning"
                exit 1
                ;;
        esac
    fi
    
    hanako_speak "Detecté que usas $DETECTED_OS... ¡perfecto para mis travesuras! ♪" "excited"
}

# ═══════════════════════════════════════════════════════════════════════════════════════════════
# Funciones de instalación
# ═══════════════════════════════════════════════════════════════════════════════════════════════

check_and_install_nodejs() {
    if command -v node >/dev/null 2>&1; then
        local version=$(node -v 2>/dev/null)
        hanako_speak "Node.js ya está instalado ($version)... ¡qué eficiente! (◡‿◡)" "normal"
    else
        hanako_speak "Instalando Node.js... ¡espera mientras hago mi magia!" "pervert"
        if [ "$DETECTED_OS" = "termux" ]; then
            loading_animation "Instalando Node.js"
            $INSTALL_CMD nodejs >/dev/null 2>&1
        else
            loading_animation "Actualizando repositorios"
            apt update >/dev/null 2>&1
            loading_animation "Instalando Node.js"
            $INSTALL_CMD nodejs npm >/dev/null 2>&1
        fi
        
        if command -v node >/dev/null 2>&1; then
            hanako_speak "¡Node.js instalado correctamente! ♪" "excited"
        else
            hanako_speak "Error al instalar Node.js... ¡algo salió mal!" "warning"
            exit 1
        fi
    fi
}

check_and_install_git() {
    if command -v git >/dev/null 2>&1; then
        hanako_speak "Git ya está instalado... ¡excelente!" "normal"
    else
        hanako_speak "Instalando Git... ¡necesario para mis planes secretos! (｡◕‿◕｡)" "pervert"
        loading_animation "Instalando Git"
        $INSTALL_CMD git >/dev/null 2>&1
        
        if command -v git >/dev/null 2>&1; then
            hanako_speak "¡Git instalado exitosamente!" "excited"
        else
            hanako_speak "Error al instalar Git... ¡mou!" "warning"
            exit 1
        fi
    fi
}

clone_and_setup_bot() {
    if [ -d "MaycolPlus" ]; then
        hanako_speak "La carpeta MaycolPlus ya existe... ¡qué conveniente! (◕‿◕)" "normal"
        cd MaycolPlus
    else
        hanako_speak "Clonando MaycolPlus... ¡preparándome para la diversión! ♪" "pervert"
        loading_animation "Clonando repositorio"
        git clone https://github.com/SoySapo6/MaycolPlus.git >/dev/null 2>&1
        
        if [ -d "MaycolPlus" ]; then
            hanako_speak "¡Repositorio clonado con éxito!" "excited"
            cd MaycolPlus
        else
            hanako_speak "Error al clonar el repositorio... ¡algo falló!" "warning"
            exit 1
        fi
    fi
    
    hanako_speak "Instalando dependencias... ¡esto puede tardar un poquito! (◡‿◡)" "normal"
    loading_animation "Ejecutando npm install"
    npm install --force >/dev/null 2>&1
    
    if [ $? -eq 0 ]; then
        hanako_speak "¡Dependencias instaladas correctamente!" "excited"
    else
        hanako_speak "Hubo algunos problemas, pero continuemos..." "normal"
    fi
}

# ═══════════════════════════════════════════════════════════════════════════════════════════════
# Función principal
# ═══════════════════════════════════════════════════════════════════════════════════════════════

main() {
    print_ascii_maycolplus
    
    hanako_speak "¡Hola! Soy Hanako-kun y te ayudaré a instalar MaycolPlus... ufufu~" "pervert"
    sleep 2
    
    detect_os
    confirm_os
    sleep 1
    
    hanako_speak "Comenzando la instalación... ¡será divertido! (◕‿◕)" "excited"
    sleep 1
    
    check_and_install_nodejs
    sleep 1
    
    check_and_install_git
    sleep 1
    
    clone_and_setup_bot
    sleep 1
    
    cd ..
    
    echo
    echo -e "${GREEN}╔══════════════════════════════════════════════════════════════════════════╗${NC}"
    echo -e "${GREEN}║${WHITE}                        ¡INSTALACIÓN COMPLETADA!                          ${GREEN}║${NC}"
    echo -e "${GREEN}╚══════════════════════════════════════════════════════════════════════════╝${NC}"
    echo
    
    hanako_speak "¡Todo listo! Ahora ejecuta el comando que te daré... ♪" "excited"
    echo
    echo -e "${BOLD}${YELLOW}Para iniciar el bot ejecuta:${NC}"
    echo -e "${GREEN}┌─────────────────────────────────────────┐${NC}"
    echo -e "${GREEN}│${WHITE} cd MaycolPlus && npm start              ${GREEN}│${NC}"
    echo -e "${GREEN}└─────────────────────────────────────────┘${NC}"
    echo
    
    hanako_speak "¡Espero que disfrutes usando MaycolPlus! Nos vemos pronto... ufufu~ (◕‿◕)" "pervert"
    echo
    echo -e "${PURPLE}═══════════════════════════════════════════════════════════════════════════════${NC}"
}

main
