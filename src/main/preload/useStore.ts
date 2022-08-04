import { BrowserWindowConstructorOptions, ipcRenderer } from 'electron';

function useStore() {
    return {
        get(val: string) {
            return ipcRenderer.sendSync('electron-store-get', val);
        },
        set(property: string, val: any) {
            ipcRenderer.send('electron-store-set', property, val);
        },
        clear() {
            ipcRenderer.send('electron-store-clear');
        },
        getPetSettings() {
            return ipcRenderer.sendSync('electron-store-get-pet-settings');
        },
        setPetSettings(val: BrowserWindowConstructorOptions) {
            return ipcRenderer.send('electron-store-set-pet-settings', val);
        },
        getPos() {
            return ipcRenderer.sendSync('electron-store-get-pos');
        },
        setPos(x: number, y: number) {
            return ipcRenderer.send('electron-store-set-pos', x, y);
        },
    };
}

export default useStore;
