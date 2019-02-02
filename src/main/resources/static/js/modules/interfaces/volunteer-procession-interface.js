/**
 * 应急队伍接口定义层
 * @creator 李丹Danica
 * @createTime 2018/3/22
 */
const VolunteerProcessionInterface = function() {
	const getPages = function(p, callback) {
			CommonUtil.ajaxRequest({
				url: 'volunteer-procession/getPages',
				data: p
			}, function(res) {
				if (typeof res == 'string') {
					res = JSON.parse(res);
					if (!res.success) {
						layer.msg('加载应急队伍列表报错！' + (res.message ? '原因是：' + res.message : ''), {icon: 5});
						return false;
					}
				}
				
				if (typeof callback == 'function') {
					callback(res);
				}
			});
		},
		getTeamPage = function(p, callback) {
			CommonUtil.ajaxRequest({
				url: 'volunteer-procession/getTeamPage',
				data: p
			}, function(res) {
				if (typeof res == 'string') {
					res = JSON.parse(res);
					if (!res.success) {
						layer.msg('加载应急队伍关联团队列表报错！' + (res.message ? '原因是：' + res.message : ''), {icon: 5});
						return false;
					}
				}
				
				if (typeof callback == 'function') {
					callback(res);
				}
			});
		},
		getFreeTeamPage = function(p, callback) {
			CommonUtil.ajaxRequest({
				url: 'volunteer-procession/getFreeTeamPage',
				data: p
			}, function(res) {
				if (typeof res == 'string') {
					res = JSON.parse(res);
					if (!res.success) {
						layer.msg('加载可用应急队伍关联团队列表报错！' + (res.message ? '原因是：' + res.message : ''), {icon: 5});
						return false;
					}
				}
				
				if (typeof callback == 'function') {
					callback(res);
				}
			});
		},
		getVolunteersPage = function(p, callback) {
			CommonUtil.ajaxRequest({
				url: 'volunteer-procession/getVolunteersPage',
				data: p
			}, function(res) {
				if (typeof res == 'string') {
					res = JSON.parse(res);
					if (!res.success) {
						layer.msg('加载应急队伍关联个人志愿者列表报错！' + (res.message ? '原因是：' + res.message : ''), {icon: 5});
						return false;
					}
				}
				
				if (typeof callback == 'function') {
					callback(res);
				}
			});
		},
		getFreeVolunteersPage = function(p, callback) {
			CommonUtil.ajaxRequest({
				url: 'volunteer-procession/getFreeVolunteersPage',
				data: p
			}, function(res) {
				if (typeof res == 'string') {
					res = JSON.parse(res);
					if (!res.success) {
						layer.msg('加载应急队伍可选关联个人志愿者列表报错！' + (res.message ? '原因是：' + res.message : ''), {icon: 5});
						return false;
					}
				}
				
				if (typeof callback == 'function') {
					callback(res);
				}
			});
		},
		detail = function(id, callback) {
			CommonUtil.ajaxRequest({
				url: 'volunteer-procession/detail',
				data: {
					id: id
				}
			}, function(res) {
				if (typeof res == 'string') {
					res = JSON.parse(res);
					if (!res.success) {
						layer.msg('查询应急队伍详情报错！' + (res.message ? '原因是：' + res.message : ''), {icon: 5});
						return false;
					}
				}
				if (typeof callback == 'function') {
					callback(res);
				}
			});
		},
		save = function(p, callback) {
			CommonUtil.ajaxRequest({
				url: 'volunteer-procession/save',
				data: p
			}, function(res) {
				if (typeof res == 'string') {
					res = JSON.parse(res);
				}
				if (!res.success) {
					layer.msg('保存应急队伍报错！' + (res.message ? '原因是：' + res.message : ''), {icon: 5});
					return false;
				}
				
				if (typeof callback == 'function') {
					callback(res);
				}
			});
		},
		remove = function(id, callback) {
			CommonUtil.ajaxRequest({
				url: 'volunteer-procession/remove',
				data: {
					id: id
				}
			}, function(res) {
				if (typeof res == 'string') {
					res = JSON.parse(res);
					if (!res.success) {
						layer.msg('删除应急队伍报错！' + (res.message ? '原因是：' + res.message : ''), {icon: 5});
						return false;
					}
				}
				if (typeof callback == 'function') {
					callback(res);
				}
			});
		},
		gridAggregation = function(p, callback) {
			CommonUtil.ajaxRequest({
				url: 'volunteer-procession/gridAggregation',
				data: p
			}, function(res) {
				if (typeof res == 'string') {
					res = JSON.parse(res);
					if (!res.success) {
						layer.msg('加载应急队伍网格聚合列表错误！' + (res.message ? '原因是：' + res.message : ''), {icon: 5});
						return false;
					}
				}
				
				if (typeof callback == 'function') {
					callback(res);
				}
			});
		},
		batchHandlerGroup = function(p, callback) {
			CommonUtil.ajaxRequest({
				url: 'volunteer-procession/batchHandlerGroup',
				data: p
			}, function(res) {
				if (typeof res == 'string') {
					res = JSON.parse(res);
				}
				
				if (!res.success) {
					layer.msg('处理队伍和团队之间关联关系操作时报错！' + (res.message ? '原因是：' + res.message : ''), {icon: 5});
					return false;
				}
				
				if (typeof callback == 'function') {
					callback(res);
				}
			});
		},
		batchHandlerHashVolunteer = function(p, callback) {
			CommonUtil.ajaxRequest({
				url: 'volunteer-procession/batchHandlerHashVolunteer',
				data: p
			}, function(res) {
				if (typeof res == 'string') {
					res = JSON.parse(res);
				}
				
				if (!res.success) {
					layer.msg('处理队伍和个人志愿者之间关联关系操作时报错！' + (res.message ? '原因是：' + res.message : ''), {icon: 5});
					return false;
				}
				
				if (typeof callback == 'function') {
					callback(res);
				}
			});
		},
		relateLeader = function(p, callback) {
			CommonUtil.ajaxRequest({
				url: 'volunteer-procession/relateLeader',
				data: p
			}, function(res) {
				if (typeof res == 'string') {
					res = JSON.parse(res);
				}
				if (!res.success) {
					layer.msg('应急队伍在设置领队时报错！' + (res.message ? '原因是：' + res.message : ''), {icon: 5});
					return false;
				}
				
				if (typeof callback == 'function') {
					callback(res);
				}
			});
		},
		relateLeaders = function(p, callback) {
			CommonUtil.ajaxRequest({
				url: 'volunteer-procession/relateLeaders',
				data: p
			}, function(res) {
				if (typeof res == 'string') {
					res = JSON.parse(res);
				}
				if (!res.success) {
					layer.msg('应急队伍在设置领队时报错！' + (res.message ? '原因是：' + res.message : ''), {icon: 5});
					return false;
				}
				
				if (typeof callback == 'function') {
					callback(res);
				}
			});
		},
		removeLeader = function(id, callback) {
			CommonUtil.ajaxRequest({
				url: 'volunteer-procession/removeLeader',
				data: {
					id: id
				}
			}, function(res) {
				if (typeof res == 'string') {
					res = JSON.parse(res);
					if (!res.success) {
						layer.msg('删除领队报错！' + (res.message ? '原因是：' + res.message : ''), {icon: 5});
						return false;
					}
				}
				if (typeof callback == 'function') {
					callback(res);
				}
			});
		},
		exchangeTeams = function(p, callback) {
			CommonUtil.ajaxRequest({
				url: 'volunteer-procession/exchangeTeams',
				data: p
			}, function(res) {
				if (typeof res == 'string') {
					res = JSON.parse(res);
				}
				
				if (!res.success) {
					layer.msg('移动关联团队至其它团队操作时报错！' + (res.message ? '原因是：' + res.message : ''), {icon: 5});
					return false;
				}
				
				if (typeof callback == 'function') {
					callback(res);
				}
			});
		},
		exchangeVolunteers = function(p, callback) {
			CommonUtil.ajaxRequest({
				url: 'volunteer-procession/exchangeVolunteers',
				data: p
			}, function(res) {
				if (typeof res == 'string') {
					res = JSON.parse(res);
				}
				
				if (!res.success) {
					layer.msg('移动关联志愿者至其它团队操作时报错！' + (res.message ? '原因是：' + res.message : ''), {icon: 5});
					return false;
				}
				
				if (typeof callback == 'function') {
					callback(res);
				}
			});
		};
		
		
	// 查询应急队伍分页列表
	this.getPages = getPages;
	// 查询应急队伍关联志愿者团队分页列表
	this.getTeamPage = getTeamPage;
	// 查询空闲团队
	this.getFreeTeamPage = getFreeTeamPage;
	// 查询应急队伍关联志愿者分页列表
	this.getVolunteersPage = getVolunteersPage;
	// 查询空闲个人志愿者
	this.getFreeVolunteersPage = getFreeVolunteersPage;
	// 查询应急队伍网格聚合列表
	this.gridAggregation = gridAggregation;
	// 查询应急队伍详情
	this.detail = detail;
	// 保存应急队伍
	this.save = save;
	// 删除应急队伍
	this.remove = remove;
	// 批量操作应急队伍和志愿者团队的关系
	this.batchHandlerGroup = batchHandlerGroup;
	// 批量操作应急队伍和个人志愿者的关系
	this.batchHandlerHashVolunteer = batchHandlerHashVolunteer;
	// 关联领队
	this.relateLeaders = relateLeaders;
	this.relateLeader = relateLeader;
	
	this.exchangeTeams = exchangeTeams;
	this.exchangeVolunteers = exchangeVolunteers;
	this.removeLeader = removeLeader;


}