// pages/import/import.js
// 数据导入页面 / Import page - Import data from Digital Zhixin

const app = getApp();

Page({
  data: {
    username: '',
    password: '',
    importing: false,
    importResult: null
  },

  onLoad() {
    // 页面加载时执行 / Execute when page loads
    const savedUsername = wx.getStorageSync('username');
    if (savedUsername) {
      this.setData({ username: savedUsername });
    }
  },

  onUsernameChange(event) {
    // 用户名输入变化 / Handle username input change
    this.setData({ username: event.detail.value });
  },

  onPasswordChange(event) {
    // 密码输入变化 / Handle password input change
    this.setData({ password: event.detail.value });
  },

  importData() {
    // 导入数据 / Import data from backend
    const { username, password } = this.data;

    if (!username || !password) {
      wx.showToast({
        title: '请输入用户名和密码 / Please enter username and password',
        icon: 'none'
      });
      return;
    }

    this.setData({ importing: true });
    wx.showLoading({ title: '导入中... / Importing...' });

    const apiUrl = `${app.globalData.apiBaseUrl}/scrape`;
    const requestData = {
      username: username,
      password: password
    };

    app.request(apiUrl, 'POST', requestData)
      .then(response => {
        wx.hideLoading();

        if (response.success) {
          // 保存用户名到本地存储 / Save username to storage
          wx.setStorageSync('username', username);
          wx.setStorageSync('lastImportTime', new Date().toISOString());

          this.setData({
            importing: false,
            importResult: {
              success: true,
              message: response.message
            }
          });

          wx.showToast({
            title: '导入成功 / Import successful',
            icon: 'success'
          });

          // 2秒后返回首页 / Navigate to home after 2 seconds
          setTimeout(() => {
            wx.switchTab({
              url: '/pages/index/index'
            });
          }, 2000);
        } else {
          this.setData({
            importing: false,
            importResult: {
              success: false,
              message: response.message
            }
          });

          wx.showToast({
            title: response.message || '导入失败 / Import failed',
            icon: 'none'
          });
        }
      })
      .catch(err => {
        wx.hideLoading();
        console.error('Import error:', err);

        this.setData({
          importing: false,
          importResult: {
            success: false,
            message: '网络错误 / Network error'
          }
        });

        wx.showToast({
          title: '网络错误 / Network error',
          icon: 'none'
        });
      });
  },

  clearResult() {
    // 清除结果显示 / Clear result display
    this.setData({ importResult: null });
  }
});
