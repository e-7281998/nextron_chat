import { app, BrowserWindow } from 'electron';
import serve from 'electron-serve';
import { createWindow } from './helpers';
import { Server } from "socket.io";

const isProd: boolean = process.env.NODE_ENV === 'production';

const io = new Server(3000, {
  cors: {
    origin: "*",
  }
});

function publicRooms() {
  const {
    sockets: {
      adapter: { sids, rooms },
    },
  } = io;

  const publicRooms = [];
  rooms.forEach((_, key) => {
    if (sids.get(key) === undefined) {
      publicRooms.push(key);
    }
  });

  return publicRooms;
};

const socketList = [];

io.on("connection", (socket) => {
  console.log('클라이언트와 연결됨');

  socketList.push(socket);
  socket["nickName"] = 'anoun';

  //연결 종료, 접속 중 유저 업뎃 해줌
  socket.on("disconnect", () => {
    console.log('연결종료 요청 소켓', socket.id);
    const n = socketList.indexOf(socket);
    socketList.splice(n, 1);
    userList();
  });

  //닉네임 받아서 등록
  socket.on("makeNick", (nick) => {
    socket["nickName"] = nick;
  });

  //사용중인 유저 목록 전송
  socket.on('userList', () => {
    userList();
  });

  //생성된 채팅방 목록 전송
  socket.on('chatList', () => {
    sendRoomList();
  });

  //채팅 방 만들기, 입장하기
  socket.on("enterRoom", (roomName, roomType) => {
    //기존 방 입장
    if (!(roomType === '0')) {
      enterRoomMsg(socket, roomName);
      io.sockets.adapter.rooms.get(roomName)["type"] = roomType;
    }
    //방 신설
    if (roomType === '0') {
      if (io.sockets.adapter.rooms.get(roomName)["type"] === '1') { //1:1 채팅방
        if (io.sockets.adapter.rooms.get(roomName)?.size == 2) {  //1:1 인원 다 찬 경우
          socket.emit("unableRoom", "[1:1 채팅방] 인원이 다 찼습니다.");
        } else {
          enterRoomMsg(socket, roomName);
        }
      } else {  //그룹방 신설
        enterRoomMsg(socket, roomName);
      }
    }
    ;
  })

  //메시지 받고, 모두에게 보냄
  socket.on("sendMag", (roomName, msg) => {
    socket.to(roomName).emit("newMsg", socket["nickName"], msg);
  })

  //채팅 방 나가기
  socket.on("leaveRoom", (roomName, done) => {
    socket.leave(roomName);
    socket.to(roomName).emit("welcome_leave", `${socket["nickName"]}님이 채팅방을 나갔습니다.`);
    done();
  })

});

function enterRoomMsg(socket, roomName) {
  socket.join(roomName);
  socket.emit("ableRoom");
  socket.to(roomName).emit("welcome_leave", `${socket["nickName"]}님이 입장했습니다!`);
  sendRoomList();
}

function sendRoomList() {
  io.sockets.emit("chatList", publicRooms());
}

//사용자 목록 정리
function userList() {
  const userList = [];
  socketList.map((sk) => {
    userList.push(sk["nickName"]);
  })
  socketList.map((sk) => {
    sk.emit("userList", userList);
  })
}

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
    },
  })

  const subWin2 = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    },
  })

  // const subWin3 = new BrowserWindow({
  //   width: 800,
  //   height: 600,
  //   webPreferences: {
  //     nodeIntegration: true,
  //     contextIsolation: false
  //   },
  // })

  if (isProd) {
    await mainWindow.loadURL('app://./home.html');
  } else {
    const port = process.argv[2];
    await mainWindow.loadURL(`http://localhost:${port}/home`);
    mainWindow.webContents.openDevTools();
    //새로운 창 하나 더 만듬 완성 후 지울 것.
    await subWin.loadURL(`http://localhost:${port}/home`);
    await subWin2.loadURL(`http://localhost:${port}/home`);
    // await subWin3.loadURL(`http://localhost:${port}/home`);
  }

})();

app.on('window-all-closed', () => {
  app.quit();
});
