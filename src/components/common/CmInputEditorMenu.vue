<script setup lang="ts">
import 'katex/dist/katex.min.css'
import katex from 'katex'

function insertA() {
  const htmlString = katex.renderToString('c = \\pm\\sqrt{a^2 + b^2}', {
    throwOnError: false,
  })
  document.execCommand('insertHTML', false, htmlString)
}
</script>

<template>
  <div class="menu-box">
    <div class="menu-list">
      <button
        class="menu-item"
        @click="insertA"
      >
        <span>Math</span>
      </button>
      <div class="menu-item">
        <span>a</span>
      </div>
      <div class="mark" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.menu-box{
  border: 1px solid rgba(var(--v-border-color));
  background-color:  rgb(var(--v-theme-surface));
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
  padding: 5px;
  .menu-list{
    display: flex;
    .menu-item{
      width: fit-content;
      padding: 5px;
      min-width: 30px;
      text-align: center;
    }
    .mask{
      border-left: 1px solid #a3a3a3;
    }
  }
}
</style>
