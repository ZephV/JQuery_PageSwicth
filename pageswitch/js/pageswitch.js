/*!
 * PageSwitch 1.0
 *
 */

(function($) {
    "use strict";

    /*说明:获取浏览器前缀*/
    /*实现：判断某个元素的css样式中是否存在transition属性*/
    /*参数：dom元素*/
    /*返回值：boolean，有则返回浏览器样式前缀，否则返回false*/
    var _prefix = (function(temp) {
        var aPrefix = ["webkit", "Moz", "o", "ms"],
            props = "";
        for (var i in aPrefix) {
            props = aPrefix[i] + "Transition";
            if (temp.style[props] !== undefined) {
                return "-" + aPrefix[i].toLowerCase() + "-";
            }
        }
        return false;
    })(document.createElement(PageSwitch));

    var PageSwitch = (function() {
        function PageSwitch(element, options) {
            console.log("ni2")
            this.settings = $.extend(true, $.fn.PageSwitch.defaults, options || {});
            this.element = element;
            this.init();
        }


        return PageSwitch;
    })();

    $.fn.PageSwitch = function(options) {
        return this.each(function() {
            var me = $(this),
                instance = me.data("PageSwitch");

            if (!instance) {
                me.data("PageSwitch", (instance = new PageSwitch(me, options)));
            }

            if ($.type(options) === "string") return instance[options]();
        });
    };

    $.fn.PageSwitch.defaults = {
        selectors: {
            sections: ".sections",
            section: ".section",
            page: ".pages",
            active: ".active",
        },
        index: 0, //页面开始的索引
        easing: "ease", //动画效果
        duration: 500, //动画执行时间
        loop: false, //是否循环切换
        pagination: true, //是否进行分页
        keyboard: true, //是否触发键盘事件
        direction: "vertical", //滑动方向vertical,horizontal
        callback: "" //回调函数
    };

    $(function() {
        $('[data-PageSwitch]').PageSwitch();
    });
})(jQuery);