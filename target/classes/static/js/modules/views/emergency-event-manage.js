let emergencyEvent = function(){
	let subModuleName,
		eventNature,
		eventNatureName;
	function init(ops){
		let DDGetData = new DataDicInterface();
		subModuleName = ops.subModuleName;
		if(subModuleName == "real-event") {
			eventNature = 1;
			eventNatureName = '真实事件';
		} else if(subModuleName == "rehearsal-event") {
			eventNature = 2;
			eventNatureName = '演练事件';
		} else {
			eventNature = 0;
			eventTypeName = '应急任务';
		}
		DDGetData.getItemsByCode('event-type',function(res){
			 let html = '<option value="" disabled selected>按事件分类查询</option>';
			 res.forEach(function(value,index,array){
				 html += '<option value="'+value.code+'">'+value.name+'</option>';
			 });
			 $('.' + subModuleName + ' select[name="eventType"]').html( html);
			 
			 $('.' + subModuleName + ' select[name="eventType"]').val(ops.eventType)
			 
		});
		$('.' + subModuleName).on('click','.disposed-pecord',function(){
			disposedRecord();
		});
		$('.'+ subModuleName+' .goForm').on('click',function(){
			let id = $(this).attr('data-id');
			goForm(id);
		});
		$('.'+ subModuleName+' .search').on('click',function(){
			search();
		});
		/*$('.'+ subModuleName+' .remove').on('click',function(){
			layer.confirm('确认删除'+eventTypeName+'？', {
				    btn: ['确认','取消'], //按钮
				    shade: true //不显示遮罩
			}, function(){
				layer.closeAll()
		    	layer.msg('删除成功！', {icon: 6});
		    	goPage('index');
			});
		});*/
		/*$('.'+ subModuleName+' .release').on('click',function(){
			layer.confirm('确认发布？', {
				    btn: ['确认','取消'], //按钮
				    shade: true //不显示遮罩
			}, function(){
				layer.closeAll()
		    	layer.msg('发布成功！', {icon: 6});
		    	goPage('index');
			});
		});*/
		/*$('.'+ subModuleName+' .revoke').on('click',function(){
			layer.confirm('确认撤销？', {
				    btn: ['确认','取消'], //按钮
				    shade: true //不显示遮罩
			}, function(){
				layer.closeAll()
		    	layer.msg('测校成功！', {icon: 6});
		    	goPage('index');
			});
		});*/
	};
	function search(){
		let searchData = $('.' + subModuleName + ' form').serializeObject();
		searchData.eventTypeName = $('.' + subModuleName + ' option[value="' + searchData.eventType + '"]').html();
		searchData.page = 1;
		console.log('searchData',searchData);
		goPage('index',searchData);
	};
	
	function disposedRecord(ops){
		let lwIndex = null;
		layer.close(lwIndex);
		lwIndex = layer.open({
			type: 1,
			title: '处理记录',
			skin: 'layui-layer-demo', //样式类名
			closeBtn: 1, //不显示关闭按钮
			anim: 2,
			shadeClose: true, //开启遮罩关闭
			area : [ '700px', 'auto' ], //宽高
			content: '<div class="wrapper-content">暂无记录</div>',
			end: function() {
				layer.close(lwIndex);
			}
		});
	};
	function goForm(id){
		goPage('form',{id:id});
		setTimeout(function(){
			$('#emergency-event-form input[name="eventNatureName"]').val(eventNatureName);
			$('#emergency-event-form input[name="eventNature"]').val(eventNature)
		},100);	
	};
	function getLogs(id){
		var option = {
			url: basePath +'audit/auditLog',
			type:'POST',
			data:{
				id:id
			}
			},
			tpl = LogDatas.innerHTML,
			view = null,
			lwIndex = null;

		layer.close(lwIndex);
		lwIndex = layer.open({
			type : 1,
			title : '处理记录追踪',
			skin : 'layui-layer-rim', //加上边框
			area : [ '60%', '490px' ], //宽高
			content : '<div class="wrapper-content" id="logDetail">' + $('#logDatas-Panel').html() + '</div>',
			end: function() {
				layer.close(lwIndex);
			}
		});
		CommonUtil.ajaxRequest(option, function(result){
			if(result.success){
				view = $('#logDetail #log-view');
				laytpl(tpl).render(result.result, function(html){
					view.html(html);
				});
			} else {
				layer.msg(result.message?result.message:'查询详情失败', {icon: 5});
			}
		})
	};
	this.init = init;
};