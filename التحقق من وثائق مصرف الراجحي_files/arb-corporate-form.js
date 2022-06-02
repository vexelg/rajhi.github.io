
	jQuery(document).ready(function () {  		
		jQuery('#lbl-corp-city').show();
		jQuery('#CorpCityOfIssue').hide();
		jQuery(".pws-corp-form-step-01").show();
		jQuery(".pws-corp-form-step-02").hide();
		jQuery(".pws-corp-form-step-03").hide();
	});
 
function CorporateSubmitForm() {
        var myModel =
                    {
                        "EntityName": jQuery('#corp-entity-name').val(),
						"CorpNationality": jQuery('#CorpNationality option:selected').val(),
						"CorpCountry": jQuery('#CorpCountry option:selected').val(),
						"CorpCityOfIssue": jQuery('#CorpCityOfIssue option:selected').val() =="" ? jQuery('#corp-city').val() : null,
						"District": jQuery('#corp-district').val(),
						"Street": jQuery('#corp-street').val(),
						"CorpEntityType": jQuery('#CorpEntityType option:selected').val(),
						"License": jQuery('#corp-license').val(),
						"CorpTurnover": jQuery('#CorpTurnover option:selected').val(),
						"CorpTimetoCall": jQuery('#CorpTimetoCall option:selected').val(),						
						"Email": jQuery('#corp-email').val(),
						"Landline": jQuery('#corp-landline').val(),
						"Mobile": jQuery('#corp-mobile').val()
                    };

        var jsonToPost = JSON.stringify(myModel);

        jQuery.ajax({
            url: '/api/Forms/CorporateForm',
            async: true,
            processData: false,
            data: jsonToPost,
            type: 'POST',
            contentType: 'application/json; charset=utf-8',
            success: function (data) {
               if(data=="success")
			   {
				   jQuery(".pws-corp-form-step-03").show()
			   }
			   else{
				   var err=data;
				   for(i=0;i<data.length;i++){
					   jQuery(err[i].ErrorMessage).addClass("Error")
				   }
				jQuery(".pws-corp-form-step-01").show()
				jQuery(".pws-corp-form-step-02").hide()
			   }
            },
            error: function (data) {
                console.log("error")
            }
        });
    }
	
	jQuery("#corp-next").click(function(){
		if(CorpValidate()){
			jQuery(".pws-corp-form-step-01").hide();
			jQuery(".pws-corp-form-step-02").show();
		}	
	});

	jQuery("#corp-previous").click(function(){
		jQuery(".pws-corp-form-step-02").hide();
		jQuery(".pws-corp-form-step-01").show();
	});

	jQuery("#corp-submit").click(function(){
		if(CorpValidateStep2()){
			jQuery(".pws-corp-form-step-01").hide();
			jQuery(".pws-corp-form-step-02").hide();
			CorporateSubmitForm()
			//jQuery(".pws-corp-form-step-03").show();
		}	
	});

	jQuery("#CorpCountry").change(function () {	
		jQuery('#lbl-corp-city').show();
		var country= this.value;
		if(country=="Saudi Arabia")
		{
			jQuery('#CorpCityOfIssue').show();
			jQuery('#corp-city').hide();
		}
		else{
			jQuery('#CorpCityOfIssue').hide();
			jQuery('#corp-city').show();
		}	
	});


	function CorpValidate(){
		var isValid=true;
		
		var lblEntityNameCorp = jQuery("#lbl-corp-entity-name");
		var lblnationalityCorp = jQuery("#lbl-corp-nationality");
		var lblCountryCorp = jQuery("#lbl-corp-country-issue");
		var lblCityCorp	= jQuery("#lbl-corp-city");
		var lblDisctrictCorp = jQuery("#lbl-corp-district");
		var lblStreetCorp = jQuery("#lbl-corp-street");
		var lblEntityCorp = jQuery("#lbl-corp-entity");
		var lblLicenseCorp = jQuery("#lbl-corp-license");
		var lblTurnOverCorp	= jQuery("#lbl-corp-turnover");
		var lblMobileCorp = jQuery("#lbl-corp-mobile");
		var lblCallTimeCorp	= jQuery("#lbl-corp-time-to-call");
		var lblLandlineCorp	= jQuery("#lbl-corp-landline");
		var lblEmailCorp = jQuery("#lbl-corp-email");

		
		var entityNameCorp = jQuery("#corp-entity-name").val();
		var nationalityCorp = jQuery("#CorpNationality");
		var countryCorp = jQuery("#CorpCountry");
		var cityofIssueCorp = jQuery("#CorpCityOfIssue");
		var cityofIssueTxtCorp = jQuery("#corp-city").val();;
		var districtCorp = jQuery("#corp-district").val();;
		var streetCorp = jQuery("#corp-street").val();;
		var entityTypeCorp = jQuery("#CorpEntityType");
		var licenseCorp = jQuery("#corp-license");
		var turnoverCorp = jQuery("#CorpTurnover");
		var mobileCorp = jQuery("#corp-mobile");
		var callTimeCorp = jQuery("#CorpTimetoCall");
		var landlineCorp = jQuery("#corp-landline");
		var emailCorp = jQuery("#corp-email");

		
		isValid = ValidateTextCorp(entityNameCorp,lblEntityNameCorp) && isValid;
		isValid = ValidateDropDownCorp(lblnationalityCorp,nationalityCorp) && isValid;
		isValid = ValidateDropDownCorp(lblCountryCorp,countryCorp) && isValid;

		
		
		if(countryCorp.val() == 'Saudi Arabia'){
			isValid = ValidateDropDownCorp(lblCityCorp,cityofIssueCorp) && isValid;
		}
		else{
			/* isValid = ValidateTextCorp(cityofIssueCorp,cityofIssueTxtCorp) && isValid; */
			isValid = ValidateTextCorp(cityofIssueTxtCorp,lblCityCorp) && isValid;
		}

		isValid = ValidateTextCorp(districtCorp,lblDisctrictCorp) && isValid;
		isValid = ValidateTextCorp(streetCorp,lblStreetCorp) && isValid;
		isValid = ValidateDropDownCorp(lblEntityCorp,entityTypeCorp) && isValid;
		isValid = ValidateLicenseNumberCorp(licenseCorp,lblLicenseCorp) && isValid;
		isValid = ValidateDropDownCorp(lblTurnOverCorp,turnoverCorp) && isValid;
		isValid = ValidatePhoneNumberCorp(lblMobileCorp,mobileCorp) && isValid;	
		isValid = ValidateDropDownCorp(lblCallTimeCorp,callTimeCorp) && isValid;
		isValid = ValidatePhoneNumberCorp(lblLandlineCorp,landlineCorp) && isValid;
		isValid = ValidateEmailCorp(lblEmailCorp,emailCorp) && isValid;
					
		return isValid;
	}

	function CorpValidateStep2(){
		var isValid = true;
		
		var lblDocsCorp = jQuery("#lbl-corp-doc");
		var lblAgreeCorp = jQuery("#lbl-corp-agree");	
		var checkDocsCorp = jQuery("#corp-chk-docs");
	 	var checkAgreeCorp = jQuery("#corp-chk-agree");
		
		isValid = ValidateCheckboxCorp(lblDocsCorp,checkDocsCorp) && isValid;
		isValid = ValidateCheckboxCorp(lblAgreeCorp,checkAgreeCorp) && isValid;
		
		return isValid;
	}

	function ValidateTextCorp(fname, control) {
        if (fname) { 
			jQuery(control).removeClass("Error"); 
			return true; 
		}
        else { 
			jQuery(control).addClass("Error"); 
			return false; 
		}
    }

	function ValidateEmailCorp(lbl, txt) {
		var emailRegx = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;///^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+jQuery/;

		if (!emailRegx.test(txt.val())) {
			lbl.addClass("Error");
			return false;
		}
		else {
			lbl.removeClass("Error");
			return true;
		}
	}

    function ValidateDropDownCorp(lbl, dp) {
        if (dp.get(0).selectedIndex != 0) {
            lbl.removeClass("Error");
            return true
        }
        else {
            lbl.addClass("Error");
            return false;
        }
    }

    function ValidatePhoneNumberCorp(lbl, txt) {
        var re = /^\+?[\d\s]{13,14}$/;
        if (!txt.val().trim().match(re)) {
            lbl.addClass("Error");
            return false;
        }
        else {
            lbl.removeClass("Error");
            return true;
        }
    }

    function ValidateCheckboxCorp(lbl, ch) {
        if (ch.is(':checked'))  {
            lbl.removeClass("Error");
            return true;
        }
        else {
            lbl.addClass("Error");
            return false;
        }
    }
	
	function ValidateLicenseNumberCorp(txt,lbl){
		var re = /^[0-9]{15}$/;
		if (!txt.val().match(re)) {
			lbl.addClass("Error");
			return false;
		}
		else{
			lbl.removeClass("Error");
            return true;
		}
	}
	