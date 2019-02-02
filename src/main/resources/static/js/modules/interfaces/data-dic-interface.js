/**
 * 数据字典接口定义层
 * @creator 李丹Danica
 * @createTime 2018/3/20
 */
const DataDicInterface = function() {
	const getItems = function(ddId, callback) {
			CommonUtil.ajaxRequest({
				url: 'data-dic/getItems',
				data: {
					gid: ddId
				}
			}, function(res) {
				if (typeof res == 'string') {
					res = JSON.parse(res);
				}
				if (!res.success) {
					layer.msg('加载数据字典出错！' + (res.message ? '原因是：' + res.message : ''), {icon: 5});
					return false;
				}
				
				if (typeof callback == 'function') {
					callback(res.result);
				}
			});
		},
		getItemsByCode = function(code, callback) {
			CommonUtil.ajaxRequest({
				url: 'data-dic/getItemsByCode',
				data: {
					code: code
				}
			}, function(res) {
				if (typeof res == 'string') {
					res = JSON.parse(res);
				}
				if (!res.success) {
					layer.msg('加载数据字典出错！' + (res.message ? '原因是：' + res.message : ''), {icon: 5});
					return false;
				}
				if (typeof callback == 'function') {
					callback(res.result);
				}
			});
		};
	//根据id查询数据项 不建议使用
	this.getItems = getItems;

	//根据code查询数据项
	this.getItemsByCode = getItemsByCode;
}