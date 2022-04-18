const { BrowserWindow, app, dialog } = require("electron")
const fs = require('fs');
require("electron-reloader")(module);
let open_File;

const createWindow = () => {
    const mainWindow = new BrowserWindow({
        width: 900,
        height: 700,
    })
    mainWindow.loadFile("index.html")
};

function openFile() {
  const files = dialog.showOpenDialogSync( {
    properties: ['openFile']})

    if(!files) {
      console.log("nope")
      return
    }

    const file = files[0];
    const fileContent = fs.readFileSync(file).toString();
    open_File = fileContent
    console.log(open_File);
}

app.whenReady().then(createWindow);
