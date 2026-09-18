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

toggleButton.addEventListener('click', () => {
    // Alterna la visibilidad del formulario y el botón
    formContainer.classList.toggle('open');
    toggleButton.classList.toggle('open');
});

// Evento para manejar el estado del botón en el DOM
document.addEventListener("DOMContentLoaded", () => {
    const toggleForm = document.querySelector(".toggle-form");

    // Cambia el estado visual del botón cuando es presionado
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



/* ----------- VERIFICACIÓN Y MANEJO DEL LOGIN ---------- */

// Función para verificar el estado del login al cargar la página
document.addEventListener('DOMContentLoaded', function() {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    const currentPage = window.location.pathname.split('/').pop();

    if (!isLoggedIn) {
        // Si no está logueado, muestra la capa de login
        if (currentPage !== './Capa_Proforma') {
            document.getElementById('loginLayer').style.transform = 'translateX(0)';
            document.getElementById('mainLayer').style.transform = 'translateX(100%)';
        }
    } else {
        checkLoginState();
        if (currentPage === './Capa_Proforma') {
            document.getElementById('loginLayer').style.transform = 'translateX(-100%)';
            document.getElementById('mainLayer').style.transform = 'translateX(0)';
        }
    }
    setupEventListeners();
});

// Función para verificar el estado del login
function checkLoginState() {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    const username = localStorage.getItem('username');

    if (isLoggedIn === 'true' && username) {
        // Muestra el nombre de usuario en la página
        document.getElementById('userDisplay').textContent = username;
        document.getElementById('loginLayer').style.transform = 'translateX(-100%)';
        document.getElementById('mainLayer').style.transform = 'translateX(0)';
    }
}

// Función de login
function login() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    if (username && password) {
        // Almacena el estado del login y el nombre de usuario
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('username', username);

        document.getElementById('userDisplay').textContent = username;
        document.getElementById('loginLayer').style.transform = 'translateX(-100%)';
        document.getElementById('mainLayer').style.transform = 'translateX(0)';

        // Redirige a la página de la proforma después del login exitoso
        window.location.href = '../Capa_Proforma.html';
    } else {
        alert('Por favor ingrese usuario y contraseña');
    }
}

/* ----------- FUNCIONALIDAD DE LOGOUT ---------- */

// Función de logout
function logout() {
    // Elimina los datos de sesión y redirige a la página de inicio
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('username');
    window.location.href = '../index.html';
}

// Función de verificación de sesión al cargar la página
window.onload = function() {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (!isLoggedIn) {
        window.location.href = 'index.html';
    }
}


/* ----------- NAVEGACIÓN Y VISIBILIDAD DE SECCIONES ---------- */

// Función para navegar a la proforma
function navegarProforma(event) {
    event.preventDefault();
    if (localStorage.getItem('isLoggedIn') === 'true') {
        // Redirige a la página de formulario de clientes si está logueado
        window.location.href = 'Formularios.html/FORM_Clientes.html';
    }
}

// Función para manejar la visibilidad de las secciones
function toggleSectionVisibility(sectionToShow) {
    // Oculta todas las secciones excepto la barra superior
    const sections = document.querySelectorAll('.main-content > div:not(.top-bar)');
    sections.forEach(section => {
        section.style.display = 'none';
    });

    // Muestra la sección solicitada
    if (sectionToShow) {
        sectionToShow.style.display = 'block';
    }
}



/* ----------- FORMULARIO PROFORMA CON DESPLAZAMIENTO ---------- */

// Configuración de los event listeners para el menú y submenús
function setupEventListeners() {
    const sidebar = document.querySelector('.sidebar');  // Sidebar de navegación
    const mainContent = document.querySelector('.main-content');  // Contenido principal
    let activeSubmenu = null;  // Submenú activo, inicialmente ninguno

    // Función para cerrar todos los submenús activos
    function closeAllSubmenus() {
        document.querySelectorAll('.submenu.active').forEach(submenu => {
            submenu.classList.remove('active');  // Cerramos submenús
            const arrow = submenu.parentElement.querySelector('.arrow');
            if (arrow) arrow.classList.remove('active');  // Removemos la flecha activa
        });
    }

    /* ----------- MANEJO DE CLIC EN ELEMENTOS DEL MENÚ ---------- */
    // Se añade un event listener a cada item del menú
    document.querySelectorAll('.menu-item').forEach(item => {
        item.addEventListener('click', function(e) {
            e.stopPropagation();  // Prevenimos que el click se propague

            // Si el sidebar está colapsado, lo expandimos
            if (!sidebar.classList.contains('expanded')) {
                sidebar.classList.add('expanded');
                mainContent.classList.add('expanded');
                return;
            }

            // Si se hace clic en el menú de inicio, se verifica si está logueado y se navega
            if (this.id === 'menuInicio') {
                if (localStorage.getItem('isLoggedIn') === 'true') {
                    window.location.href = '/capa_proforma.html';  // Redirección a la página de proforma
                } else {
                    alert('Debe iniciar sesión primero');  // Alerta si no está logueado
                }
                return;
            }

            /* ----------- MANEJO DE SUBMENÚS ---------- */
            const submenu = this.parentElement.querySelector('.submenu');  // Buscamos el submenú correspondiente
            const arrow = this.querySelector('.arrow');  // Buscamos la flecha que indica el submenú abierto

            if (submenu) {
                // Si hay un submenú activo diferente, lo cerramos
                if (activeSubmenu && activeSubmenu !== submenu) {
                    activeSubmenu.classList.remove('active');
                    const activeArrow = activeSubmenu.parentElement.querySelector('.arrow');
                    if (activeArrow) activeArrow.classList.remove('active');
                }

                // Alternamos la visibilidad del submenú actual y la flecha
                submenu.classList.toggle('active');
                if (arrow) arrow.classList.toggle('active');
                
                // Establecemos el submenú activo
                activeSubmenu = submenu.classList.contains('active') ? submenu : null;
            }
        });
    });

    /* ----------- CLIC FUERA DEL SIDEBAR ---------- */
    // Si se hace clic fuera del sidebar, se colapsa
    document.addEventListener('click', function(e) {
        if (!sidebar.contains(e.target) && !e.target.matches('#menu-toggle')) {
            sidebar.classList.remove('expanded');  // Colapsamos el sidebar
            mainContent.classList.remove('expanded');  // Colapsamos el contenido principal
            closeAllSubmenus();  // Cerramos todos los submenús
        }
    });

    /* ----------- MANEJO DEL MENÚ HAMBURGUESA ---------- */
    // Se añade un event listener al botón del menú hamburguesa
    document.getElementById('menu-toggle').addEventListener('click', function(e) {
        e.stopPropagation();  // Prevenimos la propagación del evento
        sidebar.classList.toggle('expanded');  // Alternamos la visibilidad del sidebar
        mainContent.classList.toggle('expanded');  // Alternamos la visibilidad del contenido principal
        if (!sidebar.classList.contains('expanded')) {
            closeAllSubmenus();  // Si se colapsa el sidebar, cerramos todos los submenús
        }
    });

    /* ----------- PREVENIR CIERRE AL HACER CLIC EN LOS SUBMENÚS ---------- */
    // Prevenimos que al hacer clic en un submenú este cierre automáticamente
    document.querySelectorAll('.submenu').forEach(submenu => {
        submenu.addEventListener('click', function(e) {
            e.stopPropagation();  // Prevenimos que el clic se propague
        });
    });

    /* ----------- MANEJO DE ENLACES DE NAVEGACIÓN ---------- */
    // Si no está logueado, evitamos la navegación y mostramos una alerta
    document.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', function(e) {
            if (localStorage.getItem('isLoggedIn') !== 'true') {
                e.preventDefault();  // Prevenimos la navegación
                alert('Debe iniciar sesión primero');  // Alerta si no está logueado
            }
        });
    });

    /* ----------- PREVENIR CIERRE AL HACER CLIC EN LOS ITEMS DEL SUBMENÚ ---------- */
    // Prevenimos que el clic en los submenús propague al menú principal
    document.querySelectorAll('.submenu li').forEach(item => {
        item.addEventListener('click', function(e) {
            e.stopPropagation();  // Prevenimos que el clic se propague
        });
    });

    /* ----------- EJEMPLO DE DESPLAZAMIENTO AL FINAL DE LA SECCIÓN ---------- */
    // Desplazamos la vista hasta el final de la sección de bienvenida
    const welcomeSection = document.querySelector('.welcome-section');
    welcomeSection.scrollTop = welcomeSection.scrollHeight;  // Desplazamiento hacia abajo
}


//----------------------------------------------------------------------------------------------

// Cargar datos iniciales
function cargarDatosIniciales() {
    const permisos = JSON.parse(localStorage.getItem('registeredPermisos') || '[]');
    const urlParams = new URLSearchParams(window.location.search);
    const nuevoPermiso = urlParams.get('nuevo_permiso');

    if (nuevoPermiso) {
        const permisoData = JSON.parse(decodeURIComponent(nuevoPermiso));
        permisos.push(permisoData);
        localStorage.setItem('registeredPermisos', JSON.stringify(permisos));
        window.history.replaceState({}, document.title, window.location.pathname);
    }

    renderizarTabla(permisos);
};

// Función de renderizado
function renderizarTabla(permisos) {
    const tableBody = document.getElementById('permisoTableBody');
    tableBody.innerHTML = '';
    permisos.forEach(permiso => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${escapeHtml(permiso.Mascota_Cliente || '---')}</td>
            <td>${escapeHtml(permiso.Diagnostico || '---')}</td>
            <td>${escapeHtml(permiso.Tratamiento || '---')}</td>
            <td>${escapeHtml(permiso.Especialidades || '---')}</td>
            <td>${escapeHtml(permiso.Pronostico_Final || '---')}</td>
            <td>${escapeHtml(permiso.Cod_Mascotas || '---')}</td>
        `;
        tableBody.appendChild(row);
    });
}

// Evento al cargar la página
document.addEventListener('DOMContentLoaded', () => {
    cargarDatosIniciales();
    
    // Búsqueda en tiempo real
    document.querySelector('.buscar-input').addEventListener('input', (e) => {
        const termino = e.target.value.toLowerCase();
        const permisos = JSON.parse(localStorage.getItem('registeredPermisos') || '[]');
        const filtradas = permisos.filter(permiso => 
            Object.values(permiso).some(valor => 
                String(valor).toLowerCase().includes(termino)
            )
        );
        renderizarTabla(filtradas);
    });
});