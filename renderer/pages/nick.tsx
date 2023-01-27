import { useState } from 'react';
import { useRouter } from 'next/router';
import { socket } from './socket';
import styles from '../style/Nick.module.css';

socket.emit('connection', '클라이언트가 접속함');

function Nick() {
    const [nick, setNick] = useState('');
    const router = useRouter();

    const onchangeNick = (e) => {
        setNick(e.target.value);
    };

    const saveNick = (e) => {
        e.preventDefault();
        socket.emit("makeNick", nick);
        router.replace({ pathname: '/chatList' });
    };

    return (
        <form className={`${styles.container}`}>
            <input type="text" placeholder='닉네임을 입력하세요.' value={nick} onChange={onchangeNick} />
            <button onClick={saveNick}>저장하기</button>
        </form>
    );
};

export default Nick;
