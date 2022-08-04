import { app, Menu, Tray } from 'electron';
import { createUniqueWindow } from './ipcUtil/createNewWindow';
import IpcRenders from './ipcUtil/ipcMonitors';
import { getAssetPath } from './main';

export default class TrayBuilder {
    private ipcRenders: IpcRenders;
    private tray: Tray;

    constructor(ipcRenders: IpcRenders) {
        this.ipcRenders = ipcRenders;
        this.tray = new Tray(getAssetPath('icon.png'));;
        this.init();
    }

    public getTray() {
        return this.tray;
    }

    public init() {
        const contextMenu = Menu.buildFromTemplate([
            {
                label: '窗口置顶',
                type: 'checkbox',
                checked: this.ipcRenders.getPetSettings().alwaysOnTop || false,
                click: () => {
                    const alwaysOnTop = !(this.ipcRenders.getPetSettings().alwaysOnTop || false);
                    this.ipcRenders.setPetSettings({ alwaysOnTop });
                    const mainWindow = this.ipcRenders.getMainWindow();
                    mainWindow?.setAlwaysOnTop(alwaysOnTop);
                }
            },
            {
                label: '设置',
                type: 'normal',
                click: () => {
                    createUniqueWindow('/settings');
                }
            },
            { label: '', type: 'separator' },
            {
                label: '关闭',
                type: 'normal',
                click: () => {
                    app.quit();
                }
            }
        ]);
        this.tray.setToolTip('l2d');
        this.tray.setContextMenu(contextMenu);
        this.tray.on('click', (event, bounds, position) => {
            const mainWindow = this.ipcRenders.getMainWindow();
            mainWindow?.focus();
            mainWindow?.show();
        });
    }
}
