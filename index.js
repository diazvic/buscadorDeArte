//Elementos del DOM
const botonPrimeraPagina = document.getElementById("boton-primera-pagina");
const botonPaginaAnterior = document.getElementById("pagina-anterior");
const botonProximaPagina = document.getElementById("proxima-pagina");
const botonUltimaPagina = document.getElementById("ultima-pagina");
const iconoPaginado = document.querySelectorAll(".icono-paginado");
const form = document.getElementById("form")
const inputBusqueda = document.getElementById("input-busqueda");
const botonBuscar = document.getElementById("boton-buscar");

let urlInicial =
	"https://api.artic.edu/api/v1/artworks?fields=id,title,image_id,artist_title";
let respuesta = "";
let nextUrl = "";
let prevUrl = "";
let paginaAnterior = "";
let ultimaPagina = "";
let primeraPagina =
	"https://api.artic.edu/api/v1/artworks?page=1&fields=id,title,image_id,artist_title";

const mostrarObras = (respuesta) => {
	const divContenedor = document.querySelector(".div-contenedor");
	console.log(respuesta);
	const htmlCards = respuesta.data.reduce((acc, curr) => {
		return (
			acc +
			`
	<div class="div-interior">
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
};

const llamarApi = (url) => {
	fetch(url)
		.then((res) => res.json())
		.then((data) => {
			respuesta = data;
			nextUrl = data.pagination.next_url;
			prevUrl = `https://api.artic.edu/api/v1/artworks?page=${data.pagination.prev_url}&fields=id,title,image_id,artist_title`;
			paginaAnterior = data.pagination.current_page;
			ultimaPagina = `https://api.artic.edu/api/v1/artworks?page=${data.pagination.total_pages}&fields=id,title,image_id,artist_title`;
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

//** FORMULARIO **
// se puede optimizar ? se puede agregar en llamarApi? ver con viqui

const buscarObra = (obra) => {
	fetch(`https://api.artic.edu/api/v1/artworks/:${obra}?fields=id,title,image_id`)
		.then((res) => res.json())
		.then((data) => {
			respuesta = data;
			mostrarObras(respuesta);
		});
};
botonBuscar.onclick = (e) => {
  e.preventDefault();
  buscarObra(inputBusqueda.value);
}