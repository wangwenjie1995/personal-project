<template>
  <div :id="editor" @mousedown="initCkEditor" v-html="value" />
</template>

<script>
// deps for editor
import 'codemirror/lib/codemirror.css' // codemirror
import 'tui-editor/dist/tui-editor.css' // editor ui
import 'tui-editor/dist/tui-editor-contents.css' // editor content

import InlineEditor from '@ckeditor/ckeditor5-build-inline'
import defaultConfig from './config.js'

export default {
  name: 'CKEditor',
  props: {
    value: {
      type: String,
      default: ''
    },
    id: {
      type: String,
      required: false,
      default() {
        return 'ck-editor-editor' + new Date() + ((Math.random() * 1000).toFixed(0) + '')
      }
    },
    toolbar: {
      type: Array,
      default() {
        ['heading', 'bold', 'italic', 'bulletedList', 'numberedList', 'blockQuote', 'undo', 'redo']
      }
    },
    config: {
      type: Object,
      default() {
        return defaultConfig
      }
    }
  },
  data() {
    return {
      ckEditor: null
    }
  },
  computed: {
    ckEditorConfig() {
      const options = Object.assign({}, defaultConfig, this.options)
      options.toolbar = this.toolbar
      return options
    }
  },
  watch: {
    value(newValue, preValue) {
      if (newValue !== preValue && newValue !== this.editor.getValue()) {
        this.editor.setValue(newValue)
      }
    }
  },
  mounted() {},
  destroyed() {
    this.destroyEditor()
  },
  methods: {
    initCkEditor() {
      const targetDom = document.querySelector(this.id)
      InlineEditor
        .create(targetDom, this.ckEditorConfig)
        .then(editor => {
          editor.setData(this.value)
          editor.editing.view.document.on('blur', () => {
            editor.destroy().then(() => {
              this.ckEditor = null
            }).catch()
          })
          this.ckEditor = editor
        })
        .catch(error => {
          console.error(error, 'inlineEditor create error')
        })
      this.editor.on('change', () => {
        this.$emit('input', this.ckEditor.getValue())
      })
    },
    destroyEditor() {
      if (!this.ckEditor) return
      this.editor.off('change')
      this.editor.remove()
    },
    setValue(value) {
      this.editor.setValue(value)
    },
    getValue() {
      return this.editor.getValue()
    },
    setHtml(value) {
      this.editor.setHtml(value)
    },
    getHtml() {
      return this.editor.getHtml()
    }
  }
}
</script>
