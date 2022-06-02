var nationality = '';
sector = '';
subsector = '';
var pfMsgObj = null;
var isValidSalary = false;
var isValidInstallment = false;
var isValidSubsector = false;
var isFinanceTenor =false;
 var iFinanceTenor;
jQuery(document).ready(function () {
    var container = jQuery(".personal-finance-calculator");
    if (container.length > 0) {
        if (typeof pf !== 'undefined') {
            // for (i = 0; i < pf.length; i++) {
                // var nationality = jQuery("<label class='radio-inline'><input type='radio' value=" + pf[i].Title.replace(/\s/g, '') + " name='rbtnNationality''><span>" + pf[i].Title + "</span></input></label>");
                // nationality.appendTo('#PFnational');
            // }

            //jQuery("#PFsubsector").hide()
            //jQuery("#calc-input").hide()           
            jQuery("#pferrmsg").hide(); //Hide error msg
            //jQuery(".pf-result-box").hide(); // Hide Results Box
            jQuery(".form-submit-border").hide();
			pfMsgObj=new PFMessages();
            var radOptNationality = document.getElementsByName("rbtnNationality");
            radOptNationality[0].checked = true;
            nationality = "Saudi";

            var radOptSector = document.getElementsByName("rbtnSector");
            radOptSector[0].checked = true;
            sector = "Gov";
            BindSubSectors(sector,nationality);
			BindFinanceTenor();
			jQuery("#btn-pf-reset").hide();
			
        }

        if (jQuery(window).width() <= 768) {
            jQuery( "#PFsubsector" ).insertAfter( jQuery( ".calculator-left-sec .col-md-6:first-child .form-group:nth-child(2)" ) );
        }



    }
			//jQuery("#btn-pf-calculate").attr("disabled", "disabled");
			jQuery("#btn-pf-reset").hide();
			jQuery(".terms-block").hide();
			
});
			
			  // if(jQuery('#txt-monthly-salary').val().length > 0 && jQuery('#txt-current-monthly-instal').val().length > 0 && jQuery('#drpSubsectors').val() != 0)
			  // {
				  // jQuery("#btn-pf-calculate").removeAttr("disabled");
			  // }

//jQuery(document).ajaxComplete(function() {
	
	jQuery('#btn-pf-reset').click(function (e) {
		Reset();
		return false;
	});

	jQuery('#btn-pf-recalculate').click(function (e) {
        // jQuery(window).scrollTop(jQuery(".personal-finance-calculator").offset().top);
        jQuery("html, body").stop().animate({scrollTop: jQuery(".personal-finance-calculator").offset().top},900,"swing");
        return false;
	});

	jQuery('#btn-pf-calculate').click(function (e) {
		Validate_Calculate();
		return false;
	});

	 jQuery("#txt-age").change(function (e) { 
		  var max_chars = 2;
		  if (jQuery(this).val().length >= max_chars) { 
			jQuery(this).val(jQuery(this).val().substr(0, max_chars));
		}
	  });
	  
	  jQuery("#txt-monthly-salary").change(function (e) { 
		 if (jQuery('#txt-monthly-salary').val().length > 10) { //limit 10 digits
        var sMessage = pfMsgObj.InvalidMaxSal;
        PFShowFieldError(sMessage,"#PFMonthSalErr");
		PFRemoveClass("#txt-monthly-salary","pws-cal-success");
		PFAddClass("#txt-monthly-salary","pws-cal-error");
		jQuery('#drpFinancetenors').prop('disabled', true);
		isValidSalary = false;
		isValidAll();
        return 0;
    }
	else{
		PFHideFieldError("#PFMonthSalErr"); 
		PFRemoveClass("#txt-monthly-salary","pws-cal-error");
		PFAddClass("#txt-monthly-salary","pws-cal-success");
		
		EnableNextInput('drpFinancetenors');
		isValidSalary = true;
		isValidAll();
		
	}
    if (jQuery("#txt-monthly-salary").val() < 2000) { //Minimum Salary 2000
        var sMessage = pfMsgObj.InvalidMinSal;
        PFShowFieldError(sMessage,"#PFMonthSalErr");
		PFRemoveClass("#txt-monthly-salary","pws-cal-success");
		PFAddClass("#txt-monthly-salary","pws-cal-error");
		jQuery('#drpFinancetenors').prop('disabled', true);
		isValidSalary = false;
		isValidAll();
        return 0;
    } else { 
		PFHideFieldError("#PFMonthSalErr"); 
		PFRemoveClass("#txt-monthly-salary","pws-cal-error");
		PFAddClass("#txt-monthly-salary","pws-cal-success");
		EnableNextInput('drpFinancetenors');		
		isValidSalary = true;
		isValidAll();
	}
	  });
	  
	  
//})
jQuery('input:radio[name="rbtnNationality"]').on("change", function () { //NATIONALITY CHANGE
    nationality = '';
    jQuery('#drpsubsector').html("");
    var newSelect = document.createElement('select');
    if (jQuery(this).val() === 'Saudi') {
        nationality = "Saudi";
        var temp = GenerateSubsector(nationality, sector);
        if (temp != null) {
            newSelect.innerHTML = temp;
            document.getElementById('drpsubsector').appendChild(newSelect);
            // jQuery("#PFsubsector").show()
            // jQuery("#calc-input").show()
        }
    }
    else if (jQuery(this).val() === 'Expat') {
        nationality = "Expat";
        var temp = GenerateSubsector(nationality, sector);
        if (temp != null) {
            newSelect.innerHTML = temp;
            document.getElementById('drpsubsector').appendChild(newSelect);
            // jQuery("#PFsubsector").show()
            // jQuery("#calc-input").show()
        }
    }

    jQuery("#pferrmsg").hide(); //Hide error msg
    //jQuery(".pf-result-box").hide(); // Hide Results Box
    jQuery(".form-submit-border").hide();
});

jQuery('input:radio[name="rbtnSector"]').change(function () { // SECTOR CHANGE
    sector = '';
    subsector = "0";
    jQuery('#drpsubsector').html("");
    var newSelect = document.createElement('select');
    newSelect.setAttribute("id", "drpSubsectors");
	//newSelect.setAttribute("disabled", "true");
    sector = jQuery(this).val();
    nationality = jQuery("input[name='rbtnNationality']:checked").val();
    var temp = GenerateSubsector(nationality, sector);
    if (temp != null) {
        newSelect.innerHTML = temp;
        document.getElementById('drpsubsector').appendChild(newSelect);
    }

    // if (jQuery(this).val() === 'Gov') {
    //     sector = "Gov";
    //     var temp = GenerateSubsector(nationality, sector);
    //     if (temp != null) {
    //         newSelect.innerHTML = temp;
    //         document.getElementById('drpsubsector').appendChild(newSelect);
    //         // jQuery("#PFsubsector").show()
    //         // jQuery("#calc-input").show()
    //     }
    // }
    // else if (jQuery(this).val() === 'Private') {
    //     sector = "Private";
    //     var temp = GenerateSubsector(nationality, sector);
    //     if (temp != null) {
    //         newSelect.innerHTML = temp;
    //         document.getElementById('drpsubsector').appendChild(newSelect);
    //         // jQuery("#PFsubsector").show()
    //         // jQuery("#calc-input").show()
    //     }
    // }

     jQuery("#pferrmsg").hide(); //Hide error msg
     //jQuery(".pf-result-box").hide(); // Hide Results Box
     jQuery(".form-submit-border").hide();
});
 // jQuery('#txt-monthly-salary').on('change keyup', function() {
	// if (jQuery(this).val()) {
		// jQuery("#btn-pf-calculate").removeClass("disabled");
	// }else{
		// jQuery("#btn-pf-calculate").addClass("disabled");
	// }
 // });
// jQuery('#txt-monthly-salary').on('change keyup', function() {
	// if (jQuery(this).val()) {
		// EnableNextInput('txt-current-monthly-instal')
	// }else{
		// jQuery('#txt-current-monthly-instal').prop('disabled', true);
	// }
// });

// jQuery('#drpSubsectors').on('change', function() {
	// if (jQuery(this).val()) {
		// jQuery("#btn-pf-calculate").removeClass("disabled");
	// }else{
		// jQuery("#btn-pf-calculate").addClass("disabled");
	// }
// });


jQuery('#txt-current-monthly-instal').on('change', function() {
	if (jQuery(this).val() >= 0 && jQuery(this).val() < parseInt(jQuery("#txt-monthly-salary").val())) {
		PFRemoveClass("#txt-current-monthly-instal","pws-cal-error");
		PFAddClass("#txt-current-monthly-instal","pws-cal-success");
		jQuery("#btn-pf-calculate").removeClass("disabled");
		isValidInstallment = true;
		isValidAll();
	}else{
		PFRemoveClass("#txt-current-monthly-instal","pws-cal-success");
		PFAddClass("#txt-current-monthly-instal","pws-cal-error");
		jQuery("#btn-pf-calculate").addClass("disabled");
		isValidInstallment = false;
		isValidAll();
	}
});
function EnableNextInput(nextElementID){	
    jQuery('#'+nextElementID).prop('disabled', this.value === "");
	jQuery('#'+nextElementID).focus();
}
function Validate_Calculate() {
    var iMonthlySal = (isNaN(parseInt(jQuery('#txt-monthly-salary').val())) ? 0 : parseInt(jQuery('#txt-monthly-salary').val()));
    var iNationailty = jQuery('input[name=rbtnNationality]:checked').val();
    var iSector = sector
    var iSubSector = subsector !== '0' ? subsector : null;
    var iAgeSelected = (isNaN(parseInt(jQuery('#txt-age').val())) ? 0 : parseInt(jQuery('#txt-age').val()));
    var iInstOther = (isNaN(parseInt(jQuery('#txt-current-monthly-instal').val())) ? 0 : parseInt(jQuery('#txt-current-monthly-instal').val()));
   // var iFinanceTenor = (isNaN(parseInt(jQuery('#txt-finance-tenor').val())) ? 0 : parseInt(jQuery('#txt-finance-tenor').val()));
    if (iSubSector == "" || iSubSector == null) {
        var sMessage = pfMsgObj.SelectSector;       
        PFShowFieldError(sMessage,"#PFSectorErr")
        return 0;
    } else { PFHideFieldError("#PFSectorErr");}

    // if (iAgeSelected < 18) { //Minimum Age 18 Years
    //     var sMessage = pfMsgObj.InvalidMinAge;
    //     PFShowMessage(sMessage);
    //     return 0;
    // } else { PFHideMessage(); }

    
    // if (iAgeSelected > 60) { //Maximum Age 60 Years
    //     var sMessage = pfMsgObj.InvalidMaxAge;
    //     PFShowMessage(sMessage);
    //     return 0;
    // } else { PFHideMessage(); }

	
	
	

	 
	
    var iFinancePeriod = (isNaN(parseInt(iFinanceTenor)) ? 0 : parseInt(iFinanceTenor)); // totalyear
    var iDBR = (isNaN(parseFloat(DBR)) ? 0 : parseFloat(DBR));
    iDBR = (iDBR / 100);//.toFixed(2);
    var iTotalInstallment = iFinancePeriod; //* 12;
    var iTotalToPayback = (((iMonthlySal * iDBR) - iInstOther) * iTotalInstallment).toFixed(1);
    jQuery('#TotalToPayBack').html("<span class='currency'> " +PFresources.SAR+ " </span>" + formatCurrency(iTotalToPayback,0) + "*")
    //console.log('TotalPayback: '+ iTotalToPayback);

    var iFlatRate = GetRate(iMonthlySal, iNationailty, iSubSector)
    iFlatRate = (isNaN(parseFloat(iFlatRate)) ? 0 : iFlatRate)
    iFlatRate = (iFlatRate / 100); //Change

    var iTotalPrincipal = ((iTotalToPayback) / (1 + (iFlatRate * (iFinancePeriod/12)))).toFixed(1);
    jQuery('#TotalPrincipal').html("<span class='currency'> " +PFresources.SAR+ " </span>" + formatCurrency(iTotalPrincipal,0) + "*")
    // console.log('TotalPrincipal: ' + iTotalPrincipal);

    var iMonthlInstallment = (iTotalToPayback / iTotalInstallment); //.toFixedDown(2); //.toFixed(0);   
    // console.log('MonthlyInstallment: ' + iMonthlInstallment);

    //Total DBR Validation
    var iMaxTotalInstallment = iMonthlySal * 0.65;
    var iDiffInstallmentAvailable = Math.abs(iInstOther - iMaxTotalInstallment);

    if(iDiffInstallmentAvailable <= 0){
        var sMessage = pfMsgObj.NotEligible;
        PFShowMessage(sMessage);
		jQuery("html, body").stop().animate({scrollTop: jQuery("#pferrmsg").offset().top - 300},900,"swing");
        //jQuery(".pf-result-box").hide(); // Hide Results Box
        jQuery(".form-submit-border").hide();
        return 0;
    } else { PFHideMessage(); }

    var iInstallmentForPerFinance = iDiffInstallmentAvailable < iMonthlInstallment ? iDiffInstallmentAvailable : iMonthlInstallment;    
    if (iInstallmentForPerFinance <= 0) { 
        var sMessage = pfMsgObj.NotEligible;
        PFShowMessage(sMessage);
		jQuery("html, body").stop().animate({scrollTop: jQuery("#pferrmsg").offset().top - 300},900,"swing");
        jQuery(".pf-result-box").hide(); // Hide Results Box
        jQuery(".form-submit-border").hide();
        return 0;
    } else { PFHideMessage(); }


    var IRR = GetIRR(iTotalInstallment, iTotalPrincipal, iMonthlInstallment);
    // console.log('IRR: ' + IRR);

    var iTradingFee = ((iTotalPrincipal - 70.0) * 0.0012).toFixed(1); //0.12%
    // console.log('iTradingFee:' + iTradingFee);

    var iCustomerToReceieve = iTotalPrincipal - (70.0 + +iTradingFee)
    // console.log('CustomerToReceieve:' + iCustomerToReceieve);

    var TempAdminFees = (0.01 * iTotalPrincipal).toFixed(0);
    var TotalAdminFee = TempAdminFees <= 5000 ? TempAdminFees : 5000;
    // console.log('TotalAdminFee: ' + TotalAdminFee);

    var iFinancedForAPRAmt = (iCustomerToReceieve - TotalAdminFee);
    var iAPRVal = GetIRR(iTotalInstallment, iFinancedForAPRAmt, iMonthlInstallment);

    iAPRVal = iAPRVal / 100;
    APR = ((Math.pow(1 + (iAPRVal / 12), 12) - 1) * 100); //.toFixed(2);
    // console.log('APR: '+ APR)
    //APR = showAsFloat(APR,2);
    jQuery('#MonthlyInstallment').html("<span class='currency'> " +PFresources.SAR+ " </span>" + formatCurrency(iMonthlInstallment.toFixed(0),0) + "*")
    //jQuery('#PFpaymentDesc').html(PFresources.Calculatedover60months5Years)
	jQuery('#APR').html(parseFloat(Math.round(APR * 100) / 100).toFixed(2) + "%")
    //console.log('APR: '+ APR);

    jQuery(".pf-result-box").show(); // SHow Results Box
    jQuery(".form-submit-border").show();
	//jQuery("#btn-pf-calculate").hide();//hide calculate button
	jQuery("#btn-pf-reset").show();
	jQuery(".terms-block").show();

    if (jQuery(window).width() <= 768) {
        jQuery("html, body").stop().animate({scrollTop: jQuery(".calculations-info-box").offset().top - 50},900,"swing");
        jQuery("#btn-pf-recalculate").removeClass("disabled");
    }

}

function GetRate(salary, nationality, subsector) {
    if (nationality !== null && subsector !== null) {
        if (nationality === "Saudi") {
            for (var x = 0; x < pf[0].SectorsList.length; x++) {
                if (pf[0].SectorsList[x].Title.replace(/\s/g, '') == subsector) {
                    for (var i = 0; i < pf[0].SectorsList[x].RatesList.length; i++) {
                        if ((salary >= parseInt(pf[0].SectorsList[x].RatesList[i].From)) && (salary <= parseInt(pf[0].SectorsList[x].RatesList[i].To))) {
                            return pf[0].SectorsList[x].RatesList[i].Rate
                        }
                    }
                }
            }
        }
        else if (nationality === "Expat") {
            for (var x = 0; x < pf[1].SectorsList.length; x++) {
                if (pf[1].SectorsList[x].Title.replace(/\s/g, '') == subsector) {
                    for (var i = 0; i < pf[1].SectorsList[x].RatesList.length; i++) {
                        if ((salary >= parseInt(pf[1].SectorsList[x].RatesList[i].From)) && (salary <= parseInt(pf[1].SectorsList[x].RatesList[i].To))) {
                            return pf[1].SectorsList[x].RatesList[i].Rate
                        }
                    }
                }
            }
        }
    }
    else null;
}

function Reset() {
    jQuery('#txt-age').val('');
    jQuery('#txt-monthly-salary').val('');
    jQuery('#txt-current-monthly-salary').val('');
    jQuery('#drpSubsectors').val('0');
	 jQuery('#drpFinancetenors').val('0');
    jQuery('#txt-current-monthly-instal').val('');

    //Reset Result Box
    jQuery('#TotalToPayBack').html('<span class="currency"> '+PFresources.SAR+' 0*</span>');
    jQuery('#TotalPrincipal').html('<span class="currency"> '+PFresources.SAR+' 0*</span>');
    jQuery('#MonthlyInstallment').html('<span class="currency"> '+PFresources.SAR+' 0*</span>');
    jQuery('#APR').html('0%');
	jQuery('#PFpaymentDesc').html(PFresources.BasedOverAStandardPeriodOf60Months);
  
    jQuery('#PFSectorErr').html('');
    jQuery('#PFMonthSalErr').html('');

    jQuery("#pferrmsg").hide(); //Hide error msg
    //jQuery(".pf-result-box").hide(); // SHow Results Box
    jQuery(".form-submit-border").hide();
	jQuery("#btn-pf-reset").hide();
	jQuery("#btn-pf-calculate").addClass("disabled")
	jQuery("#btn-pf-calculate").show();
	//disable inputs
	jQuery('#txt-current-monthly-instal').prop('disabled', true);
	jQuery('#txt-monthly-salary').prop('disabled', true);
	
	
}

function GenerateFinancetenor()
{
	var selectHTML = "";
    selectHTML += "<option value='0' selected='true'>"+PFresources.Select+"</option>";
	 for (i = 0; i < financeTenorDuration.length; i++) {
        selectHTML += "<option value=" + financeTenorDuration[i].months.replace(/\s/g, '') + ">" + financeTenorDuration[i].Title + "</option>";
    }
    return selectHTML;
}
function GenerateSubsector(nationality, sector) {
    if (nationality !== "" && sector !== "") {
        if (nationality === 'Saudi') // FOR SAUDIS
        {
            if (sector === "Gov") {
                var selectHTML = "";
                selectHTML += "<option value='0' selected='true'>"+PFresources.Select+"</option>"
                for (i = 0; i < 2; i++) {
                    selectHTML += "<option value=" + pf[0].SectorsList[i].Title.replace(/\s/g, '') + ">" + pf[0].SectorsList[i].Description + "</option>";
                }
                return selectHTML;

            }
            else if (sector === "Private") {
                var selectHTML = "";
                selectHTML += "<option value='0' selected='true'>"+PFresources.Select+"</option>"
                for (i = 2; i < pf[0].SectorsList.length; i++) {
                    selectHTML += "<option value=" + pf[0].SectorsList[i].Title.replace(/\s/g, '') + ">" + pf[0].SectorsList[i].Description + "</option>";
                }
                return selectHTML;
            }
        }
        else if (nationality === "Expat") // FOR EXPAT
        {
            if (sector === "Gov") {

                var selectHTML = "";
                selectHTML += "<option value='0' selected='true'>"+PFresources.Select+"</option>"
                for (i = 0; i < 1; i++) {
                    selectHTML += "<option value=" + pf[1].SectorsList[i].Title.replace(/\s/g, '') + ">" + pf[1].SectorsList[i].Title + "</option>";
                }
                return selectHTML;
            }
            else if (sector === "Private") {

                var selectHTML = "";
                selectHTML += "<option value='0' selected='true'>"+PFresources.Select+"</option>"
                for (i = 1; i < pf[1].SectorsList.length; i++) {
                    selectHTML += "<option value=" + pf[1].SectorsList[i].Title.replace(/\s/g, '') + ">"+ pf[1].SectorsList[i].Description +  "</option>";
                }
                return selectHTML;
            }
        }
		
		
    }
    else
        return null;
}

jQuery(document).on('change',"#drpSubsectors",function(){
			subsector = jQuery("#drpSubsectors option:selected").val(); 
			if(jQuery(this).prop('selectedIndex')) {
				PFRemoveClass("#drpSubsectors","pws-cal-error");
				PFAddClass("#drpSubsectors","pws-cal-success");
					EnableNextInput('txt-monthly-salary');
					isValidSubsector = true;
					isValidAll();
					
				}
				else{
					jQuery('#txt-monthly-salary').prop('disabled', true);
					PFRemoveClass("#drpSubsectors","pws-cal-success");
					PFAddClass("#drpSubsectors","pws-cal-error");
					isValidSubsector = false;
					isValidAll();
				}	
		});
		
		
jQuery(document).on('change',"#drpFinancetenors",function(){
 iFinanceTenor = (isNaN(parseInt(jQuery("#drpFinancetenors option:selected").val())) ? 0 : parseInt(jQuery("#drpFinancetenors option:selected").val()));
	if(jQuery(this).prop('selectedIndex')) {
			PFRemoveClass("#drpFinancetenors","pws-cal-error");
			PFAddClass("#drpFinancetenors","pws-cal-success");
			EnableNextInput('txt-current-monthly-instal');
			isFinanceTenor = true;
			isValidAll();
			
		}
		else{
			jQuery('#txt-current-monthly-instal').prop('disabled', true);
			PFRemoveClass("#drpFinancetenors","pws-cal-success");
			PFAddClass("#drpFinancetenors","pws-cal-error");
			isFinanceTenor = false;
			isValidAll();
		}	
});

jQuery("#txt-finance-tenor").change(function (e) { 
		 if (jQuery('#txt-finance-tenor').val() > 25) { //Maximum tenor 25
        var sMessage = pfMsgObj.InvalidFinanceTenor;
        PFShowFieldError(sMessage,"#PFFinanceTenorErr");
		PFRemoveClass("#txt-finance-tenor","pws-cal-success");
		PFAddClass("#txt-finance-tenor","pws-cal-error");
		jQuery('#txt-current-monthly-instal').prop('disabled', true);
		isFinanceTenor = false;
		isValidAll();
        return 0;
    }
	else{
		PFHideFieldError("#PFFinanceTenorErr"); 
		PFRemoveClass("#txt-finance-tenor","pws-cal-error");
		PFAddClass("#txt-finance-tenor","pws-cal-success");
		EnableNextInput('txt-current-monthly-instal');
		jQuery("#btn-pf-calculate").removeClass("disabled");
		isFinanceTenor = true;
		isValidAll();
		
	}
    if (jQuery("#txt-finance-tenor").val() < 1) { //Minimum tenor 1 year
        var sMessage = pfMsgObj.InvalidFinanceTenor;
        PFShowFieldError(sMessage,"#PFFinanceTenorErr");
		PFRemoveClass("#txt-finance-tenor","pws-cal-success");
		PFAddClass("#txt-finance-tenor","pws-cal-error");
		jQuery('#txt-current-monthly-instal').prop('disabled', true);
		isFinanceTenor = false;
		isValidAll();
        return 0;
    } else { 
		PFHideFieldError("#PFFinanceTenorErr"); 
		PFRemoveClass("#txt-finance-tenor","pws-cal-error");
		PFAddClass("#txt-finance-tenor","pws-cal-success");
		EnableNextInput('txt-current-monthly-instal');
		jQuery("#btn-pf-calculate").removeClass("disabled");		
		isFinanceTenor = true;
		isValidAll();
	}
	  });

function GetIRR(period, financed, installment) {
    var IRRval = [];
    IRRval.push(-financed);
    for (i = 1; i <= period  ; i++) {
        IRRval.push(installment);
    }

    var IRR = IRRCalc(IRRval, 0.001);   //.toFixed(2);//* 0.01;   //IRRCalc(IRRval, 0.001).toFixed(2); //* 0.01;
    return IRR * 12;

    // var APR = ((Math.pow(1 + IRR, 12) - 1) * 100).toFixed(2);
    // console.log('APR : '+ APR);
}


function IRRCalc(CArray, guest) {
    inc = 0.000001;
    do {
        guest += inc;
        NPV = 0;
        for (var j = 0; j < CArray.length; j++) {
            NPV += CArray[j] / Math.pow((1 + guest), j);
        }
    } while (NPV > 0);
    return guest * 100;
}   

function PFShowMessage(sMsg) {
    jQuery("#pferrmsg").find('p').text(sMsg); //.show();
    jQuery("#pferrmsg").show();
    // jQuery('.error-msg').show();
}

function PFHideMessage() {
    jQuery("#pferrmsg").hide();
    //jQuery('.error-msg').hide();
}

function PFShowFieldError(sMsg, sID){
  jQuery(sID).text(sMsg);
  jQuery(sID).show();
}

function PFHideFieldError(sID){
    jQuery(sID).hide();
}
function PFAddClass(sID, className){
    jQuery(sID).addClass(className);
}

function PFRemoveClass(sID, className){
	if(jQuery(sID).hasClass(className)){
    jQuery(sID).removeClass(className);
	}
}

function isValidAll()
{
	//if(isValidSalary && isValidInstallment && isValidSubsector)
	if(isValidSalary  && isFinanceTenor&& isValidSubsector)
	{
		//jQuery(".terms-block").show();
		jQuery("#btn-pf-calculate").removeClass("disabled");
	}
	else
	{
		jQuery(".terms-block").hide();
		jQuery("#btn-pf-calculate").addClass("disabled");
	}
}

//Error Message
function PFMessages() {
    //english messages
    this.InvalidMinSal = PFresources.SalarylowerthanminimumSalary;
    this.SelectSector = PFresources.PleaseselectSector;  
    this.InvalidMinAge = PFresources.MinimumEligibleAgeis18Years;
    this.InvalidMaxAge = PFresources.MaximumEligibleAgeis60Years;
    this.NotEligible = PFresources.NotEligible;
	this.InvalidMaxSal = PFresources.MaximumSalaryRangeExceeded;
	this.InvalidFinanceTenor=PFresources.RangeFinanceTenorYears;
}


function formatCurrency(num, opt) {
    var sig = ""; //GetCurrencyPostfix();
    var _sig = "";
    if (num < 1) { return "0"; }
    if (opt == 1) {
        _sig = sig;
    } else { sig = "" }
    num = num.toString().replace(/\$|\,/g, '');
    if (isNaN(num))
        num = "0";
    sign = (num == (num = Math.abs(num)));
    num = Math.floor(num * 100 + 0.50000000001);
    cents = num % 100;
    num = Math.floor(num / 100).toString();
    if (cents < 10)
        cents = "0" + cents;
    for (var i = 0; i < Math.floor((num.length - (1 + i)) / 3) ; i++)
        num = num.substring(0, num.length - (4 * i + 3)) + ',' +
		num.substring(num.length - (4 * i + 3));
    //return (((sign)?'':'-') + num + '.' + cents + sig );
    return (((sign) ? '' : '-') + num);
}

function BindSubSectors(sectorParam,nationality)
{
    sector = '';
    jQuery('#drpsubsector').html("");
    var newSelect = document.createElement('select');
    newSelect.setAttribute("id", "drpSubsectors");

    sector = sectorParam;
    var temp = GenerateSubsector(nationality, sector);
    if (temp != null) {
        newSelect.innerHTML = temp;
        document.getElementById('drpsubsector').appendChild(newSelect);
    }    
}
function BindFinanceTenor()
{
	sector = '';
    jQuery('#drpfinancetenor').html("");
    var newSelect = document.createElement('select');
    newSelect.setAttribute("id", "drpFinancetenors");
	newSelect.setAttribute('disabled', true);
    var temp = GenerateFinancetenor();
    if (temp != null) {
        newSelect.innerHTML = temp;
        document.getElementById('drpfinancetenor').appendChild(newSelect);
    }    
}
function showAsFloat(num, n){
    debugger;
      return !isNaN(+num) ? (+num).toFixed(n || 2) : num;
}


// function roundN(num,n){
//   return parseFloat(Math.round(num * Math.pow(10, n)) /Math.pow(10,n)).toFixed(n);
// }