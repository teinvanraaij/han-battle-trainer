const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),engine=require('./dist/engine.js');
const ctx={window:{}};vm.runInNewContext(fs.readFileSync('dist/data.js','utf8'),ctx);vm.runInNewContext(fs.readFileSync('dist/quiz-data.js','utf8'),ctx);
const quiz=ctx.window.QUIZ,course=ctx.window.COURSE;
assert.equal(quiz.length,28);assert.equal(new Set(quiz.map(q=>q.id)).size,28);
for(const topic of course.topics)assert.equal(quiz.filter(q=>q.topic===topic.id).length,2);
for(const q of quiz){assert(course.lessons.some(l=>l.id===q.topic));assert.equal(q.options.length,4);assert.equal(new Set(q.options).size,4);assert(q.explanation.length>30);for(let i=0;i<4;i++)assert.equal(engine.gradeQuiz(q,i),i===q.correct);assert(!engine.gradeQuiz(q,-1));assert(!engine.gradeQuiz(q,4));const shuffled=engine.shuffleOptions(q.options,()=>0);assert.equal(shuffled.length,4);for(const item of shuffled)assert.equal(item.text,q.options[item.index]);assert.notEqual(shuffled[0].index,0);}
assert.equal(engine.parseCommand('Quiz alles').mode,'Quiz');assert.equal(engine.parseCommand('Munitie'),null);
const html=fs.readFileSync('dist/index.html','utf8');assert(html.indexOf('quiz-data.js')<html.indexOf('quiz-ui.js'));assert(html.indexOf('quiz-ui.js')<html.indexOf('app.js'));
// Exercise persisted answers, repeat-click protection, wrong-answer gaps, and score isolation.
const ui={QUIZ:quiz,TrainerEngine:engine,state:{quizHistory:[],history:[],gaps:[]},round:{mode:'Quiz',quizId:quiz[0].id,phase:'quiz'},persist:()=>{},render:()=>{},message:''};
vm.createContext(ui);vm.runInContext(fs.readFileSync('dist/quiz-ui.js','utf8'),ui);
vm.runInContext('answerQuiz("1");answerQuiz("0");',ui);assert.equal(ui.state.quizHistory.length,1);assert.equal(ui.state.quizHistory[0].correct,false);assert.equal(ui.state.gaps.length,1);assert.equal(ui.state.history.length,0);
ui.round={mode:'Quiz',quizId:quiz[0].id,phase:'quiz'};vm.runInContext('answerQuiz("0")',ui);assert.equal(ui.state.quizHistory.length,2);assert.equal(ui.state.gaps.length,0);assert.equal(ui.state.history.length,0);
console.log('Passed: 28 quiz questions, source coverage, shuffled grading, duplicate-click protection, gap recovery and independent quiz scores.');
