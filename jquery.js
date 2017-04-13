(function (window,undefined) {
    //mycodes
    var jQuery = (function () {
        //构建jquery对象
        var jQuery = function (selector,context) {
            return new jQuery.fn.init(selector,context,rootjQuery);
        }
        //构建jquery对象原型
        jQuery.fn = jQuery.prototype = {
            constructor: jQuery,
            init: function (selector,context,rootjQuery) {
                
            }
        };
        jQuery.fn.init.prototype = jQuery.fn;

        jQuery.extend = jQuery.fn.extend = function () {
            var options,name,src,copy,copyIsArray,clone,target = arguments[0] || {},
                i = 1,
                length = arguments.length,
                deep = false;
            if (typeof target === "boolean") {
                deep = target;
                target = arguments[1] || {};
                i =2;
            }

            if(typeof target !=='object' && !jQuery.isFunction(target)){
                target = {};
            }

            if(length === i){
                target = this;
                i--;
            }
            for(;i<length;i++){
                if((options = arguments[i])!=null){
                    for(name in options) {
                        src = target[name];
                        copy = options[name];

                        if(target === copy){
                            continue;
                        }

                        if(deep && copy && (jQuery.isPlainObject(copy)||(copyIsArray=
                            jQuery.isArray(copy)))){
                            //如果是copy 数据
                            if(copyIsArray){
                                copyIsArray = false;
                                //clone 为src的修正值
                                clone = src && jQuery.isArray(src)?src:[];
                            }else {
                                 clone = src && jQuery.isPlainObject(src)?src:{};
                            }
                            target[name] = jQuery.extend(deep,clone,copy);
                        }else  if(copy !== undefined){
                            target[name] = copy;
                        }
                    }
                }
            }
            return target;

        };
        jQuery.extend({

            noConflict: function (deep) {
                //交出$的使用权
                if(window.$ === jQuery){
                    window.$ = _$;
                }
                if(deep && window.jQuery === jQuery){
                    window.jQuery = _jQuery;
                }
              return jQuery;
            },

            isReaady: false,

        });
        return jQuery;
    })();

    window.jQuery = window.$ = jQuery;
})(window);