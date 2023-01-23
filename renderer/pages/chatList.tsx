import React, { useEffect } from 'react';
import Head from 'next/head';
import { user } from './home';
import { ipcRenderer } from 'electron';
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from '../../f_base';


//유저 접속, 새로운 통신 생성 요청
ipcRenderer.send('login', user['uid']);

function Next() {
  //새로운 유저 들어올 때마다 서버가 실행시킴 => 유저목록 업데이트됨
  ipcRenderer.on('login', (evt, arg) => {
    console.log(arg);
    getLogin();
  });

  //접속한 유저 목록
  const [loginUser, setLoginUser] = React.useState(['']);

  //firestore로 부터 접속한 유저 닉네임 받음
  const getLogin = async () => {
    const q = query(collection(db, "user"), where("state", "!=", "logout"));
    const querySnapshot = await getDocs(q);
    var getUser = [];
    querySnapshot.forEach((doc) => {
      getUser.push(doc.data().nick);
    });
    setLoginUser(getUser);
  }

  useEffect(() => {
    getLogin();
  });

  return (
    <React.Fragment>
      <Head>
        <title>Next - Nextron (with-typescript)</title>
      </Head>
      <ul>
        {loginUser.map((nick, n) => {
          return <li key={n}>{nick}</li>
        })}
      </ul>
    </React.Fragment >
  );
};

export default Next;
