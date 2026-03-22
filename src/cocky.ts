const canvas: HTMLCanvasElement = document.getElementById(
  "cockyInt",
) as HTMLCanvasElement;
const ctx: CanvasRenderingContext2D = canvas.getContext(
  "2d",
) as CanvasRenderingContext2D;
const iconXInput: HTMLInputElement = document.getElementById(
  "objectXInput",
) as HTMLInputElement;
const buttonConc: HTMLButtonElement = document.getElementById(
  "buttonConc",
) as HTMLButtonElement;
const buttonConv: HTMLButtonElement = document.getElementById(
  "buttonConv",
) as HTMLButtonElement;

const width: number = 1000;
const height: number = 600;
const center: number = width / 2;

const rConv: number = 200;
const n: number = 1.7;
const f: number = 1 / (((n - 1) * 2) / rConv);
const vConv: number = 150;

const lensWidthConv: number = 40;
const lensHeightConv: number = 260;
const pinchConv: number = 15;

let iconX: number = 200;

const obraz: HTMLImageElement = new Image();

const iconHeight: number = 100;
const drawIconHeight: number = height / 2 - iconHeight;

let lens: boolean = true;

/**
 * Nakresli marker pro danou pozici a text
 * @param text text, ktery se ma vytisknout
 * @param x kde se ma marker nakreslit
 */
function drawMarker(text: string, x: number): void {
  ctx.save();
  ctx.beginPath();
  ctx.moveTo(x, height / 2 - 5);
  ctx.lineTo(x, height / 2 + 5);
  ctx.stroke();
  ctx.textAlign = "center";
  ctx.textBaseline = "hanging";
  ctx.font = "20px sans-serif";
  ctx.fillText(text, x, height / 2 + 10);
  ctx.restore();
}

/**
 * Nakresli pozadi pro spojku
 */
function drawBackgroundConv(): void {
  const angle: number = Math.acos(vConv / rConv);
  ctx.save();
  ctx.fillStyle = "#7FE1EE";
  ctx.beginPath();
  ctx.arc(center - vConv, height / 2, rConv, -angle, angle, false);
  ctx.arc(
    center + vConv,
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

  drawMarker("F", center - f);
  drawMarker("F'", center + f);
  drawMarker("O", center);
}

/**
 * Nakresli spojku a paprsky pro objekt vzdaleny vetsi nez 2f
 */
function drawXgt2f(): void {
  ctx.save();
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.clearRect(0, 0, width, height);
  ctx.restore();

  ctx.save();
  const newWidth: number = (iconHeight * obraz.width) / obraz.height;
  drawBackgroundConv();
  if (obraz.complete && obraz.height > 0) {
    ctx.drawImage(
      obraz,
      iconX - newWidth / 2,
      drawIconHeight,
      newWidth,
      iconHeight,
    );
  }

  const blueSlope: number = iconHeight / (center - iconX - f);
  const yLens: number = height / 2 + blueSlope * f;

  const redSlope: number = iconHeight / f;

  const intersectX: number = center + (yLens - drawIconHeight) / redSlope;

  const drawLimitX: number = Math.max(width, intersectX);
  const redEndY: number = drawIconHeight + redSlope * (drawLimitX - center);

  // --- Draw Red Ray ---
  ctx.save();
  ctx.strokeStyle = "red";
  ctx.beginPath();
  ctx.moveTo(0, drawIconHeight);
  ctx.lineTo(center, drawIconHeight);
  ctx.lineTo(drawLimitX, redEndY);
  ctx.stroke();
  ctx.restore();

  // --- Draw Blue Ray ---
  ctx.save();
  ctx.strokeStyle = "blue";
  ctx.beginPath();
  ctx.moveTo(iconX, drawIconHeight);
  ctx.lineTo(center, yLens);
  ctx.lineTo(drawLimitX, yLens); // Extends all the way to the limit
  ctx.stroke();
  ctx.restore();

  // --- Draw Image ---
  const reflectIconHeight: number = yLens - height / 2;
  const reflectNewWidth: number =
    (obraz.width / obraz.height) * Math.abs(reflectIconHeight);

  const drawMirroredImage = (
    ctxArg: CanvasRenderingContext2D,
    img: HTMLImageElement,
    x: number,
    y: number,
    w: number,
    h: number,
    degrees: number,
  ): void => {
    ctxArg.save();
    ctxArg.translate(x + w / 2, y + h / 2);
    const radians: number = (degrees * Math.PI) / 180;
    ctxArg.rotate(radians);
    ctxArg.scale(-1, 1);
    ctxArg.drawImage(img, -w / 2, -h / 2, w, h);
    ctxArg.restore();
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

/**
 * Nakresli spojku a paprsky pro objekt vzdaleny mensi nez 2f
 */
function drawXeqf(): void {
  ctx.save();
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.clearRect(0, 0, width, height);
  ctx.restore();

  ctx.save();
  const newWidth: number = (iconHeight * obraz.width) / obraz.height;
  drawBackgroundConv();
  if (obraz.complete && obraz.height > 0) {
    ctx.drawImage(
      obraz,
      iconX - newWidth / 2,
      drawIconHeight,
      newWidth,
      iconHeight,
    );
  }
  const topY: number = drawIconHeight;

  // Red ray
  const redSlope: number = iconHeight / f;
  const redEndY: number = topY + redSlope * (width - center);

  ctx.save();
  ctx.strokeStyle = "red";
  ctx.beginPath();
  ctx.moveTo(0, topY);
  ctx.lineTo(center, topY);
  ctx.lineTo(width, redEndY);
  ctx.stroke();
  ctx.restore();

  // Blue ray
  const blueSlope: number = iconHeight / f;
  const bCenter: number = height / 2 - blueSlope * center;

  const ybl: number = bCenter;
  const ybr: number = blueSlope * width + bCenter;

  ctx.save();
  ctx.strokeStyle = "blue";
  ctx.beginPath();
  ctx.moveTo(0, ybl);
  ctx.lineTo(width, ybr);
  ctx.stroke();
  ctx.restore();
}

/**
 * Nakresli spojku a paprsky pro objekt vzdaleny mensi nez f
 */
function drawXltf(): void {
  ctx.save();
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.clearRect(0, 0, width, height);
  ctx.restore();

  drawBackgroundConv();
  const newWidth: number = (iconHeight * obraz.width) / obraz.height;
  if (obraz.complete && obraz.height > 0) {
    ctx.drawImage(
      obraz,
      iconX - newWidth / 2,
      drawIconHeight,
      newWidth,
      iconHeight,
    );
  }

  const topY: number = drawIconHeight;

  const redSlope: number = iconHeight / f;
  const blueSlope: number = iconHeight / (center - iconX);

  const intersectX: number =
    center + (topY - height / 2) / (blueSlope - redSlope);
  const intersectY: number = height / 2 + blueSlope * (intersectX - center);

  // --- Draw Red Ray ---
  const redEndY: number = topY + redSlope * (width - center);

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
  const blueEndY: number = height / 2 + blueSlope * (width - center);

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
    const virtualHeight: number = height / 2 - intersectY;
    const virtualWidth: number = (obraz.width / obraz.height) * virtualHeight;

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

/**
 * Nakresli pozadi pro rozptylku
 */
function drawBackgroundConc(): void {
  ctx.save();
  ctx.fillStyle = "#7FE1EE";
  ctx.beginPath();

  ctx.moveTo(center - lensWidthConv / 2, height / 2 - lensHeightConv / 2);

  ctx.lineTo(center + lensWidthConv / 2, height / 2 - lensHeightConv / 2);

  ctx.quadraticCurveTo(
    center + lensWidthConv / 2 - pinchConv,
    height / 2,
    center + lensWidthConv / 2,
    height / 2 + lensHeightConv / 2,
  );

  ctx.lineTo(center - lensWidthConv / 2, height / 2 + lensHeightConv / 2);

  ctx.quadraticCurveTo(
    center - lensWidthConv / 2 + pinchConv,
    height / 2,
    center - lensWidthConv / 2,
    height / 2 - lensHeightConv / 2,
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

  drawMarker("F", center - f);
  drawMarker("F'", center + f);
  drawMarker("O", center);
}

/**
 * Nakresli rozptylku a paprsky
 */
function drawConc(): void {
  ctx.save();
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.clearRect(0, 0, width, height);
  ctx.restore();
  drawBackgroundConc();

  const newWidth: number = (iconHeight * obraz.width) / obraz.height;
  if (obraz.complete && obraz.height > 0) {
    ctx.drawImage(
      obraz,
      iconX - newWidth / 2,
      drawIconHeight,
      newWidth,
      iconHeight,
    );
  }

  // Red ray
  ctx.save();
  ctx.strokeStyle = "red";
  ctx.beginPath();
  ctx.moveTo(iconX, drawIconHeight);
  ctx.lineTo(center, drawIconHeight);
  ctx.stroke();

  const redSlope: number = -iconHeight / f;
  const redB: number = drawIconHeight - redSlope * center;

  ctx.beginPath();
  ctx.setLineDash([5, 5]);
  ctx.moveTo(center - f, height / 2);
  ctx.lineTo(center, drawIconHeight);
  ctx.stroke();

  ctx.beginPath();
  ctx.setLineDash([]);
  ctx.moveTo(center, drawIconHeight);
  const redEndY: number = redSlope * width + redB;
  ctx.lineTo(width, redEndY);
  ctx.stroke();
  ctx.restore();

  // 2. BLUE RAY
  const blueSlope: number = iconHeight / (center - iconX);
  const blueB: number = height / 2 - blueSlope * center;

  ctx.save();
  ctx.strokeStyle = "blue";
  ctx.beginPath();
  ctx.moveTo(iconX, drawIconHeight);
  const blueEndY: number = blueSlope * width + blueB;
  ctx.lineTo(width, blueEndY);
  ctx.stroke();
  ctx.restore();

  const intersectX: number =
    center + (drawIconHeight - height / 2) / (blueSlope - redSlope);
  const intersectY: number = height / 2 + blueSlope * (intersectX - center);

  // obraz
  if (obraz.complete && obraz.height > 0) {
    const virtualHeight: number = height / 2 - intersectY;
    const aspect: number = obraz.width / obraz.height;
    const virtualWidth: number = virtualHeight * aspect;

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

iconXInput.addEventListener("input", (): void => {
  iconX = iconXInput.valueAsNumber;
  if (lens) {
    const distance: number = center - iconX;
    if (Math.abs(distance - f) < 1.5) {
      drawXeqf();
    } else if (distance > f) {
      drawXgt2f();
    } else {
      drawXltf();
    }
  } else {
    drawConc();
  }
});

buttonConc.addEventListener("click", (): void => {
  lens = false;
  drawConc();
});
buttonConv.addEventListener("click", (): void => {
  lens = true;
  drawXgt2f();
});

obraz.onload = (): void => {
  drawXgt2f();
};

obraz.src = "one.svg";
