//Elementos del DOM
const proximaPagina = document.getElementById("proxima-pagina");
const paginaAnterior = document.getElementById("pagina-anterior");
const iconoPaginado = document.querySelectorAll(".icono-paginado");
const paginaActualBoton = document.getElementById("pagina-actual");
const ultimaPaginaBoton = document.getElementById("ultima-pagina");

let urlInicial =
	"https://api.artic.edu/api/v1/artworks?fields=id,title,image_id,artist_title";
let respuesta = "";
let nextUrl = "";
let prevUrl = "";
let paginaActual = "";
let ultimaPagina = "";
let primeraPagina = "";

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
			prevUrl = data.pagination.prev_url;
			paginaActual = data.pagination.current_page;
			ultimaPagina = `https://api.artic.edu/api/v1/artworks?page=${data.pagination.total_pages}&fields=id,title,image_id,artist_title`;
			// primeraPagina = 1;
			mostrarObras(respuesta);
		});
};
llamarApi(urlInicial);
proximaPagina.onclick = () => {
	llamarApi(nextUrl);
};
paginaAnterior.onclick = () => {
	llamarApi(prevUrl);
};
paginaActualBoton.onclick = () => {
	llamarApi(primeraPagina);
};
ultimaPaginaBoton.onclick = () => {
	llamarApi(ultimaPagina);
};
