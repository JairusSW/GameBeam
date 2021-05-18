const { app, BrowserWindow } = require('electron')

function createWindow () {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
        nodeIntegration: true,
        contextIsolation: false,
        autoplayPolicy: 'no-user-gesture-required'
    }
  })

  //win.hide()
  win.loadFile('GameBeam.html')

  //win.hide()

}

app.allowRendererProcessReuse = false

app.whenReady().then(() => {
  
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })

})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
