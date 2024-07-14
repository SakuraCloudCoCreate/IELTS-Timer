<template>
      <div class="reading-statistic" v-if="statistic.visible">
        <p class="reading-statistic-text">Counting time:</p>
        <el-row class="reading-statistic-row" >
          <el-col :span="3" class="reading-statistic-col">{{statistic.minutes_1}}</el-col>
          <el-col :span="3" class="reading-statistic-col">{{statistic.minutes_2}}</el-col>
          <el-col :span="1" class="reading-statistic-col">:</el-col>
          <el-col :span="3" class="reading-statistic-col">{{statistic.seconds_1}}</el-col>
          <el-col :span="3" class="reading-statistic-col">{{statistic.seconds_2}}</el-col>
        </el-row>
      </div>
      <div class="reading-title" v-else>
        <h1 style="font-size: 40px; margin-bottom: 5px">Reading</h1>
        <p style="font-size: 20px; padding-bottom: 20px">Start to practice for IELTS</p>
      </div>
      <div class="reading-status">
        <p style="font-size: 20px; margin: 0">Status: <span :style="{'font-size': '15px', 'color': readingStatus.color}" >{{readingStatus.text}}</span></p>
      </div>

      <div v-if="button.visible" class="reading-button" >
        <div  class="reading-button-external">
          <div class="reading-button-inner" id="reading-button-inner" @click="button.click()">
            <div style="display: contents">
              <span id="rocket">🚀</span>
              <p id="description">{{button.text}}</p>
            </div>
          </div>

        </div>
      </div>
</template>
<script setup>
import {onBeforeUnmount, onMounted, reactive} from "vue";
import launchRocket from "@/utils/launchRocket.js";
import {ElMessage, ElMessageBox} from "element-plus";

const readingStatus = reactive({
  text: "To be started",
  color: "#F56C6C"
})
const statistic = reactive({
  visible: false,
  minutes_1: 6,
  minutes_2: 0,
  seconds_1: 0,
  seconds_2: 0,
})

const button = reactive({
  visible: true,
  text: "Start",
  click: ()=>{


    if (launchRocket().status === 0){
      ElMessageBox.confirm(
          'The IELTS policy will be announced initially. During the announcement, you cannot stop the timer',
          'We are getting to start',
          {
            confirmButtonText: 'Confirm',
            cancelButtonText: 'Cancel',
            type: 'warning',
          })
          .then(() => {
            ElMessage({
              type: 'success',
              message: 'getting to start',

            })
            launchRocket().start()
            setTimeout(()=>{button.text="Stop"},2000)
            statistic.visible = true
            readingStart()
          })
          .catch((e) => {
            if (e === 'cancel'){
              ElMessage({
                type: 'info',
                message: 'Canceled',
              })
            }else {
              console.error(e)
            }
          })

    }

    if (launchRocket().status === 2 && readingStatus.text !== "Policy is announcing"){
      localStorage.setItem("totalMinutes",Number(localStorage.getItem("totalMinutes")) + (60-((statistic.minutes_1 * 10) + statistic.minutes_2)))
      localStorage.setItem("totalTimes", Number(localStorage.getItem("totalTimes")) + 1)
      localStorage.setItem("readingTimerStarted",null)
      launchRocket().stop()
      setTimeout(()=>{button.text="Start"},1000)
      statistic.visible = false
      readingStatus.text = "To be started"
      readingStatus.color = "#F56C6C"
      window.electron.electronTimerStop()
    }
  }
})

const readingStart= ()=>{

  window.electron.playReadingIntroduction()
  readingStatus.text = "Policy is announcing"
  readingStatus.color = "#E6A23C"
  setTimeout(()=>{
    localStorage.setItem("readingTimerStarted", new Date().getTime());

    const timeMap = new Map();
    timeMap.set("minutes_1", 6)
    timeMap.set("minutes_2", 0)
    timeMap.set("seconds_1", 0)
    timeMap.set("seconds_2", 0)

    readingStatus.text = "Started"
    readingStatus.color = "#67C23A"
    window.electron.electronTimerStart(timeMap)
  },43000)
}

window.electron.electronTimerCallBack((timeMap)=>{
  statistic.minutes_1 = timeMap.get("minutes_1")
  statistic.minutes_2 = timeMap.get("minutes_2")
  statistic.seconds_1 = timeMap.get("seconds_1")
  statistic.seconds_2 = timeMap.get("seconds_2")

  if (timeMap.get("seconds_1") === 0 && timeMap.get("seconds_2") === 0) {
    if (timeMap.get("minutes_2") === 0) {
      if (timeMap.get("minutes_1") === 0) {
        localStorage.setItem("totalMinutes",Number(localStorage.getItem("totalMinutes")) + (60-((statistic.minutes_1 * 10) + statistic.minutes_2)))
        localStorage.setItem("totalTimes", Number(localStorage.getItem("totalTimes")) + 1)
        launchRocket().stop()
        setTimeout(() => {
          button.text = "Start"
        }, 1000)
        statistic.visible = false
        readingStatus.text = "To be started"
        readingStatus.color = "#F56C6C"
        localStorage.setItem("readingTimerStarted",null)

      }
    }
  }
})
onMounted(()=>{
  if (localStorage.getItem('readingTimerStarted') !== null){
    if (new Date().getTime() - Number(localStorage.getItem('readingTimerStarted')) < 3600000){
      if (readingStatus.text === "To be started"){
        localStorage.setItem("readingTimerStarted",new Date().getTime())

        const timeMap = new Map();
        let time = Math.floor((3600000 -(new Date().getTime() - Number(localStorage.getItem("readingTimerStarted") ) ))/1000 )
        let minutes = Math.floor(time / 60)
        let seconds = time - minutes * 60
        timeMap.set("minutes_1", Math.floor(minutes / 10))
        timeMap.set("minutes_2", minutes - (timeMap.get("minutes_1") * 10))
        timeMap.set("seconds_1", Math.floor(seconds / 10))
        timeMap.set("seconds_2", seconds - (timeMap.get("seconds_1") * 10))
        statistic.minutes_1 = timeMap.get("minutes_1")
        statistic.minutes_2 = timeMap.get("minutes_2")
        statistic.seconds_1 = timeMap.get("seconds_1")
        statistic.seconds_2 = timeMap.get("seconds_2")

        launchRocket().start()
        setTimeout(()=>{button.text="Stop"},1000)
        statistic.visible = true

        window.electron.electronTimerStart(timeMap)
      }
    }
  }
})

onBeforeUnmount(()=>{
  if (readingStatus.text === "Started"){
    window.electron.electronTimerStop()
  }
})
</script>
<style scoped>
.reading-statistic{
  background-color: #FAFCFF;
  margin: 15px;
  font-family: PO,serif;
  border-radius: 15px;
}
.reading-statistic-text{
  margin: 0;
  padding: 15px;
  padding-left: 8px;
  padding-bottom: 0;
  font-size: 20px;
}
.reading-statistic-row{
  display: flex;
  justify-content: center;
  padding-top: 10px;

}
.reading-statistic-col{
  padding: 10px;
  margin: 7px;
  display: flex;
  justify-content: center;
  height: 100%;
  font-size: 40px;
  border-radius: 10px;
  background-color: white;
}

.reading-title{
  background-color: #FAFCFF;
  margin: 15px;
  font-family: PO,serif;
  border-radius: 15px;
  text-align: center;
}


.reading-status{
  background-color: #FAFCFF;
  margin: 15px;
  border-radius: 15px;
  padding: 15px;
}
.reading-button{
  position: absolute;
  top: 300px;
  left: 15%;
}
.reading-button-external{
  display: flex;
  justify-content: center;
  width: 200px;
  height: 200px;
  background-color: #F56C6C;
  border-radius: 50%;
}
.reading-button-inner{
  display: flex;
  flex-direction: column;
  align-self: center;
  justify-content: center;
  width: 195px;
  height: 195px;
  background-color: white;
  border-radius: 50%;
}

.reading-button-external :hover{
  background-color: #ecf5ff;
}

.reading-button-inner #rocket{
  display: flex;
  justify-content: center;
  align-self: center;
  font-size: 90px;
  width: 110px;
  height: 110px;
}

.reading-button-inner #description{
  width: 10px;
  display: flex;
  margin: 0;
  margin-left: 49%;
  justify-content: center;
  font-size: 35px;
  font-family: PO, serif;
}

.reading-button-inner #rocket,
.reading-button-inner #description {
  background-color: transparent;
}
</style>