const start_level = 1, 
	  max_spread = 180, 
	  min_spread = 5, 
	  time_beginner = 60, 
	  time_normal = 30, 
	  time_hard = 15,
	  stop_button_color = "#DE3F4C",
	  srat_button_color = "#5B9A96";

// time to find square in seconds
let current_time_left = time_beginner,
	exclusive_square,
	current_level=start_level,
	current_additional_spread=max_spread,
	game_timer,
	default_hue, default_saturation, default_lightness,
	exclusive_hue;

window.addEventListener("DOMContentLoaded", (event) => {
	current_level = parseInt(localStorage.getItem("current_level")) || 1;
	current_additional_spread = parseInt(localStorage.getItem("current_additional_spread")) || get_random(min_spread, max_spread);
	current_time_left = parseInt(localStorage.getItem("time_left")) || time_beginner;
	exclusive_square = parseInt(localStorage.getItem("exclusive_square")) || null;
	
	default_hue = parseInt(localStorage.getItem("default_hue")) || null;
	default_saturation = parseInt(localStorage.getItem("default_saturation")) || null;
	default_lightness = parseInt(localStorage.getItem("default_lightness")) || null;
	
	/* display info about session: current level and time left */
	let session_info = `Текущий уровень: ${current_level}; Оставшееся время: ${current_time_left} секунд`;
	document.getElementsByClassName("session-info")[0].textContent = session_info;
	
	/* create default grid or get info from locale storage */
	create_squares_grid(current_level + 1);

});

/* Styles loaded */
window.addEventListener("load", (event) => {
	recolor_grid(current_level, exclusive_square, default_hue, default_saturation, default_lightness);
});

window.addEventListener("unload", (event) => {
	localStorage.setItem("current_level", current_level);
	localStorage.setItem("current_additional_spread", current_additional_spread);
	localStorage.setItem("time_left", current_time_left);
	localStorage.setItem("exclusive_square", exclusive_square);
	localStorage.setItem("default_hue", default_hue);
	localStorage.setItem("default_saturation", default_saturation);
	localStorage.setItem("default_lightness", default_lightness);
});

function start_game() {
	
	/* Show grid */
	document.getElementsByClassName("square-container")[0].style.display = "flex";
	/* Add listeners for click on square */
	let squares = document.getElementsByClassName("square-item");
	for (let i = 0; i < squares.length; i++) {
		squares[i].addEventListener("click", on_square_clicked);
		squares[i].classList.add("square-hover"); 
	}
	
	/* Init secondaly timer */
	game_timer = window.setInterval(update_text, 1000);
	
	/* Change start to stop */
	let start_button = document.getElementsByTagName("button")[0];
	start_button.textContent = "Остановить игру";
	start_button.style.backgroundColor = stop_button_color;
	start_button.setAttribute("onclick", "stop_game()");
}

function stop_game() {
	/* Stop timer */
	clearTimeout(game_timer);
	
	/* Hide grid */
	document.getElementsByClassName("square-container")[0].style.display = "none";
	
	/* Remove listeners and hover effects */
	let squares = document.getElementsByClassName("square-item");
	for (let i = 0; i < squares.length; i++) {
		squares[i].removeEventListener("click", on_square_clicked);
		squares[i].classList.remove("square-hover");
	}
	
	/* Change stop to start */
	let stop_button = document.getElementsByTagName("button")[0];
	stop_button.textContent = "Начать игру";
	stop_button.style.backgroundColor = srat_button_color;
	stop_button.setAttribute("onclick", "start_game()");
}

function create_squares_grid(dimension, add_listeners) {
	let grid_root = document.getElementsByClassName("square-container")[0];
	
	for (let i = 0; i < dimension; i++) {
		let grid_row;
		
		if (grid_root.children[i] == undefined) {
			grid_row = document.createElement('div');
			grid_row.classList.add("square-row");
		}
		else {
			grid_row = document.getElementsByClassName("square-row")[i];
		}
		
		for (let j = 0; j < dimension; j++) {
			/* if square does not exist */
			if (grid_row.children[j] == undefined) {
				let square = document.createElement('div');
				square.classList.add("square-item");
				if (add_listeners == true) {
					square.addEventListener("click", on_square_clicked);
					square.classList.add("square-hover");
				}
				grid_row.appendChild(square);
			}
		}
		
		if (grid_root.children[i] === undefined)
			grid_root.appendChild(grid_row);
	}
	
	let squares = document.getElementsByClassName("square-item");
	
	for (let i = 0; i < squares.length; i++)
		squares[i].setAttribute("data-id", i);
}

function recolor_grid(level, p_exclusive_square, p_default_hue, p_default_saturation, p_default_lightness) {
	let squares = document.getElementsByClassName("square-item");
	
	default_saturation = p_default_saturation || get_random(40, 80);
	default_lightness = p_default_lightness || get_random(40, 80);
	default_hue = p_default_hue || get_random(0, 360);
	
	exclusive_square = p_exclusive_square || get_random(0, squares.length - 1);
	
	/* recolor default squares */
	for (let i = 0; i < squares.length; i++) {
		if (i === exclusive_square) {
			exclusive_hue =  (default_hue + min_spread + current_additional_spread) % 360;
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

function reset_game_to_start() {
	clear_grid();
	current_level = 1;
	exclusive_square = null;
	current_time_left = time_beginner;
	current_additional_spread = get_random(min_spread, max_spread);
	
	create_squares_grid(current_level + 1);
	recolor_grid(current_level);
	stop_game();
	update_text({"change_time": 0});
}

function on_square_clicked() {
	let squares = document.getElementsByClassName("square-item");
	let clicked_square_color = event.path[0].dataset.id;
	
	if (clicked_square_color != exclusive_square) {
		alert("Игра окончена");
		reset_game_to_start();
	}
	else {
		current_level++;
		update_text({"change_time": 0});
		if (current_level <= 5) {
			current_additional_spread = current_additional_spread > 10? current_additional_spread - 10: 0;
			current_time_left = time_beginner;
		}
		else if (current_level <= 10) {
			current_additional_spread = current_additional_spread > 15? current_additional_spread - 15: 0;
			current_time_left = time_normal;
		}
		else {
			current_additional_spread = current_additional_spread > 5? current_additional_spread - 5: 0;
			current_time_left = time_hard;
		}
		create_squares_grid(current_level + 1, true);
		recolor_grid(current_level);
	}
	
}

function update_text(change_time=1) {
	if (current_time_left == 0) {
		alert("Время истекло");
		clearTimeout(game_timer);
		reset_game_to_start();
		return;
	}
	else {
		current_time_left -= change_time?1:0;
		let session_info = `Текущий уровень: ${current_level}; Оставшееся время: ${current_time_left} секунд`;
		document.getElementsByClassName("session-info")[0].textContent = session_info;
	}
}

function get_random(min, max) {
	return Math.floor(Math.random() * (max - min) + min);
}
