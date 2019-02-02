let IndexInit = (function() {
	let init = function() {
			// 用户信息展示
			personInfo = JSON.parse(CommonUtil.getHeaders().systemLoginUser);
			if(typeof personInfo.portrait == 'string' && personInfo.portrait != "") {
				personInfo.portrait = JSON.parse(personInfo.portrait);
			}
			if (personInfo.portrait && personInfo.portrait.storage) {
				$('#personHeadPortrait').attr('src', personInfo.portrait.storage[2].fileStorageUrl);
			} else  {
				$('#personHeadPortrait').attr('src', "img/male.png");
			}
			$('#personHeadPortrait').attr('onerror', 'this.src=img/male.png');
			$('#personNickName').html(personInfo.username);
			
			
			// 登出
			$(".logout").click(function(){
				layer.confirm('是否确定注销登录？', {
				    btn: ['确定','取消']//按钮
				  //  shade: true //不显示遮罩
				}, function(){
					var option = {
							url:"${base}logout",
							type:"get"
					};
					CommonUtil.ajaxRequest(option,function(){
						localStorage.removeItem('erc_system_token');
						localStorage.removeItem('erc_system_ecmId');
						localStorage.removeItem('erc_system_ecmName');
						localStorage.removeItem('erc_login_user');
						window.location.replace("/login");
					})
				});
			})
			
			
			//监听加载状态改变
			document.onreadystatechange = completeLoading;
			//加载状态为complete时移除loading效果
			function completeLoading() {
			  if (document.readyState == "complete") {
					$('.fixed-loading').addClass('hide');
					
			  }
			}
			
			//监听回车
			document.onkeydown=keyDownSearch;  
		    function keyDownSearch(e) {    
		        // 兼容FF和IE和Opera    
		        var theEvent = e || window.event;    
		        var code = theEvent.keyCode || theEvent.which || theEvent.charCode;    
		        if (code == 13) {    
		            return false;    
		        }    
		        return true;    
		    }
		};
		
	return {
		init: init
	};
}());