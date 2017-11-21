(function($){
    $.fn.PageSwich = function(){

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
})(jQuery);