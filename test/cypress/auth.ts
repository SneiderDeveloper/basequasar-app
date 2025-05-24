import { config } from './config'
import path from 'path'

const authFile = 'playwright/.auth/user.json';
const API = `${config.apiBase}/api/profile/v1/auth/login`;

const parentDirectory = path.resolve(__dirname, '../..');
const filePath = path.join('../../', authFile);

// Función para crear carpeta de auth
const createAuthFolder = () => {
    return cy.task('createAuthFolder');
};

// Función para almacenar credenciales
const storeCredentials = ({ sessionData }) => {
    console.log({ filePath, sessionData, parentDirectory });
    return cy.task('storeCredentials', { filePath, sessionData });
};

// Función para hacer login - convertida a cy.request
const fetchLogin = () => {
    return cy.request({
        method: 'POST',
        url: API,
        headers: {
            'Content-Type': 'application/json'
        },
        body: {
            "username": config.credentials.email,
            "password": config.credentials.password,
            "device": "Windows 10.0"
        }
    }).then((response) => {
        return response.body.data;
    });
};

// Función para insertar datos en IndexedDB
const insertUser = ({ sessionData, nameLocalStorage }) => {
    return cy.window().then((win) => {
        return new Cypress.Promise((resolve, reject) => {
            const openRequest = win.indexedDB.open(nameLocalStorage);

            openRequest.onupgradeneeded = function() {
                const db = openRequest.result;
                if (!db.objectStoreNames.contains('storage')) {
                    db.createObjectStore('storage');
                }
            };

            openRequest.onsuccess = function() {
                const db = openRequest.result;
                const transaction = db.transaction("storage", "readwrite");
                const storage = transaction.objectStore("storage");
                const request = storage.add(sessionData, "sessionData");

                request.onsuccess = function() {
                    console.log("Successful connection with indexedDB");
                    resolve();
                };

                request.onerror = function() {
                    console.error("Error", request.error);
                    reject(request.error);
                };
            };

            openRequest.onerror = function() {
                console.error("Error", openRequest.error);
                reject(openRequest.error);
            };
        });
    });
};

// Función utilitaria para obtener nombre del localStorage
function getLocalStorageName(url) {
    try {
        const parsedUrl = new URL(url);
        const host = parsedUrl.hostname;
        const port = parsedUrl.port;
  
        if (host === 'localhost') {
            return `localhost${port ? `:${port}` : ''}DB`
        }
  
        const parts = host.split('.');
        if (parts.length < 2) return `${host}DB`

        const firstPart = parts[0]
        const middleParts = parts.slice(1, -1)

        const pascalPart = middleParts.map(part =>
            part
                .replace(/-/g, ' ')
                .replace(/\b\w/g, l => l.toUpperCase())
                .replace(/\s/g, '')
        ).join('');

        return `${firstPart}${pascalPart}DB`;
    } catch (error) {
        console.error('Invalid URL:', error);
        return null;
    }
}

// Función principal de creación de sesión - completamente adaptada a Cypress
export const createSession = () => {
    return fetchLogin().then((sessionData) => {
        const nameLocalStorage = getLocalStorageName(config.url);
        
        return insertUser({ sessionData, nameLocalStorage })
            .then(() => createAuthFolder())
            .then(() => storeCredentials({ sessionData }));
    });
};

// Función para adquirir cuenta existente
export const acquireAccount = () => {
    return cy.task('readCredentials', filePath).then((sessionData) => {
        if (sessionData) {
            const nameLocalStorage = getLocalStorageName(config.url);
            return insertUser({ sessionData, nameLocalStorage });
        } else {
            throw new Error('No credentials found');
        }
    });
};