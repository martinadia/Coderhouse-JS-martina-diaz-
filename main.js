// formulario inicio de sesion 
const iniciarsesion = document.getElementById('abrirformulario');
const formulario = document.getElementById('formulario');
const formularioVisible = localStorage.getItem('formulariovisible');

if (formularioVisible === 'true') {
    formulario.classList.remove('oculto');
} else {
    formulario.classList.add('oculto');
}

iniciarsesion.addEventListener('click', () => {
    formulario.classList.toggle('oculto');

    const estaVisible = !formulario.classList.contains('oculto');
    localStorage.setItem('formulariovisible', estaVisible);
});

// carrito
const botoncarrito = document.getElementById('boton-carrito')
const carritopanel = document.getElementById('carrito')
const contenedorproductos = document.getElementById('contenedor-productos')
const cosasdelcarrito = document.getElementById('cosas-del-carrito')
const botonterminarcompra = document.getElementById('terminar-la-compra')
const total = document.getElementById('total')

let Carrito = JSON.parse(localStorage.getItem("carrito")) || []

let carritoabierto = JSON.parse(localStorage.getItem('carrito-abierto')) || false

if (carritoabierto) {
    carritopanel.classList.add('active')
} else {
    carritopanel.classList.remove('active')
}

botoncarrito.addEventListener('click', () => {
    if (!carritopanel.classList.contains('active')) {
        carritoabierto = true
    } else {
        carritoabierto = false
    }

    carritopanel.classList.toggle('active')

    localStorage.setItem('carrito-abierto', JSON.stringify(carritoabierto))
})

const productos = [
    {
      id: 1,
      nombre: "My Mind Mirror (Circle)",
      precio: 650000,
      imagen: 'https://i.pinimg.com/736x/45/ac/33/45ac33f2c89266ac8a5c9c9e2143f7d0.jpg',
      alt: "Espejo que indica los cuidados de la piel con una forma circular"
    },
    {
      id: 2,
      nombre: "My Mind Mirror (Square)",
      precio: 700000,
      imagen: "https://i.pinimg.com/736x/60/86/14/6086147de1901095db14d70dfd381c10.jpg",
      alt: "Espejo que indica los cuidados de la piel con una forma cuadrada"
    },
    {
      id: 3,
      nombre: "My Mind Mirror (Wavy)",
      precio: 750000,
      imagen: "https://i.pinimg.com/736x/c0/2d/68/c02d689317ed140ee882466a917fd8ec.jpg",
      alt: "Espejo que indica los cuidados de la piel con una forma ondulada"
    }
];

function run () {
    mostradordeproductos()
    creaciondeproductos()
    eventosagregar()
}

function agregaralcarrito(producto) {
    Carrito.push(producto)
    localStorage.setItem("carrito", JSON.stringify(Carrito))
}

function calculartotal() {
    return Carrito.reduce((acc, el) => {
        return acc += Number(el.precio)
    }, 0)
}

function buscarapartirdeid(id) {
    let producto = productos.find((el) => el.id == id)

    return producto
}

function eventosagregar() {
    const botones = document.querySelectorAll('.boton-agregar-al-carrito')
    const botonesarray = Array.from(botones)

    botonesarray.forEach((el) => {
        el.addEventListener('click', (e) => {
            let id = e.target.parentNode.id
            let producto = buscarapartirdeid(id)
            agregaralcarrito(producto)
            mostradordeproductos()
        })
    })
}

function creaciondeproductos() {
    productos.forEach((el) => {
        let producto =  
            `<div class="producto" id=${el.id}>
                <img src=${el.imagen} alt=${el.alt}>
                <h3>${el.nombre}</h3>
                <p>Un espejo inteligente que indica los cuidados que tu piel necesita</p>
                <span class="precio">$${el.precio}</span>
                <button class="boton-agregar-al-carrito">
                    Agregar al carrito
                </button>
            </div>`

        contenedorproductos.innerHTML += producto
    })
}

function mostradordeproductos() {
    cosasdelcarrito.innerHTML = ''
    Carrito.forEach((el) => {
        let producto = 
            `<div class="producto">
                <img src=${el.imagen} alt=${el.alt}>
                <h3>${el.nombre}</h3>
                <span class="precio">$${el.precio}</span>
            </div>`
        cosasdelcarrito.innerHTML += producto
    })

    total.innerHTML = ''
    total.innerHTML = `Total a pagar: $${calculartotal()}`
}

botonterminarcompra.addEventListener('click', () => {
    Carrito = []
    localStorage.removeItem("carrito")
    mostradordeproductos()
})

run()