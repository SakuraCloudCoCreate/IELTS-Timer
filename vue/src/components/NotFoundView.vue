<template>
    <div class="notfoundview-container">
        <el-result icon="error" title="ERROR! 页面没有找到" sub-title="404 NotFound" style="margin: 0 auto; padding-top: 20%;">
        <template #extra>
            <h1 style="color: grey;">{{ timer }} 秒后自动返回</h1>
            <div style=" padding-top: 30px;">
                <el-button type="primary" @click="connectToDefaultPage">返回首页</el-button>
            </div>
           
        </template>
    </el-result>
    </div>
</template>
<script setup>
import { useRouter} from 'vue-router';
import {onMounted, onUnmounted} from 'vue';
import { ref } from 'vue';
const router = useRouter()
const connectToDefaultPage = ()=>{
    router.push({name: 'home'})
}

const intervalId = ref(null)
const timerStop = ()=>{
    clearInterval(intervalId.value)
}
const timerStart = ()=>{
        intervalId.value = setInterval(()=>{
            timer.value = timer.value - 1
            if(timer.value <= 0){
                timerStop()
                connectToDefaultPage()
            }
        },1000)

    }
const timer = ref(30)
onMounted(()=>{
    timer.value = 30
    timerStart()
})
onUnmounted(()=>{
  timerStop()
})
</script>
<style>
.notfoundview-container {
  width: 300px;
  height: 650px;
  position: absolute;
  left: 0px;
  top: 0px;
  background-color: #ecf5ff;
}
</style>