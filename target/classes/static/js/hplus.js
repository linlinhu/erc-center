/***
 * layer模板引擎
 */
var laytpl = null,
	laypage = null;

layui.use(['laytpl', 'laypage'], function(){
	laytpl = layui.laytpl;
	laypage = layui.laypage;
});

//公共配置
layer.config({
    extend: ['extend/layer.ext.js', 'skin/moon/style.css'],
    skin: 'layer-ext-moon'
});

$(document).ready(function () {    
    
    // MetsiMenu
    $('#side-menu').metisMenu();

    $(".right-sidebar-toggle").click(function(){$("#right-sidebar").toggleClass("sidebar-open")})
    //固定菜单栏
    $(function () {
        $('.sidebar-collapse').slimScroll({
            height: '100%',
            railOpacity: 0.9,
            alwaysVisible: false
        });
        
    });   
    

    // 菜单切换
    $('.navbar-minimalize').click(function () {
        $("body").toggleClass("mini-navbar");
        SmoothlyMenu();
    });


    // 侧边栏高度
    function fix_height() {
        var heightWithoutNavbar = $("body > #wrapper").height() - 61;
        $(".sidebard-panel").css("min-height", heightWithoutNavbar + "px");
    }
    fix_height();

    $(window).bind("load resize click scroll", function () {
        if (!$("body").hasClass('body-small')) {
            fix_height();
        }
    });

    //侧边栏滚动
    $(window).scroll(function () {
        if ($(window).scrollTop() > 0 && !$('body').hasClass('fixed-nav')) {
            $('#right-sidebar').addClass('sidebar-top');
        } else {
            $('#right-sidebar').removeClass('sidebar-top');
        }
    });

    $('.full-height-scroll').slimScroll({
        height: '100%'
    });

    $('#side-menu>li').click(function () {
        if ($('body').hasClass('mini-navbar')) {
            NavToggle();
        }
    });
    $('#side-menu>li li a').click(function(){
        if ($(window).width() < 769) {
            NavToggle();            
        }
    });
    
    $('.nav-close').click(NavToggle);

});

$(window).bind("load resize", function () {
    if ($(this).width() < 769) {
        $('body').addClass('mini-navbar');
        $('.navbar-static-side').fadeIn();
    }
});

function NavToggle(){
    $('.navbar-minimalize').trigger('click');
}

function SmoothlyMenu() {
    if (!$('body').hasClass('mini-navbar')) {
        $('#side-menu').hide();
        setTimeout(
            function () {
                $('#side-menu').fadeIn(500);
            }, 100);
    } else if ($('body').hasClass('fixed-sidebar')) {
        $('#side-menu').hide();
        setTimeout(
            function () {
                $('#side-menu').fadeIn(500);
            }, 300);
    } else {
        $('#side-menu').removeAttr('style');
    }
}


//主题设置    
$(function () {
    
    /*$.get("skin-config.html", function (data) {
        $('body').append(data);
    });*/
    
    if (localStorageSupport) {

        var collapse = localStorage.getItem("collapse_menu");
        var fixednavbar = localStorage.getItem("fixednavbar");
        var boxedlayout = localStorage.getItem("boxedlayout");

        var body = $('body');

        if (collapse == 'on') {
            if (!body.hasClass('body-small')) {
                body.addClass('mini-navbar');
            }
        }

        if (fixednavbar == 'on') {
            $(".navbar-static-top").removeClass('navbar-static-top').addClass('navbar-fixed-top');
            body.addClass('fixed-nav');
        }

        if (boxedlayout == 'on') {
            body.addClass('boxed-layout');
        }
    }
});

//判断浏览器是否支持html5本地存储
function localStorageSupport() {
    return (('localStorage' in window) && window['localStorage'] !== null)
}
$.fn.serializeObject = function()
{
	var o = {};
	var a = this.serializeArray();
	$.each(a, function() {
		if (o[this.name] !== undefined) {
			if (!o[this.name].push) {
				o[this.name] = [o[this.name]];
			}
			o[this.name].push(this.value || '');
		} else {
			o[this.name] = this.value || '';
		}
	});
	return o;
};


Date.prototype.Format = function (fmt) { //author: meizz 
    var o = {
        "M+": this.getMonth() + 1, //月份 
        "d+": this.getDate(), //日 
        "h+": this.getHours(), //小时 
        "m+": this.getMinutes(), //分 
        "s+": this.getSeconds(), //秒 
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度 
        "S": this.getMilliseconds() //毫秒 
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
    if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}

/***
 * 计算毫秒数
 * 返回*月*天*时*分*秒
 */
function calMillis(millis) {
	var	miao = Math.ceil(parseInt(millis)/1000),
		fen = miao > 60 ? Math.floor(miao / 60) : 0,
		shi = fen > 60 ? Math.floor(fen / 60) : 0,
		tian = shi > 24 ? Math.floor(shi / 24) : 0,
		yue = tian > 30 ? Math.floor(tian / 30) : 0;

	miao = fen > 0 ? miao - (fen * 60) : miao;
	fen = shi > 0 ? fen - (shi * 60) :fen;
	shi = tian > 0 ? shi - (tian * 24) : shi;
	tian = yue > 0 ? tian - (yue * 30) : tian;
	
	yue = yue > 0 ? (yue + ' 月 ') : '';
	tian = tian > 0 ? (tian + ' 天 ') : '';
	shi = shi > 0 ? (shi + ' 小时 ') : '';
	fen = fen > 0 ? (fen + ' 分 ') : '';
	miao = miao > 0 ? (miao + ' 秒 ') : '';
	
	if (yue.length > 0) {
		return yue + tian;
	}else if(tian.length > 0){
		return tian + shi;
	}else if(shi.length > 0){
		return shi + fen;
	}else if(fen.length > 0){
		return fen + miao;
	}
}


/***
 * 选择微信公众号
 * @param moduleName 模块名称
 * @param fn 执行的方法
 */
function selectcompanyCode(moduleName,fn){
	var value = $('#'+ moduleName +'SelectForm select').val();
	
	if(value!=''){
		$('#'+moduleName+'Content').removeClass('hide')
		$('#'+moduleName+'Add').removeClass('hide')
		fn;
	} else {
		$('#'+moduleName+'Content').addClass('hide')
		$('#'+moduleName+'Add').addClass('hide')
	}
}

/***
 * js模板渲染
 * @param url 获取数据的地址
 * @param moduleName 模块名称
 * @param fn 执行的方法
 */
function ajaxTpl(url, moduleName,fn){
	CommonUtil.ajaxRequest({
		url: url, 
		type:'get'
	}, function(res) {
		if(res.success){
			var temp = moduleName + 'DetailData',
				getTpl = temp.innerHTML,
			 	view = document.getElementById(moduleName + 'Detail-view');
			if(res.data.length>0){
				laytpl(getTpl).render(res, function(html){
					view.innerHTML = html;
				}); 
			} else {
				view.innerHTML = '<p>暂无</p>'
			}
			
		} else {
			layer.msg(res.message ? res.message : '数据获取失败！', {icon: 5});
		}
	})
}
/***
 * 选择回复类别
 * @param moduleName 模块名称
 */
function chooseReplyType(moduleName){
	var data = $('#'+ moduleName +'Form').serializeObject();
	if(data.replyType =='news'){
		$('#'+ moduleName +'Form .textContainer').addClass('hide');
		$('#'+ moduleName +'Form .newsContainer').removeClass('hide');
	}else{
		$('#'+ moduleName +'Form .textContainer').removeClass('hide');
		$('#'+ moduleName +'Form .newsContainer').addClass('hide');
	}
}

function toTxt(str) {  
	str = str.replace(/\<|\>/g, function(MatchStr) {  
		switch (MatchStr) {  
			case "<":  
				return "&lt;";  
				break;  
			case ">":  
				return "&gt;";  
				break; 
			default:  
				return MatchStr;
				break;  
		}  
	})  
	return str;  
}
//阻止‘string’的输入
function prevent(string1,string2){
	var e = event || window.event;
    if(e.key == string1){  
    	e.returnValue=false;//string输入
        return false;    
    }
    if(e.key == string2){  
    	e.returnValue=false;//string输入
        return false;    
    }
}