//Elementos del DOM
const botonPrimeraPagina = document.getElementById("boton-primera-pagina");
const botonPaginaAnterior = document.getElementById("pagina-anterior");
const botonProximaPagina = document.getElementById("proxima-pagina");
const botonUltimaPagina = document.getElementById("ultima-pagina");
const iconoPaginado = document.querySelectorAll(".icono-paginado");
const inputBusqueda = document.getElementById("input-busqueda");
const botonBuscar = document.getElementById("boton-buscar");

let urlInicial =
	"https://api.artic.edu/api/v1/artworks?fields=id,title,image_id,artist_title&limit=10";
let respuesta = "";
let nextUrl = "";
let prevUrl = "";
let paginaAnterior = "";
let ultimaPagina = "";
let primeraPagina =
	"https://api.artic.edu/api/v1/artworks?page=1&fields=id,title,image_id,artist_title";

	//Detalle al hacer click
const mostrarDetalleObras = (id)=>{
	console.log(id);
	fetch(`https://api.artic.edu/api/v1/artworks/:obra?fields=${id}`)
	.then(res => res.json())
	.then(data =>{
		console.log(data.data);
	})
}
//agrega click a cada tarjeta para detalle
	const setClick = () =>{
		const cardsObras = document.querySelectorAll(".div-interior");
		for (let i = 0; i < cardsObras.length; i++) {
			cardsObras[i].onclick= ()=>{
				console.log("Click");
				const id = cardsObras[i].dataset.id 
				mostrarDetalleObras(id)
			};
		}
	}

const mostrarObras = (respuesta) => {
	const divContenedor = document.querySelector(".div-contenedor");
	console.log(respuesta);
	const htmlCards = respuesta.reduce((acc, curr) => {
		return (
			acc +
			`
	<div class="div-interior" data-id="${curr.id}">
		<div class= "imagen-card">
			<img src="https://www.artic.edu/iiif/2/${
				curr.image_id
			}/full/843,/0/default.jpg" alt="">
		</div>
	<div class="info-card">
		<h2 class="titulo-obras">${curr.title}</h2>
		<p class="autor-obras">${
			curr.artist_title == null ? "Unknown" : curr.artist_title
		}</p>
	</div>
	</div>
	`
		);
	}, "");
	divContenedor.innerHTML = htmlCards;
	setClick()
};

const llamarApi = (url) => {
	fetch(url)
		.then((res) => res.json())
		.then((data) => {
			respuesta = data.data;
			//console.log(respuesta);
			nextUrl = data.pagination.next_url;
			prevUrl = `https://api.artic.edu/api/v1/artworks?page=${data.pagination.prev_url}&fields=id,title,image_id,artist_title`;
			paginaAnterior = data.pagination.current_page;
			ultimaPagina = `https://api.artic.edu/api/v1/artworks?page=${data.pagination.total_pages}&fields=id,title,image_id,artist_title`;
			resultados(data.pagination.total)
			mostrarObras(respuesta);
		});
};

llamarApi(urlInicial);

botonPrimeraPagina.onclick = () => {
	llamarApi(primeraPagina);
};
botonPaginaAnterior.onclick = () => {
	llamarApi(paginaAnterior);
};
botonProximaPagina.onclick = () => {
	llamarApi(nextUrl);
};
botonUltimaPagina.onclick = () => {
	llamarApi(ultimaPagina);
};

//CONTADOR DE RESULTADOS
const resultados = (total) => {

    const contadorResultados = document.getElementById("contador-resultados");

    contadorResultados.innerHTML = total;

}

const buscarObrasConOtroFetch = (data) => {
	let respuesta = data.data;
	console.log(respuesta);
	let busquedaObras = [];
	for (let i = 0; i < respuesta.length; i++) {
		const element = respuesta[i];
		console.log(element);
		fetch(
			`https://api.artic.edu/api/v1/artworks/${element.id}?fields=,title,image_id,artist_title`
		)
			.then((res) => res.json())
			.then((data) => {
				busquedaObras.push(data.data);
				mostrarObras(busquedaObras);
			});
	}
};

const buscarObras = (busqueda) => {
	fetch(`https://api.artic.edu/api/v1/artworks/search?q=${busqueda}`)
		.then((res) => res.json())
		.then((data) => {
			console.log(data);
			buscarObrasConOtroFetch(data);
		});
};

botonBuscar.onclick = (e) => {
	e.preventDefault();
	buscarObras(inputBusqueda.value);
};


