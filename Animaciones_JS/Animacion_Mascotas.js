/* ----------- FORMULARIO PROFORMA CON DESPLAZAMIENTO ---------- */

// Animación para mostrar u ocultar el formulario
const toggleButton = document.querySelector('.toggle-form');
const formContainer = document.querySelector('.proforma-form-container');

// Evento para abrir/cerrar el formulario al hacer clic en el botón
toggleButton.addEventListener('click', () => {
    formContainer.classList.toggle('open');  // Cambia la clase para mostrar/ocultar
    toggleButton.classList.toggle('open');   // Cambia la clase del botón
});

// Activar animación de cambio de clase cuando el formulario se carga
document.addEventListener("DOMContentLoaded", () => {
    const toggleForm = document.querySelector(".toggle-form");

    // Cambiar el estado activo del formulario
    toggleForm.addEventListener("click", () => {
        toggleForm.classList.toggle("active");  // Cambia la clase activa
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




/* ----------- VERIFICACIÓN DE ESTADO DE LOGIN ---------- */

// Función para verificar el estado del login al cargar la página
document.addEventListener('DOMContentLoaded', function() {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    const currentPage = window.location.pathname.split('/').pop();
    
    // Si no está logueado, mostrar la capa de login
    if (!isLoggedIn) {
        if (currentPage !== './Capa_Proforma') {
            document.getElementById('loginLayer').style.transform = 'translateX(0)';
            document.getElementById('mainLayer').style.transform = 'translateX(100%)';
        }
    } else {
        checkLoginState();  // Verifica el estado del login
        if (currentPage === './Capa_Proforma') {
            // Si está logueado y está en la capa de proforma, mostrar contenido
            document.getElementById('loginLayer').style.transform = 'translateX(-100%)';
            document.getElementById('mainLayer').style.transform = 'translateX(0)';
        }
    }
    setupEventListeners();  // Configuración de event listeners
});

// Función para verificar el estado del login
function checkLoginState() {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    const username = localStorage.getItem('username');

    // Si está logueado, mostrar nombre de usuario y cambiar la vista
    if (isLoggedIn === 'true' && username) {
        document.getElementById('userDisplay').textContent = username;
        document.getElementById('loginLayer').style.transform = 'translateX(-100%)';
        document.getElementById('mainLayer').style.transform = 'translateX(0)';
    }
}


/* ----------- FUNCIONES DE LOGOUT Y VERIFICACIÓN DE SESIÓN ---------- */

// Función de logout
// Elimina los datos del login al cerrar sesión
function logout() {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('username');
    window.location.href = '../index.html';  // Redirige al login
}

// Función para verificar sesión al cargar la página
window.onload = function() {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (!isLoggedIn) {
        window.location.href = 'index.html';  // Si no está logueado, redirige al login
    }
};


/* ----------- CONFIGURACIÓN DE EVENT LISTENERS PARA LA INTERFAZ ---------- */

// Configuración de los event listeners para el menú y los submenús
function setupEventListeners() {
    const sidebar = document.querySelector('.sidebar');
    const mainContent = document.querySelector('.main-content');
    let activeSubmenu = null;
    
    // Función para cerrar todos los submenús activos
    function closeAllSubmenus() {
        document.querySelectorAll('.submenu.active').forEach(submenu => {
            submenu.classList.remove('active');  // Remueve la clase activa
            const arrow = submenu.parentElement.querySelector('.arrow');
            if (arrow) arrow.classList.remove('active');  // Remueve la clase del ícono de flecha
        });
    }

    // Click en los items del menú
    document.querySelectorAll('.menu-item').forEach(item => {
        item.addEventListener('click', function(e) {
            e.stopPropagation();  // Detener la propagación del click
            
            // Si el sidebar está colapsado, expandirlo
            if (!sidebar.classList.contains('expanded')) {
                sidebar.classList.add('expanded');
                mainContent.classList.add('expanded');
                return;
            }

            // Si es el menú de inicio, navegar a capa_proforma.html
            if (this.id === 'menuInicio') {
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

    // Cerrar sidebar al hacer click fuera de él
    document.addEventListener('click', function(e) {
        if (!sidebar.contains(e.target) && !e.target.matches('#menu-toggle')) {
            sidebar.classList.remove('expanded');
            mainContent.classList.remove('expanded');
            closeAllSubmenus();  // Cerrar submenús si se hace clic fuera
        }
    });

    // Toggle del menú hamburguesa
    document.getElementById('menu-toggle').addEventListener('click', function(e) {
        e.stopPropagation();  // Evitar propagación
        sidebar.classList.toggle('expanded');  // Expandir o colapsar sidebar
        mainContent.classList.toggle('expanded');  // Cambiar el contenido principal
        if (!sidebar.classList.contains('expanded')) {
            closeAllSubmenus();  // Si se colapsa, cerrar todos los submenús
        }
    });

    // Prevenir cierre del sidebar al hacer click en submenús
    document.querySelectorAll('.submenu').forEach(submenu => {
        submenu.addEventListener('click', function(e) {
            e.stopPropagation();  // Evitar propagación del click
        });
    });

    // Manejo de enlaces para asegurar que se debe iniciar sesión
    document.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', function(e) {
            if (localStorage.getItem('isLoggedIn') !== 'true') {
                e.preventDefault();  // Prevenir la navegación
                alert('Debe iniciar sesión primero');
            }
        });
    });

    // Prevenir que el click en los submenús propague al menú principal
    document.querySelectorAll('.submenu li').forEach(item => {
        item.addEventListener('click', function(e) {
            e.stopPropagation();  // Detener propagación
        });
    });

    // Desplazar al final del contenido (ejemplo adicional)
    const welcomeSection = document.querySelector('.welcome-section');
    welcomeSection.scrollTop = welcomeSection.scrollHeight;  // Desplazar hacia el final
}
//*-------------------------------------------------------------------------------------


// Función para guardar una mascota en localStorage
function saveMascotaToLocalStorage(mascotaData) {
    let mascotas = JSON.parse(localStorage.getItem('registeredMascotas') || '[]');
    mascotas.push(mascotaData);
    localStorage.setItem('registeredMascotas', JSON.stringify(mascotas));
  }
  
  // Función para agregar una mascota a la tabla (contenedor 2)
  function addMascotaToTable(mascotaData) {
    const tableBody = document.getElementById('petsTableBody');
    if (!tableBody) {
      console.error("No se encontró el elemento con id 'petsTableBody'");
      return;
    }
    const newRow = tableBody.insertRow();
    newRow.innerHTML = `
        <td>${mascotaData.nombre}</td>
        <td>${mascotaData.especie}</td>
        <td>${mascotaData.raza}</td>
        <td>${mascotaData.fechaNacimiento}</td>
        <td>${mascotaData.edad}</td>
        <td>${mascotaData.codClientes}</td>
    `;
  }
  
  // Función para cargar todas las mascotas almacenadas y mostrarlas en la tabla
  function loadMascotasFromLocalStorage() {
    const mascotas = JSON.parse(localStorage.getItem('registeredMascotas') || '[]');
    const tableBody = document.getElementById('petsTableBody');
    if (!tableBody) return;
    tableBody.innerHTML = ''; // Limpiar filas previas
    mascotas.forEach(mascotaData => {
      addMascotaToTable(mascotaData);
    });
  }
  
  // Asignar el event listener al formulario de mascotas
  document.addEventListener('DOMContentLoaded', function() {
    // Cargar los registros existentes al cargar la página
    loadMascotasFromLocalStorage();
  
    // Seleccionar el formulario de mascotas usando la clase "mascota-form"
    const form = document.querySelector('.mascota-form');
    if (form) {
      form.addEventListener('submit', function(event) {
        event.preventDefault(); // Evitar el envío tradicional
  
        // (Opcional) Aquí puedes agregar validaciones adicionales
  
        // Capturar los datos del formulario
        const mascotaData = {
          nombre: document.getElementById('Nombre').value,
          especie: document.getElementById('Especie').value,
          raza: document.getElementById('Raza').value,
          fechaNacimiento: document.getElementById('Fecha_Nacimiento').value,
          edad: document.getElementById('Edad').value,
          codClientes: document.getElementById('Cod_Clientes').value
        };
  
        // Enviar la solicitud al servidor vía fetch si deseas procesarla en PHP
        // (Descomenta la sección de fetch si el PHP debe procesar los datos)
        /*
        const formData = new FormData(form);
        fetch('../Logica_PHP/Mascotas.php', {
          method: 'POST',
          body: formData
        })
        .then(response => response.json())
        .then(data => {
            if (data.exito && data.datos) {
                // Se puede usar la respuesta del servidor para actualizar la tabla
                mascotaData = data.datos;
            }
            // Guardar y actualizar la tabla
            saveMascotaToLocalStorage(mascotaData);
            addMascotaToTable(mascotaData);
        })
        .catch(error => {
            alert('Ocurrió un error al procesar la solicitud: ' + error.message);
        });
        */
  
        // Si deseas procesar el registro localmente (sin fetch), guarda y actualiza la tabla:
        saveMascotaToLocalStorage(mascotaData);
        addMascotaToTable(mascotaData);
  
        // (Opcional) Puedes resetear el formulario después de enviar
        form.reset();
      });
    }
  });
  