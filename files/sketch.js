const socket = io(
  "https://7389-2600-1702-44f0-c9b0-c846-cf9d-5afc-35a1.ngrok.io"
);
const seed = Math.random() * 255;
var sineWave = new Pizzicato.Sound({
  source: "wave",
  options: {
    type: "triangle",
  },
});

let pass = 30;
let hol = [0, 0];
let points = [];
sineWave.attack = 0.3;
sineWave.release = 1;

function setup() {
  createCanvas(
    document.getElementById("main").clientWidth,
    document.getElementById("main").clientHeight
  );
  background(255);
  strokeWeight(30);
}
function mousePressed() {
  //sineWave.play();
  socket.emit("start");
}

function mouseReleased() {
  //sineWave.stop();
  socket.emit("stop");
}

function draw() {
  background(255);
  if (points.length > 10 || !mouseIsPressed) {
    points.shift();
  }
  if (mouseIsPressed === true) {
    points.push(createVector(mouseX, mouseY));
    socket.emit("broadcast", {
      frequency:
        (mouseX / document.getElementById("main").clientWidth) * 400 + 100,
      volume: 1 - mouseY / document.getElementById("main").clientHeight,
      x: mouseX / document.getElementById("main").clientWidth,
      y: mouseY / document.getElementById("main").clientHeight,
      color: [
        (mouseX / document.getElementById("main").clientWidth) * 255,
        seed,
        (mouseY / document.getElementById("main").clientHeight) * 255,
      ],
    });
    sineWave.frequency =
      (mouseX / document.getElementById("main").clientWidth) * 400 + 100;
    sineWave.volume = 1 - mouseY / document.getElementById("main").clientHeight;
    for (let i = 0; i < points.length - 1; i++) {
      let p1 = points[i],
        p2 = points[i + 1];
      stroke(
        (mouseX / document.getElementById("main").clientWidth) * 255,
        seed,
        (mouseY / document.getElementById("main").clientHeight) * 255,
        map(i, 0, points.length - 1, 0, 255)
      );
      line(p1.x, p1.y, p2.x, p2.y);
    }
    pass = 30;
    hol = [mouseX, mouseY];
  } else if (pass != 0) {
    stroke(
      (hol[0] / document.getElementById("main").clientWidth) * 255,
      seed,
      (hol[1] / document.getElementById("main").clientHeight) * 255,
      (pass / 30) * 255
    );
    line(hol[0], hol[1], hol[0], hol[1]);
    pass--;
  }
}
