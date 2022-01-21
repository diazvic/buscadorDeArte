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
const divContador = document.getElementById("div-contador");
const ordenar = document.getElementById("ordenar");
const filtrarTipo = document.getElementById("obras");

//variables
let urlInicial =
	"https://api.artic.edu/api/v1/artworks?fields=id,title,image_id,artist_title&limit=10";
let respuesta = "";
let nextUrl = "";
let prevUrl = "";
let paginaAnterior = "";
let ultimaPagina = "";
let primeraPagina =
	"https://api.artic.edu/api/v1/artworks?page=1&fields=id,title,image_id,artist_title&limit=10";
let busquedaGlobal = false;

//Detalle al hacer click
const detalleObras = (id) => {
	fetch(
		`https://api.artic.edu/api/v1/artworks/${id}?fields=,title,image_id,artist_title,date_start,place_of_origin,artist_display,publication_history`
	)
		.then((res) => res.json())
		.then((data) => {
			respuestaDetalle = data.data;
			mostrarDetalleObra(respuestaDetalle);
		});
};

const mostrarDetalleObra = (data) => {
	console.log("mostrarDetalleObra");
	divContenedor.style.display = "none";
	divContador.style.display = "none";
	divDetalleObra.style.display = "flex";
	divDetalleObra.innerHTML = `
<div class="obra-detalle">
		<button class="boton-volver-atras">
			<i class="fas fa-arrow-left"></i>
		</button>
		<div class= "imagen">
      <img src="https://www.artic.edu/iiif/2/${
				data.image_id
			}/full/843,/0/default.jpg" alt="">
    </div>
		<div class="info-obra">
			<h3>Año:${data.date_start}</h3>
			<h3>${data.place_of_origin}</h3>
			<h3>${data.artist_display}</h3>
			<div class="div-parrafo">
				<p>${
					data.publication_history == null
						? "This piece doesn't have a publication history"
						: data.publication_history
				}</p>
			</div>
		</div>
</div>
`;
	const botonVolverAtras = document.querySelector(".boton-volver-atras");
	botonVolverAtras.onclick = () => {
		divContenedor.style.display = "flex";
		divDetalleObra.style.display = "none";
		divContador.style.display = "flex";
	};
};

//agrega click a cada tarjeta para detalle
const setClick = () => {
	const cardsObras = document.querySelectorAll(".div-interior");
	for (let i = 0; i < cardsObras.length; i++) {
		cardsObras[i].onclick = () => {
			const id = cardsObras[i].dataset.id;
			detalleObras(id);
		};
	}
};

const mostrarObras = (respuesta) => {
	console.log("mostrarObras");
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
	setClick();
};

const llamarApi = (url) => {
	console.log("llamarApi");
	fetch(url)
		.then((res) => res.json())
		.then((data) => {
			respuesta = data.data;
			nextUrl = data.pagination.next_url;
			prevUrl = data.pagination.prev_url;
			paginaAnterior = data.pagination.current_page;
			ultimaPagina = `https://api.artic.edu/api/v1/artworks?page=${data.pagination.total_pages}&fields=id,title,image_id,artist_title&limit=10`;
			resultados(data.pagination.total);
			filtrarYOrdenar();
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

const buscarObrasConOtroFetch = (data) => {
	console.log("buscarObrasConOtroFetch");
	respuesta = data.data;
	let busquedaObras = [];
	for (let i = 0; i < respuesta.length; i++) {
		const element = respuesta[i];
		fetch(
			`https://api.artic.edu/api/v1/artworks/${element.id}?fields=,title,image_id,artist_title,id`
		)
			.then((res) => res.json())
			.then((data) => {
				busquedaObras.push(data.data);
				if (busquedaObras.length == 10) {
					respuesta = busquedaObras;
					filtrarYOrdenar();
				}
			});
	}
};
let offsetUltimaPagina = 0;
const buscarObras = (busqueda) => {
	console.log("buscarObras");
	fetch(`https://api.artic.edu/api/v1/artworks/search?q=${busqueda}`)
		.then((res) => res.json())
		.then((data) => {
			offsetUltimaPagina = data.pagination.total - 10;
			resultados(data.pagination.total);
			buscarObrasConOtroFetch(data);
		});
};

botonBuscar.onclick = (e) => {
	e.preventDefault();
	if (inputBusqueda.value == "") {
		return;
	}
	busquedaGlobal = true;
	buscarObras(inputBusqueda.value);
};

let accObras = 0;

const buscarObrasPorPagina = (busqueda, acumulador) => {
	console.log("buscarObrasPorPagina");

	fetch(
		`https://api.artic.edu/api/v1/artworks/search?q=${busqueda}&from=${acumulador}`
	)
		.then((res) => res.json())
		.then((data) => {
			buscarObrasConOtroFetch(data);
		});
};
//onclicks del paginado
botonProximaPagina.onclick = () => {
	console.log("botonProximaPagina");
	if (busquedaGlobal == false) {
		llamarApi(nextUrl);
	} else if (busquedaGlobal == true) {
		accObras += 10;
		buscarObrasPorPagina(inputBusqueda.value, accObras);
	}
};

botonPaginaAnterior.onclick = () => {
	console.log("botonPaginaAnterior");
	if (busquedaGlobal == false) {
		llamarApi(prevUrl);
	} else if (busquedaGlobal == true) {
		if (accObras > 0) {
			accObras -= 10;
			buscarObrasPorPagina(inputBusqueda.value, accObras);
		}
	}
};

botonPrimeraPagina.onclick = () => {
	console.log("botonPrimeraPagina");
	if (busquedaGlobal == true) {
		accObras = 0;
		buscarObrasPorPagina(inputBusqueda.value, accObras);
	}
};

botonUltimaPagina.onclick = () => {
	console.log("botonUltimaPagina");
	if (busquedaGlobal == true) {
		accObras = offsetUltimaPagina;
		buscarObrasPorPagina(inputBusqueda.value, accObras);
	}
};

const filtrarYOrdenar = () => {
	const ordenar = document.getElementById("ordenar").value; // Puede valer a-z o z-a
	const filtrarTipo = document.getElementById("obras").value; // Puede valer titulo o autor
	let elementos = respuesta;
	console.log("ordenar");
	if (filtrarTipo === "titulo" && ordenar === "a-z") {
		mostrarObras(ordenarAZ(elementos, "titulo"));
	} else if (filtrarTipo === "titulo" && ordenar === "z-a") {
		mostrarObras(ordenarZA(elementos, "titulo"));
	} else if (filtrarTipo === "autor" && ordenar === "a-z") {
		mostrarObras(ordenarAZ(elementos, "autor"));
	} else if (filtrarTipo === "autor" && ordenar === "z-a") {
		mostrarObras(ordenarZA(elementos, "autor"));
	}
};
ordenar.addEventListener("change", filtrarYOrdenar);
filtrarTipo.addEventListener("change", filtrarYOrdenar);

const ordenarAZ = (elementos, ordenarPor) => {
	console.log("ordenarAZ");
	const elementosOrdenados = elementos.sort((ordenPrimero, ordenSegundo) => {
		let ordenarPrimeraPalabra = "";
		let ordenarSegundaPalabra = "";
		if (ordenarPor == "titulo") {
			ordenarPrimeraPalabra = ordenPrimero.title.toLowerCase();
			ordenarSegundaPalabra = ordenSegundo.title.toLowerCase();
		} else if (ordenarPor == "autor") {
			ordenarPrimeraPalabra = ordenPrimero.artist_title.toLowerCase();
			ordenarSegundaPalabra = ordenSegundo.artist_title.toLowerCase();
		}
		if (ordenarPrimeraPalabra < ordenarSegundaPalabra) {
			//esto seria si a es menor q b tiene q estar antes, por eso retorno -1
			return -1;
		}
		if (ordenarPrimeraPalabra > ordenarSegundaPalabra) {
			//esto seria si a es mayor q b tiene q estar antes, por eso retorno 1
			return 1;
		}
		return 0;
		//quiere decir q son iguales
	});
	// Voy a hacer la logica que agarre elementos y los ordene, dejando el mismo formato, cuando estan ordenados
	// y tienen el mismo formato hago:
	return elementosOrdenados;
};

const ordenarZA = (elementos, ordenarPor) => {
	console.log("ordenarZA");
	const elementosOrdenados = elementos.sort((ordenPrimero, ordenSegundo) => {
		let ordenarPrimeraPalabra = "";
		let ordenarSegundaPalabra = "";
		if (ordenarPor == "titulo") {
			ordenarPrimeraPalabra = ordenPrimero.title.toLowerCase();
			ordenarSegundaPalabra = ordenSegundo.title.toLowerCase();
		} else if (ordenarPor == "autor") {
			ordenarPrimeraPalabra = ordenPrimero.artist_title.toLowerCase();
			ordenarSegundaPalabra = ordenSegundo.artist_title.toLowerCase();
		}
		if (ordenarSegundaPalabra < ordenarPrimeraPalabra) {
			//esto seria si a es menor q b tiene q estar antes, por eso retorno -1
			return -1;
		}
		if (ordenarSegundaPalabra > ordenarPrimeraPalabra) {
			//esto seria si a es mayor q b tiene q estar antes, por eso retorno 1
			return 1;
		}
		return 0;
		//quiere decir q son iguales
	});
	// Voy a hacer la logica que agarre elementos y los ordene, dejando el mismo formato, cuando estan ordenados
	// y tienen el mismo formato hago:
	return elementosOrdenados;
};
//CONTADOR DE RESULTADOS
const resultados = (total) => {
	const contadorResultados = document.getElementById("contador-resultados");
	contadorResultados.innerHTML = total;
};
