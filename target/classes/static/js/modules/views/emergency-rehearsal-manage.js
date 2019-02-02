let emergencyRehearsalFn = (function(){
	let over = 'false',
		userId = JSON.parse(CommonUtil.getHeaders().systemLoginUser).id,
		moduleName = null,
		formSelecter = '#emergency-rehearsal-searchform',
		volunteerCommentFn, teamCommnetFn,operationCodes,
		searchTime = {},
		init = function(data){
			over = data.over;
			operationCodes = data.operationCodes
			searchTime = data.searchTime?data.searchTime:{};
			moduleName = over=='true'?'already-rehearsal':'to-be-rehearsal';
			volunteerCommentFn = new emeRehlVolunteerPanel();
			teamCommnetFn = new emeRehlVolunteerPanel();
			laydate.render({
				  elem: '#em-s-startTime',
				  type: 'datetime',
				  theme: '#0069b6',
				  value: new Date().Format('yyyy-MM-dd hh:mm:ss'),
				  done: function(value){
					  searchTime.startTime = value;
				  }
			});
			laydate.render({
				  elem: '#em-s-endTime',
				  type: 'datetime',
				  theme: '#0069b6',
				  value: new Date().Format('yyyy-MM-dd hh:mm:ss'),
				  done: function(value,date){
					  searchTime.endTime = value;
				  }
			});
			$('#'+moduleName+' table').footable();
			$('.emergency-rehearsal .nav-tabs li').on('click',function(){
				over = $(this).attr('data-over');
				moduleName = over=='true' ? 'already-rehearsal' : 'to-be-rehearsal';
				/*search();*/
				goPage('index',{over:over})
			});
			
			$(formSelecter+ ' .reset').on('click',function(){
				goPage('index',{over:over})
			});
			$(formSelecter+ ' .search').on('click',function(){
				search();
			});
			$('#'+moduleName+' .remove').on('click',function(){
				let id = $(this).attr('data-id');
				operation({
					moduleName: 'emergency-rehearsal', 
					oper: 'remove', 
					params: {id: id}
				},function(){
					goPage('index');
					layer.msg('删除成功',{icon: 6, time: 2000});
				});
			});
			$('#'+moduleName+' .comment').on('click',function(){
				let id = $(this).attr('data-id'),
					commanderIds = $(this).attr('data-commanderIds');
					
				emergencyRehearsalInterFace.getComments({drillEventId: id,url:'emergency-rehearsal/getComments'},function(res){
					showComments({comments: res, id: id,commanderIds: commanderIds});
				});
				
			});
			$('#' + moduleName+' .team-comment').on('click',function(){
				let id = $(this).parent().attr('data-id'),
					commanderIds = $(this).parent().parent().attr('data-commanderIds');

				teamCommnetFn.init({commentType:'ert-comment',drillEventId:id,commanderIds:commanderIds});
				
			});
			$('#' +moduleName+' .volunteer-comment').on('click',function(){
				let id = $(this).parent().attr('data-id'),
					commanderIds = $(this).parent().parent().attr('data-commanderIds');
				
				volunteerCommentFn.init({commentType:'erv-comment',drillEventId:id,getSub:'true',commanderIds:commanderIds});	
			});
			if (moduleName == 'to-be-rehearsal') {
				$('#' + moduleName + ' a.relate-procession').unbind('click').bind('click', function() {
					let dataId = $(this).attr('data-id');
					
					ProcessionChoosenload.init({
						id: dataId,
						operationCodes: operationCodes
					})
					
				});
			}
			
		},
		search = function(){
			let searchObj = $(formSelecter).serializeObject();
			
			/*searchObj.startTime = searchTime.startTime ? new Date(searchTime.startTime).getTime() : null;
			searchObj.endTime = searchTime.endTime ? new Date(searchTime.endTime).getTime() : null;
			if(searchObj.endTime && searchObj.startTime && searchObj.endTime <= searchObj.startTime) {
				layer.msg('演练结束时间应晚于演练开始时间',{icon:5});
				return false;
			}*/
			searchObj.over = over;
			goPage('index',searchObj);
		},
		getPage = function(data){
			emergencyRehearsalInterFace.getPage(data,function(res){
				let tpl = emergency_rehearsal_datas.innerHTML,
					view = $('#'+moduleName);
				laytpl(tpl).render(res, function(html){
					let comprehensive = res.comprehensive?result.comprehensive:[];
					view.html(html);
					if(res.pages.totalCount > 0){
						initTable({
							modelName: 'emergency-rehearsal',
							curr: res.pages.currentPage,
							totalPage: res.pages.totalPageNum,
							totalCount: res.pages.totalCount,
							limit:res.pages.limit
						});
					};
				});
			});
		},
		showComments = function(data){
			let tpl = emergencyRehearsalTpl.innerHTML,
				view  = $('#emergency-rehearsal-view');
			
			data.submit = "false";
			if(data.commanderIds.split(',').indexOf(userId) != -1){
				if(data.comments.length>0){
					data.submit = "true";
					data.comments.forEach(function(value){
						if(value.chargePersonId == userId){
							data.submit = "false";
						}
					});
				} else {
					data.submit = "true";
				}
				console.log('data.submit',data.submit)
			};
			console.log()
			laytpl(tpl).render(data, function(html){
				view.html(html);
			});
			let lwIndex = layer.open({
				type: 1,
				title: '演练点评',
				skin: 'layui-layer-demo', //样式类名
				closeBtn: 1, //是否显示关闭按钮
				anim: 2,
				shadeClose: false, //是否开启遮罩关闭
				area : [ '600px', 'auto' ], //宽高
				content: '<div class="emergency-rehearsal-open">' + $('#emergency-rehearsal-comment-panel').html() + '</div>',
				end: function() {
					layer.close(lwIndex);
				}
			});
			
			$(".emergency-rehearsal-open #emergency-rehearsal-comment-form").validate({
		        rules: {
		        	defect:{
		        		 required: true,
		        		 rangelength: [0,200]
		        	},
		        	review: {
		        		required: true,
		        		rangelength: [0,200]
		        	}
		        },
		        messages: {
		        	defect: {
		        		required: icon+'请输入发现的问题',
		        		rangelength: icon + "输入长度不大于200个字符"
		        	},
		        	review: {
		        		required: icon+'请输入演练总结',
		        		rangelength: icon + "输入长度不大于200个字符"
		        	}
		        },
		        submitHandler:function(form){
		        	let saveObj = $(form).serializeObject();
		        	 
		        	saveObj.chargePersonId = JSON.parse(CommonUtil.getHeaders().systemLoginUser).id;
		        	saveObj.drillEventId = data.id;
		        	layer.confirm('提交后不能编辑，确认提交？', {
					    btn: ['确认','取消'], //按钮
					    shade: true 
					}, function(){
						emergencyRehearsalInterFace.saveComment(saveObj,function(res){
			        		layer.closeAll();
			        		layer.msg('点评提交成功！',{icon:6});
			        	});
					});
		        	
		        } 
			});
			
		};
		
	return {
		init:init
	}
}())