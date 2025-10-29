const angleText = document.getElementById('angleText');
const angleButton = document.getElementById('angleSend');

angleButton.addEventListener('click', function(event) {
    const angleInput = angleText.value;
    angleText.value = '';
    var angleNumber = Number(angleInput);
    var matrixAnglePosition;
    if (!isNaN(angleNumber) && angleNumber >= 0 && angleNumber <= 180) {
        matrixAnglePosition = angleNumber * (1/90);
    } else {
        alert("Zadejte prosím platnou hodnotu úhlu od 0 do 180 stupňů.");
        return;
    }
});

var vertexBackgroundShaderText = [
    'precision mediump float;',
    '',
    'attribute vec2 vertPosition;',
    'varying vec2 v_fragPosition;',
    '',
    'void main()',
    '{',
    '   gl_Position = vec4(vertPosition, 0.0, 1.0);',
    '   v_fragPosition = vertPosition;',
    '}'
].join('\n');
var fragmentBackgroundShaderText = [
    'precision mediump float;',
    '',
    'varying vec2 v_fragPosition;',
    '',
    'void main()',
    '{',
    '   if (v_fragPosition.y < 0.0) {',
    '       gl_FragColor = vec4(0.84, 0.96, 0.78, 1.0);',
    '   }',
    '   else {',
    '       gl_FragColor = vec4(0.78, 0.82, 0.96, 1.0);',
    '   }',
    '}'
].join('\n');
var vertexLinesShaderText = [
    'precision mediump float;',
    '',
    'attribute vec2 vertPosition;',
    'attribute vec3 vertColor;',
    'varying vec3 fragColor;',
    '',
    'void main()',
    '{',
    '   fragColor = vertColor;',
    '   gl_Position = vec4(vertPosition, 0.0, 1.0);',
    '}'
].join('\n');
var fragmentLinesShaderText = [
    'precision mediump float;',
    '',
    'varying vec3 fragColor;',
    '',
    'void main()',
    '{',
    '   gl_FragColor = vec4(fragColor, 1.0);',
    '}'
].join('\n');
var main = function () {
    var canvas = document.getElementById("lomSvetlaInt");
    var gl = canvas.getContext("webgl");

    if (!gl) {
        console.error("WebGL not supported!");
        return;
    }
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    var vertexBackgroundShader = gl.createShader(gl.VERTEX_SHADER);
    var fragmentBackgroundShader = gl.createShader(gl.FRAGMENT_SHADER);

    gl.shaderSource(vertexBackgroundShader, vertexBackgroundShaderText);
    gl.shaderSource(fragmentBackgroundShader, fragmentBackgroundShaderText);

    gl.compileShader(vertexBackgroundShader);
    if (!gl.getShaderParameter(vertexBackgroundShader, gl.COMPILE_STATUS)) {
        console.error('ERROR compiling vertex shader!', gl.getShaderInfoLog(vertexBackgroundShader));
        return;
    }

    gl.compileShader(fragmentBackgroundShader);
    if (!gl.getShaderParameter(fragmentBackgroundShader, gl.COMPILE_STATUS)) {
        console.error('ERROR compiling fragment shader!', gl.getShaderInfoLog(fragmentBackgroundShader));
        return;
    }

    var programBackground = gl.createProgram();
    gl.attachShader(programBackground, vertexBackgroundShader);
    gl.attachShader(programBackground, fragmentBackgroundShader);
    gl.linkProgram(programBackground);

    if (!gl.getProgramParameter(programBackground, gl.LINK_STATUS)) {
        console.error('ERROR linking program!', gl.getProgramInfoLog(programBackground));
        return;
    }
    gl.validateProgram(programBackground);
    if (!gl.getProgramParameter(programBackground, gl.VALIDATE_STATUS)) {
        console.error('ERROR validating program!', gl.getProgramInfoLog(programBackground));
        return;
    }

    var rectangleBackgroundVerticies = [
        //X,Y 
        -1.0, -1.0,
        1.0, -1.0,
        1.0, 1.0,

        -1.0, -1.0,
        1.0, 1.0,
        -1.0, 1.0
    ];

    var rectangleBackgroundVertexBufferObject = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, rectangleBackgroundVertexBufferObject);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(rectangleBackgroundVerticies), gl.STATIC_DRAW);

    var positionBackgroundAttribLocation = gl.getAttribLocation(programBackground, 'vertPosition');

    gl.vertexAttribPointer(
        positionBackgroundAttribLocation,
        2,
        gl.FLOAT,
        gl.FALSE,
        2 * Float32Array.BYTES_PER_ELEMENT,
        0
    );

    gl.enableVertexAttribArray(positionBackgroundAttribLocation);

    gl.useProgram(programBackground);
    gl.drawArrays(gl.TRIANGLES, 0, 6);

    var vertexLinesShader = gl.createShader(gl.VERTEX_SHADER);
    var fragmentLinesShader = gl.createShader(gl.FRAGMENT_SHADER);

    gl.shaderSource(vertexLinesShader, vertexLinesShaderText);
    gl.shaderSource(fragmentLinesShader, fragmentLinesShaderText);

    gl.compileShader(vertexLinesShader);
    if (!gl.getShaderParameter(vertexLinesShader, gl.COMPILE_STATUS)) {
        console.error('ERROR compiling vertex shader!', gl.getShaderInfoLog(vertexLinesShader));
        return;
    }

    gl.compileShader(fragmentLinesShader);
    if (!gl.getShaderParameter(fragmentLinesShader, gl.COMPILE_STATUS)) {
        console.error('ERROR compiling fragment shader!', gl.getShaderInfoLog(fragmentLinesShader));
        return;
    }

    var programLines = gl.createProgram();
    gl.attachShader(programLines, vertexLinesShader);
    gl.attachShader(programLines, fragmentLinesShader);
    gl.linkProgram(programLines);

    if (!gl.getProgramParameter(programLines, gl.LINK_STATUS)) {
        console.error('ERROR linking program!', gl.getProgramInfoLog(programLines));
        return;
    }
    gl.validateProgram(programLines);
    if (!gl.getProgramParameter(programLines, gl.VALIDATE_STATUS)) {
        console.error('ERROR validating program!', gl.getProgramInfoLog(programLines));
        return;
    }

    var linesVerticies = [
        //X,Y         R, G, B
        -0.5, 1.0,   1.0, 0.0, 0.0,
         0.0, 0.0,   1.0, 0.0, 0.0,

        0.0, 0.0,    0.0, 0.0, 1.0,
        0.8, -1.0,  0.0, 0.0, 1.0,
    ];
    var linesVertexBufferObject = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, linesVertexBufferObject);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(linesVerticies), gl.STATIC_DRAW);

    var positionLinesAttribLocation = gl.getAttribLocation(programLines, 'vertPosition');
    var colorLinesAttribLocation = gl.getAttribLocation(programLines, 'vertColor');

    gl.vertexAttribPointer(
        positionLinesAttribLocation,
        2,
        gl.FLOAT,
        gl.FALSE,
        5 * Float32Array.BYTES_PER_ELEMENT,
        0
    );
    
    gl.vertexAttribPointer(
        colorLinesAttribLocation,
        3,
        gl.FLOAT,
        gl.FALSE,
        5 * Float32Array.BYTES_PER_ELEMENT,
        2 * Float32Array.BYTES_PER_ELEMENT
    );
    gl.enableVertexAttribArray(positionLinesAttribLocation);
    gl.enableVertexAttribArray(colorLinesAttribLocation);

    gl.useProgram(programLines);
    gl.drawArrays(gl.LINES, 0, 4);
}

main();