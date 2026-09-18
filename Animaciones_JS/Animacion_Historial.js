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

// Evento para alternar la visibilidad del formulario
// Agrega o elimina la clase 'open' al contenedor del formulario
// Cambia también el estado visual del botón toggle

toggleButton.addEventListener('click', () => {
    formContainer.classList.toggle('open');
    toggleButton.classList.toggle('open');
});

// Evento que se ejecuta al cargar el DOM
// Permite inicializar comportamientos relacionados con la animación del formulario

document.addEventListener("DOMContentLoaded", () => {
    const toggleForm = document.querySelector(".toggle-form");

    toggleForm.addEventListener("click", () => {
        toggleForm.classList.toggle("active");
    });
});



// Animacion_Compras.js  CONTENEDOR 2
document.addEventListener('DOMContentLoaded', () => {
    // Elementos para el toggle
    const toggleTitle = document.querySelector('.form-section2 h2');
    const tableContainer = document.querySelector('.proforma-form-container2');
    
    // Función de toggle
    const toggleTableVisibility = () => {
        const isCollapsed = tableContainer.classList.toggle('collapsed');
        tableContainer.style.maxHeight = isCollapsed ? '0' : `${tableContainer.scrollHeight}px`;
        
        if (isCollapsed) {
            tableContainer.style.maxHeight = '0';
        } else {
            // Usamos scrollHeight para obtener la altura exacta del contenido
            tableContainer.style.maxHeight = `${tableContainer.scrollHeight}px`;
        }
        
        
         // Rotar el icono del título
        toggleTitle.classList.toggle('active');
        toggleTitle.innerHTML = isCollapsed 
            ? 'Ver Ingreso 📝 ▼' 
            : 'Ver Ingreso 📝 ▲';
    };

    // Configurar toggle si existen elementos
    if (toggleTitle && tableContainer) {
        toggleTitle.style.cursor = 'pointer';
        toggleTitle.innerHTML = 'Ver Ingreso 📝 ▼';
        toggleTitle.addEventListener('click', toggleTableVisibility);
    }
});


/* ----------- VERIFICACIÓN DEL ESTADO DE LOGIN ---------- */

// Función que se ejecuta al cargar la página
// Verifica si el usuario está logueado y redirige según el estado

document.addEventListener('DOMContentLoaded', function() {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    const currentPage = window.location.pathname.split('/').pop();

    if (!isLoggedIn) {
        if (currentPage !== './Capa_Plataforma') {
            document.getElementById('loginLayer').style.transform = 'translateX(0)';
            document.getElementById('mainLayer').style.transform = 'translateX(100%)';
        }
    } else {
        checkLoginState();
        if (currentPage === './Capa_Plataforma') {
            document.getElementById('loginLayer').style.transform = 'translateX(-100%)';
            document.getElementById('mainLayer').style.transform = 'translateX(0)';
        }
    }
    setupEventListeners();
});

// Función para verificar el estado del login
// Actualiza la interfaz dependiendo del estado almacenado en localStorage

function checkLoginState() {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    const username = localStorage.getItem('username');

    if (isLoggedIn === 'true' && username) {
        document.getElementById('userDisplay').textContent = username;
        document.getElementById('loginLayer').style.transform = 'translateX(-100%)';
        document.getElementById('mainLayer').style.transform = 'translateX(0)';
    }
}

/* ----------- FUNCIONES DE LOGIN Y LOGOUT ---------- */

// Función de login
// Almacena las credenciales en localStorage y redirige a la plataforma

function login() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    if (username && password) {
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('username', username);

        document.getElementById('userDisplay').textContent = username;
        document.getElementById('loginLayer').style.transform = 'translateX(-100%)';
        document.getElementById('mainLayer').style.transform = 'translateX(0)';

        window.location.href = '../Capa_Plataforma';
    } else {
        alert('Por favor ingrese usuario y contraseña');
    }
}

// Función de logout
// Elimina las credenciales del usuario y redirige a la página de inicio

function logout() {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('username');
    window.location.href = '../index.html';
}

// Verifica la sesión al cargar la página
// Redirige a la página de inicio si el usuario no está logueado

window.onload = function() {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (!isLoggedIn) {
        window.location.href = 'index.html';
    }
};

/* ----------- NAVEGACIÓN Y VISIBILIDAD DE SECCIONES ---------- */

// Función para navegar a la proforma
// Verifica si el usuario está logueado antes de redirigir a la página de formularios

function navegarProforma(event) {
    event.preventDefault();
    if (localStorage.getItem('isLoggedIn') === 'true') {
        window.location.href = 'Formularios.html/FORM_Clientes.html';
    }
}

// Función para manejar la visibilidad de las secciones
// Oculta todas las secciones excepto la barra superior y muestra la sección solicitada

function toggleSectionVisibility(sectionToShow) {
    const sections = document.querySelectorAll('.main-content > div:not(.top-bar)');
    sections.forEach(section => {
        section.style.display = 'none';
    });

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
    
    // Función para cerrar todos los submenús activos
    function closeAllSubmenus() {
        document.querySelectorAll('.submenu.active').forEach(submenu => {
            submenu.classList.remove('active');
            const arrow = submenu.parentElement.querySelector('.arrow');
            if (arrow) arrow.classList.remove('active');
        });
    }

    /* ----------- GESTIÓN DE MENÚ PRINCIPAL Y SUBMENÚS ---------- */
    // Click en los items del menú principal
    document.querySelectorAll('.menu-item').forEach(item => {
        item.addEventListener('click', function(e) {
            e.stopPropagation(); // Evita la propagación del click
            
            // Si el sidebar está colapsado, lo expandimos
            if (!sidebar.classList.contains('expanded')) {
                sidebar.classList.add('expanded');
                mainContent.classList.add('expanded');
                return;
            }

            // Si es el menú de inicio, navegamos a capa_proforma.html
            if (this.id === 'menuInicio') {
                if (localStorage.getItem('isLoggedIn') === 'true') {
                    window.location.href = '/capa_proforma.html'; // Redirige si está logueado
                } else {
                    alert('Debe iniciar sesión primero'); // Mensaje si no está logueado
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

                // Toggle del submenú actual (abrir/cerrar)
                submenu.classList.toggle('active');
                if (arrow) arrow.classList.toggle('active');
                
                // Establecer el submenú activo para futuras referencias
                activeSubmenu = submenu.classList.contains('active') ? submenu : null;
            }
        });
    });

    /* ----------- CIERRE DEL SIDEBAR AL HACER CLICK FUERA ---------- */
    // Click fuera del sidebar para colapsarlo y cerrar submenús
    document.addEventListener('click', function(e) {
        if (!sidebar.contains(e.target) && !e.target.matches('#menu-toggle')) {
            sidebar.classList.remove('expanded');
            mainContent.classList.remove('expanded');
            closeAllSubmenus(); // Cerrar todos los submenús
        }
    });

    /* ----------- TOGGLE DEL MENÚ HAMBURGUESA ---------- */
    // Manejo del botón para mostrar/ocultar el sidebar
    document.getElementById('menu-toggle').addEventListener('click', function(e) {
        e.stopPropagation(); // Evita la propagación del click
        sidebar.classList.toggle('expanded'); // Expande o colapsa el sidebar
        mainContent.classList.toggle('expanded'); // Expande o colapsa el contenido principal
        if (!sidebar.classList.contains('expanded')) {
            closeAllSubmenus(); // Cerrar submenús al colapsar el sidebar
        }
    });

    /* ----------- PREVENCIÓN DE CIERRE DEL SIDEBAR EN SUBMENÚS ---------- */
    // Prevenir cierre del sidebar al hacer click en submenús
    document.querySelectorAll('.submenu').forEach(submenu => {
        submenu.addEventListener('click', function(e) {
            e.stopPropagation(); // Evita que el click se propague al menú principal
        });
    });

    /* ----------- GESTIÓN DE ENLACES DE NAVEGACIÓN ---------- */
    // Verificación de sesión antes de permitir la navegación
    document.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', function(e) {
            if (localStorage.getItem('isLoggedIn') !== 'true') {
                e.preventDefault(); // Prevenir navegación si no está logueado
                alert('Debe iniciar sesión primero'); // Mensaje si no está logueado
            }
        });
    });

    // Prevenir la propagación del click en los elementos de los submenús
    document.querySelectorAll('.submenu li').forEach(item => {
        item.addEventListener('click', function(e) {
            e.stopPropagation(); // Evitar que el click se propague al menú principal
        });
    });

    /* ----------- DESPLAZAMIENTO AL FINAL DEL CONTENIDO ---------- */
    // Ejemplo: Desplazar al final de la sección de bienvenida
    const welcomeSection = document.querySelector('.welcome-section');
    welcomeSection.scrollTop = welcomeSection.scrollHeight; // Desplazamiento al final
}

//----------------------------------------------------------------------------------------------

function cargarDatosIniciales() {
    // Verifica si localStorage tiene datos, sino asigna un array vacío
    const historiales = JSON.parse(localStorage.getItem('registeredHistoriales') || '[]');
    const urlParams = new URLSearchParams(window.location.search);
    const nuevoHistorial = urlParams.get('nuevo_historial');

    if (nuevoHistorial) {
        // Intenta obtener los datos de 'nuevo_historial' si están presentes en la URL
        const historialData = JSON.parse(decodeURIComponent(nuevoHistorial));

        // Si los datos están presentes, agrégalo al array de historiales
        if (historialData && typeof historialData === 'object') {
            historiales.push(historialData);
            localStorage.setItem('registeredHistoriales', JSON.stringify(historiales)); // Guarda los datos
            window.history.replaceState({}, document.title, window.location.pathname);  // Limpia el parámetro en la URL
        }
    }

    renderizarTabla(historiales); // Renderiza la tabla con los historiales
}

// Función de renderizado
function renderizarTabla(historiales) {
    const tableBody = document.getElementById('historialTableBody');
    tableBody.innerHTML = '';  // Limpia la tabla antes de renderizarla

    historiales.forEach(historial => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${escapeHtml(historial.Mascota_Cliente || '---')}</td>
            <td>${escapeHtml(historial.Diagnostico || '---')}</td>
            <td>${escapeHtml(historial.Tratamiento || '---')}</td>
            <td>${escapeHtml(historial.Especialidades || '---')}</td>
            <td>${escapeHtml(historial.Pronostico_Final || '---')}</td>
            <td>${escapeHtml(historial.Cod_Mascotas || '---')}</td>
        `;
        tableBody.appendChild(row);
    });
}

// Evento al cargar la página
document.addEventListener('DOMContentLoaded', () => {
    cargarDatosIniciales();  // Carga los datos iniciales

    // Búsqueda en tiempo real
    document.querySelector('.buscar-input').addEventListener('input', (e) => {
        const termino = e.target.value.toLowerCase();  // Obtiene el término de búsqueda en minúsculas
        const historiales = JSON.parse(localStorage.getItem('registeredHistoriales') || '[]');
        const filtradas = historiales.filter(historial =>
            Object.values(historial).some(valor =>
                String(valor).toLowerCase().includes(termino)  // Filtra los historiales según el término
            )
        );
        renderizarTabla(filtradas);  // Renderiza los historiales filtrados
    });
});
