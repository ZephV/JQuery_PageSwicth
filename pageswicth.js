(function($){
	var privateFun = function (){
		//私有方法
	}
	var PageSwich = (function(){
		function PageSwitch(element,options){
			this.settings = $.extend(true,$.fn.PageSwich.defaults,options || {})
			this.element = element;
			this.init();
		}
		PageSwich.prototype = {
            /*说明: 初始化插件*/
            /*实现: 初始化dom结构,布局,分页及绑定事件*/
			init : function(){
                me.selectors = me.settings.selectors;
                me.sections = me.selectors.sections;
                me.section = me.sections.section;

                me.direction = me.settings.direction == "vertical" ? true:false;
                me.pagesCount = me.pageCount();
                me.index = (
                    me.settings.index >= 0 && me.settings.index < me.pageCount
                    ) ? me.settings.index : 0;

                if (!me.direction) {
                     me._initLayout();
                }

                if (me.settings.pagination) {
                    me._initPaging();
                }

                me._initEvent();
            },
            /*说明: 获取滑动页面数量*/
			pageCount : function(){
                return this.section.length;
            },
            /*说明: 获取滑动的宽度(横屏滑动)或高度(竖屏滑动)*/
			switchLength : function(){
                return this.direction ? this.element.height():this.element.width();
            },
            /*说明: 向前滑动即上一页面*/
			prev : function(){
                var me = this;
                if (me.index > 0) {
                    me.index --;
                }else if(me.settings.loop){
                    me.index = me.pagesCount - 1;
                }
                me._scrollPage(); 
            },
            /*说明: 向后滑动即下一页面*/
			next : function(){
                var me = this;
                if (me.index < me.pagesCount) {
                    me.index ++;
                }else if (me.settings.loop) {
                    me.index = 0;
                }
                me._scrollPage();
            },
            /*说明: 主要针对横屏情况进行页面布局*/
			_initLayout : function(){
                var me = this;
                var width = (me.pageCount * 100)+"%",
                    cellWidth = (100/me.pageCount).toFixed(2)+"%";
                me.sections.width(width);
                me.section.width(cellWidth).css("float","left");
            },
            /*说明: 实现分页的dom结构及css样式*/
			_initPaging : function(){
                var me = this,
                    pagesClass = me.selectors.page.substring(1),
                    activeClass = me.selectors.active.substring(1);
                var pageHtml = "<ul class="+pagesClass+">"
                for (var i = 0; i < me.pageCount; i++) {
                    pageHtml += "<li></li>"
                }
                me.element.append(pageHtml);
                var pages = me.element.find(me.selectors.pages);
                me.pageItem = pages.find("li");
                me.pageItem.eq(me.index).addClass(me.activeClass);

                if (me.direction) {
                    pages.addClass("vertical");
                }else{
                    pages.addClass("horizontal");
                }
            },
            /*说明: 初始化插件事件*/
			_initEvent : function(){
				var me = this;
				me.element.on("click",me.selectors.pages + " li",function(){
					me.index = $(this).index();
					me._scrollPage();
				});

				me.element.on("mousewheel DOMMouseScroll", function(e){
					var delta = e.originalEvent.wheelDelta || -e.originalEvent.detail;

					if (delta > 0 && ((me.index && !me.settings.loop) || me.settings
					.loop )) {
						me.prev();
					}else if (delta < 0 && (me.index < me.pagesCount - 1) && !me
					.settings.loop || me.settings.loop  vv) {
						me.next();
					}
				});

                if (me.settings.keyboard) {
                    $(window).on("keydown",function(e){
                        var keyCode = e.keyCode;
                        if (keyCode == 37 || keyCode ==38) {
                            me.prev();
                        }else if (keyCode == 39 || keyCode == 40) {
                            me.next();
                        }
                    });
                }

                $(window).resize(function(){
                    var currentLength = me.switchLength(), 
                        offset = me.settings.direction ? me.section.eq(me.index).
                            offset().top : me.section.eq(me.index).offset().left;
                    if (Math.abs(offset) > currentLength/2 && me.index < (me.
                            pageCount - 1)) {
                        me.index ++; 
                    }
                    if (me.index) {
                        me._scrollPage();
                    }
                });

                me.sections.on("transitioned webkitTransitionEnd oTransitionEnd otransition",
                    function(){
                        if (me.settings.callback && $.type(me.settings.callback)=="function") {
                            me.settings.callback();
                        }
                    });
			}
		}
		return PageSwich;
	})();
    $.fn.PageSwich = function(){
      return this.each(function(){
        var me = $(this),
            instance = me.data("PageSwich");
        if (!instance) {
          	instance = new PageSwich(me,options);
          	me.data("PageSwich",instance);
        }
        if ($.type(options) === "string") return instance[options]();
      });
    };
    $.fn.PageSwich.defaults = {
        selectors : {
            sections : ".sections",
            section : ".section",
            page : ".page",
            active : ".active"
        },
        index : 0,
        easing : "ease",
        duration : 500,
        loop : false,
        pagination : true,
        keyboard : true,
        direction : "vertival",
        callback : ""
    }
    $(function(){
    	$("[data-PageSwitch").PageSwich();
    })
})(jQuery);
