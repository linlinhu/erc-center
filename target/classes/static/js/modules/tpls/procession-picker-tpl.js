let ProceessionPickerPanel = (function() {
	let view = '#procession-picker-panel',
		regionId = null,
		gridId = null,
		regionInterface = null,
		volunteerProcessionInterface = null,
		disableIds = null,
		checkedIds = null,
		max = 0,
		layerWindowId = null,
		selectedObjs = [],
		calSelect = function() {
			let els = $(view + ' .procession-datas input[name="procession-choosen"]'),
				checkedLen = 0,
				disabledLen = 0,
				isSelectAll = $(view + ' .selectAll').prop('checked');
			
			if (els.length > 0) {
				$.each(els, function() {
					if (this.disabled) {
						disabledLen++ ;
					}
					if (this.checked) {
						checkedLen++ ;
					}
				});
				if (checkedLen + disabledLen === els.length) {
					if (!isSelectAll) {
						$(view + ' .selectAll').prop('checked', true);
					}
				} else {
					if (isSelectAll) {
						$(view + ' .selectAll').prop('checked', false);
					}
				}
			}
		},
		setToSelectObjs = function(obj) {
			let isExist = false;
			if (obj.id) {
				for(o of selectedObjs) {
					if (o.id === obj.id) {
						isExist = true;
					}
				}
				if (!isExist) {
					if (max > 1) {
						selectedObjs.push(obj);
					} else {
						selectedObjs = [obj];
						$.each($(view + ' .procession-datas input[name="procession-choosen"]'), function() {
							$(this).prop('checked', false);
						});
						$(view + ' .procession-datas input[name="procession-choosen"][data-id = "' + obj.id + '"]').prop('checked', true);
					}
				}
			}
			$(view + ' .select-tip').html('已勾选' + selectedObjs.length + '个应急队伍');
			calSelect();
			return selectedObjs;
		},
		delFromSelectObjs = function(obj) {
			let delIndex = -1;
			if (obj.id) {
				for(let i = 0; i < selectedObjs.length; i++) {
					if (selectedObjs[i].id === obj.id) {
						delIndex = i;
					}
				}
				if (delIndex >= 0) {
					selectedObjs.splice(delIndex, 1);
				}
				$(view + ' .select-tip').html('已勾选' + selectedObjs.length + '个应急队伍');
			}
			if ($(view + ' .selectAll').prop('checked')) {
				$(view + ' .selectAll').prop('checked', false);
			}
			return selectedObjs;
		},
		loadProcessionsByGridId = function(p) {
			volunteerProcessionInterface.getPages(p, function(res) {
				let processions = res.resultList,
					disableLength = 0,
					checkLength = 0;
				if (processions.length > 0) {
					$(view + ' .procession-datas').html(processions.map(p => '<li class="list-group-item"><input name="procession-choosen" type="checkbox" data-id="' + p.id+ '" data-others="' + p.id + '-' + p.name + '">' + p.name + '</li>').join(''));
					for (let i = 0; i < disableIds.length; i++) {
						let disableEl = $(view + ' .procession-datas input[name="procession-choosen"][data-id="' + disableIds[i] + '"]');
						if (disableEl.length == 1) {
							disableEl.attr('disabled', 'disabled');
							disableEl.attr('title', '当前项不在可勾选范围内');
							disableLength ++;
						}
					}
					for (let i = 0; i < checkedIds.length; i++) {
						let checkedEl = $(view + ' .procession-datas input[name="procession-choosen"][data-id="' + checkedIds[i] + '"]');
						if (checkedEl.length == 1) {
							setToSelectObjs({
								id: checkedEl.attr('data-id'),
								other: checkedEl.attr('data-others')
							});
						}
					}
					for (let i = 0; i < selectedObjs.length; i++) {
						let checkedEl = $(view + ' .procession-datas input[name="procession-choosen"][data-id="' + selectedObjs[i].id + '"]');
						if (checkedEl.length == 1) {
							checkedEl.prop('checked', true);
							checkLength++;
						}
					}
					
					if (res.totalPageNum && staffs.totalPageNum > 1) {
						laypage.render({
						    elem: 'procession-picker-procession-page',
						    count: res.totalCount,
						    layout: ['prev', 'next'],
						    jump: function(obj, first){
						    	if(!first){
						    		loadProcessionsByGridId({
						    			page: obj.curr,
						    			limit: 10,
						    			gridId: gridId
						    		});
						      	}
						    }
						});
					}
					
					$(view + ' .procession-datas').find('li').unbind('click').bind('click', function() {
						let el = $(this),
							disabled = $(el.find('input')[0]).attr('disabled'),
							chkObj = $(el.find('input[name="procession-choosen"]')[0]),
							dataObj = {
								id: chkObj.attr('data-id'),
								other: chkObj.attr('data-others')
							};
						
						if (disabled === 'disabled') {
							layer.msg('当前项不在可勾选范围内', {icon: 5});
							return false;
						} else {
							if (!el.hasClass('selected')) {
								el.siblings().removeClass('selected');
								el.addClass('selected');
								if (!chkObj.prop('checked')) {
									chkObj.prop('checked', true);
									setToSelectObjs(dataObj);
								}
							} else {
								el.removeClass('selected');
								if (chkObj.prop('checked')) {
									chkObj.prop('checked', false);
									delFromSelectObjs(dataObj);
								}
							}
						}
						
					});
					$(view + ' .procession-datas').find('li > input[name="procession-choosen"]').unbind('click').bind('click', function() {
						let el = $(this);
							isChecked = $(this).prop('checked'),
							curObj = null;
							
						if (el.attr('disabled') != 'disabled') {
							el.prop('checked', !isChecked);
							curObj = {
								id: el.attr('data-id'),
								other: el.attr('data-others')	
							}
							if (!isChecked) {
								setToSelectObjs(curObj);
							} else {
								delFromSelectObjs(curObj)
							}
						}
					
					});
					$(view + ' .selectAll').unbind('change').bind('change', function() {
						let isChecked = $(this).is(':checked'),
							checkEls = $(view + ' .procession-datas input[name="procession-choosen"]');
						
						for (let i = 0; i < checkEls.length; i++) {
							let cur = $(checkEls[i]),
								curObj = {
									id: cur.attr('data-id'),
									other: cur.attr('data-others')
								};
							if ($(checkEls[i]).attr('disabled') != 'disabled') {
								$(checkEls[i]).prop('checked', isChecked);
								if (isChecked) {
									setToSelectObjs(curObj);
								} else {
									delFromSelectObjs(curObj)
								}
							}
						}
						
						
					});
				} else {
					$(view + ' .procession-datas').html('<li class="list-group-item">暂无应急队伍</li>');
				}
				if (processions.length > 0 && disableLength + checkLength === processions.length) {
					$(view + ' .selectAll').prop('checked', true);
				} else {

					$(view + ' .selectAll').prop('checked', false);
				}
				
			});
		},
		loadGridsByRegionId = function(p) {
			regionInterface.getGrids(p, function(res) {
				let grids = res,
					disabled = false;
				if (grids.length > 0) {
				
					$(view + ' .grid-datas').html(grids.map(g => '<li class="list-group-item" data-id="' + g.id+ '">' + g.name + '</li>').join(''));
					
					
					if (res.totalPageNum && staffs.totalPageNum > 1) {
						laypage.render({
						    elem: 'procession-picker-grid-page',
						    count: res.totalCount,
						    layout: ['prev', 'next'],
						    jump: function(obj, first){
						    	if(!first){
						    		loadGridsByRegionId({
						    			page: obj.curr,
						    			limit: 10,
						    			regionId: regionId
						    		});
						      	}
						    }
						});
					}
					$(view + ' .grid-datas').find('li').unbind('click').bind('click', function() {
						$(this).siblings().removeClass('selected');
						$(this).addClass('selected');
						gridId = $(this).attr('data-id');
						loadProcessionsByGridId({
							gridId: gridId,
							page: 1,
							limit: 10
						});
					});
				} else {
					$(view + ' .grid-datas').html('<li class="list-group-item">暂无网格</li>');
					$(view + ' .procession-datas').html('<li class="list-group-item">暂无应急队伍</li>');
				}
			})
		},
		init = function(p, callback) {
			let lw = '#procession-picker-panel';
			
			regionInterface = new RegionInterface();
			volunteerProcessionInterface = new VolunteerProcessionInterface();
			disableIds = p.disableIds ? p.disableIds : []; // 禁用应急队伍编号，多个
			checkedIds = p.checkedIds ? p.checkedIds : []; // 选中应急队伍编号
			max = p.max ? p.max : 10;
			
			eminZtree({
				id: 'procession-picker-region-tree',
				async: {
					url: base + 'region/findByPid',
					expandAll: true	
				}
			}, function(zTree, treeNode, type) {
				regionId = treeNode.id;
				loadGridsByRegionId({
					regionId: regionId
				});
			});
			selectedObjs = [];
			if (max <= 1) {
				$(view + ' .chk').hide();
				$(view + ' .select-tip').hide();
			} else {
				$(view + ' .chk').show();
				$(view + ' .select-tip').show();
			}
			$(view + ' .selectAll').prop('checked', false);
			$(view + ' .select-tip').html(checkedIds.length == 0 ? '暂无勾选记录' : ('已勾选' + checkedIds.length + '个应急队伍'));
			$(view + ' .procession-datas').html('<li class="list-group-item">请选择网格进行查询</li>');
			$(view + ' .grid-datas').html('<li class="list-group-item">请选择区域进行查询</li>');
			if ($(lw).hasClass('hide') || $(lw).css('display') == 'none') {
				$(lw).removeClass('hide');
				layerWindowId = layer.open({
					type: 1,
					title: p && p.title ? p.title : '选择应急队伍',
					skin: 'layui-layer-demo', //样式类名
					closeBtn: 1, //不显示关闭按钮
					anim: 2,
					shadeClose: false, //开启遮罩关闭
					area : [ '800px', 'auto' ], //宽高
					content: $(lw)
				});
				$(lw + ' button[role="choosen-close"]').unbind('click').bind('click', function() {
					if (selectedObjs.length == 0) {
						layer.msg('未选择应急队伍！', {icon: 5});
						return false;
					}
					callback({
						ids: selectedObjs.map(so => so.id).join(','),
						others: selectedObjs.map(so => so.other),
						layerWindowIndex: layerWindowId
					});
				});
				
				$(lw + ' button[role="close-panel"]').unbind('click').bind('click', function() {
					layer.close(layerWindowId);
				});
			}
		};
		
	return {
		init: init
	};
}());