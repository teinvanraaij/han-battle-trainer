const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
(async()=>{
const manifest=JSON.parse(fs.readFileSync('dist/manifest.webmanifest','utf8'));
assert.equal(manifest.display,'standalone');assert.equal(manifest.scope,'./');assert.equal(manifest.start_url,'./?app=1');
for(const icon of manifest.icons){const data=fs.readFileSync('dist/'+icon.src);assert.equal(data.toString('hex',0,8),'89504e470d0a1a0a');assert.equal(data.readUInt32BE(16),parseInt(icon.sizes));assert.equal(data.readUInt32BE(20),parseInt(icon.sizes));}
for(const base of ['/','/han-battle-trainer/']){
 const prefix='battle-trainer-pwa-'+base.replace(/\W/g,'_')+'-';
 const handlers={},storage=new Map([[prefix+'old',new Map()],['battle-trainer-pwa-other-project-v1',new Map()]]);let claimed=false,skipped=false,networkCalls=0;
 const caches={open:async name=>{if(!storage.has(name))storage.set(name,new Map());const entries=storage.get(name);return {addAll:async files=>{for(const file of files){assert(file.startsWith(base));assert(fs.existsSync('dist/'+file.slice(base.length)),'Missing offline file: '+file);entries.set(file,'cached:'+file)}},match:async file=>entries.get(file)}},keys:async()=>[...storage.keys()],delete:async name=>storage.delete(name)};
 vm.runInNewContext(fs.readFileSync('dist/sw.js','utf8'),{URL,caches,self:{location:{origin:'https://test.example',href:'https://test.example'+base+'sw.js'},addEventListener:(name,fn)=>handlers[name]=fn,clients:{claim:async()=>{claimed=true}},skipWaiting:()=>{skipped=true}},fetch:async()=>{networkCalls++;throw Error('Offline')}});
 async function lifecycle(name){let pending;handlers[name]({waitUntil:p=>pending=p});await pending}
 await lifecycle('install');assert(!skipped);await lifecycle('activate');assert(claimed);assert(!storage.has(prefix+'old'));assert(storage.has('battle-trainer-pwa-other-project-v1'));
 async function request(path,mode='cors',method='GET'){let result;handlers.fetch({request:{url:'https://test.example'+path,mode,method},respondWith:p=>result=p});return result?await result:undefined}
 assert.equal(await request(base+'?app=1','navigate'),'cached:'+base+'index.html');assert.equal(await request(base+'index.html','navigate'),'cached:'+base+'index.html');assert.equal(await request(base+'data.js'),'cached:'+base+'data.js');assert.equal(await request(base+'app.js?v=2'),'cached:'+base+'app.js');assert.equal(networkCalls,0);assert.equal(await request(base+'anything','cors','POST'),undefined);
 handlers.message({data:{type:'ACTIVATE_UPDATE'}});assert(skipped);
}
const html=fs.readFileSync('dist/index.html','utf8');assert(html.includes('href="./manifest.webmanifest"'));assert(html.includes('apple-touch-icon'));assert(html.includes('id="install-app"'));assert(html.includes('src="pwa.js"'));assert(fs.readFileSync('dist/pwa.js','utf8').includes("register('./sw.js',{scope:'./'"));
console.log('Passed: icons, offline app at root and GitHub Pages subpath, query launch, update lifecycle and cache isolation.');
})().catch(error=>{console.error(error);process.exitCode=1});
