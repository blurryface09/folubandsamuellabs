// ══ Three.js 3D Scene ═══════════════════════════════════
(function(){
  const canvas = document.getElementById('canvas-bg');
  const renderer = new THREE.WebGLRenderer({canvas, antialias:true, alpha:true});
  renderer.setPixelRatio(Math.min(window.devicePixelRatio,1.5));
  renderer.setSize(window.innerWidth, window.innerHeight);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, window.innerWidth/window.innerHeight, 0.1, 1000);
  camera.position.set(0, 0, 5);

  // Gold colours
  const GOLD = 0xC9A84C, GOLD_B = 0xF5D060, GOLD_D = 0x8B6914;

  // ── Floating wireframe icosahedron ──────────────────
  const icoGeo = new THREE.IcosahedronGeometry(1.4, 1);
  const icoMat = new THREE.MeshBasicMaterial({
    color: GOLD, wireframe: true, transparent: true, opacity: 0.08
  });
  const ico = new THREE.Mesh(icoGeo, icoMat);
  scene.add(ico);

  // ── Outer ring torus ────────────────────────────────
  const torusMat = new THREE.MeshBasicMaterial({
    color: GOLD_B, wireframe: true, transparent: true, opacity: 0.04
  });
  const torus = new THREE.Mesh(new THREE.TorusGeometry(2.2, 0.015, 8, 80), torusMat);
  torus.rotation.x = Math.PI / 3;
  scene.add(torus);

  const torus2 = new THREE.Mesh(new THREE.TorusGeometry(2.8, 0.01, 6, 80), torusMat.clone());
  torus2.rotation.x = -Math.PI / 5;
  torus2.rotation.y = Math.PI / 4;
  scene.add(torus2);

  // ── Particle field ──────────────────────────────────
  const COUNT = 1200;
  const positions = new Float32Array(COUNT * 3);
  const sizes = new Float32Array(COUNT);
  const colors = new Float32Array(COUNT * 3);

  // Gold colour variants
  const palette = [
    new THREE.Color(GOLD_B), new THREE.Color(GOLD), new THREE.Color(GOLD_D),
    new THREE.Color(0xffffff), new THREE.Color(0x444220)
  ];

  for(let i=0; i<COUNT; i++){
    // Fibonacci sphere distribution
    const phi = Math.acos(1 - 2*(i+.5)/COUNT);
    const theta = Math.PI * (1+Math.sqrt(5)) * i;
    const r = 3.2 + (Math.random()-.5)*2.5;
    positions[i*3]   = r * Math.sin(phi) * Math.cos(theta);
    positions[i*3+1] = r * Math.sin(phi) * Math.sin(theta);
    positions[i*3+2] = r * Math.cos(phi);
    sizes[i] = Math.random()*1.5 + .4;
    const c = palette[Math.floor(Math.random()*palette.length)];
    colors[i*3]=c.r; colors[i*3+1]=c.g; colors[i*3+2]=c.b;
  }

  const pGeo = new THREE.BufferGeometry();
  pGeo.setAttribute('position', new THREE.BufferAttribute(positions,3));
  pGeo.setAttribute('color', new THREE.BufferAttribute(colors,3));
  pGeo.setAttribute('size', new THREE.BufferAttribute(sizes,1));

  const pMat = new THREE.PointsMaterial({
    size:.025, vertexColors:true, transparent:true, opacity:.55,
    sizeAttenuation:true, depthWrite:false, blending:THREE.AdditiveBlending
  });

  const particles = new THREE.Points(pGeo, pMat);
  scene.add(particles);

  // ── Small floating cubes (reduced for perf) ─────────
  const cubes = [];
  for(let i=0; i<5; i++){
    const s = .04+Math.random()*.06;
    const m = new THREE.Mesh(
      new THREE.BoxGeometry(s,s,s),
      new THREE.MeshBasicMaterial({color:GOLD, transparent:true, opacity:.2+Math.random()*.25, wireframe:true})
    );
    m.position.set((Math.random()-.5)*8,(Math.random()-.5)*8,(Math.random()-.5)*4);
    m.userData = {
      rx:Math.random()*.008-.004, ry:Math.random()*.008-.004,
      fy:.002+Math.random()*.003, phase:Math.random()*Math.PI*2
    };
    scene.add(m);
    cubes.push(m);
  }

  // ── Mouse tracking ──────────────────────────────────
  let mx=0,my=0, tx=0,ty=0;
  document.addEventListener('mousemove',e=>{
    mx=(e.clientX/window.innerWidth-.5)*2;
    my=-(e.clientY/window.innerHeight-.5)*2;
  });

  // ── Resize ──────────────────────────────────────────
  window.addEventListener('resize',()=>{
    camera.aspect=window.innerWidth/window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth,window.innerHeight);
  });

  // ── Animate ─────────────────────────────────────────
  let t=0;
  function animate(){
    requestAnimationFrame(animate);
    t+=.004;

    tx+=(mx-tx)*.04; ty+=(my-ty)*.04;

    ico.rotation.x = ty*.3 + t*.15;
    ico.rotation.y = tx*.3 + t*.2;
    torus.rotation.z = t*.08;
    torus2.rotation.y = t*.05;
    particles.rotation.y = t*.05 + tx*.08;
    particles.rotation.x = ty*.05;

    cubes.forEach(c=>{
      const d=c.userData;
      c.rotation.x+=d.rx; c.rotation.y+=d.ry;
      c.position.y+=Math.sin(t+d.phase)*d.fy;
    });

    renderer.render(scene, camera);
  }
  animate();
})();

// ══ Lenis Smooth Scroll ══════════════════════════════
const lenis = new Lenis({
  duration:1.3, easing:t=>Math.min(1,1.001-Math.pow(2,-10*t)),
  smooth:true
});
lenis.on('scroll',ScrollTrigger.update);
gsap.ticker.add(time=>lenis.raf(time*1000));
gsap.ticker.lagSmoothing(0);

// ══ GSAP ScrollTrigger Setup ══════════════════════════
gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

// Scroll progress bar
ScrollTrigger.create({
  start:'top top', end:'bottom bottom',
  onUpdate:self=>{
    document.getElementById('progress-bar').style.width = (self.progress*100)+'%';
  }
});

// Navbar scroll state
ScrollTrigger.create({
  start:'80px top',
  onEnter:()=>document.getElementById('navbar').classList.add('scrolled'),
  onLeaveBack:()=>document.getElementById('navbar').classList.remove('scrolled'),
});

// ── Generic reveals ──────────────────────────────────
function reveal(selector, xFrom=0, yFrom=32, delay=0){
  document.querySelectorAll(selector).forEach((el,i)=>{
    gsap.fromTo(el,
      {opacity:0, x:xFrom, y:yFrom},
      {
        opacity:1, x:0, y:0,
        duration:1, ease:'power3.out',
        delay: delay + i*.1,
        scrollTrigger:{trigger:el, start:'top 88%', toggleActions:'play none none none'}
      }
    );
  });
}
reveal('.reveal');
reveal('.reveal-left', -40, 0);
reveal('.reveal-right', 40, 0);
reveal('.reveal-scale', 0, 0, 0, {scale:.95});
gsap.utils.toArray('.reveal-scale').forEach(el=>{
  gsap.fromTo(el,{opacity:0,scale:.95},{
    opacity:1,scale:1,duration:1.1,ease:'power3.out',
    scrollTrigger:{trigger:el,start:'top 85%',toggleActions:'play none none none'}
  });
});

// ── Hero text stagger ─────────────────────────────────
gsap.fromTo('.hero-badge',
  {opacity:0,y:20},{opacity:1,y:0,duration:.8,ease:'power3.out',delay:.2}
);
gsap.fromTo('.hero-title .word',
  {opacity:0,y:60,skewY:4},
  {opacity:1,y:0,skewY:0,duration:1.1,ease:'power4.out',stagger:.12,delay:.4}
);
gsap.fromTo('.hero-sub',
  {opacity:0,y:24},{opacity:1,y:0,duration:.9,ease:'power3.out',delay:.85}
);
gsap.fromTo('.hero-actions',
  {opacity:0,y:20},{opacity:1,y:0,duration:.8,ease:'power3.out',delay:1.05}
);

// ── Counter animation ─────────────────────────────────
document.querySelectorAll('[data-count]').forEach(el=>{
  const end = +el.dataset.count;
  ScrollTrigger.create({
    trigger:el, start:'top 85%', once:true,
    onEnter:()=>{
      gsap.to({n:0},{n:end,duration:1.8,ease:'power2.out',
        onUpdate:function(){el.textContent=Math.round(this.targets()[0].n)+(end>=40?'+':end===98?'%':end===5?'+':'')}
      });
    }
  });
});

// ── Service cards stagger ─────────────────────────────
gsap.utils.toArray('.service-card').forEach((el,i)=>{
  gsap.fromTo(el,
    {opacity:0,y:40},
    {opacity:1,y:0,duration:.9,ease:'power3.out',delay:i*.07,
     scrollTrigger:{trigger:'.services-grid',start:'top 82%',toggleActions:'play none none none'}}
  );
});

// ── Team cards ────────────────────────────────────────
gsap.utils.toArray('.team-card').forEach((el,i)=>{
  gsap.fromTo(el,
    {opacity:0,y:50},
    {opacity:1,y:0,duration:1,ease:'power3.out',delay:i*.15,
     scrollTrigger:{trigger:'.team-grid',start:'top 82%',toggleActions:'play none none none'}}
  );
});

// ══ Custom Cursor ════════════════════════════════════
const dot  = document.getElementById('c-dot');
const ring = document.getElementById('c-ring');
let cx=0,cy=0, rx=0,ry=0;

document.addEventListener('mousemove',e=>{
  cx=e.clientX; cy=e.clientY;
  dot.style.left=cx+'px'; dot.style.top=cy+'px';
});
function moveCursor(){
  rx+=(cx-rx)*.12; ry+=(cy-ry)*.12;
  ring.style.left=rx+'px'; ring.style.top=ry+'px';
  requestAnimationFrame(moveCursor);
}
moveCursor();

document.querySelectorAll('a,button,.magnetic,.tilt-card,.service-card,.team-card,.process-item').forEach(el=>{
  el.addEventListener('mouseenter',()=>document.body.classList.add('cursor-hover'));
  el.addEventListener('mouseleave',()=>document.body.classList.remove('cursor-hover'));
});
document.addEventListener('mousedown',()=>document.body.classList.add('cursor-click'));
document.addEventListener('mouseup',()=>document.body.classList.remove('cursor-click'));

// ══ Magnetic buttons ══════════════════════════════════
document.querySelectorAll('.magnetic').forEach(el=>{
  el.addEventListener('mousemove',e=>{
    const r=el.getBoundingClientRect();
    const x=(e.clientX-r.left-r.width/2)*.35;
    const y=(e.clientY-r.top-r.height/2)*.35;
    el.style.transform=`translate(${x}px,${y}px)`;
  });
  el.addEventListener('mouseleave',()=>el.style.transform='');
});

// ══ 3D Tilt cards ════════════════════════════════════
document.querySelectorAll('.tilt-card').forEach(card=>{
  card.addEventListener('mousemove',e=>{
    const r=card.getBoundingClientRect();
    const x=((e.clientX-r.left)/r.width-.5)*18;
    const y=-((e.clientY-r.top)/r.height-.5)*18;
    card.style.transform=`perspective(600px) rotateX(${y}deg) rotateY(${x}deg) translateY(-6px)`;
  });
  card.addEventListener('mouseleave',()=>{
    card.style.transform='perspective(600px) rotateX(0deg) rotateY(0deg) translateY(0px)';
    card.style.transition='transform .5s ease';
    setTimeout(()=>card.style.transition='',500);
  });
});

// ══ Region slot cycler ═══════════════════════════════
(function(){
  const regions = ['Africa','Europe','Asia','Americas','The World'];
  const slot = document.getElementById('region-slot');
  if(!slot) return;
  slot.textContent = regions[0];
  gsap.set(slot, {opacity:1});
  let idx = 0;
  setInterval(()=>{
    idx = (idx + 1) % regions.length;
    gsap.to(slot, {
      opacity:0, duration:.3, ease:'power2.in',
      onComplete:()=>{
        slot.textContent = regions[idx];
        gsap.to(slot, {opacity:1, duration:.4, ease:'power3.out'});
      }
    });
  }, 2400);
})();

// ══ Mobile menu ══════════════════════════════════════
const hamburger=document.getElementById('hamburger');
const mobileMenu=document.getElementById('mobile-menu');
function setMenu(open){
  if(!hamburger||!mobileMenu) return;
  mobileMenu.classList.toggle('open',open);
  hamburger.classList.toggle('open',open);
  hamburger.setAttribute('aria-expanded',String(open));
}
if(hamburger&&mobileMenu){
  hamburger.addEventListener('click',()=>setMenu(!mobileMenu.classList.contains('open')));
  // Same-page links scroll behind the panel, so it has to close itself.
  mobileMenu.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>setMenu(false)));
  document.addEventListener('keydown',e=>{ if(e.key==='Escape') setMenu(false); });
  window.addEventListener('resize',()=>{ if(window.innerWidth>768) setMenu(false); });
}

// ══ Smooth nav links ════════════════════════════════
document.querySelectorAll('a[href^="#"]').forEach(a=>{
  a.addEventListener('click',e=>{
    const href=a.getAttribute('href');
    // A bare "#" is not a valid selector — querySelector('#') throws — and the
    // logo plus the footer placeholder links all use it.
    if(!href||href==='#'){e.preventDefault();lenis.scrollTo(0,{duration:1.2});return}
    const t=document.querySelector(href);
    if(t){e.preventDefault();lenis.scrollTo(t,{offset:-80,duration:1.5})}
  });
});

// ══ Parallax on sections ════════════════════════════
gsap.utils.toArray('section').forEach(s=>{
  gsap.to(s,{
    yPercent:-3,
    scrollTrigger:{trigger:s,start:'top bottom',end:'bottom top',scrub:1.5}
  });
});
