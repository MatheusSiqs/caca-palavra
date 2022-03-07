//Caça palavras feito por Matheus Siqueira Fernandes

const abcdario = ["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z"];

const tabelaArray = [];
const tabelaWidth = 25;
const tabelaHeight = 15;
const numPalavra = 15;
var click = false;
var escolha = [];

function start(){
	createTabela();
	renderTabela();
}


function createTabela(){
	let totalLetras = tabelaHeight * tabelaWidth;
	
	for(let i = 0; i<=totalLetras; i++){
		tabelaArray[i] = geraLetra();
	}
	
}

function renderTabela(){
	let totalLetras = tabelaHeight * tabelaWidth;
	
	let html = "<table cellpadding=0 cellspacing=0 onselectstart='return false'>"
	

	for(let row = 0; row<tabelaHeight; row++){
		html +="<tr>"
		for(let coloum = 0; coloum<tabelaWidth; coloum++){
			html+="<td id='r"+row+"c"+coloum+"' class='bloco' onselectstart='return false'>"
			html+=geraLetra();
			html+="</td>"
		}
		html+="</tr>"
	}
	html+="</table>"
	
	document.querySelector("#tabela").innerHTML = html;
	
	adicionaTrigger();
	
}


/*
	Triggers
*/
function adicionaTrigger(){
	for(let row = 0; row<tabelaHeight;row++){
		for(let coluna=0;coluna<tabelaWidth;coluna++){
			document.getElementById('r'+row+'c'+coluna).addEventListener('mouseover',() =>{
				let letra = document.getElementById("r"+row+"c"+coluna);
				let ID = window.event.target.id;
				if(click){
					document.getElementById("log").innerHTML += letra.innerHTML;
					escolha.push(ID);
					document.getElementById(ID).classList.add('achado');
					
				}
			})
		}
	}
	
	window.addEventListener('mousedown',()=>{
		click = true;
		let letra = window.event.target.innerHTML;
		let id = window.event.target.id
		document.getElementById("log").innerHTML += letra;
		escolha.push(id);
		document.getElementById(id).classList.add('achado');
		
		
	})
	window.addEventListener('mouseup',()=>{
		click = false;
		verificaQuery();
	})

	for(let i = 0; i< numPalavra;i++){
		importaPalavra();
	}
}

function geraLetra(){
	let rand, letra;

	rand = Math.floor(Math.random() * (25 + 1));
	
	letra = abcdario[rand];

	return letra
}

function importaPalavra(){
	let request = new XMLHttpRequest();
	request.open("get","https://api.dicionario-aberto.net/random",true);
	request.onload = function (e) {
	  if (request.readyState === 4) {
		if (request.status === 200) {
			let resp = JSON.parse(request.responseText);
			escondePalavra(resp.word.toUpperCase())
		} else {
		  console.error(request.statusText);
		}
	  }
	};	
	request.send();
}

function escondePalavra(palavra){
	let html = `<div class="palavraEscondida" id=${palavra}>${palavra}</div>`	
	let sentido = geraNumAleatorio(0,100);
	let resp = false;
		
	if(sentido<50){
		resp = escondePalavraHorizontal(palavra);
	}else{
		resp = escondePalavraVertical(palavra);
	}
	
	if(resp)
	document.getElementById("palavras").innerHTML += html;
	palavra = palavra.split('');
	
}

function escondePalavraHorizontal(palavra){
	let pos_y = geraNumAleatorio(0,tabelaHeight);
	let pos_x = geraNumAleatorio(0,(tabelaWidth-palavra.length));
	var teste = [];
	
	for(let aux=0;aux<palavra.length;aux++){
		let position = document.getElementById("r"+pos_y+"c"+(pos_x+aux));
		
		if(! position.classList.contains("escondido")){
			position.classList.add("escondido");
			teste.push(position.id);
		}else if(palavra[aux]!=position.innerHTML){
			console.log("Palavra muito grande")
			for(let aux = teste.length; aux>0;aux--){
				document.getElementById(teste[aux-1]).classList.remove('escondido')
				teste.pop();
			}
			importaPalavra();
			return false;
		}
	}

	for(let i = 0; i<palavra.length;i++){
		let position = document.getElementById("r"+pos_y+"c"+(pos_x+i));
		//position.classList.add("escondido");
		position.innerHTML= palavra[i]
	}
	return true;
}

function escondePalavraVertical(palavra){
	let pos_y = geraNumAleatorio(0,(tabelaHeight-palavra.length));
	let pos_x = geraNumAleatorio(0,tabelaWidth);
	var teste = [];
	
	
	for(let aux=0;aux<palavra.length;aux++){
		let position = document.getElementById("r"+(pos_y+aux)+"c"+pos_x);

		if(! position.classList.contains("escondido")){
			position.classList.add("escondido");
			teste.push(position.id);
		}else if(palavra[aux]!=position.innerHTML){
			console.log("Palavra muito grande")
			for(let aux = teste.length; aux>0;aux--){
				document.getElementById(teste[aux-1]).classList.remove('escondido')
				teste.pop();
			}
			importaPalavra();
			return false;
		}
	}

	for(let i = 0; i<palavra.length;i++){
		let position = document.getElementById("r"+(pos_y+i)+"c"+pos_x);
		position.classList.add("escondido");
		position.innerHTML= palavra[i]
	}
	return true;
}


function geraNumAleatorio(min, max){
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max - min) + min);
}

function verificaQuery(){
	let log = document.getElementById("log").innerHTML;
	let palavra = document.getElementById('palavras');
	var acerto;
	let contagem = 0;

	for(let i = 0; i<palavra.children.length;i++){
		if(log == palavra.children[i].innerHTML){
			palavra.children[i].classList.add('resolvido')
			acerto=true;
		}
		
		if(palavra.children[i].classList.contains('resolvido')){
			contagem++;
		}
		if(contagem == palavra.children.length){
			window.alert("Parabens você achou todas as palavras");
		}
	}

	
	document.getElementById('log').innerHTML = ""
	
	for(let aux = escolha.length; aux>0;aux--){
		if(acerto){
			document.getElementById(escolha[aux-1]).classList.add('achadoPerm')
		}else{
			document.getElementById(escolha[aux-1]).classList.remove('achado')
		}
		escolha.pop();
	}
	
	
}
start();





































