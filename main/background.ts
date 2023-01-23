import { app, BrowserWindow, ipcMain } from 'electron';
import serve from 'electron-serve';
import { createWindow } from './helpers';

const isProd: boolean = process.env.NODE_ENV === 'production';

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

//채널 목록
const chn = [];

//새로운 유저 접속
ipcMain.on('login', (evt, arg) => {
  console.log('새로운 접속:', arg);

  chn.push(evt);

  //등록된 모든 채널에 새로운 유저 왔음을 알림(=> 클라이언트 유저 목록 업뎃)
  chn.map((value) => {
    value.sender.send('login', '새로운 유저 접속!');
  })
});

// //클라이언트로 부터 수신
// ipcMain.on('loginUser', (evt, arg) => {
//   onLogUser(arg);
//   console.log(evt);
//   // console.log(logOnUser); //수신내용
//   evt.sender.send('loginUser', logOnUser);
// })