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

// Agrega evento de clic al botón para abrir o cerrar el formulario
toggleButton.addEventListener('click', () => {
    formContainer.classList.toggle('open'); // Toggle la clase 'open' en el formulario
    toggleButton.classList.toggle('open');  // Toggle la clase 'open' en el botón
});

// Cambia el estado del botón al hacer clic
document.addEventListener("DOMContentLoaded", () => {
    const toggleForm = document.querySelector(".toggle-form");

    toggleForm.addEventListener("click", () => {
        toggleForm.classList.toggle("active"); // Activa o desactiva la clase 'active'
    });
});

/* ----------- FORMULARIO PROFORMA CON DESPLAZAMIENTO ---------- */

// Función para verificar el estado del login al cargar la página
document.addEventListener('DOMContentLoaded', function() {
    const isLoggedIn = localStorage.getItem('isLoggedIn'); // Verifica si el usuario está logueado
    const currentPage = window.location.pathname.split('/').pop(); // Obtiene el nombre de la página actual

    if (!isLoggedIn) {
        // Si no está logueado, muestra la capa de login
        if (currentPage !== './Capa_Proforma') {
            document.getElementById('loginLayer').style.transform = 'translateX(0)';
            document.getElementById('mainLayer').style.transform = 'translateX(100%)';
        }
    } else {
        checkLoginState(); // Verifica el estado del login
        // Si está logueado y en la página principal, muestra el contenido
        if (currentPage === './Capa_Proforma') {
            document.getElementById('loginLayer').style.transform = 'translateX(-100%)';
            document.getElementById('mainLayer').style.transform = 'translateX(0)';
        }
    }
    setupEventListeners(); // Configura los event listeners
});

/* ----------- FORMULARIO PROFORMA CON DESPLAZAMIENTO ---------- */

// Función para verificar el estado del login
function checkLoginState() {
    const isLoggedIn = localStorage.getItem('isLoggedIn'); // Verifica si el usuario está logueado
    const username = localStorage.getItem('username');     // Obtiene el nombre de usuario

    if (isLoggedIn === 'true' && username) {
        document.getElementById('userDisplay').textContent = username; // Muestra el nombre de usuario
        document.getElementById('loginLayer').style.transform = 'translateX(-100%)';
        document.getElementById('mainLayer').style.transform = 'translateX(0)';
    }
}

/* ----------- FORMULARIO PROFORMA CON DESPLAZAMIENTO ---------- */

// Función de login
function login() {
    const username = document.getElementById('username').value; // Obtiene el nombre de usuario
    const password = document.getElementById('password').value; // Obtiene la contraseña

    if (username && password) {
        localStorage.setItem('isLoggedIn', 'true');  // Marca al usuario como logueado
        localStorage.setItem('username', username);  // Guarda el nombre de usuario

        document.getElementById('userDisplay').textContent = username; // Muestra el nombre de usuario
        document.getElementById('loginLayer').style.transform = 'translateX(-100%)';
        document.getElementById('mainLayer').style.transform = 'translateX(0)';

        // Redirige a la página principal después de un login exitoso
        window.location.href = '../Capa_Proforma.html';
    } else {
        alert('Por favor ingrese usuario y contraseña'); // Si no hay usuario o contraseña
    }
}

/* ----------- FORMULARIO PROFORMA CON DESPLAZAMIENTO ---------- */

// Función de logout
function logout() {
    localStorage.removeItem('isLoggedIn'); // Elimina el estado de login
    localStorage.removeItem('username');   // Elimina el nombre de usuario
    window.location.href = '../index.html'; // Redirige a la página principal
}

/* ----------- FORMULARIO PROFORMA CON DESPLAZAMIENTO ---------- */

// Función para verificar la sesión al cargar la página
window.onload = function() {
    const isLoggedIn = localStorage.getItem('isLoggedIn'); // Verifica si está logueado
    if (!isLoggedIn) {
        window.location.href = 'index.html'; // Si no está logueado, redirige al login
    }
}

/* ----------- FORMULARIO PROFORMA CON DESPLAZAMIENTO ---------- */



/* ----------- FORMULARIO PROFORMA CON DESPLAZAMIENTO ---------- */

// Función para manejar la visibilidad de las secciones
function toggleSectionVisibility(sectionToShow) {
    const sections = document.querySelectorAll('.main-content > div:not(.top-bar)'); // Selecciona todas las secciones
    sections.forEach(section => {
        section.style.display = 'none'; // Oculta todas las secciones
    });

    // Muestra la sección solicitada
    if (sectionToShow) {
        sectionToShow.style.display = 'block'; // Muestra la sección indicada
    }
}





/* ----------- FORMULARIO PROFORMA CON DESPLAZAMIENTO ---------- */

// Configuración de los event listeners
function setupEventListeners() {
    const sidebar = document.querySelector('.sidebar'); // Referencia al sidebar
    const mainContent = document.querySelector('.main-content'); // Referencia al contenido principal
    let activeSubmenu = null; // Variable para almacenar el submenú activo
    
    // Función para cerrar todos los submenús activos
    function closeAllSubmenus() {
        document.querySelectorAll('.submenu.active').forEach(submenu => {
            submenu.classList.remove('active'); // Eliminar clase 'active' de todos los submenús
            const arrow = submenu.parentElement.querySelector('.arrow');
            if (arrow) arrow.classList.remove('active'); // Eliminar clase 'active' de las flechas
        });
    }

    // Click en los items del menú
    document.querySelectorAll('.menu-item').forEach(item => {
        item.addEventListener('click', function(e) {
            e.stopPropagation(); // Prevenir propagación del evento
            
            // Si el sidebar está colapsado, expandirlo
            if (!sidebar.classList.contains('expanded')) {
                sidebar.classList.add('expanded'); // Expandir sidebar
                mainContent.classList.add('expanded'); // Expandir contenido principal
                return;
            }

            // Si es el menú de inicio, navegar a capa_proforma.html si está logueado
            if (this.id === 'menuInicio') {
                if (localStorage.getItem('isLoggedIn') === 'true') {
                    window.location.href = '/capa_proforma.html'; // Redirigir si está logueado
                } else {
                    alert('Debe iniciar sesión primero'); // Avisar si no está logueado
                }
                return;
            }

            // Manejo de submenús
            const submenu = this.parentElement.querySelector('.submenu');
            const arrow = this.querySelector('.arrow');

            if (submenu) {
                // Si hay un submenú activo diferente, cerrarlo
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
            sidebar.classList.remove('expanded'); // Colapsar sidebar
            mainContent.classList.remove('expanded'); // Colapsar contenido principal
            closeAllSubmenus(); // Cerrar submenús abiertos
        }
    });

    // Toggle del menú hamburguesa
    document.getElementById('menu-toggle').addEventListener('click', function(e) {
        e.stopPropagation(); // Prevenir propagación del evento
        sidebar.classList.toggle('expanded'); // Expande o colapsa el sidebar
        mainContent.classList.toggle('expanded'); // Expande o colapsa el contenido principal
        if (!sidebar.classList.contains('expanded')) {
            closeAllSubmenus(); // Cerrar submenús si el sidebar se colapsa
        }
    });

    // Prevenir cierre del sidebar al hacer click en submenús
    document.querySelectorAll('.submenu').forEach(submenu => {
        submenu.addEventListener('click', function(e) {
            e.stopPropagation(); // Prevenir propagación del evento
        });
    });

    // Manejo de enlaces
    document.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', function(e) {
            // Si no está logueado, prevenir la acción y mostrar mensaje
            if (localStorage.getItem('isLoggedIn') !== 'true') {
                e.preventDefault(); // Prevenir la acción del enlace
                alert('Debe iniciar sesión primero'); // Avisar que se debe iniciar sesión
            }
        });
    });

    // Prevenir que el click en los submenús propague al menú principal
    document.querySelectorAll('.submenu li').forEach(item => {
        item.addEventListener('click', function(e) {
            e.stopPropagation(); // Prevenir propagación del evento
        });
    });

    // Ejemplo: Desplazar al final del contenido
    const welcomeSection = document.querySelector('.welcome-section');
    welcomeSection.scrollTop = welcomeSection.scrollHeight; // Desplazar al final del contenido de bienvenida
}

//-----------------------------------------------------------------------------------------------------------------------

// Animacion_Servicios.js
document.addEventListener('DOMContentLoaded', function() {
    // Primero manejamos la animación del desplegable
    const initializeToggle = () => {
        const toggleTitle = document.querySelector('.form-section2 h2');
        const tableContainer = document.querySelector('.proforma-form-container2');
        
        // Establecer estado inicial
        tableContainer.style.overflow = 'hidden';
        tableContainer.style.transition = 'max-height 0.3s ease-out';
        tableContainer.style.maxHeight = '0';
        
        // Función de toggle
        const toggleTableVisibility = () => {
            const isCollapsed = tableContainer.style.maxHeight === '0px';
            
            if (isCollapsed) {
                tableContainer.style.maxHeight = tableContainer.scrollHeight + 'px';
                toggleTitle.innerHTML = 'Ver Ingreso 📝 ▲';
            } else {
                tableContainer.style.maxHeight = '0px';
                toggleTitle.innerHTML = 'Ver Ingreso 📝 ▼';
            }
            
            toggleTitle.classList.toggle('active');
        };

        // Configurar toggle
        if (toggleTitle && tableContainer) {
            toggleTitle.style.cursor = 'pointer';
            toggleTitle.innerHTML = 'Ver Ingreso 📝 ▼';
            toggleTitle.addEventListener('click', toggleTableVisibility);
        }
    };

    // Luego manejamos la carga y renderizado de datos
    const cargarDatosInicialesServicios = () => {
        const servicios = JSON.parse(localStorage.getItem('registeredServicios') || '[]');
        const urlParams = new URLSearchParams(window.location.search);
        const nuevoServicio = urlParams.get('nuevo_servicio');

        if (nuevoServicio) {
            const servicioData = JSON.parse(decodeURIComponent(nuevoServicio));
            servicios.push(servicioData);
            localStorage.setItem('registeredServicios', JSON.stringify(servicios));
            window.history.replaceState({}, document.title, window.location.pathname);
        }

        renderizarTablaServicios(servicios);
    };

    const renderizarTablaServicios = (servicios) => {
        const tableBody = document.getElementById('servicioTableBody');
        tableBody.innerHTML = '';
        
        servicios.forEach(servicio => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${escapeHtml(servicio.Especialidades || '---')}</td>
                <td>${escapeHtml(servicio.Especialista || '---')}</td>
                <td>${servicio.Precio ? `S/ ${escapeHtml(parseFloat(servicio.Precio).toFixed(2))}` : '---'}</td>
                <td>${escapeHtml(servicio.Duracion_Estimada || '---')}</td>
                <td>${escapeHtml(servicio.Categoria || '---')}</td>
                <td>${escapeHtml(servicio.Turno || '---')}</td>
                <td>${escapeHtml(servicio.Cod_Mascotas || '---')}</td>
                <td>${escapeHtml(servicio.Cod_Historial || '---')}</td>
            `;
            tableBody.appendChild(row);
        });
    };

    // Inicializar todo
    initializeToggle();
    cargarDatosInicialesServicios();
    
    // Configurar búsqueda en tiempo real
    const searchInput = document.querySelector('.buscar-input');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const termino = e.target.value.toLowerCase();
            const servicios = JSON.parse(localStorage.getItem('registeredServicios') || '[]');
            const filtrados = servicios.filter(servicio => 
                Object.values(servicio).some(valor => 
                    String(valor).toLowerCase().includes(termino)
                )
            );
            renderizarTablaServicios(filtrados);
        });
    }
});