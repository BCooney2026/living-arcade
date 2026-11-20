/*
 * CardMaker tour: the five home-screen buttons as real screenshots. Click one to step through
 * that flow as full-size screenshots of CardMaker on Brian's MacBook (1440x900, Retina).
 * Screens: tour/screens/<flow>-<n>.jpg. Buttons: tour/tiles/tile-<n>.png.
 * Keys: Left/Right to step, Esc to close. Swipe on phones. Tap the picture for the next step.
 */
'use strict';
(function () {
  const FLOWS = [
    { id: 'os', name: 'OS card', steps: [
      'Step 1: pick the exact handheld by photo. Yours are listed first.',
      'Step 2: only firmware made for that model. GarlicOS is already downloaded and checked.',
      'Step 3: pick the card. The HyperSpin archive drive is locked out, always.',
      'Last step: hold the button 2 seconds. Nothing is erased by accident.',
      'Done: the live log shows every step, then the card ejects itself.'] },
    { id: 'games', name: 'Games card', steps: [
      'Step 1: which handheld is this card for?',
      'Step 2: best games per system by rating. Top 20 for the big consoles, Top 5 for the oddballs.',
      'Every system can be Off, Top 5 to 100, or All. The total updates live.',
      'Step 3: check the list. Tap the X to leave any game off.',
      'Step 4: pick the card. Unsafe drives are greyed out with the reason.',
      'Last step: erase and fill, after a 2-second hold.',
      'Done: games copied, box art added, card ejected.'] },
    { id: 'add', name: 'Add games to a card', steps: [
      'Add to a card that already has games. Step 1: the handheld.',
      'Step 2: same picker. Games already on the card are skipped.',
      'Last step: nothing gets erased. It only adds what is missing.'] },
    { id: 'favorites', name: 'Favorites', steps: [
      'Search the whole library and star games. Starred games ride along on every card.'] },
    { id: 'library', name: 'Library', steps: [
      'The clean library: CardMaker recognizes every console in the archive by itself.',
      'Disc systems get converted and checked. Top N or All per console.'] },
  ];
  const src = (flow, i) => `tour/screens/${flow.id}-${i + 1}.jpg`;

  // ---- the five buttons ----
  const grid = document.getElementById('tourGrid');
  FLOWS.forEach((f, n) => {
    const b = document.createElement('button');
    b.className = 'tourTile';
    b.setAttribute('aria-label', `${f.name}: see the screens`);
    b.innerHTML = `<img src="tour/tiles/tile-${n + 1}.png" alt="${f.name}" loading="lazy">
      <span class="tourCount">${f.steps.length} screen${f.steps.length > 1 ? 's' : ''} &rsaquo;</span>`;
    b.onclick = () => open(f, 0);
    grid.appendChild(b);
  });

  // ---- the viewer ----
  const box = document.getElementById('tourViewer');
  const img = box.querySelector('.tvImg'), cap = box.querySelector('.tvCaption'), title = box.querySelector('.tvTitle');
  const prev = box.querySelector('.tvPrev'), next = box.querySelector('.tvNext'), dots = box.querySelector('.tvDots');
  let flow = null, at = 0, lastFocus = null;

  function open(f, i) {
    lastFocus = document.activeElement;
    flow = f; box.hidden = false; document.body.classList.add('tourOpen');
    go(i); next.focus();
  }
  function close() {
    box.hidden = true; document.body.classList.remove('tourOpen'); flow = null;
    if (lastFocus) lastFocus.focus();
  }
  function go(i) {
    at = Math.max(0, Math.min(flow.steps.length - 1, i));
    img.src = src(flow, at);
    img.alt = `${flow.name}, screen ${at + 1}: ${flow.steps[at]}`;
    cap.textContent = flow.steps[at];
    title.textContent = `${flow.name.toUpperCase()}  ·  ${at + 1} / ${flow.steps.length}`;
    prev.disabled = at === 0;
    next.textContent = at === flow.steps.length - 1 ? 'Done' : 'Next ›';
    dots.innerHTML = flow.steps.map((_, k) => `<button class="${k === at ? 'on' : ''}" aria-label="Screen ${k + 1}"></button>`).join('');
    dots.querySelectorAll('button').forEach((d, k) => { d.onclick = () => go(k); });
    if (at + 1 < flow.steps.length) new Image().src = src(flow, at + 1); // preload the next screen
  }
  const forward = () => (at === flow.steps.length - 1 ? close() : go(at + 1));
  prev.onclick = () => go(at - 1);
  next.onclick = forward;
  img.onclick = forward;
  box.querySelector('.tvClose').onclick = close;
  box.addEventListener('click', (e) => { if (e.target === box) close(); });
  document.addEventListener('keydown', (e) => {
    if (!flow) return;
    if (e.key === 'Escape') close();
    else if (e.key === 'ArrowRight') forward();
    else if (e.key === 'ArrowLeft') go(at - 1);
  });
  let x0 = null; // swipe on phones
  img.addEventListener('touchstart', (e) => { x0 = e.touches[0].clientX; }, { passive: true });
  img.addEventListener('touchend', (e) => {
    if (x0 === null) return;
    const dx = e.changedTouches[0].clientX - x0; x0 = null;
    if (dx < -40) forward(); else if (dx > 40) go(at - 1);
  });
})();
