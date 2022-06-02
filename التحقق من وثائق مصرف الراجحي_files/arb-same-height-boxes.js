var sameHeightBoxes = jQuery('#content .column-splitter > [class*="col-"] > div');
/*var sameHeightBoxesWindow = jQuery('.pws-offer-window .items .box-bg');*/
var sameHeightBoxesWindow = jQuery('.pws-promos-page-list .items .item');
var isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
equalheight = function (container) {

    var currentTallest = 0, currentRowStart = 0, rowDivs = new Array(), jQueryel, topPosition = 0;
    jQuery(container).each(function () {

        jQueryel = jQuery(this);
        jQuery(jQueryel).height('auto')
        topPostion = jQueryel.position().top;

        if (currentRowStart != topPostion) {
            for (currentDiv = 0; currentDiv < rowDivs.length; currentDiv++) {
                rowDivs[currentDiv].height(currentTallest);
            }
            rowDivs.length = 0;
            currentRowStart = topPostion;
            currentTallest = jQueryel.height();
            rowDivs.push(jQueryel);
        } else {
            rowDivs.push(jQueryel);
            currentTallest = (currentTallest < jQueryel.height()) ? (jQueryel.height()) : (currentTallest);
        }
        for (currentDiv = 0; currentDiv < rowDivs.length; currentDiv++) {
            rowDivs[currentDiv].height(currentTallest);
        }
    });
};

jQuery(window).load(function () {
    if (sameHeightBoxesWindow.length && jQuery("window").width() > 786) {
        equalheight(sameHeightBoxesWindow);
    }
    //equalheight(sameHeightBoxesWindow);
    if (isSafari && jQuery("window").width() > 786) {
        equalheight(sameHeightBoxes);
    }

});
jQuery(document).ready(function () {
    jQuery(".pws-custom-tabs .tabs-heading li .field-heading").on('click', function () {
        //equalheight(sameHeightBoxesWindow);
        if (jQuery("window").width() > 786) {
            equalheight(sameHeightBoxesWindow);
        }
    });
});
jQuery(window).resize(function () {
    if (sameHeightBoxesWindow.length && jQuery("window").width() > 786) {
        equalheight(sameHeightBoxesWindow);
    }
    if (isSafari && jQuery("window").width() > 786) {
        equalheight(sameHeightBoxes);
    }
});
