/* ----------- FORMULARIO PROFORMA CON DESPLAZAMIENTO ---------- */

// Animación para mostrar u ocultar el formulario
const toggleButton = document.querySelector('.toggle-form');  // Botón para alternar el formulario
const formContainer = document.querySelector('.proforma-form-container');  // Contenedor del formulario

// Evento para alternar la clase 'open' en el formulario y el botón
toggleButton.addEventListener('click', () => {
    formContainer.classList.toggle('open');  // Muestra/oculta el formulario
    toggleButton.classList.toggle('open');  // Muestra/oculta el icono del botón
});

// Evento para alternar la clase 'active' al hacer clic en el botón de mostrar formulario
document.addEventListener("DOMContentLoaded", () => {
    const toggleForm = document.querySelector(".toggle-form");

    // Evento para alternar la clase 'active' cuando el formulario es clickeado
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



/* ----------- FORMULARIO PROFORMA CON DESPLAZAMIENTO ---------- */

// Función para verificar el estado del login al cargar la página
document.addEventListener('DOMContentLoaded', function() {
    const isLoggedIn = localStorage.getItem('isLoggedIn');  // Verifica si el usuario está logueado
    const currentPage = window.location.pathname.split('/').pop();  // Obtiene el nombre de la página actual
     
    // Si no está logueado y no está en la página de proforma, muestra la capa de login
    if (!isLoggedIn) {
        if (currentPage !== './Capa_Proforma') {
            document.getElementById('loginLayer').style.transform = 'translateX(0)';  // Muestra capa de login
            document.getElementById('mainLayer').style.transform = 'translateX(100%)';  // Oculta el contenido principal
        }
    } else {
        checkLoginState();  // Verifica el estado del login si está logueado
        if (currentPage === './Capa_Proforma') {
            document.getElementById('loginLayer').style.transform = 'translateX(-100%)';  // Oculta capa de login
            document.getElementById('mainLayer').style.transform = 'translateX(0)';  // Muestra contenido principal
        }
    }
    setupEventListeners();  // Configura los event listeners
});

// Función para verificar si el usuario está logueado
function checkLoginState() {
    const isLoggedIn = localStorage.getItem('isLoggedIn');  // Revisa el estado de login
    const username = localStorage.getItem('username');  // Obtiene el nombre del usuario

    // Si está logueado, actualiza la interfaz con el nombre del usuario
    if (isLoggedIn === 'true' && username) {
        document.getElementById('userDisplay').textContent = username;  // Muestra el nombre del usuario
        document.getElementById('loginLayer').style.transform = 'translateX(-100%)';  // Oculta capa de login
        document.getElementById('mainLayer').style.transform = 'translateX(0)';  // Muestra contenido principal
    }
}

// Función de login
function login() {
    const username = document.getElementById('username').value;  // Obtiene el usuario ingresado
    const password = document.getElementById('password').value;  // Obtiene la contraseña ingresada

    // Si el usuario y contraseña son válidos, realiza el login
    if (username && password) {
        localStorage.setItem('isLoggedIn', 'true');  // Guarda el estado de login
        localStorage.setItem('username', username);  // Guarda el nombre de usuario

        document.getElementById('userDisplay').textContent = username;  // Muestra el nombre del usuario
        document.getElementById('loginLayer').style.transform = 'translateX(-100%)';  // Oculta la capa de login
        document.getElementById('mainLayer').style.transform = 'translateX(0)';  // Muestra el contenido principal

        // Redirige a la página de proforma
        window.location.href = '../Capa_Proforma.html';
    } else {
        alert('Por favor ingrese usuario y contraseña');  // Alerta si falta usuario o contraseña
    }
}

// Función de logout
function logout() {
    localStorage.removeItem('isLoggedIn');  // Elimina el estado de login
    localStorage.removeItem('username');  // Elimina el nombre de usuario
    window.location.href = '../index.html';  // Redirige al inicio
}

// Función para verificar la sesión al cargar la página
window.onload = function() {
    const isLoggedIn = localStorage.getItem('isLoggedIn');  // Verifica el estado de login
    if (!isLoggedIn) {
        window.location.href = 'index.html';  // Si no está logueado, redirige a la página de login
    }
}




/* ----------- FORMULARIO PROFORMA CON DESPLAZAMIENTO ---------- */

// Función para navegar a la proforma
function navegarProforma(event) {
    event.preventDefault();  // Prevenimos la acción por defecto del evento
    if (localStorage.getItem('isLoggedIn') === 'true') {  // Verifica si el usuario está logueado
        window.location.href = 'Formularios.html/FORM_Clientes.html';  // Redirige a la página de proforma
    }
}

// Función para manejar la visibilidad de las secciones
function toggleSectionVisibility(sectionToShow) {
    // Ocultar todas las secciones excepto la barra superior
    const sections = document.querySelectorAll('.main-content > div:not(.top-bar)');
    sections.forEach(section => {
        section.style.display = 'none';  // Oculta las secciones
    });

    // Mostrar la sección solicitada
    if (sectionToShow) {
        sectionToShow.style.display = 'block';  // Muestra la sección seleccionada
    }
}


// Configuración de los event listeners
function setupEventListeners() {
    const sidebar = document.querySelector('.sidebar');  // Obtiene la barra lateral
    const mainContent = document.querySelector('.main-content');  // Obtiene el contenido principal
    let activeSubmenu = null;  // Variable para almacenar el submenú activo
    
    // Función para cerrar todos los submenús abiertos
    function closeAllSubmenus() {
        // Recorre todos los submenús activos y los cierra
        document.querySelectorAll('.submenu.active').forEach(submenu => {
            submenu.classList.remove('active');  // Elimina la clase activa
            const arrow = submenu.parentElement.querySelector('.arrow');  // Busca la flecha correspondiente
            if (arrow) arrow.classList.remove('active');  // Elimina la clase activa de la flecha
        });
    }
    
    // Click en los items del menú
    document.querySelectorAll('.menu-item').forEach(item => {
        item.addEventListener('click', function(e) {
            e.stopPropagation();  // Detiene la propagación del evento

            // Si el sidebar no está expandido, lo expandimos
            if (!sidebar.classList.contains('expanded')) {
                sidebar.classList.add('expanded');
                mainContent.classList.add('expanded');
                return;
            }

            // Si es el menú de inicio, navegamos a capa_proforma.html
            if (this.id === 'menuInicio') {
                if (localStorage.getItem('isLoggedIn') === 'true') {
                    window.location.href = '/capa_proforma.html';  // Redirige si el usuario está logueado
                } else {
                    alert('Debe iniciar sesión primero');  // Muestra un mensaje si no está logueado
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

    // Cierre del sidebar al hacer clic fuera de él
    document.addEventListener('click', function(e) {
        if (!sidebar.contains(e.target) && !e.target.matches('#menu-toggle')) {
            sidebar.classList.remove('expanded');
            mainContent.classList.remove('expanded');
            closeAllSubmenus();  // Cierra todos los submenús
        }
    });

    // Toggle del menú hamburguesa
    document.getElementById('menu-toggle').addEventListener('click', function(e) {
        e.stopPropagation();  // Detiene la propagación del evento
        sidebar.classList.toggle('expanded');  // Muestra u oculta el sidebar
        mainContent.classList.toggle('expanded');  // Ajusta el contenido principal
        if (!sidebar.classList.contains('expanded')) {
            closeAllSubmenus();  // Si el sidebar se colapsa, cierra todos los submenús
        }
    });

    // Prevenir que el click en los submenús propague al menú principal
    document.querySelectorAll('.submenu').forEach(submenu => {
        submenu.addEventListener('click', function(e) {
            e.stopPropagation();  // Detiene la propagación del evento al menú principal
        });
    });

    // Manejo de enlaces: Verifica si el usuario está logueado antes de permitir la navegación
    document.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', function(e) {
            if (localStorage.getItem('isLoggedIn') !== 'true') {
                e.preventDefault();  // Evita la navegación si no está logueado
                alert('Debe iniciar sesión primero');
            }
        });
    });

    // Prevenir que el click en los submenús propague al menú principal
    document.querySelectorAll('.submenu li').forEach(item => {
        item.addEventListener('click', function(e) {
            e.stopPropagation();  // Detiene la propagación del evento
        });
    });

    // Ejemplo: Desplazar al final del contenido
    const welcomeSection = document.querySelector('.welcome-section');  // Obtiene la sección de bienvenida
    welcomeSection.scrollTop = welcomeSection.scrollHeight;  // Desplaza al final del contenido
}

//-----------------------------------------------------------------------------------

    // Cargar datos iniciales
    function cargarDatosIniciales ()  {
        const productos = JSON.parse(localStorage.getItem('registeredProductos') || '[]');
        const urlParams = new URLSearchParams(window.location.search);
        const nuevoProducto = urlParams.get('nuevo_producto');

        if (nuevoProducto) {
            const productoData = JSON.parse(decodeURIComponent(nuevoProducto));
            productos.push(productoData);
            localStorage.setItem('registeredProductos', JSON.stringify(productos));
            window.history.replaceState({}, document.title, window.location.pathname);
        }

        renderizarTabla(productos);
    };

    // Función de renderizado
    function renderizarTabla(productos) {
        const tableBody = document.getElementById('productoTableBody');
        tableBody.innerHTML = '';
        
        productos.forEach(producto => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${producto.Nombre || '---'}</td>
                <td>${producto.Stock || 0}</td>
                <td>${producto.Proveedor || '---'}</td>
                <td>${producto.Categoria || '---'}</td>
                <td>${producto.Tipo || '---'}</td>
                <td>${producto.Cod_Proveedores || '---'}</td>
            `;
            tableBody.appendChild(row);
        });
    };

   // Evento al cargar la página
    document.addEventListener('DOMContentLoaded', () => {
    cargarDatosIniciales();
    
    // Búsqueda en tiempo real
    document.querySelector('.buscar-input').addEventListener('input', (e) => {
        const termino = e.target.value.toLowerCase();
        const productos = JSON.parse(localStorage.getItem('registeredProductos') || '[]');
        const filtradas = productos.filter(producto => 
            Object.values(producto).some(valor => 
                String(valor).toLowerCase().includes(termino)
            )
        );
        renderizarTabla(filtradas);
    });
});
