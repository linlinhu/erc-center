let VolunteerTeam = (function() {
	let moduleName, groupTypeName, groupType,groupId,scope,operationCodes,
		teamGetData = new VolunteerTeamInterface();
	
		function init(ops) {
			let msg,teamList = ops.teamList?ops.teamList:[];
					
			moduleName = ops.moduleName;
			groupTypeName = ops.groupTypeName;
			groupType = ops.groupType;
			scope = ops.scope;
			operationCodes = ops.operationCodes;
			if(groupType == 2){
				 msg = '社会团队';
			} else if(groupType == 3){
				 msg = '专业团队';
			}else if(groupType == 4){
				 msg = '企业团队';
			}
			if(moduleName == 'volunteer-team'){
				VolunteerInterface.getScopes(function(res){
					let html = '<option value="">全部</option>';
					res.forEach(function(value,index,array){
						html += '<option value="' + value.k + '">' + value.v + '</option>'
					});
					$('.'+ moduleName + ' select[name="scope"]').html(html);
					$('.'+ moduleName + ' select[name="scope"]').val(scope);
				});
				$('.'+ moduleName + ' select[name="scope"]').change(function(){
					scope = $('.'+ moduleName + ' select[name="scope"]').val();
					goPage('index',{scope:scope});
				})
			};
			
			if(ops.groupId && ops.groupId!=''){
				$('.'+ moduleName +' .team-title .title[data-id="'+ops.groupId+'"]').addClass('actived');
			} else {
				$($('.'+ moduleName +' .team-title .title')[0]).addClass('actived');
			}
			groupId = $('.'+ moduleName +' .team-title .actived').attr('data-id');
			$('.'+ moduleName +' input[name="groupId"]').val(groupId);
			if(groupId){
				refreshTeam({groupId:groupId,name:ops.name});
				$('.'+ moduleName +' .team-center').removeClass('hide');
				$('.'+ moduleName +' .tips').addClass('hide');
			} else {
				$('.'+ moduleName +' .team-center').addClass('hide');
				$('.'+ moduleName +' .tips').removeClass('hide');
			}
			$('.'+ moduleName).on('click','.importTeam',function(){
				layer.msg('团队的批量导入功能正在开发中。。。');
			});
			$('.'+ moduleName).on('click','.import-v',function(){
				layer.msg('志愿者的批量导入功能正在开发中。。。');
			});
			$('.'+ moduleName).on('click','.removeMember-icon',function() {
				let id = $(this).attr('data-id');
				operation({
					moduleName: 'volunteer',
					oper: 'remove',
					params: {
						id: id
					}
				},function(){
					layer.closeAll();
					refreshTeam({groupId:groupId});
					layer.msg('删除成功！', {icon: 6, time: 2000});
					
				})
			});
			$('.'+ moduleName).on('click','.detail-icon',function() {
				let view  = null,
					tpl = volunteer_detail_data.innerHTML,
					lwIndex = null;
				
				$('#volunteer-detail').removeClass('hide');
				teamGetData.getVolunteerDetail($(this).attr('data-id'),function(result){
					layer.close(lwIndex);
					lwIndex = layer.open({
						type: 1,
						title: '志愿者详情',
						skin: 'layui-layer-demo', //样式类名
						closeBtn: 1, //不显示关闭按钮
						anim: 2,
						shadeClose: false, //开启遮罩关闭
						area : [ '760px', '540px' ], //宽高
						content: $('#volunteer-detail'),
						end: function() {
							layer.close(lwIndex);
						}
					});
					view = $('#volunteer-detail');
					laytpl(tpl).render(result, function(html){
						let comprehensive = result.comprehensive;
						view.html(html);
						$('#volunteer-detail .volunteerStatus-btns').addClass('hide');
						if(comprehensive.length > 0){
							comprehensive.forEach(function(value,index,array){
								$('#skill-assess .ionrange-'+index).ionRangeSlider({
									min: 0,
						            max: 100,
						            from: value.score,
						            postfix: "分",
						            disable: true,
						            hasGrid: true
						        });
							});
						}
					});
				});
			});
			$('.'+ moduleName +' .team-title').on('click','.title',function() {
				groupId = $(this).attr('data-id');
				$('.'+ moduleName +' input[name="groupId"]').val(groupId);
				$(this).parent().children().removeClass('actived');
				$(this).addClass('actived');
				refreshTeam({groupId:groupId});
			});
			$('.'+ moduleName).on('click','.batch-operation',function() {
				openBatchOperation()
			});
			$('.'+ moduleName).on('click','.single-operation',function() {
				closeBatchOperation()
			});
			$('.'+ moduleName).on('click','.addTeam',function(){
				
				showTeamFrom({className:'volunteerTeamPanel-open',groupType:ops.groupType,msg:msg});
			});
			$('.'+ moduleName).on('click','.addVolunteer',function(){
				goPage('form',{groupId:groupId,groupType:groupType});
			});
			
			$('.'+ moduleName).on('click','.editTeam',function(){
				let data = JSON.parse($(this).attr('data-value'));
				showTeamFrom({data:data,className:'volunteerTeamPanel-open',groupType:ops.groupType,msg:msg});
			});
			
			$('.'+ moduleName).on('click','.dismissal',function(){
				layer.confirm('确认淘汰？', {
				    btn: ['确认','取消'], //按钮
				    shade: true 
				}, function(){
					teamGetData.dismissal({id:groupId},function(res){
						layer.closeAll();
				    	goPage('index',{groupId:groupId,scope:scope});
						layer.msg('淘汰成功！', {icon: 6, time: 2000});
					});
				});	
			});
			$('.'+ moduleName).on('click','.employment',function(){
				layer.confirm('确认录用？', {
				    btn: ['确认','取消'], //按钮
				    shade: true 
				}, function(){
					teamGetData.employment({id:groupId},function(res){
						layer.closeAll();
				    	goPage('index',{groupId:groupId,scope:scope});
						layer.msg('录用成功！', {icon: 6, time: 2000});
					});
				});	
			});
			
			$('.'+ moduleName).on('click','.filter-line button[role="submit"]',function(){
				let searchParams = $('#' + moduleName + '-searchform').serializeObject();
				searchParams.limit = 10;
				if (searchParams.name) {
    				teamGetData.getVolunteers(searchParams,function(res){
    					showVolunteers(res);
    				});
    			} else {
    				layer.msg('请键入关键字后进行搜索。', {icon: 5});
    			}
			});
			$('.'+ moduleName + ' form').unbind('keydown').bind('keydown', function(e) {
				var theEvent = e || window.event;
				var code = theEvent.keyCode || theEvent.which || theEvent.charCode;
				if (code == 13) {
					CommonUtil.formDataSetAndGet({
		    			container: $('#' + moduleName + '-searchform')
		    		}, function(p) {
		    			let searchParams = p;
		    			searchParams.limit = 10;
		    			if (searchParams.name) {
		    				teamGetData.getVolunteers(searchParams,function(res){
		    					showVolunteers(res);
		    				});
		    			} else {
		    				layer.msg('请键入关键字后进行搜索。', {icon: 5});
		    			}
		    		});
					return false;
				}
				return true;
			});
			$('.'+ moduleName).on('click','.filter-line button[role="reset"]',function(){
				let searchParams = $('#' + moduleName + '-searchform').serializeObject();
				searchParams.limit = 10;
				$('#' + moduleName + '-searchform input[name="name"]').val('');
				searchParams.name = null;
				teamGetData.getVolunteers(searchParams,function(res){
					showVolunteers(res);
				});
			});
			$('.'+ moduleName).on('click','.volunteerChangeTeam',function(){
				let teamListEl = $('.'+ moduleName + ' .team-title .title'),
					activedGroupId = $('.'+ moduleName + ' .team-title .actived').attr('data-id'),
					id = $(this).attr('data-id');
				teamList = [];
				for(let i = 0; i < teamListEl.length; i++) {
					let teamId = $(teamListEl[i]).attr('data-id'),
						teamName = $(teamListEl[i]).html();
					if(teamId != activedGroupId) {
						teamList.push({id:teamId,name:teamName})
					}
					
				}
				changeTeam({id:id,data:teamList,msg:msg});
			});
			$('.'+ moduleName).on('click','.BatchRemove',function(){
				BatchRemove();
			});
			
		};
		function openBatchOperation(ops) {
			
			$('.'+ moduleName +' .btn-group-1').addClass('hide');
			$('.'+ moduleName +' .btn-group-2').removeClass('hide');
			$('.'+ moduleName +' .team-member .removeMember-icon').addClass('hide');
			$('.'+ moduleName +' .team-member .checkbox-inline').removeClass('hide');
			$('.'+ moduleName +' .i-checks').iCheck({
			    checkboxClass: 'icheckbox_square-green',
			    radioClass: 'iradio_square-green',
			});
		};
		function closeBatchOperation(ops) {
			$('.'+ moduleName +' .btn-group-1').removeClass('hide');
			$('.'+ moduleName +' .btn-group-2').addClass('hide');
			$('.'+ moduleName +' .team-member .removeMember-icon').removeClass('hide');
			$('.'+ moduleName +' .team-member .checkbox-inline').addClass('hide');
			$('.'+ moduleName +' .i-checks input').removeAttr('checked');
		};
		function showTeamDetail(data){
			let tpl = teamDesDataTpl.innerHTML,
				view = $('.'+ moduleName +' .team-des');
			data.string = JSON.stringify(data);
			laytpl(tpl).render(data, function(html){
				view.html(html);
				if(moduleName == 'volunteer-team') {
					$('.'+ moduleName +' .team-des .scope').removeClass('hide');
					$('.'+ moduleName +' .team-des .volunteerTeamStatus-btns').removeClass('hide');
					$('.'+ moduleName +' .team-des .mixTeamNames').removeClass('hide');
					
					if(operationCodes.indexOf('dis-g') != -1){
						$('.'+ moduleName + ' .dismissal').removeClass('hide');
					} else {
						$('.'+ moduleName + ' .dismissal').addClass('hide');
					}
					if(operationCodes.indexOf('emp-g') != -1){
						$('.'+ moduleName + ' .employment').removeClass('hide');
					} else {
						$('.'+ moduleName + ' .employment').addClass('hide');
					}
				}
				if(operationCodes.indexOf('edit-g') != -1){
					$('.'+ moduleName + ' .editTeam').removeClass('hide');
				} else {
					$('.'+ moduleName + ' .editTeam').addClass('hide');
				}
			});
		}
		function showTeamFrom(data){
			let lwIndex = null;
			layer.close(lwIndex);
			lwIndex = layer.open({
				type: 1,
				title: data.data?('编辑'+data.msg +'信息 '):('添加'+data.msg),
				skin: 'layui-layer-demo', //样式类名
				closeBtn: 1, //显示关闭按钮
				anim: 2,
				shadeClose: true, //开启遮罩关闭
				area : [ '600px', '540px'], //宽高
				content: '<div class="'+ data.className +'">' + $('#volunteerTeamPanel').html() + '</div>',
				end: function() {
					layer.close(lwIndex);
				}
			});
			$('.'+ data.className+ ' form').attr('id','volunteerTeamForm');
			
			if(moduleName == 'volunteer-team'){
				$('.'+ data.className +' .mixTeam-div').removeClass('hide');
			} else {
				$('.'+ data.className +' .mixTeam-div').addClass('hide');
			};
			if(data.data) {
				$('.'+ data.className +' input[name="id"]').val(data.data.id);
				$('.'+ data.className +' input[name="scope"]').val(data.data.scope);
				$('.'+ data.className +' input[name="groupName"]').val(data.data.groupName);
				$('.'+ data.className +' input[name="groupEntityName"]').val(data.data.groupEntityName);
				$('.'+ data.className +' input[name="masterUserName"]').val(data.data.masterUserName);
				$('.'+ data.className +' input[name="masterUserIDNumber"]').val(data.data.masterUserIDNumber);
				$('.'+ data.className +' input[name="masterUserMobile"]').val(data.data.masterUserMobile);
				$('.'+ data.className +' input[name="groupEmail"]').val(data.data.groupEmail);
				$('.'+ data.className +' textarea[name="groupAddress"]').html(data.data.groupAddress);
				$('.'+ data.className +' input[name="mixTeamNames"]').val(data.data.mixTeamNames);
				$('.'+ data.className +' input[name="mixTeamIds"]').val(data.data.mixTeamIds);
				if(operationCodes.indexOf('remove-g') != -1){
					$('.'+ data.className +' .cancel').removeClass('hide');
				} else {
					$('.'+ data.className +' .cancel').addClass('hide');
				}
				$('.'+ data.className +' .cancel').on('click',function(){
					layer.confirm('确认删除' + data.msg + '？', {
					    btn: ['确认','取消'], //按钮
					    shade: true //不显示遮罩
					}, function(){
						operation({
			        		'moduleName': 'volunteer-team', 
			        		'oper': 'remove',
			        		'params': {
			        			id:data.data.id
			        		}
			        	},function(){
			        		layer.closeAll();
					    	goPage('index',{scope:scope});
			        		layer.msg('删除成功！', {icon: 6, time: 2000});
			        	})
						
					});
				});
			} else {
				$('.'+ data.className +' .cancel').addClass('hide');
			};
			if(data.groupType == '4'){
				$('.'+ data.className +' .groupEntityName').removeClass('hide');
				$('.'+ data.className +' .groupEntityName input').removeAttr("disabled");
			}
			let volunteerProcession = {},
				formSelector = '#volunteerTeamForm';
			$(formSelector + ' .volunteerprocession-choosen-click').click(function(){
				
				ProceessionPickerPanel.init({
					title: '请选择志愿者团队关联应急队伍（多选）',
				}, function(data) {
					if(data.others.length >= 1){
						let ids = [],
							names = [],
							temp = [];
						data.others.forEach(function(value,index,array){
							temp = value.split('-');
							ids.push(temp[0]);
							names.push(temp[1]);
						});
						layer.close(data.layerWindowIndex);
						$(formSelector + ' .volunteerprocession-choosen-click').val(names.join(','));
						$(formSelector + ' input[name="mixTeamIds"]').val(ids.join(','));
					} else {
						layer.msg('至少选择一个应急队伍',{icon:5})
					}
					
				});
			});
			$('#volunteerTeamForm').validate({
			    rules: {
			    	groupName: {
			            required: true,
			            rangelength: [2,50],
			        },
			        groupEntityName: {
			            required: true,
			            rangelength: [2,50],
			        },
			        masterUserName: {
			            required: true,
			            rangelength: [2,20],
			        },
			        masterUserIDNumber: {
			            required: true,
			            rangelength: [18,18],
			            isIdCardNo: true
			        },
			        masterUserMobile: {
			        	required: true,
		                phone: true
			        },
			        groupEmail: {
		                email: true,
		                isEmail: true
		            },
		            groupAddress: {
		            	rangelength: [1,100],
		            }
			    },
			    messages: {
			    	groupName: {
			            required: icon+'请输入'+ data.msg +'名称',
			            rangelength: icon+'输入长度为2-50个字符'
			        },
			        groupEntityName: {
			            required: icon+'请输入企业名称',
			            rangelength: icon+'输入长度为2-50个字符'
			        },
			        masterUserName: {
			            required: icon+'请输入负责人姓名',
			            rangelength: icon+'输入长度为2-20个字符'
			        },
			        masterUserIDNumber: {
			            required: icon+'请输入负责人身份证号',
			            rangelength: icon+'输入长度为18个字符',
			            isIdCardNo: icon + '请填写18位有效的身份证号'
			        },
			        masterUserMobile: {
			        	required: icon + "请输入手机号码",
		                phone: icon + "请输入11位手机号码"
			        },
			        groupEmail: {
		                emial: icon + "请输入有效的电子邮箱",
		                isEmail: icon + "请输入有效的电子邮箱"
		            },
		            groupAddress: {
		                rangelength: icon+'输入长度不能大于100的字符'
		            }
			    },
			    cancelHandler: function(form){
			    	
			    } ,
			    submitHandler: function(form){
			    	var formData = $(form).serializeObject();
			    	
			    	formData.groupTypeName = groupTypeName;
			    	formData.groupType = groupType;
			    	formData.mixTeamIds = formData.mixTeamIds.split(',');
			    	
			    	operation({
		        		'moduleName': 'volunteer-team', 
		        		'oper': 'save',
		        		'params': {
		        			'data': JSON.stringify(formData)
		        		}
		        	},function(){
		        		layer.closeAll();
				    	goPage('index',{groupId:groupId});
				    	layer.msg('保存成功！', {icon: 6, time: 2000});
		        	})
			    	
			    }  
			});
			
		};
		function showVolunteers(data){
			let tpl = teamMemberDataTpl.innerHTML,
			view = $('.'+ moduleName +' .team-member');
			if(data.resultList.length == 0){
				view.html('暂无数据');
			} else {
				laytpl(tpl).render(data.resultList, function(html){
					view.html(html);
					if(operationCodes.indexOf('remove-v') == -1){
						$('.'+ moduleName +' .team-member .removeMember-icon').remove();
					};
					
					if(operationCodes.indexOf('change-g') == -1){
						$('.'+ moduleName +' .team-member .volunteerChangeTeam').remove();
					};
					if(operationCodes.indexOf('edit-v') == -1){
						$('.'+ moduleName +' .team-member .editMember').remove();
					}
					pageList({
						modelName: moduleName,
						totalCount: data.totalCount,
						limit: data.limit,
						limits: [12,24,36,48,60],
						curr: data.currentPage
						}, function(obj) {
							let searchParams = $('#' + moduleName + '-searchform').serializeObject();
							
							searchParams.limit = obj.limit;
							teamGetData.getVolunteers(searchParams,function(res){
								showVolunteers(res);
							});
							
					});
					$('.'+ moduleName +' input[name="page"]').val(data.currentPage);
				});
			}	
		};
		
		function changeTeam(ops) {
			/*var checkedList = $('.team-member input[type=checkbox]:checked');
			if(checkedList.length == 0) {
				layer.msg('请先选择待操作的志愿者！', {icon: 5});
			} else {*/
				
				let html  = '',
					activeTeamId = $('.' + moduleName + ' .team-title .actived').attr('data-id'),
					teamList = ops.data;
				if(teamList.length == 0){
					layer.alert('暂无其他'+ops.msg+'可供变更！', {icon: 5});
				} else {
					for(let i = 0; i < teamList.length; i++ ){
						html += ('<label class="checkbox-inline i-checks">'+
			                    	'<input type="radio" value="' + teamList[i].id + '" name="teamId">' + teamList[i].name +
					            '</label>');	
					};
					layer.open({
						type: 1,
						title: '选择接受志愿者的'+ops.msg,
						skin: 'layui-layer-demo', //样式类名
						closeBtn: 1, //显示关闭按钮
						btn: ['确认'],
						anim: 2,
						shadeClose: true, //开启遮罩关闭
						area : [ '360px', '270px' ], //宽高
						content:'<div class="wrapper-content changeTeam-open">'+ html + '</div>',
						yes: function(lindex){
							var newTeamId = $('.changeTeam-open input[name="teamId"]:checked').val();
							
							if (newTeamId) {
								layer.confirm('确认变更？', {
								    btn: ['确认','取消'], //按钮
								    shade: true //不显示遮罩
								}, function(){
									ops.newGroupId = newTeamId;
									delete ops.msg;
									delete ops.data;
									
									teamGetData.changeTeam(ops,function(res){
										layer.closeAll();
										layer.msg('变更成功！', {icon: 6, time: 2000});
										refreshTeam({groupId:groupId});
									})
									
								});
								
							} else {
								layer.alert('请选择目标'+ops.msg, {icon: 5});
							}
							return false;
						}
					});
					$('.i-checks').iCheck({
					    checkboxClass: 'icheckbox_square-green',
					    radioClass: 'iradio_square-green',
					});
				}			            
			/*}*/
		};
		function BatchRemove(){
			var checkedList = $('.team-member input[type=checkbox]:checked');
			
			
			if(checkedList.length == 0) {
				layer.msg('请先选择待操作的志愿者！', {icon: 5});
			} else {
				layer.confirm('确认批量删除志愿者？', {
				    btn: ['确认','取消'], //按钮
				    shade: true //不显示遮罩
				}, function(){
					layer.closeAll()
			    	goPage('index',{groupId:groupId,scope:scope});
					layer.msg('删除成功！', {icon: 6, time: 2000});
				});	            
			}
		};
		function refreshTeam(data){
			$('a[data-id="' + moduleName + '/index"]').attr('index-params',JSON.stringify({groupId:groupId,scope:scope}));
			teamGetData.getGroupDetail({id: groupId},function(res){
				let mixTeamInfos = res.mixTeamInfos?res.mixTeamInfos:[],
					mixTeamIds = [],
					mixTeamNames = [];
				
				if(mixTeamInfos.length > 0){
					mixTeamInfos.forEach(function(value, index, array){
						mixTeamIds.push(value.id);
						mixTeamNames.push(value.name);
					});
				} else {
					mixTeamNames = ['暂无'];
				};
				res.mixTeamIds = mixTeamIds.join(',');
				res.mixTeamNames = mixTeamNames.join(',');
				
				showTeamDetail(res);
			});
			teamGetData.getVolunteers(data,function(res){
				showVolunteers(res);
			});
		};
		this.init = init;	
});

