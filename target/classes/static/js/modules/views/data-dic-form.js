let DataDicForm = (function(){
		let isTreeEl = $('#data-dic-form input[name = "isTree"]'),
			isTree = isTreeEl.val(),
			itt = $('#isTreeToggle'),
			ddEditor = true,
			getGroupId = function() {
				return $('#data-dic-form input[name = "id"]').val();
			},
			getItemById = function(id, callback) {
				CommonUtil.ajaxRequest({
					url: 'data-dic/getItem',
					data: {
						id: id
					}
				}, function(res) {
					if (typeof res == 'string') {
						res = JSON.parse(res);
					}
					if (!res.success) {
						layer.msg('数据项详情查询失败！' + (res.message ? '原因是：' + res.message : ''), {icon:5});
					} else {
						if (typeof callback == 'function') {
							callback(res.result);
						}
					}
				});
			},
			lstItems = function() {
				var groupId = getGroupId();
				if (!groupId) {
					return false;
				}
				isTree = $('#data-dic-form input[name = "isTree"]').val();
				if (isTree == 'true') {
					treeItems(groupId);
				} else {
					tplItems(groupId);
				}
			},
			saveItem = function(data, callback) {
				var groupId = getGroupId();
				if (!groupId) {
					return false;
				}
				data.groupId = groupId;
				operation({
					moduleName: 'data-dic',
					oper: 'saveItem',
					params: {
						data: JSON.stringify(data)
					}
				}, function() {
					lstItems();
					layer.closeAll();
					if (typeof callback == 'function') {
						callback();
					}
				});	
			},
			removeItem = function(id) {
				operation({
					moduleName: 'data-dic',
					oper: 'removeItem',
					params: {
						id: id
					}
				}, function() {
					lstItems();
					layer.closeAll();
				});	
			},
			openDdItemForm = function(p) {
				let title = '';
					
				if (p.isTree) {
					if (p.type == 'addParent') {
						title = '添加根节点数据项';
					}
					if (p.type == 'addLeaf') {
						title = '添加数据项' + p.pname + '的子节点';
						$('#dd-item-form input[name="pid"]').val(p.pid);
					}

					if (p.type == 'edit') {
						title = '编辑数据项节点';
					}
				} else {
					title = (p.id ? '编辑' : '添加') + '数据项';
				};
				openInit(p);
				function openInit(p) {
					let lwIndex = null;
					layer.close(lwIndex);
					// 使用layer弹窗打开模板
					lwIndex = layer.open({
						type: 1,
						title: title,
						skin: 'layui-layer-demo', //样式类名
						closeBtn: 1, //不显示关闭按钮
						anim: 2,
						shadeClose: true, //开启遮罩关闭
						area : [ '500px', '350px' ], //宽高
						content: '<div class="dd-item-form-tpl">'+$('#dd-item-form-tpl').html()+'</div>',
						end: function() {
							layer.close(lwIndex);
						}
					});
					
					$('.dd-item-form-tpl form').attr('id','dd-item-form');
					if($('#data-dic-form input[name="isFillColor"]').val() == 'true') {
						$('#dd-item-form .fillColor').removeClass('hide');
						$('#dd-item-form input[name="fillColor"]').removeAttr('disabled');
					} else {
						$('#dd-item-form .fillColor').addClass('hide');
						$('#dd-item-form input[name="fillColor"]').attr('disabled','disabled');
					}
					if (p.id) {
						getItemById(p.id, function(item) {
							$('#dd-item-form input[name="id"]').val(item.id);
							$('#dd-item-form input[name="pid"]').val(item.pid);
							$('#dd-item-form input[name="valueType"]').val(item.valueType);
							$('#dd-item-form input[name="name"]').val(item.name);
							$('#dd-item-form input[name="code"]').val(item.code);
							$('#dd-item-form input[name="value"]').val(item.value);
							$('#dd-item-form input[name="fillColor"]').val(item.extend.fillColor);
							$('.fillColor .colorpicker-dd').colorpicker({color:item.extend.fillColor});
						})
					} else {
						$('#dd-item-form .fillColor .colorpicker-dd').colorpicker({color:'#ffffff'});
					}
					// 表单提交验证
					$('#dd-item-form').validate({
				        rules: {
				        	name: {
				                required: true,
				                rangelength: [2,30]
				            },
				            code: {
				                required: true,
				                rangelength: [2,30]
				            },
				            fillColor: {
				            	required: true
				            }
				        },
				        messages: {
				        	name: {
				                required: icon + "请输入数据项名",
				                rangelength: icon + "数据项名输入长度限制为2-30个合法字符"
				            },
				            code: {
				                required: icon + "请输入数据项码",
				                rangelength: icon + "数据项码输入长度限制为2-30个合法字符"
				            },
				            fillColor: {
				            	required: icon + "请选择色块颜色",
				            }
				        },
				        submitHandler:function(form){
				        	let formData = $('#dd-item-form').serializeObject();
				        	if(formData.fillColor) {
				        		formData.extend = {
				        			fillColor: formData.fillColor
				        		};
				        		delete formData.fillColor;
				        	};
				        	if(!(formData.value && formData.value.length > 0)){
				        		formData.value = formData.name;
				        	};
				        	
				        	saveItem(formData, function() {
				        		layer.msg(title + '成功！', {icon: 6});
				        		layer.closeAll();
				        	});
				        } 
					});
				};		
			},
			tplItems = function(groupId) {
				if (!groupId) {
					return false;
				}
				CommonUtil.ajaxRequest({
					url: 'data-dic/getItems',
					data: {
						gid: groupId
					}
				}, function(res) {
					if (typeof res == 'string') {
						res = JSON.parse(res);
					}
					if (!res.success) {
						layer.msg('数据项查询失败！' + (res.message ? '原因是：' + res.message : ''), {icon:5});
					} else {
						let tpl = dd_normal_items_datas.innerHTML,
							view = $('#dd-normal-items-view');
						
						laytpl(tpl).render(res.result, function(html){
							view.html(html);
							if(!ddEditor){
								$('#dd-normal-items .rgt-opers').remove();
							}
							$('#dd-normal-items a.goForm').unbind('click');
							$('#dd-normal-items a.goForm').bind("click", function() {
								var id = $(this).attr('data-id');
								
								openDdItemForm({
									isTree: false,
									id: id
								});
							});
							$('#dd-normal-items a.remove').bind("click", function() {
								var id = $(this).attr('data-id');
								removeItem(id);
							});
						});	
					}
				});
				
			},
			treeItems = function(groupId) {
				let treeId = 'dd-tree-items-view',
					addNode = function(e) {
						var zTree = $.fn.zTree.getZTreeObj(treeId),
							isParent = e.data.isParent,
							nodes = zTree.getSelectedNodes(),
							treeNode = nodes[0];
						
						if (treeNode) {
							openDdItemForm({
								isTree: true,
								type: 'addLeaf',
								pid: treeNode.id,
								pname: treeNode.name
							});
						} else {
							if (isParent) {
								openDdItemForm({
									isTree: true,
									type: 'addParent'
								});
							} else {
								layer.msg('请选择一个父级数据项节点', {icon: 5});
							}
						}
					},
					editNode = function() {
						var zTree = $.fn.zTree.getZTreeObj(treeId),
						nodes = zTree.getSelectedNodes(),
						treeNode = nodes[0];
						if (nodes.length == 0) {
							layer.msg("请先选择一个你要编辑的数据项节点", {icon: 5});
							return;
						}
						openDdItemForm({
							isTree: true,
							type: 'edit',
							id: treeNode.id
						});
					},
					removeNode = function() {
						var zTree = $.fn.zTree.getZTreeObj(treeId),
						nodes = zTree.getSelectedNodes(),
						treeNode = nodes[0];
						if (nodes.length == 0) {
							alert("请先选择一个你要删除的数据项节点");
							return;
						}
						removeItem(treeNode.id);
					};
				
				if (!groupId) {
					return false;
				}
				
				eminZtree({
					id: 'dd-tree-items-view',
					async: {
						url : 'data-dic/treeItems?gid=' + getGroupId(),
						expandAll: false,
						autoParam: ["id=pid", "groupId=gid"]
					}
				});
				
				$("#dd-tree-items a.addParent").bind("click", {isParent:true}, addNode);
				$("#dd-tree-items a.addLeaf").bind("click", {isParent:false}, addNode);
				$("#dd-tree-items a.edit").bind("click", editNode);
				$("#dd-tree-items a.remove").bind("click", removeNode);
				/*
				$("#dd-tree-items a.clearChildren").bind("click", clearChildrenNodes);*/
			};
			function toggleStatus(name){
				let el = $('#' + name +'Toggle');
				if(el.hasClass('fa-toggle-on')) {
					el.removeClass('fa-toggle-on').addClass('fa-toggle-off');
					$('#data-dic-form input[name = '+name+']').val('false');
				} else {
					el.removeClass('fa-toggle-off').addClass('fa-toggle-on');
					$('#data-dic-form input[name = '+name+']').val('true');
				};
			};
			function hideFillColorSwitch(){
				$('#data-dic-form .fillColor-switch').addClass('hide');
				$('#data-dic-form #isFillColorToggle').removeClass('fa-toggle-on').addClass('fa-toggle-off');
				$('#data-dic-form input[name = "isFillColor"]').val('false');
			};
			
		return {
			toggleOnTree() {
				itt = $('#isTreeToggle');
				itt.removeClass('fa-toggle-off').addClass('fa-toggle-on text-success');
				$('#data-dic-form input[name = "isTree"]').val('true');
				$('#dd-tree-items').removeClass('hide');
				$('#dd-normal-items').addClass('hide');
				groupId = $('#data-dic-form input[name = "id"]').val();
				$('#data-dic-form .fillColor-switch').addClass('hide')
				
				treeItems(groupId);
			},
			toggleOffTree() {
				itt = $('#isTreeToggle');
				itt.removeClass('fa-toggle-on').addClass('fa-toggle-off');
				$('#data-dic-form input[name = "isTree"]').val('false');
				$('#dd-tree-items').addClass('hide');
				$('#dd-normal-items').removeClass('hide');
				$('#data-dic-form .fillColor-switch').removeClass('hide');
				var groupId = getGroupId();
				tplItems(groupId);
			},
			toggleStatus:toggleStatus,
			init(data) {
				ddEditor = data.ddEditor;
				if(!ddEditor){
					$('.data-dic .ibox-title h5').html('数据字典组详情');
					$("#data-dic-form input").attr('readOnly','readOnly');
					$("#data-dic-form .opers").remove();
					$("#data-dic-form button").remove();
				}
				$("#data-dic-form").validate({
			        rules: {
			        	name: {
			                required: true,
			                rangelength: [2,40]
			            },
			            groupCode: {
			                required: true,
			                rangelength: [2,20]
			            }
			        },
			        messages: {
			        	name: {
			                required: icon + "请输入Group name",
			                rangelength: icon + "Group name输入长度限制为2-40个合法字符"
			            },
			            groupCode: {
			                required: icon + "请输入Group code",
			                rangelength: icon + "Group code输入长度限制为2-20个合法字符"
			            }
			        },
			        submitHandler:function(form){
			        	var formData = $("#data-dic-form").serializeObject();
			        	
			        	formData.extend = {
			        		isFillColor: formData.isFillColor,
			        		isMultiselect: formData.isMultiselect
			        	};
			        	
			        	delete formData.isMultiselect;
			        	delete formData.isFillColor;
			        	operation({
			        		'moduleName': 'data-dic', 
			        		'oper': 'save',
			        		'params': {
			        			'data': JSON.stringify(formData)
			        		}
			        	},function(){
			        		goPage('index');
			        		layer.msg('保存成功',{icon: 6, time: 2000});
			        	})
			        } 
				});
			}
		}
	}());
	
	