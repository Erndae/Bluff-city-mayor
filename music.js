/* Bluff City Mayor soundtrack. Audio preferences deliberately live outside game saves. */
(() => {
  'use strict';
  const tracks = {
    main: ['01-river-city-resolve.mp3', 'River City Resolve'],
    council: ['02-behind-the-chamber-doors.mp3', 'Behind the Chamber Doors'],
    campaign: ['03-on-every-block.mp3', 'On Every Block'],
    election: ['04-the-last-precinct.mp3', 'The Last Precinct'],
    victory: ['05-a-mandate-for-memphis.mp3', 'A Mandate for Memphis']
  };
  const key = 'bluffcity-music-v1';
  let prefs = { enabled: true, volume: 0.22 };
  try {
    const saved = JSON.parse(localStorage.getItem(key));
    if (saved && typeof saved.enabled === 'boolean') prefs.enabled = saved.enabled;
    if (saved && Number.isFinite(saved.volume)) prefs.volume = Math.max(0, Math.min(1, saved.volume));
  } catch (_) { /* Storage is optional. */ }
  let unlocked = false, ctx, master, active = -1, current = '', revision = 0;
  let timer, fadeTimer, failure = '', returnFocus, finishedVictory = '', victoryId = '';
  const channels = [0, 1].map(() => {
    const audio = new Audio();
    audio.preload = 'none';
    return { audio, gain: null };
  });
  const dialog = document.createElement('dialog');
  dialog.id = 'musicSettings';
  dialog.setAttribute('aria-labelledby', 'musicTitle');
  dialog.innerHTML = `<form method="dialog"><header><h2 id="musicTitle">Music</h2><button class="btn" aria-label="Close music settings">Close</button></header></form>
    <p class="note">Memphis soul and blues for your time in office.</p>
    <label class="music-toggle"><input id="musicEnabled" type="checkbox"> Play soundtrack</label>
    <label for="musicVolume">Volume <output id="musicVolumeValue"></output></label>
    <input id="musicVolume" type="range" min="0" max="100" step="1">
    <p id="musicNow" role="status" aria-live="polite"></p>
    <p class="note">Music follows the city, council, campaign and debates. A victory theme plays once when you win. Playback pauses while this tab is hidden.</p>`;
  document.body.append(dialog);
  const enabledInput = dialog.querySelector('#musicEnabled');
  const volumeInput = dialog.querySelector('#musicVolume');
  function save() { try { localStorage.setItem(key, JSON.stringify(prefs)); } catch (_) {} }
  function render() {
    enabledInput.checked = prefs.enabled;
    volumeInput.value = Math.round(prefs.volume * 100);
    dialog.querySelector('#musicVolumeValue').textContent = `${Math.round(prefs.volume * 100)}%`;
    dialog.querySelector('#musicNow').textContent = !prefs.enabled ? 'Music is off.' : failure ||
      (!unlocked ? 'Music starts after your first interaction.' : document.hidden ? 'Paused while the tab is hidden.' :
        current ? `Now playing: ${tracks[current][1]}` : 'Ready to play.');
  }
  function stop() {
    revision++;
    clearTimeout(fadeTimer);
    for (const c of channels) c.audio.pause();
  }
  function gain(channel, value, seconds = 0) {
    if (channel.gain && ctx) {
      const g = channel.gain.gain;
      g.cancelScheduledValues(ctx.currentTime);
      g.setValueAtTime(g.value, ctx.currentTime);
      if (seconds) g.linearRampToValueAtTime(value, ctx.currentTime + seconds);
      else g.setValueAtTime(value, ctx.currentTime);
    } else channel.audio.volume = value * prefs.volume;
  }
  function volume() {
    if (master) master.gain.setValueAtTime(prefs.volume, ctx.currentTime);
    else channels.forEach((c, i) => { c.audio.volume = i === active ? prefs.volume : 0; });
  }
  function unlock() {
    unlocked = true;
    if (!ctx && (window.AudioContext || window.webkitAudioContext)) {
      try {
        ctx = new (window.AudioContext || window.webkitAudioContext)();
        master = ctx.createGain(); master.connect(ctx.destination);
        channels.forEach(c => { c.gain = ctx.createGain(); c.gain.gain.value = 0; ctx.createMediaElementSource(c.audio).connect(c.gain); c.gain.connect(master); });
      } catch (_) { /* HTML audio remains available when Web Audio is unavailable. */ }
    }
    if (ctx?.state === 'suspended') ctx.resume().catch(() => {});
    volume();
    update();
  }
  function context() {
    try { return window.bluffMusicContext?.() || { track: 'main' }; }
    catch (_) { return { track: 'main' }; }
  }
  async function update() {
    if (!unlocked || !prefs.enabled || document.hidden) { stop(); render(); return; }
    const route = context();
    let target = tracks[route.track] ? route.track : 'main';
    if (target === 'victory') {
      victoryId = route.event || 'victory';
      if (finishedVictory === victoryId) target = 'main';
    }
    if (target === current && active >= 0) {
      const c = channels[active];
      if (c.audio.paused && !failure) {
        const token = ++revision;
        gain(c, 1);
        try { await c.audio.play(); if (token !== revision && (!prefs.enabled || document.hidden)) c.audio.pause(); }
        catch (_) { failure = 'Playback paused. Tap Play soundtrack off and on to retry.'; }
      }
      render(); return;
    }
    const token = ++revision, old = active, next = active === 0 ? 1 : 0;
    clearTimeout(fadeTimer);
    const c = channels[next];
    c.token = token;
    c.audio.pause();
    c.audio.src = `assets/music/${tracks[target][0]}?v=17-full`;
    c.audio.loop = target !== 'victory';
    gain(c, 0);
    try {
      await c.audio.play();
      if (token !== revision) { if (c.token === token) c.audio.pause(); return; }
      active = next; current = target; failure = '';
      gain(c, 1, 2);
      if (old >= 0) {
        const previous = channels[old]; gain(previous, 0, 2);
        fadeTimer = setTimeout(() => { if (active !== old) previous.audio.pause(); }, 2100);
      }
    } catch (_) {
      if (token !== revision) return;
      c.audio.pause();
      failure = 'Music could not play. Tap Play soundtrack off and on to retry; the game can continue.';
    }
    render();
  }
  channels.forEach((c, i) => {
    c.audio.addEventListener('ended', () => {
      if (i === active && current === 'victory') { finishedVictory = victoryId; update(); }
    });
    c.audio.addEventListener('error', () => {
      if (i === active) { failure = 'Music unavailable. The game can continue; toggle music to retry.'; render(); }
    });
  });
  function schedule() { clearTimeout(timer); timer = setTimeout(update, 450); }
  const observer = new MutationObserver(schedule);
  for (const id of ['modal', 'panel', 'start']) {
    const el = document.getElementById(id);
    if (el) observer.observe(el, { attributes: true, attributeFilter: ['hidden'], childList: true, characterData: true, subtree: true });
  }
  enabledInput.addEventListener('change', () => {
    prefs.enabled = enabledInput.checked; failure = '';
    // Discard a failed source, so retry really reloads it.
    if (prefs.enabled) { current = ''; }
    save(); unlock();
  });
  volumeInput.addEventListener('input', () => { prefs.volume = +volumeInput.value / 100; volume(); save(); render(); });
  document.addEventListener('pointerdown', e => { if (e.isTrusted && !unlocked) unlock(); }, { passive: true });
  document.addEventListener('keydown', e => {
    if (dialog.open) { e.stopImmediatePropagation(); return; }
    if (e.isTrusted && !unlocked && !['Shift', 'Control', 'Alt', 'Meta'].includes(e.key)) unlock();
  }, true);
  document.addEventListener('click', e => {
    if (e.target.closest('[data-music-open]')) {
      returnFocus = e.target.closest('button');
      if (!dialog.open) dialog.showModal();
      unlock(); render(); enabledInput.focus();
    }
  });
  dialog.addEventListener('close', () => { returnFocus?.focus(); });
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) stop();
    else { if (ctx?.state === 'suspended') ctx.resume().catch(() => {}); update(); }
    render();
  });
  window.addEventListener('pagehide', stop);
  window.addEventListener('pageshow', () => { if (unlocked) update(); });
  window.BCMusic = { openSettings() { dialog.showModal(); unlock(); render(); }, get settingsOpen() { return dialog.open; } };
  render();
})();
