(function (jQuery) {

    var selectedItemsCount = 0;

    //var cardDisplayRow = jQuery(".cmpr-crd-top-section");
    //var cardDisplayMessageTemplate = jQuery(".card-select-message");
    //var compareTable = jQuery(".compare-con");
    var hashStr = [];
    function compare() {
		// var sliderOnly = jQuery('.card-compare-slider-only');
		// if (sliderOnly.length <= 1) 
		// return;	
        jQuery(".card-compare-slider-only .cc-grid-main .cc-item").on("click", function () {
            SelectUnSelectCard(this);
        });
        jQuery("#btn-compare").click(function (e) {
            e.stopPropagation();
            var url = jQuery(this).attr('href');
            jQuery("#btn-compare").attr("href", "" + url + "#&ct=" + hashStr.join(",") + "");
        });
    }
    function SelectUnSelectCard(element) {
        var selectedCard = jQuery(element);

        if (selectedCard.hasClass("selected") == true) {
            var itemId = selectedCard.attr("data-id");
            var itemTitle = selectedCard.find(".compare-cards-short-box .pws-card-title").text();
            RemoveCardFromCompare(itemId, itemTitle)
        }
        else if (selectedItemsCount < 4) {
            selectedCard.toggleClass("selected");
            var itemTitle = selectedCard.find(".compare-cards-short-box .pws-card-title").text();
            var itemID = selectedCard.attr("data-id");
            var index = hashStr.indexOf(itemTitle)
            if (index === -1) {
                hashStr.push(itemTitle)
            }
            selectedItemsCount++;
        }
    }

    function RemoveCardFromCompare(itemId, itemTitle) {
        var unSelectCard = jQuery('.card-compare-slider-only .cc-grid-main .cc-item[data-id="' + itemId + '"]');
        unSelectCard.toggleClass("selected");
        var index = hashStr.indexOf(itemTitle)
        if (index > -1) {
            hashStr.splice(index, 1)
        }
        selectedItemsCount--;



    }







    compare();
}(jQuery));
