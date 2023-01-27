import { io } from 'socket.io-client';
export const socket = io("http://localhost:3000");

function Sock() {
    return (<div></div>);
}

export default Sock;