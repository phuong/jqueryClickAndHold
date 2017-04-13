/*
 * jQuery click-and-hold plugin 1.0.1
 * https://github.com/phuong/jqueryClickAndHold
 *
 * Licensed under the MIT license:
 * http://www.opensource.org/licenses/MIT
 */

;(function ($, window, document, undefined) {

    var pluginName = "clickAndHold",
        defaults = {
            timeout: 200,
            onHold: function (event, times) {
                // Fire on hold element
            },
            onRelease: function (event) {
                // Fire once element is released
            }
        };

    function Plugin(element, options) {
        if ($.isFunction(options)) {
            options = {
                onHold: options
            }
        }
        this.$element = $(element);
        this.mouseStillDown = false;
        this.options = $.extend({}, defaults, options);
        this.interval = null;
        this.indicator = 0;
        this.init();
    }

    var p = Plugin.prototype;

    p.init = function () {
        var self = this;
        this.$element.mousedown(function (e) {
            // Cache state and call onHold
            self.mouseStillDown = true;
            self.element = this;
            self.event = e;
            self.initialTimeout = self.options.timeout;
            self.callAndCheck();
        }).mouseup(function (e) {
            // Restore state
            self.mouseStillDown = false;
            self.options.onRelease.call(this, e);
            clearInterval(self.interval);
            self.options.timeout = self.initialTimeout;
            self.indicator = 0;
        });
    };

    /**
     * Call action and check mouse status
     * @param element
     * @param event
     */
    p.callAndCheck = function (element, event) {
        var self = this;
        var options = self.options;
        if (!self.mouseStillDown) {
            return;
        }
        self.indicator++;
        options.onHold.call(self.element, self.event, self.indicator);
        if (self.mouseStillDown) {
            // Call onHold faster and faster
            if (options.timeout > 10) {
                options.timeout -= 10;
            }
            clearInterval(self.interval);
            self.interval = setInterval(function () {
                self.callAndCheck();
            }, options.timeout);
        }
    };

    $.fn[pluginName] = function (options) {
        return this.each(function () {
            if (!$.data(this, "plugin_" + pluginName)) {
                $.data(this, "plugin_" + pluginName, new Plugin(this, options));
            }
        });
    };

})(jQuery, window, document);
