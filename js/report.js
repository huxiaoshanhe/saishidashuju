$(function() {
	setTimeout(function() {
		$('#schoolList').perfectScrollbar();
	},2000);
});
(function() {
	'use strict';
	var app = angular.module('pf',[]);
	app.controller('mainCtrl',mainCtrl);
	app.directive('gardeSection',gardeSectionDirective);
	app.directive('scoreRates',scoreRatesDirective);
	app.directive('sexRing',sexRingDirective);
	app.directive('subjectPie',subjectPieDirective);
	app.directive('timeRadar',timeRadarDirective);
	app.directive('educationBar',educationBarDirective);
	app.directive('college',collegeDirective);

	mainCtrl.$inject = ['$http'];
	function mainCtrl($http) {
		var that = this;
		that.isShowList = false;
		that.mainClick = function() {
			that.isShowList = false;
		}
		that.prevent = function(e) {
			e.stopPropagation();
		}

		$http.get('http://localhost:5323/platform/data/examData!getAllGroup').then(function(res) {
			that.universities = res.data;
			that.currentUnivers = that.universities[6];
			getData(that.currentUnivers.GROUP_ID);
		});

		

		that.showList = function(e) {
			that.isShowList = !that.isShowList;
			e.stopPropagation();
		}

		that.selectUnivers = function(obj) {
			that.currentUnivers = obj;
			that.isShowList = false;
			getData(that.currentUnivers.GROUP_ID);
		}

		that.export = function() {
			var imageData1 = null;
			var imageData2 = null;
			var imageData3 = null;
			var imageData4 = null;
			var imageData5 = null;
			var imageData6 = null;
			html2canvas($('#scoreBar'), {
	            onrendered: function (canvasa) {
	            	imageData1 = canvasa.toDataURL("png");
	            	html2canvas($('#scoreRates'), {
			            onrendered: function (canvasb) {
			            	imageData2 = canvasb.toDataURL("png");
			            	html2canvas($('#subjectPie'), {
					            onrendered: function (canvasc) {
					            	imageData3 = canvasc.toDataURL("png");
					            	html2canvas($('#timeRadar'), {
							            onrendered: function (canvasd) {
							            	imageData4 = canvasd.toDataURL("png");
							            	html2canvas($('#educationBar'), {
									            onrendered: function (canvase) {
									            	imageData5 = canvase.toDataURL("png");
									            	html2canvas($('#colleges'), {
											            onrendered: function (canvasf) {
											            	imageData6 = canvasf.toDataURL("png");
											            	var formStr = '<form method="post" target="_blank" action="/data/examData!downloadPdf?groupId='+that.currentUnivers.GROUP_ID+'">';
											                formStr += '<input name="image1" type="text" value="'+imageData1+'" />';
											                formStr += '<input name="image2" type="text" value="'+imageData2+'" />';
											                formStr += '<input name="image3" type="text" value="'+imageData3+'" />';
											                formStr += '<input name="image4" type="text" value="'+imageData4+'" />';
											                formStr += '<input name="image5" type="text" value="'+imageData5+'" />';
											                formStr += '<input name="image6" type="text" value="'+imageData6+'" />';
											                var form = $(formStr);
											                form.appendTo('body');
								        					form.css('display','none');
														    form.submit();
														    form.remove();
											            }
											        });
									            }
									        });
							            }
							        });
					            }
					        });
			            }
			        });
	            }
	        });
		}

		function getData(id) {
			$http.get('http://localhost:5323/platform/data/examData!getGroupData',{params:{'groupId':id}}).then(function(res) {
				that.data = res.data;
				that.userSort = angular.fromJson(that.data.JOIN_G_TOP);
				that.avgSort = angular.fromJson(that.data.GROUP_S_A_TOP);
				that.scoreBar = angular.fromJson(that.data.SCORE_P_RING);
				that.scoreRates = angular.fromJson(that.data.PAPER_S_P);
				that.sexRing = angular.fromJson(that.data.JOIN_S_RING);
				that.subjectPie = angular.fromJson(that.data.SUBJECT_PIE);
				that.timeRadar = angular.fromJson(that.data.JOIN_TIME_RADAR);
				that.educationBar = angular.fromJson(that.data.EDUCATION_BAR);
				that.hardTop = angular.fromJson(that.data.PAPER_D_TOP);
				that.areaTop = angular.fromJson(that.data.PAPER_DIS_TOP);
				if(that.hardTop.ALL) {
					that.hardStyle = {
						width:(that.hardTop.PAPER_D/that.hardTop.ALL)*100+'%'
					}
					that.hard = (that.hardTop.PAPER_D/that.hardTop.ALL).toFixed(2);
				} else {
					that.hardTop.ALL = 0;
					that.hardStyle = {
						width:0
					}
					that.hard = 0;
				}
				
				if(that.areaTop.ALL) {
					var fenzi = parseFloat(that.areaTop.PAPER_DIS);
					var fenmu = parseFloat(that.areaTop.ALL);
					that.areaStyle = {
						width:(fenzi/fenmu)*100+'%'
					}
					that.area = (fenzi/fenmu).toFixed(2);
				} else {
					that.areaTop.ALL = 0;
					that.areaStyle = {
						width:0
					}
					that.area = 0;
				}
				
				that.colleges = angular.fromJson(that.data.GROUP_COLLEGE_C);
			});
		}
	}

	gardeSectionDirective.$inject = [];
	function gardeSectionDirective() {
		return {
			restrict:'E',
			replace:true,
			scope:{'data':'='},
			template:'<div style="width:100%;height:100%;"></div>',
			link:function(scope,element,attr) {
				var myChart = echarts.init(element[0]);
				scope.$watch('data',function(res) {	
					var hardDisks = [
						{over:0,allCount:0},
						{over:0,allCount:0},
						{over:0,allCount:0},
						{over:0,allCount:0},
						{over:0,allCount:0}
					];
					var dataList = [0,0,0,0,0];			
					if(!res||res.length==0) {
						myChart.clear();
						return false;
					}
					angular.forEach(res,function(val,key) {
						if(val.SCORE==60) {
							hardDisks[0].over = val.OVER;
							hardDisks[0].allCount = val.ALLCOUNT;
							dataList[0] = Math.round(val.PERCENT);
						} else if (val.SCORE==70) {
							hardDisks[1].over = val.OVER;
							hardDisks[1].allCount = val.ALLCOUNT;
							dataList[1] = Math.round(val.PERCENT);
						} else if (val.SCORE==80) {
							hardDisks[2].over = val.OVER;
							hardDisks[2].allCount = val.ALLCOUNT;
							dataList[2] = Math.round(val.PERCENT);
						} else if (val.SCORE==90) {
							hardDisks[3].over = val.OVER;
							hardDisks[3].allCount = val.ALLCOUNT;
							dataList[3] = Math.round(val.PERCENT);
						} else if (val.SCORE==100) {
							hardDisks[4].over = val.OVER;
							hardDisks[4].allCount = val.ALLCOUNT;
							dataList[4] = Math.round(val.PERCENT);
						} 
					});

					var option = {
					    title: {
					        text: '分数段人数占比与排名(百分修正)',
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
					        right: '8%',
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
					    },
					    yAxis: {
					        type: 'category',
					        data: ['60以下','60-70','70-80','80-90','90-100'],
					        axisLine: {
					            lineStyle: {
					                color: '#ccc',
					                fontSize:12
					            }
					        },
					    },
					    series: [
					        {
					            name: '%',
					            type: 'bar',
					            barWidth: 10,
						        itemStyle: {
						            normal: {
						                barBorderRadius: 5,
						                color:  function (params){
					                        var colorList = ['#9260f5','#3085ef','#18cad4','#f03153','#f8bc66'];
					                        return colorList[params.dataIndex];
					                    }
						            }
						        },
					            data: dataList,
					            label:{
					            	normal:{
					            		show:true,
					            		position:'right',
					            		color:'red',
					            		formatter: function(data) {
		                                	var result = "";
		                                    result += '{a|'+hardDisks[data.dataIndex].over.toFixed(0)+'}' + "{c|/}{b|"+hardDisks[data.dataIndex].allCount+'}';
		                                    return result;
		                                },
		                                rich:{
		                                	a: {
								                fontSize:22,
								                color:'#f03254'
								            },
								            b:{
								            	fontSize:12,
								            	color:'#f03254',
								            	padding:[0,0,6,0]
								            },
								            c:{
								            	fontSize:12,
								            	color:'#f03254',
								            	padding:[0,0,4,0]
								            }
		                                }
					            	}
					            }
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
			template:'<div style="width:100%;height:100%;padding:0 100px 0 50px;"><div class="item" ng-show="typeList[0]"><div class="chart"></div><div class="name">单选题<br />排名：{{typeList[0].OVER}}/{{typeList[0].ALLCOUNT}}</div></div><div class="item" ng-show="typeList[1]"><div class="chart"></div><div class="name">多选题<br />排名：{{typeList[1].OVER}}/{{typeList[1].ALLCOUNT}}</div></div><div class="item" ng-show="typeList[2]"><div class="chart"></div><div class="name">判断题<br />排名：{{typeList[2].OVER}}/{{typeList[2].ALLCOUNT}}</div></div><div class="item" ng-show="typeList[3]"><div class="chart"></div><div class="name">填空题<br />排名：{{typeList[3].OVER}}/{{typeList[3].ALLCOUNT}}</div></div><div class="item" ng-show="typeList[4]"><div class="chart"></div><div class="name">简答题<br />排名：{{typeList[4].OVER}}/{{typeList[4].ALLCOUNT}}</div></div><div class="item" ng-show="typeList[5]"><div class="chart"></div><div class="name">分析题<br />排名：{{typeList[5].OVER}}/{{typeList[5].ALLCOUNT}}</div></div></div>',
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
					} else {
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
		num2 = Math.round(num2);
		this.title = {
	        "text": '数量：'+num,
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
	            "name": '',
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
	                "name": '',
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
					if(!res||res.length==0) {
						myChart.clear();
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
					if(!res||res.length==0) {
						myChart.clear();
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
					if(!res||res.length==0) {
						myChart.clear();
						return false;
					}
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
					    	trigger: 'item'
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
					                name : ''
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
				
				function getAngle(mx,my,px,py){
			        var x = Math.abs(px-mx);  
			        var y = Math.abs(py-my);  
			        var z = Math.sqrt(Math.pow(x,2)+Math.pow(y,2));  
			        var cos = y/z;  
			        var radina = Math.acos(cos);  
			        var angle = Math.floor(180/(Math.PI/radina));  
			        if(mx>px && my>py){  
			            angle = 180-angle;  
			        }  
			        if(mx==px && my>py){  
			            angle = 180;  
			        }  
			        if(mx>px && my==py){  
			            angle = 90;  
			        }  
			        if(mx<px && my>py){  
			            angle = 180+angle;  
			        }  
			        if(mx<px && my==py){  
			            angle = 270;  
			        }  
			        if(mx<px && my<py){  
			            angle = 360-angle;  
			        }  
			        return 360-angle;  
			    };  
		         
		       
		       	function getIndexToDisplay(num,angle){
		       		var filterIndex =0;  
			        for(var i=0; i<num; i++){  
			            if(angle>(360/num*i-360/num/2) && angle<(360/num*i+360/num/2)){  
			                filterIndex = i;  
			                break;  
			            }  
			        }  
		        	return filterIndex;
		       	};  
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
					if(!res||res.length==0) {
						myChart.clear();
						return false;
					}
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

	collegeDirective.$inject = [];
	function collegeDirective() {
		return {
			restrict:'E',
			replace:true,
			scope:{'data':'='},
			template:'<div style="width:100%;height:100%;"></div>',
			link:function(scope,element,attr) {
				var myChart = echarts.init(element[0]);
				scope.$watch('data',function(res) {
					if(!res||res.length==0) {myChart.clear();return false;}
					var dataList = [];
					angular.forEach(res,function(val,key) {
						var obj = {name:val.COLLEGE,value:val.COUNT};
						dataList.push(obj);
					});
					var option = {
					    title: {
					        text: '院系分布',
					        left:'10',
					        top:'10',
					        textStyle: {
				                color: '#fff',
				                fontWeight:'normal',
				                fontSize:'14'
				            }
					    },
					    tooltip: {
					         formatter: '{b}:<br />人数： {c}'
					    },
					    color: ['#3085ef','#f8bc66','#18cad4','#f03153','#9260f5','#bb6f0d','#4aae58'],
					    backgroundColor:'#212139',
					    series: [{
					        type: 'treemap',
					        nodeClick:false,
					        width:'94%',
					        height:'85%',
					        top:'10%',
					        breadcrumb:{show:false},
					        roam:false,
					        data: dataList
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
})();