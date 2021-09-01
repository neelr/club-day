const socket = io(
  "https://7389-2600-1702-44f0-c9b0-c846-cf9d-5afc-35a1.ngrok.io"
);
class Person {
  constructor(id) {
    this.id = id;
    this.inUse = false;
    var sineWave = new Pizzicato.Sound({
      source: "wave",
      options: {
        type: "triangle",
      },
    });
    this.wave = sineWave;
    this.x = 0;
    this.y = 0;
    this.color = [];
  }
  setCoords(x, y) {
    this.x = x;
    this.y = y;
  }
  turnOn() {
    this.inUse = true;
    this.wave.play();
  }
  turnOff() {
    this.inUse = false;
    this.wave.stop();
  }
}

let playercache = {};

socket.on("movement", (data) => {
  if (!playercache[data.id]) playercache[data.id] = new Person(data.id);

  playercache[data.id].wave.frequency = data.frequency;
  playercache[data.id].wave.volume = data.volume;
  playercache[data.id].x = data.x * document.getElementById("main").clientWidth;
  playercache[data.id].y =
    data.y * document.getElementById("main").clientHeight;
  playercache[data.id].color = data.color;
});

socket.on("start", (data) => {
  if (!playercache[data.id]) playercache[data.id] = new Person(data.id);

  playercache[data.id].turnOn();
});

socket.on("stop", (data) => {
  if (!playercache[data.id]) playercache[data.id] = new Person(data.id);

  playercache[data.id].turnOff();
});
function setup() {
  createCanvas(
    document.getElementById("main").clientWidth,
    document.getElementById("main").clientHeight
  );
  background(255);
  strokeWeight(30);
}

function draw() {
  background(255);
  Object.values(playercache)
    .filter((x) => x.inUse)
    .forEach((dot) => {
      stroke(dot.color[0], dot.color[1], dot.color[2]);
      circle(dot.x, dot.y, 30);
    });
}
