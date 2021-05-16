let events = new Map();
let searchBox = document.getElementById("eventsFilter");

class Event {
  constructor(name, imgPath, about, hasContent, id) {
    this.name = name;
    this.img = imgPath;
    this.about = about;
    this.hasContent = hasContent;
    this.id = id;
  }
}

function filter() {
  let text = searchBox.value;
}

window.addEventListener('load', (event) => {
  fetch("./api/events")
  .then(response => response.json())
  .then((events) => {
    for (const event of events) {
      console.log(event);
    }
  })
})
