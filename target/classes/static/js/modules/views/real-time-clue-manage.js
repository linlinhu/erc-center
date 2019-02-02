let RealTimeClueManage = (function() {
	let mp = null,
		bdary = new BMap.Boundary(),
		zoom = 7,
		i,
		j,
		systemId = null,
		ddInterface = null,
		realTimeClueInterface = null,
		initTimer = null,
		addDistrict = function(districtName) {
			bdary.get(districtName, function (rs) {       //获取行政区域
		        var blist = [],
		        	count = rs.boundaries.length;
			
				if (rs.boundaries.length === 0) {
		            alert('未能获取当前输入行政区域');
		            return;
		        }
				
		        for (let i = 0; i < count; i++) {
		            blist.push({ points: rs.boundaries[i], name: districtName });
		        };
		        //全加载完成后画端点
		        drawBoundary(blist);
		    });
		},
		drawBoundary = function(blist) {
		    //包含所有区域的点数组
		    var pointArray = [],
			    /*画遮蔽层的相关方法
			    *思路: 首先在中国地图最外画一圈，圈住理论上所有的中国领土，然后再将每个闭合区域合并进来，并全部连到西北角。
			    *      这样就做出了一个经过多次西北角的闭合多边形*/
			    //定义中国东南西北端点，作为第一层
		    	pNW = { lat: 59.0, lng: 73.0 },
		    	pNE = { lat: 59.0, lng: 136.0 },
		    	pSE = { lat: 3.0, lng: 136.0 },
		    	pSW = { lat: 3.0, lng: 73.0 },
			    //向数组中添加一次闭合多边形，并将西北角再加一次作为之后画闭合区域的起点
		    	pArray = [],
		    	ply = null,
		    	plyPath = null,
		    	boundply = null,
		    	plyall = null;
		    
		    pArray.push(pNW);
		    pArray.push(pSW);
		    pArray.push(pSE);
		    pArray.push(pNE);
		    pArray.push(pNW);
		    //循环添加各闭合区域
		    for (let i = 0; i < blist.length; i++) {
		        //添加多边形层并显示
		        ply = new BMap.Polygon(blist[i].points, { strokeWeight: 1, strokeColor: "#2480cc", fillOpacity: 0.01, fillColor: " #FFFFFF" }); //建立多边形覆盖物
		        ply.name = blist[i].name;
		        mp.addOverlay(ply);
		        
		        //将点增加到视野范围内
		       	plyPath = ply.getPath();
		        pointArray = pointArray.concat(plyPath);
		        //将闭合区域加到遮蔽层上，每次添加完后要再加一次西北角作为下次添加的起点和最后一次的终点
		        pArray = pArray.concat(plyPath);
		        pArray.push(pArray[0]);
		    }

		    //限定显示区域，需要引用api库
		    boundply = new BMap.Polygon(pointArray);
		    BMapLib.AreaRestriction.setBounds(mp, boundply.getBounds());
		    mp.setViewport(pointArray);    //调整视野 

		    //添加遮蔽层
		    plyall = new BMap.Polygon(pArray, { strokeOpacity: 0.0000001, strokeColor: "#000000", strokeWeight: 0.00001, fillColor: "#000000", fillOpacity: 0.4 }); //建立多边形覆盖物
		    mp.addOverlay(plyall);
		},
		initLoadRecentBarrages = function() {
			systemId = new Date().getTime();
			realTimeClueInterface.getPoints({
				systemId: systemId
			}, function(res) {
				points = res;
				realTimeClueInterface.getList({
					systemId: systemId
				}, function(datas) {
					for (let i = 0; i < datas.length; i++) {
						scrollBarrage(datas[i]);
					}
					if (initTimer) {
						window.clearInterval(initTimer);
					}
					initTimer = setInterval(function() {
						initLoadRecentBarrages();
					}, 10000);
				});
				addMarker(points);
			});
		},
		scrollBarrage = function(cur) {
			setTimeout(function(){
				var danmu = null,
					danmu_w = 0,
					rightDistance = 0,
					leftDistance = 0,
					timer = null,
					wrap_el = $('#realtime-clue-manage .cnt-wrap'),
					wrap_w = wrap_el.width(),
					wrap_h = Math.floor(wrap_el.height()/2);
				
				if (wrap_el.find('div.danmu[data-id="' + cur.id + '"]').length > 0) {
					return false;
				}
				wrap_el.append('<div class="danmu" data-id="' + cur.id + '">' + cur.content + '</div>');
				danmu = $(wrap_el.find('div.danmu[data-id="' + cur.id + '"]')[0]);
				danmu_w = danmu.width();
				danmu.css('top', parseInt(Math.random()*(wrap_h - 10) + 10, 10) + 'px');
				danmu.css('right', '-' + danmu_w + 'px' );
				timer = setInterval(function() {
					rightDistance = danmu.css('right');
					leftDistance = danmu.css('left');
					rightDistance = parseInt(rightDistance.substring(0, rightDistance.length - 2)) + 10;
					leftDistance = parseInt(leftDistance.substring(0, leftDistance.length - 2)) - 10;
					if (rightDistance > wrap_w - danmu_w) {
						danmu.css('right', 'inherit' );
						if (leftDistance > 0) {
							leftDistance = wrap_w - danmu_w - rightDistance;
						}
						danmu.css('left', leftDistance + 'px' );

					} else {
						danmu.css('right', rightDistance + 'px' );
					}
					
					if (-leftDistance >= danmu_w) {
						danmu.remove();
						window.clearInterval(timer);
						if (wrap_el.find('div.danmu').length == 0) {
							initLoadRecentBarrages();
						}
					}
				}, Math.random()*2000);
				
			}, parseInt(Math.random()*20000));
		},
		addMarker = function(points){
			var markers = [];
			for (let i = 0; i < points.length; i++) {
				var point = new BMap.Point(points[i].value[0], points[i].value[1]);
				var marker = new BMap.Marker(point);
				mp.addOverlay(marker);
				markers.push(marker);
			}
			
			//最简单的用法，生成一个marker数组，然后调用markerClusterer类即可。
			var markerClusterer = new BMapLib.MarkerClusterer(mp, {markers: markers});
		},
		points = [],
		circle = null,
		getPointsInCircle = function() {
			var pt = null,
				isIn = false,
				inPoints = [];
			
			if (circle == null) {
				return false;
			}
			
			for (let i = 0; i < points.length; i++) {
				pt = new BMap.Point(points[i].value[0], points[i].value[1]);

				isIn = BMapLib.GeoUtils.isPointInCircle(pt, circle);
				
				if (isIn) {
					inPoints.push(points[i]);
				}
			}
			
			return inPoints;
		},
		getClueById = function(id) {
			realTimeClueInterface.detail({
				id: id
			}, function(res) {
				return res.result;
			});
		},
		renderClueLst = function() {
			var circlePoints = getPointsInCircle(),
				cp = null,
				cpInfo = null,
				clueType = null,
				clstEl = $('#realtime-clue-manage .clues-lst > ul');
			
			if (circlePoints.length == 0) {
				if (!$('#realtime-clue-manage .clues-lst').hasClass('hide')) {
					$('#realtime-clue-manage .clues-lst').addClass('hide');
				}
			} else {
				if ($('#realtime-clue-manage .clues-lst').hasClass('hide')) {
					$('#realtime-clue-manage .clues-lst').removeClass('hide');
				}
			}
			if (circlePoints.length != clstEl.find('li').length) {
				clstEl.html('');
				$.ajaxSettings.async = false;
				for (let i = 0; i < circlePoints.length; i++) {
					cp = circlePoints[i];
					realTimeClueInterface.detail({
						id: cp.idx
					}, function(res) {
						cpInfo = res.result;
						clueType = findClueTypeById(cpInfo.clueType);
						clstEl.append('<li data-id="' + cpInfo.id + '" style="background-color: ' + clueType.extend.fillColor + '">' +
	    					'<div>' +
		    					'<i class="img-icon avatar" style="background-image:url(' + base + 'img/male.png)"></i>' +
		    					'<span>' + cpInfo.reporterName + '</span>' +
	    					'</div>' +
	    					'<div>' + cpInfo.title + '</div>' +
	    				'</li>');
					});
					
				}
				$.ajaxSettings.async = true;
				$('#realtime-clue-manage .clues-lst > ul > li').unbind('click').bind('click', function() {
					var clueId = $(this).attr('data-id'),
						tpl = clue_detail_data.innerHTML,
						view = $('#clue-detail-view');

					realTimeClueInterface.detail({
						id: clueId
					}, function(res) {
						cpInfo = res.result;
						cpInfo.clueType = findClueTypeById(cpInfo.clueType);
						laytpl(tpl).render(cpInfo, function(html){
							view.html(html);
							view.removeClass('hide');
							view.find('a.close').unbind('click').bind('click', function() {
								view.addClass('hide');
							});
							view.find('button.ignore').unbind('click').bind('click', function() {
								realTimeClueInterface.mark({
									id: cpInfo.id,
									clueStatus: 20
								}, function() {
									mapInit(2);
									renderClueLst();
									layer.msg('线索已忽略', {icon: 6});
									view.addClass('hide');
								});
							});
							view.find('button.mark').unbind('click').bind('click', function() {
								realTimeClueInterface.mark({
									id: cpInfo.id,
									clueStatus: 30
								}, function() {
									mapInit(2);
									renderClueLst();
									layer.msg('线索已标记', {icon: 6});
									view.addClass('hide');
								});
							});
						});
					});
					
						
				});
			}
		},
		containerId = null,
		mapInit = function(type) {
			if (type == 1) {
				$('#' + containerId).css('height', ($(window).height() - 335) + 'px ');
				$('#realtime-clue-manage').css('display', 'block');
				$('#realtime-clue-manage .clues-lst').addClass('hide');
			}
			mp = new BMap.Map(containerId);
			mp.setMapStyle({
				enableMapClick: false
			});
			mp.enableDragging();
			mp.enableScrollWheelZoom();
			mp.disableDoubleClickZoom();
			mp.disableKeyboard();
			
			// 创建点坐标
			mp.centerAndZoom(topRegion.name, zoom);
			
			mp.addEventListener("click", function(e) {
				let rcmIndex = null;
				if (type == 1) {
					layer.closeAll();
					layer.close(rcmIndex);
					rcmIndex = layer.open({
						type: 1,
						title: '实时线索监控中心',
						content: $('#realtime-clue-manage'),
						end:function(index){   
							mapInit(1);
				        }  
					});
					$('#' + containerId).css('height', ($(window).height() - 50) + 'px ');
					layer.full(rcmIndex);
					mapInit(2);
				} else {
					var circle_r = 3000;

					mp.centerAndZoom(e.point, mp.getZoom() + 1);
					switch(mp.getZoom()) {
						case 7:
							circle_r = 300000;
						case 8:
							circle_r = 200000;
						case 9:
							circle_r = 100000;
						case 10:
							circle_r = 30000;
						case 11:
							circle_r = 20000;
						case 12:
							circle_r = 10000;
					}
					if (circle != null) {
						mp.removeOverlay(circle);
						$('#realtime-clue-manage .clues-lst > ul').html('');
						
					}
					circle = new BMap.Circle(e.point, circle_r, {strokeColor:"blue", strokeWeight:2, strokeOpacity:0.5}); //创建圆
					mp.addOverlay(circle);   
					circle.enableEditing();
					renderClueLst();
					circle.addEventListener('lineupdate', function() {
						setTimeout(function() {
							renderClueLst();
						});
					});
				}
			});

			initLoadRecentBarrages();
		},
		clueTypes = [],
		findClueTypeById = function(ctId) {
			var clueType = null;
			for (let i = 0; i < clueTypes.length; i++) {
				if (clueTypes[i].id = ctId) {
					clueType = clueTypes[i];
				}
			}
			return clueType;
		},
		init = function(p) {
			systemId = new Date().getTime();
			realTimeClueInterface = new RealTimeClueInterface();
			ddInterface = new DataDicInterface();
			ddInterface.getItemsByCode('clue-type', function(cts) {
				clueTypes = cts;
			});
			containerId = p.containerId;
			topRegion = p.topRegion;
			switch(topRegion.level) {
				case 0:
					zoom = 3;
				case 1:
					zoom = 7;
				case 2:
					zoom: 9;
			};
			mapInit(1);

		};
	return {
		init: init
	}
}());
