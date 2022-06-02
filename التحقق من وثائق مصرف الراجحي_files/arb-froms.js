var isPageEditor = function () {
    return !!(typeof (Sitecore) != 'undefined' && Sitecore && Sitecore.PageModes && Sitecore.PageModes.PageEditor);
};

var getUrlVars = function () {
    var vars = [];
    var hash;
    var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
    //var paramters="{";
    for (var i = 0; i < hashes.length; i++) {
        hash = hashes[i].split('=');
        var param = {};
        //vars.push(hash[0]);
        //vars[hash[0]] = hash[1];
        //paramters+='"'+hash[0]+'":"'+hash[1]+'",';
        param['key'] = hash[0];
        param['value'] = hash[1];
        vars.push(param);
    }
    // paramters+="}"; 
    return vars;
};
var branchsCity;
jQuery(document).ready(function () {
    if (!isPageEditor()) {
        //alert("window load occurred!");
        var vars = getUrlVars();
        jQuery.each(vars, function (idx, obj) {
            switch (obj.key) {
                case "utm_source":
                    jQuery('.ksa-form-hidden-section div div div:eq(0) input[type=text]').val(obj.value);
                    break;
                case "utm_medium":
                    jQuery('.ksa-form-hidden-section div div div:eq(1) input[type=text]').val(obj.value);
                    break;
                case "utm_campaign":
                    jQuery('.ksa-form-hidden-section div div div:eq(2) input[type=text]').val(obj.value);
                    break;
				case "utm_topic":
                    jQuery('.ksa-form-hidden-section div div div:eq(5) input[type=text]').val(obj.value);
                    break;
            }
        });
        if (jQuery('html')[0].lang != "ar") {
            jQuery(".ksa-form-section select").find('option:eq(0)').text("Please select");
        }
        else {
            jQuery(".ksa-form-section select").find('option:eq(0)').text("برجاء الاختيار");			
        }

        jQuery(".ksa-form-section select").find('option:eq(0)').prop('disabled', 'disabled');

    }
    if (jQuery('.TypeofCustomerShowHide select').length > 0) {
        jQuery('.TypeofCustomerShowHide select').on('change', function () {
            if (this.value == "Commercial") {
                jQuery('.TypeofCustomerCommercial').removeClass("hidden");
                jQuery('.TypeofCustomerIndividual').addClass("hidden");
                jQuery(".TypeofCustomerIndividual select")[0].selectedIndex = 0;
            }
            else if (this.value == "Individual") {
                jQuery('.TypeofCustomerIndividual').removeClass("hidden");
                jQuery('.TypeofCustomerCommercial').addClass("hidden");
                jQuery(".TypeofCustomerCommercial select")[0].selectedIndex = 0;
            }
            else {
                jQuery('.TypeofCustomerCommercial').addClass("hidden");
                jQuery('.TypeofCustomerIndividual').addClass("hidden");
                jQuery(".TypeofCustomerIndividual select")[0].selectedIndex = 0;
                jQuery(".TypeofCustomerCommercial select")[0].selectedIndex = 0;
            }
        });
    }
    if (jQuery('.TypeofIndustryOptionsShowHide select').length > 0) {
        jQuery('.TypeofIndustryOptionsShowHide select').on('change', function () {
            if (this.value == "Government" || this.value == "Private") {
                jQuery('.TypeofProductNonMilitary').removeClass("hidden");
                jQuery('.TypeofProductMilitary').addClass("hidden");
                jQuery(".TypeofProductMilitary select")[0].selectedIndex = 0;
            }
            else if (this.value == "Military") {
                jQuery('.TypeofProductMilitary').removeClass("hidden");
                jQuery('.TypeofProductNonMilitary').addClass("hidden");
                jQuery(".TypeofProductNonMilitary select")[0].selectedIndex = 0;
            }
            else {
                jQuery('.TypeofProductMilitary').addClass("hidden");
                jQuery('.TypeofProductNonMilitary').addClass("hidden");
                jQuery(".TypeofProductMilitary select")[0].selectedIndex = 0;
                jQuery(".TypeofProductNonMilitary select")[0].selectedIndex = 0;
            }
        });
    }
    if (jQuery('.EntityTypeOptions select').length > 0) {
        jQuery('.EntityTypeOptions select').on('change', function () {
            if (this.value == "Company") {
                jQuery('.CompanyTypeOptions').removeClass("hidden");
            }
            else {
                jQuery('.CompanyTypeOptions').addClass("hidden");
                jQuery(".CompanyTypeOptions select")[0].selectedIndex = 0;
            }
        }
        );
    }
    if (jQuery('.CityListOptions select').length > 0 && jQuery('.BranchListOptions select').length > 0) {
       
        var xhr = new XMLHttpRequest();
        xhr.open("GET", "/api/sitecore/CityBranchs/ListofBranchs");
        xhr.onreadystatechange = function () {
            if (this.readyState == 4) {
                //alert('Status: ' + this.status + '\nHeaders: ' + JSON.stringify(this.getAllResponseHeaders()) + '\nBody: ' + this.responseText);
                branchsCity = jQuery.parseJSON(this.responseText).Data;
            }
        };
        xhr.send(null);
        jQuery('.CityListOptions select').on('change', function () {
            var selectCity=jQuery(".CityListOptions select option:selected").text();
            jQuery('.branchCode input[type=text]').prop("readonly", true);
            if (selectCity != "") {
                jQuery('.BranchListOptions select').find('option').remove();
                jQuery('.branchCode input[type=text]').val("");
                if (jQuery('html')[0].lang != "ar") {
                jQuery(".BranchListOptions select").append(new Option("Please select", "Please select"));
                }
                else
                {
                    jQuery(".BranchListOptions select").append(new Option("برجاء الاختيار", "برجاء الاختيار"));
                }
                   sublistbranchs = jQuery.grep(branchsCity, function(v) {
                    if(v.City==selectCity)
                    {
                        jQuery('.BranchListOptions select').append(new Option(v.branchName, v.branchName));
                    }
                });
            jQuery('.BranchListOptions').removeClass("hidden");
            jQuery('.branchCode').removeClass("hidden");
            jQuery('.BranchListOptions select').on('change', function () {
				var branchval=jQuery('.BranchListOptions select').val();			
				branchsCity.forEach(function (item, index) {
					if(item.branchName=== branchval)
					{
						branchCode=item.BranchNumber;
						if(branchCode!="")
						{
							jQuery('.branchCode input[type=text]').val(branchCode);
						}
					}
				});
                //var branchCode=branchsCity.find(x => x.branchName === this.value).BranchNumber;
            });
        }
       
        //console.log(sublistbranchs);
        });
    }
    if (jQuery('.ksa-charity-type-list select').length > 0) {
        jQuery('.ksa-charity-type-list select').on('change', function () {
            if(this.value=="Private Association" || this.value=="الجمعيات الأهلية / لجان النفع العام")
            {
                jQuery(".ksa-form-section-private-association").show();
                jQuery(".ksa-form-section-private-institution").hide();
                jQuery(".ksa-form-section-family-found").hide();
                jQuery(".ksa-form-section-private-waqf").hide();
                jQuery(".ksa-form-section-commandment").hide();
            }
            else if(this.value=="Private Institution" || this.value=="المؤسسات الأهلية")
            {
                jQuery(".ksa-form-section-private-association").hide();
                jQuery(".ksa-form-section-private-institution").show();
                jQuery(".ksa-form-section-family-found").hide();
                jQuery(".ksa-form-section-private-waqf").hide();
                jQuery(".ksa-form-section-commandment").hide();
            }
            else if(this.value=="Family Found" || this.value=="الصناديق العائلية")
            {
                jQuery(".ksa-form-section-private-association").hide();
                jQuery(".ksa-form-section-private-institution").hide();
                jQuery(".ksa-form-section-family-found").show();
                jQuery(".ksa-form-section-private-waqf").hide();
                jQuery(".ksa-form-section-commandment").hide();
            }
            else if(this.value=="Private Waqf" || this.value=="الوقف الاهلي")
            {
                jQuery(".ksa-form-section-private-association").hide();
                jQuery(".ksa-form-section-private-institution").hide();
                jQuery(".ksa-form-section-family-found").hide();
                jQuery(".ksa-form-section-private-waqf").show();
                jQuery(".ksa-form-section-commandment").hide();
            }
            else if(this.value=="Commandment" || this.value=="الوصية")
            {
                jQuery(".ksa-form-section-private-association").hide();
                jQuery(".ksa-form-section-private-institution").hide();
                jQuery(".ksa-form-section-family-found").hide();
                jQuery(".ksa-form-section-private-waqf").hide();
                jQuery(".ksa-form-section-commandment").show();
            }
            else
            {
                jQuery(".ksa-form-section-private-association").hide();
                jQuery(".ksa-form-section-private-institution").hide();
                jQuery(".ksa-form-section-family-found").hide();
                jQuery(".ksa-form-section-private-waqf").hide();
                jQuery(".ksa-form-section-commandment").hide();
            }
        
        });
    }  
    jQuery('.scfCaptcha label').hide();
    jQuery(".scfNumberBorder label").show();
    jQuery(".scfSingleLineTextBorder label").show();
});
jQuery(window).load(function()
{
	var lang=jQuery('html')[0].lang;
	 if (lang === "ar") {
		 jQuery(".scfNumberBorder .text-box").attr("data-val-regex","الحقل يحتوي علي أرقام غير صالحه")
		 jQuery(".scfNumberBorder span span").text("الحقل يحتوي علي أرقام غير صالحه");
	 }
});
