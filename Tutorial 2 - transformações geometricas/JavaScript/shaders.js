var codigoVertexShader = [
    'precision mediump float;' 
    ,
    'attribute vec3 vertexPosition;',
    'attribute vec3 vertexColor;',
    ,
    'varying vec3 fragColor;',
    ,
    // Matrix de 4x4 que indica quais as transformacoes que devem ser
    //feitas a cada um dos vertices. 
    'uniform mat4 transformationMatrix;',
    ,
    'void main(){',

    '   fragColor=vertexColor;',
    '   gl_Position = vec4(vertexPosition,1.0)* transformationMatrix;',
    '}' 
].join('\n');

var codigoFragmentShader = [
    'precision mediump float;'
    ,
    'varying vec3 fragColor;',
    ,
    'void main(){',
    'gl_FragColor = vec4(fragColor,1.0);',
    '}'
].join('\n');