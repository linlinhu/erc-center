/**
 * 授权中心接口定义层
 * @author winnie
 * @createTime 2018/3/21
 */
const AuthorizationInterface = function() {
	const changeStatus = function(p, callback) {
			CommonUtil.ajaxRequest({
				url: 'authorization/enabled',
				data: p
			}, function(res) {
				if (typeof res == 'string') {
					res = JSON.parse(res);
				}
				if (!res.success) {
					if(p.activeStatus == 0) {
						layer.msg('禁用授权报错！' + (res.message ? '原因是：' + res.message : ''), {icon: 5});
					} else {
						layer.msg('启用授权报错！' + (res.message ? '原因是：' + res.message : ''), {icon: 5});
					}
					
					return false;
				}
				
				if (typeof callback == 'function') {
					callback();
				}
			});
		};	
	//保存区域网格
	this.changeStatus = changeStatus;
}