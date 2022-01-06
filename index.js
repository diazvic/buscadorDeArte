let respuesta = "";

const mostrarObras = (respuesta) => {
	const divContenedor = document.querySelector(".div-contenedor");
	console.log(respuesta);
	const htmlCards = respuesta.data.reduce((acc, curr) => {
		return (
			acc +
			`
	<div class="div-interior">
		<div class= "imagen-card">
			<img src="https://www.artic.edu/iiif/2/${curr.image_id}/full/843,/0/default.jpg" alt="">
		</div>
	<div class="info-card">
		<h2 class="titulo-obras">${curr.title}</h2>
		<p class="autor-obras">${curr.artist_title}</p>
	</div>
	</div>
	`
		);
	}, "");
	divContenedor.innerHTML = htmlCards;
};

fetch("https://api.artic.edu/api/v1/artworks")
	.then((res) => res.json())
	.then((data) => {
		respuesta = data;
		mostrarObras(respuesta);
	});
