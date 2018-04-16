(function($) {
    "use strict";

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
            this.settings = $.extend(true, $.fn.PageSwitch.defaults, options || {});
            this.element = element;
            this.init();
        }

        PageSwitch.prototype = {
            init: function() {
                var me = this;
                me.selectors = me.settings.selectors;
                me.sections = me.element.find(me.selectors.sections);
                me.section = me.element.find(me.selectors.section);
                me.direction = (me.settings.direction == "vertical" ? true : false);

                me.canScroll = true;

                me.pagesCount = me.pagesCount();

                me.index = (me.settings.index >= 0 && me.settings.index < me.pagesCount) ? me.settings.index : 0;

                if (!me.direction) {
                    me._initLayout();
                }
                if (me.settings.pageination) {
                    me._initPaging();
                }
                me._initEvent();
            },
            _scrollPage: function() {
                var me = this,
                    dest = me.section.eq(me.index).position();
                if (!dest) return;

                me.canScroll = false;
                if (_prefix) {
                    me.sections.css(_prefix + "transition", "all " + me.settings.duration + "ms " + me.settings.easing);
                    var translate = me.direction ? "translateY(-" + dest.top + "px)" : "translateX(-" + dest.left + "px)";
                    me.sections.css(_prefix + "transform", translate);
                } else {
                    var animateCss = me.direction ? { top: -dest.top } : { left: -dest.left };
                    me.sections.animate(animateCss, me.settings.duration, function() {
                        me.canScroll = true;
                        if (me.settings.callback && $.type(me.settings.callback) == "function") {
                            me.settings.callback()
                        }
                    });
                }

                if (me.settings.pageination) {
                    let pageItem = me.pageItem.eq(me.index)
                    pageItem.addClass(me.activeClass);
                    pageItem.siblings("li").removeClass(me.activeClass);
                }
            },
            prev: function() {
                var me = this;
                if (me.index > 0) {
                    me.index--;
                } else if (me.settings.loop) {
                    me.index = me.pagesCount - 1;
                }
                me._scrollPage();
            },
            next: function() {
                var me = this;
                if (me.index < me.pagesCount) {
                    me.index++;
                } else if (me.settings.loop) {
                    me.index = 0;
                }
                me._scrollPage();
            },
            pagesCount: function() {
                return this.section.length;
            },
            switchLength: function() {
                return this.direction ? this.element.height() : this.element.width();
            },
            _initLayout: function() {
                var me = this;
                var width = (me.pagesCount * 100) + "%",
                    cellWidth = (100 / me.pagesCount).toFixed(2) + "%";
                me.sections.width(width);
                me.section.width(cellWidth).css("float", "left");
            },
            _initPaging: function() {
                var me = this,
                    pagesClass = me.selectors.page.substring(1);
                me.activeClass = me.selectors.active.substring(1);

                var pageHtml = "<ul class=" + pagesClass + ">";
                for (var i = 0; i < me.pagesCount; i++) {
                    pageHtml += "<li></li>";
                }
                pageHtml += "</ul>"
                me.element.append(pageHtml);
                var pages = me.element.find(me.selectors.page);

                me.pageItem = pages.find("li");
                me.pageItem.eq(me.index).addClass(me.activeClass);

                if (me.direction) {
                    pages.addClass("vertical");
                } else {
                    pages.addClass("horizontal");
                }
            },

            _initEvent: function() {
                var me = this;
                me.element.on("click", me.selectors.page + " li", function() {
                    me.index = $(this).index();
                    console.log("nihao")
                    me._scrollPage()
                });

                me.element.on("mousewheel DOMMouseScroll", function(e) {
                    if (me.canScroll) {
                        var delta = e.originalEvent.wheelDelta || e.originalEvent.delta;

                        if (delta > 0 && (me.index && !me.settings.loop || me.settings.loop)) {
                            me.prev();
                        } else if (delta < 0 && (me.index < (me.pagesCount - 1) && !me.settings.loop || me.settings.loop)) {
                            me.next();
                        }
                    }
                });

                if (me.settings.keyboard) {
                    $(window).on("keydown", function(e) {
                        var keyCode = e.keyCode;
                        if (keyCode == 37 || keyCode == 38) {
                            me.prev();
                        }
                        if (keyCode == 39 || keyCode == 40) {
                            me.next();
                        }
                    });
                }

                $(window).resize(function() {
                    var currentLength = me.switchLength(),
                        offset = me.settings.direction ? me.section.eq(me.index).offset().top :
                        me.section.eq(me.index).offset().left;
                    if (Math.abs(offset) > currentLength / 2 && me.index < (me.pagesCount - 1)) {
                        me.index++;
                    }
                    if (me.index) {
                        me._scrollPage();
                    }
                });

                /*支持CSS3动画的浏览器，绑定transitionend事件(即在动画结束后调用起回调函数)*/
                me.sections.on("transitionend webkitTransitionEnd oTransitionEnd otransitionend", function() {
                    me.canScroll = true;
                    if (me.settings.callback && $.type(me.settings.callback) == "function") {
                        me.settings.callback()
                    }
                });
            }
        };
        return PageSwitch;
    })();

    // 设置PageSwitch原型的函数式
    $.fn.PageSwitch = function(options) {
        return this.each(function() {
            var me = $(this),
                instance = me.data("PageSwitch");
            if (!instance) {

                me.data("PageSwitch", instance = new PageSwitch(me, options))
            }
            if ($.type(options) === "string") return instance[options]();
        });
    }



    // 将默认参数挂在PageSwitch原型的default对象下
    $.fn.PageSwitch.defaults = {
        selectors: {
            sections: ".sections",
            section: ".section",
            page: ".pages",
            active: ".active",
        },
        index: 0, //页面的索引值
        easing: "ease", //动画效果
        duration: 1000, //页面滑动事件
        loop: false, //页面是否可以循环播放
        pageination: true, //是否分页处理
        keyboard: true, //是否触发键盘事件
        direction: "vertical", //页面是垂直滑动还是水平滑动
        callback: "" //回调函数
    };

    $(function() {
        $('[data-PageSwitch]').PageSwitch();
    });

})(jQuery);