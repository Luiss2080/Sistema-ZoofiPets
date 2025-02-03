/* ----------- FORMULARIO PROFORMA CON DESPLAZAMIENTO ---------- */

// Animación para mostrar u ocultar el formulario
const toggleButton = document.querySelector('.toggle-form');
const formContainer = document.querySelector('.proforma-form-container');

toggleButton.addEventListener('click', () => {
    formContainer.classList.toggle('open'); // Cambia la clase para abrir/cerrar el formulario
    toggleButton.classList.toggle('open'); // Cambia el estado visual del botón
});

document.addEventListener("DOMContentLoaded", () => {
    const toggleForm = document.querySelector(".toggle-form");

    toggleForm.addEventListener("click", () => {
        toggleForm.classList.toggle("active"); // Activa o desactiva el formulario en DOMContentLoaded
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
            ? 'Ver Ingreso 📝 ' 
            : 'Ver Ingreso 📝 ';
    };

    // Configurar toggle si existen elementos
    if (toggleTitle && tableContainer) {
        toggleTitle.style.cursor = 'pointer';
        toggleTitle.innerHTML = 'Ver Ingreso 📝 ';
        toggleTitle.addEventListener('click', toggleTableVisibility);
    }
});


/* ----------- VERIFICACIÓN DE ESTADO DE LOGIN AL CARGAR ---------- */

document.addEventListener('DOMContentLoaded', function() {
    const isLoggedIn = localStorage.getItem('isLoggedIn'); // Verifica si el usuario está logueado
    const currentPage = window.location.pathname.split('/').pop();

    if (!isLoggedIn) {
        if (currentPage !== './Capa_Proforma') {
            document.getElementById('loginLayer').style.transform = 'translateX(0)';
            document.getElementById('mainLayer').style.transform = 'translateX(100%)'; // Muestra la capa de login
        }
    } else {
        checkLoginState(); // Verifica el estado del login
        if (currentPage === './Capa_Proforma') {
            document.getElementById('loginLayer').style.transform = 'translateX(-100%)';
            document.getElementById('mainLayer').style.transform = 'translateX(0)'; // Muestra la capa principal
        }
    }
    setupEventListeners(); // Configura eventos adicionales
});

/* ----------- FUNCIÓN PARA VERIFICAR ESTADO DE LOGIN ---------- */

function checkLoginState() {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    const username = localStorage.getItem('username');

    if (isLoggedIn === 'true' && username) {
        document.getElementById('userDisplay').textContent = username; // Muestra el usuario
        document.getElementById('loginLayer').style.transform = 'translateX(-100%)';
        document.getElementById('mainLayer').style.transform = 'translateX(0)'; // Transición al área principal
    }
}

/* ----------- FUNCIÓN DE LOGIN ---------- */

function login() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    if (username && password) {
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('username', username);

        document.getElementById('userDisplay').textContent = username; // Actualiza el nombre del usuario
        document.getElementById('loginLayer').style.transform = 'translateX(-100%)';
        document.getElementById('mainLayer').style.transform = 'translateX(0)';

        // Redirige a la página de proforma
        window.location.href = '../Capa_Proforma.html';
    } else {
        alert('Por favor ingrese usuario y contraseña'); // Alerta si faltan datos
    }
}

/* ----------- FUNCIÓN DE LOGOUT ---------- */

function logout() {
    localStorage.removeItem('isLoggedIn'); // Elimina el estado de login
    localStorage.removeItem('username');
    window.location.href = '../index.html'; // Redirige al inicio
}

/* ----------- VERIFICAR SESIÓN AL CARGAR ---------- */

window.onload = function() {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (!isLoggedIn) {
        window.location.href = 'index.html'; // Redirige al inicio si no hay sesión activa
    }
}

/* ----------- NAVEGAR A LA PROFORMA ---------- */

function navegarProforma(event) {
    event.preventDefault(); // Previene el comportamiento predeterminado del enlace
    if (localStorage.getItem('isLoggedIn') === 'true') {
        window.location.href = 'Formularios.html/FORM_Clientes.html'; // Navega si el usuario está logueado
    }
}

/* ----------- MANEJAR VISIBILIDAD DE SECCIONES ---------- */

function toggleSectionVisibility(sectionToShow) {
    // Oculta todas las secciones excepto la barra superior
    const sections = document.querySelectorAll('.main-content > div:not(.top-bar)');
    sections.forEach(section => {
        section.style.display = 'none'; // Oculta cada sección
    });

    // Muestra la sección solicitada
    if (sectionToShow) {
        sectionToShow.style.display = 'block'; // Muestra la sección específica
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
            if (arrow) arrow.classList.remove('active'); // Quita la clase activa del ícono de flecha
        });
    }

    // Click en los items del menú
    document.querySelectorAll('.menu-item').forEach(item => {
        item.addEventListener('click', function(e) {
            e.stopPropagation(); // Evita que el evento se propague a elementos superiores
            
            // Si el sidebar está colapsado, primero lo expandimos
            if (!sidebar.classList.contains('expanded')) {
                sidebar.classList.add('expanded'); // Expande el sidebar
                mainContent.classList.add('expanded'); // Ajusta el contenido principal
                return;
            }

            // Si es el menú de inicio, navegamos a capa_proforma.html
            if (this.id === 'menuInicio') {
                if (localStorage.getItem('isLoggedIn') === 'true') {
                    window.location.href = '/capa_proforma.html';
                } else {
                    alert('Debe iniciar sesión primero'); // Mensaje si no está autenticado
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
                    if (activeArrow) activeArrow.classList.remove('active'); // Quita la clase activa del submenú anterior
                }

                // Toggle del submenú actual
                submenu.classList.toggle('active'); // Activa o desactiva el submenú actual
                if (arrow) arrow.classList.toggle('active'); // Activa o desactiva el ícono de flecha

                activeSubmenu = submenu.classList.contains('active') ? submenu : null; // Actualiza el submenú activo
            }
        });
    });

    // Click fuera del sidebar para colapsarlo
    document.addEventListener('click', function(e) {
        if (!sidebar.contains(e.target) && !e.target.matches('#menu-toggle')) {
            sidebar.classList.remove('expanded'); // Colapsa el sidebar
            mainContent.classList.remove('expanded'); // Ajusta el contenido principal
            closeAllSubmenus(); // Cierra todos los submenús
        }
    });

    // Toggle del menú hamburguesa
    document.getElementById('menu-toggle').addEventListener('click', function(e) {
        e.stopPropagation(); // Evita la propagación del evento
        sidebar.classList.toggle('expanded'); // Alterna el estado del sidebar
        mainContent.classList.toggle('expanded'); // Alterna el ajuste del contenido principal
        if (!sidebar.classList.contains('expanded')) {
            closeAllSubmenus(); // Cierra los submenús si el sidebar está colapsado
        }
    });

    // Prevenir cierre del sidebar al hacer click en submenús
    document.querySelectorAll('.submenu').forEach(submenu => {
        submenu.addEventListener('click', function(e) {
            e.stopPropagation(); // Evita que el evento cierre el sidebar
        });
    });

    // Manejo de enlaces
    document.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', function(e) {
            if (localStorage.getItem('isLoggedIn') !== 'true') {
                e.preventDefault(); // Previene el comportamiento por defecto si no está autenticado
                alert('Debe iniciar sesión primero'); // Mensaje de alerta
            }
        });
    });

    // Prevenir que el click en los submenús propague al menú principal
    document.querySelectorAll('.submenu li').forEach(item => {
        item.addEventListener('click', function(e) {
            e.stopPropagation(); // Evita la propagación del evento
        });
    });

    // Ejemplo: Desplazar al final del contenido
    const welcomeSection = document.querySelector('.welcome-section');
    welcomeSection.scrollTop = welcomeSection.scrollHeight; // Desplaza la sección de bienvenida hacia abajo
}

// Función para cargar datos al iniciar
function cargarDatosIniciales() {
    // 1. Cargar datos de localStorage
    const compras = JSON.parse(localStorage.getItem('registeredCompras') || '[]');
    
    // 2. Verificar parámetros URL
    const urlParams = new URLSearchParams(window.location.search);
    const nuevaCompra = urlParams.get('nueva_compra');
    
    // 3. Si hay nueva compra en URL
    if (nuevaCompra) {
        const compraData = JSON.parse(decodeURIComponent(nuevaCompra));
        compras.push(compraData);
        localStorage.setItem('registeredCompras', JSON.stringify(compras));
        
        // Limpiar parámetro de URL
        window.history.replaceState({}, document.title, window.location.pathname);
    }
    
    // 4. Renderizar tabla
    renderizarTabla(compras);
}

// Función para renderizar la tabla
function renderizarTabla(compras) {
    const tableBody = document.getElementById('compraTableBody');
    tableBody.innerHTML = '';
    
    compras.forEach(compra => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${compra.descuento || 'N/A'}</td>
            <td>${compra.estado || 'Pendiente'}</td>
            <td>${compra.fechaCompra || '---'}</td>
            <td>${compra.fechaIngreso || '---'}</td>
            <td>${compra.glosa || 'Sin glosa'}</td>
            <td>${compra.monto ? 'Bs' + compra.monto : '---'}</td>
            <td>${compra.montoTotal ? 'Bs' + compra.montoTotal : '---'}</td>
            <td>${compra.codProveedor || '---'}</td>
            <td>${compra.codTrabajador || '---'}</td>
        `;
        tableBody.appendChild(row);
    });
}

// Evento al cargar la página
document.addEventListener('DOMContentLoaded', () => {
    cargarDatosIniciales();
    
    // Configurar evento de búsqueda
    document.querySelector('.buscar-input').addEventListener('input', (e) => {
        const termino = e.target.value.toLowerCase();
        const compras = JSON.parse(localStorage.getItem('registeredCompras') || '[]');
        const filtradas = compras.filter(compra => 
            Object.values(compra).some(valor => 
                String(valor).toLowerCase().includes(termino)
            )
        );
        renderizarTabla(filtradas);
    });
});