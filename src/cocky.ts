const canvas: HTMLCanvasElement = document.getElementById(
  "cockyInt",
) as HTMLCanvasElement;
const ctx: CanvasRenderingContext2D = canvas.getContext(
  "2d",
) as CanvasRenderingContext2D;
const iconXInput: HTMLInputElement = document.getElementById(
  "objectXInput",
) as HTMLInputElement;
const width: number = 1000;
const height: number = 600;
const center: number = width / 2;
const rConv: number = 200;
const n: number = 1.7;
const f: number = 1 / (((n - 1) * 2) / rConv);
const v: number = 150;
let iconX: number = 200;
const obraz: HTMLImageElement = new Image();
const iconHeightConv: number = 100;

function drawBackgroundConv() {
  const angle = Math.acos(v / rConv);
  ctx.save();
  ctx.fillStyle = "#7FE1EE";
  ctx.beginPath();
  ctx.arc(center - v, height / 2, rConv, -angle, angle, false);
  ctx.arc(
    center + v,
    height / 2,
    rConv,
    Math.PI - angle,
    Math.PI + angle,
    false,
  );
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
  ctx.restore();

  ctx.beginPath();
  ctx.setLineDash([5, 5]);
  ctx.moveTo(0, height / 2);
  ctx.lineTo(width, height / 2);
  ctx.stroke();
  ctx.setLineDash([]);

  ctx.save();
  ctx.beginPath();
  ctx.moveTo(center - f, height / 2 - 5);
  ctx.lineTo(center - f, height / 2 + 5);
  ctx.stroke();
  ctx.textAlign = "center";
  ctx.textBaseline = "hanging";
  ctx.font = "20px sans-serif";
  ctx.fillText("F", center - f, height / 2 + 10);
  ctx.restore();

  ctx.save();
  ctx.beginPath();
  ctx.moveTo(center + f, height / 2 - 5);
  ctx.lineTo(center + f, height / 2 + 5);
  ctx.stroke();
  ctx.textAlign = "center";
  ctx.textBaseline = "hanging";
  ctx.font = "20px sans-serif";
  ctx.fillText("F'", center + f, height / 2 + 10);
  ctx.restore();

  ctx.save();
  ctx.beginPath();
  ctx.moveTo(center, height / 2 - 5);
  ctx.lineTo(center, height / 2 + 5);
  ctx.stroke();
  ctx.textAlign = "center";
  ctx.textBaseline = "hanging";
  ctx.font = "20px sans-serif";
  ctx.fillText("O", center, height / 2 + 10);
  ctx.restore();
}

function drawXgt2f() {
  ctx.save();
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.clearRect(0, 0, width, height);
  ctx.restore();

  ctx.save();
  const newWidth = (iconHeightConv * obraz.width) / obraz.height;
  drawBackgroundConv();
  if (obraz.complete && obraz.height > 0) {
    ctx.drawImage(
      obraz,
      iconX - newWidth / 2,
      height / 2 - iconHeightConv,
      newWidth,
      iconHeightConv,
    );
  }

  const blueSlope = iconHeightConv / (center - iconX - f);
  const yLens = height / 2 + blueSlope * f;

  const redSlope = iconHeightConv / f;

  const intersectX =
    center + (yLens - (height / 2 - iconHeightConv)) / redSlope;

  const drawLimitX = Math.max(width, intersectX);
  const redEndY =
    height / 2 - iconHeightConv + redSlope * (drawLimitX - center);

  // --- Draw Red Ray ---
  ctx.save();
  ctx.strokeStyle = "red";
  ctx.beginPath();
  ctx.moveTo(0, height / 2 - iconHeightConv);
  ctx.lineTo(center, height / 2 - iconHeightConv);
  ctx.lineTo(drawLimitX, redEndY);
  ctx.stroke();
  ctx.restore();

  // --- Draw Blue Ray ---
  ctx.save();
  ctx.strokeStyle = "blue";
  ctx.beginPath();
  ctx.moveTo(iconX, height / 2 - iconHeightConv);
  ctx.lineTo(center, yLens);
  ctx.lineTo(drawLimitX, yLens); // Extends all the way to the limit
  ctx.stroke();
  ctx.restore();

  // --- Draw Image ---
  const reflectIconHeight: number = yLens - height / 2;
  const reflectNewWidth: number =
    (obraz.width / obraz.height) * Math.abs(reflectIconHeight);
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
  drawMirroredImage(
    ctx,
    obraz,
    intersectX - reflectNewWidth / 2,
    height / 2,
    reflectNewWidth,
    reflectIconHeight,
    180,
  );
}

function drawXeqf() {
  ctx.save();
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.clearRect(0, 0, width, height);
  ctx.restore();

  ctx.save();
  const newWidth = (iconHeightConv * obraz.width) / obraz.height;
  drawBackgroundConv();
  if (obraz.complete && obraz.height > 0) {
    ctx.drawImage(
      obraz,
      iconX - newWidth / 2,
      height / 2 - iconHeightConv,
      newWidth,
      iconHeightConv,
    );
  }
  const topY = height / 2 - iconHeightConv;

  // Red ray
  const redSlope = iconHeightConv / f;
  const redEndY = topY + redSlope * (width - center);

  ctx.save();
  ctx.strokeStyle = "red";
  ctx.beginPath();
  ctx.moveTo(0, topY);
  ctx.lineTo(center, topY);
  ctx.lineTo(width, redEndY);
  ctx.stroke();
  ctx.restore();

  // Blue ray
  const blueSlope = iconHeightConv / f;
  const bCenter = height / 2 - blueSlope * center;

  const ybl = bCenter;
  const ybr = blueSlope * width + bCenter;

  ctx.save();
  ctx.strokeStyle = "blue";
  ctx.beginPath();
  ctx.moveTo(0, ybl);
  ctx.lineTo(width, ybr);
  ctx.stroke();
  ctx.restore();
}

function drawXltf() {
  ctx.save();
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.clearRect(0, 0, width, height);
  ctx.restore();

  drawBackgroundConv();
  const newWidth = (iconHeightConv * obraz.width) / obraz.height;
  if (obraz.complete && obraz.height > 0) {
    ctx.drawImage(
      obraz,
      iconX - newWidth / 2,
      height / 2 - iconHeightConv,
      newWidth,
      iconHeightConv,
    );
  }

  const topY = height / 2 - iconHeightConv;

  const redSlope = iconHeightConv / f;
  const blueSlope = iconHeightConv / (center - iconX);

  const intersectX = center + (topY - height / 2) / (blueSlope - redSlope);
  const intersectY = height / 2 + blueSlope * (intersectX - center);

  // --- Draw Red Ray ---
  const redEndY = topY + redSlope * (width - center);

  ctx.save();
  ctx.strokeStyle = "red";
  ctx.beginPath();
  ctx.moveTo(0, topY);
  ctx.lineTo(center, topY);
  ctx.lineTo(width, redEndY);
  ctx.stroke();

  ctx.beginPath();
  ctx.setLineDash([5, 5]);
  ctx.moveTo(center, topY);
  ctx.lineTo(intersectX, intersectY);
  ctx.stroke();
  ctx.restore();

  // --- Draw Blue Ray ---
  const blueEndY = height / 2 + blueSlope * (width - center);

  ctx.save();
  ctx.strokeStyle = "blue";
  ctx.beginPath();
  ctx.moveTo(iconX, topY);
  ctx.lineTo(width, blueEndY);
  ctx.stroke();

  ctx.beginPath();
  ctx.setLineDash([5, 5]);
  ctx.moveTo(iconX, topY);
  ctx.lineTo(intersectX, intersectY);
  ctx.stroke();
  ctx.restore();

  if (obraz.complete && obraz.height > 0) {
    const virtualHeight = height / 2 - intersectY;
    const virtualWidth = (obraz.width / obraz.height) * virtualHeight;

    ctx.save();
    ctx.globalAlpha = 0.4;
    ctx.drawImage(
      obraz,
      intersectX - virtualWidth / 2,
      intersectY,
      virtualWidth,
      virtualHeight,
    );
    ctx.restore();
  }
}

canvas.width = width;
canvas.height = height;
drawBackgroundConv();

iconXInput.addEventListener("input", () => {
  iconX = iconXInput.valueAsNumber;
  const distance = center - iconX;
  if (Math.abs(distance - f) < 1.5) {
    drawXeqf();
  } else if (distance > f) {
    drawXgt2f();
  } else {
    drawXltf();
  }
});
obraz.onload = () => {
  drawXgt2f();
};

obraz.src = "one.svg";
