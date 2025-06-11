import path from 'node:path';
import {
    join
} from 'node:path';

import {
    app,
    BrowserWindow,
    ipcMain,
    Menu,
    session

} from 'electron';
import {
    fileURLToPath
} from 'node:url';
import {
    dirname
} from 'node:path';
import {
    createServer
} from 'node:http';

import express from 'express';

import dotenv from 'dotenv';

import axios from 'axios';

import ejs from 'ejs'

if (process.env.NODE_ENV !== 'production') {
    // Cargar variables de entorno
    dotenv.config();
}

app.commandLine.appendSwitch('ignore-certificate-errors');
app.commandLine.appendSwitch('allow-insecure-localhost', 'true');

// Configuración básica
const __filename = fileURLToPath(
    import.meta.url);
const __dirname = dirname(__filename);

const preloadPath = join(__dirname, 'config', 'preload.js');

// Configuración de Express
const expressApp = express();
const httpServer = createServer(expressApp);

// Middleware
// expressApp.use(cors());
expressApp.use(express.json());
expressApp.set('view engine', 'ejs');

expressApp.set('views', path.join(__dirname, 'views'));

expressApp.use(express.urlencoded({
    extended: true
}));
expressApp.use(express.static(join(__dirname, 'public')));

// Variables globales
let mainWindow;
let expressServer;
// let localStorage;

const serverUrl = process.env.SERVERURL || 'http://localhost:3000/'
const accessKey = process.env.API_ACCESS || 'Custom Key for server url'
const port = process.env.PORT || 8000

// Inicialización de la aplicación Electron
function createWindow() {
    try {
        Menu.setApplicationMenu(null);
        mainWindow = new BrowserWindow({
            width: 1200,
            height: 800,
            webPreferences: {
                nodeIntegration: false,
                contextIsolation: true,
                preload: preloadPath,
                webSecurity: true,
                allowRunningInsecureContent: false
            }
        });

        // Cargar la aplicación
        mainWindow.loadURL(`http://localhost:${port}/`);
        mainWindow.webContents.openDevTools();

        mainWindow.on('closed', () => {
            //save last changes
            mainWindow = null;
        });
    } catch (error) {
        console.error('Error al crear la ventana:', error);
    }
}

async function renderPartial(partialName, data = {}) {
    const partialPath = join('views', `${partialName}.ejs`);
    try {
        const html = await ejs.renderFile(partialPath, data);
        return html;
    } catch (error) {
        console.error(`Error al renderizar parcial ${partialName}:`, error);
        // Puedes retornar un string de error, vacío, o lanzar la excepción
        return `<p style="color: red;">Error al cargar el encabezado: ${partialName}</p>`;
    }
}

async function fetchData(query) {
    try {
        const response = await axios.get(serverUrl + query, {
            headers: {
                access: accessKey
            }
        });
        return response.data;
    } catch (err) {
        console.error('Error al obtener datos:', err);
        return {
            success: false,
            error: err.message
        };
    }
}

// Iniciar servidor Express
function startExpressServer() {

    // Front
    expressApp.get('/', async (req, res) => {
        const content = await renderPartial('panel/panel');
        // const content = await renderPartial('reception/receptions');
        const mainData = {
            content
        };
        res.render('sbadmin', mainData)
    });

    expressApp.get('/reportes', async (req, res) => {
        const content = await renderPartial('report/reports');
        const mainData = {
            content
        };
        res.render('sbadmin', mainData)
    });

    expressApp.get('/recepciones', async (req, res) => {
        const content = await renderPartial('reception/receptions');
        const mainData = {
            content
        };
        res.render('sbadmin', mainData)
    });

    expressApp.get('/incidencias', async (req, res) => {
        const content = await renderPartial('incident/incidents');
        const mainData = {
            content
        };
        res.render('sbadmin', mainData)
    });

    expressApp.get('/bios', async (req, res) => {
        const content = await renderPartial('bios/bios');
        const mainData = {
            content
        };
        res.render('sbadmin', mainData)
    });

    // Iniciar servidor
    expressServer = httpServer.listen(port, '127.0.0.1', () => {
        console.log(`Servidor Express en http://localhost:${port}`);
    });
}

// Configurar manejadores IPC
function setupIpcHandlers() {

    ipcMain.handle('get-data', (event, query) => fetchData(query));


    ipcMain.handle('patch-data', async (event, url, data) => {
        try {
            const response = await axios.patch(serverUrl + url, data, {
                headers: {
                    access: accessKey,
                    'Content-Type': 'application/json'
                }
            });
            return response.data;
        } catch (err) {
            console.error(`Error realizar el metodo patch en ${serverUrl} con los datos ${data}`, err);
            return {
                success: false,
                error: err.message
            };
        }
    });

    ipcMain.handle('post-data', async (event, url, data) => {
        try {
            const response = await axios.post(serverUrl + url, data, {
                headers: {
                    access: accessKey,
                    'Content-Type': 'application/json'
                }
            });
            return response.data;

        } catch (err) {
            console.error(`Error realizar el metodo post en ${serverUrl} con los datos ${data}`, err);
            return {
                success: false,
                error: err.message
            };
        }
    });

    ipcMain.handle('put-data', async (event, url, data) => {
        try {
            const response = await axios.put(serverUrl + url, data, {
                headers: {
                    access: accessKey,
                    'Content-Type': 'application/json'
                }
            });
            return response.data;

        } catch (err) {
            console.error(`Error realizar el metodo put en ${serverUrl} con los datos ${data}`, err);
            return {
                success: false,
                error: err.message
            };
        }
    });

}

// Cuando la aplicación esté lista
app.whenReady().then(() => {
    console.log('Aplicación Electron lista');

    try {
        // Iniciar componentes
        setupIpcHandlers();
        startExpressServer();
        createWindow();

    } catch (error) {
        console.error('Error al inicializar la aplicación:', error);
    }
});

// Cerrar la aplicación cuando todas las ventanas estén cerradas (excepto en macOS)
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }

    if (expressServer) {
        expressServer.close();
    }
});

// Manejo de errores no capturados
process.on('uncaughtException', (error) => {
    console.error('Error no capturado:', error);
});