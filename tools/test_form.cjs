// Behavioral checks against the delivered script using a minimal DOM harness.
// No real leads are submitted. Browser/layout QA remains a deployment check.
const vm=require('node:vm'),fs=require('node:fs'),assert=require('node:assert/strict');
const code=fs.readFileSync(__dirname+'/../public/assets/site.v2.js','utf8');
function harness({key='',fail=false}={}){
 const events={},store=new Map(),sent=[];
 const status={hidden:true,textContent:'',innerHTML:'',focus(){this.focused=true}};
 const button={disabled:true,textContent:'Send cleanup request'};
 const urgency={hidden:true,querySelector(){return this.text},text:{textContent:''}};
 const names=['access_key','page_source','landing_page','request_page','utm_source','utm_medium','utm_campaign','utm_term','utm_content','compliance_deadline','botcheck'];
 const fields=Object.fromEntries(names.map(n=>[n,{value:'',addEventListener(ev,fn){this[ev]=fn}}]));
 fields.botcheck.checked=false;
 const form={dataset:{},elements:{namedItem:n=>fields[n]},querySelector:s=>({'button[type=submit]':button,'.form-status':status,'.form-urgency':urgency}[s]),addEventListener:(n,fn)=>events[n]=fn,reportValidity:()=>true};
 const location={search:'?utm_source=qa&utm_campaign=notice',pathname:'/fix-my-violation/',assign:u=>location.destination=u};
 class FormData{constructor(){this.data=Object.fromEntries(Object.entries(fields).map(([n,f])=>[n,f.value]))}delete(k){delete this.data[k]}}
 const context={window:{FMV_CONFIG:{web3formsAccessKey:key}},document:{documentElement:{classList:{add(){}}},querySelector:s=>s==='.lead-form'?form:null,addEventListener(){}},sessionStorage:{getItem:k=>store.get(k)||null,setItem:(k,v)=>store.set(k,v),removeItem:k=>store.delete(k)},location,URLSearchParams,Intl,Date,Number,String,FormData,AbortController,setTimeout,clearTimeout,fetch:async(url,opts)=>{sent.push(opts.body);if(fail)throw new Error('offline');return {ok:true,json:async()=>({success:true})}}};
 vm.runInNewContext(code,context);
 function deadline(offset){const parts=new Intl.DateTimeFormat('en-CA',{timeZone:'America/New_York',year:'numeric',month:'2-digit',day:'2-digit'}).formatToParts(new Date());const p=Object.fromEntries(parts.map(x=>[x.type,x.value]));const d=new Date(Date.UTC(+p.year,+p.month-1,+p.day+offset));fields.compliance_deadline.value=d.toISOString().slice(0,10);fields.compliance_deadline.input();}
 return {fields,status,button,urgency,location,sent,deadline,submit:()=>events.submit({preventDefault(){}})};
}
(async()=>{
 const key='11111111-2222-3333-4444-555555555555';let t=harness();assert(t.button.disabled);assert(t.status.innerHTML.includes('tel:+18136712757'));await t.submit();assert.equal(t.sent.length,0);
 t=harness({key});assert(!t.button.disabled);assert.equal(t.fields.utm_source.value,'qa');assert.equal(t.fields.page_source.value,'/fix-my-violation/');
 for(const day of [-1,0,1,7]){t.deadline(day);assert(!t.urgency.hidden,`urgency day ${day}`)}t.deadline(8);assert(t.urgency.hidden);t.fields.compliance_deadline.value='';t.fields.compliance_deadline.input();assert(t.urgency.hidden);
 await t.submit();assert.equal(t.sent.length,1);assert.equal(t.location.destination,'/thank-you/?received=1');assert(!('attachment' in t.sent[0].data));await t.submit();assert.equal(t.sent.length,1);
 t=harness({key,fail:true});t.fields.name={value:'Preserved'};await t.submit();assert(t.status.innerHTML.includes('could not confirm'));assert(!t.button.disabled);assert(!t.location.destination);assert(t.status.focused);
 t=harness({key});t.fields.botcheck.checked=true;await t.submit();assert.equal(t.sent.length,0);
 console.log('PASS: key gate, UTM/source, deadline boundaries, success-only redirect, double-submit protection, network error, honeypot. Mock transport only.');
})().catch(e=>{console.error(e);process.exit(1)});
