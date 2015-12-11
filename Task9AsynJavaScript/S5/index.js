window.onload = function() {
	$('#button').mouseenter(function(event) {
		event.stopPropagation();
		$('span').hide();
		$('.numButton').removeClass('disabled withNum').addClass('abled');
		$('#info-bar').html('').removeClass('abled').addClass('disabled');
		$('.apb').unbind('click').bind('click', apbClickHandle);
	});

	function aHandle(err, sum, callback) {
		var target = $('#a');
		var span = target.children();
		span.show().text('...');
		$('.numButton').removeClass('abled').addClass('disabled');
		target.removeClass('disabled').addClass('abled');
		$('#info-bar').removeClass('abled').addClass('disabled');
		$.post('/', function(data, status) {
			if (status == 'success') {
				$('.numButton').removeClass('disabled').addClass('abled');
				target.removeClass('abled').addClass('disabled withNum');
				target.children().text(data);
				if ($.makeArray($('.withNum')).length >= 5) {
					$('#info-bar').removeClass('disabled').addClass('abled');
				};
				if (err) {
					var mes = {
						'message':'A：这不是个天大的秘密\n',
						'sum':sum+parseInt(data)
					}
					return mes;
				} else {
					$('#message').text($('#message').text()+'A：这是个天大的秘密\n');
				}
				if (callback) {
					var mes = callback(null, sum+parseInt(data));
					if (mes) {
						$('#message').text($('#message').text()+mes[message]);
					}
				};
			};
		});
	}

	function bHandle(err, sum, callback) {
		var target = $('#b');
		var span = target.children();
		span.show().text('...');
		$('.numButton').removeClass('abled').addClass('disabled');
		target.removeClass('disabled').addClass('abled');
		$('#info-bar').removeClass('abled').addClass('disabled');
		$.post('/', function(data, status) {
			if (status == 'success') {
				$('.numButton').removeClass('disabled').addClass('abled');
				target.removeClass('abled').addClass('disabled withNum');
				target.children().text(data);
				if ($.makeArray($('.withNum')).length >= 5) {
					$('#info-bar').removeClass('disabled').addClass('abled');
				}
				if (err) {
					var mes = {
						'message':'B：我知道\n',
						'sum':sum+parseInt(data)
					}
					return mes;
				} else {
					$('#message').text($('#message').text()+'B：我不知道\n');
				}
				if (callback) {
					var mes = callback(null, sum+parseInt(data));
					if (mes) {
						$('#message').text($('#message').text()+mes[message]);
					}
				}
			};
		});
	}

	function cHandle(err, sum, callback) {
		var target = $('#c');
		var span = target.children();
		span.show().text('...');
		$('.numButton').removeClass('abled').addClass('disabled');
		target.removeClass('disabled').addClass('abled');
		$('#info-bar').removeClass('abled').addClass('disabled');
		$.post('/', function(data, status) {
			if (status == 'success') {
				$('.numButton').removeClass('disabled').addClass('abled');
				target.removeClass('abled').addClass('disabled withNum');
				target.children().text(data);
				if (err) {
					var mes = {
						'message':'C：你知道\n',
						'sum':sum+parseInt(data)
					}
					return mes;
				} else {
					$('#message').text($('#message').text()+'C：你不知道\n');
				}
				if (callback) {
					var mes = callback(null, sum+parseInt(data));
					if (mes) {
						$('#message').text($('#message').text()+mes[message]);
					}
				};
			};
		});
	}

	function dHandle(err, sum, callback) {
		var target = $('#d');
		var span = target.children();
		span.show().text('...');
		$('.numButton').removeClass('abled').addClass('disabled');
		target.removeClass('disabled').addClass('abled');
		$('#info-bar').removeClass('abled').addClass('disabled');
		$.post('/', function(data, status) {
			if (status == 'success') {
				$('.numButton').removeClass('disabled').addClass('abled');
				target.removeClass('abled').addClass('disabled withNum');
				target.children().text(data);
				if ($.makeArray($('.withNum')).length >= 5) {
					$('#info-bar').removeClass('disabled').addClass('abled');
				};
				if (err) {
					var mes = {
						'message':'D：他知道\n',
						'sum':sum+parseInt(data)
					}
					return mes;
				} else {
					$('#message').text($('#message').text()+'D：他不知道\n');
				}
				if (callback) {var mes = callback(null, sum+parseInt(data));
					if (mes) {
						$('#message').text($('#message').text()+mes[message]);
					}
				};
			};
		});
	}

	function eHandle(err, sum, callback) {
		var target = $('#e');
		var span = target.children();
		span.show().text('...');
		$('.numButton').removeClass('abled').addClass('disabled');
		target.removeClass('disabled').addClass('abled');
		$('#info-bar').removeClass('abled').addClass('disabled');
		$.post('/', function(data, status) {
			if (status == 'success') {
				$('.numButton').removeClass('disabled').addClass('abled');
				target.removeClass('abled').addClass('disabled withNum');
				target.children().text(data);
				if ($.makeArray($('.withNum')).length >= 5) {
					$('#info-bar').removeClass('disabled').addClass('abled');
				};
				if (err) {
					var mes = {
						'message':'E：确实\n',
						'sum':sum+parseInt(data)
					}
					return mes;
				} else {
					$('#message').text($('#message').text()+'E：才怪\n');
				}
				if (callback) {
					var mes = callback(null, sum+parseInt(data));
					if (mes) {
						$('#message').text($('#message').text()+mes[message]);
					}
				};
			};

		});
	}

	function infoClickHandle(err, sum) {
		if (err) {
			var mes = {
				'message':'大气泡：楼主异步调用战斗力爆表，目测超过'+sum,
				'sum':sum
			}
			return mes;
		} else {
			$('#message').text($('#message').text()+'大气泡：楼主异步调用战斗力感人，目测不超过'+sum);
		}
		$('#info-bar').html($('#info-bar').html()+'<div>'+sum+'</div>').removeClass('abled').addClass('disabled');
		$('.numButton').removeClass('disabled').addClass('abled');
		$('.apb').unbind('click').bind('click', apbClickHandle);
	}

	function apbClickHandle(event) {
		$('.apb').unbind('click');
		var functions = [aHandle, bHandle, cHandle, dHandle, eHandle];
		var order = getRandomOrder();
		$('#info-bar').html('<div>'+order+'</div>');
		$('#message').text('');
		event.stopPropagation();
		function done(err, sum) {
			infoClickHandle(err, sum);
		}
		var callbacks = [];
		for (var i = 0; i < 4; i++) {
			(function(i) {
				callbacks[i] = function(err, sum) {
					functions[order[i+1].charCodeAt()-65](err, sum, callbacks[i+1]);
				}
			})(i);
		}
		callbacks[4] = done;
		functions[order[0].charCodeAt()-65](null, 0, callbacks[0]);
	}

	function getRandomOrder() {
		var valid = [1, 1, 1, 1, 1];
		var order = new Array();
		for (var i = 0; i < 5; i++) {
			var num = Math.floor(Math.random()*5);
			while(!valid[num]) var num = Math.floor(Math.random()*5);
			order[i] = String.fromCharCode(65+num);
			valid[num] = 0;
		}
		return order;
	}
}