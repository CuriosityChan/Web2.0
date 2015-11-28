window.onload = function() {
	var gameBoard = document.getElementById('gameBoard');
	var oFragment = document.createDocumentFragment();
	for (var i = 0; i < 16; i++) {
		var newPiece = document.createElement('div');
		newPiece.className = 'piece imgPos' + i;
		newPiece.id = 'piece' + i.toString(); 
		oFragment.appendChild(newPiece);
	};
	gameBoard.appendChild(oFragment);

	var pieces = $('.piece');
	var step = $('input+input');
	var state = $('#state');
	var mfb = $('#mf');
	disrupt();
	$('button:first').click(disrupt);

	function getImgPos(target) { return target.attr('class').substr(12) }
	function getPos(target) { return parseInt(target.attr('id').substr(5)) }

	// 通过从初始状态随机往任意方向走1000步来达到打乱的效果
	function disrupt() {  
		step.val('0');
		pieces.bind('click', clickPiece);
	 	mfb.bind('click', clickMf); 
	 	_.times(1000, moveToRandomDir);
		state.className = 'inVisible';
	}
	// 往任意方向走一步
	function moveToRandomDir() {
		var blankPiece = $('.imgPos15');
		var dirs = [-4, 4, -1, 1];
		var randomMoveDir = _.sample(dirs);
		var blankPos = getPos(blankPiece);
		var targetPos = randomMoveDir+blankPos;
		if (canMove(targetPos, blankPos)) {
			exchangeTwoPieces($('#piece'+targetPos), blankPiece);
		}
	}
	// 判断是否可以走
	function canMove(targetPos, blankPos) {
		return (targetPos <= 15 && targetPos >= 0 &&
		    (Math.abs(targetPos-blankPos) == 1 || Math.abs(targetPos-blankPos) == 4) &&
		   !(blankPos%4 == 3 && targetPos-blankPos == 1) &&
		   !(blankPos%4 == 0 && targetPos-blankPos == -1));
	}
	// 交换指定的两块拼图
	function exchangeTwoPieces(target1, target2) {
		imgPos1 = getImgPos(target1);
		target1.attr('class', 'piece imgPos'+getImgPos(target2));
		target2.attr('class', 'piece imgPos'+imgPos1);
	}
	// 魔法棒的点击函数
	var isUseMf = 0;
	function clickMf(event) {
		if (isUseMf == 0) {
			isUseMf++;
			mfb.attr('class', 'selectedMf');
		} else {
			isUseMf--;
			mfb.attr('class', 'unSelectedMf');
		}
	}
	// 每块拼图的点击函数
	function clickPiece(event) {
		if (isUseMf) {
			useMF(event);
		} else {
			move(event);
		}
		if (isSucceed()) succeed();
	}
	// 使用魔法棒
	var selectedPieceNum = 0;
	var pieceToBeExchanged = new Array();
	function useMF (event) {
		if (selectedPieceNum == 0) {
			selectedOnePiece(event);
			selectedPieceNum++;
		} else if (selectedPieceNum == 1) {
			selectedTwoPieces(event);
			selectedPieceNum--;		
		}
	}
	// 使用魔法棒时选中一块和两块所对应的函数
	function selectedOnePiece(event) {
		pieceToBeExchanged[0] = $(event.target);
		pieceToBeExchanged[0].addClass('selected');
	}
	function selectedTwoPieces(event) {
		pieceToBeExchanged[0].removeClass('selected');
		pieceToBeExchanged[1] = $(event.target);
		if (getImgPos(pieceToBeExchanged[0]) != getImgPos(pieceToBeExchanged[1])) {
			exchangeTwoPieces(pieceToBeExchanged[0], pieceToBeExchanged[1]);
			isUseMf--;
			mfb.attr('class', 'unSelectedMf');
			step.val(parseInt(step.val()) + 100);
		}
	}
	// 移动一步
	function move(event) {
		var blankPiece = $('.imgPos15');
		if (canMove(getPos($(event.target)), getPos(blankPiece))) {
		 	step.val(parseInt(step.val())+1);
		 	exchangeTwoPieces($(event.target), blankPiece);
		}
	}
	// 每走一步都要判断是否成功
	function isSucceed() {
		for (var i = pieces.length - 1; i >= 0; i--) {
			var piece = $('.imgPos'+i);
			if (parseInt(getImgPos(piece)) != getPos(piece)) return false;
		}
		return true;
	}
	function succeed() {
		alert("Succeed! You cost " + step.val() + " steps.");
		pieces.unbind('click');
		mfb.unbind('click', clickMf);
		state.attr('class', 'visible');
	}
}