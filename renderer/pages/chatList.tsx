import { useEffect, useState } from 'react';
import { socket } from './socket';
import { useRouter } from 'next/router';
import { UserList } from './userList';
import styles from '../style/List.module.css';

export var room = '';

function List() {
  const router = useRouter();

  const [roomName, setRoomName] = useState('');
  const [listValue, setListValue] = useState('1');
  const [roomList, setRoomList] = useState(['생성된 채팅방이 없습니다.']);
  const [errMsg, setErrMsg] = useState('');

  function changeRoomNname(e) {
    setRoomName(e.target.value)
  }

  //채팅방 만들기, 입장하기
  function enterRoom(e) {
    e.preventDefault();
    var roomType = e.target.value;

    if (roomType === '0') {
      room = e.target.previousSibling.innerText;
      socket.emit("enterRoom", room, roomType);
    } else {
      room = roomName.trim();
      if (room == '') {
        setErrMsg('채팅방 이름을 작성해 주세요.');
        return;
      }
      if (roomList.indexOf(room) >= 0) {
        setErrMsg('이미 존재하는 방 입니다.');
        return;
      } else {
        socket.emit("enterRoom", room, roomType);
      }
    }
  }

  //목록 보이기
  function showList(e) {
    e.preventDefault();
    const val = e.target.value;
    console.log(val)
    setListValue(val);
  }

  socket.on('chatList', (arg) => {
    setRoomList(arg);
  })

  useEffect(() => {
    socket.emit("chatList", '생성된 채팅 방 보여줘')

    socket.on("unableRoom", (msg) => {
      setErrMsg(msg);
    })
    socket.on("ableRoom", () => {
      router.replace({ pathname: '/room' });
    })
  }, [])

  return (
    <div className={`${styles.wrap}`}>
      <div className={`${styles.listBtnContainer}`}>
        <button onClick={showList} value="1">접속중인 유저</button>
        <button onClick={showList} value="2">채팅 방</button>
      </div>
      {listValue == '1' ? <UserList />
        : <div>
          <form className={`${styles.makeRoom}`}>
            <p>채팅방 이름</p>
            <input type="text" value={roomName} onChange={changeRoomNname} placeholder="채팅 방 이름을 정하세요." />
            <div>
              <button onClick={enterRoom} value="1" >1 : 1 채팅</button>
              <button onClick={enterRoom} value="2" >그룹 채팅</button>
            </div>
          </form>
          <p className='errMsg'>{errMsg}</p>
          <ul className={`${styles.roomList}`}>
            {roomList.map((rm, n) => {
              return <li key={n}><p>{rm}</p><button className='lightBlue' onClick={enterRoom} value="0">참여하기</button></li>
            })}
          </ul>
        </div>}
    </div>
  );
};

export default List;