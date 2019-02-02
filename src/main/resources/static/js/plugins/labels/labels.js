function Labels(p, callback) {
	if (!p || !p.id) {
		return false;
	}
	$('#' + p.id ).html('');
	
	var ul = $('<ul></ul>').appendTo($('#' + p.id )),
		addEl = $('<a href="javascript:void(0)"><i class="fa fa-plus"></i></a>').appendTo($('#' + p.id )),
		i = 0,
		liLen = 0,
		inputLen = 0,
		delLen = 0,
		min = p.min ? p.min : 0,
		max = p.max ? p.max : 7,
		valLen = p.valLen ? p.valLen * 2 : 20,
		vals = p.vals ? p.vals : [],
		isOverLen = function (val) {
            var l = val.length,
            	blen = 0;

			for(i = 0; i < l; i++) {
				if ((val.charCodeAt(i) & 0xff00) != 0) {
					blen ++;
				}
				blen ++;
			}
			return blen > valLen;
		},
		showErrMsg = function(el, msg) {
			if (!el.hasClass('has-error')) {
				el.addClass('has-error');
				el.attr('title', msg);
			}
		},
		toggleInputError = function (e) {
			var liEl = $(e.parent());
        	if (isOverLen(e.val())) {
				showErrMsg(liEl, '超出长度限制(0-' + valLen + '个字符)');
			} else {
				if (liEl.hasClass('has-error')) {
					liEl.removeClass('has-error');
					liEl.removeAttr('title');
					e.removeAttr('title');
				}
			}
		},
		delLi = function(e) {
			if (p.isConfirm) {
				layer.confirm("是否确认删除", {
					icon : 3,
					btn : [ '确认', '取消' ]
				}, function(cindex) {
					layer.close(cindex);
					confirmDelLi(e);
				});
			} else {
				confirmDelLi(e);
			}
		},
		confirmDelLi = function(e) {
			var operObj = {
				id: $(e).find('span').attr('data-id'),
				name: $(e).find('span').html(),
				flag: 'remove'
			}
			$(e).remove();
			callback(getLabels(), p.id, operObj);
			liLen = ul.find('li').length;
			if (liLen < max) {
				addEl.show();
				if (liLen < min) {
					generateByNum(min - liLen);
				}
			}
		},
		labelToInput = function(e) {
			var curInput = null;
			$(e).html('<input type="text" data-id="' + $(e).find('span').attr('data-id') + '" value="' + $(e).find('span').html() + '">');
			curInput = $($(e).find('input')[0]);
			curInput.bind('input', function(event) {
	        	toggleInputError(curInput);
	        }).bind('blur', function(event) {
	            inputToLabel(curInput);
	        });
		},
		inputToLabel = function(e) {
			var liEl = $(e.parent()),
				curDel = null,
				curSpan = null,
				val = e.val().replace(/\s/g, '');
			
			e.val(val);
			if (!val) {
				return false;
			}
			var labelsArray = getLabels();
			for (i = 0; i < labelsArray.length; i++) {
				if (val == labelsArray[i].name){
					showErrMsg(liEl, '不允许重复');
					return false;
				}
			}
			if (liEl.hasClass('has-error')) return false;
			
			
			liEl.html('<span class="' + (p.isReverse ? 'labels-reverse' : '') + '" data-id="' + e.attr('data-id') + '">' + val + '</span><a class="del"><i class="fa fa-remove"></i></a>');
			
			callback(getLabels(), p.id, {
				id: e.attr('data-id'),
				name: val,
				flag: 'edit'
			});
			curSpan = $(liEl.find('span'))[0];
			curDel = $(liEl.find('.del'))[0];
			$(curDel).bind('click', function(event) {
	            delLi($(curDel).parent());
	        });
	        $(curSpan).bind('click', function(event) {
	            labelToInput($(curDel).parent());
	        });

			inputLen = ul.find('input').length;
			liLen = ul.find('li').length;
			if (inputLen == 0 && liLen < max) {
				addEl.show();
			}
		},
		getLabels = function() {
			var spanEl = ul.find('span'),
				spanLen = spanEl.length,
				labels = [];

			for (i = 0; i < spanLen; i++) {
				labels.push({
					id: $(spanEl[i]).attr('data-id'),
					name: $(spanEl[i]).html()
				});
			}
			return labels;

		},
		addAnInput = function() {
			var lastInput = null;
			ul.append('<li><input data-id="" type="text"></li>');
			inputLen = ul.find('input').length;
			lastInput = $(ul.find('input'))[inputLen-1];
			$(lastInput).bind('input', function(event) {
	        	toggleInputError($(lastInput));
	        }).bind('blur', function(event) {
	            inputToLabel($(lastInput));
	        });
		},
		addAnSpan = function(val) {
			var spanLen = 0,
				lastSpan = null,
				lastDel = null;
			
			ul.append('<li><span class="' + (p.isReverse ? 'labels-reverse' : '') + '" data-id="' + val.id + '">' + val.name + '</span>' +
					(val.forbidEdit ? '' : '<a class="del"><i class="fa fa-remove"></i></a>') +
					'</li>');
			
			if (!val.forbidEdit) {
				spanLen = ul.find('span').length;
				lastSpan = $(ul.find('span'))[spanLen-1];
				$(lastSpan).bind('click', function(event) {
		            labelToInput($(lastDel).parent());
		        });
				
				lastDel = $(ul.find('.del'))[spanLen-1];
				$(lastDel).bind('click', function(event) {
		            delLi($(lastDel).parent());
		        });
			}
		},
		generateByNum = function(num) {
			for (i = 0; i < num; i++) {
				addAnInput();
			}
			addEl.hide();
		},
		newInput = function() {
			inputLen = ul.find('input').length;

			if (min &&  min > 0 && inputLen > 0) {
				console.info('请先完善');
			} else {
				liLen = ul.find('li').length;
				if (liLen >= max) {
					console.info('已达到最大值');
				} else {
					addAnInput();
					addEl.hide();
				}
			}
		},
		generateByVals = function(vals) {
			if (vals.length > max) {
				console.log('error:生成个数大于限制个数');
				return false
			}
			if(vals.length >= max) {
				addEl.hide();
			} else {
				addEl.show();
			}
			for (i = 0; i < vals.length; i++) {
				addAnSpan(vals[i]);
			}
			
			
		};

	addEl.bind('click', newInput);
	
	if (vals && vals.length > 0) {
		generateByVals(vals);
	}
	

	if (min > 0) {
		var num = min - vals.length;
		if (num > 0) {
			generateByNum(num);
		}
	}
}

/**
 * 获得选中的标签编号，多个用逗号隔开
 */
function getLabelsSelectedIds(labels) {
	var els = $(labels).find('.label-success'),
		curEl = null,
		selectedIds = '';
	for (i = 0; i < els.length; i++) {
		curEl = $(els[i]);
		selectedIds += curEl.attr('data-id') + ',';
	}
	return selectedIds;
}

/**
 * 获得选中的标签编号，多个用逗号隔开
 */
function getLabelsSelected(labels) {
	var els = $(labels).find('.label-success'),
		curEl = null,
		objs = [];
	for (i = 0; i < els.length; i++) {
		curEl = $(els[i]);
		objs.push({
			id: curEl.attr('data-id'),
			name: curEl.html()
		})
	}
	return objs;
}

/**
 * 标签选中事件;
 */
function toggeLabelCheck(label) {
	if (!$(label).hasClass('label-success')) {
		$(label).addClass('label-success');
	} else {
		$(label).removeClass('label-success');
	}
}
