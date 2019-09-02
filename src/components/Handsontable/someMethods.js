export function getTaskIndex(taskList, rowData) { // 获得task index
  for (let i = 0; i < taskList.length; i++) {
    const taskValue = taskList[i]
    if (rowData[taskValue] !== '' && rowData[taskValue] != null) {
      return i
    }
  }
}

export function getPrimedColPropList(data) { // 处理数据，返回预处理的列表头数据，用来下一步计算
  const colPropList = [
    // ['sub1', 'sub2', 'task1', 'task2'],
    // ['options1', 'options2'],
    // ['guide', 'navi'],
    // ['option1', 'option2', 'option3']
  ]
  colPropList[0] = data.func_task_list.map(item => {
    return item
  })

  colPropList[1] = data.option_list
  colPropList[2] = data.cost_list
  return colPropList // 返回一个预处理过的list
}

export function getDynamicColPropList(colPropList) { // 获得表头展示数据（不是固定列的部分）
  const dynamicColPropList = []
  switch (colPropList.length) {
    case 3: // 工数汇总表
      for (let i = 0; i < colPropList[1].length; i++) {
        for (let j = 0; j < colPropList[2].length; j++) {
          const item =
                        colPropList[1][i] + '.' + colPropList[2][j]
          dynamicColPropList.push(item)
        }
      }
      break

    default: // 工数报价填写表
      for (let i = 0; i < colPropList[1].length; i++) {
        for (let j = 0; j < colPropList[2].length; j++) {
          for (let k = 0; k < colPropList[3].length; k++) {
            const item =
                            colPropList[1][i] + '.' + colPropList[2][j] + '.' + colPropList[3][k]
            dynamicColPropList.push(item)
          }
        }
      }
      break
  }

  return dynamicColPropList
}

export function getDetailDynamicColPropList(colPropList) { // detail表格 :获得表头展示数据（不是固定列的部分）
  const dynamicColPropList = []
  for (let i = 0; i < colPropList[1].length; i++) {
    const tempArr = colPropList[2][i]
    for (const item of tempArr) {
      for (let k = 0; k < colPropList[3].length; k++) {
        const prop = colPropList[1][i] + '.' + item + '.' + colPropList[3][k]
        // console.log(prop)
        dynamicColPropList.push(prop)
      }
    }
  }

  return dynamicColPropList
}

export function clearRepeatData(funcTaskLen, quoteLen, funcTaskList, quoteList) {
  for (let i = quoteLen; i > 0; i--) { // 将数据结构整理成树状结构(重复的数据清空)
    // 合并category重复数据
    const categoryName = 'category_name'
    if (quoteList[i][categoryName] === quoteList[i - 1][categoryName]) {
      quoteList[i][categoryName] = ''
    }

    // 合并sub task重复数据
    for (let j = 0; j < funcTaskLen; j++) {
      const param = funcTaskList[j]
      if (quoteList[i - 1][param] === null) {
        break
      }

      if (quoteList[i][param] === quoteList[i - 1][param]) {
        quoteList[i][param] = ''
      } else {
        break
      }
    }
  }
  return quoteList
}

export function getUrlHrefParams() { // 获得浏览器url中的参数
  const href = window.location.href
  const args = href.split('?')
  if (args[0] === href) {
    return ''
  }

  const arr = args[1].split('&')
  const obj = {}
  for (const item of arr) {
    const arg = item.split('=')
    obj[arg[0]] = arg[1]
  }
  return obj
}

// export function calculateFeatureManHour(quoteList, optionList ,groupList) {
//     let featureIndexList = []
//     const param = 'sub1'
//     const quoteLen = quoteList.length
//     //获得最高一级feature索引
//     for(let i = 0; i < quoteLen; i++) {
//         let featureValue = quoteList[i][param]
//         if(featureValue != '') {
//             featureIndexList.push(i)
//         }
//     }
//     const featureIndexLen = featureIndexList.length
//     for(let j = 0; j < featureIndexLen; j++) {
//         let featureIndex = featureIndexList[j]
//         let nextFeatureIndex = featureIndexList[j + 1]
//         // quoteList[featureIndex][param] =
//         let featureHourman = 0
//         for(let k = featureIndex; k < nextFeatureIndex; k++) {
//             featureHourman += feature
//             for(let item) {

//             }
//         }
//     }
// }

export function checkNumber(val) { // 检测是否符合day填写规范，因为填写时删除 值会变为''
  var regPos = /^[0-9]+$/ // 整数
  var regNeg = /^[0-9]+\.?[0-9]+?$/ // 小整数
  if (regPos.test(val) || regNeg.test(val) || val === null || val === '') {
    return true
  } else {
    return false
  }
}

export function checkIsEmpty(val) { // 检测是否符合day填写规范，因为填写时删除 值会变为''
  if (val !== '' && val !== null && val !== undefined) {
    return false
  }
  return true
}

// 扁平化数据
// function transferTreeToFlat(data) {
//     let tmpObj = {}
//     for(let item of data) {
//         console.log(item.sub.length)
//         if(item.sub.length != 0) {
//             tmpObj = Object.assign(tmpObj, transferTreeToFlat(item.sub))
//         }
//         tmpObj[item.group_name] = item.group_id
//     }
//     return tmpObj
// }

export function checkAnthor(superGroupName, groupName, ownGroupList) {
  if (checkIsEmpty(groupName)) { // 小组为空
    if (ownGroupList.hasOwnProperty(superGroupName)) { // 直接用大组名进行权限判断
      return true
    }
  } else { // 小组不为空
    if (ownGroupList.hasOwnProperty(groupName)) { // 小组名进行权限判断0-+*8784
      return true
    }
  }
  return false
}
