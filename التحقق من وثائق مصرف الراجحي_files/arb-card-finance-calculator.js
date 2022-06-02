
var varObject = null;
var jLSal = [];
var jLNSal = [];
var LeaseType = 0; // 0 for Salaried  1 for Non-Salaried
var cfMsgObj =null;
var SingleYear = null;
var MultipleYears = null;
var CFCalculate=false;
var isValidSalary = false;
var isValidInstallment = false;
var isValidCarPrice = false;
var isValidDownPayment = false;
var isValidFinancePeriod = false;
var isValidBallonPayment = false;
var fee = 0;
var fee_input=0;
//jLSal = {FinanceRate: "6.75", InsuranceRate: "5.50", ManagmentFee: "1", MinCarValue:"15000", MinDownpayment: "0", MinMonthlySalary: "2000"};
//jLNSal = {FinanceRate: "8.00", InsuranceRate: "5.50", ManagmentFee: "1", MinCarValue: "15000", MinDownpayment: "10", MinMonthlySalary: "5000"};


    jQuery(document).ready(function () {  


        var cfcontainer = jQuery(".car-finance-calculator");
            if (cfcontainer.length > 0) {
                if (typeof cf !== 'undefined') {                    
					cfMsgObj= new CFMessages();
					SingleYear = CFresources.year;
					MultipleYears = CFresources.years;
                    GenerateCFTenure();
                    jLSal = cf[0];
                    jLNSal = cf[1];            
                
                    jQuery("#cferrmsg").hide(); //Hide error msg
                    jQuery(".cf-result-box").show(); // Hide Results Box
                    jQuery(".form-submit-border").hide();
					jQuery("#btn-reset").hide();
					
            }       
        }
		
		jQuery(".terms-block").hide();
    });

    jQuery('#ccf-btn-calculate').click(function (e) { 
        e.preventDefault(); 
        calcCardFinance();  
    });
 
     jQuery('#ccf-btn-reset').click(function (e) { 
        e.preventDefault(); 
        CFReset(); 
    });


jQuery('#btn-cf-recalculate').click(function (e) {
    // jQuery(window).scrollTop(jQuery(".personal-finance-calculator").offset().top);
    jQuery("html, body").stop().animate({scrollTop: jQuery(".car-finance-calculator").offset().top},900,"swing");
    return false;
});


jQuery('input:radio[name="rbtnCFaccType"]').change(function () { // SECTOR CHANGE
       
        if (jQuery(this).val() === 'Sal') {
            LeaseType = 0;
        }
        else if (jQuery(this).val() === 'NonSal') {
            LeaseType = 1;
        }
        
        jQuery("#cferrmsg").hide(); //Hide error msg
        //jQuery(".cf-result-box").hide(); // Hide Results Box
        jQuery(".form-submit-border").hide();
    });
function calculateInterest(balance,interest) {
var DAYS_IN_PAYMENT_CYCLE = 365/12;
var dailyInterestRate = interest/100/365;
return (
     balance*Math.pow(1+dailyInterestRate,DAYS_IN_PAYMENT_CYCLE)-balance
);
}
function validateAutoLease(leaseType) {
    var varObject;
    var iFinOptions = leaseType; //(isNaN(parseInt(jQuery("input:radio[name='leasefinoptions']:checked").val())) ? 0 : parseInt(jQuery("input:radio[name='leasefinoptions']:checked").val()));
    var idError = "cferrmsg";

    if (iFinOptions == 0) {
        varObject = jLSal;
    }
    else if (iFinOptions == 1) {
        varObject = jLNSal;
    }

    var iSalary = (isNaN(parseInt(jQuery('#CFtxt-monthly-salary').val())) ? 0 : parseInt(jQuery('#CFtxt-monthly-salary').val()));
    var iCarPrice = (isNaN(parseInt(jQuery('#CFtxt-price-of-car').val())) ? 0 : parseInt(jQuery('#CFtxt-price-of-car').val()));
    var iInstOtherParty = (isNaN(parseInt(jQuery('#CFtxt-current-monthly-instal').val())) ? 0 : parseInt(jQuery('#CFtxt-current-monthly-instal').val()));
    var iDownpayment = (isNaN(parseInt(jQuery('#CFtxt-down-payment').val())) ? 0 : parseInt(jQuery('#CFtxt-down-payment').val()));
    var iBaloonValue = (isNaN(parseInt(jQuery('#CFtxt-balloon-payment').val())) ? 0 : parseInt(jQuery('#CFtxt-balloon-payment').val()));
    var iPeriod = (isNaN(parseInt(jQuery('#CFtxt-finance-period').val())) ? 0 : parseInt(jQuery('#CFtxt-finance-period').val()));

    var maxAllowDBR = iSalary * CalculateDBR(iSalary, leaseType);
    var iEligibleMonthlyInst = maxAllowDBR  //Math.ceil(iSalary * varObject.SalaryTakeout / 100);  
    var maxAllowLimit = iEligibleMonthlyInst - iInstOtherParty;

    //validate min Monthly salary
	 if (jQuery("#CFtxt-monthly-salary").val().length > 10) {
       
        AFShowFieldError(cfMsgObj.InvalidMaxSal,"#AFMonthSalErr");
        return 0;
    }
    if ((iSalary > 0 && iSalary < varObject.MinMonthlySalary) || (jQuery("#CFtxt-monthly-salary").val() <= 0)) {
       // ShowMessage(cfMsgObj.InvalidMinSal.replace("{0}", varObject.MinMonthlySalary), idError);
        AFShowFieldError(cfMsgObj.InvalidMinSal.replace("{0}", varObject.MinMonthlySalary),"#AFMonthSalErr");
        return 0;
    }
    else {
        AFHideFieldError("#AFMonthSalErr");
        //HideMessage(idError);
    }

    //validate MonthlyInst to other party
    if (iInstOtherParty > 0 && maxAllowLimit < 350) {
        //ShowMessage(cfMsgObj.NotEligible, idError); //.replace("{0}", iEligibleMonthlyInst), idError);
        AFShowFieldError(cfMsgObj.NotEligible,"#AFInsOtherErr");
        HideAFResultBox();
        return 0;
    }
    else if (iInstOtherParty > 0 && iInstOtherParty > iEligibleMonthlyInst) { // ((iInstOtherParty > 0 && iInstOtherParty >= iEligibleMonthlyInst) || (jQuery("#alMonthlyInst").val() <= 0)) {   //
       // ShowMessage(cfMsgObj.InvalidMonthlyInst.replace("{0}", iEligibleMonthlyInst), idError);
        AFShowFieldError(cfMsgObj.InvalidMonthlyInst.replace("{0}", iEligibleMonthlyInst),"#AFInsOtherErr");
        HideAFResultBox();
        return 0;
    }
    else {
       // HideMessage(idError);
       AFHideFieldError("#AFInsOtherErr");
    }

    //validate car price
    if ((iCarPrice > 0 && iCarPrice < varObject.MinCarValue) || (jQuery("#CFtxt-price-of-car").val() <= 0)) {
        //ShowMessage(cfMsgObj.InvalidCarPrice.replace("{0}", varObject.MinCarValue), idError);
        AFShowFieldError(cfMsgObj.InvalidCarPrice.replace("{0}", varObject.MinCarValue),"#AFCarPriceErr");
        HideAFResultBox();
        return 0;
    }
    else {
        //HideMessage(idError);
         AFHideFieldError("#AFCarPriceErr");
    }

    if (iDownpayment >= iCarPrice * 0.50) {  // || (jQuery("#alDownPayment").val() <= 0)) {
        //ShowMessage(cfMsgObj.InvalidDownPaymentValue, idError);
        AFShowFieldError(cfMsgObj.InvalidDownPaymentValue,"#AFDownPayErr");
        HideAFResultBox();
        return 0;
    }
    else{
        AFHideFieldError("#AFDownPayErr");
    }

    var actualDownPayment = (iDownpayment / iCarPrice) * 100;

    //=IF(AND(C3="YES",C9>=0),"OK",IF(AND(C3="NO",U9>=10%),"OK","Down Payment Too Low"))

    //validate downpayment
    if (iFinOptions == 0) {
        // Downpayment for salaried 

        if ((iDownpayment > 0 && iDownpayment >= iCarPrice)) {
            //ShowMessage(cfMsgObj.InvalidDownPayment, idError);
            AFShowFieldError(cfMsgObj.InvalidDownPayment,"#AFDownPayErr");
            HideAFResultBox();
            return 0;
        } else {
             AFHideFieldError("#AFDownPayErr");
            //HideMessage(idError); 
        }
    }
    else if (iFinOptions == 1) {
        //DownPayment for Non Salaried
        iMinDownPayment = varObject.MinDownpayment;     //iCarPrice * varObject.MinDownpayment / 100;
        if ((iDownpayment >= 0 && actualDownPayment < iMinDownPayment)) {
            //iDownpayment = iMinDownPayment;
            //ShowMessage(cfMsgObj.InvalidMinDownPayment.replace("{0}", iCarPrice * varObject.MinDownpayment / 100), idError);
            //ShowMessage(cfMsgObj.DownPaymentTooLow, idError);
            AFShowFieldError(cfMsgObj.DownPaymentTooLow,"#AFDownPayErr");
            HideAFResultBox();

            //jQuery("#alDownPayment").val(iMinDownPayment);
            return 0;
        }
        else if (iDownpayment > 0 && iDownpayment >= iCarPrice) {
            //ShowMessage(cfMsgObj.InvalidDownPayment, idError);
            AFShowFieldError(cfMsgObj.InvalidDownPayment,"#AFDownPayErr");
            HideAFResultBox();
            return 0;
        } else { 
           // HideMessage(idError);
            AFHideFieldError("#AFDownPayErr"); 
        }
    }


    if(iPeriod == 0) {
       AFShowFieldError(cfMsgObj.SelectOption,"#AFFinPeriodErr");
       HideAFResultBox();
       return 0; 
    }
    else{
         AFHideFieldError("#AFFinPeriodErr"); 
    }

    //(varObject.BalloonValue / iCarPrice);


    if (iBaloonValue <= 0) {
       //ShowMessage(cfMsgObj.InvalidBaloonValue, idError);
       AFShowFieldError(cfMsgObj.InvalidBaloonValue,"#AFBaloonErr");
       HideAFResultBox();
       return 0;
    }
    else {
      // HideMessage(idError);
       AFHideFieldError("#AFBaloonErr"); 
    }

    var actualBaloonPayment = (iBaloonValue / iCarPrice) * 100;
    var baloonPercentofPrice = iCarPrice * (iBaloonValue / 100);

    if (iBaloonValue >= iCarPrice) {
        //ShowMessage(cfMsgObj.InvalidBaloonValue, idError);
        AFShowFieldError(cfMsgObj.InvalidBaloonValue,"#AFBaloonErr");
        HideAFResultBox();
        return 0;
    }
    else if (actualBaloonPayment > 35) {
        //ShowMessage(cfMsgObj.EndPaymentTooHigh, idError);
        AFShowFieldError(cfMsgObj.EndPaymentTooHigh,"#AFBaloonErr");
        HideAFResultBox();
        return 0;
    }
    else { 
       // HideMessage(idError); 
        AFHideFieldError("#AFBaloonErr"); 
    }

   // clearResults();
    return 1;
}
jQuery('input:radio[name="rbtnCCFcardType"]').change(function () { // SECTOR CHANGE
       
        var x;   
        for(x=0;x<ccf.length;x++)
        {
	if (jQuery(this).val() === ccf[x].Id) {
         fee = parseFloat(ccf[x].Fees);
         fee_input = parseFloat(ccf[x].Fees);
	}
        }
        /*if (jQuery(this).val() === 'platinum') {
            fee = parseFloat(jQuery("#CCFtxt-fee-platinum").val());
            fee_input = parseFloat(jQuery("#CCFtxt-fee-platinum").val());
        }
        else if (jQuery(this).val() === 'signature') {
            fee = parseFloat(jQuery("#CCFtxt-fee-signature").val());
            fee_input = parseFloat(jQuery("#CCFtxt-fee-signature").val());
        }
        else if (jQuery(this).val() === 'infinite') {
            fee = parseFloat(jQuery("#CCFtxt-fee-infinite").val());
            fee_input = parseFloat(jQuery("#CCFtxt-fee-infinite").val());
        }*/
        
        
    });
function calcCardFinance(){

var cardType = jQuery("#CCFcard-type").val();
var creditLimit = parseFloat(jQuery("#CCFtxt-credit-amount").val());
var interestRate = parseFloat(jQuery("#CCFtxt-apr").val());
var minPaymentPercent = parseFloat(jQuery("#CCFtxt-payment-percentage").val());
var monthlyAPR = Math.pow(1+interestRate/100,1/12)-1;
var EMI = creditLimit /12;
var outstandingBalance = creditLimit;

if (creditLimit > 150000 || creditLimit < 10000) {
    AFShowFieldError("Please enter between 10000 and 150000 SAR","#CCFCreditAmountErr");
    return 0;
    }
    else{
    AFHideFieldError("#CCFCreditAmountErr");
}

//Calculate Months
var minDue = creditLimit*minPaymentPercent /100;
var monthlyAPRmodified = interestRate/12; 
var monthlyInterest = 0;

var remainingBalance = creditLimit;
var closingBalance = remainingBalance;

var payoffPeriod=1;
while(remainingBalance >0)
{
if(closingBalance <= minDue){
break;
}
payoffPeriod++;
closingBalance = remainingBalance-minDue;
monthlyInterest = closingBalance*monthlyAPRmodified/100;
remainingBalance = closingBalance+monthlyInterest;
if(remainingBalance*minPaymentPercent/100 >100){
minDue = remainingBalance*minPaymentPercent/100;
}
else{minDue = 100;}
}

//calculate EMI
while(outstandingBalance !=0)
{
if(Math.round(outstandingBalance) == 0)
{break;}
outstandingBalance = creditLimit;
var i;
for(i=0;i<12;i++)
{
var interest = monthlyAPR*outstandingBalance;
outstandingBalance = outstandingBalance+interest+fee-EMI;
outstandingBalance = Math.round(outstandingBalance*1e2)/1e2;
fee=0;
}
fee = fee_input;
if(outstandingBalance>0)
{
EMI = EMI+outstandingBalance/12;
}
else
{
EMI = EMI+outstandingBalance/12;
}
EMI = Math.round(EMI*1e2)/1e2;
}
//Now calculate APR
var sum=parseFloat(0.0);
var APR;
var representativeAPR;
for(APR=interestRate; APR<100; APR+=0.01)
{
var i;
for(i=1;i<13;i++)
{
sum = sum+parseFloat(EMI/Math.pow((1+APR/100),(i*30.42/365)));
}
if(Math.round(sum)==creditLimit || Math.round(sum)==creditLimit+1 || Math.round(sum)==creditLimit-1 || Math.round(sum)==creditLimit+2 
|| Math.round(sum)==creditLimit-2 || Math.round(sum)==creditLimit+3 || Math.round(sum)==creditLimit-3 || Math.round(sum)==creditLimit+4 || Math.round(sum)==creditLimit-4){representativeAPR=APR; break;}
sum = 0.0;
}
var repAPR = Math.round(representativeAPR*1e2)/1e2;



jQuery('#CCFMonthlyRepayment').html("<span class='currency'>SAR </span>" + formatCurrency(EMI ,0)  + "*");
     //jQuery('#CFpaymentDesc').html(CFresources.Basedoverastandardperiodof+" " + period + " "+ CFresources.months +" ("+ iTotalYears + " " +CFresources.years+")");
     //jQuery('#CFFinanceAmount').html("<span class='currency'> "+balance+" </span>" + formatCurrency(balance,0) + "*");
     jQuery('#CCFTotalAmountPayable').html("<span>" + repAPR + "</span>*");
     jQuery('#CCFPayablePeriod').html("<span>"+payoffPeriod+" Months </span>")

}

function calcCardFinanceOld() {

    var idError = "cferrmsg";
    
    var salaryAmt = (isNaN(parseInt(jQuery('#CFtxt-monthly-salary').val())) ? 0 : parseInt(jQuery('#CFtxt-monthly-salary').val()));
    var carValue = (isNaN(parseInt(jQuery('#CFtxt-price-of-car').val())) ? 0 : parseInt(jQuery('#CFtxt-price-of-car').val()));
    var exisMonthlyOblig = (isNaN(parseInt(jQuery('#CFtxt-current-monthly-instal').val())) ? 0 : parseInt(jQuery('#CFtxt-current-monthly-instal').val()));
    var downPayment = (isNaN(parseInt(jQuery('#CFtxt-down-payment').val())) ? 0 : parseInt(jQuery('#CFtxt-down-payment').val()));
    var period = (isNaN(parseInt(jQuery('#CFtxt-finance-period').val())) ? 0 : parseInt(jQuery('#CFtxt-finance-period').val()));
    var iBaloonValue = (isNaN(parseInt(jQuery('#CFtxt-balloon-payment').val())) ? 0 : parseInt(jQuery('#CFtxt-balloon-payment').val()));
    var iTotalYears = period;

    var iDownPaymentCalc = 0;
    if (iFinOptions == 0) {
        varObject = jLSal;
    }
    else if (iFinOptions == 1) {
        varObject = jLNSal;
    }


    var maxAllowDBR = salaryAmt * CalculateDBR(salaryAmt, leaseType);
    var maxAllowLimit = maxAllowDBR - exisMonthlyOblig;

    var IRRval = [];
    var financed = 0;
    period = period * 12;
    var downPaymentPercentage = downPayment / carValue;

    //var baloonPaymt = iBaloonValue / 100;           //varObject.BalloonValue / 100;  //0.35; //Fixed Value

    var calcBaloonPaymt = carValue * (iBaloonValue / carValue);
    var BaloonPaymtPercent = (iBaloonValue / carValue);
    var financeAmt = carValue - (carValue * downPaymentPercentage)
    var managmentFee = financeAmt * (varObject.ManagmentFee / 100); //0.01;           // 1% Management Fee //Changes
    var computedInsur = CalcDepreciation(carValue, varObject.FinanceRate, period, varObject.InsuranceRate);
    var FinanceRateVal = (varObject.FinanceRate / 100) / 12;
    var PMT = PMTCalc(FinanceRateVal, period, -financeAmt - computedInsur, calcBaloonPaymt, 0);         //PMTCalc(0.005125,60,-94913.83,0,0);
    var profitAmt = (((PMT * period) + (carValue * BaloonPaymtPercent)) - financeAmt - computedInsur).toFixedDown(2);
    var totalValofContract = (downPayment + +financeAmt + +managmentFee + +profitAmt + +computedInsur).toFixedDown(2);
    financed = -financeAmt + managmentFee; //AM

    var rental = PMT; //.toFixed(0); am 
    IRRval.push(financed);
    for (i = 0; i < period - 1; i++) {
        IRRval.push(rental);
    }

    IRRval.push(+rental + +(carValue * BaloonPaymtPercent));

    var IRR = IRRCalc(IRRval, 0.001) * 0.01;
    var APR = ((Math.pow(1 + IRR, 12) - 1) * 100); //.toFixed(2);
    var marginProfitRate = ((profitAmt / financeAmt / (period / 12)) * 100).toFixed(2);
    var marginProfitInsur = ((computedInsur / carValue / (period / 12)) * 100).toFixed(2);
    var totalAmtPayableUpFront = (carValue - financeAmt + managmentFee).toFixed(0);
    var totalAmtPayableInInstalments = (financeAmt + +profitAmt + +computedInsur).toFixedDown(0); //.toFixed(0);
    var monthlyInstallment = rental.toFixed(0); //.toFixed(0);

    var temp = carValue * BaloonPaymtPercent;
    var finalInstallment = (+rental + +temp).toFixed(0);
    //finalInstallment = (finalInstallment).toFixed(0);

    // "Try with lower car value, higher down payment, higher balloon payment, higher tenor";
    if (maxAllowLimit < monthlyInstallment) {
        ShowMessage(cfMsgObj.TryLowerCarHighDownHighBaloonHighTenor, idError);
		jQuery("html, body").stop().animate({scrollTop: jQuery("#cferrmsg").offset().top - 200},900,"swing");
        return 0;
    }
    else {
        HideMessage(idError);
    }

    //  var LastPayment = (iCarNetPrice - resAddDownPayment) * baloonPaymtPercentage / 100;

     jQuery('#CFMonthlyRepayment').html("<span class='currency'> "+CFresources.SAR+" </span>" + formatCurrency(monthlyInstallment,0)  + "*");
     jQuery('#CFpaymentDesc').html(CFresources.Basedoverastandardperiodof+" " + period + " "+ CFresources.months +" ("+ iTotalYears + " " +CFresources.years+")");
     jQuery('#CFFinanceAmount').html("<span class='currency'> "+CFresources.SAR+" </span>" + formatCurrency(financeAmt,0) + "*");
     jQuery('#CFTotalAmountPayable').html("<span class='currency'> "+CFresources.SAR+" </span>" + formatCurrency(totalAmtPayableInInstalments,0) + "*");
     jQuery('#CFAPR').html(+APR.toFixed(2) + "%")
    
     jQuery(".cf-result-box").show(); // SHow Results Box
     jQuery(".form-submit-border").show();
	// jQuery("#btn-calculate").hide();//hide calculate button
	 jQuery("#btn-reset").show();//show reset button
	 jQuery(".terms-block").show();

    if (jQuery(window).width() <= 768) {
        jQuery("html, body").stop().animate({scrollTop: jQuery(".calculations-info-box").offset().top - 50},900,"swing");
        jQuery("#btn-cf-recalculate").removeClass("disabled");
    }
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

function PMTCalc(ir, np, pv, fv, type) {
    /*
    ir - interest rate per month
    np - number of periods (months)
    pv - present value
    fv - future value (residual value)
    */
    if (!fv) fv = 0;
    if (!type) type = 0;

    if (ir == 0) return -(pv + fv) / np;

    var pvif = Math.pow(1 + ir, np);
    var pmt = ir / (pvif - 1) * -(pv * pvif + fv);

    if (type == 1) {
        pmt /= (1 + ir);
    };

    return pmt;
}

function CalcDepreciation(carValue, profitRate, period, insurRate) {

    //var insurRate = 4.43;  // Insurance Rate For Ist and 2nd Year
    var percentag = [100, 85, 72.25, 61.41, 52.20];
    var calcProfit = 1 + (profitRate / 100);
    var finalVal = 0.0;

    var periodflag = 0;

    for (var i = 0; i <= 4; i++) {
        var percMul = (carValue * percentag[i]) / 100;
        var insurMul = (percMul * insurRate) / 100;
        insurMul = period > periodflag ? insurMul.toFixed(0) : 0;

        var applyPower = Math.pow(calcProfit, i);
        var calcVal = insurMul / applyPower;
        calcVal = calcVal.toFixed(0);

        finalVal = +finalVal + +calcVal;
        periodflag = periodflag + 12;
    }
    return finalVal.toFixed(0); //Chnage this for the Profit amount 2 differenece
}

function CalculateDBR(salaryAmt, leaseType) {
    if (leaseType == 0) {
        //salaried
        //IF(AND(C4>0,C4<=5000),50%,IF(AND(C4>5000,C4<=15000),60%,IF(C4>15000,65%,0)))

        if (salaryAmt > 0 && salaryAmt <= 5000) {
            return 0.50;
        }
        else if (salaryAmt > 5000 && salaryAmt <= 15000) {
            return 0.60;
        }
        else if (salaryAmt > 15000) {
            return 0.65;
        }
        else return 0;  
    }
    else if (leaseType == 1) {
        //nonSalaried
        //=IF(AND(C4>0,C4<=15000),50%,IF(C4>15000,60%,0))

        if (salaryAmt > 0 && salaryAmt <= 15000) {
            return 0.50;
        }
        else if (salaryAmt > 15000) {
            return 0.60;
        }
        else return 0;
    }
    return 0;
}

//Error Message
function CFMessages() {
    //english messages
    this.InvalidMinSal = CFresources.SalarylowerthanminimumSalary; //"The acceptable monthly salary should be SR {0} and above";  
    this.InvalidCarPrice = CFresources.CarpriceshouldbeSRandabove;
    this.InvalidDownPayment = CFresources.Downpaymentshouldbelessthanthecarprice;
    this.InvalidMinDownPayment = CFresources.AcceptableMinimumDownPaymentis;
    this.InvalidMonthlyInst = CFresources.YouhaveexceededthemaximumallowedfinanceYourmonthlypaymentshouldbelessthan;  
    this.SelectOption = CFresources.Pleaseselectanyoption;
    this.NotEligible = CFresources.NotEligible;
    this.InvalidDownPaymentValue =CFresources.InvalidDownPaymentValue;
    this.TryLowerCarHighDownHighBaloonHighTenor = CFresources.Trywithlowercarvaluehigherdownpaymenthigherballoonpaymenthighertenor;
    this.InvalidBaloonValue = CFresources.InvalidBalloonValue;
    this.EndPaymentTooHigh = CFresources.EndPaymentTooHigh;
    this.DownPaymentTooLow = CFresources.DownPaymentTooLow;
	this.InvalidMaxSal = CFresources.MaximumSalaryRangeExceeded;
}

//show message
function ShowMessage(sMsg, idError) {
    jQuery("#" + idError).find('p').text(sMsg).show();
    jQuery('#cferrmsg').show();
}
//Hide message
function HideMessage(idError) {
    jQuery("#" + idError).hide();
    jQuery('#cferrmsg').hide();
}


function AFShowFieldError(sMsg, sID){
  jQuery(sID).text(sMsg);
  jQuery(sID).show();
}

function AFHideFieldError(sID){
    jQuery(sID).hide();
}

function HideAFResultBox()
{
  //jQuery(".cf-result-box").hide(); // Hide Results Box
  jQuery(".form-submit-border").hide();
}
jQuery('#CFtxt-monthly-salary').on('change', function() {
	// if (jQuery(this).val()) {
		// EnableNextInput('CFtxt-current-monthly-instal')
		// CFCalculate=true;
	// }else{
		// jQuery('#CFtxt-current-monthly-instal').prop('disabled', true);
	// }
	
	
	var varObject;
    var iFinOptions = LeaseType; 
    
    if (iFinOptions == 0) {
        varObject = jLSal;
    }
    else if (iFinOptions == 1) {
        varObject = jLNSal;
    }
	var iSalaryAF = (isNaN(parseInt(jQuery('#CFtxt-monthly-salary').val())) ? 0 : parseInt(jQuery('#CFtxt-monthly-salary').val()));
 if (jQuery("#CFtxt-monthly-salary").val().length > 10) {
       
		AFShowFieldError(cfMsgObj.InvalidMaxSal,"#AFMonthSalErr");
		AFRemoveClass("#CFtxt-monthly-salary","pws-cal-success");
		AFAddClass("#CFtxt-monthly-salary","pws-cal-error");
		jQuery('#CFtxt-current-monthly-instal').prop('disabled', true);
		
		isValidSalary = false;
		isValidAllCF();
        return 0;
    }
	 else {
        
		AFHideFieldError("#AFMonthSalErr"); 
		AFRemoveClass("#CFtxt-monthly-salary","pws-cal-error");
		AFAddClass("#CFtxt-monthly-salary","pws-cal-success");
		EnableNextInput('CFtxt-current-monthly-instal')
		CFCalculate=true;
		isValidSalary = true;
		isValidAllCF();
        
    }
	
    if ((iSalaryAF > 0 && iSalaryAF < varObject.MinMonthlySalary) || (jQuery("#CFtxt-monthly-salary").val() <= 0)) {
        AFShowFieldError(cfMsgObj.InvalidMinSal.replace("{0}", varObject.MinMonthlySalary),"#AFMonthSalErr");
        AFRemoveClass("#CFtxt-monthly-salary","pws-cal-success");
		AFAddClass("#CFtxt-monthly-salary","pws-cal-error");
		jQuery('#CFtxt-current-monthly-instal').prop('disabled', true);
		
		isValidSalary = false;
		isValidAllCF();
        return 0;
    }
    else {
        
		AFHideFieldError("#AFMonthSalErr"); 
		AFRemoveClass("#CFtxt-monthly-salary","pws-cal-error");
		AFAddClass("#CFtxt-monthly-salary","pws-cal-success");
		EnableNextInput('CFtxt-current-monthly-instal')
		CFCalculate=true;
		isValidSalary = true;
		isValidAllCF();
        
    }
	
});
jQuery('#CFtxt-current-monthly-instal').on('change', function() {
	// if (jQuery(this).val()) {
		// EnableNextInput('CFtxt-price-of-car')
		// CFCalculate=true;
	// }else{
		// jQuery('#CFtxt-price-of-car').prop('disabled', true);
	// }
	
	
	
	var iSalaryInstall = (isNaN(parseInt(jQuery('#CFtxt-monthly-salary').val())) ? 0 : parseInt(jQuery('#CFtxt-monthly-salary').val()));
    var iInstOtherParty = (isNaN(parseInt(jQuery('#CFtxt-current-monthly-instal').val())) ? 0 : parseInt(jQuery('#CFtxt-current-monthly-instal').val()));
    var maxAllowDBR = iSalaryInstall * CalculateDBR(iSalaryInstall, LeaseType);
    var iEligibleMonthlyInst = maxAllowDBR  
    var maxAllowLimit = iEligibleMonthlyInst - iInstOtherParty;

    //validate MonthlyInst to other party
 
 if (jQuery('#CFtxt-current-monthly-instal').val().length <= 0) {	
		
		AFShowFieldError(cfMsgObj.NotEligible,"#AFInsOtherErr");
        HideAFResultBox();
		 AFRemoveClass("#CFtxt-current-monthly-instal","pws-cal-success");
		AFAddClass("#CFtxt-current-monthly-instal","pws-cal-error");
		jQuery('#CFtxt-price-of-car').prop('disabled', true);
        
		isValidInstallment = false;
		isValidAllCF();
        return 0;}
    if (iInstOtherParty > 0 && maxAllowLimit < 350) {
        
        AFShowFieldError(cfMsgObj.NotEligible,"#AFInsOtherErr");
        HideAFResultBox();
		 AFRemoveClass("#CFtxt-current-monthly-instal","pws-cal-success");
		AFAddClass("#CFtxt-current-monthly-instal","pws-cal-error");
		jQuery('#CFtxt-price-of-car').prop('disabled', true);
        
		isValidInstallment = false;
		isValidAllCF();
        return 0;
    }
    else if (iInstOtherParty > 0 && iInstOtherParty > iEligibleMonthlyInst) { 
        AFShowFieldError(cfMsgObj.InvalidMonthlyInst.replace("{0}", iEligibleMonthlyInst),"#AFInsOtherErr");
        HideAFResultBox();
		 AFRemoveClass("#CFtxt-current-monthly-instal","pws-cal-success");
		AFAddClass("#CFtxt-current-monthly-instal","pws-cal-error");
		jQuery('#CFtxt-price-of-car').prop('disabled', true);
		
		isValidInstallment = false;
		isValidAllCF();
        return 0;
    }
    else {
       // HideMessage(idError);
       AFHideFieldError("#AFInsOtherErr");
	   EnableNextInput('CFtxt-price-of-car');
	   AFRemoveClass("#CFtxt-current-monthly-instal","pws-cal-error");
	AFAddClass("#CFtxt-current-monthly-instal","pws-cal-success");
	isValidInstallment = true;
		CFCalculate=true;
		isValidAllCF();
    }	
	
});
jQuery('#CFtxt-price-of-car').on('change', function() {
	// if (jQuery(this).val()) {
		// EnableNextInput('CFtxt-down-payment')
		// CFCalculate=true;
	// }else{
		// jQuery('#CFtxt-down-payment').prop('disabled', true);
	// }
		
	var varObject;
    var iFinOptions = LeaseType;
    if (iFinOptions == 0) {
        varObject = jLSal;
    }
    else if (iFinOptions == 1) {
        varObject = jLNSal;
    }
 
  var iCarPrice = (isNaN(parseInt(jQuery('#CFtxt-price-of-car').val())) ? 0 : parseInt(jQuery('#CFtxt-price-of-car').val()));
 if ((iCarPrice > 0 && iCarPrice < varObject.MinCarValue) || (jQuery("#CFtxt-price-of-car").val() <= 0)) {
        AFShowFieldError(cfMsgObj.InvalidCarPrice.replace("{0}", varObject.MinCarValue),"#AFCarPriceErr");
        HideAFResultBox();
		 AFRemoveClass("#CFtxt-price-of-car","pws-cal-success");
		AFAddClass("#CFtxt-price-of-car","pws-cal-error");
		jQuery('#CFtxt-down-payment').prop('disabled', true);
		
		isValidCarPrice = false;
		isValidAllCF();
        return 0;
    }
    else {
        //HideMessage(idError);
         AFHideFieldError("#AFCarPriceErr");
		 EnableNextInput('CFtxt-down-payment');
		 AFRemoveClass("#CFtxt-price-of-car","pws-cal-error");
		AFAddClass("#CFtxt-price-of-car","pws-cal-success");
		 CFCalculate=true;
		 isValidCarPrice = true;
		 isValidAllCF();
    }

	
	
});
jQuery('#CFtxt-down-payment').on('change keydown', function() {
	// if (jQuery(this).val()) {
		// EnableNextInput('CFtxt-finance-period')
		// CFCalculate=true;
	// }else{
		// jQuery('#CFtxt-finance-period').prop('disabled', true);
	// }
	 if (jQuery('#CFtxt-down-payment').val().length <= 0) {  // || (jQuery("#alDownPayment").val() <= 0)) {
        jQuery('#CFtxt-finance-period').prop('disabled', true);
        AFShowFieldError(cfMsgObj.InvalidDownPaymentValue,"#AFDownPayErr");
		AFRemoveClass("#CFtxt-down-payment","pws-cal-success");
		AFAddClass("#CFtxt-down-payment","pws-cal-error");
        HideAFResultBox();
		
		isValidDownPayment = false;
		isValidAllCF();
        return 0;
    }
	
	var varObject;
    var iFinOptions = LeaseType; 
    
    if (iFinOptions == 0) {
        varObject = jLSal;
    }
    else if (iFinOptions == 1) {
        varObject = jLNSal;
    }
    var iCarPrice = (isNaN(parseInt(jQuery('#CFtxt-price-of-car').val())) ? 0 : parseInt(jQuery('#CFtxt-price-of-car').val()));
   
    var iDownpayment = (isNaN(parseInt(jQuery('#CFtxt-down-payment').val())) ? 0 : parseInt(jQuery('#CFtxt-down-payment').val()));
    
  
    if (iDownpayment==0 || iDownpayment >= iCarPrice * 0.50) {  // || (jQuery("#alDownPayment").val() <= 0)) {
        jQuery('#CFtxt-finance-period').prop('disabled', true);
        AFShowFieldError(cfMsgObj.InvalidDownPaymentValue,"#AFDownPayErr");
		AFRemoveClass("#CFtxt-down-payment","pws-cal-success");
		AFAddClass("#CFtxt-down-payment","pws-cal-error");
        HideAFResultBox();
		
		isValidDownPayment = false;
		isValidAllCF();
        return 0;
    }
    else{
        AFHideFieldError("#AFDownPayErr");
		EnableNextInput('CFtxt-finance-period');
		AFRemoveClass("#CFtxt-down-payment","pws-cal-error");
		AFAddClass("#CFtxt-down-payment","pws-cal-success");
		CFCalculate=true;
		isValidDownPayment = true;
		isValidAllCF();
    }

    var actualDownPayment = (iDownpayment / iCarPrice) * 100;
    //validate downpayment
    if (iFinOptions == 0) {
        // Downpayment for salaried 

        if ((iDownpayment > 0 && iDownpayment >= iCarPrice)) {
            
            AFShowFieldError(cfMsgObj.InvalidDownPayment,"#AFDownPayErr");
			AFRemoveClass("#CFtxt-down-payment","pws-cal-success");
		AFAddClass("#CFtxt-down-payment","pws-cal-error");
		jQuery('#CFtxt-finance-period').prop('disabled', true);
            HideAFResultBox();
			jQuery(".terms-block").hide();
		jQuery("#ccf-btn-calculate").addClass("disabled");
		isValidDownPayment = false;
		isValidAllCF();
            return 0;
        } else {
             AFHideFieldError("#AFDownPayErr");
            EnableNextInput('CFtxt-finance-period');
		AFRemoveClass("#CFtxt-down-payment","pws-cal-error");
		AFAddClass("#CFtxt-down-payment","pws-cal-success");
		isValidDownPayment = true;
		isValidAllCF();
		CFCalculate=true;
        }
    }
    else if (iFinOptions == 1) {
        //DownPayment for Non Salaried
        iMinDownPayment = varObject.MinDownpayment;     //iCarPrice * varObject.MinDownpayment / 100;
        if ((iDownpayment >= 0 && actualDownPayment < iMinDownPayment)) {
           
            AFShowFieldError(cfMsgObj.DownPaymentTooLow,"#AFDownPayErr");
			AFRemoveClass("#CFtxt-down-payment","pws-cal-success");
		AFAddClass("#CFtxt-down-payment","pws-cal-error");
		jQuery('#CFtxt-finance-period').prop('disabled', true);
            HideAFResultBox();    
		
		isValidDownPayment = false;
		isValidAllCF();
            return 0;
        }
        else if (iDownpayment > 0 && iDownpayment >= iCarPrice) {
            //ShowMessage(cfMsgObj.InvalidDownPayment, idError);
            AFShowFieldError(cfMsgObj.InvalidDownPayment,"#AFDownPayErr");
			AFRemoveClass("#CFtxt-down-payment","pws-cal-success");
		AFAddClass("#CFtxt-down-payment","pws-cal-error");
		jQuery('#CFtxt-finance-period').prop('disabled', true);
            HideAFResultBox();
			
		isValidDownPayment = false;
		isValidAllCF();
            return 0;
        } else { 
           // HideMessage(idError);
            AFHideFieldError("#AFDownPayErr"); 
			 EnableNextInput('CFtxt-finance-period');
		AFRemoveClass("#CFtxt-down-payment","pws-cal-error");
		AFAddClass("#CFtxt-down-payment","pws-cal-success");
		CFCalculate=true;
		isValidDownPayment = true;
		isValidAllCF();
        }
    }
	
});

jQuery('#CFtxt-finance-period').on('change', function() {
	if(jQuery(this).prop('selectedIndex') > 0) {
		EnableNextInput('CFtxt-balloon-payment')
		AFRemoveClass("#CFtxt-finance-period","pws-cal-error");
		AFAddClass("#CFtxt-finance-period","pws-cal-success");
		isValidFinancePeriod = true;
		isValidAllCF();
	}
	else{
		jQuery('#CFtxt-balloon-payment').prop('disabled', true);
		AFRemoveClass("#CFtxt-finance-period","pws-cal-success");
		AFAddClass("#CFtxt-finance-period","pws-cal-error");
		
		isValidFinancePeriod = false;
		isValidAllCF();
	}
	
});
jQuery('#CFtxt-balloon-payment').on('change keyup', function() {
	// if (jQuery(this).val()) {		
			// jQuery("#btn-calculate").removeClass("disabled");
		// }
	// else{
		// jQuery("#btn-calculate").addClass("disabled");
	// }
	
	
var iCarPrice = (isNaN(parseInt(jQuery('#CFtxt-price-of-car').val())) ? 0 : parseInt(jQuery('#CFtxt-price-of-car').val()));
   var iBaloonValue = (isNaN(parseInt(jQuery('#CFtxt-balloon-payment').val())) ? 0 : parseInt(jQuery('#CFtxt-balloon-payment').val()));
  if (iBaloonValue <= 0) {
       //ShowMessage(cfMsgObj.InvalidBaloonValue, idError);
       AFShowFieldError(cfMsgObj.InvalidBaloonValue,"#AFBaloonErr");
	   jQuery("#ccf-btn-calculate").addClass("disabled");
	   AFRemoveClass("#CFtxt-balloon-payment","pws-cal-success");
		AFAddClass("#CFtxt-balloon-payment","pws-cal-error");
       HideAFResultBox();
	   
		isValidBallonPayment = false;
		isValidAllCF();
       return 0;
    }
    else {
      // HideMessage(idError);
       AFHideFieldError("#AFBaloonErr"); 
	   jQuery("#ccf-btn-calculate").removeClass("disabled");
	   AFRemoveClass("#CFtxt-balloon-payment","pws-cal-error");
		AFAddClass("#CFtxt-balloon-payment","pws-cal-success");
		isValidBallonPayment = true;
		isValidAllCF();
    }

    var actualBaloonPayment = (iBaloonValue / iCarPrice) * 100;
    var baloonPercentofPrice = iCarPrice * (iBaloonValue / 100);

    if (iBaloonValue >= iCarPrice) {
        //ShowMessage(cfMsgObj.InvalidBaloonValue, idError);
        AFShowFieldError(cfMsgObj.InvalidBaloonValue,"#AFBaloonErr");
		 jQuery("#ccf-btn-calculate").addClass("disabled");
	   AFRemoveClass("#CFtxt-balloon-payment","pws-cal-success");
		AFAddClass("#CFtxt-balloon-payment","pws-cal-error");
        HideAFResultBox();
		
		isValidBallonPayment = false;
		isValidAllCF();
        return 0;
    }
    else if (actualBaloonPayment > 35) {
        //ShowMessage(cfMsgObj.EndPaymentTooHigh, idError);
        AFShowFieldError(cfMsgObj.EndPaymentTooHigh,"#AFBaloonErr");
		 jQuery("#ccf-btn-calculate").addClass("disabled");
	   AFRemoveClass("#CFtxt-balloon-payment","pws-cal-success");
		AFAddClass("#CFtxt-balloon-payment","pws-cal-error");
        HideAFResultBox();
		
		isValidBallonPayment = false;
		isValidAllCF();
        return 0;
    }
    else { 
       // HideMessage(idError); 
        AFHideFieldError("#AFBaloonErr"); 
		 jQuery("#ccf-btn-calculate").removeClass("disabled");
	   AFRemoveClass("#CFtxt-balloon-payment","pws-cal-error");
		AFAddClass("#CFtxt-balloon-payment","pws-cal-success");
		isValidBallonPayment = true;
		isValidAllCF();
    }
	
	
});

function isValidAllCF()
{
	if(isValidSalary && isValidInstallment && isValidCarPrice && isValidDownPayment && isValidFinancePeriod && isValidBallonPayment)
	{
		//jQuery(".terms-block").show();
		jQuery("#ccf-btn-calculate").removeClass("disabled");
	}
	else
	{
		jQuery(".terms-block").hide();
		jQuery("#ccf-btn-calculate").addClass("disabled");
	}
}
function AFAddClass(sID, className){
    jQuery(sID).addClass(className);
}

function AFRemoveClass(sID, className){
	if(jQuery(sID).hasClass(className)){
    jQuery(sID).removeClass(className);
	}
}
function EnableNextInput(nextElementID){	
    jQuery('#'+nextElementID).prop('disabled', this.value === "");
	 jQuery('#'+nextElementID).focus();
}
function GenerateCFTenure(){
    var x = document.getElementById("CFtxt-finance-period");
    var opt = document.createElement('option');
    opt.value = 0 ;
    opt.text = CFresources.select;
    x.add(opt);

    for(i = 1; i <= CFTotalYear; i++){  
        var option = document.createElement("option");
        option.value = i;
        option.text = i  == 1 ? i + " " + SingleYear : i + " " + MultipleYears ;
        x.add(option);
    }
}

function CFReset() {
    jQuery('#CFtxt-monthly-salary').val('');
    jQuery("#CFtxt-price-of-car").val('');
    jQuery('#CFtxt-current-monthly-instal').val('');
    jQuery('#CFtxt-down-payment').val('');
    jQuery('#CFtxt-finance-period option:eq(0)').attr('selected','selected');
    jQuery('#CFtxt-balloon-payment').val('');
	
	
	//disable all inputs
	jQuery('#CFtxt-current-monthly-instal').prop('disabled', true);
	jQuery('#CFtxt-price-of-car').prop('disabled', true);
	jQuery('#CFtxt-down-payment').prop('disabled', true);
	jQuery('#CFtxt-finance-period').prop('disabled', true);
	jQuery('#CFtxt-balloon-payment').prop('disabled', true);
	
    //Reset Result Box
    jQuery('#CFMonthlyRepayment').html('<span class="currency"> '+CFresources.SAR+' 0*</span>');
    jQuery('#CFpaymentDesc').html(CFresources.BasedOverAStandardPeriodOf12months);
    jQuery('#CFFinanceAmount').html('<span class="currency"> '+CFresources.SAR+' 0*</span>');
    jQuery('#CFTotalAmountPayable').html('<span class="currency"> '+CFresources.SAR+' 0*</span>');
    jQuery('#CFAPR').html('0%');

    //Reset Field Error Messages
    jQuery('#AFMonthSalErr').html('');
    jQuery('#AFInsOtherErr').html('');
    jQuery('#AFCarPriceErr').html('');
    jQuery('#AFDownPayErr').html('');
    jQuery('#AFFinPeriodErr').html('');
    jQuery('#AFBaloonErr').html(''); 

    //Hide error msg
    jQuery("#cferrmsg").hide(); 
    //jQuery(".cf-result-box").hide();
    jQuery(".form-submit-border").hide();
	jQuery("#btn-reset").hide();//hide reset button
	jQuery("#ccf-btn-calculate").addClass("disabled")
	jQuery("#ccf-btn-calculate").show(); // show calculate button
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

Number.prototype.toFixedDown = function(digits) {
    var re = new RegExp("(\\d+\\.\\d{" + digits + "})(\\d)"),
        m = this.toString().match(re);
    return m ? parseFloat(m[1]) : this.valueOf();
};