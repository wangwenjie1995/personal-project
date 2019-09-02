<template>
  <ckeditor
    v-model="displayData"
    :editor="editor"
    :value="editor"
    @ready="onReady"
    @blur="onBlur"
    :config="editorConfig"
  />
</template>
<script>
import CKEditor from '@ckeditor/ckeditor5-vue'
import InlineEditor from '@ckeditor/ckeditor5-build-inline'
export default {
  name: 'Ckeditor',
  components: {
    ckeditor: CKEditor.component
  },
  props: {
    data: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
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
      displayData: '',
      instance: null
    }
  },
  created() {
    this.displayData = this.data
  },
  destroyed() {},
  methods: {
    onBlur(editor) {
      const editorValue = this.instance.getData()
      if(editorValue) {
        this.$emit('post', editorValue)
      } else {
        this.$message({
          showClose: false,
          message: '填写内容不能为空',
          duration: 1000
        })
      }
      this.$emit('switch', 'editorHtml')
    },
    onReady(editor) {
      this.instance = editor
      editor.editing.view.focus() // 创建ckEditor时，自动聚焦
      editor.model.change(writer => {
        writer.setSelection(editor.model.document.getRoot(), 'end')
      })
    }
  }
}
</script>
<style lang="scss" scoped>
</style>
