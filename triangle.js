"use strict";

var gl;
var points;

window.onload = function init()
{

    var _rotateVertice = function(x, y, angleRad){
        var dTheta = Math.sqrt(Math.pow(x,2) + Math.pow(y,2));
        var cosTheta = Math.cos(angleRad*dTheta);
        var sinTheta = Math.sin(angleRad*dTheta);
        var x1 = x*cosTheta - y*sinTheta;
        var y1 = x*sinTheta + y*cosTheta;

        return [x1, y1];
    };

    var _divideTriangle = function(a, b, c, times){
        // push the vertices to result array
        if(times === 0){
            resultVertices.push(a, b, c);
        } else{
            // get coords of dividing vertices
            var ab = mix(a, b, 0.5);
            var bc = mix(b, c, 0.5);
            var ac = mix(a, c, 0.5);
            // recursively subdivide triangles
            _divideTriangle(a, ab, ac, times-1);
            _divideTriangle(b, ab, bc, times-1);
            _divideTriangle(c, ac, bc, times-1);
            _divideTriangle(ab, bc, ac, times-1);
        }
    };

    var resultVertices = [];

    _divideTriangle([-0.5, -0.5], [0, 0.5], [0.5, -0.5], 4);

    var canvas = document.getElementById( "gl-canvas" );

    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }


    var tmpVertice, rotatedVertices = [];
    resultVertices.forEach(function(vertice){
        tmpVertice = _rotateVertice(vertice[0], vertice[1], 1);
        rotatedVertices.push(tmpVertice[0]);
        rotatedVertices.push(tmpVertice[1]);
    });

    var rotatedVerticesF32 = new Float32Array(rotatedVertices);
    //  Configure WebGL

    gl.viewport( 0, 0, canvas.width-100, canvas.height );
    gl.clearColor( 0.9, 0.9, 0.9, 0.688 );

    //  Load shaders and initialize attribute buffers
    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );

    // Load the data into the GPU

    var bufferId = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, bufferId );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(rotatedVerticesF32), gl.STATIC_DRAW );

    // Associate out shader variables with our data buffer

    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );

    gl.clear( gl.COLOR_BUFFER_BIT );

    render(flatten(rotatedVerticesF32).length/2);

};


function render(number) {
    gl.clear( gl.COLOR_BUFFER_BIT );
    gl.drawArrays( gl.TRIANGLES, 0, number);
}
