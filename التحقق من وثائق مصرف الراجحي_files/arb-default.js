(function (window, document, $, undefined) {
    var app = {
        WINDOW_HEIGHT: $(window).height(),
        WINDOW_WIDTH: $(window).width(),
        isMobile: false,
        isTouch: false,
        isTablet: false,
        resizeTimeoutID: null,
        $body: $("body"),
        isMouseDown: false,
        slider: null,
        $container: null,
        gridSlider: [],
        owl: null,
        lang: $("html").attr("lang"),
        allLoaded: false,
        isAnimating2: true,
        isPopupOpen: true,
        pre_loading_api: "",
        factory_scene_api: "",
        branchLocator: $(".branch-locator-filters-box"),
        products_scene_api: "",
        people_scene_api: "",
        sustainability_scene_api: "",
        contact_scene_api: "",
        owl_cc_grid_main: "",
        previewMode: $("body").hasClass("preview"),
        validMobileDevice: $(window).width() <= 1024,
        validMobileDevice2: $(window).width() <= 767,
        detectDevice: function () {
            (function (a) {
                if (
                    /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(
                        a
                    ) ||
                    /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(
                        a.substr(0, 4)
                    )
                ) {
                    app.isMobile = true;
                }
            })(navigator.userAgent || navigator.vendor || window.opera);
            if (
                navigator.userAgent.match(/Android/i) ||
                navigator.userAgent.match(/webOS/i) ||
                navigator.userAgent.match(/iPhone/i) ||
                navigator.userAgent.match(/iPad/i) ||
                navigator.userAgent.match(/iPod/i) ||
                navigator.userAgent.match(/BlackBerry/i) ||
                navigator.userAgent.match(/Windows Phone/i)
            ) {
                app.isTouch = true;
                app.$body.addClass("touch");
            } else {
                app.$body.addClass("no-touch");
            }
            app.isTablet = !app.isMobile && app.isTouch;
        },
        resizeListener: function () {
            if (!app.isTouch) {
                $(window).resize(function () {
                    clearTimeout(app.resizeTimeoutID);
                    app.resizeTimeoutID = setTimeout(app._windowResize, 500);
                });
            } else {
                window.addEventListener("orientationchange", function () {
                    $(".hot-spot").width(
                        ($(".home-mobile .section-mob").width() * 80) / 100
                    );
                    $(".hot-spot.bunch-01, .hot-spot.bunch-02").height(
                        ($(".home-mobile .section-mob").height() * 25) / 100
                    );
                    $(
                        ".hot-spot.bunch-03, .hot-spot.bunch-04, .hot-spot.bunch-05"
                    ).height(($(".home-mobile .section-mob").height() * 40) / 100);
                    app._windowResize();
                });
            }
        },
        _windowResize: function () {
            app.WINDOW_HEIGHT = $(window).height();
            app.WINDOW_WIDTH = $(window).width();

            app.campareCarousel();

        },

        initScrollableNav: function () {
            var lastScrollTop = 125,
                lastScrollTop2 = 493,
                delta = 5,
                nav_up_ani,
                nav_down_ani;
            $(window).scroll(function (event) {
                var st = $(this).scrollTop();
                if (Math.abs(lastScrollTop - st) <= delta) return;

                if (st > lastScrollTop) {
                    // downscroll code
                    clearTimeout(nav_down_ani);
                    $("#wrapper")
                        .removeClass("nav-down")
                        .removeClass("nav-down-ani")
                        .addClass("nav-up");
                    nav_up_ani = setTimeout(function () {
                        $("#wrapper").addClass("nav-up-ani");
                    }, 100);
                } else if (st > -1 && st < 1) {
                    clearTimeout(nav_up_ani);
                    $("#wrapper")
                        .removeClass("nav-up")
                        .removeClass("nav-up-ani")
                        .addClass("nav-down");
                    nav_down_ani = setTimeout(function () {
                        $("#wrapper").addClass("nav-down-ani");
                    }, 100);
                    $(".nav-down .pws-header-nav-container").css("top", "-85px");
                }
                //lastScrollTop = st;
                if ($(".pws-enhc-sticky-filter-bar").length > 0) {
                    if (st > lastScrollTop2) {
                        $(".pws-enhc-sticky-filter-bar").addClass("sticky-filter");
                    } else if (st < lastScrollTop2) {
                        $(".pws-enhc-sticky-filter-bar").removeClass("sticky-filter");
                    }
                }
            });
            $("#wrapper")
                .removeClass("nav-up")
                .removeClass("nav-up-ani")
                .addClass("nav-down");
        },
        initSearchBox: function () {
            $(".pws-search-btn").on("click", function (e) {
                $("html").toggleClass("search-box-open");
                $(".search-box-input.tt-input").focus();
                // $(".search-box-input.tt-input,.search-box-input.tt-hint").val("");
                e.preventDefault();
                e.stopPropagation();
            });
/*
            $(".search-box-input.tt-input").bind("keyup, keydown", function (e) {
                if (e.keyCode === 13) {
                    // e.preventDefault();
                    console.log(".search-box-input.tt-input");
                    $(".search-box-input.tt-input").val("");
                }
            });
*/
        },
        initHoverMenu: function () {
            $(".top-nav-inner > li > a").on("hover", function (e) {
                $("html").toggleClass("nav-menu-open");
                e.preventDefault();
                e.stopPropagation();
            });
        },
        randomFunc: function () {
            $(window).scroll(function () {
                var scrollTop = 200;
                if ($(window).scrollTop() >= scrollTop) {
                    $(".scroll-top").fadeIn();
                } else {
                    $(".scroll-top").fadeOut();
                    $(".short-tabs li a").removeClass("active");
                    $(".short-tabs li:first-child a").addClass("active");
                }

                if ($(window).scrollTop() >= 50) {
                    $(".short-tabs li a").removeClass("active");
                    $(".short-tabs li:first-child a").addClass("active");
                }

                if (
                    $(window).scrollTop() >=
                    $(document).height() - ($(window).height() + $("#footer").height())
                ) {
                    var brownHeight = $(".pws-brown-bg").outerHeight() + 32;
                    $("#footer").addClass("stick-bottom");
                    $("#footer.stick-bottom .scroll-top").css(
                        "top",
                        "-" + brownHeight + "px"
                    );
                } else {
                    $("#footer.stick-bottom .scroll-top").css("top", "auto");
                    $("#footer").removeClass("stick-bottom");
                }


                if($(".pws-enhancements .pws-enhc-sticky-filter-bar").length){
                    if ($(window).scrollTop() >= ($(document).height() - ($(window).height() + $("#footer").height() + $(".pws-popup-subscribe .component-content").height()))) {
                        var botmPos = $(window).scrollTop() - ($(document).height() - ($(window).height() + $("#footer").height() + $(".pws-popup-subscribe .component-content").height()));
                        $('.pws-enhancements .pws-enhc-sticky-filter-bar .component-content .component .col-xs-2').css('bottom',botmPos);
                    } else  {
                        var botmPos = 0;
                        $('.pws-enhancements .pws-enhc-sticky-filter-bar .component-content .component .col-xs-2').css('bottom',botmPos);
                    }
                }


            });


            $(".scroll-top").click(function () {
                $("body,html").animate({scrollTop: 0}, 1300);
            });

            $(".pws-form-element .radio label").each(function () {
                var label_text = $(this).text();
                $(this).append("<span>" + label_text + "</span>");
            });

            if (!app.previewMode == true && jQuery("Main-Navigation").length > 0) {
                $(".pws-email-advice .form-group input").attr(
                    "placeholder",
                    Globalresources.WffmSubscribe
                );
            }
            $("body").on(
                "click",
                ".pws-search-accordion .search-result-list li",
                function () {
                    if ($(this).hasClass("opened")) {
                        $(".pws-search-accordion .search-result-list li").removeClass(
                            "opened"
                        );
                    } else {
                        $(".pws-search-accordion .search-result-list li").removeClass(
                            "opened"
                        );
                        $(this).addClass("opened");
                    }
                }
            );
        },
        initSubscribePopup: function () {

            $(window).scroll(function () {
                if ($(".pws-popup-subscribe").length == 1) {
                    if (app.isPopupOpen) {
                        if ($(window).scrollTop() >= ($(document).height() - ($(window).height() + $("#footer").height() + $(".pws-popup-subscribe .component-content").height()))) {
                            $(".pws-popup-subscribe").removeClass('stick-bottom');
                            $('.pws-popup-subscribe').removeClass('popup-up-ani');
                            $("main #content").css("margin-bottom","0");
                        } else {
                            $(".pws-popup-subscribe").addClass('stick-bottom');
                            var popSubH = $(".pws-popup-subscribe .component-content").height();
                            $("main #content").css("margin-bottom",popSubH);
                            setTimeout(function () {
                                $('.pws-popup-subscribe').addClass('popup-up-ani');
                            }, 100);
                        }
                    }
                }
            });

            function setCookie(cname,cvalue,exdays) {
                var d = new Date();
                d.setTime(d.getTime() + (exdays*24*60*60*1000));
                var expires = "expires=" + d.toGMTString();
                document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
            }

            function getCookie(cname) {
                var name = cname + "=";
                var decodedCookie = decodeURIComponent(document.cookie);
                var ca = decodedCookie.split(';');
                for(var i = 0; i < ca.length; i++) {
                    var c = ca[i];
                    while (c.charAt(0) == ' ') {
                        c = c.substring(1);
                    }
                    if (c.indexOf(name) == 0) {
                        return c.substring(name.length, c.length);
                    }
                }
                return "";
            }

            if ($(".pws-popup-subscribe").length == 1) {

                $("footer #footer").css("margin-top", "0");

                var SubscribeCookie = getCookie("subscriberemail");

                if (SubscribeCookie == "" || SubscribeCookie == null) {
                    $(".pws-popup-subscribe").addClass('stick-bottom');
                    setTimeout(function () {
                        $('.pws-popup-subscribe').addClass('popup-up-ani');
                    }, 100);
                } else {
                    app.isPopupOpen = false;
                }

                // $(".pws-enhancements .pws-popup-subscribe .form-submit-border").addClass('disabled');

                // var submitBtn = $(".pws-enhancements .pws-popup-subscribe .form-submit-border input");
                // submitBtn.attr('disabled', 'disabled');

                $(".pws-enhancements .pws-popup-subscribe .arb-popup-email .text-box").bind("keyup keypress keydown blur propertychange change click input paste", function () {
                    setTimeout(function () {
                        if ($('.pws-popup-subscribe .arb-popup-email.has-success').length) {
                            // submitBtn.removeAttr('disabled');
                            $(".pws-enhancements .pws-popup-subscribe .form-submit-border input").removeClass('disabled');
                        }
                        if ($('.pws-popup-subscribe .arb-popup-email.has-error').length) {
                            // submitBtn.attr('disabled', 'disabled');
                            $(".pws-enhancements .pws-popup-subscribe .form-submit-border input").addClass('disabled');
                        }
                    }, 500);
                });

                $(".pws-enhancements .pws-popup-subscribe .component-content form").append('<div class="clos-popup"></div>');

                $(".pws-enhancements .pws-popup-subscribe .clos-popup").bind("click", function () {
                    app.isPopupOpen = false;
                    $(".pws-popup-subscribe").removeClass('popup-up-ani').addClass('popup-down-ani');
                    setCookie("subscriberemail", "PWS", 365);
                    setTimeout(function () {
                        $('.pws-popup-subscribe').removeClass('popup-down-ani');
                        $('.pws-popup-subscribe').removeClass('stick-bottom');
                        $("main #content").css("margin-bottom","0");
                    }, 1000);
                });
            }

            if($(".pws-subscription-form").length){
                $('.pws-subscription-form .btn[type="submit"]').on('click',function(e){
                    var formElement = $('.pws-subscription-form'),
                        hasError = $(formElement).children('.has-error');
                    var email = $('.pws-subscription-form .text-box').val();
                    if(hasError.length <= 1){
                        var interval=setInterval(function(){
                            if($('.pws-subscription-form .pws-subscription-form').length > 0){
                                $('.pws-subscription-form .pws-subscription-form').addClass('pws-show-thanks-message');
                                $('.pws-show-thanks-message').append(' '+email);
                                clearInterval(interval);
                                setTimeout(function () {
                                    app.isPopupOpen = false;
                                    setCookie("subscriberemail", "PWS", 365);
                                    $(".pws-popup-subscribe").removeClass('popup-up-ani').addClass('popup-down-ani');
                                    setTimeout(function () {
                                        $('.pws-popup-subscribe').removeClass('popup-down-ani');
                                        $('.pws-popup-subscribe').removeClass('stick-bottom');
                                        $("main #content").css("margin-bottom","0");
                                    }, 2000);
                                }, 1000);
                            }
                        }, 100);
                    }
                });
            }
        },
        initMasonryGrid: function () {
            var $container = $(".masonry-grid");
            if ($container.length == 1) {
                //$container.masonry('destroy');
                $container.masonry({
                    // options...
                    isRTL: app.lang == "ar" ? !0 : !1,
                    itemSelector: ".item"
                });
            }
        },
        facetCount: function () {
            var countTxt = "";
            var countTxtVal = 0;
            $(".offer-categories .facet-search-filter .facet-count").each(function () {
                countTxt = $(this).html();
                countTxt = countTxt.split("(");
                countTxt = countTxt[1].split(")");
                countTxt = parseInt(countTxt[0]);
                countTxtVal += countTxt;
            });
            var countTxt2 = "";
            // $(".offer-categories .bottom-remove-filter button").html("View All (" + countTxtVal + ")");

            $(".pws-enhancements .pws-enhc-sticky-filter-bar .facet-single-selection-list .bottom-remove-filter button").html( Globalresources.viewall + "(" + countTxtVal + ")");

            /*
             if($(".facet-single-selection-list .bottom-remove-filter button").hasClass("active-facet")){
             $(".facet-single-selection-list .bottom-remove-filter button").addClass("active-facet");
             }
             */

            $(".facet-single-selection-list .bottom-remove-filter button").click(
                function (e) {
                    $(this).addClass("active-facet");
                }
            );

            $(".facet-single-selection-list .facet-search-filter .facet-value").click(
                function (e) {
                    $(
                        ".facet-single-selection-list .bottom-remove-filter button"
                    ).removeClass("active-facet");
                }
            );
        },
        mobileMenu: function () {
            $(".hamburger").click(function (e) {
                var hasClass = $(this).hasClass("is-active");
                if (hasClass) {
                    $(this).removeClass("is-active");
                    // $(".pws-header-top-container, .pws-header-nav-container").removeClass("mobile-slide");
                    if($('.arb-mobile-main-nav').hasClass('nav-left-ani')){
                        setTimeout(function () {
                            $(".arb-mobile-main-nav").removeClass("mobile-slide");
                            // $(".arb-mobile-main-nav .submenu .pws-arrow").removeClass("open-icon");
                            $(".arb-mobile-main-nav .submenu").removeClass("open-next-ul");
                            $(".arb-mobile-main-nav .submenu").removeClass("open-level-2");
                            $(".pws-enhancements header .arb-mobile-main-nav .pws-group-nav .rich-text h3").parent().parent().parent().parent().removeClass("open-next-ul");
                            $(".pws-enhancements header .arb-mobile-main-nav .pws-group-nav .rich-text h3").parent().parent().parent().parent().removeClass("open-level-2");
                            $(".pws-enhancements header .arb-mobile-main-nav .pws-ebanking-nav h3").parent().parent().removeClass("open-next-ul");
                            $(".level1").removeClass("open-level-2-pos");
                            $(".pws-group-nav").removeClass("open-level-2-pos");
                        }, 10);
                        $('.arb-mobile-main-nav').removeClass('nav-left-ani');
                    } else {
                        $(".arb-mobile-main-nav").removeClass("mobile-slide");
                        // $(".arb-mobile-main-nav .submenu .pws-arrow").removeClass("open-icon");
                        $(".arb-mobile-main-nav .submenu").removeClass("open-next-ul");
                        $(".pws-enhancements header .arb-mobile-main-nav .pws-group-nav .rich-text h3").parent().parent().parent().parent().removeClass("open-next-ul");
                        $(".pws-enhancements header .arb-mobile-main-nav .pws-ebanking-nav h3").parent().parent().removeClass("open-next-ul");
                    }
                } else {
                    $(this).addClass("is-active");
                    // $(".pws-header-top-container, .pws-header-nav-container").addClass("mobile-slide");
                    $(".arb-mobile-main-nav").addClass("mobile-slide");

                    $(".pws-enhancements header .arb-mobile-main-nav .submenu.active").addClass("open-next-ul");

                    if(!$(".pws-enhancements header .arb-mobile-main-nav .navigation .level1").hasClass("open-next-ul")){
                        $(".pws-enhancements header .arb-mobile-main-nav .navigation .level1:first-child").addClass("show-open-acc")
                    }

                    if($(".pws-enhancements header .arb-mobile-main-nav .submenu.level2").hasClass("active")){

                        setTimeout(function () {
                            $('.arb-mobile-main-nav').toggleClass('nav-left-ani');
                            $(".pws-enhancements header .arb-mobile-main-nav .submenu.level2.active").addClass("open-level-2");
                            $(".pws-enhancements header .arb-mobile-main-nav .submenu.level1.active").addClass("open-level-2-pos");
                        }, 900);
                    }

                }

                $("body").toggleClass("scroll-fixed");

                // $(".main-header .top-nav-container .top-nav-inner li").removeClass("opened");
                // $(".main-header .m-m-menu .col-md-3").removeClass("opened");




/*
                var hasClass = $(this).hasClass("is-active");
                if (hasClass) {
                    $(this).removeClass("is-active");
                    $(".pws-header-top-container, .pws-header-nav-container").removeClass("mobile-slide");
                } else {
                    $(this).addClass("is-active");
                    $(".pws-header-top-container, .pws-header-nav-container").addClass("mobile-slide");
                }
                $(".main-header .top-nav-container .top-nav-inner li").removeClass("opened");
                $(".main-header .m-m-menu .col-md-3").removeClass("opened");
*/
            });
            /*
             $('.toggle .toggle-header').click(function (e) {
             $('.hamburger').removeClass('is-active');
             $(".pws-header-top-container, .pws-header-nav-container").removeClass('mobile-slide');
             $('.main-header .top-nav-container .top-nav-inner li').removeClass('opened');
             $('.main-header .m-m-menu .col-md-3').removeClass('opened');
             });
             */

            $(".arb-mobile-main-nav .level1.submenu > .navigation-title").click(function (e) {
                $(".pws-enhancements header .arb-mobile-main-nav .pws-group-nav.open-next-ul").removeClass("open-next-ul");
                $(".pws-enhancements header .arb-mobile-main-nav .pws-group-nav .rich-text h3.open-icon").removeClass("open-icon");
                $(".pws-enhancements header .arb-mobile-main-nav .pws-ebanking-nav.open-next-ul").removeClass("open-next-ul");
                $(".pws-enhancements header .arb-mobile-main-nav .pws-ebanking-nav h3.open-icon").removeClass("open-icon");
                $(".pws-enhancements header .arb-mobile-main-nav .navigation .level1:first-child").removeClass("show-open-acc");

                if ($(this).parent().hasClass("open-next-ul")) {
                    $(".arb-mobile-main-nav .level1.submenu.open-next-ul").removeClass("open-next-ul");
                    $(".pws-enhancements header .arb-mobile-main-nav .navigation .level1:first-child").addClass("show-open-acc");
                } else {
                    $(".arb-mobile-main-nav .level1.submenu.open-next-ul").removeClass("open-next-ul");
                    $(this).parent().addClass("open-next-ul");
                }

                // $(this).parent().toggleClass("open-next-ul");
                // $(this).toggleClass("open-icon");
            });

            $(".arb-mobile-main-nav .level3.submenu > .navigation-title").click(function (e) {
                if ($(this).parent().hasClass("open-next-ul")) {
                    $(".arb-mobile-main-nav .level3.submenu.open-next-ul").removeClass("open-next-ul");
                } else {
                    $(".arb-mobile-main-nav .level3.submenu.open-next-ul").removeClass("open-next-ul");
                    $(this).parent().addClass("open-next-ul");
                }
            });

            $(".pws-enhancements header .arb-mobile-main-nav .pws-group-nav .rich-text h3").click(function (e) {
                $(this).toggleClass("open-icon");
                $(this).parent().parent().parent().parent().toggleClass("open-next-ul");
                $(".arb-mobile-main-nav .level1.submenu.open-next-ul").removeClass("open-next-ul");
                $(".pws-enhancements header .arb-mobile-main-nav .pws-ebanking-nav.open-next-ul").removeClass("open-next-ul");
                $(".pws-enhancements header .arb-mobile-main-nav .pws-ebanking-nav h3.open-icon").removeClass("open-icon");
            });

            $(".pws-enhancements header .arb-mobile-main-nav .pws-ebanking-nav h3").click(function (e) {
                $(this).toggleClass("open-icon");
                $(this).parent().parent().toggleClass("open-next-ul");
                $(".arb-mobile-main-nav .level1.submenu.open-next-ul").removeClass("open-next-ul");
                $(".pws-enhancements header .arb-mobile-main-nav .pws-group-nav.open-next-ul").removeClass("open-next-ul");
                $(".pws-enhancements header .arb-mobile-main-nav .pws-group-nav .rich-text h3.open-icon").removeClass("open-icon");
            });

            $(".arb-mobile-main-nav .level2.submenu > .navigation-title").click(function (e) {
                if($(this).parent().hasClass("open-next-ul")){
                    var thisElem = $(this);
                    setTimeout(function () {
                        // thisElem.toggleClass("open-icon");
                        thisElem.parent().toggleClass("open-next-ul");
                        thisElem.parent().toggleClass("open-level-2");
                        $(".level1").toggleClass("open-level-2-pos");

                    }, 600);
                    $('.arb-mobile-main-nav').toggleClass('nav-left-ani');
                } else {
                    $(".arb-mobile-main-nav").scrollTop(0);
                    setTimeout(function () {
                        $('.arb-mobile-main-nav').toggleClass('nav-left-ani');
                    }, 50);
                    // $(this).toggleClass("open-icon");
                    $(this).parent().toggleClass("open-next-ul");
                    $(this).parent().toggleClass("open-level-2");
                    $(".level1").toggleClass("open-level-2-pos");
                }
            });

            $(".pws-enhancements header .arb-mobile-main-nav .pws-group-nav .link-list h3").click(function (e) {
                if($(this).hasClass("open-icon")){
                    var thisElem = $(this);
                    setTimeout(function () {
                        thisElem.toggleClass("open-icon");
                        thisElem.parent().parent().toggleClass("open-next-ul");
                        thisElem.parent().parent().toggleClass("open-level-2");
                        $(".pws-group-nav").toggleClass("open-level-2-pos");
                    }, 600);
                    $('.arb-mobile-main-nav').toggleClass('nav-left-ani');
                } else {
                    $(".arb-mobile-main-nav").scrollTop(0);
                    setTimeout(function () {
                        $('.arb-mobile-main-nav').toggleClass('nav-left-ani');
                    }, 50);
                    $(this).toggleClass("open-icon");
                    $(this).parent().parent().toggleClass("open-next-ul");
                    $(this).parent().parent().toggleClass("open-level-2");
                    $(".pws-group-nav").toggleClass("open-level-2-pos");
                }
            });








            $(".main-header .top-nav-container .top-nav-inner li > span").click(function (e) {
                $(".main-header .m-m-menu .col-md-3.opened").removeClass("opened");
                if ($(this).parents("li").hasClass("opened")) {
                    $(".main-header .top-nav-container .top-nav-inner li.opened").removeClass("opened");
                } else {
                    $(".main-header .top-nav-container .top-nav-inner li.opened").removeClass("opened");
                    $(this).parents("li").addClass("opened");
                }
            });

            $(
                ".main-header .top-nav-container .top-nav-inner li .col-md-3 > span"
            ).click(function (e) {
                if (
                    $(this)
                        .parent()
                        .hasClass("opened")
                ) {
                    $(".main-header .m-m-menu .col-md-3.opened").removeClass("opened");
                } else {
                    $(".main-header .m-m-menu .col-md-3.opened").removeClass("opened");
                    $(this)
                        .parent()
                        .addClass("opened");
                }
            });

            if ($(window).width() < 769) {
                var $section = $(".pws-site-nav .component-content").clone();
                $section.addClass("mobil-nav");
                $(".pws-toggle-drop-left .pws-discover-list-container").prepend(
                    $section
                );
                var txt = $(".mobil-nav ul li.active a").html();
                $(".pws-toggle-drop-left .toggle-header .toggle-label").html(txt);

                $(".pws-cards-compr-slider .btn-filter").each(function () {
                    var label_text = $(this).html();
                    label_text = label_text.split("<span>");
                    if (label_text[1] !== undefined) {
                        label_text = "<span>" + label_text[1];
                        $(this).html(label_text);
                    }
                });
                var seeAllLink = $(".pws-cta-promo-box .pws-see-all-link").clone();
                $(".pws-offer-slider .items .box-bg").append(seeAllLink);
                /*
                 $('.pws-offer-slider .items .box-bg').each(function () {
                 console.log(seeAllLink);
                 $(this).append(seeAllLink);
                 });
                 */

                if (
                    $(".pws-level-3.pws-cta-promo-box .component-content div").hasClass(
                        "pws-cta-bg-banner field-bannerimage"
                    )
                ) {
                    $(".pws-level-3.pws-cta-promo-box .boxed").addClass("set-padding");
                }

                var toggleAccordion = $(
                    ".pws-toggle-drop-left .row.column-splitter .link-list h3"
                );
                toggleAccordion.click(function () {
                    /*toggleAccordion.removeClass("active-heading").next().removeClass("active").hide();*/
                    $(this)
                        .toggleClass("active-heading")
                        .next()
                        .toggleClass("active")
                        .slideToggle();
                });
            } else {
                $(
                    ".pws-toggle-drop-left .pws-discover-list-container .mobil-nav"
                ).remove();
            }
        },
        initOfferSlider: function () {
            var pwsOfferSlider = $(".pws-offer-slider");
            if (pwsOfferSlider.length >= 1) {
                pwsOfferSlider.children(".component-content").owlCarousel({
                    loop: true,
                    margin: 0,
                    nav: true,
                    navText: [],
                    items: 1
                });
            }
            var pwsOfferCarousel = $(".pws-offer-carousel");
            if (pwsOfferCarousel.length >= 1) {
                pwsOfferCarousel.children(".component-content").owlCarousel({
                    loop: true,
                    margin: 0,
                    nav: true,
                    center: true,
                    navText: [],
                    responsive: {
                        0: {
                            items: 1,
                            autoWidth: false
                        },
                        768: {
                            items: 3,
                            autoWidth: true
                        }
                    }
                });
            }

            var pwsOfferWindow = $(".pws-offer-window");
            if (pwsOfferWindow.length >= 1) {
                pwsOfferWindow.children(".component-content").owlCarousel({
                    loop: true,
                    margin: 0,
                    nav: true,
                    navText: [],
                    autoHeight: true,
                    items: 1
                });
            }

            var blogSliderEnhc = $(".blog-slider-enhc .component-content");
            if (blogSliderEnhc.length >= 1) {
                blogSliderEnhc.owlCarousel({
                    loop: false,
                    margin: 38,
                    nav: true,
                    navText: [],
                    //rtl: true,
                    rtl: app.lang == "ar" ? !0 : !1,
                    responsive: {
                        0: {
                            margin: 20,
                            center: true,
                            autoWidth:true,
                            items: 1
                        },
                        769: {
                            items: 2
                        },
                        1025: {
                            items: 3
                        }
                    }
                });
                blogSliderEnhc.on('initialized.owl.carousel', function(event) {
                    app.initDotDotDot();
                });
            }

            var aplSliderEnhc = $(".pws-apply-now-links");
            if (aplSliderEnhc.length >= 1) {
                aplSliderEnhc.find(".component-content ul").addClass('owl-carousel').owlCarousel({
                    loop: false,
                    autoWidth: false,
                    margin: 15,
                    nav: true,
                    navText: [],
                    //rtl: true,
                    rtl: app.lang == "ar" ? !0 : !1,
                    responsive: {
                        0: {
                            margin: 0,
                            items: 1,
                            stagePadding: 60
                        },
                        320: {
                            margin: 0,
                            items: 1,
                            stagePadding: 60
                        },
                        375: {
                            margin: 0,
                            items: 1,
                            stagePadding:90
                        },
                        767: {
                            margin: 0,
                            items: 1,
                            stagePadding: 80
                        },
                        768: {
                            margin: 0,
                            items: 3,
                            stagePadding:0
                        },
                        769: {
                            items: 3

                        },
                        1025: {
                            items: 3,
                            autoWidth: false
                        }
                    }
                });
            }

            var enhc_picto = $(".enhc-picto-indefinite-cols-link-list .component-content ul").addClass('owl-carousel');

            enhc_picto.each(function (index) {
                var $gallery = $(this);
                var hasMultipleItems = $gallery.find("li").length >= 4 ? true : false;
                if (enhc_picto.length >= 1 && app.WINDOW_WIDTH < 769 && hasMultipleItems) {
                    $gallery.owlCarousel({
                        loop: false,
                        autoWidth: false,
                        margin: 15,
                        nav: true,
                        navText: [],
                        //rtl: true,
                        rtl: app.lang == "ar" ? !0 : !1,
                        // onInitialize: callback2,
                        onInitialized: callback2,
                        responsive: {
                            0: {
                                margin: 0,
                                items: 1,
                                stagePadding: 50
                            }

                        }
                    });
                }

                function callback2(event) {
                    console.log("callback2");
                    var element = event.target;
                    var highestBox = 0;
                    $('li', element).each(function () {
                        if ($(this).height() > highestBox) {
                            highestBox = $(this).height();
                        }
                    });
                    $('li', element).height(highestBox);
                }

            });
        },
        initOfferListing: function () {
            if ($(".pws-offer-listing").length > 0) {
                var today = new Date();
                var dd = today.getDate();
                var mm = today.getMonth() + 1; //January is 0!
                var yyyy = today.getFullYear();

                if (dd < 10) {
                    dd = "0" + dd;
                }

                if (mm < 10) {
                    mm = "0" + mm;
                }

                today = "".concat(yyyy, mm, dd);
                if (window.location.hash === "")
                    window.location.hash = "#offerlisting_ExpiryDate=" + today + "|";
            }
        },
        initScrollToElements: function () {
            /* $(document).on('click', '.short-tabs a', function (event) {
             event.preventDefault();

             $('html, body').animate({
             scrollTop: $($.attr(this, 'href')).offset().top - 180
             }, 500);
             });
             */
            if ($(".short-tabs li").length >= 1) {
                $(".short-tabs li:first-child a").addClass("active");
            }
            $('.short-tabs a[href^="#"]').bind("click.smoothscroll", function (e) {
                e.preventDefault();
                var target = this.hash,
                    $target = $(target);

                $("html, body")
                    .stop()
                    .animate(
                        {
                            scrollTop: $target.offset().top - 69
                        },
                        900,
                        "swing",
                        function () {
                            //window.location.hash = target;
                        }
                    );
            });

            $('.pws-link-list-for-tabs li a[href^="#"]').bind(
                "click.smoothscroll",
                function (e) {
                    e.preventDefault();
                    var target = this.hash,
                        $target = $(target);

                    $("html, body")
                        .stop()
                        .animate(
                            {
                                scrollTop: $target.offset().top - 170
                            },
                            900,
                            "swing",
                            function () {
                            }
                        );
                }
            );
        },
        initScrollToTopToggle: function () {
            $(".pws-simple-accordion-title .toggle-content[open] .toggle-header").on("click", function (e) {
                var target = this,
                    $target = $("target");

                $("html, body").stop().animate({scrollTop: $target.offset().top - 200},900);
                /*$('html, body').animate({scrollTop:$(this.parent(".pws-simple-accordion-title")).position().top}, 'slow');*/
            });
        },
        initScrollToTopFAQAccordion: function () {

            var addTopMar = 0;

            if ($(window).width() > 801) {
                addTopMar = 90;
            }

            // if ($(window).width() < 769) {
                $(".pws-enhancements .accordion .item .toggle-header").on("click", function (e) {
                    var that = $(this).parent().prev();
                    // var that = $(this).parents(".item.active").prev();
                    if(that.length < 1 ) {
                        that = $(this).parent();
                    }
                    setTimeout((function() {
                        $("html, body").animate({scrollTop: that.offset().top-addTopMar},900);
                    }), 600);
                });
            // }

            $(".pws-enhancements .pws-simple-accordion-title summary.toggle-header").on("click", function (e) {
                var that = $(this).parent();
                setTimeout((function() {
                    $("html, body").animate({scrollTop: that.offset().top-addTopMar},500);
                }), 50);
            });

        },
        initValidateForm: function () {
            var formInputs = $(".pws-form-element .form-control");
            var submitBtn = $(".pws-form-element .form-submit-border input");
            var helpBlock = $(".help-block");
            submitBtn.attr("disabled", "disabled");
            //submitBtn.hide();

            formInputs.bind("keyup blur", function () {
                //formInputs.keyup(function () {

                var empty = false;
                formInputs.each(function () {
                    if (
                        $(this).val() == "" &&
                        $(this).hasClass("input-validation-error")
                    ) {
                        empty = true;
                    }
                });

                if (empty) {
                    submitBtn.attr("disabled", "disabled");
                    //submitBtn.hide();
                } else {
                    if (
                        $(".pws-form-element").find(".field-validation-error").length == 0
                    ) {
                        submitBtn.removeAttr("disabled");
                    } else {
                        submitBtn.attr("disabled", "disabled");
                    }
                    //submitBtn.show();
                }
            });
        },
        initFancyBox: function () {
            var variousOverlay = $(".various-overlay");
            if (variousOverlay.length >= 1) {
                variousOverlay.fancybox({
                    maxWidth: 1140,
                    maxHeight: 1120,
                    fitToView: false,
                    width: "80%",
                    height: "80%",
                    padding: "0",
                    autoSize: false,
                    closeClick: false,
                    openEffect: "none",
                    closeEffect: "none",
                    wrapCSS: "white-overlay-skin"
                });
            }
            var offersOverlay = $(".offers-overlay");
            if (offersOverlay.length >= 1) {
                offersOverlay.fancybox({
                    maxWidth: 1140,
                    maxHeight: 1120,
                    fitToView: false,
                    width: "80%",
                    height: "80%",
                    padding: "0",
                    autoSize: false,
                    closeClick: false,
                    openEffect: "none",
                    closeEffect: "none",
                    wrapCSS: "dark-overlay-skin",
                    helpers: {
                        overlay: {
                            css: {"background-color": "#585858"}
                        }
                    }
                });
            }
        },
        initCategoryItem: function () {
            var items = jQuery(".cc-item");
            items.each(function () {
                var _this = jQuery(this);
                var cat_items = _this.find(".pws-category-title");
                cat_items.each(function () {
                    var cat_text = jQuery(this)
                        .text()
                        .toLowerCase()
                        .replace(" ", "-");
                    _this.addClass(cat_text);
                });
            });
        },
        initCreditCardMod: function () {
            /*      var filterItem = $(".cc-grid-main .cc-item");
             var compareCon = $(".compare-con.compare-single-card");
             filterItem.live("click", function () {
             $(this).toggleClass("selected");
             if (filterItem.hasClass("selected") == true) {
             compareCon.addClass("active-compare-section");

             } else {
             compareCon.removeClass("active-compare-section");
             }
             console.log("has class" + filterItem)
             });*/
            /*console.log(app.lang);*/

            var data = {
                //loop: true,
                margin: 10,
                navText: [],
                nav: true,
                //rtl: true,
                rtl: app.lang == "ar" ? !0 : !1,
                /*  center: true,
                 loop: true,*/
                items: 6,
                responsive: {
                    0: {
                        items: 1,
                        margin: 0
                    },
                    600: {
                        items: 2
                    },
                    768: {
                        items: 3
                    },
                    1024: {
                        items: 5
                    },
                    1025: {
                        items: 6
                    }
                }
            };
            var owl = $(".cc-grid-main").owlCarousel(data);
            var owlAnimateFilter = function (even) {
                $(this)
                    .addClass("__loading")
                    .delay(
                        70 *
                        $(this)
                            .parent()
                            .index()
                    )
                    .queue(function () {
                        $(this)
                            .dequeue()
                            .removeClass("__loading");
                    });
            };
            $(".btn-filter")
                .eq(0)
                .addClass("btn-active");
            $(".btn-filter-wrap").on("click", ".btn-filter", function (e) {
                var filter_data = $(this).data("filter");

                /* return if current */
                if ($(this).hasClass("btn-active")) return;

                /* active current */
                $(this)
                    .addClass("btn-active")
                    .siblings()
                    .removeClass("btn-active");

                /* Filter */
                owl.owlFilter(filter_data, function (_owl) {
                    $(_owl)
                        .find(".item")
                        .each(owlAnimateFilter);
                });
            });
            $(".slide-arrow").click(function () {
                $(this).toggleClass("active");
                $(".cards-compare-slider .btn-filter-wrap").slideToggle();
                $(
                    ".cards-compare-slider .cc-grid-main.owl-carousel.owl-theme"
                ).slideToggle();
            });

            /* $.each(function () {
             var appendInn = $(".facet-dropdown-select");
             var viewAllBtn = $("bottom-remove-filter");
             viewAllBtn.clone().appendTo(appendInn);
             console.log("done pt");
             });*/
        },
        initBackToPreviousPage: function () {
        },
        initToggleVideoCaption: function () {
            $(".mejs-video").on("click", function (e) {
                $(".video .video-caption").toggleClass("hide-caption");
            });

            $(".overlay-source").on("click", function (e) {
                $("html").addClass("overlay-source-open");
            });
        },
        initHistoryBackBtn: function () {
            var notFoundBtn = $(".pws-back-to-history-btn");
            //console.log(history.length);
            if (window.history.length >= 3) {
                notFoundBtn.click(function () {
                    window.history.go(-1);
                });
            }
        },
        initArabicLangText: function () {
            var str = $(".language-selector a.flags-sa");
            var arabic = "\u0639\u0631\u0628\u0649";
            str.html(arabic);
            //str.html(" ");
        },
        initBannerBG: function () {
            var bannerSrc = $(".pws-cta-bg-banner img").attr("src");
            var bgBanner = $(".pws-bg-image-bottom:after");
            var banner = $(".pws-cta-bg-banner");
            var condition = banner.find("img").length;
            if (condition) {
                banner.parents(".with-header-image").addClass("active-banner");
                /*bgBanner.css('background-image', 'url(' + bannerSrc + ')');*/
            } else {
                banner.parents(".with-header-image").addClass("active-bg-banner");
                //banner.remove();
            }
        },
        initFilterImages: function () {
            var element = $("[data-facetvalue]");
            if (element.length > 0 && typeof icons !== "undefined") {
                var list = [];
                $.each(element, function (i, val) {
                    list.push($(element[i]).attr("data-facetvalue"));
                });
                $(".facet-search-filter .facet-value").each(function () {
                    $(this)
                        .find("img")
                        .remove();
                    $(this).append(
                        $("<img />").attr("src", icons[$(this).attr("data-facetvalue")])
                    );
                });
            }

            if ($(window).width() < 769) {

                var viewAllBtn = $(".pws-enhancements .pws-enhc-sticky-filter-bar .col-xs-10 .facet-single-selection-list .bottom-remove-filter").clone();
                var viewAllBtn2 = $(".pws-enhancements .facet-single-selection-list.blogscategory .bottom-remove-filter").clone();
                // var viewAllBtn3 = $(".pws-enhancements .pws-press-release-filter-enhc .bottom-remove-filter").clone();

                if (!$(".pws-enhancements .pws-enhc-sticky-filter-bar .col-xs-10 .facet-single-selection-list .facet-search-filter > div").hasClass("bottom-remove-filter")) {
                    $(".pws-enhancements .pws-enhc-sticky-filter-bar .col-xs-10 .facet-single-selection-list .facet-search-filter").prepend(viewAllBtn);
                }
                if (!$(".pws-enhancements .facet-single-selection-list.blogscategory  .facet-search-filter > div").hasClass("bottom-remove-filter")) {
                    $(".pws-enhancements .facet-single-selection-list.blogscategory .contentContainer .facet-search-filter").prepend(viewAllBtn2);
                }
                // if (!$(".pws-enhancements .pws-press-release-filter-enhc  .facet-search-filter > div").hasClass("bottom-remove-filter")) {
                //     $(".pws-enhancements .pws-press-release-filter-enhc .contentContainer .facet-search-filter").prepend(viewAllBtn3);
                // }

                // var lastScrollTop3 = $(".pws-enhancements .pws-header-carousel").height(),
                var lastScrollTop3 = 377,
                    delta = 5;

                $(window).scroll(function (event) {
                    var st = $(this).scrollTop();
                    if (Math.abs(lastScrollTop3 - st) <= delta) return;

                    if ($(".pws-enhc-sticky-filter-bar").length > 0) {
                        if (st > lastScrollTop3) {
                            $(".pws-enhc-sticky-filter-bar").addClass("sticky-filter");
                        } else if (st < lastScrollTop3) {
                            $(".pws-enhc-sticky-filter-bar").removeClass("sticky-filter");
                        }
                    }
                });

                /*
                 $(
                 ".facet-single-selection-list.offer-categories .facet-search-filter .facet-value > span"
                 ).each(function () {
                 var label_text = $(this).html();
                 $(this).html($(this).find(".facet-count"));
                 //console.log($(this).find(".facet-count"));
                 });
                 */

                /*
                 label_text = label_text.split("<span>");
                 if (label_text[1] !== undefined) {
                 label_text = "<span>" + label_text[1];
                 $(this).html(label_text);
                 }
                 */
            }
        },
        initFindBranch: function () {
            var branch = $(".pws-branch");
            var mainBox = $(".branch-locator-filters-box");
            branch.click(function () {
                mainBox.addClass("one-branch-active");
                branch.removeClass("active");
                $(this).addClass("active");
                /*console.log("clicked");*/
            });

            /*var recentSearchBox = jQuery(".pws-recent-searches-box").height();
             jQuery(".pws-branches-box").height(recentSearchBox);*/
            $(".location-search-box-input").focus(function () {
                /*$(".branch-locator-filters-box .pws-recent-searches-text").addClass("show");
                 console.log( "Handler for .focus() called." );*/
                $('.pws-recent-searches-text').show();
                $(document).bind('focusin..pws-recent-searches-text click..pws-recent-searches-text', function (e) {
                    if ($(e.target).closest('.pws-recent-searches-text, .location-search-box-input').length) return;
                    $(document).unbind('.example');
                    $('.pws-recent-searches-text').fadeOut('medium');
                });
            });
            $(".location-search-box-input").hide();

            jQuery(".branch-locator-filters-box .arb-map-search-box .component-content > label").on("click", function () {
                jQuery(".branch-locator-filters-box .arb-map-search-box .search-box-input").val("");
                jQuery(".branch-locator-filters-box .arb-map-search-box").removeClass("input-active");
            });


        },
        initInPageNav: function () {
            $(".short-tabs").delegate("li", "click", function () {
                $(".short-tabs li a").removeClass("active");
                $(this)
                    .find("a")
                    .addClass("active");

                $(".tabs-boxes div").removeClass("active");
                var divID = $(this)
                    .find("a")
                    .attr("href");
                $(divID).addClass("active");
            });

            //if ($('.pws-offer-slider div').hasClass('owl-nav disabled')) {
            if ($(".pws-offer-slider div").hasClass("owl-nav")) {
                $(".pws-offer-slider")
                    .parent()
                    .addClass("pws-offer-slider-hide-only");
            }

            if ($(".pws-apply-main-box div").hasClass("tabs-container")) {
                $(".pws-apply-main-box .pws-apply-now-content").addClass(
                    "hide-border-top"
                );
            }

            if ($("main div").hasClass("pws-email-advice")) {
                $(".pws-apply-main-box .pws-apply-now-content").addClass(
                    "hide-border-top"
                );
            }
        },
        initCharacterLimits: function () {
            function ellipsisText($elem, $limit) {
                var $str = $elem.html(); // Getting the text
                var $strtemp = $str.substr(0, $limit); // Get the visible part of the string
                $str =
                    $strtemp +
                    '<span class="hidden">' +
                    $str.substr($limit, $str.length) +
                    "</span>" +
                    "..."; // Recompose the string with the span tag wrapped around the hidden part of it
                $elem.html($str); // Write the string to the DOM
            }

            var $title = $(".pws-cta-promo-box .pws-cta-title");
            var $subTitle = $(".pws-cta-promo-box .pws-cta-subtitle");
            ellipsisText($title, 28);
            ellipsisText($subTitle, 32);
        },
        initSearchFunctions: function () {
            var btn = $(".pws-filter-toggle");
            var filterBox = $(".eh-filters-all");
            btn.click(function () {
                $(this).toggleClass("active");
                filterBox.slideToggle();
            });
            $(".pws-back-to-search-btn, .branch-locator-filters-box.one-branch-active .pws-branches-box li, .filterButton").on("click", function () {
                $(".eh-filters-all").hide();
                console.log("hide facets");
            });
        },

        initRippleEffect: function () {
            var $ = jQuery;
            $("a").each(function () {
                if ($(this).attr("target") == "_blank") {
                    $(this).addClass("target-blank");
                }
            });
            //var ripple = $(".btn.btn-primary:not(.initialized), .pws-btn a:not(.initialized),  .inline-btn a:not(a.target-blank)");
            var ripple = jQuery(
                ".btn.btn-primary:not(.initialized), .enhc-link-btn a:not(.initialized), .pws-btn a:not(.initialized), .filled a:not(.initialized), .btn-continue:not(.initialized), .inline-btn a:not(a.target-blank, .initialized)"
            );
            //var ripple = $('a', this).attr("href");
            ripple.on("click", function (event) {
                event.preventDefault();

                var $div = $("<span/>"),
                    btnOffset = $(this).offset(),
                    xPos = event.pageX - btnOffset.left,
                    yPos = event.pageY - btnOffset.top;

                $div.addClass("ripple-effect");
                var $ripple = $(".ripple-effect");

                $ripple.css("height", $(this).height());
                $ripple.css("width", $(this).height());
                $div
                    .css({
                        top: yPos - $ripple.height() / 2,
                        left: xPos - $ripple.width() / 2
                    })
                    .appendTo($(this));
                window.setTimeout(
                    function (href) {
                        $div.remove();
                        location.href = href;
                    },
                    500,
                    $(this).attr("href")
                );
                /* window.setTimeout(function () {
                 $div.remove();
                 }, 2000);*/
            });
        },
        initSearchBoxListing: function () {
            $(".location-search-box-input").on("keypress", function (e) {
                if (e.which === 13) {
                    app.initTypeaheadClick();
                }
            });
            $(".location-search-box-button").on("click", function () {
                app.initTypeaheadClick();
            });
        },
        initTypeaheadClick: function () {
            var boxBranches = $(".branch-locator-filters-box");
            if (boxBranches.length >= 1) {
                boxBranches.removeClass("one-branch-active");
                boxBranches.find(".pws-branches-box li").removeClass("active");
                $("body").addClass("autocomplete-done");
            }
        },
        initBootstrapTooltip: function () {
            $('[data-toggle="tooltip"]').tooltip({
                position: {
                    my: "center top+8",
                    at: "center bottom"
                }
            });
        },
        initShowHideRecentSearches: function () {
            var toggleBtn = $(".hide-searches-btn");

            toggleBtn.on("click", function () {
               // $(".pws-recent-searches-box").toggleClass("hide");
			   $('.pws-recent-searches-text').hide();
			   $('.branch-locator-filters-box .plain-html').show();
			   $('.branch-locator-filters-box .pws-branches-box').show();
                //toggleBtn.text(toggleBtn.text() == "HIDE" ? "SHOW" : "HIDE");
            });
        },
        initLangArabic: function () {
            var en = "en";
            var ar = "ar-AE";

            $(".language-selector a").click(function (e) {
                e.stopPropagation();
                $("html").attr("lang", en ? ar : en);
            });
        },
        initScrollToAnimaite: function () {
            var anchor = $('a[href*="#"]:not([href="#"])');
            anchor.click(function (e) {
                if (
                    $(this).attr("data-toggle") ||
                    $(this).hasClass("tab-nav-item") ||
                    $(".pws-clusta-links .cc-grids-col-left li a") ||
                    $(".load-more .component-content, .form-submit-border")
                )
                    return;
                e.preventDefault();
                if (
                    location.pathname.replace(/^\//, "") ==
                    this.pathname.replace(/^\//, "") &&
                    location.hostname == this.hostname
                ) {
                    var target = $(this.hash);
                    target = target.length
                        ? target
                        : $("[name=" + this.hash.slice(1) + "]");
                    if (target.length) {
                        $("html, body").animate(
                            {
                                scrollTop: target.offset().top - 170
                            },
                            1000
                        );
                        return false;
                    }
                }
            });
        },
        initFirstItemActive: function () {
            var firstItem = $(".pws-header-top-container .navigation-title ul li");

            if (!firstItem.hasClass("active")) {
                firstItem.eq(0).addClass("active");
            }
        },
        initEllipsis: function () {
            var threeLines = $(
                ".overview-clusta .featured-offers > div:first-child .pws-listing-item .pws-title a, .pws-offer-listing .pws-listing-item.offers-overlay .pws-content-box .max-content-width .field-description, .pws-offer-carousel.owl-carousel .owl-item .right-content .pws-ellipsis-two-rows"
            );
            var twoLines = $(
                ".overview-clusta .featured-offers > div:nth-child(n+2) .pws-listing-item .pws-title a, .pws-press-release-listing .pws-listing-item .pws-title-heading a"
            );
            threeLines.dotdotdot({});
            twoLines.dotdotdot({});
            /*threeLines.ellipsis({
             lines: 3,
             ellipClass: 'ellip'

             });
             twoLines.ellipsis({
             lines: 2,
             ellipClass: 'ellip'

             });*/
        },
        initDisbaleRightClick: function () {
            var $selector = $(".overlay-source");
            $selector.on("click auxclick contextmenu", function (e) {
                e.preventDefault();
                //console.log(e.which);
                //console.log(e.type);

                if (e.type == "contextmenu") {
                    //console.log("Context menu prevented.");
                    return false;
                }

                switch (e.which) {
                    case 1:
                        //window.location = $(this).attr('href');
                        //console.log("ONE");
                        break;
                    case 2:
                        //window.open($(this).attr('href'));
                        //console.log("TWO");
                        break;
                    case 3:
                        //console.log("THREE");
                        break;
                }
            });
        },
        initNavArabicLinkTitles: function () {
            if (app.lang == "ar") {
                $("a").each(function () {
                    var linkText = $(this).text();
                    $(this).attr("title", linkText);
                });
            }
        },
        initAnimateOnScroll: function () {
            var animateParallexPromo = {
                "data-aos": "fade-up",
                "data-aos-delay": 100,
                "data-aos-once": true,
                "data-aos-duration": 2000
            };
            var animateObj = {
                "data-aos": "fade-up",
                "data-aos-delay": 100,
                "data-aos-once": true,
                "data-aos-duration": 1000
            };
            var animateFade = {
                "data-aos": "fade",
                "data-aos-delay": 100,
                "data-aos-once": true,
                "data-aos-duration": 1000
            };
            var animateObjLeft = {
                "data-aos": "fade-right",
                "data-aos-delay": 150,
                "data-aos-once": true,
                "data-aos-duration": 1000
            };
            var animateObjRight = {
                "data-aos": "fade-left",
                "data-aos-delay": 150,
                "data-aos-once": true,
                "data-aos-duration": 1000
            };
            $(".bg-parallex-block").attr(animateParallexPromo);

            $(
                ".pws-promo-card-with-image.pws-promo-card-full, .pws-row-accordion-container .short-boxed"
            ).attr(animateObj);
            $(
                ".online-app-sec .promo-content, .pws-indefinite-cols-link-list li, .pws-apply-main-box .boxed"
            ).attr(animateFade);

            var leftElements = $(
                ".column-splitter .col-xs-6:first-child, .pws-apply-main-box .component-content .left-content"
            );
            var rightElements = $(
                ".column-splitter .col-xs-6:nth-child(2), .pws-apply-main-box .component-content .right-content"
            );

            if (app.lang == "en") {
                leftElements.attr(animateObjLeft);
                rightElements.attr(animateObjRight);
            } else {
                leftElements.attr(animateObjRight);
                rightElements.attr(animateObjLeft);
            }
        },
        initDotDotDot: function () {
            $(
                "#content .enhc-overview-clusta .featured-offers .enhc-content-box .enhc-subtitle"
            ).dotdotdot({
                // truncate: "word",
                // watch: "window"
            });
            $(
                ".blog-slider-enhc .item .right-content .pws-ellipsis-two-rows"
            ).dotdotdot({});
            // $('.awards-tabs-container .award .field-description').dotdotdot();
            $(".pws-enhancements .page-list.whats-new .enhc-description").dotdotdot();
        },
        initFilterCheckViewAll: function () {
            if (
                $(
                    ".facet-single-selection-list .facet-search-filter .facet-value"
                ).hasClass("active-facet")
            ) {
                $(
                    ".facet-single-selection-list .bottom-remove-filter button"
                ).removeClass("active-facet");
            } else {
                $(".facet-single-selection-list .bottom-remove-filter button").addClass(
                    "active-facet"
                );
            }
            //console.log("added facet");
        },
        initAnchorOnDiv: function () {
            $(".pws-enhancements .page-list.whats-new ul li").click(function () {
                window.location = $(this)
                    .find("a")
                    .attr("href");
                return false;
            });

            $('body').on('click', '.arb-search-product .search-results .search-result-list li', function (e) {
                window.location = $(this)
                    .find("a")
                    .attr("href");
                return false;
            });

        },
        thisListCarousel: function () {
            var owlThis = jQuery(".this-list-carousel")
                .children(".component-content")
                .children("ul");
            if (owlThis.find("li").length >= 6) {
                owlThis.owlCarousel({
                    margin: 0,
                    items: 3,
                    nav: true,
                    loop: true,
                    responsiveClass: false,
                    responsive: {
                        0: {
                            items: 1
                        },
                        768: {
                            items: 3
                        },
                        1024: {
                            items: 5
                        }
                    }
                });
            }
        },
        overlayCloseAction: function () {
            $(".overlay-close").on("click", function (e) {
                $("html").removeClass("overlay-source-open");
            });
        },
        initCloseAllSummaryDetailsToggle: function () {
            var isIE11 = !!window.MSInputMethodContext && !!document.documentMode;
            if (!isIE11 && !app.validMobileDevice2) {
                var details = Array.from(document.querySelectorAll("#header details"));
                details.forEach(function (targetDetail) {
                    targetDetail.addEventListener("click", function () {
                        details.forEach(function (detail) {
                            if (detail !== targetDetail) {
                                if (isIE11) {
                                    detail
                                        .querySelector("#header summary")
                                        .setAttribute("aria-expanded", "false");
                                } else {
                                    detail.removeAttribute("open");
                                }
                            }
                        });
                    });
                });
                var ignore = Array("#header details");
                ignore.forEach(function (item) {
                    $(item).click(function (event) {
                        event.stopImmediatePropagation();
                        // return false;
                    });
                });
                var element = $("#header details");
                $(document).on("click", function () {
                    var len = element.length;
                    for (var i = 0; i < len; i++) {
                        element[i].removeAttribute("open");
                        // element[i].find("summary").attr("aria-expanded", "false");
                    }
                });
            }
        },
        initSurveyForm: function () {

            function arrangeStar(className) {

                var element1 = ".pws-enhc-surveyform " + className + " .form-group .radio label";
                var element2 = ".pws-enhc-surveyform " + className + " .form-group .radio";

                for (var c = 0; c < 5; c++) {
                    var survey_label = $(element1).eq(c);
                    $(element2).prepend(survey_label);
                }

                for (var i = 0; i < 5; i++) {
                    var survey_radio_label = $(element1).eq(i);
                    var survey_radio_input = survey_radio_label.find("input");
                    var survey_radio_input_id = survey_radio_input.attr("id") + "_" + i;
                    survey_radio_input.attr("id", survey_radio_input_id);
                    survey_radio_label.attr("for", survey_radio_input_id);
                    survey_radio_input.insertBefore(survey_radio_label);
                }

                $("<a href=\"javascript:void(0)\" class=\"btn-continue disabled\">Continue</a>").insertAfter(".pws-enhc-surveyform " + className + " .form fieldset");

                $('body').on('click', '.pws-enhc-surveyform ' + className + ' .form-group .radio input + label', function () {
                    $(this).parents("fieldset").next().removeClass("disabled");
                    if ($(this).parents(".pws-enhc-survey-of-product").length > 0) {
                        var starVal = $(this).text();
                        if (starVal < 5) {
                            $(".pws-enhc-surveyform .form fieldset .form-group.pws-tell-us-more").css("display", "block");
                        } else {
                            $(".pws-enhc-surveyform .form fieldset .form-group.pws-tell-us-more").css("display", "none");
                        }
                    }
                });

                $('body').on('click', '.pws-enhc-surveyform ' + className + ' .link .field-link .inline-btn', function (e) {
                    e.preventDefault();
                    $(this).parents(className).toggleClass("open");
                    $(this).parent().toggleClass("open");

                    if($(window).width() < 768){
                        $("body").toggleClass("scroll-fixed-survey");
                        var targetElement = $(".pws-enhc-surveyform .form");
                        if($("body").hasClass("scroll-fixed-survey")){
                            bodyScrollLock.disableBodyScroll(targetElement);
                        } else {
                            bodyScrollLock.clearAllBodyScrollLocks();
                        }
                    }

                });

                $('body').on('click', '.pws-enhc-surveyform ' + className + ' .form fieldset + .btn-continue', function () {
                    $(this).prev().css("display", "none");
                    $(this).next().css("display", "block");
                    $(".pws-enhancements .pws-enhc-surveyform " + className + " .form-submit-border").css("display", "block");
                    $(this).css("display", "none");
                });

                $('body').on('click', '.pws-enhc-surveyform ' + className + ' .form .form-submit-border .btn.btn-default', function (e) {
/*
                    if($(".pws-enhc-surveyform .form .has-error.has-feedback .validation-summary-errors").length == 0){
                        $(".pws-enhc-surveyform " + className + " .form fieldset, .pws-enhc-surveyform " + className + " .form fieldset + a ").css("display", "none");
                        $(".pws-enhc-surveyform " + className + " .form fieldset + a + fieldset, .pws-enhc-surveyform " + className + " .form fieldset + a + fieldset + a ").css("display", "none");
                        $(".pws-enhancements .pws-enhc-surveyform .form-submit-border").css("display", "none");
                        $(".pws-enhancements .pws-enhc-surveyform " + className + " .pws-survey-feedback").css("display", "block");
                        $(".pws-enhc-surveyform " + className + " .form").css("min-height", "0");
                    }
*/
                });

                $('body').on('click', '.pws-enhc-surveyform ' + className + ' .pws-survey-feedback .rich-text .btn-keep-browsing', function (e) {
                    $(this).parents(className).toggleClass("open");
                    $(".pws-enhc-surveyform .link .field-link").removeClass("open");

                    if($(window).width() < 768){
                        $("body").toggleClass("scroll-fixed-survey");
                        var targetElement = $(".pws-enhc-surveyform .form");
                        if($("body").hasClass("scroll-fixed-survey")){
                            bodyScrollLock.disableBodyScroll(targetElement);
                        } else {
                            bodyScrollLock.clearAllBodyScrollLocks();
                        }
                    }

                });

                $('body').on('click', '.pws-enhc-surveyform ' + className + ' .form .form-submit-border .btn-back', function () {
                    $(".pws-enhc-surveyform " + className + " .form fieldset, .pws-enhc-surveyform " + className + " .form fieldset + a ").css("display", "block");
                    $(".pws-enhc-surveyform " + className + " .form fieldset + a + fieldset, .pws-enhc-surveyform " + className + " .form fieldset + a + fieldset + a ").css("display", "none");
                    $(".pws-enhancements .pws-enhc-surveyform " + className + " .form-submit-border").css("display", "none");
                });

                var element3 = ".pws-enhc-surveyform " + className + " .form-group .checkbox label";
                var survey_checkbox_label = $(element3);
                var survey_checkbox_input = survey_checkbox_label.find("input[type=checkbox]");
                var survey_checkbox_input_id = survey_checkbox_input.attr("id") + "_" + 1;
                survey_checkbox_input.attr("id", survey_checkbox_input_id);
                survey_checkbox_label.attr("for", survey_checkbox_input_id);
                survey_checkbox_input.insertBefore(survey_checkbox_label);

                app.initRippleEffect();

            }

            if ($(".pws-enhc-surveyform").length) {
                arrangeStar(".pws-enhc-survey-of-site");
                arrangeStar(".pws-enhc-survey-of-product");
                $(".pws-enhancements .pws-enhc-surveyform .form-submit-border").prepend("<a href=\"javascript:void(0)\" class=\"btn-back\">Back</a>");

                $(".FullName input.text-box").attr("maxlength", 100);
                $(".MobileNumber input.text-box").attr("maxlength", 15);
            }



            $('body').on('click', '.enhc-card-offers-advance-filter .component .component-content .btn-show-partners', function () {
                $(".pws-enhancements .enhc-card-offers-advance-filter .offer-partners .facet-search-filter").toggleClass("active");
                $(this).toggleClass("active");
            });
            $('body').on('click', '.enhc-card-offers-advance-filter .component .component-content .btn-show-locations', function () {
                $(".pws-enhancements .enhc-card-offers-advance-filter .offer-locations .facet-search-filter").toggleClass("active");
                $(this).toggleClass("active");
            });
            $('body').on('click', '.enhc-card-offers-advance-filter .facet-single-selection-list .facet-heading', function () {
                $(this).toggleClass("active");
            });

            // show survey feedback form on submit
            var timer = null, feedbackMsg = '';
            // show survey feedback form on submit
            $('body').on('click','input[type="submit"]', function () {
                var that = this;
                feedbackMsg = $(that).parent().parent().parent().parent().parent().parent().siblings('.pws-survey-feedback');
                timer = setInterval(function () {
                    if ($(that).closest('form').find('.field-validation-error').length <= 0) {
                        console.log($(that).closest('form').find('.field-validation-error').length);
                        clearInterval(timer);
                        setTimeout(function () {
                            feedbackMsg.fadeIn("slow");
                        }, 1500);
                    }
                    else{
                        console.log('errors: '+ $(that).closest('form').find('.field-validation-error').length);
                        clearInterval(timer);
                    }
                }, 0);
            });

            $('body').on('click', '.pws-enhc-how-to-apply .component.tabs .tabs-heading li', function () {
                $("html, body").stop().animate({scrollTop: $(this).parents(".tabs-inner").find(".tabs-container").offset().top - 70},900,"swing");
            });

            /*
                        $('body').on('click', '.pws-enhc-sticky-filter-bar .col-xs-2 .component-content .btn-adv-filters', function () {
                            if ($(window).width() < 768) {
                                $(".pws-enhancements .pws-enhc-sticky-filter-bar .col-xs-10").css("display", "none")
                            }
                        });

                        $('body').on('click', '.enhc-card-offers-advance-filter .btn-enhc-cancel', function () {
                            if ($(window).width() < 768) {
                                $(".pws-enhancements .pws-enhc-sticky-filter-bar .col-xs-10").css("display", "block")
                            }
                        });
                        $('body').on('click', '.enhc-card-offers-advance-filter .btn-enhc-apply-filter', function () {
                            if ($(window).width() < 768) {
                                $(".pws-enhancements .pws-enhc-sticky-filter-bar .col-xs-10").css("display", "block")
                            }
                        });
            */
        },
        customeFile: function () {
            if($(".enhc-product-form .joinus-academic-detail").length) {
                var element = $(".enhc-product-form .joinus-academic-detail input[type='file']");
                var element2 = "<span class='browse-btn'>Choose File</span><span class='file-info'>No file chosen</span>";
                $(element2).insertAfter(element);

                const uploadButton = document.querySelector('.enhc-product-form .joinus-academic-detail .browse-btn');
                const fileInfo = document.querySelector('.enhc-product-form .joinus-academic-detail .file-info');
                const realInput = document.querySelector('.enhc-product-form .joinus-academic-detail input[type=\'file\']');

                uploadButton.addEventListener('click', function(e)  {
                    realInput.click();
                });

                realInput.addEventListener('change', function(e)  {
                    const name = realInput.value.split(/\\|\//).pop();
                    const truncated = name.length > 20
                        ? name.substr(name.length - 20)
                        : name;

                    fileInfo.innerHTML = truncated;
                });

            }
        },
        campareCarousel: function () {

            if ($(window).width() > 769) {

                var carouselCampareCard = $(".carousel-campareCard");
                if (carouselCampareCard.length >= 1) {
                    carouselCampareCard.find(".owl-carousel").owlCarousel({
                        loop: false,
                        margin: 38,
                        nav: true,
                        navText: [],
                        //rtl: true,
                        rtl: app.lang == "ar" ? !0 : !1,
                        responsive: {
                            0: {
                                margin: 0,
                                items: 2
                            },
                            769: {
                                items: 3
                            },
                            1025: {
                                items: 4
                            }
                        }

                    });
                }

            } else {

                if ($(".carousel-campareCard .owl-loaded").length) {
                    var owl = $(".carousel-campareCard").find(".owl-carousel");
                    owl.trigger('destroy.owl.carousel');
                    // owl.addClass('off');
                } else {
                    $(".carousel-campareCard").addClass('off');
                }

            }

/*
            var addToCampare = $(".campareDropd-down li a");
            addToCampare.click(function (e) {
                $(this).parent().addClass('active');
                $('.carousel-campareCard').slideDown().fadeTo("slow", 1);

                if ($(this).parent().eq(0).hasClass('active')) {
                    $(".campareDropd-down li").eq(1).removeClass('disable');
                }
                if ($(".campareDropd-down li").eq(1).hasClass('active')) {
                    $(".campareDropd-down li").eq(2).removeClass('disable');
                }


            });
*/

            $('.cardTitleMobile .close-btn').click(function () {
                $('.carousel-campareCard').fadeOut();
            });


            //for cards sticky on mobile
            if ($(window).width() < 769) {
                var mobileStickyHeight = $('.mobileSticky').height();
                var stickyNavTop = $('.mobileSticky').offset().top;
                var stickyNav = function(){
                    var scrollTop = $(window).scrollTop();
                    if (scrollTop >= stickyNavTop) {
                        $('.mobileSticky').addClass('fixed');
                        $('.campareDropd-down').addClass('sticky');
                        mobileStickyHeight = $('.mobileSticky').height();
                        $('.compare-cards').css("padding-top", mobileStickyHeight);
                    } else {
                        $('.mobileSticky').removeClass('fixed');
                        $('.campareDropd-down').removeClass('sticky');
                        $('.compare-cards').css("padding-top", 0);
                    }
                };
                $(window).scroll(function () {

                    if($('.campareDropd-down li').hasClass('cardSelected')){
                        stickyNav();
                    } else {
                        $('.mobileSticky').removeClass('fixed');
                        $('.campareDropd-down').removeClass('sticky');
                        $('.compare-cards').css("padding-top", 0);
                    }
                });
            }


        },
        offerCarousel: function () {
            var offerCarousel = $(".enhc-offer-carousel");
            if (offerCarousel.length >= 1) {

                offerCarousel.find(".featured-offers").addClass('owl-carousel').owlCarousel({
                    loop: false,
                    nav: true,
                    navText: [],
                    //rtl: true,
                    rtl: app.lang == "ar" ? !0 : !1,
                    margin: 0,
                    responsive: {
                        0: {
                            items: 1
                        },
                        769: {
                            items: 3
                        },
                        1025: {
                            items: 3
                        }
                    }

                });
            }
        },
        deepLink: function () {
            $(".deep-link").click(function () {
                window.location = $(this).find("a").attr("href");
                return false;
            });
        },
        equalHeightBoxes: function () {
            $('.equal-height-boxes').each(function () {
                var highestBox = 0;
                $('.component-content > ul > li', this).each(function () {
                    if ($(this).height() > highestBox) {
                        highestBox = $(this).height();
                    }
                });
                $('.component-content > ul > li', this).height(highestBox);
            });
/*
            $('.enhc-picto-indefinite-cols-link-list').each(function () {
                var highestBox = 0;
                $('li', this).each(function () {
                    if ($(this).height() > highestBox) {
                        highestBox = $(this).height();
                    }
                });
                $('li', this).height(highestBox);
            });
*/
        },


        toolTipCustom: function () {
            $('.info-toltip').click(
                function (e) {
                    $(this).addClass('active');
                    var tipData = $(this).data('infotoltip');
                    var infoTooltip = $('<div class="info-toltip-desc active">\n' +
                        '            <p>' +
                        tipData +
                        '           </p>\n' +
                        '            <a class="removeTip" >DISMISS</a>\n' +
                        '            </div>');

                    var limitFind = $(this).next('.info-toltip-desc');
                    if (limitFind.length >= 1) {
                        return false
                    } else {
                        infoTooltip.insertAfter(this).fadeIn('slow');
                    }

                    $('.removeTip').click(
                        function () {
                            $(this).parent('.info-toltip-desc.active').prev().removeClass('active');
                            $(this).parent('.info-toltip-desc.active').remove();

                        }
                    )


                }
            )
        },
        scrollToPos: function (pos) {

            if (pos == $(window).scrollTop())
                return false;

            $('html,body').stop();

            $('html,body').animate({
                scrollTop: pos
            }, 500);
            return false;
        },
        initFindBranchScroll: function () {
            $(".pws-branches-box li").click(function () {
                var $this = $(this);
                $(this).stop().animate({opacity: 1}, 350, function () {
                    app.scrollToPos($this.offset().top);
                    console.log("on");
                });
            });
        },
        initMainNavDT: function () {

            if ($(window).width() > 767) {
                $('.pws-enhancements .main-header .m-m-menu').each(function () {
                    $(this).parents("li").mouseover(function() {
                        var mmOffSetLeft = $(this).find(".mega-menu").offset().left;
                        var mmWidth = $(this).find(".mega-menu").width();
                        if((mmOffSetLeft + mmWidth) > app.WINDOW_WIDTH){
                            $(this).addClass("mm-position-center");
                        } else if ($(this).find(".mega-menu").offset().left < 0){
                            $(this).addClass("mm-position-center")
                        }
/*
                        if($("#wrapper").hasClass("nav-up")){
                            var mmOffSetLeft = $(this).find(".mega-menu").offset().left;
                            var mmWidth = $(this).find(".mega-menu").width();
                            if((mmOffSetLeft + mmWidth) > app.WINDOW_WIDTH){
                                $(this).addClass("mm-position-center");
                            }
                        } else {
                            if($(this).find(".mega-menu").offset().left < 0){
                                $(this).addClass("mm-position-center")
                            }
                        }
*/
                    });
                    $(this).parents("li").mouseout(function() {
                        $(this).removeClass("mm-position-center")
                    });
                });
            }

            if($(window).width() < 768){
                $('body').on('click', '.arb-global-search .pws-show-in-mobile .link .field-link', function () {
                    $(window).scrollTop(0);
                    $(".pws-enhancements .arb-global-search .arb-cta-right .arb-page-category-fliter").addClass("open");
                    $("body").addClass("scroll-fixed");
                });
                $('body').on('click', '.arb-global-search .arb-cta-right .arb-page-category-fliter .bottom-filter-button .filterButton, .arb-global-search .arb-cta-right .arb-page-category-fliter .bottom-remove-filter button', function () {
                    $(".pws-enhancements .arb-global-search .arb-cta-right .arb-page-category-fliter").removeClass("open");
                    $("body").removeClass("scroll-fixed");
                });
            }


        },
        init: function () {

            if ($(".pws-enhancements header .pws-header-nav-container .pws-main-nav-container .main-header .top-nav-container .top-nav-inner li").hasClass("pws-more-link")) {
                $(".pws-header-nav-container").addClass("pws-cus-login-short")
            }

            app.customeFile();
            app.initSubscribePopup();
            app.initScrollToTopFAQAccordion();
            app.initCloseAllSummaryDetailsToggle();
            app.initFindBranchScroll();
            app.initMainNavDT();


            if (app.validMobileDevice) {
                app.$body.addClass("mobile-device");
            }

            if ($(window).width() < 768) {
                $(".pws-form-layout.pws-sme-form fieldset .form-group").each(
                    function () {
                        if ($(this).children().length === 0) {
                            $(this).css("margin-bottom", "0");
                        }
                    }
                );
            }
            $(document).ajaxComplete(function () {
                app.facetCount();
                app.initFilterCheckViewAll();
                var pwsFormElement = $(".pws-form-element");
                if (pwsFormElement.length) {
                    app.initValidateForm();
                }
                var offerCategories = $(".facet-single-selection-list");
                if (offerCategories) {
                    app.initFilterImages();
                }
                app.initFancyBox();
            });

            app.detectDevice();
            app.initSurveyForm();
            app.resizeListener();
            app._windowResize();
            if (!app.isMobile && !app.validMobileDevice) {
                app.initScrollableNav();
            }
            app.initSearchBox();
            app.initHoverMenu();
            app.randomFunc();
            app.mobileMenu();
            app.initMasonryGrid();
            $(document).ready(function () {
                //console.log(app);
                //				console.log(app.
                app.initOfferSlider();
            });
            /*app.initOfferListing();*/
            app.initScrollToElements();
            /*app.initScrollToTopToggle();*/
            app.initValidateForm();
            app.initFancyBox();
            app.initCategoryItem();
            app.initCreditCardMod();
            app.initBackToPreviousPage();
            app.initToggleVideoCaption();
            app.initHistoryBackBtn();
            /*app.initArabicLangText();*/
            app.initBannerBG();
            app.initFindBranch();
            app.initInPageNav();
            /*app.initCharacterLimits();*/
            app.initSearchFunctions();
            app.initRippleEffect();
            app.initSearchBoxListing();
            app.initBootstrapTooltip();
            app.initShowHideRecentSearches();
            app.initScrollToAnimaite();
            app.initFirstItemActive();
            app.initDisbaleRightClick();
            app.initNavArabicLinkTitles();
            //app.initAnimateOnScroll();
            app.initDotDotDot();
            app.initAnchorOnDiv();
            app.thisListCarousel();
            app.overlayCloseAction();
            app.campareCarousel();
            app.deepLink();
            app.equalHeightBoxes();
            app.offerCarousel();
            app.toolTipCustom();
            /*app.initTypeaheadClick();*/
            /* if (!$("body").hasClass("on-page-editor")) {
             app.initEllipsis();
             }*/
            /*app.initLangArabic();*/
            var count = $(".result-count")
                .parents(".tab.active")
                .find("ul.items")
                .find("li.item").length;
            $(".count").text(count);

            $(".tabs-heading").delegate("li", "click", function () {
                var count = $(".result-count")
                    .parents(".tab.active")
                    .find("ul.items")
                    .find("li.item").length;
                $(".count").text(count);
            });
            if ($(window).width() > 767) {
                var countTxt2;
                $(".pws-apply-main-box .link-list ul li .field-link a").each(
                    function () {
                        countTxt2 = $(this).attr("href");
                        if (countTxt2 !== undefined) {
                            countTxt2 = countTxt2.split(":");
                            if (countTxt2[0] == "tel") {
                                $(this).css("pointer-events", "none");
                            }
                        }
                    }
                );
            }
        }
    };
    window.app = app;
})(window, document, jQuery);
jQuery(document).ready(function () {
    app.init();
    AOS.init({
        disable: function () {
            var maxWidth = 1025;
            return window.innerWidth < maxWidth;
        }
    });
    if (jQuery("div.component").hasClass("pws-enhc-tabs")) {
        jQuery('.pws-enhc-tabs').find("li.active").removeClass("active");
        jQuery('.pws-enhc-tabs').find("div.tabs-container").find("div.active").removeClass("active");
    }

    
});

/*jQuery(document).ajaxComplete(function () {
    app.overlayCloseAction();
});*/
