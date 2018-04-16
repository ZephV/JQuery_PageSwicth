(function($) {
    let PageSwitch = (function() {
        function PageSwitch(element, options) {
            this.settings = $.extend(true, $.fn.PageSwitch.defaults, options || {});
            this.element = element;
            this.init();
        }
        PageSwitch.prototype = {
            init: function() {
                let me = this;
                me.selectors = me.settings.selectors;
                me.sections = $(me.selectors.sections);
                me.section = $(me.selectors.section);

                me.direction = (me.settings.direction == "vertical" ? true : false);

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

            },
            prev: function() {
                let me = this;
                if (me.index > 0) {
                    me.index--;
                } else if (me.setting.loop) {
                    me.index = me.pagesCount - 1;
                }
                me._scrollPage();
            },
            next: function() {
                let me = this;
                if (me.index < 0) {
                    me.index++;
                } else if (me.setting.loop) {
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
                let me = this;
                let width = (me.pagesCount * 100) + "%",
                    cellWidth = (100 / me.pagesCount).toFixed(2) + "%";
                me.sections.width(width);
                me.section.width(cellWidth).css("float", "left");
            },
            _initPaging: function() {
                let me = this,
                    pageClass = me.selectors.page.substring(1),
                    activeClass = me.selectors.active.substring(1);
                let pageHtml = "<ul class=" + pageClass + ">";
                for (let i = 0; i < me.pagesCount; i++) {
                    pageHtml += "<li></li>";
                }
                pageHtml += "</ul>"
                me.element.append(pageHtml);
                let pages = $(me.selectors.pages);
                me.pageItem = pages.find("li");
                me.pageItem.eq(me.index).addClass(me.activeClass);

                if (me.direction) {
                    pages.addClass("vertical");
                } else {
                    pages.addClass("horizontal");
                }
            },

            _initEvent: function() {
                let me = this;
                me.element.on("click", me.selectors.pages + " li", function() {
                    me.index = $(this).index();
                    me._scrollPage()
                });

                me.element.on("mousewheel DOMMouseScroll", function(e) {
                    let delta = e.originalEvent.wheelDelta || e.originalEvent.delta;

                    if (delta > 0 && (me.index && !me.settting.loop || me.settting.loop)) {
                        me.prev();
                    } else if (delta < 0 && (me.index < (me.pagesCount - 1) && !me.settting.loop || me.settting.loop)) {
                        me.next();
                    }
                });

                if (me.setting.keyboard) {
                    $(window).on("keydown", function(e) {
                        let keyCode = e.keyCode;
                        if (keyCode == 37 || keyCode == 38) {
                            me.prev();
                        }
                        if (keyCode == 39 || keyCode == 40) {
                            me.next();
                        }
                    });
                }

                $(window).resize(function() {
                    let currentLength = me.switchLength(),
                        offset = me.settings.direction ? me.section.eq(me.index).offset().top :
                        me.section.eq(me.index).offset().left;
                    if (Math.abs(offset) > currentLength / 2 && me.index < (me.pagesCount - 1)) {
                        me.index++;
                    }
                    if (me.index) {
                        me._scrollPage();
                    }
                });

                me.sections.on("transitionend webkitTransitionEnd oTransitionEnd otransitionend", function() {
                    if (me.setting.callback && $.type(me.settings.callback) == "function") {
                        me.setting.callback()
                    }
                });
            }
        };
        return PageSwitch;
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
        duration: 500, //页面滑动事件
        loop: true, //页面是否可以循环播放
        pageination: true, //是否分页处理
        keyboard: true, //是否触发键盘事件
        direction: "vertical", //页面是垂直滑动还是水平滑动
        callback: "" //回调函数
    }
})(jQuery);