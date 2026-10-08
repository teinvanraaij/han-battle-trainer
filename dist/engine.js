/* Browser-local practice with explicit self-assessment. No simulated AI scores. */
(function(root){
function normalize(s){return s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').trim();}
function matchTopics(topics,query){const q=normalize(query||'');if(!q||q==='alles')return topics;return topics.filter(t=>normalize(t.name+' '+t.ref+' '+t.answer).includes(q)||t.id===q);}
function score(flags){let knowledge=flags.concept?2:1;if(flags.concept&&flags.explanation)knowledge=3;if(knowledge===3&&flags.example)knowledge=4;if(knowledge===4&&flags.connection)knowledge=5;let insight=flags.reasoning?3:1;if(flags.reasoning&&flags.counter)insight=5;return {knowledge,insight};}
function parseCommand(text){let m=text.trim().match(/^(Menu|Leer|Overhoor|Quiz|Battle|Uitleg|Gatenlijst)(?:\s+(.*))?$/i);return m?{mode:m[1][0].toUpperCase()+m[1].slice(1).toLowerCase(),query:m[2]||''}:null;}
function shuffleOptions(options,random=Math.random){const order=options.map((text,index)=>({text,index}));for(let i=order.length-1;i>0;i--){const j=Math.floor(random()*(i+1));[order[i],order[j]]=[order[j],order[i]];}return order;}
function gradeQuiz(question,choice){return Number.isInteger(choice)&&choice>=0&&choice<question.options.length&&choice===question.correct;}
root.TrainerEngine={normalize,matchTopics,score,parseCommand,shuffleOptions,gradeQuiz};
if(typeof module!=='undefined')module.exports=root.TrainerEngine;
})(typeof window==='undefined'?globalThis:window);
