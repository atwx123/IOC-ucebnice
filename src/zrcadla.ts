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
const concButton: HTMLButtonElement = document.getElementById(
  "buttonConc",
) as HTMLButtonElement;
const convButton: HTMLButtonElement = document.getElementById(
  "buttonConv",
) as HTMLButtonElement;

let mirror: boolean = true;

const width: number = 1000;
const height: number = 600;

let centerConc: number = width / 6;
let rzConc: number = 600;
const pOhniskoConc: number = rzConc / 2;
let iconHeightConc: number = 50;
let drawIconHeightConc: number = height / 2 - iconHeightConc;
let iconXConc: number = -200;
const obraz: HTMLImageElement = new Image();

let centerConv: number = width / 3;
let rzConv: number = 600;
let pOhniskoConv: number = -rzConv / 2;
let iconHeightConv: number = 50;
let drawIconHeightConv: number = height / 2 - iconHeightConv;
let iconXConv: number = -200;

/**
 * Vykresli horizontalni paprsek pro dute zrcadlo na dane souradnici y po delce celeho canvasu
 * @param y souradnice y paprsku
 * @param xk x souradnice paprsku se zrcadlem
 * @param color barva paprsku
 */
function horBeamConc(y: number, xk?: number, color?: string): void {
  ctx.save();
  if (color !== undefined) {
    ctx.strokeStyle = color;
  }
  ctx.beginPath();

  ctx.moveTo(0 - centerConc, y);

  ctx.setLineDash([]);
  if (xk !== undefined) {
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

/**
 * Vykresli horizontalni paprsek pro vypukle zrcadlo na dane souradnici y po delce celeho canvasu
 * @param y souradnice y paprsku
 * @param xk x souradnice paprsku se zrcadlem
 * @param color barva paprsku
 */
function horBeamConv(y: number, xk: number, color?: string): void {
  ctx.save();
  if (color !== undefined) {
    ctx.strokeStyle = color;
  }
  ctx.beginPath();
  ctx.moveTo(0 - centerConv, y);
  ctx.lineTo(xk, y);
  ctx.stroke();
  ctx.restore();
}

/**
 * Pomoci pythagorovy vety vypocita, kde se horizontalni paprsek u duteho zrcadla protne s kruznici, 
    zatimco objekt je pred ohniskem
 * @returns souradnice bodu, kde se horizontalni paprsek protne se zrcadlem (dute zrcadlo)
 */
function getHorTFHitConc(): [number, number] {
  const dy: number = drawIconHeightConc - height / 2;
  const x: number = Math.sqrt(Math.pow(rzConc, 2) - Math.pow(dy, 2));
  return [x, drawIconHeightConc];
}

/**
 * Pomoci pythagorovy vety (pokud by objekt uz byl velmi blizko objektu) nebo pomoci analyticke geometrie 
    (pomoci smernice primky a predpisu pro kruznici) vypocita prusecik paprsku, ktery prochazi ohniskem 
    u duteho zrcadla, s kruznici, zatimco je objekt pred ohniskem
 * @returns souradnice bodu, kde se paprsek, ktery prochazi ohniskem protne se zrcadlem (dute zrcadlo)
 */
function getThroughFTFHitConc(): [number, number] {
  const relObjY: number = drawIconHeightConc - height / 2;

  if (Math.abs(iconXConc - pOhniskoConc) < 0.01) {
    const val: number = Math.sqrt(
      rzConc * rzConc - pOhniskoConc * pOhniskoConc,
    );
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

/**
 * Pomoci analyticke geometrie (smernice primky a predpis kruznice) vypocita souradnice bodu, kde se 
    paprsek, ktery prochazi ohniskem u duteho zrcadla, protina s zrcadlem, zatimco objekt je za ohniskem
 * @returns souradnice bodu, kde se paprsek, ktery prochazi ohniskem, protne se zrcadlem
 */
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

/**
 * Pomoci analyticke geometrie (smernice primek) vypocita prusecik paprsku u konkavniho zrcadla
 * @returns souradnice bodu, kde se protnou paprsky u duteho zrcadla
 */
function linesInterConc(): [number, number] {
  const [redHitX, redHitY]: [number, number] = getHorTFHitConc();
  const blueHitY: number = getThroughFTFHitConc()[1];
  const focusY: number = height / 2;

  const mRed: number = (focusY - redHitY) / (pOhniskoConc - redHitX);
  const targetX: number = pOhniskoConc + (blueHitY - focusY) / mRed;

  return [targetX, blueHitY];
}

/**
 * Pomoci pythagorovy vety vypocita prusecik horizontalniho paprsku u duteho zrcadla s zrcadlem,
 *  zatimco objekt je za ohniskem
 * @returns prusecik horizontalniho paprsku a duteho zrcadla
 */
function getHorBFHitConc(): [number, number] {
  const dy: number = drawIconHeightConc - height / 2;
  const x: number = Math.sqrt(rzConc * rzConc - dy * dy);
  return [x, drawIconHeightConc];
}

/**
 * Pomoci pythagorovy vety vypocita prusecik horizontalniho paprsku u vypukleho zrcadla s zrcadlem
 * @returns prusecik horizontalniho paprsku a vypukleho zrcadla
 */
function getHorHitConv(): [number, number] {
  const dy: number = drawIconHeightConv - height / 2;
  return [
    -Math.sqrt(Math.pow(rzConv, 2) - Math.pow(dy, 2)),
    -drawIconHeightConv,
  ];
}

/**
 * Pomoci analyticke geometrie vypocita prusecik paprsku, ktery prochazi ohniskem u vypukleho zrcadla,
 * s zrcadlem
 * @returns prusecik paprsku, ktery prochazi ohniskem a vypukleho zrcadla
 */
function getThroughFConv(): [number, number] {
  const relObjY: number = drawIconHeightConv - height / 2;
  const m: number = (0 - relObjY) / (pOhniskoConv - iconXConv);
  const a: number = 1 + Math.pow(m, 2);
  const b: number = -2 * pOhniskoConv * Math.pow(m, 2);
  const c: number =
    Math.pow(m, 2) * Math.pow(pOhniskoConv, 2) - Math.pow(rzConv, 2);
  const delta: number = Math.sqrt(Math.pow(b, 2) - 4 * a * c);
  const x: number = (-b - delta) / (2 * a);
  const relHitY: number = m * (x - pOhniskoConv);
  const absoluteY: number = relHitY + height / 2;

  return [x, absoluteY];
}

/**
 * Pomoci analyticke geometrie vypocita prusecik paprsku u vypukleho zrcadla
 * @returns prusecik paprsku u vypukleho zrcadla
 */
function linesInterConv(): [number, number] {
  const focusY: number = height / 2;

  const mRed: number =
    (focusY - drawIconHeightConv) / (pOhniskoConv - getHorHitConv()[0]);
  const intersectX: number =
    pOhniskoConv + (getThroughFConv()[1] - focusY) / mRed;

  return [intersectX, getThroughFConv()[1]];
}

/**
 * Kresli pozadi k interkaitvive pro konkavni zrcadlo
 */
function drawBackgroundConc(): void {
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

/**
 * Vykresli paprsky, objekt a obraz, kdyz je objekt pred ohniskem
 */
function drawToFConc(): void {
  ctx.save();
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.clearRect(0, 0, width, height);
  ctx.restore();

  ctx.save();

  drawBackgroundConc();
  ctx.translate(centerConc, 0);

  const newWidth: number = obraz.width / (obraz.height / iconHeightConc);
  if (obraz.complete) {
    const leftSide: number = iconXConc - newWidth / 2;
    ctx.drawImage(
      obraz,
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
  const yAtRight: number =
    redHit[1] + slopeRed * (width - centerConc - redHit[0]);

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

  const slopeBlue: number =
    (focusY - drawIconHeightConc) / (pOhniskoConc - iconXConc);

  const blueYAtLeft: number = focusY + slopeBlue * (-centerConc - pOhniskoConc);
  const blueYAtRight: number =
    focusY + slopeBlue * (width - centerConc - pOhniskoConc);

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
  const reflection: HTMLImageElement = obraz;
  reflection.src = obraz.src;
  const drawMirroredImage = (
    ctxParam: CanvasRenderingContext2D,
    img: HTMLImageElement,
    x: number,
    y: number,
    w: number,
    h: number,
    degrees: number,
  ): void => {
    ctxParam.save();

    ctxParam.translate(x + w / 2, y + h / 2);

    const radians: number = (degrees * Math.PI) / 180;
    ctxParam.rotate(radians);
    ctxParam.scale(-1, 1);

    ctxParam.drawImage(img, -w / 2, -h / 2, w, h);

    ctxParam.restore();
  };
  const [linesInterX, linesInterY]: [number, number] = linesInterConc();

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

/**
 * Vykresli paprsky, objekt a obraz, kdyz je objekt za ohniskem
 */
function drawBehindFConc(): void {
  ctx.save();
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.clearRect(0, 0, width, height);
  ctx.restore();

  ctx.save();

  drawBackgroundConc();
  ctx.translate(centerConc, 0);

  const newWidth: number = obraz.width / (obraz.height / iconHeightConc);
  if (obraz.complete) {
    const leftSide: number = iconXConc - newWidth / 2;
    ctx.drawImage(
      obraz,
      leftSide,
      height / 2 - iconHeightConc,
      newWidth,
      iconHeightConc,
    );
  }

  // Blue ray

  const focusY: number = height / 2;
  const redHit: [number, number] = getThroughFBFHitConc();

  const slopeF: number =
    (focusY - drawIconHeightConc) / (pOhniskoConc - iconXConc);
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
  const [xkb, ykb]: [number, number] = getHorBFHitConc();
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
  const vWidth: number = (obraz.width / obraz.height) * absHeight;

  if (obraz.complete) {
    ctx.drawImage(obraz, virtualX - vWidth / 2, redHit[1], vWidth, absHeight);
  }

  ctx.restore();
}

canvas.width = width;
canvas.height = height;

/**
 * Vykresluje pozadi k interavite u konvexniho zrcadla
 */
function drawBackgroundConv(): void {
  ctx.save();
  ctx.setLineDash([5, 10, 10, 15]);
  ctx.beginPath();
  ctx.moveTo(0, height / 2);
  ctx.lineTo(width, height / 2);
  ctx.stroke();
  ctx.setLineDash([]);

  ctx.transform(1, 0, 0, 1, centerConv, 0);

  ctx.beginPath();
  ctx.arc(0, height / 2, rzConv, Math.PI / 2, (Math.PI * 3) / 2);
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
  ctx.moveTo(pOhniskoConv, height / 2 - 5);
  ctx.lineTo(pOhniskoConv, height / 2 + 5);
  ctx.stroke();

  ctx.fillText("F", pOhniskoConv, height / 2 + 10);

  ctx.beginPath();
  ctx.moveTo(-rzConv, height / 2 - 5);
  ctx.lineTo(-rzConv, height / 2 + 5);
  ctx.stroke();

  ctx.fillText("V", -rzConv + 10, height / 2 + 10);

  ctx.restore();
  ctx.restore();
}

/**
 * Vykresluje paprsky, obraz a objekt u konvexniho zrcadla
 */
function drawConv(): void {
  ctx.save();
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.clearRect(0, 0, width, height);
  ctx.restore();

  console.log("EMILY WAS HERE :3");

  drawBackgroundConv();

  ctx.save();

  ctx.translate(centerConv, 0);

  const newWidth: number = obraz.width / (obraz.height / iconHeightConv);
  if (obraz.complete) {
    const leftSide: number = iconXConv - newWidth / 2;
    ctx.drawImage(
      obraz,
      leftSide,
      height / 2 - iconHeightConv,
      newWidth,
      iconHeightConv,
    );
  }

  // Red ray
  ctx.save();

  ctx.strokeStyle = "red";
  const redHit: [number, number] = getHorHitConv();
  const focusY: number = height / 2;

  horBeamConv(drawIconHeightConv, redHit[0], "red");

  ctx.setLineDash([5, 5]);
  ctx.beginPath();
  ctx.moveTo(redHit[0], drawIconHeightConv);
  ctx.lineTo(pOhniskoConv, focusY);
  ctx.stroke();
  ctx.setLineDash([]);

  const slopeRed: number =
    (focusY - drawIconHeightConv) / (pOhniskoConv - redHit[0]);
  const yAtLeftR: number =
    drawIconHeightConv + slopeRed * (-centerConv - redHit[0]);

  ctx.beginPath();
  ctx.moveTo(redHit[0], drawIconHeightConv);
  ctx.lineTo(-centerConv, yAtLeftR);
  ctx.stroke();

  ctx.restore();
  //Blue ray

  ctx.save();

  ctx.strokeStyle = "blue";

  const blueHit: [number, number] = getThroughFConv();

  const slopeBlue: number =
    (focusY - drawIconHeightConv) / (pOhniskoConv - iconXConv);
  const yAtLeftB: number =
    drawIconHeightConv + slopeBlue * (-centerConv - iconXConv);

  ctx.beginPath();
  ctx.moveTo(-centerConv, yAtLeftB);
  ctx.lineTo(blueHit[0], blueHit[1]);
  ctx.stroke();

  ctx.setLineDash([5, 5]);
  ctx.beginPath();
  ctx.moveTo(blueHit[0], blueHit[1]);
  ctx.lineTo(pOhniskoConv, focusY);
  ctx.stroke();
  ctx.setLineDash([]);

  ctx.beginPath();
  ctx.moveTo(blueHit[0], blueHit[1]);
  ctx.lineTo(-centerConv, blueHit[1]);
  ctx.stroke();

  ctx.setLineDash([5, 5]);
  ctx.beginPath();
  ctx.moveTo(blueHit[0], blueHit[1]);
  ctx.lineTo(pOhniskoConv, blueHit[1]);
  ctx.stroke();
  ctx.setLineDash([]);

  ctx.restore();

  // obraz

  const linesInter: [number, number] = linesInterConv();
  const nIconHeight: number = height / 2 - linesInter[1];
  const nIconWidth: number = (obraz.width * nIconHeight) / obraz.height;

  if (obraz.complete) {
    ctx.save();
    ctx.globalAlpha = 0.4;
    ctx.drawImage(
      obraz,
      linesInter[0] - nIconWidth / 2,
      linesInter[1],
      nIconWidth,
      nIconHeight,
    );
    ctx.restore();
  }

  ctx.restore();
}

iconXInput.addEventListener("input", (): void => {
  if (mirror) {
    iconXConc = -iconXInput.valueAsNumber;
    if (iconXConc < pOhniskoConc) {
      drawToFConc();
    } else {
      drawBehindFConc();
    }
  } else {
    iconXConv = iconXInput.valueAsNumber;
    drawConv();
  }
});

iconYInput.addEventListener("input", (): void => {
  if (mirror) {
    iconHeightConc = iconYInput.valueAsNumber;
    drawIconHeightConc = height / 2 - iconHeightConc;
    if (iconXConc < pOhniskoConc) {
      drawToFConc();
    } else {
      drawBehindFConc();
    }
  } else {
    iconHeightConv = iconYInput.valueAsNumber;
    drawIconHeightConv = height / 2 - iconHeightConv;
    drawConv();
  }
});

radiusInput.addEventListener("input", (): void => {
  if (mirror) {
    rzConc = radiusInput.valueAsNumber;
    if (iconXConc < pOhniskoConc) {
      drawToFConc();
    } else {
      drawBehindFConc();
    }
  } else {
    rzConv = radiusInput.valueAsNumber;
    pOhniskoConv = -rzConv / 2;
    drawConv();
  }
});

centerInput.addEventListener("input", (): void => {
  if (mirror) {
    centerConc = centerInput.valueAsNumber;
    if (iconXConc < pOhniskoConc) {
      drawToFConc();
    } else {
      drawBehindFConc();
    }
  } else {
    centerConv = centerInput.valueAsNumber;
    drawConv();
  }
});

concButton.addEventListener("click", (): void => {
  mirror = true;
  drawToFConc();
});

convButton.addEventListener("click", (): void => {
  mirror = false;
  centerConv = 1000;
  drawConv();
});

obraz.src = "one.svg";
drawToFConc();
