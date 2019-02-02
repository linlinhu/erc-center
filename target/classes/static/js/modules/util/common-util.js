/**
 * 公共工具类
 * @creator 李丹Danica
 * @createTime 2018/3/20
 */
const CommonUtil = (function() {
	let systemToken = null,
		systemEcmId = null,
		systemEcmName = null,
		systemLoginUser = null;
	
	const getIdsOfEls = function(els, callback) {// 获取对象集合的数据编号集合
			let ids = [],
				others = [];
			if (els.length > 0) {
				$.each(els, function() {
					ids.push($(this).attr('data-id'));
					if ($(this).attr('data-others')) {
						others.push($(this).attr('data-others'));
					} else {
						others.push($(this).attr('data-id'));
					}
				});
				if (typeof callback == 'function') {
					callback(ids.join(','), others);
				}
			} else {
				layer.msg('未勾选操作记录', {icon: 5});
			}		 
		},
		formDataSetAndGet = function(p, callback) {
			let container = p.container,
				obj = p.data;
			
			if (!container) {
				console.log('表单构建器，参数缺失');
				return false;
			}
			if ($(container).length != 1) {
				console.log('表单构建器，表单对象不存在或者存在多个');
				return false;
			}
			if (obj) {
				$.each($(container).find('input[role="user-params"]'), function() {
					let el = $(this);
					for (variable in obj) {
						if (el.attr('name') == variable) {
							el.val(obj[variable]);
						}
					}
				});
				
				$.each($(container).find('textarea[role="user-params"]'), function() {
					let el = $(this);
					for (variable in obj) {
						if (el.attr('name') == variable) {
							el.val(obj[variable]);
						}
					}
				});
			}
			
			if (typeof callback == 'function') {
				callback($(container).serializeObject());
			}
		},
		ajaxRequest = function(p, successFn) {
			if (systemToken && systemEcmId) {
				/*$('.layui-laydate').remove();*/
				if (!p.forbidLoading) {
					loading = layer.load();	
				}
			    $.ajax({
			    	url: p.url,
			    	data: stringHtmlEsc(p.data),
			    	type: p.type ? p.type : 'get',
					beforeSend: function(request) {
			            request.setRequestHeader("token", systemToken);
			            request.setRequestHeader("ecmId", systemEcmId);
			            request.setRequestHeader("ecmName", encodeURI(systemEcmName));
			        },
			    	success:function(res){
			    		if (!p.forbidLoading) {
			    			layer.close(loading);
				    	}
			    		successFn(res);
			    	},
			    	error:function(){
			    		layer.alert('抱歉，资源访问失败',{
							closeBtn: 1
						},function(){
			    			layer.close(loading);
			    			layer.closeAll('dialog');
						});
			    	}
			    })
			} else {
				window.location.replace("/login");
			}
		},
		operation = function(p, callback) {
			let moduleName; // 模块名称
			let oper; // 操作名称
			let params; // 参数
			let moduleNameChinese; // 模块名称对应配置中文
			let operChinese; // 操作名称对应配置英文
			let confirmMsg; // 确认信息
			
			p = p ? p : {};
			moduleName = p.moduleName;
			oper = p.oper;
			params = p.params ? p.params : {};
			
			if (!moduleName || !oper) {
				console.log('ERR: 数据请求必要参数缺失')
				return false;
			}
			if (!p.forbidConfirm) {
				$.ajaxSettings.async = false;
				$.getJSON('js/emin/moduleName_en_cn.json', function(res) {
					for (var i = 0; i < res.length; i++) {
						if (res[i].key.toLowerCase() == moduleName.toLowerCase()) {
							moduleNameChinese = res[i].value;
						}
					}
				});
				$.getJSON('js/emin/oper_en_cn.json', function(res) {
					for (var i = 0; i < res.length; i++) {
						if (res[i].key.toLowerCase() == oper.toLowerCase()) {
							operChinese = res[i].value;
						}
					}
				});
				$.ajaxSettings.async = true;
				
				if (!moduleNameChinese) {
					console.log('未配置模块名称【' + moduleName + '】的对应中文');
				}
				if (!operChinese) {
					console.log('未配置操作名称【' + oper + '】的对应中文');
				}
				confirmMsg = p.confirmMsg ? p.confirmMsg
						: ('来自' +  moduleNameChinese + '的提示:是否确认' + operChinese + '? ');
			
				layer.confirm(confirmMsg, {
					icon : 3,
					btn : [ '确认', '取消' ]// 按钮
				}, function(cindex) {
					layer.close(cindex);
					ajaxRequest({
						url : moduleName + '/' + oper,
						data : params,
						type : "post",
					}, function(data) {
						if (typeof data == 'string') {
							data = JSON.parse(data);
						}
						if (!data.success) {
							layer.msg(moduleNameChinese + operChinese + "失败！"
									+ (data.message ? "错误提示：" + data.message : ""), {
								icon : 5
							});
						} else {
							if (typeof callback == 'function') {
								callback(data);
							} else {
								layer.msg(moduleNameChinese + operChinese + "成功！", {
									icon : 6
								});
								goPage('index');
							}
						}
					});
				});
			} else {
				ajaxRequest({
					url : moduleName + '/' + oper,
					data : params,
					type : "post",
				}, function(data) {
					if (typeof data == 'string') {
						data = JSON.parse(data);
					}
					if (!data.success) {
						layer.msg(moduleNameChinese + operChinese + "失败！"
								+ (data.message ? "错误提示：" + data.message : ""), {
							icon : 5
						});
					} else {
						if (typeof callback == 'function') {
							callback(data);
						} else {
							layer.msg(moduleNameChinese + operChinese + "成功！", {
								icon : 6
							});
							goPage('index');
						}
					}
				});
			}
			
		},
		html2Escape = function(sHtml) {
			return sHtml.replace(/[<>&"']/g, function(c){
				return {'<':'&lt;','>':'&gt;','&':'&amp;','"':'”','\'':'’'}[c];
			});
		},
		stringHtmlEsc = function(obj) {
			for (i in obj) {
				if (typeof obj[i] == 'string') {
					if ((obj[i].indexOf('{') == 0 && obj[i].lastIndexOf('}') == (obj[i].length - 1)) || (obj[i].indexOf('[') == 0 && obj[i].lastIndexOf(']') == (obj[i].length - 1))) {
						let valObj = JSON.parse(obj[i]);
						obj[i] = JSON.stringify(stringHtmlEsc(valObj));
					} else {
						obj[i] = html2Escape(obj[i]);
					}
				}
			}
			return obj;
		},
		getHeaders = function() {
			return {
				systemToken: systemToken,
				systemEcmId: systemEcmId,
				systemEcmName: systemEcmName,
				systemLoginUser: systemLoginUser
			}
		},
		initGlobalParams = function(g_token = '', g_ecmId = '', g_ecmName = '', g_login_user = {}) {
			if (g_token) {
				localStorage.erc_system_token = g_token;
			}
			if (g_ecmId) {
				localStorage.erc_system_ecmId = g_ecmId;
			}
			if (g_ecmName) {
				localStorage.erc_system_ecmName = g_ecmName;
			}
			if (g_login_user) {
				localStorage.erc_login_user = g_login_user;
			}
			systemToken = localStorage.erc_system_token;
			systemEcmId = localStorage.erc_system_ecmId;
			systemEcmName = localStorage.erc_system_ecmName;
			systemLoginUser = localStorage.erc_login_user;
		};
		
	return {
		initGlobalParams: initGlobalParams,
		ajaxRequest: ajaxRequest,
		getIdsOfEls: getIdsOfEls,
		formDataSetAndGet: formDataSetAndGet,
		operation: operation,
		stringHtmlEsc: stringHtmlEsc,
		getHeaders: getHeaders
	}
}());