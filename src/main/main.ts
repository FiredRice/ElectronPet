/* eslint global-require: off, no-console: off, promise/always-return: off */

/**
 * This module executes inside of electron's main process. You can start
 * electron renderer process from here and communicate with the other processes
 * through IPC.
 *
 * When running `npm run build` or `npm run build:main`, this file is compiled to
 * `./src/main.js` using webpack. This gives us some performance wins.
 */
import path from 'path';
import { app, BrowserWindow, BrowserWindowConstructorOptions, shell, Tray } from 'electron';
import { autoUpdater } from 'electron-updater';
import log from 'electron-log';
import MenuBuilder from './menu';
import { resolveHtmlPath } from './util';
import IpcRenders from './ipcUtil/ipcMonitors';
import TrayBuilder from './tray';
import { mergeExcludeArr } from '../renderer/utils';

export default class AppUpdater {
    constructor() {
        log.transports.file.level = 'info';
        autoUpdater.logger = log;
        autoUpdater.checkForUpdatesAndNotify();
    }
}

let mainWindow: BrowserWindow | null = null;

let tray: Tray | null = null;

// 进程通信监听
const ipcRenders = new IpcRenders();

if (process.env.NODE_ENV === 'production') {
    const sourceMapSupport = require('source-map-support');
    sourceMapSupport.install();
}

const isDevelopment =
    process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true';

if (isDevelopment) {
    require('electron-debug')();
}

const installExtensions = async () => {
    const installer = require('electron-devtools-installer');
    const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
    const extensions = ['REACT_DEVELOPER_TOOLS'];

    return installer
        .default(
            extensions.map((name) => installer[name]),
            forceDownload
        )
        .catch(console.log);
};

export const RESOURCES_PATH = app.isPackaged
    ? path.join(process.resourcesPath, 'assets')
    : path.join(__dirname, '../../assets');

export const getAssetPath = (...paths: string[]): string => {
    return path.join(RESOURCES_PATH, ...paths);
};

const position = ipcRenders.getPositionStore();

const mainConfig: BrowserWindowConstructorOptions = isDevelopment ? {
    show: true,
    width: 600,
    height: 600,
    center: position == null,
    resizable: false,
    skipTaskbar: true,
    icon: getAssetPath('icon.png'),
    webPreferences: {
        preload: app.isPackaged
            ? path.join(__dirname, 'preload.js')
            : path.join(__dirname, '../../.erb/dll/preload.js'),
    },
} : {
    show: false,
    width: 150,
    height: 150,
    resizable: false,
    transparent: true,
    frame: false,
    center: position == null,
    minimizable: false,
    maximizable: false,
    alwaysOnTop: false,
    hasShadow: false,
    skipTaskbar: true,
    icon: getAssetPath('icon.png'),
    webPreferences: {
        devTools: false,
        preload: app.isPackaged
            ? path.join(__dirname, 'preload.js')
            : path.join(__dirname, '../../.erb/dll/preload.js'),
    },
};


const createWindow = async () => {
    if (isDevelopment) {
        await installExtensions();
    }

    // 获取窗体配置
    const settings = ipcRenders.getPetSettings();

    mainWindow = new BrowserWindow(mergeExcludeArr(mainConfig, settings));

    // 更新主窗体记录
    ipcRenders.setMainWindow(mainWindow);

    mainWindow.loadURL(resolveHtmlPath('index.html'));

    mainWindow.on('ready-to-show', () => {
        if (!mainWindow) {
            throw new Error('"mainWindow" is not defined');
        }
        if (process.env.START_MINIMIZED) {
            mainWindow.minimize();
        } else {
            mainWindow.show();
        }

        mainWindow.hookWindowMessage(278, (e) => {
            //窗口禁用
            mainWindow?.setEnabled(false);
            //延时太快会立刻启动，太慢会妨碍窗口其他操作，可自行测试最佳时间
            setTimeout(() => {
                mainWindow?.setEnabled(true);
            }, 100);
            return true;
        });

        position != null && mainWindow.setPosition(position.x, position.y);
    });

    mainWindow.on('show', () => {
        mainWindow?.webContents.send('redirect-window', '/home');
    });

    // 记录窗体移动坐标
    mainWindow.on('moved', () => {
        if (mainWindow) {
            const position = mainWindow.getPosition();
            ipcRenders.setPostionStore(position[0], position[1]);
        }
    });

    mainWindow.on('closed', () => {
        mainWindow = null;
    });

    const menuBuilder = new MenuBuilder(mainWindow);
    menuBuilder.buildMenu();

    // Open urls in the user's browser
    mainWindow.webContents.setWindowOpenHandler((edata) => {
        shell.openExternal(edata.url);
        return { action: 'deny' };
    });

    // Remove this if your app does not use auto updates
    // eslint-disable-next-line
    // new AppUpdater();
};

/**
 * Add event listeners...
 */

app.on('window-all-closed', () => {
    // Respect the OSX convention of having the application in memory even
    // after all windows have been closed
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app
    .whenReady()
    .then(() => {
        // 只启动一个
        const geoTheLock = app.requestSingleInstanceLock();
        if (!geoTheLock) {
            app.quit();
        } else {
            app.on('second-instance', (event, commandLine, workingDirectory) => {
                if (mainWindow) {
                    if (mainWindow.isMinimized()) {
                        mainWindow.restore();
                    }
                    mainWindow.focus();
                    mainWindow.show();
                }
            });
            createWindow();
            tray = new TrayBuilder(ipcRenders).getTray();
            app.on('activate', () => {
                // On macOS it's common to re-create a window in the app when the
                // dock icon is clicked and there are no other windows open.
                if (mainWindow === null) createWindow();
            });
        }
    })
    .catch(console.log);


const exeName = path.basename(process.execPath);

// 配置开机自启
app.setLoginItemSettings({
    openAtLogin: ipcRenders.getAutoStart(),
    openAsHidden: false,
    path: process.execPath,
    args: [
        '--processStart', `"${exeName}"`
    ]
});
