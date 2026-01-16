let canvas: HTMLCanvasElement;
let ctx: CanvasRenderingContext2D;
let alphaInput: HTMLInputElement;
let alphaOutput: HTMLOutputElement;
let indexn1: HTMLSelectElement;
let indexn2: HTMLSelectElement;
let betaOutput: HTMLOutputElement;

let width: number = 1000;
let height: number = 600;

canvas = document.getElementById("lomSvetlaInt") as HTMLCanvasElement;
ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
alphaInput = document.getElementById("alphaInput") as HTMLInputElement;
alphaOutput = document.getElementById("alphaRangeValue") as HTMLOutputElement;
indexn1 = document.getElementById("indexn1") as HTMLSelectElement;
indexn2 = document.getElementById("indexn2") as HTMLSelectElement;
betaOutput = document.getElementById("betaValue") as HTMLOutputElement;

function angToRad(ang: number) {
  return (ang / 360) * (2 * Math.PI);
}

function radToAng(rad: number) {
  return (rad / (2 * Math.PI)) * 360;
}

alphaInput.addEventListener("input", () => {
  alphaOutput.value = alphaInput.value + "°";
  draw(alpha(alphaInput.valueAsNumber), beta());
});
function indexLomu(value: number, alpha: number, beta: number, n2: number) {
  let n1: number = value;
  let xn1: number =
    (canvas.width / 2) * ((Math.sin(alpha) / (Math.sin(beta) * n2)) * 0.01);
  let yn1: number = height / 2;
}

function alpha(value: number): [number, number] {
  if (value == 0) {
    return [canvas.width / 2, 0];
  }
  let nx = (canvas.height / 2) * Math.tan(angToRad(value));
  if (!(nx > canvas.width / 2)) {
    return [canvas.width / 2 - nx, 0];
  }
  let ny = (canvas.width / 2) * Math.tan(angToRad(90 - value));
  return [0, canvas.height / 2 - ny];
}

function readingRefIndex(select: HTMLSelectElement) {
  switch (select.value) {
    case "1": {
      return 1;
    }
    case "2": {
      return 1.31;
    }
    case "3": {
      return 1.33;
    }
    case "4": {
      return 1.48;
    }
    case "5": {
      return 2;
    }
    default: {
      return 4.01;
    }
  }
}

function beta(): [number, number] | undefined {
  let sin = Math.sin(angToRad(alphaInput.valueAsNumber));
  let pomer = readingRefIndex(indexn1) / readingRefIndex(indexn2);
  if (sin * pomer > 1) {
    return undefined;
  }
  let rad = Math.asin(sin * pomer);
  let angle = radToAng(rad);
  let beta = Math.round(angle * 100) / 100;
  betaOutput.value = "Beta je " + beta + "°";
  let nx = canvas.width / 2 + (canvas.height / 2) * Math.tan(rad);
  if (nx <= canvas.width) {
    return [nx, canvas.height];
  }
  let ny = canvas.height / 2 + (canvas.width / 2) * Math.tan(Math.PI / 2 - rad);
  return [canvas.width, ny];
}
/*
//errorAngleInputDiv = document.getElementById("errorOutput") as HTMLDivElement;
let angleTextInput: HTMLInputElement = document.getElementById(
  "angleText"
) as HTMLInputElement;
let angleSendButton: HTMLButtonElement = document.getElementById(
  "angleSend"
) as HTMLButtonElement;
//errorAngleInputDiv.style.visibility = "hidden";

let angleValue: number = NaN;

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
  
angleSendButton.addEventListener("click", () => {
  //readingAngleValue(angleTextInput);
});

angleTextInput.addEventListener("keydown", (event) => {
  if (event.key == "Enter") {
    //readingAngleValue(angleTextInput);
  }
});
*/
canvas.width = width;
canvas.height = height;

draw([300, 0], [canvas.height, 900]);

console.log(canvas.getContext("2d"));

function draw(axisx: [number, number], axisy: [number, number] | undefined) {
  let axiy: [number, number] = [-1, -1];
  if (axisy == undefined) {
    let x1 = axisx[0];
    let x2 = axisx[1];
    axiy[0] = canvas.width + (canvas.width - x1);
    axiy[1] = x2;
  } else {
    axiy = axisy;
  }
  ctx.fillStyle = "lightblue";
  ctx.fillRect(0, 0, width, height / 2);
  ctx.fillStyle = "lightgreen";
  ctx.fillRect(0, height / 2, width, height / 2);
  ctx.strokeStyle = "red";
  ctx.beginPath();
  ctx.moveTo(axisx[0], axisx[1]);
  ctx.lineTo(width / 2, height / 2);
  ctx.stroke();
  ctx.strokeStyle = "blue";
  ctx.beginPath();
  ctx.moveTo(width / 2, height / 2);
  ctx.lineTo(axiy[0], axiy[1]);
  ctx.stroke();
}
