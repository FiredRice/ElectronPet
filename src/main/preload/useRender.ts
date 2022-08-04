import { ipcRenderer } from 'electron';

function useRender() {
    return {
        // 改变主窗体大小
        setMainWindowSize(width: number, height: number) {
            ipcRenderer.send('set-main-window-size', width, height);
        },
        // 主窗体置顶切换
        setMainWindowOnTop(alwaysOnTop: boolean) {
            ipcRenderer.send('set-main-window-on-top', alwaysOnTop);
        },
        // 主窗体点击穿透切换
        setClickThrough(ignore: boolean) {
            ipcRenderer.send('set-main-window-click-through', ignore);
        },
        // 获取点击穿透数值
        getClickThrough(): boolean {
            return ipcRenderer.sendSync('get-main-window-click-through');
        },
        // 设置开机自启
        setAutoStart(auto: boolean) {
            ipcRenderer.send('set-auto-start', auto);
        },
        // 获取开机自启
        getAutoStart(): boolean {
            return ipcRenderer.sendSync('get-auto-start');
        },
        // 获取资源路径
        getAssetPath(...paths: string[]): string {
            return ipcRenderer.sendSync('get-asset-path', ...paths);
        },
        // 读取文件
        readFile(src: string): Buffer {
            return ipcRenderer.sendSync('read-file', src);
        },
        // 路由重定向
        redirectWindow(call: (url: string) => void) {
            ipcRenderer.on('redirect-window', (event, url) => {
                call && call(url);
            });
        },
        /**
         * 新建窗口
         * @param {string} url: react路由
         */
        createWindow(url: string) {
            ipcRenderer.send('create-new-window', url);
        },
    };
}

export default useRender;
