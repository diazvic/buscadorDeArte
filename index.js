//Elementos del DOM
const botonPrimeraPagina = document.getElementById("boton-primera-pagina");
const botonPaginaAnterior = document.getElementById("pagina-anterior");
const botonProximaPagina = document.getElementById("proxima-pagina");
const botonUltimaPagina = document.getElementById("ultima-pagina");
const iconoPaginado = document.querySelectorAll(".icono-paginado");
const inputBusqueda = document.getElementById("input-busqueda");
const botonBuscar = document.getElementById("boton-buscar");
const divContenedor = document.querySelector(".div-contenedor");
const divDetalleObra = document.querySelector(".div-contenedor-detalle");

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
const detalleObras = (id)=>{
	console.log(id);
	fetch(`https://api.artic.edu/api/v1/artworks/${id}`)
	.then(res => res.json())
	.then(data =>{
		respuestaDetalle = data.data
		// console.log(data.data.date_start);
		// console.log(data.data.place_of_origin);
		// console.log(data.data.artist_display);
		mostrarDetalleObra(respuestaDetalle);
	})
}
const mostrarDetalleObra = (data) => {
 divContenedor.style.display = "none";
 divDetalleObra.style.display= "flex";
 divDetalleObra.innerHTML = `
 <div class="obra-detalle">
		<div class= "imagen">
			<img src="https://www.artic.edu/iiif/2/${
				data.image_id
			}/full/843,/0/default.jpg" alt="">
		</div>
		<div class="info-obra">
			<h3>Año: ${data.date_start}</h3>
			<h3>${data.place_of_origin}</h3>
			<h3>${data.artist_display}</h3>
			<div class="div-parrafo">
				<p>${
					data.publication_history == null
						? "Unknown"
						: data.publication_history
				}</p>
			</div>
		</div>
 </div>
 `;
};
//agrega click a cada tarjeta para detalle
	const setClick = () =>{
		const cardsObras = document.querySelectorAll(".div-interior");
		for (let i = 0; i < cardsObras.length; i++) {
			cardsObras[i].onclick= ()=>{
				console.log("Click");
				const id = cardsObras[i].dataset.id 
				detalleObras(id)
			};
		}
	}

const mostrarObras = (respuesta) => {
	const divContenedor = document.querySelector(".div-contenedor");
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
	let busquedaObras = [];
	for (let i = 0; i < respuesta.length; i++) {
		const element = respuesta[i];
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
let offsetUltimaPagina = 0;
const buscarObras = (busqueda) => {
	fetch(`https://api.artic.edu/api/v1/artworks/search?q=${busqueda}`)
		.then((res) => res.json())
		.then((data) => {
			offsetUltimaPagina = data.pagination.total - 10;
			buscarObrasConOtroFetch(data);
		});
};

botonBuscar.onclick = (e) => {
	e.preventDefault();
	buscarObras(inputBusqueda.value);
};

let accObras = 0;

const buscarObrasPorPagina = (busqueda, acumulador) => {
	console.log(
		`https://api.artic.edu/api/v1/artworks/search?q=${busqueda}&from=${acumulador}`
	);
	fetch(
		`https://api.artic.edu/api/v1/artworks/search?q=${busqueda}&from=${acumulador}`
	)
		.then((res) => res.json())
		.then((data) => {
			buscarObrasConOtroFetch(data);
		});
};

botonProximaPagina.onclick = () => {
	accObras += 10;
	buscarObrasPorPagina(inputBusqueda.value, accObras);
};

botonPaginaAnterior.onclick = () => {
	if (accObras > 0) {
		accObras -= 10;
		buscarObrasPorPagina(inputBusqueda.value, accObras);
	}
};

botonPrimeraPagina.onclick = () => {
	accObras = 0;
	buscarObrasPorPagina(inputBusqueda.value, accObras);
};

botonUltimaPagina.onclick = () => {
	accObras = offsetUltimaPagina;
	buscarObrasPorPagina(inputBusqueda.value, accObras);
};
