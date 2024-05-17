var canvas = document.createElement('canvas');
canvas.width= window.innerWidth -15;
canvas.height = window.innerHeight -100;
var GL = canvas.getContext('webgl');
var vertexShader = GL.createShader(GL.VERTEX_SHADER);
var fragmentShader = GL.createShader(GL.FRAGMENT_SHADER);
var program = GL.createProgram();
var gpuArrayBuffer = GL.createBuffer();
var finalMatrixLocation;
var anguloDeRotacao = 0;

// Localização da variável 'visualizationMatrix'
var visualizationMatrixLocation;

// Localização da variável 'projectionMatrix'
var projectionMatrixLocation;

// Localização da variável 'viewportMatrix'
var viewportMatrixLocation;

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

    finalMatrixLocation = GL.getUniformLocation(program,'transformationMatrix');

    finalMatrixLocation = GL.getUniformLocation (program, 'transformationMatrix');

    //vai buscar qual a localização da variável visualizationMatrix' ao vertexShader
    visualizationMatrixLocation = GL.getUniformLocation (program, 'visualizationMatrix');

    //vai buscar qual o localização da variável 'projectionMatrix' ao vertexShader
    projectionMatrixLocation = GL.getUniformLocation (program, 'projectionMatrix');

    // Vai buscar qual o localização da variável 'viewportMatrix' ao vertexshader
    viewportMatrixLocation = GL.getUniformLocation (program, 'viewportMatrix');
}

function PrepareTriangleData(){
    
    var triangleArray= [

            -0.5,   -0.5,   0.0,    1.0,    0.0,    0.0,
             0.5,   -0.5,   0.0,    0.0,    1.0,    0.0,
             0.0,    0.5,   0.0,    0.0,    0.0,    1.0
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

    //console.log("PrepareCanvas");
    
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

    canvas.width = window.innerWidth -15;
    canvas.height = window.innerHeight -100;
    GL.viewport(0,0,canvas.width,canvas.height);

    GL.useProgram(program);

    GL.clearColor(0.65,0.65,0.65,1.0);
    GL.clear(GL.DEPTH_BUFFER_BIT|GL.COLOR_BUFFER_BIT);

    var finalMatrix = [
        [1,0,0,0],
        [0,1,0,0],
        [0,0,1,0],
        [0,0,0,1],
    ];

    //Comentamos esta linha para o triângulo voltar ao tamanho normal
    //finalMatrix = math.multiply (CriarMatrizEscala (0.25, 0.25, 0.25), finalMatrix);

    // Mantemos esta linha de código para perceber melhor a rotação em perspetiva
    finalMatrix = math.multiply (CriarMatrizRotacaoY(anguloDeRotacao), finalMatrix);

    // Comentamos esta linha para o triângulo "voltar" para o centro
    //finalMatrix = math.multiply (CriarMatrizTranslacao (0.5, 0.5, 0), finalMatrix);
    
    //Criamos uma translação no eixo do Z para que o triângulo fique dentro do volume de visualização
    finalMatrix = math.multiply (CriarMatrizTranslacao (0,0,5), finalMatrix);

    var newarray = [];
    for(i=0; i< finalMatrix.length; i++)
    {
        newarray = newarray.concat(finalMatrix[i]);
    }

    var visualizationMatrix = MatrizDeVisualizacao( [1,0,0], [0,1,0], [0,0,1],[0,0,0]);
    var newVisualizationMatrix = [];
    for (i = 0; i < visualizationMatrix.length; i++) 
    {
        newVisualizationMatrix = newVisualizationMatrix.concat(visualizationMatrix[i]);
    }

    //Linha responsável pela criação da câmara em perspetiva com os parametros de distância=1,
    // comprimento da camera de 4 unidades, altura de 3 unidades, plano anterior de 0.1 unidades e
    // plano posterior de 100 unidades.
    var projectionMatrix = MatrizPerspetiva (1, 4, 3, 0.1,100);

    //Linha responsável pela criação da câmara ortográfica com os parametros de comprimento=4,
    //altura=3, plano anterior de 0.1 unidade e plano posterior de 100 unidades
    //var projectionMatrix = MatrizOrtografica (4,3,0.1, 100);

    //NOTA: Uma das linhas de criação tem que estar comentada para não haver conflito. Caso se queira mudar de câmara,
    // basta descomentar uma câmara e comentar a outra. Tal como está, a camara em perspetiva é a câmara ativa.

    var newprojectionMatrix = [];
    for (i = 0; i < projectionMatrix.length; i++) {
        newprojectionMatrix = newprojectionMatrix.concat(projectionMatrix[i]);
    }

    // Utilizando a função MatrizViewport vamos passar os parametros do volume canónico do webGl.
    // O volume canónico do webGL tem o valor de x, y e z compreendidos entre -1 e 1.
    var viewportMatrix = MatrizViewport (-1,1,-1,1);    
    var newViewportMatrix = [];
    for (i = 0; i < viewportMatrix.length; i++) {
        newViewportMatrix = newViewportMatrix.concat(viewportMatrix[i]);
    }

    // Depois de termos os array de uma dimensão temos que enviar essa matriz para
    // o vertexShader. Para isso utilizamos o código abaixo.
    GL.uniformMatrix4fv(finalMatrixLocation,false,newarray);

    GL.uniformMatrix4fv(visualizationMatrixLocation, false,newVisualizationMatrix);
    GL.uniformMatrix4fv(projectionMatrixLocation, false,newprojectionMatrix);
    GL.uniformMatrix4fv (viewportMatrixLocation, false,newViewportMatrix);

    GL.drawArrays(
        GL.TRIANGLES,
        0,
        3
    );

    anguloDeRotacao +=1;

    requestAnimationFrame(loop);

}

function Start(){
    PrepareCanvas();
    PrepareShaders();
    PrepareProgram();
    PrepareTriangleData();
    SendDataToShaders();
    loop();

}

