window.onload = function() {
	var numOfRandomNum = 0;
	$('#button').mouseenter(function(event) {
		event.stopPropagation();
		$('span').hide();
		$('.numButton').removeClass('disabled').addClass('abled').unbind('click').bind('click', numButtonClickHandle);
		$('#info-bar').text('').unbind('click').removeClass('abled').addClass('disabled');
		$('.apb').unbind('click').bind('click', apbClickHandle);
		numOfRandomNum = 0;
	});

	function numButtonClickHandle(event) {
		getRandomNum(event.target, null);
	}


	function getRandomNum(target, callback) {
		var span = $(target).children();
		span.show().text('...');
		$('.numButton').unbind('click').removeClass('abled').addClass('disabled');
		$(target).removeClass('disabled').addClass('abled');
		$('#info-bar').removeClass('abled').addClass('disabled').unbind('click', infoClickHandle);
		$.post('/', function(data, status) {
			if (status == 'success') {
				$('.numButton').unbind('click').bind('click', numButtonClickHandle).removeClass('disabled').addClass('abled');
				$(target).unbind('click', numButtonClickHandle).removeClass('abled').addClass('disabled');
				$(target).children().text(data);
				numOfRandomNum++;
				if (numOfRandomNum >= 5) {
					$('#info-bar').removeClass('disabled').addClass('abled').unbind('click').bind('click', infoClickHandle);
				};
				if (callback) {
					callback(null);
				};
			};
		});

	}

	function infoClickHandle() {
		var sum = 0;
		for (var i = 1; i <= 5; i++) {
			sum += parseInt($('.numButton:nth-child('+i+')').children().text());
		}
		$('#info-bar').text(sum).removeClass('abled').addClass('disabled');
		$('.numButton').removeClass('disabled').addClass('abled').unbind('click').bind('click', numButtonClickHandle);
	}

	function apbClickHandle(event) {
		event.stopPropagation();
		var obj = $('.numButton');
		var numButtons = $.makeArray(obj);
		function done(err) {
			infoClickHandle();
		}
		var callbacks = [];
		for (var i = 0; i < 4; i++) {
			(function(i) {
				callbacks[i] = function(err) {
					getRandomNum($(numButtons[i+1]), callbacks[i+1]);
				}
			})(i);
		}
		callbacks[4] = done;
		getRandomNum($(numButtons[0]), callbacks[0]);
	}
}