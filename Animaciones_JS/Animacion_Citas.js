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

// Al hacer clic en el botón, se alterna la clase 'open' para mostrar/ocultar el formulario
toggleButton.addEventListener('click', () => {
    formContainer.classList.toggle('open');
    toggleButton.classList.toggle('open');
});

// Función para agregar la clase activa al botón de formulario cuando se hace clic
document.addEventListener("DOMContentLoaded", () => {
    const toggleForm = document.querySelector(".toggle-form");
    toggleForm.addEventListener("click", () => {
        toggleForm.classList.toggle("active");
    });
});

/* ----------- FORMULARIO PROFORMA CON DESPLAZAMIENTO ---------- */

// Función para verificar el estado del login al cargar la página
document.addEventListener('DOMContentLoaded', function() {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    const currentPage = window.location.pathname.split('/').pop();

    // Si no está logueado, mostramos el loginLayer y escondemos el mainLayer
    if (!isLoggedIn) {
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

    // Si está logueado, actualizamos la vista con el nombre de usuario
    if (isLoggedIn === 'true' && username) {
        document.getElementById('userDisplay').textContent = username;
        document.getElementById('loginLayer').style.transform = 'translateX(-100%)';
        document.getElementById('mainLayer').style.transform = 'translateX(0)';
    }
}

/* ----------- FORMULARIO PROFORMA CON DESPLAZAMIENTO ---------- */

// Función de logout (cierra la sesión y redirige al inicio)
function logout() {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('username');
    window.location.href = '../index.html';
}

// Al cargar la página, verificamos si el usuario está logueado
window.onload = function() {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (!isLoggedIn) {
        window.location.href = 'index.html';
    }
}

/* ----------- FORMULARIO PROFORMA CON DESPLAZAMIENTO ---------- */

// Configuración de los event listeners para el sidebar y submenús
function setupEventListeners() {
    const sidebar = document.querySelector('.sidebar');
    const mainContent = document.querySelector('.main-content');
    let activeSubmenu = null;

    // Función para cerrar todos los submenús abiertos
    function closeAllSubmenus() {
        document.querySelectorAll('.submenu.active').forEach(submenu => {
            submenu.classList.remove('active');
            const arrow = submenu.parentElement.querySelector('.arrow');
            if (arrow) arrow.classList.remove('active');
        });
    }

    // Manejo de clicks en los items del menú
    document.querySelectorAll('.menu-item').forEach(item => {
        item.addEventListener('click', function(e) {
            e.stopPropagation();

            // Si el sidebar está colapsado, lo expandimos
            if (!sidebar.classList.contains('expanded')) {
                sidebar.classList.add('expanded');
                mainContent.classList.add('expanded');
                return;
            }

            // Navegación al menú de inicio (si está logueado)
            if (this.id === 'menuInicio') {
                if (localStorage.getItem('isLoggedIn') === 'true') {
                    window.location.href = '/Capa_proforma.html';
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

    // Manejo de enlaces, asegurando que el usuario esté logueado
    document.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', function(e) {
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

//---------------------------------------------------------------------------

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
                toggleTitle.innerHTML = 'Ver Ingreso 📝 ';
            } else {
                tableContainer.style.maxHeight = '0px';
                toggleTitle.innerHTML = 'Ver Ingreso 📝 ';
            }
            
            toggleTitle.classList.toggle('active');
        };

        // Configurar toggle
        if (toggleTitle && tableContainer) {
            toggleTitle.style.cursor = 'pointer';
            toggleTitle.innerHTML = 'Ver Ingreso 📝 ';
            toggleTitle.addEventListener('click', toggleTableVisibility);
        }
    };


// Función para cargar datos iniciales
const cargarDatosIniciales =() => {
    // Obtener datos de localStorage
    const citas = JSON.parse(localStorage.getItem('registeredCitas') || '[]');

    // Verificar si hay una nueva cita en los parámetros de la URL
    const urlParams = new URLSearchParams(window.location.search);
    const nuevaCita = urlParams.get('nueva_cita');

    if (nuevaCita) {
        // Agregar la nueva cita a la lista
        const citaData = JSON.parse(decodeURIComponent(nuevaCita));
        citas.push(citaData);
        localStorage.setItem('registeredCitas', JSON.stringify(citas));

        // Limpiar parámetros de la URL
        window.history.replaceState({}, document.title, window.location.pathname);
    }

    // Renderizar la tabla con los datos
    renderizarTabla(citas);
};

// Función para renderizar la tabla
const renderizarTabla = (citas) => {
    const tableBody = document.getElementById('citaTableBody');
    // Limpiar el contenido actual del tbody
    tableBody.innerHTML = '';


   
    // Insertar filas con los datos de las citas
    citas.forEach(cita => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${escapeHtml(cita.Codigo_Cita || '---')}</td>
            <td>${escapeHtml(cita.Motivo_Consulta || '---')}</td>
            <td>${escapeHtml(formatearMonto(cita.Cobro_Total))}</td>
            <td>${escapeHtml(cita.Metodo_Pago || '---')}</td>
            <td>${escapeHtml(formatearFecha(cita.Fecha_Cita))}</td>
            <td>${escapeHtml(cita.Tratamiento || '---')}</td>
            <td>${escapeHtml(cita.Enfermedades_Base || '---')}</td>
            <td>${escapeHtml(cita.Alergias || '---')}</td>
            <td>${escapeHtml(cita.Diagnostico || '---')}</td>
            <td>${escapeHtml(cita.Codigo_Mascota || '---')}</td>
            <td>${escapeHtml(cita.Codigo_Cliente || '---')}</td>
            <td>${escapeHtml(cita.Codigo_Trabajador || '---')}</td>
            <td>${escapeHtml(cita.Codigo_Servicio || '---')}</td>
            <td>${escapeHtml(cita.Codigo_Historial || '---')}</td>
        `;
        tableBody.appendChild(row);
    });
}

// Inicializar todo
initializeToggle();
cargarDatosIniciales();

// Configurar búsqueda en tiempo real
const searchInput = document.querySelector('.buscar-input');
if (searchInput) {
    searchInput.addEventListener('input', (e) => {
        const termino = e.target.value.toLowerCase();
        const citas = JSON.parse(localStorage.getItem('registeredCitas') || '[]');
        const filtrados = citas.filter(cita => 
            Object.values(cita).some(valor => 
                String(valor).toLowerCase().includes(termino)
            )
        );
        renderizarTabla(filtrados);
    });
}
});

