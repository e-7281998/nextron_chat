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
  const [errorMsg, setErrorMsg] = useState('');

  const auth = getAuth(app);
  const router = useRouter();

  const onChangeEmail = (e) => {
    setEmail(e.target.value);
  };

  const onChangePassword = (e) => {
    setPassword(e.target.value);
  };

  function btnTxt() {
    setErrorMsg('');
    setBtnNum((n) => n === 1 ? 0 : 1);
  };

  const onLog = async (e) => {
    e.preventDefault();
    if (checkEmail()) return;
    if (checkPw()) return;

    const btnId = e.target.innerText;
    try {
      var userCredential: object;
      var routePage: string;
      switch (btnId) {
        case '회원가입':
          userCredential = await createUserWithEmailAndPassword(auth, email, password);
          routePage = '/nick';
          break;
        case '로그인':
          userCredential = await signInWithEmailAndPassword(auth, email, password);
          routePage = '/nick';
          break;
        default:
          break;
      }

      user = userCredential['user'];
      router.push({ pathname: routePage });

    } catch (error) {
      const errorMessage = error['message'];

      if (errorMessage.includes('auth/user-not-found')) {
        setErrorMsg('등록되지 않은 사용자 입니다.');
      } else if (errorMessage.includes('auth/wrong-password')) {
        setErrorMsg('비밀번호를 확인하세요.');
      } else if (errorMessage.includes('auth/weak-password')) {
        setErrorMsg('비밀번호는 6자리 이상 사용해주세요.')
      } else if (errorMessage.includes('email-already-in-use')) {
        setErrorMsg('이미 등록된 사용자 입니다.');
      } else {
        setErrorMsg('이메일을 확인해주세요.');
      }
    }

  };

  //이메일 형식 확인
  const checkEmail = () => {
    const mail = email.trim();
    if (mail === '') {
      setErrorMsg('이메일을 작성해주세요.');
      return 1;
    }
    if (!mail.includes('@') || !mail.includes('.')) {
      setErrorMsg('이메일 형식인지 확인해주세요.');
      return 1;
    }
    return 0;
  };

  //비밀번호 형식 확인
  const checkPw = () => {
    const pw = password.trim();
    if (pw === '') {
      setErrorMsg('공백은 비밀번호로 사용할 수 없습니다.');
      return 1;
    }
    return 0;
  };

  return (
    <div>
      <form className={`${styles.container}`}>
        <input type="email" placeholder='이메일을 입력하세요.' value={email} onChange={onChangeEmail} />
        <input type="password" placeholder='비밀번호를 입력하세요.' value={password} onChange={onChangePassword} />
        <p className='errMsg'>{errorMsg}</p>
        <div>
          <button type='submit' onClick={onLog}>
            {btnNum === 0 ? '로그인' : '회원가입'}
          </button>
          <Link href="#">
            <a onClick={btnTxt}>{btnNum === 1 ? '로그인' : '회원가입'}</a>
          </Link>
        </div>
      </form>
    </div>

  );
};

export default Home;
