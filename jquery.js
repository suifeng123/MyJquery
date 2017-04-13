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
                    //如果second的属性是数组，就将其当做数组来处理
                if(typeof second.length ==="number"){
                    for(var l = length;j<l;j++){
                        first[i++] = second[j];
                    }
                }else {
                    //遍历second,将非undefineded的值添加到firtst
                    while(second[j]!==undefined){
                        first[i++] = second[j++];
                    }
                }
                 first.length = i;
                return first;
            },

          grep: function (elems,callback,inv) {
                    var ret = [],reVal;
                    inv = !!inv;

                    //遍历数组
              for(var i=0,length = elems.length;i<length;i++){
                  //这里callback的数组列表为：value,index,与each的习惯一
                  retVal = !!callback(elems[i],i);
                  //书否反向选择
                  if(inv !== reVal){
                      ret.push(elems[i]);
                  }
              }
               return ret;
          },

            //将数组或对象
            map: function (elems,callback,arg) {
                    var value,key,ret =[],
                        i = 0,
                        length = elems.length,
                        // jquery objects are treated as arrays
                        // 检测elems是否是（伪）数组
                        // 1. 将jQuery对象也当成数组处理
                        // 2. 检测length属性是否存在，length等于0，或第一个和最后一个元素是否存在，或jQuery.isArray返回true
                        isArray = elems instanceof jQuery
                            || length !== undefined && typeof length === "number"
                            && ( ( length > 0 && elems[ 0 ] && elems[ length -1 ] ) || length === 0 || jQuery.isArray( elems ) ) ;

                // 是数组或对象的差别，仅仅是遍历的方式不同，没有其他的区别

                // Go through the array, translating each of the items to their
                // 遍历数组，对每一个元素调用callback，将返回值不为null的值，存入ret
                if ( isArray ) {
                    for ( ; i < length; i++ ) {
                        // 执行callback，参数依次为value, index, arg
                        value = callback( elems[ i ], i, arg );
                        // 如果返回null，则忽略（无返回值的function会返回undefined）
                        if ( value != null ) {
                            ret[ ret.length ] = value;
                        }
                    }

                    // Go through every key on the object,
                    // 遍历对象，对每一个属性调用callback，将返回值不为null的值，存入ret
                } else {
                    for ( key in elems ) {
                        // 执行callback，参数依次为value, key, arg
                        value = callback( elems[ key ], key, arg );
                        // 同上
                        if ( value != null ) {
                            ret[ ret.length ] = value;
                        }
                    }
                }

                // Flatten any nested arrays
                // 使嵌套数组变平
                // concat：
                // 如果某一项为数组，那么添加其内容到末尾。
                // 如果该项目不是数组，就将其作为单个的数组元素添加到数组的末尾。
                return ret.concat.apply( [], ret );
            },
            guid: 1,

            proxy: function (fn,context) {
                    if(typeof  context === "string"){
                        var tmp = fn[context];
                        context = fn;
                        fn =tmp;
                    }
                    if(!jQuery.isFunction(fn)){
                        return undefined;
                    }

                    var args = slice.call(arguments,2),
                        proxy = function () {
                            //设置上下文为context和参数
                            return fn.apply(context,args.concat(slice.call(arguments)));
                        }
                   proxy.guid = fn.guid||proxy.guid||jQuery.guid++;
                    return proxy;
            },

            access: function (elems,key,value,exec,fn,pass) {
                    var length = elems.length;

                    if(typeof key ==="object"){
                        for(var k in key){
                            jQuery.access(elems,k,key[k],exec,fn,value);
                        }
                        return elems;
                    }

                    if(value !== undefined ){
                        exec = !pass && exec && jQuery.isFunction(value);
                        for(var i=0;i<length;i++){
                            fn(elems[i],key ,exec ?value.call (elems[i],i,fn(elems[i],key)):value,pass);
                        }
                        return elems;
                    }

                    return length?fn(elems[0],key):undefined;

            },
            //获取当前时间的函数
            now: function () {
                return (new  Date()).getTime();
            },

            uaMatch: function( ua ) {
                ua = ua.toLowerCase();
                // 依次匹配各浏览器
                var match = rwebkit.exec( ua ) ||
                    ropera.exec( ua ) ||
                    rmsie.exec( ua ) ||
                    ua.indexOf("compatible") < 0 && rmozilla.exec( ua ) ||
                    [];
                // match[1] || ""
                // match[1]为false（空字符串、null、undefined、0等）时，默认为""
                // match[2] || "0"
                // match[2]为false（空字符串、null、undefined、0等）时，默认为"0"
                return { browser: match[1] || "", version: match[2] || "0" };
            },
            // 创建一个新的jQuery副本，副本的属性和方法可以被改变，但是不会影响原始的jQuery对象
            // 有两种用法：
            // 1. 覆盖jQuery的方法，而不破坏原始的方法
            // 2.封装，避免命名空间冲突，可以用来开发jQuery插件
            // 值得注意的是，jQuery.sub()函数并不提供真正的隔离，所有的属性、方法依然指向原始的jQuery
            // 如果使用这个方法来开发插件，建议优先考虑jQuery UI widget工程
            sub: function() {
                function jQuerySub( selector, context ) {
                    return new jQuerySub.fn.init( selector, context );
                }
                jQuery.extend( true, jQuerySub, this ); // 深度拷贝，将jQuery的所有属性和方法拷贝到jQuerySub
                jQuerySub.superclass = this;
                jQuerySub.fn = jQuerySub.prototype = this(); //
                jQuerySub.fn.constructor = jQuerySub;
                jQuerySub.sub = this.sub;
                jQuerySub.fn.init = function init( selector, context ) {
                    if ( context && context instanceof jQuery && !(context instanceof jQuerySub) ) {
                        context = jQuerySub( context );
                    }

                    return jQuery.fn.init.call( this, selector, context, rootjQuerySub );
                };
                jQuerySub.fn.init.prototype = jQuerySub.fn;
                var rootjQuerySub = jQuerySub(document);
                return jQuerySub;
            },
            // 浏览器类型和版本：
            // $.browser.msie/mozilla/webkit/opera
            // $.browser.version
            // 不推荐嗅探浏览器类型jQuery.browser，而是检查浏览器的功能特性jQuery.support
            // 未来jQuery.browser可能会移到一个插件中
            browser: {}









        });
        return jQuery;
    })();

    window.jQuery = window.$ = jQuery;
})(window);