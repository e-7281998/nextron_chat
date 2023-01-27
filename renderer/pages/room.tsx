import { createElement, useEffect, useState } from 'react';
import { socket } from './socket';
import { room } from './chatList';
import { useRouter } from 'next/router';

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
        updateChat(msg, 'offi');
    }

    useEffect(() => {
        //새로운 유저 입장, 떠남
        socket.on('welcome_leave', (arg) => {
            console.log(arg);
            updateChat(arg, 'me');
            // updateChat(arg);
        })

        //새 메시지 도착
        socket.on('newMsg', (nick, msg) => {
            updateChat(`${nick} : ${msg}`, 'user');
            // updateChat(`${nick} : ${msg}`);
        })
    }, [])

    //채팅 내용 업뎃
    function updateChat(msg: string, who: string) {
        const btnClick = document.querySelector("ul");
        const li = document.createElement("li");
        li.textContent = msg;
        btnClick.appendChild(li);
        li.classList.add(who);

        // setChat((prev) => [...prev, msg]);
    }

    //채팅방 나가기
    function leaveRoom(e) {
        e.preventDefault();
        socket.emit('leaveRoom', room, () => {
            router.replace({ pathname: '/chatList' });
        });
    }

    return (
        <div>
            <p>{room}</p>
            <button onClick={leaveRoom}>채팅방 나가기</button>
            <ul>
                <li className='offi'>${room}에 입장했습니다!</li>
            </ul>
            <form>
                <input type="text" value={msg} onChange={changeMsg} />
                <button onClick={sendMsg}>전송</button>
            </form>
        </div>
    );
};

export default Room;