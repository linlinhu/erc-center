let TempProceessionFormPanel = (function() {
	let lw = '#temp-team-form-panel',
		tempTeam = null,
		volunteerProcessionInterface = null,
		detailTempTeamInfo = function(id) {
			volunteerProcessionInterface.detail(id, function(res) {
				tempTeam = res.result;
				// 表单数据赋值
				CommonUtil.formDataSetAndGet({
					container: lw +  ' form',
					data: tempTeam
				});
				event_add();
			});
		},
		saveTempTeamInfo = function() {
			volunteerProcessionInterface.save({
				name: '临时队伍' + new Date().getTime()
			}, function(res) {
				tempTeam = res.result;
				// 表单数据赋值
				CommonUtil.formDataSetAndGet({
					container: lw +  ' form',
					data: tempTeam
				});
				event_add();
			})
		},
		openFreeLoadPanel = function(type, isFilter) {
			let title = '',
				view = '#temp-vp-relate-free-panel';
			
			if (type) { // 关联自由志愿者团队
				title = '关联志愿者团队';
			} else { // 关联自由志愿者
				title = '关联志愿者';
			}
			loadRelates(type, isFilter, true);
			$(view).removeClass('hide');
			layerWindowId = layer.open({
				type: 1,
				title: title,
				skin: 'layui-layer-demo', //样式类名
				closeBtn: 1, //不显示关闭按钮
				anim: 2,
				shadeClose: false, //开启遮罩关闭
				area : [ '700px', 'auto' ], //宽高
				content: $(view)
			});
			$(view + ' button[role="choosen-close"]').unbind('click').bind('click', function() {
				let gt = type;
				CommonUtil.getIdsOfEls($(view + ' input[name="relates-id"]:checked'), function(ids) {
					if (!gt) {
						console.info('关联志愿者', ids);
						CommonUtil.operation({
							moduleName: 'temp-procession',
							oper: 'batchAssign',
							params: {
								data: JSON.stringify({
									id: tempTeam.id,
									hasVolunteerIds: ids.split(',')
								})
							},
							forbidConfirm: true // 禁止询问确定
						}, function(res) {
							loadRelates(null, false, true);
							layer.close(layerWindowId);
						});
					} else {
						console.info('关联志愿者团队', ids);
						CommonUtil.operation({
							moduleName: 'temp-procession',
							oper: 'batchAssign',
							params: {
								data: JSON.stringify({
									id: tempTeam.id,
									groupVolunteerIds: ids.split(',')
								})
							},
							forbidConfirm: true // 禁止询问确定
						}, function(res) {
							loadRelates(gt, false, true);
							layer.close(layerWindowId);
						});
					}
				})
			});
			
		},
		requestParams = null,
		loadRelates = function(type, isFilter, isClear) {
			let tpl = null,
				oper = null,
				requestParams = null;
			
//			if (!tempTeam || !tempTeam.id) {
//				layer.msg('临时团队未创建成功，请关闭界面重试！');
//				return false;
//			}
			isFilter = (isFilter == true || isFilter == 'true') ? true : false;
			requestParams = {
				tempMixTeamId: tempTeam.id,
				isFilterTempMixTeam: isFilter
			};
			if (!isFilter) { // 查询关联志愿者团队或者志愿者
				
				oper = 'getRelateTeams';
				requestParams.paginationEl = 'temp-vp-team-' + type + '-pagination';
				
				switch(type) {
					case '4': // 企业团队
						requestParams.view = '#temp-vp-enterprise-team .panel-body';
						break;
					case '3': // 专业团队
						requestParams.view = '#temp-vp-major-team .panel-body';
						break;
					case '2': // 社会团队
						requestParams.view = '#temp-vp-volunteer-team .panel-body';
						break;
					default:
						// type为null，表示查询关联志愿者，重新赋值oper和分页对象名称
						oper = 'getRelateVolunteers';
						requestParams.view = '#temp-vp-volunteers .panel-body';
						requestParams.paginationEl = 'temp-vp-volunteers-pagination';
				};
			} else { // 查询自由可选志愿者团队或者志愿者
				oper = 'getFreeTeams';
				requestParams.view = '#temp-vp-relate-free-panel .datas';// 数据指向相同的容器，用于弹窗
				if (type) {
					requestParams.paginationEl = 'temp-vp-team-' + type + '-free-pagination';	
				} else { // type为null， 表示查询自由个人志愿者
					oper = 'getFreeVolunteers';
					requestParams.paginationEl = 'temp-vp-volunteers-free-pagination';	
				}
				
			}
			if (type) { // 志愿者团队数据模板赋值
				tpl = temp_vp_team_datas.innerHTML;
				requestParams.groupType = type; // 团队查询重要参数：团队类型参数保存传递
			} else { // 个人志愿者数据模板赋值
				tpl = temp_vp_volunteers_datas.innerHTML;
			}
			
			if ($(requestParams.view + ' form').length == 0) { // 如果不存在form，表示数据未进行渲染，是第一次查询
				requestParams.page = 1;
				requestParams.limit = 10;
			} else { // 不是第一次查询，需要取到动态参数：分页参数，关键字等
				CommonUtil.formDataSetAndGet({
					container: requestParams.view + ' form',
					data: requestParams
				}, function(res) {
					if (res.groupType != requestParams.groupType) {
						requestParams.page = 1;
						requestParams.limit = 10;
					} else {
						requestParams = res;
					}
				});
			}
			if ($(requestParams.view + ' form').length == 1 && isClear) {
				CommonUtil.formDataSetAndGet({
					container: requestParams.view + ' form',
					data: {
						page: 1,
						limit: 10,
						keyword: ''
					}
				}, function(res) {
					if (res.groupType == requestParams.groupType) { 
						requestParams = res;
					}
				});
			}
			// ajax操作
			CommonUtil.operation({
				moduleName: 'temp-procession',
				oper: oper,
				params: requestParams,
				forbidConfirm: true // 禁止询问确定
			}, function(res) {
				res = res.result;
				laytpl(tpl).render({
					params: requestParams,
					datas: res.resultList ? res.resultList : []
				}, function(html){
					$(requestParams.view).html(html);
					// 初始化分页插件
					if (res.totalPageNum && res.totalPageNum > 1) {
						laypage.render({
							elem: requestParams.paginationEl, //不用加 # 号
							count: res.totalCount, //数据总数 //从服务端得到
							limit: res.limit,
							curr: res.currentPage,
							theme: '#0069b6',
						  	layout: ['count', 'prev', 'page', 'next', 'limit', 'skip'],
							jump : function(obj, first) {
								if(!first) {
									let curView = requestParams.view;
									CommonUtil.formDataSetAndGet({
						    			container: curView + ' form',
						    			data: {
						    				page: obj.curr,
						    				limit: obj.limit
						    			}
						    		}, function(p) {
						    			loadRelates(p.groupType ? p.groupType : null, p.isFilterTempMixTeam);
						    		});
								}
							}
						});
					}
					$(requestParams.view + ' form').find('button[role="submit"]').unbind('click').bind('click', function() {
						let curView = requestParams.view;
						
						CommonUtil.formDataSetAndGet({
			    			container: curView + ' form'
			    		}, function(p) {
			    			loadRelates(p.groupType ? p.groupType : null, p.isFilterTempMixTeam);
			    		});
					});
					$(requestParams.view + ' form').find('button[role="reset"]').unbind('click').bind('click', function() {
						let curView = requestParams.view;
						
						CommonUtil.formDataSetAndGet({
			    			container: curView + ' form',
			    			data: {
			    				page: 1,
			    				limit: 10,
			    				keyword: ''
			    			}
			    		}, function(p) {
			    			loadRelates(p.groupType ? p.groupType : null, p.isFilterTempMixTeam);
			    		});
					});
					// 关联自由可选志愿者团队或者个人志愿者
					$(requestParams.view + ' button[role="relate-free"]').unbind('click').bind('click', function() {
						let curView = requestParams.view,
							gt = requestParams.groupType ? requestParams.groupType : null;
			    		
						openFreeLoadPanel(gt, true);
					});
				});
			});
		},
		title = null,
		globalLayerIndex = null,
		event_add = function() {
			if ($(lw).hasClass('hide') || $(lw).css('display') == 'none') {
				$(lw).removeClass('hide');
				globalLayerIndex = layer.open({
					type: 1,
					title: title,
					skin: 'layui-layer-demo', //样式类名
					closeBtn: 1, //不显示关闭按钮
					anim: 2,
					shadeClose: false, //开启遮罩关闭
					area : [ '800px', 'auto' ], //宽高
					content: $(lw)
				});
				
				// 加载关联
				$(lw + ' a.temp-vp-relates').unbind('click').bind('click', function() {
					let groupType = $(this).attr('group-type');
					loadRelates(groupType ? groupType : null);
				});
				$($(lw + ' a.temp-vp-relates')[0]).click();
			}
		},
		init = function(p, callback) {
			// 接口api实例化
			volunteerProcessionInterface = new TempProcessionInterface();
			p = p ? p : {}; // 参数初始化
			// 如果存在id,则是编辑操作，查询详情
			if (p.id) {
				title = '编辑临时队伍';
				detailTempTeamInfo(p.id);

				$(lw + ' button[role="save-choosen"]').unbind('click').bind('click', function() {
					console.dir('编辑关闭');
					layer.close(globalLayerIndex);
					if (typeof callback == 'function') {
						callback('edit', tempTeam);
					}
				});
			} else {
				title = '创建临时队伍';
				saveTempTeamInfo(); // 初始创建，自动创建
				$(lw + ' button[role="save-choosen"]').unbind('click').bind('click', function() {
					console.dir('保存关联');
					layer.close(globalLayerIndex);
					if (typeof callback == 'function') {
						callback('add', tempTeam);
					}
				});
			}
		};
	return {
		init: init
	};
}());