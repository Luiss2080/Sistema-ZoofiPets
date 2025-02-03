/* ----------- FORMULARIO PROFORMA CON DESPLAZAMIENTO ---------- */

// Animación para mostrar u ocultar el formulario
const toggleButton = document.querySelector('.toggle-form'); // Selecciona el botón para alternar la visibilidad
const formContainer = document.querySelector('.proforma-form-container'); // Selecciona el contenedor del formulario

toggleButton.addEventListener('click', () => {
    formContainer.classList.toggle('open'); // Activa/desactiva la clase 'open' para mostrar/ocultar el formulario
    toggleButton.classList.toggle('open'); // Cambia el estado visual del botón (abre/cierra)
});

// Evento que se ejecuta al cargar el DOM
document.addEventListener("DOMContentLoaded", () => {
    const toggleForm = document.querySelector(".toggle-form");

    toggleForm.addEventListener("click", () => {
        toggleForm.classList.toggle("active"); // Alterna la clase activa en el botón de formulario
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

/* ----------- FORMULARIO PROFORMA CON DESPLAZAMIENTO ---------- */

// Función para verificar el estado del login al cargar la página
document.addEventListener('DOMContentLoaded', function() {
    const isLoggedIn = localStorage.getItem('isLoggedIn'); // Verifica si el usuario está logueado
    const currentPage = window.location.pathname.split('/').pop(); // Obtiene la página actual

    // Si el usuario no está logueado y no está en la página de la proforma
    if (!isLoggedIn) {
        if (currentPage !== './Capa_Proforma') {
            document.getElementById('loginLayer').style.transform = 'translateX(0)'; // Muestra la capa de login
            document.getElementById('mainLayer').style.transform = 'translateX(100%)'; // Oculta la capa principal
        }
    } else {
        checkLoginState(); // Verifica el estado del login
        if (currentPage === './Capa_Proforma') {
            document.getElementById('loginLayer').style.transform = 'translateX(-100%)'; // Oculta la capa de login
            document.getElementById('mainLayer').style.transform = 'translateX(0)'; // Muestra la capa principal
        }
    }
    setupEventListeners(); // Configura los event listeners de la página
});

/* ----------- FORMULARIO PROFORMA CON DESPLAZAMIENTO ---------- */

// Función para verificar el estado del login
function checkLoginState() {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    const username = localStorage.getItem('username');

    if (isLoggedIn === 'true' && username) {
        document.getElementById('userDisplay').textContent = username; // Muestra el nombre de usuario
        document.getElementById('loginLayer').style.transform = 'translateX(-100%)'; // Oculta la capa de login
        document.getElementById('mainLayer').style.transform = 'translateX(0)'; // Muestra la capa principal
    }
}

/* ----------- FORMULARIO PROFORMA CON DESPLAZAMIENTO ---------- */



/* ----------- FORMULARIO PROFORMA CON DESPLAZAMIENTO ---------- */

// Función de logout
function logout() {
    localStorage.removeItem('isLoggedIn'); // Elimina el estado de login
    localStorage.removeItem('username'); // Elimina el nombre de usuario
    window.location.href = '../index.html'; // Redirige a la página principal
}

/* ----------- FORMULARIO PROFORMA CON DESPLAZAMIENTO ---------- */

// Función para navegar a la proforma
function navegarProforma(event) {
    event.preventDefault();
    if (localStorage.getItem('isLoggedIn') === 'true') {
        window.location.href = 'Formularios.html/FORM_Clientes.html'; // Redirige a la página de formularios si el usuario está logueado
    }
}

/* ----------- FORMULARIO PROFORMA CON DESPLAZAMIENTO ---------- */

// Función para manejar la visibilidad de las secciones
function toggleSectionVisibility(sectionToShow) {
    // Ocultar todas las secciones excepto la barra superior
    const sections = document.querySelectorAll('.main-content > div:not(.top-bar)');
    sections.forEach(section => {
        section.style.display = 'none'; // Esconde todas las secciones
    });

    // Mostrar la sección solicitada
    if (sectionToShow) {
        sectionToShow.style.display = 'block'; // Muestra la sección indicada
    }
}



// Configuración de los event listeners
function setupEventListeners() {
    const sidebar = document.querySelector('.sidebar');  // Selecciona la barra lateral
    const mainContent = document.querySelector('.main-content');  // Selecciona el contenido principal
    let activeSubmenu = null;  // Variable para almacenar el submenú activo
    
    // Función para cerrar todos los submenús
    function closeAllSubmenus() {
        // Elimina la clase 'active' de todos los submenús
        document.querySelectorAll('.submenu.active').forEach(submenu => {
            submenu.classList.remove('active');
            const arrow = submenu.parentElement.querySelector('.arrow');
            if (arrow) arrow.classList.remove('active');
        });
    }

    // Click en los items del menú
    document.querySelectorAll('.menu-item').forEach(item => {
        item.addEventListener('click', function(e) {
            e.stopPropagation();  // Evita la propagación del clic al documento
            
            // Si el sidebar está colapsado, expandirlo
            if (!sidebar.classList.contains('expanded')) {
                sidebar.classList.add('expanded');
                mainContent.classList.add('expanded');
                return;  // Sale de la función si se expande el sidebar
            }

            // Si es el menú de inicio, navegar a capa_proforma.html
            if (this.id === 'menuInicio') {
                if (localStorage.getItem('isLoggedIn') === 'true') {
                    window.location.href = '/capa_proforma.html';  // Redirige si está logueado
                } else {
                    alert('Debe iniciar sesión primero');  // Alerta si no está logueado
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
                
                activeSubmenu = submenu.classList.contains('active') ? submenu : null;  // Actualiza el submenú activo
            }
        });
    });

    // Click fuera del sidebar para colapsarlo
    document.addEventListener('click', function(e) {
        if (!sidebar.contains(e.target) && !e.target.matches('#menu-toggle')) {
            sidebar.classList.remove('expanded');
            mainContent.classList.remove('expanded');
            closeAllSubmenus();  // Cierra los submenús
        }
    });

    // Toggle del menú hamburguesa
    document.getElementById('menu-toggle').addEventListener('click', function(e) {
        e.stopPropagation();  // Evita la propagación del clic
        sidebar.classList.toggle('expanded');
        mainContent.classList.toggle('expanded');
        if (!sidebar.classList.contains('expanded')) {
            closeAllSubmenus();  // Cierra los submenús si el menú no está expandido
        }
    });

    // Prevenir cierre del sidebar al hacer click en submenús
    document.querySelectorAll('.submenu').forEach(submenu => {
        submenu.addEventListener('click', function(e) {
            e.stopPropagation();  // Evita que el clic cierre el sidebar
        });
    });

    // Manejo de enlaces
    document.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', function(e) {
            if (localStorage.getItem('isLoggedIn') !== 'true') {
                e.preventDefault();  // Previene la navegación si no está logueado
                alert('Debe iniciar sesión primero');  // Alerta si no está logueado
            }
        });
    });

    // Prevenir que el click en los submenús propague al menú principal
    document.querySelectorAll('.submenu li').forEach(item => {
        item.addEventListener('click', function(e) {
            e.stopPropagation();  // Evita que el clic se propague al menú principal
        });
    });

    // Ejemplo: Desplazar al final del contenido
    const welcomeSection = document.querySelector('.welcome-section');
    welcomeSection.scrollTop = welcomeSection.scrollHeight;  // Desplaza al final de la sección
}


/* ----------- FORMULARIO PROFORMA CON DESPLAZAMIENTO ---------- */

// Desplazar al final del contenido
const welcomeSection = document.querySelector('.welcome-section');
welcomeSection.scrollTop = welcomeSection.scrollHeight; // Desplazar al final del contenido de bienvenida


//-----------------------------------------------------------------------------------------------------------------------



    // Luego manejamos la carga y renderizado de datos
    function cargarDatosIniciales()  {
        const roles = JSON.parse(localStorage.getItem('registeredRoles') || '[]');
        const urlParams = new URLSearchParams(window.location.search);
        const nuevoRol = urlParams.get('nuevo_rol');

        if (nuevoRol) {
            const rolData = JSON.parse(decodeURIComponent(nuevoRol));
            roles.push(rolData);
            localStorage.setItem('registeredRoles', JSON.stringify(roles));
            window.history.replaceState({}, document.title, window.location.pathname);
        }

        renderizarTablaroles(roles);
    };

    const renderizarTablaroles = (roles) => {
        const tableBody = document.getElementById('rolTableBody');
        tableBody.innerHTML = '';
        
        roles.forEach(rol => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${rol.Nombre_Rol || '---'}</td>
                <td>${rol.Descripcion|| '---'}</td>
                <td>${rol.Cod_Permiso || '---'}</td>
                <td>${rol.Cod_Usuario || '---'}</td>
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
        const roles = JSON.parse(localStorage.getItem('registereRoles') || '[]');
        const filtradas = roles.filter(rol => 
            Object.values(rol).some(valor => 
                String(valor).toLowerCase().includes(termino)
            )
        );
        renderizarTabla(filtradas);
    });
});

