const productos = []
let bandera = true

function creadordeproductos (nombredelproducto, preciodelproducto){
    const agregadodeproductos = {
        nombre: nombredelproducto,
        precio: preciodelproducto,
    }

    productos.push(agregadodeproductos)
}

function carritodeproductos() {
    if(productos.length == 0){
        alert("No se encuentran productos dentro del carrito")
        return
    }
    let mensaje = 'Los productos dentro del carrito son:\n'

    for (let i = 0; i < productos.length; i++) {
       mensaje += `\n ${productos[i].nombre} - $ ${productos[i].precio}`
    }

    alert(mensaje)
}

function pago(){
    let mensaje = 'Su carrito contiene los siguientes productos:\n'
    let total = 0
    for (let i = 0; i < productos.length; i++) {
        let precio = Number(productos[i].precio)
        if (precio <= 0 || isNaN(precio)){
            mensaje += `\n ${productos[i].nombre} - Precio Invalido`
        } else {
            mensaje += `\n ${productos[i].nombre} - $ ${precio}`
            total += precio
        }
    }

    mensaje += `\nTotal a pagar: $ ${total}`

    alert(mensaje)
}

const menu = 'Bienvenido a Zummalu Indumentaria!\n 1- Iniciar Sesion\n 2- Agregar Producto\n 3- Ver el Carrito\n 4- Continuar con el pago\n 5- Salir'

while(bandera) {
    let opciones = Number(prompt(menu))

    switch (opciones) {
        case 1:
            let username = prompt("Indique su usuario")
            let contraseña = prompt("Indique su contraseña")
            break
        case 2:
            let nombreaux = prompt("Ingrese el nombre del producto que desea agregar al carrito")
            let precioaux = prompt("Ingrese el precio del producto que desea agregar al carrito")
            if (precioaux <= 0){
                alert("El precio ingresado no es valido, agregue un precio real!")
            } 
            creadordeproductos(nombreaux, precioaux)
            break
        case 3: 
            carritodeproductos()
            break
        case 4:
            pago()
            break
        case 5:
            bandera = false
            break
        default:
            alert("Esa opcion no la tenemos, indique un numero que se encuentre dentro de las opciones!")
            break
    }     
}
