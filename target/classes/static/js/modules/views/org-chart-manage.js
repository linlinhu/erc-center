/**
 * 组织架构表现层
 * @creator 李丹Danica
 * @createTime 2018/3/21
 */
let orgChartManage = (function() {
	let ocm = '#org-chart-manage',
	 	f = '#org-chart-form',
		orgChartInterface = null,
		staffInterface = null,
		operationCodes = null,
		orgChartTreeLoad = function() {
			// 加载组织架构节点，初始化树
			orgChartInterface.findAll(null, function(res) {
				eminZtree({
					id: 'org-chart-tree',
					idKey: "id",
					pIdKey: "parentId",
					sync: {
						zNodes: res,
						expandAll: true	
					},
					diyDom: function(treeId, treeNode) {
						let html = '';
						
						if(operationCodes.indexOf('add') != -1){
							html += '<a href="javascript:;" class="action add" data-id="' + treeNode.id + '" style="margin:0 0 0 5px;" alt="添加下级组织" title="添加下级组织"><i class="fa fa-plus"></i></a>';
						};
						if(operationCodes.indexOf('edit') != -1){
							html += '<a href="javascript:;"  class="action update" data-id="' + treeNode.id + '" style="margin:0 0 0 5px;" alt="编辑" title="编辑"><i class="fa fa-pencil"></i></a>'
						};
						if(operationCodes.indexOf('remove') != -1){
							html += '<a href="javascript:;" class="action remove" data-id="' + treeNode.id + '" style="margin:0 0 0 5px;" alt="删除" title="删除"><i class="fa fa-trash"></i></a>'
						}
						$("#" + treeNode.tId + "_a").append(html);
						// 添加下级组织
						$('#' + treeNode.tId + '_a > a.add').unbind('click').bind('click', function() {
							$(f + ' form input[name="parentId"]').val($(this).attr('data-id'));
							
							loadForm();
						});
						// 编辑组织
						$('#' + treeNode.tId + '_a > a.update').unbind('click').bind('click', function() {
							loadForm($(this).attr('data-id'));
						});
						// 删除组织
						$('#' + treeNode.tId + '_a > a.remove').unbind('click').bind('click', function() {
							orgChartInterface.remove($(this).attr('data-id'), function() {
				        		orgChartTreeLoad();
				        	})
						});
					}
				}, function(zTree, treeNode, type) {
					if (type == 'click') {
						refreshRelateStaffs({
							orgId: treeNode.id,
							orgName: treeNode.name,
							limit: 10
						});
					}
				});
			});
		},
		loadForm = function(id) {
			let layerIndex = null,
				org_cp = null, // 负责人
				regionId = null; // 区域编号
			
			if (id) {
				orgChartInterface.detail(id, function(oc) {
					CommonUtil.formDataSetAndGet({
						container: f + " form",
						data: oc
					});
					if (oc.chargePersonName) {
						$(f + ' .chargeperson-choosen').html(oc.chargePersonName);
					}
					if (oc.region) {
						$(f + ' .grid-choosen').html(oc.region.name);
						regionId = oc.region.id;
					}
				});
			}
			
			$(f).removeClass('hide');
			layer.close(layerIndex);
			// 使用layer弹窗打开模板
			layerIndex = layer.open({
					type: 1,
					title: '添加网格',
					skin: 'layui-layer-demo', //样式类名
					closeBtn: 1, //不显示关闭按钮
					anim: 2,
					shadeClose: true, //开启遮罩关闭
					area : [ '784px', 'auto' ], //宽高
					content: $(f),
					end: function() {
						layer.close(layerIndex);
					}
			});
			$(f + ' .chargeperson-choosen').unbind('click').bind('click', function() {
				staffInterface = new StaffInterface();
				StaffsChoosenTpl.init({
					title: '选择一个负责人(单选)'
				}, function(res) {
					let ids = res.ids,
						others = res.others,
						lwIndex = res.layerWindowIndex;
					
					if (others.length > 1) {
						layer.msg('请注意提示，只能选择一个负责人！', {icon: 5});
						return false;
					}
					layer.close(lwIndex);
					staffInterface.detail(ids, function(res) {
						$(f + ' .chargeperson-choosen').html(res.realName);
						org_cp = res;
					})
				});
			});
			
			$(f + ' .grid-choosen').unbind('click').bind('click', function() {
				regionInterface = new RegionInterface();
				regionPicker.init({
					title: '选择所属区域(单选)'
				}, function(res) {
					regionId = res.id;
					$(f + ' .grid-choosen').html(res.name);
				});
			});
			$(f + " form").validate({
		        rules: {
		        	name: {
		                required: true,
		                rangelength: [2,20]
		            }
		        },
		        messages: {
		        	name: {
		                required: icon + "请输入组织架构名称",
		                rangelength: icon + "组织架构名称输入长度限制为2-20个合法字符"
		            }
		        },
		        submitHandler:function(form){
		        	let saveObj = $(f + " form").serializeObject();
		        	if (org_cp) {
			        	saveObj.chargePersonId = org_cp.id;
			        	saveObj.chargePersonName = org_cp.realName;
			        	saveObj.idNumber = org_cp.idNumber;
			        	saveObj.mobile = org_cp.mobile;
		        	} else {
		        		
		        		layer.msg('请选择一个负责人', {icon: 5});
		        		return false;
		        	}
		        	if (regionId) {
		        		saveObj.regionId = regionId;
		        	} else {
		        		layer.msg('请选择一个所属区域', {icon: 5});
		        		return false;
		        	}
		        	orgChartInterface.save({
		        		data: JSON.stringify(saveObj)
		        	}, function() {
		        		layer.msg('保存成功！');
		        		layer.close(layerIndex);
		        		orgChartTreeLoad();
		        	})
		        } 
			});
		},
		sformDatasSetAndGet = function(obj, callback) {
			view = $('#org-staffs-view');
			$.each(view.find('input[role="user-params"]'), function() {
				let el = $(this);
				for (variable in obj) {
					if (el.attr('name') == variable) {
						el.val(obj[variable]);
					}
				}
			});
			if (typeof callback == 'function') {
				callback($(view.find('form')[0]).serializeObject());
			}
		},
		refreshRelateStaffs = function(p) {
			let tpl = org_staffs_datas.innerHTML,
				view = $('#org-staffs-view'),
				paging = $('#org-staffs-page');
			
			staffInterface.getPage(p, function(staffs) {
				let resultList = staffs.resultList;
					if(resultList && resultList.length > 0){
						for(var i = 0; i < resultList.length; i++) {
							let temp = [];
							resultList[i].personOrg.forEach(function(value,index,array){
								temp.push(value.orgId);
							})
							resultList[i].orgIds = temp.join(',');
						};
					}
				
				laytpl(tpl).render({
					params: p,
					list: resultList
				}, function(html){
					view.html(html);
					view.find('table').footable();
					if (staffs.totalPageNum && staffs.totalPageNum > 1) {
						laypage.render({
							elem: 'org-staffs-page', //注意，这里的 test1 是 ID，不用加 # 号
							count: staffs.totalCount, //数据总数 //从服务端得到
							limit: staffs.limit,
							curr: staffs.currentPage,
							theme: '#0069b6',
						  	layout: ['count', 'prev', 'page', 'next', 'limit', 'skip'],
							jump : function(obj, first) {
								if(!first) {
									sformDatasSetAndGet({
										page: obj.curr,
										limit: obj.limit
									}, function(p) {
										refreshRelateStaffs(p);
									});
								}
							}
						});
					}
					view.find('button[role="submit"]').unbind('click').bind('click', function() {
						CommonUtil.formDataSetAndGet({
			    			container: '#org-staffs-view form'
			    		}, function(p) {
			    			if (p.keyword) {
				    			refreshRelateStaffs(p);
			    			} else {
			    				layer.msg('请键入关键字后进行搜索。', {icon: 5});
			    			}
			    		});
					});
					
					view.find('button[role="reset"]').unbind('click').bind('click', function() {
						CommonUtil.formDataSetAndGet({
			    			container: '#org-staffs-view form',
			    			data: {
								page: 1,
								limit: 10,
								keyword: ''
			    			}
						}, refreshRelateStaffs);
					});
					
					$('#org-staffs-view form').unbind('keydown').bind('keydown', function(e) {
						var theEvent = e || window.event;
						var code = theEvent.keyCode || theEvent.which || theEvent.charCode;
						if (code == 13) {
							CommonUtil.formDataSetAndGet({
				    			container: '#org-staffs-view form'
				    		}, function(p) {
				    			if (p.keyword) {
					    			refreshRelateStaffs(p);
				    			} else {
				    				layer.msg('请键入关键字后进行搜索。', {icon: 5});
				    			}
				    		});
							return false;
						}
						return true;
					});
					
					view.find('button[role="add-staffs"]').unbind('click').bind('click', function() {
						StaffsChoosenTpl.init({
							title: '添加工作人员到当前组织'
						}, function(res) {
							let ids = res.ids,
								others = res.others,
								lwIndex = res.layerWindowIndex;
							
							sformDatasSetAndGet(null, function(res) {
								orgChartInterface.relateStaffs({
									personIds: ids,
									orgId: res.orgId,
									orgName: res.orgName
								}, function() {
									layer.close(lwIndex);
									layer.msg('关联成功', {icon: 6});
									refreshRelateStaffs(res);
								})
							});
							
						});
					});
					
					view.find('button[role="remove-staffs"]').unbind('click').bind('click', function() {
						CommonUtil.getIdsOfEls($(ocm + ' input[name="org-staff-checkbox"]:checked'), function(ids) {
							sformDatasSetAndGet(null, function(res) {
								orgChartInterface.removeStaffs({
									personIds: ids,
									orgId: res.orgId
								}, function() {
									layer.msg('删除成功', {icon: 6});
									refreshRelateStaffs(res);
								})
							});
						});
					});
					
					view.find('button[role="exchange-staffs"]').unbind('click').bind('click', function() {
						let currentOrgId = null;
						
						sformDatasSetAndGet(null, function(res) {
							currentOrgId = res.orgId;
						});
						if (!currentOrgId) {
							layer.msg('未选中组织架构！');
							return false;
						}
						CommonUtil.getIdsOfEls($(ocm + ' input[name="org-staff-checkbox"]:checked'), function(ids) {
							let personOrgIdList = $(ocm + ' input[name="org-staff-checkbox"]:checked'),
								personOrgIds = [];
							
							for(let i = 0; i < personOrgIdList.length; i++ ){
								let temp = $(personOrgIdList[i]).attr('data-orgIds').split(',')
								personOrgIds = personOrgIds.concat(temp);
							};
							personOrgIds = dedupe(personOrgIds);
							function dedupe(array){
								 return Array.from(new Set(array));
							};
							
							orgChartPicker.init({
								title: '选择移交组织（单选）',
								disabledIds: personOrgIds
							}, function(org) {
								sformDatasSetAndGet(null, function(res) {
									orgChartInterface.exchangeStaffs({
										personIds: ids,
										oldOrgId: res.orgId,
										orgId: org.id,
										orgName: org.name
									}, function() {
										layer.msg('移交成功', {icon: 6});
										refreshRelateStaffs(res);
									})
								});
							});	
						});
					});
				});
			});
		},
		init = function(p) {
			orgChartInterface = new OrgChartInterface();
			staffInterface = new StaffInterface();
			operationCodes = p.operationCodes;
			orgChartTreeLoad();
		};
	
	return {
		init: init
	}
}());