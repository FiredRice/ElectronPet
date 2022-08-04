import { app, BrowserWindow, BrowserWindowConstructorOptions, ipcMain } from 'electron';
import Store from 'electron-store';
import fs from 'fs';
import { createNewWindow } from './createNewWindow';
import { mergeExcludeArr } from '../../renderer/utils';
import { getAssetPath } from '../main';

/**
 * 主进程与渲染进程通信监听
 */
export default class IpcRenders {
    private mainWindow: BrowserWindow | null;
    private store: Store;

    constructor() {
        this.mainWindow = null;
        this.store = new Store();
        this.init();
    }

    public setMainWindow(mainWindow: BrowserWindow) {
        this.mainWindow = mainWindow;
    }

    public getMainWindow() {
        return this.mainWindow;
    }

    public getStore() {
        return this.store;
    }

    public setPetSettings(value: BrowserWindowConstructorOptions) {
        const setCache = this.getPetSettings();
        this.store.set('pet-settings', mergeExcludeArr(setCache, value));
    }

    public getPetSettings() {
        return (this.store.get('pet-settings') || {}) as BrowserWindowConstructorOptions;
    }

    public setPostionStore(x: number, y: number) {
        this.store.set('main-window-pos', { x, y });
    }

    public getPositionStore() {
        return (this.store.get('main-window-pos') || null) as { x: number; y: number; } | null;
    }

    // 点击穿透转换
    public setClickIgnore(ignore: boolean) {
        if (ignore) {
            this.mainWindow?.setIgnoreMouseEvents(true, { forward: true });
        } else {
            this.mainWindow?.setIgnoreMouseEvents(false);
        }
        this.store.set('main-window-click-through', ignore);
    }

    // 获取点击穿透
    public getClickIgnore() {
        return (this.store.get('main-window-click-through') || false) as boolean;
    }

    // 设置开机自启
    public setAutoStart(auto: boolean) {
        if (!app.isPackaged) {
            app.setLoginItemSettings({
                openAtLogin: auto,
                path: process.execPath
            });
        } else {
            app.setLoginItemSettings({
                openAtLogin: auto,
            });
        }
        this.store.set('auto-start', auto);
    }

    // 开机自启配置
    public getAutoStart() {
        return (this.store.get('auto-start') || false) as boolean;
    }

    private init() {
        // 修改窗口大小
        ipcMain.on('set-main-window-size', (event, width, height) => {
            this.mainWindow?.setResizable(true);
            this.mainWindow?.setSize(width, height);
            this.setPetSettings({ width, height });
            this.mainWindow?.setResizable(false);
        });
        // 主窗体置顶切换
        ipcMain.on('set-main-window-on-top', (event, alwaysOnTop) => {
            this.mainWindow?.setAlwaysOnTop(alwaysOnTop);
            this.setPetSettings({ alwaysOnTop });
        });
        // 主窗体点击穿透切换
        ipcMain.on('set-main-window-click-through', (event, ignore) => {
            this.setClickIgnore(ignore);
        });
        // 获取点击穿透值
        ipcMain.on('get-main-window-click-through', async (event) => {
            event.returnValue = this.getClickIgnore();
        });
        // 获取开机自启
        ipcMain.on('get-auto-start', async (event) => {
            event.returnValue = this.getAutoStart();
        });
        // 设置开机自启
        ipcMain.on('set-auto-start', (event, auto) => {
            this.setAutoStart(auto);
        });

        // 获取资源路径
        ipcMain.on('get-asset-path', (event, ...paths) => {
            event.returnValue = getAssetPath(...paths);
        });
        // 读取文件
        ipcMain.on('read-file', (event, src) => {
            event.returnValue = fs.readFileSync(src);
        });

        // 新建窗口，并跳转到url
        ipcMain.on('create-new-window', (event, url) => {
            createNewWindow(url);
        });

        ipcMain.on('electron-store-get', async (event, val) => {
            event.returnValue = this.store.get(val);
        });

        ipcMain.on('electron-store-set', (event, key, val) => {
            this.store.set(key, val);
        });

        ipcMain.on('electron-store-clear', (event) => {
            this.store.clear();
        });

        ipcMain.on('electron-store-get-pet-settings', async (event) => {
            event.returnValue = this.getPetSettings();
        });

        ipcMain.on('electron-store-set-pet-settings', (event, val) => {
            this.setPetSettings(val);
        });

        ipcMain.on('electron-store-get-pos', async (event) => {
            event.returnValue = this.getPositionStore();
        });

        ipcMain.on('electron-store-set-pos', (event, x, y) => {
            this.setPostionStore(x, y);
        });

    }
}
