/* ─────────────────────────────────────────────────────────────────────────
   Site config — single source of truth for facts that change as the
   Blue Line Advisors breakaway firms up.

   TO SWITCH CUSTODIAN (once the Fidelity-vs-Schwab decision is made):
   change the ONE value below. Every element marked `data-custodian` updates
   automatically — currently the landing-page stack line only. (The inventory
   page was deliberately generalized to not name a custodian, so it has none.)

   The HTML also hard-codes "Schwab" as the default text inside those spans, so
   the pages still read correctly even if this script fails to load.
   ───────────────────────────────────────────────────────────────────────── */
window.SITE_CONFIG = {
  custodian: "Schwab"
};

(function () {
  function applyConfig() {
    // Guard against a missing/empty key so the spans never render "undefined" or blank.
    var c = (window.SITE_CONFIG && window.SITE_CONFIG.custodian) || 'Schwab';
    document.querySelectorAll('[data-custodian]').forEach(function (el) {
      el.textContent = c;
    });
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', applyConfig);
  } else {
    applyConfig();
  }
})();
