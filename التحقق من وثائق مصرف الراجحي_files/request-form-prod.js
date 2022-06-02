jQuery(document).ready(function(){	
	
	if(jQuery('form.complaint-form').length == 1)
	{
			var lang = jQuery('html').attr('lang');
			jQuery('table.residence-status label').first().addClass('checked');
			jQuery('table.residence-status label input[type="radio"]').attr("invalid", "false");
			jQuery('table.residence-status label input[type="radio"]').first().click();
			jQuery(".control-dropdown-countries select option:selected").text('');
			jQuery(".control-dropdown-countries select").val('');
			var isCountryAdjusted = "0";
			

			var isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
			
			
			if(lang == 'ar')
			{
				jQuery('form.complaint-form').removeClass('text-left').addClass('text-right');				
					
				jQuery('div.boxed .left-content').removeClass("left-content").addClass('right-content');			

				jQuery('.date2picker input.text-box').datepicker({dateFormat : 'dd-mm-yyyy'}).datepicker('setDate', new Date());
				
				const date = new Date();
				const formattedDate = date.toLocaleString('en-GB', {day: 'numeric', month : 'short', year : 'numeric'}).replace(/ /g,'-');	
				jQuery('input.datepicker').val(formattedDate);			
				
			}
			
			jQuery('input.datepicker').val('');
		
			jQuery('.control-id-number .text-box').keyup(function(){
				if(lang == 'en')
				{
					this.value = this.value.replace(/[^0-9\.]/g,'');
				}
			});
			jQuery('.control-iqama .text-box').keyup(function(){
				if(lang == 'en')
				{
					this.value = this.value.replace(/[^0-9\.]/g,'');
				}
			});
			jQuery('.txt-country-code input.text-box').keyup(function(){
				if(lang == 'en')
				{
					this.value = this.value.replace(/[^0-9\.]/g,'');
				}
			});
			jQuery('.txt-mobile input.text-box').keyup(function(){
				if(lang == 'en')
				{
					this.value = this.value.replace(/[^0-9\.]/g,'');
				}
			});
			
			jQuery('div.complain-raised-no input.text-box').keyup(function(){
				if(lang == 'en')
				{
					this.value = this.value.replace(/[^0-9\.]/g,'');
				}
			});
						
			
			jQuery('.full-name input.text-box').keyup(function(){
				this.value = this.value.replace(/<(.|\n)*?>/g,'');
			});
			
			jQuery("div.complain-raised-date input.datepicker").keyup(function(){
				this.value = this.value.replace(/<(.|\n)*?>/g,'');
			});
			
			jQuery('.control-txt-summary textarea').keyup(function(){
				this.value = this.value.replace(/<(.|\n)*?>/g,'');
			});
			
			jQuery('div.control-id-number').addClass("required-field");
			jQuery('div.control-dropdown-countries').addClass("required-field");
			jQuery('div.control-iqama').addClass("required-field");
			jQuery("div.control-dd-cardissue").addClass("required-field");
			jQuery("div.control-dd-cfissue").addClass("required-field");
			jQuery("div.control-dd-caissue").addClass("required-field");
			jQuery("div.control-dd-sadadissue").addClass("required-field");
			jQuery("div.control-dd-claimsissue").addClass("required-field");
			jQuery("div.control-dd-posissue").addClass("required-field");
			jQuery("div.control-txt-ProductName").addClass("required-field");
			jQuery("div.complain-raised-no").addClass("required-field");
			
			// for IPhone countries dropdown issue
			
			jQuery('.full-name input.text-box').focus(function(){
				if(lang == 'ar' && isCountryAdjusted == "0" && isSafari)
				{					
					jQuery(".control-dropdown-countries select").prepend("<option value=''>برجاء الاختيار</option>");
					jQuery(".control-dropdown-countries select option[value='']").prop("selected", true);
					isCountryAdjusted = "1";
				}
			});
			
			
			
				
			var availableTags = [
			  "0093","00355","00213","00376","00244","001268","0054","00374","00297","0061","0043","00994","00973","00880","00375","0032","00501","00229","00975","00387","00267","0055","00246","00359","00226","00257","00855","00237","00238","00345","00236","00235","0056","0086","0061","0057","00269","00242","00682","00506","00385","0053","00537","00420","0045","00253","001","00593","0020","00503","00240","00291","00372","00251","00298","00679","00358","0033","00594","00689","00241","00220","00995","0049","00233","00350","0030","00299","00590","00502","00224","00245","00595","00509","00504","0036","00354","0091","0062","00964","00353","00972","0039","001","0081","00962","007","00254","00686","00965","00996","00371","00961","00266","00231","00423","00370","00352","00261","00265","0060","00960","00223","00356","00692","00596","00222","00230","00262","0052","00377","00976","00382","001664","00212","0095","00264","00674","00977","0031","00599","00687","0064","00505","00227","00234","00683","00672","0047","00968","0092","00680","00507","00675","00595","0051","0063","0048","00351","00974","0040","00250","00685","00378","00966","00221","00381","00248 ","00232","0065","00421","00386","00677","0027","005","0034","0094","00249","00597","00268","0046","0041","00992","0066","00228","00690","00676","00216","0090","00993","00688","00256","00380","00971","0044","001","00598","00998","00678","00681","00967","00260","00263","00591","00673","0061","00243","00225","005","00379","00852","0098","00850","0082","00856","00218","00853","00389","00691","00373","00258","00970","00872","00262","007","00590","00290","00590","00508","00239","00252","0047","00963","00886","00255","00670","0058","0084"
			];
				jQuery('.txt-country-code input.text-box' ).autocomplete({
				  source: availableTags
				});
				
				
				
		// Form validation on Submit
	    jQuery('.complaint-form input[type=submit]').on("click", function(e){

				var isValid = true;
				
				
				if(jQuery('.full-name input.text-box').val() == "")
				{
					e.preventDefault();
					jQuery('.full-name input.text-box').removeClass("valid").addClass("input-validation-error");
					jQuery('.full-name input.text-box').next("span").removeClass("field-validation-valid").addClass("help-block").addClass("fiedl-validation-error");
					if(lang == "ar")
					{
						jQuery('.full-name input.text-box').next("span").html("الرجاء كتابة الاسم كاملا");

					}
					else
					{
						jQuery('.full-name input.text-box').next("span").html("Please enter your full name");
					}
					jQuery('.full-name input.text-box').focus();
					isValid = false;
				}
				
				if(jQuery(".ksa-form-section .residence-status label").hasClass("checked") == false)
				{
					e.preventDefault();
					var spanError = jQuery('.ksa-form-section .residence-status .radio').next();
					jQuery(spanError).html("Please select your Nationality. ");
					jQuery("table.ksa-form-section label input").first().focus();
					isValid = false;
				}
				
				if(jQuery("table.residence-status label").hasClass("checked") == true)
				{					
					var selectedRadio = jQuery("table.residence-status label.checked input[type='radio']");			
					if(jQuery(selectedRadio).val() == "Citizen")
					{
						if(jQuery(".control-id-number .text-box").val() == "")
						{
							e.preventDefault();
							jQuery(".control-id-number .text-box").removeClass("valid").addClass("input-validation-error")
							if(lang == 'ar')
							{
							   jQuery(".control-id-number span").html("<span id='iqama-error'> الرجاء ادخال رقم الهوية </span>");
							}
							else
							{
							   jQuery(".control-id-number span").html("<span id='iqama-error'> Please enter National ID </span>");
							}

							
							jQuery(".control-id-number .text-box").focus();
							isValid = false;
						}				
					}
					
					if(jQuery(selectedRadio).val() == "Resident")
					{
						if(jQuery(".control-iqama .text-box").val() == "")
						{
							e.preventDefault();
							jQuery(".control-iqama .text-box").removeClass("valid").addClass("input-validation-error")
							if(lang == 'ar')
							{
							   jQuery(".control-iqama span").html("<span id='iqama-error'>الرجاء ادخال رقم الإقامة</span>");
							}
							else
							{
							   jQuery(".control-iqama span").html("<span id='iqama-error'> Please enter a valid Iqama number.</span>")
							}

							
							jQuery(".control-iqama .text-box").focus();
							isValid = false;
						}	
						
						if(jQuery(".control-dropdown-countries :selected").val() == "")
						{
							e.preventDefault();

							if(lang == 'ar')
							{								
							   jQuery("div.control-dropdown-countries span").html("<span id='country-error'>الرجاء اختيار الجنسية</span>");
							}
							else
							{
							   jQuery("div.control-dropdown-countries span").html("<span id='country-error'>Please select your nationality</span>");
							}

							
							jQuery(".control-iqama .text-box").focus();
							isValid = false;
						}
						else
						{
							jQuery("div.control-dropdown-countries span").html("");
						}					
					}								
				}
				
				if(jQuery('.scfEmailBorder input.text-box').val() == "")
				{
					e.preventDefault();
					jQuery('.scfEmailBorder input.text-box').removeClass("valid").addClass("input-validation-error");
					jQuery('.scfEmailBorder input.text-box').next("span").removeClass("field-validation-valid").addClass("help-block").addClass("fiedl-validation-error");
					if(lang == "ar")
					{
						jQuery('.scfEmailBorder input.text-box').next("span").html("الرجاء إدخال البريد الالكتروني");

					}
					else
					{
						jQuery('.scfEmailBorder input.text-box').next("span").html("Please enter your email");
					}
					jQuery('.scfEmailBorder input.text-box').focus();
					isValid = false;
				}
				
				if(jQuery('.txt-country-code input.text-box').val() == "")
				{
					e.preventDefault();
					jQuery('.txt-country-code input.text-box').removeClass("valid").addClass("input-validation-error");
					jQuery('.txt-country-code input.text-box').next("span").removeClass("field-validation-valid").addClass("help-block").addClass("fiedl-validation-error");
					if(lang == "ar")
					{
						jQuery('.txt-country-code input.text-box').next("span").html("الرجاء إدخال رمز اتصال صالح للدولة مكون من 3 أو 5 أرقام");

					}
					else
					{
						jQuery('.txt-country-code input.text-box').next("span").html("Please enter your country dialing code in 3 to 5 characters, starting with 00");
					}
					jQuery('.txt-country-code input.text-box').focus();
					isValid = false;
				}
				
				if(jQuery('.txt-mobile input.text-box').val() == "")
				{
					e.preventDefault();
					jQuery('.txt-mobile input.text-box').removeClass("valid").addClass("input-validation-error");
					jQuery('.txt-mobile input.text-box').next("span").removeClass("field-validation-valid").addClass("help-block").addClass("fiedl-validation-error");
					if(lang == "ar")
					{
						jQuery('.txt-mobile input.text-box').next("span").html("الرجاء إدخال رقم جوال صحيح");

					}
					else
					{
						jQuery('.txt-mobile input.text-box').next("span").html("Please enter your mobile number.");
					}
					jQuery('.txt-mobile input.text-box').focus();
					isValid = false;
				}
				
				
				if(jQuery('.complain-raised-status select :selected').val() == "")
				{
					e.preventDefault();
					var spanError = jQuery("div.complain-raised-status span")
					if(lang == "ar")
					{
						jQuery(spanError).html("يرجى ذكر ما إذا كنت قد قدمت شكوى مسبقًا");
					}
					else
					{
						jQuery(spanError).html("Please mention if complaint has been raised previously ");
					}
					jQuery(".complain-raised-status input").first().focus();
					isValid = false;
				}
				
				if(jQuery('.complain-raised-status select :selected').val() == "Yes")
				{
					
					if(jQuery("div.complain-raised-no input.text-box").val() == "")
					{
						e.preventDefault();
						var spanErrorComplaintNo = jQuery("div.complain-raised-no input.text-box").next("span");							
						jQuery("div.complain-raised-no input.text-box").removeClass("valid").addClass("input-validation-error")
						if(lang == "ar")
						{
							jQuery(spanErrorComplaintNo).html("الرجاء إدخال الرقم المرجعي السابق للشكوى");
						}
						else
						{
							jQuery(spanErrorComplaintNo).html("Please enter previous Complaint reference no.");
						}
						
						jQuery("div.complain-raised-no input.text-box").focus();
						isValid = false;
						
					}
					
				}
				
				if(jQuery("div.complain-raised-date input.datepicker").val() == "")
				{
					e.preventDefault();
					var spanErrorComplaintDate = jQuery("div.complain-raised-date input.datepicker").next("span");
					jQuery("div.complain-raised-date input.datepicker").removeClass("valid").addClass("input-validation-error");
					if(lang == "ar")
					{
						jQuery(spanErrorComplaintDate).html("هذا الحقل مطلوب");
					}
					else
					{
						jQuery(spanErrorComplaintDate).html("Please specify the issue date.");
					}
					
					isValid = false;		
					
				}
				else
				{
					jQuery(".date-value input.text-box").val(jQuery("div.complain-raised-date input.datepicker").val());
				}
				
				if(jQuery("div.control-product-dropdown select :selected").val() == "")
				{
				
					e.preventDefault();
					jQuery('div.control-product-dropdown select').removeClass("valid").addClass("input-validation-error")
					if(lang == "ar")
					{
						jQuery('div.control-product-dropdown select').next('span').html("هذا الحقل مطلوب");
					}
					else
					{
						jQuery('div.control-product-dropdown select').next('span').html("Please select the Product name");
					}
					
					jQuery('div.control-product-dropdown select').focus();
					isValid = false;
					
				}
				
				if(jQuery("div.control-product-dropdown select :selected").val() != "Others")
				{
					jQuery("[class^=control-dd]").each(function(){
						if(!jQuery(this).hasClass("hidden"))
						{
							if(jQuery(this).children("select").val() == null)
							{
								e.preventDefault();
								jQuery(this).children("select").removeClass("valid").addClass("input-validation-error");
								jQuery(this).children("span").removeClass("field-validation-valid").addClass("help-block").addClass("fiedl-validation-error");
								if(lang == "ar")
								{
									jQuery(this).children("span").html("هذا الحقل مطلوب");
								}
								else
								{
									jQuery(this).children("span").html("Please select the issue type");
									
								}
								isValid = false;
								return false;
							}
							
							if(jQuery(this).children("select").val() == "Other Issues")
							{
								if(jQuery('.control-txt-summary textarea').val() == "")
								{
									e.preventDefault();
									var spanError = jQuery('.control-txt-summary textarea').next("span");
									jQuery(spanError).removeClass("field-validation-valid").addClass("help-block").addClass("fiedl-validation-error");
									
									if(lang == "ar")
									{
										jQuery(spanError).html("هذا الحقل مطلوب");
									}
									else
									{
										jQuery(spanError).html("Please enter complaint/feedback summary");
									}
									
									jQuery('.control-txt-summary textarea').focus();
									isValid = false;
									
								}
							}
						}
					})
					
				}
				
				if(jQuery("div.control-product-dropdown select :selected").val() == "Others")
				{
					if(jQuery('.control-txt-ProductName input.text-box').val() == "")
					{
						e.preventDefault();
						jQuery('.control-txt-ProductName input.text-box').removeClass("valid").addClass("input-validation-error")
						if(lang == "ar")
						{
							jQuery('.control-txt-ProductName input.text-box').next('span').html("هذا الحقل مطلوب");
						}
						else
						{
							jQuery('.control-txt-ProductName input.text-box').next('span').html("Please enter the Product name");
						}
						
						jQuery('.control-txt-ProductName input.text-box').focus();
						isValid = false;
					}
					
					
				}
				
				if(isValid == false)
				{
					return false;
				}
				
			});
			
			
			
			jQuery('table.residence-status label').on("click" , function() {
				var selectedNationality = jQuery(this).children("input").val();
				if(selectedNationality == "Citizen")
				{
					jQuery("div.control-iqama").addClass("hidden");
					jQuery("div.control-dropdown-countries").addClass("hidden");
					jQuery("div.control-id-number").removeClass("hidden");
					jQuery(".control-iqama .text-box").val("");
					jQuery(".control-dropdown-countries option").prop('disabled', false)
					jQuery(".control-dropdown-countries option").eq(0).prop('selected', true);
					jQuery(".control-dropdown-countries select").prop("selectedIndex", -1);
					jQuery(".control-dropdown-countries select option:selected").text('');
					jQuery(".control-dropdown-countries select").val('');
				}
				if(selectedNationality == "Resident")
				{
					jQuery("div.control-iqama").removeClass("hidden");
					jQuery("div.control-id-number").addClass("hidden");
					jQuery("div.control-dropdown-countries").removeClass("hidden");
					jQuery(".control-id-number .text-box").val("");
					if(lang == 'ar' && isCountryAdjusted == "0" && isSafari)
					{	
						jQuery(".control-dropdown-countries select").prepend("<option value=''>برجاء الاختيار</option>");
						jQuery(".control-dropdown-countries select option[value='']").prop("selected", true);
						isCountryAdjusted = "1";
					}
				}
				
			});
			
			jQuery('.complain-raised-status select').on("change", function () {
				var complainStatus = jQuery('.complain-raised-status select :selected').val();
				if(complainStatus == "Yes")
				{
					jQuery("div.complain-raised-no").removeClass("hidden");
					jQuery("div.complain-raised-no input.text-box").focus();
				}
				else
				{
					jQuery("div.complain-raised-no input.text-box").val('')
					jQuery("div.complain-raised-no").addClass("hidden");
					
				}
			});
			
			jQuery('.complaint-upload input[type=file]').bind('change', function(){
				 var fileSize = (this.files[0].size / (1024 * 1024)).toFixed(2);
				 var fileExtension = ['jpeg', 'jpg', 'png', 'pdf', 'xls', 'xlsx'];
								
				 
				if (fileSize >= 2.01) {
					
					if(jQuery('span.upload-validation').length >= 1)
					{
						jQuery('span.upload-validation').remove();
					}
					
					if(lang == "ar")
					{
						jQuery(".complaint-upload legend").next().append("<span class='help-block upload-validation'> “ المرفقات المسموح بها PDF, Excel, JPEG, GIF, PNG ” </span>")
						jQuery(".complaint-upload legend").next().append("<span class='help-block upload-validation'> “ حجم كل مرفق هو2 MB” </span>");
						jQuery(this).val('');
						isValid = false;
					}
					else
					{
						jQuery(".complaint-upload legend").next().append("<span class='help-block upload-validation'>Supporting document format are PDF, Excel, JPEG, GIF, PNG </span>")
						jQuery(".complaint-upload legend").next().append("<span class='help-block upload-validation'> Document size for each attachment is 2MB</span>")
						jQuery(this).val('');
						isValid = false;
					}
					
				}
				if (jQuery.inArray(jQuery(this).val().split('.').pop().toLowerCase(), fileExtension) == -1) {
					
					if(jQuery('span.upload-validation').length >= 1)
					{
						jQuery('span.upload-validation').remove();
					}
					
					if(lang == "ar")
					{
						jQuery(".complaint-upload legend").next().append("<span class='help-block upload-validation'> “ المرفقات المسموح بها PDF, Excel, JPEG, GIF, PNG ” </span>")
						jQuery(".complaint-upload legend").next().append("<span class='help-block upload-validation'> “ حجم كل مرفق هو2 MB” </span>")
						jQuery(this).val('');
						isValid = false;
					}
					else
					{
						jQuery(".complaint-upload legend").next().append("<span class='help-block upload-validation'>Supporting document format are PDF, Excel, JPEG, GIF, PNG </span>")
						jQuery(".complaint-upload legend").next().append("<span class='help-block upload-validation'> Document size for each attachment is 2MB</span>")
						jQuery(this).val('');
						isValid = false;
					}
				}
				
				
			});
			
			jQuery("div.control-product-dropdown select").on("change", function () {
				var productSelected = jQuery(this).find("option:selected").val();
				if(productSelected == "Others")
				{
					jQuery("div.control-txt-ProductName").removeClass("hidden");
					jQuery("div.control-dd-cardissue select").prop("selectedIndex", -1);
					jQuery("div.control-dd-cardissue").addClass("hidden");
					
					jQuery("div.control-dd-cfissue select").prop("selectedIndex", -1);
					jQuery("div.control-dd-cfissue").addClass("hidden");
					
					jQuery("div.control-dd-caissue select").prop("selectedIndex", -1);
					jQuery("div.control-dd-caissue").addClass("hidden");
					
					jQuery("div.control-dd-sadadissue select").prop("selectedIndex", -1);
					jQuery("div.control-dd-sadadissue").addClass("hidden");
					
					jQuery("div.control-dd-posissue select").prop("selectedIndex", -1);
					jQuery("div.control-dd-posissue").addClass("hidden");
					
				}
				else if(productSelected == "Cards")
				{	
					jQuery("div.control-dd-cardissue").removeClass("hidden");
					
					jQuery("div.control-dd-cfissue select").prop("selectedIndex", -1);
					jQuery("div.control-dd-cfissue").addClass("hidden");
					
					jQuery("div.control-dd-caissue select").prop("selectedIndex", -1);
					jQuery("div.control-dd-caissue").addClass("hidden");
					
					jQuery("div.control-dd-sadadissue select").prop("selectedIndex", -1);
					jQuery("div.control-dd-sadadissue").addClass("hidden");
					
					jQuery("div.control-dd-posissue select").prop("selectedIndex", -1);
					jQuery("div.control-dd-posissue").addClass("hidden");
					
					jQuery("div.control-txt-ProductName input[type=text]").val("");
					jQuery("div.control-txt-ProductName").addClass("hidden");
				}
				else if(productSelected == "Customer Finance")
				{
					jQuery("div.control-dd-cardissue select").prop("selectedIndex", -1);
					jQuery("div.control-dd-cardissue").addClass("hidden");
					
					
					jQuery("div.control-dd-cfissue").removeClass("hidden");
					
					jQuery("div.control-dd-caissue select").prop("selectedIndex", -1);
					jQuery("div.control-dd-caissue").addClass("hidden");
					
					jQuery("div.control-dd-sadadissue select").prop("selectedIndex", -1);
					jQuery("div.control-dd-sadadissue").addClass("hidden");
					
					jQuery("div.control-dd-posissue select").prop("selectedIndex", -1);
					jQuery("div.control-dd-posissue").addClass("hidden");
					
					jQuery("div.control-txt-ProductName input[type=text]").val("");
					jQuery("div.control-txt-ProductName").addClass("hidden");
				}
				else if(productSelected == "Current Account")
				{
					jQuery("div.control-dd-cardissue select").prop("selectedIndex", -1);
					jQuery("div.control-dd-cardissue").addClass("hidden");
					
					jQuery("div.control-dd-cfissue select").prop("selectedIndex", -1);
					jQuery("div.control-dd-cfissue").addClass("hidden");
					
					jQuery("div.control-dd-caissue").removeClass("hidden");
					
					jQuery("div.control-dd-sadadissue").addClass("hidden");
					jQuery("div.control-dd-sadadissue select").prop("selectedIndex", -1);
					
					jQuery("div.control-dd-posissue select").prop("selectedIndex", -1);
					jQuery("div.control-dd-posissue").addClass("hidden");
					
					jQuery("div.control-txt-ProductName input[type=text]").val("");
					jQuery("div.control-txt-ProductName").addClass("hidden");
				}
				else if(productSelected == "SADAD Payment")
				{
					jQuery("div.control-dd-cardissue select").prop("selectedIndex", -1);
					jQuery("div.control-dd-cardissue").addClass("hidden");
					
					jQuery("div.control-dd-cfissue select").prop("selectedIndex", -1);
					jQuery("div.control-dd-cfissue").addClass("hidden");
					
					jQuery("div.control-dd-caissue select").prop("selectedIndex", -1);
					jQuery("div.control-dd-caissue").addClass("hidden");
					
					
					jQuery("div.control-dd-sadadissue").removeClass("hidden");
					
					jQuery("div.control-dd-posissue select").prop("selectedIndex", -1);
					jQuery("div.control-dd-posissue").addClass("hidden");
					
					jQuery("div.control-txt-ProductName input[type=text]").val("");
					jQuery("div.control-txt-ProductName").addClass("hidden");
				}
				
				else if(productSelected == "Point of Sales")
				{
					jQuery("div.control-dd-cardissue select").prop("selectedIndex", -1);
					jQuery("div.control-dd-cardissue").addClass("hidden");
					
					jQuery("div.control-dd-cfissue select").prop("selectedIndex", -1);
					jQuery("div.control-dd-cfissue").addClass("hidden");
					
					jQuery("div.control-dd-caissue select").prop("selectedIndex", -1);
					jQuery("div.control-dd-caissue").addClass("hidden");
					
					jQuery("div.control-dd-sadadissue select").prop("selectedIndex", -1);
					jQuery("div.control-dd-sadadissue").addClass("hidden");
					
					jQuery("div.control-dd-posissue").removeClass("hidden");
					
					jQuery("div.control-txt-ProductName input[type=text]").val("");
					jQuery("div.control-txt-ProductName").addClass("hidden");
				}
				
				
			});
	}
	
});