<template>
<el-container class="index-container">
  <el-header class="index-header">
    <img src="@/assets/logo.png" class="index-header-logo-image" alt="">
    <h1 class="index-header-logo-text">IELTS Timer</h1>
  </el-header>
  <el-main class="index-main">
    <div class="index-main-practice" >
      <h2 style="color: #79bbff; letter-spacing: 1px">Practice:</h2>
      <el-row class="index-main-practice-row" id="practice">
        <el-col :span="10" class="index-main-practice-col" @click="practice.reading()">
          <el-icon><Headset /></el-icon>
          <p>Reading</p>
        </el-col>
        <el-col :span="2"></el-col>
        <el-col :span="10" class="index-main-practice-col" @click="practice.writing()" >
          <el-icon><Tickets /></el-icon>
          <p>Writing</p>
        </el-col>
      </el-row>
    </div>
    <div class="index-main-statistic" id="statistic">
      <el-row>
        <el-col :span="12">
          <el-statistic :value="statisticData.times" >
            <template #title>
              <p>Usage Counter<el-icon style="margin-left: 5px"><Clock /></el-icon></p>
              <p>使用次数</p>
            </template>
            <template #suffix>
              <p style="font-size: 12px">/Times</p>
            </template>
          </el-statistic>
        </el-col>
        <el-col :span="11">
          <el-statistic :value="statisticData.totalMinutes" >
            <template #title>
              <p>Total Time Used<el-icon style="margin-left: 5px"><Timer /></el-icon></p>
              <p>总时长 /分钟</p>
            </template>
            <template #suffix>
              <p style="font-size: 12px">/Min</p>
            </template>
          </el-statistic>
        </el-col>
      </el-row>
    </div>
    <el-divider />
    <div class="index-main-info">

      <el-row>
        <el-col :span="12">
          <h2 style="color: #909399;font-size: 18px;">Info</h2>
          <el-scrollbar height="65px">
            <img src="https://img.shields.io/badge/Version-1.0.0-blue"/>
            <img src="https://img.shields.io/badge/Author-sakura-pink"/>
            <img src="https://img.shields.io/badge/Licence-Apache-orange"/>
            <img src="https://img.shields.io/badge/OpenSource-Github-green"/>

          </el-scrollbar>
        </el-col>
        <el-col :span="12">
          <h2 style="color: #909399;font-size: 18px">Social Media</h2>
          <el-scrollbar height="80px">
            <div class="index-main-socialmedia">
              <p><span style="color: #409EFF;"><el-icon>
                                    <Position />
                                </el-icon>Web:</span> https://www.wdsj.games/</p>
              <p><span style="color: #409EFF;"><el-icon>
                                    <ChatLineSquare />
              </el-icon>Discord:</span> <a style="color: #79bbff" @click="contactUs">Click to join</a></p>
              <p><span style="color: #409EFF;"><el-icon>
                                    <ChatLineSquare />
                                </el-icon>QQ group1:</span> 1062533284</p>
              <p><span style="color: #409EFF;"><el-icon>
                                    <ChatLineSquare />
                                </el-icon>QQ group2:</span> 756503082</p>

            </div>
          </el-scrollbar>
        </el-col>
      </el-row>
    </div>
  </el-main>
</el-container>

  <el-tour v-model="tour.visibility">
    <el-tour-step
        target="#practice"
        title="Start your practice">
      <div>You can choose different individual practices</div>
    </el-tour-step>
    <el-tour-step
        target="#statistic"
        title="See the statistic">
      <div>We won't collect your data. All of the data is stored in your local device for your privacy protection.</div>
    </el-tour-step>
    <el-tour-step
      title="Enjoy!">
      <div>Wish you success</div>
    </el-tour-step>

  </el-tour>
</template>
<script setup>
import {onBeforeMount, onMounted, reactive} from "vue";
import {useRouter} from "vue-router";
import {ElMessage, ElMessageBox} from "element-plus";

const contactUs =()=>{
  window.electron.contactUs()
}

const router = useRouter()

const statisticData = reactive({
  times: 0,
  totalMinutes: 0
})


const practice = reactive({
  reading: ()=>{
    router.push({name: 'practice-reading'})
  },
  writing: ()=>{
    router.push({name: 'practice-writing'})
  }
})

onBeforeMount(()=>{
  if (localStorage.getItem("initialization") === null){
    tour.visibility = true
    ElMessage({type: 'success', message: "Let's have a guide for the first time"})
    localStorage.setItem("initialization", new Date().getTime())
    localStorage.setItem("totalMinutes",0)
    localStorage.setItem("totalTimes",0)
  }
})
onMounted(()=>{
  statisticData.times = localStorage.getItem("totalTimes")
  statisticData.totalMinutes = localStorage.getItem("totalMinutes")
  if (localStorage.getItem('readingTimerStarted') !== null){
    if (new Date().getTime() - Number(localStorage.getItem('readingTimerStarted')) < 3600000){
      ElMessage({type: 'warning', message: "Detect that you have a timer that has been started"})
      ElMessageBox.confirm(
          'Detect that you have a timer that has been started. Do you wanna continue timing?',
          'Warning',
          {
            confirmButtonText: 'OK',
            cancelButtonText: 'Cancel',
            type: 'warning',
          }
      )
          .then(() => {
            ElMessage({type: 'success', message: "Remain the previous timer"})
            router.push({name: "practice-reading"});
          })
          .catch(() => {
            localStorage.setItem("readingTimerStarted",null)
            ElMessage({
              type: 'info',
              message: 'Canceled',
            })
          })
    }
  }
})


const tour = reactive({
  visibility: false,
})
</script>

<style scoped>
.index-container{
  width: 300px;
  height: 650px;
  position: absolute;
  left: 0px;
  top: 0px;
  background-color: #ecf5ff;
}

.index-header{
  width: 100%;
  height: 70px;
  display: flex;
}
.index-header-logo-image {
  width: 50px;
  height: 50px;
  padding-top: 5px;
  padding-left: 5px;
}
.index-header-logo-text {
  color: #409EFF;
  font-size: 20px;
  padding-top: 5px;
  letter-spacing: 2px;
}

.index-main{
  background-color: #f4f4f5;
  padding: 0px;
}

.index-main-practice{
  width: 84%;
  background-color: white;
  margin: 6%;
  padding: 2%;
  padding-top: 1px;
  border-radius: 10px;
}
.index-main-practice-row{
  padding-left: 10px;
  display: flex;
}
.index-main-practice-col:hover   {
  background-color: #79bbff;
}
.index-main-practice-col{
  background-color: #c6e2ff;
  border-radius: 10px;
  padding: 10px;
}

.index-main-info{
  width: 82%;
  height: auto;
  background-color: white;
  margin: 6%;
  padding: 4%;
  padding-top: 0px;
  border-radius: 10px;
}.index-main-statistic{
   width: 84%;
   background-color: white;
   margin: 6%;
   padding: 2%;
   padding-top: 1px;
   border-radius: 10px;
 }

 .index-main-socialmedia{
   font-size: 10px;
 }
</style>