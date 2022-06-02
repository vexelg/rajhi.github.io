(function (window, document, $, undefined) {
    var arb = {
        WINDOW_HEIGHT: $(window).height(),
        WINDOW_WIDTH: $(window).width(),
        $body: $("body"),
        lang: $("html").attr("lang"),
        previewMode: $("body").hasClass("preview"),
        validMobileDevice767: $(window).width() <= 767,
        currentForm: 1, //currentVisibleform
        openPdfInBlankPage: function () {
            var $ = jQuery;
            $('.file-list li a').each(function () {
                $(this).attr("target", "_blank");
            });
        },
        formClasses: function () {
            var temp = [];
            // traverse through each fieldlist
            $('.pws-form-heading').each(function (index, value) {
                // traverse through each fieldlist classlist
                $(value.classList).each(function (index, innerValue) {
                    if (innerValue !== 'pws-form-heading' && innerValue !== 'active-form' && innerValue !== 'first-time') {
                        temp.push('.' + innerValue);
                    }
                })
            })

            return temp;
        },
        floatingFormsSection: function () {
            var stickyHeaders = (function () {

                var $window = $(window),
                    $stickies;

                var load = function (stickies) {

                    if (typeof stickies === "object" && stickies instanceof jQuery && stickies.length > 0) {

                        $stickies = stickies.each(function () {

                            var $thisSticky = $(this).wrap('<div class="followWrap" ></div>');

                            $thisSticky
                                .data('originalPosition', $thisSticky.offset().top)
                                .data('originalHeight', $thisSticky.outerHeight())
                                .parent()
                                .height($thisSticky.outerHeight());
                        });

                        $window.off("scroll.stickies").on("scroll.stickies", function () {
                            _whenScrolling();
                        });
                    }
                };

                var _whenScrolling = function () {

                    $stickies.each(function (i) {

                        var $thisSticky = $(this),
                            $stickyPosition = $thisSticky.data('originalPosition');

                        // for first form fieldset element only
                        // if ($stickyPosition <= $window.scrollTop() && $($thisSticky).parent().parent().hasClass(arb.formClasses()[0].replace('.', ''))) {
                        //     console.log('if');
                        //     $thisSticky.addClass("fixed");

                        //     // if element is selected make it active and rest inactive
                        //     if (!$(this).parent().parent().hasClass('first-time')) {
                        //         $(this).parent().parent().addClass('active-form');
                        //         $(this).parent().parent().siblings().removeClass('active-form');
                        //     }

                        //     // search which section the scroll is
                        //     var currentScrollClass = 0;
                        //     for (var i = 0; i < arb.formClasses().length; i++) {
                        //         if ($thisSticky.parent().parent()[0].classList[0] === arb.formClasses()[i].replace('.', '')) {
                        //             currentScrollClass = i;
                        //             break;
                        //         }
                        //     }

                        //     var $nextSticky = $stickies.eq(i + 1),
                        //         $nextStickyPosition = $nextSticky.data('originalPosition') - $thisSticky.data('originalHeight');


                        //     if ($nextSticky.length > 30 && $thisSticky.offset().top >= $nextStickyPosition) {

                        //         $thisSticky.addClass("absolute").css("top", $nextStickyPosition);
                        //     }
                        // }

                        if ($window.scrollTop() == 0) {
                            $thisSticky.removeClass("fixed");
                        }

                        // if form fieldsets other then first are 200 below top then make the nav fixed and screen is tablet or above
                        else if ($stickyPosition <= $window.scrollTop() + 220 && window.innerWidth > 767) {
                            $thisSticky.addClass("fixed");

                            // if element is selected make it active and rest inactive
                            if (!$(this).parent().parent().hasClass('first-time')) {
                                $(this).parent().parent().addClass('active-form');
                                $(this).parent().parent().siblings().removeClass('active-form');
                            }

                            // search which section the scroll is
                            var currentScrollClass = 0;
                            for (var i = 0; i < arb.formClasses().length; i++) {
                                if ($thisSticky.parent().parent()[0].classList[0] === arb.formClasses()[i].replace('.', '')) {
                                    currentScrollClass = i;
                                    break;
                                }
                            }

                            var $nextSticky = $stickies.eq(i + 1),
                                $nextStickyPosition = $nextSticky.data('originalPosition') - $thisSticky.data('originalHeight');


                            if ($nextSticky.length > 30 && $thisSticky.offset().top >= $nextStickyPosition) {

                                $thisSticky.addClass("absolute").css("top", $nextStickyPosition);
                            }

                        }

                        // if mobile
                        else if ($stickyPosition <= $window.scrollTop() + 150 && window.innerWidth < 767) {
                            $thisSticky.addClass("fixed");

                            // if element is selected make it active and rest inactive
                            if (!$(this).parent().parent().hasClass('first-time')) {
                                $(this).parent().parent().addClass('active-form');
                                $(this).parent().parent().siblings().removeClass('active-form');
                            }

                            // search which section the scroll is
                            var currentScrollClass = 0;
                            for (var i = 0; i < arb.formClasses().length; i++) {
                                if ($thisSticky.parent().parent()[0].classList[0] === arb.formClasses()[i].replace('.', '')) {
                                    currentScrollClass = i;
                                    break;
                                }
                            }

                            var $nextSticky = $stickies.eq(i + 1),
                                $nextStickyPosition = $nextSticky.data('originalPosition') - $thisSticky.data('originalHeight');


                            if ($nextSticky.length > 30 && $thisSticky.offset().top >= $nextStickyPosition) {

                                $thisSticky.addClass("absolute").css("top", $nextStickyPosition);
                            }

                        } else {
                            var $prevSticky = $stickies.eq(i - 1);
                            $thisSticky.removeClass("fixed");
                            if ($prevSticky.length > 70 && $window.scrollTop() <= $thisSticky.data('originalPosition') - $thisSticky.data('originalHeight')) {

                                $prevSticky.removeClass("absolute").removeAttr("style");
                            }
                        }
                    });
                };

                return {
                    load: load
                };
            })();

            $(function () {
                stickyHeaders.load($(".eh-form-floating-headings fieldset.pws-form-heading > legend"));
            });

            // Add initial numbers
            $.each($('.enhc-product-form .pws-form-heading legend'), function (index, value) {
                $(value).prepend('<span class="num-count">' + (index + 1) + '</span>');
            });




            // Slide to next form section
            $(arb.formClasses()[0]).addClass('active-form');
            $(arb.formClasses()[0]).siblings('fieldset').addClass('first-time');

            // click on continue button
            $(document).on('click', '.continue-form-section', function () {
                $(this).parent().next().removeClass('first-time');
                $('html, body').animate({
                    scrollTop: $(this).parent().next().offset().top - 30
                }, 1000);
            });


            // add continue button to each form section
            $(arb.formClasses()).each(function (index, value) {
                if (index < $('.num-count').length - 1) {
                    $(value).append("<span class='btn btn-default continue-form-section form-" + (index + 1) + "'>" + Globalresources.txtcontinue +"</span>");
                }

                // add/show count of current form
                if ($(value).children('.form-count').length <= 0) {
                    $(value + ' legend').append('<span class="form-count"></span>');
                }
                $(value + ' legend').children('.form-count').html(' ' + (index + 1) + ' / ' + arb.formClasses().length);

            });


        },
        productionFormValidation: function () {
            var formSubmit = $('.eh-apply-product-top .form-submit-border');
            formSubmit.on("click", function (e) {
                // $('.eh-apply-product-top').addClass("form-success");
                // $(".eh-apply-product-full").show();
                // $("html, body").animate({scrollTop: 0}, "slow");
                // e.preventDefault();
            });
            $('.eh-dark-box a').on("click", function () {
                $('.eh-dark-box').fadeOut("slow");
            });

            // activate scrolling form
            setTimeout(function () {
                arb.floatingFormsSection()
            }, 500);

        },

        findBranchExtras: function () {

            $('.pws-main-findabranch-container').addClass('list-view-active');
            $('.eh-mobile-switch-buttons .e-btn.list-view').addClass('active');

            $('.filterButton').click(function () {
                $('.pws-filter-toggle').removeClass("active");
                $(".eh-filters-all").hide();
                $('.pws-recent-searches-text').hide();
            });
            $('.eh-mobile-switch-buttons').on('click', '.e-btn', function () {
                $(this).addClass('active').siblings().removeClass('active');

            });
            $('.e-btn.list-view').on('click', function () {
                $('.pws-main-findabranch-container').addClass('list-view-active')
                $('.pws-main-findabranch-container').removeClass('map-view-active')
            });
            $('.e-btn.map-view').on('click', function () {
                $('.pws-main-findabranch-container').addClass('map-view-active');
                $('.pws-main-findabranch-container').removeClass('list-view-active')
            });
            $('.e-btn.list-view').on('click', function () {
                $('.pws-main-findabranch-container').addClass('list-view-active')
                $('.pws-main-findabranch-container').removeClass('map-view-active')
            });
            $('.e-btn.map-view').on('click', function () {
                $('.pws-main-findabranch-container').addClass('map-view-active');
                $('.pws-main-findabranch-container').removeClass('list-view-active')
            });


        },
        fixdBranchFixedFilterBtn: function () {
            /* FIXED FILTER BUTTON*/
            $(window).scroll(function () {
                var elementOffset = $('#footer').offset().top;
                var footerTop = (elementOffset - $(window).scrollTop());
                /*  if (footerTop > ($(window).height() - 20)) {
                 $('.branch-locator-filters-box .bottom-filter-button').addClass('non-stick');
                 }
                 else {
                 $('.branch-locator-filters-box .bottom-filter-button').removeClass('non-stick');
                 }*/
                //debugger;
                if (footerTop < ($(window).height() - 20)) {
                    $('.branch-locator-filters-box .bottom-filter-button').addClass('non-stick');

                } else {
                    $('.branch-locator-filters-box .bottom-filter-button').removeClass('non-stick');
                }
            })
        },
        initCheckboxes: function () {
            var radioBtn = $(".radio label input");
            radioBtn.change(function () {
                if ($(this).is(":checked")) {
                    radioBtn.parent().removeClass('checked');
                    $(this).parent().addClass('checked');
                }
            });
        },
        initInjectPromoImage: function () {
            var imageUrl = jQuery(".eh-inject-img img").attr('src');
            var promoBox = $(".pws-promo-box-app-icon.online-app-sec");
            $('.bg-parallex-block').css('background-image', 'url("' + imageUrl + '")');


        },

        initBranchLocatorClearInput: function () {
            jQuery(".branch-locator-filters-box .location-filter .component-content > label").on("click", function () {
                jQuery(".branch-locator-filters-box .location-filter .location-search-box-input").val("");
                jQuery(".branch-locator-filters-box .location-filter").removeClass("input-active");
            });
            /*jQuery('.location-search-box-input').on('input', function () {
                console.log("location-search-box-input - input-active" + "val" + jQuery('.location-search-box-input').val());
            });*/
        },
        attachUrlQueryHeading: function () {
            $(document).ready(function () {

                if ($('.arb-search-product .search-results-count .results-count').length) {
                    // initialization
                    $('.arb-search-product .search-results-count .results-count').append('<b></b>');

                    var fetchUrl = '',
                        fetchUrl__query = '',
                        sub_query2 = '',
                        outputString = '';

                    function updateText(staticText) {
                        fetchUrl = decodeURIComponent(window.location.href);
                        fetchUrl__query = fetchUrl.slice(fetchUrl.indexOf('sr3_q='), fetchUrl.length);
                        sub_query2 = fetchUrl__query.indexOf('&');
                        outputString = fetchUrl__query.slice(6, sub_query2);

                        var _r = $('.arb-search-product .arb-search-count .results-count').html().trim().replace('@searchterm', outputString);
                        if (_r.indexOf('%20') > 0) _r = _r.replace('%20', ' ');
                        $('.arb-search-product .arb-search-count .results-count').text(_r);
                    }

                    // First attempt
                    updateText();

                    setInterval(function () {
                        if (window.location.hash.indexOf('sr3_q=') > 0) {
                            //update text
                            updateText();
                        }
                    }, 10);
                } //if ended

            });
        },
        initHowToApplyTabsFix: function () {
            $('.pws-enhc-how-to-apply .eh-parent').on('click', function () {
                //$('.pws-enhc-how-to-apply').find('li').removeClass('active');
                $('.pws-enhc-how-to-apply .arb-enhc-hta-tab-2').find('.tab').removeClass('active');
                $('.pws-enhc-how-to-apply .arb-enhc-hta-tab-2').find('li').removeClass('active');

            });
        },
        joinUStop: function () {
            $(".joinus-btn-complete").on('submit', function () {
                setTimeout(function () {
                    if (!$(".joinus-btn-complete").find('.field-validation-error').length) {
                        $(document).scrollTop(0);
                    }
                }, 500);
            })

        },
        loader: function () {
            $('.pws-enhancements .pws-popup-subscribe .form-submit-border').after('<div class="form-loader"> </div>');
        },
        initClearFilterText: function () {
            var allBranchesText = $('.branch-locator-filters-box .facet-single-selection-list.branchesoratm .facet-heading .clear-filter');
            var allBrancheTabs = $('.branch-locator-filters-box .facet-single-selection-list');
            allBranchesText.text(Globalresources.viewall);
            allBranchesText.on('click', function () {
                allBrancheTabs.removeClass('force-show')
            });

        },
        // bold selected value of select
        boldAllSelectedCombos: function () {
            $(document).on('change', '.enhc-product-form select, .eh-apply-product-top select', function () {
                if ($(this).val().length > 0) {
                    $(this).css({
                        opacity: 1,
                        'font-weight': '600',
                        'color': '#000000'
                    });
                } else {
                    $(this).css({
                        opacity: 0.5,
                        'font-weight': 'normal',
                        'color': '#172328'
                    });
                }
            })
        },
        validateFromEmptiness: function () {

            var elementClass = '';
            // find if the form is joinus or product form
            if ($('.joinus-btn-complete').length > 0) elementClass = '.joinus-btn-complete';
            else elementClass = '.enhc-product-form';

            // disable bydefault
            /* ol temporary */
            //$(elementClass + ' .form-submit-border').addClass('disabled');
            //$(elementClass + ' .form-submit-border input').addClass('disabled');



            function validateForm() {

                var
                    textIsEmpty = [],
                    emailIsEmpty = [],
                    radioIsEmpty = [],
                    selectIsEmpty = [];

                // check text
                var totalText = $(elementClass + ' input[type="text"]:not(.form-control)');
                if (totalText.length >= 1) {
                    for (var i = 0; i < totalText.length; i++) {
                        if ($(totalText)[i].value.length <= 0) {
                            textIsEmpty.push(1);
                        }
                    }
                }

                // check email
                var totalEmail = $(elementClass + ' input[type="email"]');
                if (totalEmail.length >= 1) {
                    for (var j = 0; j < totalEmail.length; j++) {
                        if (totalEmail[j].value.length <= 0) {
                            emailIsEmpty.push(1);
                        }
                    }
                }

                // check radio
                var totalRadio = $(elementClass + ' .radio');
                var totalRadioChildren = $(elementClass + ' .radio label.checked');
                if (totalRadio.length >= 1) {
                    if (totalRadioChildren.length < totalRadio.length) {
                        radioIsEmpty.push(1);
                    }
                }

                // select
                var totalSelect = $(elementClass + ' select');
                if (totalSelect.length >= 1) {
                    for (var l = 0; l < totalSelect.length; l++) {
                        if (totalSelect[l].value.length <= 0) {
                            selectIsEmpty.push(1);
                        }
                    }
                }

                if (textIsEmpty.length <= 0 &&
                    emailIsEmpty.length <= 0 &&
                    radioIsEmpty.length <= 0 &&
                    selectIsEmpty.length <= 0
                ) {
                    /* ol temporary */
                    //$(elementClass + ' .form-submit-border').removeClass('disabled');
                    //$(elementClass + ' .form-submit-border input').removeClass('disabled');
                } else {
                    /* ol temporary */
                    //$(elementClass + ' .form-submit-border').addClass('disabled');
                    //$(elementClass + ' .form-submit-border input').addClass('disabled');
                }
            }

            // text + email
            $(document).on('keydown keyup', elementClass + ' input[type="text"]', validateForm);
            $(document).on('keydown keyup', elementClass + ' input[type="email"]', validateForm);
            // radio + checkbox + select
            $(document).on('change', elementClass + ' select', validateForm);
            $(document).on('change', elementClass + ' input[type="radio"]', validateForm);

        },
        initHttpProtocol: function () {
            if (location.protocol !== "https:") {
                console.log("http");
                $('.pws-http-warning').show();
                $('.btn-force-https').on("click", function () {
                    location.href = 'https:' + window.location.href.substring(window.location.protocol.length);
                });
            } else {
                console.log("https");
            }
        },		
		initGetUrlVariable:function(){
			var vars = [], hash;
			var hashes = window.location.href.slice(window.location.href.indexOf('#') + 1).split('&');
			for (var i = 0; i < hashes.length; i++) {
				hash = hashes[i].split('=');
				vars.push(hash[0]);
				vars[hash[0]] = hash[1];
			}
			return vars;			
		},
		initApplyForProduct:function(e){
			var CardValue = arb.initGetUrlVariable()["prod"];
            if (CardValue !== "undefined") {
                $('#check').val(decodeURI(CardValue)).trigger('change');
            }	      
		},	

        init: function () {
            arb.openPdfInBlankPage();
            arb.productionFormValidation();
            arb.findBranchExtras();
            arb.initCheckboxes();
            arb.initBranchLocatorClearInput();
            arb.attachUrlQueryHeading();
            arb.initHowToApplyTabsFix();
            arb.joinUStop();
            arb.loader();
            arb.initClearFilterText();
            arb.boldAllSelectedCombos();
            arb.validateFromEmptiness();
            arb.initHttpProtocol();
			arb.initApplyForProduct();
            /* arb.initInjectPromoImage()*/
            if (arb.validMobileDevice767) {
                arb.fixdBranchFixedFilterBtn();
            }
			

        }
    };
    window.arb = arb;

})(window, document, jQuery);
jQuery(document).ready(function () {
    arb.init();

});
