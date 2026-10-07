(() => {
  'use strict';
  document.documentElement.classList.add('js');
  const config = window.FMV_CONFIG || {};
  const storage = {
    get(key) { try { return sessionStorage.getItem(key); } catch { return null; } },
    set(key, value) { try { sessionStorage.setItem(key, value); } catch { /* Navigation still works. */ } },
    remove(key) { try { sessionStorage.removeItem(key); } catch { /* No personal data is stored. */ } }
  };
  const utmNames = ['utm_source','utm_medium','utm_campaign','utm_term','utm_content'];
  const query = new URLSearchParams(location.search);
  const attribution = {};
  utmNames.forEach(name => {
    const value = query.get(name);
    if (value) storage.set('fmv_' + name, value.slice(0,250));
    attribution[name] = (value || storage.get('fmv_' + name) || '').slice(0,250);
  });
  if (!storage.get('fmv_landing')) storage.set('fmv_landing', location.pathname);
  const menu = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.nav');
  if (menu && nav) {
    menu.addEventListener('click', () => {
      const open = menu.getAttribute('aria-expanded') !== 'true';
      menu.setAttribute('aria-expanded', String(open)); nav.classList.toggle('open', open);
    });
    document.addEventListener('keydown', event => {
      if (event.key === 'Escape' && menu.getAttribute('aria-expanded') === 'true') {
        menu.setAttribute('aria-expanded','false'); nav.classList.remove('open'); menu.focus();
      }
    });
  }
  const hero = document.querySelector('.hero');
  if (hero && 'IntersectionObserver' in window && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
    new IntersectionObserver(entries => entries.forEach(entry => {
      hero.classList.toggle('cut', entry.intersectionRatio < 0.85);
    }), {threshold:[0,.4,.85,1]}).observe(hero);
  }
  function easternDateNumber() {
    const pieces = new Intl.DateTimeFormat('en-US', {timeZone:'America/New_York',year:'numeric',month:'2-digit',day:'2-digit'}).formatToParts(new Date());
    const values = Object.fromEntries(pieces.map(item => [item.type,item.value]));
    return Date.UTC(+values.year,+values.month-1,+values.day) / 86400000;
  }
  function initializeForm(form, source) {
    if (!form || form.dataset.ready) return;
    form.dataset.ready = 'true';
    const button = form.querySelector('button[type=submit]');
    const status = form.querySelector('.form-status');
    const deadline = form.elements.namedItem('compliance_deadline');
    const urgency = form.querySelector('.form-urgency');
    const key = String(config.web3formsAccessKey || '').trim();
    const configured = /^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/i.test(key);
    form.elements.namedItem('access_key').value = key;
    form.elements.namedItem('page_source').value = source;
    form.elements.namedItem('landing_page').value = storage.get('fmv_landing') || source;
    form.elements.namedItem('request_page').value = '/fix-my-violation/';
    utmNames.forEach(name => {form.elements.namedItem(name).value = attribution[name];});
    if (!configured) {
      status.hidden = false;
      status.innerHTML = '<p>For cleanup requests, please call <a href="tel:+18136712757">813-671-2757</a>. Online requests are temporarily unavailable.</p>';
      button.disabled = true; button.textContent = 'Please call to request cleanup';
    } else { button.disabled = false; }
    const updateDeadline = () => {
      if (!deadline.value) { urgency.hidden = true; return; }
      const [year, month, day] = deadline.value.split('-').map(Number);
      const days = Date.UTC(year, month-1, day) / 86400000 - easternDateNumber();
      urgency.hidden = !(Number.isFinite(days) && days <= 7);
      const text = days < 0 ? 'Your deadline appears to have passed. Call now to discuss cleanup, and contact your code officer about the case status.' : days === 0 ? 'Your deadline is today. Call now so we can discuss availability.' : `Your deadline is ${days} ${days === 1 ? 'day' : 'days'} away. Call now to discuss availability before it passes.`;
      urgency.querySelector('[data-urgency-text]').textContent = text;
    };
    deadline.addEventListener('input',updateDeadline); deadline.addEventListener('change',updateDeadline); updateDeadline();
    form.addEventListener('submit',async event => {
      event.preventDefault();
      if (form.dataset.sending === 'true' || !configured) return;
      if (!form.reportValidity()) return;
      if (form.elements.namedItem('botcheck').checked) return;
      form.dataset.sending = 'true'; button.disabled = true; button.textContent = 'Sending your request…';
      status.hidden = false; status.textContent = 'Sending your cleanup details. Please keep this page open.';
      const payload = new FormData(form);
      payload.delete('botcheck');
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 25000);
      try {
        const response = await fetch('https://api.web3forms.com/submit', {
          method:'POST', body:payload, signal:controller.signal, headers:{'Accept':'application/json'}
        });
        const result = await response.json();
        if (!response.ok || result.success !== true) throw new Error('Request was not confirmed');
        storage.set('fmv_received',String(Date.now()));
        location.assign('/thank-you/?received=1');
      } catch {
        status.innerHTML = '<p>We could not confirm delivery. Your details are still here. Please call <a href="tel:+18136712757">813-671-2757</a> before sending again, especially if your deadline is close.</p>';
        status.focus(); button.disabled = false; button.textContent = 'Send cleanup request'; form.dataset.sending = 'false';
      } finally { clearTimeout(timer); }
    });
  }
  initializeForm(document.querySelector('.lead-form'),location.pathname);
  const confirmation = document.querySelector('[data-confirmation]');
  if (confirmation) {
    const received = Number(storage.get('fmv_received'));
    if (query.get('received') === '1' && received && Date.now()-received < 1800000) {
      document.querySelector('[data-confirmation-title]').textContent = 'Your request has been sent.';
      confirmation.textContent = 'Thank you. We’ll review the property details and contact you at the number you provided to discuss the work and availability.';
      history.replaceState(null,'',location.pathname);
    }
  }
  let dialog, trigger, loading = false;
  document.addEventListener('click',async event => {
    const link = event.target.closest('a[data-request]');
    if (!link || location.pathname === '/fix-my-violation/' || !matchMedia('(min-width: 960px)').matches || !window.HTMLDialogElement || event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    if (loading) return;
    trigger = link;
    if (dialog) {dialog.showModal(); document.body.classList.add('modal-open'); return;}
    loading = true;
    const originalText = link.getAttribute('aria-label');
    link.setAttribute('aria-busy','true');
    const controller = new AbortController(); const timer = setTimeout(() => controller.abort(),8000);
    try {
      const response = await fetch('/fix-my-violation/',{signal:controller.signal});
      if (!response.ok) throw new Error('Unable to open request form');
      const html = new DOMParser().parseFromString(await response.text(),'text/html');
      const content = html.querySelector('.form-layout'); if (!content) throw new Error('Form missing');
      dialog = document.createElement('dialog'); dialog.className = 'form-dialog'; dialog.setAttribute('aria-labelledby','dialog-title');
      dialog.innerHTML = '<div class="dialog-head"><h2 id="dialog-title">Let’s get your property cleared.</h2><button type="button" data-close>Close</button></div><div class="dialog-body"><p class="small">Tell us what the notice says. <a href="/fix-my-violation/">Open the full request page</a>.</p></div>';
      dialog.querySelector('.dialog-body').append(document.importNode(content,true));
      document.body.append(dialog);
      dialog.querySelector('[data-close]').addEventListener('click',()=>dialog.close());
      dialog.addEventListener('close',()=> {document.body.classList.remove('modal-open'); if (trigger) trigger.focus();});
      initializeForm(dialog.querySelector('.lead-form'),location.pathname);
      dialog.showModal(); document.body.classList.add('modal-open');
    } catch { location.assign(link.href); }
    finally {clearTimeout(timer); loading=false; link.removeAttribute('aria-busy'); if(originalText) link.setAttribute('aria-label',originalText);}
  });
})();
