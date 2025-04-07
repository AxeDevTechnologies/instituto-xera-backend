import { initializeApp } from 'firebase/app';
import { getStorage } from 'firebase/storage';
import { getFirestore } from 'firebase/firestore'

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDhbWQr3u3ilLhgm_G-TYUB-paWTFqDR6A",
    authDomain: "institutoxeravideos.firebaseapp.com",
    projectId: "institutoxeravideos",
    storageBucket: "institutoxeravideos.firebasestorage.app",
    messagingSenderId: "158505016529",
    appId: "1:158505016529:web:227e20e1c0e975c4b239f0"
};
initializeApp(firebaseConfig);
const storage = getStorage();
const db = getFirestore('instituto-xera');

export { storage, db };