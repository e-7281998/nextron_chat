import React, { useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { socket } from './socket';

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
    }

    return (
        <React.Fragment>
            <Head>
                <title>Next - Nextron (with-typescript)</title>
            </Head>
            <div>
                <p>사용하실 영문 닉네임을 입력하세요.</p>
                <form>
                    <input type="text" placeholder='Evan' value={nick} onChange={onchangeNick} />
                    <button onClick={saveNick}>저장하기</button>
                </form>
            </div>
        </React.Fragment>
    );
};

export default Nick;
