const API_URL = 'http://localhost:8082/api/resources';
const resourceForm = document.getElementById('resource-form');
const resourceList = document.getElementById('resource-list');
function displayResources(resources) { /* provided */ }
async function loadResources() {
const response = await fetch(API_URL);
const resources = await response.json();
displayResources(resources);
}
async function createResource(name, type) {
await fetch(API_URL, {
method: 'POST',
headers: { 'Content-Type': 'application/json' },
body: JSON.stringify({ name, type })
});
loadResources();
}
async function handleDelete(event) {
const id = event.target.dataset.id;
await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
loadResources();
}
async function handleEdit(event) {
const id = event.target.dataset.id;
const newName = prompt('Enter new name:');
if (!newName) return;
await fetch(`${API_URL}/${id}`, {
method: 'PUT',
headers: { 'Content-Type': 'application/json' },
body: JSON.stringify({ name: newName })
});
loadResources();
}
//TODO: something something
resourceForm.addEventListener('submit', (e) => {
e.preventDefault();
const name = document.getElementById('name').value.trim();
const type = document.getElementById('type').value.trim();
if (name && type) { createResource(name, type); e.target.reset(); }
});
loadResources(); // run on page load