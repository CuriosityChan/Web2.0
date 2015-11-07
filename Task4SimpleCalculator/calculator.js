window.onload = function() {
	var expression = ""
	var visibleButton = document.querySelectorAll('.visible')
	var expInput = document.getElementById('expression');
	
	for (var i = visibleButton.length - 1; i >= 0; i--) {
		visibleButton[i].onclick = function(event){
			expression += event.target.textContent;
			expInput.value = expression;
		}
	}

	document.getElementById('back').onclick = function(event) {
		if (expInput.value.length > 0) {
			expression = expression.substring(0, expression.length-1);
			expInput.value = expression;
		}
	}

	document.getElementById('clear').onclick = function(event) {
		expression = "";
		expInput.value = "0";
	}

	document.getElementById('result').onclick = function(event) {
		try {var result = eval(expression);
			expInput.value = result;
			expression = result.toString();
		} catch (e) {
			expInput.value = "error!"
			alert("Input error!")
			expression= "";
		}
	}
}