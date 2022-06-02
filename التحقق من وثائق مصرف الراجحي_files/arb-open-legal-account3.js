
    function txtEntityTypeChange()
    {
        clearFileUpload();
        hideAll();
        var value = jQuery('#txtEntityType').val();
        if(value!="")
        {
            var code= jQuery('#EntityType [value="' + value + '"]').data('value');
            if(code!=undefined &&code!="")
            {
                jQuery('#uploaddocument').removeClass("uploaddocument-container");
                jQuery('#' + code).removeClass("uploadarea");
                jQuery('#btnsubmituserdata').removeClass("disablesubmit");
            }
            else{
                console.log("error, can not find entity type code");
                jQuery('#btnsubmituserdata').addClass("disablesubmit");
                jQuery('#uploaddocument').addClass("uploaddocument-container");
            }
        }
        else{
            jQuery('#btnsubmituserdata').addClass("disablesubmit");
            jQuery('#uploaddocument').addClass("uploaddocument-container");
        }
    }
    function txtEntityRegionChange()
    {
        var value = jQuery('#txtEntityRegion').val();
        if (value != "") {
            var code= jQuery('#EntityRegion [value="' + value + '"]').data('value');
            jQuery('#txtEntityCity').removeClass("disableselect");
            var filteredcities = [];

            jQuery.each(cities, function(key, value) {

                if(value.RegionId.toString() ===code)
                {
                    filteredcities.push(value)
                }
            });
            if(filteredcities.length>0)
            {
                jQuery('#txtEntityCity').val('');
                jQuery('#EntityCity').find('option').remove().end();
                jQuery.each(filteredcities, function(key, value) {
                    jQuery('#EntityCity')
                        .append(jQuery("<option></option>")
                                   .attr("value",value.Title)
                                   .attr("data-value",value.Id));
                });
            }
        }
        else {
            disableCity();
        }
        disableBrnach();
    }
    function txtEntityCityChange()
    {
        var value = jQuery('#txtEntityCity').val();
        if (value != "") {
            var code= jQuery('#EntityCity [value="' + value + '"]').data('value');
            jQuery('#txtEntityBranch').removeClass("disableselect");
            var filteredBranchs=[];

            jQuery.each(branchs, function(key, value) {

                if(value.CityId.toString() ===code)
                {
                    filteredBranchs.push(value)
                }
            });
            if(filteredBranchs.length>0)
            {
                jQuery('#txtEntityBranch').val('');
                jQuery('#EntityBranch').find('option').remove().end();
                jQuery.each(filteredBranchs, function(key, value) {
                    jQuery('#EntityBranch')
                        .append(jQuery("<option></option>")
                                   .attr("data-value", value.Id)
                                   .attr("value",value.Title + " - " +value.Code));
                });
            }
        }
        else {
            disableBrnach();
        }
    }
    function clearFileUpload()
    {
        jQuery("input[type=file]").val(null);
    }
    function hideAll()
    {
        jQuery('#ResidentCompanies').addClass("uploadarea");
        jQuery('#ForeignCompaniesOrBranch').addClass("uploadarea");
        jQuery('#MixedCompanies').addClass("uploadarea");
        jQuery('#IndividualForeignInvestor').addClass("uploadarea");
        jQuery('#IndividualEstablishment').addClass("uploadarea");
    }

    function OpenLegalAccountSubmitUserdata()
    {
        if(openLegalAccountPageValid())
        {
            jQuery(".div-datasubmit .requiredvalues").hide();
            jQuery("#btnsubmituserdata").addClass("disablesubmit");
            jQuery("#loadingimg").removeClass("hidesection");

            if (window.FormData !== undefined) {

                // Create FormData object
                var fileData = new FormData();
                var selectedType = [];
                var value = jQuery('#txtEntityType').val();
                var code= jQuery('#EntityType [value="' + value + '"]').data('value');
                jQuery.each(entityType, function(key, value) {

                    if(value.Code.toString() ===code)
                    {
                        selectedType.push(value)
                    }
                });
                if(selectedType.length>0)
                {
                    for (var f =0;f<selectedType[0].Attachments.length;f++)
                    {
                        var fileUpload = jQuery('#'+selectedType[0].Code+' '+'#'+selectedType[0].Attachments[f]).get(0);
                        var files = fileUpload.files;
                        if(files.length>0)
                        {
                            fileData.append(fileUpload.id, files[0]);
                        }
                    }
                }
                // Adding one more key to FormData object
                fileData.append("EntityName", jQuery("#txtEntityName").val());
                fileData.append("EntityRepresentative", jQuery("#txtEntityRepresentative").val());
                fileData.append("PositionTitle",jQuery("#txtPositionTitle").val());
                fileData.append("Email",jQuery("#txtEntityEmail").val());
                fileData.append("TelephoneNumber",jQuery("#txtTelephone").val());
                fileData.append("MobileNumber",jQuery("#txtMobile").val());
                fileData.append("UnnNumber",jQuery("#txtUnn").val());
				fileData.append("OpenLegalAccountFormType",openLegalAccountFormType);
                //add entity type
                var entityText = jQuery('#txtEntityType').val();
                if(entityText!=undefined)
                {
                    var entitycode= jQuery('#EntityType [value="' + entityText + '"]').data('value');
                    fileData.append("EntityTypeId",entitycode);
                }
                //add Region
                var RegionText = jQuery('#txtEntityRegion').val();
                if(RegionText!="")
                {
                    var regioncode= jQuery('#EntityRegion [value="' + RegionText + '"]').data('value');
                    fileData.append("RegionId",regioncode);
                }
                var cityText = jQuery('#txtEntityCity').val();
                if(cityText!="")
                {
                    var citycode= jQuery('#EntityCity [value="' + cityText + '"]').data('value');
                    fileData.append("CityId",citycode);
                }
                var BranchText = jQuery('#txtEntityBranch').val();
                if(BranchText!="")
                {
                    var branchCode= jQuery('#EntityBranch [value="' + BranchText + '"]').data('value');
                    fileData.append("BranchId",branchCode);
                }
                var AnnualRevenueText = jQuery('#txtAnnualRevenues').val();
                if(AnnualRevenueText!="")
                {
                    var AnnualRevenueCode= jQuery('#AnnualRevenues [value="' + AnnualRevenueText + '"]').data('value');
                    fileData.append("AnnualRevenueId",AnnualRevenueCode);
                }
                var NoOffEmployeesText = jQuery('#txtNoOffEmployees').val();
                if(NoOffEmployeesText!="")
                {
                    var NoOffEmployeesCode= jQuery('#NoOffEmployees [value="' + NoOffEmployeesText + '"]').data('value');
                    fileData.append("NoOffEmployeesId",NoOffEmployeesCode);
                }
                //submit data
                jQuery.ajax({
                    url: customSubmitDataOpenLegalAccount,
                    type: "POST",
                    contentType: false, // Not to set any content header
                    processData: false, // Not to process data
                    data:fileData ,
					timeout:500000,
                    success: function (data) {
                        jQuery("#loadingimg").addClass("hidesection");
                        if (data.submitStatus==true) {

                            window.location.href =window.location.href.replace("#first","") + data.thankyouPage
                        }
                        else
                        {
                            jQuery("#openlegalerrormsg").removeClass("hideError");
                        }
                    },
                    error: function (error) {
                        jQuery("#loadingimg").addClass("hidesection");
                        jQuery("#openlegalerrormsg").removeClass("hideError");
                        console.log(error);
                    }
                });
            }
            clearFileUpload();
            ClearPageInput();
            hideAll();
            jQuery('#uploaddocument').addClass("uploaddocument-container");
        }
        else {
            jQuery(".div-datasubmit .requiredvalues").show();

        }
    }
	
	function UnnValidEntry()
	{
		var enteredValue = jQuery("#txtUnn").val();
		return enteredValue.charAt(0) == "7";
	}
	
    function openLegalAccountPageValid()
    {
        if(jQuery("#txtEntityName").val()!=""
         &&jQuery("#txtEntityRepresentative").val()!=""
         &&jQuery("#txtPositionTitle").val()!=""
         &&jQuery("#txtEntityEmail").val()!=""
         &&jQuery("#txtTelephone").val()!=""
         &&jQuery("#txtMobile").val()!=""
         &&jQuery("#txtEntityType").val()!=""
         &&jQuery("#txtEntityRegion").val()!=""
         &&jQuery("#txtEntityCity").val()!=""
         &&jQuery("#txtEntityBranch").val()!=""
         &&jQuery("#txtAnnualRevenues").val()!=""
         &&jQuery("#txtNoOffEmployees").val()!=""
		 &&jQuery("#txtUnn").val()!=""
		 && UnnValidEntry() == true
        )
        {

            if(isPhone(jQuery("#txtMobile").val()) && isPhone(jQuery("#txtTelephone").val()) && isEmail(jQuery("#txtEntityEmail").val()) )
                return true;
            else
                return false;
        }
        else{
            return false;
        }
    }

    function isValidCustomCaptchopenlegalaccount()
    {
        var captchString = $('#txtCaptchString').val().trim();
        if (captchString != '' && captchString != undefined) {
            var result = false;
            jQuery.ajax({
                url: customCaptchURL,
                data: { captchstring: captchString },
                type: "POST",
                success: function (data) {
                    result = data;
                    if (result) {
                        OpenLegalAccountSubmitUserdata();
                        $("#InvalidHipText").hide();
                    }
                    else
                    {
                        $("#InvalidHipText").show();
                        return false;
                    }
                },
                error: function (error) {
                    jQuery("#loadingimg").addClass("hidesection");
                    jQuery("#openlegalerrormsg").removeClass("hideError");
                    console.log(error);
                }
            });
        }
        else {
            $("#InvalidHipText").show();
            return false;
        }
    }
    function isPhone(phone)
    {
        var phone_pattern = /([0-9]{10})|(\([0-9]{3}\)\s+[0-9]{3}\-[0-9]{4})/;
        return phone_pattern.test(phone)
    }
    function isEmail(email)
    {
        var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,6})+$/;
        return regex.test(email);
    }
    function isUnn(unn)
    {
        if(unn.length>0)
        {
            var unn_pattern = /7\d{9}/;
            return unn_pattern.test(unn)
        }
        else
        {
            return true;
        }
    }

    function openlegalaccountvalidEmail(email){
        if(isEmail(email))
        {
            //hide
            jQuery("#rgEntityEmail").addClass("hidesection");
        }
        else{
            //show
            jQuery("#rgEntityEmail").removeClass("hidesection");
        }
    }
    function openlegalaccountvalidPhone(phone){
        if(isPhone(phone))
        {
            //hide
            jQuery("#rgEntityPhone").addClass("hidesection");
        }
        else{
            //show
            jQuery("#rgEntityPhone").removeClass("hidesection");
        }
    }
    function validUnn(unn){
        if(isUnn(unn))
        {
            //hide
            jQuery("#rgEntityUnn").addClass("hidesection");
        }
        else{
            //show
            jQuery("#rgEntityUnn").removeClass("hidesection");
        }
    }
    function openlegalaccountvalidMobile(phone){
        if(isPhone(phone))
        {
            //hide
            jQuery("#rgEntityMobile").addClass("hidesection");
        }
        else{
            //show
            jQuery("#rgEntityMobile").removeClass("hidesection");
        }
    }
    function ClearPageInput(){
        jQuery("#txtEntityName").val("");
        jQuery("#txtEntityRepresentative").val("");
        jQuery("#txtPositionTitle").val("");
        jQuery("#txtEntityEmail").val("");
        jQuery("#txtTelephone").val("");
        jQuery("#txtMobile").val("");
        disableCity();
        disableBrnach();
        jQuery("#txtEntityType").val("");
        jQuery("#txtEntityRegion").val("");
        jQuery("#txtEntityCity").val("");
        jQuery("#txtEntityBranch").val("");
        jQuery("#txtAnnualRevenues").val("");
        jQuery("#txtNoOffEmployees").val("");
        jQuery("#txtUnn").val("");

    }
    function disableCity()
    {
        jQuery('#txtEntityCity').addClass("disableselect");
        jQuery('#txtEntityCity').val('');
    }
    function disableBrnach()
    {
        jQuery('#txtEntityBranch').addClass("disableselect");
        jQuery('#txtEntityBranch').val('');
    }
    function CheckFileSize(element)
    {
        var fileSize = (element.files[0].size / (1024 * 1024)).toFixed(2)
        if(fileSize >= 6.01)
        {
            alert(openlegalaccountmaxsize);
            jQuery(element).val('');
            return false;
        }

        
        if (jQuery.inArray($(element).val().split('.').pop().toLowerCase(), fileExtension.split(';')) == -1) {
            alert(OpenlegalaccountFileFormats +"  "+ fileExtension);
            jQuery(element).val('');
            return false;
        }
    }
   
    function refreshCaptchaopenlegalaccount(){

        jQuery('#CaptchString').val('');
        jQuery("#captcha-container").find('img').remove()
        jQuery("<img />", { src: '/api/sitecore/OpenLegalAccount/GetCaptcha?ID=' + new Date().getTime(), id: 'imgcaptcha' }).appendTo("#captcha-container");

    }
	
	$(document).ready(function(){	
		
		var thisUrl = document.URL.split("/");
			var pageName = "";
			if(thisUrl.length > 0)
			{
			pageName = thisUrl[thisUrl.length -1];	
			}			
		if(pageName == "opencurrentaccountcorporate" || pageName == "updatecorporateinformation")
		{
			/*
			
					var isSafari = navigator.vendor && navigator.vendor.indexOf('Apple') > -1 &&
					navigator.userAgent &&
					navigator.userAgent.indexOf('CriOS') == -1 &&
					navigator.userAgent.indexOf('FxiOS') == -1;
					
					if(isSafari)
					{
							window.location.href = window.location.origin + "/corporate/updatecorporateinformation/chrome-only"
					}
			}*/
			
		
			if($("datalist[id='EntityType']")[0].options[0].getAttribute("data-value")=="IndividualEstablishment")
			{
				$("datalist[id='EntityType']")[0].options[0].remove()
			}
			
			$("#txtUnn").on("keyup", function(){
							
				if(UnnValidEntry() == false)
				{
				jQuery("#rgEntityUnn").removeClass("hidesection");
				}
				else
				{
				jQuery("#rgEntityUnn").addClass("hidesection");
				}
			
			});
		 setInterval(refreshCaptchaopenlegalaccount, 200000);
		
		}
	});