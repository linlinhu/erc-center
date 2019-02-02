/**
 * 团体志愿者接口定义层
 * @creator Winnie
 * @createTime 2018/3/22
 */
const VolunteerTeamInterface = function() {
	const getGroupDetail = function(p, callback) {
			CommonUtil.ajaxRequest({
				url: 'volunteer-team/groupDetail',
				data: p
			}, function(res) {
				if (typeof res == 'string') {
					res = JSON.parse(res);
					if (!res.success) {
						layer.msg('查询团队失败' + (res.message ? '原因是：' + res.message : ''), {icon: 5});
						return false;
					}
				}
				if (typeof callback == 'function') {
					callback(res.result);
				}
			});
		},
		getVolunteers = function(p,callback) {
			let ops = {};
			ops = {
				groupId: p.groupId,
				limit: p.limit?p.limit:10,
				page: p.page? p.page:1,
				name: p.name? p.name:null
			};
			CommonUtil.ajaxRequest({
				url: 'volunteer-team/getVolunteers',
				data: ops
			}, function(res) {
				if (typeof res == 'string') {
					res = JSON.parse(res);
					if (!res.success) {
						layer.msg('查询志愿者失败' + (res.message ? '原因是：' + res.message : ''), {icon: 5});
						return false;
					}
				}
				if (typeof callback == 'function') {
					callback(res);
				}
			});
		},
		getVolunteerDetail = function(id,callback) {
			var option = {
					url: 'volunteer/getDetail',
					data: {
						id:id
					},
					type:'GET'
			};
			CommonUtil.ajaxRequest(option, function(result){
				if(result.success){
					callback(result.result);
				} else {
					layer.msg('获取志愿者详情失败', {icon: 5});
				}
				
			})
		},
		changeTeam = function(p,callback){
			var option = {
					url: 'volunteer-team/changeTeam',
					data: p,
					type:'POST'
			};
			CommonUtil.ajaxRequest(option, function(res){
				if (typeof res == 'string') {
					res = JSON.parse(res);
				};
				if (!res.success) {
					layer.msg('变更失败' + (res.message ? '原因是：' + res.message : ''), {icon: 5});
					return false;
				};
				if (typeof callback == 'function') {
					callback(res);
				}
				
			})
		},
		dismissal = function(p,callback){
			CommonUtil.ajaxRequest({
				url: 'volunteer-team/dismissal',
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
				url: 'volunteer-team/employment',
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
		};
		
	// 查询队伍详情
	this.getGroupDetail = getGroupDetail;
	// 队伍中的志愿者
	this.getVolunteers = getVolunteers;
	//获取志愿者详情
	this.getVolunteerDetail = getVolunteerDetail;
	//志愿者变更队伍
	this.changeTeam = changeTeam;
	//淘汰团体志愿者
	this.dismissal = dismissal;
	//录用团体志愿者
	this.employment = employment;
};