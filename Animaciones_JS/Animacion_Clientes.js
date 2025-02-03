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
   const clientRegistrationTable = document.querySelector('.proforma-form-container2');
 
   toggleFormButton.addEventListener('click', () => {
     toggleFormButton.classList.toggle('active');
     clientRegistrationTable.classList.toggle('collapsed');
 
     if (clientRegistrationTable.classList.contains('collapsed')) {
       clientRegistrationTable.style.maxHeight = '0';
       clientRegistrationTable.style.overflow = 'hidden';
     } else {
       clientRegistrationTable.style.maxHeight = 'none';
       clientRegistrationTable.style.overflow = 'auto';
     }
   });
 });








  // Calcular edad automáticamente cuando se seleccione la fecha de nacimiento
document.getElementById('Fecha_Nacimiento').addEventListener('change', function() {
const fechaNac = new Date(this.value);
const hoy = new Date();
let edad = hoy.getFullYear() - fechaNac.getFullYear();
const mes = hoy.getMonth() - fechaNac.getMonth();

if (mes < 0 || (mes === 0 && hoy.getDate() < fechaNac.getDate())) {
   edad--;
}

document.getElementById('Edad').value = edad;
});

// Establecer la fecha actual como fecha de registro por defecto
document.getElementById('Fecha_Registro').valueAsDate = new Date();

// Función para agregar más campos de teléfono
function agregarTelefono() {
const container = document.getElementById('telefonosContainer');
const div = document.createElement('div');
div.innerHTML = `
   <input type="tel" name="Telefonos[]" placeholder="Teléfono" pattern="[0-9]{8,}" title="Ingrese al menos 8 dígitos">
   <button type="button" onclick="this.parentElement.remove()" class="remove-button">Eliminar</button>
`;
container.appendChild(div);
}

// Función para agregar más campos de email
function agregarEmail() {
const container = document.getElementById('emailsContainer');
const div = document.createElement('div');
div.innerHTML = `
   <input type="email" name="Emails[]" placeholder="Email">
   <button type="button" onclick="this.parentElement.remove()" class="remove-button">Eliminar</button>
`;
container.appendChild(div);
}



// Verificar el estado del login al cargar la página
document.addEventListener('DOMContentLoaded', function() {
const isLoggedIn = localStorage.getItem('isLoggedIn');
const currentPage = window.location.pathname.split('/').pop();

if (!isLoggedIn) {
   // Si no está logueado y no está en la página principal, redirigir al login
   if (currentPage !== './Capa_Proforma') {
       document.getElementById('loginLayer').style.transform = 'translateX(0)';
       document.getElementById('mainLayer').style.transform = 'translateX(100%)';
   }
} else {
   checkLoginState();
   // Si está logueado y está en la página principal, mostrar el contenido
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
   // Guardar el estado del login
   localStorage.setItem('isLoggedIn', 'true');
   localStorage.setItem('username', username);
   
   document.getElementById('userDisplay').textContent = username;
   document.getElementById('loginLayer').style.transform = 'translateX(-100%)';
   document.getElementById('mainLayer').style.transform = 'translateX(0)';
   
   // Redirigir a capa_proforma.html después del login exitoso
   window.location.href = '../Capa_Proforma.html';
} else {
   alert('Por favor ingrese usuario y contraseña');
}
}

// Función de logout
// Reemplaza la función logout existente en capa_proforma.html con esta:
function logout() {
   // Clear local storage for registered clients
   localStorage.removeItem('registeredClients');
   
   // Clear the table body
   const tableBody = document.getElementById('clientTableBody');
   if (tableBody) {
       tableBody.innerHTML = '';
   }
   
   // Remove login state
   localStorage.removeItem('isLoggedIn');
   localStorage.removeItem('username');
   
   // Redirect to login page
   window.location.href = '../index.html';
}

// Agrega esta función al inicio del archivo para verificar la sesión
window.onload = function() {
const isLoggedIn = localStorage.getItem('isLoggedIn');
if (!isLoggedIn) {
   window.location.href = 'index.html';
}
}

// Función para navegar a la proforma
function navegarProforma(event) {
event.preventDefault();
if (localStorage.getItem('isLoggedIn') === 'true') {
   window.location.href = 'Formularios.html/FORM_Clientes.html';
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
       if (arrow) arrow.classList.remove('active');
   });
}

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

// Manejo de enlaces
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
welcomeSection.scrolltop= welcomeSection.scrollheight;

}




// segunda sesion del welcome-section2 dfh
// Function to save clients to local storage
function saveClientToLocalStorage(clientData) {
   let clients = JSON.parse(localStorage.getItem('registeredClients') || '[]');
   clients.push(clientData);
   localStorage.setItem('registeredClients', JSON.stringify(clients));
}

// Function to load clients from local storage
function loadClientsFromLocalStorage() {
   const clients = JSON.parse(localStorage.getItem('registeredClients') || '[]');
   const tableBody = document.getElementById('clientTableBody');
   tableBody.innerHTML = ''; // Clear existing rows

   clients.forEach(client => {
       const newRow = tableBody.insertRow();
       newRow.innerHTML = `
           <td>${client.nombre}</td>
           <td>${client.apellido}</td>
           <td>${client.genero}</td>
           <td>${client.fechaNacimiento}</td>
           <td>${client.edad}</td>
           <td>${client.direccion}</td>
           <td>${client.ci}</td>
           <td>${client.fechaRegistro}</td>
           <td>${client.preferenciasContacto}</td>
           <td>${client.telefonos.join(', ')}</td>
           <td>${client.emails.join(', ')}</td>
       `;
   });
}

document.querySelector('.proforma-form').addEventListener('submit', function(event) {
   // Capture form values
   const clientData = {
       nombre: document.getElementById('Nombre').value,
       apellido: document.getElementById('Apellido').value,
       genero: document.querySelector('select[name="Genero"]').value,
       fechaNacimiento: document.getElementById('Fecha_Nacimiento').value,
       edad: document.getElementById('Edad').value,
       direccion: document.getElementById('Direccion').value,
       ci: document.getElementById('CI').value,
       fechaRegistro: document.getElementById('Fecha_Registro').value,
       preferenciasContacto: document.getElementById('Preferencias_Contactos').value,
       telefonos: Array.from(document.querySelectorAll('input[name="Telefonos[]"]')).map(tel => tel.value),
       emails: Array.from(document.querySelectorAll('input[name="Emails[]"]')).map(email => email.value)
   };

   // Save to local storage for persistence
   function saveClientToLocalStorage(clientData) {
       let clients = JSON.parse(localStorage.getItem('registeredClients') || '[]');
       clients.push(clientData);
       localStorage.setItem('registeredClients', JSON.stringify(clients));
   }

   // Add row to the table
   function addClientToTable(clientData) {
       const tableBody = document.getElementById('clientTableBody');
       const newRow = tableBody.insertRow();
       newRow.innerHTML = `
           <td>${clientData.nombre}</td>
           <td>${clientData.apellido}</td>
           <td>${clientData.genero}</td>
           <td>${clientData.fechaNacimiento}</td>
           <td>${clientData.edad}</td>
           <td>${clientData.direccion}</td>
           <td>${clientData.ci}</td>
           <td>${clientData.fechaRegistro}</td>
           <td>${clientData.preferenciasContacto}</td>
           <td>${clientData.telefonos.join(', ')}</td>
           <td>${clientData.emails.join(', ')}</td>
       `;
   }

   // Allow form submission to PHP
   // Local storage and table update happens after successful submission
   saveClientToLocalStorage(clientData);
   addClientToTable(clientData);
});

// Load existing clients from local storage when page loads
document.addEventListener('DOMContentLoaded', function() {
   const clients = JSON.parse(localStorage.getItem('registeredClients') || '[]');
   const tableBody = document.getElementById('clientTableBody');
   
   clients.forEach(clientData => {
       const newRow = tableBody.insertRow();
       newRow.innerHTML = `
           <td>${clientData.nombre}</td>
           <td>${clientData.apellido}</td>
           <td>${clientData.genero}</td>
           <td>${clientData.fechaNacimiento}</td>
           <td>${clientData.edad}</td>
           <td>${clientData.direccion}</td>
           <td>${clientData.ci}</td>
           <td>${clientData.fechaRegistro}</td>
           <td>${clientData.preferenciasContacto}</td>
           <td>${clientData.telefonos.join(', ')}</td>
           <td>${clientData.emails.join(', ')}</td>
       `;
   });
});


