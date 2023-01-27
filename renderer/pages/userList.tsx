import { useEffect, useState } from "react";
import { socket } from './socket';
import styles from '../style/UserList.module.css';

export function UserList() {

    const [loginUser, setLoginUser] = useState(['']);

    socket.on('userList', (arg) => {
        setLoginUser(arg);
    })

    useEffect(() => {
        socket.emit('userList', '로그인유저 보내줘');
    }, [])

    return (
        <ul className={`${styles.userList}`}>
            {loginUser.map((nick, n) => {
                return <li key={n}>{nick}</li>
            })}
        </ul>
    )
}