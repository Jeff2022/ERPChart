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



function calculate_recent_data (yData_all, xData_all, years) {
  var yData = []
  var xData = []

  var n = 0
  let len = xData_all.length
  let last_day = xData_all[len-1]
  let a_year = last_day.substr(0,4)
  let a_month = last_day.substr(4,2)
  let a_day = last_day.substr(6,2)

  let dest_year = String(Number(a_year) - years)
  let dest_month = a_month

  console.log(dest_year)
  console.log(dest_month)

  n = 200 * years
  var y_str = ''
  var m_str = ''
  var d_str = ''
  var interval_days = -1 // 通过这个相距天数,来定位最近的那一天
  let d_now = Number(a_day)

  while (n < len) {
    var day_str = xData_all[len-n]
    
    y_str = day_str.substr(0,4)
    if (y_str != dest_year) {
      n++
      continue
    }
    
    m_str = day_str.substr(4,2)
    if (m_str != dest_month) {
      n++
      continue
    }

    d_str = day_str.substr(6,2)
    if (d_str == a_day) {
      break
    }
    
    interval_days = Number(d_str) - d_now
    if (interval_days > 0) {
      n++
      //往前一个，是上一个月或年，则就以此日期返回
      if(xData_all[len-n].substr(4,2) != dest_month) {
        break
      }else if(xData_all[len-n].substr(0,4) != dest_year) {
        break
      }
      continue
    }else{
      break
    }
  }

  console.log('n:',n)
  console.log(xData_all[n])

  var m = 0
  while (m < n) {
    yData.push(yData_all[len-n+m])
    xData.push(xData_all[len-n+m])
    m++
  }
  return {"y": yData, "x": xData}
}

function calculate_recent_month (yData_all, xData_all) {
  var yData = []
  var xData = []

  var n = 10
  let len = xData_all.length
  let last_day = xData_all[len-1]
  let a_month = last_day.substr(4,2)
  let a_day = last_day.substr(6,2)

  var d_str = ''
  var m_str = ''
  let d_now = Number(a_day)

  while (n < 31) {
    var day_str = xData_all[len-n]
  
    m_str = day_str.substr(4,2)
    if (m_str == a_month) {
      n++
      continue
    }

    d_str = day_str.substr(6,2)
    if (d_str == a_day) {
      break
    }
    if (Number(d_str) <= d_now) {
      break
    }
    
    n++
  }

  console.log('前一个月起始日：',xData_all[len-n])

  var m = 0
  while (m < n) {
    yData.push(yData_all[len-n+m])
    xData.push(xData_all[len-n+m])
    m++
  }
  return {"y": yData, "x": xData}
}

module.exports = {
  formatTime: formatTime,
  calculate_recent_data: calculate_recent_data,
  calculate_recent_month: calculate_recent_month
}
