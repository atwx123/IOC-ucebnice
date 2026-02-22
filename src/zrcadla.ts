const canvas: HTMLCanvasElement = document.getElementById(
  "zrcadlaInt",
) as HTMLCanvasElement;
const ctx: CanvasRenderingContext2D = canvas.getContext(
  "2d",
) as CanvasRenderingContext2D;
const iconXInput: HTMLInputElement = document.getElementById(
  "iconXRangeInput",
) as HTMLInputElement;
const iconYInput: HTMLInputElement = document.getElementById(
  "iconYRangeInput",
) as HTMLInputElement;
const radiusInput: HTMLInputElement = document.getElementById(
  "radiusRangeInput",
) as HTMLInputElement;
const centerInput: HTMLInputElement = document.getElementById(
  "centerRangeInput",
) as HTMLInputElement;
const width: number = 1000;
const height: number = 600;
let center = width / 6;
let rz: number = 600;
const pOhnisko: number = rz / 2;
let iconHeight: number = 50;
let drawIconHeight = height / 2 - iconHeight;
let iconX: number = -200;
const obraz: HTMLImageElement = new Image();

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
  const dy: number = drawIconHeight - height / 2;
  const x: number = Math.sqrt(Math.pow(rz, 2) - Math.pow(dy, 2));
  return [x, drawIconHeight];
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
  const relHitY: number = m * (x - pOhnisko);

  return [x, relHitY + height / 2];
}

function linesInter(): [number, number] {
  const [redHitX, redHitY]: [number, number] = getHorTFHit();
  const blueHitY: number = getThroughFTFHit()[1];
  const focusY: number = height / 2;

  const mRed: number = (focusY - redHitY) / (pOhnisko - redHitX);
  const targetX: number = pOhnisko + (blueHitY - focusY) / mRed;

  return [targetX, blueHitY];
}

function getHorBFHit(): [number, number] {
  const dy: number = drawIconHeight - height / 2;
  const x: number = Math.sqrt(rz * rz - dy * dy);
  return [x, drawIconHeight];
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

  const newWidth: number = obraz.width / (obraz.height / iconHeight);
  if (obraz.complete) {
    const leftSide = iconX - newWidth / 2;
    ctx.drawImage(
      obraz,
      leftSide,
      height / 2 - iconHeight,
      newWidth,
      iconHeight,
    );
  }

  // Red ray
  ctx.strokeStyle = "red";
  const redHit: [number, number] = getHorTFHit();

  horBeam(redHit[1], redHit[0], "red");
  const focusY: number = height / 2;
  const slopeRed: number = (focusY - redHit[1]) / (pOhnisko - redHit[0]);

  const yAtLeft: number = redHit[1] + slopeRed * (-center - redHit[0]);
  const yAtRight: number = redHit[1] + slopeRed * (width - center - redHit[0]);

  ctx.beginPath();
  ctx.moveTo(redHit[0], redHit[1]);
  ctx.lineTo(-center, yAtLeft);
  ctx.stroke();

  ctx.save();
  ctx.beginPath();
  ctx.setLineDash([5, 5]);
  ctx.moveTo(redHit[0], redHit[1]);
  ctx.lineTo(width - center, yAtRight);
  ctx.stroke();
  ctx.setLineDash([]);
  ctx.restore();

  // Blue Ray
  ctx.strokeStyle = "blue";

  const blueMirrorHit: [number, number] = getThroughFTFHit();

  const slopeBlue: number = (focusY - drawIconHeight) / (pOhnisko - iconX);

  const blueYAtLeft: number = focusY + slopeBlue * (-center - pOhnisko);
  const blueYAtRight: number = focusY + slopeBlue * (width - center - pOhnisko);

  ctx.setLineDash([]);
  ctx.beginPath();
  ctx.moveTo(-center, blueYAtLeft);
  ctx.lineTo(blueMirrorHit[0], blueMirrorHit[1]);
  ctx.stroke();

  ctx.save();
  ctx.beginPath();
  ctx.setLineDash([5, 5]);
  ctx.moveTo(blueMirrorHit[0], blueMirrorHit[1]);
  ctx.lineTo(width - center, blueYAtRight);
  ctx.stroke();
  ctx.setLineDash([]);
  ctx.restore();

  horBeam(blueMirrorHit[1], blueMirrorHit[0], "blue");

  // Obraz
  const reflection: HTMLImageElement = obraz;
  reflection.src = obraz.src;
  const drawMirroredImage = (
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

    const radians: number = (degrees * Math.PI) / 180;
    ctx.rotate(radians);
    ctx.scale(-1, 1);

    ctx.drawImage(img, -width / 2, -height / 2, width, height);

    ctx.restore();
  };
  const [linesInterX, linesInterY]: [number, number] = linesInter();

  const reflectIconHeight: number = linesInterY - height / 2;
  const reflectNewWidth: number =
    (obraz.width / obraz.height) * Math.abs(reflectIconHeight);
  drawMirroredImage(
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

  const newWidth: number = obraz.width / (obraz.height / iconHeight);
  if (obraz.complete) {
    const leftSide = iconX - newWidth / 2;
    ctx.drawImage(
      obraz,
      leftSide,
      height / 2 - iconHeight,
      newWidth,
      iconHeight,
    );
  }

  // Blue ray

  const focusY: number = height / 2;
  const redHit: [number, number] = getThroughFBFHit();

  const slopeF: number = (focusY - drawIconHeight) / (pOhnisko - iconX);
  const xAtBottom: number = pOhnisko + (height - focusY) / slopeF;

  ctx.strokeStyle = "blue";
  ctx.setLineDash([]);
  ctx.beginPath();
  ctx.moveTo(xAtBottom, height);
  ctx.lineTo(redHit[0], redHit[1]);
  ctx.stroke();

  horBeam(redHit[1], redHit[0], "blue");

  ctx.save();
  ctx.strokeStyle = "blue";
  ctx.setLineDash([5, 5]);
  ctx.beginPath();
  ctx.moveTo(redHit[0], redHit[1]);
  ctx.lineTo(width - center, redHit[1]);
  ctx.stroke();
  ctx.restore();

  // Red ray
  const [xkb, ykb]: [number, number] = getHorBFHit();
  horBeam(ykb, xkb, "red");
  const mb: number = (focusY - ykb) / (pOhnisko - xkb);
  const ybLeft: number = ykb + mb * (-center - xkb);
  const ybRight: number = ykb + mb * (width - center - xkb);
  ctx.strokeStyle = "red";
  ctx.beginPath();
  ctx.moveTo(xkb, ykb);
  ctx.lineTo(-center, ybLeft);
  ctx.stroke();

  ctx.save();
  ctx.strokeStyle = "red";
  ctx.setLineDash([5, 5]);
  ctx.beginPath();
  ctx.moveTo(xkb, ykb);
  ctx.lineTo(width - center, ybRight);
  ctx.stroke();
  ctx.restore();

  const virtualX: number = xkb + (redHit[1] - ykb) / mb;
  const vHeight: number = redHit[1] - height / 2;
  const absHeight: number = Math.abs(vHeight);
  const vWidth: number = (obraz.width / obraz.height) * absHeight;

  if (obraz.complete) {
    ctx.drawImage(obraz, virtualX - vWidth / 2, redHit[1], vWidth, absHeight);
  }

  ctx.restore();
}
canvas.width = width;
canvas.height = height;

iconXInput.max = (center - 10).toString();

iconXInput.addEventListener("input", () => {
  iconX = -iconXInput.valueAsNumber;
  if (iconX < pOhnisko) {
    drawToF();
  } else {
    drawBehindF();
  }
});

iconYInput.addEventListener("input", () => {
  iconHeight = iconYInput.valueAsNumber;
  drawIconHeight = height / 2 - iconHeight;
  if (iconX < pOhnisko) {
    drawToF();
  } else {
    drawBehindF();
  }
});

radiusInput.addEventListener("input", () => {
  rz = radiusInput.valueAsNumber;
  if (iconX < pOhnisko) {
    drawToF();
  } else {
    drawBehindF();
  }
});

centerInput.addEventListener("input", () => {
  center = centerInput.valueAsNumber;
  if (iconX < pOhnisko) {
    drawToF();
  } else {
    drawBehindF();
  }
});

obraz.src = "one.svg";
drawToF();
