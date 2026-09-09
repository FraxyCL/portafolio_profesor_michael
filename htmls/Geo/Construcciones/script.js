/* =========================================================
   CONSTRUCCIONES GEOMÉTRICAS

   PARA AGREGAR UNA NUEVA CONSTRUCCIÓN:

   1. Copia una de las estructuras.
   2. Cambia nombre.
   3. Cambia descripción.
   4. Cambia categoría.
   5. Cambia nivel.
   6. Coloca la URL de GeoGebra.

========================================================= */


const construcciones = [

    /* =====================================================
                Molde para agregar mas construcciones
    {
        nombre: "Circunferencia inscrita en un triángulo",

        descripcion:
            "Construcción de la circunferencia inscrita y exploración del incentro de un triángulo.",

        categoria:
            "Triángulos",

        nivel:
            "Intermedio",

        url:
            "https://www.geogebra.org/m/AAAAAAAA",

        video:
            "https://www.youtube.com/watch?v=XXXXXXXXXXX",
    },
     ====================================================== */

    /* =====================================================
       Construcciones
    ====================================================== */
    /*1*/
    {
        nombre: "Mediatriz de un segmento y punto medio",

        descripcion:
            "Hallar el centro exacto de un segmento trazando dos arcos de igual radio desde sus extremos.",

        categoria:
            "Construcciones Básicas y Fundamentales",

        nivel:
            "Básico",

        url:
            "",
        
        video:
            "",

    },
    /*2*/
    {
        nombre: "Perpendicular a una recta desde un punto perteneciente a ella",

        descripcion:
            "Levantamiento de una línea a 90° sobre un punto dado de la recta.",

        categoria:
            "Construcciones Básicas y Fundamentales",

        nivel:
            "Básico",

        url:
            "",
        
        video:
            "",
    },
    /*3*/
    {
        nombre: "Perpendicular a una recta desde un punto exterior",

        descripcion:
            "Trazado de la distancia mínima desde un punto externo hacia una recta base.",

        categoria:
            "Construcciones Básicas y Fundamentales",

        nivel:
            "Básico",

        url:
            "",
        
        video:
            "",
    },
    /*4*/
    {
        nombre: "Bisectriz de un ángulo",

        descripcion:
            "División exacta de un ángulo cualquiera en dos ángulos congruentes.",

        categoria:
            "Construcciones Básicas y Fundamentales",

        nivel:
            "Básico",

        url:
            "",
        
        video:
            "",
    },
    /*5*/
    {
        nombre: "Recta paralela a una dada por un punto exterior",

        descripcion:
            "Copia exacta de un ángulo para garantizar paralelismo mediante regla y compás.",

        categoria:
            "Construcciones Básicas y Fundamentales",

        nivel:
            "Básico",

        url:
            "",
        
        video:
            "",
    },
    /*6*/
    {
        nombre: "Transporte (copia) de un ángulo",

        descripcion:
            "Replicar un ángulo existente en otra posición de origen sin usar transportador.",

        categoria:
            "Construcciones Básicas y Fundamentales",

        nivel:
            "Básico",

        url:
            "",
        
        video:
            "",
    },
    /*7*/
    {
        nombre: "Circuncentro (Circunferencia circunscrita)",

        descripcion:
            "Intersección de las tres mediatrices; la circunferencia pasa por los 3 vértices.",

        categoria:
            "Puntos y Centros Notables del Triángulo",

        nivel:
            "Básico",

        url:
            "",
        
        video:
            "",
    },
    /*8*/
    {
        nombre: "Incentro (Circunferencia inscrita)",

        descripcion:
            "Intersección de las tres bisectrices; la circunferencia es tangente interior a los 3 lados.",

        categoria:
            "Puntos y Centros Notables del Triángulo",

        nivel:
            "Básico",

        url:
            "",
        
        video:
            "",
    },
    /*9*/
    {
        nombre: "Ortocentro",

        descripcion:
            "Intersección de las tres alturas trazadas desde cada vértice a su lado opuesto.",

        categoria:
            "Puntos y Centros Notables del Triángulo",

        nivel:
            "Básico",

        url:
            "",
        
        video:
            "",
    },
    /*10*/
    {
        nombre: "Baricentro (Centro de gravedad)",

        descripcion:
            "Intersección de las tres medianas (unión de cada vértice con el punto medio opuesto).",

        categoria:
            "Puntos y Centros Notables del Triángulo",

        nivel:
            "Básico",

        url:
            "",
        
        video:
            "",
    },
    /*11*/
    {
        nombre: "Excentro (Circunferencia exinscrita)",

        descripcion:
            "Intersección de la bisectriz interior de un ángulo con las bisectrices exteriores de los otros dos.",

        categoria:
            "Puntos y Centros Notables del Triángulo",

        nivel:
            "Básico",

        url:
            "",
        
        video:
            "",
    },
    /*12*/
    {
        nombre: "Tangente a una circunferencia en un punto de ella",

        descripcion:
            "Levantamiento de la perpendicular al radio en el punto de contacto.",

        categoria:
            "Tangencias y Propiedades de la Circunferencia",

        nivel:
            "Medio",

        url:
            "",
        
        video:
            "",
    },
    /*13*/
    {
        nombre: "Tangentes a una circunferencia desde un punto exterior",

        descripcion:
            "Uso de la circunferencia auxiliar (arco capaz de 90°) trazada desde el punto medio entre el centro y el punto exterior.",

        categoria:
            "Tangencias y Propiedades de la Circunferencia",

        nivel:
            "Medio",

        url:
            "",
        
        video:
            "",
    },
    /*14*/
    {
        nombre: "Rectas tangentes exteriores comunes a dos circunferencias",

        descripcion:
            "Reducción del problema restando radios de ambas circunferencias.",

        categoria:
            "Tangencias y Propiedades de la Circunferencia",

        nivel:
            "Medio",

        url:
            "",
        
        video:
            "",
    },
    /*15*/
    {
        nombre: "Rectas tangentes interiores comunes a dos circunferencias",

        descripcion:
            "Reducción del problema sumando radios de ambas circunferencias.",

        categoria:
            "Tangencias y Propiedades de la Circunferencia",

        nivel:
            "Medio",

        url:
            "",
        
        video:
            "",
    },
    /*16*/
    {
        nombre: "Arco capaz para un ángulo dado",

        descripcion:
            "Construcción del lugar geométrico de todos los puntos desde los cuales un segmento se ve bajo un mismo ángulo.",

        categoria:
            "Tangencias y Propiedades de la Circunferencia",

        nivel:
            "Medio",

        url:
            "",
        
        video:
            "",
    },
    /*17*/
    {
        nombre: "Triángulo equilátero inscrito",

        descripcion:
            "Trazado de un diámetro y uso del compás con la amplitud del radio desde un extremo para marcar los vértices sobre la circunferencia.",

        categoria:
            "Polígonos Regulares (Inscritos en una Circunferencia)",

        nivel:
            "Medio",

        url:
            "",
        
        video:
            "",
    },
    /*18*/
    {
        nombre: "Cuadrado inscrito",

        descripcion:
            "Trazado de dos diámetros perfectamente perpendiculares entre sí mediante la mediatriz del primero.",

        categoria:
            "Polígonos Regulares (Inscritos en una Circunferencia)",

        nivel:
            "Medio",

        url:
            "",
        
        video:
            "",
    },
    /*19*/
    {
        nombre: "Pentágono regular inscrito",

        descripcion:
            "Método clásico trazando el punto medio de un radio y construyendo la longitud del lado del pentágono mediante el arco auxiliar hacia el vértice opuesto (sección áurea).",

        categoria:
            "Polígonos Regulares (Inscritos en una Circunferencia)",

        nivel:
            "Medio",

        url:
            "",
        
        video:
            "",
    },
    /*20*/
    {
        nombre: "Hexágono regular inscrito",

        descripcion:
            "Traslación del radio de manera sucesiva a lo largo de la circunferencia (división exacta en 6 arcos congruentes).",

        categoria:
            "Polígonos Regulares (Inscritos en una Circunferencia)",

        nivel:
            "Medio",

        url:
            "",
        
        video:
            "",
    },
    /*21*/
    {
        nombre: "Octágono regular inscrito",

        descripcion:
            "Trazado de las bisectrices de los cuatro ángulos rectos formados por los diámetros perpendiculares del cuadrado inscrito.",

        categoria:
            "Polígonos Regulares (Inscritos en una Circunferencia)",

        nivel:
            "Medio",

        url:
            "",
        
        video:
            "",
    },
    /*22*/
    {
        nombre: "Decágono regular inscrito",

        descripcion:
            "Obtención del lado del decágono a partir del segmento áureo derivado del radio en la construcción del pentágono.",

        categoria:
            "Polígonos Regulares (Inscritos en una Circunferencia)",

        nivel:
            "Medio",

        url:
            "",
        
        video:
            "",
    },
    /*23*/
    {
        nombre: "Triángulo equilátero dado el lado",

        descripcion:
            "Trazado de dos arcos de radio AB centrados en A y en B; su intersección determina el tercer vértice.",

        categoria:
            "Polígonos Regulares (Construidos sobre un Lado dado)",

        nivel:
            "Medio",

        url:
            "",
        
        video:
            "",
    },
    /*24*/
    {
        nombre: "Cuadrado dado el lado",

        descripcion:
            "Levantamiento de perpendiculares en los extremos A y B con altura AB para ubicar los vértices superiores.",

        categoria:
            "Polígonos Regulares (Construidos sobre un Lado dado)",

        nivel:
            "Medio",

        url:
            "",
        
        video:
            "",
    },
    /*25*/
    {
        nombre: "Pentágono regular dado el lado",

        descripcion:
            "Extensión del segmento AB, levantamiento de una perpendicular y uso de la sección áurea trazada sobre el lado para ubicar el vértice superior o el centro geométrico.",

        categoria:
            "Polígonos Regulares (Construidos sobre un Lado dado)",

        nivel:
            "Medio",

        url:
            "",
        
        video:
            "",
    },
    /*26*/
    {
        nombre: "Hexágono regular dado el lado",

        descripcion:
            "Construcción de un triángulo equilátero hacia arriba para hallar el centro del hexágono y posterior trazado de la circunferencia circunscrita.",

        categoria:
            "Polígonos Regulares (Construidos sobre un Lado dado)",

        nivel:
            "Medio",

        url:
            "",
        
        video:
            "",
    },
    /*27*/
    {
        nombre: "Octágono regular dado el lado",

        descripcion:
            "Trazado de mediatriz y ángulos de 45° en los extremos del segmento AB para proyectar las direcciones de los lados adyacentes.",

        categoria:
            "Polígonos Regulares (Construidos sobre un Lado dado)",

        nivel:
            "Medio",

        url:
            "",
        
        video:
            "",
    },
    /*28*/
    {
        nombre: "División de un segmento en N partes iguales",

        descripcion:
            "Aplicación directa del Teorema de Tales mediante una recta auxiliar y compás.",

        categoria:
            "Teoremas y Proporciones Geométricas",

        nivel:
            "Alto",

        url:
            "",
        
        video:
            "",
    },
    /*29*/
    {
        nombre: "Sección áurea de un segmento",

        descripcion:
            "División de un segmento en media y extrema razón (proporción dorada).",

        categoria:
            "Teoremas y Proporciones Geométricas",

        nivel:
            "Alto",

        url:
            "",
        
        video:
            "",
    },
    /*30*/
    {
        nombre: "Media proporcional (Media geométrica)",

        descripcion:
            "Construcción del segmento de longitud $\sqrt{a \cdot b}$ usando el Teorema de la Altura o del Cateto sobre una semicircunferencia.",

        categoria:
            "Teoremas y Proporciones Geométricas",

        nivel:
            "Alto",

        url:
            "",
        
        video:
            "",
    },

];



/* =========================================================
   ELEMENTOS DEL DOM
========================================================= */

const grid =
    document.getElementById(
        "grid-construcciones"
    );


const buscador =
    document.getElementById(
        "buscador"
    );


const filtroCategoria =
    document.getElementById(
        "filtro-categoria"
    );


const filtroNivel =
    document.getElementById(
        "filtro-nivel"
    );


const sinResultados =
    document.getElementById(
        "sin-resultados"
    );


const totalConstrucciones =
    document.getElementById(
        "total-construcciones"
    );


const totalCategorias =
    document.getElementById(
        "total-categorias"
    );


const totalNiveles =
    document.getElementById(
        "total-niveles"
    );



/* =========================================================
   CREAR CATEGORÍAS Y NIVELES
========================================================= */

function cargarFiltros() {

    const categorias =
        [...new Set(
            construcciones.map(
                item => item.categoria
            )
        )];

    const niveles =
        [...new Set(
            construcciones.map(
                item => item.nivel
            )
        )];


    categorias.sort();

    niveles.sort();


    categorias.forEach(
        categoria => {

            const option =
                document.createElement(
                    "option"
                );

            option.value = categoria;

            option.textContent = categoria;

            filtroCategoria.appendChild(
                option
            );

        }
    );


    niveles.forEach(
        nivel => {

            const option =
                document.createElement(
                    "option"
                );

            option.value = nivel;

            option.textContent = nivel;

            filtroNivel.appendChild(
                option
            );

        }
    );


    totalConstrucciones.textContent =
        construcciones.length;

    totalCategorias.textContent =
        categorias.length;

    totalNiveles.textContent =
        niveles.length;

}



/* =========================================================
   CREAR TARJETA
========================================================= */

function crearTarjeta(construccion) {

    const card =
        document.createElement("article");

    card.className = "card";


    // =====================================================
    // BOTÓN VIDEO
    // =====================================================

    let botonVideo;


    if (construccion.video) {

        botonVideo = `

            <a
                class="card-button video-button"
                href="${construccion.video}"
                target="_blank"
                rel="noopener noreferrer"
            >
                🎥 Ver video
            </a>

        `;

    } else {

        botonVideo = `

            <span
                class="card-button video-button disabled"
                aria-disabled="true"
            >
                🎥 Video próximamente
            </span>

        `;

    }


    // =====================================================
    // BOTÓN GEOGEBRA
    // =====================================================

    let botonGeoGebra;


    if (construccion.url) {

        botonGeoGebra = `

            <a
                class="card-button geogebra-button"
                href="${construccion.url}"
                target="_blank"
                rel="noopener noreferrer"
            >
                📐 Ver GeoGebra
            </a>

        `;

    } else {

        botonGeoGebra = `

            <span
                class="card-button geogebra-button disabled"
                aria-disabled="true"
            >
                📐 GeoGebra próximamente
            </span>

        `;

    }


    // =====================================================
    // TARJETA
    // =====================================================

    card.innerHTML = `

        <div class="card-category">
            ${construccion.categoria}
        </div>


        <h2>
            ${construccion.nombre}
        </h2>


        <p class="card-description">
            ${construccion.descripcion}
        </p>


        <div class="tags">

            <span class="tag">
                ${construccion.nivel}
            </span>

        </div>


        <div class="card-buttons">

            ${botonVideo}

            ${botonGeoGebra}

        </div>

    `;


    return card;

}



/* =========================================================
   MOSTRAR CONSTRUCCIONES
========================================================= */

function mostrarConstrucciones(lista) {

    grid.innerHTML = "";


    if (lista.length === 0) {

        sinResultados.classList.remove(
            "oculto"
        );

        return;

    }


    sinResultados.classList.add(
        "oculto"
    );


    lista.forEach(
        construccion => {

            const tarjeta =
                crearTarjeta(
                    construccion
                );

            grid.appendChild(
                tarjeta
            );

        }
    );

}



/* =========================================================
   FILTRAR
========================================================= */

function filtrar() {

    const texto =
        buscador.value
            .toLowerCase()
            .trim();


    const categoria =
        filtroCategoria.value;


    const nivel =
        filtroNivel.value;


    const resultado =
        construcciones.filter(
            construccion => {

                const coincideTexto =

                    construccion.nombre
                        .toLowerCase()
                        .includes(texto)

                    ||

                    construccion.descripcion
                        .toLowerCase()
                        .includes(texto)

                    ||

                    construccion.categoria
                        .toLowerCase()
                        .includes(texto);


                const coincideCategoria =

                    categoria === "todas"
                    ||
                    construccion.categoria === categoria;


                const coincideNivel =

                    nivel === "todos"
                    ||
                    construccion.nivel === nivel;


                return (

                    coincideTexto
                    &&
                    coincideCategoria
                    &&
                    coincideNivel

                );

            }
        );


    mostrarConstrucciones(
        resultado
    );

}



/* =========================================================
   EVENTOS
========================================================= */

buscador.addEventListener(
    "input",
    filtrar
);


filtroCategoria.addEventListener(
    "change",
    filtrar
);


filtroNivel.addEventListener(
    "change",
    filtrar
);



/* =========================================================
   INICIAR
========================================================= */

cargarFiltros();

mostrarConstrucciones(
    construcciones
);