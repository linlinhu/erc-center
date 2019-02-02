let VolunteerAssessPanel = (function() {
	let lw = '#volunteer-assess-panel',
		tpId = null,
		vpId = null,
		trainingPlanInterface = null,
		loadProcessionsByTpId = function(p) {
			trainingPlanInterface.detail(tpId, function(res) {
				let team = res.team,
					processions = [];
				
				team.split(',').map(t => (processions.push({
					id: t.split('|')[0],
					name: t.split('|')[1]
				})));
				
				if (processions.length > 0) {
					$(lw + ' .procession-datas').html(processions.map(p => '<li class="list-group-item" data-id="' + p.id + '">' + p.name + '</li>').join(''));
					
					$(lw +  ' .procession-datas').find('li').unbind('click').bind('click', function() {
						$(this).siblings().removeClass('selected');
						$(this).addClass('selected');
						vpId = $(this).attr('data-id');
						loadVolunteersByVpId({
							id: tpId,
							teamId: vpId,
							page: 1,
							limit: 10
						});
						
					});
				} else {
					$(lw +  ' .procession-datas').html('暂无应急队伍');
				}
				
				
			})
				
		},
		loadVolunteersByVpId = function(p) {
			trainingPlanInterface.getVolunteersPage(p, function(res) {
				let volunteers = res;
				if (volunteers.length > 0) {
					$(lw +  ' .volunteer-datas').html(volunteers.map(v => '<li class="list-group-item" data-id="' + v.personId+ '" data-score="' + (v.score ? v.score : 60) + '">' + v.personName + '</li>').join(''));
					
					$(lw +  ' .volunteer-datas').find('li').unbind('click').bind('click', function() {
						
						let personId = $(this).attr('data-id'),
							score = $(this).attr('data-score'),
							tpl = volunteer_assess_form_tpl.innerHTML;
						
						$(this).siblings().removeClass('selected');
						$(this).addClass('selected');
						score = score ? score : 60;
						
						laytpl(tpl).render({
							data: ''
						}, function(html){
							$(lw +  ' form.volunteer-assess-form').html(html);
							CommonUtil.formDataSetAndGet({
								container: lw +  ' form.volunteer-assess-form',
								data: {
									trainId: tpId,
									personId: personId,
									score: score
								}
							})
							$(".dial").knob();
							$(lw + ' form.volunteer-assess-form').validate({
						        rules: {
						        	
						        },
						        messages: {
						        	
						        },
						        submitHandler:function(form){
						        	trainingPlanInterface.score($(form).serializeObject(), function() {
						        		layer.msg('评分成功！', {icon: 6});
						        		loadVolunteersByVpId({
											id: tpId,
											teamId: vpId,
											page: 1,
											limit: 10
										});
						        	});
						        	
						        	return false;
						        } 
							});
						});
						
						
					});
				}
			})
		},
		init = function(p, callback) {
			trainingPlanInterface = new TrainingPlanInterface();
			tpId = p.trainId;
			loadProcessionsByTpId();
			$(lw +  ' .volunteer-data').html('请选择应急队伍进行查询');
			$(lw +  ' form.volunteer-assess-form').html('请选择志愿者进行评估');
			$(lw).removeClass('hide');
			// 使用layer弹窗打开模板
			let layerIndex = layer.open({
				type: 1,
				title: '培训评估',
				skin: 'layui-layer-demo', //样式类名
				closeBtn: 1, //不显示关闭按钮
				anim: 2,
				shadeClose: false, //开启遮罩关闭
				area : [ '784px', 'auto' ], //宽高
				content: $(lw)
			});
			
		};
		
	return {
		init: init
	};
}());