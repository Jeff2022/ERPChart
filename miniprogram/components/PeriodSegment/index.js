// components/PeriodSegment/index.js


const timeNormalColor = "#666666";
const timeSelectedColor = "#ffffff";
const timeBgNormalColor = "#ffffff";
const timeBgSelectedColor = "#4090FE";

Component({
  /**
   * Component properties
   */
  properties: {

  },

  /**
   * Component initial data
   */
  data: {
    // 好像width只有在style中调转才有效？？
    timeButtonWidth: "115rpx",
    btn_index: -1,

    timeColor1: timeNormalColor,
    timeColor2: timeNormalColor,
    timeColor3: timeNormalColor,
    timeBgColor1: timeBgNormalColor,
    timeBgColor2: timeBgNormalColor,
    timeBgColor3: timeBgNormalColor,
  
  },
 

  /**
   * Component methods
   */
  methods: {
    onTapped: function(index) {
      this.btn_index = index

      var myEventDetail = {"index": index} // detail对象，提供给事件监听函数
      var myEventOption = {} // 触发事件的选项
      this.triggerEvent('periodSeg_event', myEventDetail, myEventOption)
    },

    init_status: function() {
      this.btn_index = 0

      this.setData({timeColor1: timeSelectedColor})
      this.setData({timeColor2: timeNormalColor})
      this.setData({timeColor3: timeNormalColor})
  
      this.setData({timeBgColor1: timeBgSelectedColor})
      this.setData({timeBgColor2: timeBgNormalColor})
      this.setData({timeBgColor3: timeBgNormalColor})
    },

    timeTap1: function() {
      if (this.btn_index == 0) {
        return
      }
      this.onTapped(0)

      this.setData({timeColor1: timeSelectedColor})
      this.setData({timeColor2: timeNormalColor})
      this.setData({timeColor3: timeNormalColor})
  
      this.setData({timeBgColor1: timeBgSelectedColor})
      this.setData({timeBgColor2: timeBgNormalColor})
      this.setData({timeBgColor3: timeBgNormalColor})
    },
    timeTap2: function() {
      if (this.btn_index == 1){
        return
      }
      this.onTapped(1)

      this.setData({timeColor1: timeNormalColor})
      this.setData({timeColor2: timeSelectedColor})
      this.setData({timeColor3: timeNormalColor})
  
      this.setData({timeBgColor1: timeBgNormalColor})
      this.setData({timeBgColor2: timeBgSelectedColor})
      this.setData({timeBgColor3: timeBgNormalColor})
    },
    timeTap3: function() {
      if (this.btn_index == 2){
        return
      }
      this.onTapped(2)

      this.setData({timeColor1: timeNormalColor})
      this.setData({timeColor2: timeNormalColor})
      this.setData({timeColor3: timeSelectedColor})
  
      this.setData({timeBgColor1: timeBgNormalColor})
      this.setData({timeBgColor2: timeBgNormalColor})
      this.setData({timeBgColor3: timeBgSelectedColor})
    },
  }
})
