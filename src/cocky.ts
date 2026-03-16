const canvas: HTMLCanvasElement = document.getElementById(
  "cockyInt",
) as HTMLCanvasElement;
const ctx: CanvasRenderingContext2D = canvas.getContext(
  "2d",
) as CanvasRenderingContext2D;
const iconXInput: HTMLInputElement = document.getElementById(
  "objectXInput",
) as HTMLInputElement;
const width: number = 800;
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

  //Red ray

  const redSlope = iconHeightConv / f;
  const redEndY = height / 2 - iconHeightConv + redSlope * (width - center);

  ctx.save();
  ctx.strokeStyle = "red";
  ctx.beginPath();
  ctx.moveTo(0, height / 2 - iconHeightConv);
  ctx.lineTo(center, height / 2 - iconHeightConv);
  ctx.lineTo(width, redEndY);
  ctx.stroke();

  ctx.restore();

  //blue ray

  const blueSlope = iconHeightConv / (center - iconX - f);
  const yLens = height / 2 + blueSlope * f;

  ctx.save();
  ctx.strokeStyle = "blue";
  ctx.beginPath();
  ctx.moveTo(iconX, height / 2 - iconHeightConv);
  ctx.lineTo(center, yLens);
  ctx.lineTo(width, yLens);
  ctx.stroke();
  ctx.restore();

  // image
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

  const reflectNewWidth: number =
    (obraz.width / obraz.height) * Math.abs(yLens - height / 2);

  const intersectX =
    center + (yLens - (height / 2 - iconHeightConv)) / redSlope;

  drawMirroredImage(
    ctx,
    obraz,
    intersectX - reflectNewWidth / 2,
    height / 2,
    reflectNewWidth,
    yLens - height / 2,
    180,
  );
}

function drawXgtf() {
  ctx.clearRect(0, 0, width, height);

  drawBackgroundConv();

  if (obraz.complete && obraz.height > 0) {
    const newWidth = obraz.width / (obraz.height / iconHeightConv);
    const leftSide = iconX - newWidth / 2;

    ctx.drawImage(
      obraz,
      leftSide,
      height / 2 - iconHeightConv,
      newWidth,
      iconHeightConv,
    );
  }
}

function drawXeqf() {}

function drawXltf() {}

canvas.width = width;
canvas.height = height;
drawBackgroundConv();

iconXInput.addEventListener("input", () => {
  iconX = iconXInput.valueAsNumber;

  const distance = center - iconX;

  if (distance >= 2 * f) {
    drawXgt2f();
  } else if (distance < 2 * f && distance > f) {
    drawXgtf();
  } else if (Math.abs(distance - f) < 1) {
    drawXeqf();
  } else if (distance < f) {
    drawXltf();
  }
});
obraz.onload = () => {
  drawXgt2f();
};

obraz.src = "one.svg";
