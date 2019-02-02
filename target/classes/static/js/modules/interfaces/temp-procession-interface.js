/**
 * 临时应急队伍接口定义层
 * @creator 李丹Danica
 * @createTime 2018/4/13
 */
const TempProcessionInterface = function() {
	const detail = function(id, callback) {
			CommonUtil.operation({
				moduleName: 'temp-procession',
				oper: 'detail',
				params: {
					id: id
				},
				forbidConfirm: true
			}, callback)
		}, 
		save = function(data, callback) {
			CommonUtil.operation({
				moduleName: 'temp-procession',
				oper: 'save',
				params: {
					data: JSON.stringify(data)
				},
				forbidConfirm: true
			}, callback)
		},
		getTeamPage = function(p, callback) {
			CommonUtil.operation({
				moduleName: 'temp-procession',
				oper: 'getRelateTeams',
				params: p,
				forbidConfirm: true
			}, callback);
		},
		getFreeTeamPage = function(p, callback) {
			CommonUtil.operation({
				moduleName: 'temp-procession',
				oper: 'getFreeTeams',
				params: p,
				forbidConfirm: true
			}, callback);
		},
		getVolunteersPage = function(p, callback) {
			CommonUtil.operation({
				moduleName: 'temp-procession',
				oper: 'getRelateVolunteers',
				params: p,
				forbidConfirm: true
			}, callback);
		},
		getFreeVolunteersPage = function(p, callback) {
			CommonUtil.operation({
				moduleName: 'temp-procession',
				oper: 'getFreeVolunteersPage',
				params: p,
				forbidConfirm: true
			}, callback);
		};
		
		
	this.detail = detail;
	this.save = save;
	this.getTeamPage = getTeamPage;
	this.getFreeTeamPage = getFreeTeamPage;
	this.getVolunteersPage = getVolunteersPage;
	this.getFreeVolunteersPage = getFreeVolunteersPage;
}