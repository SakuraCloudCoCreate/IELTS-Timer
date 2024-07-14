const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electron', {
    playReadingIntroduction: () => ipcRenderer.send('play-reading-introduction'),
    contactUs: () => ipcRenderer.send("contact-us"),
    electronTimerStart: (currentTimeMap)=> ipcRenderer.send("start-timer",currentTimeMap),
    electronTimerStop: ()=> ipcRenderer.send("stop-timer"),
    electronTimerCallBack: (callback)=>ipcRenderer.on("timer-callback",(event,timeMap)=>callback(timeMap)),
    log: (message) =>
        ipcRenderer.on("message", (event, text) => {
            console.log("message",text);
        })

});