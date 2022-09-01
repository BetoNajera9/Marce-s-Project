import {
	app,
	autoUpdater,
	BrowserWindow,
	shell,
	ipcMain,
	dialog,
} from 'electron'
import { release } from 'os'
import { join } from 'path'

import * as api from './service/api'
import * as service from './service'

// Disable GPU Acceleration for Windows 7
if (release().startsWith('6.1')) app.disableHardwareAcceleration()

// Set application name for Windows 10+ notifications
if (process.platform === 'win32') app.setAppUserModelId(app.getName())

if (!app.requestSingleInstanceLock()) {
	app.quit()
	process.exit(0)
}

process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true'

export const ROOT_PATH = {
	// /dist
	dist: join(__dirname, '../..'),
	// /dist or /public
	public: join(__dirname, app.isPackaged ? '../..' : '../../../public'),
}

let win: BrowserWindow | null = null
// Here, you can also use other preload
const preload = join(__dirname, '../preload/index.js')
// 🚧 Use ['ENV_NAME'] avoid vite:define plugin
const url = `http://${process.env['VITE_DEV_SERVER_HOST']}:${process.env['VITE_DEV_SERVER_PORT']}`
const indexHtml = join(ROOT_PATH.dist, 'index.html')

async function createWindow() {
	win = new BrowserWindow({
		width: 1000,
		height: 800,
		title: 'Main window',
		icon: join(ROOT_PATH.public, 'favicon.ico'),
		webPreferences: {
			preload,
			nodeIntegration: true,
			contextIsolation: false,
		},
	})

	if (app.isPackaged) {
		win.loadFile(indexHtml)
	} else {
		win.loadURL(url)
		// win.webContents.openDevTools()
	}

	// Test actively push message to the Electron-Renderer
	win.webContents.on('did-finish-load', () => {
		win?.webContents.send('main-process-message', new Date().toLocaleString())
	})

	// Make all links open with the browser, not with the application
	win.webContents.setWindowOpenHandler(({ url }) => {
		if (url.startsWith('https:')) shell.openExternal(url)
		return { action: 'deny' }
	})
}

app.on('window-all-closed', () => {
	win = null
	if (process.platform !== 'darwin') app.quit()
})

app.on('second-instance', () => {
	if (win) {
		// Focus on the main window if the user tried to open another
		if (win.isMinimized()) win.restore()
		win.focus()
	}
})

app.on('activate', () => {
	const allWindows = BrowserWindow.getAllWindows()
	if (allWindows.length) {
		allWindows[0].focus()
	} else {
		createWindow()
	}
})

app.on('ready', async () => {
	createWindow()
	if (import.meta.env.DEV && !process.env.IS_TEST)
		// Open Dev Tools
		win?.webContents.openDevTools()
})

// new window example arg: new windows url
ipcMain.handle('open-win', (event, arg) => {
	const childWindow = new BrowserWindow({
		webPreferences: {
			preload,
		},
	})

	if (app.isPackaged) {
		childWindow.loadFile(indexHtml, { hash: arg })
	} else {
		childWindow.loadURL(`${url}/#${arg}`)
		// childWindow.webContents.openDevTools({ mode: "undocked", activate: true })
	}
})

// Deploy
if (import.meta.env.PROD) {
	const server = 'marce-project-deploy-1icantlmz-betonajera.vercel.app'
	const url = `${server}/update/${process.platform}/${app.getVersion()}`

	autoUpdater.setFeedURL({ url })
}

api.setAccountStatement()
api.setCustomers()
api.setSales()
api.setStock()

service.setPdf(app, win)