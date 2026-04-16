/*
File: js/ic18-ship-config.js 
Topic: Node.js introduction & environment variables
Implemented by: Richard Walker
*/

require('dotenv').config();

const http = require('http');
const PORT = process.env.PORT || 8082;

const MISSION_ATMOSPHERE = process.env.ATMOSPHERE || 'Standard-Earth-Orbit';

const server = http.createServer((req, res) => {
    console.log('[LOG]: Received request for:', req.url);
    res.writeHead(200, { 'Content-Type': 'text/plain' });

    res.write("----------------------------------------------\n");
    res.write(" 🚀 GALACTIC SCOUT MISSION LOG\n");
    res.write("----------------------------------------------\n");
    res.write(" STATUS: Communication Array Online\n");
    res.write(` ATMOSPHERE: ${MISSION_ATMOSPHERE}\n`);
    res.write(` FREQUENCY: ${PORT}\n`);
    res.write("-----------------------------------------------\n");
    res.end();

});

server.listen(PORT, () => {
    console.log(`\n[SYSTEM]: Scout ship OS is active.`);
    console.log(`[SYSTEM]: Array listening on port: ${PORT}`);
    console.log(`[MISSION]: Destination set to ${MISSION_ATMOSPHERE}\n`);
});