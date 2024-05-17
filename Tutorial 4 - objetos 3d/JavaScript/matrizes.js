/**
* @param {float} x Valor para translacao no eixo do X 
* @param {float} y valor para translacao no eixo do Y 
* @param {float} z Valor para translacao no eixo do Z 
* Devolve um 2D array com a matriz de translacao pedida
*/ 

function CriarMatrizTranslacao(x,y,z) 
{ 
// Matriz de translacao final 
return[ 
[1, 0, 0, x], 
[0, 1, 0, y], 
[0, 0, 1, z], 
[0, 0, 0, 1] 
]; 
} 

/**
* @param {float} x Valor para translacao no eixo do X 
* @param {float} y valor para translacao no eixo do Y 
* @param {float} z Valor para translacao no eixo do Z 
* Devolve um 2D array com a matriz de translacao pedida
*/ 
function CriarMatrizEscala(x,y,z) 
{ 
// Matriz de escala final 
return[ 
[x, 0, 0, 0], 
[0, y, 0, 0], 
[0, 0, z, 0], 
[0, 0, 0, 1] 
]; 
} 

/**
* @param {float} angulo Angulo em graus para rodar no eixo do x 
*/ 
function CriarMatrizRotacaoX(angulo) 
{ 
// Seno e cosseno sao calculados em radianos, logo é necessario converter de graus 
// para radianos utilizando a linha a baixo.
 var radianos = angulo * Math.PI/180; 

// Matriz final de Rotacao no eixo do X
return [ 
[1,     0,                      0,                      0], 
[0,     Math.cos(radianos),     -Math.sin(radianos),    0], 
[0,     Math.sin(radianos),     Math.cos(radianos),     0], 
[0,     0,                      0,                      1] 
];
}

/** 
* @param {float} angulo Angulo em graus para rodar no eixo do Y 
*/ 
function CriarMatrizRotacaoY(angulo) 
{ 
//Seno e cosseno sao calculados em radianos, logo é necessario converter de graus
// para radianos utilizando a linha a baixo. 
var radianos = angulo * Math.PI/180; 

// Matriz final de rotacao no eixo do Y 
return [
[Math.cos(radianos),    0,      Math.sin(radianos),     0], 
[0,                     1,      0,                      0], 
[-Math.sin(radianos),   0,      Math.cos(radianos),     0], 
[0,                     0,      0,                      1] 
];
} 

/**
* @param {float} angulo Angulo em graus para rodar no eixo do Z 
*/ 
function CriarMatrizRotacaoZ(angulo) 
{ 
//Seno e cosseno sao calculados em radianos, logo é necessario converter de graus 
// para radianos utilizando a linha a baixo.
var radianos = angulo * Math.PI/180;
 
// Matriz final de rotacao no eixo do Z 
return[ 
[Math.cos(radianos),    -Math.sin(radianos),    0,      0], 
[Math.sin(radianos),    Math.cos(radianos),     0,      0], 
[0,                     0,                      1,      0],
[0,                     0,                      0,      1]
]; 
} 