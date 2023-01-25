import { app, BrowserWindow, ipcMain } from 'electron';
import serve from 'electron-serve';
import { createWindow } from './helpers';

const isProd: boolean = process.env.NODE_ENV === 'production';

import { Server } from "socket.io";

const io = new Server(3000, {
  cors: {
    origin: "*",
  }
});

const socketList = []
const nickList = []

io.on("connection", (socket) => {
  console.log('클라이언트와 연결됨')
  socketList.push(socket);

  socket.on("makeNick", (nick) => {
    nickList.push(nick);
    console.log(nickList, '닉네임저장완료')
  })

  socket.on('userList', arg => {
    console.log(arg, '요청옴');
    socketList.map((sk) => {
      sk.emit("userList", nickList);
    })
  })

});



if (isProd) {
  serve({ directory: 'app' });
} else {
  app.setPath('userData', `${app.getPath('userData')} (development)`);
}

(async () => {
  await app.whenReady();

  const mainWindow = createWindow('main', {
    width: 1000,
    height: 600,
  });

  //새로운 창 하나 더 만듬 완성 후 지울 것.
  const subWin = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  })

  if (isProd) {
    await mainWindow.loadURL('app://./home.html');
  } else {
    const port = process.argv[2];
    await mainWindow.loadURL(`http://localhost:${port}/home`);
    mainWindow.webContents.openDevTools();
    //새로운 창 하나 더 만듬 완성 후 지울 것.
    await subWin.loadURL(`http://localhost:${port}/home`);
  }


})();

app.on('window-all-closed', () => {
  app.quit();
});
