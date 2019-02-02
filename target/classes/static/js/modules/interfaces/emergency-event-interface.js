/**
 * 应急事件接口定义层
 * @creator winnie
 * @createTime 2018/3/23
 */
const EmergencyEventInterface = function(){
	const getPage = function(p,callback){
		CommonUtil.ajaxRequest({
			url: 'emergency-event/getPage',
			data: p
		}, function(res) {
			let msg = (p.eventNature == 1?'真实':'演练');
			
			if (typeof res == 'string') {
				res = JSON.parse(res);
				if (!res.success) {
					layer.msg('查询'+ msg +'事件失败' + (res.message ? '原因是：' + res.message : ''), {icon: 5});
					return false;
				}
			}
			if (typeof callback == 'function') {
				callback(res);
			}
		});
	};
	
	//获取事件列表
	this.getPage = getPage;
};