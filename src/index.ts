// import './style.css';

let canvas: HTMLCanvasElement;
let ctx: CanvasRenderingContext2D;

let width: number = 1000;
let height: number = 600;

canvas = document.getElementById("lomSvetlaInt") as HTMLCanvasElement;
ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
let angleTextInput: HTMLInputElement = document.getElementById(
  "angleText"
) as HTMLInputElement;
let angleSendButton: HTMLButtonElement = document.getElementById(
  "angleSend"
) as HTMLButtonElement;

let angleValue: number, NaN;
angleValue = -1;

function readingAngleValue(angleTextInput: HTMLInputElement) {
  angleValue = parseFloat(angleTextInput.value);
  if (!(angleValue != NaN && angleValue <= 90 && angleValue >= 0)) {
    alert(`Zadejte prosim cislo od 0 do 90, Vaše hodnota je ${angleValue}`);
  } else {
    angleTextInput.value = "";
    draw((angleValue * (canvas.width / 2)) / 90 + canvas.width / 2);
    return;
  }
}

angleSendButton.addEventListener("click", () => {
  readingAngleValue(angleTextInput);
});

angleTextInput.addEventListener("keydown", (event) => {
  if (event.key == "Enter") {
    readingAngleValue(angleTextInput);
  }
});
canvas.width = width;
canvas.height = height;

draw(900);

console.log(canvas.getContext("2d"));

function draw(xAxis: number) {
  ctx.fillStyle = "lightblue";
  ctx.fillRect(0, 0, width, height / 2);
  ctx.fillStyle = "lightgreen";
  ctx.fillRect(0, height / 2, width, height / 2);
  ctx.strokeStyle = "red";
  ctx.beginPath();
  ctx.moveTo(300, 0);
  ctx.lineTo(500, height / 2);
  ctx.stroke();
  ctx.strokeStyle = "blue";
  ctx.beginPath();
  ctx.moveTo(500, height / 2);
  ctx.lineTo(xAxis, height);
  ctx.stroke();
}
