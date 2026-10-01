/*
 * portafolio.js
 * JavaScript propio del portafolio (la plantilla original traía su scripts.js vacío).
 * Funciones:
 *   1. Marcar en el menú la sección que se está viendo.
 *   2. Cerrar el menú en celulares al elegir una opción.
 *   3. Mostrar el botón "volver arriba" al bajar en la página.
 *   4. Validar el formulario de contacto y abrir el correo con el mensaje.
 *   5. Poner el año actual en el pie de página.
 */

// Correo al que llegan los mensajes del formulario de contacto.
const CORREO_DESTINO = "josejosecuenta7520@gmail.com";

document.addEventListener("DOMContentLoaded", () => {
    marcarSeccionActiva();
    cerrarMenuMovil();
    botonVolverArriba();
    formularioContacto();
    document.getElementById("anioActual").textContent = new Date().getFullYear();
});

// 1. Usa IntersectionObserver para saber qué sección está en pantalla
//    y le pone la clase "active" al enlace correspondiente del menú.
function marcarSeccionActiva() {
    const enlaces = document.querySelectorAll("#navPrincipal .nav-link");
    const secciones = document.querySelectorAll("header[id], section[id]");

    const observador = new IntersectionObserver((entradas) => {
        entradas.forEach((entrada) => {
            if (!entrada.isIntersecting) return;
            enlaces.forEach((enlace) => {
                const coincide = enlace.getAttribute("href") === "#" + entrada.target.id;
                enlace.classList.toggle("active", coincide);
            });
        });
    }, { rootMargin: "-45% 0px -50% 0px" });

    secciones.forEach((seccion) => observador.observe(seccion));
}

// 2. En pantallas chicas el menú se despliega; al tocar un enlace se vuelve a cerrar.
function cerrarMenuMovil() {
    const menu = document.getElementById("menuPrincipal");
    if (typeof bootstrap === "undefined") return; // Si el CDN de Bootstrap no cargó, no rompe lo demás.
    const colapsable = bootstrap.Collapse.getOrCreateInstance(menu, { toggle: false });

    menu.querySelectorAll(".nav-link").forEach((enlace) => {
        enlace.addEventListener("click", () => {
            if (menu.classList.contains("show")) colapsable.hide();
        });
    });
}

// 3. El botón aparece cuando se bajan más de 400px.
function botonVolverArriba() {
    const boton = document.getElementById("botonArriba");
    window.addEventListener("scroll", () => {
        boton.classList.toggle("visible", window.scrollY > 400);
    });
}

// 4. Validación con las clases de Bootstrap (is-valid / is-invalid)
//    y envío con mailto:, que no necesita servidor (funciona en GitHub Pages).
function formularioContacto() {
    const form = document.getElementById("formContacto");
    const campos = form.querySelectorAll("input, textarea");
    const mensaje = document.getElementById("mensaje");
    const contador = document.getElementById("contadorMensaje");
    const exito = document.getElementById("mensajeExito");

    // Contador de caracteres del mensaje.
    mensaje.addEventListener("input", () => {
        contador.textContent = `${mensaje.value.length} / ${mensaje.maxLength}`;
    });

    // Valida cada campo mientras se escribe, después del primer intento de envío.
    campos.forEach((campo) => {
        campo.addEventListener("input", () => {
            if (form.dataset.intentado) validarCampo(campo);
        });
    });

    form.addEventListener("submit", (evento) => {
        evento.preventDefault();
        form.dataset.intentado = "si";

        let todoValido = true;
        campos.forEach((campo) => {
            if (!validarCampo(campo)) todoValido = false;
        });
        if (!todoValido) {
            exito.classList.add("d-none");
            return;
        }

        const nombre = document.getElementById("nombre").value.trim();
        const correo = document.getElementById("correo").value.trim();
        const asunto = encodeURIComponent(`Contacto desde el portafolio: ${nombre}`);
        const cuerpo = encodeURIComponent(`${mensaje.value.trim()}\n\nNombre: ${nombre}\nCorreo: ${correo}`);

        window.location.href = `mailto:${CORREO_DESTINO}?subject=${asunto}&body=${cuerpo}`;
        exito.classList.remove("d-none");
        form.reset();
        delete form.dataset.intentado;
        campos.forEach((campo) => campo.classList.remove("is-valid"));
        contador.textContent = `0 / ${mensaje.maxLength}`;
    });
}

// Revisa un campo: no vacío, formato válido (type="email") y largo mínimo (minlength),
// ignorando espacios al inicio y al final.
function validarCampo(campo) {
    const valor = campo.value.trim();
    let valido = valor.length > 0 && campo.checkValidity();
    if (campo.minLength > 0 && valor.length < campo.minLength) valido = false;
    campo.classList.toggle("is-valid", valido);
    campo.classList.toggle("is-invalid", !valido);
    return valido;
}
