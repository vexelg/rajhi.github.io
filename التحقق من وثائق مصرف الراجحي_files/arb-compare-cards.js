(function (jQuery) {
var IsActive = false;
var ClickBtnId = "";
var CardBtn = ""
var quotations = [];


 function compare() {
		jQuery(document).on('click',".cc-grid-main .cc-item", function () {
            SelectUnSelectCard(this);
        });

       jQuery(".rmv-btn").click(function () {
		   var itemId = jQuery(this).parents(".compr-card-item").attr("data-id");
            RemoveCardFromCompare(this,itemId);
			
		});
		
		
        var ct = getHashParameterByName("ct"); //getParameterByName("ct");
        if (ct !== null && typeof ct !== "undefined") {
            var titles = ct.split(',');
            jQuery(".cc-grid-main .cc-item").each(function () {
                var title = jQuery(this).find(".pws-card-title").text();
                if (CheckCard(title, titles)) {
                    SelectUnSelectCard(this);
                }
            });
        }
    }

 function RemoveCardFromCompare(elm,itemId) {
		var currentLi= jQuery(elm).parents('li');
		var ClickBtnIdRemove= jQuery(elm).parents('li').find(" > a").attr("id");
		console.log(ClickBtnIdRemove);
		currentLi.removeClass("cardSelected");
		var firstCardSelected = jQuery('#pws-first-card-select').parent('li');
		var secondCardSelected = jQuery('#pws-second-card-select').parent('li');
		var thirdCardSelected = jQuery('#pws-third-card-select').parent('li');
		var value = jQuery(elm).parents('li').find('img').attr("src");
		currentLi.removeClass("active");
		
		jQuery(elm).addClass("hide");
		currentLi.find('div.card-img').html("");
		currentLi.find('div.ref-links.card-title').html("");
		currentLi.find('button').addClass("hide");
		currentLi.find('.compr-card-item').addClass('hide');
		
        var unSelectCard = jQuery('.cc-grid-main .cc-item[data-id="' + itemId + '"]');
		unSelectCard.parents('.owl-item').show();
        if(jQuery(window).width()< 769 )
		{
			unSelectCard.parents('.item').show();
		}
        jQuery('.row.js-details div[data-id="' + itemId + '"]').remove();
        var title = unSelectCard.find('p.field-title').text();
        updateHash(title, true);

		var linksDiv =jQuery(".row.js-links ."+ClickBtnIdRemove);
		linksDiv.find('.btn-apply-now').addClass('hide');
		linksDiv.find('.learn-more').addClass('hide');
		
		 if(!firstCardSelected.hasClass('cardSelected') && !secondCardSelected.hasClass('cardSelected') && !thirdCardSelected.hasClass('cardSelected'))
		 {
			 jQuery("div.card-details").hide();
			 jQuery(".no-card").parent("div.row").show();
			 jQuery("#second-comp-li").addClass('disable');
			 jQuery("#third-comp-li").addClass('disable');
		 }
		 
		 if(jQuery(window).width() < 769 )
		 {
			 if(!firstCardSelected.hasClass('cardSelected') && !secondCardSelected.hasClass('cardSelected'))
			{
                jQuery("div.card-details").hide();
                jQuery(".no-card").parent("div.row").show();
                jQuery("#second-comp-li").addClass('disable');
                jQuery('.mobileSticky').removeClass("cardSelected-mob");
            }

             if(ClickBtnIdRemove == "pws-first-card-select"){
                 jQuery(".pws-enhc-campare-cards .compare-cards").removeClass("frist-comp-styl");
             } else {
                 jQuery(".pws-enhc-campare-cards .compare-cards").addClass("frist-comp-styl");
             }

         }
	
		IsActive = false;
		ClickBtnId = "";
		
       
    }

  function CheckCard(title, titles) {
        var flag = false;
        for (var i = 0; i < titles.length; i++) {
            var txt = titles[i];
            if (txt.toLowerCase() == title.toLowerCase()) {
                flag = true;
                break;
            }
        }
        return flag;
    }
 
		
function SelectUnSelectCard(element){
	
	var currentLi =jQuery("#" + ClickBtnId).parent("li");
	currentLi.find('.compr-card-item').removeClass('hide');
		var selectedCard = jQuery(element);
		var itemId = selectedCard.attr("data-id");
        var cardDisplayBox = currentLi.find('.compr-card-item');
			cardDisplayBox.attr("data-id", itemId);
			currentLi.attr("data-id", itemId);
			
			if (currentLi !== 'undefined' &&  currentLi.hasClass("active")) {
			var imageURL = selectedCard.find("img").attr("src");
			var itemTitle = selectedCard.find("p.field-title").text();
			jQuery('.cc-grid-main .cc-item[data-id="' + itemId + '"]').parents('.owl-item').hide();
			if(jQuery(window).width()< 769 )
			{
				jQuery('.cc-grid-main .cc-item[data-id="' + itemId + '"]').parents('.item').hide();
                jQuery('.mobileSticky').addClass("cardSelected-mob");
                if(ClickBtnId == "pws-first-card-select"){
                    jQuery(".pws-enhc-campare-cards .compare-cards").addClass("frist-comp-styl");
                } else {
                    jQuery(".pws-enhc-campare-cards .compare-cards").removeClass("frist-comp-styl");
                }
			}
			currentLi.find('button').removeClass('hide');
			currentLi.find('div.card-img').append("<img src=" + imageURL + " />")
			currentLi.find('div.ref-links .card-title').empty().append("<p>" + itemTitle + "<p/>");
			jQuery("#" + ClickBtnId).removeClass("active");
			currentLi.removeClass("active");
			currentLi.addClass("cardSelected");
			currentLi.next().removeClass("disable");
			jQuery(".carousel-campareCard").hide();
			jQuery(".card-details").show();
			jQuery(".no-card").parent("div.row").hide();
			AddCompareColumns(currentLi, selectedCard, cardDisplayBox);
			updateHash(itemTitle);
			IsActive = false;


			}
		}
		

   function AddCompareColumns(currentLi, selectedCard, cardDisplayBox) {
       var firstCardSelected = jQuery('#pws-first-card-select').parent('li');
	var secondCardSelected = jQuery('#pws-second-card-select').parent('li');
	var thirdCardSelected = jQuery('#pws-third-card-select').parent('li');
	
	 /*Start : get selected card information*/
	    var itemId = selectedCard.attr("data-id")
        var links = selectedCard.find(".ref-links");
        var applyMessage = links.find("p.pws-apply-msg").html();
        var learnMore = links.find("div.primary-link a");
      //  cardDisplayBox.find(".learn-more").attr("href", learnMore.attr("href")).attr("title", learnMore.attr("title"));
        var applyNow = links.find("div.pws-apply-now a");
        var className = (applyMessage === "" || applyMessage === undefined) ? "btn btn-primary filled secondary-link overlay-source" : "primary-link ";
        cardDisplayBox.find(".applyNowmobile").find('a').attr("href", applyNow.attr("href")).text(applyNow.text()).addClass(className);
		/*End: get selected card information*/
		
        var detailColumns = selectedCard.find(".compare-cards-details-box").children();
		
        detailColumns.each(function () {
            var currentColumn = jQuery(this);
            var fieldName = currentColumn.attr('class').split(/\s+/)[0];
            var row = jQuery(".card-details .row").find("div." + fieldName);
            var td = jQuery("<div  />").attr("data-id", itemId);
            td.html(currentColumn.html());
            row.parent().find("."+ClickBtnId).append(td);
        });

       var linksDiv =jQuery(".row.js-links ."+ClickBtnId);
       linksDiv.find('.btn-apply-now').attr("href", applyNow.attr("href")).text(applyNow.text()).addClass(className);
       linksDiv.find('.learn-more').attr("href", learnMore.attr("href")).text(learnMore.text());
       linksDiv.find('.btn-apply-now').removeClass('hide');
       linksDiv.find('.learn-more').removeClass('hide');
		
/*
		var linksDiv =jQuery(".row.js-links div");
		linksDiv.each(function(){
			var currentDiv = jQuery(this);
			if(currentDiv.attr("data-id") ===undefined || currentDiv.attr("data-id") ==='')
			{
				currentDiv.attr("data-id", selectedCard.attr("data-id"))
				currentDiv.find('.btn-apply-now').attr("href", applyNow.attr("href")).text(applyNow.text()).addClass(className);
				currentDiv.find('.learn-more').attr("href", learnMore.attr("href")).text(learnMore.text());
				currentDiv.find('.btn-apply-now').removeClass('hide');
				currentDiv.find('.learn-more').removeClass('hide');
				return false;
			}
		})
*/

        app.initRippleEffect();
		
		
    }
	
			jQuery(".cardTitleMobile .close-btn").click(function () {
                jQuery("#frist-comp-li").removeClass("active");
                jQuery("#second-comp-li").removeClass("active");
                jQuery("#third-comp-li").removeClass("active");
                IsActive = false;
			});

			jQuery("#pws-first-card-select").click(function () {
                if (IsActive == false) {
                    ClickBtnId = "pws-first-card-select";//jQuery(this).attr("id");
                    jQuery("#frist-comp-li").addClass("active");
                    jQuery('.carousel-campareCard').slideDown().fadeTo("slow", 1);
                    IsActive = true;
                } else if(IsActive == true) {
                    ClickBtnId = "";//jQuery(this).attr("id");
                    jQuery("#frist-comp-li").removeClass("active");
                    jQuery('.carousel-campareCard').slideUp().fadeTo("fast", 1);
                    IsActive = false;
                }
			});

			jQuery("#pws-second-card-select").click(function () {
                if (IsActive == false) {
                    ClickBtnId = "pws-second-card-select";//jQuery(this).attr("id");
                    jQuery("#second-comp-li").addClass("active");
                    jQuery('.carousel-campareCard').slideDown().fadeTo("slow", 1);
                    IsActive = true;
                } else if(IsActive == true) {
                    ClickBtnId = "";//jQuery(this).attr("id");
                    jQuery("#second-comp-li").removeClass("active");
                    jQuery('.carousel-campareCard').slideUp().fadeTo("fast", 1);
                    IsActive = false;
                }
			});
			jQuery("#pws-third-card-select").click(function () {
                if (IsActive == false) {
                    ClickBtnId = "pws-third-card-select"; //jQuery(this).attr("id");
                    jQuery("#third-comp-li").addClass("active");
                    jQuery('.carousel-campareCard').slideDown().fadeTo("slow", 1);
                    IsActive = true;
                } else if(IsActive == true) {
                    ClickBtnId = "";//jQuery(this).attr("id");
                    jQuery("#third-comp-li").removeClass("active");
                    jQuery('.carousel-campareCard').slideUp().fadeTo("fast", 1);
                    IsActive = false;
                }
			});


 function getHashParameterByName(name) {
        var vars = getHashParameters();
        return vars[name];
    }
    function getHashParameters(aURL) {
        if (aURL === null || aURL === "") {
            return {};
        }

        aURL = aURL || window.location.hash;
        var vars = {};
        var hashes = aURL.slice(aURL.indexOf('#') + 1).split('&');

        hashes = hashes.filter(function (x) {
            return x != ""
        });

        for (var i = 0; i < hashes.length; i++) {
            var hash = hashes[i].split('=');

            if (hash.length > 1) {
                vars[decodeURIComponent(hash[0])] = decodeURIComponent(hash[1]);
            } else {
                vars[decodeURIComponent(hash[0])] = null;
            }
        }
        return vars;
    }

    function updateHash(newHash, remove) {
        var hashStr = "#", ctHashes,
            hashObj = getHashParameters(window.location.hash);

        if (hashObj["ct"] === undefined) {
            hashObj["ct"] = newHash;
        } else {
            ctHashes = hashObj["ct"].split("&");
            if (remove === true && remove !== undefined) {
                ctHashes.splice(newHash, 1);
            } else {
                if (!CheckCard(newHash, ctHashes)) {
                    ctHashes.push(newHash);
                }
            }

            if (ctHashes.length > 0)
                hashObj["ct"] = ctHashes.join("&");
            else {
                delete hashObj["ct"];
            }

        }
        var i = 0;
        _.each(hashObj, function (item, key) {
            if (i > 0) {
                hashStr += "&";
            }
            i++;
            hashStr += key + "=" + item;
        });

        window.location.hash = hashStr;
    }
compare();
}(jQuery));