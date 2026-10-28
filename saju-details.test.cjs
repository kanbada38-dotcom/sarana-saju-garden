const assert=require('node:assert/strict');
const fs=require('node:fs');
const {Solar}=require('./assets/lunar.js');
const {summarize,render,report}=require('./saju-details.js');
const e=Solar.fromYmdHms(1999,6,7,9,11,0).getLunar().getEightChar();e.setSect(2);
const full=summarize(e);
assert.deepEqual(full.pillars.map(p=>p.value),['己卯','庚午','庚寅','辛巳']);
assert.deepEqual(full.counts,{木:2,火:2,土:1,金:3,水:0});
assert.equal(full.pillars[0].stemGod,'정인');
assert.deepEqual(full.pillars[2].hidden.map(h=>h.god),['편재','편관(칠살)','편인']);
// Time omission must remove both time characters and avoid calling any time APIs.
const noTime=new Proxy(e,{get(target,k){if(String(k).startsWith('getTime'))throw Error('시주를 읽으면 안 됩니다');return target[k]}});
const unknown=summarize(noTime,true);
assert.equal(unknown.total,6);assert.deepEqual(unknown.counts,{木:2,火:1,土:1,金:2,水:0});
assert.match(render(noTime,true),/시간 미상/);assert.match(render(e),/0개라는 이유로/);
assert.match(report(noTime,{unknown:true,date:'1999-06-07'}),/한국 표준시: 시간 미상/);
assert.ok(!report(noTime,{unknown:true}).includes('辛巳'));
// Check the full supported date range and all 10 day stems for mapping coverage.
const stems=new Set();
for(const y of [1901,1950,2000,2026,2100])for(let day=1;day<=30;day++){
 const chart=Solar.fromYmdHms(y,6,day,23,30,0).getLunar().getEightChar();chart.setSect(2);
 const s=summarize(chart);stems.add(s.dayStem);assert.equal(Object.values(s.counts).reduce((a,b)=>a+b,0),8);
 assert.ok(s.symbol);assert.ok(!render(chart).includes('undefined'));
}
assert.equal(stems.size,10);
for(const page of ['index.html','garden.html'])assert.ok(fs.readFileSync(page,'utf8').includes('src="saju-details.js"'));
for(const file of ['saju-details.js','saju-details.css'])assert.ok(fs.readFileSync('.github/workflows/deploy.yml','utf8').includes(file));
console.log('PASS: known chart, Korean ten gods, hidden stems, eight/six-character counts, unknown-time exclusion, report, date range and deployment wiring');
