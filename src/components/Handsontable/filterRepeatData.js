
export function filterRepeatData(data) {
  const cellArr = []
  for (const item of data) {
    const minRow = Math.min(item[0], item[2])
    const maxRow = Math.max(item[0], item[2])
    const minCol = Math.min(item[1], item[3])
    const maxCol = Math.max(item[1], item[3])
    for (let i = minRow; i <= maxRow; i++) {
      for (let j = minCol; j <= maxCol; j++) {
        cellArr.push(i + ',' + j)
      }
    }
  }
  const arrAfterFilter = [...new Set(cellArr)]

  return arrAfterFilter
}
