//código correspondente ao vertex shader
var codigoVertexShader = [
    'precision mediump float;' //indica qual a precisão do tipo float
    ,
    //Variável read-only do tipo vec3 que indicará a posiçao de um vértice
    'attribute vec3 vertexPosition;',
    //Variável read-only do tipo vec3 que indicará a cor de um vértice
    'attribute vec3 vertexColor;',
    ,
    //Variável que serve de inetrface entre o vertex shader e o fragment shader
    'varying vec3 fragColor;',
    ,

    'void main(){',
    //Dizemos ao fragment shader qual a cor do vértice.
    '   fragColor=vertexColor;',
    //gl_Position é uma variável própria do Shader que indica a posição do vértice
    //Esta variável é do tipo vec4 e a variável vertexPosition é do tipo verc3
    //Por esta razão temoss que colocar 1.0 como último elemento.
    '   gl_Position = vec4(vertexPosition,1.0);',
    '}' 
].join('\n');

//código correspondente ao fragment shader
var codigoFragmentShader = [
    'precision mediump float;'//indica quala  precisão do tipo float
    ,
    //Variável que serve de inetrface entre o vertex shader e o fragment shader
    'varying vec3 fragColor;',
    ,
    'void main(){',
    //gl_Position é uma variável própria do Shader que indica a posição do vértice
    //Esta variável é do tipo vec4 e a variável vertexPosition é do tipo verc3
    //Por esta razão temoss que colocar 1.0 como último elemento.
    'gl_FragColor = vec4(fragColor,1.0);',
    '}'
].join('\n');