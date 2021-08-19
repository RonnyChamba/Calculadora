// Importar Funciones
import { modal, mensaje as mensajeAlert } from "./componentes.js";

// Crear el modal
modal();

// Selecciono todos los (button)
const $botones = [...document.querySelectorAll("button")];

// input donde muestra el numero presionado
const $display = document.getElementById("display");
// input donde se mustra el acumulado de la operacion: 1+2+3+ ...
const $displayAcu = document.getElementById("display-acu");
let acumulador = 0;

// Para saber si ha pulsado un boton de una operacion
let opeActive = false;
// Para saber si el resultado de operacion esta mostrada o no
let opeResultMostrada = false;

/* typeOpe Almacena el tipo de operacion a realzar(importante cuando precione en el boton igual)
  Se modifica su valor, cada vez que pulso un boton de operacion(+,-,*...et)
*/
let typeOpe = "";

// Para saber si el valor mostrado en el display, fue despues de presionar igual
let banderIgual = false;

// almacena el setTimeout
let temporizador = 0;

// Estado: encendido o apagado
let estadoCalc = false;

$botones.forEach((item) => listenerBtn(item));

function listenerBtn(item) {
  item.addEventListener("click", (e) => {
    let dataAtributeValue = item.getAttribute("data-value");

    // encendido o apagado calculadora
    if (dataAtributeValue === "estado-calc") onOffCalculadora(item);

    if (estadoCalc) {
      // Numeros[0-9]
      if (!isNaN(dataAtributeValue)) mostrarNumeros(dataAtributeValue);

      // Resetear(todo) o limpiar(uno x uno)
      if (dataAtributeValue === "clear" || dataAtributeValue === "reset")
        resetearLimpiar(dataAtributeValue);

      // Clic sobre los botones de operaciones
      if (item.classList.contains("btn--ope"))
        botonOperaciones(dataAtributeValue);

      if (item.classList.contains("btn--igual")) btnIgual();
      if (item.classList.contains("btn--punto")) btnPunto(dataAtributeValue);

      // boton de perfil desarrollador
      if (dataAtributeValue === "info")
        document.getElementById("modal").classList.add("modal--show");

      // boton cerrar modal
      if (dataAtributeValue === "btn-cerrar-modal")
        document.getElementById("modal").classList.remove("modal--show");
    } else {
      let mensaje =
        dataAtributeValue === "estado-calc"
          ? "Calculadora Apagada"
          : "La calculadora se encuentra apagada";

      mostrarMensaje(mensaje);
    }

    // boton cerrar mensaje | esta fuera de la validacion porque debe permitir cerrar sms
    // aunque la calculadora este desacticvada.
    if (dataAtributeValue === "btn-mensaje") {
      // Detener el temporizador que se inicia cuando se muestra el mensaje de alerta
      clearTimeout(temporizador);
      document
        .querySelector(".mensaje-alert")
        .classList.remove("mensaje-alert--show");
    }
  });
}
const resetearLimpiar = (tipoOperacion) => {
  if (tipoOperacion === "clear") {
    // Si es falso quiere decir, que el valor que se muestra en el input, ya no es el resultado
    // de la operacion,  ahora si puedo limpiar(caracter x caracter)
    if (!opeResultMostrada) {
      // Obtener la longitud
      let longValue = $display.value.length;
      // Si hay mas de un caracter, solo le resto el ultimo
      if (longValue != 1)
        $display.value = $display.value.substring(0, longValue - 1);
      // Si es el ultimo caracter que limpiaré, ubico 0
      else $display.value = "0";
    }
    // Resetear
  } else resetValores();
};
const mostrarNumeros = (dataAtributeValue) => {
  /* 1) Si es el primer numero y es 0 que reemplace
     2) Si opeActive es True, quiere decir que antes de haber pulsado este numero
        pulso un boton de operacion, entonces tambien tiene q reemplazar.
      3) Si banderaIgual es true, quiere decir que el valor que se muestra en el display 
      es el resultado de la operacion, y si ahora presiona en un boton numero, tendra que reemplzar el dato del display
    */

  if (
    ($display.value.length == 1 && $display.value === "0") ||
    opeActive ||
    banderIgual
  ) {
    $display.value = dataAtributeValue;
    opeActive = false;
    banderIgual = false;
  } else $display.value += dataAtributeValue;

  // Bandera que permita validar en clear y reset
  opeResultMostrada = false;
};
const botonOperaciones = (dataAtributeValue) => {
  /* Para que no presione dos veces seguida la misma operacion,
   despues de presionar en una de ellas, debe presionar un numero*/
  if (!opeActive) {
    opeActive = true;
    // Ubicar el display--acumulador el valor actual de input
    $displayAcu.value += `${$display.value} ${dataAtributeValue} `;
    let numeroInput = parseFloat($display.value);

    typeOpe = dataAtributeValue;
    if (numeroInput != 0) {
      if (acumulador == 0) acumulador = numeroInput;
      else {
        acumulador = operaciones(dataAtributeValue, acumulador, numeroInput);
        // Ubicar el resultado de la operacion en el display
        $display.value = acumulador;
      }
      /* Para saber cuando el resultado de la operacion esta en el input display
       Esto es para validar que no me permita clear(uno x uno) el resultado*/
      opeResultMostrada = true;
    }
  }
};
const operaciones = (tipoOperacion, acumulador, numeroNuevo) => {
  if (tipoOperacion === "+") acumulador += numeroNuevo;
  if (tipoOperacion === "-") acumulador -= numeroNuevo;
  if (tipoOperacion === "*") acumulador *= numeroNuevo;
  if (tipoOperacion === "/") {
    // acumulador /= numeroNuevo;
    acumulador = validarDivision(acumulador, numeroNuevo);
  }
  if (tipoOperacion === "^") acumulador = Math.pow(acumulador, numeroNuevo);
  if (tipoOperacion === "%") acumulador = (acumulador * numeroNuevo) / 100;

  return acumulador;
};

const validarDivision = (acumu, numeroNuevo) => {
  if (numeroNuevo != 0) acumu /= numeroNuevo;
  else {
    mostrarMensaje("No se puede dividir entre 0");
    acum = 0;
  }
  return acumu;
};
const resetValores = () => {
  acumulador = 0;
  // Resetear el display
  $display.value = "0";
  // Resetear el display--acumulador
  $displayAcu.value = "";
  typeOpe = "";
};
const btnIgual = () => {
  // Si acumulador tiene cargado valor
  if (acumulador != 0) {
    let valorAnterior = acumulador;
    let nuevoValor = parseFloat($display.value);
    let nuevoResultado = operaciones(typeOpe, valorAnterior, nuevoValor);
    $display.value = nuevoResultado;
    $displayAcu.value = "";

    // Reiniciar/ importante a 0
    acumulador = 0;

    // Para que no pueda clear caracter por caracterss
    opeResultMostrada = true;

    // Si es igual a true, y presiona un numero, reemplazara el texto del display
    banderIgual = true;
  }
};
const btnPunto = (dataAtributeValue) => {
  // Consulto si el display ya hay un punto
  let isExiste = $display.value.includes(dataAtributeValue);

  // Si no hay aun un punto y el dato mostrado NO es el resultado de la operacion, lo ubico x una unica vez
  if (!isExiste && !banderIgual && !opeActive) {
    $display.value += dataAtributeValue;
  } else if (
    (!isExiste && banderIgual) ||
    (isExiste && banderIgual) ||
    opeActive
  ) {
    /*
    Si no hay un punto, pero el dato mostrado en el display en el resultado de la operacion
    Si sí hay un punto, pero el dato mostrado en el display en el resultado de la operacion
  */
    $display.value = `0${dataAtributeValue}`;
    banderIgual = false;
    opeActive = false;
    // Si presiona mas de un punto
  } else mostrarMensaje("Ya existe un punto en la operación");
};
const mostrarMensaje = (mensaje) => {
  const $mensajeCont = document.getElementById("mensaje-content");
  $mensajeCont.innerHTML = "";
  const $elementoSms = mensajeAlert(mensaje);
  $mensajeCont.appendChild($elementoSms);
  document.querySelector(".mensaje-alert").classList.add("mensaje-alert--show");
  //
  iniciarTemporizador();
};
const iniciarTemporizador = () => {
  // Oculta el sms despues de 5/ o se puede detener el temporizador
  temporizador = setTimeout(() => {
    document
      .querySelector(".mensaje-alert")
      .classList.remove("mensaje-alert--show");
  }, 5000);
};

const onOffCalculadora = (item) => {
  let tempEstado = JSON.parse(item.dataset.estado);
  let nuevoEstado = !tempEstado;
  if (nuevoEstado) mostrarMensaje("Calculadora activada");

  item.dataset.estado = `${nuevoEstado}`;
  item.textContent = nuevoEstado ? "OFF" : "ON";

  // Actualizar estado de calculadora
  estadoCalc = nuevoEstado;

  // Cuando apage la calculadora, limpio todo
  if (!estadoCalc) resetValores();
};
