import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import { socket } from './socket';
import { useRouter } from 'next/router';

export var room = '';

function List() {
  const router = useRouter();

  const [loginUser, setLoginUser] = React.useState(['']);
  const [roomName, setRoomName] = useState('');
  const [listValue, setListValue] = useState('1');

  function changeRoomNname(e) {
    setRoomName(e.target.value)
  }

  function makeChatRoom(e) {
    e.preventDefault();
    const roomType = e.target.value;
    console.log(roomType)
    socket.emit("makeChatRoom", roomName, roomType);
    room = roomName;
    router.replace({ pathname: '/room' });
  }

  function showList(e) {
    e.preventDefault();
    const val = e.target.vlaue;
    setListValue(val);
  }

  socket.on('userList', (arg) => {
    setLoginUser(arg);
  })

  useEffect(() => {
    //로그인 유저 요청
    socket.emit('userList', '로그인유저 보내줘');
  }, [])

  return (
    <React.Fragment>
      <Head>
        <title>Next - Nextron (with-typescript)</title>
      </Head>
      <div>
        <p>채팅방 이름</p>
        <form>
          <input type="text" value={roomName} onChange={changeRoomNname} />
          <button onClick={makeChatRoom} value="1" >1 : 1 채팅</button>
          <button onClick={makeChatRoom} value="2" >그룹 채팅</button>
        </form>
        <hr />
      </div>
      <div>
        <button onClick={showList} value="1">접속중인 유저</button>
        <button onClick={showList} value="2">채팅 방</button>
      </div>
      <hr />
      <ul>
        {loginUser.map((nick, n) => {
          return <li key={n}>{nick}</li>
        })}
      </ul>

    </React.Fragment >
  );
};

export default List;

// {listValue === '1' ? <ul>
//         {loginUser.map((nick, n) => {
//           return <li key={n}>{nick}</li>
//         })}
//       </ul>
//         : <ul>
//           {loginUser.map((nick, n) => {
//             return <li key={n}>{nick}</li>
//           })}
//         </ul>}
