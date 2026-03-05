const canvas: HTMLCanvasElement = document.getElementById(
  "zrcadlaInt",
) as HTMLCanvasElement;
const ctx: CanvasRenderingContext2D = canvas.getContext(
  "2d",
) as CanvasRenderingContext2D;
const iconXInputConc: HTMLInputElement = document.getElementById(
  "iconXRangeInput",
) as HTMLInputElement;
const iconYInputConc: HTMLInputElement = document.getElementById(
  "iconYRangeInput",
) as HTMLInputElement;
const radiusInputConc: HTMLInputElement = document.getElementById(
  "radiusRangeInput",
) as HTMLInputElement;
const centerInputConc: HTMLInputElement = document.getElementById(
  "centerRangeInput",
) as HTMLInputElement;
const width: number = 1000;
const height: number = 600;
let centerConc = width / 6;
let rzConc: number = 600;
const pOhniskoConc: number = rzConc / 2;
let iconHeightConc: number = 50;
let drawIconHeightConc = height / 2 - iconHeightConc;
let iconXConc: number = -200;
const obrazConc: HTMLImageElement = new Image();

function horBeamConc(y: number, xk?: number, color?: string) {
  ctx.save();
  if (color != undefined) {
    ctx.strokeStyle = color;
  }
  ctx.beginPath();
  ctx.moveTo(0 - centerConc, y);
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

function getHorTFHitConc(): [number, number] {
  const dy: number = drawIconHeightConc - height / 2;
  const x: number = Math.sqrt(Math.pow(rzConc, 2) - Math.pow(dy, 2));
  return [x, drawIconHeightConc];
}

function getThroughFTFHitConc(): [number, number] {
  const relObjY: number = drawIconHeightConc - height / 2;

  if (Math.abs(iconXConc - pOhniskoConc) < 0.01) {
    const val: number = Math.sqrt(rzConc * rzConc - pOhniskoConc * pOhniskoConc);
    const relHitY: number = relObjY < 0 ? val : -val;
    return [pOhniskoConc, relHitY + height / 2];
  }

  const m: number = (0 - relObjY) / (pOhniskoConc - iconXConc);

  const A: number = 1 + m * m;
  const B: number = -2 * pOhniskoConc * m * m;
  const C: number = m * m * pOhniskoConc * pOhniskoConc - rzConc * rzConc;

  const delta: number = Math.sqrt(B * B - 4 * A * C);
  const x: number = (-B + delta) / (2 * A);

  const relHitY: number = m * (x - pOhniskoConc);

  return [x, relHitY + height / 2];
}

function getThroughFBFHitConc(): [number, number] {
  const relObjY: number = drawIconHeightConc - height / 2;

  const m: number = (0 - relObjY) / (pOhniskoConc - iconXConc);
  const A: number = 1 + m * m;
  const B: number = -2 * pOhniskoConc * m * m;
  const C: number = m * m * pOhniskoConc * pOhniskoConc - rzConc * rzConc;
  const delta: number = Math.sqrt(B * B - 4 * A * C);
  const x: number = (-B + delta) / (2 * A);
  const relHitY: number = m * (x - pOhniskoConc);

  return [x, relHitY + height / 2];
}

function linesInterConc(): [number, number] {
  const [redHitX, redHitY]: [number, number] = getHorTFHitConc();
  const blueHitY: number = getThroughFTFHitConc()[1];
  const focusY: number = height / 2;

  const mRed: number = (focusY - redHitY) / (pOhniskoConc - redHitX);
  const targetX: number = pOhniskoConc + (blueHitY - focusY) / mRed;

  return [targetX, blueHitY];
}

function getHorBFHit(): [number, number] {
  const dy: number = drawIconHeightConc - height / 2;
  const x: number = Math.sqrt(rzConc * rzConc - dy * dy);
  return [x, drawIconHeightConc];
}
function drawBackground() {
  ctx.save();
  ctx.setLineDash([5, 10, 10, 15]);
  ctx.beginPath();
  ctx.moveTo(0, height / 2);
  ctx.lineTo(width, height / 2);
  ctx.stroke();
  ctx.setLineDash([]);

  ctx.transform(1, 0, 0, 1, centerConc, 0);

  ctx.beginPath();
  ctx.arc(0, height / 2, rzConc, Math.PI / 2, (Math.PI * 2) / 1.5, true);
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
  ctx.moveTo(pOhniskoConc, height / 2 - 5);
  ctx.lineTo(pOhniskoConc, height / 2 + 5);
  ctx.stroke();

  ctx.fillText("F", pOhniskoConc, height / 2 + 10);
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
  ctx.translate(centerConc, 0);

  const newWidth: number = obrazConc.width / (obrazConc.height / iconHeightConc);
  if (obrazConc.complete) {
    const leftSide = iconXConc - newWidth / 2;
    ctx.drawImage(
      obrazConc,
      leftSide,
      height / 2 - iconHeightConc,
      newWidth,
      iconHeightConc,
    );
  }

  // Red ray
  ctx.strokeStyle = "red";
  const redHit: [number, number] = getHorTFHitConc();

  horBeamConc(redHit[1], redHit[0], "red");
  const focusY: number = height / 2;
  const slopeRed: number = (focusY - redHit[1]) / (pOhniskoConc - redHit[0]);

  const yAtLeft: number = redHit[1] + slopeRed * (-centerConc - redHit[0]);
  const yAtRight: number = redHit[1] + slopeRed * (width - centerConc - redHit[0]);

  ctx.beginPath();
  ctx.moveTo(redHit[0], redHit[1]);
  ctx.lineTo(-centerConc, yAtLeft);
  ctx.stroke();

  ctx.save();
  ctx.beginPath();
  ctx.setLineDash([5, 5]);
  ctx.moveTo(redHit[0], redHit[1]);
  ctx.lineTo(width - centerConc, yAtRight);
  ctx.stroke();
  ctx.setLineDash([]);
  ctx.restore();

  // Blue Ray
  ctx.strokeStyle = "blue";

  const blueMirrorHit: [number, number] = getThroughFTFHitConc();

  const slopeBlue: number = (focusY - drawIconHeightConc) / (pOhniskoConc - iconXConc);

  const blueYAtLeft: number = focusY + slopeBlue * (-centerConc - pOhniskoConc);
  const blueYAtRight: number = focusY + slopeBlue * (width - centerConc - pOhniskoConc);

  ctx.setLineDash([]);
  ctx.beginPath();
  ctx.moveTo(-centerConc, blueYAtLeft);
  ctx.lineTo(blueMirrorHit[0], blueMirrorHit[1]);
  ctx.stroke();

  ctx.save();
  ctx.beginPath();
  ctx.setLineDash([5, 5]);
  ctx.moveTo(blueMirrorHit[0], blueMirrorHit[1]);
  ctx.lineTo(width - centerConc, blueYAtRight);
  ctx.stroke();
  ctx.setLineDash([]);
  ctx.restore();

  horBeamConc(blueMirrorHit[1], blueMirrorHit[0], "blue");

  // Obraz
  const reflection: HTMLImageElement = obrazConc;
  reflection.src = obrazConc.src;
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
  const [linesInterX, linesInterY]: [number, number] = linesInterConc();

  const reflectIconHeight: number = linesInterY - height / 2;
  const reflectNewWidth: number =
    (obrazConc.width / obrazConc.height) * Math.abs(reflectIconHeight);
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
  ctx.translate(centerConc, 0);

  const newWidth: number = obrazConc.width / (obrazConc.height / iconHeightConc);
  if (obrazConc.complete) {
    const leftSide = iconXConc - newWidth / 2;
    ctx.drawImage(
      obrazConc,
      leftSide,
      height / 2 - iconHeightConc,
      newWidth,
      iconHeightConc,
    );
  }

  // Blue ray

  const focusY: number = height / 2;
  const redHit: [number, number] = getThroughFBFHitConc();

  const slopeF: number = (focusY - drawIconHeightConc) / (pOhniskoConc - iconXConc);
  const xAtBottom: number = pOhniskoConc + (height - focusY) / slopeF;

  ctx.strokeStyle = "blue";
  ctx.setLineDash([]);
  ctx.beginPath();
  ctx.moveTo(xAtBottom, height);
  ctx.lineTo(redHit[0], redHit[1]);
  ctx.stroke();

  horBeamConc(redHit[1], redHit[0], "blue");

  ctx.save();
  ctx.strokeStyle = "blue";
  ctx.setLineDash([5, 5]);
  ctx.beginPath();
  ctx.moveTo(redHit[0], redHit[1]);
  ctx.lineTo(width - centerConc, redHit[1]);
  ctx.stroke();
  ctx.restore();

  // Red ray
  const [xkb, ykb]: [number, number] = getHorBFHit();
  horBeamConc(ykb, xkb, "red");
  const mb: number = (focusY - ykb) / (pOhniskoConc - xkb);
  const ybLeft: number = ykb + mb * (-centerConc - xkb);
  const ybRight: number = ykb + mb * (width - centerConc - xkb);
  ctx.strokeStyle = "red";
  ctx.beginPath();
  ctx.moveTo(xkb, ykb);
  ctx.lineTo(-centerConc, ybLeft);
  ctx.stroke();

  ctx.save();
  ctx.strokeStyle = "red";
  ctx.setLineDash([5, 5]);
  ctx.beginPath();
  ctx.moveTo(xkb, ykb);
  ctx.lineTo(width - centerConc, ybRight);
  ctx.stroke();
  ctx.restore();

  const virtualX: number = xkb + (redHit[1] - ykb) / mb;
  const vHeight: number = redHit[1] - height / 2;
  const absHeight: number = Math.abs(vHeight);
  const vWidth: number = (obrazConc.width / obrazConc.height) * absHeight;

  if (obrazConc.complete) {
    ctx.drawImage(obrazConc, virtualX - vWidth / 2, redHit[1], vWidth, absHeight);
  }

  ctx.restore();
}
canvas.width = width;
canvas.height = height;

iconXInputConc.max = (centerConc - 10).toString();

iconXInputConc.addEventListener("input", () => {
  iconXConc = -iconXInputConc.valueAsNumber;
  if (iconXConc < pOhniskoConc) {
    drawToF();
  } else {
    drawBehindF();
  }
});

iconYInputConc.addEventListener("input", () => {
  iconHeightConc = iconYInputConc.valueAsNumber;
  drawIconHeightConc = height / 2 - iconHeightConc;
  if (iconXConc < pOhniskoConc) {
    drawToF();
  } else {
    drawBehindF();
  }
});

radiusInputConc.addEventListener("input", () => {
  rzConc = radiusInputConc.valueAsNumber;
  if (iconXConc < pOhniskoConc) {
    drawToF();
  } else {
    drawBehindF();
  }
});

centerInputConc.addEventListener("input", () => {
  centerConc = centerInputConc.valueAsNumber;
  if (iconXConc < pOhniskoConc) {
    drawToF();
  } else {
    drawBehindF();
  }
});

obrazConc.src = "one.svg";
drawToF();
