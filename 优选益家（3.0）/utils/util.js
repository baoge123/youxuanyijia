const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}
function getImgWidth(padding, margin, length) {
  var result = null;
  wx.getSystemInfo({
    success: function (res) {
      result = (res.windowWidth - padding - margin) / length;
    }
  });
  return result;
}

module.exports = {
  formatTime: formatTime,
  getImgWidth: getImgWidth
}
