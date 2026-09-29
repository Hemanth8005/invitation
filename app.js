(() => {
  const d = window.weddingData;
  const $ = (s, root=document) => root.querySelector(s);
  const $$ = (s, root=document) => [...root.querySelectorAll(s)];
  Object.entries(d.colors).forEach(([key,value]) => document.documentElement.style.setProperty(`--${key}`,value));
  $$('[data-copy]').forEach(el => el.textContent = d.copy[el.dataset.copy]);
  $$('[data-name]').forEach(el => el.textContent = d.couple[el.dataset.name]);
  $$('[data-parent]').forEach(el => el.textContent = d.parents[el.dataset.parent]);
  $$('[data-asset]').forEach(el => el.src = d.assets[el.dataset.asset]);
  $('#music').src = d.assets.music;
  $('#coverGroom').textContent = d.couple.groom;
  $('#coverBride').textContent = d.couple.bride;
  $('#coverDate').textContent = d.wedding.date;
  $('#envelopeDate').textContent = d.wedding.shortDate;
  $('#revealDateText').innerHTML = d.wedding.revealDate;
  $('#closingNames').textContent = d.couple.closingNames;
  $('#closingDate').textContent = d.wedding.shortDate;
  $('#weddingDate').textContent = d.wedding.date;
  $('#weddingDay').textContent = d.wedding.day;
  $('#weddingTime').textContent = d.wedding.time;
  $('#weddingVenue').textContent = d.wedding.venue;
  $('#weddingLocation').textContent = d.wedding.location;
  $('#mapVenue').textContent = d.wedding.mapVenueLabel;
  $('#mapLocation').textContent = d.wedding.mapLocationLabel;
  $('#footerNames').textContent = `${d.couple.groom} & ${d.couple.bride}`;
  document.title = `${d.couple.groom} & ${d.couple.bride} | Wedding Invitation`;
  const description = `Join us as we celebrate our wedding and begin our forever — ${d.wedding.date}.`;
  document.querySelector('meta[name=description]').content = description;
  document.querySelector('meta[property="og:title"]').content = document.title;
  document.querySelector('meta[property="og:description"]').content = description;
  const mapTargets = { wedding:d.wedding.mapUrl };
  $$('[data-map]').forEach(el => { el.href = mapTargets[el.dataset.map]; });
  const receptions = d.receptions;
  $('#receptionGrid').innerHTML = receptions.map((r,i) => `<article class="reception-card"><span class="r-number">Reception ${String(i+1).padStart(2,'0')}</span><h3>${r.venue}</h3><p class="r-location">${r.location}</p><p class="r-date">${r.date}</p><p class="r-time">${r.day} <span>·</span> ${r.time}</p><div class="r-qr" data-qr="reception-${i}" aria-label="QR code for ${r.venue} map"></div><a class="r-map" href="${r.mapUrl}" target="_blank" rel="noreferrer">View Location ↗</a></article>`).join('');
  const qr = (node, url) => { if (window.QRCode) new QRCode(node,{text:url,width:102,height:102,colorDark:'#241820',colorLight:'#ffffff',correctLevel:QRCode.CorrectLevel.M}); };
  $$('[data-qr="wedding"]').forEach(el=>qr(el,d.wedding.mapUrl));
  receptions.forEach((r,i)=>qr($(`[data-qr="reception-${i}"]`),r.mapUrl));
  const cover=$('#cover'), invite=$('#invitation'), open=$('#openInvite'), audio=$('#music'), musicBtn=$('#musicToggle'), muteBtn=$('#muteToggle');
  try { const state=sessionStorage.getItem('wedding-music'); if(state==='on'){ audio.dataset.want='true'; } else if(state==='off'){audio.dataset.want='false';} } catch{}
  open.addEventListener('click', async()=>{
    cover.classList.add('is-opening');
    const reducedMotion=matchMedia('(prefers-reduced-motion: reduce)').matches;
    const fadeStart=reducedMotion?0:1850;
    const coverEnd=reducedMotion?80:2750;
    window.setTimeout(()=>cover.classList.add('opening'),fadeStart);
    window.setTimeout(()=>cover.hidden=true,coverEnd);
    invite.classList.add('is-open'); invite.setAttribute('aria-hidden','false'); musicBtn.classList.add('visible'); muteBtn.hidden=false;
    window.setTimeout(setupScratch, 80);
    if(audio.dataset.want!=='false'){ try { await audio.play(); setMusic(true); } catch { setMusic(false); } }
    document.querySelectorAll('.reveal').forEach(el=>observer.observe(el));
  });
  function setMusic(on){ musicBtn.setAttribute('aria-pressed',String(on)); musicBtn.setAttribute('aria-label',on?'Pause background music':'Play background music'); $('.music-label',musicBtn).textContent=on?'Music on':'Music off'; try{sessionStorage.setItem('wedding-music',on?'on':'off')}catch{} }
  musicBtn.addEventListener('click',async()=>{if(audio.paused){try{await audio.play();setMusic(true)}catch{setMusic(false)}}else{audio.pause();setMusic(false)}});
  muteBtn.addEventListener('click',()=>{audio.muted=!audio.muted;muteBtn.textContent=audio.muted?'Unmute':'Mute';muteBtn.setAttribute('aria-label',audio.muted?'Unmute music':'Mute music');muteBtn.setAttribute('aria-pressed',String(audio.muted));});
  const observer = new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in-view');observer.unobserve(e.target)}}),{threshold:.12});
  $$('.section-pad').forEach(el=>el.classList.add('reveal'));
  const scrollEffects=$('#scrollEffects'), reducedMotion=matchMedia('(prefers-reduced-motion: reduce)').matches;
  let lastSpark=0, sparkIndex=0;
  window.addEventListener('scroll',()=>{
    const now=Date.now();
    if(reducedMotion||now-lastSpark<260||scrollEffects.childElementCount>=12)return;
    lastSpark=now;
    const spark=document.createElement('span');
    spark.className='scroll-spark';
    spark.textContent=['✦','✧','❀'][sparkIndex++%3];
    spark.style.left=`${6+Math.random()*88}%`;
    spark.style.top=`${48+Math.random()*48}%`;
    spark.style.setProperty('--drift',`${Math.random()*56-28}px`);
    scrollEffects.append(spark);
    window.setTimeout(()=>spark.remove(),1700);
  },{passive:true});
  const timer=$('#timer'), target=new Date(d.wedding.iso).getTime();
  function tick(){let left=target-Date.now();if(left<=0){timer.innerHTML='<p class="body-copy">Today, our forever begins.</p>';return}const day=Math.floor(left/864e5);left%=864e5;const hour=Math.floor(left/36e5);left%=36e5;const minute=Math.floor(left/6e4);const second=Math.floor(left%6e4/1e3);timer.innerHTML=[[day,'Days'],[hour,'Hours'],[minute,'Minutes'],[second,'Seconds']].map(([n,l])=>`<div class="time-unit"><strong>${String(n).padStart(2,'0')}</strong><span>${l}</span></div>`).join('')}
  tick();setInterval(tick,1000);
  const canvas=$('#scratch'), ctx=canvas.getContext('2d'), wrap=$('.scratch-wrap');let scratching=false, revealed=false, lastCheck=0;
  function setupScratch(){const box=canvas.getBoundingClientRect(),ratio=Math.min(devicePixelRatio||1,2);canvas.width=box.width*ratio;canvas.height=box.height*ratio;ctx.setTransform(ratio,0,0,ratio,0,0);ctx.fillStyle='#bda879';ctx.fillRect(0,0,box.width,box.height);ctx.globalAlpha=.3;for(let y=0;y<box.height;y+=10){ctx.fillStyle=y%20?'#e1d2b6':'#a78b5e';ctx.fillRect(0,y,box.width,1)}ctx.globalAlpha=1;ctx.fillStyle='#fff8ed';ctx.font='10px DM Sans, Arial';ctx.textAlign='center';ctx.fillText('✦   SCRATCH HERE   ✦',box.width/2,box.height/2+4);ctx.globalCompositeOperation='destination-out'}
  setupScratch();window.addEventListener('resize',()=>{if(!revealed)setupScratch()});
  function point(e){const r=canvas.getBoundingClientRect();return{x:e.clientX-r.left,y:e.clientY-r.top}}
  function erase(e){if(!scratching||revealed)return;e.preventDefault();const p=point(e);ctx.beginPath();ctx.arc(p.x,p.y,22,0,Math.PI*2);ctx.fill();if(Date.now()-lastCheck>250){lastCheck=Date.now();checkReveal()}}
  function checkReveal(){const pixels=ctx.getImageData(0,0,canvas.width,canvas.height).data;let clear=0;for(let i=3;i<pixels.length;i+=4)if(pixels[i]<100)clear++;if(clear/(pixels.length/4)>.33)reveal()}
  function reveal(){if(revealed)return;revealed=true;wrap.classList.add('revealed');for(let i=0;i<18;i++){const p=document.createElement('span');p.className='petal';p.textContent=i%3?'✦':'❀';p.style.setProperty('--dx',`${Math.random()*300-150}px`);p.style.setProperty('--dy',`${-60-Math.random()*220}px`);p.style.left=`${35+Math.random()*30}%`;$('.petals').append(p);setTimeout(()=>p.remove(),1900)}setTimeout(()=>$('#muhurtham').scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'}),850)}
  canvas.addEventListener('pointerdown',e=>{scratching=true;canvas.setPointerCapture(e.pointerId);erase(e)});canvas.addEventListener('pointermove',erase);canvas.addEventListener('pointerup',()=>scratching=false);canvas.addEventListener('pointercancel',()=>scratching=false);$('#revealFallback').addEventListener('click',reveal);
})();
