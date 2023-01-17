const canvas = document.getElementById("plot");
let slider1 = document.getElementById("myRange1");
let slider2 = document.getElementById("myRange2");
let slider3 = document.getElementById("myRange3");
const ctx = canvas.getContext("2d");
const squareNumberHorizontally = 40;
const squareNumberVertically = 26;
const squareSize = 24;
const width = squareSize * squareNumberHorizontally;
const height = squareSize * squareNumberVertically;
canvas.width = width;
canvas.height = height;
slider1.style.width = width.toString() + "px";
slider2.style.width = width.toString() + "px";
slider3.style.width = width.toString() + "px";
//this function draw Grid
function drawGrid() {
  ctx.fillStyle = "#1b202c";
  ctx.fillRect(0, 0, width, height);
  //draw two center line
  ctx.beginPath();
  ctx.moveTo(width / 2, height);
  ctx.lineTo(width / 2, 0);
  ctx.lineWidth = 2;
  ctx.strokeStyle = "#2e3749";
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(width, height / 2);
  ctx.lineTo(0, height / 2);
  ctx.lineWidth = 2;
  ctx.strokeStyle = "#2e3749";
  ctx.stroke();
  //draw Grid
  ctx.globalAlpha = 0.3;
  ctx.lineWidth = 0.3;
  for (let x = 0; x < width; x += squareSize) {
    for (let y = 0; y < height; y += squareSize) {
      ctx.strokeRect(x, y, squareSize, squareSize);
      ctx.strokeStyle = "#2e3749";
      ctx.stroke();
    }
  }
}

function mapCordinate(x, y) {
  let newx = Math.floor(x * squareSize) + width / 2;
  let newy = -Math.floor(y * squareSize) + height / 2;
  return { x: newx, y: newy };
}

function gradient(a, b) {
  return (b.y - a.y) / (b.x - a.x);
}
function plot(xlist, ylist, color, storkeSize) {
  let n = xlist.length;
  ctx.globalAlpha = 1;
  let point1 = mapCordinate(xlist[0], ylist[0]);
  ctx.beginPath();
  ctx.moveTo(point1.x, point1.y);
  let m = 0;
  let dx1 = 0;
  let dy1 = 0;
  let f = 1;
  let t = 0.3;
  for (let i = 1; i < n; i++) {
    let point2 = mapCordinate(xlist[i], ylist[i]);
    let point3 = mapCordinate(xlist[i + 1], ylist[i + 1]);
    if (point3) {
      m = gradient(point1, point3);
      dx2 = (point3.x - point2.x) * -f;
      dy2 = dx2 * m * t;
    } else {
      dx2 = 0;
      dy2 = 0;
    }
    ctx.bezierCurveTo(
      point1.x - dx1,
      point1.y - dy1,
      point2.x + dx2,
      point2.y + dy2,
      point2.x,
      point2.y
    );
    dx1 = dx2;
    dy1 = dy2;
    point1 = point2;
  }
  ctx.lineWidth = storkeSize;
  ctx.strokeStyle = color;
  ctx.stroke();
}

function createList(begin, end, step, myfunc) {
  mylist = [];
  for (let i = begin; i < end; i += step) {
    mylist.push(myfunc(i));
  }
  return mylist;
}
let a = 0;
let b = 0;
let c = 0;
drawGrid();
plot(
  createList(-50, 50, 0.001, (x) => {
    return x;
  }),
  createList(-50, 50, 0.001, (x) => {
    return a * Math.sin(x + b) + c;
  }),
  "#f0f8ff",
  1
);

slider1.oninput = function () {
  ctx.clearRect(0, 0, width, height);
  drawGrid();
  a = this.value / 7;
  plot(
    createList(-50, 50, 0.001, (x) => {
      return x;
    }),
    createList(-50, 50, 0.001, (x) => {
      return a * Math.sin(x + b) + c;
    }),
    "#f0f8ff",
    1
  );
};
slider2.oninput = function () {
  ctx.clearRect(0, 0, width, height);
  drawGrid();
  b = (this.value / 200) * 2 * Math.PI;
  plot(
    createList(-50, 50, 0.001, (x) => {
      return x;
    }),
    createList(-50, 50, 0.001, (x) => {
      return a * Math.sin(x + b) + c;
    }),
    "#f0f8ff",
    1
  );
};
slider3.oninput = function () {
  ctx.clearRect(0, 0, width, height);
  drawGrid();
  c = this.value / 10;
  plot(
    createList(-50, 50, 0.001, (x) => {
      return x;
    }),
    createList(-50, 50, 0.001, (x) => {
      return a * Math.sin(x + b) + c;
    }),
    "#f0f8ff",
    1
  );
};
