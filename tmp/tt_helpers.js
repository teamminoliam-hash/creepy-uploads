// TikTok Studio upload helpers (page https://www.tiktok.com/tiktokstudio/upload). Usage (Claude in Chrome):
// 1) exec this file, 2) find "video file input" + file_upload, 3) await __tt.prep() ; type caption ; 4) await __tt.sched('mercredi 12 novembre 2026','12 nov. 2026','<début du titre>','19')
window.__sleep=(ms)=>new Promise(r=>setTimeout(r,ms));
window.__tt={
 dismiss(){let n=0;for(const b of [...document.querySelectorAll('button')]){const t=b.innerText.trim();if(!b.offsetParent)continue;if(t==="J'ai compris"){b.click();n++}if(t==='Annuler'){let p=b;for(let i=0;i<5&&p;i++)p=p.parentElement;if(p&&/vérifications automatiques/.test(p.innerText)){b.click();n++}}}return n},
 async prep(){for(let i=0;i<60;i++){if(/Importé/.test(document.body.innerText)&&document.querySelector('[contenteditable=true]'))break;await __sleep(1000)}await __sleep(1500);this.dismiss();await __sleep(500);this.dismiss();const ed=document.querySelector('[contenteditable=true]');ed.scrollIntoView({block:'center'});ed.focus();return [/Importé/.test(document.body.innerText),ed.innerText.slice(0,40),document.activeElement===ed||ed.contains(document.activeElement)]},
 leaf(re){return [...document.querySelectorAll('*')].filter(e=>e.children.length===0&&e.offsetParent!==null&&re.test((e.innerText||'').trim()))},
 async sched(dayLabel,dayShort,titleStart,hour){hour=hour||'19';this.dismiss();const ed=document.querySelector('[contenteditable=true]');if(!ed.innerText.startsWith(titleStart))return 'NO_CAPTION';
  const radio=document.querySelector('input[value=schedule]');if(!radio.checked){radio.click();await __sleep(1500)}
  if(/Autoriser la programmation/.test(document.body.innerText))return 'NEED_AUTH';
  const dEl=this.leaf(/^\d{1,2} [a-zéû]+\.? 20\d\d$/)[0];if(!dEl)return 'NO_DATE_FIELD';dEl.click();await __sleep(700);
  const db=[...document.querySelectorAll('button.DatePicker__day')].find(b=>b.getAttribute('aria-label')===dayLabel);if(!db||db.disabled)return 'DAY_NOT_AVAILABLE';db.click();await __sleep(700);
  const tEl=this.leaf(/^\d{2}:\d{2}$/)[0];if(!tEl)return 'NO_TIME_FIELD';tEl.click();await __sleep(700);
  const cols=[...document.querySelectorAll('.TimePicker__column')];const pick=(col,t)=>{const b=col&&[...col.querySelectorAll('button.TimePicker__item')].find(x=>x.innerText.trim()===t);b&&b.click();return !!b};
  const h=pick(cols[0],hour);await __sleep(400);const m=pick([...document.querySelectorAll('.TimePicker__column')][1],'00');await __sleep(500);
  document.body.dispatchEvent(new KeyboardEvent('keydown',{key:'Escape',bubbles:true}));await __sleep(300);
  const t=document.body.innerText;const ok=radio.checked&&t.includes(dayShort)&&new RegExp('\\b'+hour+':00\\b').test(t)&&ed.innerText.startsWith(titleStart);
  if(!ok)return ['GUARD_FAIL',h,m,t.includes(dayShort)];
  document.querySelector('button[data-e2e=post_video_button]').click();
  for(let i=0;i<20;i++){await __sleep(1000);if(location.href.includes('/content'))break}
  return ['POSTED',location.href]}
};
'tt ok'
