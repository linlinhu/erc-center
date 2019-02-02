/**
 * 区域网格接口定义层
 * @creator 李丹Danica
 * @createTime 2018/3/20
 */
const FinanceInterface = function() {
	const save = function(data, callback) {
			CommonUtil.ajaxRequest({
				url: 'finance/save',
				type: 'post',
				data: {
					data: JSON.stringify(data)
				}
			}, function(res) {
				if (typeof res == 'string') {
					res = JSON.parse(res);
				}
				if (!res.success) {
					layer.msg('保存费用项目报错！' + (res.message ? '原因是：' + res.message : ''), {icon: 5});
					return false;
				}
				if (typeof callback == 'function') {
					callback(res);
				}
			});
		},
		remove = function(id, callback){
			CommonUtil.ajaxRequest({
				url: 'finance/remove',
				data: {
					id: id
				}
			}, function(res) {
				if (typeof res == 'string') {
					res = JSON.parse(res);
				}
				if (!res.success) {
					layer.msg('删除费用项目报错！' + (res.message ? '原因是：' + res.message : ''), {icon: 5});
					return false;
				}
				if (typeof callback == 'function') {
					callback(res);
				}
			});
		},
		getAll = function(p,callback) {
			CommonUtil.ajaxRequest({
				url: 'finance/getAll',
				data: p
			}, function(res) {
				if (typeof res == 'string') {
					res = JSON.parse(res);
					if (!res.success) {
						layer.msg('查询关联费用项目报错！' + (res.message ? '原因是：' + res.message : ''), {icon: 5});
						return false;
					}
				}
				if (typeof callback == 'function') {
					callback(res);
				}
			});
		};
	
	this.save = save;
	this.remove = remove;
	this.getAll = getAll;
};