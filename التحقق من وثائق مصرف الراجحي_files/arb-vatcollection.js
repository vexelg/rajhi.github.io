function VATCollectionSelectedOption(element)
{
	if(element!=undefined&&element!=null&&element.id!=null&&element.id.length>0)
	{
		$('#VATCollectionsubmmitbtn').prop("disabled",false);
		VATSubmitResponse(true);
	}
	else
	{
		VATSubmitResponse(false);
	}
}
function VATCollectionSubmitOption(userchoice)
{
	if(userchoice==undefined && $('input[name="selector"]:checked').length==0)
	{
		VatSubmitResponse(false);
		return false;
	}
	else
	{
		if(userchoice==undefined)
		{
			userchoice=$('input[name="selector"]:checked')[0].id;
		}
		jQuery.ajax({
                url: SubmitVatUserChoice,
                data: { userchoice: userchoice },
                async: false,
                type: "POST",
                success: function (data) {
                    if (data.submitStatus==null) {
						window.location="/";                    
                    }
                    else if(data.submitStatus==true)
                    {
						VATSubmitResponse(true);
						window.location.href =window.location.origin+ window.location.pathname + "/thank-you";			 
                    }
					else
					{
						VATSubmitResponse(false);
                        return false;
					}
                },
                error: function (error) {
				   VATSubmitResponse(false);
                    console.log(erorr);
                }
        });
	}
}
function VATSubmitResponse(flage)
{
	if(flage)
	{
		$('#VATCollectionErrorMessage').addClass('vathidden');
	}
	else{
	$('#VATCollectionErrorMessage').removeClass('vathidden');
	}
}
