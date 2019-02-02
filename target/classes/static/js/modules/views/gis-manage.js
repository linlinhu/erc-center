let GisManage = (function() {
	let containerId,
		gsChart,
		normal_v,
		professional_v,
		team_v,
		topRegion,
		gsMp,
		gsZoom = 7,
		type = 1,
		mapInit = function() {
			if (type == 1) {
				$('#' + containerId).css('height', ($(window).height() - 335) + 'px');
				$('#gis-statistics-manage').css('display', 'block');
			}
			
			if (type == 2) {
				$('#' + containerId).css('height', ($(window).height() - 50) + 'px ');
				$('#gis-statistics-manage').css('display', 'block');
			}
			
			gsChart = echarts.init(document.getElementById(containerId));
			var option = {
				title: {
			        text: '志愿者注册点分布图',
			        left: 'center'
			    },
			    bmap: {
			        // 百度地图中心经纬度
			        center: [104.07, 30.67],
			        // 百度地图缩放
			        zoom: 7,
			        // 是否开启拖拽缩放，可以只设置 'scale' 或者 'move'
			        roam: true,
			        styleJson: [
			            {//不显示点信息
			                "featureType": "poi",
			                "elementType": "all",
			                "stylers": {
			                    "color": "#ffffff",
			                    "visibility": "off"
			                }
			            }
			        ]
			    },
			    backgroundColor: '#404a59',
			    tooltip: {
			        trigger: 'item',
			        position: function(point, params, dom) {
			            // 可以拼接任意html
			            $(dom).html(params.data.name);
			        }
			    },
			    legend: {
			        left: 'left',
			        data: ['普通', '专业', '团队'],
			        textStyle: {
			            color: '#666'
			        }
			    },
			    series: [{
			        name: '普通',
			        type: 'scatter',
			        coordinateSystem: 'bmap',
			        symbolSize: 16,
			        symbol: 'image://' + base + 'img/po1.png',
			        showEffectOn: 'render',
			        rippleEffect: {
			            brushType: 'stroke'
			        },
			        data: normal_v
			    },{
			        name: '专业',
			        type: 'scatter',
			        coordinateSystem: 'bmap',
			        symbolSize: 16,
			        symbol: 'image://' + base + 'img/po2.png',
			        showEffectOn: 'render',
			        rippleEffect: {
			            brushType: 'stroke'
			        },
			        data: professional_v
			    },{
			        name: '团队',
			        type: 'scatter',
			        coordinateSystem: 'bmap',
			        symbolSize: 16,
			        symbol: 'image://' + base + 'img/po3.png',
			        showEffectOn: 'render',
			        rippleEffect: {
			            brushType: 'stroke'
			        },
			        hoverAnimation: true,
			        itemStyle: {
			            normal: {
			                color: 'rgba(255, 245, 0',
			                shadowBlur: 2
			            }
			        },
			        data: team_v
			    }]
			};
			gsChart.clear();
			setTimeout(function() {
				gsChart.setOption(option, true);
				gsChart.resize();// 自适应尺寸
				window.onresize = function(){
					gsChart.resize(); 
				};
				gsMp = gsChart.getModel().getComponent('bmap').getBMap();
				switch(topRegion.level) {
					case 0:
						gsZoom = 3;
					case 1:
						gsZoom = 7;
					case 2:
						gsZoom: 9;
				};
				gsMp.centerAndZoom(topRegion.name, gsZoom);
				gsMp.addEventListener("click", function(e) {
					if (type == 1) {
						let gisIndex = null;
						layer.close(gisIndex);
						gisIndex = layer.open({
							type: 1,
							title: 'gis统计面板',
							content: $('#gis-statistics-manage'),
							end:function(index){
								type = 1;
								mapInit();
								layer.close(index);
					        }  
						});
						type = 2;
						mapInit();
						layer.full(gisIndex);
					}
				});
			}, 1000)
		},
		init = function(p, callback) {
			containerId = p.containerId;
			topRegion = p.topRegion;
	
			
			VolunteerInterface.registerSpread(null, function(res) {
				normal_v = [];
				professional_v = [];
				team_v = [];
				
				res.gises.map(g => {
					let obj = {
						value: [g.longitude, g.latitude],
						idx: g.id,
						name: g.name
					};
					if (!g.type) {
						normal_v.push(obj);
					}
					
					if (g.type == 2) {
						team_v.push(obj);
					}
					
					if (g.type == 3 || g.type == 4) {
						professional_v.push(obj);
					}
				});
				mapInit(1);
			});
		};
	
	return {
		init: init
	};
}());