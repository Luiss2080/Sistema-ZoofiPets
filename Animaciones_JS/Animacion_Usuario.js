// Escapa texto antes de insertarlo en innerHTML para evitar XSS: si un
// nombre de mascota, motivo de consulta, diagnostico, etc. contuviera
// "<script>" u otro marcado, se mostraria como texto plano en vez de
// ejecutarse en el navegador de quien vea la tabla.
function escapeHtml(valor) {
    if (valor === null || valor === undefined) return '';
    return String(valor)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

/* ----------- FORMULARIO PROFORMA CON DESPLAZAMIENTO ---------- */

// Animación para mostrar u ocultar el formulario
const toggleButton = document.querySelector('.toggle-form');
const formContainer = document.querySelector('.proforma-form-container');

// Evento para alternar la clase 'open' y mostrar/ocultar el formulario
toggleButton.addEventListener('click', () => {
    formContainer.classList.toggle('open'); // Alterna visibilidad del formulario
    toggleButton.classList.toggle('open');  // Alterna la apariencia del botón
});

document.addEventListener("DOMContentLoaded", () => {
    const toggleForm = document.querySelector(".toggle-form");

    // Evento que cambia la clase 'active' al hacer clic en el botón
    toggleForm.addEventListener("click", () => {
        toggleForm.classList.toggle("active"); // Activa/desactiva el estado visual del botón
    });
});





// Animacion_Compras.js  CONTENEDOR 2
document.addEventListener('DOMContentLoaded', () => {
    const toggleTitle = document.querySelector('.form-section2 h2');
    const tableContainer = document.querySelector('.proforma-form-container2');

    const toggleTableVisibility = () => {
        const isCollapsed = tableContainer.classList.toggle('collapsed');

        if (isCollapsed) {
            tableContainer.style.maxHeight = '0';
            tableContainer.style.overflow = 'hidden';
        } else {
            tableContainer.style.maxHeight = `${tableContainer.scrollHeight}px`;
            tableContainer.style.overflow = 'visible';
        }

        toggleTitle.classList.toggle('active');
        toggleTitle.innerHTML = isCollapsed
            ? 'Ver Ingreso 📝 ▼'
            : 'Ver Ingreso 📝 ▲';
    };

    if (toggleTitle && tableContainer) {
        toggleTitle.style.cursor = 'pointer';
        toggleTitle.innerHTML = 'Ver Ingreso 📝 ▼';
        toggleTitle.addEventListener('click', toggleTableVisibility);

        tableContainer.classList.add('collapsed');
        tableContainer.style.maxHeight = '0';
        tableContainer.style.overflow = 'hidden';
    }
});

/* ----------- FORMULARIO PROFORMA CON DESPLAZAMIENTO ---------- */

// Función para verificar si las contraseñas coinciden
document.getElementById('Confirmar_Contraseña').addEventListener('input', function() {
    const pass = document.getElementById('Contraseña').value;    // Obtiene la contraseña
    const confirmPass = this.value;                                // Obtiene la contraseña confirmada
    const mensaje = document.getElementById('mensaje');            // Obtiene el mensaje de verificación

    // Verifica si las contraseñas coinciden y muestra el mensaje correspondiente
    if (pass !== confirmPass) {
        mensaje.style.color = 'red'; // Si no coinciden, muestra mensaje de error
        mensaje.textContent = 'Las contraseñas no coinciden';
    } else {
        mensaje.style.color = 'green'; // Si coinciden, muestra mensaje de éxito
        mensaje.textContent = 'Las contraseñas coinciden';
    }
});

/* ----------- FORMULARIO PROFORMA CON DESPLAZAMIENTO ---------- */

// Establece la fecha actual como fecha de registro por defecto
document.getElementById('Fecha_Registro').valueAsDate = new Date();  // Asigna la fecha actual al campo de fecha de registro

/* ----------- FORMULARIO PROFORMA CON DESPLAZAMIENTO ---------- */

// Función para agregar más campos de teléfono
function agregarTelefono() {
    const container = document.getElementById('telefonosContainer');  // Obtiene el contenedor de teléfonos
    const div = document.createElement('div');  // Crea un nuevo div para el campo de teléfono
    div.innerHTML = `
        <input type="tel" name="Telefonos[]" placeholder="Teléfono" pattern="[0-9]{8,}" title="Ingrese al menos 8 dígitos">
        <button type="button" onclick="this.parentElement.remove()" class="remove-button">Eliminar</button>
    `;
    container.appendChild(div);  // Añade el nuevo campo al contenedor de teléfonos
}

/* ----------- FORMULARIO PROFORMA CON DESPLAZAMIENTO ---------- */

// Función para agregar más campos de email
function agregarEmail() {
    const container = document.getElementById('emailsContainer');  // Obtiene el contenedor de emails
    const div = document.createElement('div');  // Crea un nuevo div para el campo de email
    div.innerHTML = `
        <input type="email" name="Emails[]" placeholder="Email">
        <button type="button" onclick="this.parentElement.remove()" class="remove-button">Eliminar</button>
    `;
    container.appendChild(div);  // Añade el nuevo campo al contenedor de emails
}

/* ----------- FORMULARIO PROFORMA CON DESPLAZAMIENTO ---------- */

// Función para verificar el estado del login al cargar la página
document.addEventListener('DOMContentLoaded', function() {
    const isLoggedIn = localStorage.getItem('isLoggedIn');  // Verifica si el usuario está logueado
    const currentPage = window.location.pathname.split('/').pop();  // Obtiene la página actual

    if (!isLoggedIn) {
        // Si no está logueado y no está en la página de Capa_Proforma, muestra el login
        if (currentPage !== './Capa_Proforma') {
            document.getElementById('loginLayer').style.transform = 'translateX(0)';
            document.getElementById('mainLayer').style.transform = 'translateX(100%)';
        }
    } else {
        checkLoginState();  // Verifica el estado del login
        if (currentPage === './Capa_Proforma') {
            // Si está logueado y está en Capa_Proforma, muestra el contenido principal
            document.getElementById('loginLayer').style.transform = 'translateX(-100%)';
            document.getElementById('mainLayer').style.transform = 'translateX(0)';
        }
    }
    setupEventListeners();  // Configura los eventos de los elementos
});

/* ----------- FORMULARIO PROFORMA CON DESPLAZAMIENTO ---------- */

// Función para verificar el estado del login
function checkLoginState() {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    const username = localStorage.getItem('username');  // Obtiene el nombre de usuario

    // Si el usuario está logueado, actualiza la interfaz con el nombre del usuario
    if (isLoggedIn === 'true' && username) {
        document.getElementById('userDisplay').textContent = username;
        document.getElementById('loginLayer').style.transform = 'translateX(-100%)';
        document.getElementById('mainLayer').style.transform = 'translateX(0)';
    }
}

/* ----------- FORMULARIO PROFORMA CON DESPLAZAMIENTO ---------- */

// Función de login
function login() {
    const username = document.getElementById('username').value;  // Obtiene el nombre de usuario
    const password = document.getElementById('password').value;  // Obtiene la contraseña

    // Si el nombre de usuario y la contraseña son válidos, realiza el login
    if (username && password) {
        localStorage.setItem('isLoggedIn', 'true');  // Establece que el usuario está logueado
        localStorage.setItem('username', username);  // Guarda el nombre de usuario

        document.getElementById('userDisplay').textContent = username;  // Muestra el nombre del usuario
        document.getElementById('loginLayer').style.transform = 'translateX(-100%)';
        document.getElementById('mainLayer').style.transform = 'translateX(0)';

        // Redirige a la página de proforma después de un login exitoso
        window.location.href = '../Capa_Proforma.html';
    } else {
        alert('Por favor ingrese usuario y contraseña');
    }
}

/* ----------- FORMULARIO PROFORMA CON DESPLAZAMIENTO ---------- */

// Función de logout
function logout() {
    localStorage.removeItem('isLoggedIn');  // Elimina el estado de login
    localStorage.removeItem('username');  // Elimina el nombre de usuario
    window.location.href = '../index.html';  // Redirige al inicio después de logout
}

/* ----------- FORMULARIO PROFORMA CON DESPLAZAMIENTO ---------- */

// Verifica la sesión al cargar la página
window.onload = function() {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (!isLoggedIn) {
        window.location.href = 'index.html';  // Si no está logueado, redirige a la página de login
    }
}




/* ----------- FORMULARIO PROFORMA CON DESPLAZAMIENTO ---------- */

// Función para navegar a la proforma
function navegarProforma(event) {
    event.preventDefault();
    // Verifica si el usuario está logueado antes de redirigir
    if (localStorage.getItem('isLoggedIn') === 'true') {
        window.location.href = 'Formularios.html/FORM_Clientes.html';
    }
}

/* ----------- FORMULARIO PROFORMA CON DESPLAZAMIENTO ---------- */

// Función para manejar la visibilidad de las secciones
function toggleSectionVisibility(sectionToShow) {
    // Ocultar todas las secciones excepto la barra superior
    const sections = document.querySelectorAll('.main-content > div:not(.top-bar)');
    sections.forEach(section => {
        section.style.display = 'none';
    });

    // Mostrar la sección solicitada
    if (sectionToShow) {
        sectionToShow.style.display = 'block';
    }
}

/* ----------- FORMULARIO PROFORMA CON DESPLAZAMIENTO ---------- */

// Configuración de los event listeners
function setupEventListeners() {
    const sidebar = document.querySelector('.sidebar');
    const mainContent = document.querySelector('.main-content');
    let activeSubmenu = null;
    
    // Función para cerrar todos los submenús
    function closeAllSubmenus() {
        document.querySelectorAll('.submenu.active').forEach(submenu => {
            submenu.classList.remove('active');
            const arrow = submenu.parentElement.querySelector('.arrow');
            if (arrow) arrow.classList.remove('active');
        });
    }

    // Click en los items del menú
    document.querySelectorAll('.menu-item').forEach(item => {
        item.addEventListener('click', function(e) {
            e.stopPropagation();
            
            // Si el sidebar está colapsado, primero lo expandimos
            if (!sidebar.classList.contains('expanded')) {
                sidebar.classList.add('expanded');
                mainContent.classList.add('expanded');
                return;
            }

            // Si es el menú de inicio, navegamos a capa_proforma.html
            if (this.id === 'menuInicio') {
                // Verifica si el usuario está logueado antes de redirigir
                if (localStorage.getItem('isLoggedIn') === 'true') {
                    window.location.href = '/capa_proforma.html';
                } else {
                    alert('Debe iniciar sesión primero');
                }
                return;
            }

            // Manejo de submenús
            const submenu = this.parentElement.querySelector('.submenu');
            const arrow = this.querySelector('.arrow');

            if (submenu) {
                // Si hay un submenú activo diferente, lo cerramos
                if (activeSubmenu && activeSubmenu !== submenu) {
                    activeSubmenu.classList.remove('active');
                    const activeArrow = activeSubmenu.parentElement.querySelector('.arrow');
                    if (activeArrow) activeArrow.classList.remove('active');
                }

                // Toggle del submenú actual
                submenu.classList.toggle('active');
                if (arrow) arrow.classList.toggle('active');
                
                activeSubmenu = submenu.classList.contains('active') ? submenu : null;
            }
        });
    });

    // Click fuera del sidebar para colapsarlo
    document.addEventListener('click', function(e) {
        if (!sidebar.contains(e.target) && !e.target.matches('#menu-toggle')) {
            sidebar.classList.remove('expanded');
            mainContent.classList.remove('expanded');
            closeAllSubmenus();
        }
    });

    // Toggle del menú hamburguesa
    document.getElementById('menu-toggle').addEventListener('click', function(e) {
        e.stopPropagation();
        sidebar.classList.toggle('expanded');
        mainContent.classList.toggle('expanded');
        if (!sidebar.classList.contains('expanded')) {
            closeAllSubmenus();
        }
    });

    // Prevenir cierre del sidebar al hacer click en submenús
    document.querySelectorAll('.submenu').forEach(submenu => {
        submenu.addEventListener('click', function(e) {
            e.stopPropagation();
        });
    });

    // Manejo de enlaces
    document.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', function(e) {
            // Si el usuario no está logueado, prevenimos la acción
            if (localStorage.getItem('isLoggedIn') !== 'true') {
                e.preventDefault();
                alert('Debe iniciar sesión primero');
            }
        });
    });

    // Prevenir que el click en los submenús propague al menú principal
    document.querySelectorAll('.submenu li').forEach(item => {
        item.addEventListener('click', function(e) {
            e.stopPropagation();
        });
    });

    // Ejemplo: Desplazar al final del contenido
    const welcomeSection = document.querySelector('.welcome-section');
    welcomeSection.scrollTop = welcomeSection.scrollHeight;
}

// Renderizar la tabla de usuarios
function renderizarTabla(usuarios) {
    const tableBody = document.getElementById('usuarioTableBody');
    tableBody.innerHTML = ''; // Limpiar la tabla antes de renderizar

    usuarios.forEach(usuario => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${escapeHtml(usuario.Codigo_Usuario || '---')}</td>
            <td>${escapeHtml(usuario.Nombre_Usuario || '---')}</td>
            <td>${escapeHtml(usuario.Correo_Institucional || '---')}</td>
            <td>${escapeHtml(usuario.Estado_Usuario || '---')}</td>
            <td>${escapeHtml(usuario.Fecha_Creacion || '---')}</td>
            <td>${escapeHtml(usuario.Telefonos ? usuario.Telefonos.join(', ') : '---')}</td>
            <td>${escapeHtml(usuario.Emails ? usuario.Emails.join(', ') : '---')}</td>
        `;
        tableBody.appendChild(row); // Agregar la fila a la tabla
    });
}

// Evento al cargar la página
document.addEventListener('DOMContentLoaded', () => {
    cargarDatosIniciales(); // Cargar datos iniciales al cargar la página

    // Búsqueda en tiempo real
    document.querySelector('.buscar-input').addEventListener('input', (e) => {
        const termino = e.target.value.toLowerCase(); // Obtener el término de búsqueda
        const usuarios = JSON.parse(localStorage.getItem('registeredUsuarios') || '[]'); // Obtener usuarios del localStorage

        // Filtrar usuarios que coincidan con el término de búsqueda
        const filtradas = usuarios.filter(usuario => 
            Object.values(usuario).some(valor => 
                String(valor).toLowerCase().includes(termino)
            )
        );

        renderizarTabla(filtradas); // Renderizar la tabla con los resultados filtrados
    });
});