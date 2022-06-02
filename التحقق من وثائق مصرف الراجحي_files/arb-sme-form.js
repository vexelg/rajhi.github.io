
jQuery(document).ready(function () {
    var smeDatepicker = jQuery('.sme-datepicker');
    var lang = jQuery("html").attr("lang");
    if (lang == 'ar') {
        (function( factory ) {
            if ( typeof define === "function" && define.amd ) {

                // AMD. Register as an anonymous module.
                define([ "../jquery.ui.datepicker" ], factory );
            } else {

                // Browser globals
                factory( jQuery.datepicker );
            }
        }(function( datepicker ) {

            datepicker.regional.ar = {
                closeText: "إغلاق",
                prevText: "&#x3C;السابق",
                nextText: "التالي&#x3E;",
                currentText: "اليوم",
                monthNames: [ "يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو",
                    "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر" ],
                monthNamesShort: [ "يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو",
                    "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر" ],
                dayNames: [ "الأحد", "الاثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة", "السبت" ],
                dayNamesShort: [ "أحد", "اثنين", "ثلاثاء", "أربعاء", "خميس", "جمعة", "سبت" ],
                dayNamesMin: [ "ح", "ن", "ث", "ر", "خ", "ج", "س" ],
                weekHeader: "أسبوع",
                dateFormat: "dd/mm/yy",
                firstDay: 0,
                isRTL: true,
                showMonthAfterYear: false,
                yearSuffix: "" };
            datepicker.setDefaults( datepicker.regional.ar );

            return datepicker.regional['ar'];

        }));
        smeDatepicker.datepicker({
            isRTL: true,
            // changeMonth: true,
            // changeYear: true
        });
        //smeDatepicker.setDefaults(jQuery.datepicker.regional['ar']);
        jQuery.datepicker.regional['ar'];
    } else {
        smeDatepicker.datepicker();
    }

    jQuery('#BranchTab').hide();
    jQuery('#lbl-sme-city-issue').show();
    jQuery('#CityOfIssue').hide();
    jQuery(".pws-sme-form-step-01").show();
    jQuery(".pws-sme-form-step-02").hide();
    jQuery(".pws-sme-form-step-03").hide();
});

jQuery("#BranchCity").change(function () {
    var city = this.value;
    if (city != null) {
        jQuery.ajax({
            type: 'POST',
            contentType: 'application/json; charset=utf-8',
            url: '/api/Forms/GetBranches',
            data: "{ 'City':'" + city + "'}",
            success: function (data) {
                if (data.length > 0) {
                    GenerateBranches(data)
                }
            },
            error: function (data) {
            }
        });
    }
});

function SMESubmitForm() {
    var myModel =
        {
            "EntityName": jQuery('#sme-entity-name').val(),
            "TypeofBusiness": jQuery('#TypeofBusiness option:selected').val(),
            "NumberEmployees": jQuery('#NumberEmployees option:selected').val(),
            "LastYearTurnover": jQuery('#LastYearTurnover option:selected').val(),
            "CountryOfIssue": jQuery('#CountryOfIssue option:selected').val(),
            "CityOfIssue": jQuery('#CityOfIssue option:selected').val() == "" ? jQuery('#sme-city-of-issue').val() : null,
            //"tbCityOfIssue": jQuery('#sme-city-of-issue').val(),
            "LicenseNumber": jQuery('#sme-license-number').val(),
            "IssueDate": jQuery("#IssueDate").datepicker("getDate"),
            "ExpiryDate": jQuery("#ExpiryDate").datepicker("getDate"),
            "Mobile": jQuery('#sme-mobile').val(),
            "Email": jQuery('#sme-email').val(),
            "TimetoCall": jQuery('#TimetoCall').val(),
            "BranchCity": jQuery('#BranchCity option:selected').val(),
            "BranchName": jQuery('#BranchName option:selected').val(),
            "BranchCode": jQuery('#sme-location-id').val()
        };

    var jsonToPost = JSON.stringify(myModel);

    jQuery.ajax({
        url: '/api/Forms/SMEForm',
        async: true,
        processData: false,
        data: jsonToPost,
        type: 'POST',
        contentType: 'application/json; charset=utf-8',
        success: function (data) {
            if (data == "success") {
                jQuery(".pws-sme-form-step-03").show()
            }
            else {
                var err = data;
                for (i = 0; i < data.length; i++) {
                    jQuery(err[i].ErrorMessage).addClass("Error")
                }
                jQuery(".pws-sme-form-step-01").show()
                jQuery(".pws-sme-form-step-02").hide()
            }
        },
        error: function (data) {

        }
    });
}

jQuery("#sme-next").click(function () {
    if (SMEValidate()) {
        jQuery(".pws-sme-form-step-01").hide();
        jQuery(".pws-sme-form-step-02").show();
    }
});

jQuery("#sme-previous").click(function () {
    jQuery(".pws-sme-form-step-02").hide();
    jQuery(".pws-sme-form-step-01").show();
});

jQuery("#sme-submit").click(function () {
    if (SMEValidateStep2()) {
        jQuery(".pws-sme-form-step-01").hide();
        jQuery(".pws-sme-form-step-02").hide();
        //jQuery(".pws-sme-form-step-03").show();
        SMESubmitForm();
    }
});

jQuery("#CountryOfIssue").change(function () {
    jQuery('#lbl-sme-city-issue').show();
    var country = this.value;
    if (country == "Saudi Arabia") {
        jQuery('#CityOfIssue').show();
        jQuery('#sme-city-of-issue').hide();
    }
    else {
        jQuery('#CityOfIssue').hide();
        jQuery('#sme-city-of-issue').show();
    }
});

jQuery("#BranchName").change(function () {
    var locationID = this.value;
    jQuery("#sme-location-id").val(locationID);
});

function SMEValidate() {
    var isValid = true;

    var lblEntitySME = jQuery("#lbl-sme-entity-name");
    var lblBussTypeSME = jQuery("#lbl-sme-type-of-business");
    var lblEmpNumSME = jQuery("#lbl-sme-no-of-employees");
    var lblTurnovrSME = jQuery("#lbl-sme-last-year-turnover");
    var lblCountrySME = jQuery("#lbl-sme-country-issue");
    var lblCitySME = jQuery("#lbl-sme-city-issue");
    var lblLicenseSME = jQuery("#lbl-sme-license");
    var lblIssueDtSME = jQuery("#lbl-sme-issue-date");
    var lblExpDtSME = jQuery("#lbl-sme-expiry-date");
    var lblMobileSME = jQuery("#lbl-sme-mobile");
    var lblEmailSME = jQuery("#lbl-sme-email");
    var lblCallTimeSME = jQuery("#lbl-sme-time-call");
    var lblBranCitySME = jQuery("#lbl-sme-branch-city");
    var lblBranchSME = jQuery("#lbl-sme-branch");

    var entityNameSME = jQuery("#sme-entity-name").val();
    var businessTypeSME = jQuery("#TypeofBusiness");
    var numberOfEmpSME = jQuery("#NumberEmployees");
    var turnoverSME = jQuery("#LastYearTurnover");
    var countryOfIssueSME = jQuery("#CountryOfIssue");
    var cityofIssueSME = jQuery("#CityOfIssue");
    var cityOfIssueTxtSME = jQuery("#sme-city-of-issue").val();
    var licenseNumberSME = jQuery("#sme-license-number");
    var issueDateSME = jQuery("#IssueDate").val();
    var expiryDateSME = jQuery("#ExpiryDate").val();
    var smeMobileSME = jQuery("#sme-mobile");
    var smeEmailSME = jQuery("#sme-email");
    var callTimeSME = jQuery("#TimetoCall");
    var branchCitySME = jQuery("#BranchCity");
    var branchNameSME = jQuery("#BranchName");

    isValid = ValidateTextSME(entityNameSME, lblEntitySME) && isValid;
    isValid = ValidateDropDownSME(lblBussTypeSME, businessTypeSME) && isValid;
    isValid = ValidateDropDownSME(lblEmpNumSME, numberOfEmpSME) && isValid;
    isValid = ValidateDropDownSME(lblTurnovrSME, turnoverSME) && isValid;
    isValid = ValidateDropDownSME(lblCountrySME, countryOfIssueSME) && isValid;

    if (countryOfIssueSME.val() == 'Saudi Arabia') {
        isValid = ValidateDropDownSME(lblCitySME, cityofIssueSME) && isValid;
    }
    else {
        isValid = ValidateTextSME(cityOfIssueTxtSME, lblCitySME) && isValid;
    }

    isValid = ValidateLicenseNumberSME(licenseNumberSME, lblLicenseSME) && isValid;
    isValid = ValidateTextSME(issueDateSME, lblIssueDtSME) && isValid;
    isValid = ValidateTextSME(expiryDateSME, lblExpDtSME) && isValid;
    isValid = ValidatePhoneNumberSME(lblMobileSME, smeMobileSME) && isValid;
    isValid = ValidateEmailSME(lblEmailSME, smeEmailSME) && isValid;

    isValid = ValidateDropDownSME(lblCallTimeSME, callTimeSME) && isValid;
    isValid = ValidateDropDownSME(lblBranCitySME, branchCitySME) && isValid;
    isValid = ValidateDropDownSME(lblBranchSME, branchNameSME) && isValid;

    return isValid;
}

function SMEValidateStep2() {
    var isValid = true;

    var lblDocsSME = jQuery("#lbl-sme-doc");
    var lblAgreeSME = jQuery("#lbl-sme-agree");
    var checkDocsSME = jQuery("#sme-chk-docs");
    var checkAgreeSME = jQuery("#sme-chk-agree");

    isValid = ValidateCheckboxSME(lblDocsSME, checkDocsSME) && isValid;
    isValid = ValidateCheckboxSME(lblAgreeSME, checkAgreeSME) && isValid;

    return isValid;
}

function ValidateTextSME(fname, control) {
    if (fname) {
        jQuery(control).removeClass("Error");
        return true;
    }
    else {
        jQuery(control).addClass("Error");
        return false;
    }
}

function ValidateEmailSME(lbl, txt) {
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

function ValidateDropDownSME(lbl, dp) {
    if (dp.get(0).selectedIndex != 0) {
        lbl.removeClass("Error");
        return true
    }
    else {
        lbl.addClass("Error");
        return false;
    }
}

function ValidatePhoneNumberSME(lbl, txt) {
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

function ValidateCheckboxSME(lbl, ch) {
    if (ch.is(':checked')) {
        lbl.removeClass("Error");
        return true;
    }
    else {
        lbl.addClass("Error");
        return false;
    }
}

function ValidateLicenseNumberSME(txt, lbl) {
    var re = /^[0-9]{15}$/;
    if (!txt.val().match(re)) {
        lbl.addClass("Error");
        return false;
    }
    else {
        lbl.removeClass("Error");
        return true;
    }
}

function GenerateBranches(data) {
    jQuery("#BranchName").html("");
    jQuery("#sme-location-id").html("");
    jQuery('#BranchTab').hide();
    var x = document.getElementById("BranchName");
    var opt = document.createElement('option');
    opt.value = 0;
    opt.text = SMEFormresources.dropdownSelect;
    x.add(opt);

    for (i = 0; i < data.length; i++) {
        var option = document.createElement("option");
        option.value = data[i].LocationID;
        option.text = data[i].Title;
        x.add(option);
    }
    jQuery('#BranchTab').show();
}