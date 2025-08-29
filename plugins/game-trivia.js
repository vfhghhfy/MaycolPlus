//--> Mejorado por Ado-rgb (github.com/Ado-rgb)
// •|• No quites créditos..

const questions = [
    {
        question: "¿Quién fue el padre de Melquisedec?",
        options: ["Abraham", "Noé", "Ninguno, Melquisedec no tenía padre"],
        answer: "C"
    },
    {
        question: "¿Cuál es el nombre del rey que pidió que se escribieran los Salmos?",
        options: ["David", "Salomón", "Ezequías"],
        answer: "A"
    },
    {
        question: "¿En qué libro de la Biblia se describe la creación del mundo?",
        options: ["Éxodo", "Génesis", "Levítico"],
        answer: "B"
    },
    {
        question: "¿Qué profeta desafió a los profetas de Baal en el monte Carmelo?",
        options: ["Isaías", "Elías", "Jeremías"],
        answer: "B"
    },
    {
        question: "¿Quién fue el último juez de Israel antes de que se estableciera la monarquía?",
        options: ["Samuel", "Débora", "Sansón"],
        answer: "A"
    },
    {
        question: "¿Qué rey ordenó la construcción del Templo de Jerusalén?",
        options: ["David", "Salomón", "Josías"],
        answer: "B"
    },
    {
        question: "¿En qué libro se menciona la visión del valle de los huesos secos?",
        options: ["Isaías", "Ezequiel", "Jeremías"],
        answer: "B"
    },
    {
        question: "¿Cómo se llama la madre de Samuel?",
        options: ["Ana", "Elcana", "Raquel"],
        answer: "A"
    },
    {
        question: "¿Qué apóstol negó conocer a Jesús tres veces antes del canto del gallo?",
        options: ["Pedro", "Juan", "Santiago"],
        answer: "A"
    },
    {
        question: "¿Quién fue el primer mártir cristiano?",
        options: ["Pedro", "Esteban", "Pablo"],
        answer: "B"
    },
    {
        question: "¿Cuántos libros componen el Antiguo Testamento?",
        options: ["39", "27", "66"],
        answer: "A"
    },
    {
        question: "¿Cuál es el último libro del Antiguo Testamento?",
        options: ["Malaquías", "Zacarías", "Isaías"],
        answer: "A"
    },
    {
        question: "¿Qué profeta fue tragado por un gran pez?",
        options: ["Isaías", "Jonás", "Elías"],
        answer: "B"
    },
    {
        question: "¿Quién fue el último rey de Judá antes de la caída de Jerusalén?",
        options: ["Zedequías", "Manasés", "Joaquín"],
        answer: "A"
    },
    {
        question: "¿Qué rey hizo que se fundieran los ídolos de oro durante el Éxodo?",
        options: ["David", "Salomón", "Aarón"],
        answer: "C"
    },
    {
        question: "¿Qué discípulo fue conocido como el 'discípulo amado'?",
        options: ["Pedro", "Juan", "Santiago"],
        answer: "B"
    },
    {
        question: "¿Qué mujer fue la madre de Samuel?",
        options: ["Ana", "Elcana", "Raquel"],
        answer: "A"
    },
    {
        question: "¿Qué libro de la Biblia contiene los Diez Mandamientos?",
        options: ["Éxodo", "Levítico", "Deuteronomio"],
        answer: "A"
    },
    {
        question: "¿Cuál es el nombre del profeta que desafió al rey Acab?",
        options: ["Isaías", "Elías", "Ezequiel"],
        answer: "B"
    },
    {
        question: "¿Qué apóstol fue conocido como el 'Doble de corazón'?",
        options: ["Tomás", "Mateo", "Andrés"],
        answer: "A"
    },
    {
        question: "¿Quién fue el rey de Israel que escribió muchos de los Proverbios?",
        options: ["David", "Salomón", "Ezequías"],
        answer: "B"
    },
    {
        question: "¿Qué rey tuvo una visión de una estatua con una cabeza de oro?",
        options: ["Nabucodonosor", "Ciro", "Darius"],
        answer: "A"
    },
    {
        question: "¿Cuál fue el nombre del líder de los israelitas que dividió el Mar Rojo?",
        options: ["Moisés", "Josué", "Abraham"],
        answer: "A"
    },
    {
        question: "¿Quién fue el profeta que confrontó a la reina Jezabel?",
        options: ["Elías", "Isaías", "Ezequiel"],
        answer: "A"
    },
    {
        question: "¿Cuál es el primer libro del Nuevo Testamento?",
        options: ["Mateo", "Marcos", "Lucas"],
        answer: "A"
    },
    {
        question: "¿Qué persona fue resucitada por Elías?",
        options: ["El hijo de la viuda de Sarepta", "El hijo de la viuda de Naín", "Lázaro"],
        answer: "A"
    },
    {
        question: "¿Qué profeta vivió en el vientre de un pez por tres días?",
        options: ["Jonás", "Elías", "Isaías"],
        answer: "A"
    },
    {
        question: "¿Quién fue el primer rey de Israel?",
        options: ["David", "Saúl", "Salomón"],
        answer: "B"
    },
    {
        question: "¿Qué apóstol escribió el libro de Apocalipsis?",
        options: ["Pedro", "Juan", "Santiago"],
        answer: "B"
    },
    {
        question: "¿En qué libro se encuentra la historia de la Torre de Babel?",
        options: ["Génesis", "Éxodo", "Levítico"],
        answer: "A"
    },
    {
        question: "¿Cuál es el nombre del árbol del que comió Eva?",
        options: ["El árbol de la vida", "El árbol del conocimiento del bien y del mal", "El árbol de la sabiduría"],
        answer: "B"
    },
    {
        question: "¿Quién fue el profeta que predijo la caída de Nínive?",
        options: ["Amós", "Jonás", "Isaías"],
        answer: "B"
    },
    {
        question: "¿Quién desarrolló la teoría de la relatividad?",
        options: ["Isaac Newton", "Nikola Tesla", "Albert Einstein"],
        answer: "C"
    },
    {
        "question": "¿Qué molécula lleva la información genética?",
        "options": ["ADN", "ARN", "Proteínas"],
        "answer": "A"
    },
    {
        "question": "¿Qué planeta es conocido como el 'Planeta Rojo'?",
        "options": ["Júpiter", "Marte", "Saturno"],
        "answer": "B"
    },
    {
        "question": "¿Qué científico descubrió la ley de la gravedad?",
        "options": ["Isaac Newton", "Albert Einstein", "Galileo Galilei"],
        "answer": "A"
    },
    {
        "question": "¿Qué es el bosón de Higgs?",
        "options": ["Una partícula subatómica", "Una ley física", "Un tipo de energía"],
        "answer": "A"
    },
    {
        "question": "¿Qué elemento químico tiene el símbolo 'O' en la tabla periódica?",
        "options": ["Oxígeno", "Osmio", "Oro"],
        "answer": "A"
    },
    {
        "question": "¿Quién formuló la teoría de la evolución por selección natural?",
        "options": ["Charles Darwin", "Jean-Baptiste Lamarck", "Gregor Mendel"],
        "answer": "A"
    },
    {
        "question": "¿Qué fenómeno explica la expansión del universo?",
        "options": ["Teoría de la relatividad", "Teoría del Big Bang", "Teoría cuántica"],
        "answer": "B"
    },
    {
        "question": "¿Qué tipo de célula es responsable de la fotosíntesis en las plantas?",
        "options": ["Células epiteliales", "Células musculares", "Células vegetales"],
        "answer": "C"
    },
    {
        "question": "¿Cuál es la unidad básica de la vida?",
        "options": ["El átomo", "La célula", "El órgano"],
        "answer": "B"
    },
    {
        "question": "¿Qué gas es más abundante en la atmósfera terrestre?",
        "options": ["Oxígeno", "Nitrógeno", "Dióxido de carbono"],
        "answer": "B"
    },
    {
        "question": "¿En qué parte de la célula se lleva a cabo la respiración celular?",
        "options": ["El núcleo", "Las mitocondrias", "El citoplasma"],
        "answer": "B"
    },
    {
        "question": "¿Cómo se llama el proceso por el cual las plantas convierten la luz solar en energía?",
        "options": ["Fermentación", "Respiración", "Fotosíntesis"],
        "answer": "C"
    },
    {
        "question": "¿Qué modelo astronómico describe a la Tierra como el centro del universo?",
        "options": ["Modelo heliocéntrico", "Modelo geocéntrico", "Modelo de la relatividad"],
        "answer": "B"
    },
    {
        "question": "¿Qué es la teoría de cuerdas?",
        "options": ["Una teoría sobre el origen del universo", "Una teoría sobre las partículas subatómicas", "Una teoría sobre la gravedad"],
        "answer": "B"
    },
    {
        "question": "¿Qué planeta tiene los anillos más conocidos?",
        "options": ["Júpiter", "Saturno", "Urano"],
        "answer": "B"
    },
    {
        "question": "¿Quién descubrió la estructura del ADN?",
        "options": ["James Watson y Francis Crick", "Louis Pasteur", "Marie Curie"],
        "answer": "A"
    },
    {
        "question": "¿Qué es la teoría de la relatividad general?",
        "options": ["Una teoría de la gravedad", "Una teoría del origen del universo", "Una teoría sobre las partículas subatómicas"],
        "answer": "A"
    },
    {
        "question": "¿Qué es un agujero negro?",
        "options": ["Un fenómeno que absorbe todo a su alrededor", "Una estrella moribunda", "Una nube de gas y polvo"],
        "answer": "A"
    },
    {
        "question": "¿En qué parte del átomo se encuentran los protones y neutrones?",
        "options": ["En la corteza", "En el núcleo", "En los electrones"],
        "answer": "B"
    },
    {
        "question": "¿Qué científico descubrió la penicilina?",
        "options": ["Alexander Fleming", "Louis Pasteur", "Marie Curie"],
        "answer": "A"
    },
    {
        "question": "¿Cómo se llama el proceso que transforma el agua en vapor?",
        "options": ["Condensación", "Evaporación", "Fusión"],
        "answer": "B"
    },
    {
        "question": "¿Qué es un quark?",
        "options": ["Una partícula subatómica", "Una teoría sobre el origen del universo", "Un tipo de energía"],
        "answer": "A"
    },
    {
        "question": "¿Cuál es el principal componente de las estrellas?",
        "options": ["Hidrógeno", "Oxígeno", "Helio"],
        "answer": "A"
    },
    {
        "question": "¿Qué es el bosón de Higgs también conocido como 'la partícula de Dios'?",
        "options": ["Una partícula subatómica", "Un tipo de energía", "Una ley física"],
        "answer": "A"
    },
    {
        "question": "¿Qué es la antimateria?",
        "options": ["Materia que tiene propiedades opuestas a las partículas comunes", "Un tipo de materia desconocida", "Energía que se utiliza en la física cuántica"],
        "answer": "A"
    },
    {
        "question": "¿Qué significa el término 'fisión nuclear'?",
        "options": ["La división de un átomo en partículas más pequeñas", "La fusión de dos átomos en uno", "La liberación de energía de los átomos"],
        "answer": "A"
    },
    {
        "question": "¿Qué es un solsticio?",
        "options": ["El momento en que el Sol está más cerca de la Tierra", "El momento en que la Tierra está más alejada del Sol", "El momento en que la inclinación del eje de la Tierra es máxima"],
        "answer": "C"
    },
    {
        "question": "¿Qué es la ley de la conservación de la masa?",
        "options": ["La masa total en un sistema cerrado permanece constante", "La masa total de un objeto siempre aumenta", "La masa siempre disminuye durante una reacción química"],
        "answer": "A"
    },
    {
        "question": "¿Qué elemento es conocido como el 'gas noble' por su estabilidad?",
        "options": ["Helio", "Neón", "Xenón"],
        "answer": "A"
    },
    {
        "question": "¿Cuál es el principio que sostiene que los átomos no pueden ser creados ni destruidos?",
        "options": ["Ley de la conservación de la masa", "Ley de la gravedad", "Teoría de la relatividad"],
        "answer": "A"
    },
    {
        "question": "¿Quién fue el emperador romano que dividió el Imperio Romano en dos partes?",
        "options": ["Constantino I", "Diocleciano", "Teodosio I"],
        "answer": "B"
    },
    {
        "question": "¿Qué civilización desarrolló el calendario maya?",
        "options": ["Azteca", "Inca", "Maya"],
        "answer": "C"
    },
    {
        "question": "¿Cuál es el nombre de la primera mujer que ganó un Premio Nobel?",
        "options": ["Marie Curie", "Dorothy Hodgkin", "Rosalind Franklin"],
        "answer": "A"
    },
    {
        "question": "¿Qué obra filosófica fue escrita por Immanuel Kant?",
        "options": ["Crítica de la razón pura", "Así habló Zaratustra", "El contrato social"],
        "answer": "A"
    },
    {
        "question": "¿Qué rey francés fue conocido como 'El Sol'?",
        "options": ["Luis XIV", "Luis XVI", "Carlos I"],
        "answer": "A"
    },
    {
        "question": "¿Qué matemático griego es conocido por su teorema sobre los triángulos rectángulos?",
        "options": ["Pitágoras", "Euclides", "Arquímedes"],
        "answer": "A"
    },
    {
        "question": "¿Quién fue el autor de la famosa obra 'La República'?",
        "options": ["Platón", "Aristóteles", "Sócrates"],
        "answer": "A"
    },
    {
        "question": "¿En qué batalla se produjo la derrota de Napoleón Bonaparte en 1815?",
        "options": ["Batalla de Leipzig", "Batalla de Waterloo", "Batalla de Austerlitz"],
        "answer": "B"
    },
    {
        "question": "¿Qué escritor británico es conocido por su obra '1984'?",
        "options": ["Aldous Huxley", "George Orwell", "William Blake"],
        "answer": "B"
    },
    {
        "question": "¿Qué científico es conocido por su teoría sobre los agujeros negros?",
        "options": ["Albert Einstein", "Stephen Hawking", "Isaac Newton"],
        "answer": "B"
    },
    {
        "question": "¿En qué guerra se enfrentaron los Estados Unidos y Vietnam?",
        "options": ["Guerra de Vietnam", "Guerra Fría", "Guerra de Corea"],
        "answer": "A"
    },
    {
        "question": "¿Qué elemento químico tiene el símbolo 'W' en la tabla periódica?",
        "options": ["Tungsteno", "Wolframio", "Wolfram"],
        "answer": "A"
    },
    {
        "question": "¿Qué filósofo griego fundó la escuela de filosofía llamada 'Academia'?",
        "options": ["Platón", "Aristóteles", "Sócrates"],
        "answer": "A"
    },
    {
        "question": "¿Cuál es la obra más famosa de Miguel de Cervantes?",
        "options": ["Don Quijote de la Mancha", "La Galatea", "Los trabajos de Persiles y Sigismunda"],
        "answer": "A"
    },
    {
        "question": "¿Qué civilización antigua construyó las pirámides de Giza?",
        "options": ["Griega", "Egipcia", "Romana"],
        "answer": "B"
    },
    {
        "question": "¿Quién fue el primer ser humano en viajar al espacio?",
        "options": ["Yuri Gagarin", "Alan Shepard", "John Glenn"],
        "answer": "A"
    },
    {
        "question": "¿En qué año ocurrió la caída del Muro de Berlín?",
        "options": ["1987", "1989", "1991"],
        "answer": "B"
    },
    {
        "question": "¿Qué escritor estadounidense es conocido por su obra 'Matar a un ruiseñor'?",
        "options": ["Harper Lee", "J.K. Rowling", "F. Scott Fitzgerald"],
        "answer": "A"
    },
    {
        "question": "¿Qué antiguo imperio abarcó gran parte del Medio Oriente, Asia Central y partes de Europa?",
        "options": ["Imperio Mongol", "Imperio Persa", "Imperio Otomano"],
        "answer": "A"
    },
    {
        "question": "¿Qué científico es conocido por sus leyes del movimiento planetario?",
        "options": ["Johannes Kepler", "Galileo Galilei", "Isaac Newton"],
        "answer": "A"
    },
    {
        "question": "¿Qué antigua ciudad fue conocida como la 'Ciudad de los Césares'?",
        "options": ["Roma", "Atenas", "Constantinopla"],
        "answer": "C"
    },
    {
        "question": "¿Cuál es el color del sol?",
        "options": ["Amarillo", "Verde", "Rojo"],
        "answer": "A"
    },
    {
        "question": "¿En qué continente se encuentra Brasil?",
        "options": ["Asia", "Europa", "América"],
        "answer": "C"
    },
    {
        "question": "¿Quién pintó la Mona Lisa?",
        "options": ["Vincent van Gogh", "Pablo Picasso", "Leonardo da Vinci"],
        "answer": "C"
    },
    {
        "question": "¿Cuántos días tiene un año?",
        "options": ["365", "366", "364"],
        "answer": "A"
    },
    {
        "question": "¿Cuál es el animal más grande del mundo?",
        "options": ["Elefante", "Ballena azul", "Rinoceronte"],
        "answer": "B"
    },
    {
        "question": "¿Qué deporte se juega con una pelota redonda?",
        "options": ["Béisbol", "Fútbol", "Tenis"],
        "answer": "B"
    },
    {
        "question": "¿Quién es el actual presidente de los Estados Unidos? (2023)",
        "options": ["Donald Trump", "Joe Biden", "Barack Obama"],
        "answer": "B"
    },
    {
        "question": "¿En qué mes se celebra el Día de la Madre en la mayoría de los países?",
        "options": ["Mayo", "Abril", "Junio"],
        "answer": "A"
    },
    {
        "question": "¿Cómo se llama el personaje principal de la película 'Frozen'?",
        "options": ["Elsa", "Anna", "Rapunzel"],
        "answer": "A"
    },
    {
        "question": "¿Cuál es el idioma oficial de Brasil?",
        "options": ["Español", "Portugués", "Inglés"],
        "answer": "B"
    },
    {
        "question": "¿Cuál es la capital de Francia?",
        "options": ["Londres", "Roma", "París"],
        "answer": "C"
    },
    {
        "question": "¿Cuántos continentes hay en el mundo?",
        "options": ["5", "6", "7"],
        "answer": "C"
    },
    {
        "question": "¿Cuál es el nombre del primer planeta del sistema solar?",
        "options": ["Venus", "Mercurio", "Marte"],
        "answer": "B"
    },
    {
        "question": "¿En qué ciudad se encuentra la Torre Eiffel?",
        "options": ["Roma", "París", "Londres"],
        "answer": "B"
    },
    {
        "question": "¿Qué animal es conocido por su lentitud y su caparazón?",
        "options": ["Conejo", "Tortuga", "Perro"],
        "answer": "B"
    },
    {
        "question": "¿En qué año comenzó la Primera Guerra Mundial?",
        "options": ["1912", "1914", "1916"],
        "answer": "B"
    },
    {
        "question": "¿Cuál es la capital de Australia?",
        "options": ["Sídney", "Melbourne", "Canberra"],
        "answer": "C"
    },
    {
        "question": "¿Qué autor escribió la novela 'Matar a un ruiseñor'?",
        "options": ["Harper Lee", "J.K. Rowling", "F. Scott Fitzgerald"],
        "answer": "A"
    },
    {
        "question": "¿Cuál es el animal terrestre más grande?",
        "options": ["Elefante africano", "Rinoceronte blanco", "Oso polar"],
        "answer": "A"
    },
    {
        "question": "¿En qué continente se encuentra el desierto del Sahara?",
        "options": ["Asia", "África", "América"],
        "answer": "B"
    },
    {
        "question": "¿Quién pintó la famosa obra 'La noche estrellada'?",
        "options": ["Pablo Picasso", "Vincent van Gogh", "Claude Monet"],
        "answer": "B"
    },
    {
        "question": "¿Qué nombre recibe el aparato que mide la temperatura?",
        "options": ["Termómetro", "Barómetro", "Higrómetro"],
        "answer": "A"
    },
    {
        "question": "¿Qué país tiene la mayor población del mundo?",
        "options": ["India", "China", "Estados Unidos"],
        "answer": "B"
    },
    {
        "question": "¿Quién fue el primer hombre en caminar sobre la Luna?",
        "options": ["Yuri Gagarin", "Neil Armstrong", "Buzz Aldrin"],
        "answer": "B"
    },
    {
        "question": "¿Cuál es el río más largo del mundo?",
        "options": ["Nilo", "Amazonas", "Yangtsé"],
        "answer": "A"
    },
    {
        "question": "¿En qué año terminó la Segunda Guerra Mundial?",
        "options": ["1945", "1950", "1960"],
        "answer": "A"
    },
    {
        "question": "¿Quién es el creador de la teoría de la evolución?",
        "options": ["Albert Einstein", "Isaac Newton", "Charles Darwin"],
        "answer": "C"
    },
    {
        "question": "¿Cómo se llama el continente que está completamente cubierto por hielo?",
        "options": ["Antártida", "Asia", "África"],
        "answer": "A"
    },
    {
        "question": "¿Cuál es el símbolo químico del oro?",
        "options": ["Ag", "Au", "O"],
        "answer": "B"
    },
    {
        "question": "¿Qué significa la sigla 'ONU'?",
        "options": ["Organización Nacional Unida", "Organización de Naciones Unidas", "Organización para la Unidad de Naciones"],
        "answer": "B"
    },
    {
        "question": "¿Cuál es la capital de España?",
        "options": ["Barcelona", "Madrid", "Sevilla"],
        "answer": "B"
    },
    {
        "question": "¿Qué deporte se juega con una pelota y un aro en una cancha?",
        "options": ["Fútbol", "Baloncesto", "Béisbol"],
        "answer": "B"
    },
    {
        "question": "¿En qué continente se encuentra el país de Egipto?",
        "options": ["Asia", "Europa", "África"],
        "answer": "C"
    },
    {
        "question": "¿Quién fue el primer presidente de México?",
        "options": ["Benito Juárez", "Porfirio Díaz", "Agustín de Iturbide"],
        "answer": "C"
    },
    {
        "question": "¿Qué gas constituye la mayor parte de la atmósfera terrestre?",
        "options": ["Oxígeno", "Nitrógeno", "Dióxido de carbono"],
        "answer": "B"
    },
    {
        "question": "¿Qué país inventó la pizza?",
        "options": ["Italia", "Francia", "España"],
        "answer": "A"
    },
    {
        "question": "¿En qué año se firmó la Constitución de los Estados Unidos?",
        "options": ["1776", "1787", "1791"],
        "answer": "B"
    },
    {
        "question": "¿Quién es el dios del trueno en la mitología nórdica?",
        "options": ["Hércules", "Thor", "Zeus"],
        "answer": "B"
    },
    {
        "question": "¿Quién pintó el famoso mural 'La creación de Adán'?",
        "options": ["Leonardo da Vinci", "Michelangelo", "Rafael"],
        "answer": "B"
    },
    {
        "question": "¿Cuál es el continente más grande del planeta?",
        "options": ["África", "Asia", "América"],
        "answer": "B"
    },
    {
        "question": "¿Qué país es famoso por la torre Eiffel?",
        "options": ["Italia", "Francia", "Reino Unido"],
        "answer": "B"
    },
    {
        "question": "¿Cuál es la moneda de Japón?",
        "options": ["Yuan", "Yen", "Won"],
        "answer": "B"
    },
    {
        "question": "¿Qué ciudad fue la sede de los Juegos Olímpicos en 2008?",
        "options": ["Londres", "Pekín", "Sydney"],
        "answer": "B"
    },
    {
        "question": "¿Qué nombre recibe el proceso por el cual las plantas producen su alimento?",
        "options": ["Fotosíntesis", "Respiración", "Transpiración"],
        "answer": "A"
    },
    {
        "question": "¿Quién fue el último emperador romano de Occidente?",
        "options": ["Rómulo Augústulo", "Constantino", "Teodosio"],
        "answer": "A"
    },
    {
        "question": "¿Qué científico formuló las leyes del movimiento planetario?",
        "options": ["Johannes Kepler", "Galileo Galilei", "Isaac Newton"],
        "answer": "A"
    },
    {
        "question": "¿En qué batalla se derrotó a Napoleón Bonaparte en 1815?",
        "options": ["Batalla de Leipzig", "Batalla de Waterloo", "Batalla de Austerlitz"],
        "answer": "B"
    },
    {
        "question": "¿Qué escritor británico es conocido por su obra '1984'?",
        "options": ["George Orwell", "Aldous Huxley", "H.G. Wells"],
        "answer": "A"
    },
    {
        "question": "¿Cuál es el país más pequeño del mundo?",
        "options": ["Mónaco", "Ciudad del Vaticano", "San Marino"],
        "answer": "B"
    },
    {
        "question": "¿Qué inventor es conocido por crear la bombilla eléctrica?",
        "options": ["Nikola Tesla", "Thomas Edison", "Alexander Graham Bell"],
        "answer": "B"
    },
    {
        "question": "¿En qué año fue fundada la ciudad de Roma?",
        "options": ["753 a.C.", "509 a.C.", "300 a.C."],
        "answer": "A"
    },
    {
        "question": "¿Qué filósofo griego fundó la escuela de filosofía llamada 'Academia'?",
        "options": ["Aristóteles", "Platón", "Sócrates"],
        "answer": "B"
    },
    {
        "question": "¿Qué guerra tuvo lugar entre 1950 y 1953 en la península de Corea?",
        "options": ["Guerra Fría", "Guerra de Vietnam", "Guerra de Corea"],
        "answer": "C"
    },
    {
        "question": "¿Quién fue el primer hombre en realizar un paseo espacial?",
        "options": ["Neil Armstrong", "Yuri Gagarin", "Alexei Leonov"],
        "answer": "C"
    },
    {
        "question": "¿Cuál es el único continente que no tiene reptiles nativos?",
        "options": ["Asia", "Antártida", "Europa"],
        "answer": "B"
    },
    {
        "question": "¿Qué escritor ruso es conocido por sus obras 'Los hermanos Karamazov' y 'Crimen y castigo'?",
        "options": ["Antón Chéjov", "León Tolstói", "Fiódor Dostoievski"],
        "answer": "C"
    },
    {
        "question": "¿Quién fue el primer presidente de los Estados Unidos?",
        "options": ["Abraham Lincoln", "Thomas Jefferson", "George Washington"],
        "answer": "C"
    },
    {
        "question": "¿Qué filósofo fue el maestro de Alejandro Magno?",
        "options": ["Aristóteles", "Platón", "Sócrates"],
        "answer": "A"
    },
    {
        "question": "¿Qué país es conocido como la 'Tierra de los Incas'?",
        "options": ["Colombia", "Argentina", "Perú"],
        "answer": "C"
    },
    {
        "question": "¿Cuál es la fórmula química del ácido sulfúrico?",
        "options": ["HCl", "H2SO4", "NaOH"],
        "answer": "B"
    },
    {
        "question": "¿En qué continente se encuentra el Desierto de Atacama?",
        "options": ["África", "América del Sur", "Asia"],
        "answer": "B"
    },
    {
        "question": "¿Cuál es el tercer planeta más cercano al Sol?",
        "options": ["Venus", "Tierra", "Marte"],
        "answer": "B"
    },
    {
        "question": "¿En qué país nació el escritor Franz Kafka?",
        "options": ["Austria", "República Checa", "Polonia"],
        "answer": "B"
    },
    {
        "question": "¿Qué científico desarrolló la teoría de la relatividad?",
        "options": ["Niels Bohr", "Albert Einstein", "Marie Curie"],
        "answer": "B"
    },
    {
        "question": "¿Qué imperio histórico abarcó gran parte del Medio Oriente, Asia Central y partes de Europa?",
        "options": ["Imperio Otomano", "Imperio Persa", "Imperio Mongol"],
        "answer": "C"
    },
    {
        "question": "¿Cuál es el único metal que es líquido a temperatura ambiente?",
        "options": ["Mercurio", "Plomo", "Cobre"],
        "answer": "A"
    },
    {
        "question": "¿Cuál es la capital de Mongolia?",
        "options": ["Bishkek", "Ulaanbaatar", "Astana"],
        "answer": "B"
    },
    {
        "question": "¿Quién fue el líder de la Revolución Mexicana?",
        "options": ["Pancho Villa", "Emiliano Zapata", "Francisco I. Madero"],
        "answer": "C"
    },
    {
        "question": "¿En qué año se firmó la Declaración de Independencia de los Estados Unidos?",
        "options": ["1776", "1783", "1791"],
        "answer": "A"
    },
    {
        "question": "¿Qué ciudad fue la sede de los primeros Juegos Olímpicos modernos en 1896?",
        "options": ["Londres", "París", "Atenas"],
        "answer": "C"
    },
    {
        "question": "¿Cuál es la lengua oficial de Irán?",
        "options": ["Árabe", "Persa", "Turco"],
        "answer": "B"
    },
    {
        "question": "¿Cuál es el río más largo del mundo?",
        "options": ["Amazonas", "Nilo", "Yangtsé"],
        "answer": "A"
    },
    {
        "question": "¿Quién pintó la Mona Lisa?",
        "options": ["Vincent van Gogh", "Pablo Picasso", "Leonardo da Vinci"],
        "answer": "C"
    },
    {
        "question": "¿Cuántos planetas hay en el sistema solar?",
        "options": ["7", "8", "9"],
        "answer": "B"
    },
    {
        "question": "¿Quién escribió 'Crimen y castigo'?",
        "options": ["Fiódor Dostoievski", "León Tolstói", "Franz Kafka"],
        "answer": "A"
    },
    {
        "question": "¿Cuál es el elemento químico con el número atómico 92?",
        "options": ["Plutonio", "Uranio", "Neptunio"],
        "answer": "B"
    },
    {
        "question": "¿En qué año cayó Constantinopla a manos del Imperio Otomano?",
        "options": ["1453", "1492", "1517"],
        "answer": "A"
    },
    {
        "question": "¿Qué país tiene la mayor cantidad de husos horarios?",
        "options": ["Rusia", "Francia", "Estados Unidos"],
        "answer": "B"
    },
    {
        "question": "¿Cuál es el idioma oficial de Mozambique?",
        "options": ["Portugués", "Suajili", "Francés"],
        "answer": "A"
    },
    {
        "question": "¿Cuál es la estrella más cercana a la Tierra después del Sol?",
        "options": ["Alfa Centauri", "Proxima Centauri", "Sirio"],
        "answer": "B"
    },
    {
        "question": "¿Qué matemático formuló el último teorema que permaneció sin probar durante 358 años?",
        "options": ["Pierre de Fermat", "Leonhard Euler", "Carl Friedrich Gauss"],
        "answer": "A"
    },
    {
        "question": "¿Cuál es la capital de Bután?",
        "options": ["Katmandú", "Thimphu", "Daca"],
        "answer": "B"
    },
    {
        "question": "¿Qué físico desarrolló la ecuación de Schrödinger?",
        "options": ["Werner Heisenberg", "Erwin Schrödinger", "Paul Dirac"],
        "answer": "B"
    },
    {
        "question": "¿Quién compuso la ópera 'El barbero de Sevilla'?",
        "options": ["Wolfgang Amadeus Mozart", "Gioachino Rossini", "Ludwig van Beethoven"],
        "answer": "B"
    },
    {
        "question": "¿En qué país se encuentra la estructura megalítica de Göbekli Tepe?",
        "options": ["Irak", "Turquía", "Irán"],
        "answer": "B"
    },
    {
        "question": "¿Qué filósofo es conocido por la frase 'Pienso, luego existo'?",
        "options": ["Immanuel Kant", "René Descartes", "Sócrates"],
        "answer": "B"
    },
    {
        "question": "¿En qué año se descubrió la estructura del ADN?",
        "options": ["1943", "1953", "1963"],
        "answer": "B"
    },
    {
        "question": "¿Quién es considerado el fundador del cálculo diferencial e integral?",
        "options": ["Isaac Newton", "Gottfried Wilhelm Leibniz", "Blaise Pascal"],
        "answer": "B"
    },
    {
        "question": "¿Qué ciudad fue capital de Japón antes de Tokio?",
        "options": ["Kioto", "Osaka", "Nagasaki"],
        "answer": "A"
    },
    {
        "question": "¿En qué siglo tuvo lugar la Guerra de los Treinta Años?",
        "options": ["Siglo XVI", "Siglo XVII", "Siglo XVIII"],
        "answer": "B"
    },
    {
        "question": "¿Cuál de estos países nunca ha sido colonizado?",
        "options": ["Etiopía", "Tailandia", "Afganistán"],
        "answer": "B"
    },
    {
        "question": "¿Quién descubrió la penicilina?",
        "options": ["Alexander Fleming", "Louis Pasteur", "Robert Koch"],
        "answer": "A"
    },
    {
        "question": "¿Qué emperador romano ordenó la construcción del Muro de Adriano?",
        "options": ["Nerón", "Trajano", "Adriano"],
        "answer": "C"
    },
    {
        "question": "¿Cuál es el metal más abundante en la corteza terrestre?",
        "options": ["Hierro", "Aluminio", "Cobre"],
        "answer": "B"
    },
    {
        "question": "¿Quién pintó la 'Mona Lisa'?",
        "options": ["Vincent van Gogh", "Pablo Picasso", "Leonardo da Vinci"],
        "answer": "C"
    },
    {
        "question": "¿En qué continente se encuentra el país de Brasil?",
        "options": ["Asia", "Europa", "América del Sur"],
        "answer": "C"
    },
    {
        "question": "¿Cuántos días tiene un año bisiesto?",
        "options": ["365", "366", "364"],
        "answer": "B"
    },
    {
        "question": "¿Cuál es el animal más grande del mundo?",
        "options": ["Elefante africano", "Ballena azul", "Jirafa"],
        "answer": "B"
    },
    {
        "question": "¿Qué deporte se juega con una pelota redonda y dos equipos de 11 jugadores?",
        "options": ["Béisbol", "Fútbol", "Baloncesto"],
        "answer": "B"
    },
    {
        "question": "¿Cuál es el idioma oficial de España?",
        "options": ["Portugués", "Español", "Francés"],
        "answer": "B"
    },
    {
        "question": "¿Qué es el oxígeno en la tabla periódica?",
        "options": ["O", "Ox", "Oxi"],
        "answer": "A"
    },
    {
        "question": "¿Cuántos continentes hay en el mundo?",
        "options": ["5", "6", "7"],
        "answer": "C"
    },
    {
        "question": "¿Cuál es el nombre del primer planeta del sistema solar?",
        "options": ["Venus", "Mercurio", "Marte"],
        "answer": "B"
    },
    {
        "question": "¿En qué ciudad se encuentra la Torre Eiffel?",
        "options": ["Londres", "París", "Roma"],
        "answer": "B"
    },
    {
        "question": "¿Qué animal es conocido por su lentitud y su caparazón?",
        "options": ["Conejo", "Tortuga", "Caracol"],
        "answer": "B"
    },
    {
        "question": "¿En qué año comenzó la Primera Guerra Mundial?",
        "options": ["1912", "1914", "1916"],
        "answer": "B"
    },
    {
        "question": "¿Cuál es la capital de Australia?",
        "options": ["Sídney", "Melbourne", "Canberra"],
        "answer": "C"
    },
    {
        "question": "¿Qué autor escribió la novela 'Don Quijote de la Mancha'?",
        "options": ["Miguel de Cervantes", "William Shakespeare", "Fiódor Dostoievski"],
        "answer": "A"
    },
    {
        "question": "¿Cuál es el animal terrestre más grande?",
        "options": ["Elefante africano", "Rinoceronte blanco", "Oso polar"],
        "answer": "A"
    },
    {
        "question": "¿En qué continente se encuentra el desierto del Sahara?",
        "options": ["Asia", "África", "América"],
        "answer": "B"
    },
    {
        "question": "¿Quién pintó la famosa obra 'La noche estrellada'?",
        "options": ["Pablo Picasso", "Vincent van Gogh", "Claude Monet"],
        "answer": "B"
    },
    {
        "question": "¿Qué nombre recibe el aparato que mide la temperatura?",
        "options": ["Termómetro", "Barómetro", "Higrómetro"],
        "answer": "A"
    },
    {
        "question": "¿Qué país tiene la mayor población del mundo?",
        "options": ["India", "China", "Estados Unidos"],
        "answer": "B"
    },
    {
        "question": "¿Quién fue el primer hombre en caminar sobre la Luna?",
        "options": ["Yuri Gagarin", "Neil Armstrong", "Buzz Aldrin"],
        "answer": "B"
    },
    {
        "question": "¿Cuál es el río más largo del mundo?",
        "options": ["Nilo", "Amazonas", "Yangtsé"],
        "answer": "A"
    },
    {
        "question": "¿En qué año terminó la Segunda Guerra Mundial?",
        "options": ["1945", "1950", "1960"],
        "answer": "A"
    },
    {
        "question": "¿Quién es el creador de la teoría de la evolución?",
        "options": ["Albert Einstein", "Isaac Newton", "Charles Darwin"],
        "answer": "C"
    },
    {
        "question": "¿Cómo se llama el continente que está completamente cubierto por hielo?",
        "options": ["Antártida", "Ártico", "Groenlandia"],
        "answer": "A"
    },
    {
        "question": "¿Cuál es el símbolo químico del oro?",
        "options": ["Ag", "Au", "O"],
        "answer": "B"
    },
    {
        "question": "¿Qué significa la sigla 'ONU'?",
        "options": ["Organización Nacional Unida", "Organización de Naciones Unidas", "Organización para la Unidad de Naciones"],
        "answer": "B"
    },
    {
        "question": "¿Cuál es la capital de España?",
        "options": ["Barcelona", "Madrid", "Sevilla"],
        "answer": "B"
    },
    {
        "question": "¿Qué deporte se juega con una pelota y un aro en una cancha?",
        "options": ["Fútbol", "Baloncesto", "Béisbol"],
        "answer": "B"
    },
    {
        "question": "¿En qué continente se encuentra el país de Egipto?",
        "options": ["Asia", "Europa", "África"],
        "answer": "C"
    },
    {
        "question": "¿Qué gas constituye la mayor parte de la atmósfera terrestre?",
        "options": ["Oxígeno", "Nitrógeno", "Dióxido de carbono"],
        "answer": "B"
    },
    {
        "question": "¿Qué país inventó la pizza?",
        "options": ["Italia", "Francia", "España"],
        "answer": "A"
    },
    {
        "question": "¿En qué año se firmó la Constitución de los Estados Unidos?",
        "options": ["1776", "1787", "1791"],
        "answer": "B"
    },
    {
        "question": "¿Quién es el dios del trueno en la mitología nórdica?",
        "options": ["Hércules", "Thor", "Zeus"],
        "answer": "B"
    },
    {
        "question": "¿Qué país es famoso por la torre inclinada de Pisa?",
        "options": ["Francia", "Italia", "España"],
        "answer": "B"
    },
    {
        "question": "¿Cuál es la moneda de Japón?",
        "options": ["Yuan", "Yen", "Won"],
        "answer": "B"
    },
    {
        "question": "¿Cuál es el nombre del proceso por el cual las plantas producen su alimento?",
        "options": ["Fotosíntesis", "Respiración", "Transpiración"],
        "answer": "A"
    },
    {
        "question": "¿Qué escritor británico es conocido por su obra '1984'?",
        "options": ["George Orwell", "Aldous Huxley", "H.G. Wells"],
        "answer": "A"
    },
    {
        "question": "¿Cuál es el país más pequeño del mundo?",
        "options": ["Mónaco", "Ciudad del Vaticano", "San Marino"],
        "answer": "B"
    },
    {
        "question": "¿Qué inventor es conocido por crear la bombilla eléctrica?",
        "options": ["Nikola Tesla", "Thomas Edison", "Alexander Graham Bell"],
        "answer": "B"
    },
    {
        "question": "¿Qué guerra tuvo lugar entre 1950 y 1953 en la península de Corea?",
        "options": ["Guerra Fría", "Guerra de Vietnam", "Guerra de Corea"],
        "answer": "C"
    },
    {
        "question": "¿Cuál es el único continente que no tiene reptiles nativos?",
        "options": ["Asia", "Antártida", "Europa"],
        "answer": "B"
    },
    {
        "question": "¿Quién fue el primer presidente de los Estados Unidos?",
        "options": ["Abraham Lincoln", "Thomas Jefferson", "George Washington"],
        "answer": "C"
    },
    {
        "question": "¿Cuál es el único metal que es líquido a temperatura ambiente?",
        "options": ["Mercurio", "Plomo", "Cobre"],
        "answer": "A"
    },
    {
        "question": "¿Qué ciudad fue la sede de los primeros Juegos Olímpicos modernos en 1896?",
        "options": ["Londres", "París", "Atenas"],
        "answer": "C"
    },
    {
        "question": "¿En qué año se firmó la Declaración de Independencia de los Estados Unidos?",
        "options": ["1776", "1783", "1791"],
        "answer": "A"
    },
    {
        "question": "¿Quién pintó 'La última cena'?",
        "options": ["Miguel Ángel", "Rafael", "Leonardo da Vinci"],
        "answer": "C"
    },
    {
        "question": "¿Cuál es la capital de Italia?",
        "options": ["Venecia", "Roma", "Milán"],
        "answer": "B"
    },
    {
        "question": "¿Qué océano es el más grande del mundo?",
        "options": ["Atlántico", "Pacífico", "Índico"],
        "answer": "B"
    },
    {
        "question": "¿Cuántas estrellas tiene la bandera de Estados Unidos?",
        "options": ["50", "48", "52"],
        "answer": "A"
    },
    {
        "question": "¿Qué animal produce miel?",
        "options": ["Abeja", "Hormiga", "Mosca"],
        "answer": "A"
    },
    {
        "question": "¿Cuál es la moneda de México?",
        "options": ["Dólar", "Peso mexicano", "Euro"],
        "answer": "B"
    },
    {
        "question": "¿En qué estación del año se celebra la Navidad en el hemisferio norte?",
        "options": ["Verano", "Otoño", "Invierno"],
        "answer": "C"
    },
    {
        "question": "¿Qué órgano del cuerpo humano bombea sangre?",
        "options": ["Pulmón", "Hígado", "Corazón"],
        "answer": "C"
    },
    {
        "question": "¿Cuál es el nombre de la galaxia en la que se encuentra la Tierra?",
        "options": ["Andrómeda", "Vía Láctea", "Triángulo"],
        "answer": "B"
    },
    {
        "question": "¿Qué país es conocido por sus pirámides y el río Nilo?",
        "options": ["Egipto", "Grecia", "Italia"],
        "answer": "A"
    },
    {
        "question": "¿Quién escribió 'Romeo y Julieta'?",
        "options": ["Charles Dickens", "William Shakespeare", "Jane Austen"],
        "answer": "B"
    },
    {
        "question": "¿Cuál es la fruta que tiene forma de corazón y es de color rojo?",
        "options": ["Manzana", "Fresa", "Uva"],
        "answer": "B"
    },
    {
        "question": "¿Cuál es la capital de Japón?",
        "options": ["Kioto", "Osaka", "Tokio"],
        "answer": "C"
    },
    {
        "question": "¿Qué tipo de animal es un delfín?",
        "options": ["Pez", "Mamífero", "Reptil"],
        "answer": "B"
    },
    {
        "question": "¿En qué año se inventó el teléfono?",
        "options": ["1876", "1900", "1920"],
        "answer": "A"
    },
    {
        "question": "¿Qué país es famoso por el tango?",
        "options": ["España", "México", "Argentina"],
        "answer": "C"
    },
    {
        "question": "¿Cómo se llama el proceso por el que el agua se convierte en hielo?",
        "options": ["Evaporación", "Fusión", "Congelación"],
        "answer": "C"
    },
    {
        "question": "¿Cuál es el metal más caro del mundo?",
        "options": ["Oro", "Platino", "Rodio"],
        "answer": "C"
    },
    {
        "question": "¿Cuál es el color de las hojas de los árboles en otoño?",
        "options": ["Verde", "Rojo", "Amarillo"],
        "answer": "B"
    },
    {
        "question": "¿En qué ciudad se encuentra el Big Ben?",
        "options": ["París", "Londres", "Roma"],
        "answer": "B"
    },
    {
        "question": "¿Quién fue el creador de la marca Apple?",
        "options": ["Bill Gates", "Steve Jobs", "Mark Zuckerberg"],
        "answer": "B"
    },
    {
        "question": "¿Cuál es la unidad de medida de la temperatura en el sistema internacional?",
        "options": ["Fahrenheit", "Celsius", "Kelvin"],
        "answer": "C"
    },
    {
        "question": "¿Qué animal es conocido como el 'rey de la selva'?",
        "options": ["Tigre", "León", "Gorila"],
        "answer": "B"
    },
    {
        "question": "¿Cuál es el nombre del satélite natural de la Tierra?",
        "options": ["Marte", "Luna", "Venus"],
        "answer": "B"
    },
    {
        "question": "¿Quién fue el primer ser humano en el espacio?",
        "options": ["Yuri Gagarin", "Neil Armstrong", "Alan Shepard"],
        "answer": "A"
    },
    {
        "question": "¿Qué bebida se obtiene de la fermentación de la uva?",
        "options": ["Cerveza", "Vino", "Ron"],
        "answer": "B"
    },
    {
        "question": "¿Qué instrumento musical tiene cuerdas y se toca con un arco?",
        "options": ["Guitarra", "Piano", "Violín"],
        "answer": "C"
    },
    {
        "question": "¿Cuál es la capital de Canadá?",
        "options": ["Toronto", "Ottawa", "Vancouver"],
        "answer": "B"
    },
    {
        "question": "¿Qué nombre recibe el esqueleto humano?",
        "options": ["Esqueleto", "Oss", "Osteo"],
        "answer": "A"
    },
    {
        "question": "¿Quién fue el autor de la saga de libros de 'Harry Potter'?",
        "options": ["Stephen King", "J.K. Rowling", "J.R.R. Tolkien"],
        "answer": "B"
    },
    {
        "question": "¿Qué país es conocido como la 'tierra de los faraones'?",
        "options": ["China", "Egipto", "Grecia"],
        "answer": "B"
    },
    {
        "question": "¿Cuál es el principal ingrediente del pan?",
        "options": ["Leche", "Harina", "Huevos"],
        "answer": "B"
    },
    {
        "question": "¿Qué animal tiene una trompa larga y orejas grandes?",
        "options": ["Rinoceronte", "Hipopótamo", "Elefante"],
        "answer": "C"
    },
    {
        "question": "¿En qué país se originaron los Juegos Olímpicos?",
        "options": ["Grecia", "Italia", "Roma"],
        "answer": "A"
    },
    {
        "question": "¿Qué se celebra el 4 de julio en Estados Unidos?",
        "options": ["Día del Trabajo", "Día de la Independencia", "Día de la Constitución"],
        "answer": "B"
    },
    {
        "question": "¿Qué tipo de animal es una ballena?",
        "options": ["Pez", "Mamífero", "Anfibio"],
        "answer": "B"
    },
    {
        "question": "¿Cuál es la montaña más alta del mundo?",
        "options": ["K2", "Monte Everest", "Kilimanjaro"],
        "answer": "B"
    },
    {
        "question": "¿En qué año se construyó la Gran Muralla China?",
        "options": ["Siglo III a.C.", "Siglo I a.C.", "Siglo II d.C."],
        "answer": "A"
    },
    {
        "question": "¿Qué es la fotosíntesis?",
        "options": ["Proceso de respiración", "Proceso de digestión", "Proceso de producción de alimento en plantas"],
        "answer": "C"
    },
    {
        "question": "¿Quién fue el primer presidente de México?",
        "options": ["Benito Juárez", "Porfirio Díaz", "Agustín de Iturbide"],
        "answer": "C"
    },
    {
        "question": "¿En qué país se inventó el papel?",
        "options": ["Japón", "China", "India"],
        "answer": "B"
    },
    {
        "question": "¿Qué planeta es conocido como el 'planeta rojo'?",
        "options": ["Júpiter", "Marte", "Venus"],
        "answer": "B"
    },
    {
        "question": "¿Qué nombre recibe el estado sólido del agua?",
        "options": ["Vapor", "Hielo", "Líquido"],
        "answer": "B"
    },
    {
        "question": "¿Quién escribió la obra 'El principito'?",
        "options": ["Antoine de Saint-Exupéry", "Julio Verne", "Victor Hugo"],
        "answer": "A"
    },
    {
        "question": "¿Cuál es la capital de Alemania?",
        "options": ["Múnich", "Berlín", "Hamburgo"],
        "answer": "B"
    },
    {
        "question": "¿Qué animal es conocido por su 'canturreo' nocturno?",
        "options": ["Gato", "Búho", "Perro"],
        "answer": "B"
    },
    {
        "question": "¿Cuál es la moneda de Estados Unidos?",
        "options": ["Dólar", "Euro", "Libra"],
        "answer": "A"
    },
    {
        "question": "¿Qué es el sol en el sistema solar?",
        "options": ["Un planeta", "Una estrella", "Un cometa"],
        "answer": "B"
    },
    {
        "question": "¿Cuál es el nombre de la fuerza que mantiene a los planetas en órbita?",
        "options": ["Gravedad", "Fricción", "Empuje"],
        "answer": "A"
    },
    {
        "question": "¿Quién es conocido por ser el 'padre de la genética'?",
        "options": ["Charles Darwin", "Gregor Mendel", "Louis Pasteur"],
        "answer": "B"
    },
    {
        "question": "¿En qué año se descubrió América?",
        "options": ["1492", "1500", "1480"],
        "answer": "A"
    },
    {
        "question": "¿Qué metal es el más abundante en la corteza terrestre?",
        "options": ["Hierro", "Aluminio", "Oro"],
        "answer": "B"
    },
    {
        "question": "¿Qué país es conocido por la 'Fiesta de la Cerveza'?",
        "options": ["Bélgica", "Alemania", "Irlanda"],
        "answer": "B"
    },
    {
        "question": "¿Qué animal es un mamífero volador?",
        "options": ["Pájaro", "Murciélago", "Mariposa"],
        "answer": "B"
    },
    {
        "question": "¿En qué ciudad se encuentra el Coliseo?",
        "options": ["Atenas", "Roma", "París"],
        "answer": "B"
    },
    {
        "question": "¿Cuál es el nombre del proceso por el cual el agua se convierte en gas?",
        "options": ["Evaporación", "Condensación", "Sublimación"],
        "answer": "A"
    },
    {
        "question": "¿Quién fue el autor de la teoría de la relatividad?",
        "options": ["Isaac Newton", "Albert Einstein", "Stephen Hawking"],
        "answer": "B"
    },
    {
        "question": "¿Qué país es conocido por el Taj Mahal?",
        "options": ["Egipto", "India", "China"],
        "answer": "B"
    },
    {
        "question": "¿Qué fruta es conocida por tener una piel peluda?",
        "options": ["Manzana", "Kiwi", "Naranja"],
        "answer": "B"
    },
    {
        "question": "¿En qué año se fundó la ONU?",
        "options": ["1945", "1950", "1960"],
        "answer": "A"
    },
    {
        "question": "¿Qué gas es vital para la respiración de los seres humanos?",
        "options": ["Dióxido de carbono", "Nitrógeno", "Oxígeno"],
        "answer": "C"
    },
    {
        "question": "¿Quién fue el líder de la Revolución Cubana?",
        "options": ["Fidel Castro", "Che Guevara", "Camilo Cienfuegos"],
        "answer": "A"
    },
    {
        "question": "¿Qué país es famoso por los samuráis?",
        "options": ["China", "Japón", "Corea"],
        "answer": "B"
    },
    {
        "question": "¿Cuál es la capital de Egipto?",
        "options": ["Alejandría", "Luxor", "El Cairo"],
        "answer": "C"
    },
    {
        "question": "¿Qué animal es el mejor amigo del hombre?",
        "options": ["Gato", "Perro", "Caballo"],
        "answer": "B"
    },
    {
        "question": "¿En qué año se produjo la caída del Muro de Berlín?",
        "options": ["1987", "1989", "1991"],
        "answer": "B"
    },
    {
        "question": "¿Qué científico descubrió la penicilina?",
        "options": ["Louis Pasteur", "Alexander Fleming", "Marie Curie"],
        "answer": "B"
    },
    {
        "question": "¿Cuál es el río más largo de Europa?",
        "options": ["Danubio", "Volga", "Sena"],
        "answer": "B"
    },
    {
        "question": "¿Quién es el autor de 'Cien años de soledad'?",
        "options": ["Mario Vargas Llosa", "Gabriel García Márquez", "Jorge Luis Borges"],
        "answer": "B"
    },
    {
        "question": "¿Qué planeta tiene los anillos más visibles?",
        "options": ["Júpiter", "Saturno", "Urano"],
        "answer": "B"
    },
    {
        "question": "¿Cuál es el idioma más hablado del mundo?",
        "options": ["Español", "Inglés", "Mandarín"],
        "answer": "C"
    },
    {
        "question": "¿Qué animal es un reptil y cambia de color?",
        "options": ["Serpiente", "Camaleón", "Lagartija"],
        "answer": "B"
    },
    {
        "question": "¿Qué se celebra en el Día de Muertos en México?",
        "options": ["El nacimiento de un dios", "La vida después de la muerte", "El recuerdo de los seres queridos fallecidos"],
        "answer": "C"
    }
];

let triviaSessions = new Map();

const triviaHandler = async (m, { conn, command, args, usedPrefix }) => {
    if (args.length === 0) {
        let randomIndex = Math.floor(Math.random() * questions.length);
        let questionData = questions[randomIndex];

        triviaSessions.set(m.chat, { index: randomIndex, answered: false });

        const caption = `
🎓 *Trivia* ${questionData.question}  
        `.trim();

        const buttons = [
            {
                buttonId: `${usedPrefix}trivia A`,
                buttonText: { displayText: `A: ${questionData.options[0]}` },
                type: 1
            },
            {
                buttonId: `${usedPrefix}trivia B`,
                buttonText: { displayText: `B: ${questionData.options[1]}` },
                type: 1
            },
            {
                buttonId: `${usedPrefix}trivia C`,
                buttonText: { displayText: `C: ${questionData.options[2]}` },
                type: 1
            }
        ];

        await conn.sendMessage(
            m.chat,
            {
                text: caption,
                buttons: buttons,
                viewOnce: true
            },
            { quoted: m }
        );

    } else {
        let session = triviaSessions.get(m.chat);
        if (!session || session.answered) {
            return conn.reply(m.chat, `⚠️ Primero usa *${usedPrefix}trivia* para obtener una pregunta.`, m);
        }

        let userAnswer = args[0].toUpperCase();
        let correctAnswer = questions[session.index].answer;
        let result = userAnswer === correctAnswer ? "🎉 ¡Respuesta correcta!" : `❌ Incorrecto. La respuesta correcta era *${questions[session.index].options[correctAnswer.charCodeAt(0) - 65]}*`;

        const caption = `
⚜️ *Tu respuesta:* ${userAnswer}  
✅ *Solución:* ${correctAnswer}) ${questions[session.index].options[correctAnswer.charCodeAt(0) - 65]}  
> 🧠 *Resultado:* ${result}
`.trim();

        const buttons = [
            {
                buttonId: `${usedPrefix}trivia`,
                buttonText: { displayText: "🔄 Nueva Pregunta" },
                type: 1
            }
        ];

        await conn.sendMessage(
            m.chat,
            {
                text: caption,
                buttons: buttons,
                viewOnce: true
            },
            { quoted: m }
        );

        triviaSessions.set(m.chat, { ...session, answered: true });
    }
};

triviaHandler.help = ['trivia'];
triviaHandler.tags = ['game'];
triviaHandler.command = /^(trivia)$/i;

export default triviaHandler;
