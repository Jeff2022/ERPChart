// app.js
App({
  data: {
    title: '投资数说',
  },
  onLaunch: function () {
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力');
    } else {
      wx.cloud.init({
        // env 参数说明：
        //   env 参数决定接下来小程序发起的云开发调用（wx.cloud.xxx）会默认请求到哪个云环境的资源
        //   此处请填入环境 ID, 环境 ID 可打开云控制台查看
        //   如不填则使用默认环境（第一个创建的环境）
        // env: 'my-env-id',
        traceUser: true,
      });
    }

    this.globalData = {};
  },
  // onShareAppMessage: function (res) {// 分享
  //   if (res.from === 'button') {
  //     // 来自页面内转发按钮
  //     //console.log("转发：" + JSON.stringify(res.target))
  //   }
  //   return { 
  //     title: this.data.goodsInfo.goodsName,
  //     path: '/pages/order/detail/detail?goodsId=' + this.data.goodsInfo.id ,
  //     success: function (res) {
  //       //console.log('/pages/order/detail/detail?goodsId=' + this.data.goodsInfo.id )
  //       // 转发成功
  //       //console.log("转发成功:" + JSON.stringify(res));
  //     },
  //     fail: function (res) {
  //       // 转发失败
  //       //console.log("转发失败:" + JSON.stringify(res));
  //     }
  //   }
  // },
});
