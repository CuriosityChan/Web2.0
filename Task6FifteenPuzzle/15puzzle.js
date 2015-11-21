window.onload = function() {
	var gameBoard = document.getElementById('gameBoard');
	var oFragment = document.createDocumentFragment();
	var pieces = new Array;
	for (var i = 0; i < 16; i++) {
		var newPiece = document.createElement('div');
		newPiece.className = 'piece imgPos' + i.toString();
		newPiece.id = 'piece' + i.toString(); 
		oFragment.appendChild(newPiece);
		pieces[i] = newPiece;
	};
	gameBoard.appendChild(oFragment);

	var step = document.getElementsByTagName('input')[1];
	var state = document.getElementById('state');
	var mfb = document.getElementById('mf');

	// 通过从初始状态随机往任意方向走0-999步来达到打乱的效果
	var disrupt = function() {  
		var randomMoveCount = Math.floor(Math.random()*1000);
		step.value = '0';
		for (var i = pieces.length - 1; i >= 0; i--) {
	 		pieces[i].className = 'piece imgPos'+i.toString();
	 		pieces[i].addEventListener('click', move);
	 	}
	 	mfb.addEventListener('click', clickMf); 
		for (var i = 0; i < randomMoveCount; i++) {
			var blankPiece = document.getElementsByClassName('piece imgPos15')[0];
			var dirs = new Array(-4, 4, -1, 1);
			var randomMoveDir = Math.floor(Math.random()*4);
			var blankPos = parseInt(blankPiece.id.substr(5));
			var targetPos = dirs[randomMoveDir]+blankPos;
			if (targetPos <= 15 && targetPos >= 0 &&
			    !(blankPos%4 == 3 && dirs[randomMoveDir] == 1) &&
			    !(blankPos%4 == 0 && dirs[randomMoveDir] == -1)) {
				var targetPiece = document.getElementById('piece'+targetPos.toString());
				var targetImgNum = targetPiece.className.substr(12);
				blankPiece.className = 'piece imgPos'+targetImgNum.toString();
				targetPiece.className = 'piece imgPos15';
			}
		}
		state.className = 'inVisible';
	}
	disrupt();

	// 魔法棒的点击函数
	var isUseMf = 0;
	function clickMf(event) {
		if (isUseMf == 0) {
			isUseMf++;
			mf.className = 'selectedMf';
		} else {
			isUseMf--;
			mf.className = 'unSelectedMf';
		}
	}

	// 交换任意两块
	var exchangePiece = function() {
		var selectedPieceNum = 0;
		var pieceToBeExchanged = new Array();
		var pieceToBeExchangedImgPos = new Array();
		return function(event) {
			if (selectedPieceNum == 0) {
				pieceToBeExchanged[0] = event.target;
				pieceToBeExchangedImgPos[0] = pieceToBeExchanged[0].className.substr(12);
				pieceToBeExchanged[0].className = 'selected ' + pieceToBeExchanged[0].className;
				selectedPieceNum++;
			} else if (selectedPieceNum == 1) {
				pieceToBeExchanged[1] = event.target;
				pieceToBeExchangedImgPos[1] = pieceToBeExchanged[1].className.substr(12);
				pieceToBeExchanged[0].className = 'piece imgPos' + pieceToBeExchangedImgPos[1];
				pieceToBeExchanged[1].className = 'piece imgPos' + pieceToBeExchangedImgPos[0];
				step.value = parseInt(step.value) + 100;
				selectedPieceNum--;
				isUseMf--;
				mf.className = 'unSelectedMf';			}
		}
	}();

	// 每块拼图的点击函数
	function move(event) {
		if (isUseMf) {
			exchangePiece(event);
		} else {
			var blankPiece = document.getElementsByClassName('piece imgPos15')[0];
			var targetPos = parseInt(event.target.id.substr(5));
			var blankPos = parseInt(blankPiece.id.substr(5));
			if ((targetPos == blankPos-1 && blankPos%4 != 0) ||
		   	 (targetPos == blankPos+1 && blankPos%4 != 3) ||
		   	 targetPos == blankPos-4 || targetPos == blankPos+4) {
		 		step.value = parseInt(step.value)+1;
		 		var targetImgNum = event.target.className.substr(12);
				event.target.className = 'piece imgPos15';
				blankPiece.className = 'piece imgPos'+targetImgNum.toString();

				if (isSucceed()) {
					alert("Succeed! You cost " + step.value + " steps.");
					for (var i = pieces.length - 1; i >= 0; i--) {
						pieces[i].removeEventListener('click', move);
					}
					mfb.removeEventListener('click', clickMf);
					state.className = 'visible';
				}
			}
		}
	}

	// 没走一步都要判断是否成功
	function isSucceed() {
		for (var i = pieces.length - 1; i >= 0; i--) {
			if (parseInt(pieces[i].className.substr(12)) != i) {
				return false;
			}
		}
		return true;
	}

	document.getElementsByTagName('button')[0].onclick = disrupt;
}