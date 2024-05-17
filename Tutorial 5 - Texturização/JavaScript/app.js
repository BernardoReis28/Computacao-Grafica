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

// variavel que irá guardar a posição dos vértices
var vertexPosition;

//variável que irá guardar o conjunto de vértices que constituem cada triângulo
var vertexIndex;

//Buffer que irá guardar todos o conjunto de vértices na GPU
var gpuIndexBuffer = GL.createBuffer();

// Variável que guarda na memória da GPU a Textura que será utilizada.
var boxTexture = GL.createTexture();

function SendDataToShaders(){
    
    var vertexPositionAttributeLocation = GL.getAttribLocation(program,"vertexPosition");
    
    //Agora em vez de irmos buscar a localização da variável "vertexColor" vamos buscar
    //a localização da variável. "texCoords"
    var texCoordAttributeLocation = GL.getAttribLocation(program, 'texCoords');
    
    GL.vertexAttribPointer (
        vertexPositionAttributeLocation,
        3,
        GL.FLOAT,
        false,
        //Agora o conjunto apenas tem 5 valores.
        5 * Float32Array.BYTES_PER_ELEMENT,
        0 * Float32Array.BYTES_PER_ELEMENT
    );
    
    GL.vertexAttribPointer (
        // Mudar a variável de vertexColorAttributeLocation-
        // para texCoordAttributeLocation
        texCoordAttributeLocation,
        // Agora só enviámos um conjunto de 2 valores para a variável
        // texCoords
        2,
        GL.FLOAT,
        false,
        // Agora o conjunto apenas tem 5 valores.
        5 * Float32Array.BYTES_PER_ELEMENT,
        3 * Float32Array.BYTES_PER_ELEMENT
    );
    
    GL.enableVertexAttribArray(vertexPositionAttributeLocation);
    // Substituímos "vertexColorAttributeLocation" por "texCoordAttributeLocation"
    GL.enableVertexAttribArray(texCoordAttributeLocation);
    
    finalMatrixLocation = GL.getUniformLocation(program, 'transformationMatrix');
    visualizationMatrixLocation = GL.getUniformLocation(program, 'visualizationMatrix');
    projectionMatrixLocation = GL.getUniformLocation(program, 'projectionMatrix');
    viewportMatrixLocation = GL.getUniformLocation(program, 'viewportMatrix');
}

function PrepareTriangleData(){
    
    vertexPosition= [
    //Em vez de termos 3 valores para as cores RGB vamos ter apenas
    //2 valores, que são as coordenadas UV

    //  X,      Y,      Z,      U,      V
    //  Frente
        0,      0,      0,      0,      0,      
        0,      1,      0,      0,      0.5,      
        1,      1,      0,      0.5,    0.5,      
        1,      0,      0,      0.5,    0,      

    //  Direita
        1,      0,      0,      0.5,    0,      
        1,      1,      0,      0.5,    0.5,      
        1,      1,      1,      1,      0.5,      
        1,      0,      1,      1,      0,       
   
   
    //  Trás
        1,      0,      1,      1,      0.5,      
        1,      1,      1,      1,      1,      
        0,      1,      1,      0.5,    1,      
        0,      0,      1,      0.5,    0.5,      


    //  Esquerda
        0,      0,      1,      0,      0.5,      
        0,      1,      1,      0,      1,      
        0,      1,      0,      0.5,    1,      
        0,      0,      0,      0.5,    0.5,      


    //  Cima
        0,      1,      0,      0,      0,      
        0,      1,      1,      0,      1,      
        1,      1,      1,      1,      1,      
        1,      1,      0,      1,      0,      


    //  Baixo
        1,      0,      0,      0,      0,      
        1,      0,      1,      0,      1,      
        0,      0,      1,      0,      1,      
        0,      0,      0,      0,      0,      

    ];

    //Array que guarda qual os indices do array anterior que constituem cada triângulo.
    //De relembrar que cada lado do cubo é constituído por dois triângulos, por exemplo:
    //a primeira linha é "0,1,2" isto significa que um dos triângulo da face da frrente é
    //formado pela 1ª, 2ª e 3ª linha (de relembrar que o indice do primeiro elemento
    // num array é "0").
    vertexIndex=[
        // Frente
        0, 2, 1,
        0, 3, 2,

        // Direita
        4, 6, 5,
        4, 7, 6,

        // Trás
        8, 10, 9,
        8, 11, 10,

        // Esquerda
        12, 14, 13,
        12, 15, 14,

        // Cima
        16, 18, 17,
        16, 19, 18,

        // Baixo
        20, 22, 21,
        20, 23, 22
    ];

    GL.bindBuffer(GL.ARRAY_BUFFER, gpuArrayBuffer);
   
    GL.bufferData(
        GL.ARRAY_BUFFER,
        new Float32Array(vertexPosition), // Não esquecer que agora é uma nova variável
        GL.STATIC_DRAW
    );

    //Voltamos a fazer bind ao novo buffer que acabamos de criar dizendo que buffer agora
    // e de ELEMENT_ARRAY_BUFFER.
    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, gpuIndexBuffer);

    //Passamos os dados relativos ao indices de cada triângulo
    GL.bufferData(
        GL.ELEMENT_ARRAY_BUFFER, // Inidica que os dados são do tipo ELEMENT_ARRAY_BUFFER
        new Uint16Array(vertexIndex), // Agora os valores são do tipo Unsigned int 16
        GL.STATIC_DRAW
    ); // Os valores são estáticos e não irão mudar ao longo do tempo

    //Agora é necessário configurar os parâmetros da GPU.
    //Primeiro temos que fazer bind à textura...
    GL.bindTexture(GL.TEXTURE_2D, boxTexture);

    //Parâmetros-necessários para a-GPU-saber como interpretar-a-rasterização
    //Faz Clamp à borda no eixo do U
    GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_WRAP_S, GL.CLAMP_TO_EDGE);

    //Faz Clamp à borda no eixo do V
    GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_WRAP_T, GL.CLAMP_TO_EDGE);

    //As duas linhas a baixo indicam como deve ser escalada a textura tanto
    //para diminuí-la. (TEXTURE_MIN_FILTER) como para aumentá-la (TEXTURE_MAG_FILTER)
    GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_MIN_FILTER, GL.LINEAR);
    GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_MAG_FILTER, GL.LINEAR);

    //Passamos a imagem que está no documento "escondida" através do id da imagem
    GL.texImage2D(
        GL.TEXTURE_2D,  //Tipo da Textura
        0,  //Detalhe da imagem (0 é o valor por defeito)
        GL.RGBA,  //Tipo de imagem
        GL.RGBA,  //Tipo de textura que vai ser aplicada a imagem
        GL.UNSIGNED_BYTE,  //Tipo de valores da textura
        document.getElementById('boxImage')  //Imagem que deve ser passada para o sampler
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

    // Permite o teste da profundida
    GL.enable(GL.DEPTH_TEST);

    // Permite visualizar apenas os triângulos que tiverem as normais viradas para a câmara.
    // As normais são calculadas através da ordem pela qual os triângulos forem desenhados.
    // No sentido contrário ao ponteiro do relógio a normal vai estar virada para a câmara,
    // caso contrário a normal vai estar a apontar na mesma direção  que a câmara logo não será visualizada.
    GL.enable(GL.CULL_FACE);

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

    GL.clearColor(0.65,0.65,0.65,1);
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
    //finalMatrix = math.multiply (CriarMatrizRotacaoX(anguloDeRotacao), finalMatrix);
    
    // Comentamos esta linha para o triângulo "voltar" para o centro
    //finalMatrix = math.multiply (CriarMatrizTranslacao (0.5, 0.5, 0), finalMatrix);

    //Atualizamos esta linha para o triângulo "voltar" para o centro e criamos
    // uma translação no eixo do Z para que o triângulo fique dentro do volume de cisualização
    // versão anterior: finalMatrix = math.multiply (CriarMatrizTranslacao (0.5, 0.5, 0), finalMatrix);
    finalMatrix = math.multiply (CriarMatrizTranslacao (0,0,2), finalMatrix);

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
    var projectionMatrix = MatrizPerspetiva (1, 4, 3, 0.1, 100);

    //Linha responsável pela criação da câmara ortográfica com os parametros de comprimento=4,
    //altura=3, plano anterior de 0.1 unidade e plano posterior de 100 unidades
    //var projectionMatrix = MatrizOrtografica (4, 3, 0.1, 100);

    //NOTA: Uma das linhas de criação tem que estar comentada para não haver conflito. Caso se queira mudar de câmara,
    // basta descomentar uma câmara e comentar a outra. Tal como está, a camara em perspetiva é a câmara ativa.

    var newprojectionMatrix = [];
    for (i = 0; i < projectionMatrix.length; i++) {
        newprojectionMatrix = newprojectionMatrix.concat(projectionMatrix[i]);
    }

    var viewportMatrix = MatrizViewport (-1,1,-1,1);    
    var newViewportMatrix = [];
    for (i = 0; i < viewportMatrix.length; i++) {
        newViewportMatrix = newViewportMatrix.concat(viewportMatrix[i]);
    }

    GL.uniformMatrix4fv(finalMatrixLocation,false,newarray);
    GL.uniformMatrix4fv(visualizationMatrixLocation, false,newVisualizationMatrix);
    GL.uniformMatrix4fv(projectionMatrixLocation, false,newprojectionMatrix);
    GL.uniformMatrix4fv (viewportMatrixLocation, false,newViewportMatrix);

    //Agora, em vez de chamar-mos a função de drawArray, vamos chamar a função dtawElements.
    //Esta função permite-nos utilizar vertesIndex para dizermos quais são os elementos que
    //constituem os triangulos.
    GL.drawElements(
        GL.TRIANGLES, // Queremos desenhar na mesma triângulos
        vertexIndex.length, // O número de elementos que vão ser desenhados
        GL.UNSIGNED_SHORT, // Qual o tipo de elementos
        0 // Qual o offset para o primeiro elemento a ser desenhado
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

