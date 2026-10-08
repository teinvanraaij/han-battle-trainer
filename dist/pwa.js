(()=>{
  const button=document.querySelector('#install-app');
  const dialog=document.querySelector('#install-modal');
  const status=document.querySelector('#offline-status');
  const updateButton=document.querySelector('#update-app');
  let installPrompt=null,registration=null;
  const standalone=()=>window.matchMedia('(display-mode: standalone)').matches||navigator.standalone===true;
  function refresh(){button.textContent=standalone()?'App geïnstalleerd ✓':'Installeer de app ↓';if(!('serviceWorker' in navigator))status.textContent='Deze browser ondersteunt geen offline opslag.';else if(!navigator.onLine)status.textContent=registration?.active?'Offline · oefenen blijft beschikbaar':'Offline · houd deze pagina open';else if(registration?.active)status.textContent='Klaar om offline te oefenen';else status.textContent='App voorbereiden voor offline gebruik…';}
  function help(){document.querySelector('#install-current').textContent=standalone()?'Je gebruikt de Battle Trainer al als app.':'Installeer de Battle Trainer op je beginscherm en open hem daarna via het app-icoon.';dialog.showModal();}
  window.addEventListener('beforeinstallprompt',event=>{event.preventDefault();installPrompt=event;button.textContent='Installeer de app ↓';});
  window.addEventListener('appinstalled',()=>{installPrompt=null;button.textContent='App geïnstalleerd ✓';});
  button.addEventListener('click',async()=>{if(!installPrompt||standalone()){help();return}try{const prompt=installPrompt;installPrompt=null;await prompt.prompt();const choice=await prompt.userChoice;if(choice.outcome==='accepted')button.textContent='App geïnstalleerd ✓';}catch{help();}});
  document.querySelector('#close-install').addEventListener('click',()=>dialog.close());
  dialog.addEventListener('click',event=>{if(event.target!==dialog)return;const r=dialog.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)dialog.close();});
  window.addEventListener('online',refresh);window.addEventListener('offline',refresh);
  window.matchMedia('(display-mode: standalone)').addEventListener('change',refresh);
  if('serviceWorker' in navigator){
    window.addEventListener('load',async()=>{try{registration=await navigator.serviceWorker.register('./sw.js',{scope:'./',updateViaCache:'none'});const waiting=()=>{if(registration.waiting)updateButton.hidden=false;};waiting();registration.addEventListener('updatefound',()=>{const installing=registration.installing;installing?.addEventListener('statechange',()=>{if(installing.state==='installed'){waiting();refresh();}});});await navigator.serviceWorker.ready;refresh();}catch{status.textContent='Offline opslag niet beschikbaar. Online oefenen werkt wel.';}});
    let updating=false;
    updateButton.addEventListener('click',()=>{if(registration?.waiting){updating=true;registration.waiting.postMessage({type:'ACTIVATE_UPDATE'});}});
    navigator.serviceWorker.addEventListener('controllerchange',()=>{if(updating)window.location.reload();else refresh();});
  }else status.textContent='Deze browser ondersteunt geen offline opslag.';
  refresh();
})();
