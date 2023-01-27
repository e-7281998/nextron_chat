import { useState } from 'react';
import { socket } from './socket';
import { room } from './chatList';
import { useRouter } from 'next/router';
import styles from '../style/Room.module.css';


//새로운 유저 입장, 떠남
socket.on('welcome_leave', (arg) => {
    console.log(arg);
    updateChat(arg, 'offi');
    // updateChat(arg);
})

//새 메시지 도착
socket.on('newMsg', (nick, msg) => {
    updateChat(`${nick} : ${msg}`, 'user');
    console.log('이게 두번인가')
    // updateChat(`${nick} : ${msg}`);
});

function updateChat(msg: string, who: string) {
    const ul = document.querySelector("ul");
    const li = document.createElement("li");
    const span = document.createElement("span");
    span.textContent = msg;
    li.appendChild(span);
    ul.appendChild(li);
    console.log('업뎃에 문제있나')
    li.classList.add(who);
    // setChat((prev) => [...prev, msg]);
}


function Room() {
    const [msg, setMsg] = useState('');
    const [chat, setChat] = useState([`${room}에 입장했습니다!`]);
    const router = useRouter();

    function changeMsg(e) {
        setMsg(e.target.value);
    }

    //메시지 보내기
    function sendMsg(e) {
        e.preventDefault();
        if (msg == '') return;
        socket.emit('sendMag', room, msg);
        setMsg('');
        updateChat(msg, 'me');
    }

    //채팅방 나가기
    function leaveRoom(e) {
        e.preventDefault();
        socket.emit('leaveRoom', room, () => {
            router.replace({ pathname: '/chatList' });
        });
    }

    return (
        <div className={`${styles.wrap}`}>
            <div>
                <p>{room}</p>
                <button className='lightBlue' onClick={leaveRoom}>채팅방 나가기</button>
            </div>
            <ul className={`${styles.chat}`}>
                <li className='offi'>${room}에 입장했습니다!</li>
            </ul>
            <form className={`${styles.send}`}>
                <input type="text" value={msg} onChange={changeMsg} />
                <button onClick={sendMsg}>전송</button>
            </form>
        </div>
    );
};

export default Room;