// ==UserScript==
// @name         Kremityss Real-Site Bootstrap
// @namespace    kremityss.local
// @version      2.0.1
// @description  Loads the accurate Kremityss engine overlay on the original owned single-player site.
// @match        https://vibeslops.luckeysystems.com/*
// @run-at       document-start
// @grant        none
// ==/UserScript==
(() => {
  'use strict';
  if (window.top !== window || window.__KREMITYSS_REBUILT__) return;
  window.__KREMITYSS_REBUILT__ = true;
  const overlay = 'https://raw.githubusercontent.com/KremCheats/Claude-of-Duty/main/public/kremityss.user.js';
  const marker = 'let playerHealth = null;';
  const bridge = `
// Kremityss bridge for this owned single-player build.
Object.defineProperty(globalThis, '__vibeGame', { value: {}, configurable: false });
Object.defineProperties(globalThis.__vibeGame, {
  THREE: { get: () => THREE }, camera: { get: () => camera }, scene: { get: () => scene },
  player: { get: () => player }, enemies: { get: () => enemies }, yawPitch: { get: () => yawPitch },
});
`;
  const boot = async () => {
    try {
      const response = await fetch(location.href, { cache: 'no-store', credentials: 'same-origin' });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      let html = await response.text();
      if (!html.includes(marker)) throw new Error('game source marker not found');
      html = html.replace(marker, marker + bridge);
      html = html.replace('</body>', `<script src="${overlay}"></script></body>`);
      document.open(); document.write(html); document.close();
    } catch (error) {
      console.error('[Kremityss] real-site bootstrap failed:', error);
    }
  };
  boot();
})();
// ==/UserScript==
