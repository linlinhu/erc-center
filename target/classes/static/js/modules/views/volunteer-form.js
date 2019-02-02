let VolunteerForm = (function(){
	let formSelector = '',
		isLegalMobile = false,
		ddInterface = null,
		ecmList = null,
		validateMobile = function(mobile) {
			if (mobile.length == 11) {
				isLegalMobile = true;
			} else {
				isLegalMobile = false;
			}

		},
		isLegalIDNumber = false,
		validateIDNumber = function(IDNumber) {
			CommonUtil.ajaxRequest({
				url: 'volunteer/checkExistIDNumber',
				data: {
					IDNumber: IDNumber
				}
			}, function(res) {
				if (typeof res == 'string') {
					res = JSON.parse(res);
				}
				if (!res.success) {
					layer.msg('身份证号验证报错' + (res.message ? '原因是：' + res.message : ''), {icon: 5});
					isLegalIDNumber = false;
				} else {
					isLegalIDNumber = true;
				}
			});
		},
		nation = [],
		loadNationItems = function(el, n) {
			ddInterface.getItemsByCode('nation', function(res) {
				ddItemsPicker.init({
					items: res,
					pickeredLst: n,
					title: '所属民族（单选）'
				}, function(res) {
					if (res.length == 1) {
						el.html(res.map(r => r.name).join(','));
					} else {
						el.html('选择志愿者所属民族（单选）');
					}
					nation = res;
				});
			});
		},
		region = null,
		volunteerProcession = null,
		education = [],
		loadEducationItems = function(el, edu) {
			ddInterface.getItemsByCode('education', function(res) {
				ddItemsPicker.init({
					items: res,
					pickeredLst: edu,
					title: '最高学历选择（单选）'
				}, function(res) {
					if (res.length == 1) {
						el.html(res.map(r => r.name).join(','));
					} else {
						el.html('选择志愿者最高学历（单选）');
					}
					education = res;
				});
			});
			
		},
		jobTitle = [],
		loadJobTitleItems = function(el, jt) {
			ddInterface.getItemsByCode('job-title', function(res) {
				ddItemsPicker.init({
					items: res,
					pickeredLst: jt,
					title: '所属职业选择（单选）'
				}, function(res) {
					if (res.length == 1) {
						el.html(res.map(r => r.name).join(','));
					} else {
						el.html('选择志愿者所属职业（单选）');
					}
					jobTitle = res;
				});
			});
		},
		proAbilityClasses = [],
		loadProAbilityClassesItems = function(el, jt) {
			ddInterface.getItemsByCode('pro-ability-class', function(res) {
				ddItemsPicker.init({
					items: res,
					pickeredLst: jt,
					title: '职能分类选择（单选）'
				}, function(res) {
					console.log('职能分类',res)
					if (res.length == 1) {
						el.html(res.map(r => r.name).join(','));
					} else {
						el.html('选择志愿者的职能分类（单选）');
					}
					proAbilityClasses = res;
				});
			});
		},
		languageSkills = [],
		loadLanguageSkillsItems = function(el, ls) {
			ddInterface.getItemsByCode('language-ability', function(res) {
				ddItemsPicker.init({
					items: res,
					pickeredLst: ls,
					title: '语言技能选择（多选，最多5个）',
					maxLen: 5
				}, function(res) {
					if (res.length > 0) {
						el.html(res.map(r => r.name).join(','));
					} else {
						el.html('选择志愿者语言技能（多选，最多5个）');
					}
					languageSkills = res;
				});
			});
		},
		serviceTimes = [],
		loadServiceTimesItems = function(el, st) {
			ddInterface.getItemsByCode('service-time', function(res) {
				ddItemsPicker.init({
					items: res,
					pickeredLst: st,
					title: '服务时间选择（多选，最多5个）',
					maxLen: 5
				}, function(res) {
					if (res.length > 0) {
						el.html(res.map(r => r.name).join(','));
					} else {
						el.html('选择志愿者服务时间（多选，最多5个）');
					}
					serviceTimes = res;
				});
			});
		},
		knowledgeSkills = [],
		loadKnowledgeSkillsItems = function(el, ks) {
			ddInterface.getItemsByCode('knowledge-skill', function(res) {
				ddItemsPicker.init({
					items: res,
					pickeredLst: ks,
					title: '知识技能选择（多选，最多5个）',
					maxLen: 5
				}, function(res) {
					if (res.length > 0) {
						el.html(res.map(r => r.name).join(','));
					} else {
						el.html('选择志愿者知识技能（多选，最多5个）');
					}
					knowledgeSkills = res;
				});
			});
		},
		serviceIntentions = [],
		loadServiceIntentionsItems = function(el, si) {
			ddInterface.getItemsByCode('service-intention', function(res) {
				ddItemsPicker.init({
					items: res,
					pickeredLst: si,
					title: '服务意向选择（多选，最多5个）',
					maxLen: 5
				}, function(res) {
					if (res.length > 0) {
						el.html(res.map(r => r.name).join(','));
					} else {
						el.html('选择志愿者服务意向（多选，最多5个）');
					}
	
					serviceIntentions = res;
				});
			});
		},
		serviceFields = [],
		loadServiceFieldsItems = function(el, sf) {
			ddInterface.getItemsByCode('service-field', function(res) {
				ddItemsPicker.init({
					items: res,
					pickeredLst: sf,
					title: '专业领域选择（多选，最多5个）',
					maxLen: 5
				}, function(res) {
					if (res.length > 0) {
						el.html(res.map(r => r.name).join(','));
					} else {
						el.html('选择志愿者专业领域（多选，最多5个）');
					}
	
					serviceFields = res;
				});
			});
		},
		getContactAddr = function(callback) {//在地图上定位
			let addrSelector = formSelector + ' input[name="contactAddr"]',
				regionValue = $(formSelector + ' .region-choosen-click').attr('data-value'),
				contactAddr = JSON.parse(regionValue),
				endPointAddress = $(addrSelector).val(),
				myGeo = new BMap.Geocoder();
			
			contactAddr.fullAddress= contactAddr.fullAddress + endPointAddress;
			contactAddr.endPointAddress = endPointAddress;
			myGeo.getPoint(contactAddr.fullAddress, function(point){
				if (point == null) {
					layer.msg('地址信息非常重要，请正确填写！', {icon: 5});
					$(addrSelector).val('')
					callback(null);
				} else {
					contactAddr.longitude = point.lng;
					contactAddr.latitude = point.lat;
					callback(contactAddr);
				}
			});
				
		},
		init = function(p) {
			formSelector = p.formEl;
			ddInterface = new DataDicInterface();
			getAllEcm();
			if (p) {
				nation = p.nation ? [p.nation] : [];
				region = p.region ? p.region : null;
				volunteerProcession = p.volunteerProcession ? p.volunteerProcession : null;
				education = p.education ? [p.education] : [];
				jobTitle = p.jobTitle ? [p.jobTitle] : [];
				languageSkills = p.languageSkills ? p.languageSkills : [];
				serviceTimes = p.serviceTimes ? p.serviceTimes : [];
				knowledgeSkills = p.knowledgeSkills ? p.knowledgeSkills : [];
				serviceIntentions = p.serviceIntentions ? p.serviceIntentions : [];
				serviceFields = p.serviceFields ? p.serviceFields : [];
				avatar = p.avatar ? p.avatar : [];
				proAbilityClasses = p.proAbilityClasses?p.proAbilityClasses : [];
			};

			if (nation.length > 0) {
				$(formSelector + ' .nation-picker').html(nation.map(n => n.name).join(','));
			}
			if (region) {
				$(formSelector + ' .region-choosen-click').val(region.name);
			}
			if (volunteerProcession) {
				$(formSelector + ' .volunteerProcession-choosen-click').html(volunteerProcession.name);
			}
			if (education.length > 0) {
				$(formSelector + ' .education-picker').html(education.map(e => e.name).join(','));
			}
			if (jobTitle.length > 0) {
				$(formSelector + ' .jobtitle-picker').html(jobTitle.map(j => j.name).join(','));
			}
			if (languageSkills.length > 0) {
				$(formSelector + ' .languageskills-picker').html(languageSkills.map(ls => ls.name).join(','));
			}
			if (serviceTimes.length > 0) {
				$(formSelector + ' .servicetimes-picker').html(serviceTimes.map(st => st.name).join(','));
			}
			if (knowledgeSkills.length > 0) {
				$(formSelector + ' .knowledgeSkills-picker').html(knowledgeSkills.map(ks => ks.name).join(','));
			}
			if (serviceIntentions.length > 0) {
				$(formSelector + ' .serviceintentions-picker').html(serviceIntentions.map(si => si.name).join(','));
			}
			if (serviceFields.length > 0) {
				$(formSelector + ' .servicefields-picker').html(serviceFields.map(sf => sf.name).join(','));
			}
			if(proAbilityClasses.length > 0) {
				$(formSelector + ' .proAbilityClasses-picker').html(proAbilityClasses.map(sf => sf.name).join(','));
			}
			if (avatar.picUrls) {
				showUploadImg(avatar.picUrls,formSelector)
			}
			$(formSelector + ' input[name="mobile"]').blur(function(){
				validateMobile($(this).val());
			});

			$(formSelector + ' input[name="IDNumber"]').blur(function(){
				validateIDNumber($(this).val());
			});
			
			$(formSelector + ' .nation-picker').unbind('click').bind('click', function() {
				loadNationItems($(formSelector + ' .nation-picker'), nation);
			});
			$(formSelector + ' .region-choosen-click').unbind('click').bind('click', function(){
				regionPicker.init({
					multiSelect: false,
					checkedNodes: region,
					queryParentNode: true,
					openLayerWindow: true
				}, function(res,layerWindowId) {
					let regionName = "",
						regionValue = "",
						frontValue = $(formSelector + ' .region-choosen-click').attr('data-value');
					console.log('区域选中',res);
					if(res.level == 3){
						console.log(res.level,layerWindowId);
						layer.close(layerWindowId);
						region = res;
						if(region.city){
							regionName = region.province.name + region.city.name + region.name;
							regionvalue = {
										"fullAddress": regionName,
										"cityCode": region.city.code,
										"cityName": region.city.name,
										"provinceCode": region.province.code,
										"provinceName": region.province.name,
										"cityFirstLevelCode": region.code,
										"cityFirstLevelName": region.name,
							};
						} else {
							regionName = region.province.name + region.name;
							regionvalue = {
									"fullAddress": regionName,
									"provinceCode": region.province.code,
									"provinceName": region.province.name,
									"cityFirstLevelCode": region.code,
									"cityFirstLevelName": region.name,
							};
						}
						$(formSelector + ' .region-choosen-click').val(regionName);
						$(formSelector + ' .region-choosen-click').attr('data-value',JSON.stringify(regionvalue));
						$(formSelector + ' .region-choosen-click').trigger('blur');
						if(frontValue != JSON.stringify(regionvalue)) {
							$(formSelector + ' input[name="contactAddr"]').val('');
						}
					} else {
						layer.msg('请选择行政区域',{icon:5})
					}
					
				});
				
			});
			$(formSelector + ' .volunteerprocession-choosen-click').unbind('click').bind('click', function(){
				ProceessionPickerPanel.init({
					title: '请选择志愿者关联应急队伍（多选）',
				}, function(data) {
					if(data.others.length >= 1){
						let ids = [],
							names = [],
							temp = [];
						data.others.forEach(function(value,index,array){
							temp = value.split('-');
							ids.push(temp[0]);
							names.push(temp[1]);
						});
						layer.close(data.layerWindowIndex);
						$(formSelector + ' .volunteerprocession-choosen-click').val(names.join(','));
						$(formSelector + ' input[name="mixTeamIds"]').val(ids.join(','));
					} else {
						layer.msg('至少选择一个应急队伍',{icon:5})
					}
					console.log('data',data);
				});
			});
			
			$(formSelector + ' .education-picker').unbind('click').bind('click', function() {
				loadEducationItems($(formSelector + ' .education-picker'), education);
			});
			
			$(formSelector + ' .jobtitle-picker').unbind('click').bind('click', function() {
				loadJobTitleItems($(formSelector + ' .jobtitle-picker'), jobTitle);
			});
			$(formSelector + ' .proAbilityClasses-picker').unbind('click').bind('click', function() {
				loadProAbilityClassesItems($(formSelector + ' .proAbilityClasses-picker'), proAbilityClasses);
			});
			
			$(formSelector + ' .languageskills-picker').unbind('click').bind('click', function() {
				loadLanguageSkillsItems($(formSelector + ' .languageskills-picker'), languageSkills);
			});
			$(formSelector + ' .servicetimes-picker').unbind('click').bind('click', function() {
				loadServiceTimesItems($(formSelector + ' .servicetimes-picker'), serviceTimes);
			});
			$(formSelector + ' .knowledgeskills-picker').unbind('click').bind('click', function() {
				loadKnowledgeSkillsItems($(formSelector + ' .knowledgeskills-picker'), knowledgeSkills);
			});
			$(formSelector + ' .serviceintentions-picker').unbind('click').bind('click', function() {
				loadServiceIntentionsItems($(formSelector + ' .serviceintentions-picker'), serviceIntentions);
			});
			$(formSelector + ' .servicefields-picker').unbind('click').bind('click', function() {
				loadServiceFieldsItems($(formSelector + ' .servicefields-picker'), serviceFields);
			});
			
			$('.i-checks').iCheck({
                checkboxClass: 'icheckbox_square-green',
                radioClass: 'iradio_square-green',
            });
			$(formSelector).on('click','.addImg',function(){
				uploadcouponImgResources();
			});
			$(formSelector).on('click','.removeImg',function(){
				removeUploadImg(formSelector);
			});
			$(formSelector + ' input[name=mobile]').on('input', function(){
				if($(this).val().length == 11){
					$(this).trigger('blur').trigger('focus');
				}
			});
			$(formSelector + ' input[name=idnumber]').on('input', function(){
				if($(this).val().length == 18){
					$(this).trigger('blur').trigger('focus');
				}
			});
			
			$(formSelector).validate({
		        rules: {
		        	mobile: {
		                required: true,
		                phone: true
		            },
		            idnumber: {
		            	required: true,
		            	isIdCardNo: true
		            },
		            realName: {
		            	required: true,
		            	rangelength: [1,20],
		            	isName: true
		            },
		            gender: {
		            	required: true
		            },
		            regionName: {
		            	required: true
		            },
		            contactAddr: {
		            	required: true
		            }
		        },
		        messages: {
		        	mobile: {
		                required: icon+'请填写手机号码',
		                phone: icon + '请填写11位有效的手机号码',
		            },
		            idnumber: {
		                required: icon+'请填写身份证号',
		                isIdCardNo: icon + '请填写18位有效的身份证号',
		            },
		            realName: {
		            	required: icon + "请输入姓名",
		     	        rangelength: icon + "姓名的长度介于2-20之间",
		     	        isName: icon + "不能以空格开始或结尾"
		            },
		            gender: {
		            	required: icon + "请选择性别"
		            },
		            regionName: {
		            	required: icon + "请选择所属区域"
		            },
		            contactAddr: {
		            	required: icon + "请输入通讯地址"
		            }
		        },
		        submitHandler:function(form){
		        	let saveObj = $(formSelector).serializeObject();
		        		
		        	saveObj.dependences = [{
			            ecmId: ecmList[0].id,
			            ecmName: ecmList[0].describe
			        }];
		        	saveObj.nation = nation.length > 0 ? nation[0] : null;
		        	saveObj.region = region;
		        	saveObj.volunteerProcession = volunteerProcession;
		        	saveObj.education = education.length > 0 ? education[0] : null;
		        	saveObj.jobTitle = jobTitle.length > 0 ? jobTitle[0]: null;
		        	saveObj.languageSkills = languageSkills;
		        	saveObj.serviceTime = serviceTimes;
		        	saveObj.knowledgeSkills = knowledgeSkills;
		        	saveObj.serviceIntentions = serviceIntentions;
		        	saveObj.serviceFields = serviceFields;
		        	saveObj.proAbilityClasses = proAbilityClasses;
		        	saveObj.avatar = {};
		        	saveObj.avatar.picUrls = saveObj.picUrls;
		        	if(saveObj.mixTeamIds){
		        		saveObj.mixTeamIds = saveObj.mixTeamIds.split(',');
		        	} else {
		        		saveObj.mixTeamIds = [];
		        	}
		        	getContactAddr(function(res) {
		        		
		        		saveObj.contactAddr = res;
		        		
		        		operation({
			        		'moduleName': 'volunteer', 
			        		'oper': 'save',
			        		'params': {
			        			'data': JSON.stringify(saveObj)
			        		}
			        	},function(){
			        		goPage('index');
			        		layer.msg('保存成功',{icon:6,time:1500});
			        	})
		        	});
		        } 
			});
			
		};
		function uploadcouponImgResources() {
			var html =  '<div id="uploadInterface" style="z-index:999;">'+
							'<div class="webuploader" id="couponImgResourcesUploader">'+
								$('#webuploaderTPL').html() +
						    '</div>'+
						'</div>',
				uploadPics = [];	
						
			layer.open({
				type : 1,
				title : '上传图片资源',
				skin : 'layui-layer-rim', //加上边框
				area : [ '60%', '450px' ], //宽高
				content : '<div class="wrapper-content">' + html + '</div>',
				btn : [ '确定'],
				yes : function(lindex, layero) {
					console.log('uploadPics',uploadPics)
					if (uploadPics.length == 0) {
						layer.msg('请上传张图片后再点击此按钮', {icon: 5});
						return false;
					} else {
						showUploadImg(uploadPics[0],formSelector)
						layer.closeAll();
					}
					
				}
			});
			
			CUploadFiles({
				uploaderId: 'couponImgResourcesUploader',
				filesType: ['img'],
				uploadUrl: '/file/upload.do',
				fileNumLimit: 1
			}, function(file, response){
				console.log('图片上传结果',response);
				if(response.success){
					var ImgUrl = response.result.storage[2].fileStorageUrl;
					console.log(ImgUrl);
					uploadPics.push(ImgUrl);
				} else {
					layer.msg(response.message?response.message:'上传失败', {icon: 5});
				}
				
			})
		};
		function getAllEcm(){
			var option = {
					url: 'volunteer/getAllEcm',
					type:'GET'
			};
			CommonUtil.ajaxRequest(option, function(result){
				if(result.success){
					ecmList = result.result;
				} else {
					layer.msg('获取组织关系失败', {icon: 5});
				}
				
			})
		};
		
	/*return {
		init: init,
		datas: {
			education: education[0],
			jobTitle: jobTitle[0],
			languageSkills: languageSkills,
			serviceIntentions: serviceIntentions
		}
		
	}*/
	this.init = init;
});
jQuery.validator.addMethod("isName", function(value, element) {       
    return this.optional(element) || /^\S.*\S$/.test(value);       
}, "不能以空格开始或结尾");

