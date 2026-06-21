/* ============================================================================
   Virtue Impact Fund — interim access gate (client-side, shared code)
   ----------------------------------------------------------------------------
   This is a DETERRENT, not strong security: the page source is still readable
   to anyone determined (and, while the GitHub repo is public, so is the source
   on github.com). The real gate is the planned move to a private repo behind
   Cloudflare Access on virtueimpactfund.ca.

   • One shared access code, stored only as its SHA-256 hash (TOKEN below) — the
     plaintext code is never in the source.
   • Unlock is remembered per browser (localStorage), so investors enter it once
     and it carries across every page on the site.

   TO CHANGE THE CODE:  printf '%s' 'YourNewCode' | shasum -a 256
   then paste the hex into TOKEN below and redeploy. (Current code: Virtue2026)
   ========================================================================== */
(function () {
  var TOKEN = 'd70ae1aabf869e7e46c8d14e2783b69ac2e2fbe22992fd2b31489e6e1287ab3a';
  var KEY = 'vif-access';

  try { if (localStorage.getItem(KEY) === TOKEN) return; } catch (e) { /* private mode */ }

  var d = document;
  var root = d.documentElement;

  var style = d.createElement('style');
  style.textContent =
    "#vif-gate{position:fixed;inset:0;z-index:2147483647;display:flex;align-items:center;justify-content:center;" +
    "background:radial-gradient(circle at 72% 18%,rgba(184,155,90,.14),transparent 46%),#2c3e4c;" +
    "color:#EAF0F2;font-family:'Jost',system-ui,-apple-system,sans-serif;padding:24px;-webkit-font-smoothing:antialiased}" +
    "#vif-gate *{box-sizing:border-box}" +
    "#vif-gate .c{width:100%;max-width:360px;text-align:center}" +
    "#vif-gate img{height:44px;width:auto;margin:0 auto 32px;display:block}" +
    "#vif-gate .eg{font-family:'Jost',sans-serif;font-weight:500;font-size:11px;letter-spacing:.32em;text-transform:uppercase;color:#B89B5A;margin-bottom:16px}" +
    "#vif-gate h1{font-family:'Cormorant Garamond',Georgia,serif;font-weight:500;font-size:30px;line-height:1.15;color:#fff;margin:0 0 10px}" +
    "#vif-gate p{font-size:14px;line-height:1.6;color:#9FB0BA;margin:0 0 26px}" +
    "#vif-gate form{display:flex;flex-direction:column;gap:12px}" +
    "#vif-gate input{width:100%;padding:14px 18px;border-radius:30px;border:1px solid rgba(255,255,255,.22);" +
    "background:rgba(255,255,255,.06);color:#fff;font-family:'Jost',sans-serif;font-size:15px;text-align:center;letter-spacing:.04em;outline:none;transition:border-color .2s}" +
    "#vif-gate input::placeholder{color:#7d8b94}" +
    "#vif-gate input:focus{border-color:#B89B5A}" +
    "#vif-gate button{width:100%;padding:14px 18px;border:none;border-radius:30px;background:#B89B5A;color:#fff;" +
    "font-family:'Jost',sans-serif;font-size:12px;letter-spacing:.16em;text-transform:uppercase;cursor:pointer;transition:background .2s}" +
    "#vif-gate button:hover{background:#a98a47}" +
    "#vif-gate .err{font-size:13px;color:#E0A89A;min-height:18px;margin-top:2px;opacity:0;transition:opacity .2s}" +
    "#vif-gate .err.show{opacity:1}" +
    "#vif-gate .foot{margin-top:30px;font-size:11.5px;letter-spacing:.04em;color:#6f7d87}";
  d.head.appendChild(style);

  root.style.overflow = 'hidden';

  var g = d.createElement('div');
  g.id = 'vif-gate';
  g.innerHTML =
    '<div class="c">' +
      '<img src="assets/logo-vector-cream.svg" alt="Virtue Impact Fund">' +
      '<div class="eg">Confidential</div>' +
      '<h1>Investor access</h1>' +
      '<p>This material is private. Enter the access code to continue.</p>' +
      '<form id="vif-form" autocomplete="off">' +
        '<input id="vif-pw" type="password" inputmode="text" autocomplete="off" autocapitalize="off" ' +
        'spellcheck="false" placeholder="Access code" aria-label="Access code" autofocus>' +
        '<button type="submit">Enter</button>' +
        '<div class="err" id="vif-err" role="alert">Incorrect code — please try again.</div>' +
      '</form>' +
      '<div class="foot">Virtue Impact Fund &times; Heal</div>' +
    '</div>';
  root.appendChild(g);

  var form = d.getElementById('vif-form');
  var input = d.getElementById('vif-pw');
  var err = d.getElementById('vif-err');
  try { input.focus(); } catch (e) {}

  function toHex(buf) {
    return Array.prototype.map
      .call(new Uint8Array(buf), function (b) { return ('0' + b.toString(16)).slice(-2); })
      .join('');
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var subtle = window.crypto && window.crypto.subtle;
    if (!subtle) {
      err.textContent = 'This browser blocks the check — open over https.';
      err.classList.add('show');
      return;
    }
    subtle.digest('SHA-256', new TextEncoder().encode(input.value)).then(function (buf) {
      if (toHex(buf) === TOKEN) {
        try { localStorage.setItem(KEY, TOKEN); } catch (e) {}
        g.parentNode && g.parentNode.removeChild(g);
        root.style.overflow = '';
      } else {
        err.classList.add('show');
        input.value = '';
        input.focus();
      }
    });
  });
})();
