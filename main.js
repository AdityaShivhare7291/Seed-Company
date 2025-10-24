import { app, BrowserWindow } from 'electron';
import { fork } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let mainWindow;

app.on('ready', () => {
    const isDev = !app.isPackaged; // Check if running in development mode

    // Dynamically resolve the server path
    const serverPath = isDev
        ? path.join(__dirname, 'Invoice-management', 'server.js') // Development mode
        : path.join(__dirname, '../app.asar.unpacked/Invoice-management', 'server.js'); // Production mode

    console.log('Resolved server path:', serverPath);

    // Start the server
    const serverProcess = fork(serverPath);

    serverProcess.on('error', (err) => {
        console.error('Failed to start server:', err);
    });

    // Create the main window
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: true,
        },
    });

    const indexPath = `file://${path.join(__dirname, 'Frontend-Invoice-management', 'build', 'index.html')}`; // Built React app

    mainWindow.loadURL(indexPath);

});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});
