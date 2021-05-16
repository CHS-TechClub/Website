let events = new Map();
let eventNames = [];
let searchBox = document.getElementById("eventsFilter");
let eventField = document.getElementById("events");

class Event {
  constructor(name, imgPath, about, hasContent, id) {
    this.name = name;
    this.img = imgPath;
    this.about = about;
    this.hasContent = hasContent;
    this.id = id;
    this.html = `
    <div class="col-sm-12 col-lg-4 mt-5 mb-5" id="${this.id}">
      <div class="mx-auto w-75 border box box-event">
        <div class="event-title">
          ${this.name}
        </div>
        <div class="mx-auto p-5">
          <img src="./images/logo_light.jpg" alt="${this.name}" class="w-100">
        </div>
        <div class="event-footer">
          <div class="event-buttons">
            <button class="btn btn-success float-left">About</button>
            <button class="btn btn-success float-right">About</button>
          </div>
        </div>
      </div>
    </div>
    `
  }
}

function filter() {
  eventField.innerHTML = '';
  let text = searchBox.value.toLowerCase();
  if (text.length == 0) {
    for (const eventName of eventNames) {
      eventField.innerHTML += events.get(eventName).html;
    }
    return;
  }
  for (const eventName of eventNames) {
    if (eventName.indexOf(text) > -1) {
      let event = events.get(eventName);
      eventField.innerHTML += event.html;
    }
  }
}

window.addEventListener('load', (event) => {
  fetch("./api/events")
  .then(response => response.json())
  .then((eventData) => {
    for (const event of eventData) {
      let name = event.name; //optimization
      let newEvent = new Event(name, event.imgPath, event.about, event.hasContent, event.id);
      events.set(name.toLowerCase(), newEvent);
      eventNames.push(name.toLowerCase());
      eventField.innerHTML += newEvent.html;
    }
  })
})
