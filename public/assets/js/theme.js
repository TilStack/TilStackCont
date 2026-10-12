(function () {
  var root = document.documentElement;
  try {
    var t = localStorage.getItem('tl-theme');
    if (t === 'dark' || t === 'light') root.setAttribute('data-theme', t);
  } catch (e) {}
  // Fond tournant : même règle que core/background.service.ts (un fond toutes les 2 h 30, 4 fonds en boucle).
  var fonds = ['echecs', 'damiers', 'pions', 'bible'];
  root.setAttribute('data-bg', fonds[Math.floor(Date.now() / (150 * 60 * 1000)) % fonds.length]);
})();
