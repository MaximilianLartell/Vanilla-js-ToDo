let state = [];

const template = (stateArr) => {
  let html = '';
  stateArr.forEach((el, i) => {
    html += `
        <container class="item item--${el.status}" id="${i}">
        <h1 class="item__title item-title--${el.status}" id="title-${i}">${el.title}</h1>
        <p class="item__description item-description--${el.status}" id="description-${i}">${el.description}</p>
        <button class="item__button item-button--${el.status}" id="button-${i}"> Remove </button>
        </container>
        `;
  });
  return html;
};

const render = (htmlString) => {
  document.querySelector('#app').innerHTML = htmlString;
};

const resetForm = () => {
  document.querySelector('form').reset();
};

const persistInStorage = (currentState) => {
  window.localStorage.setItem('state', JSON.stringify(currentState));
};

const dispatchEvent = (eventType) => {
  window.dispatchEvent(new Event(eventType));
};

const stateChange = (currentState, eventType) => {
  persistInStorage(currentState);
  dispatchEvent(eventType);
};

const checkInput = () => {
  const title = document.querySelector('#form-title').value;
  const descr = document.querySelector('#form-description').value;

  if (
    title.length > 0
    && title.length <= 30
    && descr.length > 0
    && descr.length <= 70
  ) {
    return { error: undefined };
  }
  return { error: 'inputError' };
};

const createNewItem = () => ({
  title: document.querySelector('#form-title').value,
  description: document.querySelector('#form-description').value,
  status: 'pending',
});

const addNewItem = (newItem) => {
  state = [...state, newItem];
  stateChange(state, 'statechange');
};

const getElementId = (eventTarget) => {
  if (!/^\d*$/.test(eventTarget.id)) {
    return document.querySelector(`#${eventTarget.id}`).parentElement.id;
  }
  return eventTarget.id;
};

const updateItemStatus = (id) => {
  const item = state[id];
  if (item.status === 'pending') {
    item.status = 'done';
    stateChange(state, 'statechange');
    return;
  }
  item.status = 'pending';
  stateChange(state, 'statechange');
};

const removeItem = (eventTarget) => {
  const elementId = document.querySelector(`#${eventTarget.id}`).parentElement
    .id;
  state = state.filter((el, i) => i.toString() !== elementId);
  stateChange(state, 'statechange');
};

const elementType = (eventTarget) => {
  if (eventTarget.tagName === 'BUTTON') {
    return 'button';
  }
  return 'container';
};

document.querySelector('.form').addEventListener('keypress', function (e) {
  if (e.key === 'Enter' && checkInput().error === undefined) {
    addNewItem(createNewItem());
    resetForm();
  }
});

document.querySelector('#form-button').addEventListener('click', (event) => {
  event.preventDefault();
  if (checkInput().error === undefined) {
    addNewItem(createNewItem());
    resetForm();
  }
});

document.querySelector('#app').addEventListener('click', (event) => {
  if (elementType(event.target) === 'container') {
    updateItemStatus(getElementId(event.target));
  }
  if (elementType(event.target) === 'button') {
    removeItem(event.target);
  }
});

window.addEventListener('statechange', () => {
  render(template(state));
});

window.addEventListener('load', () => {
  if (window.localStorage.length !== 0) {
    state = JSON.parse(window.localStorage.getItem('state'));
    dispatchEvent('statechange');
  }
});
