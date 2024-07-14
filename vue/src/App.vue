<template>
  <div class="window">
    <router-view></router-view>
  </div>

</template>
<style>
.el-header{
  padding: 0px !important;
}
.el-main{
  padding: 0px !important;
  overflow: hidden !important;
}
</style>

<script setup>
import { RouterView } from 'vue-router'
</script>

