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
  const [roomList, setRoomList] = useState(['생성된 채팅방이 없습니다.']);

  function changeRoomNname(e) {
    setRoomName(e.target.value)
  }

  //채팅방 만들기, 입장하기
  function enterRoom(e) {
    e.preventDefault();
    const roomType = e.target.value;
    roomType === '0' ? room = e.target.previousSibling.innerText : room = roomName;
    socket.emit("enterRoom", room);
    router.replace({ pathname: '/room' });
  }

  //목록 보이기
  function showList(e) {
    e.preventDefault();
    const val = e.target.value;
    console.log(val)
    setListValue(val);
  }

  socket.on('userList', (arg) => {
    setLoginUser(arg);
  })
  socket.on('chatList', (arg) => {
    setRoomList(arg);
  })

  useEffect(() => {
    //로그인 유저 요청
    socket.emit('userList', '로그인유저 보내줘');
    socket.emit("chatList", '생성된 채팅 방 보여줘')
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
          <button onClick={enterRoom} value="1" >1 : 1 채팅</button>
          <button onClick={enterRoom} value="2" >그룹 채팅</button>
        </form>
        <hr />
      </div>
      <div>
        <button onClick={showList} value="1">접속중인 유저</button>
        <button onClick={showList} value="2">채팅 방</button>
      </div>
      <hr />
      {listValue == '1' ? <ul>
        {loginUser.map((nick, n) => {
          return <li key={n}>{nick}</li>
        })}
      </ul>
        : <ul>
          {roomList.map((rm, n) => {
            return <li key={n}><p>{rm}</p><button onClick={enterRoom} value="0">참여하기</button></li>
          })}
        </ul>}

    </React.Fragment >
  );
};

export default List;