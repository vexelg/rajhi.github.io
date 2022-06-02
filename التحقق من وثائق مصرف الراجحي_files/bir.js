
var currentPage = document.URL.split('/')[document.URL.split('/').length - 1] ;

    jQuery(document).ready(function () {

		
        jQuery('#txtCompanyName').keyup(function () {
            this.value = this.value.replace(/<(.|\n)*?>/g, '');
        });

        jQuery('#txtCRNumber').keyup(function () {
            this.value = this.value.replace(/[^0-9\.]/g, '');
        });

        jQuery('#txtMobileNo').keyup(function () {
            this.value = this.value.replace(/[^0-9\.]/g, '');
			
        });
		
		if(currentPage === "business-information-request")
		{
			$("div.pws-content-description").removeClass("pws-content-description");
			$("div.pws-article-content").css("text-align", "center");
			jQuery("<img />", { src: '/customer/request/CaptchaRequest/GetCaptcha?ID=' + new Date().getTime(), id: 'imgcaptcha' }).appendTo("#bir-captcha-container");
		}
		
        

        jQuery("input.form-control").on('input', function () {
            $(this).next("div").addClass("hidesection")
        })

    });

    function refreshCaptchaBIR(){

        jQuery('#CaptchString').val('');
        jQuery("#bir-captcha-container").find('img').remove()
        jQuery("<img />", { src: '/customer/request/CaptchaRequest/GetCaptcha?ID=' + new Date().getTime(), id: 'imgcaptcha' }).appendTo("#bir-captcha-container");

    }

    function clearFileUpload() {
        jQuery("input[type=file]").val(null);
    }

    function SubmitBusinessInfoRequest()
    {
        if(BIRPageValid())
        {
            jQuery(".div-datasubmit .requiredvalues").hide();
            jQuery("#btnsubmituserdata").addClass("disablesubmit");
            jQuery("#loadingimg").removeClass("hidesection");

            if (window.FormData !== undefined) {

                // Create FormData object
                var fileData = new FormData();

                var uploadedFiles = $('input[type=file]')

                for (var i = 0; i < uploadedFiles.length; i++) {
                    var file = $('#' + $('input[type=file]')[i].id).get(0).files;
                    if (file.length != 0) {
                        fileData.append($('input[type=file]')[i].id, file[0])
                    }
                }

                // Adding one more key to FormData object
                fileData.append("CompanyName", jQuery("#txtCompanyName").val().trim());
                fileData.append("CRNumber", jQuery("#txtCRNumber").val().trim());
                fileData.append("CompanyContactName", jQuery("#txtContactName").val());
                fileData.append("MobileNo", jQuery("#txtMobileNo").val().trim());
                fileData.append("Email", jQuery("#txtEmail").val().trim());
                fileData.append("RequestDetails", jQuery("#txtRequestDetails").val().trim());
                fileData.append("hidPage", jQuery("#hidPage").val());

                //submit data
                jQuery.ajax({
                    url: '/customer/request/BusinessInfoRequest/SubmitUserdata',
                    type: "POST",
                    contentType: false, // Not to set any content header
                    processData: false, // Not to process data
                    data:fileData,
					beforeSend : function(){
						$("#btnsubmituserdata").val($("#waitMessage").val());
						$("#btnsubmituserdata").prop('disabled', true);
					},
                    success: function (data) {
                        jQuery("#loadingimg").addClass("hidesection");
                        if (data.submitStatus) {

                            window.location = "/business-information-request/summary";
                        }
                        else 
                        {
                            jQuery("#openlegalerrormsg").removeClass("hideError");
							$("#btnsubmituserdata").val($("#NextMessage").val());
							$("#btnsubmituserdata").prop('disabled', false);
                        }
                    },
                    error: function (error) {                       
                        jQuery("#openlegalerrormsg").removeClass("hideError");
                        console.log(erorr);
                    }
                });
            }
            clearFileUpload();            
            hideAll();
            jQuery('#uploaddocument').addClass("uploaddocument-container");
        }
        else {
            jQuery(".div-datasubmit .requiredvalues").show();

        }
    }
    function isPhoneBIR(phone) {
        var phone_pattern = /([0-9]{9})|(\([0-9]{3}\)\s+[0-9]{3}\-[0-9]{4})/;
        return phone_pattern.test(phone)
    }
    function isEmailBIR(email) {
        //var regex = /^([a-zA-Z0-9_.+-])+\@@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
        var emailRegex = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
        return emailRegex.test(email);
    }

    function BIRCheckFileSize(element)
    {
        var fileSize = (element.files[0].size / (1024 * 1024)).toFixed(2)
        if(fileSize >= 6.01)
        {
            alert("Max size of file reached");
            jQuery(element).val('');
            return false;
        }

        var fileExtension ="pdf;jpg;png";
        if (jQuery.inArray($(element).val().split('.').pop().toLowerCase(), fileExtension.split(';')) == -1) {
            alert("Allowed formats: " +"  "+ fileExtension);
            jQuery(element).val('');
            return false;
        }
    }

    function BIRPageValid() {

        if (jQuery("#txtCompanyName").val() == "") {
            jQuery("#rgCompanyName").removeClass("hidesection");
            jQuery("#txtCompanyName").focus();
            return false;
        }
        else {
            jQuery("#rgCompanyName").addClass("hidesection");
        }
        if (jQuery("#txtCRNumber").val() == "" || jQuery("#txtCRNumber").val().length < 10) {
            jQuery("#rgCRNumber").removeClass("hidesection")
            jQuery("#txtCRNumber").focus();
            return false;
        } else {
            jQuery("#rgCRNumber").addClass("hidesection");
        }

        if (jQuery("#txtContactName").val() == "") {
            jQuery("#rgContactName").removeClass("hidesection")
            jQuery("#txtContactName").focus();
            return false;
        }
        else {
            jQuery("#rgContactName").addClass("hidesection");
        }

        if (jQuery("#txtMobileNo").val() == "" || jQuery("#txtMobileNo").val().length < 10) {
            jQuery("#rgMobileNo").removeClass("hidesection")
            jQuery("#txtMobileNo").focus();
            return false;
        } else {
            jQuery("#rgMobileNo").addClass("hidesection");
        }

        if (jQuery("#txtEmail").val() == "") {
            jQuery("#rgEmail").removeClass("hidesection")
            jQuery("#txtEmail").focus();
            return false;
        } else {
            jQuery("#rgEmail").addClass("hidesection");
        }

        if ($("#isValidBIR").val() == undefined) {
            if (jQuery("#Business_Information_Document").val() == "") {
                jQuery("#rgUploadFileBIR").removeClass("hidesection")
                jQuery("#Business_Information_Document").focus();
                return false;
            }
            else {
                jQuery("#rgUploadFileBIR").addClass("hidesection");
            }
        }

        if ($("#isValidNID").val() == undefined) {
            if (jQuery("#National_ID").val() == "") {
                jQuery("#rgUploadFileNID").removeClass("hidesection")
                jQuery("#National_ID").focus();
                return false;
            }
            else {
                jQuery("#rgUploadFileNID").addClass("hidesection");
            }
        }

        if ($("#isValidCR").val() == undefined) {
            if (jQuery("#Commercial_Registration").val() == "") {
                jQuery("#rgUploadFileCR").removeClass("hidesection")
                jQuery("#Commercial_Registration").focus();
                return false;
            }
            else {
                jQuery("#rgUploadFileCR").addClass("hidesection");
            }

        }

        

        if (jQuery("#txtCompanyName").val() != ""
            && jQuery("#txtCRNumber").val() != ""
            && jQuery("#txtMobileNo").val() != ""
            && jQuery("#txtEmail").val() != ""
            && jQuery("#txtContactName").val() != "") {

            var isValidPhoneEmail = false;

            if (isPhoneBIR(jQuery("#txtMobileNo").val()))
                isValidPhoneEmail = true;
            else {
                jQuery("#rgMobileNo").removeClass("hidesection")
                jQuery("#txtMobileNo").focus();
                isValidPhoneEmail = false;
            }


            if (isEmailBIR(jQuery("#txtEmail").val()))
                isValidPhoneEmail = true
            else {
                jQuery("#rgEmail").removeClass("hidesection")
                jQuery("#txtEmail").focus();
                isValidPhoneEmail = false;
            }

            if (!isValidPhoneEmail) {
                return false;
            }
            else {
                return true;
            }

        }
        else {
            return true;
        }
    }

    function isCaptchaValid()
    {
        if (BIRPageValid()) {
            var captchString = $('#txtCaptchString').val();
			if (captchString != '' && captchString != undefined) {
                var result = false;
                jQuery.ajax({
                    url: '/customer/request/CaptchaRequest/IsRealPerson',
                    data: { captchstring: captchString },
					beforeSend : function(){
						$("#btnsubmituserdata").val($("#waitMessage").val());
						$("#btnsubmituserdata").prop('disabled', true)

					},
                    async: false,
                    type: "POST",
                    success: function (data) {
                        result = data;
                        if (result) {
                            $("#InvalidHipText").hide();
                            SubmitBusinessInfoRequest();
                        }
                        else {
                            $("#InvalidHipText").show();
							$("#btnsubmituserdata").val($("#NextMessage").val());
							$("#btnsubmituserdata").prop('disabled', false)
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
        
        
    }



    function BackToForm() {
        window.location.href = "/business-information-request";        
    }

    function SubmitUploadedData() {
		
        jQuery.ajax({
                    url: '/customer/request/BusinessInfoRequest/SubmitUserdata',
                    type: "POST",
                    contentType: false, // Not to set any content header
                    processData: false, // Not to process data
                    data: { processRequest: "1" },
		    beforeSend : function(){
			$("#btnsubmituserdata").val($("#waitMessage").val());
			$("#btnsubmituserdata").prop('disabled', true);
		    },
                    success: function (data) {
                        jQuery("#loadingimg").addClass("hidesection");
                        if (data.submitStatus) {
                            window.location.href ="/business-information-request/submit";
                        }
                        else
                        {
                            jQuery("#openlegalerrormsg").removeClass("hideError");
                        }
                    },
                    error: function (error) {
                        jQuery("#loadingimg").addClass("hidesection");
                        jQuery("#openlegalerrormsg").removeClass("hideError");
                        console.log(erorr);
                    }
                });
    }
