// 小程序全局应用配置 / Global App Configuration

App({
  onLaunch() {
    // 小程序启动时执行 / Execute when mini-app launches
    console.log('小程序启动 / Mini-app launched');
    this.initCloudDatabase();
  },
  
  initCloudDatabase() {
    // 初始化微信云开发 / Initialize WeChat Cloud Development
    // 如果使用云开发，在这里配置
    if (!wx.cloud) {
      console.warn('请启用微信云开发 / Please enable WeChat Cloud Development');
    } else {
      wx.cloud.init({
        env: 'your-env-id', // 替换为你的环境ID / Replace with your environment ID
        traceUser: true
      });
    }
  },
  
  // 全局变量 / Global variables
  globalData: {
    userInfo: null,
    apiBaseUrl: 'http://localhost:5000/api', // 后端API地址 / Backend API URL
    stats: {
      totalDistance: 0,
      totalRuns: 0,
      cities: 0,
      marathons: 0,
      marathonPB: null,
      itraScore: 0
    },
    cities: []
  },
  
  // 工具函数 / Utility functions
  request(url, method = 'GET', data = null) {
    return new Promise((resolve, reject) => {
      wx.request({
        url: url,
        method: method,
        data: data,
        header: {
          'content-type': 'application/json'
        },
        success(res) {
          resolve(res.data);
        },
        fail(error) {
          reject(error);
        }
      });
    });
  }
});
