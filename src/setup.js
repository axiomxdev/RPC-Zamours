const path = require('path');
const fetch = require('node-fetch');
const fs = require('fs');
const readline = require('readline');

const configPath = process.pkg ? path.join(path.dirname(process.execPath), 'config.json') : path.join(__dirname, 'config.json');
const packagePath = process.pkg ? path.join(path.dirname(process.execPath), 'package.json') : path.join(__dirname, 'package.json');

// updater
const url = 'https://raw.githubusercontent.com/axiomxdev/RPC-Zamours/main/src/package.json';
const currentVersion = require(packagePath).version;

fetch(url)
    .then(response => response.json())
    .then(data => {
        const latestVersion = data.version;
        if (latestVersion !== currentVersion) {
            console.log(`Nouvelle version disponible : ${latestVersion}. Vous avez actuellement : ${currentVersion}.\n`);
            // updater script
        }
    }).catch(error => console.error('Erreur lors de la vérification de la version :', error));

// setup
const config = require(configPath);

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

async function askAppID() {
    return new Promise((resolve) => {
        rl.question('Veuillez entrer l\'ID de l\'application (tuto : https://docs.customrp.xyz/v/fr/setting-up): ', (appID) => {
            resolve(appID);
        });
    });
}

async function validateAppID(appID) {
    try {
        const response = await fetch(`https://discord.com/api/v9/applications/${appID}/rpc`);
        if (response.ok) {
            console.log('L\'ID de l\'application est valide.');
            return true;
        } else {
            console.log('L\'ID de l\'application n\'est pas valide.');
        }
    } catch (error) {
        console.error('Erreur lors de la vérification de l\'ID de l\'application :', error);
    }
}

(async () => {
    if (!(await validateAppID(config.appID))) {
        config.appID = null;
    } else {
        require('./index.js');
    }

    while (!config.appID) {
        const appID = await askAppID();
        if (await validateAppID(appID)) {
            config.appID = appID;

            fs.writeFile(configPath, JSON.stringify(config, null, 2), (err) => {
                if (err) {
                    console.error('Erreur lors de la mise à jour du fichier de configuration:', err);
                } else {
                    console.log('La configuration est faite avec succès.');
                }
                rl.close();
            });
            require('./index.js');
        }
    }
})();
