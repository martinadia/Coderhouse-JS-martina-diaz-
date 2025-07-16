// formulario inicio de sesion 
const forminiciodesesion = document.getElementById('inicio-de-sesion');
let usuarioslogueados = JSON.parse(localStorage.getItem("usuarios")) || [ 
    {
        email: "martinadiaz@gmail.com",
        contraseña: "beautIA",
    }
]

function iniciodesesion() {
    const el = document.getElementById('inicio-de-sesion');
    if (!el) return;

    el.addEventListener('click', () => {
        Swal.fire({
            title: "Ingrese su usuario",
            html: `
                <input id="swal-input1" class="swal2-input" placeholder="Email">
                <input id="swal-input2" class="swal2-input" placeholder="Contraseña" type="password">
            `,
            preConfirm: () => {
                const email = document.getElementById('swal-input1').value
                const contraseña = document.getElementById('swal-input2').value

                if (!email || !contraseña) {
                    Swal.showValidationMessage('Completá ambos campos')
                    return false
                }

                return { email, contraseña }
            }
        }).then((result) => {
            if (result.isConfirmed) {
                const { email, contraseña } = result.value

                let usuarioExistente = usuarioslogueados.find(
                    (u) => u.email === email
                )

                if (usuarioExistente) {
                    Swal.fire({
                        title: "Usuario ya registrado",
                        text: "Ese correo ya se encuentra en uso. Por favor usá otro.",
                        icon: "error",
                        timer: 1800,
                        showConfirmButton: false,
                    });
                } else {
                    // Registrar al nuevo usuario
                    usuarioslogueados.push({ email, contraseña });
                    localStorage.setItem("usuarios", JSON.stringify(usuarioslogueados));

                Swal.fire({
                    title: "Registrado correctamente",
                    text: "Tu cuenta ha sido creada e iniciada la sesión.",
                    icon: "success",
                    timer: 1800,
                    showConfirmButton: false,
                });
                }
            }
        });
    });
}

function versielusuarioestalogueado(emailUsuario) {
    return usuarioslogueados.find((usuario) => {
        return usuario.email == nombreUsuario
    })
}

forminiciodesesion.addEventListener('submit', (e) => {
    e.preventDefault()
    let elusuarioyaexiste = versielusuarioestalogueado(e.target[0].value)
    if (elusuarioyaexiste) {
        Swal.fire({
            title: "Lo siento!",
            text: "El usuario ya se encuentra en uso, ingrese otro!",
            icon: "error",
            timer: 1300,
            showConfirmButton: false,
        });
    } else {
        usuarioslogueados.push({
            email: e.target[0].value,
            contraseña: e.target[1].value,
        })
        localStorage.setItem('usuarios', JSON.stringify(usuarioslogueados))
        Swal.fire({
            title: "Bienvenido!",
            text: "Se ha iniciado sesion correctamente!",
            icon: "success",
            timer: 1300,
            showConfirmButton: false,
        });
    }
})

// carrito
const botoncarrito = document.getElementById('boton-carrito')
const carritopanel = document.getElementById('carrito')
const contenedorproductos = document.getElementById('contenedor-productos')
const cosasdelcarrito = document.getElementById('cosas-del-carrito')
const botonvaciarcarrito = document.getElementById('vaciarcarrito')
const botonterminarlacompra = document.getElementById('terminarlacompra')
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
    iniciodesesion()
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
            Swal.fire({
                title: "Se agrego " + producto.nombre,
                timer: 1500,
                icon: "success",
                draggable: true,
                showConfirmButton: false, 
            });
            
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
                    <button class="cantidadboton cantidadbotonmenos">-</button>
                    <span class="cantidadnumero">${el.cantidad}</span>
                    <button class="cantidadboton cantidadbotonmas">+</button>
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

botonvaciarcarrito.addEventListener('click', () => { 
    if (Carrito.length === 0) {
        Swal.fire({
            title: "El carrito se encuentra vacio! Agregue sus productos",
            timer: 1300,
            showConfirmButton: false, 
        })
        return
    }
    Swal.fire({
        title: "Estas seguro de vaciar el carrito?",
        text: "No podras retornar al mismo!",
        icon: "warning",
        iconColor: "#d33",
        showCancelButton: true,
        confirmButtonColor: "#B2A0DF",
        cancelButtonColor: "#CCE6E0",
        confirmButtonText: "Si, eliminar!"
    }).then((result) => {
        if (result.isConfirmed) {
            Carrito = []
            localStorage.removeItem("carrito")
            mostradordeproductos()

            Swal.fire({
                title: "¡Eliminado!",
                text: "Tu carrito ha sido eliminado.",
                icon: "success"
            });
        }
    });
});

botonterminarlacompra.addEventListener('click', () => { 
    if (Carrito.length === 0) {
        Swal.fire({
            title: "No se puede terminar la compra. El carrito se encuentra vacio, agregue sus productos!",
            timer: 2300,
            showConfirmButton: false, 
        })
        return
    }
    Swal.fire({
        title: "Complete los datos",
        html: `
            <input id="swal-input1" class="swal2-input" placeholder="Nombre y apellido del recibidor">
            <input id="swal-input2" class="swal2-input" placeholder="Direccion de entrega">
            <input id="swal-input3" class="swal2-input" placeholder="Metodo de pago">
            `,
            preConfirm: () => {
            const nombreyapellido = document.getElementById('swal-input1').value
            const direcciondeentrega = document.getElementById('swal-input2').value
            const metododepago = document.getElementById('swal-input3').value
              
            if (!nombreyapellido || !direcciondeentrega || !metododepago) {
            Swal.showValidationMessage('Completá todos los campos!')
            return false
            }
              
            return { nombreyapellido, direcciondeentrega, metododepago }
        }
    });
})

run();