window.onload = function() {
	$('th').click(clickTh);
	// th的点击函数
	function clickTh() {
		var col = $(this).index();
		var trArray = $(this).parent().parent().next().children();
		if ($(this).hasClass('ascend')) {
			ascendSort(this, trArray, col);
		} else {
			descendSort(this, trArray, col);
		}
		$(this).parent().parent().next().html(trArray);
	}
	// 对表格的行进行升序排序
	function ascendSort(target, trArray, col) {
		$(target).removeClass('ascend').addClass('descend');
		trArray.sort(function(a, b) {
			return $(b).children()[col].textContent.localeCompare($(a).children()[col].textContent);
		});
	}
	// 对表格的行进行降序排序
	function descendSort(target, trArray, col) {
		$(target).parent().children().removeClass('clicked descend ascend');
		$(target).addClass('clicked ascend');
		trArray.sort(function(a, b) {
			return $(a).children()[col].textContent.localeCompare($(b).children()[col].textContent);
		});
	}
}