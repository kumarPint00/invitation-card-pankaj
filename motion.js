(() => {
  'use strict';
  const film = document.querySelector('#film');
  if (!film || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  let x=0, y=0, currentX=0, currentY=0, last=0;
  const scene = () => document.querySelector('.scene.is-active .cartoon-svg');
  const pointer = e => {
    const rect=film.getBoundingClientRect();
    x=Math.max(-1,Math.min(1,(e.clientX-(rect.left+rect.width/2))/(rect.width/2)));
    y=Math.max(-1,Math.min(1,(e.clientY-(rect.top+rect.height/2))/(rect.height/2)));
  };
  film.addEventListener('pointermove',pointer,{passive:true});
  film.addEventListener('pointerleave',()=>{x=0;y=0},{passive:true});
  document.addEventListener('visibilitychange',()=>{if(document.hidden){x=0;y=0}});
  // A small simulated dolly displacement (max ~5px). All character action remains autonomous.
  const draw = stamp => {
    if (stamp-last>32) {
      last=stamp;
      currentX+=(x-currentX)*.055;currentY+=(y-currentY)*.055;
      const active=scene();
      if(active){active.style.setProperty('--look-x',`${(currentX*4).toFixed(2)}px`);active.style.setProperty('--look-y',`${(currentY*3).toFixed(2)}px`);}
    }
    requestAnimationFrame(draw);
  };
  requestAnimationFrame(draw);
})();
