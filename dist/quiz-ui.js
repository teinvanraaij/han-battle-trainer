function nextQuiz(){
 const available=QUIZ.filter(q=>pool().some(t=>t.id===q.topic));
 if(!available.length){message='Er zijn geen quizvragen binnen deze selectie.';round=null;render();return}
 const answered=new Set(state.quizHistory.map(h=>h.question));
 let candidates=available.filter(q=>!answered.has(q.id)&&q.id!==round?.quizId);
 if(!candidates.length)candidates=available.filter(q=>q.id!==round?.quizId);
 if(!candidates.length)candidates=available;
 const q=candidates[Math.floor(Math.random()*candidates.length)];
 round={mode:'Quiz',topic:q.topic,quizId:q.id,phase:'quiz',options:TrainerEngine.shuffleOptions(q.options),choice:null,messages:[],answers:[]};
 message='';persist();render();
}
function quizTraining(){
 const q=round?QUIZ.find(q=>q.id===round.quizId):null;
 const chosen=topics.filter(t=>filter==='alles'||t.id[0]===filter);
 const done=round?.phase==='done';
 const right=q&&done&&TrainerEngine.gradeQuiz(q,round.choice);
 app.innerHTML=`<button class="back" data-page="home">← Terug naar de oefenarena</button>${heading('OEFENARENA · QUIZ','Kies het juiste antwoord.','Vier opties, één goed antwoord. Je krijgt uitleg nadat je hebt gekozen.')}<div class="filters"><label>Vakgebied<select id="course-filter"><option value="alles">Beide vakgebieden</option><option value="d" ${filter==='d'?'selected':''}>Duurzaamheid</option><option value="e" ${filter==='e'?'selected':''}>Business ethics</option></select></label><label>Onderwerp<select id="topic-filter"><option value="alles">Alles · door elkaar</option>${chosen.map(t=>`<option value="${t.id}" ${subject===t.id?'selected':''}>${escape(t.name)}</option>`).join('')}</select></label><label>Oefenvorm<select id="mode-filter">${modes.filter(m=>m[0]!=='Gatenlijst').map(m=>`<option ${mode===m[0]?'selected':''}>${m[0]}</option>`).join('')}</select></label></div>${message?`<div class="notice" role="status">${escape(message)}</div>`:''}${q?`<div class="trainer-grid"><section class="panel quiz-panel"><div class="eyebrow">${escape(getTopic(q.topic).name)}</div><div class="source-tags">${refButton(q.topic)}</div><h2 class="quiz-question">${escape(q.question)}</h2><div class="quiz-options" aria-label="Antwoordopties">${round.options.map((o,i)=>`<button class="quiz-option ${done&&o.index===q.correct?'correct':''} ${done&&!right&&o.index===round.choice?'incorrect':''}" data-quiz-choice="${o.index}" ${done?'disabled':''}><span class="quiz-letter">${'ABCD'[i]}</span><span>${escape(o.text)}${done&&o.index===q.correct?'<strong class="quiz-verdict">✓ Goed antwoord</strong>':done&&o.index===round.choice?'<strong class="quiz-verdict">✗ Jouw antwoord</strong>':''}</span></button>`).join('')}</div>${done?`<div class="quiz-feedback ${right?'correct':'incorrect'}" role="status"><h3>${right?'Goed beantwoord.':'Dit antwoord klopt niet.'}</h3><p>${escape(q.explanation)}</p><div class="source-tags">${refButton(q.topic)}</div></div><div class="answer-actions"><button class="btn quiet" data-source="${q.topic}">Lees de les ↗</button><button class="btn primary" id="next">Volgende quizvraag →</button></div>`:''}</section><aside><section class="panel"><div class="eyebrow">JOUW QUIZRESULTAAT</div>${quizResult()}<p>Je keuze wordt automatisch gecontroleerd. Deze score telt apart van kennis en inzicht bij open antwoorden.</p><button class="btn quiet" data-page="scores">Bekijk voortgang ↗</button></section><div class="notice">Een fout beantwoorde vraag komt in je gatenlijst. Beantwoord je hem later goed, dan verdwijnt dat aandachtspunt.</div></aside></div>`:'<button class="btn primary" id="next">Start de quiz →</button>'}${commandForm()}`;
}
function answerQuiz(value){
 if(!round||round.mode!=='Quiz'||round.phase!=='quiz')return;
 const q=QUIZ.find(q=>q.id===round.quizId),choice=Number(value);
 if(!q||!Number.isInteger(choice)||choice<0||choice>=q.options.length)return;
 const correct=TrainerEngine.gradeQuiz(q,choice);
 round.choice=choice;round.phase='done';message='';
 state.quizHistory.push({question:q.id,topic:q.topic,choice,correct,date:new Date().toISOString()});
 const point='Quiz: '+q.question;
 if(correct)state.gaps=state.gaps.filter(g=>!(g.topic===q.topic&&g.point===point));
 else if(!state.gaps.some(g=>g.topic===q.topic&&g.point===point))state.gaps.push({topic:q.topic,point});
 persist();render();
}
function quizResult(){const n=state.quizHistory.length,correct=state.quizHistory.filter(h=>h.correct).length;return `<div class="stat-value">${correct} <small style="font-size:17px">/ ${n} goed</small></div><p>${n?Math.round(correct/n*100)+'% goed beantwoord':'Nog geen quizvragen beantwoord.'}</p>`;}
function quizStats(){return `<section class="panel"><div class="eyebrow">QUIZ · AUTOMATISCH NAGEKEKEN</div>${quizResult()}<button class="btn primary" data-mode="Quiz">Oefen met meerkeuzevragen →</button></section>`;}
