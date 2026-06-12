(function(){
  var lang=localStorage.getItem('aiMindLang')||'vi';
  var theme=localStorage.getItem('theme')||'';
  if(theme==='dark'||(!theme&&matchMedia('(prefers-color-scheme: dark)').matches))document.documentElement.dataset.theme='dark';
  function applyLang(){document.documentElement.lang=lang;document.title=lang==='vi'?'Control Your AI Mind — Phòng mô phỏng':'Control Your AI Mind — Simulation Studio';document.querySelectorAll('[data-vi][data-en]').forEach(function(el){var value=el.dataset[lang];if(value.indexOf('<')>=0)el.innerHTML=value;else el.textContent=value});document.getElementById('lang-btn').textContent=lang==='vi'?'EN':'VN'}
  document.getElementById('lang-btn').addEventListener('click',function(){lang=lang==='vi'?'en':'vi';localStorage.setItem('aiMindLang',lang);applyLang()});
  document.getElementById('theme-btn').addEventListener('click',function(){var dark=document.documentElement.dataset.theme==='dark';if(dark)delete document.documentElement.dataset.theme;else document.documentElement.dataset.theme='dark';localStorage.setItem('theme',dark?'light':'dark')});
  applyLang();
})();
