"use strict";
exports.__esModule = true;
require("./style.css");
var canvas;
var ctx;
var width = window.innerWidth;
var height = window.innerHeight;
canvas = document.getElementById('lomSvetlaInt');
ctx = canvas.getContext('2d');
canvas.width = width;
canvas.height = height;
draw();
console.log(canvas.getContext('2d'));
function draw() {
    ctx.fillStyle = 'lightblue';
    ctx.fillRect(0, 0, width, height / 2);
    ctx.fillStyle = 'lightgreen';
    ctx.fillRect(0, height / 2, width, height / 2);
}
;
