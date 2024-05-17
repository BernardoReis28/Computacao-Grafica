// A primeira coisa que é necessário é um elemento HTNML do tipo canvas

var canvas = document.createElement('canvas');

//Em primeiro lugar temos que especificar qual o tamanho do canvas.
//O tamanho do canvas vau ser i tamanhho da janela (window)
canvas.width= window.innerWidth -15;
canvas.height = window.innerHeight -100;

//Para podermos trbalhar sobre WebGL é necessário termos a Biblioteca Gráfica
// (GL significa Graphic Library)
var GL = canvas.getContext('webgl');

//Criar o vertex shader Este shader é chamado por cada vértice do objeto
//de mdoo a indicar qual a posição do vértice.
var vertexShader = GL.createShader(GL.VERTEX_SHADER);

//criar o fragment shader. Este shader é chamado para todos o pixeis do objeto
//de modo a dar cor ao objeto

var fragmentShader = GL.createShader(GL.FRAGMENT_SHADER);

//Criar um programa que utilizará os shaders.
var program = GL.createProgram();

//Criar um buffer que está localizado na GPU para receber os pontos que
// os shaders irão utilizar.
var gpuArrayBuffer = GL.createBuffer();

//Esta função é responsável por pegar na informação que se encontra no gpuArrayBuffer
// e atribuí-la ao vertex shader.
function SendDataToShaders(){
    //a primeira coisa que +e necessário fazer é ir buscar a posição de cada umas das variavéis dos Shaders.
    //Se verificares o código dos shaders, é encessário passar informação para duas variáveis (vertexPosition
    //e vertexColor). Para isso vamos utilizar o código abaixo.
    var vertexPositionAttributeLocation = GL.getAttribLocation(program,"vertexPosition");
    var vertexColorAttributeLocation = GL.getAttribLocation(program,"vertexColor");

    //Esta função utiliza o último buffer que foi feito binding. Como podes ver pela função anterior
    //o último buffer ao qual foi feito bind foi o gpuArrayBuffer, logo ele vai buscar informação a esse 
    // buffer e inserir essa informação no vertex hader.Vamos inserur os dados para a variável vertexPosition.
    GL.vertexAttribPointer(
        //Localização da variável na qual pretendemos inserir a informação. No nosso caso a variável
        //"vertexPositon"
        vertexPositionAttributeLocation,
        //Este parâmetro indica quantos elementos vão ser usados pela variável. No nosso caso, a variavel
        //que irá utilizar estes valores é do tipo vec3(XYZ) logo são 3 elementos.
        3,
        //Este parâmetro indica qual é o tipo dos objetos que estão nesse buffer. No nosso caso são FLOATs.
        GL.FLOAT,
        //Este parâmetro indica se os dados estão ou não normalizados. Para já este parâmetro pode ser false.
        false,
        //Este parâmetro indica qual o tamanho de objetos que constituem cada ponto do tria^mngulo em byter.
        // Cada ponto do triângulo é consituido por 6 valalores (3 para posição X Y Z e 3 para a cor R G B) e
        // o array que está no buffer e do tipo Float32Array. Float32Array tem uma prioridade que indica 
        // qual o número de byter que cada elemento deste tipo usa. Basta multiplicar 3 pelo numero de 
        // byter de um elemento.
        6 * Float32Array.BYTES_PER_ELEMENT,
        //Este parâmetro indica quando elementos devem ser ignorados no ínicio para chegar aos valores que 
        // pretendemos utilizar. No nosso caso queremos utilizar os primeiros 3 elementos. Este valor também
        // é em bytes logo multiplicamos pelo número de bytes de um Float32Array.
        0* Float32Array.BYTES_PER_ELEMENT
    );

    //Agora utilizando o mesmo método acima, vamos inserir os dados na variável vertexColor.
    //Se prestares atenção nos parâmetros desta função, é bastante parecido ao método anterior. mudamos apenas
    //a variável á qual pretendemos inserir os dados (vertexColor) e o último parâmetro (uma vez que agora
    // pretendemos ignorar os primeiros 3 valores que significam a posição de cada vértice)
    GL.vertexAttribPointer(
         //Localização da variável na qual pretendemos inserir a informação. No nosso caso a variável
        //"vertexPositon"
        vertexColorAttributeLocation,
        //Este parâmetro indica quantos elementos vão ser usados pela variável. No nosso caso, a variavel
        //que irá utilizar estes valores é do tipo vec3(XYZ) logo são 3 elementos.
        3,
        //Este parâmetro indica qual é o tipo dos objetos que estão nesse buffer. No nosso caso são FLOATs.
        GL.FLOAT,
        //Este parâmetro indica se os dados estão ou não normalizados. Para já este parâmetro pode ser false.
        false,
        //Este parâmetro indica qual o tamanho de objetos que constituem cada ponto do tria^mngulo em byter.
        // Cada ponto do triângulo é consituido por 6 valalores (3 para posição X Y Z e 3 para a cor R G B) e
        // o array que está no buffer e do tipo Float32Array. Float32Array tem uma prioridade que indica 
        // qual o número de byter que cada elemento deste tipo usa. Basta multiplicar 3 pelo numero de 
        // byter de um elemento.
        6 * Float32Array.BYTES_PER_ELEMENT,
        //Este parâmetro indica quando elementos devem ser ignorados no ínicio para chegar aos valores que 
        // pretendemos utilizar. No nosso caso queremos utilizar os primeiros 3 elementos. Este valor também
        // é em bytes logo multiplicamos pelo número de bytes de um Float32Array.
        3* Float32Array.BYTES_PER_ELEMENT
    );

    //Agora é necessário ativar os atributos que vão ser utilizados e para isso utilizamos a linha seguinte.
    //Temos de fazer isso para cada uma das variáveis que pretendemos utilizar.
    GL.enableVertexAttribArray(vertexPositionAttributeLocation);
    GL.enableVertexAttribArray(vertexColorAttributeLocation);

    //Indica que vais utilizar este programa
    GL.useProgram(program);

    GL.drawArrays(
        GL.TRIANGLES, //Parâmetro que idnica o tipo de objetos que pretende desenhar
        0,            //qual o primeiro elemento que deve ser desenhado(elemento na posição 0)
        3             //Quanto elementos devem ser desenhados
    );
}

//Função responsável por criar e guardar a psoição XYZ e cor RBG de cada um dos vértice do triângulo.
// esta função é também responsável por copiar essa mesma informação para um buffer que se encontra na gpu

function PrepareTriangleData(){
    //Variável que guardará os pontos de cada vértice (XYZ) bem como a cor de cada um deles (RGB)
    //Nesta varável, cada vétice é constituída por 6 elementos, lembra-te diso para os passos a seguir
    //outra coisa que deves saber é que a área do canvas vau ser de -1 a 1 tanto em altura como em largura
    //com centro no meio da área do canvas. O código RBG tem calores compreendidos entre 0,0 e 1.0
    var triangleArray= [
        //  X       Y       Z       R       G       B                                                  3
            -0.5,   -0.5,   0.0,    1.0,    0.0,    0.0,//  Vértice 1 da "imagem" ao lado  ->         / \
             0.5,   -0.5,   0.0,    0.0,    1.0,    0.0,//  Vértice 1 da "imagem" ao lado  ->        /   \
             0.0,    0.5,   0.0,    0.0,    0.0,    1.0, //  Vértice 1 da "imagem" ao lado  ->       1     2
    ];

    //Esta linha de código indica à GPU que o gpuArrayBuffer é do tipo ARRAY_BUFFER
    GL.bindBuffer(GL.ARRAY_BUFFER,gpuArrayBuffer);
    //Esta linha de código copia o array que acabmos de criar(triangleArray)
    //para o buffer que está localizado na GPU(gpuArrayBuffer)
    GL.bufferData(
        //Tipo de buffer que estámos a utilizar.
        GL.ARRAY_BUFFER,
        //Dados que pretrndemos passar para o buffer que se encontra na GPU
        //Importante saber que no CPU os daods do tipo float utilizam 64bits mas a GPU só trabalha com
        //dados de 32 bits. O JavaScript permite-nos converter float de 64 bits para floats de 32bits utilizando
        //a função a baixo.
        new Float32Array(triangleArray),
        // Este parâmetro indica que os dados são passados não vão ser alterados dentro da GPU
        GL.STATIC_DRAW
    );


}

function PrepareProgram(){
    //Depois de teres os shaders crados e compilados é necessário dizeres ao program
    // para utilizar esses mesmos shaders.Para isso utilizamos o código seguinte.
    GL.attachShader(program,vertexShader);
    GL.attachShader(program, fragmentShader);

    //Agora que já atribuiste os shaders, é necessário dizeres à GPU que acabaste de
    //configurar o program. Uma boa prática é verificar se existe algum erro no program
    GL.linkProgram(program);
    if(!GL.getProgramParameter(program,GL.LINK_STATUS)){
        console.error("ERRO:: O linkProgram lançou uma exceção!", GL.getProgramInfoLog(program));    
    }

    //É uma boa prática verificar se o programa foi conectado corretamente e se pode ser
    // utilizado
    GL.validateProgram(program);
    if(!GL.getProgramParameter(program,GL.VALIDATE_STATUS)){
        console.error("ERRO:: A validação do programa lançou uma exceção!", GL.getProgramInfoLog(program));    
    }

    //Depois de tudo isto, é necessário dizer que queremos utilizar este program.Para isso
    //utilizamos o seguinte código
    GL.useProgram(program);
}

//função responsável por preprarar o canvas
function PrepareCanvas(){

    //Indica qual a cor de fundo
    GL.clearColor(0.65,0.65,0.65,1.0);

    //Limpa os buffers de profundidade e de cor para aplicar a cor
    //atribuida acima
    GL.clear(GL.DEPTH_BUFFER_BIT| GL.COLOR_BUFFER_BIT);

    //Adiciona o canvas ao body do documento
    document.body.appendChild(canvas);

    //Depois do canavs adicionar um pequeno etxto a dizer que o canvas
    //se encontra acima do texto
    canvas.insertAdjacentText('afterend','O canvas encontra-se acima deste texto!');   
}

//Função respon´savel por preparar os shaders.
function PrepareShaders()
{
    //Atribui o código que está no ficheiro shaders.js ao vertexShader
    GL.shaderSource(vertexShader, codigoVertexShader);

    //Atribui o código que está no ficheiro shaders.js ao fragmentShader.
    GL.shaderSource(fragmentShader, codigoFragmentShader);

    //Esta linha de código compila o shader passado por pârametro.
    GL.compileShader(vertexShader); // Compila o vertexShader.
    GL.compileShader(fragmentShader); // Compila o fragmentShader.

    //Depois de compilado os shaders é encessário verificar se ocorreu algum erro
    //durnate a compilação para o vertex shader usamos o código abaixo.

    if(!GL.getShaderParameter(vertexShader, GL.COMPILE_STATUS)){
        console.error("ERRO:: A compilação do vertex shader lançou uma exceção!",
        GL.getShaderInfoLog(vertexShader));
    }

    //Depois de compilado os shaders é necessário verificar se ocorreu algum erro
    // durante a compilação. Para o fragment shader usamos o código abaixo
    if(!GL.getShaderParameter(fragmentShader, GL.COMPILE_STATUS)){
        console.error("ERRO:: A compilação do fragment shader lançou uma exceção!",
        GL.getShaderInfoLog(fragmentShader));
    }

}

//Função chamada quando a página web é carregada na toalidade
function Start(){
    PrepareCanvas();
    PrepareShaders();
    PrepareProgram();
    PrepareTriangleData();
    SendDataToShaders();
}


