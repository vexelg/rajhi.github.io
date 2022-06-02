var IRRval = [];
var subsector = '';
var sector = '';
var iTenure = '';
var iRate = '';
var SingleYear = null;
var MultipleYears = null;
var hfMsgObj =null; 
var iAgeAtMaturity = 65;
var isValidAge = false;
var isValidSalary = false;
var isValidLoanTenure = false;
var isValidPropertySaleValue = false;
var isValidDownPayment = false;



jQuery(document).ready(function () {  
    var hfcontainer = jQuery(".home-finance-calculator");
    if (hfcontainer.length > 0) {
        if (typeof hf !== 'undefined') { 
            
            //By Default Gov
            sector = "Gov";
            jQuery("#HFsubsector").hide(); 
            GenerateHFTenure();
			SingleYear=HFresources.Year;;
			MultipleYears=HFresources.Years;
			hfMsgObj=new HFMessages();
            jQuery("#hferrmsg").hide(); //Hide error msg
            //jQuery(".hf-result-box").hide(); // Hide Results Box
            jQuery(".form-submit-border").hide();
            jQuery(".hf-info-box").hide(); // Hide Results Box
			jQuery("#btn-hf-reset").hide();
			
        }

        if (jQuery(window).width() <= 768) {
            jQuery( "#HFLoanTenure" ).insertAfter( jQuery( ".calculator-left-sec .col-md-6:first-child #calc-input .form-group:nth-child(1)" ) );
        }


    }
	jQuery(".terms-block").hide();
});

jQuery('input:radio[name="rbtnHFSector"]').change(function () { // SECTOR CHANGE
    sector = '';
    jQuery('#HFdrpsubsector').html("");
    jQuery('#HFdrploantenure option:eq(0)').attr('selected','selected')
    var newSelect = document.createElement('select');
    newSelect.setAttribute("id", "HFdrpsubsector");
	//
    if (jQuery(this).val() === 'Gov') {
        sector = "Gov";          
           // jQuery("#HFsubsector").hide();
            jQuery("#calc-input").show();
    }
    else if (jQuery(this).val() === 'Private') {
        sector = "Private";
       // var temp = GenerateHFSubsector(sector);
       // if (temp != null) {
       //     newSelect.innerHTML = temp;
       //     document.getElementById('HFdrpsubsector').appendChild(newSelect);
       //    jQuery("#HFsubsector").show();
            jQuery("#calc-input").show();
       // }
    }

    jQuery("#hferrmsg").hide(); //Hide error msg
    //jQuery(".hf-result-box").hide(); // Hide Results Box
    jQuery(".form-submit-border").hide();
});
jQuery(document).on("change","#HFdrploantenure",function(){
	iTenure = jQuery("#HFdrploantenure option:selected").val();
     if(sector != ''){
        iRate = GetHFRate(iTenure,sector)
     } 
	if(jQuery(this).prop('selectedIndex') > 0) {
		HFRemoveClass("#HFdrploantenure","pws-cal-error");
		HFAddClass("#HFdrploantenure","pws-cal-success");
			EnableNextInput('HFtxt-monthly-salary');
			isValidLoanTenure = true;
			isValidAllHF();
		}
		else{
			jQuery('#HFtxt-monthly-salary').prop('disabled', true);
			HFRemoveClass("#HFdrploantenure","pws-cal-success");
		HFAddClass("#HFdrploantenure","pws-cal-error");
		isValidLoanTenure = false;
		isValidAllHF();
		}	 
});

// jQuery("#HFdrpsubsector").on("change", function () {
//     subsector = jQuery("#HFdrpsubsector option:selected").val();
// });

jQuery('#btn-hf-calculate').click(function () {
    ValidateValues();
});

jQuery('#btn-hf-recalculate').click(function (e) {
    // jQuery(window).scrollTop(jQuery(".personal-finance-calculator").offset().top);
    jQuery("html, body").stop().animate({scrollTop: jQuery(".home-finance-calculator").offset().top},900,"swing");
    return false;
});


jQuery('#btn-hf-reset').click(function (e) {
    HFReset();
    return false;
});


 jQuery("#HFtxt-property-sale-value").keyup(function (e) { 
     //if (EnsureNumeric(e)) validatePersonalRe(); 
       var saleValue =  jQuery(this).val();
       jQuery("#HFtxt-down-payment").val(saleValue * 0.15);
  });


  jQuery("#HFtxt-age").change(function (e) { 
      var max_chars = 2;
      if (jQuery(this).val().length >= max_chars) { 
       	    jQuery(this).val(jQuery(this).val().substr(0, max_chars));
    }
    
    var age =   parseInt(jQuery(this).val());
    if(age < iAgeAtMaturity && age != iAgeAtMaturity ){
        var temp = (iAgeAtMaturity - age) > 20 ? 20 : (iAgeAtMaturity - age);
        GenerateHFTenure(temp);
    }
    else{
       // jQuery('option', this).not(':eq(0), :selected').remove();
         jQuery("#HFdrploantenure").find('option').not(':first').remove();
    }
  });

function ValidateValues(){

    var iAge = (isNaN(parseInt(jQuery('#HFtxt-age').val())) ? 0 : parseInt(jQuery('#HFtxt-age').val()));
    var iCostPrice = (isNaN(parseInt(jQuery('#HFtxt-property-sale-value').val())) ? 0 : parseInt(jQuery('#HFtxt-property-sale-value ').val()));
    var iDownPayment = (isNaN(parseInt(jQuery('#HFtxt-down-payment').val())) ? 0 : parseInt(jQuery('#HFtxt-down-payment').val()));
    var iMonthlySalary = (isNaN(parseInt(jQuery('#HFtxt-monthly-salary').val())) ? 0 : parseInt(jQuery('#HFtxt-monthly-salary').val()));
    var iTenureDropValue = jQuery('#HFdrploantenure').find('select').val();
    var maxTenure = parseInt(iTenure);  // ? 0 : parseInt(iTenure); //(isNaN(parseInt(iTenure.split('-')[1])) ? 0 : parseInt(iTenure.split('-')[1]));
    var iTotalMonths = maxTenure * 12;

    // var iTenure = (isNaN(parseInt(jQuery('#txtTenure').val())) ? 0 : parseInt(jQuery('#txtTenure').val()));
    // var iTotalMonths = iTenure * 12;
    var  iRateActual = iRate / 100; //(isNaN(parseInt(jQuery('#txtRate').val())) ? 0 : parseInt(jQuery('#txtRate').val()));

    // if (iAge < 18) { //Minimum Age 18 Years
        // var sMessage = hfMsgObj.InvalidMinAge;
        // HFShowFieldError(sMessage,"#HFAgeErr");
        // return 0;
    // } else { HFHideFieldError("#HFAgeErr"); }

    // if (iAge >= 65) { //Maximum Age 60 Years
        // var sMessage = hfMsgObj.InvalidMaxAge;
        // HFShowFieldError(sMessage,"#HFAgeErr");
        // return 0;
    // } else { HFHideFieldError("#HFAgeErr"); }
      
    if(iTenureDropValue == '0' || iTenureDropValue == ""){
         var sMessage = hfMsgObj.SelectTenure;
         HFShowFieldError(sMessage,"#HFTenureErr");
         return 0;
    } else { HFHideFieldError("#HFTenureErr"); }

		// if(jQuery('#HFtxt-monthly-salary').val().length > 10)
		// { var sMessage = hfMsgObj.InvalidMaxSal;
        // HFShowFieldError(sMessage,"#HFMonthSalErr");
        // return 0;
		// }
    // //validate min Monthly salary
    // if (iMonthlySalary <= 0) { // ((iMonthlySalary <= 0) || (jQuery("#HFtxt-monthly-salary").val() <= 0)) { 
        // var sMessage = hfMsgObj.MonthlySalary;
        // HFShowFieldError(sMessage,"#HFMonthSalErr");
        // return 0;
    // }
    // else { HFHideFieldError("#HFMonthSalErr");}

    // if(iCostPrice <= 0){
        // var sMessage = hfMsgObj.PropertySaleValue;
        // HFShowFieldError(sMessage,"#HFCostErr");
        // return 0;
    // }
    // else { HFHideFieldError("#HFCostErr");}
    
    var globalDBR = GetGlobalDBR(iMonthlySalary);
    globalDBR = globalDBR/100;
    var maxEligibleIstallment = iMonthlySalary * globalDBR;
    var maxTotalAmount = maxEligibleIstallment * iTotalMonths;
    var maxEligibleAmount = maxTotalAmount/(1 + (iTotalMonths * (iRateActual/12)));

    if(iCostPrice === 0 || iCostPrice > maxEligibleAmount){
        var sMessage =  hfMsgObj.InvalidSaleValue.replace("{0}", formatCurrency(maxEligibleAmount,0));
        HFShowFieldError(sMessage,"#HFCostErr");
		HFRemoveClass("#HFtxt-property-sale-value","pws-cal-success");
		HFAddClass("#HFtxt-property-sale-value","pws-cal-error");
		jQuery('#HFtxt-down-payment').prop('disabled', true);
        return 0;
    } else {  HFHideFieldError("#HFCostErr"); 
	
		HFRemoveClass("#HFtxt-property-sale-value","pws-cal-error");
		HFAddClass("#HFtxt-property-sale-value","pws-cal-success");
		jQuery('#HFtxt-down-payment').prop('disabled', false);
	}

    // if(iCostPrice > maxEligibleAmount){ //Blue msg box for Cost Price
    //     var sMessage =  hfMsgObj.InvalidSaleValue.replace("{0}", formatCurrency(maxEligibleAmount,0));
    //     HFInfoMessage(sMessage);
    //     return 0;
    // } else {  jQuery(".hf-info-box").hide(); }

   var iContractAmount = iCostPrice - iDownPayment;
   //console.log('iContractAmount : '+ iContractAmount );
   jQuery('#HFFinanceAmount').html("<span class='currency'>" +HFresources.SAR+ " </span>" + formatCurrency(iContractAmount,0) + "*")

   var iProfitAmount = ((iContractAmount * iTotalMonths * iRateActual)/12);
    //console.log('iProfitAmount : '+ iProfitAmount );

   var iTotalAmount = iProfitAmount + iContractAmount;
   //console.log('iTotalAmount : '+ iTotalAmount );
   jQuery('#HFTotalAmountPayable').html("<span class='currency'>" +HFresources.SAR+ " </span>" + formatCurrency(iTotalAmount,0) + "*");

   var iInstallmentAmount = (iTotalAmount/iTotalMonths).toFixed(2);
   //console.log('iInstallmentAmount : '+ iInstallmentAmount );
   jQuery('#HFMonthlyRepayment').html("<span class='currency'>" +HFresources.SAR+ " </span>" + formatCurrency(iInstallmentAmount,0) + "*");
   jQuery('#HFpaymentDesc').html(HFresources.Basedoverastandardperiodof+" "+ iTotalMonths + " "+HFresources.months+" ("+ maxTenure +" "+HFresources.Years+" )");

   var IRR = GetHFIRR(iContractAmount,maxTenure,iInstallmentAmount);
   var APR = ((Math.pow(1 + IRR, 12) - 1) * 100).toFixedDown(3);
   IRR = (IRR * 100).toFixedDown(4);
   var iTermCost = (IRR * 12).toFixed(2);

   //console.log('IRR: '+ IRR )   
  // console.log('iTermCost: '+ iTermCost) 
  // console.log('APR : '+ APR);

   jQuery('#HFAPR').html(+APR + "%")

    // var APR = Math.pow(1 + (IRR/100), 12); // 
    //var IRR = IRRCalc(IRRval, 0.001) * 0.01;
    //var APR = ((Math.pow(1 + IRR, 12) - 1) * 100).toFixed(2);
    
    jQuery(".hf-info-box").hide();
    jQuery(".hf-result-box").show(); // SHow Results Box
    jQuery(".form-submit-border").show();
	//jQuery("#btn-hf-calculate").hide();//hide calculate button
	jQuery("#btn-hf-reset").show();
	jQuery(".terms-block").show();

    if (jQuery(window).width() <= 768) {
        jQuery("html, body").stop().animate({scrollTop: jQuery(".calculations-info-box").offset().top - 50},900,"swing");
        jQuery("#btn-hf-recalculate").removeClass("disabled");
    }
}

function GetHFIRR(financed,period,rental){
    IRRval = [];
    period = period * 12;

        IRRval.push(-financed);
        for (i = 0; i <= period - 1; i++) {
            IRRval.push(rental);
        }

    var IRR = IRRCalc(IRRval, 0.001) * 0.01;   //IRRCalc(IRRval, 0.001).toFixed(2); //* 0.01;
    return IRR; //(IRR*100).toFixed(3)  
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

function GetHFRate(tenure,subsector){
        if (tenure !== null && subsector !== null) {
           // for (var x = 0; x < hf.length; x++) {
                if (subsector == "Gov") {
                    for (var i = 0; i < hf[0].LoanTenureList.length; i++) {
                        var tempTenure = (hf[0].LoanTenureList[i].Tenure).split('-');                    
                        if ((parseInt(tenure) >= parseInt(tempTenure[0])) && (parseInt(tenure) <= parseInt(tempTenure[1])))
                        {                                              
                            return hf[0].LoanTenureList[i].Rate;
                        }
                    }
                }
                else if (subsector == "Private"){
                    for (var i = 0; i < hf[1].LoanTenureList.length; i++) {
                         var tempTenure = (hf[1].LoanTenureList[i].Tenure).split('-');                    
                         if ((parseInt(tenure) >= parseInt(tempTenure[0])) && (parseInt(tenure) <= parseInt(tempTenure[1])))
                         {                                              
                             return hf[1].LoanTenureList[i].Rate;
                         }
                    }
                }
           // }
        }
        else null;
} 

    function GetGlobalDBR(monthlySalary)
    {
      for(var i = 0; i < hfSalBands.length; i++){
            var range = (hfSalBands[i].Tenure).split('-');
            if ((parseInt(monthlySalary) >= parseInt(range[0])) && (parseInt(monthlySalary) <= parseInt(range[1])))
            {                                              
                return hfSalBands[i].Rate;
            }     
        }  
    } 

function GenerateHFSubsector(sector) {
    if (sector !== "") {        
            if (sector === "Gov") {
                // var selectHTML = "";
                // selectHTML += "<option value='0' selected='true'>Select</option>"
                // for (i = 0; i < 2; i++) {
                //     selectHTML += "<option value=" + pf[0].SectorsList[i].Title.replace(/\s/g, '') + ">" + pf[0].SectorsList[i].Title + "</option>";
                // }
                // return selectHTML;
            }
            else if (sector === "Private") {
                var selectHTML = "";
                selectHTML += "<option value='0' selected='true'>"+HFresources.Select+"</option>"
                for (i = 1; i < hf.length; i++) {
                    selectHTML += "<option value=" + hf[i].Title.replace(/\s/g, '') + ">" + hf[i].Title + " - "+ hf[i].Description + "</option>";
                }
                return selectHTML;
            }       
    }
    else
        return null;
}
jQuery('#HFtxt-age').on('change', function() {
	
	  if (jQuery('#HFtxt-age').val() < 18) { //Minimum Age 18 Years
        var sMessage = hfMsgObj.InvalidMinAge;
        HFShowFieldError(sMessage,"#HFAgeErr");
		HFRemoveClass("#HFtxt-age","pws-cal-success");
		HFAddClass("#HFtxt-age","pws-cal-error");
		jQuery('#HFdrploantenure').prop('disabled', true);
		isValidAge = false;
		isValidLoanTenure = false;
		isValidAllHF();
        return 0;
    } else { 
		HFHideFieldError("#HFAgeErr"); 
		HFRemoveClass("#HFtxt-age","pws-cal-error");
		HFAddClass("#HFtxt-age","pws-cal-success");
		EnableNextInput('HFdrploantenure');
		isValidAge = true;
		isValidAllHF();
	
	}

    if (jQuery('#HFtxt-age').val() >= 65) { //Maximum Age 60 Years
        var sMessage = hfMsgObj.InvalidMaxAge;
        HFShowFieldError(sMessage,"#HFAgeErr");
		HFRemoveClass("#HFtxt-age","pws-cal-success");
		HFAddClass("#HFtxt-age","pws-cal-error");
		jQuery('#HFdrploantenure').prop('disabled', true);
		isValidAge = false;
		isValidAllHF();
        return 0;
    } else { HFHideFieldError("#HFAgeErr"); 
	HFRemoveClass("#HFtxt-age","pws-cal-error");
		HFAddClass("#HFtxt-age","pws-cal-success");
		EnableNextInput('HFdrploantenure');
		isValidAge = true;
		isValidAllHF();
	}

});


jQuery('#HFtxt-monthly-salary').on('change', function() {
	// if (jQuery(this).val()) {
		// EnableNextInput('HFtxt-property-sale-value')
	// }
	// else{
		// jQuery('#HFtxt-property-sale-value').prop('disabled', true);
	// }

	 if (jQuery('#HFtxt-monthly-salary').val().length > 10) { //limit 10 digits
        var sMessage = hfMsgObj.InvalidMaxSal;
        HFShowFieldError(sMessage,"#HFMonthSalErr");
		HFRemoveClass("#HFtxt-monthly-salary","pws-cal-success");
		HFAddClass("#HFtxt-monthly-salary","pws-cal-error");
		jQuery('#HFtxt-property-sale-value').prop('disabled', true);
		isValidSalary = false;
		isValidAllHF();
        return 0;
    }
	else{
		HFHideFieldError("#HFMonthSalErr"); 
		HFRemoveClass("#HFtxt-monthly-salary","pws-cal-error");
		HFAddClass("#HFtxt-monthly-salary","pws-cal-success");
		EnableNextInput('HFtxt-property-sale-value');
		isValidSalary = true;
		isValidAllHF();
		
	}
    if (jQuery('#HFtxt-monthly-salary').val() <= 0) { 
         var sMessage = hfMsgObj.MonthlySalary;
        HFShowFieldError(sMessage,"#HFMonthSalErr");
		HFRemoveClass("#HFtxt-monthly-salary","pws-cal-success");
		HFAddClass("#HFtxt-monthly-salary","pws-cal-error");
		jQuery('#HFtxt-property-sale-value').prop('disabled', true);
		isValidSalary = false;
		isValidAllHF();
        return 0;
    } else { 
		HFHideFieldError("#HFMonthSalErr"); 
		HFRemoveClass("#HFtxt-monthly-salary","pws-cal-error");
		HFAddClass("#HFtxt-monthly-salary","pws-cal-success");
		EnableNextInput('HFtxt-property-sale-value');
		isValidSalary = true;
		isValidAllHF();
	}
	
	
	
	});
jQuery('#HFtxt-property-sale-value').on('change', function() {
	
	 var iAge = (isNaN(parseInt(jQuery('#HFtxt-age').val())) ? 0 : parseInt(jQuery('#HFtxt-age').val()));
    var iCostPrice = (isNaN(parseInt(jQuery('#HFtxt-property-sale-value').val())) ? 0 : parseInt(jQuery('#HFtxt-property-sale-value ').val()));
    var iDownPayment = (isNaN(parseInt(jQuery('#HFtxt-down-payment').val())) ? 0 : parseInt(jQuery('#HFtxt-down-payment').val()));
    var iMonthlySalary = (isNaN(parseInt(jQuery('#HFtxt-monthly-salary').val())) ? 0 : parseInt(jQuery('#HFtxt-monthly-salary').val()));
    var iTenureDropValue = jQuery('#HFdrploantenure').find('select').val();
    var maxTenure = parseInt(iTenure);  // ? 0 : parseInt(iTenure); //(isNaN(parseInt(iTenure.split('-')[1])) ? 0 : parseInt(iTenure.split('-')[1]));
    var iTotalMonths = maxTenure * 12;

    var  iRateActual = iRate / 100; //(isNaN(parseInt(jQuery('#txtRate').val())) ? 0 : parseInt(jQuery('#txtRate').val()));  
    var globalDBR = GetGlobalDBR(iMonthlySalary);
    globalDBR = globalDBR/100;
    var maxEligibleIstallment = iMonthlySalary * globalDBR;
    var maxTotalAmount = maxEligibleIstallment * iTotalMonths;
    var maxEligibleAmount = maxTotalAmount/(1 + (iTotalMonths * (iRateActual/12)));

    if(iCostPrice === 0 || iCostPrice > maxEligibleAmount){
        var sMessage =  hfMsgObj.InvalidSaleValue.replace("{0}", formatCurrency(maxEligibleAmount,0));
        HFShowFieldError(sMessage,"#HFCostErr");
		HFRemoveClass("#HFtxt-property-sale-value","pws-cal-success");
		HFAddClass("#HFtxt-property-sale-value","pws-cal-error");
		jQuery('#HFtxt-down-payment').prop('disabled', true);
		isValidPropertySaleValue = false;
		isValidAllHF();
        return 0;
    } else {  HFHideFieldError("#HFCostErr"); 
	
		HFRemoveClass("#HFtxt-property-sale-value","pws-cal-error");
		HFAddClass("#HFtxt-property-sale-value","pws-cal-success");
		jQuery('#HFtxt-down-payment').prop('disabled', false);
		isValidPropertySaleValue = true;
		isValidAllHF();
	}
	
	
	if (jQuery(this).val() > 0) {
		EnableNextInput('HFtxt-down-payment');
		HFHideFieldError("#HFCostErr"); 
		HFRemoveClass("#HFtxt-property-sale-value","pws-cal-error");
		HFAddClass("#HFtxt-property-sale-value","pws-cal-success");
		jQuery("#btn-hf-calculate").removeClass("disabled");
		isValidPropertySaleValue = true;
		isValidAllHF();
	}
	else{
		var sMessage = hfMsgObj.PropertySaleValue;
        HFShowFieldError(sMessage,"#HFCostErr");
		jQuery('#HFtxt-down-payment').prop('disabled', true);
		HFRemoveClass("#HFtxt-property-sale-value","pws-cal-success");
		HFAddClass("#HFtxt-property-sale-value","pws-cal-error");
		isValidPropertySaleValue = false;
		isValidAllHF();
		return 0;
	}
	
	 if (jQuery('#HFtxt-property-sale-value').val() <= 0 || jQuery('#HFtxt-property-sale-value').val().length < 1) { 
         var sMessage = hfMsgObj.PropertySaleValue;
        HFShowFieldError(sMessage,"#HFCostErr");
		HFRemoveClass("#HFtxt-property-sale-value","pws-cal-success");
		HFAddClass("#HFtxt-property-sale-value","pws-cal-error");
		jQuery('#HFtxt-down-payment').prop('disabled', true);
		isValidPropertySaleValue = false;
		isValidAllHF();
        return 0;
    } else { 
		HFHideFieldError("#HFCostErr"); 
		HFRemoveClass("#HFtxt-property-sale-value","pws-cal-error");
		HFAddClass("#HFtxt-property-sale-value","pws-cal-success");
		EnableNextInput('HFtxt-down-payment');
		isValidPropertySaleValue = true;
		isValidAllHF();
	}
	
	
});

function isValidAllHF()
{
	if(isValidAge && isValidSalary && isValidLoanTenure && isValidPropertySaleValue)
	{
		//jQuery(".terms-block").show();
		jQuery("#btn-hf-calculate").removeClass("disabled");
	}
	else
	{
		jQuery(".terms-block").hide();
		jQuery("#btn-hf-calculate").addClass("disabled");
	}
}


function EnableNextInput(nextElementID){	
    jQuery('#'+nextElementID).prop('disabled', this.value === "");
	jQuery('#'+nextElementID).focus();
}


function GenerateHFTenure(years){
    var selectHTML = ""
    jQuery('#HFdivdrploantenure').html("");
    var newSelect = document.createElement('select');
    newSelect.setAttribute("id", "HFdrploantenure");
	newSelect.setAttribute("disabled", "true");
	//isValidLoanTenure = false;
    selectHTML += "<option value='0' selected='true'>"+HFresources.Select+"</option>";
    // for (i = 0; i < hf[0].LoanTenureList.length; i++) {          
    //     selectHTML += "<option value=" +  hf[0].LoanTenureList[i].Tenure.replace(/\s/g, '') + ">" +  hf[0].LoanTenureList[i].Tenure + " Years" + "</option>";
    // }

    for(i = 1; i <= years; i++){
        if (i > 1)
            selectHTML += "<option value=\"" + i + "\">" + i + " " + MultipleYears + "</option>";
        else if (i == 1)
            selectHTML += "<option value=\"" + i + "\">" + i + " " + SingleYear + "</option>";
    }
    newSelect.innerHTML = selectHTML;
    //document.getElementById('HFdrploantenure').appendChild(newSelect);
	document.getElementById('HFdivdrploantenure').appendChild(newSelect);
	isValidLoanTenure = false;
	isValidAllHF();
}


function HFShowMessage(sMsg) {
    jQuery("#hferrmsg").find('p').text(sMsg); //.show();
    jQuery("#hferrmsg").show();
    // jQuery('.error-msg').show();
}

function HFInfoMessage(sMsg){   
    jQuery('#HFInfo').html(sMsg);
    jQuery(".hf-info-box").show();
    //jQuery(".hf-result-box").hide(); 
    jQuery(".form-submit-border").hide();
}

function HFHideMessage() {
    jQuery("#hferrmsg").hide();
}

function HFShowFieldError(sMsg, sID){
  jQuery(sID).text(sMsg);
  jQuery(sID).show();
}

function HFHideFieldError(sID){
    jQuery(sID).hide();
}
function HFAddClass(sID, className){
    jQuery(sID).addClass(className);
}

function HFRemoveClass(sID, className){
	if(jQuery(sID).hasClass(className)){
    jQuery(sID).removeClass(className);
	}
}

//Error Message
function HFMessages() {
    //english messages
    this.SelectSector = HFresources.PleaseSelectSubSector;
    this.InvalidMinAge = HFresources.MinimumEligibleAgeis18Years;
    this.InvalidMaxAge = HFresources.InvalidAge;
    this.NotOffered = HFresources.Notoffered20yearsMurbahaFixedRate;
    this.InvalidSaleValue = HFresources.PropertySaleValueShouldNotbeMoreThanSAR;
    this.SelectTenure = HFresources.PleaseSelectTenure;
    this.MonthlySalary = HFresources.MonthlySalary;
    this.PropertySaleValue = HFresources.PropertySaleValue;
	this.InvalidMaxSal = HFresources.MaximumSalaryRangeExceeded;
}

function HFReset() {
    jQuery('#HFtxt-age').val('');
    jQuery("#HFtxt-down-payment").val('');
    jQuery('#HFtxt-property-sale-value').val('');
    jQuery('#HFdrploantenure option:eq(0)').attr('selected','selected')
    jQuery('#HFdrpsubsector option:eq(0)').attr('selected','selected')
    jQuery('#HFtxt-monthly-salary').val('');
    //Reset Result Box
    jQuery('#HFFinanceAmount').html('<span class="currency"> '+HFresources.SAR+' 0*</span>');
    jQuery('#HFTotalAmountPayable').html('<span class="currency"> '+HFresources.SAR+' 0*</span>');
    jQuery('#HFMonthlyRepayment').html('<span class="currency"> '+HFresources.SAR+' 0*</span>');
    jQuery('#HFpaymentDesc').html(HFresources.BasedOverAStandardPeriodOf60months);
    jQuery('#HFAPR').html('0%');
   
    jQuery('#HFAgeErr').html('');
    jQuery('#HFTenureErr').html('');
    jQuery('#HFMonthSalErr').html('');
    jQuery('#HFCostErr').html('');

    jQuery("#hferrmsg").hide(); //Hide error msg
	jQuery("#btn-hf-reset").hide();
	jQuery("#btn-hf-calculate").addClass("disabled")
	jQuery("#btn-hf-calculate").show();
    //jQuery(".hf-result-box").hide(); 
    jQuery(".form-submit-border").hide();
	jQuery('#HFdrploantenure').prop('disabled', true);
	jQuery('#HFtxt-monthly-salary').prop('disabled', true);
	jQuery('#HFtxt-property-sale-value').prop('disabled', true);
	
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


