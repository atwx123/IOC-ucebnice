const canvas: HTMLCanvasElement = document.getElementById(
  "zrcadlaInt",
) as HTMLCanvasElement;
const ctx: CanvasRenderingContext2D = canvas.getContext(
  "2d",
) as CanvasRenderingContext2D;
const iconInput: HTMLInputElement = document.getElementById(
  "iconRangeInput",
) as HTMLInputElement;
const width: number = 1000;
const height: number = 600;
const center = width / 2;
const rz: number = 400;
const ohnisko: number = center + rz / 2;
const pOhnisko: number = rz / 2;
const iconHeight: number = 200;
const drawIconHeight = height / 2 - iconHeight;
let iconX: number = -200;
let obraz = new Image();

function horBeam(y: number, xk?: number, color?: string) {
  ctx.save();
  if (color != undefined) {
    ctx.strokeStyle = color;
  }
  ctx.beginPath();
  ctx.moveTo(0 - center, y);
  ctx.setLineDash([]);
  if (xk != undefined) {
    ctx.lineTo(xk, y);
    ctx.stroke();
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.moveTo(xk, y);
  }
  ctx.lineTo(width, y);
  ctx.stroke();
  ctx.setLineDash([]);
  ctx.restore();
}

function getRedHit(): [number, number] {
  const y = drawIconHeight;
  const dy = y - height / 2;
  const x = Math.sqrt(Math.pow(rz, 2) - Math.pow(dy, 2));
  return [x, y];
}

function getBlueStart(): [number, number] {
  const objX = iconX;
  const objY = drawIconHeight;
  const focusX = pOhnisko;
  const focusY = height / 2;
  const slope = (focusY - objY) / (focusX - objX);
  const estimatedY = focusY + slope * (rz - focusX);
  const dy = estimatedY - height / 2;
  const distSq = Math.pow(rz, 2) - Math.pow(dy, 2);
  const x = distSq > 0 ? Math.sqrt(distSq) : rz;
  return [x, estimatedY];
}

function linesInter(): number {
  let y: number = getBlueStart()[1];
  return y / Math.tan(Math.asin(iconHeight / rz));
}

function interEdgeBot(): [number, number] {
  const [hitX, hitY] = getRedHit();
  const focusX = pOhnisko;
  const focusY = height / 2;
  const slope = (focusY - hitY) / (focusX - hitX);
  const xTarget = -center;
  const yTarget = focusY + slope * (xTarget - focusX);
  return [xTarget, yTarget];
}

function getBlueHit(): [number, number] {
  const objX = iconX;
  const objY = drawIconHeight;
  const focusX = pOhnisko;
  const focusY = height / 2;
  const slope = (focusY - objY) / (focusX - objX);
  const xTarget = -center;
  const yTarget = focusY + slope * (xTarget - focusX);
  return [xTarget, yTarget];
}

function drawIcon() {}

function drawBackground() {
  ctx.save();
  ctx.setLineDash([5, 10, 10, 15]);
  ctx.beginPath();
  ctx.moveTo(-center, height / 2);
  ctx.lineTo(width - center, height / 2);
  ctx.stroke();
  ctx.setLineDash([]);

  ctx.transform(1, 0, 0, 1, center, 0);

  ctx.beginPath();
  ctx.arc(0, height / 2, rz, Math.PI / 2, (Math.PI * 2) / 1.5, true);
  ctx.stroke();

  ctx.save();
  ctx.beginPath();
  ctx.moveTo(0, height / 2 - 5);
  ctx.lineTo(0, height / 2 + 5);
  ctx.stroke();
  ctx.textAlign = "center";
  ctx.textBaseline = "hanging";
  ctx.font = "20px sans-serif";
  ctx.fillText("S", 0, height / 2 + 10);

  ctx.beginPath();
  ctx.moveTo(pOhnisko, height / 2 - 5);
  ctx.lineTo(pOhnisko, height / 2 + 5);
  ctx.stroke();

  ctx.fillText("F", pOhnisko, height / 2 + 10);
  ctx.restore();
}

function draw() {
  ctx.save();
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.clearRect(0, 0, width, height);
  ctx.restore();

  drawBackground();

  if (obraz.complete) {
    let w = obraz.width;
    let newWidth = w / (obraz.height / iconHeight);
    let leftSide = iconX - newWidth / 2;
    ctx.drawImage(
      obraz,
      leftSide,
      height / 2 - iconHeight,
      newWidth,
      iconHeight,
    );
  }

  const rightEdge = 1000;
  const leftEdge = -center;

  ctx.strokeStyle = "red";
  const redHit = getRedHit();

  horBeam(redHit[1], redHit[0], "red");

  const focusX = pOhnisko;
  const focusY = height / 2;
  const slopeRed = (focusY - redHit[1]) / (focusX - redHit[0]);

  const yAtLeft = redHit[1] + slopeRed * (leftEdge - redHit[0]);
  const yAtRight = redHit[1] + slopeRed * (rightEdge - redHit[0]);

  ctx.beginPath();
  ctx.moveTo(redHit[0], redHit[1]);
  ctx.lineTo(leftEdge, yAtLeft);
  ctx.stroke();

  ctx.save();
  ctx.beginPath();
  ctx.setLineDash([5, 5]);
  ctx.moveTo(redHit[0], redHit[1]);
  ctx.lineTo(rightEdge, yAtRight);
  ctx.stroke();
  ctx.setLineDash([]);
  ctx.restore();

  ctx.strokeStyle = "blue";
  const blueHit = getBlueHit();

  const objX = iconX;
  const objY = drawIconHeight;
  const slopeBlue = (focusY - objY) / (focusX - objX);

  const blueYAtLeft = focusY + slopeBlue * (leftEdge - focusX);
  const blueYAtRight = focusY + slopeBlue * (rightEdge - focusX);

  ctx.setLineDash([]);
  ctx.beginPath();
  ctx.moveTo(leftEdge, blueYAtLeft);
  ctx.lineTo(blueHit[0], blueHit[1]);
  ctx.stroke();

  ctx.save();
  ctx.beginPath();
  ctx.setLineDash([5, 5]);
  ctx.moveTo(blueHit[0], blueHit[1]);
  ctx.lineTo(rightEdge, blueYAtRight);
  ctx.stroke();
  ctx.setLineDash([]);
  ctx.restore();

  horBeam(blueHit[1], blueHit[0], "blue");
}
canvas.width = width;
canvas.height = height;

iconInput.max = (center - 10).toString();

iconInput.addEventListener("input", () => {
  iconX = -iconInput.valueAsNumber;
  draw();
});

obraz.src = "arrow.svg";
obraz.onload = () => {
  draw();
};
