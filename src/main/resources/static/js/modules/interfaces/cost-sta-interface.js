/**
 * 费用管理接口定义层
 * @creator Winnie
 * @createTime 2018/3/28
 */
const CostStaInterface = (function(){
	const getTrainFeeDetail = function(p,callback){
			CommonUtil.ajaxRequest({
				url: 'cost-sta/detail',
				data: p
			}, function(res) {
				if (typeof res == 'string') {
					res = JSON.parse(res);
					if (!res.success) {
						layer.msg('查询费用请求出错！' + (res.message ? '原因是：' + res.message : ''), {icon: 5});
						return false;
					}
				}
				if (typeof callback == 'function') {
					callback(res);
				}
			});
		},
		save = function(data, callback) {
			CommonUtil.ajaxRequest({
				url: 'cost-sta/save',
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
				url: 'cost-sta/remove',
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
				url: 'cost-sta/getAll',
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
	return {
		getTrainFeeDetail: getTrainFeeDetail,
		save: save,
		remove: remove,
		getAll: getAll
	}
}()) 