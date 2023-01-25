import React, { useEffect } from 'react';
import Head from 'next/head';
import { socket } from './socket';


socket.emit('userList', '로그인유저 보내줘');
function Next() {

  const [loginUser, setLoginUser] = React.useState(['']);

  useEffect(() => {
    socket.on('userList', (arg) => {
      setLoginUser(arg);
    })
  })

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
