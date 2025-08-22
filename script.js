// script.js — clock, theme, translate-widget (auto), populate staff, wiggle images, block copy/select
document.addEventListener('DOMContentLoaded', function(){

  // ---- digital clock ----
  const clock = document.getElementById('clock');
  function tick(){ const now = new Date(); const h=String(now.getHours()).padStart(2,'0'); const m=String(now.getMinutes()).padStart(2,'0'); const s=String(now.getSeconds()).padStart(2,'0'); clock.textContent = `${h}:${m}:${s}`; }
  setInterval(tick,1000); tick();

  // ---- theme toggle ----
  const themeToggle = document.getElementById('themeToggle');
  themeToggle.addEventListener('click', ()=> {
    const body = document.body;
    const cur = body.getAttribute('data-theme') || 'dark';
    const next = cur === 'dark' ? 'light' : 'dark';
    body.setAttribute('data-theme', next);
    themeToggle.setAttribute('aria-pressed', next === 'dark' ? 'false' : 'true');
  });

  // ---- auto-translate (one-click) using Google Translate widget ----
  // approach: lazy-load widget, then programmatically set language select to 'en' and trigger change.
  const translateBtn = document.getElementById('translateBtn');
  let gtLoaded = false;
  translateBtn.addEventListener('click', async () => {
    if (!gtLoaded) {
      // load google widget
      const s = document.createElement('script');
      s.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
      document.body.appendChild(s);
      // expose init callback
      window.googleTranslateElementInit = function() {
        new google.translate.TranslateElement({pageLanguage: 'bn', layout: google.translate.TranslateElement.InlineLayout.SIMPLE}, document.createElement('div'));
        gtLoaded = true;
        // small delay then attempt to set language
        setTimeout(() => trySetLang('en'), 700);
      };
      // fallback: if not loaded in 3s, open translate view
      setTimeout(()=> {
        if(!gtLoaded) window.open('https://translate.google.com/translate?sl=bn&tl=en&u=' + encodeURIComponent(location.href), '_blank');
      }, 3000);
    } else {
      trySetLang('en');
    }
  });

  function trySetLang(lang) {
    try {
      // the language <select> for google widget has class .goog-te-combo
      const combo = document.querySelector('.goog-te-combo');
      if (combo) {
        combo.value = lang;
        combo.dispatchEvent(new Event('change'));
      } else {
        // fallback: open translated view in new tab
        window.open('https://translate.google.com/translate?sl=bn&tl=' + lang + '&u=' + encodeURIComponent(location.href), '_blank');
      }
    } catch(e) {
      window.open('https://translate.google.com/translate?sl=bn&tl=' + lang + '&u=' + encodeURIComponent(location.href), '_blank');
    }
  }

  // ---- populate teachers & staff (realistic sample data) ----
  const teachers = [
    {name:'মোঃ কামাল', subject:'বাংলা', phone:'+8801701000001', img:'https://picsum.photos/seed/t1/200'},
    {name:'শাহানা বেগম', subject:'ইংরেজি', phone:'+8801701000002', img:'https://picsum.photos/seed/t2/200'},
    {name:'মো. আজিজ', subject:'গণিত', phone:'+8801701000003', img:'https://picsum.photos/seed/t3/200'},
    {name:'রুবিলা আক্তার', subject:'বিজ্ঞান', phone:'+8801701000004', img:'https://picsum.photos/seed/t4/200'},
    {name:'আব্দুল্লাহ আল মমিন', subject:'ইসলাম', phone:'+8801701000005', img:'https://picsum.photos/seed/t5/200'},
    {name:'লিয়াকত আলী', subject:'কম্পিউটার', phone:'+8801701000006', img:'https://picsum.photos/seed/t6/200'},
    {name:'করিম উদ্দিন', subject:'শারীরিক শিক্ষা', phone:'+8801701000007', img:'https://picsum.photos/seed/t7/200'},
    {name:'মিনা রহমান', subject:'অর্থনীতি', phone:'+8801701000008', img:'https://picsum.photos/seed/t8/200'},
    {name:'জামিলা দেব', subject:'লাইব্রেরি', phone:'+8801701000009', img:'https://picsum.photos/seed/t9/200'},
    {name:'শান্তনু বিশ্বাস', subject:'সামাজিক বিজ্ঞান', phone:'+8801701000010', img:'https://picsum.photos/seed/t10/200'},
    {name:'রোকসানা পারভীন', subject:'ক্রিয়েটিভ আর্টস', phone:'+8801701000011', img:'https://picsum.photos/seed/t11/200'},
    {name:'নুরুল ইসলাম', subject:'প্রয়োগিক', phone:'+8801701000012', img:'https://picsum.photos/seed/t12/200'},
    {name:'আব্দুল করিম', subject:'বিশেষ', phone:'+8801701000013', img:'https://picsum.photos/seed/t13/200'}
  ];
  const staff = [
    {name:'হেলেন খাতুন', role:'অফিস সহকারী', phone:'+8801801000001', img:'https://picsum.photos/seed/s1/200'},
    {name:'সুলতান আহমেদ', role:'লাইব্রেরিয়ান', phone:'+8801801000002', img:'https://picsum.photos/seed/s2/200'},
    {name:'রফিক উল্লাহ', role:'নিরাপত্তা', phone:'+8801801000003', img:'https://picsum.photos/seed/s3/200'},
    {name:'নূর জামান', role:'পরিচ্ছন্নতা', phone:'+8801801000004', img:'https://picsum.photos/seed/s4/200'},
    {name:'সালমা আক্তার', role:'অফিস সিক্রেটারি', phone:'+8801801000005', img:'https://picsum.photos/seed/s5/200'},
    {name:'মিজানুর রহমান', role:'হেল্পার', phone:'+8801801000006', img:'https://picsum.photos/seed/s6/200'}
  ];

  const tContainer = document.getElementById('teachersList');
  teachers.forEach(t => {
    const div = document.createElement('div'); div.className = 'person';
    div.innerHTML = `<img src="${t.img}" alt="${t.name}" class="round-img" onclick="wiggle(this)"><div style="margin-top:8px;font-weight:600">${t.name}</div><div style="font-size:13px;color:var(--muted)">${t.subject}</div><div style="font-size:12px;color:var(--muted)">${t.phone}</div>`;
    tContainer.appendChild(div);
  });

  const sContainer = document.getElementById('staffList');
  staff.forEach(s => {
    const div = document.createElement('div'); div.className = 'person';
    div.innerHTML = `<img src="${s.img}" alt="${s.name}" class="round-img" onclick="wiggle(this)"><div style="margin-top:8px;font-weight:600">${s.name}</div><div style="font-size:13px;color:var(--muted)">${s.role}</div><div style="font-size:12px;color:var(--muted)">${s.phone}</div>`;
    sContainer.appendChild(div);
  });

  // ---- wiggle animation ----
  window.wiggle = function(img){
    img.animate([{transform:'translateY(0)'},{transform:'translateY(-12px) rotate(-6deg)'},{transform:'translateY(0)'}],{duration:600,iterations:1});
  };

  // Round images (teacher/staff)
  document.querySelectorAll('.people-grid img, .head-teacher img').forEach(i=>i.style.borderRadius='50%');

  // ---- block copy/select/contextmenu (best-effort) ----
  document.addEventListener('contextmenu', e => e.preventDefault());
  document.addEventListener('copy', e => { e.preventDefault(); alert('এই সাইট থেকে কপি করা যাবে না।'); });
  document.addEventListener('selectstart', e => e.preventDefault());
  document.addEventListener('keydown', function(e){
    if ((e.ctrlKey && (e.key === 'c' || e.key === 'u' || e.key === 's')) || (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'i') || e.key === 'F12') {
      e.preventDefault();
    }
  });

  // pause marquees on hover/focus
  document.querySelectorAll('.marquee').forEach(mq=>{
    mq.addEventListener('mouseenter', ()=> mq.querySelector('.marquee-inner').style.animationPlayState='paused');
    mq.addEventListener('mouseleave', ()=> mq.querySelector('.marquee-inner').style.animationPlayState='running');
  });
});
    
