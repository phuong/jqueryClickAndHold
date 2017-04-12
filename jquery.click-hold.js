/*
 * jQuery click-and-hold plugin 1.0.0
 * https://github.com/phuong/jqueryClickAndHold
 *
 * Licensed under the MIT license:
 * http://www.opensource.org/licenses/MIT
 */

;(function ($, window, document, undefined) {

    var pluginName = "clickAndHold",
        defaults = {
            timeout: 200,
            onHold: function (element, event) {
                // Fire on hold element
            },
            onRelease: function (element, event) {
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
            self.options.onRelease(this, e);
            clearInterval(self.interval);
            self.options.timeout = self.initialTimeout;
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
        options.onHold(this.element, this.event);
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

