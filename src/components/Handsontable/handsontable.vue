<template>
  <div
    v-loading.fullscreen.lock="fullscreeLoading"
    class="container"
    element-loading-text="拼命加载中"
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(0, 0, 0, 0.8)"
  >
    <project-detail :titles="title" />
    <statistics-table v-show="flagToShowStatisticsTable" :option-list="optionList" :statistics-data="statisticsData" />
    <div class="btn-switch">
      <div style="display: inline-block;margin-right: 10px;">
        工数单位:
        <el-select
          v-model="value"
          placeholder="请选择"
          size="small"
          style="width: 100px;"
          @change="switchDaysUnit"
        >
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </div>
      <div style="display: inline-block;margin-right: 10px;">
        <el-select v-model="quoteType" placeholder="请选择" size="small" style="width: 100px;" @change="switchType">
          <el-option
            v-for="item in costOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
        <el-switch v-model="quoteType" active-text="我的" inactive-text="全部" />
      </div>
      <el-button type="success" size="mini" @click="showStatisticsTable()">显示统计</el-button>
      <el-button type="success" size="mini" disabled @click="save">保存</el-button>
    </div>

    <div id="example-container" class="handsontable-wrapper">
      <HotTable v-if="showTable" ref="textHot" :root="root" :settings="hotSettings" />
    </div>

    <!-- 履历 -->
    <div class="shadow" @mousedown.stop>
      <i class="el-icon-d-arrow-right" @click="hide_shadow()" />
      <div v-loading="taskRecordLoading" style="position: absolute; top: 0px; bottom: 0; left: 44px; right: 0px;">
        <task-record :task-record-list="taskRecordList" :task-record-title="taskRecordTitle" />
      </div>

    </div>
    <!-- 指摘弹窗 -->
    <point-dialog v-show="pointVisible" :point-visible.sync="pointVisible" :selected-cell="selectedCell" :base-id="baseId" :quotation-id="quotationId" @setDaysStatus="setDaysCellStyle" />
    <!-- 工数统计弹窗 -->
    <man-day-dialog v-show="manDayVisible" :selected-area="selectedArea" :dialog-width="200" :dialog-height="100">
      <p>
        <span>选中区域的总工数:</span>
        <span>{{ manDaySum }}</span>
      </p>
      <p>
        <span>选中区域的已填写工数:</span>
        <span>{{ manDayNum }}</span>
      </p>
    </man-day-dialog>
  </div>
</template>
<script>
import '../../../node_modules/handsontable/dist/handsontable.full.css'
import basicSettings from './basicSettings'
import PointDialog from './pointDialog' // 指摘组件
import ManDayDialog from './manDayDialog'
import TaskRecord from '@/components/TaskRecord' // 履历组件
import ProjectDetail from '@/components/Title'
import StatisticsTable from '@/components/StatisticsTable'
import { customCommentRenderer, costRenderer } from './cellStyle' // 工数表格样式
import { HotTable } from '@handsontable/vue'
import { Message, MessageBox } from 'element-ui' // element UI
import 'handsontable/languages/zh-CN' // 中文包
// require('@/assets/js/jquery-1.8.3.min.js')
// import $ from 'jquery'
import {
  reqAllQuotations,
  reqMyQuotations,
  setQuotationList,
  // reqTaskHistory,
  reqGroupList,
  getMyGroupList
} from '@/api/handsontable.js' // 请求接口方法

import { filterRepeatData } from './filterRepeatData' // 剔除重复表格数据
import { issue } from './contextMenu' // 右键功能方法
import { getPrimedColPropList, getDynamicColPropList, checkNumber, checkIsEmpty } from './someMethods' // 整理数据方法
export default {
  name: 'QuoteTable',
  components: {
    HotTable,
    PointDialog,
    TaskRecord,
    ManDayDialog,
    ProjectDetail,
    StatisticsTable
  },
  data: function() {
    return {
      showMessageFlag: false,
      fullscreeLoading: false,
      taskRecordLoading: false,
      projId: '',
      quotationId: 0,
      showTable: false,
      selectOptionsData: {},
      headersData: [],
      root: 'test-hot',
      hotSettings: {
        data: [], // 表格总数据
        colHeaders: [], // 自定义列表头or 布尔值
        className: 'htLeft',
        contextMenu: {
          // 自定义右键菜单，可汉化，默认布尔值
          items: {
            'row_below': {
              name: '拆分Task'
            },
            'remove_row': {
              name: '删除行'
            }
          }
        }
      },
      manDaySum: 0,
      manDayNum: 0,
      funcTaskList: [],
      costList: [],
      groupList: [],
      optionList: [],

      pointVisible: false,
      manDayVisible: false,
      baseId: 0,
      row: null,
      col: null,
      activePointArrow: '',
      selectedCell: {
        width: null,
        height: null,
        top: null,
        left: null
      },
      selectedArea: {
        width: null,
        height: null,
        top: null,
        left: null
      },
      colProp: [],

      // task履历
      taskRecordList: [],
      taskRecordTitle: '',
      pointList: [],

      deleteList: [],
      title: {
        projName: '',
        quotationName: '',
        version: ''
      },

      quoteType: true, // 我的:true 全部:false,
      switchNum: 0,
      tempColumns: [],

      options: [
        {
          value: 'day',
          label: '人/日'
        },
        {
          value: 'month',
          label: '人/月'
        }
      ],
      value: 'month',
      costOptions: [
        {
          value: true,
          label: '我的'
        },
        {
          value: false,
          label: '全部'
        }
      ],
      myGroupList: [], // 我的组数据（请求过来的）
      flatGroupList: {}, // 扁平化 我的组 数据
      costSumObj: {},
      statisticsData: [],
      flagToShowStatisticsTable: false,
      newTaskGroup: {}
    }
  },
  watch: {},
  created() {
    const that = this
    this.fullscreeLoading = true
    this.hotSettings = Object.assign(this.hotSettings, basicSettings)
    const promiseForGetMyGroup = new Promise((resolve, reject) => {
      getMyGroupList().then(res => {
        resolve(res.data.content)
      }).catch(() => {
        reject()
      })
    })
    const promiseForGetGroup = new Promise((resolve, reject) => {
      reqGroupList().then(res => {
        if (res.data.result === 'OK') {
          resolve(res.data.content)
        } else {
          reject()
        }
      })
    })

    Promise.all([promiseForGetMyGroup, promiseForGetGroup]).then(res => {
      const myGroupList = res[0]
      const superGroupList = res[1]
      this.myGroupList = res[0]
      this.superGroupList = res[1]
      function getNewTaskGroup(superGroupList, myGroupList) {
        const tmpObj = {}
        for (const item of superGroupList) {
          if (myGroupList[0]['group_name'] === item['group_name']) {
            tmpObj.superGroup = myGroupList[0]['group_name']
            tmpObj.group = ''
            break
          } else {
            for (const subItem of item.sub) {
              if (myGroupList[0]['group_name'] === subItem['group_name']) {
                tmpObj.superGroup = item['group_name']
                tmpObj.group = subItem['group_name']
                return tmpObj
              }
            }
          }
        }
      }
      function transferTreeToFlat(data) {
        const tmpObj = {}
        for (const superGroupItem of myGroupList) {
          tmpObj[superGroupItem['group_name']] = superGroupItem['group_id']
          for (const groupItem of superGroupItem.sub) {
            tmpObj[groupItem['group_name']] = groupItem['group_id']
          }
        }
        return tmpObj
      }
      if (myGroupList[0].sub.length === 0) {
        this.newTaskGroup = getNewTaskGroup(superGroupList, myGroupList)
      } else {
        this.newTaskGroup.superGroup = myGroupList[0]['group_name']
        this.newTaskGroup.group = myGroupList[0].sub[0]['group_name']
      }

      this.flatGroupList = transferTreeToFlat(myGroupList)
    }).catch(_ => {
      console.log('error')
    })

    this.hotSettings.afterDeselect = function() {
      that.hiddenDialog()
    }

    this.hotSettings.beforeOnCellMouseDown = function(event, coords, td, controller) {
      const trimRowArr = this.getPlugin('filters').trimRowsPlugin.rowsMapper.__arrayMap
      const visualRowIndex = coords.row
      const sourceDataRowIndex = trimRowArr[visualRowIndex]
      const col = coords.col
      const colProp = this.colToProp(col)
      const superGroupValue = this.getDataAtCell(sourceDataRowIndex, col - 1)
      const superGroupList = that.superGroupList
      if (colProp === 'group') {
        for (const item of superGroupList) {
          if (item.group_name === superGroupValue) {
            const groupSource = item.sub.map(groupItem => {
              return groupItem.group_name
            })
            this.setCellMeta(sourceDataRowIndex, col, 'source', groupSource)
            break
          }
        }
      }
    }
    this.hotSettings.beforeChange = function(arr, source) {
      const trimRowArr = this.getPlugin('filters').trimRowsPlugin.rowsMapper.__arrayMap
      for (const item of arr) {
        const visualRowIndex = item[0]
        const sourceDataRowIndex = trimRowArr[visualRowIndex]
        const colProp = item[1]
        const oldValue = item[2]
        const newValue = item[3]
        if (typeof colProp === 'number') { // handsontable BUG
          return
        }
        const tempArr = colProp.split('.')
        const tempArrLen = tempArr.length
        const rowData = that.hotSettings.data[sourceDataRowIndex]
        let tempValue = JSON.parse(JSON.stringify(rowData))
        // 新旧行区分
        if (rowData['task_id'] === 0) { // 新增行

        } else { // 旧数据行:本来就不自己组权限的行不能编辑
        }

        // if (tempArr.length === 2 &&
        //             (tempArr[1] === 'days' || tempArr[1] === 'precondition' || tempArr[1] === 'comment' || tempArr[1] === 'status')) {
        //   Message({
        //     message: '转给其它组的Task,不能填写工数',
        //     type: 'warning',
        //     showClose: true,
        //     duration: 3000
        //   })
        //   return false
        // }

        // 修改Task规则: 所有工数'已提出'和'已承认'状态下,不允许修改task
        if (tempArrLen === 1 && colProp === 'task1') {
          for (const optionItem of that.optionList) {
            if (rowData[optionItem]['status'] === '已提出' || rowData[optionItem]['status'] === '已承认') {
              Message({
                message: '工数‘已提出’和‘已承认’状态下,不能修改Task。请先修改状态,再修改Task。',
                type: 'warning',
                showClose: true,
                duration: 3000
              })
              return false
            }
          }
        }
        // 修改工数规则: 单个option工数'已提出'和'已承认'状态下,不允许修改(Option下的days, precondition,comment)
        if (tempArr.length === 2 && (tempArr[1] === 'days' || tempArr[1] === 'precondition' || tempArr[1] === 'comment')) {
          for (let i = 0; i < tempArrLen - 1; i++) {
            const key = tempArr[i]
            tempValue = tempValue[key]
          }
          const status = tempValue['status']
          if (status === '已提出' || status === '已承认') {
            Message({
              message: '工数‘已提出’和‘已承认’状态下,不允许修改。请先修改状态改，再修改其他值。',
              type: 'warning',
              showClose: true,
              duration: 3000
            })
            return false
          }
        }
        // 修改 （分配大组 分配小组）规则:只有在当前行的后面列全部为空时，才能修改
        if ((colProp === 'superGroup' || colProp === 'group') && (oldValue !== newValue)) {
          for (const optionItem of that.optionList) {
            for (const costItem of that.costList) {
              if (!checkIsEmpty(rowData[optionItem][costItem])) {
                Message({
                  message: '有工数信息的Task,不能指派给其他的组。请先清空cost、preondition、 comment和status,再指派。',
                  type: 'warning',
                  showClose: true,
                  duration: 5000
                })
                return false
              }
            }
          }
        }

        // task、分配大组不能为空
        if ((colProp === 'task1' || colProp === 'superGroup') && checkIsEmpty(newValue)) {
          return false
        }

        // let quoteData = this.getSourceData()
        const quoteData = that.hotSettings.data
        let subGroup = []
        const superGroupList = that.superGroupList
        const superGroup = quoteData[sourceDataRowIndex].superGroup
        if (newValue !== oldValue && colProp === 'group' && newValue !== '') {
          // 如果旧值和新值不一样，更新该行数据action
          for (const superGroupItem of superGroupList) {
            if (superGroupItem.group_name === superGroup) {
              subGroup = superGroupItem.sub
              break
            }
          }
          if (subGroup.length !== 0) {
            for (const subGroupItem of subGroup) {
              if (subGroupItem.group_name === newValue) {
                return
              }
            }
          }
          item[3] = ''
        }
      }
    }

    this.hotSettings.afterChange = function(arr, source) {
      const trimRowArr = this.getPlugin('filters').trimRowsPlugin.rowsMapper.__arrayMap
      if (arr == null) {
        // 防止在loadData的时候报错
      } else {
        for (const item of arr) {
          const visualRowIndex = item[0]
          const sourceDataRowIndex = trimRowArr[visualRowIndex]
          const colProp = item[1]
          const oldValue = item[2]
          const newValue = item[3]
          // let quoteData = this.getSourceData()
          const quoteData = that.hotSettings.data
          if (newValue !== oldValue) {
            // 如果旧值和新值不一样，更新该行数据action
            quoteData[sourceDataRowIndex].action = 'change'
            const colPropArr = colProp.split('.') // 固定列的prop 不同于 后面列的prop
            let prop = null
            if (colPropArr.length === 1) {
              // 固定列的prop
              prop = colProp.split('.')[0]
              if (prop === 'superGroup') {
                const groupCol = this.propToCol(colProp) + 1 // '小组'列的列数
                if (newValue === '') {
                  // 大组删除时，小组也删除
                  this.setDataAtCell(sourceDataRowIndex, groupCol, '') // 设置小组值为空
                } else {
                  // 在大组值变化后，判断小组值是否属于该大组
                  let subGroup = []
                  const superGroupList = that.superGroupList
                  for (const item of superGroupList) {
                    if (item.group_name === newValue) {
                      subGroup = item.sub
                      break
                    }
                  }
                  const groupValue = quoteData[sourceDataRowIndex].group
                  for (const item of subGroup) {
                    if (item.group_name === groupValue) {
                      return
                    }
                  }
                  this.setDataAtCell(sourceDataRowIndex, groupCol, '') // 设置小组值为空
                }
              }
            } else {
              // 后面不固定列的prop
              prop = colProp.split('.')[1]
              if (prop === 'precondition') {
                if (newValue === '') {
                  return // 新值为空，就不能为precondition增加选项
                }
                // 筛选是否有相同的选项
                const hasDiffArr = that.selectOptionsData[prop].filter(item => {
                  return item === newValue
                })
                if (hasDiffArr.length === 0) {
                  // '前提'元格:可以自己手动增加下拉选项
                  that.selectOptionsData[prop].push(newValue)
                }
              }
            }
          }
        }
      }
      const xx = JSON.parse(JSON.stringify(that.hotSettings.data))
      const visualData = that.getVisualData(xx, trimRowArr)
      that.setNestedHeadersDays(visualData)
      if (that.flagToShowStatisticsTable) {
        const tmpData = xx
        that.statisticsData = that.getTaskManHourStatistics(tmpData)
      }
    }
    this.hotSettings.afterFilter = function() {
      const trimRowArr = this.getPlugin('filters').trimRowsPlugin.rowsMapper.__arrayMap
      const source = that.hotSettings.data
      const tmpArr = that.getVisualData(source, trimRowArr)

      that.setNestedHeadersDays(tmpArr)
    }
    /**
         * 右键菜单操作方法
         */
    this.hotSettings.contextMenu.items.remove_row = {
      name: '删除行',
      disabled() {
        const selectedCell = this.getSelected()
        const quoteData = that.hotSettings.data
        const curRowIndex = this.getSelectedLast()[0] // 页面显示行数
        const curRowData = quoteData[curRowIndex] // 当前行数据
        if (typeof selectedCell === 'undefined') { // 限制表头dom事件，导致的错误
          return true
        }
        if (selectedCell.length > 1) {
          // 选中多块区域，不能删除行
          return true
        }
        if (selectedCell[0][0] === selectedCell[0][2]) { // 只能删除一行
          if (curRowData['task_id'] === 0) {
            // task_id为0说明为新增的行，可以直接删除
            return false
          }
          const groupName = curRowData['group']
          const superGroupName = curRowData['superGroup']
          if (checkIsEmpty(groupName)) { // 小组为空，直接用大组名进行权限判断
            return !that.flatGroupList.hasOwnProperty(superGroupName)
          }
          return !that.flatGroupList.hasOwnProperty(groupName) // 大组名进行权限判断0-+*8784
        } else {
          // 不能同时删除多行，(除非都是新增的行:没做)
          return true
        }
      }
    }
    this.hotSettings.contextMenu.items.remove_row.callback = function() {
      const visualRowIndex = this.getSelectedLast()[0]
      that.$confirm('确认移除改行？', '确认信息', {
        distinguishCancelAndClose: true,
        confirmButtonText: '确认',
        cancelButtonText: '取消'
      })
        .then(() => {
          this.alter('remove_row', visualRowIndex)
        })
        .catch(action => {})
    }

    this.hotSettings.beforeRemoveRow = function(index, amount, physicalRows) {
      const quoteData = JSON.parse(JSON.stringify(that.hotSettings.data))
      that.deleteList.push(quoteData[physicalRows])
    }

    this.hotSettings.afterRemoveRow = function() {
      const trimRowArr = this.getPlugin('filters').trimRowsPlugin.rowsMapper.__arrayMap
      const visualData = that.getVisualData(JSON.parse(JSON.stringify(that.hotSettings.data)), trimRowArr)
      that.setNestedHeadersDays(visualData)
      if (that.flagToShowStatisticsTable) {
        const tmpData = JSON.parse(JSON.stringify(that.hotSettings.data))
        that.statisticsData = that.getTaskManHourStatistics(tmpData)
      }
    }

    // this.hotSettings.contextMenu.items.taskRecord = taskRecord
    // this.hotSettings.contextMenu.items.taskRecord.callback = function() {
    //   const trimRowArr = this.getPlugin('filters').trimRowsPlugin.rowsMapper.__arrayMap
    //   const selectedCell = this.getSelected()
    //   const visualRowIndex = selectedCell[0][0]
    //   const sourceDataRowIndex = trimRowArr[visualRowIndex]
    //   const data = that.hotSettings.data

    //   const rowData = data[sourceDataRowIndex]
    //   const taskId = rowData['task_id']
    //   let taskRecordTitle = ''
    //   const taskRecordKey = ['category_name', 'sub1', 'sub2', 'task1']
    //   for (const key of taskRecordKey) {
    //     if (rowData[key]) {
    //       taskRecordTitle += rowData[key] + ' / '
    //     }
    //   }
    //   that.showHistory(taskRecordTitle)
    //   reqTaskHistory(taskId).then(res => {
    //     that.taskRecordList = []
    //     that.taskRecordList = res.data.content
    //     if (that.value === 'month') {
    //       const multiple = 0.05
    //       that.taskRecordList = that.taskRecordList.map(item => {
    //         item.days = item.days * multiple
    //         return item
    //       })
    //     }
    //     that.taskRecordLoading = false
    //   })
    // }
    this.hotSettings.afterCreateRow = function(index, amount, source) {
      let quoteData = that.hotSettings.data
      const sourceData = this.getSourceData()
      const trimRowArr = this.getPlugin('filters').trimRowsPlugin.rowsMapper.__arrayMap
      if (quoteData.length !== sourceData) {
        quoteData = sourceData
      }
      const sourceDataRowIndex = trimRowArr[index - 1]
      const curRowDataIndex = index - 1
      let curRowData = null
      if (trimRowArr !== 0) {
        curRowData = JSON.parse(JSON.stringify(quoteData[sourceDataRowIndex])) // fliter下
      } else {
        curRowData = JSON.parse(JSON.stringify(quoteData[curRowDataIndex])) // 正常情况下
      }

      const funcTaskList = that.funcTaskList
      for (const key in curRowData) {
        // 将上一行的整理（复制处理过的数据，生成新的一行）
        const value = curRowData[key]
        const optionList = that.optionList
        // 处理option列数据（不固定列） ========================== 有问题？ 不知道是不是把option下所有数据清空？？？
        for (const item of optionList) {
          if (key === item) {
            for (const costKey in value) {
              value[costKey] = null
            }
            continue
          }
        }
        const superGroupName = that.newTaskGroup['superGroup']
        const groupName = that.newTaskGroup['group']

        const newTaskName = superGroupName + '_Task'
        switch (key) {
          case 'superGroup':
            curRowData[key] = superGroupName
            break
          case 'group':
            curRowData[key] = groupName
            break
          case 'group_name_list':
            curRowData[key] = []
            break
          case 'action':
            curRowData[key] = ''
            break
          case 'task_id':
            curRowData[key] = 0
            break
          case 'category_name':
            // curRowData[key] = ''
            break
          default:
            break
        }
        funcTaskList.map(_ => {
          // 固定列都变为null
          if (key === 'task1') {
            curRowData[key] = newTaskName
            return
          }
        })
      }

      curRowData['category'] = ''
      curRowData['action'] = 'change'
      quoteData.splice(index, 1, curRowData)
      that.hotSettings.data = quoteData
      const visualData = that.getVisualData(quoteData, trimRowArr)
      that.setNestedHeadersDays(visualData)
      if (that.flagToShowStatisticsTable) {
        const tmpData = JSON.parse(JSON.stringify(quoteData))
        that.statisticsData = that.getTaskManHourStatistics(tmpData)
      }
    }

    this.hotSettings.contextMenu.items.issue = issue // 添加指摘
    this.hotSettings.contextMenu.items.issue.callback = function(key, selection, clickEvent) {
      const trimRowArr = this.getPlugin('filters').trimRowsPlugin.rowsMapper.__arrayMap

      const selectedCell = this.getSelected()
      const visualRowIndex = selectedCell[0][0]
      const col = selectedCell[0][1]
      const sourceDataRowIndex = trimRowArr[visualRowIndex]
      const quotaData = that.hotSettings.data
      const rowData = quotaData[sourceDataRowIndex]
      that.row = sourceDataRowIndex
      that.col = col
      const td = this.getCell(visualRowIndex, col)
      const colProp = this.colToProp(selectedCell[0][1])
      const splitArr = colProp.split('.')
      that.colProp = colProp
      const splitArrLen = splitArr.length - 1
      splitArr.splice(splitArrLen, 1)
      let value = rowData

      for (const key of splitArr) {
        value = value[key]
      }
      const baseIdKey = 'base_id'
      const baseId = value[baseIdKey]

      that.baseId = Number(baseId)
      that.pointVisible = true

      that.selectedCell = Object.assign({}, that.selectedCell, {
        width: Number(td.getClientRects()[0].width),
        height: Number(td.getClientRects()[0].height),
        top: Number(td.getClientRects()[0].top),
        right: Number(td.getClientRects()[0].right)
      })
    }
    this.hotSettings.beforeKeyDown = function(e) {
      // 在最后一行，阻止 ↓ 按键事件
      const rows = this.countRows()
      const selection = this.getSelectedLast()
      if (selection === undefined) { // 如果表格一行数据都没有，selection为undefined
        return
      }
      const currentRow = selection[0]

      if (currentRow + 1 === rows && e.keyCode === 40) {
        e.stopImmediatePropagation()
      }

      if (currentRow === 0 && e.keyCode === 38) {
        e.stopImmediatePropagation()
      }
    }
    this.hotSettings.afterScrollHorizontally = function() {
      that.hiddenDialog()
    }
    this.hotSettings.afterScrollVertically = function() {
      that.hiddenDialog()
    }

    this.hotSettings.afterSelectionEnd = function(row, column, row2, column2, selectionLayerLevel) {
      that.hiddenDialog()
      const colNum = this.getColHeader().length
      if (column2 - column + 1 === colNum) {
        // 默认禁止点击行头事件
        return
      }
      if (row === row2 && column === column2) {
        // case:只选中一个单元格的情况
        that.hiddenDialog()
        return
      }
      // case:多选单元格
      const fixColumnsNum = that.hotSettings.fixedColumnsLeft
      /**
             * 统计选中区域的工数总和、已填写的工数数量
             */
      const selected = this.getSelected()
      const arrAfterFilter = filterRepeatData(selected)

      let manDaySum = 0
      let manDayFilledNum = 0
      manDaySum = arrAfterFilter.reduce((prev, cur) => {
        const curArr = cur.split(',')
        const curRow = curArr[0]
        const curCol = curArr[1]
        const curValue = this.getDataAtCell(curRow, curCol)
        if (typeof curValue === 'number') {
          manDayFilledNum++
          return prev + curValue
        }
        return prev
      }, 0)
      if (manDaySum === 0) {
        return
      }
      that.manDaySum = manDaySum
      that.manDayNum = manDayFilledNum
      let td = null
      // 判断选择cell是从左向右，还是从右向左
      if (column2 > column) {
        // 从左向右
        if (column2 < fixColumnsNum) {
          // 判断最后选择cell是否在固定列中
          return
        }
        // 计算工数
        td = this.getCell(row2, column2)
        that.showManDayDialog(td)
      } else if (column2 < column) {
        // 从右向左
        if (column < fixColumnsNum) {
          // 判断最后选择cell是否在固定列中
          return
        }
        // 计算工数
        td = this.getCell(row, column)
        that.showManDayDialog(td)
      } else {
        // 只选中一列
        if (column < fixColumnsNum) {
          // 判断最后选择cell是否在固定列中
          return
        }
        if (this.getSelected()[0].length > 1) {
          // 选择行大于一行时，开始计算
          if (row > row2) {
            td = this.getCell(row, column)
            that.showManDayDialog(td)
          } else {
            td = this.getCell(row2, column)
            that.showManDayDialog(td)
          }
        }
      }
    }
    this.getMyQuotation()
  },
  mounted() {

  },

  methods: {
    showStatisticsTable() {
      if (!this.flagToShowStatisticsTable) {
        const tmpData = JSON.parse(JSON.stringify(this.hotSettings.data))
        this.statisticsData = this.getTaskManHourStatistics(tmpData)
      }
      this.flagToShowStatisticsTable = !this.flagToShowStatisticsTable
    },
    showManDayDialog(td) {
      this.manDayVisible = true
      this.selectedArea = Object.assign({}, this.selectedArea, {
        width: Number(td.getClientRects()[0].width),
        height: Number(td.getClientRects()[0].height),
        top: Number(td.getClientRects()[0].top),
        right: Number(td.getClientRects()[0].right)
      })
    },
    setBasicConfig(res) {
      const settingsColumns = []
      let settingsData = []
      const nestedHeaders = [[], ['category']]
      let settingFiexedLeftNum = 0

      this.selectOptionsData = res.data.content.select_data // 两个下拉框的选项
      const data = res.data.content

      this.funcTaskList = data.func_task_list // sub、task
      this.costList = data.cost_list // 组下面的选项（days，precondition，comment，status）
      this.optionList = data.option_list // option

      /**
             * 表格列配置
             */
      const colPropList = getPrimedColPropList(data) // 处理数据，返回预处理的列表头数据，用来下一步计算
      const dynamicColPropList = getDynamicColPropList(colPropList) // //获得表头列columns（不是固定列的部分）
      settingFiexedLeftNum = colPropList[0].length + 1 // 固定列数
      settingsColumns.unshift({
        // 手动添加category列，这里可以改进合并进下面代码
        data: 'category_name',
        readOnly: true
      })
      colPropList[0].map(item => {
        // 固定的前几列: task、sub
        let singleColSetting
        switch (item) {
          case '分配大组':
            singleColSetting = {
              data: 'superGroup',
              type: 'dropdown',
              source: this.superGroupList.map(item => {
                return item.group_name
              }),
              visibleRows: 10,
              trimDropdown: true,
              strict: true,
              allowInvalid: false
            }
            break
          case '分配小组':
            singleColSetting = {
              data: 'group',
              type: 'dropdown',
              source: this.superGroupList.reduce((prev, cur) => {
                return prev.concat(
                  cur.sub.map(item => {
                    return item.group_name
                  })
                )
              }, []),
              visibleRows: 10,
              trimDropdown: true,
              strict: true,
              allowInvalid: false
            }
            break
          default:
            singleColSetting = {
              data: item,
              editor: item.indexOf('task') !== -1 ? 'text' : false,
              readOnly: item.indexOf('task') === -1,
              width: 120
            }
            break
        }
        settingsColumns.push(singleColSetting)
      })

      dynamicColPropList.map((item, index) => {
        // options
        const optionProp = item.split('.')[1]
        const singleColSetting = {
          data: item
        }
        switch (optionProp) {
          case 'days':
            singleColSetting.type = 'numeric'
            singleColSetting.renderer = costRenderer
            break
          case 'precondition':
            singleColSetting.type = 'autocomplete'
            singleColSetting.source = this.selectOptionsData[optionProp]
            singleColSetting.visibleRows = 10
            singleColSetting.trimDropdown = true
            break
          case 'status':
            singleColSetting.type = 'dropdown'
            singleColSetting.source = this.selectOptionsData[optionProp]
            singleColSetting.visibleRows = 10
            singleColSetting.trimDropdown = true
            singleColSetting.strict = true
            singleColSetting.allowInvalid = false
            break
          case 'comment':
            singleColSetting.renderer = customCommentRenderer
            break
          default:
            break
        }
        settingsColumns.push(singleColSetting)
      })

      const quoteList = res.data.content.data_list
      // 给大小组 赋值
      if (quoteList.length !== 0) {
        settingsData = quoteList
        for (const item of settingsData) {
          item.superGroup = typeof item.group_name_list[0] === 'undefined' ? '' : item.group_name_list[0]
          item.group = typeof item.group_name_list[1] === 'undefined' ? '' : item.group_name_list[1]
        }
      }

      /**
             * 合并表头list
             */

      // 获得表头第二列数据
      const lenFixedColumns = colPropList[0].length
      nestedHeaders[0].push('Item and Scope')
      for (let i = 0; i < lenFixedColumns; i++) {
        if (colPropList[0][i].indexOf('task') === -1) {
          nestedHeaders[1].push(colPropList[0][i])
        } else {
          nestedHeaders[1].push('Task')
        }
      }
      for (let i = 0; i < colPropList[1].length; i++) {
        for (let j = 0; j < colPropList[2].length; j++) {
          if (colPropList[2][j] === 'days') {
            nestedHeaders[1].push('cost')
          } else {
            nestedHeaders[1].push(colPropList[2][j])
          }
        }
      }
      // 获得表头第一列数据
      for (let i = 0; i < lenFixedColumns; i++) {
        nestedHeaders[0].push('')
      }
      this.costSumObj = {}
      for (let i = 0; i < colPropList[1].length; i++) {
        this.costSumObj[colPropList[1][i]] = 0 // 获得工数统计
      }

      const groupList = this.groupList
      const optionList = this.optionList
      const dayKey = 'days'
      if (this.value === 'month') {
        const multiple = 0.05
        this.transDayForSave(settingsData, multiple, optionList, groupList, dayKey)
      }
      for (const item of settingsData) {
        for (const optionKey of colPropList[1]) {
          const days = item[optionKey][dayKey]
          this.costSumObj[optionKey] = this.costSumObj[optionKey] + days
        }
      }

      for (let i = 0; i < colPropList[1].length; i++) {
        nestedHeaders[0].push({
          label: colPropList[1][i] + '(工数:' + this.costSumObj[colPropList[1][i]] + ')',
          colspan: 4
        })
      }
      for (const item of settingsData) {
        item['oldSuperGroup'] = item['superGroup']
        item['oldGroup'] = item['group']
      }
      this.hotSettings.fixedColumnsLeft = settingFiexedLeftNum // 固定列数
      this.hotSettings.columns = settingsColumns
      this.hotSettings.data = settingsData
      this.hotSettings.nestedHeaders = nestedHeaders
      if (this.flagToShowStatisticsTable) {
        const tmpData = JSON.parse(JSON.stringify(settingsData))
        this.statisticsData = this.getTaskManHourStatistics(tmpData)
      }
    },
    getVisualData(allData, trimRowsArrMap) {
      const visualData = []
      for (const index of trimRowsArrMap) {
        visualData.push(allData[index])
      }
      return visualData
    },
    setNestedHeadersDays(data) {
      const optionList = this.optionList
      const optionListLen = optionList.length
      const nestedHeadersLen = this.hotSettings.nestedHeaders[0].length

      const fixLen = nestedHeadersLen - optionListLen
      const dayKey = 'days'
      const label = 'label'
      // 计算工数统计
      for (const item in this.costSumObj) {
        this.costSumObj[item] = 0
      }
      for (const item of data) {
        for (const optionKey of optionList) {
          const days = item[optionKey][dayKey]
          if (typeof days === 'number') {
            this.costSumObj[optionKey] = this.costSumObj[optionKey] + days
          }
        }
      }
      const costSumObj = this.costSumObj
      // nestedHeaders赋值
      for (let i = 0; i < optionListLen; i++) {
        const index = i + fixLen
        const optionKey = optionList[i]
        this.hotSettings.nestedHeaders[0][index][label] = optionKey + '(工数:' + costSumObj[optionKey] + ')'
      }
    },
    getMyQuotation() {
      const promiseForGetMyQuotations = new Promise((resolve, reject) => {
        reqMyQuotations().then(res => {
          if (res.data.result === 'OK') {
            console.log(res, 'res====---------------')
            this.setQuotationDetail(res)
            resolve(res)
          } else {
            reject()
          }
        })
      })

      const promiseForGetGroup = new Promise((resolve, reject) => {
        reqGroupList().then(res => {
          if (res.data.result === 'OK') {
            resolve(res.data.content)
          } else {
            reject()
          }
        })
      })

      Promise.all([promiseForGetMyQuotations, promiseForGetGroup])
        .then(res => {
          this.superGroupList = res[1]
          this.setBasicConfig(res[0])
          this.quoteType = true
          this.showTable = true
        }).then(() => {
          const copyright_logo = document.getElementById('hot-display-license-info')
          copyright_logo.style = 'display:none'
          this.fullscreeLoading = false
          if (this.showMessageFlag) {
            Message({
              message: '保存成功',
              type: 'success',
              showClose: false,
              duration: 1000
            })
            this.showMessageFlag = false
          }
        })
        .catch(() => {
          this.fullscreeLoading = false
        })
    },
    getAllQuotation() {
      const promiseForGetAllQuotations = new Promise((resolve, reject) => {
        reqAllQuotations()
          .then(res => {
            if (res.data.result === 'OK') {
              this.setQuotationDetail(res)
              resolve(res)
            } else {
              reject()
            }
          }).then(() => {
            this.fullscreeLoading = false
            if (this.showMessageFlag) {
              Message({
                message: '保存成功',
                type: 'success',
                showClose: false,
                duration: 1000
              })
              this.showMessageFlag = false
            }
          })
          .catch(_ => {
            this.fullscreeLoading = false
          })
      })

      const promiseForGetGroup = new Promise((resolve, reject) => {
        reqGroupList().then(res => {
          if (res.data.result === 'OK') {
            resolve(res.data.content)
          } else {
            reject()
          }
        })
      })

      Promise.all([promiseForGetAllQuotations, promiseForGetGroup])
        .then(res => {
          this.superGroupList = res[1]
          this.setBasicConfig(res[0])
          this.quoteType = false
        }).then(() => {
          const copyright_logo = document.getElementById('hot-display-license-info')
          copyright_logo.style = 'display:none'
          this.fullscreeLoading = false
        })
        .catch(() => {
          this.fullscreeLoading = false
        })
    },
    switchType() {
      MessageBox.confirm('此操作将会失去填写数据, 是否继续?', '提示', {
        cancelButtonClass: 'btn-custom-cancel',
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.fullscreeLoading = true
        this.getDiffTypeData()
      })
        .catch(() => {
          this.quoteType = !this.quoteType
        })
    },
    getDiffTypeData() {
      if (this.switchNum === 0) {
        this.switchNum = 1
      }
      if (this.quoteType) {
        this.getMyQuotation() // 请求报价工数（我的）
      } else {
        this.getAllQuotation() // 请求报价工数（全部）
      }
    },
    hiddenDialog() {
      // 隐藏弹窗
      this.pointVisible = false
      this.manDayVisible = false
    },
    setDaysCellStyle(status) {
      // 设置工数单元格样式
      const row = this.row
      const quotaData = this.hotSettings.data
      const rowData = quotaData[row]
      const colProp = this.colProp
      const splitArr = colProp.split('.')

      const splitArrLen = splitArr.length - 1
      splitArr.splice(splitArrLen, 1)
      let value = rowData
      for (const key of splitArr) {
        value = value[key]
      }
      value.issue_status = status
      this.hotSettings.data = quotaData
    },
    save() {
      this.showMessageFlag = true
      this.fullscreeLoading = true
      const dataList = JSON.parse(JSON.stringify(this.hotSettings.data)).map(item => {
        // 处理大小组数据
        item.group_name_list = []
        if (item.superGroup !== '') {
          item.group_name_list[0] = item.superGroup
          if (item.group !== '') {
            item.group_name_list[1] = item.group
          }
        }
        return item
      })

      const tempArr = this.transDayAfterSave(dataList, this.value)
      if (!tempArr) {
        this.fullscreeLoading = false
        Message({
          message: '填写不规范,请修改!',
          type: 'warning',
          showClose: false,
          duration: 3000
        })
        return
      }
      // 过滤'前提'列数据:不存在前提列的数据，删除掉
      const tmpObj = {}
      const tmpSelectArr = []
      for (const dataItem of tempArr) {
        for (const optionItem of this.optionList) {
          if (dataItem[optionItem]['precondition'] !== '') {
            tmpObj[dataItem[optionItem]['precondition']] = null
          }
        }
      }
      for (const key in tmpObj) {
        tmpSelectArr.push(key)
      }

      this.selectOptionsData.precondition = tmpSelectArr
      const data = {
        quotation_id: this.quotationId,
        commit_user: this.userId,
        select_data: this.selectOptionsData,
        data_list: tempArr,
        func_task_list: this.funcTaskList,
        group_list: this.groupList,
        cost_list: this.costList,
        option_list: this.optionList,
        delete_list: this.deleteList
      }
      setQuotationList(data)
        .then(res => {
          if (res.data.result === 'OK') {
            this.getNewDataAfterSave()
            this.switchNum = 1
          } else if (res.data.result === 'NG') {
            Message({
              message: res.data.error,
              type: 'error',
              showClose: true,
              duration: 3000
            })
            this.fullscreeLoading = false
          } else { // Warning
            this.$msgbox({
              title: '冲突提示',
              message: <warning-table warningMsg={res.data.content}></warning-table>,
              showConfirmButton: true,
              showCancelButton: false
            })
            this.fullscreeLoading = false
          }
        }).catch(_ => {
          this.fullscreeLoading = false
        })
    },
    getNewDataAfterSave() {
      if (this.quoteType) {
        this.getMyQuotation()
      } else {
        this.getAllQuotation()
      }
    },
    showHistory(title) {
      // $('.shadow').animate({ right: '1px' }, 1000)
      // this.taskRecordTitle = title
      // this.taskRecordLoading = true
    },
    hide_shadow() {
      // $('.shadow').animate({ right: '-2000px' }, 1000)
    },
    setQuotationDetail(res) {
      const data = res.data.content
      this.title.projName = '项目名：' + data.proj_name
      this.title.quotationName = '报价名：' + data.quotation_name
      this.title.version = '版本：' + data.quotation_ver
    },
    switchDaysUnit(value) {
      const trimRowArr = this.$refs.textHot.hotInstance.getPlugin('filters').trimRowsPlugin.rowsMapper.__arrayMap
      const optionList = this.optionList
      const data = this.hotSettings.data
      const DAYKEY = 'days'
      let multiple = 1
      if (value === 'day') {
        multiple = 20
      } else {
        multiple = 0.05
      }
      this.transHistoryCost(multiple)
      for (const dataItem of data) {
        for (const optionKey of optionList) {
          if (checkNumber(dataItem[optionKey][DAYKEY])) {
            if (dataItem[optionKey][DAYKEY] === '' || dataItem[optionKey][DAYKEY] === null) { // 为什么还要检测 值 === '',因为单元格删除数字时，值会变为''
              dataItem[optionKey][DAYKEY] = null
            } else {
              dataItem[optionKey][DAYKEY] = dataItem[optionKey][DAYKEY] * multiple
              dataItem[optionKey][DAYKEY] = Math.round(dataItem[optionKey][DAYKEY] * 100) / 100
            }
          } else {
            dataItem[optionKey][DAYKEY] = null
          }
        }
      }

      const visualData = this.getVisualData(data, trimRowArr)
      this.setNestedHeadersDays(visualData)
      this.hotSettings.data = visualData
    },
    transHistoryCost(multiple) {
      this.taskRecordList = this.taskRecordList.map(item => {
        item.days = item.days * multiple
        return item
      })
    },
    transDay(data, multiple, optionList, groupList, dayKey) {
      for (const dataItem of data) {
        for (const optionKey of optionList) {
          if (checkNumber(dataItem[optionKey][dayKey])) {
            if (dataItem[optionKey][dayKey] === '' || dataItem[optionKey][dayKey] === null) { // 为什么还要检测 值 === '',因为单元格删除数字时，值会变为''
              dataItem[optionKey][dayKey] = null
            } else {
              dataItem[optionKey][dayKey] = dataItem[optionKey][dayKey] * multiple
              dataItem[optionKey][dayKey] = Math.round(dataItem[optionKey][dayKey] * 100) / 100
            }
          } else {
            dataItem[optionKey][dayKey] = null
          }
        }
      }
    },
    transDayAfterSave(data, type) {
      const groupList = this.groupList
      const optionList = this.optionList
      const dayKey = 'days'
      let multiple = 0
      if (type === 'month') {
        multiple = 20
      } else {
        multiple = 1
      }
      return this.transDayForSave(data, multiple, optionList, groupList, dayKey)
    },
    transDayForSave(data, multiple, optionList, groupList, dayKey) {
      for (const dataItem of data) {
        for (const optionKey of optionList) {
          if (checkNumber(dataItem[optionKey][dayKey])) {
            if (dataItem[optionKey][dayKey] === '' || dataItem[optionKey][dayKey] === null) { // 为什么还要检测 值 === '',因为单元格删除数字时，值会变为''
              dataItem[optionKey][dayKey] = null
            } else {
              dataItem[optionKey][dayKey] = dataItem[optionKey][dayKey] * multiple
              dataItem[optionKey][dayKey] = Math.round(dataItem[optionKey][dayKey] * 100) / 100
            }
          } else {
            dataItem[optionKey][dayKey] = null
            return false
          }
        }
      }
      return data
    },
    getTaskManHourStatistics(data) {
      function hasThisGroup(tableData, tableKey, groupName) {
        const len = tableData.length
        for (let i = 0; i < len; i++) {
          const item = tableData[i]
          if (item[tableKey] === groupName) {
            return i
          }
        }
        return false
      }
      // 获得moduleObj=============================
      const moduleObj = {
        group: '',
        children: []
      }
      for (const optionKey of this.optionList) {
        moduleObj[optionKey] = 0
      }
      // ==========================================
      const tmpArr = []
      const optionList = this.optionList
      const DAYKEY = 'days'
      const GROUP = 'group'
      const SUPERGROUP = 'superGroup'
      for (const dataItem of data) {
        const hasSameSuperGroup = hasThisGroup(tmpArr, 'group', dataItem[SUPERGROUP])
        // 添加大组
        if (hasSameSuperGroup !== false) { // 有相同的大组
          const tmpObj = JSON.parse(JSON.stringify(moduleObj))

          for (const optionKey of optionList) {
            if (!checkIsEmpty(dataItem[optionKey][DAYKEY])) {
              tmpArr[hasSameSuperGroup][optionKey] += dataItem[optionKey][DAYKEY]
              tmpObj[optionKey] = dataItem[optionKey][DAYKEY]
            }
            if (!checkIsEmpty(dataItem[GROUP])) { // 小组名不为空
              const hasSameGroup = hasThisGroup(tmpArr[hasSameSuperGroup]['children'], GROUP, dataItem[GROUP])
              if (hasSameGroup !== false) { // 有相同小组，在原数据上进行修改
                tmpArr[hasSameSuperGroup]['children'][hasSameGroup][optionKey] += dataItem[optionKey][DAYKEY]
              } else { // 没有相同小组，直接push
                tmpObj[GROUP] = dataItem[GROUP]
                tmpArr[hasSameSuperGroup]['children'].push(tmpObj)
              }
            }
          }
        } else { // 不相同的,新增到数组中
          const tmpObj = JSON.parse(JSON.stringify(moduleObj))
          const tmpObj2 = JSON.parse(JSON.stringify(moduleObj))

          tmpObj['group'] = dataItem['superGroup']
          tmpObj2['group'] = dataItem['group']
          for (const optionKey of optionList) {
            tmpObj[optionKey] = dataItem[optionKey]['days'] || 0
            tmpObj2[optionKey] = dataItem[optionKey]['days'] || 0
          }
          if (!checkIsEmpty(dataItem['group'])) {
            tmpObj['children'].push(tmpObj2)
          }
          tmpArr.push(tmpObj)
        }
      }
      return tmpArr
    }
  }
}
</script>
<style lang="scss" scoped>
@import './handsontable.css';
.container {
  width: 100%;
  height: 100%;
}
.title {
  float: left;
  font-size: 30px;
  font-weight: 600;
  margin-top: 10px;
  margin-left: 10px;
}
button {
  margin: 0;
}
.handsontable-wrapper {
  position: absolute;
  left: 0;
  right: 0;
  top: 134px;
  bottom: 0;
  overflow: hidden;
}
#test-hot {
  width: 100%;
  height: 800px;
  overflow: hidden;
}
.shadow {
  width: 1280px;
  height: calc(100% - 48px);
  position: fixed;
  background: rgba(255, 254, 255, 1);
  top: 48px;
  right: -2000px;
  z-index: 666;
  text-align: left;
  border-radius: 5px;
  filter: drop-shadow(0 3px 5px black);
}
.el-icon-d-arrow-right {
  font-size: 24px;
  padding: 10px;
  cursor: pointer;
}
.btn-custom-cancel {
  float: right;
  margin-left: 10px;
}
.btn-switch {
  float: right;
  padding: 10px 15px 0 0;
}
/* https://github.com/handsontable/handsontable/issues/5998 */
/* 解决问题：右边动态列部分被固定列隐藏 */
/* 下面代码不要删，我也不知道什么原理，反正就是好使 */
.handsontable th {
  width: 5px;
}
</style>
