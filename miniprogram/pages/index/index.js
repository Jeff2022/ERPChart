import * as echarts from '../../utils/ec-canvas/echarts'; //引入echarts.js

let old_data = require('../../data/erp_hs300.js')
let util = require('../../utils/util.js')

// var g_jsonData = require('../../data/ERP_ratio.js');

var yData = [];
var xData = []
var yData_all = [];
var xData_all = []
var Chart = null;
var titles = ['沪深300','上证50','创业板','中证500']
var title_index = 0

const mean_color = '#FF3333';
const sd_color = '#888888';

const normalColor = "#333333";
const selectedColor = "#3355FF";

var current_index = 0
let interval_array = [240,400,650]

// import imgCli from '../../images/tab1.png'


Page({
	/**   * 页面的初始数据 */

  data: {
    title: '股权风险溢价',
    ec: {
      lazyLoad: true // 延迟加载
    },
    start_day: '',
    end_day: '',
    mean_value: 0,
    mean_display: 0,
    standard_deviation_value: 0,
    sd_display: 0,
    percentile: 0,

    textColor1: normalColor,
    textColor2: normalColor,
    textColor3: normalColor,
    textColor4: normalColor,


  },

 
//   onTap1: function() {
//     console.log("tapped 1")
//     this.setData({textColor1: selectedColor})
//     this.setData({textColor2: normalColor})
//     this.setData({textColor3: normalColor})
//     this.setData({textColor4: normalColor})
//     this.title_index = 0
//   },
//  onTap2: function() {
//   console.log("tapped 2")
//   this.setData({textColor1: normalColor})
//   this.setData({textColor2: selectedColor})
//   this.setData({textColor3: normalColor})
//   this.setData({textColor4: normalColor})
//   this.title_index = 1
// },
//  onTap3: function() {
//   this.setData({textColor1: normalColor})
//   this.setData({textColor2: normalColor})
//   this.setData({textColor3: selectedColor})
//   this.setData({textColor4: normalColor})
//   this.title_index = 2

//   },
//  onTap4: function() {
//   this.setData({textColor1: normalColor})
//   this.setData({textColor2: normalColor})
//   this.setData({textColor3: normalColor})
//   this.setData({textColor4: selectedColor})
//   this.title_index = 3

// },

  /*** 生命周期函数--监听页面加载  */
  onLoad: function (options) {

    this.echartsComponnet = this.selectComponent('#mychart');
    var ps = this.selectComponent('#PeriodSeg')
    ps.init_status()

    this.init_localData()
    // this.init_database()
    this.update_byPeriod(0)

  },

  periodSeg_EventListener: function(e) {

    this.update_byPeriod(e.detail.index)
  
    // if (e.detail.index == 0) {
    //   console.log('1')
    //   yData
    // }else if (e.detail.index == 1) {
    //   console.log('2')
    // }else if (e.detail.index == 2) {
    //   console.log('3')
    // }
  },

  update_byPeriod: function(index) {

    current_index = index

    // yData = []
    // xData = []

    if (index == 2) {
      yData = yData_all
      xData = xData_all
    }else{
      var years = 0
      if (index == 0) {
        years = 5
      }else if (index == 1) {
        years = 10
      }

      let retVal = util.calculate_recent_data(yData_all, xData_all, years)

      yData = retVal.y
      xData = retVal.x
    }


    this.update_info()
    this.update_chart()
  },


  init_localData: function() {
    var n = 0

    while(n < old_data.datas.date.length) {
      xData_all.push(old_data.datas.date[n])
      yData_all.push(old_data.datas.ratio[n] * 100)
      n ++
    }
  },

  // init_database: function() {
  //   // const db = wx.cloud.database()
  //   const db = wx.cloud.database({
  //     env: 'stockdb-7g99cvdmfa222852'
  //   })
  //   // const erp_hs300 = db.collection('erp_hs300')
  //   // const data_erp = db.collection('erp_hs300').doc('0e856be3638581bc00dad9b246b2580e')

  //   // 
    
  //   var n = 0
  //   var that = this

  //   // wx.cloud.database().collection('erp_hs300').doc('bf0fecc563899b5a011ef38210e29464').get().then(res => {
  //   //   console.log('成功')
  //   //   console.log(res.data)
  //   // }).catch(err => {
  //   //   console.log('失败',err)
  //   // })

  //   db.collection('erp_hs300').doc('bf0fecc563899b5a011ef38210e29464').get({
  //     success: function(res) {

  //       // this.setData({xData: res.data.date})
  //       // this.setData({yData: res.data.ratio})


  //       // res.data 包含该记录的数据
  //       // console.log(res.data.ratio[1])
  //       // console.log(res.data.ratio.length)
  //       // console.log('-- get --')
  //       while( n < res.data.ratio.length) {
  //         xData_all.push(res.data.date[n])
  //         yData_all.push(res.data.ratio[n]*100)
  //          n++
  //       }

  //       that.update_byPeriod(0)

  //     }
  //   })

  //   // db.collection('erp_hs300').get({
  //   //   success: function(res) {
  //   //     console.log('get all')
  //   //     // res.data 是一个包含集合中有权限访问的所有记录的数据，不超过 20 条
  //   //     console.log(res.data)
  //   //   }
  //   // })
    
    

  //   // console.log('try to get')
  //   // console.log(data_erp)

  // },

  trading_day_string(day_value) {
    let day_str = String(day_value)
    let y_str = day_str.substring(0,4)
    var m_str = day_str.substring(4,6)
    var d_str = day_str.substring(6,8)
    return y_str+"."+m_str+"."+d_str
  },

// 在数据获取完成后(xData, yData)，初始化相关信息
  update_info: function () {

    if (yData.length == 0){
      return
    }

    console.log('init_chart_info')

    var n = 0
    var sum = 0
    var variance = 0
    var yVal = 0
    while( n < yData.length) {
      yVal = yData[n]
      sum += yVal
      n ++
    }
    
    this.setData({start_day: this.trading_day_string(xData[0])})
    this.setData({end_day: this.trading_day_string(xData[xData.length - 1])})

    console.log(sum)
    console.log(n)

    this.setData({mean_value: sum/n})
    this.setData({mean_display: this.data.mean_value.toFixed(3)})

    n = 0
    sum = 0
    while( n < xData.length) {
      yVal = yData[n]
      sum += Math.pow((yVal - this.data.mean_value),2)
      n ++
    }

    // let sdv = Math.pow(sum/jsonData.datas.length, 0.5)

    this.setData({standard_deviation_value: Math.pow(sum/xData.length, 0.5)})
    this.setData({sd_display: this.data.standard_deviation_value.toFixed(3)})

    var sortData = JSON.parse(JSON.stringify(yData ));

    sortData.sort(function(a,b){return a-b});
    var lastIndex = sortData.lastIndexOf(yData[yData.length - 1])
    // console.log((lastIndex/sortData.length)*100)
    this.setData({percentile: ((lastIndex/sortData.length)*100).toFixed(2)})  
    console.log(this.data.percentile)
  },


  update_chart: function() {
    console.log('init_chart')
    if (!Chart){
      this.init_chart(); //初始化图表
    }else{
      this.setOption(Chart); //更新数据
    }
  },
  //初始化图表
  init_chart: function () {
    this.echartsComponnet.init((canvas, width, height) => {
      // 初始化图表
      Chart = echarts.init(canvas, null, {
        width: width,
        height: height
      });
      // Chart.setOption(this.getOption());
      this.setOption(Chart);
      // 注意这里一定要返回 chart 实例，否则会影响事件处理等
      return Chart;
    });
  },
  setOption: function (Chart) {
    if (yData.length == 0){
      return
    }

    // Chart.clear();  // 清除
    console.log('setOption')

    Chart.setOption(this.getOption());  //获取新数据
  },
  getOption: function () {

    // 指定图表的配置项和数据
    var option  = {
      title: {
        // text: '沪深300',
        subtext: titles[title_index]+"股权风险溢价",
        x: 'center'
      },
      // backgroundColor: "#ECF4FA",
      // tooltip: {
      //   show: true,
      //   trigger: 'axis',

      //   axisPointer: {
      //     type: 'cross',    // 指示器类型（'line' 直线指示器；'shadow' 阴影指示器；'none' 无指示器；'cross' 十字准星指示器。）
      //     snap: true,    // 坐标轴指示器是否自动吸附到点上。默认自动判断。
      //     label: {
      //         margin: 10,    // label 距离轴的距离
      //         color: '#FFF',     // 文字的颜色
      //         fontStyle: 'normal',    // 文字字体的风格（'normal'，无样式；'italic'，斜体；'oblique'，倾斜字体） 
      //         fontWeight: 'normal',    // 文字字体的粗细（'normal'，无样式；'bold'，加粗；'bolder'，加粗的基础上再加粗；'lighter'，变细；数字定义粗细也可以，取值范围100至700）
      //         fontSize: '15',    // 文字字体大小
      //         lineHeight: '50',    // 行高 
      //         padding: [2, 3, 2, 3],    // 内边距，单位px 
      //         backgroundColor: 'rgba(50,50,50,0.7)',    // 文本标签的背景颜色
      //     },
      //     animation: false,     // 是否开启动画
      //     // animationDuration: 1000,     // 初始动画时长
      //     // animationDurationUpdate: 200,    // 数据更新动画的时长
      //   },
      //   showContent: false,     // 是否显示提示框浮层，默认显示
      //   alwaysShowContent: false,     // 是否永远显示提示框内容，默认情况下在移出可触发提示框区域后一定时间后隐藏
      //   triggerOn: 'mousemove|click',    // 提示框触发的条件（'mousemove'，鼠标移动时触发；'click'，鼠标点击时触发；'mousemove|click'，同时鼠标移动和点击时触发；'none'，不在 'mousemove' 或 'click' 时触发）
      //   confine: true,    // 是否将 tooltip 框限制在图表的区域内
      //   backgroundColor: 'rgba(50,50,50,0.7)',    // 提示框浮层的背景颜色
      //   padding: 5,    // 提示框浮层内边距，单位px
      //   textStyle: {
      //       color: '#FFF',     // 文字的颜色
      //       fontStyle: 'normal',    // 文字字体的风格（'normal'，无样式；'italic'，斜体；'oblique'，倾斜字体） 
      //       fontWeight: 'normal',    // 文字字体的粗细（'normal'，无样式；'bold'，加粗；'bolder'，加粗的基础上再加粗；'lighter'，变细；数字定义粗细也可以，取值范围100至700）
      //       fontSize: '20',    // 文字字体大小
      //       lineHeight: '50',    // 行高 
      //   },
      //   formatter: function (params) {
      //       var result = 'op'
      //       // var dotHtml = '<span style="display:inline-block;margin-right:5px;border-radius:10px;width:30px;height:30px;background-color:#F1E67F"></span>'    // 定义第一个数据前的圆点颜色
      //       // var dotHtml2 = '<span style="display:inline-block;margin-right:5px;border-radius:10px;width:30px;height:30px;background-color:#2BA8F1"></span>'    // 定义第二个数据前的圆点颜色
      //       // result += params[0].axisValue + "</br>" + dotHtml + ' 数据名称 ' + params[0].data + "</br>" + dotHtml2 + ' 数据名称 ' + params[1].data;
      //       return result
      //   }
      
    
      // },
      xAxis: {
        type: 'category',
        data: xData,
        axisLabel: {
          interval: interval_array[current_index],
          formatter: function(value, index) {
            let substr = String(value)
        
            return substr.substring(0,4)
          }
        }
      },
      yAxis: {
        type: 'value',
        name: '(%)'
        // min: -2.5, // 最小值 
        // max:10,
      },
      series: [{
        name: "ERP",
        data: yData,
        type: 'line',
        symbolSize: 0,  //设置折线上圆点大小
        // smooth: 0.5,
        // symbol:'circle',            
        itemStyle: {
          normal: { 
            label : {
              show: false  // y轴数值不显示 
            }, 
            lineStyle:{
              color: 'rgba(45,100,230,1)', // 折线颜色设
              width: 1.0
            }
          }
        },
        markPoint: {
          data: [
            // {name:"最大值", type:"max"},
            
          //   {name:"最小值", 
          //   type:"min",
          //   symbol: "none"
          // },
          //   { type: "max",
          //     symbol: "pin",
          //     symbolSize: 20,
          //     // animation: true,
          //     symbolOffset: [0, 0],  
          //     label: {
          //       show: true,
          //       color: '#000',
          //       padding: [0, 20, 0, -10],
          //     },
          //     itemStyle: { color: '#f00' }
          //   },
            {
              // x: '100%',
              // yAxis: ,
              coord: [yData.length-1, yData[yData.length-1]],
              symbol: "circle",
              symbolSize: 6,
              value: String(yData[yData.length-1].toFixed(3)),
              animation: true,
              label: {
                show: true,
                color: '#26e',
                fontSize: 10,
                padding: [0, -30, 0, 10],

              },
              itemStyle: { color: '#26e' }
            }
          ]
        }
        }],
        color: ['white',mean_color,sd_color],
        legend: {
            show: true,
            top: 10,
            right: 20,
            orient: "vertical",
          itemGap: 6,
          itemWidth: 20, // 图例图形的宽度
          itemHeight: 1.5, // 图例图形的高度

            data: [
              // {
              //   name: "最后一个交易日", // 图例文字内容
              //   icon: "circle", //('image://' + imgSup + '') // 图例图形的形状
              //   itemWidth: 5, // 图例图形的宽度
              //   itemHeight: 5, // 图例图形的高度
      
              //   textStyle: {
              //     // 图例文字样式
              //     color: '#FF3333',
              //     fontSize: 10
              //   },
              // },

              {
                name: "均值", // 图例文字内容
                icon: "rect", // 图例图形的形状，有多个可选值：'circle', 'rect', 'roundRect', 'triangle', 'diamond', 'pin', 'arrow', 'none'，

                textStyle: {
                  // 图例文字样式
                  color: mean_color,
                  fontSize: 12
                },
              },
              
              {
                name: "标准差", // 图例文字内容,需与 series 中一致
                icon: "rect", // 图例图形的形状

                textStyle: {
                  // 图例文字样式
                  color: sd_color,
                  fontSize: 12
                },
              }

            
            ],
  
            
        }
    
    };

    //显示均值
    if (this.data.mean_value > 0) {
      option.series.push({
      
          name: "均值",
          type: 'line',
          markLine: {
              silent: true,
              symbol: ['none', 'none'],
              lineStyle: {
              normal: {
                type: 'solid', //'solid', // 线的类型（实线、虚线、点线）
                color: mean_color,
                width: 1.0
                // cap: 'square',
                // join: 'miter'
                }
              },
              data: [{
                // type: "average",
                yAxis: this.data.mean_value
              }],
              
              textStyle: {
                fontSize: 10
              },
              label: {
                  position: 'end',
                  distance: 50,
                  normal: {
                    formatter: ''
                  }
              }
            }
          
      })
    }

    if (this.data.standard_deviation_value > 0) {
      option.series.push({
      
          name: "标准差",
          type: 'line',
          markLine: {
              silent: true,
              symbol: ['none', 'none'],
              lineStyle: {
              normal: {
                type: 'solid', //'solid', // 线的类型（实线、虚线、点线）
                color: sd_color,
                width: 1.0
                // cap: 'square',
                // join: 'miter'
                }
              },
              data: [{
                yAxis: this.data.mean_value + this.data.standard_deviation_value
              },{
                yAxis: this.data.mean_value - this.data.standard_deviation_value
              }],
              
              textStyle: {
                fontSize: 10
              },
              label: {
                  position: 'end',
                  distance: 50,
                  normal: {
                    formatter: ''
                  }
              }
            }
          
      })
    }
    return option;
  },

  // 分享给朋友
  onShareAppMessage: function (res) {
    if (res.from === 'button') {
      // 来自页面内转发按钮
      //console.log("转发：" + JSON.stringify(res.target))
    }
    return { 
      title: this.data.title,
      path: '/pages/index/index',
      success: function (res) {
        //console.log('/pages/order/detail/detail?goodsId=' + this.data.goodsInfo.id )
        // 转发成功
        //console.log("转发成功:" + JSON.stringify(res));
      },
      fail: function (res) {
        // 转发失败
        //console.log("转发失败:" + JSON.stringify(res));
      }
    }
  },
  //分享到朋友圈
  onShareTimeline: function(res){
    return {
      title: this.data.title,
      query: '/pages/index/index',
      imageUrl: '../../images/icon.png'
    }
  },


})
