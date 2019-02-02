/**
 * 请假时间选择 created by Danica in 2017-6-30
 */
var pickerParams = {};

function PeriodsPicker(params) {
	if(!params.id) return false;
	pickerParams.pickerEl = document.getElementById(params.id);
	pickerParams.periodTimes = params.timePeriods ? params.timePeriods : [];
	if (params.showWeeksAmount && params.showWeeksAmount > 0 && params.showWeeksAmount <= 5) {
		pickerParams.calenDaysAmount = params.showWeeksAmount * 7; 
	} else {
		pickerParams.calenDaysAmount = 35; 
	}
	pickerParams.date =  params.beginDate ? params.beginDate : new Date();
	

	this.load = function() {
		var loading = null;
		
		if (layer) loading = layer.load();//支持第三方插件layer动画加载
		$.getJSON ("js/plugins/periodsPicker/dr.json", function (data){
			pickerParams.dutyAndRest = data;
			pickerParams.pickerEl.innerHTML = '<ul class="calen-title">'+
				'<li>日</li>'+
				'<li>一</li>'+
				'<li>二</li>'+
				'<li>三</li>'+
				'<li>四</li>'+
				'<li>五</li>'+
				'<li>六</li>'+
			'</ul>'+
			'<ul class="calen-date"></ul>'+
			'<div class="more-date">'+
				'<i class="before" onclick="showBeforeMonth()"></i>'+
				'<span></span>'+
				'<i class="after" onclick="showNextMonth()"></i>'+
			'</div>';
//			grtRecentDutyDays(pickerParams.date);
			grtRecentDutyDays(new Date());
			if (new Date().getTime() - pickerParams.date.getTime() > 86400000){
				pickerParams.pickerEl.querySelectorAll('.more-date i.before')[0].style.display = 'block';
			} else {
				pickerParams.pickerEl.querySelectorAll('.more-date i.before')[0].style.display = 'none';
			}
			if(loading) layer.close(loading);
		});
		
		
	}

	this.getPickedPeriods = function() {
		return pickerParams.periodTimes;
	}
}
/**
 * 根据日期获取当月天数
 * 
 * @param {Object}
 *            date
 */
function getDays(date) {
	// 获取年份
	var year = date.getFullYear(),
	// 获取当前月份
	mouth = date.getMonth() + 1,
	// 定义当月的天数；
	days;

	// 当月份为二月时，根据闰年还是非闰年判断天数
	if (mouth === 2) {
		days = year % 4 === 0 ? 29 : 28;
	} else if (mouth === 1 || mouth === 3 || mouth === 5 || mouth === 7
			|| mouth === 8 || mouth === 10 || mouth === 12) {
		// 月份为：1,3,5,7,8,10,12 时，为大月.则天数为31；
		days = 31;
	} else {
		// 其他月份，天数为：30.
		days = 30;
	}
	return days;
}

/**
 * 判断日期是否属于某个类型
 * 
 * @param {Object}
 *            date 日期
 * @param {Object}
 *            type 上班或者休息
 */
function isTypeDay(date, type) {
	var i, j, k, 
		days = null, 
		d = new Date(date);

	if (d.getFullYear() === parseInt(pickerParams.dutyAndRest.year)) {
		for (j = 0; j < pickerParams.dutyAndRest.days.length; j++) {
			if (parseInt(pickerParams.dutyAndRest.days[j].month) === (d.getMonth() + 1)) {
				if (type === 'rest') {
					days = pickerParams.dutyAndRest.days[j].restDays;
				}
				if (type === 'duty') {
					days = pickerParams.dutyAndRest.days[j].dutyDays;
				}
				if (days !== null) {
					for (k = 0; k < days.length; k++) {
						if (parseInt(days[k]) === d.getDate()) {
							return true;
						}
					}
				}
			}
		}
	}
	return false;
}

/**
 * 判断是否已经选中了某个时间区间
 * 
 * @param {Object}
 *            beginTime 该时间区间的开始时间 （一般为某天上午的9:00和某天下午的13:30） 他在时间区间数组中是唯一的
 */
function hasDayPeriod(beginTime) {
	var i;

	for (i = 0; i < pickerParams.periodTimes.length; i++) {
		if (pickerParams.periodTimes[i].beginTime === beginTime) {
			return true;
		}
	}
	return false;
}

/**
 * 根据时间点，从时间区间数组中删除时间区间
 * 
 * @param {Object}
 *            beginTime 某个时间区间的开始时间 （一般为某天上午的9:00和某天下午的13:30） 他在时间区间数组中是唯一的
 */
function delPeriodByTime(beginTime) {
	var i, newPeriodTimes = [];

	for (i = 0; i < pickerParams.periodTimes.length; i++) {
		if (pickerParams.periodTimes[i].beginTime === beginTime) {
			continue;
		}
		newPeriodTimes.push(pickerParams.periodTimes[i]);
	}
	pickerParams.periodTimes = newPeriodTimes;
}

/**
 * 生成日期的html标签
 * 
 * @param {Object}
 *            obj 日期对象
 */
function grtDay(obj) {
	var dstr = obj.year + '-' + obj.month + '-' + obj.day, 
		amIsSelected = hasDayPeriod(new Date(dstr + ' 9:00').getTime()), 
		pmIsSelected = hasDayPeriod(new Date(dstr + ' 13:30').getTime()),
		isToday = (obj.year === new Date().getFullYear() && obj.month === new Date().getMonth() + 1 && obj.day === new Date().getDate());
	
		if(isToday) {

			if (new Date().getTime() - pickerParams.date.getTime() > 86400000){
				obj.isForbid = false;
			} else {
				obj.isForbid = true;
			}
		}

//		isToday = (obj.year === pickerParams.date.getFullYear() && obj.month === pickerParams.date.getMonth() + 1 && obj.day === pickerParams.date.getDate());

	return '<li '
			+ ' class = "'
			+ (obj.isForbid ? 'forbid ' : '')
			+ (isToday ? 'today ' : '')
			+ '" date-str = "'
			+ dstr
			+ '">'
			+ (parseInt(obj.day) === 1 ? (obj.day + '<div>' + obj.month + '月</div>')
					: obj.day)
			+ (obj.text ? ('<span>' + obj.text + '</span>') : '')
			+ (!obj.isForbid ? '<circle class="time-period" >'
					+ '<i class = " ' + (amIsSelected ? 'selected' : '')
					+ ' am" onclick="periodPick(this, 1)" alt="' + dstr
					+ ' 上午" title="' + dstr + ' 上午"></i>' + '<i class = " '
					+ (pmIsSelected ? 'selected' : '')
					+ ' pm" onclick="periodPick(this, 2)" alt="' + dstr
					+ ' 下午" title="' + dstr + ' 下午"></i></circle>' : '')
			+ '</li>';
}

function grtRecentDutyDays(date, daysAmount) {
	var i, y, m, d, obj, leaveDays = [], // 可用请假日期对象
		year = date.getFullYear(), 
		month = date.getMonth() + 1, 
		day = date.getDate(), 
		weekDay = date.getDay(), 
		beginDay = day - weekDay, 
		lastMonthLastDay = getDays(new Date(year + '-' + (month - 1) + '-1')), // 上月天数
		monthLastDay = getDays(new Date(year + '-' + month + '-1')), // 本月天数
		nextMonthLastDay = getDays(new Date(year + '-' + (month + 1) + '-1')), // 下月天数
		endDay = 0, 
		dayLi = pickerParams.pickerEl.getElementsByClassName('calen-date'), 
		html = '';
	
	daysAmount = daysAmount ? daysAmount : pickerParams.calenDaysAmount;
	
	if (beginDay <= 0) { // 存在上一月的数据
		endDay = beginDay + daysAmount - 1;
		beginDay = lastMonthLastDay + beginDay;
		y = year, m = month - 1;
		if (month === 1) { // 上一月是上一年
			y = year - 1, m = 12;
		}
		// 加载上月数据
		for (i = beginDay; i <= lastMonthLastDay; i++) {
			leaveDays.push({
				y : y,
				m : m,
				d : i
			});
		}
	
		for (i = 1; i <= endDay; i++) {
			if (i > monthLastDay) { // 下个月的数据
				leaveDays.push({
					y : month + 1 > 12 ? year + 1 : year,
					m : month + 1 > 12 ? 1 : month + 1,
					d : i - monthLastDay
				});
			} else { // 本月的数据
				leaveDays.push({
					y : year,
					m : month,
					d : i
				});
			}
		}
	} else { // 本月开始
		endDay = daysAmount - (monthLastDay - beginDay + 1);
		if (endDay < 0) {
			for (i = beginDay; i <= (beginDay + daysAmount - 1); i++) {
				leaveDays.push({
					y : year,
					m : month,
					d : i
				});
			}
		} else {
			for (i = beginDay; i <= monthLastDay; i++) {// 加载本月到月末
				leaveDays.push({
					y : year,
					m : month,
					d : i
				});
			}
			for (i = 1; i <= endDay; i++) {
				if (i > nextMonthLastDay) { // 下下个月的数据
					leaveDays.push({
						y : month + 1 > 12 ? year + 1 : year,
						m : month + 1 > 12 ? 2 : month + 2,
						d : i - nextMonthLastDay
					});
				} else { // 下个月的数据
					leaveDays.push({
						y : month + 1 > 12 ? year + 1 : year,
						m : month + 1 > 12 ? 1 : month + 1,
						d : i
					});
				}
			}
		}
		
		
	}
	if (leaveDays.length === 0 || leaveDays.length !== daysAmount) {
		// console.info('日历日期装载报错，请管理员检查。');
		return false;
	}
	for (i = 0; i < leaveDays.length; i++) {
		d = new Date(leaveDays[i].y + '-' + leaveDays[i].m + '-'
				+ leaveDays[i].d);
		obj = {
			isForbid : false,
			index : i + 1,
			year : leaveDays[i].y,
			month : leaveDays[i].m,
			day : leaveDays[i].d,
			text : ''
		};
	
		if (i === 0) { // 显示年份
			pickerParams.pickerEl.querySelectorAll('.more-date span')[0].innerText = leaveDays[i].y
					+ '年';
		}
	
		// 在此计算可选时间范围，目前的条件：大于今日的工作日
		if (d.getTime() >= date.getTime()) {
			if (d.getDay() > 0 && d.getDay() < 6) { // 工作日 判断是否休息
				if (isTypeDay(d, 'rest')) { // 法定休息日
					obj.isForbid = true;
					obj.text = '休';
				}
			} else {
				if (isTypeDay(d, 'duty')) { // 法定上班日
					obj.text = '班';
				} else { // 正常休息日
					obj.isForbid = true;
				}
			}
		} else {
			obj.isForbid = true;
		}
	
		html += grtDay(obj);
	}
	dayLi[0].innerHTML = html;

}

/**
 * 判断el是否包含某个样式类
 * 
 * @param {Object}
 *            el
 * @param {Object}
 *            clsName
 */
function hasCls(el, clsName) {
	var cls = el.getAttribute('class');

	if (cls !== null && cls.indexOf(clsName) >= 0) {
		return true;
	}
	return false;
}

/**
 * 
 * 给el添加某个样式类
 * 
 * @param {Object}
 *            el
 * @param {Object}
 *            clsName
 */
function addCls(el, clsName) {
	var cls = el.getAttribute('class');

	el.setAttribute('class', clsName + ' ' + cls);
}

/**
 * 给el删除某个样式类
 * 
 * @param {Object}
 *            el
 * @param {Object}
 *            clsName
 */
function removeCls(el, clsName) {
	var cls = el.getAttribute('class'), finalCls = null, clsIndex = cls
			.indexOf(clsName);

	finalCls = cls.substring(0, clsIndex)
			+ cls.substring(clsIndex + clsName.length);
	el.setAttribute('class', finalCls);
}

function periodPick(periodEl, periodType) {
	var el = periodEl.parentNode.parentNode, 
		dstr = el.getAttribute('date-str'), 
		beginTimeStr = null, 
		endTimeStr = null;

	if (hasCls(el, 'forbid')) {
		return false;
	}
	if (periodType === 1) { // 根据时间区间拼接时间字符串
		beginTimeStr = dstr + ' ' + '9:00';
		endTimeStr = dstr + ' ' + '12:00';
		dstr += ' 上午';
	} else {
		beginTimeStr = dstr + ' ' + '13:30';
		endTimeStr = dstr + ' ' + '18:00';
		dstr += ' 下午';
	}
	if (!hasCls(periodEl, 'selected')) { // 未选中则选中，添加时间区间到数组
		addCls(periodEl, 'selected');
		pickerParams.periodTimes.push({
			beginTime : new Date(beginTimeStr).getTime(),
			endTime : new Date(endTimeStr).getTime(),
			showText : dstr
		});
	} else { // 选中则移除选中，从数组中删除时间区间
		removeCls(periodEl, 'selected');
		delPeriodByTime(new Date(beginTimeStr).getTime());
	}
}

/**
 * 显示下一个日历区间的日期
 */
function showNextMonth(self) {
	// 获得当前日历区间最后一天的信息
	var lastEl = pickerParams.pickerEl.querySelectorAll('.calen-date li:last-child'),
		lastDate = lastEl.length > 0 ? new Date(lastEl[0].getAttribute('date-str')) : '';
	
	if(lastDate.length === 0) return false;
	
	grtRecentDutyDays(new Date((lastDate / 1000 + 86400) * 1000));
	
	// 到下一页意味着存在上一页
	pickerParams.pickerEl.querySelectorAll('.more-date i.before')[0].style.display = 'block';
}

/**
 * 显示上一个日历区间的日期
 */
function showBeforeMonth() {

	// 获得当前日历区间第一天的信息
	var firstEl = pickerParams.pickerEl.querySelectorAll('.calen-date li:first-child'), 
		firstDate = firstEl.length > 0 ? new Date(firstEl[0].getAttribute('date-str')) : '';
				
	if(firstDate.length === 0) return false;
	// 获得上一个日历区间第一天的日期信息
	beforeFirstDate = new Date((firstDate / 1000 - 86400 * pickerParams.calenDaysAmount) * 1000);

	// 如果当日大于且等于上一个日历区间第一天的日期，表示已经到达第一页
	if (pickerParams.date.getTime() >= beforeFirstDate.getTime()) {

		// 生成当日相关的日历区间，用户可选择工作日，从传递的日期开始计算
		grtRecentDutyDays(pickerParams.date);
		// 隐藏上一页的操作
		pickerParams.pickerEl.querySelectorAll('.more-date i.before')[0].style.display = 'none';

	} else {

		// 生成上一页的日历区间
		grtRecentDutyDays(beforeFirstDate);

	}
}