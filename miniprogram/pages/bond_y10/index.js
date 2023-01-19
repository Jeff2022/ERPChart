// pages/bond_y10/index.js
import * as echarts from '../../utils/ec-canvas/echarts'; //引入echarts.js

let old_data = require('../../data/bond_y10.js')
let util = require('../../utils/util.js')

var yData = [];
var xData = []
var yData_all = [];
var xData_all = []

var current_index = 0
let max_array = [3,3.5,6,6]
let min_array = [2.5,2,0,0]
let interval_array = [4,60,220,600]


var Chart = null;

Page({
  title: '十年期国债收益率',

  data: {
    ec: {
      lazyLoad: true // 延迟加载
    },
    last5Days:[
    ]

    // ec2: {
    //   lazyLoad: true // 延迟加载
    // }
  },

  periodSeg_EventListener: function(e) {

    this.update_byPeriod(e.detail.index)
  
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    this.echartsComponnet = this.selectComponent('#mychart1');
    // this.echartsComponnet2 = this.selectComponent('#mychart2');
    // console.log('y10 onLoad!')
    var ps = this.selectComponent("#PeriodSeg")
    ps.init_status()

    this.init_localData()
    // this.init_database()
    this.update_byPeriod(0)


  },
  update_byPeriod: function(index) {

    // yData = []
    // xData = []

    current_index = index

    if (index == 3) {
      yData = yData_all
      xData = xData_all
    }else if(index == 0){
      let retVal = util.calculate_recent_month(yData_all, xData_all)

      yData = retVal.y
      xData = retVal.x
    }else{
      var years = 0
      if (index == 1) {
        years = 1
      }else if (index == 2) {
        years = 5
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
      yData_all.push(old_data.datas.close[n])
      n ++
    }
  },

  // init_database: function() {

  //   // const db = wx.cloud.database()

  //   const db = wx.cloud.database({
  //     env: 'stockdb-7g99cvdmfa222852'
  //   })
  
  //   var n = 0
  //   var that = this

  //   db.collection('treasury_y10').doc('649330e26389982700f73dd65beb1e76').get({
  //     success: function(res) {

  //       // this.setData({xData: res.data.date})
  //       // this.setData({yData: res.data.close})


  //       // res.data 包含该记录的数据
  //       // console.log(res.data)
  //       // console.log(res.data.close[1])
  //       console.log('-- get --')
  //       console.log(res.data.close.length)
  //       while( n < res.data.close.length) {
  //         xData_all.push(res.data.date[n])
  //         yData_all.push(res.data.close[n])
  //         n++
  //       }

  //       that.update_byPeriod(0)

  //     }
  //     // failure: function(res){

  //     // }
  //   })
    
    

  //   // console.log('try to get')
  //   // console.log(data_erp)

  // },

  update_info: function() {

    var lastDatas = [
      {"day":"","close":"","change":""},
      {"day":"","close":"","change":""},
      {"day":"","close":"","change":""},
      {"day":"","close":"","change":""},
      {"day":"","close":"","change":""},
    ]

    var n = 0
    var dayStr = ''
    while (n < 5) {

      dayStr = String(xData_all[xData_all.length-n-1])

      // console.log(dayStr)

      lastDatas[n].day = dayStr.substring(0,4)+"-" + String(Number(dayStr.substring(4,6)))+"-"+String(Number(dayStr.substring(6,8)))
      // console.log(lastDatas[n].day)

      let y_now = yData_all[yData_all.length-n-1]
      let y_prev = yData_all[yData_all.length-n-2]

      // console.log((y_now-y_prev)/y_prev," ",y_prev)

      lastDatas[n].close = y_now
      lastDatas[n].change = (((y_now - y_prev)/y_prev)*100).toFixed(2)
      n++;
    }

    this.setData({last5Days: lastDatas})
  },

  update_chart: function() {
    console.log('update_chart')
    if (!Chart){
      this.init_chart(); //初始化图表
    }else{
      this.setOption(Chart); //更新数据
    }
  },

  
  //初始化图表
  init_chart: function() {
    console.log('init_chart')
    this.echartsComponnet.init((canvas, width, height) => {
      // 初始化图表
      Chart = echarts.init(canvas, null, {
        width: width,
        height: height
      });
      this.setOption();
      // 注意这里一定要返回 chart 实例，否则会影响事件处理等
      return Chart;
    });
  },
  setOption: function() {
    Chart.clear();  // 清除
    Chart.setOption(this.getOption());  //获取新数据
  },
  getOption: function () {
    // 指定图表的配置项和数据
    var option = {
      xAxis: { 
        type: 'category',
        data: xData,
        axisLabel: {
          interval: interval_array[current_index],
          formatter: function(value, index) {

            let substr = String(value)
            let y_str = substr.substring(0,4)
            let m_str = substr.substring(4,6)
            let d_str = substr.substring(6,8)
          if (current_index == 0){

              return String(Number(m_str)) + "-" + String(Number(d_str))
            }else if (current_index == 1){
              return String(Number(y_str)) + "-" + String(Number(m_str))
            }else{
              return y_str
            }
          }
        }
      },
      yAxis: {
        type: 'value',
        name: '(%)',
        min: min_array[current_index], // 最小值 
        max: max_array[current_index],

      },
      series: [{
        data: yData,
        type: 'line',

        // yAxisIndex: 1,
        // smooth: false //面积图是否改成弧形状
        lineStyle: {
          width: 1.0, //外边线宽度
          color: "rgb(44,100,217,1)", //外边线颜色
        },
        showSymbol: false, //去除面积图节点圆
        areaStyle: {
          //区域填充渐变颜色
          color: {
            type: "linear",
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              {
                offset: 0,
                color: "rgba(100,150,250, 1.0)", //0%处颜色
              },
              {
                offset: 1,
                color: "rgba(40,90,240, 1)", //100%处颜色
              },
            ],
          },
        },
      }]
      
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
      path: '/pages/bond_y10/index',
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
      query: '/pages/bond_y10/index',
      imageUrl: '../../images/icon.png'
    }
  },
})
