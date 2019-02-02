let ProcessionChoosenload = (function() {
	let lw = '#procession-choosenload-panel',
		lwIndex = null,
		performanceId = null,
		relateTempVps = null,
		relateVps = null,
		operationCodes = null,
		performanceRelate = function() {
			let addTeams = null;
			
			if (performanceId && (relateTempVps != null || relateVps != null)) {
				addTeams = relateTempVps ? relateTempVps : relateVps;
				emergencyRehearsalInterFace.modifyTeams({
					drillEventId: performanceId,
					addTeams: addTeams
				}, function() {
					layer.msg('关联成功！', {icon: 6});
					loadRelateProcessions(performanceId);
				});
			} else {
				layer.msg('请选择关联至少一个应急队伍后在进行保存操作！', {icon: 5});
			}
			
		},
		removeRelateProcessions = function(delTeam) {
			if (delTeam) {
				emergencyRehearsalInterFace.modifyTeams({
					drillEventId: performanceId,
					delTeams: [delTeam]
				}, function() {
					layer.msg('删除成功！', {icon: 6});
					loadRelateProcessions(performanceId);
				});
			}
		},
		renderRelateProcessions = function(datas) {
			// 渲染关联应急队伍
			let htmls = [];

			relateTempVps = null;
			relateVps = null;
			if (datas.length > 0 ) {
				datas.map(t => {
					if (t.teamType == 0) { // 临时应急队伍添加临时标签，允许编辑
						relateTempVps = [t];
						htmls.push('<li class="list-group-item"><div style="float: right"><a href="javascript:;" class="edit" data-id="' + t.teamId + '" data-others="' + t.teamId + '-' + t.teamName + '-' + t.teamType + '"><i class="fa fa-pencil"></i></a>&nbsp;<a href="javascript:;" class="remove" data-id="' + t.teamId + '" data-type="' + t.teamType + '"><i class="fa fa-trash"></i></a></div><span class="label label-warning">临时</span>&nbsp;' + t.teamName + '</li>')
					} else {
						relateVps = relateVps ? relateVps : [];
						relateVps.push(t);
						htmls.push('<li class="list-group-item"><div style="float: right"><a href="javascript:;" class="remove" data-id="' + t.teamId + '" data-type="' + t.teamType + '"><i class="fa fa-trash"></i></a></div>' + t.teamName + '</li>')
					}
				});
			}
			$(lw + ' ul.choosen-lst').html(htmls.join(''));
			
		},
		loadRelateProcessions = function(id) {
			emergencyRehearsalInterFace.getTeams({
				drillEventId: id,
				getSub: 'false'
			}, function(res) {
				// 渲染关联应急队伍
				renderRelateProcessions(res);
				//权限判断
				if(operationCodes.indexOf('edit-t') == -1) {//编辑临时队伍
					$(lw + ' a.edit').remove();
				}
				if(operationCodes.indexOf('edit-t') == -1) {//删除队伍
					$(lw + ' a.remove').remove();
				}
				//编辑临时应急队伍
				$(lw + ' a.edit').unbind('click').bind('click', function() {
					let dataId = $(this).attr('data-id');
					
					TempProceessionFormPanel.init({
						id: dataId
					})
				});
				// 删除关联
				$(lw + ' a.remove').unbind('click').bind('click', function() {
					let dataId = $(this).attr('data-id'),
						dataType = $(this).attr('data-Type');
					
					removeRelateProcessions({
						teamId: dataId,
						teamType: dataType
					});
				});
			});
			
		},
		init = function(p, callback) {
			p = p ? p : {};
			performanceId = p.id ? p.id : null;
			operationCodes = p.operationCodes;
			if (performanceId) {
				loadRelateProcessions(performanceId);
			} else {
				console.log('ERR: 应急队伍关联界面弹窗加载失败，原因是->缺少必要参数：绑定演练对象未知');
				return false;
			}
			if ($(lw).hasClass('hide') || $(lw).css('display') == 'none') {
				$(lw).removeClass('hide');
				lwIndex = layer.open({
					type: 1,
					title: p && p.title ? p.title : '关联应急队伍',
					skin: 'layui-layer-demo', //样式类名
					closeBtn: 1, //不显示关闭按钮
					anim: 2,
					shadeClose: false, //开启遮罩关闭
					area : [ '800px', 'auto' ], //宽高
					content: $(lw)
				});
				$(lw + ' button[role="choosen-close"]').unbind('click').bind('click', function() {
					if (!relateTempVps && !relateVps) {
						layer.msg('请选择关联至少一个应急队伍后在进行保存操作！', {icon: 5});
						return false;
					}
					layer.close(lwIndex);
				});
				if(operationCodes.indexOf('link-team') == -1) {//判断是否有关联队伍的权限
					$(lw + ' a.vp-choosen').remove();
				}
				if(operationCodes.indexOf('create-t') == -1) {//判断是否有创建临时队伍的权限
					$(lw + ' a.temp-vp-create').remove();
				}
				// 选择已有应急队伍进行关联
				$(lw + ' a.vp-choosen').unbind('click').bind('click', function() {
					if (!relateTempVps) { // 临时应急队伍和已有应急队伍只能选择一种进行关联
						ProceessionPickerPanel.init({
							max: 10
						}, function(res) {
							layer.close(res.layerWindowIndex);
							relateVps = [];
							res.others.map(o => {
								relateVps.push({
									teamId: o.split('-')[0],
									teamName: o.split('-')[1],
									teamType: 1
								});
							});
							performanceRelate();
						});
					} else {
						layer.msg('不支持同时关联临时应急队伍和已有应急队伍，二者只能关联一种！', {icon: 5});
					}
				});

				$(lw + ' a.temp-vp-create').unbind('click').bind('click', function() {
					// 临时应急队伍和已有应急队伍只能选择一种进行关联 并且 只能关联一个临时应急队伍
					if (relateTempVps) {
						layer.msg('已创建临时队伍，请直接进行编辑！', {icon: 5});
						return false;
					}
					if (!relateVps) {
						TempProceessionFormPanel.init({
						}, function(type, tempTeam) {
							if (type == 'add') {
								relateTempVps = [{
									teamId: tempTeam.id,
									teamName: tempTeam.name,
									teamType: 0
								}];
								performanceRelate();
							}
						})
					} else {
						layer.msg('不支持同时关联临时应急队伍和已有应急队伍，二者只能关联一种！', {icon: 5});
					}
				});
			}
		};
		
	return {
		init: init
	};
}());