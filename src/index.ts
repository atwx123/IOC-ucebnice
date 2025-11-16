let canvas: HTMLCanvasElement;
let ctx: CanvasRenderingContext2D;
//let errorAngleInputDiv: HTMLDivElement;

let width: number = 1000;
let height: number = 600;

canvas = document.getElementById("lomSvetlaInt") as HTMLCanvasElement;
ctx = canvas.getContext("2d") as CanvasRenderingContext2D;

//errorAngleInputDiv = document.getElementById("errorOutput") as HTMLDivElement;
let angleTextInput: HTMLInputElement = document.getElementById(
  "angleText"
) as HTMLInputElement;
let angleSendButton: HTMLButtonElement = document.getElementById(
  "angleSend"
) as HTMLButtonElement;
//errorAngleInputDiv.style.visibility = "hidden";

let angleValue: number = NaN;
/*
function readingAngleValue(angleTextInput: HTMLInputElement) {
  errorAngleInputDiv.style.visibility = "hidden";
  angleValue = parseFloat(angleTextInput.value);
  if (isNaN(angleValue) || angleValue > 90 || angleValue < 0) {
    errorAngleInputDiv.style.visibility = "visible";
    errorAngleInputDiv.textContent =
      "Zadejte prosim cislo od 0 do 90, vaše číslo je " + angleTextInput.value;
    angleTextInput.value = "";
  } else {
    angleTextInput.value = "";
    draw((angleValue * (canvas.width / 2)) / 90 + canvas.width / 2);
    return;
  }
}
  */
angleSendButton.addEventListener("click", () => {
  //readingAngleValue(angleTextInput);
});

angleTextInput.addEventListener("keydown", (event) => {
  if (event.key == "Enter") {
    //readingAngleValue(angleTextInput);
  }
});
canvas.width = width;
canvas.height = height;

draw(900);

console.log(canvas.getContext("2d"));

function draw(xAxisAngle: number) {
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
  ctx.lineTo(xAxisAngle, height);
  ctx.stroke();
}
