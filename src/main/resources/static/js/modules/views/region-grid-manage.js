let RegionGridManage = (function() {
	let mp = null,
		opers = null,
		geoLocation = new BMap.Geolocation(),
		geoc = new BMap.Geocoder(),
		centerPoint = null,
		bdary = new BMap.Boundary(),
		i = 0,
		j = 0,
		city = '',
		regions = [],
		markerType = null,
		latestMarkerInfo = {},
		latestMarkerPoint = null,
		latestPolygon = null,
		gridRegions = [],
		tpl = null,
		view = null,
		loadType = 1,
		currentStatus = null,
		getRegionsByPid = function(pid, callback) {
			CommonUtil.ajaxRequest({
				url: 'region/findByPid',
				data: {
					pid: pid
				}
			}, function(res) {
				if (typeof res == 'string') {
					res = JSON.parse(res);
					if (!res.success) {
						layer.msg('加载子级区域出错！' + (res.message ? '原因是：' + res.message : ''), {icon: 5});
						return false;
					}
				}
				callback(res);
			});
		},
		getGridsByRegionId = function(rid, callback) {
			CommonUtil.ajaxRequest({
				url: 'region/getGrids',
				data: {
					regionId: rid
				}
			}, function(res) {
				if (typeof res == 'string') {
					res = JSON.parse(res);
					if (!res.success) {
						layer.msg('加载区域下网格出错！' + (res.message ? '原因是：' + res.message : ''), {icon: 5});
						return false;
					}
				}
				callback(res);
			});
		},
		setBasicDatas = function(cityId) {
			if (cityId) {
	    		getRegionsByPid(cityId, function(res) {
	    			regions = [];
	    			res.map(r => regions.push(r));
	    			getGridsByRegionId(cityId, function(grids) {
	    				gridRegions = [];
	    				for (j = 0; j < grids.length; j++) {
	    					let cur_g = grids[j],
	    						region = null,
	    						regionIndex = -1,
	    						grid = {
	    							id: cur_g.id,
	    							name: cur_g.name,
	    							point: {
	    								lng: cur_g.lng,
	    								lat: cur_g.lat
	    							},
	    							gridPoints: cur_g.grid,
	    							chargePerson: {
	    								id: cur_g.chargePersonId,
	    								realName: cur_g.chargePersonName,
	    								mobile: cur_g.chargePersonMobile
	    							}
		    					};
	    					
	    					for (let i = 0; i < regions.length; i++) {
								if (regions[i].id == cur_g.regionId) {
									region = regions[i];
								}
							}
	    					
	    					for (let i = 0; i < gridRegions.length; i++) {
								if (gridRegions[i].region.name == region.name) {
									regionIndex = i;
								}
							}
	    					
	    					if (regionIndex < 0) {
	    						gridRegions.push({
	    							region: region,
	    							relates: [grid]
	    						})
	    					} else {
	    						gridRegions[regionIndex].relates.push(grid);
	    					}
	    				}
	    				loadGridRegions();
	    			});
	    		});
	    	}
		},
		setBoundaries = function(region, color) {
			var pointCount = 0,
				polygon = null;
			
	        bdary.get(region == '郫都区' ? '郫县' : region, function(rs){       //获取行政区域
	            pointCount = rs.boundaries.length; //行政区域的点有多少个
	            for (let i = 0; i < pointCount; i++) {
	                polygon = new BMap.Polygon(rs.boundaries[i], {
	                	strokeWeight: 1,
	                	strokeColor: "#fff",
	                	fillOpacity:0.2,
	                	fillColor: color ? color : '#2480cc'
	                }); //建立多边形覆盖物
	                mp.addOverlay(polygon);  //添加覆盖物
	                polygon.setDatas({
	                	type: 'region',
	                	detail: {
	                		name: region
	                	}
	                });

	            }
			});
		},
		staffInterface = null,
		openFormPanel = function(p, callback) {
			let lwIndex = null;
			
			if (p) {
				latestMarkerInfo = p;
				CommonUtil.formDataSetAndGet({
					container: '#grid-region-form form',
					data: p
				});
				if (p.chargePerson) {
					$('#grid-region-form .chargeperson-choosen').html(p.chargePerson.realName);
				}
			} else {
				CommonUtil.formDataSetAndGet({
					container: '#grid-region-form form',
					data: {
						id: '',
						regionId: '',
						name: ''
					}
				});
				$('#grid-region-form .chargeperson-choosen').html('选择一个负责人');
			}
			
			$('#grid-region-form').removeClass('hide');
			// 使用layer弹窗打开模板
			lwIndex = layer.open({
					type: 1,
					title: p ? '添加网格' : '编辑',
					skin: 'layui-layer-demo', //样式类名
					closeBtn: 1, //不显示关闭按钮
					anim: 2,
					shadeClose: false, //开启遮罩关闭
					area : [ '784px', '240px' ], //宽高
					content: $('#grid-region-form')
			});
			$('#grid-region-form .chargeperson-choosen').unbind('click').bind('click', function() {
				staffInterface = new StaffInterface();
				StaffsChoosenTpl.init({
					title: '选择一个负责人(单选)',
					checkedIds: p && p.chargePerson ? [p.chargePerson.id] : []
				},  function(res) {
					let ids = res.ids,
						others = res.others,
						lwIndex = res.layerWindowIndex;
					if (others.length > 1) {
						layer.msg('请注意提示，只能选择一个负责人！', {icon: 5});
						return false;
					}
					layer.close(lwIndex);
					staffInterface.detail(ids, function(res) {
						$('#grid-region-form .chargeperson-choosen').html(res.realName);
						latestMarkerInfo.chargePerson = res;
					})
				});
			});
			
			$("#grid-region-form form").validate({
		        rules: {
		        	name: {
		                required: true,
		                rangelength: [2,40]
		            }
		        },
		        messages: {
		        	name: {
		                required: icon + "请输入网格区域名称",
		                rangelength: icon + "网格区域名称输入长度限制为2-40个合法字符"
		            }
		        },
		        submitHandler:function(form){
		        	if(!latestMarkerInfo.chargePerson) {
		        		layer.msg('请选择一个负责人', {icon: 5});
		        		return false;
		        		
		        	}
		        	Object.assign(latestMarkerInfo, $("#grid-region-form form").serializeObject());
		        	if (p.id) {
		        		markerType = 'edit';
		        	} else {
		        		markerType = 'add';
		        	}
        			layer.closeAll();
					$('.add-marker').addClass('hide');
					$('.save-region-grid').removeClass('hide');
					
		        	if (typeof callback == 'function') {
	        			callback();
	        		}
		        	
		        } 
			});
		},
		markerPoint = function(point) {
			if (latestMarkerPoint) {
				mp.removeOverlay(latestMarkerPoint);
			}
			latestMarkerPoint = point;
			
			// 创建点坐标
			mp.addOverlay(latestMarkerPoint);

			latestMarkerPoint.enableDragging();
			
			if (point.datas && point.datas.detail && point.datas.detail.name) {
				latestMarkerPoint.setLabel(getMarkerLabel(point.datas.detail.name));
			}
			
		},
		addPolygon = function() {
			if (!latestMarkerPoint) {
				console.log('请先添加应急中心！');
				return false;
			}
			if (latestPolygon) {
				return false;
			}
			var centerPoint = latestMarkerPoint.point;
			latestPolygon = new BMap.Polygon([
				new BMap.Point(centerPoint.lng + 0.002, centerPoint.lat + 0.002),
				new BMap.Point(centerPoint.lng - 0.002, centerPoint.lat + 0.002),
				new BMap.Point(centerPoint.lng - 0.002, centerPoint.lat - 0.002),
				new BMap.Point(centerPoint.lng + 0.002, centerPoint.lat - 0.002)
			], {strokeColor:"rgb(253, 80, 0)", strokeWeight:2, strokeOpacity:0.2,
	                	fillColor:'#fff'});  //创建多边形
			mp.addOverlay(latestPolygon);   //增加多边形
			latestPolygon.enableEditing();
			latestPolygon.setDatas({
				type: 'polygon',
				detail: latestMarkerInfo
			});
		},
		contextMenu = null,
		dragMarker = function(e, ee, m){ // 编辑网格区域
			if (!markerType) {
				let regionGrid = m.datas.detail;
				
				openFormPanel(regionGrid, function() { // 通过表单验证后开启编辑状态
					latestPolygon = filterOverLays(ol => ol.datas && ol.datas.type == 'polygon' && ol.datas.detail.id == regionGrid.id);
					latestPolygon.enableEditing();
					m.enableDragging();
					latestMarkerPoint = m;
					latestMarkerPoint.addEventListener("dragend", function(e) {
					 	var result = BMapLib.GeoUtils.isPointInPolygon(e.point, latestPolygon);
					 	if (!result) {
					 		layer.msg('应急点必须在应急区域内！', {icon: 5});
					 	}
					});
				});
			} else {
				layer.msg('请先保存网格！', {icon: 5});
			}
			
		},
		filterOverLays = function(fn) {
			let overLays = mp.getOverlays(),
				filtered = [];
			
			for (let i = 0; i < overLays.length; i++) {
				if (fn(overLays[i], i) === true) {
					filtered.push(overLays[i]);
				}
			}
			
			return filtered.length == 1 ? filtered[0] : filtered;
		},
		convertToSaveObj = function(d) {
			
			let saveObj = null;
			if (d) {
				saveObj = {
					name:d.name,
					regionId: d.region.id,
					lng: d.point.lng,
					lat: d.point.lat,
					chargePersonId: d.chargePerson.id,
					chargePersonName: d.chargePerson.realName,
					chargePersonMobile: d.chargePerson.mobile,
					grid: d.gridPoints
				};
				if (d.id) {
					saveObj.id = d.id;
				}
			}
			return saveObj;
		},
		regionInterface = null,
		saveRegionGrid = function() {
	    	// 判断中心点是否在区域范围内
	    	var result = BMapLib.GeoUtils.isPointInPolygon(latestMarkerPoint.point, latestPolygon);
			if (!result) {
				layer.msg('无法保存，应急点必须在应急区域内！', {icon: 5});
				return false;
			} else {
				geoc.getLocation(latestMarkerPoint.point, function(rs){
					let regionName = rs.addressComponents.district,
						region = null,
						regionIndex = -1,
						relateIndex = -1;

					for (let i = 0; i < regions.length; i++) {
						if (regions[i].name == regionName) {
							region = regions[i];
						}
					}
					for (let i = 0; i < gridRegions.length; i++) {
						if (gridRegions[i].region.name == regionName) {
							regionIndex = i;
						}
					}
					if (regionIndex < 0) {
						gridRegions.push({
							region: region,
							relates: []
						});
						regionIndex = gridRegions.length - 1;
					}
					latestMarkerInfo.region = region;
					latestMarkerInfo.point = latestMarkerPoint.point;
					latestMarkerInfo.gridPoints = latestPolygon.ia;
					
					for (let i = 0; i < gridRegions[regionIndex].relates.length; i++) {
						if (gridRegions[regionIndex].relates[i].id == latestMarkerInfo.id) {
							relateIndex = i;
						}
					}
					if (relateIndex >= 0) {
						gridRegions[regionIndex].relates[relateIndex] = latestMarkerInfo;
					} else {
						gridRegions[regionIndex].relates.push(latestMarkerInfo);
					}
					// 保存区域网格
					regionInterface.saveGrids({
						datas: JSON.stringify(convertToSaveObj(latestMarkerInfo))
					}, function() {
						layer.msg('网格保存成功！', {icon: 6});
					    let rm_cf_c = '#region-manage .city-filter>select[name="city"]';
		    			setBasicDatas($(rm_cf_c).val());
						$('.add-marker').addClass('hide');
						$('.save-region-grid').addClass('hide');
					})
					
				});
			}
		},
		loadGridRegions = function() {
			filterOverLays(ol => ol.datas && (ol.datas.type == 'marker' || ol.datas.type == 'polygon' || ol.datas.type == 'region')).map(f => mp.removeOverlay(f));
			if (latestMarkerPoint) {
				latestMarkerPoint.disableDragging();
		    	latestMarkerPoint = null;
			}
			if (latestPolygon) {
				latestPolygon.disableEditing();
		    	latestPolygon = null;
			}
	    	markerType = null;
	    	
			if (gridRegions.length > 0 ) {
		    	for (let i = 0; i < gridRegions.length; i++) {
		    		regions.map(r => r.name == gridRegions[i].region.name ? r.grids = gridRegions[i].relates : a = 2);
		    		for (j = 0; j < gridRegions[i].relates.length; j++) {
		    			var relate = gridRegions[i].relates[j],
		    				point = relate.point,
		    				gridPoints = relate.gridPoints,
		    				marker = new BMap.Marker(new BMap.Point(point.lng, point.lat)),
		    				polygon = new BMap.Polygon(gridPoints.map(gp => new BMap.Point(gp.lng, gp.lat)), {strokeColor:"rgb(253, 80, 0)", strokeWeight:1, strokeOpacity:0.3, fillColor:'rgb(253, 80, 0)'});
						
						mp.addOverlay(marker);
						mp.addOverlay(polygon);
						
						marker.setDatas({
							type: 'marker',
							detail: relate
						});
						polygon.setDatas({
							type: 'polygon',
							detail: relate
						});
						
						contextMenu = new BMap.ContextMenu();
						contextMenu.addItem(new BMap.MenuItem('编辑', dragMarker.bind(marker)));
						marker.addContextMenu(contextMenu);

		    		}
		    	}
		    	
		    }
			

	    	tpl = grid_region_distribute_datas.innerHTML;
			view = $('#grid-region-distribute-view');

			regions.map(r => setBoundaries(r.name));
			laytpl(tpl).render(regions, function(html){
				view.html(html);
				$('.center-zoom-region').unbind('click').bind('click', function() {
					if(!markerType) {
						for (let i = 0; i < $('.center-zoom-region').length; i++) {
							$($('.center-zoom-region')[i]).parent().parent().removeClass('selected');
						}
						$(this).parent().parent().addClass('selected');
						centerZoomRegion($(this).attr('data-name'));
						$('.add-marker').removeClass('hide');
						$('.save-region-grid').addClass('hide');
					} else {
						layer.msg('请先保存网格！', {icon: 5});
					}
					
				})
				
				$('.center-zoom-grid').unbind('click').bind('click', function() {
					if(!markerType) {
						let gridName = $(this).attr('data-name'),
							gridMarker = null;
						
						gridMarker = filterOverLays(ol => ol.datas && ol.datas.type == 'marker' && ol.datas.detail.name == gridName);
						
						gridMarker.setLabel(getMarkerLabel(gridName));
	
						mp.centerAndZoom(gridMarker.point, 16);
					} else {
						layer.msg('请先保存网格！', {icon: 5});
					}
					
				});
			});
		},
		getMarkerLabel = function(txt) {
			let markerLabel = new BMap.Label(txt, {
				offset:new BMap.Size(20,-10)
			});
			
			markerLabel.setStyle({
				'border': 0,
				'background-color': 'rgb(255, 255, 255, 0)'
			});
			
			return markerLabel;
		},
		colorRegion = function(region) {
			filterOverLays(ol => ol.datas && ol.datas.type == 'region').forEach(function(rp) {
				if (rp.datas.detail.name == region) {
					rp.setFillColor('rgb(253, 80, 0)');
				} else {
					rp.setFillColor('#2480cc');
				}
			})
		},
		centerZoomRegion = function(region) {
			mp.centerAndZoom(region, 14);
			colorRegion(region);
		},
		init = function(p) {
			if (!p.containerId) {
				return false;
			}
			regionInterface = new RegionInterface();
			
			BMap.Polygon.prototype.datas = {};
			BMap.Polygon.prototype.setDatas = function(datas) {
				this.datas = datas;
			};
			BMap.Marker.prototype.datas = {};
			BMap.Marker.prototype.setDatas = function(datas) {
				this.datas = datas;
			};
		    // 显示网格区域边界
		    gridRegions = p.gridRegions ? p.gridRegions : [];
		    markerType = null;
			mp = new BMap.Map(p.containerId);
			mp.reset();
			city = p.centerName;
			// 创建点坐标
			mp.centerAndZoom(city, 9);
			// 初始化地图，设置中心点坐标和地图级别
			mp.enableScrollWheelZoom();
			mp.disableDoubleClickZoom();
			mp.setMapStyle({
				enableMapClick: false
			});
		    let rm_pf_p = '#region-manage .province-filter>select[name="province"]',
		    	rm_pf_c = '#region-manage .province-filter>select[name="city"]',
		    	rm_cf_c = '#region-manage .city-filter>select[name="city"]',
		    	rm_gs = '#region-manage button[name="grid-statistics"]';
		    
		    $(rm_pf_p).change(function() {
		    	let pid = $(this).val(),
		    		cityOptions = '';
		    	
		    	getRegionsByPid(pid, function(citys) {
		    		if (citys.length > 0) {
		    			cityOptions = citys.map(city => '<option value="' + city.id + '">' + city.name + '</option>').join('');
		    		}
		    		$(rm_pf_c).html('<option value="">-全省/市-</option>]' + cityOptions);
		    	});
		    });
		    
		    $(rm_pf_c).change(function() {
		    	if (!markerType) {
	    			city = p.centerName + $(rm_pf_p).text() + $(rm_pf_c).text();
	    			mp.centerAndZoom(city, 11);
	    			setBasicDatas($(rm_pf_c).val());
		    	} else {
		    		layer.msg('请先保存网格！', {icon: 5});
		    	}
    		});
		    $(rm_cf_c).change(function() {
		    	if (!markerType) {
	    			city = p.centerName + $(rm_cf_c).text();
	    			mp.centerAndZoom(city, 11);
	    			setBasicDatas($(rm_cf_c).val());
		    	} else {
		    		layer.msg('请先保存网格！', {icon: 5});
		    	}
    		});
		    
		    // 地图添加点击时间
		    mp.addEventListener("dblclick", function(e) {
		    	if (markerType == 'add') { // markerType为true时点击功能表示添加标注
		    		let newMarker = new BMap.Marker(e.point);
		    		newMarker.setDatas({
		    			type: 'marker',
		    			detail: latestMarkerInfo
		    		});
		    		markerPoint(newMarker);
					latestMarkerPoint.addEventListener("dragend", function(e) {
					 	var result = BMapLib.GeoUtils.isPointInPolygon(e.point, latestPolygon);
					 	if (!result) {
					 		layer.msg('应急点必须在应急区域内！', {icon: 5});
					 	}
					});
					addPolygon();
		    		
		    	} else { // 否则设置点击点为中心，放大地图
					mp.centerAndZoom(e.point, 16);
					// 设置点击区域
					geoc.getLocation(e.point, function(rs){
						var addComp = rs.addressComponents,
							regionPolygons = null;
						
						$('#region-manage .region-select').val(addComp.district);
						colorRegion(addComp.district);
						
					});
		    	}
			});
		    
		    $('#region-manage .region-select').html('<option>-切换目标区域-</option>' + regions.map(r => '<option value="' +  r.name + '">' + r.name + '</option>').join(''));
			
			$('#region-manage .add-marker').unbind('click').bind('click', openFormPanel);

			$('#region-manage .save-region-grid').unbind('click').bind('click', saveRegionGrid);
			
			$('#region-manage .toggle-region-grid-list').unbind('click').bind('click', function() {
				if ($(this).hasClass('selected')) {
					$(this).removeClass('selected');
					$('#grid-region-distribute-view').addClass('hide');
				} else {
					$(this).addClass('selected');
					$('#grid-region-distribute-view').removeClass('hide');
				}
			});
			
		};


	return {
		init: init
	}
}());
