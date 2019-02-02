const emergencyRehearsalInterFace = (function(){
	let getPage = function(p,callback){
		CommonUtil.ajaxRequest({
			url: 'emergency-rehearsal/getPage',
			data: p
		}, function(res) {
			if (typeof res == 'string') {
				res = JSON.parse(res);
				if (!res.pages) {
					layer.msg('数据请求出错！' + (res.message ? '原因是：' + res.message : ''), {icon: 5});
					return false;
				}
			}
			if (typeof callback == 'function') {
				callback(res);
			}
		});
	},
	getComments = function(p,callback){//获取点评或评分
		CommonUtil.ajaxRequest({
			url: p.url,
			data: p
		}, function(res) {
			if (typeof res == 'string') {
				res = JSON.parse(res);
				if (!res.success) {
					layer.msg('数据请求出错！' + (res.message ? '原因是：' + res.message : ''), {icon: 5});
					return false;
				}
			}
			if (typeof callback == 'function') {
				callback(res.result);
			}
		});
	},
	saveComment = function(p,callback){//保存应急演练点评
		CommonUtil.ajaxRequest({
			url: 'emergency-rehearsal/saveComment',
			data: p
		}, function(res) {
			if (typeof res == 'string') {
				res = JSON.parse(res);
				if (!res.success) {
					layer.msg('保存点评出错！' + (res.message ? '原因是：' + res.message : ''), {icon: 5});
					return false;
				}
			}
			if (typeof callback == 'function') {
				callback(res);
			}
		});
	},
	getTeams = function(p,callback){
		CommonUtil.ajaxRequest({
			url: 'emergency-rehearsal/getTeams',
			data: p
		}, function(res) {
			if (typeof res == 'string') {
				res = JSON.parse(res);
				if (!res.success) {
					layer.msg('获取演练队伍数据出错！' + (res.message ? '原因是：' + res.message : ''), {icon: 5});
					return false;
				}
			}
			if (typeof callback == 'function') {
				callback(res);
			}
		});
	},
	findTeamVol = function(p,callback){//查看演练队伍中的志愿者
		CommonUtil.ajaxRequest({
			url: 'emergency-rehearsal/findTeamVol',
			data: p
		}, function(res) {
			if (typeof res == 'string') {
				res = JSON.parse(res);
				if (!res.success) {
					layer.msg('获取演练队伍数据出错！' + (res.message ? '原因是：' + res.message : ''), {icon: 5});
					return false;
				}
			}
			if (typeof callback == 'function') {
				callback(res.result);
			}
		});
	},
	saveEvaluate = function(p,callback){//保存评分
		CommonUtil.ajaxRequest({
			url: 'emergency-rehearsal/saveEvaluate',
			data: p
		}, function(res) {
			if (typeof res == 'string') {
				res = JSON.parse(res);
				if (!res.success) {
					layer.msg('保存评分失败！' + (res.message ? '原因是：' + res.message : ''), {icon: 5});
					return false;
				}
			}
			if (typeof callback == 'function') {
				callback(res);
			}
		});
	},
	modifyTeams = function(p, callback) {
		let requestParams = null,
			confirmMsg = null;
		
		
		p = p ? p : {};
		if (p.drillEventId && (typeof p.addTeams == 'object' || typeof p.delTeams == 'object')) {
			if (p.addTeams) {
				let addTeamIds = [],
					addTeamNames = [],
					addTeamTypes = [];
					
				p.addTeams.map(o => {
					addTeamIds.push(o.teamId);
					addTeamNames.push(o.teamName);
					addTeamTypes.push(o.teamType);
				});
				confirmMsg = '来自演练队伍的提示：是否确认关联保存当前应急队伍数据？';
				requestParams = {
					addTeamIds: addTeamIds.join(','),
					addTeamNames: addTeamNames.join(','),
					addTeamTypes: addTeamTypes.join(',')	
				};
			}
			if (p.delTeams) {
				let delTeamIds = [],
					delTeamTypes = [];
				
				p.delTeams.map(o => {
					delTeamIds.push(o.teamId);
					delTeamTypes.push(o.teamType);
				});

				confirmMsg = '来自演练队伍的提示：是否确认删除当前关联应急队伍数据？';
				requestParams = {
					delTeamIds: delTeamIds.join(','),
					delTeamTypes: delTeamTypes.join(',')	
				};
			}
			requestParams.drillEventId = p.drillEventId;
			
			CommonUtil.operation({
				moduleName: 'emergency-rehearsal',
				oper: 'teamModify',
				params: requestParams,
				confirmMsg: confirmMsg
			}, function(res) {
				if (typeof callback == 'function') {
					callback(res);
				} else {
					layer.msg('操作成功！', {icon: 6});
				} 
			});
		}
	};
	
	
	return {
		getPage: getPage,
		getComments: getComments,
		saveComment: saveComment,
		getTeams: getTeams,
		findTeamVol: findTeamVol,
		saveEvaluate: saveEvaluate,
		modifyTeams: modifyTeams
	}
}());