/**
 * 个人志愿者接口定义层
 * @creator Winnie
 * @createTime 2018/3/22
 */
const VolunteerInterface = (function(){
	let dismissal = function(p,callback){
		CommonUtil.ajaxRequest({
			url: 'volunteer/dismissal',
			data: p
		}, function(res) {
			if (typeof res == 'string') {
				res = JSON.parse(res);
			}
			if (!res.success) {
				layer.msg('淘汰志愿者失败' + (res.message ? '原因是：' + res.message : ''), {icon: 5});
				return false;
			}
			if (typeof callback == 'function') {
				callback(res);
			}
		});
	},
	employment = function(p,callback){
		CommonUtil.ajaxRequest({
			url: 'volunteer/employment',
			data: p
		}, function(res) {
			if (typeof res == 'string') {
				res = JSON.parse(res);
			}
			if (!res.success) {
				layer.msg('录用志愿者失败' + (res.message ? '原因是：' + res.message : ''), {icon: 5});
				return false;
			}
			if (typeof callback == 'function') {
				callback(res);
			}
		});
	},
	getDetail = function(id,callback) {
		var option = {
				url: 'volunteer/getDetail',
				data: {
					id:id
				},
				type:'GET'
		};
		CommonUtil.ajaxRequest(option, function(result){
			if(result.success){
				if (typeof callback == 'function') {
					callback(result.result);
				}
			} else {
				layer.msg('获取详情失败', {icon: 5});
			}
			
		})
	},
	getScopes = function(callback){
		CommonUtil.ajaxRequest({
			url: 'volunteer/scopes'
		}, function(res) {
			if (typeof res == 'string') {
				res = JSON.parse(res);
			}
			if (!res.success) {
				layer.msg('查询志愿者生命周期失败' + (res.message ? '原因是：' + res.message : ''), {icon: 5});
				return false;
			}
			if (typeof callback == 'function') {
				callback(res.result);
			}
		});
	},
	getIncreaseInfo = function(p, callback){
		CommonUtil.ajaxRequest({
			url: 'volunteer/getIncreaseInfo',
			data: p
		}, function(res) {
			if (typeof res == 'string') {
				res = JSON.parse(res);
				if (!res.success) {
					layer.msg('查询志愿者招募增长数据失败！' + (res.message ? '原因是：' + res.message : ''), {icon: 5});
					return false;
				}
			}
			if (typeof callback == 'function') {
				callback(res);
			}
		});
	},
	registerSpread = function(p, callback){
		CommonUtil.ajaxRequest({
			url: 'volunteer/registerSpread',
			data: p
		}, function(res) {
			if (typeof res == 'string') {
				res = JSON.parse(res);
				if (!res.success) {
					layer.msg('查询志愿者生注册点分布信息失败！' + (res.message ? '原因是：' + res.message : ''), {icon: 5});
					return false;
				}
			}
			if (typeof callback == 'function') {
				callback(res);
			}
		});
	};
	
	return {
		dismissal: dismissal,//淘汰志愿者
		employment: employment,//录用志愿者
		getDetail: getDetail,//获取志愿者详情
		getScopes: getScopes,//查询志愿者生命周期
		getIncreaseInfo: getIncreaseInfo,
		registerSpread:registerSpread
	};
}())