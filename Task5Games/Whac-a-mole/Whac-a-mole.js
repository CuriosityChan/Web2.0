// coding=utf-8
window.onload = function() {
	// 加载60个radio buttons
	var gameBoard = document.getElementById('gameBoard');
	var oFragment = document.createDocumentFragment();
	for (var i = 0; i < 60; i++) {
		var newInput = document.createElement('input');
		newInput.type = 'radio';
		newInput.className = 'littleMouse';
		newInput.disabled = true;
		oFragment.appendChild(newInput);
		// 绑定点击函数
		newInput.addEventListener('click', hit);
	}
	gameBoard.appendChild(oFragment);

	// 需要用到的全局变量
	var isStart = 0; // 用来判断游戏是否开始的变量
	var time = document.getElementById('time');
	var score = document.getElementById('score');
	var timer = null;
	var radioButtons = document.getElementsByClassName('littleMouse');
	var randomNum = Math.floor(Math.random()*(59+1));
	var mouse = radioButtons[randomNum]; // 用mouse来记录当前出现的'地鼠'
	var state = document.getElementById('state');
	var button = document.getElementById('start');
	button.onclick = startOrStop;

	function startOrStop(event) {
		if (isStart == 0) {
			// 开始
			isStart = 1;
			if (time.value == '0') {
				time.value = '30';
				score.value = '0';
			}
			state.value = 'Playing';
			mouse.checked = 'checked';
			for (var i = radioButtons.length - 1; i >= 0; i--) {
				radioButtons[i].disabled = false;
			}
			timer = setInterval(reduceTime, 1000);
		} else {
			// 暂停
			clearTimeout(timer);
			state.value = 'Pause';
			isStart = 0;
			for (var i = radioButtons.length - 1; i >= 0; i--) {
				radioButtons[i].disabled = true;
			}
		}
	}

	// 用于计时的函数
	function reduceTime() {
		if (time.value == '0') {
			// 时间减到0时停止游戏
			isStart = 0;
			clearTimeout(timer);
			mouse.checked = false;
			for (var i = radioButtons.length - 1; i >= 0; i--) {
				radioButtons[i].disabled = true;
			}
			state.value = 'Game Over';
			alert("Game Over.\nYour score is: "+score.value);
		} else {
			time.value = parseInt(time.value)-1;
		}
	}

	// 每个radio button的点击函数
	function hit(event) {
		var currentButton = event.target;
		if (currentButton == mouse) {
			score.value = parseInt(score.value) + 1;
			currentButton.checked = false;
			genrateMouse();
		} else {
			if (parseInt(score.value) > 0) {
				score.value = parseInt(score.value) - 1;
			}
			currentButton.checked = false;
		}
	}

	// 随机生成地鼠
	function genrateMouse() {
		randomNum = Math.floor(Math.random()*(59+1));
		mouse = radioButtons[randomNum];
		mouse.checked = 'checked';
	}
}