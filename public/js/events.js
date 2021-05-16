let events = new Map();

class Event {
  constructor(name, imgPath ) {
    this.name = name;
    this.img = imgPath;
  }
}

window.addEventListener('load', (event) => {
  fetch("./api/events").then((response) => {
    console.log(response);
  })
})
