let ddItemsPicker = (function(){
	let pickerId = '#dd-items-picker',
		itemsSelector = pickerId + ' ul.dd-item-labels',
		maxLen = 1,
		pickerItems = [],
		ddItems = [],
		layerWindowId = null,
		loadItems = function(items) {
			let html = '';
			if (items.length > 0) {
				html = items.map(it => '<li data-id="' + it.code + '" data-obj=\'' + JSON.stringify(it) + '\'>' + it.name + '</li>').join('');
			} else {
				html = '该数据字典暂无内容，请前往数据字典中心进行配置。';
			}
			
			$(itemsSelector).html(html);
			for (let i = 0; i < pickerItems.length; i++) {
				$(itemsSelector + ' li[data-id="' + pickerItems[i].code + '"]').addClass('selected');
			}
			
			$(itemsSelector + ' li').unbind('click').bind('click', function() {
				let pickeredIndex = -1,
					cur = JSON.parse($(this).attr('data-obj'));
				
				for (let i = 0; i < pickerItems.length; i++) {
					if (pickerItems[i].code == cur.code) {
						pickeredIndex = i;
					}
				}
				if (pickeredIndex >= 0) {
					pickerItems.splice(pickeredIndex, 1);
				}
				
				if ($(this).hasClass('selected')) {
					$(this).removeClass('selected');
				} else {
					if (maxLen == 1) {
						$(this).siblings().removeClass('selected');
						pickerItems = [cur]
					} else {
						if (pickerItems.length >= maxLen) {
							layer.msg('可选项达上限（最多' + maxLen + '个）', {icon: 5});
							return false;
						} else {
							pickerItems.push(cur)
						}
					}
					$(this).addClass('selected');
				}
				console.dir(pickerItems);
			});
		},
		init = function(p, callback) {
			ddItems = p.items ? p.items : [];
			pickerItems = p.pickeredLst ? p.pickeredLst : [];
			maxLen = p.maxLen ? p.maxLen : 1;
			loadItems(ddItems);
			$(pickerId).removeClass('hide');
			$(pickerId + ' input[name="keyword"]').val('');
			layerWindowId = layer.open({
				type: 1,
				title: p.title ? p.title : '数据字典选择器',
				skin: 'layui-layer-demo', //样式类名
				closeBtn: 1, //不显示关闭按钮
				anim: 2,
				shadeClose: false, //开启遮罩关闭
				area : [ '600px', 'auto' ], //宽高
				content: $(pickerId)
			});
			
			$(pickerId + ' button[role="submit"]').click(function(){
				let keyword = $(pickerId + ' input[name="keyword"]').val(),
					searchResults = [];
				
				for (let i = 0; i < ddItems.length; i++) {
					let item = ddItems[i];
					
					if (item.name.indexOf(keyword) >= 0) {
						searchResults.push(item);
					}
				}
				
				loadItems(searchResults);
				
			});
			
			$(pickerId + ' button[role="reset"]').click(function(){
				$(pickerId + ' input[name="keyword"]').val('');
				loadItems(ddItems);
				
			});
			$(pickerId + ' button[role="selected-submit"]').click(function(){
				if (typeof callback == 'function') {
					callback(pickerItems);
				}
				callback = null;
				layer.close(layerWindowId);
			});
			
//			$(pickerId + ' button[role="close-panel"]').click(function(){
//				layer.close(layerWindowId);
//			});
		};
	
	return {
		init: init
	}
	
}());