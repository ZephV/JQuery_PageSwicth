(function($){
	var privateFun = function(){
		//
	}
	var PageSwitch = (function(){
		function PageSwitch(element,options){
			this.settings = $.extend(true,$.fn.PageSwitch.defaults,options||{});
			this.element = element;
			this.init();
		}
		PageSwitch.prototpye = {
			init : function(){
				me.selectors = me.settings.selectors;
				me.sections = me.selectors.sections;
				me.section = me.selectors.section;

				me.direction = me.settings.direction == "vertical"?true:false;
				me.pagesCount = me.pagesCount();
				me.index = (me.settings.index >=0 && me.settings.index <= me.pagesCount)?me.settings.index:0;

				if (!me.direction) {
					me._initLayout();
				}

				if(!me.settings.pagination){
					me._initPaging();
				}

				me._initEvent();
			},
			pagesCount : function(){
				return this.section.length;
			},
			switchLength : function(){
				return this.direction ? this.element.height():this.element.width();
			},
			prev : function(){
				var me = this ;
				if (me.index > 0) {
					me.index--;
				}
				me._scrollPage();
			},
			next : function(){
				var me = this ;
				if (me.index < me.pagesCount) {
					me.index++;
				}
				me._scrollPage();
			},
			_initLayout : function(){
				var me = this ;
				var width = (me.pagesCount * 100)+"%",cellWidth = (100/me.pagesCount.toFixed(2)+"%");
				me.sections.width(width);
				me.section.width(cellWidth).css("float","left");
			},
			_initPaging : function(){
				var me = this,
					pageClass = me.selectors.page.substring(1),
					activeClass = me.selectors.active.substring(1);
				var pageHtml = "<ul class="+pageClass+">";
				for(var i=0;i<me.pagesCount;i++){
					pageHtml +="<li></li>";
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
			_initEvent : function(){
				var me = this;
				//绑定点击事件
				me.element.on("click",me.selectors.pages +" li",function(){
					me.index = $(this).index;
					me._scrollPage();
				});
				//绑定鼠标滚轮事件
				me.element.on("mousewheel DOMMouseScroll",function(e){
					var delta = e.originalEvent.wheelDelta || -e.originalEvent.detail;
					if (delta > 0) {
						me.prev();
					}else if (delta < 0) {
						me.next();
					}
				});
			}
		}
	})();
	$.fn.PageSwitch = function(){
		return this.each(function(){
			var me = $(this),
			instance = me.data("PageSwitch");
			if (!instance) {
				instance = new PageSwitch(me,options);
				me.data("PageSwitch",instance);
			}
			if ($.type(options) === "string") return instance[options]();
		});
	}
	$.fn.PageSwitch.defaults = {
		selectors : {
			sections : ".sections",
			section : "section",
			page : ".pages",
			active : ".active"
		},
		index : 0,
		easing : "ease",
		duration : 500,
		loop : false,
		pagination : true,
		keyboard : true,
		direction : "vertical",
		callback : ""
	}
})(jQuery)