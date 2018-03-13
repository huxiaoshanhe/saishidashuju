(function() {
	'use strict';
	var app = angular.module('pf',[]);
	app.controller('mainCtrl',mainCtrl);
	app.directive('scoreDistribute',scoreDistributeDirective);
	app.directive('averageUniversity',averageUniversityDirective);
	app.directive('scoreRates',scoreRatesDirective);
	mainCtrl.$inject = ['$http'];
	function mainCtrl($http) {
		var that = this;
		$http.get('/data/examData!getResultData').then(function(response) {
			that.data = response.data;
			that.scoreRing = angular.fromJson(that.data.SCORE_P_RING);
			that.avgUniversity = angular.fromJson(that.data.GROUP_S_A_TOP);
			that.hardTop = angular.fromJson(that.data.PAPER_D_TOP);
			that.areaTop = angular.fromJson(that.data.PAPER_DIS_TOP);
			if(that.hardTop&&that.hardTop.length>0) {
				that.hardStyle = {
					width:(that.hardTop[0].DSUM/that.hardTop[0].DCOUNT)*100+'%'
				}
				that.hard = (that.hardTop[0].DSUM/that.hardTop[0].DCOUNT).toFixed(2);
			} else {
				that.hardStyle = {width:0};
				that.hard = 0;
				that.hardTop[0] = {DSUM:0,DCOUNT:0};
			}
			if(that.areaTop&&that.areaTop.length>0) {
				that.areaStyle = {
					width:(that.areaTop[0].DSUM/that.areaTop[0].DCOUNT)*100+'%'
				}
				that.area = (that.areaTop[0].DSUM/that.areaTop[0].DCOUNT).toFixed(2);
			} else {
				that.areaStyle = {width:0};
				that.area = 0;
				that.areaTop[0] = {DSUM:0,DCOUNT:0};
			}
			that.scoreRates = angular.fromJson(that.data.PAPER_S_P);
		});
	}

	scoreDistributeDirective.$inject = [];
	function scoreDistributeDirective() {
		return {
			restrict:'E',
			replace:true,
			scope:{'data':'='},
			template:'<div style="width:100%;height:100%;"></div>',
			link:function(scope,element,attr) {
				var myChart = echarts.init(element[0]);
				scope.$watch('data',function(res) {
					if(!res) {return false;}
					var scoreList = [];
					var category = [];
					angular.forEach(res,function(val,key) {
						if(val.SCORE==100) {
							val.SCORE='90-100';
						} else if(val.SCORE==90) {
							val.SCORE='80-90';
						} else if(val.SCORE==80) {
							val.SCORE='70-80';
						} else if(val.SCORE==70) {
							val.SCORE='60-70';
						} else {
							val.SCORE='60以下';
						}
						var obj = {name:val.SCORE,value:val.COUNT};
						scoreList.push(obj);
						category.push(val.SCORE);
					});
					var option = {
						title : {
					        text: '参赛者分数(百分修正)分布',
					        left:'18',
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
					            name:'',
					            type:'pie',
					            radius: ['40%', '60%'],
					            center: ['40%', '55%'],
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
					            data:scoreList
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

	averageUniversityDirective.$inject = [];
	function averageUniversityDirective() {
		return {
			restrict:'E',
			replace:true,
			scope:{data:'='},
			template:'<div style="width:100%;height:100%;"></div>',
			link:function(scope,element,attr) {
				var myChart = echarts.init(element[0]);	
				scope.$watch('data',function(res) {
					if(!res) {return false}
					var dataList = [];
					var category = [];
					angular.forEach(res,function(val,key) {
						dataList.push(val.SCORE);
						category.push(val.GROUP_NAME);
					});
					dataList.reverse();
					category.reverse();
					var option = {
					    title: {
					        text: '高校平均分排名(Top10)(百分修正)',
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
					        }
					    },
					    grid: {
					        left: '3%',
					        right: '4%',
					        bottom: '3%',
					        top:'20%',
					        containLabel: true
					    },
					    xAxis: {
					        type: 'value',
					        boundaryGap: [0, 0.01],
					        axisLine: {
					            lineStyle: {
					                color: '#ccc'
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
					    color:['#3085ef'],
					    series: [
					        {
					            name: '',
					            type: 'bar',
					            barWidth: 10,
						        itemStyle: {
						            normal: {
						                barBorderRadius: 5
						            }
						        },
					            data: dataList
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

	scoreRatesDirective.$inject = [];
	function scoreRatesDirective() {
		return {
			restrict:'E',
			replace:true,
			scope:{'data':'='},
			template:'<div style="width:100%;height:100%;"><div class="item" id="item1" ng-show="typeList[0]"><div class="chart"></div><div class="name">单选题</div></div><div class="item" ng-show="typeList[1]"><div class="chart"></div><div class="name">多选题</div></div><div class="item" ng-show="typeList[2]"><div class="chart"></div><div class="name">判断题</div></div><div class="item" ng-show="typeList[3]"><div class="chart"></div><div class="name">填空题</div></div><div class="item" ng-show="typeList[4]"><div class="chart"></div><div class="name">简答题</div></div><div class="item" ng-show="typeList[5]"><div class="chart"></div><div class="name">分析题</div></div></div>',
			link:function(scope,element,attr) {
				var myChart1 = echarts.init(element.find('.chart')[0]);	
				var myChart2 = echarts.init(element.find('.chart')[1]);
				var myChart3 = echarts.init(element.find('.chart')[2]);
				var myChart4 = echarts.init(element.find('.chart')[3]);	
				var myChart5 = echarts.init(element.find('.chart')[4]);	
				var myChart6 = echarts.init(element.find('.chart')[5]);	
				scope.$watch('data',function(res){
					scope.typeList = [null,null,null,null,null,null];
					if(!res||res.length==0) {
						myChart1.clear();
						myChart2.clear();
						myChart3.clear();
						myChart4.clear();
						myChart5.clear();
						myChart6.clear();
						return false;
					}
					var option1=null,option2=null,option3=null,option4=null,option5=null,option6=null;
					angular.forEach(res,function(val,key) {
						if(val.QST_TYPE==0) {
							scope.typeList[0] = val;
							option1 = new banRing(val.COUNT,val.PRECENT*100,100,'#f03152','#7269b8');
						} else if(val.QST_TYPE==1) {
							scope.typeList[1] = val;
							option2 = new banRing(val.COUNT,val.PRECENT*100,100,'#f8bc64','#6795c9');
						} else if(val.QST_TYPE==2) {
							scope.typeList[2] = val;
							option3 = new banRing(val.COUNT,val.PRECENT*100,100,'#17cdd1','#2897e9');
						} else if(val.QST_TYPE==3) {
							scope.typeList[3] = val;
							option4 = new banRing(val.COUNT,val.PRECENT*100,100,'#2f84ef','#3085ef');
						} else if(val.QST_TYPE==4) {
							scope.typeList[4] = val;
							option5 = new banRing(val.COUNT,val.PRECENT*100,100,'#945ff5','#497bea');
						} else if(val.QST_TYPE==5) {
							scope.typeList[5] = val;
							option6 = new banRing(val.COUNT,val.PRECENT*100,100,'#f0632e','#647cc2');
						}
					});

					if(option1) {
						myChart1.setOption(option1);
					} else {
						myChart1.clear();
					}						
					if(option2) {
						myChart2.setOption(option2);
					} else {
						myChart2.clear();
					}
					if(option3) {
						myChart3.setOption(option3);
					} else {
						myChart3.clear();
					}
					if(option4) {
						myChart4.setOption(option4);
					} else {
						myChart4.clear();
					}
					if(option5) {
						myChart5.setOption(option5);
					} else {
						myChart5.clear();
					}
					if(option6) {
						myChart6.setOption(option6);
					} else {
						myChart6.clear();
					}
				});

				$(window).resize(function() {
					myChart1.resize();
					myChart2.resize();
					myChart3.resize();
					myChart4.resize();
					myChart5.resize();
					myChart6.resize();
				});
			}
		}
	}


	function banRing(num,num2,num3,startColor,endColor) {
		var arr = num.toString().split('.');
		if(arr.length>1) {
			num = num.toFixed(1);
		}		
		num2 = Math.round(num2);
		this.title = {
	        "text": '数量:'+num,
	        "x": '50%',
	        "y": '55%',
	        "textAlign": "center",
	        "textStyle": {
	            "fontWeight": 'normal',
	            "fontSize": 12,
	            "color": "#fff",
	        }
	    };
		this.series = [{
	            "name": ' ',
	            "type": 'pie',
	            "radius": ['78%', '80%'],
	            "avoidLabelOverlap": false,
	            "startAngle": 225,
	            "color": ["#fff", "transparent"],
	            "hoverAnimation": false,
	            "legendHoverLink": false,
	            "label": {
	                "normal": {
	                    "show": false,
	                    "position": 'center'
	                },
	                "emphasis": {
	                    "show": true,
	                    "textStyle": {
	                        "fontSize": '30',
	                        "fontWeight": 'bold'
	                    }
	                }
	            },
	            "labelLine": {
	                "normal": {
	                    "show": false
	                }
	            },
	            "data": [{
	                "value": 75,
	                "name": '',
	                "itemStyle": {
	                    "normal": {
	                        "color": new echarts.graphic.LinearGradient(1, 0, 0, 1, [{
	                            "offset": 0,
	                            "color": endColor
	                        }, {
	                            "offset": 1,
	                            "color": startColor
	                        }]),
	                    }
	                }
	            }, {
	                "value": 25,
	                "name": '',
	                "itemStyle": {
	                    "normal": {
	                        color: 'rgba(0,0,0,0)'
	                    }
	                }
	            }]
	        }, {
	            "name": '',
	            "type": 'pie',
	            "radius": ['55%', '78.1%'],
	            "avoidLabelOverlap": false,
	            "startAngle": 225,
	            "color": ["#fff", "transparent"],
	            "hoverAnimation": false,
	            "legendHoverLink": false,
	            "z": 10,
	            "label": {
	                "normal": {
	                    "show": false,
	                    "position": 'center'
	                },
	                "emphasis": {
	                    "show": true,
	                    "textStyle": {
	                        "fontSize": '30',
	                        "fontWeight": 'bold'
	                    }
	                }
	            },
	            "labelLine": {
	                "normal": {
	                    "show": false
	                }
	            },
	            "data": [{
	                "name": '50',
	                "value": num2*0.75,
	                "label": {
	                    "normal": {
	                        "show": true,
	                        "formatter": num2+'%',
	                        "textStyle": {
	                            "fontSize": 14,
	                            "color": "#fff",
	                        }
	                    }
	                },
	                "itemStyle": {
	                    "normal": {
	                        "color": new echarts.graphic.LinearGradient(1, 0, 0, 1, [{
	                            "offset": 0,
	                            "color": endColor
	                        }, {
	                            "offset": 1,
	                            "color": startColor
	                        }]),
	                    }
	                }
	            }, {
	                "name": '',
	                "value": (100-num2*0.75),
	                "itemStyle": {
	                    "normal": {
	                        color: 'rgba(0,0,0,0)'
	                    }
	                }
	            }]
	        }
	    ];
	}
})();