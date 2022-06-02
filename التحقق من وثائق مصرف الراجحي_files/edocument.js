 
 var currentPage = document.URL.split('/')[document.URL.split('/').length - 1] ;
 
 jQuery(document).ready(function () {

        jQuery('#txtNationalId').keyup(function () {
            this.value = this.value.replace(/[^0-9\.]/g, '');
            jQuery("#rgNationalId").addClass("hidesection");
        });

        jQuery('#txtDocumentRefNo').keyup(function () {
            this.value = this.value.replace(/[^0-9\.]/g, '');
            jQuery("#rgDocumentRefNo").addClass("hidesection");
        });
     		
		if(currentPage == 'edocument-request')
		{
			$("div.pws-content-description").removeClass("pws-content-description");
			$("div.pws-article-content").css("text-align", "center");
			jQuery("<img />", { src: '/customer/request/CaptchaRequest/GetCaptcha?ID=' + new Date().getTime(), id: 'imgcaptcha' }).appendTo("#captcha-container");
			$('#txtCaptchString').focus(function(){ 
                jQuery("#InvalidHipText").hide();
				history.replaceState(null, null, ' ') 
				
			})
		}

    });

    function requestDocument(evt) {

        if (EDocumentPageValid()) {
            var captchString = $('#txtCaptchString').val();

            if (captchString == "") {
                $("#InvalidHipText").show();
                return false;
            }
            var formData = new FormData();
            formData.append("NationalId", jQuery("#txtNationalId").val());
            formData.append("DocumentRefNo", jQuery("#txtDocumentRefNo").val());
            
            $("#btnsubmituserdata").prop("disabled", true);

                 jQuery.ajax({
                    url: '/customer/request/EDocumentRequest/RequestDocument',
                    type: "POST",
                    contentType: false,
                    processData: false,
                    data: formData,
                    beforeSend: function () {
                        $("#rgPleaseWait").removeClass("hidesection");                        
                    },
                    success: function (data) {
                        if(data.fileName == undefined){
				$("#InvalidHipText").show();
			}
                        else if (data.fileName == false) {
                            $("#rgStatusMessage").removeClass("hidesection");
							$("#rgPleaseWait").addClass("hidesection");
                            $("#lblStatusMessage").html(data.Message);                           
                        }
                        else {
							
								$("#rgPleaseWait").addClass("hidesection"); 
								jQuery("#fileDownloadLink").append("<a href='/customer/request/EDocumentRequest/GetFile'>"+ jQuery("#downloadText").val() + "</a>");
                        }
                    },
					complete: function(){
							refreshControls();
							refreshCaptcha();
					},
					error : function(){
						setTimeout(function(){
							location.reload();							
						},3000)
					}
                });

           
        }


    }

function refreshControls() {
    jQuery("#txtNationalId").val('');
    jQuery("#txtDocumentRefNo").val('');
    jQuery('#txtCaptchString').val('');  
}

    function EDocumentPageValid() {

	if (jQuery("#txtNationalId").val() == "" || jQuery("#txtNationalId").val().length < 10) {
            jQuery("#rgNationalId").removeClass("hidesection");
            jQuery("#txtNationalId").focus();
            return false;
        }
        else {
            jQuery("#rgNationalId").addClass("hidesection");
        }

        if (jQuery("#txtDocumentRefNo").val() == "") {
            jQuery("#rgDocumentRefNo").removeClass("hidesection");
            jQuery("#txtDocumentRefNo").focus();
            return false;
        }
        else {
            jQuery("#rgDocumentRefNo").addClass("hidesection");
        }
		
        if (jQuery("#txtCaptchString").val() == "") {
            jQuery("#InvalidHipText").show()
            jQuery("#txtCaptchString").focus();
            return false;
        }
        else {
            jQuery("#rgNationalId").addClass("hidesection");
        }

        if (jQuery("#txtNationalID").val() != ""
            && jQuery("#txtDocumentRefNo").val() != "") {
            return true;
        }
        else {
            return false;
        }
}

function isValidCustomCaptcha() {
    var captchString = $('#txtCaptchString').val();
    if (captchString != '' && captchString != undefined) {
        var result = false;
        jQuery.ajax({
            url: '/customer/request/CaptchaRequest/IsRealPerson',
            data: { captchstring: captchString },
            async: false,
            type: "POST",
            success: function (data) {               
				if (data == true) {
					requestDocument();
                }                
                else {
                    $("#InvalidHipText").show();
                    return false;
                }
            },
            error: function (error) {
                jQuery("#loadingimg").addClass("hidesection");
                jQuery("#openlegalerrormsg").removeClass("hideError");
                console.log(erorr);
            }
        });
    }
    else {
        $("#InvalidHipText").show();
        return false;
    }
}

     function refreshCaptcha(){

        jQuery('#CaptchString').val('');
        jQuery("#captcha-container").find('img').remove()
         jQuery("<img />", { src: '/customer/request/CaptchaRequest/GetCaptcha?ID=' + new Date().getTime(), id: 'imgcaptcha' }).appendTo("#captcha-container");

    }

  