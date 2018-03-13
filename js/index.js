(function() {
	'use strict';
	var app = angular.module('pf',[]);
	app.controller('mainCtrl',mainCtrl);
	app.directive('everyProvince',everyProvinceDirective);
	app.directive('sexRing',sexRingDirective);
	app.directive('subjectPie',subjectPieDirective);
	app.directive('timeRadar',timeRadarDirective);
	app.directive('educationBar',educationBarDirective);
	mainCtrl.$inject = ['$http'];
	function mainCtrl($http) {
		var that = this;
		that.data = null;
		$http.get('/data/examData!getExamData').then(function(response) {
			that.data = response.data;
			that.sortTop = angular.fromJson(that.data.JOIN_G_TOP);
			that.joinData = angular.fromJson(that.data.JOIN_C_LINE);
			that.sexRing = angular.fromJson(that.data.JOIN_S_RING);
			that.subjectPie = angular.fromJson(that.data.SUBJECT_PIE);
			that.timeRadar = angular.fromJson(that.data.JOIN_TIME_RADAR);
			that.educationBar = angular.fromJson(that.data.EDUCATION_BAR);
		});

		
	}

	everyProvinceDirective.$inject = [];
	function everyProvinceDirective() {
		return {
			restrict:'E',
			replace:true,
			scope:{'data':'='},
			template:'<div style="width:100%;height:100%;"></div>',
			link:function(scope,element,attr) {
				var myChart = echarts.init(element[0]);
				scope.$watch('data',function(res) {
					if(!res) {
						return false;
					}
					var category = [];
					var lineData = [];
					var barData = [];				
					angular.forEach(res,function(val,key) {
						category.push(val.GROUP_AREA);
						lineData.push(val.UCOUNT);
						barData.push(val.GCOUNT);
					});
					var option = {				    
					    tooltip: {
					        trigger: 'axis',
					        axisPointer: {
					            type: 'shadow',
					            label: {
					                show: true,
					                backgroundColor: '#333'
					            }
					        }
					    },
					    legend: {
					        data: ['累计参赛人数', '累计参赛高校数'],
					        textStyle: {
					            color: '#ccc'
					        }
					    },
					    xAxis: {
					        data: category,
					        axisLabel:{rotate:270,interval:0},
					        axisLine: {
					            lineStyle: {
					                color: '#ccc'
					            }
					        }
					    },
					    yAxis: [{
					    	type: 'value',
						    name: '高校数',
					        splitLine: {show: false},
					        axisLine: {
					            lineStyle: {
					                color: '#ccc'
					            }
					        }
					    },{
						        type: 'value',
						        name: '人数',
						        position: 'right',
						        splitLine: {show: false},
						        axisLine: {
						            lineStyle: {
						                color: '#ccc'
						            }
						        }
						    }
					    ],
					    series: [
						    {
						        name: '累计参赛人数',
						        type: 'line',
						        smooth: true,
						        showAllSymbol: true,
						        symbol: 'emptyCircle',
						        symbolSize: 15,
						        data: lineData,
						        yAxisIndex: 1,
						    },
						    {
						        name: '累计参赛高校数',
						        type: 'bar',
						        barWidth: 10,
						        itemStyle: {
						            normal: {
						                barBorderRadius: 5,
						                color: new echarts.graphic.LinearGradient(
						                    0, 0, 0, 1,
						                    [
						                        {offset: 0, color: '#14c8d4'},
						                        {offset: 1, color: '#43eec6'}
						                    ]
						                )
						            }
						        },
						        data: barData
						    }
					    ]
					};
					myChart.setOption(option);
				});
				
				$(window).resize(function() {
					myChart.resize();
				});
				
			}
		}
	}

	sexRingDirective.$inject = [];
	function sexRingDirective() {
		return {
			restrict:'E',
			replace:true,
			scope:{data:'='},
			template:'<div style="width:100%;height:100%;"></div>',
			link:function(scope,element,attr) {
				var myChart = echarts.init(element[0]);	
				scope.$watch('data',function(res) {
					if(!res) {
						return false;
					}
					var sexList = [];
					var category = [];
					angular.forEach(res,function(val,key) {
						if(val.SEX==0) {
							val.SEX = '男';
						} else {
							val.SEX = '女';
						}
						var obj = {name:val.SEX,value:val.COUNT};
						sexList.push(obj);
						category.push(val.SEX);
					});
					var option = {
						title : {
					        text: '性别比例',
					        left:'10',
					        top:'10',
					        textStyle: {
				                color: '#fff',
				                fontWeight:'normal',
				                fontSize:'14'
				            }
					    },
						tooltip: {
					        trigger: 'item',
					        formatter: "{a} <br/>{b}: {c} ({d}%)"
					    },
					    color:['#3085ef','#f03153','#24d4d1'],
					    legend: {
					        orient: 'vertical',
					        top:'20',
					        right:'5',
					        data:category,
					        textStyle: {
				                color: '#fff'
				            }
					    },
					    series: [
					        {
					            name:'性别分布',
					            type:'pie',
					            radius: ['45%', '65%'],
					            center:['45%','50%'],
					            avoidLabelOverlap: false,
					            label: {
					                normal: {
					                    show: false,
					                    position: 'center'
					                }
					            },
					            labelLine: {
					                normal: {
					                    show: false
					                }
					            },
					            data:sexList
					        }
					    ]
					};
					myChart.setOption(option);
				});
				
				
				$(window).resize(function() {
					myChart.resize();
				});
			}
		}
	}

	subjectPieDirective.$inject = [];
	function subjectPieDirective() {
		return {
			restrict:'E',
			replace:true,
			scope:{'data':'='},
			template:'<div style="width:100%;height:100%;"></div>',
			link:function(scope,element,attr) {
				var myChart = echarts.init(element[0]);
				scope.$watch('data',function(res) {					
					if(!res) {
						return false;
					}
					var subList = [];
					var category = [];
					angular.forEach(res,function(val,key) {
						if(val.SUBJECT==null) {
							val.SUBJECT = 'null';
						}
						var obj = {name:val.SUBJECT,value:val.COUNT};
						subList.push(obj);
						category.push(val.SUBJECT);
					});
					var option = {
						title : {
					        text: '学科分布',
					        left:'10',
					        top:'10',
					        textStyle: {
				                color: '#fff',
				                fontWeight:'normal',
				                fontSize:'14'
				            }
					    },
						tooltip: {
					        trigger: 'item',
					        formatter: "{a} <br/>{b}: {c} ({d}%)"
					    },
					    color:['#f8bc66','#f03153','#3085ef','#24d4d1','#9260f5','#bb6f0d','#1628d2','#4aae58'],
					    legend: {
					    	type: 'scroll',
					    	pageIconSize:10,
					    	pageIconInactiveColor:'#aaa',
					    	pageIconColor:'#bbb',
					    	pageTextStyle:{
					    		color:'#aaa'
					    	},
					        orient: 'vertical',
					        right: 10,
					        top: 20,
					        bottom: 20,
					        data:category,
					        textStyle: {
				                color: '#fff',
				                fontSize:'12'
				            }
					    },
					    series: [
					        {
					            name:'学科分布',
					            type:'pie',
					            radius:'65%',
	            				center: ['40%', '50%'],
					            label: {
					                normal: {
					                    show: false,
					                    position: 'center'
					                }
					            },
					            labelLine: {
					                normal: {
					                    show: false
					                }
					            },
					            data:subList
					        }
					    ]
					};
					myChart.setOption(option);
				});
				
				$(window).resize(function() {
					myChart.resize();
				});
			}
		}
	}

	timeRadarDirective.$inject = [];
	function timeRadarDirective() {
		return {
			restrict:'E',
			replace:true,
			scope:{data:'='},
			template:'<div style="width:100%;height:100%;"></div>',
			link:function(scope,element,attr) {
				var myChart = echarts.init(element[0]);
				scope.$watch('data',function(res) {
					if(!res) {return false;}
					var timeList = [0,0,0,0,0,0,0,0,0,0,0,0];
					angular.forEach(res,function(val,key) {
						var num = parseInt(val.TIME);
						if(num==1||num==2) {
							timeList[0]+=val.COUNT;
						} else if(num==3||num==4) {
							timeList[1]+=val.COUNT;
						} else if(num==5||num==6) {
							timeList[2]+=val.COUNT;
						} else if(num==7||num==8) {
							timeList[3]+=val.COUNT;
						} else if(num==9||num==10) {
							timeList[4]+=val.COUNT;
						} else if(num==11||num==12) {
							timeList[5]+=val.COUNT;
						} else if(num==13||num==14) {
							timeList[6]+=val.COUNT;
						} else if(num==15||num==16) {
							timeList[7]+=val.COUNT;
						} else if(num==17||num==18) {
							timeList[8]+=val.COUNT;
						} else if(num==19||num==20) {
							timeList[9]+=val.COUNT;
						} else if(num==21||num==22) {
							timeList[10]+=val.COUNT;
						} else if(num==23||num==0) {
							timeList[11]+=val.COUNT;
						}
					});
					timeList.reverse();
					var maxNum = Math.max.apply(null, timeList);
					var option = {
					    title: {
					        text: '时间分布',
					        left:'10',
					        top:'10',
					        textStyle: {
				               color: '#fff',
				               fontWeight:'normal',
				               fontSize:'14'
				            },
					    },
					    tooltip: {
					    	show:true,
					    	trigger:'item'
					    },
					    legend: {
					        data: ['学校'],
					        show:false
					    },
					    radar: {
					        indicator: [					        
					           { name: '0',max:maxNum},
					           { name: '22',max:maxNum},
					           { name: '20',max:maxNum},
					           { name: '18',max:maxNum},
					           { name: '16',max:maxNum},
					           { name: '14',max:maxNum},
					           { name: '12',max:maxNum},
					           { name: '10',max:maxNum},
					           { name: '8',max:maxNum},
					           { name: '6',max:maxNum},
					           { name: '4',max:maxNum},
					           { name: '2',max:maxNum}
					        ],
					        center:['50%','50%'],
				    		radius:'50%',
				    		scale:true,
					        splitNumber: 4,
				            splitArea: {
				                areaStyle: {
				                    color: 'rgba(114, 172, 209, 0)',
				                    shadowColor: 'rgba(0, 0, 0, 0.3)',
				                    shadowBlur: 10
				                }
				            }
					    },
					    series: [{
					        name: '',
					        type: 'radar',
					        data : [
					            {
					                value : timeList,
					                name : '学校'
					            }
					        ],
					        itemStyle:{
					        	normal:{
					        		opacity:0
					        	}
					        },
					        areaStyle: {
								normal: {
									color: '#f03153',
									opacity:0.7
								},
							},
					        lineStyle: {
								normal: {
									color: '#900',
									opacity:0
								},
							}
					    }]
					};
					myChart.setOption(option);
				});
				
				$(window).resize(function() {
					myChart.resize();
				});	
			}
		}
	}

	educationBarDirective.$inject = [];
	function educationBarDirective() {
		return {
			restrict:'E',
			replace:true,
			scope:{'data':'='},
			template:'<div style="width:100%;height:100%;"></div>',
			link:function(scope,element,attr) {
				var myChart = echarts.init(element[0]);
				scope.$watch('data',function(res) {
					if(!res) {return false;}
					var listData = [];
					var category = [];
					var htmlStr = ''; 
					angular.forEach(res,function(val,key) {
						if(val.EDUCATION==1) {
							val.EDUCATION = '本科';
						} else if(val.EDUCATION==2) {
							val.EDUCATION = '硕士';
						} else if(val.EDUCATION==3) {
							val.EDUCATION = '博士';
						} else {
							val.EDUCATION = '其他';
						}
						category.push(val.EDUCATION);
						listData.push(val.PERCENT);
						htmlStr+='<div class="legend-item"><span class="span'+(res.length-key-1)+'"></span>'+val.EDUCATION+'</div>';
					});					
					category.reverse();
					listData.reverse();
					$('#legend').html(htmlStr);
					var option = {
					    title: {
					        text: '学历分布',
					        left:'10',
					        top:'10',
					        textStyle: {
				                color: '#fff',
				                fontWeight:'normal',
				                fontSize:'14'
				            }
					    },
					    tooltip: {
					        trigger: 'axis',
					        axisPointer: {
					            type: 'shadow'
					        },
					        formatter: "{b}: {c} %"
					    },				    
			            
					    grid: {
					        left: '3%',
					        right: '5%',
					        bottom: '3%',
					        containLabel: true
					    },
					    xAxis: {
					    	name:'%',
					    	nameTextStyle:{
					    		padding:[28,0,0,0]
					    	},
					        type: 'value',
					        max:100,
					        boundaryGap: [0, 0.01],
					        axisLine: {
					            lineStyle: {
					                color: '#ccc'
					            }
					        },
					        itemStyle: {
					            normal: {
					                barBorderRadius: 5,
					                color:  function (params){
				                        var colorList = ['#9260f5','#3085ef','#18cad4','#f03153','#f8bc66'];
				                        return colorList[params.dataIndex];
				                    }
					            }
					        },
					    },
					    yAxis: {
					        type: 'category',
					        data: category,
					        axisLine: {
					            lineStyle: {
					                color: '#ccc',
					                fontSize:12
					            }
					        },
					    },
					    series: [
					        {
					            name: '',
					            type: 'bar',
					            barWidth: 10,
						        itemStyle: {
						            normal: {
						                barBorderRadius: 5,
						                color: function (params){
					                        var colorList = ['#3085f0','#f03153','#f8bc66','#17c9d3'];
					                        return colorList[params.dataIndex];
					                    }
						            }
						        },
					            data: listData
					        }
					    ]
					};
					myChart.setOption(option);
				});
				
				$(window).resize(function() {
					myChart.resize();
				});

			}
		}
	}

})();