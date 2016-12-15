/**
 * IMECHEN is Image Changer.
 * Copyright (c) 2016 troussier
 * GPL licenses
 * http://www.gnu.org/licenses/gpl.html
 * @author: troussier (https://github.com/troussier/imechen)
 * @version: 0.1
 */
;(function($){
    'use strict';
    
    $.fn.imechen = function(options) {
        var settings = $.extend({
            type: 'transparent',
            duration: 200,
            opacity: '.6',
            suffix: '_on',
            mode: 'direct',
            groupParent: '[data-ic-group]'
        }, options);
        
        return this.each(function() {
            var $ic = $(this);
            var mode = $ic.data('ic-mode') || settings.mode;
            var type = $ic.data('ic-type') || settings.type;
            var $trigger;
            var $wrap = $ic.wrap($('<span class="ic-wrap"></span>')).closest($('.ic-wrap'));
            
            switch (type) {
                
                case 'transparent':
                    var originalOpacity;
                    $trigger = (mode === 'indirect') ? $ic.closest(settings.groupParent) : $ic;
                    $trigger.on({
                        'mouseenter': function() {
                            var $target = (mode === 'indirect') ? $(this).find($ic) : $(this);
                            $target.stop(true, true);
                            originalOpacity = $target.css('opacity');
                            var duration = typeof $ic.data('ic-duration') === 'number' ? $ic.data('ic-duration') : settings.duration;
                            var opacity = typeof $ic.data('ic-opacity') === 'number' ? $ic.data('ic-opacity') : settings.opacity;
                            $target.fadeTo(duration, opacity);
                        },
                        'mouseleave': function() {
                            var $target = (mode === 'indirect') ? $(this).find($ic) : $(this);
                            var duration = typeof $ic.data('ic-duration') === 'number' ? $ic.data('ic-duration') : settings.duration;
                            $target.stop(true, false).fadeTo(duration, originalOpacity);
                        }
                    });
                    break;
                    
                case 'toggle':
                    var src = $ic.attr('src');
                    var src_on = src.substr(0, src.lastIndexOf('.')) + settings.suffix + src.substring(src.lastIndexOf('.'));
                    
                    $ic.each(function() {
                        $(this).addClass('ic-off')
                            .css('display', 'block')
                            .clone()
                            .attr('src', src_on)
                            .insertAfter($(this))
                            .removeClass('ic-off')
                            .addClass('ic-on');
                    });
                    
                    var wrapStyle = {
                        'display': 'inline-block',
                        'position': 'relative',
                        'vertical-align': $ic.css('vertical-align')
                    };
                    var onStyle = {
                        'position': 'absolute',
                        'top': 0,
                        'left': 0,
                        'opacity': 0
                    };
                    
                    $ic.closest($wrap).css(wrapStyle)
                        .children('.ic-on').css(onStyle);
                        
                    $trigger = (mode === 'indirect') ? $ic.closest(settings.groupParent) : $ic.closest($wrap);
                    $trigger.on({
                        'mouseenter': function() {
                            var duration = typeof $ic.data('ic-duration') === 'number' ? $ic.data('ic-duration') : settings.duration;
                            $ic.siblings('.ic-on').stop(true, true).fadeTo(duration, 1, function() {
                                $ic.stop(true, true).fadeTo(0, 0);
                            });
                        },
                        'mouseleave': function() {
                            var duration = typeof $ic.data('ic-duration') === 'number' ? $ic.data('ic-duration') : settings.duration;
                            $ic.stop(true, false).fadeTo(0, 1);
                            $ic.siblings('.ic-on').stop(true, false).fadeTo(duration, 0);
                        }
                    });
                    break;
                    
                default:
                    console.log('"' + type + '" is no longer available.');
                    break;
            }
        });
    };
}(jQuery));
