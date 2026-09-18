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
const toggleButton = document.querySelector('.toggle-form'); // Se selecciona el botón de alternancia
const formContainer = document.querySelector('.proforma-form-container'); // Se selecciona el contenedor del formulario

// Al hacer clic en el botón, se alterna la visibilidad del formulario
toggleButton.addEventListener('click', () => {
    formContainer.classList.toggle('open'); // Abre o cierra el formulario
    toggleButton.classList.toggle('open'); // Cambia el estado del botón
});

// Se asegura que al cargar la página se agregue el estado activo al botón
document.addEventListener("DOMContentLoaded", () => {
    const toggleForm = document.querySelector(".toggle-form");

    // Alterna la clase activa al hacer clic
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

// Función para agregar más campos de teléfono
function agregarTelefono() {
    const container = document.getElementById('telefonosContainer'); // Contenedor de teléfonos
    const div = document.createElement('div'); // Crea un nuevo div
    div.innerHTML = `
        <input type="tel" name="Telefonos[]" placeholder="Teléfono" pattern="[0-9]{8,}" title="Ingrese al menos 8 dígitos">
        <button type="button" onclick="this.parentElement.remove()" class="remove-button">Eliminar</button>
    `;
    container.appendChild(div); // Añade el nuevo div al contenedor
}

// Función para agregar más campos de email
function agregarEmail() {
    const container = document.getElementById('emailsContainer'); // Contenedor de emails
    const div = document.createElement('div'); // Crea un nuevo div
    div.innerHTML = `
        <input type="email" name="Emails[]" placeholder="Email">
        <button type="button" onclick="this.parentElement.remove()" class="remove-button">Eliminar</button>
    `;
    container.appendChild(div); // Añade el nuevo div al contenedor
}


/* ----------- FORMULARIO PROFORMA CON DESPLAZAMIENTO ---------- */

// Función para verificar el estado del login al cargar la página
document.addEventListener('DOMContentLoaded', function() {
    const isLoggedIn = localStorage.getItem('isLoggedIn'); // Verifica si está logueado
    const currentPage = window.location.pathname.split('/').pop(); // Obtiene la página actual

    // Si no está logueado y no está en la página de proforma
    if (!isLoggedIn) {
        if (currentPage !== './Capa_Proforma') {
            document.getElementById('loginLayer').style.transform = 'translateX(0)'; // Muestra la capa de login
            document.getElementById('mainLayer').style.transform = 'translateX(100%)'; // Oculta la capa principal
        }
    } else {
        checkLoginState(); // Verifica el estado de login
        if (currentPage === './Capa_Proforma') {
            document.getElementById('loginLayer').style.transform = 'translateX(-100%)'; // Oculta la capa de login
            document.getElementById('mainLayer').style.transform = 'translateX(0)'; // Muestra la capa principal
        }
    }
    setupEventListeners(); // Configura los event listeners
});


/* ----------- FORMULARIO PROFORMA CON DESPLAZAMIENTO ---------- */

// Función para verificar el estado del login
function checkLoginState() {
    const isLoggedIn = localStorage.getItem('isLoggedIn'); // Obtiene el estado de login
    const username = localStorage.getItem('username'); // Obtiene el nombre de usuario

    // Si está logueado y existe un nombre de usuario
    if (isLoggedIn === 'true' && username) {
        document.getElementById('userDisplay').textContent = username; // Muestra el nombre de usuario
        document.getElementById('loginLayer').style.transform = 'translateX(-100%)'; // Oculta la capa de login
        document.getElementById('mainLayer').style.transform = 'translateX(0)'; // Muestra la capa principal
    }
}


/* ----------- FORMULARIO PROFORMA CON DESPLAZAMIENTO ---------- */

// Función de login
function login() {
    const username = document.getElementById('username').value; // Obtiene el nombre de usuario
    const password = document.getElementById('password').value; // Obtiene la contraseña

    // Si se han ingresado tanto el nombre de usuario como la contraseña
    if (username && password) {
        localStorage.setItem('isLoggedIn', 'true'); // Guarda el estado de login
        localStorage.setItem('username', username); // Guarda el nombre de usuario

        document.getElementById('userDisplay').textContent = username; // Muestra el nombre de usuario
        document.getElementById('loginLayer').style.transform = 'translateX(-100%)'; // Oculta la capa de login
        document.getElementById('mainLayer').style.transform = 'translateX(0)'; // Muestra la capa principal

        // Redirige a la página de proforma después del login exitoso
        window.location.href = '../Capa_Proforma.html';
    } else {
        alert('Por favor ingrese usuario y contraseña'); // Muestra alerta si faltan datos
    }
}


/* ----------- FORMULARIO PROFORMA CON DESPLAZAMIENTO ---------- */

// Función de logout
function logout() {
    localStorage.removeItem('isLoggedIn'); // Elimina el estado de login
    localStorage.removeItem('username'); // Elimina el nombre de usuario
    window.location.href = '../index.html'; // Redirige a la página de inicio
}


// Verifica la sesión al cargar la página
window.onload = function() {
    const isLoggedIn = localStorage.getItem('isLoggedIn'); // Verifica si está logueado
    if (!isLoggedIn) {
        window.location.href = 'index.html'; // Redirige a la página de inicio si no está logueado
    }
}


/* ----------- FORMULARIO PROFORMA CON DESPLAZAMIENTO ---------- */

// Función para navegar a la proforma
function navegarProforma(event) {
    event.preventDefault(); // Previne la acción predeterminada del evento
    if (localStorage.getItem('isLoggedIn') === 'true') {
        window.location.href = 'Formularios.html/FORM_Clientes.html'; // Redirige a la página de formularios si está logueado
    }
}


// Función para manejar la visibilidad de las secciones
function toggleSectionVisibility(sectionToShow) {
    // Ocultar todas las secciones excepto la barra superior
    const sections = document.querySelectorAll('.main-content > div:not(.top-bar)');
    sections.forEach(section => {
        section.style.display = 'none'; // Oculta las secciones
    });

    // Mostrar la sección solicitada
    if (sectionToShow) {
        sectionToShow.style.display = 'block'; // Muestra la sección solicitada
    }
}

/* ----------- EVENT LISTENERS Y MENÚ DE NAVEGACIÓN ---------- */

// Configuración de los event listeners
function setupEventListeners() {
    const sidebar = document.querySelector('.sidebar');
    const mainContent = document.querySelector('.main-content');
    let activeSubmenu = null;

    // Función para cerrar todos los submenús
    function closeAllSubmenus() {
        document.querySelectorAll('.submenu.active').forEach(submenu => {
            submenu.classList.remove('active'); // Remueve la clase activa de los submenús
            const arrow = submenu.parentElement.querySelector('.arrow');
            if (arrow) arrow.classList.remove('active'); // Remueve la clase activa de las flechas
        });
    }

    // Click en los items del menú
    document.querySelectorAll('.menu-item').forEach(item => {
        item.addEventListener('click', function(e) {
            e.stopPropagation(); // Evita la propagación del evento al contenedor principal
            
            // Si el sidebar está colapsado, primero lo expandimos
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
                
                activeSubmenu = submenu.classList.contains('active') ? submenu : null; // Actualiza el submenú activo
            }
        });
    });

    // Click fuera del sidebar para colapsarlo
    document.addEventListener('click', function(e) {
        if (!sidebar.contains(e.target) && !e.target.matches('#menu-toggle')) {
            sidebar.classList.remove('expanded');
            mainContent.classList.remove('expanded');
            closeAllSubmenus(); // Cierra submenús al hacer clic fuera
        }
    });

    // Toggle del menú hamburguesa
    document.getElementById('menu-toggle').addEventListener('click', function(e) {
        e.stopPropagation(); // Evita la propagación del evento al contenedor principal
        sidebar.classList.toggle('expanded'); // Expande o colapsa el sidebar
        mainContent.classList.toggle('expanded'); // Expande o colapsa el contenido principal
        if (!sidebar.classList.contains('expanded')) {
            closeAllSubmenus(); // Cierra los submenús si el sidebar se colapsa
        }
    });

    // Prevenir cierre del sidebar al hacer click en submenús
    document.querySelectorAll('.submenu').forEach(submenu => {
        submenu.addEventListener('click', function(e) {
            e.stopPropagation(); // Previne el cierre del sidebar al hacer clic en los submenús
        });
    });

    // Manejo de enlaces
    document.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', function(e) {
            if (localStorage.getItem('isLoggedIn') !== 'true') {
                e.preventDefault(); // Prevenir navegación si no está logueado
                alert('Debe iniciar sesión primero');
            }
        });
    });

    // Prevenir que el click en los submenús propague al menú principal
    document.querySelectorAll('.submenu li').forEach(item => {
        item.addEventListener('click', function(e) {
            e.stopPropagation(); // Evita la propagación del evento
        });
    });

    /* ----------- DESPLAZAR AL FINAL DEL CONTENIDO ---------- */
    // Ejemplo: Desplazar al final del contenido
    const welcomeSection = document.querySelector('.welcome-section');
    welcomeSection.scrollTop = welcomeSection.scrollHeight; // Desplaza al final del contenido
}


    // Cargar datos iniciales
    function cargarDatosIniciales ()  {
        const proveedores = JSON.parse(localStorage.getItem('registeredProveedores') || '[]');
        const urlParams = new URLSearchParams(window.location.search);
        const nuevoProveedor = urlParams.get('nuevo_proveedor');

        if (nuevoProveedor) {
            const proveedorData = JSON.parse(decodeURIComponent(nuevoProveedor));
            proveedores.push(proveedorData);
            localStorage.setItem('registeredProveedores', JSON.stringify(proveedores));
            window.history.replaceState({}, document.title, window.location.pathname);
        }

        renderizarTabla(proveedores);
    };

   // Función de renderizado CORREGIDA
function renderizarTabla(proveedores) {
    const tableBody = document.getElementById('proveedorTableBody');
    tableBody.innerHTML = '';
    
    proveedores.forEach(proveedor => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${escapeHtml(proveedor.Codigo_Proveedor || '---')}</td>
            <td>${escapeHtml(proveedor.Nombre || '---')}</td>
            <td>${escapeHtml(proveedor.Rubro || '---')}</td>
            <td>${escapeHtml(proveedor.Razon_Social || '---')}</td>
            <td>${escapeHtml(proveedor.Direccion || '---')}</td>
            <td>${escapeHtml(Array.isArray(proveedor.Telefonos) ? proveedor.Telefonos.join(', ') : '---')}</td>
            <td>${escapeHtml(Array.isArray(proveedor.Emails) ? proveedor.Emails.join(', ') : '---')}</td>
            <td>${escapeHtml(proveedor.Fecha_Registro || '---')}</td>
        `;
        tableBody.appendChild(row); // Corregir variable (antes tbody)
    });
}

   // Evento al cargar la página
    document.addEventListener('DOMContentLoaded', () => {
    cargarDatosIniciales();
    
    // Búsqueda en tiempo real
    document.querySelector('.buscar-input').addEventListener('input', (e) => {
        const termino = e.target.value.toLowerCase();
        const proveedores = JSON.parse(localStorage.getItem('registeredProveedores') || '[]');
        const filtradas = proveedores.filter(proveedor => 
            Object.values(proveedor).some(valor => 
                String(valor).toLowerCase().includes(termino)
            )
        );
        renderizarTabla(filtradas);
    });
});