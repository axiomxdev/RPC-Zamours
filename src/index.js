const path = require('path');
const fs = require('fs');
const RPC = require('discord-rpc');

const configPath = process.pkg ? path.join(path.dirname(process.execPath), 'config.json') : path.join(__dirname, 'config.json');
const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));

config.startTimestamp = (Date.now() - (new Date().getHours() * 3600 + new Date().getMinutes() * 60 + new Date().getSeconds()) * 1000);

const clientId = config.appID;
RPC.register(clientId);

const rpc = new RPC.Client({ transport: 'ipc' });

rpc.on('ready', () => {
    rpc.setActivity(config);

    console.log('Le RPC Zamours est prêt');
});

rpc.login({ clientId }).catch(console.error);
