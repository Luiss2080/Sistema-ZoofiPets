   // Animación para mostrar u ocultar el formulario
   const toggleButton = document.querySelector('.toggle-form');
   const formContainer = document.querySelector('.proforma-form-container');

   toggleButton.addEventListener('click', () => {
       formContainer.classList.toggle('open');
       toggleButton.classList.toggle('open');
   });

document.addEventListener("DOMContentLoaded", () => {
   const toggleForm = document.querySelector(".toggle-form");

   toggleForm.addEventListener("click", () => {
       toggleForm.classList.toggle("active");
   });
});



// Add this to your existing JavaScript file
document.addEventListener('DOMContentLoaded', () => {
    const toggleFormButton = document.querySelector('.toggle-form2');
    const trabajadorRegistrationTable = document.querySelector('.proforma-form-container2');
  
    toggleFormButton.addEventListener('click', () => {
      toggleFormButton.classList.toggle('active');
      trabajadorRegistrationTable.classList.toggle('collapsed');
  
      if (trabajadorRegistrationTable.classList.contains('collapsed')) {
        trabajadorRegistrationTable.style.maxHeight = '0';
        trabajadorRegistrationTable.style.overflow = 'hidden';
      } else {
        trabajadorRegistrationTable.style.maxHeight = 'none';
        trabajadorRegistrationTable.style.overflow = 'auto';
      }
    });
  });
 


/* ----------- CALCULO DE EDAD AUTOMÁTICO Y FECHA DE INGRESO ---------- */

// Calcular edad automáticamente cuando se seleccione la fecha de nacimiento
document.getElementById('Fecha_Nacimiento').addEventListener('change', function() {
    const fechaNac = new Date(this.value);  // Fecha de nacimiento seleccionada
    const hoy = new Date();  // Fecha actual
    let edad = hoy.getFullYear() - fechaNac.getFullYear();  // Cálculo básico de la edad
    const mes = hoy.getMonth() - fechaNac.getMonth();  // Ajuste por mes de nacimiento

    // Ajuste de edad si aún no ha cumplido años este año
    if (mes < 0 || (mes === 0 && hoy.getDate() < fechaNac.getDate())) {
        edad--;  // Resta un año si no ha pasado su cumpleaños aún
    }

    document.getElementById('Edad').value = edad;  // Asigna la edad calculada al campo correspondiente
});

// Establecer la fecha actual como fecha de ingreso por defecto
document.getElementById('Fecha_Ingreso').valueAsDate = new Date();  // Asigna la fecha actual al campo de ingreso




/* ----------- FUNCIONES PARA AGREGAR TELÉFONOS Y CORREOS ---------- */

// Función para agregar más campos de teléfono
function agregarTelefono() {
    const container = document.getElementById('telefonosContainer');  // Contenedor de los teléfonos
    const div = document.createElement('div');  // Crea un nuevo div para el teléfono
    div.innerHTML = `
        <input type="tel" name="Telefonos[]" placeholder="Teléfono" pattern="[0-9]{8,}" title="Ingrese al menos 8 dígitos">
        <button type="button" onclick="this.parentElement.remove()" class="remove-button">Eliminar</button>
    `;
    container.appendChild(div);  // Añade el nuevo div al contenedor
}

// Función para agregar más campos de email
function agregarEmail() {
    const container = document.getElementById('emailsContainer');  // Contenedor de los correos electrónicos
    const div = document.createElement('div');  // Crea un nuevo div para el correo
    div.innerHTML = `
        <input type="email" name="Emails[]" placeholder="Email">
        <button type="button" onclick="this.parentElement.remove()" class="remove-button">Eliminar</button>
    `;
    container.appendChild(div);  // Añade el nuevo div al contenedor
}



/* ----------- FUNCIONES DE LOGIN Y VERIFICACIÓN DE SESIÓN ---------- */

// Función para verificar el estado del login al cargar la página
document.addEventListener('DOMContentLoaded', function() {
    const isLoggedIn = localStorage.getItem('isLoggedIn');  // Verifica si hay sesión activa
    const currentPage = window.location.pathname.split('/').pop();  // Obtiene el nombre de la página actual
    
    // Si no está logueado y no está en la página de Proforma, se muestra la capa de login
    if (!isLoggedIn) {
        if (currentPage !== './Capa_Proforma') {
            document.getElementById('loginLayer').style.transform = 'translateX(0)';
            document.getElementById('mainLayer').style.transform = 'translateX(100%)';
        }
    } else {
        checkLoginState();  // Verifica el estado del login si ya está logueado
        if (currentPage === './Capa_Proforma') {
            document.getElementById('loginLayer').style.transform = 'translateX(-100%)';
            document.getElementById('mainLayer').style.transform = 'translateX(0)';
        }
    }
    setupEventListeners();  // Configura los event listeners al cargar la página
});

// Función para verificar el estado del login
function checkLoginState() {
    const isLoggedIn = localStorage.getItem('isLoggedIn');  // Verifica si el usuario está logueado
    const username = localStorage.getItem('username');  // Obtiene el nombre de usuario

    // Si está logueado y hay un nombre de usuario, muestra el nombre en el panel
    if (isLoggedIn === 'true' && username) {
        document.getElementById('userDisplay').textContent = username;  // Muestra el nombre de usuario
        document.getElementById('loginLayer').style.transform = 'translateX(-100%)';  // Oculta la capa de login
        document.getElementById('mainLayer').style.transform = 'translateX(0)';  // Muestra la capa principal
    }
}

// Función de login
function login() {
    const username = document.getElementById('username').value;  // Obtiene el valor del campo de usuario
    const password = document.getElementById('password').value;  // Obtiene el valor del campo de contraseña

    // Si el nombre de usuario y contraseña son válidos, guarda la sesión
    if (username && password) {
        localStorage.setItem('isLoggedIn', 'true');  // Guarda estado de sesión
        localStorage.setItem('username', username);  // Guarda el nombre de usuario

        document.getElementById('userDisplay').textContent = username;  // Muestra el nombre de usuario
        document.getElementById('loginLayer').style.transform = 'translateX(-100%)';  // Oculta la capa de login
        document.getElementById('mainLayer').style.transform = 'translateX(0)';  // Muestra la capa principal

        // Redirige a la página Proforma después del login exitoso
        window.location.href = '../Capa_Proforma.html';
    } else {
        alert('Por favor ingrese usuario y contraseña');  // Muestra un mensaje si falta algún dato
    }
}

// Función de logout
// Reemplaza la función logout existente en capa_proforma.html con esta:
function logout() {
    // Clear local storage for registered clients
    localStorage.removeItem('registeredtrabajadores');
    
    // Clear the table body
    const tableBody = document.getElementById('trabajadorTableBody');
    if (tableBody) {
        tableBody.innerHTML = '';
    }
    
    // Remove login state
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('username');
    
    // Redirect to login page
    window.location.href = '../index.html';
 }

// Función al cargar la página para verificar la sesión
window.onload = function() {
    const isLoggedIn = localStorage.getItem('isLoggedIn');  // Verifica si hay sesión activa
    if (!isLoggedIn) {
        window.location.href = 'index.html';  // Redirige a la página de inicio si no está logueado
    }
}




/* ----------- FORMULARIO PROFORMA CON DESPLAZAMIENTO ---------- */

// Función para navegar a la proforma
function navegarProforma(event) {
    event.preventDefault();
    // Verifica si el usuario está logueado
    if (localStorage.getItem('isLoggedIn') === 'true') {
        // Si está logueado, redirige a la página de formularios
        window.location.href = 'Formularios.html/FORM_Trabajadores.html';
    }
}


// Función para manejar la visibilidad de las secciones
function toggleSectionVisibility(sectionToShow) {
    // Ocultar todas las secciones excepto la barra superior
    const sections = document.querySelectorAll('.main-content > div:not(.top-bar)');
    sections.forEach(section => {
        section.style.display = 'none';
    });

    // Mostrar la sección solicitada
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
    
    /* ----------- FUNCIONES DE CIERRE DE SUBMENÚS ---------- */

    // Función para cerrar todos los submenús
    function closeAllSubmenus() {
        document.querySelectorAll('.submenu.active').forEach(submenu => {
            submenu.classList.remove('active');
            const arrow = submenu.parentElement.querySelector('.arrow');
            if (arrow) arrow.classList.remove('active');
        });
    }

    /* ----------- INTERACCIONES CON EL MENÚ PRINCIPAL ---------- */

    // Click en los items del menú
    document.querySelectorAll('.menu-item').forEach(item => {
        item.addEventListener('click', function(e) {
            e.stopPropagation();
            
            // Si el sidebar está colapsado, primero lo expandimos
            if (!sidebar.classList.contains('expanded')) {
                sidebar.classList.add('expanded');
                mainContent.classList.add('expanded');
                return;
            }

            // Si es el menú de inicio, navegamos a capa_proforma.html
            if (this.id === 'menuInicio') {
                // Verifica si el usuario está logueado antes de navegar
                if (localStorage.getItem('isLoggedIn') === 'true') {
                    window.location.href = '/capa_proforma.html';
                } else {
                    alert('Debe iniciar sesión primero');
                }
                return;
            }

            /* ----------- MANEJO DE SUBMENÚS ---------- */

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

    /* ----------- INTERACCIONES FUERA DEL MENÚ ---------- */

    // Click fuera del sidebar para colapsarlo
    document.addEventListener('click', function(e) {
        // Verifica si el click es fuera del sidebar
        if (!sidebar.contains(e.target) && !e.target.matches('#menu-toggle')) {
            sidebar.classList.remove('expanded');
            mainContent.classList.remove('expanded');
            closeAllSubmenus();
        }
    });

    // Toggle del menú hamburguesa
    document.getElementById('menu-toggle').addEventListener('click', function(e) {
        e.stopPropagation();
        // Toggle para expandir o colapsar el sidebar
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

    /* ----------- MANEJO DE ENLACES CON RESTRICCIÓN DE ACCESO ---------- */

    // Manejo de enlaces
    document.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', function(e) {
            // Verifica si el usuario está logueado antes de permitir navegar
            if (localStorage.getItem('isLoggedIn') !== 'true') {
                e.preventDefault();
                alert('Debe iniciar sesión primero');
            }
        });
    });

    /* ----------- PREVENCIÓN DE PROPAGACIÓN EN SUBMENÚS ---------- */

    // Prevenir que el click en los submenús propague al menú principal
    document.querySelectorAll('.submenu li').forEach(item => {
        item.addEventListener('click', function(e) {
            e.stopPropagation();
        });
    });

    /* ----------- EJEMPLO DE DESPLAZAMIENTO AL FINAL DEL CONTENIDO ---------- */
    const welcomeSection = document.querySelector('.welcome-section');
    // Desplazar al final del contenido
    welcomeSection.scrolltop= welcomeSection.scrollheight;
}



//-----------------------------------------------------------------------------------

// segunda sesion del welcome-section2 dfh
// Function to save workers to local storage
function saveTrabajadorToLocalStorage(trabajadorData) {
    let trabajador = JSON.parse(localStorage.getItem('registeredtrabajador') || '[]');
    trabajador.push(trabajadorData);
    localStorage.setItem('registeredtrabajador', JSON.stringify(trabajador));
}

// Function to load workers from local storage
function loadtrabajadorFromLocalStorage() {
    const trabajador = JSON.parse(localStorage.getItem('registeredtrabajador') || '[]');
    const tableBody = document.getElementById('trabajadorTableBody');
    tableBody.innerHTML = ''; // Clear existing rows

    trabajador.forEach(trabajador => {
        const newRow = tableBody.insertRow();
        newRow.innerHTML = `
          
            <td>${trabajador.nombre}</td>
            <td>${trabajador.apellido}</td>
            <td>${trabajador.genero}</td>
            <td>${trabajador.fecha_nacimiento}</td>
            <td>${trabajador.edad}</td>
            <td>${trabajador.direccion}</td>
            <td>${trabajador.ci}</td>
            <td>${trabajador.fecha_registro}</td>
            <td>${trabajador.preferencias_contactos}</td>
        `;
    });
}
// Event listener for form submission
document.querySelector('.trabajador-form').addEventListener('submit', function(event) {
    // Capture form values
    const trabajadorData = {
      
        nombre: document.getElementById('Nombre').value,
        apellido: document.getElementById('Apellido').value,
        genero: document.querySelector('select[name="Genero"]').value,
        fecha_nacimiento: document.getElementById('Fecha_Nacimiento').value,
        edad: document.getElementById('Edad').value,
        direccion: document.getElementById('Direccion').value,
        ci: document.getElementById('CI').value,
        fecha_registro: document.getElementById('Fecha_Registro').value,
        preferencias_contactos: document.getElementById('Preferencias_Contactos').value
    };
   // Save to local storage for persistence
   function saveTrabajadorToLocalStorage(trabajadorData) {
    let trabajador = JSON.parse(localStorage.getItem('registeredtrabajador') || '[]');
    trabajador.push(trabajadorData);
    localStorage.setItem('registeredtrabajador', JSON.stringify(trabajador));
}

 // Add row to the table
 function addTrabajadorToTable(trabajadorData){
    const tableBody = document.getElementById('trabajadorTableBody');
 const newRow = tableBody.insertRow();
 newRow.innerHTML = `
    
     <td>${trabajadorData.nombre}</td>
     <td>${trabajadorData.apellido}</td>
     <td>${trabajadorData.genero}</td>
     <td>${trabajadorData.fecha_nacimiento}</td>
     <td>${trabajadorData.edad}</td>
     <td>${trabajadorData.direccion}</td>
     <td>${trabajadorData.ci}</td>
     <td>${trabajadorData.fecha_registro}</td>
     <td>${trabajadorData.preferencias_contactos}</td>
   `;
 }

 
   // Allow form submission to PHP
   // Local storage and table update happens after successful submission
   saveTrabajadorToLocalStorage(trabajadorData);
   addTrabajadorToTable(trabajadorData);
});

// Load existing clients from local storage when page loads
document.addEventListener('DOMContentLoaded', function() {
   const trabajador = JSON.parse(localStorage.getItem('registeredtrabajador') || '[]');
   const tableBody = document.getElementById('TrabajadorTableBody');
   
   trabajador.forEach(trabajadorData => {
       const newRow = tableBody.insertRow();
       newRow.innerHTML = `
       
     <td>${trabajadorData.nombre}</td>
     <td>${trabajadorData.apellido}</td>
     <td>${trabajadorData.genero}</td>
     <td>${trabajadorData.fecha_nacimiento}</td>
     <td>${trabajadorData.edad}</td>
     <td>${trabajadorData.direccion}</td>
     <td>${trabajadorData.ci}</td>
     <td>${trabajadorData.fecha_registro}</td>
     <td>${trabajadorData.preferencias_contactos}</td>
       `;
   });
});


// Función para cargar los trabajadores desde el servidor
function cargarTrabajadoresDesdeServidor() {
    fetch('../Logica_PHP/Trabajadores.php')
        .then(response => response.json())
        .then(data => {
            if (data.exito) {
                const tableBody = document.getElementById('trabajadorTableBody');
                tableBody.innerHTML = '';
                data.trabajadores.forEach(trabajador => {
                    const row = tableBody.insertRow();
                    row.innerHTML = `
                        <td>${trabajador.nombre}</td>
                        <td>${trabajador.apellido}</td>
                        <td>${trabajador.genero}</td>
                        <td>${trabajador.fecha_nacimiento}</td>
                        <td>${trabajador.edad}</td>
                        <td>${trabajador.direccion}</td>
                        <td>${trabajador.ci}</td>
                        <td>${trabajador.fecha_ingreso}</td>
                        <td>${trabajador.cargo}</td>
                        <td>${trabajador.salario}</td>
                        <td>${trabajador.telefonos}</td>
                        <td>${trabajador.emails}</td>`;
                });
            } else {
                console.error('Errores al cargar:', data.errores);
            }
        })
        .catch(error => console.error('Error en la solicitud:', error));
}

// Funciones para agregar más campos dinámicos
function agregarTelefono() {
    const container = document.getElementById('telefonosContainer');
    const div = document.createElement('div');
    div.innerHTML = `
        <input type="tel" name="Telefonos[]" placeholder="Teléfono">
        <button type="button" onclick="this.parentElement.remove()">Eliminar</button>
    `;
    container.appendChild(div);
}

function agregarEmail() {
    const container = document.getElementById('emailsContainer');
    const div = document.createElement('div');
    div.innerHTML = `
        <input type="email" name="Emails[]" placeholder="Email">
        <button type="button" onclick="this.parentElement.remove()">Eliminar</button>
    `;
    container.appendChild(div);
}



