import { storage } from './config';
import {ref, uploadBytes } from "firebase/storage";

export const uploadFile = async (name: string, file: Blob | Uint8Array | ArrayBuffer, contentType: string) => {
    const storageRef = ref(storage, name);
    const metadata = {contentType};
    await uploadBytes(storageRef, file, metadata);
}