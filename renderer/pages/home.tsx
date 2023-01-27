import { useState } from 'react';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { app } from '../../f_base';
import Link from 'next/link';
import { useRouter } from 'next/router';
import styles from '../style/Home.module.css';

export let user: object;

function Home() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [btnNum, setBtnNum] = useState(0);

  const auth = getAuth(app);
  const router = useRouter();

  const onChangeEmail = (e) => {
    setEmail(e.target.value);
  }

  const onChangePassword = (e) => {
    setPassword(e.target.value);
  }
  function btnTxt() {
    setBtnNum((n) => n === 1 ? 0 : 1);
  }

  const onLog = async (e) => {
    e.preventDefault();
    const btnId = e.target.innerText;
    console.log(btnId);
    try {
      var userCredential: object;
      var routePage: string;
      switch (btnId) {
        case '회원가입':
          userCredential = await createUserWithEmailAndPassword(auth, email, password)
          routePage = '/nick';
          break;
        case '로그인':
          userCredential = await signInWithEmailAndPassword(auth, email, password)
          routePage = '/nick';
          break;
        default:
          break;
      }

      user = userCredential['user'];
      console.log(`${btnId} 성공`);
      console.log(user['uid'])
      router.push({ pathname: routePage });

    } catch (error) {
      const errorCode = error['code'];
      const errorMessage = error['message'];
      console.log(`${btnId} 실패 : ${errorMessage}`);
    }

  }

  return (
    <form className={`${styles.container}`}>
      <input type="email" placeholder='이메일을 입력하세요.' value={email} onChange={onChangeEmail} />
      <input type="password" placeholder='비밀번호를 입력하세요.' value={password} onChange={onChangePassword} />
      <div>
        <button type='submit' onClick={onLog}>
          {btnNum === 0 ? '로그인' : '회원가입'}
        </button>
        <Link href="#">
          <a onClick={btnTxt}>{btnNum === 1 ? '로그인' : '회원가입'}</a>
        </Link>
      </div>
    </form>
  );
};

export default Home;
