import { initializeApp } from 'firebase/app';
import { getStorage } from 'firebase/storage';
import { getFirestore } from 'firebase/firestore'

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyALwMgd2UMZJ4AjtNBQPzDLPrhMAZAs0Vc",
    authDomain: "institutoxeravideos.firebaseapp.com",
    projectId: "institutoxeravideos",
    storageBucket: "institutoxeravideos.firebasestorage.app",
    messagingSenderId: "158505016529",
    appId: "1:158505016529:web:f9b692201db92565b239f0"
};
initializeApp(firebaseConfig);
const storage = getStorage();
const db = getFirestore('instituto-xera');

export { storage, db };