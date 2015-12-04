window.onload = function() {
	$('#reset').bind('click', clear);
	function clear() {
		for (var i = 2; i <= 8; i+=2) {
			$('input:nth-child('+i+')').val("");
		}
		$('textarea').text("");
	}
}