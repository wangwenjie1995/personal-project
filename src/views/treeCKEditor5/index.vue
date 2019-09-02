<template>
  <div id="editor">
    <el-button @click="() => { type = 'editorHtml'} ">输出数据</el-button>
    <el-tree
      :data="treeData"
      show-checkbox
      node-key="id"
      default-expand-all
      :expand-on-click-node="false"
    >
      <div slot-scope="{ node, data }" class="custom-tree-node">
        <component
          :is="data.type"
          v-model="data.label"
          :data="data.label"
          @switch="data.type = $event"
          @post="data.label = $event"
        />
      </div>
    </el-tree>
  </div>
</template>
<script>
import ckEditor5Html from './ckeditor/ckEditor5Html'
import ckEditor5 from './ckeditor/ckEditor5'
// import CKEditor from '@ckeditor/ckeditor5-vue'
// import ClassicEditor from '@ckeditor/ckeditor5-build-classic'
import InlineEditor from '@ckeditor/ckeditor5-build-inline'
// import BalloonEditor from '@ckeditor/ckeditor5-build-balloon'
// import BalloonBlockEditor from '@ckeditor/ckeditor5-build-balloon-block'
// import DecoupledDocumentEditor from '@ckeditor/ckeditor5-build-decoupled-document'
export default {
  name: 'TreeCKEditor5',
  components: {
    // ckeditor: CKEditor.component
    'editorHtml': ckEditor5Html,
    'ckEditor': ckEditor5
  },
  data() {
    return {
      aa: '',
      type: 'editorHtml',
      dataList: [
        '<p>1Some text.</p>',
        '<p>2Some text.</p>',
        '<p>3Some text.</p>',
        '<p>4Some text.</p>',
        '<p>5Some text.</p>'
      ],
      editorInstance: null,
      editorName: '',
      editor: InlineEditor,
      editorConfig: {
        toolbar: ['heading', 'bold', 'italic', 'bulletedList', 'numberedList', 'blockQuote', 'undo', 'redo'],
        heading: {
          options: [
            { model: 'paragraph', title: 'Paragraph', class: 'ck-heading_paragraph' },
            { model: 'heading1', view: 'h1', title: 'Heading 1', class: 'ck-heading_heading1' },
            { model: 'heading2', view: 'h2', title: 'Heading 2', class: 'ck-heading_heading2' }
          ]
        }
      },
      treeData: [{
        id: 1,
        label: '一级 1',
        type: 'editorHtml',
        children: [{
          id: 4,
          label: '二级 1-1',
          type: 'editorHtml',
          children: [{
            id: 9,
            label: '三级 1-1-1',
            type: 'editorHtml'
          }, {
            id: 10,
            label: '三级 1-1-2',
            type: 'editorHtml'
          }]
        }]
      }, {
        id: 2,
        label: '一级 2',
        type: 'editorHtml',
        children: [{
          id: 5,
          label: '二级 2-1',
          type: 'editorHtml'
        }, {
          id: 6,
          label: '二级 2-2',
          type: 'editorHtml'
        }]
      }, {
        id: 3,
        label: '一级 3',
        type: 'editorHtml',
        children: [{
          id: 7,
          label: '二级 3-1',
          type: 'editorHtml'
        }, {
          id: 8,
          label: '二级 3-2',
          type: 'editorHtml'
        }]
      }]
    }
  },
  mounted() {},
  methods: {}
}
</script>
<style lang="scss">
#editor .el-tree .el-tree-node .el-tree-node__content {
  height: 50px;
  cursor: default;
}
</style>

<style lang="scss" scoped>
.ck-editor__editable_inline {
    max-height: 50px;
    min-height: 50px;
    min-width: 50px;
    padding: 0;
    margin: 0;
}
</style>
