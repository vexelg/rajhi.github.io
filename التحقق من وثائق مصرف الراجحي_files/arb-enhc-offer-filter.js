
// get selected facets

if (jQuery(".btn-enhc-apply-filter").length > 0) {
    var offerlocation = [];
    var cardTypes = [];
    var partners = [];
	var queryModel;
    jQuery(document).ready(function () {
        jQuery(".enhc-card-offers-advance-filter").hide();
		 queryModel = XA.component.search.query;
    });

    jQuery(".btn-adv-filters").click(function () {
        jQuery(".enhc-card-offers-advance-filter").toggle();
        jQuery(".pws-enhancements .pws-enhc-sticky-filter-bar .col-xs-2 .component-content .btn-adv-filters").toggleClass("active");
        if (jQuery(window).width() < 768) {
            jQuery(".pws-enhancements .pws-enhc-sticky-filter-bar .col-xs-10").css("display", "none");
            jQuery(".pws-enhancements .pws-enhc-sticky-filter-bar .col-xs-2").css("display", "none")
        }
    });
	//for desktop cancel button
    jQuery(".btn-enhc-cancel").click(function () {
        offerlocation = [];
        cardTypes = [];
        partners = [];
        updateHashOffer();
		$('.pws-enhancements .enhc-card-offers-advance-filter .facet-single-selection-list .facet-search-filter .facet-value').removeClass('active-facet');
        //jQuery(".enhc-card-offers-advance-filter").show();
        jQuery(".enhc-card-offers-advance-filter").hide();
        if (jQuery(window).width() < 768) {
            jQuery('.facet-value').removeClass('active-facet');
            jQuery('.facet-value input').prop('checked',false);
            jQuery(".pws-enhancements .pws-enhc-sticky-filter-bar .col-xs-10").css("display", "block");
            jQuery(".pws-enhancements .pws-enhc-sticky-filter-bar .col-xs-2").css("display", "block")
        }
    });
	//for mobile cancel button
    jQuery(".btn-ofr-mobile-clear").click(function () {
        updateHashOffer();
		$('.pws-enhancements .enhc-card-offers-advance-filter .facet-single-selection-list .facet-search-filter .facet-value').removeClass('active-facet');
        //jQuery(".enhc-card-offers-advance-filter").show();
        jQuery(".enhc-card-offers-advance-filter").hide();
        if (jQuery(window).width() < 768) {
            jQuery('.facet-value').removeClass('active-facet');
            jQuery('.facet-value input').prop('checked',false);
            jQuery(".pws-enhancements .pws-enhc-sticky-filter-bar .col-xs-10").css("display", "block");
            jQuery(".pws-enhancements .pws-enhc-sticky-filter-bar .col-xs-2").css("display", "block")
        }
    });
	
	//to fire click event of checkbox on each item click
		$(document).on('click', '.offer-partners .facet-value', function(){
		jQuery(".offer-partners").find(".filterButton").trigger('click');
		jQuery("body").addClass("pws-filters-loading");
		});
		
		$(document).on('click', '.card-type .facet-value', function(){
		jQuery(".card-type").find(".filterButton").trigger('click');
		jQuery("body").addClass("pws-filters-loading");
		});
		
		$(document).on('click', '.offer-locations .facet-value', function(){
		jQuery(".offer-locations").find(".filterButton").trigger('click');
		jQuery("body").addClass("pws-filters-loading");
		});

	
    jQuery(".btn-enhc-apply-filter").click(function (e) {
		 jQuery(".enhc-card-offers-advance-filter").hide();
        if (jQuery(window).width() < 768) {
            jQuery(".pws-enhancements .pws-enhc-sticky-filter-bar .col-xs-10").css("display", "block");
            jQuery(".pws-enhancements .pws-enhc-sticky-filter-bar .col-xs-2").css("display", "block")
        }
    });

    function updateHashOffer() {
        var hashStr = "#";        
        window.location.hash = hashStr;
    }
}


jQuery(document).ajaxStop(function () {
    jQuery("body").removeClass("pws-filters-loading");
    console.log("- stopped filters  ");
});