import { useEffect, useState } from 'react';
import { socket } from './socket';
import { room } from './chatList';
import { useRouter } from 'next/router';
import styles from '../style/Room.module.css';

window.addEventListener('resize', () => {
    setChatHeight();
    setChatScroll();
});

//채팅 창 조절
function setChatHeight() {
    const winH = window.innerHeight;
    const div = document.getElementsByTagName('div')[2];
    const form = document.querySelector('form');
    const divH = div.offsetHeight;
    const formH = form.offsetHeight;
    const chatH = winH - divH - formH - 40;
    const ul = document.querySelector('ul');
    ul.style.height = chatH + 'px';
};

//채팅창 스크롤 하단으로
function setChatScroll() {
    const ul = document.getElementsByTagName('ul')[0];
    ul.scrollTop = ul.scrollHeight;
};

//새로운 유저 입장, 떠남
socket.on('welcome_leave', (arg) => {
    updateChat(arg, 'offi');
});

//새 메시지 도착
socket.on('newMsg', (nick, msg) => {
    updateChat(`${nick} : ${msg}`, 'user');
});

function updateChat(msg: string, who: string) {
    const ul = document.querySelector("ul");
    const li = document.createElement("li");
    const span = document.createElement("span");
    span.textContent = msg;
    li.appendChild(span);
    ul.appendChild(li);
    li.classList.add(who);
    setChatScroll();
};


function Room() {
    const [msg, setMsg] = useState('');
    const router = useRouter();

    function changeMsg(e) {
        setMsg(e.target.value);
    };

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
    };

    useEffect(() => {
        setChatHeight();
    }, []);

    return (
        <div className={`${styles.wrap}`}>
            <div className='roomTitle'>
                <p>{room}</p>
                <button className='lightBlue' onClick={leaveRoom}>채팅방 나가기</button>
            </div>
            <ul className={`${styles.chat}`}>
                <li className='offi'>{room}에 입장했습니다!</li>
            </ul>
            <form className={`${styles.send}`}>
                <input type="text" value={msg} onChange={changeMsg} />
                <button onClick={sendMsg}>전송</button>
            </form>
        </div>
    );
};

export default Room;