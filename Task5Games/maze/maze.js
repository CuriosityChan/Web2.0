window.onload = function() {

	var start = document.getElementById('start');
	var end = document.getElementById('end');
	var lose = 0, started = 0;
	var walls = document.getElementsByClassName('wall');
	var outerMaze = document.getElementById('main');
	var innerMaze = document.getElementById('innerMaze');
	var result = document.getElementById('result');
	var state = document.getElementById('state');

	end.addEventListener('mouseover', finish);
	start.onmouseover = function(event) {
		event.stopPropagation();
		result.className = 'hidden';
		started = 1;
		lose = 0;
		for (var i = walls.length - 2; i >= 0; i--) {
			walls[i].addEventListener('mouseover', turnRedAndLose);
		}
		innerMaze.onmouseover = function(event) {
			event.stopPropagation();
		}
		outerMaze.addEventListener('mouseover', cheat);
		end.addEventListener('mouseover', finish);
	}

	function turnRedAndLose(event) {
		event.stopPropagation();
		event.target.addEventListener('mouseout', wallTurnGray);
		event.target.removeEventListener('mouseover', turnRedAndLose);
		event.stopPropagation();
		event.target.className = 'touchedWall';
		started = 0;
		result.textContent = 'You Lose';
		result.className = 'visible';
		for (var i = walls.length - 2; i >= 0; i--) {
			walls[i].removeEventListener('mouseover', turnRedAndLose);
		}
		
		end.removeEventListener('mousevover', finish);
	}

	function wallTurnGray(event) {
		event.target.className = 'wall';
	}

	function cheat(event) {
		lose = 1;
	}

	function finish(event) {
		result.className = 'visible';
		if (started == 1 && lose == 0) {
			started = 0;
			result.textContent = 'You Win';
		} else {
			result.textContent = "Don't cheat, you should start from the 'S' and move to the 'E' inside the maze!";
		}
		for (var i = walls.length - 2; i >= 0; i--) {
			walls[i].removeEventListener('mouseover', turnRedAndLose);
		}
	}
}