(function(){
  function get(k){try{return localStorage.getItem(k);}catch(e){return null;}}
  function set(k,v){try{localStorage.setItem(k,v);}catch(e){}}

  // Tabloları kaydırılabilir kutuya al (mobilde yatay kaydırma)
  document.querySelectorAll('main table').forEach(function(t){
    if(t.parentElement.classList.contains('tw'))return;
    var w=document.createElement('div');w.className='tw';
    t.parentNode.insertBefore(w,t);w.appendChild(t);
  });

  // Mobil menü
  var side=document.getElementById('side'),ov=document.getElementById('overlay'),btn=document.getElementById('menuBtn');
  function openMenu(o){side.classList.toggle('open',o);ov.classList.toggle('show',o);document.body.classList.toggle('lock',o);}
  btn.onclick=function(){openMenu(!side.classList.contains('open'));};
  ov.onclick=function(){openMenu(false);};
  side.addEventListener('click',function(e){if(e.target.closest('a'))openMenu(false);});
  document.addEventListener('keydown',function(e){if(e.key==='Escape')openMenu(false);});

  // Tema (üst çubuktaki buton)
  var tb2=document.getElementById('themeBtn2');
  if(tb2)tb2.onclick=function(){document.getElementById('themeBtn').click();};

  // Yazı boyutu
  var fs=parseFloat(get('edelil-fs'))||0;
  function applyFs(){
    if(fs)document.documentElement.style.setProperty('--fs',fs+'px');
    else document.documentElement.style.removeProperty('--fs');
  }
  function base(){return parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--fs'))||17;}
  applyFs();
  document.getElementById('fontUp').onclick=function(){fs=Math.min(22,base()+1);set('edelil-fs',fs);applyFs();};
  document.getElementById('fontDown').onclick=function(){fs=Math.max(14,base()-1);set('edelil-fs',fs);applyFs();};

  // Aktif bölüm, okuma çubuğu, başa dön
  var links=[].slice.call(side.querySelectorAll('a[href^="#"]'));
  var targets=links.map(function(a){return document.getElementById(a.getAttribute('href').slice(1));});
  var cur=document.getElementById('curSec'),bar=document.getElementById('readbar'),top=document.getElementById('toTop');
  var ticking=false;
  function onScroll(){
    ticking=false;
    var y=window.scrollY,h=document.documentElement.scrollHeight-innerHeight;
    bar.style.width=(h>0?Math.min(100,y/h*100):0)+'%';
    top.classList.toggle('show',y>800);
    var idx=0;
    for(var i=0;i<targets.length;i++){ if(targets[i]&&targets[i].getBoundingClientRect().top<120) idx=i; }
    links.forEach(function(a,i){a.classList.toggle('active',i===idx);});
    if(cur&&links[idx])cur.textContent=links[idx].textContent.replace(/^\d+\s·\s/,'');
  }
  window.addEventListener('scroll',function(){if(!ticking){ticking=true;requestAnimationFrame(onScroll);}},{passive:true});
  top.onclick=function(){window.scrollTo({top:0,behavior:'smooth'});};
  onScroll();
})();
