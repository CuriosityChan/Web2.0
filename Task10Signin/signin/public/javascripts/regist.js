$(function() {
	$('input:not(.button)').blur(function() {
		var self = this;
		if ((this.id == 'passwordAgain' && validator.isPasswordAgainValid(this.value, $('#password').val())) ||
         validator.isFieldValid(this.id, $(this).val())) {
      if (this.id == 'password' || this.id == 'passwordAgain') {
        $(self).parent().find('.error').text('').hide();
        return;
      }
			$.post('/api/validate-unique', {field: this.id, value: $(this).val() }, function(data, status) {
				if (status == 'success') {
					if (data.isUnique) {
						$(self).parent().find('.error').text('').hide();
					}	else {
						$(self).parent().find('.error').text('value is not unique').show();
						validator.form[self.id].status = false;
					}
				}
			});
		} else {
			$(this).parent().find('.error').text(validator.form[this.id].errorMessage).show();
		}
	});

	$('input.button').click(function() {
		$('input:not(.button)').blur();
		if (!validator.isFormValid() && this.type == 'submit') return false;
		if (this.type == 'reset') $('.error').hide();
	});

});