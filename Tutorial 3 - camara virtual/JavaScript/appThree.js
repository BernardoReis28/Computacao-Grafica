document.addEventListener('DOMContentLoaded', Start);

var cena = new THREE.Scene();
var camara = new THREE.OrthographicCamera(-1,1,1,-1,-10,10);
var renderer = new THREE.WebGLRenderer();

//Linha responsável pela criação da câmara em perspetiva com os parametros de field of view 45,
// aspect ratio de 4 / 3, plano anterior de 0.1 unidades e plano posterior de 100 unidades.
var camaraPerspetiva = new THREE.PerspectiveCamera (45, 4/3, 0.1, 100);

renderer.setSize(window.innerWidth -15, window.innerHeight-80);

renderer.setClearColor(0xaaaaaa);
document.body.appendChild(renderer.domElement);

var geometria = new THREE.BufferGeometry();

var vertices = new Float32Array([
    -0.5, -0.5, 0.0,
    0.5, -0.5, 0.0,
    0.0, 0.5, 0.0
]);

const cores = new Float32Array([
    1.0, 0.0, 0.0,
    0.0, 1.0, 0.0,
    0.0, 0.0, 1.0,
]);

geometria.setAttribute('position',new THREE.BufferAttribute(vertices,3));
geometria.setAttribute('color', new THREE.BufferAttribute(new Float32Array(cores),3));

var material = new THREE.MeshBasicMaterial({vertexColors: true,side: THREE.DoubleSide});

var mesh = new THREE.Mesh(geometria,material);

// Comentamos esta linha para o triângulo "voltar" para o centro
//mesh.translateX(0.5);
//mesh.translateY(0.5);
//Comentamos esta linha para o triângulo voltar ao tamanho normal
//mesh.scale.set(0.25, 0.25, 0.25);
//Criamos uma translação no eixo do Z para que o triângulo fique dentro do volume de visualização
mesh.translateZ (-6.0);

//Variável relativa ao ângulo de rotacao
var anguloDeRotacao = 0;

// definir a operação de translação no nosso triangulo
mesh.translateX(0.5);
mesh.translateY(0.5);

//Definir a operação de escala no nosso triangulo
mesh.scale.set(0.25,0.25,0.25);

var material = new THREE.MeshBasicMaterial({vertexColors:true});

function loop(){
    //Definir a rotação no eixo do Y.
    //Como o ThreeJS usa Radianos por defeito, temos que converter em graus usando a fórmula Math.PI/180 * GRAUS
    mesh.rotateY(Math.PI/180 * 1);
    
    //função chamada para gerarmos um novo frame
    renderer.render(cena,camara);

    //função chamada para executar de novo a função loop de forma a gerar o frame seguinte
    requestAnimationFrame(loop);
}

function Start()
{
    // O código abaixo adiciona o triangulo que criamos anteriormente à cena.
    cena.add(mesh);

    //camaraPerspetiva.position.z = 3; //3 mais perto que 4
    renderer.render(cena,camaraPerspetiva);

    //Função para chaamr a nossa função de loop
    requestAnimationFrame(loop);
}