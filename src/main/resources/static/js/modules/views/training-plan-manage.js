const convertToTime = function(o) {
		return new Date(o.year + '-' + o.month + '-' + o.date + ' ' + o.hours + ':' + o.minutes + ':' + o.seconds).getTime();
	},
	convertToRange = function(startTime, endTime) {
	
		 return new Date(startTime).Format('yyyy-MM-dd hh:mm:ss') + ' - ' + new Date(endTime).Format('yyyy-MM-dd hh:mm:ss');
	};
let FeedBackManage = (function() {
	let lw = null,
		thingId = null,
		thingName = null,
		thingType = null,
		layerIndex = null,
		trainingPlanInterface = null,
		loadAllCosts = function() {
			CostStaInterface.getAll({
				thingType: 2,
				thingId: thingId
			}, function(res) {
				let tpl = training_plan_cost_datas.innerHTML;
				
				laytpl(tpl).render({
					list: res
				}, function(html){
					$(lw + ' #tp-cost-list > .panel-body').html(html);
					$(lw + ' form.train-costs-form').find('button[role="save"]').unbind('click').bind('click', function() {
						CommonUtil.formDataSetAndGet({
							container: lw + ' form.train-costs-form'
						}, function(res) {
							let items = [],
								itemIds = res.itemIds,
								itemNames = res.itemNames,
								itemBudgets = res.itemBudgets,
								finalTotals = res.finalTotals,
								isContainEmptyItem = false;
							
							if (typeof itemIds == 'string') {
								if (finalTotals) {
									items.push({
										id: itemIds,
										thingId: thingId,
										thingTitle: thingName,
										thingType: thingType,
										accountTitle: itemNames,
										estimatedTotal: itemBudgets,
										finalTotal: finalTotals
									});
								} else {
									isContainEmptyItem = true;
								}
							} else {
								for (let i = 0; i < itemIds.length; i++) {
									let accountTitle = itemNames[i],
										estimatedTotal = itemBudgets[i],
										id = itemIds[i],
										finalTotal = finalTotals[i];
									
									if (finalTotal) {
										items.push({
											id: id,
											thingId: thingId,
											thingTitle: thingName,
											thingType: thingType,
											accountTitle: accountTitle,
											estimatedTotal: estimatedTotal,
											finalTotal: finalTotal
										});
									} else {
										isContainEmptyItem = true;
									}
								}
							}
							if (isContainEmptyItem) {
								layer.msg('检测到有费用项内容未完善，保存操作被拦截！', {icon: 5});
								return false;
							}
					
							let saveIndex = 0;
							for (let i = 0; i < items.length; i++) {
								
								CostStaInterface.save(items[i], function() {
									saveIndex++;
									if (saveIndex == items.length) {
										layer.msg('保存成功!', {icon: 6});
										loadAllCosts();
									}
								})
							}
							return false;
						});
					});
				});
			});
		},
		openFeedbackFormPanel = function() {
			CommonUtil.formDataSetAndGet({
				container: lw + ' form.train-feedback-form',
				data: {
					id: '',
					peopleTotal: '',
					startTime: '',
					endTime: '',
					tpfTimePeriod: '',
					summary: ''
				}
			});
			trainingPlanInterface.getFeedbackDetail(thingId, function(res) {
				res.tpfTimePeriod = convertToRange(res.startTime, res.endTime);
				CommonUtil.formDataSetAndGet({
					container: lw + ' form.train-feedback-form',
					data: res
				});
			});
			
			laydate.render({
				elem: lw + ' form.train-feedback-form .training-plan-feedback-time-period',
				type: 'datetime',
				range: true,
				done: function(value, bd, ed) {
					CommonUtil.formDataSetAndGet({
						container: lw + ' form.train-feedback-form',
						data: {
							startTime: convertToTime(bd),
							endTime: convertToTime(ed)
						}
					});
				}
			});
			$(lw).removeClass('hide');
			// 使用layer弹窗打开模板
			layerIndex = layer.open({
				type: 1,
				title: '培训反馈',
				skin: 'layui-layer-demo', //样式类名
				closeBtn: 1, //不显示关闭按钮
				anim: 2,
				shadeClose: true, //开启遮罩关闭
				area : [ '784px', 'auto' ], //宽高
				content: $(lw)
			});
			$(lw + ' form.train-feedback-form').find('button[role="save"]').unbind('click').bind('click', function() {
				CommonUtil.formDataSetAndGet({
					container: lw + ' form.train-feedback-form'
				}, function(res) {
					res.trainId = thingId;
					trainingPlanInterface.feedback(res, function(){
						layer.msg('反馈成功!', {icon: 6});
					})
				});
			});
			

			loadAllCosts();
		},
		init = function(p) {
			
			trainingPlanInterface = new TrainingPlanInterface();
			lw = p.lw;
			thingId = p.thingId;
			thingName = p.thingName;
			thingType = p.thingType;
			
			openFeedbackFormPanel();
		};
		
	return {
		init: init
	}
}());

let BudgetManage = (function() {
	let layerIndex = null,
		thingId = null,
		thingType = null,
		lw = null, // 费用项目操作容器
		loadBudgetItems = function() {
			$(lw + ' .budget-items').html('');
			CostStaInterface.getAll({
				thingType: thingType,
				thingId: thingId
			}, function(res) {
				res.map(r => addBudgetItem(r));
			});
		},
		addBudgetItem = function(p) {
			let tpl = training_plan_Budget_data.innerHTML;

			if ($(lw + ' .budget-items > div').length < 10) {
				laytpl(tpl).render(p, function(html){
					$(lw + ' .budget-items').append(html);
					$(lw).find('button[role="remove-budget-item"]').unbind('click').bind('click', removeBudgetItem);
				});
			} else {
				layer.msg('无法添加，费用预算被限制为最多10项', {icon: 5});
				return false;
			}
		},
		saveBudgets = function() {
			let items = [],
				fDatas = $(lw + ' form.budget-items').serializeObject(),
				itemIds = fDatas.itemId,
				itemNames = fDatas.itemName,
				itemBudgets = fDatas.itemBudget,
				isContainEmptyItem = false;
			
			if (typeof itemIds == 'string') {
				if (itemNames && itemBudgets) {
					items.push({
						id: itemIds,
						thingId: thingId,
						thingTitle: thingName,
						thingType: thingType,
						accountTitle: itemNames,
						estimatedTotal: itemBudgets
					});
				} else {
					isContainEmptyItem = true;
				}
			} else {
				for (let i = 0; i < itemNames.length; i++) {
					let accountTitle = itemNames[i],
						estimatedTotal = itemBudgets[i],
						id = itemIds[i];
					
					if (accountTitle && estimatedTotal) {
						items.push({
							id: id,
							thingId: thingId,
							thingTitle: thingName,
							thingType: thingType,
							accountTitle: accountTitle,
							estimatedTotal: estimatedTotal
						});
					} else {
						isContainEmptyItem = true;
					}
				}
			}
			if (isContainEmptyItem) {
				layer.msg('检测到有费用项内容未完善，保存操作被拦截！', {icon: 5});
				return false;
			}
	
			let saveIndex = 0;
			for (let i = 0; i < items.length; i++) {
				CostStaInterface.save(items[i], function() {
					saveIndex++;
					if (saveIndex == items.length) {
						layer.msg('保存成功!', {icon: 6});
						layer.close(layerIndex);
					}
				})
			}
		},
		removeBudgetItem = function() {
			let el = $(this),
				id = el.attr('data-id');
			
			if ($(lw + ' .budget-items > div').length > 1) {
				if (id) {
					CostStaInterface.remove(id, function() {
						el.parent().parent().remove();
					})
				} else {
					el.parent().parent().remove();
				}
			} else {
				layer.msg('无法移除，至少需要保留一项费用预算', {icon: 5});
			}
		},
		
		openBudgetFormPanel = function() {
				
			$(lw).removeClass('hide');
			// 使用layer弹窗打开模板
			layerIndex = layer.open({
				type: 1,
				title: '预算管理',
				skin: 'layui-layer-demo', //样式类名
				closeBtn: 1, //不显示关闭按钮
				anim: 2,
				shadeClose: true, //开启遮罩关闭
				area : [ '784px', 'auto' ], //宽高
				content: $(lw),
				end: function() {
					$(lw).find('button[role="add-budget-item"]').unbind('click').bind('click', null);
					$(lw).find('button[role="save"]').unbind('click').bind('click', saveBudgets);
				}
			});
			loadBudgetItems();
		},
		init = function(p) {
			
			thingId = p.thingId;
			thingName = p.thingName;
			thingType = p.thingType;
			lw = p.lw;
			openBudgetFormPanel();
			$(lw).find('button[role="add-budget-item"]').unbind('click').bind('click', addBudgetItem);
			$(lw).find('button[role="save"]').unbind('click').bind('click', saveBudgets);
		};
		
	return {
		init: init
	}
}());


let TrainingPlanManage = (function() {
	let trainingPlanInterface = null,
		tpInfo_vpIds = [];
	
	const m = '#training-plan-manage', 
		sf = '#training-plan-searchform',
		openFormPanel = function() {
			let id = $(this).attr('data-id'),
				lw = '#training-plan-form',
				layerIndex = null,
				rgEl = lw + " form .region-grid-choosen",
				vpEl = lw + " form .volunteer-procession-choosen",
				cpEl = lw + " form .chargeperson-choosen";
			
			laytpl(training_plan_form_data.innerHTML).render({
				test: '123'
			}, function(html){
				$(lw).html(html);
			});
			
			if (id) {
				trainingPlanInterface.detail(id, function(res) {
					console.dir(res);
					let team = res.team;
					
					if (team) {
						tpInfo_vpIds = team.split(',').map(t => t.split('|')[0]);
						res.teamIds = tpInfo_vpIds.join(',');
						res.teamNames = team.split(',').map(t => t.split('|')[1]).join(',');
					}
					
					res.tpTimePeriod = convertToRange(res.startTime, res.endTime);
					
					CommonUtil.formDataSetAndGet({
						container: lw + ' form',
						data: res
					});
					
					
					$(rgEl).html(res.regionName);
					$(vpEl).html(res.teamName);
					$(cpEl).html(res.chargePersonName);
				});
			}
			
			
			$(lw).removeClass('hide');
			// 使用layer弹窗打开模板
			layerIndex = layer.open({
				type: 1,
				title: id ? '编辑培训计划' : '添加培训计划',
				skin: 'layui-layer-demo', //样式类名
				closeBtn: 1, //不显示关闭按钮
				anim: 2,
				shadeClose: true, //开启遮罩关闭
				area : [ '784px', 'auto' ], //宽高
				content: $(lw)
			});
			
			$(lw + " form").validate({
		        rules: {
		        	title:{
		        		required: true,
		            	rangelength: [1,20],
		            	isName: true
		        	},
		        	regionName:{
		        		required: true
		        	},
		        	teamNames: {
		        		required: true
		        	},
		        	chargePersonName: {
		        		required: true
		        	},
		        	tpTimePeriod: {
		        		required: true
		        	},
		        	address: {
		        		required: true,
		            	rangelength: [1,50]
		        	}
		        },
		        messages: {
		        	title:{
		        		required: icon + "请输入培训名称",
		     	        rangelength: icon + "培训名称的长度介于2-20之间",
		     	        isName: icon + "不能以空格开始或结尾"
		        	},
		        	regionName: {
		        		required: icon + "请选择网格区域"
		        	},
		        	teamNames: {
		        		required: icon + "请选择应急队伍",
		        	},
		        	chargePersonName: {
		        		required: icon + "请选择一个负责人",
		        	},
		        	tpTimePeriod: {
		        		required: icon + "请选择培训时间",
		        	},
		        	address: {
		        		required: icon + "请输入培训地点",
		     	        rangelength: icon + "培训地点的长度介于2-50之间",
		        	}
		        },
		        submitHandler:function(form){
		        	let saveObj = $(form).serializeObject();
		        	delete saveObj['tpTimePeriod'];
		    		trainingPlanInterface.save(saveObj, function() {
		    			layer.close(layerIndex);
		    			goPage('index');
		    		})
		        	return false;
		        } 
			});
			// 选择所属区域网格
			$(rgEl).unbind('click').bind('click', function() {
				let el = $(this);
				GridPickerPanel.init({
					title: '请为培训计划选择一个区域或者一个网格(单选)',
					enableRegion: true
				}, function(res){
					let datas = res.datas,
						lwIndex = res.layerWindowIndex,
						regions = datas.regions,
						grids = datas.grids,
						fdata = {};
					
					if (regions && grids) {
						layer.msg('请注意提示，区域或者网格只能选择一种!', {icon: 5});
						return false;
					}
					
					if (regions && regions.length > 1 || grids && grids.length > 1) {
						layer.msg('请注意提示，只能选择一个区域或者一个网格!', {icon: 5});
						return false;
					}
					
					if (regions) {
						fdata = {
							regionType: 1,
							regionId: regions[0].id,
							regionName: regions[0].name
						};
					}
					
					if (grids) {
						fdata = {
							regionType: 2,
							regionId: grids.others[0].split('-')[0],
							regionName: grids.others[0].split('-')[1]
						};
					}
					
					CommonUtil.formDataSetAndGet({
						container: lw + ' form',
						data: fdata
					});
					el.html(fdata.regionName);
					$(rgEl).trigger('blur');
					layer.close(lwIndex);
					
				});
			});
			// 选择参与应急队伍
			$(vpEl).unbind('click').bind('click', function() {
				let el = $(this);
				
				ProceessionPickerPanel.init({
					title: '请选择培训计划关联应急队伍（多选）',
					checkedIds: tpInfo_vpIds
				}, function(res) {
					let ids = res.ids,
						others = res.others,
						lwIndex = res.layerWindowIndex,
						teamIds = [],
						teamNames = [];
					
					others.map(o => (teamIds.push(o.split('-')[0]),teamNames.push(o.split('-')[1])) );
					tpInfo_vpIds = teamIds.join(',');
					CommonUtil.formDataSetAndGet({
						container: lw + ' form',
						data: {
							teamIds: teamIds.join(','),
							teamNames: teamNames.join(',')
						}
					});
					el.html(teamNames.join(','));
					$(vpEl).trigger('blur');
					layer.close(lwIndex);
				})
			});
			// 选择负责人
			$(cpEl).unbind('click').bind('click', function() {
				let el = $(this);
				StaffsChoosenTpl.init({
					title: '选择培训计划关联负责人(单选)'
				}, function(res) {
					let ids = res.ids,
						others = res.others,
						lwIndex = res.layerWindowIndex;
					
					if (others.length > 1) {
						layer.msg('请注意提示，培训计划关联负责人只支持单选', {icon: 5});
						return false;
					}
					layer.close(lwIndex);
					CommonUtil.formDataSetAndGet({
						container: lw + ' form',
						data: {
							chargePersonId: others[0].split('-')[0],
							chargePersonName: others[0].split('-')[1],
							chargePersonMobile: others[0].split('-')[2]
						}
					});
					el.html(others[0].split('-')[1]);
					$(cpEl).trigger('blur');
				})
			});
			
			laydate.render({
				elem: lw + ' form .tp-time-period',
				type: 'datetime',
				range: true,
				min:0,
				done: function(value, bd, ed) {
					CommonUtil.formDataSetAndGet({
						container: lw + ' form',
						data: {
							startTime: convertToTime(bd),
							endTime: convertToTime(ed)
						}
					});
					setTimeout(function(){
						  $(lw + ' form .tp-time-period').trigger('blur');
					  },20)
				}
			});
		},
		init = function() {
			trainingPlanInterface = new TrainingPlanInterface();
			laydate.render({
				elem: '#tps-datePeriod',
				range: true,
				shadeClose: true,
				done: function(value, bd, ed) {
					CommonUtil.formDataSetAndGet({
						container: sf,
						data: {
							startTime: convertToTime(bd),
							endTime: convertToTime(ed)
						}
					});
				}
			});

			$(sf).find('input.volunteer-procession-choosen').unbind('click').bind('click', function() {
				ProceessionPickerPanel.init({
					title: '请选择应急队伍进行培训计划过滤查询（单选）',
					max: 1
				}, function(res) {
					let ids = res.ids,
						others = res.others,
						lwIndex = res.layerWindowId;
					
					if (others.length > 1) {
						layer.msg('注意提示，此处只允许单个应急队伍过滤查询哦', {icon: 5});
					}
					$(sf).find('input.volunteer-procession-choosen').trigger('blur')
					CommonUtil.formDataSetAndGet({
						container: sf,
						data: {
							vpName: others[0].split('-')[1],
							vpId: others[0].split('-')[0]
						}
					});
					layer.close(lwIndex);
				});
			});
			$(m + ' a[role="add"]').unbind('click').bind('click', openFormPanel);
			$(m + ' a[role="edit"]').unbind('click').bind('click', openFormPanel);
			$(m + ' a[role="remove"]').unbind('click').bind('click', function() {
				let id = $(this).attr('data-id');
				trainingPlanInterface.remove(id, function() {
					layer.msg('删除成功', {icon: 6});
				})
				
			});
			$(m + ' a[role="budget"]').unbind('click').bind('click', function() {
				let relateId = $(this).attr('data-id'),
					relateName = $(this).attr('data-name');
				
				BudgetManage.init({
					thingId: relateId,
					thingName: relateName,
					thingType: 2,
					lw: '#training-plan-budget-form'
				});
			});
			
			$(m + ' a[role="feedback"]').unbind('click').bind('click', function() {
				let relateId = $(this).attr('data-id'),
					relateName = $(this).attr('data-name');
				
				FeedBackManage.init({
					thingId: relateId,
					thingName: relateName,
					thingType: 2,
					lw: '#training-plan-feedback-form'
				});
			});
			
			$(m + ' a[role="assess"]').unbind('click').bind('click', function() {
				let relateId = $(this).attr('data-id');
			
				VolunteerAssessPanel.init({
					trainId: relateId
				});
			});
			
			
		};
	
	return {
		init: init
	}
}());