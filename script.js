let default_saturation, default_lightness, default_hue;
let squares;

window.addEventListener("DOMContentLoaded", (event) => {
	default_saturation = get_random(10, 80);
	default_lightness = get_random(20, 80);
	default_hue = get_random(0, 360);
});


window.addEventListener("load", (event) => {
	squares = document.getElementsByClassName("square-item");
	
	let count_squares = 4;
	let exclusive_square = get_random(0, count_squares - 1);
	
	/* recolor default squares */
	for (let i = 0; i < squares.length; i++) {
		squares[i].addEventListener("click", on_square_clicked);
		if (i === exclusive_square) {
			let exclusive_hue = (default_hue + 90) % 360;
			squares[i].style.backgroundColor = `hsl(${exclusive_hue}, ${default_saturation}%, ${default_lightness}%)`;
		}
		else {
			squares[i].style.backgroundColor = `hsl(${default_hue}, ${default_saturation}%, ${default_lightness}%)`;
		}
	}
});

function on_square_clicked() {
	console.log(`Square ${event.path[0].dataset.id} is clicked`);
}

function get_random(min, max) {
	return Math.floor(Math.random() * (max - min) + min);
}