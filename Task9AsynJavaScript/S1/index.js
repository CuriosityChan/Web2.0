window.onload = function() {
	var numOfRandomNum = 0;
	var button = $('#button');
	$('#button').mouseenter(function(event) {
		event.stopPropagation();
		$('span').hide();
		$('#info-bar').text('').unbind('click').removeClass('abled').addClass('disabled');
		$('.numButton').unbind('click').bind('click', numButtonClickHandle).removeClass('disabled').addClass('abled');
		numOfRandomNum = 0;
	});
	function numButtonClickHandle(event) {
		var span = $(event.target).children();
		span.show().text('...');
		$('.numButton').unbind('click').removeClass('abled').addClass('disabled');
		$(event.target).removeClass('disabled').addClass('abled');
		$('#info-bar').removeClass('abled').addClass('disabled').unbind('click', infoClickHandle);
		$.post('/', function(data, status) {
			if (status == 'success') {
				$('.numButton').unbind('click').bind('click', numButtonClickHandle).removeClass('disabled').addClass('abled');
				$(event.target).unbind('click', numButtonClickHandle).removeClass('abled').addClass('disabled');
				$(event.target).children().text(data);
				numOfRandomNum++;
				if (numOfRandomNum >= 5) {
					$('#info-bar').removeClass('disabled').addClass('abled').unbind('click').bind('click', infoClickHandle);
				};
			};
		});
	}
	function infoClickHandle(event) {
		var sum = 0;
		for (var i = 1; i <= 5; i++) {
			sum += parseInt($('.numButton:nth-child('+i+')').children().text());
		}
		$('#info-bar').text(sum).removeClass('abled').addClass('disabled');
		$('.numButton').removeClass('disabled').addClass('abled').unbind('click').bind('click', numButtonClickHandle);
	}
}