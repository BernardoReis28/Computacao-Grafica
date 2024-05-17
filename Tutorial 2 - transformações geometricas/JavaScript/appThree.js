document.addEventListener('DOMContentLoaded', Start);

var cena = new THREE.Scene();
var camara = new THREE.OrthographicCamera(-1,1,1,-1,-10,10);
var renderer = new THREE.WebGLRenderer();

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

// definir a operação de translação no nosso triangulo
mesh.translateX(-0.5);
mesh.translateY(-0.5);

//Definir a operação de escala no nosso triangulo
mesh.scale.set(0.25*0.75,0.25*0.75,0.25*0.75);

var material = new THREE.MeshBasicMaterial({vertexColors:true});

function loop(){
    //Definir a rotação no eixo do Y.
    //Como o ThreeJS usa Radianos por defeito, temos que converter em graus usando a fórmula Math.PI/180 * GRAUS
    mesh.rotateY(Math.PI/180 * 1);
    mesh.rotateX(Math.PI/180 * 1);
    //função chamada para gerarmos um novo frame
    renderer.render(cena,camara);

    //função chamada para executar de novo a função loop de forma a gerar o frame seguinte
    requestAnimationFrame(loop);
}

function Start()
{
    cena.add(mesh);

    renderer.render(cena,camara);
    //Função para chaamr a nossa função de loop
    requestAnimationFrame(loop);
}