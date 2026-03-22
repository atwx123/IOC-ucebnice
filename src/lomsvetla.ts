const canvas: HTMLCanvasElement = document.getElementById(
  "lomSvetlaInt",
) as HTMLCanvasElement;
const ctx: CanvasRenderingContext2D = canvas.getContext(
  "2d",
) as CanvasRenderingContext2D;
const alphaInput: HTMLInputElement = document.getElementById(
  "alphaInput",
) as HTMLInputElement;
const alphaOutput: HTMLOutputElement = document.getElementById(
  "alphaRangeValue",
) as HTMLOutputElement;
const indexn1: HTMLSelectElement = document.getElementById(
  "indexn1",
) as HTMLSelectElement;
const indexn2: HTMLSelectElement = document.getElementById(
  "indexn2",
) as HTMLSelectElement;
const betaOutput: HTMLOutputElement = document.getElementById(
  "betaValue",
) as HTMLOutputElement;

const width: number = 1000;
const height: number = 600;

/**
 * Funkce, ktere se predaji parametry a vykresluje dva paprsky, jeden v prostredi n1 - cerveny - druhy v prostredi n2 - modry.
 * @param axisb souradnice modreho paprsku (paprsku v prostredi n1)
 * @param axisr souradnice cerveneho paprsku (paprsku v prstredi n2)
 */
function draw(axisb: [number, number], axisr: [number, number] | undefined): void {
  let axiy: [number, number] = [-1, -1];

  if (axisr === undefined) {
    const x1: number = axisb[0];
    const x2: number = axisb[1];
    const nx: number = canvas.width + (canvas.width - x1);
    axiy[0] = nx;
    axiy[1] = x2;
  } else {
    axiy = axisr;
  }

  ctx.fillStyle = "lightblue";
  ctx.fillRect(0, 0, width, height / 2);
  ctx.fillStyle = "lightgreen";
  ctx.fillRect(0, height / 2, width, height / 2);

  ctx.strokeStyle = "red";
  ctx.beginPath();
  ctx.moveTo(axisb[0], axisb[1]);
  ctx.lineTo(width / 2, height / 2);
  ctx.stroke();

  ctx.strokeStyle = "blue";
  ctx.beginPath();
  ctx.moveTo(width / 2, height / 2);
  ctx.lineTo(axiy[0], axiy[1]);
  ctx.stroke();
}

/**
 * Prevede uhly na radiany
 * @param ang uhel, ktery je treba prevest
 * @returns pocet radianu odpovidajici velikosti uhlu
 */
function angToRad(ang: number): number {
  return (ang / 360) * (2 * Math.PI);
}

/**
 * Prevede radiany na uhly
 * @param rad radiany, ktere je treba prevest
 * @returns velikost uhlu
 */
function radToAng(rad: number): number {
  return (rad / (2 * Math.PI)) * 360;
}

/**
 * pomoci alfy pocita odkud vychazi paprsek v prostredi n1
 * @param value velikost uhlu alfa
 * @returns souradnice bodu odkud vychazi paprsek v prostredi n1
 */
function alpha(value: number): [number, number] {
  if (value === 0) {
    return [canvas.width / 2, 0];
  }

  const nx: number = (canvas.height / 2) * Math.tan(angToRad(value));
  if (!(nx > canvas.width / 2)) {
    return [canvas.width / 2 - nx, 0];
  }

  const ny: number = (canvas.width / 2) * Math.tan(angToRad(90 - value));
  return [0, canvas.height / 2 - ny];
}

/**
 * Urceni indexu lomu daneho prostredi
 * @param select select element prostredi
 * @returns hodnotu n pro dane prostredi
 */
function readingRefIndex(select: HTMLSelectElement): number {
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

/**
 * Na zaklade Snellova zakona pocita pod jakym uhlem vchazi paprsek do prostredi n2
 * @returns Souradnice bodu do jakeho smeruje paprsek v prostredi n2, pokud dochazi k totalni reflexi, vraci undefined
 */
function beta(): [number, number] | undefined {
  const sinAlpha: number = Math.sin(angToRad(alphaInput.valueAsNumber));
  const ratio: number = readingRefIndex(indexn1) / readingRefIndex(indexn2);

  if (sinAlpha * ratio > 1) {
    return undefined;
  }

  const rad: number = Math.asin(sinAlpha * ratio);
  const angle: number = radToAng(rad);
  const betaDeg: number = Math.round(angle * 100) / 100;
  betaOutput.value = "Beta je " + betaDeg + "°";

  const nx: number = canvas.width / 2 + (canvas.height / 2) * Math.tan(rad);
  if (nx <= canvas.width) {
    return [nx, canvas.height];
  }

  const ny: number = canvas.height / 2 + (canvas.width / 2) * Math.tan(Math.PI / 2 - rad);
  return [canvas.width, ny];
}

alphaInput.addEventListener("input", () => {
  alphaOutput.value = alphaInput.value + "°";
  draw(alpha(alphaInput.valueAsNumber), beta());
});

canvas.width = width;
canvas.height = height;

draw([300, 0], [canvas.height, 900]);
