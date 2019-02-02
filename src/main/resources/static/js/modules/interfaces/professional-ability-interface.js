/**
 * 组织架构接口定义层
 * @creator winnie
 * @createTime 2018/4/10
 */
const ProfessionalAbilityInterface = (function(){
	const getProAbilityClassPage = function(p, callback) {
			CommonUtil.ajaxRequest({
				url: 'professional-ability/queryProAbilityClassPage',
				data: p
			}, function(res) {
				if (typeof res == 'string') {
					res = JSON.parse(res);
					if (!res.success) {
						layer.msg('加载分类统计数据报错！' + (res.message ? '原因是：' + res.message : ''), {icon: 5});
						return false;
					}
				}
				
				if (typeof callback == 'function') {
					callback(res);
				}
			});
		};
	return {
		getProAbilityClassPage: getProAbilityClassPage
	}
}())