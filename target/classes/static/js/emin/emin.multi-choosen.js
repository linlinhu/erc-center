var MultiChoosen = function(p, callback) {
	var pId = p.id,
		pTitle = p.title,
		plst = p.datas,
		pchkedIds = p.checkIds,
		idKey = p.idKey ? p.idKey : 'id',
		valKey = p.valKey ? p.valKey : 'name',
		choosenTitle = '所有',
		plstHtml = '',
		setChoosenTitle = function(self) {
			var cl = $($(self).parent().parent().parent()),
				ct = $(cl.siblings('div.choosen-title')[0]),
				cbs = cl.find('input[type="checkbox"]'),
				choosenTitle = '',
				choosenIds = '';
			
			cbs.each(function(){
				if ($(this).is(':checked')) {
					choosenIds = choosenIds ? choosenIds + ',' + $(this).val() : $(this).val();
					choosenTitle = choosenTitle ? choosenTitle + ',' + $(this).attr('data-text') : $(this).attr('data-text');
				}
			})
			ct.html('品牌所属：' + choosenTitle + '&nbsp;<i class="fa fa-angle-down"></i>');
			cl.css('display', 'none');
			if (typeof callback == 'function') {
				callback(choosenIds, choosenTitle);
			}
		},
		toggleChoosenLst = function(self) {
			var cl = $($(self).siblings('ul.choosen-lst')[0]),
				cl_display = cl.css('display'),
				fa = $($(self).find('i.fa')[0]);
			
			if (cl_display == 'none') {
				cl.css('display', 'block');
				fa.removeClass('fa-angle-down').addClass('fa-angle-up');
			} else {
				setChoosenTitle($(cl.find('a.btn')[0]));
				cl.css('display', 'none');
				fa.removeClass('fa-angle-up').addClass('fa-angle-down');
			}
		},
		setChoosen = function(ids) {
			if (ids) {
				var choosenTitle = '',
					chkInput = null,
					chkText = '',
					ct = $('#' + pId).find('div.choosen-title');
				
				if (typeof ids == 'string') {
					ids = ids.split(',');
				}
				for (let i = 0; i < ids.length; i++) {
					chkInput = $('#' + pId +'_chk_' + ids[i]);
					chkText = chkInput.attr('data-text');
					chkInput.attr("checked", true);
					choosenTitle = choosenTitle ? choosenTitle + ',' + chkText : chkText;
				}
				ct.html('品牌所属：' + choosenTitle + '&nbsp;<i class="fa fa-angle-down"></i>');
			}
		};
	
	
	for (let i = 0; i < plst.length; i++) {
		var p = plst[i],
			chkId = pId +'_chk_' + p[idKey];
		
		plstHtml += '<li>' +
						'<div class="checkbox">' +
					        '<input id="' + chkId + '" type="checkbox" value="' + p[idKey] + '" data-text="' + p[valKey] + '">' +
					        '<label for="' + chkId + '">' + p[valKey] + '</label>' +
					    '</div>' +
					'</li>';
	}
	
	$('#' + pId).html('<div class="choosen-title">' + choosenTitle + '&nbsp;<i class="fa fa-angle-down"></i></div>' +
	            		'<ul class="choosen-lst">' +
	            			'<li>' +
		            			'<div><b>' + pTitle + ' </b></div>' +
	            			'</li>' + plstHtml +
	            			'<li>' +
		            			'<div class="text-right">' +
		            				'<a class="btn btn-xs btn-primary"><i class="fa fa-search"></i></a>' +
                                '</div>' +
	            			'</li>' +
	            		'</ul>');
	

	setChoosen(pchkedIds);
	
	$('#' + pId).find('div.choosen-title').click(function() {
		toggleChoosenLst(this);
	});
	
	$('#' + pId).find('a.btn').click(function() {
		setChoosenTitle(this);
	});
	
	
}