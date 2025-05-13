let gotas = [];
let solo;
let tipoSolo = "vegetacao"; // valor inicial
let flores = [];
let arvores = [];
let construcoes = []; // Novo array para prédios e casas

function setup() {
  let canvas = createCanvas(600, 400);
  canvas.parent("canvas-holder");
  solo = new Solo(tipoSolo);
  gerarElementosPaisagem();
}

function draw() {
  background(200, 220, 255); // céu

  for (let i = gotas.length - 1; i >= 0; i--) {
    gotas[i].cair();
    gotas[i].mostrar();

    if (gotas[i].atingeSolo(solo.altura)) {
      solo.aumentarErosao();
      gotas.splice(i, 1);
    }
  }

  solo.mostrar();
  mostrarElementosPaisagem();
  mostrarConstrucoes(); // Mostrar prédios e casas

  if (frameCount % 5 === 0) {
    gotas.push(new Gota());
  }
}

function setSoilType(tipo) {
  tipoSolo = tipo;
  solo = new Solo(tipoSolo);
  flores = [];
  arvores = [];
  construcoes = []; // Limpar construções ao mudar o tipo de solo
  if (tipoSolo === "vegetacao") {
    gerarElementosPaisagem();
  } else if (tipoSolo === "urbanizado") {
    gerarConstrucoes(); // Gerar construções para solo urbanizado
  }
}

function gerarElementosPaisagem() {
  // Adicionar flores aleatoriamente
  for (let i = 0; i < 15; i++) {
    let x = random(width);
    let y = random(solo.altura, height - 5);
    let tamanho = random(5, 15);
    let corPetala = color(random(200, 255), random(0, 100), random(200, 255));
    flores.push(new Flor(x, y, tamanho, corPetala));
  }

  // Adicionar árvores aleatoriamente (agora com a base no solo)
  for (let i = 0; i < 5; i++) {
    let x = random(50, width - 50);
    let y = solo.altura; // Base da árvore no nível do solo
    let alturaTronco = random(30, 60);
    let larguraTronco = random(5, 15);
    let raioCopa = random(20, 40);
    let corTronco = color(101, 67, 33);
    let corCopa = color(34, 139, 34);
    arvores.push(new Arvore(x, y, alturaTronco, larguraTronco, raioCopa, corTronco, corCopa));
  }
}

function mostrarElementosPaisagem() {
  for (let flor of flores) {
    flor.mostrar();
  }
  for (let arvore of arvores) {
    arvore.mostrar();
  }
}

function gerarConstrucoes() {
  // Adicionar prédios e casas aleatoriamente
  for (let i = 0; i < 8; i++) {
    let largura = random(30, 60);
    let altura = random(50, 120);
    let x = random(largura / 2, width - largura / 2);
    let y = solo.altura - altura;
    let cor = color(random(80, 150)); // Tons de cinza para construções
    construcoes.push(new Construcao(x, y, largura, altura, cor));
  }
}

function mostrarConstrucoes() {
  for (let construcao of construcoes) {
    construcao.mostrar();
  }
}

class Gota {
  constructor() {
    this.x = random(width);
    this.y = 0;
    this.vel = random(4, 6);
  }

  cair() {
    this.y += this.vel;
  }

  mostrar() {
    stroke(0, 0, 200);
    line(this.x, this.y, this.x, this.y + 10);
  }

  atingeSolo(ySolo) {
    return this.y > ySolo;
  }
}

class Solo {
  constructor(tipo) {
    this.tipo = tipo;
    this.altura = height - 80;
    this.erosao = 0;
  }

  aumentarErosao() {
    let taxa;
    if (this.tipo === "vegetacao") taxa = 0.05; // Erosão menor com vegetação
    else if (this.tipo === "exposto") taxa = 0.5;
    else if (this.tipo === "urbanizado") taxa = 0.2; // Erosão intermediária em áreas urbanizadas

    this.erosao += taxa;
    this.altura += taxa;
  }

  mostrar() {
    noStroke();
    if (this.tipo === "vegetacao") fill(60, 150, 60);
    else if (this.tipo === "exposto") fill(139, 69, 19);
    else if (this.tipo === "urbanizado") fill(120);

    rect(0, this.altura, width, height - this.altura);

    fill(0);
    textSize(14);
    textAlign(LEFT);
    text(`Erosão: ${this.erosao.toFixed(1)}`, 10, 20);
    text(`Tipo de solo: ${this.tipo}`, 10, 40);
  }
}

class Flor {
  constructor(x, y, tamanho, corPetala) {
    this.x = x;
    this.y = y;
    this.tamanho = tamanho;
    this.corPetala = corPetala;
    this.corCentro = color(255, 255, 0);
  }

  mostrar() {
    fill(this.corPetala);
    ellipse(this.x, this.y - this.tamanho / 2, this.tamanho, this.tamanho / 2); // Pétala superior
    ellipse(this.x, this.y + this.tamanho / 2, this.tamanho, this.tamanho / 2); // Pétala inferior
    ellipse(this.x - this.tamanho / 2, this.y, this.tamanho / 2, this.tamanho); // Pétala esquerda
    ellipse(this.x + this.tamanho / 2, this.y, this.tamanho / 2, this.tamanho); // Pétala direita

    fill(this.corCentro);
    ellipse(this.x, this.y, this.tamanho / 2, this.tamanho / 2); // Centro
  }
}

class Arvore {
  constructor(x, y, alturaTronco, larguraTronco, raioCopa, corTronco, corCopa) {
    this.x = x;
    this.y = y;
    this.alturaTronco = alturaTronco;
    this.larguraTronco = larguraTronco;
    this.raioCopa = raioCopa;
    this.corTronco = corTronco;
    this.corCopa = corCopa;
  }

  mostrar() {
    // Tronco
    fill(this.corTronco);
    rectMode(CENTER);
    rect(this.x, this.y - this.alturaTronco / 2, this.larguraTronco, this.alturaTronco);
    rectMode(CORNER);

    // Copa
    fill(this.corCopa);
    ellipse(this.x, this.y - this.alturaTronco, this.raioCopa * 2, this.raioCopa * 1.5);
  }
}

class Construcao {
  constructor(x, y, largura, altura, cor) {
    this.x = x;
    this.y = y;
    this.largura = largura;
    this.altura = altura;
    this.cor = cor;
  }

  mostrar() {
    fill(this.cor);
    rectMode(CENTER);
    rect(this.x, this.y + this.altura / 2, this.largura, this.altura);
    rectMode(CORNER);

    // Adicionar algumas janelas simples
    fill(200);
    let numJanelasLinha = floor(this.largura / 15);
    let numJanelasColuna = floor(this.altura / 20);
    let espacamentoX = this.largura / (numJanelasLinha + 1);
    let espacamentoY = this.altura / (numJanelasColuna + 1);
    let larguraJanela = 10;
    let alturaJanela = 15;

    for (let i = 1; i <= numJanelasLinha; i++) {
      for (let j = 1; j <= numJanelasColuna; j++) {
        let janelaX = this.x - this.largura / 2 + i * espacamentoX - larguraJanela / 2;
        let janelaY = this.y + j * espacamentoY - alturaJanela / 2;
        rect(janelaX, janelaY, larguraJanela, alturaJanela);
      }
    }
  }
}
