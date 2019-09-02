import handsontable from 'handsontable'
// 工数不同状态表格样式
function noneCellRenderer(instance, td, row, col, prop, value, cellProperties) {
  handsontable.renderers.TextRenderer.apply(this, arguments)
}

function checkingCellRenderer(instance, td, row, col, prop, value, cellProperties) {
  handsontable.renderers.TextRenderer.apply(this, arguments)
  td.style.background = '#85ce61'
  td.style.color = '#fff'
  td.style['box-sizing'] = 'border-box'
}

function issueCellRenderer(instance, td, row, col, prop, value, cellProperties) {
  handsontable.renderers.TextRenderer.apply(this, arguments)
  td.style.background = '#d73a4a'
  td.style.color = '#fff'
  td.style['box-sizing'] = 'border-box'
}

function acceptCellRenderer(instance, td, row, col, prop, value, cellProperties) {
  handsontable.renderers.TextRenderer.apply(this, arguments)
  td.style.background = '#7057ff'
  td.style.color = '#fff'
  td.style['box-sizing'] = 'border-box'
}

handsontable.renderers.registerRenderer('noneCellRenderer', noneCellRenderer)
handsontable.renderers.registerRenderer('checkingCellRenderer', checkingCellRenderer)
handsontable.renderers.registerRenderer('issueCellRenderer', issueCellRenderer)
handsontable.renderers.registerRenderer('acceptCellRenderer', acceptCellRenderer)

export function customCommentRenderer(instance, td, row, col, prop, value, cellProperties) {
  let div = null

  div = document.createElement('div')
  div.style = 'max-height: 100%;overflow-y: auto;overflow-x:hidden;text-align:left;'
  div.innerText = value

  Handsontable.dom.empty(td)
  td.appendChild(div)

  return td
}
export function costRenderer(instance, td, row, col, prop, value, cellProperties) { // 自定义工数表格样式
  const sourceDataRowIndex = cellProperties.row

  const data = instance.getSourceData()
  if (data.length === 0) {
    return td
  }
  let rowData = data[sourceDataRowIndex]
  const propArr = prop.split('.')
  const propArrLen = propArr.length - 1
  for (let i = 0; i < propArrLen; i++) {
    const key = propArr[i]
    rowData = rowData[key]
  }
  const issueStatus = rowData.issue_status
  handsontable.renderers.TextRenderer.apply(this, arguments)
  switch (issueStatus) {
    case '打开': // 指摘+
      td.style.backgroundColor = '#FFCCCC' // FFFFCC
      break

    case '已确认': // 指摘回复完了，已确认
      td.style.backgroundColor = '#CCFFCC' // CCFFCC
      break

      // case '关闭': //曾经被指摘
      //   td.style.backgroundColor = '#7057ff'
      //   break

    default:
      break
  }
  return td
}
export function cells(row, col) { // 全局表格样式
  const cellProperties = {}
  const data = this.instance.getSourceData()
  if (data.length === 0) {
    return cellProperties
  }
  const colProp = this.instance.colToProp(col)

  if (typeof colProp === 'number') {
    // 有bug, 渲染在添加nestedHeaders之前
    return cellProperties
  }
  const splitArr = colProp.split('.')
  const splitArrLen = splitArr.length - 1
  if (splitArr[splitArrLen] === 'days') {
    let value = data[row]
    for (let i = 0; i < splitArrLen; i++) {
      const key = splitArr[i]
      value = value[key]
    }
    switch (value.issue_status) {
      case 'none': // 从来没有被指摘
        cellProperties.renderer = 'noneCellRenderer'
        break

      case '打开': // 指摘
        cellProperties.renderer = 'issueCellRenderer'
        break

      case '已确认': // 指摘回复完了，等待确认
        cellProperties.renderer = 'checkingCellRenderer'
        break

      case '关闭': // 曾经被指摘
        cellProperties.renderer = 'acceptCellRenderer'
        break

      default:
        cellProperties.renderer = 'noneCellRenderer'
        break
    }
  }
  return cellProperties
}
var handleHotBeforeOnCellMouseDown = function(event, coords, element) {
  if (coords.row < 0) {
    // 禁止表头事件
    event.stopImmediatePropagation()
  }
}
handsontable.hooks.add('beforeOnCellMouseDown', handleHotBeforeOnCellMouseDown)

export const Handsontable = handsontable
