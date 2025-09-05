#!/bin/bash

# Colores
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
WHITE='\033[1;37m'
BLACK='\033[0;30m'
NC='\033[0m' # Sin color
RAINBOW='\033[38;5;196m\033[38;5;208m\033[38;5;226m\033[38;5;46m\033[38;5;21m\033[38;5;93m\033[38;5;201m'

# Funciones de utilidad
print_ascii() {
    clear
    echo -e "${WHITE}"
    echo "███╗   ███╗ █████╗ ██╗   ██╗ ██████╗ ██████╗ ██╗     ██████╗ ██╗     ██╗   ██╗███████╗"
    echo "████╗ ████║██╔══██╗╚██╗ ██╔╝██╔════╝██╔═══██╗██║     ██╔══██╗██║     ██║   ██║██╔════╝"
    echo "██╔████╔██║███████║ ╚████╔╝ ██║     ██║   ██║██║     ██████╔╝██║     ██║   ██║███████╗"
    echo "██║╚██╔╝██║██╔══██║  ╚██╔╝  ██║     ██║   ██║██║     ██╔═══╝ ██║     ██║   ██║╚════██║"
    echo "██║ ╚═╝ ██║██║  ██║   ██║   ╚██████╗╚██████╔╝███████╗██║     ███████╗╚██████╔╝███████║"
    echo "╚═╝     ╚═╝╚═╝  ╚═╝   ╚═╝    ╚═════╝ ╚═════╝ ╚══════╝╚═╝     ╚══════╝ ╚═════╝ ╚══════╝"
    echo -e "${NC}"
    echo ""
    echo -e "${RAINBOW}                    Hecho por SoyMaycol<3${NC}"
    echo ""
    echo -e "${PURPLE}═══════════════════════════════════════════════════════════════════════${NC}"
}

hanako_speak() {
    local message="$1"
    echo -e "${CYAN}👻 Hanako-kun:${NC} ${message}"
    sleep 1
}

hanako_pervert() {
    local responses=(
        "Jeje~ ¿Lista para instalar algo especial? 😏"
        "¡Oh! Vamos a instalar cosas juntos... qué emocionante~ 💕"
        "Espero que tengas suficiente espacio... para el bot, claro 😈"
        "Instalemos esto rápido antes de que alguien nos vea~ 🫣"
        "¿Confías en mí para tocar tu sistema? Jeje~ 👻"
    )
    local random_response=${responses[$RANDOM % ${#responses[@]}]}
    echo -e "${PURPLE}👻 Hanako-kun:${NC} ${random_response}"
    sleep 2
}

loading_animation() {
    local pid=$1
    local delay=0.1
    local spinstr='|/-\'
    while [ "$(ps a | awk '{print $1}' | grep $pid)" ]; do
        local temp=${spinstr#?}
        printf " [${CYAN}%c${NC}]  " "$spinstr"
        local spinstr=$temp${spinstr%"$temp"}
        sleep $delay
        printf "\b\b\b\b\b\b"
    done
    printf "    \b\b\b\b"
}

detect_os() {
    if [[ "$PREFIX" == *"com.termux"* ]]; then
        echo "termux"
    elif [[ -f /etc/debian_version ]]; then
        if grep -qi ubuntu /etc/os-release 2>/dev/null; then
            echo "ubuntu"
        else
            echo "debian"
        fi
    else
        echo "unknown"
    fi
}

check_command() {
    command -v "$1" >/dev/null 2>&1
}

install_dependencies() {
    local os="$1"
    
    hanako_speak "Mmm~ Vamos a revisar si tienes todo lo que necesitas..."
    
    case $os in
        "termux")
            PKG_CMD="pkg"
            if ! check_command node; then
                hanako_speak "¡Oh! Parece que no tienes Node.js... Déjame instalarlo para ti~ 💕"
                echo -e "${YELLOW}[INFO]${NC} Instalando Node.js..."
                $PKG_CMD update -y >/dev/null 2>&1 &
                loading_animation $!
                $PKG_CMD install nodejs -y >/dev/null 2>&1 &
                loading_animation $!
                echo -e "${GREEN}✓${NC} Node.js instalado"
            else
                hanako_speak "¡Perfecto! Ya tienes Node.js instalado~ ¿Eres un experto, eh? 😏"
            fi
            
            if ! check_command git; then
                hanako_speak "También necesitamos Git... ¡No te preocupes, yo me encargo! 👻"
                echo -e "${YELLOW}[INFO]${NC} Instalando Git..."
                $PKG_CMD install git -y >/dev/null 2>&1 &
                loading_animation $!
                echo -e "${GREEN}✓${NC} Git instalado"
            else
                hanako_speak "Git ya está aquí... ¡Qué preparado/a estás! 💖"
            fi
            ;;
            
        "ubuntu"|"debian")
            PKG_CMD="apt"
            if ! check_command node; then
                hanako_speak "Necesitamos Node.js... ¡Vamos a instalarlo juntos! 🥰"
                echo -e "${YELLOW}[INFO]${NC} Actualizando paquetes..."
                sudo $PKG_CMD update >/dev/null 2>&1 &
                loading_animation $!
                echo -e "${YELLOW}[INFO]${NC} Instalando Node.js..."
                sudo $PKG_CMD install nodejs npm -y >/dev/null 2>&1 &
                loading_animation $!
                echo -e "${GREEN}✓${NC} Node.js instalado"
            else
                hanako_speak "¡Node.js ya está aquí! Qué eficiente eres~ 😊"
            fi
            
            if ! check_command git; then
                hanako_speak "Git también es necesario... ¡Déjame instalarlo! 👻✨"
                echo -e "${YELLOW}[INFO]${NC} Instalando Git..."
                sudo $PKG_CMD install git -y >/dev/null 2>&1 &
                loading_animation $!
                echo -e "${GREEN}✓${NC} Git instalado"
            else
                hanako_speak "Git ya está listo... ¡Me gusta tu organización! 💕"
            fi
            ;;
    esac
}

clone_repository() {
    hanako_speak "Ahora viene lo divertido... ¡Vamos a descargar MaycolPlus! 😈"
    
    if [ -d "MaycolPlus" ]; then
        hanako_speak "¡Oh! Ya tienes la carpeta MaycolPlus... ¿Has estado jugando sin mí? 🤭"
        echo -e "${YELLOW}[INFO]${NC} La carpeta MaycolPlus ya existe, saltando clonado..."
    else
        hanako_speak "Preparándome para clonar el repositorio... ¡Esto será rápido! 💨"
        echo -e "${YELLOW}[INFO]${NC} Clonando repositorio..."
        git clone https://github.com/SoySapo6/MaycolPlus.git >/dev/null 2>&1 &
        loading_animation $!
        echo -e "${GREEN}✓${NC} Repositorio clonado exitosamente"
        hanako_speak "¡Listo! El repositorio está aquí... jeje~ 👻"
    fi
}

install_npm_packages() {
    hanako_speak "Ahora viene la parte... intensa~ Vamos a instalar las dependencias 😏💦"
    
    cd MaycolPlus || {
        hanako_speak "¡Oh no! No puedo entrar a la carpeta... ¿Qué pasó? 😰"
        exit 1
    }
    
    echo -e "${YELLOW}[INFO]${NC} Instalando dependencias de Node.js..."
    echo -e "${CYAN}👻 Hanako-kun:${NC} Esto puede tomar un tiempo... ¡Ten paciencia conmigo! 💕"
    
    npm install --force >/dev/null 2>&1 &
    loading_animation $!
    
    echo -e "${GREEN}✓${NC} Dependencias instaladas"
    cd ..
    hanako_speak "¡Terminé! Eso fue... bastante satisfactorio~ 😌✨"
}

final_instructions() {
    echo ""
    echo -e "${PURPLE}═══════════════════════════════════════════════════════════════════════${NC}"
    hanako_speak "¡Todo está listo! Ahora puedes ejecutar tu bot~ 🎉"
    echo ""
    echo -e "${WHITE}Para iniciar MaycolPlus, ejecuta:${NC}"
    echo -e "${GREEN}cd MaycolPlus && npm start${NC}"
    echo ""
    hanako_speak "¡Diviértete con tu bot! Y recuerda... siempre estaré aquí si me necesitas~ 👻💖"
    echo -e "${RAINBOW}¡Gracias por usar el instalador de MaycolPlus!${NC}"
    echo -e "${PURPLE}═══════════════════════════════════════════════════════════════════════${NC}"
}

# Programa principal
print_ascii

hanako_speak "¡Hola~! Soy Hanako-kun y voy a ayudarte a instalar MaycolPlus 👻💕"
hanako_pervert

echo -e "${YELLOW}Sistemas operativos soportados:${NC}"
echo "1) Termux"
echo "2) Ubuntu" 
echo "3) Debian"
echo ""

# Detectar sistema operativo automáticamente
detected_os=$(detect_os)
case $detected_os in
    "termux")
        echo -e "${GREEN}✓${NC} Sistema detectado: Termux"
        selected_os="termux"
        ;;
    "ubuntu")
        echo -e "${GREEN}✓${NC} Sistema detectado: Ubuntu"
        selected_os="ubuntu"
        ;;
    "debian")
        echo -e "${GREEN}✓${NC} Sistema detectado: Debian"
        selected_os="debian"
        ;;
    *)
        hanako_speak "¡Oh no! No puedo detectar tu sistema operativo... 😰"
        echo -e "${RED}[ERROR]${NC} Sistema operativo no soportado"
        echo "Este instalador solo funciona en Termux, Ubuntu y Debian"
        exit 1
        ;;
esac

echo ""
hanako_speak "¿Quieres continuar con la instalación en $selected_os? 😏"
read -p "Presiona Enter para continuar o Ctrl+C para cancelar..."

echo ""
hanako_speak "¡Perfecto! Empecemos con la diversión~ 💕"

# Ejecutar instalación
install_dependencies "$selected_os"
echo ""
clone_repository  
echo ""
install_npm_packages
echo ""
final_instructions
