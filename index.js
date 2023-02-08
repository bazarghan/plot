const canvas = document.getElementById("plot");
let slider1 = document.getElementById("myRange1");
let slider2 = document.getElementById("myRange2");
let slider3 = document.getElementById("myRange3");
const ctx = canvas.getContext("2d");
const squareNumberHorizontally = 30;
const squareNumberVertically = 20;
const squareSize = 36;
const width = squareSize * squareNumberHorizontally;
const height = squareSize * squareNumberVertically;
const xc = 0;
const yc = height/2;

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
  ctx.moveTo(xc, height);
  ctx.lineTo(xc, 0);
  ctx.lineWidth = 2;
  ctx.strokeStyle = "#2e3749";
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(width,yc);
  ctx.lineTo(0, yc);
  ctx.lineWidth = 2;
  ctx.strokeStyle = "#2e3749";
  ctx.stroke();
  //draw Grid
  ctx.globalAlpha = 0.3;
  ctx.lineWidth = 0.3;
  for(let x=xc; x < width; x += squareSize){
      for(let y=yc; y<height; y += squareSize){
          ctx.strokeRect(x, y, squareSize, squareSize);
          ctx.strokeStyle = "#2e3749";
          ctx.stroke();
      }
  }
  for(let x=xc; x>=0; x -= squareSize){
      for(let y=yc; y>=0; y -= squareSize){
          ctx.strokeRect(x-squareSize, y-squareSize, squareSize, squareSize);
          ctx.strokeStyle = "#2e3749";
          ctx.stroke();
      }
  }
  
  for(let x=xc; x < width; x += squareSize){
      for(let y=yc;  y>=0 ; y -= squareSize){
          ctx.strokeRect(x, y - squareSize, squareSize, squareSize);
          ctx.strokeStyle = "#2e3749";
          ctx.stroke();
      }
  }
  for(let x=xc; x >= 0; x -= squareSize){
      for(let y=yc; y< height; y += squareSize){
          ctx.strokeRect(x-squareSize, y, squareSize, squareSize);
          ctx.strokeStyle = "#2e3749";
          ctx.stroke();
      }
  }


  
}

function mapCordinate(x, y) {
  let newx = Math.floor(x * squareSize) + xc;
  let newy = -Math.floor(y * squareSize) + yc;
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
let zeta = 0;
let wn = 4;
let gain = 5;
drawGrid();


function stepResponse(t){
  

  if(zeta >1 || zeta <-1 ){
    
    let p1 = -zeta*wn+wn*Math.sqrt(zeta*zeta-1); //poles 
    let p2 = -zeta*wn-wn*Math.sqrt(zeta*zeta-1);
    
    // Y(s) = A/s + B/(s-p1) + C/(s-p2)


    let A = 1;
    let B = (wn*wn)/(p1*(p1-p2));
    let C = (wn*wn)/(p2*(p2-p1));

    return A+B*Math.exp(p1*t)+C*Math.exp(p2*t);



  }else if(zeta ===1){

    let p = -wn;

    let A = 1;
    let B = -1;
    let C = -wn;
    return A+B*Math.exp(p*t)+C*t*Math.exp(p*t);

  }else if(zeta <1 && zeta >-1){
    
    let alpha = zeta*wn;
    let wd=wn*Math.sqrt(1-zeta*zeta);
    
    return 1-Math.exp(-alpha*t)*Math.cos(wd*t)-(alpha/wd)*Math.exp(-alpha*t)*Math.sin(wd*t);



  }else if(zeta===-1){

    let p = wn;

    let A = 1;
    let B = -1;
    let C = wn;
    return A+B*Math.exp(p*t)+C*t*Math.exp(p*t);
    
  }


}

plot(
  createList(0, 40, 0.001, (x) => {
    return x;
  }),
  createList(0, 40, 0.001, (x) => {
    return gain*stepResponse(x);
  }),
  "#f0f8ff",
  1
);

slider1.oninput = function () {
  ctx.clearRect(0, 0, width, height);
  drawGrid();
  zeta = this.value / 24;
  plot(
    createList(0,40, 0.001, (x) => {
      return x;
    }),
    createList(0,40 , 0.001, (x) => {
      return gain*stepResponse(x);
    }),
    "#f0f8ff",
    1
  );
};

slider2.oninput = function () {

  ctx.clearRect(0, 0, width, height);
  drawGrid();
  wn = this.value / 24;
  plot(
    createList(0, 40, 0.001, (x) => {
      return x;
    }),
    createList(0,40, 0.001, (x) => {
      return gain*stepResponse(x);
    }),
    "#f0f8ff",
   1 
  );
};
slider3.oninput = function () {

  ctx.clearRect(0, 0, width, height);
  drawGrid();
  gain = this.value / 24;
  plot(
    createList(0,40, 0.001, (x) => {
      return x;
    }),
    createList(0,40, 0.001, (x) => {
      return gain*stepResponse(x);
    }),
    "#f0f8ff",
    1
  );
};
