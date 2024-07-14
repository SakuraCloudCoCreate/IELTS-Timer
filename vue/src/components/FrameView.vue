<template>
  <el-container class="frameview-container">
    <el-header class="frameview-header">
      <img src="@/assets/logo.png" class="frameview-header-logo-image" alt="">
      <el-menu
          :default-active="route.path"
          :ellipsis="false"
          :router="true"
          mode="horizontal"
          style="background-color: #ecf5ff"

      >
        <el-menu-item index="/home" style="padding: 10px">Home</el-menu-item>
        <el-sub-menu index="/pratice" style="padding: 5px">
          <template #title>Practice</template>
          <el-menu-item index="/practice/reading">Reading</el-menu-item>
          <el-menu-item index="/practice/writing">Writing</el-menu-item>
        </el-sub-menu>
        <el-menu-item index="info" style="padding: 5px">More</el-menu-item>
      </el-menu>
    </el-header>
    <el-main>
      <router-view></router-view>
    </el-main>
    <el-footer>
      <div class="frameview-footer">
        <p class="frameview-footer-text">Created by Sakura. </p>
        <p class="frameview-footer-text">Copyright: SakuraCloudCoCreate.</p>
        <p class="frameview-footer-text">2020-2024 <a style="color: #409EFF" @click="contactUs">Contact us</a></p>
        <img src="@/assets/logo.png" class="frameview-footer-img">
      </div>
    </el-footer>
  </el-container>



</template>
<script setup>
import {useRoute} from "vue-router";

const route = useRoute()

const contactUs =()=>{
  window.electron.contactUs()
}
</script>
<style>
.frameview-header{
  width: 100%;
  height: 70px;
  display: flex;
  background-color: #ecf5ff;
}
.frameview-header-logo-image{
  width: 50px;
  height: 50px;
  padding-top: 5px;
  padding-left: 5px;
}
.frameview-container{
  width: 300px;
  height: 650px;
  position: absolute;
  left: 0px;
  top: 0px;
  background-color: #f4f4f5;
}

.frameview-footer{
  width: 100%;
  position: absolute;
  bottom: 0px;
  left: 0px;
  text-align: center;
  font-size: 12px;
  background-color: #FAFCFF;

}

.frameview-footer-text{
  margin: 5px;

}

.frameview-footer-img{
  width: 60px;
  height: 30px;
  justify-content: end;
  margin-bottom: 10px;
}
</style>