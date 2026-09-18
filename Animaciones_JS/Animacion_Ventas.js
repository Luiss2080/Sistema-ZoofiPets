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

// Función de login
function login() {
    const username = document.getElementById('username').value; // Obtiene el valor del campo de nombre de usuario
    const password = document.getElementById('password').value; // Obtiene el valor del campo de contraseña

    // Si ambos campos están completos
    if (username && password) {
        localStorage.setItem('isLoggedIn', 'true'); // Almacena el estado de login
        localStorage.setItem('username', username); // Almacena el nombre de usuario

        document.getElementById('userDisplay').textContent = username; // Muestra el nombre de usuario en la interfaz
        document.getElementById('loginLayer').style.transform = 'translateX(-100%)'; // Oculta la capa de login
        document.getElementById('mainLayer').style.transform = 'translateX(0)'; // Muestra la capa principal

        // Redirige a la página de proforma después del login exitoso
        window.location.href = '../Capa_Proforma.html';
    } else {
        alert('Por favor ingrese usuario y contraseña'); // Muestra un mensaje si los campos están vacíos
    }
}

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


//-----------------------------------------------------------------------------------

  // Cargar datos iniciales
  function cargarDatosIniciales() {
    const ventas = JSON.parse(localStorage.getItem('registeredVentas') || '[]');
    const urlParams = new URLSearchParams(window.location.search);
    const nuevaVenta = urlParams.get('nueva_venta');

    if (nuevaVenta) {
        const ventaData = JSON.parse(decodeURIComponent(nuevaVenta));
        ventas.push(ventaData);
        localStorage.setItem('registeredVentas', JSON.stringify(ventas));
        // Limpiar parámetros de la URL
        window.history.replaceState({}, document.title, window.location.pathname);
    }

    renderizarTabla(ventas);
}

// Función para formatear montos
function formatearMonto(monto) {
    return typeof monto === 'number' 
        ? `S/ ${monto.toFixed(2)}` 
        : `S/ ${parseFloat(monto || 0).toFixed(2)}`;
}

// Función para formatear fecha
function formatearFecha(fecha) {
    if (!fecha) return '---';
    try {
        return new Date(fecha).toLocaleDateString('es-PE', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        });
    } catch (e) {
        return fecha;
    }
}

// Función de renderizado
function renderizarTabla(ventas) {
    const tableBody = document.getElementById('ventaTableBody');
    tableBody.innerHTML = '';
    
    ventas.forEach(venta => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td style="padding: 8px; border: 2px solid var(--pastel-blue);">${escapeHtml(venta.Codigo_Venta || '---')}</td>
            <td style="padding: 8px; border: 2px solid var(--pastel-blue);">${escapeHtml(venta.Nro_Factura || '---')}</td>
            <td style="padding: 8px; border: 2px solid var(--pastel-blue);">${escapeHtml(formatearFecha(venta.Fecha_Venta))}</td>
            <td style="padding: 8px; border: 2px solid var(--pastel-blue);">${escapeHtml(formatearMonto(venta.Monto))}</td>
            <td style="padding: 8px; border: 2px solid var(--pastel-blue);">${escapeHtml(formatearMonto(venta.Descuento))}</td>
            <td style="padding: 8px; border: 2px solid var(--pastel-blue);">${escapeHtml(formatearMonto(venta.Monto_Total))}</td>
            <td style="padding: 8px; border: 2px solid var(--pastel-blue);">${escapeHtml(venta.Metodo_Pago || '---')}</td>
            <td style="padding: 8px; border: 2px solid var(--pastel-blue);">${escapeHtml(venta.Codigo_Cliente || '---')}</td>
            <td style="padding: 8px; border: 2px solid var(--pastel-blue);">${escapeHtml(venta.Codigo_Trabajador || '---')}</td>
        `;
        tableBody.appendChild(row);
    });
}

// Función de búsqueda
function buscarVentas(termino, ventas) {
    return ventas.filter(venta => {
        return Object.entries(venta).some(([key, value]) => {
            // Convertir el valor a string y buscar
            const stringValue = String(value).toLowerCase();
            return stringValue.includes(termino.toLowerCase());
        });
    });
}

// Evento al cargar la página
document.addEventListener('DOMContentLoaded', () => {
    cargarDatosIniciales();
    
    // Búsqueda en tiempo real
    const buscarInput = document.querySelector('.buscar-input');
    if (buscarInput) {
        buscarInput.addEventListener('input', (e) => {
            const termino = e.target.value.toLowerCase();
            const ventas = JSON.parse(localStorage.getItem('registeredVentas') || '[]');
            const ventasFiltradas = buscarVentas(termino, ventas);
            renderizarTabla(ventasFiltradas);
        });
    }

    // Actualizar título si la venta fue exitosa
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('exito') === '1') {
        const title = document.getElementById('title2');
        if (title) {
            title.textContent = '¡Venta registrada con éxito!';
            // Limpiar mensaje después de 3 segundos
            setTimeout(() => {
                title.textContent = 'Registro de Ventas';
            }, 3000);
        }
    }
});