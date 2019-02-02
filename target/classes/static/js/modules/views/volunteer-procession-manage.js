let VolunteerProcessionManage = (function() {
	let volunteerProcessionInterface = null,
		volunteerTeamInterface = null,
		loadVpPages = function(p, loadInfoId) {
			let tpl = timeline_vp_tpl.innerHTML,
				view = $('#timeline-vp');
			
			volunteerProcessionInterface.getPages(p, function(res) {
				laytpl(tpl).render({
					params: p,
					list: res.resultList
				}, function(html){
					view.html(html);
					if (loadInfoId) {
						loadInfo(loadInfoId);
					}
					if (res.totalPageNum && staffs.totalPageNum > 1) {
						laypage.render({
						    elem: 'timeline-vp-page',
						    count: res.totalCount,
						    layout: ['prev', 'next'],
						    jump: function(obj, first){
						    	if(!first){
						    		CommonUtil.formDataSetAndGet({
						    			container: '#timeline-vp form',
						    			data: {
						    				page: obj.curr
						    			}
						    		}, function(p) {
						    			loadVpPages(p);
						    		});
						      	}
						    }
						});
					}
					view.find('button[role="submit"]').unbind('click').bind('click', function() {
						CommonUtil.formDataSetAndGet({
			    			container: '#timeline-vp form'
			    		}, function(p) {
			    			if (p.name) {
				    			loadVpPages(p);
			    			} else {
			    				layer.msg('请键入关键字后进行搜索。', {icon: 5});
			    			}
			    		});
					});
					
					view.find('button[role="reset"]').unbind('click').bind('click', function() {
						CommonUtil.formDataSetAndGet({
			    			container: '#timeline-vp form',
			    			data: {
			    				page: 1,
			    				limit: 10,
			    				name: ''
			    			}
			    		}, function(p) {
				    		loadVpPages(p);
			    		});
					});
					
					view.find('button[role="add"]').unbind('click').bind('click', openFormPanel);
					
					$('#timeline-vp form').unbind('keydown').bind('keydown', function(e) {
						var theEvent = e || window.event;
						var code = theEvent.keyCode || theEvent.which || theEvent.charCode;
						if (code == 13) {
							CommonUtil.formDataSetAndGet({
				    			container: '#timeline-vp form'
				    		}, function(p) {
				    			loadVpPages(p);
				    		});
							return false;
						}
						return true;
					});
					event_clickVp();
				});
			})
		},
		loadGridVpPages = function(p) {
			let tpl = grids_vp_list_tpl.innerHTML,
				gridId = p.gridId,
				view = $('#vp-grid-' + gridId);
			
			volunteerProcessionInterface.getPages(p, function(res) {
				laytpl(tpl).render({
					params: p,
					list: res.resultList
				}, function(html){
					view.html(html)
					if (res.totalPageNum && staffs.totalPageNum > 1) {
						laypage.render({
						    elem: 'vp-grid-' + gridId + '-page',
						    count: res.totalCount,
						    layout: ['prev', 'next'],
						    jump: function(obj, first){
						    	if(!first){
						    		loadVpPages({
						    			page: obj.curr,
						    			limit: 10,
						    			gridId: gridId
						    		});
						      	}
						    }
						});
					}

					event_clickVp();
				});
			})
		},
		loadAggregationGrids = function(p) {
			let tpl = grids_vp_tpl.innerHTML,
				view = $('#grids-vp');
			
			volunteerProcessionInterface.gridAggregation(p, function(res) {
				laytpl(tpl).render({
					params: p,
					list: res
				}, function(html){
					view.html(html)
					view.find('span[role="add"]').unbind('click').bind('click', openFormPanel);

					view.find('.grid-name').unbind('click').bind('click', function() {
						let id = $(this).attr('data-id');
						loadGridVpPages({
							page: 1,
							limit: 10,
							gridId: id
						})
					});
				});
			})
		},
		vpId = null,
		loadInfo = function(id) {
			var tpl = vp_info_datas.innerHTML,
				view = $('#volunteer-procession-manage .vp-info');
			
			volunteerProcessionInterface.detail(id, function(result) {
				laytpl(tpl).render(result, function(html){
					view.html(html);
					vpId = id;
					infoOpersInit();
				});
			})
		},
		loadVpRelateHrByType = function(type) {
			switch(type) {
				case 4:
					loadVpTeamPage({
						view: '#vp-enterprise-team .panel-body',
						page: 1,
						limit: 10,
						groupType: 4,
						mixTeamId: vpId
					});
					break;
				case 3:
					loadVpTeamPage({
						view: '#vp-major-team .panel-body',
						page: 1,
						limit: 10,
						groupType: 3,
						mixTeamId: vpId
					});
					break;
				case 2:
					loadVpTeamPage({
						view: '#vp-volunteer-team .panel-body',
						page: 1,
						limit: 10,
						groupType: 2,
						mixTeamId: vpId
					});
					break;
				default:
					loadVpVolunteers({
						page: 1,
						limit: 10,
						view: '#vp-volunteers .panel-body',
						mixTeamId: vpId
					});
			};
		},
		infoOpersInit = function() {
			let view = $('#volunteer-procession-manage .vp-info');
			
			teamTpl = vp_team_datas.innerHTML;
			view.find('a[role="edit"]').unbind('click').bind('click', openFormPanel);
			view.find('a[role="remove"]').unbind('click').bind('click', function() {
				let id = $(this).attr('data-id');
				layer.confirm('确认删除志愿者队伍？', {
				    btn: ['确认','取消'], //按钮
				    shade: true //不显示遮罩
				}, function(cIndex){
					volunteerProcessionInterface.remove(id, function() {
						layer.close(cIndex);
				    	layer.msg('删除成功！', {icon: 6});
						loadVpPages({
							page: 1,
							limit: 10
						});
						loadAggregationGrids();
					});
				});
			});
			
			view.find('a[role="toggle-fold-vp-details"]').unbind('click').bind('click', function() {
				if($($(this).find('i.fa')[0]).hasClass('fa-angle-up')) {
					$(this).html('<i class="fa fa-angle-down text-primary fa-lg" title="展开"></i>');
					$('#volunteer-procession-manage .vp-details').hide();
				} else {

					$(this).html('<i class="fa fa-angle-up text-primary fa-lg" title="收起"></i>');
					$('#volunteer-procession-manage .vp-details').show();
				}
			});
			view.find('i[role="relate-leader"]').unbind('click').bind('click', function() {
				let id = $(this).attr('data-id'),
					teamId = $(this).attr('data-team-id');
				
				StaffsChoosenTpl.init({
					title: '选择领队'
				}, function(res){
					let ids = res.ids,
						others = res.others,
						lwIndex = res.layerWindowIndex;
					
					if (id) {
						if (others.length > 1) {
							layer.msg('请最多选择一位进行领队的更替操作！', {icon: 5});
							return false;
						}
						layer.close(lwIndex);
						volunteerProcessionInterface.relateLeader({
							data: JSON.stringify({
								id: id,
								mixTeamId: teamId,
								userId: others[0].split('-')[0],
								userName: others[0].split('-')[1]
							})
						}, function() {
							loadInfo(teamId);
						})
						
					} else {
						let userInfos = [];
						others.map(o => userInfos.push({
							userId: o.split('-')[0],
							userName: o.split('-')[1],
						}));
						volunteerProcessionInterface.relateLeaders({
							data: JSON.stringify({
								mixTeamId: teamId,
								userInfos: userInfos
							})
						}, function() {
							layer.close(lwIndex);
							layer.msg('关联成功', {icon: 6});
							loadInfo(teamId);
						});
					}
				})
			});
			
			view.find('button[role="del-leader"]').unbind('click').bind('click', function() {
				let id = $(this).attr('data-id'),
					teamId = $(this).attr('data-team-id');
				
				volunteerProcessionInterface.removeLeader(id, function() {
					layer.msg('删除成功', {icon: 6});
					loadInfo(teamId);
				});
				
			})
			
			loadVpRelateHrByType(4);
			$('#volunteer-procession-manage .vp-enterprise-team-load').unbind('click').bind('click', function() {
				loadVpRelateHrByType(4);
			});

			$('#volunteer-procession-manage .vp-major-team-load').unbind('click').bind('click', function() {
				loadVpRelateHrByType(3);
			});

			$('#volunteer-procession-manage .vp-volunteer-team-load').unbind('click').bind('click', function() {
				loadVpRelateHrByType(2);
			});
			
			$('#volunteer-procession-manage .vp-volunteers-load').unbind('click').bind('click', function() {
				loadVpRelateHrByType();
			});
		},
		teamTpl = null,
		teamView = null,
		teamResult = null,
		teamType = 1,
		loadTeamRelateVolunteers = function(p) {
			let teamId = $(this).attr('data-id'),
				tpl = vp_team_member_datas.innerHTML,
				view = '#vp_team_member_view';
			console.dir(p);
			volunteerTeamInterface.getVolunteers(p, function(res) {
				laytpl(tpl).render({
					params: p,
					datas: res.resultList
				}, function(html){
					$(view).html(html);
					if (res.totalPageNum && res.totalPageNum > 1) {
						laypage.render({
							elem: 'vp_team_member-page', //注意，这里的 test1 是 ID，不用加 # 号
							count: res.totalCount, //数据总数 //从服务端得到
							limit: res.limit,
							curr: res.currentPage,
							theme: '#0069b6',
						  	layout: ['count', 'prev', 'page', 'next', 'limit', 'skip'],
							jump : function(obj, first) {
								if(!first) {
									CommonUtil.formDataSetAndGet({
						    			container: view + ' form',
						    			data: {
						    				page: obj.curr,
						    				limit: obj.limit
						    			}
						    		}, function(p) {
						    			loadTeamRelateVolunteers(p);
						    		});
								}
							}
						});
					}
					$(view).find('button[role="submit"]').unbind('click').bind('click', function() {
						CommonUtil.formDataSetAndGet({
			    			container: view + ' form'
			    		}, function(params) {
			    			loadTeamRelateVolunteers(params);
			    		});
					});
					$(view).find('button[role="reset"]').unbind('click').bind('click', function() {
						CommonUtil.formDataSetAndGet({
			    			container: view + ' form',
			    			data: {
			    				page: 1,
			    				limit: 10,
			    				name: ''
			    			}
			    		}, function(p) {
			    			loadTeamRelateVolunteers(p);
			    		});
					});
					$(view).find('a[role="set-leader"]').unbind('click').bind('click', function() {
						let userId = $(this).attr('data-id'),
							userName = $(this).attr('data-name');
						
						volunteerProcessionInterface.relateLeader({
							data: JSON.stringify({
								mixTeamId: vpId,
								userId: userId,
								userName: userName
							})
						}, function() {
							loadInfo(vpId);
							layer.closeAll();
						});
						
					});
					if ($(view).hasClass('hide') || $(view).css('display') === 'none') {
						$(view).removeClass('hide');
						layerWindowId = layer.open({
							type: 1,
							title: "关联志愿者列表",
							skin: 'layui-layer-demo', //样式类名
							closeBtn: 1, //不显示关闭按钮
							anim: 2,
							shadeClose: true, //开启遮罩关闭
							area : [ '700px', 'auto' ], //宽高
							content: $(view),
							end: function() {
								layer.close(layerWindowId);
							}
						});
					}
				});
			})
			
		},
		renderTeamPage = function(p, res) {
			teamView = $(p.view);
			teamType = p.groupType;
			
			laytpl(teamTpl).render({
				params: p,
				datas: res.resultList
			}, function(html){
				teamView.html(html);
				if (res.totalPageNum && res.totalPageNum > 1) {
					laypage.render({
						elem: 'vp-team-page-' + p.groupType, //注意，这里的 test1 是 ID，不用加 # 号
						count: res.totalCount, //数据总数 //从服务端得到
						limit: res.limit,
						curr: res.currentPage,
						theme: '#0069b6',
					  	layout: ['count', 'prev', 'page', 'next', 'limit', 'skip'],
						jump : function(obj, first) {
							if(!first) {
								CommonUtil.formDataSetAndGet({
					    			container: p.view + ' form',
					    			data: {
					    				page: obj.curr,
					    				limit: obj.limit
					    			}
					    		}, function(p) {
					    			loadVpTeamPage(p);
					    		});
							}
						}
					});
				}
				teamView.find('button[role="submit"]').unbind('click').bind('click', function() {
					CommonUtil.formDataSetAndGet({
		    			container: p.view + ' form'
		    		}, function(p) {
		    			loadVpTeamPage(p);
		    		});
				});
				teamView.find('button[role="reset"]').unbind('click').bind('click', function() {
					CommonUtil.formDataSetAndGet({
		    			container: p.view + ' form',
		    			data: {
		    				page: 1,
		    				limit: 10,
		    				keyword: ''
		    			}
		    		}, function(p) {
		    			loadVpTeamPage(p);
		    		});
				});

				
				if (p.isFilterMixTeam && p.isFilterMixTeam == 'true') {
					let title = '',
						lw = '#add-team-to-vp';
					
					teamView.find('button[role="add-vp-team"]').hide();
					teamView.find('button[role="remove-vp-team"]').hide();
					teamView.find('button[role="exchange-vp-team"]').hide();
					if ($(lw).hasClass('hide') || $(lw).css('display') == 'none') {
						if (p.groupType == 4) {
							title = '添加企业团队';
						}
						
						if (p.groupType == 3) {
							title = '添加专业团队';
						}
						
						if (p.groupType == 2) {
							title = '添加社会团队';
						}
						$(lw).removeClass('hide');
						layerWindowId = layer.open({
							type: 1,
							title: title,
							skin: 'layui-layer-demo', //样式类名
							closeBtn: 1, //不显示关闭按钮
							anim: 2,
							shadeClose: false, //开启遮罩关闭
							area : [ '700px', 'auto' ], //宽高
							content: $(lw)
						});
						
						$(lw + ' button[role="choosen-close"]').unbind('click').bind('click', function() {
							CommonUtil.getIdsOfEls($(p.view + ' input[name="vp-team-choose"]:checked'), function(ids) {
								volunteerProcessionInterface.batchHandlerGroup({
									vpId: vpId,
									relateIds: ids
								}, function() {
									layer.closeAll();
									layer.msg('操作成功', {icon: 6});
									loadVpRelateHrByType(parseInt(p.groupType));
								});
							});
						});
					}
					teamView.find('a[role="relate-volunteers"]').unbind('click').bind('click', function() {
						let groupId = $(this).attr('data-id');
						loadTeamRelateVolunteers({
							groupId: groupId,
							page: 1,
							limit: 10,
							isFilterMixTeam: 'true'
						})
					});
				} else {
					teamView.find('a[role="relate-volunteers"]').unbind('click').bind('click', function() {
						let groupId = $(this).attr('data-id');
						loadTeamRelateVolunteers({
							groupId: groupId,
							page: 1,
							limit: 10,
							isFilterMixTeam: 'false'
						})
					});
					teamView.find('button[role="add-vp-team"]').show().unbind('click').bind('click', function() {
						loadVpTeamPage({
							page: 1,
							limit: 10,
							groupType: $(this).attr('team-type'),
							isFilterMixTeam: 'true',
							view: '#add-team-to-vp .datas',
							mixTeamId: vpId
						});
					});
					teamView.find('button[role="remove-vp-team"]').show().unbind('click').bind('click', function() {
						getTargetVpTeams(teamType, function(ids) {
							volunteerProcessionInterface.batchHandlerGroup({
								vpId: vpId,
								removeIds: ids
							}, function() {
								layer.msg('操作成功', {icon: 6});
								loadVpRelateHrByType(parseInt(teamType));
							});
						});
					});
					
					teamView.find('button[role="exchange-vp-team"]').show().unbind('click').bind('click', function() {
						getTargetVpTeams(teamType, function(ids) {
							ProceessionPickerPanel.init({
								title: '选择移动目标应急队伍（单选 ）',
								disableIds: [vpId],
								max: 1
							}, function(res) {
								let exchangeIds = res.ids,
									lwIndex = res.layerWindowIndex;
								if (res.others.length > 1) {
									layer.msg('目标移动队伍只能为1个哦！', {icon: 5});
									return false;
								}
								volunteerProcessionInterface.exchangeTeams({
									vpId: vpId,
									exchangeId: exchangeIds,
									ids: ids
								}, function() {
									layer.close(lwIndex);
									layer.msg('操作成功！', {icon: 6});
									loadVpRelateHrByType(parseInt(teamType));
								});
								
							});
						});
					});
				}
				
				
			});
		},
		loadVpTeamPage = function(p) {
			if (p.isFilterMixTeam && p.isFilterMixTeam == 'true') { // 加载可用团队
				volunteerProcessionInterface.getFreeTeamPage(p, function(res) {
					renderTeamPage(p, res);
				})
			} else { // 加载关联团队
				volunteerProcessionInterface.getTeamPage(p, function(res) {
					renderTeamPage(p, res);
				});
			}
		},
		getTargetVpTeams = function(teamType, callback) {
			var checkElParent = null;
			if (teamType == 4) {
				checkElParent = '#vp-enterprise-team';
			}
			if (teamType == 3) {
				checkElParent = '#vp-major-team';
			}
			if (teamType == 2) {
				checkElParent = '#vp-volunteer-team';
			}
			CommonUtil.getIdsOfEls($(checkElParent + ' input[name="vp-team-choose"]:checked'), callback);
		},
		renderVpVolunteers = function(p, res) {
			let view = p.view;
			
			laytpl(vp_volunteers_datas.innerHTML).render({
				params: p,
				datas: res.resultList
			}, function(html){
				$(view).html(html);
				// 分页
				if (res.totalPageNum && res.totalPageNum > 1) {
					laypage.render({
						elem: 'vp-volunteers-page', //注意，这里的 test1 是 ID，不用加 # 号
						count: res.totalCount, //数据总数 //从服务端得到
						limit: res.limit,
						curr: res.currentPage,
						theme: '#0069b6',
					  	layout: ['count', 'prev', 'page', 'next', 'limit', 'skip'],
						jump : function(obj, first) {
							if(!first) {
								CommonUtil.formDataSetAndGet({
					    			container: view + ' form',
					    			data: {
					    				page: obj.curr,
					    				limit: obj.limit
					    			}
					    		}, function(p) {
					    			loadVpVolunteers(p);
					    		});
							}
						}
					});
				}
				// 提交搜索表单
				$(view).find('button[role="submit"]').unbind('click').bind('click', function() {
					CommonUtil.formDataSetAndGet({
		    			container: view + ' form'
		    		}, function(p) {
		    			loadVpVolunteers(p);
		    		});
				});
				// 重置搜索表单
				$(view).find('button[role="reset"]').unbind('click').bind('click', function() {
					CommonUtil.formDataSetAndGet({
		    			container: view + ' form',
		    			data: {
		    				page: 1,
		    				limit: 10,
		    				keyword: ''
		    			}
		    		}, function(p) {
		    			loadVpVolunteers(p);
		    		});
				});
				
				$(view).find('a[role="set-leader"]').unbind('click').bind('click', function() {
					let userId = $(this).attr('data-id'),
						userName = $(this).attr('data-name');
					
					volunteerProcessionInterface.relateLeader({
						data: JSON.stringify({
							mixTeamId: vpId,
							userId: userId,
							userName: userName
						})
					}, function() {
						loadInfo(vpId);
						layer.closeAll();
					});
				});
				
				
				if (p.isFilterMixTeam && p.isFilterMixTeam == 'true') {// 过滤参数为true表示需要打开面板选择空闲志愿者
					let lw = '#add-volunteers-to-vp';
					$(view).find('button[role="add-vp-volunteers"]').hide();
					$(view).find('button[role="remove-vp-volunteers"]').hide();
					$(view).find('button[role="exchange-vp-volunteers"]').hide();
					if ($(lw).hasClass('hide') || $('#add-volunteers-to-vp').css('display') == 'none') {
						$(lw).removeClass('hide');
						layerWindowId = layer.open({
							type: 1,
							title: '添加个人志愿者',
							skin: 'layui-layer-demo', //样式类名
							closeBtn: 1, //不显示关闭按钮
							anim: 2,
							shadeClose: true, //开启遮罩关闭
							area : [ '700px', 'auto' ], //宽高
							content: $(lw),
							end: function() {
								layer.close(layerWindowId);
							}
						});
						
						// 选择并执行关联操作点击事件
						$(lw + ' button[role="choosen-close"]').unbind('click').bind('click', function() {
							CommonUtil.getIdsOfEls($(view + ' input[name="vp-volunteer-choose"]:checked'), function(ids) {
								volunteerProcessionInterface.batchHandlerHashVolunteer({
									vpId: vpId,
									relateIds: ids
								}, function() {
									layer.close(layerWindowId);
									layer.msg('操作成功', {icon: 6});
									loadVpRelateHrByType();
								})
							});
						});
					}
				} else {
					// 关联志愿者
					$(view).find('button[role="add-vp-volunteers"]').show().unbind('click').bind('click', function() {
						loadVpVolunteers({
							page: 1,
							limit: 10,
							isFilterMixTeam: 'true',
							view: '#add-volunteers-to-vp .datas',
							mixTeamId: vpId
						});
					});
					// 移除志愿者
					$(view).find('button[role="remove-vp-volunteers"]').show().unbind('click').bind('click', function() {
						CommonUtil.getIdsOfEls($(view + ' input[name="vp-volunteer-choose"]:checked'), function(ids) {
							volunteerProcessionInterface.batchHandlerHashVolunteer({
								vpId: vpId,
								removeIds: ids
							}, function() {
								layer.msg('操作成功', {icon: 6});
								loadVpRelateHrByType();
							});
						});
					});
					
					$(view).find('button[role="exchange-vp-volunteers"]').show().unbind('click').bind('click', function() {
						CommonUtil.getIdsOfEls($(view + ' input[name="vp-volunteer-choose"]:checked'), function(ids) {
							ProceessionPickerPanel.init({
								title: '选择移动目标应急队伍（单选 ）',
								disableIds: [vpId],
								max: 1
							}, function(res) {
								let exchangeIds = res.ids,
									lwIndex = res.layerWindowIndex;
									
								if (res.others.length > 1) {
									layer.msg('目标移动队伍只能为1个哦！', {icon: 5});
									return false;
								}
								volunteerProcessionInterface.exchangeVolunteers({
									vpId: vpId,
									exchangeId: exchangeIds,
									ids: ids
								}, function() {
									layer.close(lwIndex);
									layer.msg('操作成功！', {icon: 6});
									loadVpRelateHrByType();
								});
							});
						});
					});
				}
			});
		},
		loadVpVolunteers = function(p) {
			if (p.isFilterMixTeam && p.isFilterMixTeam == 'true') {
				volunteerProcessionInterface.getFreeVolunteersPage(p, function(res) {
					renderVpVolunteers(p, res);
				});
			} else {
				volunteerProcessionInterface.getVolunteersPage(p, function(res) {
					renderVpVolunteers(p, res);
				});
			}
			
			
		},
		form_grid_id = null,
		form_grid_name = null,
		form_grid_tags = null,
		layerWindowId = null,
		openFormPanel = function() {
			let id = $(this).attr('data-id'),
				f = '.vp-form-box form';

			$.ajaxSettings.async = false;	
			if (id) {
				volunteerProcessionInterface.detail(id, function(res) {
					CommonUtil.formDataSetAndGet({
		    			container: f,
		    			data: res
		    		});

					form_grid_id = res.gridId;
					form_grid_name = res.gridName;
					form_grid_tags = res.tags;
					
					$(f).find('.grid-choosen-click').html(res.gridName);
					$(f).find('.labels-choosen-click').html(res.tags.map(r => r.name).join(','));

				});
			} else {
				CommonUtil.formDataSetAndGet({
	    			container: f,
	    			data: {
	    				id: '',
	    				name: ''
	    			}
	    		});
				
				$(f).find('.grid-choosen-click').html('选择所属网格');
				$(f).find('.labels-choosen-click').html('选择队伍标签');
				
				form_grid_id = null;
				form_grid_name = null;
				form_grid_tags = null;
			}
			$(f).find('.labels-choosen-click').unbind('click').bind('click', function() {
				let el = $(this),
					ddInterface = new DataDicInterface();
				
				ddInterface.getItemsByCode('team-tag', function(res) {
					ddItemsPicker.init({
						items: res,
						title: '添加应急队伍标签（多选）',
						maxLen: 5,
						pickeredLst: form_grid_tags
					}, function(res) {
						if (res.length > 0) {
							el.html(res.map(r => r.name).join(','));
							form_grid_tags = res;
						} else {
							el.html('选择应急队伍标签（多选）');
						}
					});
				});
			});
			$(f).find('.grid-choosen-click').unbind('click').bind('click', function() {
				let regionInterface = new RegionInterface(),
					el = $(this);
				
				GridPickerPanel.init(null, function(res) {
					let datas = res.datas,
						lwIndex = res.layerWindowIndex,
						grids = datas.grids,
						ids = null;
					
					if (grids) {
						ids = grids.ids;
					} else {
						layer.msg('请选择区域网格！', {icon: 5});
						return false;
					}
					
					if (ids.split(',').length > 1) {
						layer.msg('应急队伍所属网格的选择只支持单选', {icon: 5});
						return false;
					}
					layer.close(lwIndex);
					regionInterface.gridDetail(ids, function(res) {
						el.html(res.name);
						form_grid_id = res.id;
						form_grid_name = res.name;
					})
				});
			});
			$('.vp-form-wrap').removeClass('hide');
			layerWindowId = layer.open({
				type: 1,
				title: (id ? '编辑' : '添加') + '志愿者队伍',
				skin: 'layui-layer-demo', //样式类名
				closeBtn: 1, //不显示关闭按钮
				anim: 2,
				shadeClose: true, //开启遮罩关闭
				area : [ '700px', 'auto' ], //宽高
				content: $('.vp-form-wrap'),
				end: function() {
					layer.close(layerWindowId);
				}
			});
			
			$('.vp-form-box form').validate({
			    rules: {
			    	name: {
			            required: true,
			            rangelength: [2,50],
			        }
			    },
			    messages: {
			    	name: {
			            required: icon+'请输入名称',
			            rangelength: icon+'输入长度为2-50个字符'
			        }
			    }, 
			    submitHandler: function(form){
			    	let submitObj = $(form).serializeObject();
			    	
			    	if (!form_grid_id) {
			    		layer.msg('请选择所属网格！', {icon: 5});
			    		return false;
			    	}
			    	
			    	if (!form_grid_tags) {
			    		layer.msg('请选择队伍标签！', {icon: 5});
			    		return false;
			    	}
			    	submitObj.gridId = form_grid_id;
			    	submitObj.gridName = form_grid_name;
			    	submitObj.tags = form_grid_tags;
			    	volunteerProcessionInterface.save({
			    		data: JSON.stringify(submitObj)
			    	}, function() {
				    	layer.close(layerWindowId);
			    		loadVpPages({
							page: 1,
							limit: 10
						}, submitObj.id);
						loadAggregationGrids();
			    	})
			    	return false;
			    }    
			});
			$.ajaxSettings.async = true;
				
		},
		event_clickVp = function() {
			$('#volunteer-procession-manage ul.list-group > li').unbind('click').bind('click', function() {
				var dataId = $(this).attr('data-id');
				
				$('li.list-group-item').removeClass('selected');
				$('li.list-group-item[data-id="' + dataId + '"]').addClass('selected');
				
				loadInfo(dataId);
			});
			$($('#volunteer-procession-manage ul.list-group > li')[0]).click();
		};
		init = function() {
			volunteerProcessionInterface = new VolunteerProcessionInterface();
			volunteerTeamInterface = new VolunteerTeamInterface();
			loadVpPages({
				page: 1,
				limit: 10
			});
			loadAggregationGrids();
		};
		
	return {
		init: init
	};
	
}());