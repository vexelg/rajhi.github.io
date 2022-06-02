$(document).ready(function(){	
	if($('form.vat-form').length == 1)
	{
			var lang = $('html').attr('lang');
			$('input.datepicker').val('');		
			setMaxLength();
			RegisterKeyPress();
			
			$('.vat-customer-name > input.text-box').on('focus', function(){
					$('.VatEffectiveDate > input.form-control').val($('.vat-effective-date input.datepicker').val());
					$('.VatTransactionDate > input.form-control').val($('.vat-transaction-date input.datepicker').val());
					
			});
			
			$('.vat-form .btn-default').attr("disabled", true);
			$('.vat-form .btn-default').css('cursor', 'not-allowed');
			$('form.vat-form input[type=file]').bind('change', function(){
				if(this.files.length>0)
				{
				 var fileSize = (this.files[0].size / (1024 * 1024)).toFixed(2);
				 var fileExtension = ['jpeg', 'jpg', 'png', 'pdf'];
				
					if (fileSize >= 2.01) {
					
						if(lang == "ar")
						{
							$(this).next("span").append("span").html("<span class='help-block upload-validation'> “ المرفقات المسموح بها PDF, JPEG, JPG, PNG. حجم كل مرفق هو2 MB ” </span>");
							$(this).val('');
							isValid = false;
						}
						else
						{
							$(this).next("span").append("span").html("<span class='help-block upload-validation'>Document size for each attachment is 2 MB. Supporting document format are PDF, JPEG, JPG, PNG. </span>");
							$(this).val('');
							isValid = false;
						}
					
					}					
					if ($.inArray($(this).val().split('.').pop().toLowerCase(), fileExtension) == -1) {
						if(lang == "ar")
						{
							$(this).next("span").append("span").html("<span class='help-block upload-validation'> “ المرفقات المسموح بها PDF, JPEG, JPG, PNG. حجم كل مرفق هو2 MB ” </span>");
							$(this).val('');
							isValid = false;
						}
						else
						{
							$(this).next("span").append("span").html("<span class='help-block upload-validation'>Document size for each attachment is 2 MB. Supporting document format are PDF, JPEG, JPG, PNG </span>");
							$(this).val('');
							isValid = false;
						}
			    	}
					
					if($('form.vat-form input[type=file]')[0].files.length && $('form.vat-form input[type=file]')[1].files.length)
					{
						$('.vat-form .btn-default').attr("disabled", false);
						$('.vat-form .btn-default').css('cursor', 'pointer');
					}
				}
				else
				{
					$('.vat-form .btn-default').attr("disabled", true);
					$('.vat-form .btn-default').css('cursor', 'not-allowed');
				}
				});
				
				
				jQuery('div.vat-bankaccount-no input.text-box').on("keypress", function(){
					maskIDNumber(this.value, this, '4,9,14,19,24,29,34',' ');
				});
				
				jQuery('div.vat-bankaccount-no input.text-box').on("blur", function(){
					jQuery(this).val(jQuery(this).val().trim())
					validateBankAccount();
				});
			
			
	}
	
	
});

function maskIDNumber(str, textbox, loc, delim) {
        var key = this.event.keyCode | this.event.which;        
if (str.length < 49 && key >= 48 && key <= 57 || key == 8 || key == 97 || key == 115 || key == 83 || key == 65) {
			var locs = loc.split(',');
			for (var i = 0; i <= locs.length; i++) {
				for (var k = 0; k <= str.length; k++) {
					if (k == locs[i]) {
						if (str.substring(k, k + 1) != delim) {
							str = str.substring(0, k) + delim + str.substring(k, str.length)
						}
					}
				}
			}
			textbox.value = str;
		}
		else {
			this.event.preventDefault();

		}
    }

function setMaxLength()
{
	jQuery('div.vat-customer-id input.text-box').attr('maxlength',10);
	jQuery('div.vat-reg-no input.text-box').attr('maxlength',15);
	jQuery('div.vat-mobile input.text-box').attr('maxlength',10);
	jQuery('div.vat-bankaccount-no input.text-box').attr('maxlength',29);
	
	
}

jQuery('div.vat-bankaccount-no input.text-box').keydown(function(){
	if(this.count > 2 && this.substring(0,2) == "SA")	
	{
		$(this).value.replace(/[^0-9\.]/g, '');
	}
})




function validateBankAccount()
{
	
    var isValid = true;
	var bankaccount = jQuery('div.vat-bankaccount-no input.text-box').val().trim().replace(/\s/g,'');
	
	if(bankaccount.length < 24)
	{
		isValid = false;
	}
		
	if(bankaccount.substring(0,2) != "SA")
	{
		isValid = false;
	}
	
	if(!isValid)
	{
		jQuery('div.vat-bankaccount-no input.text-box').next().remove();
		if($('html').attr('lang') == 'en')
		{
			jQuery('div.vat-bankaccount-no input.text-box').after('<span class="help-block field-validation-error" data-valmsg-for="wffma5d19ee5797b463283445786c8e45a43.Sections[0].Fields[6].Value" data-valmsg-replace="true"><span id="wffma5d19ee5797b463283445786c8e45a43_Sections_0__Fields_6__Value-error" class="">Please provide the Bank Account Number for the Property Owner.</span></span>')
		}
		else
		{
			jQuery('div.vat-bankaccount-no input.text-box').after('<span class="help-block field-validation-error" data-valmsg-for="wffma5d19ee5797b463283445786c8e45a43.Sections[0].Fields[6].Value" data-valmsg-replace="true"><span id="wffma5d19ee5797b463283445786c8e45a43_Sections_0__Fields_6__Value-error" class="">الحقل مطلوب</span></span>')
		}
	}
	else
	{
		jQuery('div.vat-bankaccount-no input.text-box').next().remove();
	}
}

function RegisterKeyPress()
{
		
		jQuery('div.vat-transaction-date input.text-box').keydown(function(e){
			return false;
		});
		
		jQuery('div.vat-effective-date input.text-box').keydown(function(e){
			return false;
		});
		
		jQuery('div.vat-customer-id input.text-box').keyup(function(e){
			 this.value = this.value.replace(/[^0-9\.]/g, '');
		});
		
		jQuery('div.vat-reg-no input.text-box').keyup(function(e){
			 this.value = this.value.replace(/[^0-9\.]/g, '');
		});
	
		jQuery('div.vat-mobile input.text-box').keyup(function(){
			 this.value = this.value.replace(/[^0-9\.]/g, '');				
		});
		
		
		jQuery('div.vat-owner-name input.text-box').keyup(function(){
			this.value = this.value.replace(/<(.|\n)*?>/g,'');
		});
		
		jQuery("div.vat-customer-name input.text-box").keyup(function(){
			this.value = this.value.replace(/<(.|\n)*?>/g,'');
		});
}