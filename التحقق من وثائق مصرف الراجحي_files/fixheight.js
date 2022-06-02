XA.component.equalHeight = (function(jQuery, config) {
    var settings = {
        parentSelector: '.row',
        selector: '.equal'
    };

    var api = {};

    function fixHeight() {

        jQuery(settings.parentSelector).each(function() {
            var jQueryelements = jQuery(this).find(" > div > " + settings.selector),
                maxHeight = 0,
                maxPadding = 0,
                jQuerylink = null;

            jQueryelements.each(function() {
                jQuery(this).css('min-height', 'inherit');

                jQuerylink = jQuery(this).find('.promo-link');
                if (jQuerylink.length === 0) {
                    jQuerylink = jQuery(this).find('.summary-link');
                }

                if (jQuerylink.css('position') == 'absolute') {
                    if (jQuerylink.length && jQuerylink.height() > maxPadding) {
                        maxPadding = jQuerylink.height() + parseInt(jQuerylink.css('padding-top'), 10) + parseInt(jQuerylink.css('padding-bottom'), 10) + parseInt(jQuerylink.css('margin-top'), 10);
                    }
                }

                if (jQuery(this).height() > maxHeight) {
                    maxHeight = jQuery(this).outerHeight(true);
                }

            });

            if (maxHeight > 0) {
                jQueryelements.css({
                    'padding-bottom': maxPadding,
                    'min-height': maxHeight
                });
            }
        });
    }

    api.init = function() {
        jQuery(window).bind('load', function() {
            setTimeout(fixHeight, 0);
        });

        jQuery(window).bind('resize', function() {
            fixHeight();
        });
    };

    return api;

}(jQuery, document));

XA.register("equalHeight", XA.component.equalHeight);