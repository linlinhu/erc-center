const emeRehlVolunteerPanel = (function(){
	let teamId,teamName,evaluateType,teamType,groupId,groupName,msg,drillEventId,commentType,volunteerId,volunteerName,commanderIds,
		userId,ops;
	
	userId = JSON.parse(CommonUtil.getHeaders().systemLoginUser).id;
	
	let init = function(data) {
		
		drillEventId = data.drillEventId;//演练Id
		commentType = data.commentType;//演练的类别
		commanderIds = data.commanderIds;//操作权限
		
		if(commentType == 'erv-comment'){
			msg = "应急演练队伍成员";
			evaluateType = 0;
			getTeamsAndSub(data);
		} else {
			msg = "应急演练队伍";
			evaluateType = 1;
			getTeams(data);
		};	
	},
	getTeams = function(data){//只获取队伍
		emergencyRehearsalInterFace.getTeams(data,function(res){
			let lwIndex = layer.open({
				type: 1,
				title: msg + '评分',
				skin: 'layui-layer-demo', //样式类名
				closeBtn: 1, //是否显示关闭按钮
				anim: 2,
				shadeClose: false, //是否开启遮罩关闭
				area : [ '860px', '500px' ], //宽高
				content: '<div class="emergency-rehearsal-open">' + $('#' + commentType + '-panel').html() + '</div>',
				end: function() {
					layer.close(lwIndex);
				}
			});
				
			if(res.length > 0 ){
				let html = '';
				
				teamType = res[0].teamType;
				res.forEach(function(value){	
					html += '<p class="teamName" data-id="' + value.teamId + '">' + value.teamName + '</p>'
				})
				$('.emergency-rehearsal-open .procession-datas').html(html);
			} else {
				$('.emergency-rehearsal-open .procession-datas').html('暂无数据');
			}
		
			$('.emergency-rehearsal-open .teamName').on('click',function(){
				if(!$(this).hasClass('actived')){
					teamId = $(this).attr('data-id');
					teamName = $(this).html();
					ops = {
							drillEventId: drillEventId,
							teamType: teamType,
							teamId: teamId,
							url:'emergency-rehearsal/findTeamEvaluate'
					}
					
					$('.emergency-rehearsal-open .teamName').removeClass('actived');
					$(this).addClass('actived');
					getComments(ops);
				};
			});
		});
	},
	getTeamsAndSub = function(data) {//获取队伍和队伍中的团体
		emergencyRehearsalInterFace.getTeams(data,function(res){
			let lwIndex = layer.open({
				type: 1,
				title: msg + '评分',
				skin: 'layui-layer-demo', //样式类名
				closeBtn: 1, //是否显示关闭按钮
				anim: 2,
				shadeClose: false, //是否开启遮罩关闭
				area : [ '760px', '500px' ], //宽高
				content: '<div class="emergency-rehearsal-open">' + $('#' + commentType + '-panel').html() + '</div>',
				end: function() {
					layer.close(lwIndex);
				}
			}),
				tpl = erv_team_datas_tpl.innerHTML,
				view = $('.emergency-rehearsal-open .procession-datas');
			
			if(res.length > 0 ){
				laytpl(tpl).render(res, function(html){
					view.html(html);
				});
				teamType = res[0].teamType;
			} else {
				view.html('暂无数据');
			}
			
			$('.emergency-rehearsal-open .team-items').hide();
			$('.emergency-rehearsal-open .team-pro h5').on('click',function(){
				if($(this).find('i').hasClass('fa-angle-down')){
					$(this).find('i').removeClass('fa-angle-down').addClass('fa-angle-left');
					$(this).parent().find('.team-items').hide();
				} else {
					$('.emergency-rehearsal-open .team-pro i').removeClass('fa-angle-down').addClass('fa-angle-left');
					$('.emergency-rehearsal-open .team-items').hide();
					$(this).find('i').removeClass('fa-angle-left').addClass('fa-angle-down');
					teamId = $(this).attr('data-teamid');
					teamName = $(this).text().trim();
					$(this).parent().find('.team-items').show();
				};
			});
			$('.emergency-rehearsal-open .team-items p').on('click',function(){
				if(!$(this).hasClass('actived')){
					groupId = $(this).attr('data-id');
					groupName = $(this).html();
					
					$('.emergency-rehearsal-open .team-items p').removeClass('actived');
					$(this).addClass('actived');
					if($(this).hasClass('subTeam')){
						getVolunteers({groupId:groupId});
					} else {
						groupId = null;
						groupName = null;
						getTeamVol({});
					};
					$('.emergency-rehearsal-open .comment-datas').html('请选择志愿者进行查询/评估');
					
				};
			});
		});
		
	},
	getVolunteers = function(data) {//获取团队志愿者
		let volunteerTeamInterface = new VolunteerTeamInterface();
		volunteerTeamInterface.getVolunteers(data,function(res){
			
			renderVolunteers(res);
		});
	},
	getTeamVol = function(data){//获取演练队伍中的个人志愿者
		data.mixTeamId = teamId;
		emergencyRehearsalInterFace.findTeamVol(data,function(res){
			
			for(let i = 0; i < res.resultList.length; i++){
				res.resultList[i].id = res.resultList[i].vid;
			};
			renderVolunteers(res);
		});
	},
	renderVolunteers = function(data){//渲染志愿者数据
		let html = '',
		volunteers = data.resultList;
		if(volunteers.length > 0){
			volunteers.forEach(function(value){
				html += '<p data-id="'+ value.id + '">' + value.realName + '</p>';
			});
			html = '<ul class="list-group">' + html + '</ul><div id="erv-comment-volunteer-page"></div>'
		} else {
			html = '暂无数据'
		};
		$('.emergency-rehearsal-open .volunteer-datas').html(html)	
		$('.emergency-rehearsal-open .volunteer-datas p').unbind('click').on('click',function(){
			if(!$(this).hasClass('actived')){
				volunteerId = $(this).attr('data-id');
				volunteerName = $(this).html();
				ops = {
					volunteerId:volunteerId,
					url:'emergency-rehearsal/findVolunteerEvaluate',
					groupId: groupId,
					teamId: teamId,
					teamType: teamType,
					drillEventId: drillEventId
				};
				$('.emergency-rehearsal-open .volunteer-datas p').removeClass('actived');
				$(this).addClass('actived');
				getComments(ops)
			};
		});
		if(data.currentPage > 1){
			laypage.render({
			    elem: 'erv-comment-volunteer-page',
			    count: data.totalCount,
			    limit: 12,
			    jump: function(obj,first){
			    	if(!first) {
			    		let volOps;
						if(groupId){
							volOps = {
								groupId:groupId,
								page: obj.curr
							};
							getVolunteers(volOps);
						} else {
							volOps = {
								page: obj.curr
							}
							getTeamVol(volOps);
						};
			    	}
			    }
			  });
		}
	},
	getComments = function(data) {//获取评分列表
		emergencyRehearsalInterFace.getComments(data,function(res){
			let tpl = er_comments_datas_tpl.innerHTML,
				view = $('.emergency-rehearsal-open .comment-datas'),
				p= {
					comments: res?res:[]
				};
			
			p.submit = "false";
			if(commanderIds.split(',').indexOf(userId) != -1){
				if(p.comments.length > 0){
					p.submit = "true";
					p.comments.forEach(function(value){
						if(value.chargePersonId == userId){
							p.submit = "false";
						}
					});
				} else {
					p.submit = "true";
				}
			};
		
			laytpl(tpl).render(p, function(html){
				view.html(html);
			});
		});
		
		$('.emergency-rehearsal-open').unbind('click').on('click','button',function(){
			setComments();
		});
	},
	setComments = function(data) {
		let lwIndexCom = layer.open({
			type: 1,
			title: msg + '评估',
			skin: 'layui-layer-demo', //样式类名
			closeBtn: 1, //是否显示关闭按钮
			anim: 2,
			shadeClose: false, //是否开启遮罩关闭
			area : [ '600px', '460px' ], //宽高
			content: '<div class="er-member-comment-form-open">' + $('#er-member-comment-form-panel').html() + '</div>',
			end: function() {
				layer.close(lwIndexCom);
			}
		});
		$('.er-member-comment-form-open .dial').knob();
		$('.er-member-comment-form-open form').attr('id','er-member-comment-form');
		$('#er-member-comment-form').validate({
			 rules: {
				 evaluate: { rangelength: [0,200]}
			 },
			 messages: {
				 evaluate: {rangelength: icon + "输入长度不大于200个字符"}
			},
			submitHandler:function(form){
	        	let saveObj = $(form).serializeObject(),
	        		personInfo = JSON.parse(CommonUtil.getHeaders().systemLoginUser);
	        	 
	        	saveObj.chargePersonId = userId;
	        	saveObj.teamId = teamId;
	        	saveObj.teamName = teamName;
	        	saveObj.groupId = groupId;
	        	saveObj.groupName = groupName;
	        	saveObj.evaluateType = evaluateType;
	        	saveObj.teamType = teamType;
	        	saveObj.drillEventId = drillEventId;
	        	saveObj.volunteerId = volunteerId;
	        	saveObj.volunteerName = volunteerName;
	        	saveObj.chargePersonName = personInfo.realName?personInfo.realName: personInfo.username;
	        	
	        	layer.confirm('提交后不能编辑，确认提交？', {
				    btn: ['确认','取消'], //按钮
				    shade: true 
				}, function(){
					emergencyRehearsalInterFace.saveEvaluate({data:JSON.stringify(saveObj)},function(res){	
						
		        		layer.close(lwIndexCom);
		        		layer.msg('点评提交成功！',{icon:6});
		        		getComments(ops)
		        	});
				});
	        	
	        }
		});
		
	};
	this.init = init;
	
});