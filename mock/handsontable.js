// import Mock from 'mockjs'
import quotationData from './sourceData'
const quotationsList = quotationData

const groupList = {
  'code': 20000,
  'data': { 'result': 'OK', 'content': [{ 'group_id': 7, 'group_name': 'COM', 'sub': [{ 'group_id': 27, 'group_name': 'com_11', 'describe': null, 'parent_group_id': 7, 'owner_user': 20 }, { 'group_id': 21, 'group_name': 'com_22', 'describe': null, 'parent_group_id': 7, 'owner_user': 1 }] }, { 'group_id': 4, 'group_name': 'diag', 'sub': [] }, { 'group_id': 12, 'group_name': 'HMI', 'sub': [] }, { 'group_id': 11, 'group_name': 'PL', 'sub': [] }, { 'group_id': 8, 'group_name': '\u901a\u4fe1\u6a21\u5757', 'sub': [] }] }
}

const grouListMyself = {
  'code': 20000,
  'data': { 'result': 'OK', 'content': [{ 'group_id': 7, 'group_name': 'COM', 'sub': [{ 'group_id': 27, 'group_name': 'com_11', 'describe': null, 'parent_group_id': 7, 'owner_user': 20 }, { 'group_id': 21, 'group_name': 'com_22', 'describe': null, 'parent_group_id': 7, 'owner_user': 1 }] }, { 'group_id': 4, 'group_name': 'diag', 'sub': [] }, { 'group_id': 12, 'group_name': 'HMI', 'sub': [] }, { 'group_id': 11, 'group_name': 'PL', 'sub': [] }, { 'group_id': 8, 'group_name': '\u901a\u4fe1\u6a21\u5757', 'sub': [] }] }
}

export default [
  {
    url: '/cost/show',
    type: 'get',
    response: () => {
      return quotationsList
    }
  },

  {
    url: '/cost/show/myself',
    type: 'get',
    response: () => {
      return quotationsList
    }
  },

  {
    url: '/project/group/list',
    type: 'get',
    response: _ => {
      return groupList
    }
  },

  {
    url: '/project/user/group/list',
    type: 'get',
    response: _ => {
      return grouListMyself
    }
  }
]
