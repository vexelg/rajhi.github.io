/*
 * Copyright (c) 2014 Mike King (@micjamking)
 *
 * jQuery Succinct plugin
 * Version 1.1.0 (October 2014)
 *
 * Licensed under the MIT License
 */

/*global jQuery*/
(function (jQuery) {
    'use strict';

    jQuery.fn.succinct = function (options) {

        var settings = jQuery.extend({
            size: 240,
            omission: '...',
            ignore: true
        }, options);

        return this.each(function () {

            var textDefault,
                textTruncated,
                elements = jQuery(this),
                regex = /[!-\/:-@\[-`{-~]jQuery/,
                init = function () {
                    elements.each(function () {
                        textDefault = jQuery(this).html();

                        if (textDefault.length > settings.size) {
                            textTruncated = jQuery.trim(textDefault)
                                .substring(0, settings.size)
                                .split(' ')
                                .slice(0, -1)
                                .join(' ');

                            if (settings.ignore) {
                                textTruncated = textTruncated.replace(regex, '');
                            }
                            console.log(textDefault.substring(0, settings.size).split(' ').slice(0, -1).join(' '));

                            jQuery(this).html(textTruncated + textDefault + "<span> " + settings.omission + "</span>");
                        }
                    });
                };
            init();
        });
    };
})(jQuery);