
jQuery(document).ready(function () {
      jQuery('.personal-account a').addClass('personal-account-hover');
	  jQuery('.corporate-account a').addClass('corporate-account-hover');
	  jQuery('.sms-account a').addClass('sms-account-hover');
  
  
      var theLanguage = jQuery('html').attr('lang');
if(theLanguage == 'ar')
{

  
  var arCapital =  jQuery('.item3 .set-targetss a').attr('title');
  var arTahweel = jQuery('.item4 .set-targetss a').attr('title');
  
  if(arCapital == 'الراجحي الماليه')
  {
  jQuery('.item3 .set-targetss a').attr('target','_blank');
  }
  
  if(arTahweel == 'تحويل الراجحي')
  {
  jQuery('.item4 .set-targetss a').attr('target','_blank');
  }
}  

else{

   var arCapital =  jQuery('.item3 .set-targetss a').attr('title');
  var arTahweel = jQuery('.item4 .set-targetss a').attr('title');
  
  if(arCapital == 'Al Rajhi Capital')
  {
  jQuery('.item3 .set-targetss a').attr('target','_blank');
  }
  
  if(arTahweel == 'Al Rajhi Tahweel')
  {
  jQuery('.item4 .set-targetss a').attr('target','_blank');
  }
  
  
}

})