/**
 * 区域网格接口定义层
 * @creator 李丹Danica
 * @createTime 2018/3/20
 */
const TrainingPlanInterface = function() {
	const save = function(data, callback) {
			CommonUtil.ajaxRequest({
				url: 'training-plan/save',
				type: 'post',
				data: {
					data: JSON.stringify(data)
				}
			}, function(res) {
				if (typeof res == 'string') {
					res = JSON.parse(res);
				}
				if (!res.success) {
					layer.msg('保存培训计划报错！' + (res.message ? '原因是：' + res.message : ''), {icon: 5});
					return false;
				}
				if (typeof callback == 'function') {
					callback(res);
				}
			});
		},
		detail = function(id, callback) {
			if (!id) {
				return false;
			}
			CommonUtil.ajaxRequest({
				url: 'training-plan/detail',
				data: {
					id: id
				}
			}, function(res) {
				if (typeof res == 'string') {
					res = JSON.parse(res);
					if (!res.success) {
						layer.msg('查询培训计划详情报错！' + (res.message ? '原因是：' + res.message : ''), {icon: 5});
						return false;
					}
				}
				if (typeof callback == 'function') {
					callback(res);
				}
			});
		},
		remove = function(id, callback){
			CommonUtil.ajaxRequest({
				url: 'training-plan/remove',
				data: {
					id: id
				}
			}, function(res) {
				if (typeof res == 'string') {
					res = JSON.parse(res);
				}
				if (!res.success) {
					layer.msg('删除培训计划报错！' + (res.message ? '原因是：' + res.message : ''), {icon: 5});
					return false;
				}
				if (typeof callback == 'function') {
					callback(res);
				}
			});
		},
		getFeedbackDetail = function(id, callback){
			CommonUtil.ajaxRequest({
				url: 'training-plan/getFeedbackDetail',
				data: {
					id: id
				}
			}, function(res) {
				if (typeof res == 'string') {
					res = JSON.parse(res);
					if (!res.success) {
						layer.msg('发布培训计划报错！' + (res.message ? '原因是：' + res.message : ''), {icon: 5});
						return false;
					}
				}
				if (typeof callback == 'function') {
					callback(res);
				}
			});
		},
		feedback = function(data, callback){
			CommonUtil.ajaxRequest({
				url: 'training-plan/feedback',
				data: {
					data: JSON.stringify(data)
				}
			}, function(res) {
				if (typeof res == 'string') {
					res = JSON.parse(res);
				}
				if (!res.success) {
					layer.msg('保存培训计划反馈信息报错！' + (res.message ? '原因是：' + res.message : ''), {icon: 5});
					return false;
				}
				if (typeof callback == 'function') {
					callback(res);
				}
			});
		},
		getVolunteersPage = function(p,callback) {
			CommonUtil.ajaxRequest({
				url: 'training-plan/getVolunteersPage',
				data: p
			}, function(res) {
				if (typeof res == 'string') {
					res = JSON.parse(res);
					if (!res.success) {
						layer.msg('培训计划获取关联志愿者列表查询报错！' + (res.message ? '原因是：' + res.message : ''), {icon: 5});
						return false;
					}
				}
				if (typeof callback == 'function') {
					callback(res);
				}
			});
		},
		score = function(p, callback){
			CommonUtil.ajaxRequest({
				url: 'training-plan/score',
				data: p
			}, function(res) {
				if (typeof res == 'string') {
					res = JSON.parse(res);
				}
				if (!res.success) {
					layer.msg('给志愿者评分时出错！' + (res.message ? '原因是：' + res.message : ''), {icon: 5});
					return false;
				}
				if (typeof callback == 'function') {
					callback(res);
				}
			});
		};
	
	this.save = save;
	this.detail = detail;
	this.remove = remove;
	this.getFeedbackDetail = getFeedbackDetail;
	this.feedback = feedback;
	this.getVolunteersPage = getVolunteersPage;
	this.score = score;
};