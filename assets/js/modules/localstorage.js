// Local Storage Module

export default function saveDataModule(data){
    localStorage.setItem('saveDataModule', JSON.stringify(data));
}


export function loadStorageModule(key){
    const data = localStorage.getItem(key);
    return JSON.parse(data);
}

export function removeStorageModule(key){
    localStorage.removeItem(key);
}