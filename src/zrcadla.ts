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
let obraz: HTMLImageElement = new Image();

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

function getHorTFHit(): [number, number] {
  const y: number = drawIconHeight;
  const dy: number = y - height / 2;
  const x: number = Math.sqrt(Math.pow(rz, 2) - Math.pow(dy, 2));
  return [x, y];
}

function getThroughFTFHit(): [number, number] {
  const relObjY: number = drawIconHeight - height / 2;

  if (Math.abs(iconX - pOhnisko) < 0.01) {
    const val: number = Math.sqrt(rz * rz - pOhnisko * pOhnisko);
    const relHitY: number = relObjY < 0 ? val : -val;
    return [pOhnisko, relHitY + height / 2];
  }

  const m: number = (0 - relObjY) / (pOhnisko - iconX);

  const A: number = 1 + m * m;
  const B: number = -2 * pOhnisko * m * m;
  const C: number = m * m * pOhnisko * pOhnisko - rz * rz;

  const delta: number = Math.sqrt(B * B - 4 * A * C);
  const x: number = (-B + delta) / (2 * A);

  const relHitY: number = m * (x - pOhnisko);

  return [x, relHitY + height / 2];
}

function getThroughFBFHit(): [number, number] {
  const relObjY: number = drawIconHeight - height / 2;

  const m: number = (0 - relObjY) / (pOhnisko - iconX);

  const A: number = 1 + m * m;
  const B: number = -2 * pOhnisko * m * m;
  const C: number = m * m * pOhnisko * pOhnisko - rz * rz;

  const delta: number = Math.sqrt(B * B - 4 * A * C);
  const x: number = (-B + delta) / (2 * A);

  const y: number = x * (drawIconHeight / iconX);
  return [x, y];
}
function linesInter(): [number, number] {
  const [redHitX, redHitY] = getHorTFHit();
  const [blueHitX, blueHitY] = getThroughFTFHit();
  const focusX: number = pOhnisko;
  const focusY: number = height / 2;

  const mRed: number = (focusY - redHitY) / (focusX - redHitX);
  const targetY: number = blueHitY;
  const targetX: number = focusX + (targetY - focusY) / mRed;

  return [targetX, targetY];
}

function interEdgeBot(): [number, number] {
  const [hitX, hitY] = getHorTFHit();
  const focusX: number = pOhnisko;
  const focusY: number = height / 2;
  const slope: number = (focusY - hitY) / (focusX - hitX);
  const xTarget: number = -center;
  const yTarget: number = focusY + slope * (xTarget - focusX);
  return [xTarget, yTarget];
}

function getHorBFHit(): [number, number, number] {
  const focusY = height / 2;
  const m = (focusY - drawIconHeight) / (pOhnisko - iconX);
  const A = 1 + Math.pow(m, 2);
  const B = -2 * pOhnisko * Math.pow(m, 2);
  const C = Math.pow(m * pOhnisko, 2) - Math.pow(rz, 2);
  const delta = Math.sqrt(Math.pow(B, 2) - 4 * A * C);
  const x = (-B + delta) / (2 * A);
  return [x, m * (x - pOhnisko), m];
}
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

function drawToF() {
  ctx.save();
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.clearRect(0, 0, width, height);
  ctx.restore();

  ctx.save();

  drawBackground();
  ctx.translate(center, 0);

  const w: number = obraz.width;
  const newWidth: number = w / (obraz.height / iconHeight);
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

  const rightEdge: number = 1000;
  const leftEdge: number = -center;

  // Red ray
  ctx.strokeStyle = "red";
  const redHit = getHorTFHit();

  horBeam(redHit[1], redHit[0], "red");
  const focusY: number = height / 2;
  const slopeRed: number = (focusY - redHit[1]) / (pOhnisko - redHit[0]);

  const yAtLeft: number = redHit[1] + slopeRed * (leftEdge - redHit[0]);
  const yAtRight: number = redHit[1] + slopeRed * (rightEdge - redHit[0]);

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

  const blueMirrorHit: [number, number] = getThroughFTFHit();

  const objX: number = iconX;
  const objY: number = drawIconHeight;
  const slopeBlue: number = (focusY - objY) / (pOhnisko - objX);

  const blueYAtLeft: number = focusY + slopeBlue * (leftEdge - pOhnisko);
  const blueYAtRight: number = focusY + slopeBlue * (rightEdge - pOhnisko);

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
  const reflection: HTMLImageElement = obraz;
  reflection.src = obraz.src;
  const drawRotatedImage = (
    ctx: CanvasRenderingContext2D,
    img: HTMLImageElement,
    x: number,
    y: number,
    width: number,
    height: number,
    degrees: number,
  ): void => {
    ctx.save();
    ctx.translate(x + width / 2, y + height / 2);
    const radians = (degrees * Math.PI) / 180;
    ctx.rotate(radians);
    ctx.drawImage(img, -width / 2, -height / 2, width, height);
    ctx.restore();
  };
  const intersection: [number, number] = linesInter();
  const linesInterX: number = intersection[0];
  const linesInterY: number = intersection[1];

  const reflectIconHeight: number = linesInterY - height / 2;
  const reflectNewWidth: number =
    (obraz.width / obraz.height) * Math.abs(reflectIconHeight);
  drawRotatedImage(
    ctx,
    reflection,
    linesInterX - reflectNewWidth / 2,
    height / 2,
    reflectNewWidth,
    reflectIconHeight,
    180,
  );
  ctx.restore();
}
function drawBehindF() {
  ctx.save();
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.clearRect(0, 0, width, height);
  ctx.restore();

  ctx.save();

  drawBackground();
  ctx.translate(center, 0);

  const w: number = obraz.width;
  const newWidth: number = w / (obraz.height / iconHeight);
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

  // Red ray

  const focusY: number = height / 2;
  const redHit: [number, number] = getThroughFBFHit();
  horBeam(redHit[1], redHit[0], "red");

  const mr = (focusY - redHit[1]) / (pOhnisko - redHit[0]);
  const yr = redHit[1] + mr * -redHit[0];
  ctx.save();
  ctx.strokeStyle = "red";
  ctx.beginPath();
  ctx.moveTo(redHit[0], redHit[1]);
  ctx.lineTo(0, yr);
  ctx.stroke();
  ctx.restore();

  // Blue ray
  const [xkb, ykb, mb] = getHorBFHit();
  horBeam(ykb, xkb, "blue");

  const yb = drawIconHeight + mb * -iconX;

  ctx.save();
  ctx.strokeStyle = "blue";
  ctx.beginPath();
  ctx.moveTo(xkb, ykb);
  ctx.lineTo(0, yb);
  ctx.stroke();
  ctx.restore();
  ctx.restore();
}
canvas.width = width;
canvas.height = height;

iconInput.max = (center - 10).toString();

iconInput.addEventListener("input", () => {
  iconX = -iconInput.valueAsNumber;
  iconOutput.value = iconInput.value;
  if (iconX < pOhnisko) {
    drawToF();
  } else {
    drawBehindF();
  }
});

obraz.src = "arrow.svg";
