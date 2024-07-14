const { app, BrowserWindow, ipcMain,shell} = require('electron');

const path = require('path');
const sound = require("sound-play");
const Timer = require("./utils/timers");
const electron = require("electron");

function createWindow() {
  const window = new BrowserWindow({
    width: 300,
    height: 650,
    titleBarStyle: 'hidden',
    resizable: false,
    minimizable: false,
    maximizable: false,
    title: 'Sakura Timer',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      devTools: false,
      contextIsolation: true,
      enableRemoteModule: false,
    }
  });
  window.loadURL(`file://${path.join(__dirname, "code/index.html#home")}`);
}

app.on('minimize', function(event) {
  event.preventDefault();
})

app.on('ready', createWindow);

ipcMain.on('play-reading-introduction', (event, arg) => {
  const appPath = path.join(app.getAppPath(),"../../");
  const readingIntroductionPath = path.join(appPath, 'audios','reading-introduction.mp3');
  sound.play(readingIntroductionPath);
});

ipcMain.on('contact-us', (event, arg) => {
  shell.openExternal("https://discord.gg/3qKT6QsX")
});

const timerInstance = Timer();

ipcMain.on('start-timer', (event,currentTimeMap) => {
  timerInstance.start(event, currentTimeMap,timerCallBack);
});
ipcMain.on('stop-timer',(event)=>{
  timerInstance.stop()
})

const timerCallBack = (event, timeMap) => {
  const appPath = path.join(app.getAppPath(),"../../");

  if (timeMap.get("seconds_1") === 0 && timeMap.get("seconds_2") === 0) {
    if (timeMap.get("minutes_2") === 0) {
      if (timeMap.get("minutes_1") === 4) {
        sound.play(path.join(appPath, 'audios', '40-minutes-left.mp3'));
      }
      if (timeMap.get("minutes_1") === 2) {
        sound.play(path.join(appPath, 'audios', '20-minutes-left.mp3'));
      }
      if (timeMap.get("minutes_1") === 0) {
        sound.play(path.join(appPath, 'audios', 'stop-writing.mp3'));
      }
    } else {
      if (timeMap.get("minutes_1") === 0 && timeMap.get("minutes_2") === 5) {
        sound.play(path.join(appPath, 'audios', '5-minutes-left.mp3'));
      }
    }
  }
  try {
    if (!event.sender.isDestroyed()) {
      event.sender.send('timer-callback', timeMap);
    }
  } catch (err) {
    console.error('Error sending timer-tick:', err);
  }
};
