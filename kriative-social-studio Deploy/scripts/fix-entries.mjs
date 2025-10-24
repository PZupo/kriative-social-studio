import { writeFileSync, existsSync } from 'fs';
if (!existsSync('index.html')) writeFileSync('index.html', `<!doctype html>
<html lang="pt-BR"><head><meta charset="UTF-8"/><meta name="viewport" content="width=device-width, initial-scale=1.0"/><title>Kriative Social Studio</title></head><body><div id="root"></div><script type="module" src="./index.tsx"></script></body></html>`);
if (!existsSync('index.tsx')) writeFileSync('index.tsx', `import React from 'react';import ReactDOM from 'react-dom/client';import App from './App';ReactDOM.createRoot(document.getElementById('root')!).render(<React.StrictMode><App/></React.StrictMode>);`);
if (!existsSync('App.tsx')) writeFileSync('App.tsx', `export default function App(){return null}`);