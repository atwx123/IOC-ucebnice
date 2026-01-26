const canvas: HTMLCanvasElement = document.getElementById(
  "zrcadlaInt",
) as HTMLCanvasElement;
const ctx: CanvasRenderingContext2D = canvas.getContext(
  "2d",
) as CanvasRenderingContext2D;
const width: number = 1000;
const height: number = 600;
const center = width / 2;
const rz: number = 400;
const ohnisko: number = width / 2 + rz / 2;
const pOhnisko: number = rz / 2;
const heightIcon: number = 200;

function verBeam(y: number, xk?: number, color?: string) {
  ctx.save();
  if (color != undefined) {
    ctx.strokeStyle = color;
  }
  ctx.beginPath();
  ctx.moveTo(0 - center, y);
  if (xk != undefined) {
    ctx.lineTo(xk, y);
    ctx.stroke();
    ctx.setLineDash([5, 5, 10, 5]);
    ctx.beginPath();
    ctx.moveTo(xk, y);
  }
  ctx.lineTo(width, y);
  ctx.stroke();
  ctx.restore();
}

function arcInterVert(): number {
  return Math.sqrt(Math.pow(rz, 2) - Math.pow(heightIcon, 2));
}

function arcInterCenter(): [number, number] {
  let alpha: number = Math.asin(heightIcon / Math.abs(center));
  return [rz * Math.cos(alpha), rz * Math.sin(alpha)];
}

function linesInter(): number {
  let y: number = arcInterCenter()[1];
  return y / Math.tan(Math.asin(heightIcon / rz));
}

function interEdge(): [number, number] {
  let y: number = Math.tan(Math.asin(heightIcon / rz) * -center);
  return [-center, y];
}

canvas.width = width;
canvas.height = height;

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

verBeam(height / 2 - heightIcon, arcInterVert(), "red");
