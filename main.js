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

// productos

const productos = []

async function traerproductos() {
    try {
        const resultado = await fetch('./data.json')
        const data = await resultado.json()

        data.forEach((el) => {
            productos.push(el)
        })

    } catch (error) {
        console.error("Error al traer productos:", error)
    }
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

async function run () {
    await traerproductos()
    mostradordeproductos()
    creaciondeproductos()
    eventosagregar()
}

function agregaralcarrito(producto) {
    let id = Carrito.findIndex((el) => el.id === producto.id)
    if (id == -1) {
        Carrito.push(producto)
        Carrito[Carrito.length - 1].cantidad = 1
    } else {
        Carrito[id].cantidad += 1
    }
}

function calculartotal() {
    return Carrito.reduce((acc, el) => {
        return (acc += Number(el.precio) * el.cantidad)
    }, 0)
}

function buscarapartirdeid(id) {
    let producto = productos.find((el) => el.id == id.slice(0, -1))

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

function eventosagregarmas() {
    const botones = document.querySelectorAll('.cantidadbotonmas')
    const botonesarray = Array.from(botones)

    botonesarray.forEach(boton=>{
        boton.addEventListener("click", (e) =>{
            let id = Carrito.findIndex(ele => ele.id == e.target.parentNode.parentNode.id.slice(0, -1))
            Carrito[id].cantidad += 1
            mostradordeproductos()
        })
    })
}

function eventosagregarmenos() {
    const botones = document.querySelectorAll('.cantidadbotonmenos')
    const botonesarray = Array.from(botones)

    botonesarray.forEach((boton) => {
        boton.addEventListener('click', (e) => {
            let id = Carrito.findIndex(
                (ele) => ele.id == e.target.parentNode.parentNode.id.slice(0, -1)
            )
            if (Carrito[id].cantidad == 1){
                Carrito.splice(id, 1)
            } else {
                Carrito[id].cantidad -= 1
            }
            mostradordeproductos()
        })
    })
}

function creaciondeproductos() {
    productos.forEach((el) => {
        let producto =  
            `<div class="producto" id=${el.id + 'V'}>
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
            `<div class="producto" id=${el.id + 'V'}>
                <img src=${el.imagen} alt=${el.alt}>
                <h3>${el.nombre}</h3>
                <div class="cantidaddeproductos">
                    <button class="cantidadboton cantidadbotonmenos"></button>
                    <span class="cantidadnumero">${el.cantidad}</span>
                    <button class="cantidadboton cantidadbotonmas"></button>
                </div>
                <span class="precio">$${el.precio * el.cantidad}</span>
            </div>`
        cosasdelcarrito.innerHTML += producto
    })

    total.innerHTML = ''
    eventosagregarmas()
    eventosagregarmenos()
    localStorage.setItem("carrito", JSON.stringify(Carrito))
    total.innerHTML = `Total a pagar: $${calculartotal()}`
}

botonterminarcompra.addEventListener('click', () => {
    
    Carrito = []
    localStorage.removeItem("carrito")
    mostradordeproductos()
})

run()