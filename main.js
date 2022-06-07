const { BrowserWindow, app, dialog, Menu } = require("electron")
const fs = require('fs');
var ipc = require('electron').ipcMain;
require("electron-reloader")(module);
let open_File;
let mainWindow;

const createWindow = () => {
    mainWindow = new BrowserWindow({
        width: 1100,
        height: 800,
        webPreferences: {
          nodeIntegration: true,
          contextIsolation: false,
          enableRemoteModule: true,
        },
    })
    mainWindow.loadFile("index.html")
    mainWindow.openDevTools();
};
app.whenReady().then(createWindow);


ipc.on('open-file-dialog', (event) => {
  dialog.showOpenDialog(mainWindow,
    { properties: ['openFile', 'multiSelections']
  }).then(result => {
    if (result.canceled === false) {
      event.reply("selected-file", result.filePaths)
    }
    else {
      return
    }
  })

})

ipc.on('open-folder-dialog', (event) => {
  dialog.showOpenDialog(mainWindow,
    { properties: [ 'openDirectory', 'createDirectory' ]
  }).then(result => {
    if (result.canceled === false) {
      event.reply("selected-folder", result)
    }
    else {
      return
    }
  })
})


const isMac = process.platform === 'darwin'

const template = [
  // { role: 'appMenu' }
  ...(isMac ? [{
    label: app.name,
    submenu: [
      { role: 'about' },
      { type: 'separator' },
      { role: 'hide' },
      { role: 'hideOthers' },
      { role: 'unhide' },
      { type: 'separator' },
      { role: 'quit' }
    ]
  }] : []),
  // { role: 'fileMenu' }
  {
    label: 'File',
    submenu: [
      isMac ? { role: 'close' } : { role: 'quit' }
    ]
  },
  // { role: 'editMenu' }
  {
    label: 'Edit',
    submenu: [
      { role: 'undo' },
      { role: 'redo' },
      { type: 'separator' },
      { role: 'cut' },
      { role: 'copy' },
      { role: 'paste' },
      { type: 'separator' },
      { role: 'save' },
      { role: 'open file' },
      ...(isMac ? [
        { role: 'pasteAndMatchStyle' },
        { role: 'delete' },
        { role: 'selectAll' },
        { type: 'separator' },
        {
          label: 'Speech',
          submenu: [
            { role: 'startSpeaking' },
            { role: 'stopSpeaking' }
          ]
        }
      ] : [
        { role: 'delete' },
        { type: 'separator' },
        { role: 'selectAll' }
      ])
    ]
  },
  // { role: 'viewMenu' }
  {
    label: 'View',
    submenu: [
      { role: 'reload' },
      { role: 'forceReload' },
      { role: 'toggleDevTools' },
      { type: 'separator' },
      { role: 'resetZoom' },
      { role: 'zoomIn' },
      { role: 'zoomOut' },
      { type: 'separator' },
      { role: 'togglefullscreen' }
    ]
  },
  // { role: 'windowMenu' }
  {
    label: 'Window',
    submenu: [
      { role: 'minimize' },
      { role: 'zoom' },
      ...(isMac ? [
        { type: 'separator' },
        { role: 'front' },
        { type: 'separator' },
        { role: 'window' }
      ] : [
        { role: 'close' }
      ])
    ]
  },
  {
    role: 'help',
    submenu: [
      {
        label: 'Learn More',
        click: async () => {
          const { shell } = require('electron')
          await shell.openExternal('https://electronjs.org')
        }
      }
    ]
  }
]

const menu = Menu.buildFromTemplate(template)
Menu.setApplicationMenu(menu)
