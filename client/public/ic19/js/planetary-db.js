require('dotenv').config();
const http = require('http');
const url = require('url');
const PORT = process.env.PORT || 8082;
let resources = [
{ id: 1, name: 'Zypherian Moss', type: 'Species' },
{ id: 2, name: 'Crystalline Ore', type: 'Mineral' },
{ id: 3, name: 'Nebula Spores', type: 'Species' }
];
let nextId = 4;
function parseRequestBody(req) { /* provided */ }
const server = http.createServer(async (req, res) => {
const { pathname } = url.parse(req.url, true);
const method = req.method;
// CORS headers — provided
if (pathname === '/api/resources' && method === 'GET') {
res.writeHead(200, { 'Content-Type': 'application/json' });
res.end(JSON.stringify(resources));
return;
}
if (pathname === '/api/resources' && method === 'POST') {
try {
const body = await parseRequestBody(req);
if (!body.name || !body.type) {
res.writeHead(400, { 'Content-Type': 'application/json' });
res.end(JSON.stringify({ error: 'name and type required' }));
return;
}
const newResource = { id: nextId++, name: body.name, type: body.type };
resources.push(newResource);
res.writeHead(201, { 'Content-Type': 'application/json' });
res.end(JSON.stringify(newResource));
return;
} catch { res.writeHead(400); res.end(); }
}
const putMatch = pathname.match(/^\/api\/resources\/(\d+)$/);
if (putMatch && method === 'PUT') {
const id = parseInt(putMatch[1]);
try {
const body = await parseRequestBody(req);
const idx = resources.findIndex(r => r.id === id);
if (idx === -1) { res.writeHead(404); res.end(); return; }
if (body.name) resources[idx].name = body.name;
if (body.type) resources[idx].type = body.type;
res.writeHead(200, { 'Content-Type': 'application/json' });
res.end(JSON.stringify(resources[idx]));
return;
} catch { res.writeHead(400); res.end(); }
}
const delMatch = pathname.match(/^\/api\/resources\/(\d+)$/);
if (delMatch && method === 'DELETE') {
const id = parseInt(delMatch[1]);
const idx = resources.findIndex(r => r.id === id);
if (idx === -1) { res.writeHead(404); res.end(); return; }
const deleted = resources.splice(idx, 1)[0];
res.writeHead(200, { 'Content-Type': 'application/json' });
res.end(JSON.stringify(deleted));
return;
}
res.writeHead(404); res.end();
});
server.listen(PORT, () => console.log(`Listening on ${PORT}`));