let events = new Map();
let eventNames = [];
let searchBox = document.getElementById("eventsFilter");
let eventField = document.getElementById("events");
let modalTitle = document.getElementById("eventModalTitle");
let modalBody = document.getElementById("eventModalBody");

function navigateTo(eventName) {
  window.location.pathname = `/events/${eventName}`;
}

function openModal(eventName) {
  let event = events.get(eventName);
  modalTitle.innerHTML = event.name;
  modalBody.innerHTML = event.about;
  $('#eventModal').modal();
}

function filter() {
  eventField.innerHTML = '';
  let text = searchBox.value.toLowerCase();
  if (text.length == 0) {
    for (const eventName of eventNames) {
      eventField.innerHTML += events.get(eventName).card;
    }
    return;
  }
  for (const eventName of eventNames) {
    if (eventName.indexOf(text) > -1) {
      let event = events.get(eventName);
      eventField.innerHTML += event.card;
    }
  }
}

class Event {
  constructor(name, imgPath, about, hasContent, id) {
    this.name = name;
    this.img = imgPath;
    this.about = about;
    this.hasContent = hasContent;
    this.id = id;
    this.card;
    this.createCard();
  }

  createCard() {
    if (this.hasContent) {
      this.card = `
      <div class="col-sm-12 col-lg-4 mt-5 mb-5" id="${this.id}">
        <div class="mx-auto w-75 border box box-event">
          <div class="event-title">
            ${this.name}
          </div>
          <div class="mx-auto p-5">
            <img src="${this.img}" alt="${this.name}" class="w-100 border-outline">
          </div>
          <div class="row event-footer">
            <div class="col-sm-6">
              <button class="btn btn-info" onclick="openModal('${this.name.toLowerCase()}')">About</button>
            </div>
            <div class="col-sm-6">
              <button class="btn btn-success" onclick="navigateTo('${this.name}')">Content</button>
            </div>
          </div>
        </div>
      </div>
      `;
    } else {
      this.card = `
      <div class="col-sm-12 col-lg-4 mt-5 mb-5" id="${this.id}">
        <div class="mx-auto w-75 border box box-event">
          <div class="event-title">
            ${this.name}
          </div>
          <div class="mx-auto p-5">
            <img src="${this.img}" alt="${this.name}" class="w-100 border-outline">
          </div>
          <div class="row event-footer">
            <div class="col-sm-12">
              <button class="btn btn-info" onclick="openModal('${this.name.toLowerCase()}')">About</button>
            </div>
          </div>
        </div>
      </div>
      `;
    }
  }

}

window.addEventListener('load', (event) => {
  fetch("/api/events")
  .then(response => response.json())
  .then((eventData) => {
    for (const event of eventData) {
      let name = event.name; //optimization
      let newEvent = new Event(name, event.imgPath, event.about, event.hasContent, event.id);
      events.set(name.toLowerCase(), newEvent);
      eventNames.push(name.toLowerCase());
      eventField.innerHTML += newEvent.card;
      //document.body.innerHTML += newEvent.modal;
    }
  })
})
