export function hiddenManHourCount() {
  // 隐藏工数总和统计方法
  const manHourCountDom = document.getElementsByClassName('man-hour-sum')[0]
  const cssData = 'display: none;'
  manHourCountDom.style = cssData
}
export function showManHourCount(td) {
  const manHourCountDom = document.getElementsByClassName('man-hour-sum')[0]
  const leftInstance = 'left: ' + Number(td.getClientRects()[0].right) + 'px;'
  const topInstance = 'top: ' + Number(td.getClientRects()[0].top) + 'px;'
  const cssData =
        'display: inline-block;position: fixed; width: 150px; height: 70px;z-index: 2000; font-size: 12px;' +
        leftInstance +
        topInstance
  manHourCountDom.style = cssData
}
export function isShowManHourCount(manHourSum) {
  if (manHourSum !== 0) {
    return true
  }
  return false
}
