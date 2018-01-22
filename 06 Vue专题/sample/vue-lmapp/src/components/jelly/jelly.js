/*!

 @Name:弹层组件移动版
 @Author：
 @Site：http://jelly.layui.com/mobie/
 @License：
    
 */

; !function (win) {

  "use strict";

  var doc = document, query = 'querySelectorAll', claname = 'getElementsByClassName', S = function (s) {
    return doc[query](s);
  };

  //默认配置
  var config = {
    type: 0
    , shade: true
    , shadeClose: true
    , fixed: true
    , anim: 'scale' //默认动画类型
    //,anim: 'false' //默认动画类型
  };

  var ready = {
    extend: function (obj) {
      var newobj = JSON.parse(JSON.stringify(config));
      for (var i in obj) {
        newobj[i] = obj[i];
      }
      return newobj;
    },
    timer: {}, end: {}
  };

  //点触事件
  ready.touch = function (elem, fn) {
    elem.addEventListener('click', function (e) {
      fn.call(this, e);
    }, false);
  };

  var index = 0, classs = ['layui-m-layer'], Jelly = function (options) {
    var that = this;
    that.config = ready.extend(options);
    that.view();
  };

  Jelly.prototype.view = function () {
    var that = this, config = that.config, layerbox = doc.createElement('div');

    that.id = layerbox.id = classs[0] + index;
    layerbox.setAttribute('class', classs[0] + ' ' + classs[0] + (config.type || 0));
    layerbox.setAttribute('index', index);

    //标题区域
    var title = (function () {
      var titype = typeof config.title === 'object';
      return config.title
        ? '<h3 class="jelly-title" style="' + (titype ? config.title[1] : '') + '">' + (titype ? config.title[0] : config.title) + '</h3>'
        : '';
    }());

    //按钮区域
    var button = (function () {
      typeof config.btn === 'string' && (config.btn = [config.btn]);
      var btns = (config.btn || []).length, btndom;
      if (btns === 0 || !config.btn) {
        return '';
      }
      btndom = '<span yes type="1">' + config.btn[0] + '</span>'
      if (btns === 2) {
        btndom = '<span no type="0">' + config.btn[1] + '</span>' + btndom;
      }
      return '<div class="layui-m-layerbtn">' + btndom + '</div>';
    }());

    if (!config.fixed) {
      config.top = config.hasOwnProperty('top') ? config.top : 100;
      config.style = config.style || '';
      config.style += ' top:' + (doc.body.scrollTop + config.top) + 'px';
    }
    if (config.type === 2) {
      //config.content = '<i></i><i class="layui-m-layerload"></i><i></i><p>'+ (config.content||'') +'</p>';
      config.content = '<div class="jdui_load"><span class="jdui_load_in"></span></div>';
    }
    if (config.skin) config.anim = 'up';
    if (config.skin === 'msg') config.shade = false;
    if (config.toastType === 'translink') {
      config.shade = true;
      config.shadeClose = false;
    }
    if (config.skin === 'msg') {
      config.content = '<div class="jelly-toast"><div class="icon_' + config.toastType + '"></div><p>' + config.content + '<p></div>'
    }
    layerbox.innerHTML = (config.shade ? '<div ' + (typeof config.shade === 'string' ? 'style="' + config.shade + '"' : '') + ' class="layui-m-layershade"></div>' : '')
      + '<div class="layui-m-layermain" ' + (!config.fixed ? 'style="position:static;"' : '') + '>'
      + '<div class="layui-m-layersection">'
      + '<div class="layui-m-layerchild ' + (config.skin ? 'layui-m-layer-' + config.skin + ' ' : '') + (config.className ? config.className : '') + ' ' + (config.anim ? 'layui-m-anim-' + config.anim : '') + '" ' + (config.style ? 'style="' + config.style + '"' : '') + '>'
      + title
      + '<div class="layui-m-layercont">' + config.content + '</div>'
      + button
      + '</div>'
      + '</div>'
      + '</div>';

    if (!config.type || config.type === 2) {
      var dialogs = doc[claname](classs[0] + config.type), dialen = dialogs.length;
      if (dialen >= 1) {
        jelly.close(dialogs[0].getAttribute('index'))
      }
    }

    document.body.appendChild(layerbox);
    var elem = that.elem = S('#' + that.id)[0];
    config.success && config.success(elem);

    that.index = index++;
    that.action(config, elem);
  };

  Jelly.prototype.action = function (config, elem) {
    var that = this;

    //自动关闭
    if (config.time) {
      ready.timer[that.index] = setTimeout(function () {
        jelly.close(that.index);
      }, config.time * 1000);
    }

    //确认取消
    var btn = function () {
      var type = this.getAttribute('type');
      if (type == 0) {
        config.no && config.no();
        jelly.close(that.index);
      } else {
        config.yes ? config.yes(that.index) : jelly.close(that.index);
      }
    };
    if (config.btn) {
      var btns = elem[claname]('layui-m-layerbtn')[0].children, btnlen = btns.length;
      for (var ii = 0; ii < btnlen; ii++) {
        ready.touch(btns[ii], btn);
      }
    }

    //点遮罩关闭
    if (config.shade && config.shadeClose) {
      var shade = elem[claname]('layui-m-layershade')[0];
      ready.touch(shade, function () {
        jelly.close(that.index, config.end);
      });
    }

    config.end && (ready.end[that.index] = config.end);
  };

  win.jelly = {
    v: '1.0',
    index: index,

    //核心方法
    open: function (options) {
      var o = new Jelly(options || {});
      return o.index;
    },

    close: function (index) {
      var ibox = S('#' + classs[0] + index)[0];
      if (!ibox) return;
      ibox.innerHTML = '';
      doc.body.removeChild(ibox);
      clearTimeout(ready.timer[index]);
      delete ready.timer[index];
      typeof ready.end[index] === 'function' && ready.end[index]();
      delete ready.end[index];
    },

    //关闭所有jelly层
    closeAll: function () {
      var boxs = doc[claname](classs[0]);
      for (var i = 0, len = boxs.length; i < len; i++) {
        jelly.close((boxs[0].getAttribute('index') | 0));
      }
    },


    toast: function (text, type, timeIn) {
      jelly.open({
        content: text,
        toastType: type || 'loading'
        , skin: 'msg'
        , time: timeIn ? timeIn : 2 //2秒后自动关闭
      });
    },

    confirm: function (options) {
      jelly.open({
        title: options.title,
        content: options.content
        , btn: options.btn
        , yes: function (index) {
          if (typeof (options.yes) != "undefined") {
            options.yes();
          }
          jelly.close(index);
        },
        no: function (index) {
          if (typeof (options.no) != "undefined") {
            options.no();
          }
        }
      });
    },
    showLoading: function (text, isShade) {
      /*if(typeof(text)!='undefined'){
        jelly.open({type: 2,shade: isShade?isShade:false});
      }else{
        jelly.open({
          type: 2
          ,content: text
          ,shade: isShade?isShade:false
        });
      }*/
    },
    closeLoading: function () {
      jelly.closeAll();
    },
    //shadeClose 设置不允许点遮罩关闭
    infoAlert: function (text, btn, title, shadeClose) {
      jelly.open({
        title: [title ? title : ''],
        content: text ? text : '具体名词解释以产品提供的文案为准，具体名词解释一产品最多20个字', 
        btn: btn ? btn : '确定',
        shadeClose: shadeClose === false ? false : true
      });
    },
  };


  (function (window, undefined) {
    var
      // Map over jelly in case of overwrite
      _jelly = window.jelly,
      // Map over the $j in case of overwrite
      _$j = window.$j;
    jelly.noConflict = function (deep) {
      if (window.$j === jelly) {
        window.$j = _$j;
      }
      if (deep && window.jelly === jelly) {
        window.jelly = _jelly;
      }
      return jelly;
    }

    window.$j = jelly.noConflict();
  }(window));
  'function' == typeof define ? define(function () {
    return jelly;
  }) : function () {

    var js = document.scripts, script = js[js.length - 1], jsPath = script.src;
    var path = jsPath.substring(0, jsPath.lastIndexOf("/") + 1);

    //如果合并方式，则需要单独引入confirm.css
    if (script.getAttribute('merge')) return;

    document.head.appendChild(function () {
      var link = doc.createElement('link');
      link.href = path + 'jelly.css?1.0';
      link.type = 'text/css';
      link.rel = 'styleSheet'
      link.id = 'confirmmcss';
      return link;
    }());

  }();


}(window);

