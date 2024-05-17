//Indica ao documento HTML que quando acabar de carregar todo o seu conteúdo
//deve chamar a função "Start".
document.addEventListener('DOMContentLoaded', Start);

//Em three.js tudo é baseado em cenas e camaras. Cada cena contém os objetos que a ela pertencem.
//Podem existir diferentes camaras mas apenas uma é rederizada.
//AS linhas de codigo abaixo criar uma cena, uma camara e um render em WebGL.
//Vamos ver nas proximas aulas os diferentes tipos de camara, por agora usamos a camara ortografica.
//Este último é o que vai renderizar a imagem tendo em conta a camara e a cena.

var cena = new THREE.Scene();
var camara = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 10);
var renderer = new THREE.WebGLRenderer();

//O codigo abaixo indica ao render qual o tamanho da janela de visualização 
renderer.setSize(window.innerWidth -15, window.innerHeight-80);

//O codigo abaixo indica ao render qual a cor de fundo da janela de visualização 
renderer.setClearColor(0xaaaaaa);

//O codigo abaixo adiciona o render ao body do documento html para que este possa ser visto.
document.body.appendChild(renderer.domElement);

//Para criarmos um objeto precisamos sempre de uma geometria e um material, o primeiro é 
//responsavel por definir a geometria (ou vertices de cada ponto), e o segundo é responsavel
//por dizer qual o material que o objeto irá usar.

//Para criar um triangulo, é necessario criar a geometria para isso utilizamos o codigo abaixo indicando
//quais as posições de cada um dos vértices do triangulo.
var geometria = new THREE.BufferGeometry();
var vertices = new Float32Array( [
    -0.5, -0.5, 0.0,
    0.5, -0.5, 0.0,
    0.0, 0.5, 0.0,

] );

//De forma a definir a cor para cada um dos vértices, temos que criar uma matriz com os valores RGB para
//cada um deles
const cores = new Float32Array( [ 
    1.0, 0.0, 0.0,
    0.0, 1.0, 0.0,
    0.0, 0.0, 1.0,
] );

//itemSize = 3 pois são 3 valores (componentes x,y,z para a posição e RGB para a cor) por vértice
geometria.setAttribute( 'position', new THREE.BufferAttribute( vertices, 3) );
geometria.setAttribute( 'color', new THREE.BufferAttribute(new Float32Array(cores),3 ));

// É necessário também criar o material, para este caso vamos utilizar um material básico e
// dentro desse material básico (que representa uma cor) ativamos o parametro vertexColors
// para assumir a matriz que criamos com os pontos RGB como as cores a aplicar
var material = new THREE.MeshBasicMaterial({vertexColors: true});

// No final, quando já tens a geometria e o material, é necessário criares uma mesh
// com os dados da geometria e do material. A Mesh é o componente necessário para
// poderes fazer as diferentes tranformações ao objeto.
var mesh = new THREE.Mesh(geometria, material );

// Função chamada quando a página HTML acabar de carregar e é responsável por configurar
// a cena para a primeira renderização.
function Start(){
    // O código abaixo adiciona o triangulo que criamos anteriormente à cena.
    cena.add(mesh);

    renderer.render(cena, camara);
}
