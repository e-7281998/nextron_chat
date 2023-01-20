import React, { useState } from 'react';
import Head from 'next/head';
import { ipcRenderer } from 'electron';

function Home() {
  const [msg, setMsg] = useState('');
  const onChangeMsg = (e) => {
    setMsg(() => e.target.value);
  }
  const sendInfo = (e) => {
    e.preventDefault();

    //서버로 송신
    ipcRenderer.send('sendMessage', msg);
    //서버로부터 수신
    ipcRenderer.on('replyMessage', (evt, arg) => {
      console.log(arg);
      console.log(evt);
    })

    setMsg('')
  }

  return (
    <React.Fragment>
      <Head>
        <title>Home - Nextron (with-typescript)</title>
      </Head>
      <div>
        <form>
          <input type="text" id="textInput" value={msg} onChange={onChangeMsg} />
          <button onClick={sendInfo} id="btn">전송</button>
        </form>
      </div>
    </React.Fragment>
  );
};

export default Home;
