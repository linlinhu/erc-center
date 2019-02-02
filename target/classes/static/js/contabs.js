function loadContentData(p, callback) {
	var _index = p._index ? p._index : 0,
		directive = p.directive ? p.directive : 'index',
		flag = p.flag ? p.flag : 0,
		params = p.params ? p.params : null,
		menuItem, menuName, tabItem, contentItem, iframeIndex,
		jumpUrl = '';

	menuItem = $('.J_menuItem[data-index=' + _index + ']');
	if (menuItem.length == 1) {
		menuItem = $(menuItem[0]);
	} else {
		console.log('ERR: J_menuItem->data-index=' + _index + ' is not exist or has multiple instances');
		return false;
	}
    menuName = $.trim(menuItem.text());
    var avtiveMenuLi = menuItem.parent(),
    	siblingsMenuLi = avtiveMenuLi.siblings('li');
    if (siblingsMenuLi.length > 0) {
        siblingsMenuLi.each(function() {
        	var secondNav = $($(this).children('ul.nav-second-level')[0]),
        		secondNavMenuLi = secondNav.children('li');
        	secondNav.css('height', '0').attr('aria-expanded', 'false').removeClass('in');
        	secondNavMenuLi.removeClass('active');
        });	
    }
    siblingsMenuLi.removeClass('active');
    avtiveMenuLi.addClass('active');
    jumpUrl = menuItem.attr('href');
    if (!jumpUrl || jumpUrl.length == 0) {
		console.log('ERR: J_menuItem->data-index=' + _index + ' lost attribute[href]');
		return false;
    }
	iframeIndex = jumpUrl.split('/')[0] + '/';
	jumpUrl = iframeIndex + directive;

    $('.content-tabs button.J_tabLeft').show();
    $('.content-tabs button.J_tabRight').show();
    tabItem = $('.J_menuTab[data-index=' + _index + ']');
    
    if (tabItem.length > 0) {
	    if (tabItem.length == 1) {
			tabItem = $(tabItem[0]);
		}

		if (tabItem.length > 1) {
			console.log('ERR: J_menuTab->data-index=' + _index + ' should not has multiple instances');
			return false;
		}
	} else {
		$('.J_menuTabs .page-tabs-content').append('<a href="javascript:;" class="J_menuTab" data-index="' + _index + '" data-id="' + jumpUrl + '" iframe-index="' + iframeIndex + '">' + menuName + ' <i class="fa fa-times-circle"></i></a>');
		tabItem = $('.J_menuTab[data-index=' + _index + ']');
		
	}
    //console.info($('.J_menuTabs .page-tabs-content').width());
    if (directive == 'index') {
    	if (params == null) {
    		if (!tabItem.attr('index-params')) {
    			params = {};
    			params.limit = 10;
    			tabItem.attr('index-params', JSON.stringify(params));
    		}
        	params = JSON.parse(tabItem.attr('index-params'));
    	} else {
    		tabItem.attr('index-params', JSON.stringify(params));
    	}
    }

	if (!tabItem.hasClass('active')) { // 激活tab
        tabItem.addClass('active').siblings('.J_menuTab').removeClass('active');
    }

    

    contentItem = $(".J_iframe[name='iframe"+_index+"']");
    if (contentItem.length > 0) {
	    if (contentItem.length == 1) {
			contentItem = $(contentItem[0]);
		}

		if (contentItem.length > 1) {
			console.log('ERR: J_menuTab->data-index=' + _index + ' should not has multiple instances');
			return false;
		}
    } else {
    	$('.J_mainContent').append('<div class="J_iframe" name="iframe' + _index + '" width="100%" height="100%"  data-id="' + jumpUrl + '" seamless></div>');
    	contentItem = $(".J_iframe[name='iframe"+_index+"']");
    }

    contentItem.show().siblings('.J_iframe').hide();

    //浏览器控制前进后退，不作hash记录
    if (flag != 3) {
    	window.history.pushState(p, null, location.href.split("#")[0] + "#" + jumpUrl);
    }
    CommonUtil.ajaxRequest({
    	url: base + jumpUrl,
    	data: params
    }, function(res) {
    	layer.close(loading);
		if (res.indexOf('loginPageWelcomeU') > 0) {
			layer.msg('登录超时，将跳转至登录界面');
			setTimeout(function(){
    			location.href = "login";
			},3000)
		} else if (res.indexOf('{') == 0) {
			if (contentItem.html().length == 0) {
			}
    		var data = JSON.parse(res);
    		layer.msg('加载页面失败' + (data.message ? "错误提示：" + data.message : ""), {icon: 5});
		} else {
			contentItem.html(res);
		}
		if (typeof callback == 'function') {
			callback(res);
		}
    	scrollToTab(tabItem);
    	$('#content-main').slimScroll({
    		height: $(window).height() - 136,
    		color: '#eee',
    		size: '5px'
    	});
    })
}
/***
 * 监听浏览器前进后退
 */
window.onpopstate = function(event) {
	var jumUrl = window.location.hash.substring(1),
		p = event.state;
	
	$('.J_menuTab').each(function() {
		var mii = $(this).attr('iframe-index');
		if (jumUrl.indexOf(mii) >= 0) {
			p._index = $(this).attr('data-index');
			p.directive = jumUrl.substring(mii.length);
			return false;
		}
	})
	
	p.flag = 3;

	layer.closeAll();
	loadContentData(p);
};

//计算元素集合的总宽度
function calSumWidth(elements) {
    var width = 0;
    $(elements).each(function () {
        width += $(this).outerWidth(true);
    });
    return width;
}
//滚动到指定选项卡
function scrollToTab(element) {
	var btnLeftOffset = $('.content-tabs button.J_tabLeft').offset(),
		btnRgtOffset = $('.content-tabs button.J_tabRight').offset(),
		curElem = $(element),
		curElemWidth = curElem.outerWidth(true),
		curOffset = curElem.offset(),
		marginLeftVal = Math.abs(parseInt($('.page-tabs-content').css('margin-left')));
	
	if (curOffset.left < btnLeftOffset.left + 30) {
		marginLeftVal = marginLeftVal - (btnLeftOffset.left + 30 - curOffset.left);
	}
	
	if (curOffset.left + curElemWidth > btnRgtOffset.left) {
		marginLeftVal = marginLeftVal + (curOffset.left + curElemWidth - btnRgtOffset.left);
	}
	pageOpersSet(curElem);
    $('.page-tabs-content').animate({
        marginLeft: 0 - marginLeftVal + 'px'
    }, "fast");
}

//查看左侧隐藏的选项卡
function scrollTabLeft() {
	var btnLeftOffset = $('.content-tabs button.J_tabLeft').offset(),
		curElem = $('.page-tabs-content>a.active'),
		curElemWidth = curElem.outerWidth(true),
		curOffset = curElem.offset(),
		leftWidth = curOffset.left - (btnLeftOffset.left + 30),
		prevElem = curElem.prev(),
		prevIndex = $(prevElem[0]).attr('data-index'),
	    prevContentItem = $(".J_iframe[name='iframe" + prevIndex + "']"),
		prevElemWidth = prevElem ? prevElem.outerWidth(true) : 0,
		marginLeftVal = Math.abs(parseInt($('.page-tabs-content').css('margin-left')));
	
	if (prevElemWidth > 0) {
		if (leftWidth < prevElemWidth) {
    		marginLeftVal = marginLeftVal - prevElemWidth + leftWidth;
		}
		$(prevElem[0]).addClass('active').siblings('.J_menuTab').removeClass('active');
		prevContentItem.show().siblings('.J_iframe').hide();

		pageOpersSet($(prevElem[0]));
	}
	
    $('.page-tabs-content').animate({
        marginLeft: 0 - marginLeftVal + 'px'
    }, "fast");
}
//查看右侧隐藏的选项卡
function scrollTabRight() {
	var btnRgtOffset = $('.content-tabs button.J_tabRight').offset(),
		curElem = $('.page-tabs-content>a.active'),
		curElemWidth = curElem.outerWidth(true),
		curOffset = curElem.offset(),
		rightWidth = btnRgtOffset.left - curOffset.left - curElemWidth,
		nextElem = curElem.next(),
		nextIndex = $(nextElem[0]).attr('data-index'),
	    nextContentItem = $(".J_iframe[name='iframe" + nextIndex + "']"),
		nextElemWidth = nextElem ? nextElem.outerWidth(true) : 0,
		marginLeftVal = Math.abs(parseInt($('.page-tabs-content').css('margin-left')));
	
	if (nextElemWidth > 0) {
		if (rightWidth < nextElemWidth) {
    		marginLeftVal = nextElemWidth - rightWidth + marginLeftVal;
		}
		$(nextElem[0]).addClass('active').siblings('.J_menuTab').removeClass('active');
		nextContentItem.show().siblings('.J_iframe').hide();

		pageOpersSet($(nextElem[0]));
	}
	
    $('.page-tabs-content').animate({
        marginLeft: 0 - marginLeftVal + 'px'
    }, "fast");
}
function pageOpersSet(activeTab) {
	var tabLeft = $('.content-tabs button.J_tabLeft'),
		tabRgt = $('.content-tabs button.J_tabRight'),
		tabLen = $('.page-tabs-content a.J_menuTab').length;
	
	// 不存在上一个tab，向左滑动按钮失效,否则生效
	if (activeTab.prev().length == 0) {
		tabLeft.css('cursor', 'not-allowed');
		tabLeft.attr('onclick', '');
	} else {
		tabLeft.css('cursor', 'pointer');
		tabLeft.attr('onclick', 'scrollTabLeft()');
	}
	
	// 不存在下一个tab，向右滑动按钮失效,否则生效
	if (activeTab.next().length == 0) {
		tabRgt.css('cursor', 'not-allowed');
		tabRgt.attr('onclick', '');
	} else {
		tabRgt.css('cursor', 'pointer');
		tabRgt.attr('onclick', 'scrollTabRight()');
	}
	//存在选中的tab项，去掉no-page背景图片
    $('#content-main').css('background-image', 'none');
    $('.content-tabs .btn-group').show();
    if (tabLen > 1) {
    	$('.J_tabCloseOther').show();
    	$('.J_tabCloseOther').prev().show();
    } else {
    	$('.J_tabCloseOther').hide();
    	$('.J_tabCloseOther').prev().hide();
    }
}


$(function () {

    //通过遍历给菜单项加上data-index属性
    $(".J_menuItem").each(function (index) {
        if (!$(this).attr('data-index')) {
            $(this).attr('data-index', index);
        }
    });
    function initIndex(){
    	loadContentData({
    		_index: 0
    	})
		return false;
    }
   
    function menuItem() {
    	$('.layui-laydate').remove();
        loadContentData({
        	_index: $(this).data('index'),
        	flag: 1,
        	params: {
        		limit: 10
        	}
        });
		return false;
    }
    
    $('.J_menuItem').on('click', menuItem);


 // 关闭选项卡菜单
    function closeTab() {
        var closeTabId = $(this).parents('.J_menuTab').data('id');
        var currentWidth = $(this).parents('.J_menuTab').width();

        // 当前元素处于活动状态
        if ($(this).parents('.J_menuTab').hasClass('active')) {

            // 当前元素后面有同辈元素，使后面的一个元素处于活动状态
            if ($(this).parents('.J_menuTab').next('.J_menuTab').size()) {

                var activeId = $(this).parents('.J_menuTab').next('.J_menuTab:eq(0)').data('id');
                $(this).parents('.J_menuTab').next('.J_menuTab:eq(0)').addClass('active');

                $('.J_mainContent .J_iframe').each(function () {
                    if ($(this).data('id') == activeId) {
                        $(this).show().siblings('.J_iframe').hide();
                        return false;
                    }
                });

                var marginLeftVal = parseInt($('.page-tabs-content').css('margin-left'));
                if (marginLeftVal < 0) {
                    $('.page-tabs-content').animate({
                        marginLeft: (marginLeftVal + currentWidth) + 'px'
                    }, "fast");
                }

            }

            // 当前元素后面没有同辈元素，使当前元素的上一个元素处于活动状态
            if ($(this).parents('.J_menuTab').prev('.J_menuTab').size()) {
                var activeId = $(this).parents('.J_menuTab').prev('.J_menuTab:last').data('id');
                $(this).parents('.J_menuTab').prev('.J_menuTab:last').addClass('active');
                $('.J_mainContent .J_iframe').each(function () {
                    if ($(this).data('id') == activeId) {
                        $(this).show().siblings('.J_iframe').hide();
                        return false;
                    }
                });

            }
        }
        //  移除当前选项卡
        $(this).parents('.J_menuTab').remove();

        // 移除相应tab对应的内容区
        $('.J_mainContent .J_iframe').each(function () {
            if ($(this).data('id') == closeTabId) {
                $(this).remove();
                return false;
            }
        });
        if ($('.J_menuTab.active').length > 0) {
            scrollToTab($('.J_menuTab.active'));
        } else {
            $('.page-tabs-content').css("margin-left", "0");
            $('#content-main').css('background-image', 'url(img/no-page.png)');
            $('.content-tabs .btn-group').hide();
            $('.content-tabs button.J_tabLeft').hide();
            $('.content-tabs button.J_tabRight').hide();
        }
        return false;
    }

    $('.J_menuTabs').on('click', '.J_menuTab i', closeTab);

    //关闭其他选项卡
    function closeOtherTabs(){
        $('.page-tabs-content').children("[data-id]").not(".active").each(function () {
            $('.J_iframe[data-id="' + $(this).data('id') + '"]').remove();
            $(this).remove();
        });
        $('.page-tabs-content').css("margin-left", "0");
    	$('.J_tabCloseOther').hide();
    	$('.J_tabCloseOther').prev().hide();
    	$('.content-tabs button.J_tabLeft').css('cursor', 'not-allowed').attr('onclick', '');
    	$('.content-tabs button.J_tabRight').css('cursor', 'not-allowed').attr('onclick', '');
    }
    $('.J_tabCloseOther').on('click', closeOtherTabs);

    //滚动到已激活的选项卡
    function showActiveTab(){
        scrollToTab($('.J_menuTab.active'));
    }
    $('.J_tabShowActive').on('click', showActiveTab);


    // 点击选项卡菜单
    function activeTab() {
        if (!$(this).hasClass('active')) {
            var currentId = $(this).data('id');
            // 显示tab对应的内容区
            $('.J_mainContent .J_iframe').each(function () {
                if ($(this).data('id') == currentId) {
                    $(this).show().siblings('.J_iframe').hide();
                    return false;
                }
            });
            $(this).addClass('active').siblings('.J_menuTab').removeClass('active');
            scrollToTab(this);
        }
    }

    $('.J_menuTabs').on('click', '.J_menuTab', activeTab);

    // 关闭全部
    $('.J_tabCloseAll').on('click', function () {
        $('.page-tabs-content').children("[data-id]").each(function () {
            $('.J_iframe[data-id="' + $(this).data('id') + '"]').remove();
            $(this).remove();
        });
        $('.page-tabs-content').css("margin-left", "0");
        $('#content-main').css('background-image', 'url(img/no-page.png)');
        $('.content-tabs .btn-group').hide();
        $('.content-tabs button.J_tabLeft').hide();
        $('.content-tabs button.J_tabRight').hide();
    });
    initIndex()
});


/***
 * 页面操作跳转
 * @param operation
 * @returns {Boolean}
 */
function goPage(directive, params, callback) {
	var date_index = $('.page-tabs-content a.active').attr('data-index');
	if (date_index) {
		layer.closeAll();
	    loadContentData({
	    	_index: date_index,
	    	flag: 2,
	    	directive: directive,
	    	params: params,
	    }, function(res) {
	    	if (typeof callback == 'function') {
	        	callback(res);
	    	}
	    });
	}
}
/***
 * 跨模块跳转
 * @param params 参数 包含moduleName、directive
 * @param callback 回调函数
 */
function goModule(params, callback){
	var _index = $('a[href="'+ params.moduleName +'"]').data('index');
	params.limit = 10
	loadContentData({
    	_index: _index,
    	flag: 2,
    	directive:params.directive?params.directive:'index',
    	params: params
    },function(res) {
    	if (typeof callback == 'function') {
        	callback(res);
    	}
    });
}

//$(window).resize(function() {
//	goPage('index');
//});