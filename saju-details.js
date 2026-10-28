/* Shared, browser-local chart details. No network or storage access. */
(function(root){
'use strict';
const names={木:'목',火:'화',土:'토',金:'금',水:'수'};
const korean={甲:'갑',乙:'을',丙:'병',丁:'정',戊:'무',己:'기',庚:'경',辛:'신',壬:'임',癸:'계',子:'자',丑:'축',寅:'인',卯:'묘',辰:'진',巳:'사',午:'오',未:'미',申:'신',酉:'유',戌:'술',亥:'해'};
const gods={'比肩':'비견','劫财':'겁재','食神':'식신','伤官':'상관','偏财':'편재','正财':'정재','七杀':'편관(칠살)','正官':'정관','偏印':'편인','正印':'정인','日主':'일간(나의 기준)'};
const symbols={甲:['큰 나무','오래 가꾸고 싶은 방향은 무엇인가요?'],乙:['풀과 덩굴','상황에 맞추면서도 지키고 싶은 것은 무엇인가요?'],丙:['햇빛','나의 관심과 온기를 어디에 나누고 싶나요?'],丁:['작은 등불','조용히 꾸준하게 이어갈 일은 무엇인가요?'],戊:['넓은 산','내가 기대어 쉴 수 있는 기반은 무엇인가요?'],己:['밭의 흙','돌봄과 나의 휴식 사이에 어떤 균형이 필요한가요?'],庚:['단단한 쇠','정리하고 새롭게 시작할 일은 무엇인가요?'],辛:['다듬은 보석','나에게 소중한 기준을 어떻게 표현할까요?'],壬:['넓은 물','시야를 넓히기 위해 들어볼 다른 관점은 무엇인가요?'],癸:['이슬과 비','작지만 꾸준하게 나를 돕는 습관은 무엇인가요?']};
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const read=s=>[...s].map(c=>korean[c]||c).join('');
const god=s=>gods[s]||s;
function summarize(e,unknown=false){
 const counts={木:0,火:0,土:0,金:0,水:0};
 const pillars=['Year','Month','Day','Time'].map((key,i)=>{
  if(unknown&&key==='Time')return {label:'시주',unknown:true};
  const value=e['get'+key](),wuxing=e['get'+key+'WuXing']();
  for(const c of wuxing){if(!(c in counts))throw Error('지원하지 않는 오행 값입니다.');counts[c]++;}
  const hidden=e['get'+key+'HideGan'](),relations=e['get'+key+'ShiShenZhi']();
  return {label:['년주','월주','일주','시주'][i],value,reading:read(value),elements:wuxing,stemGod:god(e['get'+key+'ShiShenGan']()),hidden:hidden.map((c,j)=>({stem:c,reading:read(c),god:god(relations[j])}))};
 });
 return {pillars,counts,total:unknown?6:8,unknown,dayStem:e.getDayGan(),dayReading:read(e.getDayGan()),symbol:symbols[e.getDayGan()]};
}
function render(e,unknown=false){
 const s=summarize(e,unknown);
 return `<div class="saju-detail"><h3>명식 상세 · 글자에서 관계까지</h3><p>일간 <b>${esc(s.dayStem)}(${esc(s.dayReading)})</b>을 기준으로 다른 천간과 지장간의 관계를 표시합니다.</p><div class="saju-table-wrap" tabindex="0" role="region" aria-label="사주 상세표, 가로로 스크롤 가능"><table class="saju-table"><caption>네 기둥의 천간·지지, 오행, 십성과 지장간</caption><thead><tr><th scope="col">기둥</th><th scope="col">간지 · 독음</th><th scope="col">천간 / 지지 오행</th><th scope="col">천간 십성</th><th scope="col">지장간 · 십성</th></tr></thead><tbody>${s.pillars.map(p=>p.unknown?'<tr><th scope="row">시주</th><td colspan="4">시간 미상 · 계산과 개수 집계에서 제외</td></tr>':`<tr><th scope="row">${p.label}</th><td>${esc(p.value)} · ${esc(p.reading)}</td><td>${[...p.elements].map(c=>names[c]).join(' / ')}</td><td>${esc(p.stemGod)}</td><td>${p.hidden.map(h=>`${esc(h.stem)}(${esc(h.reading)}) ${esc(h.god)}`).join('<br>')}</td></tr>`).join('')}</tbody></table></div><h3>겉으로 드러난 오행 · ${s.total}글자 집계</h3><div class="saju-counts">${Object.entries(s.counts).map(([c,n])=>`<div><strong>${names[c]} ${c}</strong><span>${n} / ${s.total}</span><meter min="0" max="${s.total}" value="${n}" aria-label="${names[c]} ${n}개">${n}</meter></div>`).join('')}</div><p class="saju-note">천간·지지 각각의 대표 오행을 한 글자당 1개로 셉니다. 지장간의 오행은 중복 합산하지 않습니다. 계절·월령·통근·생극의 가중치를 적용한 강약이나 용신 판정이 아닙니다. 0개라는 이유로 특정 성향이나 능력이 없다고 해석하지 않습니다.</p>${unknown?'<p class="saju-note">시간 미상은 정오를 임시로 사용해 년·월·일주를 계산합니다. 출생일이 절기 경계인 경우 실제 시각에 따라 년주·월주도 달라질 수 있습니다.</p>':''}<details open><summary>내 명식을 읽는 순서</summary><ol><li>양력 날짜와 시각이 맞는지 먼저 확인합니다.</li><li>일주의 윗글자인 일간을 찾습니다. 이 명식의 기준은 ${esc(s.dayStem)}입니다.</li><li>네 기둥의 글자와 지장간을 구분해 살펴봅니다.</li><li>십성은 일간과 다른 천간의 관계를 나타내는 전통 분류로 읽습니다. 이름만으로 길흉을 정하지 않습니다.</li><li>오행 개수는 구조를 살피는 출발점으로 사용하고, 실제 경험과 맞지 않는 해석은 내려놓습니다.</li></ol></details><details><summary>사라나의 성찰 질문 · 창작 콘텐츠</summary><p>${esc(s.symbol[0])}의 이미지를 떠올려보세요. ${esc(s.symbol[1])}</p><p>지금 내가 바꿀 수 있는 일 하나, 받아들여야 할 조건 하나, 오늘 실천할 작은 행동 하나를 적어보세요.</p><p class="saju-note">일간의 상징에서 만든 질문이며 성격 검사나 미래 예측 결과가 아닙니다.</p></details>${guide()}</div>`;
}
function guide(){return `<details><summary>처음 만나는 용어와 이용 안내</summary><dl class="saju-glossary"><dt>사주팔자</dt><dd>해·달·날·시간의 네 기둥을 각각 천간과 지지로 나타낸 여덟 글자입니다.</dd><dt>일간</dt><dd>일주의 천간으로, 이 상세표에서 십성을 비교하는 기준입니다.</dd><dt>지장간</dt><dd>각 지지 안에 배속한 천간입니다. 표에는 라이브러리의 배열 순서대로 표시하며 가중치는 계산하지 않습니다.</dd><dt>십성</dt><dd>일간을 기준으로 다른 천간을 분류한 관계 이름입니다. 비견·겁재, 식신·상관, 편재·정재, 편관·정관, 편인·정인의 열 가지가 있습니다. 한 항목만으로 직업·재물·관계의 결과를 판단하지 않습니다.</dd><dt>십성을 살펴보는 다섯 묶음</dt><dd>비견·겁재는 나와 같은 오행, 식신·상관은 내가 생하는 오행, 편재·정재는 내가 극하는 오행, 편관·정관은 나를 극하는 오행, 편인·정인은 나를 생하는 오행의 관계입니다. 각 묶음 안의 이름은 음양 관계에 따라 나뉩니다. 여기서 생·극은 전통 분류의 연결 방식이며 좋고 나쁨의 점수가 아닙니다.</dd><dt>성찰에 활용하는 질문</dt><dd>함께 일할 때의 나의 기준은 무엇인가요? 표현하고 만들어내고 싶은 것은 무엇인가요? 시간과 자원을 어떻게 관리하고 있나요? 책임과 압박을 어떻게 다루나요? 배움과 회복을 위해 무엇이 필요한가요? 이 질문은 십성에서 착안한 창작 안내입니다.</dd><dt>절기와 경계</dt><dd>이 프로그램의 연주·월주는 계산 라이브러리의 절기 경계를 사용하므로 달력의 1월 1일이나 매월 1일에 일괄 변경되지 않습니다.</dd><dt>계산 범위</dt><dd>양력·한국 표준시 입력, 자정 기준 일주 변경입니다. 출생지 진태양시·과거 서머타임 보정, 음력 직접 입력, 용신·대운 종합 해석은 제공하지 않습니다.</dd><dt>기록 보관</dt><dd>대시보드 프로필은 현재 브라우저에 저장됩니다. 상세 리포트 다운로드에는 생년월일과 시각이 포함되므로 본인이 보관할 위치를 선택하세요. 다른 기기로 옮길 때는 JSON 내보내기를 사용합니다.</dd></dl><p class="saju-note">계산 출처: <a href="https://github.com/6tail/lunar-javascript" target="_blank" rel="noopener noreferrer">lunar-javascript 1.7.7 · EightChar</a>. 이 사이트의 점수·가상 비율·궁합과 위의 실제 글자 집계는 서로 다른 데이터입니다.</p></details>`;}
function report(e,{name='나의 사주',date='',time='',unknown=false}={}){
 const s=summarize(e,unknown);
 return `# 사라나 사주 상세 리포트\n\n이름: ${name}\n양력 생일: ${date}\n한국 표준시: ${unknown?'시간 미상':time}\n\n## 네 기둥\n\n${s.pillars.map(p=>p.unknown?'시주: 시간 미상':`${p.label}: ${p.value} (${p.reading}) / 오행 ${[...p.elements].map(c=>names[c]).join('·')} / 천간 십성 ${p.stemGod}\n지장간: ${p.hidden.map(h=>`${h.stem}(${h.reading}) ${h.god}`).join(', ')}`).join('\n\n')}\n\n## 겉글자 오행 집계\n\n${Object.entries(s.counts).map(([c,n])=>`${names[c]}: ${n}/${s.total}`).join(' · ')}\n\n천간·지지의 대표 오행만 동일 가중치로 집계합니다. 지장간은 합산하지 않으며 강약·용신 판정이 아닙니다.\n\n## 성찰 질문 · 창작\n\n${s.symbol[1]}\n내가 바꿀 수 있는 일:\n받아들여야 할 조건:\n오늘 실천할 작은 행동:\n\n## 계산 기준\n\nlunar-javascript 1.7.7 / 양력·KST / 자정 일주 변경 / 진태양시·과거 서머타임 미보정. ${unknown?'시간 미상은 정오를 임시 사용하며 절기 경계의 년주·월주가 불확실할 수 있습니다.':''}\n운세·궁합 점수와 대시보드의 오행 비율은 별도의 편집 가능한 가상 데이터입니다.\n출처: https://github.com/6tail/lunar-javascript\n`;
}
function download(e,options){const blob=new Blob([report(e,options)],{type:'text/plain;charset=utf-8'}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download='sarana-saju-report.txt';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);}
const api={summarize,render,guide,report,download};
if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.SaranaSaju=api;
})(globalThis);
