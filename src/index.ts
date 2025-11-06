// import './style.css';

let canvas: HTMLCanvasElement;
let ctx: CanvasRenderingContext2D;

let width : number = window.innerWidth;
let height : number = window.innerHeight;

canvas = document.getElementById('lomSvetlaInt') as HTMLCanvasElement;
ctx = canvas.getContext('2d') as CanvasRenderingContext2D;

canvas.width = width;
canvas.height = height;

draw();

console.log (canvas.getContext('2d'));

function draw() {
  ctx.fillStyle = 'lightblue';
  ctx.fillRect(0, 0, width, height/2);
  ctx.fillStyle = 'lightgreen';
  ctx.fillRect(0, height/2, width, height/2);
};