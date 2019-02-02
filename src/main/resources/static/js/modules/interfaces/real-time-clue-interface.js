const RealTimeClueInterface = function() {
	const getList = function(p, callback) {
			CommonUtil.ajaxRequest({
				forbidLoading: true,
				url: 'realtime-clue/getList',
				data: p
			}, function(res) {
				if (typeof res == 'string') {
					res = JSON.parse(res);
					if (!res.success) {
						console.log('加载实时线索出错！' + (res.message ? '原因是：' + res.message : ''));
						return false;
					}
				}
				if (typeof callback == 'function') {
					if (res.length > 0) {
						callback(res);
					}
				}
			});
		},
		getPoints = function(p, callback) {
			CommonUtil.ajaxRequest({
				forbidLoading: true,
				url: 'realtime-clue/getPoints',
				data: p
			}, function(res) {
				if (typeof res == 'string') {
					res = JSON.parse(res);
					if (!res.success) {
						layer.msg('加载实时线索点出错！' + (res.message ? '原因是：' + res.message : ''), {icon: 5});
						return false;
					}
				}
				if (typeof callback == 'function') {
					callback(res);
				}
			});
		},
		mark = function(p, callback) {
			CommonUtil.ajaxRequest({
				forbidLoading: true,
				url: 'realtime-clue/mark',
				data: p
			}, function(res) {
				if (typeof res == 'string') {
					res = JSON.parse(res);
					if (!res.success) {
						layer.msg('线索处理报错！' + (res.message ? '原因是：' + res.message : ''), {icon: 5});
						return false;
					}
				}
				if (typeof callback == 'function') {
					callback(res);
				}
			});
		},
		detail = function(p, callback) {
			CommonUtil.ajaxRequest({
				url: 'realtime-clue/detail',
				data: p
			}, function(res) {
				if (typeof res == 'string') {
					res = JSON.parse(res);
					if (!res.success) {
						layer.msg('线索详情查询报错！' + (res.message ? '原因是：' + res.message : ''), {icon: 5});
						return false;
					}
				}
				if (typeof callback == 'function') {
					callback(res);
				}
			});
		};
		
	this.getList = getList;
	this.getPoints = getPoints;
	this.mark = mark;
	this.detail = detail;
};