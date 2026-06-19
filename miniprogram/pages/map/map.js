// pages/map/map.js
// 地图页面 - 展示跑过的城市 / Map page - Display cities visited

const app = getApp();

Page({
  data: {
    latitude: 39.904,
    longitude: 116.407,
    scale: 5,
    markers: [],
    loading: true,
    username: ''
  },

  onLoad() {
    // 页面加载时执行 / Execute when page loads
    this.loadCitiesData();
  },

  loadCitiesData() {
    // 加载城市数据 / Load cities data
    this.setData({ loading: true });

    const username = wx.getStorageSync('username');
    if (!username) {
      this.setData({ loading: false });
      wx.showToast({
        title: '请先导入数据 / Please import data first',
        icon: 'none'
      });
      return;
    }

    // 从后端API获取城市数据 / Fetch cities from backend API
    const apiUrl = `${app.globalData.apiBaseUrl}/cities/${username}`;

    app.request(apiUrl)
      .then(response => {
        if (response.success && response.data) {
          const cities = response.data;
          const markers = cities.map((city, index) => ({
            id: index,
            latitude: city.latitude,
            longitude: city.longitude,
            title: city.name,
            iconPath: '/images/marker.png',
            width: 32,
            height: 32,
            callout: {
              content: `${city.name} (${city.runs_count}次)`,
              display: 'ALWAYS',
              textAlign: 'center',
              fontSize: 12
            }
          }));

          this.setData({
            markers: markers,
            username: username,
            loading: false
          });
        } else {
          wx.showToast({
            title: '加载失败 / Failed to load',
            icon: 'none'
          });
          this.setData({ loading: false });
        }
      })
      .catch(err => {
        console.error('API error:', err);
        wx.showToast({
          title: '网络错误 / Network error',
          icon: 'none'
        });
        this.setData({ loading: false });
      });
  },

  onMarkerTap(event) {
    // 点击标记时执行 / Execute when marker is tapped
    console.log('Marker tapped:', event.detail);
  }
});
