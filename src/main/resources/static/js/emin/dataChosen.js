
/***
 * 设置单选
 * @param self 本体
 */
function singleChosen(self){
	var idPrefix = $(self).parent().parent().attr('id-prefix');
	
	$('#' + idPrefix + 'Chosen .iradio_square-green.checked').removeClass('checked');
	$(self).find('.iradio_square-green').addClass('checked');
}

/***
 * 设置一个主体
 * @param self 本体
 */
function choseAEcm(self, idPrefix, formId){
	var dataId = $(self).attr('data-id'),
		formId = formId ? formId : $(self).parent().parent().parent().attr('id'),
		ecmTpl = ecmDatas.innerHTML,//数据模板
		ecmView;
	/*loading = layer.load();*/
	layer.open({
		type : 1,
		title : '选择一个主体',
		skin : 'layui-layer-rim', //加上边框
		area : [ '60%', '525px' ], //宽高
		content : '<div class="wrapper-content" id="' + idPrefix + 'Chosen">' + $('#ecmChosenTpl').html() + '</div>',
		btn : [ '已选择', '取消' ],
		yes : function(lindex, layero) {
			var ecm = $('#' + idPrefix + 'Chosen .iradio_square-green.checked').find('input[name="chosenEcm"]').val(),
				ecmObj = (ecm && ecm.length > 0) ? JSON.parse(ecm) : null;
	
			if (ecmObj) {
				var temp = ecmObj.name +'  '+ ecmObj.sn;
				$('#' + formId + ' input[name="ecmId"]').val(ecmObj.id);
				$('#' + formId + ' input[name="ecmName"]').val(temp);
				$('#' + formId + ' input[name="ecmName"]').parent().parent().removeClass('has-error');
				$('#' + formId + ' input[name="ecmName"]').parent().parent().addClass('has-success');
				$('#' + formId + ' #ecmName-error').html('');
				
				$('#' + formId + ' input[name="ecm"]').attr('data-id', ecmObj.id);
				layer.close(lindex);
			} else {
				layer.alert('请选择一个主体', {icon: 5});
			}
			return false;
		}
	});
	
	$('.PCSearchForm button[role="submit"]').on('click', function(){
		var data = $('#' + idPrefix +'Chosen .PCSearchForm input').val();
		if(data.trim().length > 0){
			searchEcm (data)
			
		} else {
			layer.alert('请输入关键字！', {icon: 5});	
		}
	})
	
	function searchEcm (keyword) {
		CommonUtil.ajaxRequest({
			url: basePath + 'ecm/getEcms',
			data: {
				keyword:keyword
			},
			type: 'get'
		},function(result) {
			if (result.success) {
				ecmView = $('#' + idPrefix + 'Chosen #ecm-view');
				if(result.result && result.result.length > 0) {
					
					laytpl(ecmTpl).render(result.result, function(html){
						ecmView.html(html);
						//form的id只能实时生成，单页面应用需要保证id的唯一性。 
						
						$('#' + idPrefix + 'Chosen .i-checks').iCheck({
						    checkboxClass: 'icheckbox_square-green',
						    radioClass: 'iradio_square-green',
						});
						if(dataId) {
							$('#' + idPrefix + 'Chosen .iradio_square-green.checked').removeClass('checked');
							$('#' + idPrefix + 'Chosen input[data-id="' + dataId + '"]').parent().addClass('checked');
						}
						$('#' + idPrefix + 'Chosen .footable').removeClass('footable-loaded');
						$('#' + idPrefix + 'Chosen .footable').footable();
						$('#' + idPrefix + 'Chosen #ecm-view').attr('id-prefix', idPrefix);
					});
				} else {
					ecmView.html('<tr><td></td><td>暂无数据</td></tr>');
					
				}
				
			} else {
				layer.alert('新密码与原密码重复', {icon: 5});
			}
		});
	}
}



