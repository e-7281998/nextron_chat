import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';
import dotenv from 'dotenv';

dotenv.config();

const firebaseConfig = {
    apiKey: 'AIzaSyBP033UxGwRSqHG4x7k-S09s0UZTgq-Bi0',
    authDomain: 'nextron-chat-bdbd4.firebaseapp.com',
    projectId: 'nextron-chat-bdbd4',
    storageBucket: 'nextron-chat-bdbd4.appspot.com',
    messagingSenderId: '244649616053',
    appId: '1:244649616053:web:f19faeb05cda2acc6b54fc',
    measurementId: 'G-HGVP0L68V1'
};

export const app = initializeApp(firebaseConfig);

const firebaseApp = app;

export const db = getFirestore(firebaseApp);