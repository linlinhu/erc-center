let VolunteerManage = (function() {
	let operationCodes = null;
	let show = function(data) {
			let view  = null,
				tpl = volunteer_detail_data.innerHTML,
				lwIndex = null;
			
			$('#volunteer-detail').removeClass('hide');
			VolunteerInterface.getDetail(data.id,function(result){
				layer.close(lwIndex);
				lwIndex = layer.open({
					type: 1,
					title: '志愿者详情',
					skin: 'layui-layer-demo', //样式类名
					closeBtn: 1, //不显示关闭按钮
					anim: 2,
					shadeClose: true, //开启遮罩关闭
					area : [ '760px', '540px' ], //宽高
					content: $('#volunteer-detail'),
					end: function() {
						layer.close(lwIndex);
					}
				});
				view = $('#volunteer-detail');
				laytpl(tpl).render(result, function(html){
					let comprehensive = result.comprehensive?result.comprehensive:[];
					view.html(html);
					$('#volunteer-detail .volunteerStatus-btns').removeClass('hide');
					if(operationCodes.indexOf('dismissal') != -1){
						$('.volunteerStatus-btns .dismissal').removeClass('hide');
					} else {
						$('.volunteerStatus-btns .dismissal').addClass('hide');
					}
					if(operationCodes.indexOf('employment') != -1){
						$('.volunteerStatus-btns .employment').removeClass('hide');
					} else {
						$('.volunteerStatus-btns .employment').addClass('hide');
					}
					$('.volunteerStatus-btns .dismissal').on('click',function(){
						layer.confirm('确认淘汰？', {
						    btn: ['确认','取消'], //按钮
						    shade: true //不显示遮罩
						}, function(){
							VolunteerInterface.dismissal({id:result.id},function(){
								layer.closeAll()
								goPage('index');
						    	layer.msg('淘汰成功！', {icon: 6, time:2000});
							});
						});
					});
					
					$('.volunteerStatus-btns .employment').on('click',function(){
						layer.confirm('确认录用？', {
						    btn: ['确认','取消'], //按钮
						    shade: true //不显示遮罩
						}, function(){
							VolunteerInterface.employment({id:result.id},function(){
								layer.closeAll()
								goPage('index');
						    	layer.msg('录用成功！', {icon: 6, time: 2000});
							});
						});
					});
					
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
		},
		init = function(p) {
			operationCodes = p.operationCodes;
			VolunteerInterface.getScopes(function(res){
				let html = '<option value="">全部</option>';
				res.forEach(function(value,index,array){
					html += '<option value="' + value.k + '">' + value.v + '</option>'
				});
				$('#volunteer-searchform select[name="scope"]').html(html);
				$('#volunteer-searchform select[name="scope"]').val(p.scope);
			})
			
			$('#volunteer-manage .volunteerprocession-choosen-picker').unbind('click').bind('click', function() {
				volunteerProcessionPicker.init({
					multiSelect: false
				}, function(res) {
					$('#volunteer-manage .volunteerprocession-choosen-picker').html(res.name);
				});
			});
			$('#volunteer-manage .remove-icon').unbind('click').bind('click', function() {
				var id = $(this).attr('data-id');
				operation({
					moduleName: 'volunteer',
					oper: 'remove',
					params: {
						id: id
					}
				},function(){
					goPage('index');
	        		layer.msg('删除成功',{icon:6,time:2000});
				})
			});

			$('#volunteer-manage .detail-icon').unbind('click').bind('click', function() {
				show({id: $(this).attr('data-id')});
			});
			$('#volunteer-manage .import').on('click', function() {
				layer.msg('批量导入功能正在开发中。。。')
			});
		};
		
	return {
		init: init
	}
}());