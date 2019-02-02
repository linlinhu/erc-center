var emergencyEventForm = (function(){
	let formSelector = '',
		selectedRegion = null,
		eventTypeList = [],
		eventLeveList = [],
		eventCate = [],
		loadEventCateItems = function(el, ec) {
			ddItemsPicker.init({
				items: eventTypeList,
				pickeredLst: ec,
				title: '事件分类选择（单选）'
			}, function(res) {
				if (res.length == 1) {
					el.val(res.map(r => r.name).join(','));
					$(formSelector + ' input[name="eventType"]').val(res[0].code);
				} else {
					el.html('选择事件分类（单选）');
				}
				eventCate = res;
			});
		},
		eventGrade = [],
		loadEventGradeItems = function(el, eg) {
			ddItemsPicker.init({
				items: eventLevelList,
				pickeredLst: eg,
				title: '重要等级选择（单选）'
			}, function(res) {
				if (res.length == 1) {
					el.val(res.map(r => r.name).join(','));
					$(formSelector + ' input[name="eventLevel"]').val(res[0].code);
				} else {
					el.html('选择事件重要等级（单选）');
				}
				eventGrade = res;
			});
		},
		init = function(p) {
			let DDGetData = new DataDicInterface();
			fomSelector = '#emergency-event-form';
			DDGetData.getItemsByCode('event-level',function(res){
				eventLevelList = res;
			});
			DDGetData.getItemsByCode('event-type',function(res){
				eventTypeList = res;
			});
			if (p) {
				selectedRegion = p.selectedRegion ? p.selectedRegion : null;
			}

			$(fomSelector + ' .event-cate-picker').unbind('click').bind('click', function() {
				loadEventCateItems($(this));
			});
			
			$(fomSelector + ' .event-grade-picker').unbind('click').bind('click', function() {
				loadEventGradeItems($(this));
			});
			laydate.render({
				  elem: '#emergency-event-dotime',
				  type: 'datetime',
				  theme: '#0069b6',
				  value: new Date().Format('yyyy-MM-dd hh:mm:ss')
			});
			$(fomSelector + ' .event-region-picker').unbind('click').bind('click', function() {
				regionPicker.init({
					checkedNodes: selectedRegion
				}, function(res) {
					selectedRegion = res;
					$(fomSelector + ' input[name="regionId"]').val(res.id);
					$(fomSelector + ' .event-region-picker').val(res.name);
				});
			});
			
			$(fomSelector).validate({
		        rules: {
		        	eventTypeName:{
		        		 required: true
		        	},
					eventLevelName: {
		        		 required: true
		        	},
		        	regionName: {
		        		required: true
		        	},
		        	eventTime: {
		        		required: true
		        	},
		        	title: {
		        		required: true,
		        		rangelength: [1,20]
		        	}
		        },
		        messages: {
		        	eventTypeName: {
		        		required: icon+'请选择事件分类'
		        	},
		        	eventLevelName: {
		        		required: icon+'请选择事件分类'
		        	},
		        	regionName: {
		        		required: icon+'请选择所属区域'
		        	},
		        	eventTime: {
		        		required: icon+'请选择发生时间',
		        		rangelength: icon + "标题长度不大于40个字符",
		        	}
		        },
		        submitHandler:function(form){
		        	let saveObj = $(fomSelector).serializeObject();
		        	console.log('saveObj',saveObj)
		        	/*return false;*/
		        	operation({
		        		'moduleName': 'emergency-event', 
		        		'oper': 'save',
		        		'params': {
		        			'data': JSON.stringify(saveObj)
		        		}
		        	})
		        } 
			});
			
		};
		
	return {
		init: init
	}
}());