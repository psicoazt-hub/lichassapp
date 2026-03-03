const SCRIPT_URL = "TU_URL_DE_APPS_SCRIPT"; 
let usuarioActual = localStorage.getItem('usuarioLicha') || "";
let ventasAcumuladas = parseFloat(localStorage.getItem('ventasLicha')) || 0;

if(usuarioActual) restaurarSesion(); // Persistencia al abrir de nuevo

setInterval(() => { document.getElementById('reloj').innerText = new Date().toLocaleString(); }, 1000);

function enviarDatos(obj) { fetch(SCRIPT_URL, { method: 'POST', mode: 'no-cors', body: JSON.stringify(obj) }); }

function iniciarSesión() {
    const u = document.getElementById('user').value.trim();
    const p = document.getElementById('pass').value.trim();
    
    if (p === "TortillasLicha") { // Llave Maestra CEO
        usuarioActual = "Pantera (Director General)";
        cambiarVista('vista-admin');
    } else {
        usuarioActual = u;
        cambiarVista('vista-empleado');
    }
    localStorage.setItem('usuarioLicha', usuarioActual);
    enviarDatos({tipo: "asistencia", usuario: usuarioActual, evento: "Entrada"});
}

function enviarVenta() {
    let k = parseFloat(document.getElementById('kilos').value);
    let prod = document.getElementById('producto-tipo').value;
    let tipoP = document.querySelector('input[name="p-tipo"]:checked').value;
    let precio = (tipoP === "Publico") ? 22 : 18; // Precios según ruta o público

    let total = k * precio;
    ventasAcumuladas += total;
    localStorage.setItem('ventasLicha', ventasAcumuladas);

    enviarDatos({tipo: "venta", vendedor: usuarioActual, producto: prod, kilos: k, precioTipo: tipoP, total: total});
    alert("Venta Guardada: $" + total.toFixed(2));
    document.getElementById('kilos').value = "";
}

function realizarCorte() {
    let ef = parseFloat(prompt("DINERO REAL EN EFECTIVO ($):"));
    let dif = ef - ventasAcumuladas;
    enviarDatos({tipo: "corte", usuario: usuarioActual, ventasTotales: ventasAcumuladas, efectivoReal: ef, diferencia: dif});
    alert("Corte Exitoso. Diferencia: $" + dif);
    ventasAcumuladas = 0;
    localStorage.setItem('ventasLicha', 0);
}

function verFaltas() {
    let fecha = prompt("Fecha de la falta (DD/MM/AAAA):");
    let emp = prompt("Nombre del empleado que faltó:");
    enviarDatos({tipo: "falta", usuario: emp, fechaFalta: fecha, motivo: "Reportado por Admin"});
    alert("Falta registrada en el calendario de Excel");
}

function salir() {
    enviarDatos({tipo: "asistencia", usuario: usuarioActual, evento: "Salida"});
    localStorage.clear();
    location.reload();
}

function cambiarVista(id) {
    document.querySelectorAll('.vista').forEach(v => v.classList.remove('activa'));
    document.getElementById(id).classList.add('activa');
    document.getElementById('título-usuario').innerText = usuarioActual;
}

function restaurarSesion() {
    if(usuarioActual.includes("Pantera")) cambiarVista('vista-admin');
    else cambiarVista('vista-empleado');
}

function cambiarModo() { document.body.classList.toggle('modo-oscuro'); }
