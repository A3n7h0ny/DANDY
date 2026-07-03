// LOADER
window.addEventListener('load',()=>{
  setTimeout(()=>{
    document.getElementById('loader').classList.add('hidden');
  },1600);
});

// CURSOR
const cur=document.getElementById('cur');
const curRing=document.getElementById('curRing');
let mx=0,my=0,rx=0,ry=0;
document.addEventListener('mousemove',e=>{
  mx=e.clientX;my=e.clientY;
  cur.style.left=mx+'px';cur.style.top=my+'px';
});
(function animRing(){
  rx+=(mx-rx)*0.1;ry+=(my-ry)*0.1;
  curRing.style.left=rx+'px';curRing.style.top=ry+'px';
  requestAnimationFrame(animRing);
})();
document.querySelectorAll('a,button,.service-tile,.gallery-item,.about-card,.contact-way').forEach(el=>{
  el.addEventListener('mouseenter',()=>{cur.classList.add('big');curRing.classList.add('big');});
  el.addEventListener('mouseleave',()=>{cur.classList.remove('big');curRing.classList.remove('big');});
});

// PATTERN
const pattern=document.getElementById('locsPattern');
if(pattern){
  const count=40;
  for(let i=0;i<count;i++){
    const s=document.createElement('div');
    s.className='loc-strand';
    const h=80+Math.random()*200;
    const delay=Math.random()*3;
    const dur=2+Math.random()*2;
    s.style.cssText=`height:${h}px;animation-delay:${delay}s;animation-duration:${dur}s;opacity:${0.3+Math.random()*0.7}`;
    pattern.appendChild(s);
  }
}

// SCROLL REVEAL
const revEls=document.querySelectorAll('.reveal,.reveal-l,.reveal-r');
const revObs=new IntersectionObserver(entries=>{
  entries.forEach(e=>{
    if(e.isIntersecting)e.target.classList.add('in');
  });
},{threshold:0.1});
revEls.forEach(el=>revObs.observe(el));

// NAV DOTS
const sections=['home','services','gallery','about','booking'];
const dots=[document.getElementById('dot1'),document.getElementById('dot2'),document.getElementById('dot3'),document.getElementById('dot4')];
const secEls=sections.map(id=>document.getElementById(id)).filter(Boolean);
const dotObs=new IntersectionObserver(entries=>{
  entries.forEach(e=>{
    if(e.isIntersecting){
      const idx=sections.indexOf(e.target.id);
      dots.forEach((d,i)=>{
        if(d)d.classList.toggle('active',i===idx-1);
      });
    }
  });
},{threshold:0.4});
secEls.forEach(s=>dotObs.observe(s));

// GALLERY DRAG SCROLL
const strip=document.getElementById('galleryStrip');
if(strip){
  let isDown=false,startX,scrollL;
  strip.addEventListener('mousedown',e=>{isDown=true;startX=e.pageX-strip.offsetLeft;scrollL=strip.scrollLeft;strip.style.cursor='grabbing';});
  strip.addEventListener('mouseleave',()=>{isDown=false;strip.style.cursor='none';});
  strip.addEventListener('mouseup',()=>{isDown=false;strip.style.cursor='none';});
  strip.addEventListener('mousemove',e=>{
    if(!isDown)return;
    e.preventDefault();
    const x=e.pageX-strip.offsetLeft;
    strip.scrollLeft=scrollL-(x-startX)*1.2;
  });
}

// FORM
const form=document.getElementById('bookingForm');
const success=document.getElementById('formSuccess');
if(form){
  form.addEventListener('submit',async e=>{
    e.preventDefault();
    const btn=form.querySelector('.form-submit-btn');
    btn.innerHTML='<span>Sending…</span>';btn.disabled=true;
    try{
      const res=await fetch('/',{
        method:'POST',
        headers:{'Content-Type':'application/x-www-form-urlencoded'},
        body:new URLSearchParams(new FormData(form)).toString()
      });
      if(res.ok){form.style.display='none';success.style.display='block';}
      else throw new Error();
    }catch{
      const n=form.querySelector('[name=name]').value;
      const s=form.querySelector('[name=service]').value;
      window.location.href=`tel:0781159407`;
      btn.disabled=false;btn.innerHTML='<span>Send Booking Request →</span>';
    }
  });
}

// ── HERO RIGHT IMAGE SLIDESHOW ──
const heroSlides = document.querySelectorAll('.hero-slide');
const heroDots = document.querySelectorAll('.hero-dot');
const heroPrev = document.querySelector('.hero-slide-prev');
const heroNext = document.querySelector('.hero-slide-next');

let currentHeroSlide = 0;
let heroInterval;

function showHeroSlide(index) {
  heroSlides.forEach(slide => slide.classList.remove('active'));
  heroDots.forEach(dot => dot.classList.remove('active'));
  
  if (heroSlides[index]) heroSlides[index].classList.add('active');
  if (heroDots[index]) heroDots[index].classList.add('active');
  
  currentHeroSlide = index;
}

function nextHeroSlide() {
  let newIndex = currentHeroSlide + 1;
  if (newIndex >= heroSlides.length) newIndex = 0;
  showHeroSlide(newIndex);
  resetHeroInterval();
}

function prevHeroSlide() {
  let newIndex = currentHeroSlide - 1;
  if (newIndex < 0) newIndex = heroSlides.length - 1;
  showHeroSlide(newIndex);
  resetHeroInterval();
}

function resetHeroInterval() {
  clearInterval(heroInterval);
  heroInterval = setInterval(nextHeroSlide, 5000);
}

if (heroPrev && heroNext && heroSlides.length) {
  heroPrev.addEventListener('click', prevHeroSlide);
  heroNext.addEventListener('click', nextHeroSlide);
  
  heroDots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
      showHeroSlide(index);
      resetHeroInterval();
    });
  });
  
  heroInterval = setInterval(nextHeroSlide, 5000);
  
  // Pause on hover
  const heroRight = document.querySelector('.hero-right');
  if (heroRight) {
    heroRight.addEventListener('mouseenter', () => clearInterval(heroInterval));
    heroRight.addEventListener('mouseleave', () => {
      heroInterval = setInterval(nextHeroSlide, 5000);
    });
  }
}