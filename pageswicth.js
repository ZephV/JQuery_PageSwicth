(function($){
	var privateFun = function (){
		//私有方法
	}
	var PageSwich = (function(){
		function PageSwitch(element,options){
			this.setting = $.extend(true,$.fn.PageSwich.default,options || {})
			this.element = element;
			this.init();
		}
		PageSwich.prototype = {
			init : function(){

			}
		}
		return PageSwich;
	});
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
    $.fn.PageSwich.default = {
        selectors : {
            sections : "",
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
