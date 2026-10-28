/* JSON schema validation shared by browser and Node checks. */
(function(root){'use strict';
function validate(input){
 const data=JSON.parse(JSON.stringify(input));
 const fail=m=>{throw new Error(m)};
 const obj=(x,p)=>{if(!x||typeof x!=='object'||Array.isArray(x))fail(p+'은 객체여야 합니다.');for(const k of Object.keys(x))if(['__proto__','constructor','prototype'].includes(k))fail('허용하지 않는 키입니다.');};
 const text=(v,p,max=500)=>{if(typeof v!=='string'||!v.trim()||v.length>max)fail(p+': 1~'+max+'자의 문자열이 필요합니다.');};
 const number=(v,p)=>{if(typeof v!=='number'||!Number.isFinite(v)||v<0||v>100)fail(p+': 0~100의 숫자가 필요합니다.');};
 const date=(v,p)=>{text(v,p,10);if(!/^\d{4}-\d{2}-\d{2}$/.test(v)||!Number.isFinite(Date.parse(v+'T00:00:00Z'))||new Date(v+'T00:00:00Z').toISOString().slice(0,10)!==v)fail(p+': 올바른 날짜가 필요합니다.');};
 obj(data,'데이터');if(data.schemaVersion!==1)fail('schemaVersion은 1이어야 합니다.');
 for(const key of ['profiles','matches','events'])if(!Array.isArray(data[key])||data[key].length>200)fail(key+'는 200개 이하의 배열이어야 합니다.');
 const sets={};for(const key of ['profiles','matches','events']){sets[key]=new Set();for(const item of data[key]){obj(item,key);text(item.id,'id',80);if(sets[key].has(item.id))fail(key+'에 중복 id가 있습니다.');sets[key].add(item.id);}}
 for(const p of data.profiles){text(p.name,'이름',30);date(p.birthDate,'생일');if(p.birthDate<'1901-01-01'||p.birthDate>'2100-12-31')fail('생일 범위는 1901~2100년입니다.');if(typeof p.birthTime!=='string'||!/^([01]\d|2[0-3]):[0-5]\d$/.test(p.birthTime))fail('시간은 HH:MM 형식이어야 합니다.');if(!['목','화','토','금','수'].includes(p.element))fail('대표 오행은 목·화·토·금·수 중 하나입니다.');text(p.tagline,'캐릭터 소개',100);text(p.memo,'메모',1000);obj(p.scores,'점수');for(const k of ['total','love','work','money'])number(p.scores[k],k);obj(p.elements,'오행');for(const k of ['wood','fire','earth','metal','water'])number(p.elements[k],k);if(Math.abs(Object.values(p.elements).reduce((a,b)=>a+b,0)-100)>.01)fail('오행 비율의 합계는 100이어야 합니다.');if(!Array.isArray(p.weekly)||p.weekly.length!==7)fail('주간 흐름은 7개 숫자여야 합니다.');p.weekly.forEach(v=>number(v,'주간 흐름'));}
 for(const m of data.matches){if(!sets.profiles.has(m.a)||!sets.profiles.has(m.b)||m.a===m.b)fail('궁합에는 서로 다른 기존 프로필 2개가 필요합니다.');number(m.score,'궁합 점수');text(m.note,'궁합 메모',500);}
 for(const e of data.events){date(e.date,'일정 날짜');text(e.title,'일정 제목',80);text(e.category,'일정 분류',30);text(e.note,'일정 메모',500);}
 return data;
}
function escape(s){return String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
const api={validate,escape};if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.SaranaData=api;
})(typeof globalThis!=='undefined'?globalThis:this);
