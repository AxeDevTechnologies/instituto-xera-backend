import { initializeApp } from "firebase/app";
import { getStorage, ref, uploadBytes } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyALwMgd2UMZJ4AjtNBQPzDLPrhMAZAs0Vc",
    authDomain: "institutoxeravideos.firebaseapp.com",
    projectId: "institutoxeravideos",
    storageBucket: "institutoxeravideos.firebasestorage.app",
    messagingSenderId: "158505016529",
    appId: "1:158505016529:web:f9b692201db92565b239f0"
};
const app = initializeApp(firebaseConfig);
const storage = getStorage();

export const uploadFile = async (name: string, file: Blob | Uint8Array | ArrayBuffer, contentType: string) => {
    const storageRef = ref(storage, name);
    const metadata = {contentType};
    await uploadBytes(storageRef, file, metadata);
}