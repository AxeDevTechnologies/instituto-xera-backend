import { storage } from './config';
import {ref, uploadBytes, getDownloadURL, StorageReference } from "firebase/storage";

export const uploadFile = async (name: string, file: Blob | Uint8Array | ArrayBuffer, contentType: string) => {
    const storageRef = ref(storage, name);
    const metadata = {contentType};
    await uploadBytes(storageRef, file, metadata);
}

export const getURLVideo = async (videoName: string): Promise<string> => {
    try {
        const storageRef: StorageReference = ref(storage, videoName);
        const url: string = await getDownloadURL(storageRef);
        return url;
    }
    catch(err) {
        throw new Error('Error al cargar el vídeo');
    }
}

export const getImageVideo = async (videoName: string): Promise<string> => {
    try {
        const storageRef: StorageReference = ref(storage, videoName);
        const url: string = await getDownloadURL(storageRef);
        return url;
    }
    catch(err) {
        return 'No hay imagen disponible';
    }
}