// Variables para seleccionar elementos del DOM y almacenar datos
const listaTweets = document.querySelector('#lista-tweets'); // Lista donde se mostrarán los tweets
const formulario = document.querySelector('#formulario'); // Formulario para agregar o editar tweets
const textareaTweet = document.querySelector('#tweet'); // Área de texto para escribir el tweet
let tweets = []; // Array para almacenar los tweets
let editingTweetId = null; // ID del tweet que se está editando, null si no hay edición en curso

// Evento que se ejecuta cuando el DOM está completamente cargado
document.addEventListener('DOMContentLoaded', () => {
    // Cargar tweets guardados en localStorage o iniciar con array vacío
    tweets = JSON.parse(localStorage.getItem('tweets')) || [];
    renderizarTweets(); // Mostrar los tweets en la página
});

// Escuchar el evento submit del formulario para agregar o editar un tweet
formulario.addEventListener('submit', manejarSubmit);

// Escuchar clicks en la lista de tweets para borrar o editar
listaTweets.addEventListener('click', manejarClickLista);

// Función que maneja el envío del formulario
function manejarSubmit(e) {
    e.preventDefault(); // Prevenir comportamiento por defecto del formulario
    const texto = textareaTweet.value.trim(); // Obtener texto del textarea y eliminar espacios

    // Validar que el texto no esté vacío
    if (!texto) {
        mostrarMensaje('Un mensaje no puede ir vacío', 'error'); // Mostrar mensaje de error
        return; // Salir de la función
    }

    if (editingTweetId) {
        // Si se está editando un tweet existente
        tweets = tweets.map(tweet => {
            if (tweet.id === editingTweetId) {
                return {...tweet, texto: texto}; // Actualizar el texto del tweet editado
            }
            return tweet; // Dejar los demás tweets sin cambios
        });
        mostrarMensaje('Tweet actualizado exitosamente', 'exito'); // Mostrar mensaje de éxito
        editingTweetId = null; // Resetear el estado de edición
        formulario.querySelector('input[type="submit"]').value = 'Agregar'; // Cambiar texto del botón a "Agregar"
    } else {
        // Si se está agregando un nuevo tweet
        const nuevoTweet = {
            id: Date.now(), // Generar un ID único basado en la fecha actual
            texto: texto // Texto del tweet
        };
        tweets.push(nuevoTweet); // Agregar el nuevo tweet al array
        mostrarMensaje('Tweet agregado exitosamente', 'exito'); // Mostrar mensaje de éxito
    }

    textareaTweet.value = ''; // Limpiar el textarea
    sincronizarStorage(); // Guardar los tweets en localStorage
    renderizarTweets(); // Actualizar la lista de tweets en la página
}

// Función que maneja clicks en la lista de tweets
function manejarClickLista(e) {
    if (e.target.classList.contains('borrar-tweet')) {
        // Si se hizo click en el botón de borrar
        const id = e.target.parentElement.dataset.tweetId; // Obtener el ID del tweet a borrar
        tweets = tweets.filter(tweet => tweet.id != id); // Filtrar el tweet eliminado
        sincronizarStorage(); // Guardar cambios en localStorage
        renderizarTweets(); // Actualizar la lista en la página
    } else if (e.target.classList.contains('editar-tweet')) {
        // Si se hizo click en el botón de editar
        const id = e.target.parentElement.dataset.tweetId; // Obtener el ID del tweet a editar
        const tweet = tweets.find(t => t.id == id); // Buscar el tweet en el array
        if (tweet) {
            textareaTweet.value = tweet.texto; // Poner el texto del tweet en el textarea
            editingTweetId = tweet.id; // Guardar el ID para indicar que se está editando
            formulario.querySelector('input[type="submit"]').value = 'Actualizar'; // Cambiar texto del botón a "Actualizar"
        }
    }
}

// Función para renderizar la lista de tweets en el DOM
function renderizarTweets() {
    limpiarHTML(); // Limpiar la lista actual
    if (tweets.length === 0) return; // Si no hay tweets, salir

    tweets.forEach(tweet => {
        const li = document.createElement('li'); // Crear un elemento li para el tweet
        li.dataset.tweetId = tweet.id; // Asignar el ID del tweet como atributo data
        li.style.background = "radial-gradient(circle at center, #57C1EB 0%, #246FA8 70%)"; // Estilo de fondo
        li.style.color = "white"; // Color del texto
        li.style.padding = "10px"; // Espaciado interno
        li.style.marginBottom = "8px"; // Margen inferior
        li.style.borderRadius = "4px"; // Bordes redondeados
        li.style.position = "relative"; // Posición relativa para posicionar botones

        li.textContent = tweet.texto; // Poner el texto del tweet

        // Crear botón para borrar tweet
        const btnBorrar = document.createElement('a');
        btnBorrar.classList.add('borrar-tweet');
        btnBorrar.textContent = 'X';
        btnBorrar.style.position = 'absolute';
        btnBorrar.style.right = '10px';
        btnBorrar.style.top = '10px';
        btnBorrar.style.cursor = 'pointer';
        btnBorrar.style.color = 'white';
        btnBorrar.style.fontWeight = 'bold';
        btnBorrar.style.textDecoration = 'none';

        // Crear botón para editar tweet
        const btnEditar = document.createElement('a');
        btnEditar.classList.add('editar-tweet');
        btnEditar.textContent = 'Editar';
        btnEditar.style.position = 'absolute';
        btnEditar.style.right = '50px';
        btnEditar.style.top = '10px';
        btnEditar.style.cursor = 'pointer';
        btnEditar.style.color = 'white';
        btnEditar.style.fontWeight = 'bold';
        btnEditar.style.textDecoration = 'none';

        // Añadir botones al elemento li
        li.appendChild(btnBorrar);
        li.appendChild(btnEditar);

        // Añadir el li a la lista de tweets en el DOM
        listaTweets.appendChild(li);
    });
}

// Función para limpiar el contenido HTML de la lista de tweets
function limpiarHTML() {
    while (listaTweets.firstChild) {
        listaTweets.removeChild(listaTweets.firstChild);
    }
}

// Función para sincronizar el array de tweets con localStorage
function sincronizarStorage() {
    localStorage.setItem('tweets', JSON.stringify(tweets));
}

// Función para mostrar mensajes de error o éxito en pantalla
function mostrarMensaje(mensaje, tipo) {
    const p = document.createElement('p'); // Crear un párrafo para el mensaje
    p.textContent = mensaje; // Asignar el texto del mensaje
    p.classList.add(tipo === 'error' ? 'error' : 'exito'); // Añadir clase según tipo

    const contenido = document.querySelector('#contenido'); // Contenedor principal
    contenido.appendChild(p); // Añadir el mensaje al DOM

    // Eliminar el mensaje después de 3 segundos
    setTimeout(() => {
        p.remove();
    }, 3000);
}
