import React, { useState } from 'react';
import Head from 'next/head';
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { app } from '../../f_base';

function Home() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const auth = getAuth(app);


  const onChangeEmail = (e) => {
    setEmail(e.target.value);
  }

  const onChangePassword = (e) => {
    setPassword(e.target.value);
  }

  const onSignIn = (e) => {
    e.preventDefault();
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in 
        const user = userCredential.user;
        console.log('성공', userCredential);
        // ...
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log('실패');
        console.log(errorCode, errorMessage);
        // ..
      });
  }

  return (
    <React.Fragment>
      <Head>
        <title>Nextron Chat</title>
      </Head>
      <div>
        <form>
          <input type="email" placeholder='이메일을 입력하세요.' value={email} onChange={onChangeEmail} />
          <input type="password" placeholder='비밀번호를 입력하세요.' value={password} onChange={onChangePassword} />
          <button type='submit' onClick={onSignIn}>회원가입</button>
        </form>
      </div>
    </React.Fragment>
  );
};


// function Home() {
//   const [msg, setMsg] = useState('');
//   const onChangeMsg = (e) => {
//     setMsg(() => e.target.value);
//   }
//   const sendInfo = (e) => {
//     e.preventDefault();

//     //서버로 송신
//     ipcRenderer.send('sendMessage', msg);
//     //서버로부터 수신
//     ipcRenderer.on('replyMessage', (evt, arg) => {
//       console.log(arg);
//       console.log(evt);
//     })

//     setMsg('')
//   }

//   return (
//     <React.Fragment>
//       <Head>
//         <title>Home - Nextron (with-typescript)</title>
//       </Head>
//       <div>
//         <form>
//           <input type="text" id="textInput" value={msg} onChange={onChangeMsg} />
//           <button onClick={sendInfo} id="btn">전송</button>
//         </form>
//       </div>
//     </React.Fragment>
//   );
// };

export default Home;
