const apiUrl = "https://fakestoreapi.com/products"; // API de prueba (Fake Store API)
const contadorCarrito = document.getElementById('contadorCarrito');
const sonidoProductoAlcarrito = new Audio("/sounds/agregarAlCarrito.MP3");
const compraExitosa = new Audio("/sounds/compraExitosa.MP3");
const alerta = new Audio("/sounds/alerta.MP3");
const carritoBorrado = new Audio ("/sounds/stop.mp3");

let carrito = [];
let total = 0;


// Cargar carrito desde Local Storage al iniciar
function cargarCarritoDesdeStorage() {
  const carritoStorage = localStorage.getItem('carrito');
  if (carritoStorage) {
    carrito = JSON.parse(carritoStorage);
    carrito.forEach(producto => {
      total += producto.precio;
    });
    actualizarCarrito();
  }
}

// Guardar carrito en Local Storage
function guardarCarritoEnStorage() {
  localStorage.setItem('carrito', JSON.stringify(carrito));
}

// Función para obtener productos de la API y mostrarlos como cards
function cargarProductos() {
  fetch(apiUrl)
    .then(response => response.json())
    .then(data => {
      const contenedor = document.getElementById('productos');
      contenedor.innerHTML = ''; // Limpia el contenedor
      data.slice(0,20).forEach(producto => {
        const card = `
          <div class="col-md-3 mb-4">
            <div class="card h-100 producto">
              <img src="${producto.image}" class="card-img-top imagen-producto" alt="${producto.title}">
              <div class="card-body">
                <h5 class="card-title">${producto.title}</h5>
                <p class="card-text">${producto.description.slice(0, 50)}...</p>
                <p class="card-text"><strong>Precio:</strong> $${producto.price.toFixed(2)}</p>
                <button class="btn btn-primary agregado" onclick="agregarAlCarrito(${producto.id}, '${producto.title}', ${producto.price})">Agregar al Carrito</button>
              </div>
            </div>
          </div>
        `;
        contenedor.innerHTML += card;
      });
    });
}

// Actualizar el contador del carrito
function actualizarContadorCarrito() {
  contadorCarrito.textContent = carrito.length;
}

// Función para agregar productos al carrito
function agregarAlCarrito(id, nombre, precio) {
  carrito.push({ id, nombre, precio });
  total += precio;
  guardarCarritoEnStorage();
  actualizarCarrito();
  actualizarContadorCarrito(); // Actualiza el contador después de agregar
  Swal.fire({
    title: "Producto agregado al carrito",
    icon: "success",
    draggable: true
  });
  sonidoProductoAlcarrito.play();
}

// Función para actualizar la vista del carrito
function actualizarCarrito() {
  const listaCarrito = document.getElementById('listaCarrito');
  const totalCarrito = document.getElementById('totalCarrito');

  listaCarrito.innerHTML = '';
  carrito.forEach((producto, index) => {
    listaCarrito.innerHTML += `
      <li class="list-group-item d-flex justify-content-between align-items-center">
        ${producto.nombre} - $${producto.precio.toFixed(2)}
        <button class="btn btn-sm btn-danger" onclick="eliminarDelCarrito(${index})">Eliminar</button>
      </li>
    `;
  });

  totalCarrito.textContent = total.toFixed(2);
}

// Función para borrar el carrito
function borrarCarrito() {
      carrito = [];
      total = 0;
      guardarCarritoEnStorage();
      actualizarCarrito();
      actualizarContadorCarrito(); // Actualiza el contador después de eliminar
}

// Función para eliminar productos del carrito
function eliminarDelCarrito(index) {
  total -= carrito[index].precio;
  carrito.splice(index, 1);
  guardarCarritoEnStorage();
  actualizarCarrito();
  actualizarContadorCarrito(); // Actualiza el contador después de eliminar
  carritoBorrado.play();
}

//Botón borrar carrito
let btnBorrar = document.querySelector(".borrar");
btnBorrar.addEventListener('click' , () =>{
        borrarCarrito();
        carritoBorrado.play();
});

//Botón de compra
let btnCompra = document.querySelector(".compraOk");
btnCompra.addEventListener('click', () => 
  {

    if (total == 0) {
          Swal.fire({
            title: '¡Atención!',
            text: '¡Ud. no tiene productos en el carrito de compras!',
            icon: 'error',
            confirmButtonText: 'Aceptar'
          });
          alerta.play();
    }else{
          Swal.fire({
              title: '¡Gracias!',
              text: 'Su compra fue procesada con éxito',
              icon: 'success',
              confirmButtonText: 'Aceptar'
          });
          compraExitosa.play();
          borrarCarrito();
    }
  });

// Cargar productos y carrito al inicio
document.addEventListener('DOMContentLoaded', () => {
  cargarProductos();
  cargarCarritoDesdeStorage();
  actualizarContadorCarrito(); // Contador se actualiza al cargar la página
});