const start_level = 1, max_spread = 180, min_spread = 5;

let exclusive_square;
let current_level=start_level;
let current_additional_spread;


window.addEventListener("DOMContentLoaded", (event) => {
	current_additional_spread = get_random(min_spread, max_spread);
	/* create default grid or get info from locale storage */
	create_squares_grid(current_level + 1);
	
	let squares = document.getElementsByClassName("square-item");
	for (let i = 0; i < squares.length; i++)
		squares[i].addEventListener("click", on_square_clicked);
});


window.addEventListener("load", (event) => {
	recolor_grid(current_level);
});

function create_squares_grid(dimension) {
	let grid_root = document.getElementsByClassName("square-container")[0];
	
	for (let i = 0; i < dimension; i++) {
		let grid_row;
		
		if (dimension == start_level + 1 || i == dimension - 1) {
			grid_row = document.createElement('div');
			grid_row.className = "square-row";
		}
		else {
			grid_row = document.getElementsByClassName("square-row")[i];
		}
		
		for (let j = 0; j < dimension; j++) {
			let square = null;
			if (dimension == start_level + 1 || j == dimension - 1 || i == dimension - 1) {
				square = document.createElement('div');
				square.className = "square-item";
				square.addEventListener("click", on_square_clicked);
				grid_row.appendChild(square);
			}
		}
		
		if (dimension == start_level + 1 || i == dimension - 1)
			grid_root.appendChild(grid_row);
	}
	
	let squares = document.getElementsByClassName("square-item");
	
	for (let i = 0; i < squares.length; i++)
		squares[i].setAttribute("data-id", i);
}

function recolor_grid(level) {
	console.log(level);
	let squares = document.getElementsByClassName("square-item");
	
	let default_saturation = get_random(40, 80);
	let default_lightness = get_random(40, 80);
	let default_hue = get_random(0, 360);
	
	exclusive_square = get_random(0, squares.length - 1);
	
	/* recolor default squares */
	for (let i = 0; i < squares.length; i++) {
		if (i === exclusive_square) {
			let exclusive_hue = (default_hue + min_spread + current_additional_spread) % 360;
			squares[i].style.backgroundColor = `hsl(${exclusive_hue}, ${default_saturation}%, ${default_lightness}%)`;
		}
		else {
			squares[i].style.backgroundColor = `hsl(${default_hue}, ${default_saturation}%, ${default_lightness}%)`;
		}
	}
}

function clear_grid() {
	// Remove old root
	document.getElementsByClassName("square-container")[0].remove();
	
	let root = document.createElement("div");
	root.className = "square-container";
	// Recreate container
	let body = document.getElementsByTagName("body")[0];
	body.appendChild(root);
}

function on_square_clicked() {
	let squares = document.getElementsByClassName("square-item");
	let clicked_square_color = event.path[0].dataset.id;
	
	if (clicked_square_color != exclusive_square) {
		alert("Игра окончена");
		clear_grid();
		current_level = 1;
		exclusive_square = null;
		create_squares_grid(current_level + 1);
		recolor_grid(current_level);
	}
	else {
		current_level++;
		if (current_level <= 5)
			current_additional_spread = current_additional_spread > 10? current_additional_spread - 10: 0;
		else if (current_level <= 10)
			current_additional_spread = current_additional_spread > 15? current_additional_spread - 15: 0;
		else 
			current_additional_spread = current_additional_spread > 5? current_additional_spread - 5: 0;
		create_squares_grid(current_level + 1);
		recolor_grid(current_level);
	}
	
}

function get_random(min, max) {
	return Math.floor(Math.random() * (max - min) + min);
}