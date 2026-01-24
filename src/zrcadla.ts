let canvas: HTMLCanvasElement = document.getElementById(
  "zrcadlaInt",
) as HTMLCanvasElement;
const width: number = 1000;
const height: number = 600;
const rz: number = 400;
const ohnisko = width / 2 + rz / 2;
const pOhnisko = rz / 2;

canvas.width = width;
canvas.height = height;

let ctx: CanvasRenderingContext2D = canvas.getContext(
  "2d",
) as CanvasRenderingContext2D;

ctx.setLineDash([5, 10, 10, 15]);
ctx.beginPath();
ctx.moveTo(0, height / 2);
ctx.lineTo(width, height / 2);
ctx.stroke();
ctx.setLineDash([]);

ctx.transform(1, 0, 0, 1, width / 2, 0);

ctx.beginPath();
ctx.arc(0, height / 2, rz, Math.PI / 2, (Math.PI * 2) / 1.5, true);
ctx.stroke();

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
