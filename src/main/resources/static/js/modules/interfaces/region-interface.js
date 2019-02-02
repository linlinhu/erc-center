/**
 * 区域网格接口定义层
 * @creator 李丹Danica
 * @createTime 2018/3/20
 */
const RegionInterface = function() {
	const saveGrids = function(p, callback) {
			CommonUtil.ajaxRequest({
				url: 'region/saveGrids',
				data: p
			}, function(res) {
				if (typeof res == 'string') {
					res = JSON.parse(res);
				}
				if (!res.success) {
					layer.msg('保存区域网格报错！' + (res.message ? '原因是：' + res.message : ''), {icon: 5});
					return false;
				}
				
				if (typeof callback == 'function') {
					callback();
				}
			});
		},
		getGrids = function(p, callback) {
			CommonUtil.ajaxRequest({
				url: 'region/getGrids',
				data: p
			}, function(res) {
				if (typeof res == 'string') {
					res = JSON.parse(res);
					if (!res.success) {
						layer.msg('保存区域网格报错！' + (res.message ? '原因是：' + res.message : ''), {icon: 5});
						return false;
					}
				}
				
				if (typeof callback == 'function') {
					callback(res);
				}
			});
		},
		gridDetail = function(id, callback) {
			CommonUtil.ajaxRequest({
				url: 'region/gridDetail',
				data: {
					id: id
				}
			}, function(res) {
				if (typeof res == 'string') {
					res = JSON.parse(res);
					if (!res.success) {
						layer.msg('查询区域网格详情时报错！' + (res.message ? '原因是：' + res.message : ''), {icon: 5});
						return false;
					}
				}
				
				if (typeof callback == 'function') {
					callback(res);
				}
			});
		};
		
		
	//保存区域网格
	this.saveGrids = saveGrids;
	this.getGrids = getGrids;
	this.gridDetail = gridDetail;

}