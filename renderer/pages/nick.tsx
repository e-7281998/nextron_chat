import { useState } from 'react';
import { useRouter } from 'next/router';
import { socket } from './socket';
import styles from '../style/Nick.module.css';

socket.emit('connection', '클라이언트가 접속함');

function Nick() {
    const [errorMsg, setErrorMsg] = useState('');
    const [nick, setNick] = useState('');
    const router = useRouter();

    const onchangeNick = (e) => {
        setNick(e.target.value);
    };

    const saveNick = (e) => {
        e.preventDefault();
        const nickName = nick.trim();
        if (nickName === '') {
            setErrorMsg('공백은 닉네임으로 사용할 수 없습니다.');
            return;
        }
        if (nickName.length > 10) {
            setErrorMsg('10글자 이하로 작성해주세요.');
            return;
        }
        socket.emit("makeNick", nickName);
        router.replace({ pathname: '/chatList' });
    };

    return (
        <form className={`${styles.container}`}>
            <input type="text" placeholder='닉네임을 입력하세요.' value={nick} onChange={onchangeNick} />
            <button onClick={saveNick}>저장하기</button>
            <p className='errMsg'>{errorMsg}</p>
        </form>
    );
};

export default Nick;
