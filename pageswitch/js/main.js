(function($) {
    let PageSwitch = (function() {
        function PageSwitch(element, options) {
            this.settins = $.extend(true, $.fn.PageSwitch.defaults, options || {});
            this.element = element;
            this.init();
        }
        PageSwitch.prototype = {
            init: function() {

            }
        }
    })();

    // 设置PageSwitch原型的函数式
    $.fn.PageSwitch = function(options) {
        return this.each(function() {
            let me = $(this),
                instance = me.data("PageSwitch");
            if (!instance) {
                instance = new PageSwitch(me, options);
                me.data("PageSwitch", instance);
            }
        });
    }

    // 将默认参数挂在PageSwitch原型的default对象下
    $.fn.PageSwitch.defaults = {
        selections: {
            sections: ".sections",
            section: ".section",
            page: ".pages",
            active: ".active",
        },
        index: 0, //页面的索引值
        easing: "ease", //动画效果
        duration: 500, //页面滑动事件
        loop: false, //页面是否可以循环播放
        pageination: true, //是否分页处理
        keyboard: true, //是否触发键盘事件
        direction: "vertical", //页面是垂直滑动还是水平滑动
        callback: "" //回调函数
    }
})(jQuery);