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

            isReady: false,

            readyWait: 1,

            holdReady: function (hold) {
                if(hold){
                    jQuery.readyWait++;
                }else {
                    jQuery.ready(true);
                }

            },
            //文档加载完毕

            ready: function (wait) {

                if((wait === true && !--jQuery.readyWait) || (wait !==true && !jQuery.isReady)){
                    //确保document存在
                    if(!document.body){
                        return setTimeout(jQuery.ready,1);
                    }

                    jQuery.isReady = true;

                    if(wait !== true && --jQuery.readyWait>0){
                        return;
                    }

                    readyList.resolveWith(document,[jQuery]);

                    if(jQuery.fn.trigger){
                        jQuery(document).trigger("ready").unbind("ready");
                    }
                }

            },

            //初始化readyList 的事件队列
            bindReady: function () {
                if(readyList){
                    return;
                }

                readyList = jQuery._Deffered();

                if(document.readyState === "complete"){
                    return setTimeout(jQuery.ready,1);
                }
                //兼容事件
                if(document.addEventListener){
                    document.addEventListener("DOMContentLoaded",DOMContentLoaded,false);

                    window.addEventListener("load",jQuery.ready,false);
                }else if(document.attachEvent){
                    document.attachEvent("onreadystatechange",DOMContentLoaded);
                    window.attachEvent("onload",jQuery.ready);
                    var toplevel = false;

                    try{
                        toplevel = window.frameElement == null
                    }catch (e){

                    }
                    if(document.documentElement.doScroll && toplevel){
                        doScrollCheck();
                    }
                }
            },

            isFunction: function (obj) {

                return jQuery.type(obj) === "function";

            },

            //是否师叔祖
            isArray: Array.isArray || function (obj) {
                return jQuery.type(obj) === "array";

            },

            isWindow: function (obj) {
                return obj && typeof obj === "object" && "setInterval" in obj;

            },

            isNaN: function(obj){
                return obj == null || !rdigit.test(obj) || isNaN(obj);
        },
            type: function (obj) {
                return obj==null?String(obj):class2type[toString.call(obj)] || "object";

            },
            isPlainObject: function (obj) {
                if(!obj || jQuery.type(obj)!=="object" || obj.nodeType||jQuery.isWindow(obj)){
                    return false;
                }
                if(obj.constructor && !hasOwn.call(obj,"constructor")&&!hasOwn.call(obj.constructor.prototype,"isPrototypeOf")){
                    return false;
                }

                var key;
                for(key in obj){}

                return key === undefined || hasOwn.call(obj,key);

            },
            //判断是否为空对象
            isEmptyObject: function (obj) {
                for(var name in obj){
                    return false;
                }
                return true;

            },
            error: function (msg) {
                throw  msg;

            },
            //解析json
            parseJSON: function(data){
                if(typeof  data !== "string" || !data){
                    return null;
                }
                data = jQuery.trim(data);

                if(window.JSON && window.JSON.parse){
                    return window.JSON.parse(data);
                }
                //检查一下字符串的合法性
                if(rvalidchars.test(data.replace(rvalidchars,"@").replace(rvalidchars,"]")
                        .replace(rvalidchars,""))){
                    return (new  Function("return"+data))();
                }
                jQuery.error("无效的json 格式："+data);
            },
           //跨浏览器解析xml
            parseXML: function (data,xml,tmp) {

                //非ie
                if(window.DOMParser){
                    tmp = new DOMParser();
                    xml = tmp.parseFromString(data,"text/xml");
                }else {
                    xml = new ActiveXObject("Microsoft.XMLDOM");//微软定义的
                    xml.async = "false";
                    xml.loadXML(data);
                }
                tmp = xml.documentElement;
                if(!tmp || !tmp.nodeName || tmp.nodeName==="parsererror"){
                    jQuery.error("无效的xml:"+data);
                }
                return xml;

            },
            //无操作函数
           noop: function () {

           },

            globalEval: function (data) {
                //data 非空
                if(data && rnotwhite.test(data)){
                    (window.execScript||function (data) {
                        window["eval"].call(window,data);

                    })(data);
                }

            },
            //判断节点名称是否相同
            nodeName: function (elem,name) {
                return elem.nodeName && elem.nodeName.toUpperCase()===name.toUpperCase();

            },
            //遍历数组对象
            each: function (object,callback,args) {
                var name,i = 0;
                var length = object.length;
                var isObj = length === undefined || jQuery.isFunction(object);
                //如果参数有args,调用apply,
                if(args){
                    if(isObj){
                        for(name in object){
                            if(callback.apply(object[name],args)===false){
                                break;
                            }
                        }
                    }else {
                        for(;i<length;){
                            if(callback.apply(object[i++],args)===false){
                                break;
                            }
                        }
                    }
                }else {
                    if(isObj){
                        for(name in object){
                            if(callback.call(object[name],name,object[name])===false){
                                break;
                            }
                        }
                    }else {
                        for(;i<length;){
                            if(callback.call(object[i],i,object[i++])===false){
                                break;
                            }
                        }
                    }
                }
                return object;

            },

            trim:trim?function (text) {
                return text==null?"":trim.call(text);

                }: function (text) {
                    return text==null?"":text.toString().replace(trimLeft,"").replace(trimRight,"");

                },

            //将假的数组妆花为数组
            makeArray: function (array,results) {
                    var ret = results||[];
                    if(array!=null){
                        var type= jQuery.type(array);
                        if(array.length== null || type==="string"
                        || type==="function"||type==="regexp"
                        ||jQuery.isWindow(array)){
                            push.call(ret,array);
                        }else {
                            jQuery.merge(ret,array);
                        }
                    }
                    return ret;

            },

           //判断是否在数组中‘
            inArray: function (elem,array) {
                //是否函数本地化的Array.prototype.indexOf
                if(indexOf){
                    return indexOf.call(array,elem);
                }
                for(var i=0,length=array.length;i<length;i++){
                    if(array[i]===elem){
                        return i;
                    }
                }
                return -1;
            },

            //将数组second合并到first中
            merge:function (first,second) {
                    var i = first.length;
                    var j=0;
                    

            }





        });
        return jQuery;
    })();

    window.jQuery = window.$ = jQuery;
})(window);