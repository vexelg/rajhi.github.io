/*!
 * jQuery.ellipsis
 * http://github.com/jjenzz/jquery.ellipsis
 * --------------------------------------------------------------------------
 * Copyright (c) 2013 J. Smith (@jjenzz)
 * Dual licensed under the MIT and GPL licenses:
 * http://www.opensource.org/licenses/mit-license.php
 * http://www.gnu.org/licenses/gpl.html
 *
 * adds a class to the last 'allowed' line of text so you can apply
 * text-overflow: ellipsis;
 */
(function(factory) {
  'use strict';

  if (typeof define === 'function' && define.amd) {
    // AMD. register as an anonymous module
    define(['jquery'], factory);
  } else {
    // browser globals
    factory(jQuery);
  }
}(function(jQuery) {
  'use strict';

  var namespace = 'ellipsis',
      span = '<span style="white-space: nowrap;">',
      defaults = {
        lines: 'auto',
        ellipClass: 'ellip',
        responsive: false
      };

  /**
   * Ellipsis()
   * --------------------------------------------------------------------------
   * @param {Node} el
   * @param {Object} opts
   */
  function Ellipsis(el, opts) {
    var base = this,
        currLine = 0,
        lines = [],
        setStartEllipAt,
        startEllipAt,
        resizeTimer,
        currOffset,
        lineHeight,
        contHeight,
        words,
        htmlEntities;

    // List of HTML entities for escaping.
    htmlEntities = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#x27;',
      '`': '&#x60;'
    };

    base.jQuerycont = jQuery(el);
    base.opts = jQuery.extend({}, defaults, opts);

    /**
     * create() happens once when
     * instance is created
     */
    function create() {
      base.text = base.jQuerycont.text();
      base.opts.ellipLineClass = base.opts.ellipClass + '-line';

      base.jQueryel = jQuery('<span class="' + base.opts.ellipClass + '" />');
      base.jQueryel.text(base.text);

      base.jQuerycont.empty().append(base.jQueryel);

      init();
    }

    /**
     * init()
     */
    function init() {

      // if they only want one line just add
      // the class and do nothing else
      if (typeof base.opts.lines === 'number' && base.opts.lines < 2) {
        base.jQueryel.addClass(base.opts.ellipLineClass);
        return;
      }

      contHeight = base.jQuerycont.height();

      // if they only want to ellipsis the overflow
      // then do nothing if there is no overflow
      if (base.opts.lines === 'auto' && base.jQueryel.prop('scrollHeight') <= contHeight) {
        return;
      }

      if (!setStartEllipAt) {
        return;
      }

      // create an array of words from our string
      words = jQuery.trim(escapeText(base.text)).split(/\s+/);

      // wrap each word in a span and temporarily append to the DOM
      base.jQueryel.html(span + words.join('</span> ' + span) + '</span>');

      // loop through words to determine which word the
      // ellipsis container should start from (need to
      // re-query spans from DOM so we can get their offset)
      base.jQueryel.find('span').each(setStartEllipAt);

      // startEllipAt could be 0 so make sure we're
      // checking undefined instead of falsey
      if (startEllipAt != null) {
        updateText(startEllipAt);
      }
    }

    /**
     * updateText() updates the text in the DOM
     * with a span around the line that needs
     * to be truncated
     *
     * @param {Number} i
     */
    function updateText(nth) {
      // add a span that wraps from nth
      // word to the end of the string
      words[nth] = '<span class="' + base.opts.ellipLineClass + '">' + words[nth];
      words.push('</span>');

      // update the DOM with
      // our new string/markup
      base.jQueryel.html(words.join(' '));
    }

    function escapeText(text){
      return String(text).replace(/[&<>"'\/]/g, function (s) {
        return htmlEntities[s];
      });
    }

    // only define the method if it's required
    if (base.opts.lines === 'auto') {

      /**
       * setStartEllipByHeight() sets the start
       * position to the first word in the last
       * line of the element that doesn't overflow
       *
       * @param {Number} i
       * @param {Node} word
       */
      var setStartEllipByHeight = function(i, word) {
        var jQueryword = jQuery(word),
            top = jQueryword.position().top;

        lineHeight = lineHeight || jQueryword.height();

        if (top === currOffset) {
          // if it's top matches currOffset
          // then it's on the same line
          // as the previous word
          lines[currLine].push(jQueryword);
        } else {
          // otherwise we're
          // on a new line
          currOffset = top;
          currLine += 1;
          lines[currLine] = [jQueryword];
        }

        // if the bottom of the word is outside
        // the element (overflowing) then
        // stop looping and set startEllipAt to
        // the first word in the previous line
        if (top + lineHeight > contHeight) {
          startEllipAt = i - lines[currLine - 1].length;
          return false;
        }
      };

      setStartEllipAt = setStartEllipByHeight;
    }

    // only define the method if it's required
    if (typeof base.opts.lines === 'number' && base.opts.lines > 1) {

        /**
         * setStartEllipByLine() sets the start
         * position to the first word in the line
         * that was passed to opts. This forces
         * the ellipsis on a specific line
         * regardless of overflow
         *
         * @param {Number} i
         * @param {Node} word
         */
        var setStartEllipByLine = function(i, word) {
          var jQueryword = jQuery(word),
              top = jQueryword.position().top;

          // if top isn't currOfset
          // then we're on a new line
          if (top !== currOffset) {
            currOffset = top;
            currLine += 1;
          }

          // if the word's currLine is equal
          // to the line limit passed via options
          // then start ellip from this
          // word and stop looping
          if (currLine === base.opts.lines) {
            startEllipAt = i;
            return false;
          }
      };

      setStartEllipAt = setStartEllipByLine;
    }

    // only bind to window resize if required
    if (base.opts.responsive) {

      /**
       * resize() resets necessary vars
       * and content and then re-initialises
       * the Ellipsis script
       */
      var resize = function() {
        lines = [];
        currLine = 0;
        currOffset = null;
        startEllipAt = null;
        base.jQueryel.html(escapeText(base.text));

        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(init, 100);
      };

      jQuery(window).on('resize.' + namespace, resize);
    }

    // start 'er up
    create();
  }

  jQuery.fn[namespace] = function(opts) {
    return this.each(function() {
      try {
        jQuery(this).data(namespace, (new Ellipsis(this, opts)));
      } catch (err) {
        if (window.console) {
          console.error(namespace + ': ' + err);
        }
      }
    });
  };

}));
