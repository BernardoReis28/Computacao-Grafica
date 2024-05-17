var canvas = document.createElement('canvas');
canvas.width= window.innerWidth -15;
canvas.height = window.innerHeight -100;
var GL = canvas.getContext('webgl');
var vertexShader = GL.createShader(GL.VERTEX_SHADER);
var fragmentShader = GL.createShader(GL.FRAGMENT_SHADER);
var program = GL.createProgram();
var gpuArrayBuffer = GL.createBuffer();

//Variável que guarda a localização da variável transformationMatrix do
//vertexShader.

var finalMatrixLocation;

//Variável que guarda a rotação que deve ser aplicada ao objeto
var anguloDeRotacao = 0;

function SendDataToShaders(){
    
    var vertexPositionAttributeLocation = GL.getAttribLocation(program,"vertexPosition");
    var vertexColorAttributeLocation = GL.getAttribLocation(program,"vertexColor");

    GL.vertexAttribPointer(
        vertexPositionAttributeLocation,
        3,
        GL.FLOAT,
        false,
        6 * Float32Array.BYTES_PER_ELEMENT,
        0* Float32Array.BYTES_PER_ELEMENT
    );

    GL.vertexAttribPointer(
        vertexColorAttributeLocation,
        3,
        GL.FLOAT,
        false,
        6 * Float32Array.BYTES_PER_ELEMENT,
        3* Float32Array.BYTES_PER_ELEMENT
    );

    GL.enableVertexAttribArray(vertexPositionAttributeLocation);
    GL.enableVertexAttribArray(vertexColorAttributeLocation);

    //Guarda a localização da variável 'transformationMatrix' do vertexShader
    finalMatrixLocation = GL.getUniformLocation(program,'transformationMatrix');

    // Foi removido o código GL.useProgram e GL.drawArrays
}

function PrepareTriangleData(){
    
    var triangleArray= [
                                                         3
            -0.5,   -0.5,   0.0,    1.0,    0.0,    0.0,
             0.5,   -0.5,   0.0,    0.0,    1.0,    0.0,
             0.0,    0.5,   0.0,    0.0,    0.0,    1.0, 
    ];
    
    GL.bindBuffer(GL.ARRAY_BUFFER,gpuArrayBuffer);
   
    GL.bufferData(
        GL.ARRAY_BUFFER,
        new Float32Array(triangleArray),
        GL.STATIC_DRAW
    );
}

function PrepareProgram(){
   
    GL.attachShader(program,vertexShader);
    GL.attachShader(program, fragmentShader);

    GL.linkProgram(program);
    if(!GL.getProgramParameter(program,GL.LINK_STATUS)){
        console.error("ERRO:: O linkProgram lançou uma exceção!", GL.getProgramInfoLog(program));    
    }

    GL.validateProgram(program);
    if(!GL.getProgramParameter(program,GL.VALIDATE_STATUS)){
        console.error("ERRO:: A validação do programa lançou uma exceção!", GL.getProgramInfoLog(program));    
    }

    GL.useProgram(program);
}

function PrepareCanvas(){

    console.log("PrepareCanvas");
    GL.clearColor(0.65,0.65,0.65,1.0);

    GL.clear(GL.DEPTH_BUFFER_BIT| GL.COLOR_BUFFER_BIT);

    document.body.appendChild(canvas);

    canvas.insertAdjacentText('afterend','O canvas encontra-se acima deste texto!');   
}

function PrepareShaders()
{

    GL.shaderSource(vertexShader, codigoVertexShader);

    GL.shaderSource(fragmentShader, codigoFragmentShader);

    GL.compileShader(vertexShader); 
    GL.compileShader(fragmentShader); 

    if(!GL.getShaderParameter(vertexShader, GL.COMPILE_STATUS)){
        console.error("ERRO:: A compilação do vertex shader lançou uma exceção!",
        GL.getShaderInfoLog(vertexShader));
    }

    if(!GL.getShaderParameter(fragmentShader, GL.COMPILE_STATUS)){
        console.error("ERRO:: A compilação do fragment shader lançou uma exceção!",
        GL.getShaderInfoLog(fragmentShader));
    }

}

function loop(){

    //O código abaixo faz resize ao canvas de modo a ajustar-se ao tamanho
    //da página web.
    canvas.width = window.innerWidth -15;
    canvas.height = window.innerHeight -100;
    GL.viewport(0,0,canvas.width,canvas.height);

    //É necessário dizer que program vamos utilizar.
    GL.useProgram(program);

    //a cada frame é necessário limpar os buffers de profundidade e de cor
    GL.clearColor(0,65,0.65,0.65,1.0);
    GL.clear(GL.DEPTH_BUFFER_BIT|GL.COLOR_BUFFER_BIT);

    //Inicialização da variável que aguarda a combinação de mtrizes que
    // vão ser apssadas para o vertexShader.
    var finalMatrix = [
        [1,0,0,0],
        [0,1,0,0],
        [0,0,1,0],
        [0,0,0,1],
    ];

    // A matriz final vai ser igual a multiplicacao da matriz de escala com a matriz final. 
    // Esta matriz faz uma modificacao na escala de 0.25 unidades no eixo do X, 0.25 unidades 
    // no eixo do Y e 0.25 unidades no eixo do Z. Quer isto dizer que o objeto ira ficar 
    // 4 vezes mais pequeno, sendo que para um objeto ter uma escala normal 
    // devera ter 1 unidade em todos os eixos. 
    //finalMatrix = math.multiply(CriarMatrizEscala(0.25,0.25,0.25),finalMatrix);

    // A matriz final vai ser igual a multiplicacao da matriz de rotacao no eixo do Z 
    // com a matriz final. Esta matriz faz uma rotacao anguloDeRotacao unidades 
    // no eixo do Y. 
    //finalMatrix = math.multiply(CriarMatrizRotacaoY(anguloDeRotacao),finalMatrix);

    // A matriz final vai ser igual a multiplicacao da matriz de translacao com a matriz final. 
    // Esta matriz faz uma translacao de 0.5 unidades no eixo do X, 0.5 unidades 
    // no eixo do Y e 0.0 unidades no eixo do Z.
    //finalMatrix = math.multiply(CriarMatrizTranslacao(0.5,0.5,0), finalMatrix);

    //////////////////////////////////////////////////////////////////////////////
    //Desafio
    
    // Aplica uma operação de escala, fazendo que o triângulo fique com 75% do 
    //tamanho do triângulo original.
    finalMatrix = math.multiply(CriarMatrizEscala(0.25*0.75,0.25*0.75,0.25*0.75),finalMatrix);

    //Faz com que o triângulo rode em dois eixos sem que saia do canvas.
    finalMatrix = math.multiply(CriarMatrizRotacaoY(anguloDeRotacao),finalMatrix);
    finalMatrix = math.multiply(CriarMatrizRotacaoX(anguloDeRotacao),finalMatrix);

    //Aplica uma translação ao triângulo de forma que ele fique a rodar posicionado do 
    //lado inferior esquerdo e sem sair do canvas
    finalMatrix = math.multiply(CriarMatrizTranslacao(-0.5,-0.5,0), finalMatrix);
    
    ////////////////////////////////////////////////////////////////////////////////
    // Agora que ja temos a matriz final de transformacao, temos que converter de 2D array 
    // para um array de uma dimensao. Para isso utilizamos o codigo a baixo.
    var newarray = [];
    for(i=0; i< finalMatrix.length;i++){
        newarray = newarray.concat(finalMatrix[i]);
    }

    // Depois de termos os array de uma dimensao temos que enviar essa matriz para 
    // o vertexShader. Para isso utilizamos o codigo abaixo. GL.uniformMatrix4fv(finalMatrixLocation,false ,newarray);
    GL.uniformMatrix4fv(finalMatrixLocation,false,newarray);

    //Agora temos que mandar desenhar os triangulos
    GL.drawArrays(
        GL.TRIANGLES,
        0,
        3
    );

    //A cada frame é preciso atualizar o angulo de rotação.
    anguloDeRotacao +=1;

    // O codigo abaixo indica que no proximo frame tem que chamar 
    // a funcao passada por parametro. No nosso caso é a mesma funcao 
    // criando um loop de animacao. 
    requestAnimationFrame(loop);

}

function Start(){
    PrepareCanvas();
    PrepareShaders();
    PrepareProgram();
    PrepareTriangleData();
    SendDataToShaders();

    //Quando acabar de preparar tudo chama a função de loop.
    //Ao chamar o loop vai criar um loop de animação
    loop();
}

