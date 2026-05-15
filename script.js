/* ===== BHARTI GLOOMS — AUREN Script ===== */
(function(){
'use strict';
const state={mx:0,my:0,cx:0,cy:0,rx:0,ry:0};
const preloader=document.getElementById('preloader');
const bar=document.getElementById('preloaderProgress');

async function init(){
  // Fast preloader for video background
  bar.style.width = '100%';
  setTimeout(()=>{
    preloader.classList.add('done');
    document.getElementById('hero').classList.add('visible');
  }, 600);
  
  setupScroll();
  setupReveals();
  setupNav();
  setupCursor();
  setupAnchors();
}

function setupScroll(){
  const hero=document.getElementById('hero');
  const content=document.querySelector('.hero-content');
  const indicator=document.getElementById('scrollIndicator');
  let ticking=false;

  function update(){
    const rect=hero.getBoundingClientRect();
    const scrolled=-rect.top;
    
    // Normal scroll for a 100vh hero section, just add a slight parallax/fade if still visible
    if (scrolled >= 0 && scrolled <= window.innerHeight) {
        const p=scrolled/window.innerHeight;
        const fade=Math.max(0,1-p*2);
        content.style.opacity=fade;
        content.style.transform=`translateY(${p*100}px)`;
        indicator.style.opacity=Math.max(0,1-p*4);
    }
    ticking=false;
  }

  window.addEventListener('scroll',()=>{
    if(!ticking){ticking=true;requestAnimationFrame(update)}
  },{passive:true});
  update();
}

function setupReveals(){
  const obs=new IntersectionObserver(es=>{
    es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');obs.unobserve(e.target)}});
  },{threshold:0.12,rootMargin:'0px 0px -40px 0px'});
  document.querySelectorAll('.reveal-up,.reveal-left,.reveal-right').forEach(e=>obs.observe(e));
}

function setupNav(){
  const nav=document.getElementById('mainNav');
  const ham=document.getElementById('navHamburger');
  const menu=document.getElementById('mobileMenu');
  const links=document.querySelectorAll('.mobile-link');
  window.addEventListener('scroll',()=>nav.classList.toggle('scrolled',window.scrollY>60),{passive:true});
  ham.addEventListener('click',()=>{
    ham.classList.toggle('active');menu.classList.toggle('open');
    document.body.style.overflow=menu.classList.contains('open')?'hidden':'';
  });
  links.forEach(l=>l.addEventListener('click',()=>{
    ham.classList.remove('active');menu.classList.remove('open');document.body.style.overflow='';
  }));
}

function setupCursor(){
  if(window.innerWidth<769||matchMedia('(pointer:coarse)').matches)return;
  const dot=document.getElementById('cursorDot');
  const ring=document.getElementById('cursorRing');
  document.addEventListener('mousemove',e=>{state.mx=e.clientX;state.my=e.clientY});
  document.querySelectorAll('a,button,.sensory-card,.variant-card').forEach(el=>{
    el.addEventListener('mouseenter',()=>ring.classList.add('hover'));
    el.addEventListener('mouseleave',()=>ring.classList.remove('hover'));
  });
  (function anim(){
    state.cx+=(state.mx-state.cx)*.18;state.cy+=(state.my-state.cy)*.18;
    state.rx+=(state.mx-state.rx)*.09;state.ry+=(state.my-state.ry)*.09;
    dot.style.left=state.cx+'px';dot.style.top=state.cy+'px';
    ring.style.left=state.rx+'px';ring.style.top=state.ry+'px';
    requestAnimationFrame(anim);
  })();
}

function setupAnchors(){
  document.querySelectorAll('a[href^="#"]').forEach(a=>{
    a.addEventListener('click',e=>{
      const id=a.getAttribute('href');if(id==='#')return;
      const t=document.querySelector(id);if(!t)return;
      e.preventDefault();t.scrollIntoView({behavior:'smooth',block:'start'});
    });
  });
}

init();
})();
