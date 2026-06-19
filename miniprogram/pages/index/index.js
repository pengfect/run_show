// pages/index/index.js
// 主页 - 展示跑步统计信息 / Home page - Display running statistics

const app = getApp();

Page({
  data: {
    stats: {
      totalDistance: 0,
      totalRuns: 0,
      cities: 0,
      marathons: 0,
      marathonPB: '--:--:--',
      itraScore: 0
    },
    loading: true,
    username: ''
  },

  onLoad() {
    // 页面加载时执行 / Execute when page loads
    this.loadStats();
  },

  onShow() {
    // 页面展示时执行 / Execute when page shows
    this.loadStats();
  },

  loadStats() {
    // 从本地存储加载数据或从后端API获取 / Load data from storage or backend API
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

    // 尝试从本地存储读取数据 / Try to load from local storage
    const cachedStats = wx.getStorageSync(`stats_${username}`);
    if (cachedStats) {
      this.setData({
        stats: cachedStats,
        username: username,
        loading: false
      });
    } else {
      // 从后端API获取数据 / Fetch from backend API
      this.fetchStatsFromAPI(username);
    }
  },

  fetchStatsFromAPI(username) {
    // 从后端获取统计数据 / Fetch stats from backend
    const apiUrl = `${app.globalData.apiBaseUrl}/stats/${username}`;

    app.request(apiUrl)
      .then(response => {
        if (response.success) {
          const userData = response.data;
          const stats = userData.data.stats;

          // 格式化PB时间 / Format PB time
          const marathonPB = stats.marathon_pb ? this.formatTime(stats.marathon_pb) : '--:--:--';

          const formattedStats = {
            totalDistance: (stats.total_distance || 0).toFixed(1),
            totalRuns: stats.total_runs || 0,
            cities: stats.cities || 0,
            marathons: stats.marathons || 0,
            marathonPB: marathonPB,
            itraScore: stats.itra_score || 0
          };

          this.setData({
            stats: formattedStats,
            username: username,
            loading: false
          });

          // 缓存数据 / Cache the data
          wx.setStorageSync(`stats_${username}`, formattedStats);
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

  formatTime(seconds) {
    // 格式化秒数为 HH:MM:SS / Format seconds to HH:MM:SS
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  },

  refreshData() {
    // 刷新数据 / Refresh data
    wx.showLoading({ title: '加载中... / Loading...' });
    setTimeout(() => {
      this.loadStats();
      wx.hideLoading();
    }, 1000);
  }
});
