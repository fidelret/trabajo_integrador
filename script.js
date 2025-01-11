const apiUrl = "https://fakestoreapi.com/products"; // API de prueba (Fake Store API)
const contadorCarrito = document.getElementById('contadorCarrito');

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

// Función para eliminar productos del carrito
function eliminarDelCarrito(index) {
  total -= carrito[index].precio;
  carrito.splice(index, 1);
  guardarCarritoEnStorage();
  actualizarCarrito();
  actualizarContadorCarrito(); // Actualiza el contador después de eliminar
}

//Botón de compra
let btnCompra = document.querySelector(".compraOk");
btnCompra.addEventListener('click', () => 
  {
      Swal.fire({
          title: '¡Gracias!',
          text: 'Su compra fue procesada con éxito',
          icon: 'success',
          confirmButtonText: 'Aceptar'
      });

  });

// Cargar productos y carrito al inicio
document.addEventListener('DOMContentLoaded', () => {
  cargarProductos();
  cargarCarritoDesdeStorage();
  actualizarContadorCarrito(); // Contador se actualiza al cargar la página
});