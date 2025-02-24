import { storage } from './config';
import {ref, uploadBytes, getDownloadURL, StorageReference, deleteObject } from "firebase/storage";

export const uploadFile = async (name: string, file: Blob | Uint8Array | ArrayBuffer, contentType: string) => {
    try {
        const storageRef = ref(storage, name);
        const metadata = {contentType};
        await uploadBytes(storageRef, file, metadata);
    }
    catch(err) {
        console.log({err},'++++++');
    }
}

export const getURLVideo = async (videoName: string): Promise<string> => {
    try {
        const storageRef: StorageReference = ref(storage, videoName);
        const url: string = await getDownloadURL(storageRef);
        return url;
    }
    catch(err) {
        console.log({err}, 'obtener video');
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

export const deleteFile = async(filePath: string) => {
    try {
        const fileRef = ref(storage, filePath);
        await deleteObject(fileRef);
    }
    catch(err) {
        console.log({err}, 'videoooooo');
        return 'Error al eliminar el archivo';
    }
}