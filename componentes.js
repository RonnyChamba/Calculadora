const datosPersonales = {
  nombre: "Ronny Chamba",
  carrera: "Ingeniería en T.I.",
  nivel: "Quinto",
  email: "ronnychamba96@gmail.com",
  contacto: "programaideas.com",
};
export const modal = () => {
  const modalContainer = createElement({
    tipo: "div",
    class: "modal",
    id: "modal",
    text: null,
  });
  modalContainer.appendChild(modalContenido());
  document.body.appendChild(modalContainer);
};

const modalContenido = () => {
  const modalContent = createElement({
    tipo: "div",
    class: "modal__content",
    id: "modal-content",
    text: null,
  });

  // titulo
  const title = createElement({
    tipo: "h2",
    class: "title",
    id: "title",
    text: "Datos del Desarrollador",
  });
  title.classList.add("modal__title");

  // div datos, esta creado en una funcion
  const contentDatos = contenidoDatosPers();

  // boton cerrar modal
  const btnCerrar = createElement({
    tipo: "button",
    class: "modal__btn",
    id: "btn-cerrar",
    text: "Aceptar",
  });
  btnCerrar.setAttribute("data-value", "btn-cerrar-modal");

  // Add elementos la modal__content
  modalContent.appendChild(title);

  //  add datos personales
  modalContent.appendChild(contentDatos);

  // add boton cerrar
  modalContent.appendChild(btnCerrar);
  return modalContent;
};

const contenidoDatosPers = () => {
  const contentDatos = createElement({
    tipo: "div",
    class: "modal__datos",
    id: "modal-datos",
    text: null,
  });

  for (let item in datosPersonales) {
    let itemContent = createElement({
      tipo: "p",
      class: "paragraph",
      id: "datos-personal",
      text: `${datosPersonales[item]}`,
    });
    let itemLabel = createElement({
      tipo: "label",
      class: "label-pers",
      id: "label-pers",
      text: item + ":",
    });

    contentDatos.appendChild(itemLabel);
    contentDatos.appendChild(itemContent);
  }
  return contentDatos;
};

const createElement = (datos) => {
  const newElement = document.createElement(datos.tipo);
  newElement.setAttribute("class", datos.class);
  newElement.setAttribute("id", datos.id);

  if (datos.text != null) newElement.textContent = datos.text;

  return newElement;
};

// Crear un elemento p para los mensajes
export const mensaje = (text) => {
  const datosMensaje = { tipo: "p", class: "mensaje-item", id: "mensaje-item" };
  datosMensaje.text = text;
  return createElement(datosMensaje);
};
