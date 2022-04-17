const { BrowserWindow, app } = require("electron")
require("electron-reloader")(module);

const createWindow = () => {
    const mainWindow = new BrowserWindow({
        width: 900,
        height: 700,
    })

    mainWindow.loadFile("index.html")
};

app.whenReady().then(createWindow);