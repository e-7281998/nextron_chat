import React, { useState } from 'react';
import Head from 'next/head';
import { setDoc, doc } from 'firebase/firestore';
import { db } from '../../f_base';
import { user } from './home';
import { useRouter } from 'next/router';


function Nick() {
    const [nick, setNick] = useState('');
    const router = useRouter();

    const onchangeNick = (e) => {
        setNick(e.target.value);
    };

    const saveNick = async (e) => {
        e.preventDefault();
        await setDoc(doc(db, "user", user['uid']), {
            nick: nick,
        });
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
