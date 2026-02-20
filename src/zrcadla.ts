const canvas: HTMLCanvasElement = document.getElementById(
  "zrcadlaInt",
) as HTMLCanvasElement;
const ctx: CanvasRenderingContext2D = canvas.getContext(
  "2d",
) as CanvasRenderingContext2D;
const iconInput: HTMLInputElement = document.getElementById(
  "iconRangeInput",
) as HTMLInputElement;
const iconOutput: HTMLOutputElement = document.getElementById(
  "iconRangeOutput",
) as HTMLOutputElement;
const width: number = 1000;
const height: number = 600;
const center = width / 4;
const rz: number = 600;
const ohnisko: number = center + rz / 2;
const pOhnisko: number = rz / 2;
const iconHeight: number = 50;
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

  const relObjY = objY - height / 2;
  const relFocusY = 0; // Focus is on the axis

  if (Math.abs(objX - focusX) < 0.01) {
    const x = focusX;
    const val = Math.sqrt(rz * rz - x * x);
    const relHitY = relObjY < 0 ? val : -val;
    return [x, relHitY + height / 2];
  }

  const m = (relFocusY - relObjY) / (focusX - objX);

  const A = 1 + m * m;
  const B = -2 * focusX * m * m;
  const C = m * m * focusX * focusX - rz * rz;

  const delta = Math.sqrt(B * B - 4 * A * C);
  const x = (-B + delta) / (2 * A);

  const relHitY = m * (x - focusX);

  return [x, relHitY + height / 2];
}

function linesInter(): [number, number] {
  const [redHitX, redHitY] = getRedHit();
  const [blueHitX, blueHitY] = getBlueStart();
  const focusX = pOhnisko;
  const focusY = height / 2;

  const mRed = (focusY - redHitY) / (focusX - redHitX);
  const targetY = blueHitY;
  const targetX = focusX + (targetY - focusY) / mRed;

  return [targetX, targetY];
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
  ctx.moveTo(0, height / 2);
  ctx.lineTo(width, height / 2);
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
  ctx.restore();
}

function draw() {
  ctx.save();
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.clearRect(0, 0, width, height);
  ctx.restore();

  ctx.save();

  drawBackground();
  ctx.translate(center, 0);

  const w = obraz.width;
  const newWidth = w / (obraz.height / iconHeight);
  if (obraz.complete) {
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

  // Red ray
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

  // Blue Ray
  ctx.strokeStyle = "blue";

  const blueMirrorHit = getBlueStart();

  const objX = iconX;
  const objY = drawIconHeight;
  const slopeBlue = (focusY - objY) / (focusX - objX);

  const blueYAtLeft = focusY + slopeBlue * (leftEdge - focusX);
  const blueYAtRight = focusY + slopeBlue * (rightEdge - focusX);

  ctx.setLineDash([]);
  ctx.beginPath();
  ctx.moveTo(leftEdge, blueYAtLeft);
  ctx.lineTo(blueMirrorHit[0], blueMirrorHit[1]);
  ctx.stroke();

  ctx.save();
  ctx.beginPath();
  ctx.setLineDash([5, 5]);
  ctx.moveTo(blueMirrorHit[0], blueMirrorHit[1]);
  ctx.lineTo(rightEdge, blueYAtRight);
  ctx.stroke();
  ctx.setLineDash([]);
  ctx.restore();

  horBeam(blueMirrorHit[1], blueMirrorHit[0], "blue");

  // Obraz
  const reflection = obraz;
  const intersection = linesInter();
  const linesInterX = intersection[0];
  const linesInterY = intersection[1];

  const reflectIconHeight = linesInterY - height / 2;
  const reflectNewWidth =
    (obraz.width / obraz.height) * Math.abs(reflectIconHeight);
  ctx.drawImage(
    obraz,
    linesInterX - reflectNewWidth / 2,
    height / 2,
    reflectNewWidth,
    reflectIconHeight,
  );

  ctx.restore();
}
canvas.width = width;
canvas.height = height;

iconInput.max = (center - 10).toString();

iconInput.addEventListener("input", () => {
  iconX = -iconInput.valueAsNumber;
  iconOutput.value = iconInput.value;
  draw();
});

obraz.src = "arrow.svg";
obraz.onload = () => {
  draw();
};
