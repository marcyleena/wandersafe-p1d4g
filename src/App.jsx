import { useState, useEffect, useCallback, useRef } from "react";

const STYLES = `
@keyframes spin { to { transform: rotate(360deg); } }
@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.4} }

:root {
  --color-primary: #1a7a7a;
  --color-secondary: #e8735a;
  --color-background: #faf8f5;
  --color-surface: #ffffff;
  --color-text: #2d2d2d;
  --color-text-light: #6b6b6b;
  --color-border: #e0dbd5;
  --color-primary-light: #e8f4f4;
  --color-secondary-light: #fdf0ed;
  --color-error: #c0392b;
  --color-success: #27ae60;
  --radius: 12px;
  --radius-sm: 6px;
  --shadow: 0 2px 12px rgba(0,0,0,0.08);
  --shadow-lg: 0 8px 32px rgba(0,0,0,0.12);
}

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; background: var(--color-background); color: var(--color-text); }

.full-center { display:flex; align-items:center; justify-content:center; min-height:100vh; }

/* Auth */
.auth-screen { min-height:100vh; display:flex; align-items:center; justify-content:center; padding:1rem; background:var(--color-background); }
.auth-card { background:var(--color-surface); border-radius:var(--radius); box-shadow:var(--shadow-lg); padding:2rem; width:100%; max-width:400px; }
.auth-logo { font-size:1.5rem; font-weight:700; color:var(--color-primary); text-align:center; margin-bottom:.25rem; }
.auth-sub { text-align:center; color:var(--color-text-light); margin-bottom:1.5rem; font-size:.9rem; }
.tab-row { display:flex; border-bottom:2px solid var(--color-border); margin-bottom:1.5rem; }
.tab { flex:1; padding:.75rem; background:none; border:none; cursor:pointer; font-size:.95rem; color:var(--color-text-light); transition:color .2s; }
.tab-active { color:var(--color-primary); border-bottom:2px solid var(--color-primary); margin-bottom:-2px; font-weight:600; }

/* Fields */
.field { margin-bottom:1rem; }
.field label { display:block; font-size:.875rem; font-weight:500; margin-bottom:.375rem; color:var(--color-text); }
.field input, .field select, .field textarea { width:100%; padding:.625rem .75rem; border:1.5px solid var(--color-border); border-radius:var(--radius-sm); font-size:.95rem; background:var(--color-surface); color:var(--color-text); transition:border-color .2s; font-family:inherit; }
.field input:focus, .field select:focus, .field textarea:focus { outline:none; border-color:var(--color-primary); }
.field-error { color:var(--color-error); font-size:.85rem; margin:.5rem 0; }
.hint { font-size:.8rem; color:var(--color-text-light); margin-top:.375rem; }

/* Buttons */
.btn { display:inline-flex; align-items:center; gap:.5rem; padding:.625rem 1.25rem; border-radius:var(--radius-sm); border:none; cursor:pointer; font-size:.9rem; font-weight:500; transition:opacity .2s, background .2s; }
.btn:disabled { opacity:.6; cursor:not-allowed; }
.btn-primary { background:var(--color-primary); color:#fff; }
.btn-primary:hover:not(:disabled) { opacity:.88; }
.btn-ghost { background:transparent; color:var(--color-primary); border:1.5px solid var(--color-primary); }
.btn-ghost:hover:not(:disabled) { background:var(--color-primary-light); }
.btn-danger { background:var(--color-error); color:#fff; }
.btn-danger:hover:not(:disabled) { opacity:.88; }
.w-full { width:100%; justify-content:center; }
.btn-row { display:flex; gap:.75rem; justify-content:flex-end; margin-top:1rem; }
.btn-col { display:flex; flex-direction:column; gap:.75rem; margin-top:1rem; }
.icon-btn { background:none; border:none; cursor:pointer; font-size:1.1rem; padding:.25rem; border-radius:var(--radius-sm); transition:opacity .2s; }
.icon-btn:hover { opacity:.7; }
.icon-btn.danger { color:var(--color-error); }
.link-btn { background:none; border:none; color:var(--color-primary); cursor:pointer; font-size:inherit; text-decoration:underline; padding:0; }
.privacy-note { font-size:.78rem; color:var(--color-text-light); text-align:center; margin-top:1rem; }

/* App shell */
.app { display:flex; flex-direction:column; min-height:100vh; max-width:700px; margin:0 auto; }
.app-header { background:var(--color-surface); border-bottom:1px solid var(--color-border); position:sticky; top:0; z-index:100; }
.header-inner { display:flex; align-items:center; justify-content:space-between; padding:.75rem 1rem; }
.app-logo { font-size:1.2rem; font-weight:700; color:var(--color-primary); }
.emergency-mini { background:var(--color-error); color:#fff; border:none; border-radius:var(--radius-sm); padding:.4rem .75rem; cursor:pointer; font-size:.85rem; font-weight:600; }
.app-main { flex:1; padding:1rem; padding-bottom:5rem; }
.app-footer { text-align:center; padding:1rem; font-size:.8rem; color:var(--color-text-light); display:flex; gap:.5rem; justify-content:center; align-items:center; flex-wrap:wrap; }

/* Bottom nav */
.bottom-nav { position:fixed; bottom:0; left:50%; transform:translateX(-50%); width:100%; max-width:700px; background:var(--color-surface); border-top:1px solid var(--color-border); display:flex; z-index:100; }
.nav-btn { flex:1; display:flex; flex-direction:column; align-items:center; gap:.2rem; padding:.5rem .25rem; background:none; border:none; cursor:pointer; color:var(--color-text-light); transition:color .2s; min-width:0; }
.nav-btn-active { color:var(--color-primary); }
.nav-icon { font-size:1.2rem; }
.nav-label { font-size:.65rem; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }

/* Section */
.section { }
.section-header { display:flex; align-items:center; justify-content:space-between; margin-bottom:1rem; }
.section-header h2 { font-size:1.25rem; font-weight:700; }
.section-desc { color:var(--color-text-light); font-size:.9rem; margin-bottom:1rem; }
.centered { display:flex; flex-direction:column; align-items:center; justify-content:center; padding:3rem 1rem; }

/* Cards */
.card { background:var(--color-surface); border-radius:var(--radius); box-shadow:var(--shadow); padding:1rem; border:1px solid var(--color-border); }
.card-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(260px,1fr)); gap:1rem; }
.card-list { display:flex; flex-direction:column; gap:1rem; }
.card-header { display:flex; align-items:flex-start; justify-content:space-between; margin-bottom:.5rem; }
.card-title { font-size:1rem; font-weight:600; }
.card-sub { font-size:.8rem; color:var(--color-text-light); margin-top:.15rem; }
.card-meta { font-size:.82rem; color:var(--color-text-light); margin:.25rem 0; }
.card-notes { font-size:.875rem; color:var(--color-text); margin-top:.5rem; line-height:1.5; }

/* Badge */
.badge { display:inline-block; font-size:.72rem; font-weight:600; padding:.2rem .6rem; border-radius:99px; text-transform:capitalize; }
.badge-planned { background:var(--color-primary-light); color:var(--color-primary); }
.badge-visited { background:#e8f8ee; color:var(--color-success); }
.badge-wishlist { background:var(--color-secondary-light); color:var(--color-secondary); }
.badge-active { background:#e8f8ee; color:var(--color-success); }
.badge-canceled { background:#fdf0ed; color:var(--color-secondary); }
.badge-trialing { background:var(--color-primary-light); color:var(--color-primary); }

/* Stars */
.star-rating { display:flex; gap:.15rem; }
.star { background:none; border:none; font-size:1.25rem; cursor:pointer; color:#ddd; padding:0; line-height:1; }
.star-filled { color:#f5a623; }
.star:disabled { cursor:default; }

/* Toast */
.toast { position:fixed; bottom:5rem; left:50%; transform:translateX(-50%); background:#333; color:#fff; padding:.75rem 1.25rem; border-radius:var(--radius); display:flex; align-items:center; gap:1rem; z-index:999; box-shadow:var(--shadow-lg); min-width:260px; max-width:90vw; }
.toast-error { background:var(--color-error); }
.toast-success { background:var(--color-success); }
.toast button { background:none; border:none; color:#fff; cursor:pointer; font-size:1rem; }

/* Modal */
.modal-backdrop { position:fixed; inset:0; background:rgba(0,0,0,.45); display:flex; align-items:center; justify-content:center; z-index:500; padding:1rem; }
.modal { background:var(--color-surface); border-radius:var(--radius); box-shadow:var(--shadow-lg); width:100%; max-width:480px; max-height:90vh; display:flex; flex-direction:column; }
.modal-header { display:flex; align-items:center; justify-content:space-between; padding:1rem 1.25rem; border-bottom:1px solid var(--color-border); }
.modal-header h2 { font-size:1.1rem; font-weight:700; }
.modal-body { padding:1.25rem; overflow-y:auto; }

/* Empty state */
.empty-state { text-align:center; padding:3rem 1rem; }
.empty-icon { font-size:3rem; margin-bottom:1rem; }
.empty-state h3 { font-size:1.1rem; font-weight:600; margin-bottom:.5rem; }
.empty-state p { color:var(--color-text-light); font-size:.9rem; }

/* Search */
.search-row { display:flex; gap:.5rem; margin-bottom:1rem; }
.search-row input { flex:1; padding:.625rem .75rem; border:1.5px solid var(--color-border); border-radius:var(--radius-sm); font-size:.95rem; background:var(--color-surface); }
.search-row input:focus { outline:none; border-color:var(--color-primary); }

/* Packing */
.packing-layout { display:flex; gap:1rem; }
.list-sidebar { width:180px; flex-shrink:0; display:flex; flex-direction:column; gap:.5rem; }
.sidebar-item { background:var(--color-surface); border:1.5px solid var(--color-border); border-radius:var(--radius-sm); padding:.625rem .75rem; cursor:pointer; display:flex; align-items:center; justify-content:space-between; font-size:.875rem; transition:border-color .2s; }
.sidebar-active { border-color:var(--color-primary); background:var(--color-primary-light); }
.list-content { flex:1; min-width:0; }
.progress-bar-wrap { height:6px; background:var(--color-border); border-radius:99px; margin-bottom:.5rem; overflow:hidden; }
.progress-bar { height:100%; background:var(--color-primary); border-radius:99px; transition:width .4s; }
.pack-progress { font-size:.82rem; color:var(--color-text-light); margin-bottom:.75rem; }
.add-item-form { display:flex; gap:.5rem; margin-bottom:.75rem; }
.add-item-form input { flex:1; padding:.5rem .75rem; border:1.5px solid var(--color-border); border-radius:var(--radius-sm); font-size:.9rem; }
.add-item-form input:focus { outline:none; border-color:var(--color-primary); }
.pack-list { list-style:none; display:flex; flex-direction:column; gap:.375rem; }
.pack-item label { display:flex; align-items:center; gap:.625rem; cursor:pointer; font-size:.9rem; }
.pack-item input[type=checkbox] { width:1rem; height:1rem; accent-color:var(--color-primary); cursor:pointer; }
.pack-item-done label span { text-decoration:line-through; color:var(--color-text-light); }
.load-more { display:block; margin:1.5rem auto 0; }

/* AI */
.ai-badge { background:var(--color-primary-light); color:var(--color-primary); border-radius:var(--radius-sm); padding:.5rem .75rem; font-size:.8rem; margin-bottom:1rem; }
.ai-form { display:flex; flex-direction:column; gap:1rem; }
.tips-output { background:var(--color-surface); border-radius:var(--radius); border:1px solid var(--color-border); padding:1.25rem; margin-top:1.5rem; }
.tips-output h3 { font-size:1rem; font-weight:700; margin-bottom:.75rem; }
.tips-content p { font-size:.9rem; line-height:1.6; margin-bottom:.5rem; }

/* Tip box */
.tip-box { background:var(--color-primary-light); border-radius:var(--radius-sm); padding:.625rem .75rem; font-size:.85rem; margin-top:.5rem; }

/* Emergency */
.emergency-btn-wrap { text-align:center; margin-bottom:1.5rem; }
.emergency-btn { background:var(--color-error); color:#fff; border:none; border-radius:var(--radius); padding:1.25rem 2rem; font-size:1.1rem; font-weight:700; cursor:pointer; width:100%; letter-spacing:.03em; box-shadow:0 4px 16px rgba(192,57,43,.3); }
.emergency-btn:hover { opacity:.9; }
.emergency-note { font-size:.82rem; color:var(--color-text-light); margin-top:.75rem; }
.sharing-active { display:flex; align-items:center; gap:.75rem; }
.pulse-dot { width:10px; height:10px; border-radius:50%; background:var(--color-success); animation:pulse 1.5s infinite; display:inline-block; }

/* Cookie */
.cookie-banner { position:fixed; bottom:0; left:0; right:0; background:#2d2d2d; color:#fff; padding:1rem 1.5rem; display:flex; align-items:center; justify-content:space-between; gap:1rem; z-index:600; flex-wrap:wrap; }
.cookie-banner p { font-size:.85rem; flex:1; }

/* Legal */
.legal-content h4 { margin:1rem 0 .375rem; font-size:.95rem; }
.legal-content p { font-size:.875rem; line-height:1.6; margin-bottom:.5rem; color:var(--color-text); }

/* Notifications */
.notif-section { margin-bottom:1.5rem; }
.notif-section h3 { font-size:1rem; font-weight:600; margin-bottom:.75rem; }
.notif-toggle-row { display:flex; align-items:center; justify-content:space-between; padding:.625rem 0; border-bottom:1px solid var(--color-border); }
.notif-toggle-row:last-child { border-bottom:none; }
.notif-toggle-label { display:flex; flex-direction:column; gap:.15rem; }
.notif-toggle-label span { font-size:.9rem; font-weight:500; }
.notif-toggle-label small { font-size:.78rem; color:var(--color-text-light); }
.toggle { position:relative; display:inline-block; width:44px; height:24px; flex-shrink:0; }
.toggle input { opacity:0; width:0; height:0; }
.toggle-slider { position:absolute; inset:0; background:var(--color-border); border-radius:99px; cursor:pointer; transition:background .2s; }
.toggle-slider::before { content:""; position:absolute; width:18px; height:18px; left:3px; top:3px; background:#fff; border-radius:50%; transition:transform .2s; }
.toggle input:checked + .toggle-slider { background:var(--color-primary); }
.toggle input:checked + .toggle-slider::before { transform:translateX(20px); }
.toggle input:focus-visible + .toggle-slider { outline:2px solid var(--color-primary); outline-offset:2px; }
.notif-preview { background:var(--color-primary-light); border-radius:var(--radius-sm); padding:.75rem 1rem; font-size:.85rem; margin-top:.5rem; color:var(--color-primary); }
.notif-status-badge { display:inline-flex; align-items:center; gap:.4rem; font-size:.78rem; font-weight:600; padding:.2rem .6rem; border-radius:99px; }
.notif-status-enabled { background:#e8f8ee; color:var(--color-success); }
.notif-status-disabled { background:var(--color-secondary-light); color:var(--color-secondary); }
.digest-row { display:flex; align-items:center; gap:.75rem; flex-wrap:wrap; margin-top:.5rem; }

/* Pricing / Payments */
.pricing-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(240px,1fr)); gap:1.25rem; margin-bottom:1.5rem; }
.pricing-card { background:var(--color-surface); border-radius:var(--radius); box-shadow:var(--shadow); padding:1.5rem; border:2px solid var(--color-border); display:flex; flex-direction:column; gap:.75rem; transition:border-color .2s; }
.pricing-card-featured { border-color:var(--color-primary); }
.pricing-label { font-size:.72rem; font-weight:700; text-transform:uppercase; letter-spacing:.08em; color:var(--color-primary); }
.pricing-name { font-size:1.15rem; font-weight:700; }
.pricing-price { font-size:2rem; font-weight:800; color:var(--color-text); line-height:1; }
.pricing-price span { font-size:.95rem; font-weight:400; color:var(--color-text-light); }
.pricing-desc { font-size:.875rem; color:var(--color-text-light); line-height:1.5; }
.pricing-features { list-style:none; display:flex; flex-direction:column; gap:.5rem; flex:1; }
.pricing-features li { font-size:.875rem; display:flex; align-items:flex-start; gap:.5rem; }
.pricing-features li::before { content:"✓"; color:var(--color-success); font-weight:700; flex-shrink:0; }
.pricing-cta { margin-top:.5rem; }
.plan-current { background:var(--color-primary-light); color:var(--color-primary); border:1.5px solid var(--color-primary); border-radius:var(--radius-sm); padding:.625rem 1.25rem; font-size:.9rem; font-weight:600; text-align:center; }
.payment-section { margin-bottom:1.5rem; }
.payment-section h3 { font-size:1rem; font-weight:600; margin-bottom:.75rem; }
.stripe-badge { display:inline-flex; align-items:center; gap:.4rem; font-size:.78rem; color:var(--color-text-light); background:var(--color-background); border:1px solid var(--color-border); border-radius:var(--radius-sm); padding:.3rem .6rem; margin-top:.5rem; }
.order-row { display:flex; align-items:center; justify-content:space-between; padding:.625rem 0; border-bottom:1px solid var(--color-border); font-size:.875rem; }
.order-row:last-child { border-bottom:none; }
.order-amount { font-weight:600; }
.order-amount-refund { color:var(--color-error); }
.stripe-key-hint { font-size:.78rem; color:var(--color-text-light); background:var(--color-background); border:1px solid var(--color-border); border-radius:var(--radius-sm); padding:.625rem .75rem; margin-bottom:1rem; line-height:1.6; }
.card-input-wrap { border:1.5px solid var(--color-border); border-radius:var(--radius-sm); padding:.625rem .75rem; background:var(--color-surface); margin-bottom:1rem; transition:border-color .2s; }
.card-input-wrap:focus-within { border-color:var(--color-primary); }

/* Analytics */
.analytics-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(140px,1fr)); gap:1rem; margin-bottom:1.5rem; }
.analytics-stat { background:var(--color-surface); border-radius:var(--radius); box-shadow:var(--shadow); padding:1rem; border:1px solid var(--color-border); text-align:center; }
.analytics-stat-value { font-size:1.75rem; font-weight:800; color:var(--color-primary); line-height:1; margin-bottom:.25rem; }
.analytics-stat-label { font-size:.78rem; color:var(--color-text-light); }
.analytics-provider { display:inline-flex; align-items:center; gap:.4rem; font-size:.78rem; color:var(--color-text-light); background:var(--color-background); border:1px solid var(--color-border); border-radius:var(--radius-sm); padding:.3rem .6rem; margin-bottom:1rem; }
.analytics-events { display:flex; flex-direction:column; gap:.5rem; }
.analytics-event-row { display:flex; align-items:center; justify-content:space-between; padding:.5rem .75rem; background:var(--color-background); border-radius:var(--radius-sm); font-size:.85rem; }
.analytics-event-name { color:var(--color-text); font-weight:500; }
.analytics-event-count { color:var(--color-primary); font-weight:700; }
.analytics-bar-wrap { height:4px; background:var(--color-border); border-radius:99px; flex:1; margin:0 .75rem; overflow:hidden; }
.analytics-bar { height:100%; background:var(--color-primary); border-radius:99px; transition:width .6s; }

@media(max-width:480px){
  .packing-layout { flex-direction:column; }
  .list-sidebar { width:100%; flex-direction:row; flex-wrap:wrap; }
  .sidebar-item { flex:1; min-width:120px; }
  .nav-label { font-size:.6rem; }
  .pricing-grid { grid-template-columns:1fr; }
  .analytics-grid { grid-template-columns:repeat(2,1fr); }
}
`;

// ---- Analytics ----
// PostHog is used for analytics. Set your PostHog project API key and host below.
// Get your key at https://app.posthog.com — it's free for up to 1M events/month.
const POSTHOG_KEY = ""; // e.g. "phc_XXXXXX"
const POSTHOG_HOST = "https://app.posthog.com";

// In-memory event store for the built-in dashboard (always active regardless of PostHog config)
const _analyticsEvents = [];

function trackEvent(eventName, properties = {}) {
  // Record locally for the built-in dashboard
  _analyticsEvents.push({ name: eventName, ts: Date.now(), ...properties });

  // Forward to PostHog if configured
  if (POSTHOG_KEY && window._posthog) {
    try {
      window._posthog.capture(eventName, properties);
    } catch (_) {}
  }
}

// Load PostHog script lazily (only if key is configured)
function initPostHog() {
  if (!POSTHOG_KEY || window._posthog) return;
  try {
    // Inline PostHog snippet (no npm import required)
    (function (t, e) {
      var o, n, p, r;
      e.__SV || (
        window.posthog = e,
        e._i = [],
        e.init = function (i, s, a) {
          function g(t, e) {
            var o = e.split(".");
            2 === o.length && (t = t[o[0]], e = o[1]);
            t[e] = function () { t.push([e].concat(Array.prototype.slice.call(arguments, 0))); };
          }
          (p = t.createElement("script")).type = "text/javascript";
          p.async = !0;
          p.src = s.api_host + "/static/array.js";
          (r = t.getElementsByTagName("script")[0]).parentNode.insertBefore(p, r);
          var u = e;
          void 0 !== a ? u = e[a] = [] : a = "posthog";
          u.people = u.people || [];
          u.toString = function (t) { var e = "posthog"; return "posthog" !== a && (e += "." + a), t || (e += " (stub)"), e; };
          u.people.toString = function () { return u.toString(1) + ".people (stub)"; };
          o = "capture identify alias people.set people.set_once set_config register register_once unregister opt_out_capturing has_opted_out_capturing opt_in_capturing reset isFeatureEnabled onFeatureFlags getFeatureFlag getFeatureFlagPayload reloadFeatureFlags group updateEarlyAccessFeatureEnrollment getEarlyAccessFeatures getActiveMatchingSurveys getSurveys onSessionId".split(" ");
          for (n = 0; n < o.length; n++) g(u, o[n]);
          e._i.push([i, s, a]);
        },
        e.__SV = 1
      );
    })(document, window.posthog || []);
    window.posthog.init(POSTHOG_KEY, { api_host: POSTHOG_HOST, capture_pageview: false, persistence: "localStorage" });
    window._posthog = window.posthog;
  } catch (_) {}
}

// ---- Supabase mock for preview ----
function getSupabase() {
  if (window.supabase) return window.supabase;
  const chain = { select: () => chain, eq: () => chain, order: () => chain, range: () => chain, ilike: () => chain, insert: () => chain, update: () => chain, delete: () => chain, single: () => Promise.resolve({ data: null, error: null }), then: (fn) => fn({ data: [], error: null }) };
  return {
    auth: {
      getSession: () => Promise.resolve({ data: { session: null } }),
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
      signInWithPassword: () => Promise.resolve({ data: {}, error: { message: "Supabase not configured. See SUPABASE_SETUP.md." } }),
      signUp: () => Promise.resolve({ data: {}, error: { message: "Supabase not configured. See SUPABASE_SETUP.md." } }),
      signOut: () => Promise.resolve({}),
    },
    from: () => chain,
  };
}

// ---- Utilities ----
function cls(...args) { return args.filter(Boolean).join(" "); }
function fmt(date) { return new Date(date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }); }
const sb = () => getSupabase();

// ---- Stripe helpers ----
const STRIPE_PUBLISHABLE_KEY = "pk_test_REPLACE_WITH_YOUR_STRIPE_PUBLISHABLE_KEY";

let _stripePromise = null;
function loadStripe() {
  if (_stripePromise) return _stripePromise;
  _stripePromise = new Promise((resolve, reject) => {
    if (window.Stripe) { resolve(window.Stripe(STRIPE_PUBLISHABLE_KEY)); return; }
    const script = document.createElement("script");
    script.src = "https://js.stripe.com/v3/";
    script.onload = () => resolve(window.Stripe(STRIPE_PUBLISHABLE_KEY));
    script.onerror = () => reject(new Error("Failed to load Stripe.js"));
    document.head.appendChild(script);
  });
  return _stripePromise;
}

const PAYMENTS_KEY = "ws_payments";

function loadPayments() {
  try { return JSON.parse(localStorage.getItem(PAYMENTS_KEY) || "[]"); }
  catch { return []; }
}

function savePayment(record) {
  const all = loadPayments();
  all.unshift(record);
  localStorage.setItem(PAYMENTS_KEY, JSON.stringify(all));
}

const PLANS = [
  {
    id: "free",
    name: "Free",
    price: 0,
    interval: null,
    description: "Core features for casual travelers.",
    features: ["Destination log (up to 10)", "Community safety ratings", "Packing lists", "Emergency alert"],
    priceId: null,
  },
  {
    id: "pro_monthly",
    name: "Pro Monthly",
    price: 7.99,
    interval: "month",
    description: "Full access, billed monthly.",
    features: ["Unlimited destinations", "AI safety tips (unlimited)", "Travel connections", "Email notifications", "Priority support"],
    priceId: "price_REPLACE_PRO_MONTHLY",
    featured: false,
  },
  {
    id: "pro_yearly",
    name: "Pro Yearly",
    price: 59.99,
    interval: "year",
    description: "Best value — save 37% vs monthly.",
    features: ["Everything in Pro Monthly", "2 months free", "Early access to new features", "Downloadable packing templates"],
    priceId: "price_REPLACE_PRO_YEARLY",
    featured: true,
  },
  {
    id: "lifetime",
    name: "Lifetime",
    price: 149,
    interval: null,
    description: "One-time purchase, forever access.",
    features: ["Everything in Pro", "No recurring charges", "Lifetime updates", "VIP support"],
    priceId: "price_REPLACE_LIFETIME",
    featured: false,
  },
];

// ---- Notification preference helpers ----
const NOTIF_KEY = "ws_notif_prefs";
const DEFAULT_PREFS = {
  email: "",
  new_safety_rating: true,
  new_connection: true,
  weekly_digest: true,
  digest_frequency: "weekly",
};

function loadNotifPrefs() {
  try { return { ...DEFAULT_PREFS, ...JSON.parse(localStorage.getItem(NOTIF_KEY) || "{}") }; }
  catch { return { ...DEFAULT_PREFS }; }
}

function saveNotifPrefs(prefs) {
  localStorage.setItem(NOTIF_KEY, JSON.stringify(prefs));
}

// ---- Email sender ----
const EMAILJS_SERVICE_ID = "";
const EMAILJS_TEMPLATE_ID = "";
const EMAILJS_PUBLIC_KEY = "";

async function sendEmail({ to, subject, body }) {
  if (EMAILJS_SERVICE_ID && EMAILJS_TEMPLATE_ID && EMAILJS_PUBLIC_KEY) {
    try {
      const res = await fetch("https://api.emailjs.com/api/v1.0/email/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          service_id: EMAILJS_SERVICE_ID,
          template_id: EMAILJS_TEMPLATE_ID,
          user_id: EMAILJS_PUBLIC_KEY,
          template_params: { to_email: to, subject, message: body },
        }),
      });
      if (!res.ok) throw new Error("EmailJS send failed");
      return { ok: true };
    } catch (err) {
      return { ok: false, error: err.message };
    }
  }
  window.location.href = `mailto:${encodeURIComponent(to)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  return { ok: true, mailto: true };
}

// ---- Small reusable components ----
function Spinner({ size = 20 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" style={{ animation: "spin 1s linear infinite" }}>
      <circle cx="12" cy="12" r="10" fill="none" stroke="var(--color-primary)" strokeWidth="3" strokeDasharray="31.4" strokeDashoffset="10" />
    </svg>
  );
}

function Toast({ msg, type, onClose }) {
  useEffect(() => { if (msg) { const t = setTimeout(onClose, 4000); return () => clearTimeout(t); } }, [msg, onClose]);
  if (!msg) return null;
  return (
    <div className={cls("toast", type === "error" ? "toast-error" : "toast-success")} role="alert">
      <span>{msg}</span>
      <button onClick={onClose} aria-label="Dismiss notification" title="Dismiss">✕</button>
    </div>
  );
}

function Modal({ title, onClose, children }) {
  useEffect(() => {
    const fn = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", fn);
    return () => window.removeEventListener("keydown", fn);
  }, [onClose]);
  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true" aria-label={title} onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="modal">
        <div className="modal-header">
          <h2>{title}</h2>
          <button onClick={onClose} aria-label="Close dialog" title="Close dialog" className="icon-btn">✕</button>
        </div>
        <div className="modal-body">{children}</div>
      </div>
    </div>
  );
}

function EmptyState({ icon, title, body }) {
  return (
    <div className="empty-state">
      <div className="empty-icon">{icon}</div>
      <h3>{title}</h3>
      <p>{body}</p>
    </div>
  );
}

function StarRating({ value, onChange, readonly }) {
  return (
    <div className="star-rating" role={readonly ? "img" : "group"} aria-label={`Rating: ${value} out of 5`}>
      {[1,2,3,4,5].map(i => (
        <button key={i} type="button" disabled={readonly}
          className={cls("star", i <= value ? "star-filled" : "")}
          onClick={() => onChange && onChange(i)}
          aria-label={`${i} star${i > 1 ? "s" : ""}`} title={`${i} star${i > 1 ? "s" : ""}`}>
          ★
        </button>
      ))}
    </div>
  );
}

function Toggle({ id, checked, onChange, label, hint }) {
  return (
    <div className="notif-toggle-row">
      <div className="notif-toggle-label">
        <span>{label}</span>
        {hint && <small>{hint}</small>}
      </div>
      <label className="toggle" htmlFor={id}>
        <input id={id} type="checkbox" checked={checked} onChange={e => onChange(e.target.checked)} aria-label={label} />
        <span className="toggle-slider" />
      </label>
    </div>
  );
}

// ---- Auth Screen ----
function AuthScreen({ onAuth }) {
  const [mode, setMode] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function submit(e) {
    e.preventDefault();
    setError("");
    if (!email || !password) { setError("Email and password are required."); return; }
    if (password.length < 6) { setError("Password must be at least 6 characters."); return; }
    setLoading(true);
    try {
      if (mode === "login") {
        const { data, error: err } = await sb().auth.signInWithPassword({ email, password });
        if (err) throw err;
        trackEvent("user_signed_in");
        onAuth(data.user);
      } else {
        if (!name.trim()) { setError("Name is required."); setLoading(false); return; }
        const { data, error: err } = await sb().auth.signUp({ email, password, options: { data: { full_name: name } } });
        if (err) throw err;
        trackEvent("user_signed_up");
        onAuth(data.user);
      }
    } catch (err) {
      setError(err.message || "Authentication failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-screen">
      <div className="auth-card">
        <div className="auth-logo">🌿 WanderSafe</div>
        <p className="auth-sub">Your solo travel companion</p>
        <div className="tab-row">
          <button className={cls("tab", mode === "login" && "tab-active")} onClick={() => setMode("login")}>Sign In</button>
          <button className={cls("tab", mode === "signup" && "tab-active")} onClick={() => setMode("signup")}>Create Account</button>
        </div>
        <form onSubmit={submit} noValidate>
          {mode === "signup" && (
            <div className="field">
              <label htmlFor="name">Full Name</label>
              <input id="name" type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Your name" autoComplete="name" />
            </div>
          )}
          <div className="field">
            <label htmlFor="email">Email</label>
            <input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" autoComplete="email" />
          </div>
          <div className="field">
            <label htmlFor="password">Password</label>
            <input id="password" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="At least 6 characters" autoComplete={mode === "login" ? "current-password" : "new-password"} />
          </div>
          {error && <p className="field-error" role="alert">{error}</p>}
          <button type="submit" className="btn btn-primary w-full" disabled={loading}>
            {loading ? <Spinner size={16} /> : mode === "login" ? "Sign In" : "Create Account"}
          </button>
        </form>
        <p className="privacy-note">By signing up, you agree to our <button className="link-btn" onClick={() => window.dispatchEvent(new CustomEvent("showTos"))}>Terms of Service</button> and <button className="link-btn" onClick={() => window.dispatchEvent(new CustomEvent("showPrivacy"))}>Privacy Policy</button>.</p>
      </div>
    </div>
  );
}

// ---- Destination Log ----
function DestinationLog({ user }) {
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: "", country: "", notes: "", visited: "", status: "planned" });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const PAGE = 20;

  async function load(pageNum = 0) {
    setLoading(true);
    try {
      const { data, error: err } = await sb().from("destinations").select("*").eq("user_id", user.id).order("created_at", { ascending: false }).range(pageNum * PAGE, pageNum * PAGE + PAGE - 1);
      if (err) throw err;
      const rows = data || [];
      if (pageNum === 0) setDestinations(rows);
      else setDestinations(prev => [...prev, ...rows]);
      setHasMore(rows.length === PAGE);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(0); }, []);

  async function save(e) {
    e.preventDefault();
    if (!form.name.trim()) { setError("Destination name is required."); return; }
    setSaving(true);
    const optimistic = { id: "tmp-" + Date.now(), user_id: user.id, ...form, created_at: new Date().toISOString() };
    setDestinations(prev => [optimistic, ...prev]);
    setShowForm(false);
    try {
      const { data, error: err } = await sb().from("destinations").insert([{ user_id: user.id, ...form }]).select().single();
      if (err) throw err;
      if (data) setDestinations(prev => prev.map(d => d.id === optimistic.id ? data : d));
      setForm({ name: "", country: "", notes: "", visited: "", status: "planned" });
      trackEvent("destination_added", { status: form.status, country: form.country });
    } catch (err) {
      setDestinations(prev => prev.filter(d => d.id !== optimistic.id));
      setError(err.message);
      setShowForm(true);
    } finally {
      setSaving(false);
    }
  }

  async function del(id) {
    setDestinations(prev => prev.filter(d => d.id !== id));
    trackEvent("destination_deleted");
    try {
      const { error: err } = await sb().from("destinations").delete().eq("id", id);
      if (err) throw err;
    } catch (err) {
      setError(err.message);
      load(0);
    }
  }

  return (
    <div className="section">
      <div className="section-header">
        <h2>My Destinations</h2>
        <button className="btn btn-primary" onClick={() => setShowForm(true)}>+ Add Destination</button>
      </div>
      {error && <p className="field-error" role="alert">{error}</p>}
      {showForm && (
        <Modal title="Add Destination" onClose={() => setShowForm(false)}>
          <form onSubmit={save}>
            <div className="field"><label htmlFor="dest-name">City / Place *</label><input id="dest-name" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="e.g. Lisbon" required /></div>
            <div className="field"><label htmlFor="dest-country">Country</label><input id="dest-country" value={form.country} onChange={e => setForm(f => ({ ...f, country: e.target.value }))} placeholder="e.g. Portugal" /></div>
            <div className="field"><label htmlFor="dest-status">Status</label>
              <select id="dest-status" value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))}>
                <option value="planned">Planned</option>
                <option value="visited">Visited</option>
                <option value="wishlist">Wishlist</option>
              </select>
            </div>
            <div className="field"><label htmlFor="dest-visited">Visit Date</label><input id="dest-visited" type="date" value={form.visited} onChange={e => setForm(f => ({ ...f, visited: e.target.value }))} /></div>
            <div className="field"><label htmlFor="dest-notes">Notes</label><textarea id="dest-notes" value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} placeholder="Add personal notes..." rows={3} /></div>
            <div className="btn-row">
              <button type="button" className="btn btn-ghost" onClick={() => setShowForm(false)}>Cancel</button>
              <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? <Spinner size={14} /> : "Save"}</button>
            </div>
          </form>
        </Modal>
      )}
      {loading && destinations.length === 0 ? <div className="centered"><Spinner /></div> :
        destinations.length === 0 ? <EmptyState icon="🗺️" title="No destinations yet" body="Start adding places you've visited or plan to explore." /> :
        <div className="card-grid">
          {destinations.map(d => (
            <div key={d.id} className="card">
              <div className="card-header">
                <div>
                  <h3 className="card-title">{d.name}</h3>
                  {d.country && <span className="card-sub">{d.country}</span>}
                </div>
                <button className="icon-btn danger" onClick={() => del(d.id)} aria-label={`Delete ${d.name}`} title={`Delete ${d.name}`}>🗑</button>
              </div>
              <span className={cls("badge", `badge-${d.status}`)}>{d.status}</span>
              {d.visited && <p className="card-meta">📅 {fmt(d.visited)}</p>}
              {d.notes && <p className="card-notes">{d.notes}</p>}
            </div>
          ))}
        </div>
      }
      {hasMore && <button className="btn btn-ghost load-more" onClick={() => { const p = page + 1; setPage(p); load(p); }}>Load More</button>}
    </div>
  );
}

// ---- Safety Ratings ----
function SafetyRatings({ user, onToast }) {
  const [ratings, setRatings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ destination: "", country: "", rating: 0, review: "", tips: "" });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [filter, setFilter] = useState("");
  const PAGE = 20;

  async function load(pageNum = 0, search = filter) {
    setLoading(true);
    try {
      let q = sb().from("safety_ratings").select("*, profiles(full_name)").order("created_at", { ascending: false }).range(pageNum * PAGE, pageNum * PAGE + PAGE - 1);
      if (search) q = q.ilike("destination", `%${search}%`);
      const { data, error: err } = await q;
      if (err) throw err;
      const rows = data || [];
      if (pageNum === 0) setRatings(rows);
      else setRatings(prev => [...prev, ...rows]);
      setHasMore(rows.length === PAGE);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(0); }, []);

  async function save(e) {
    e.preventDefault();
    if (!form.destination.trim()) { setError("Destination is required."); return; }
    if (form.rating === 0) { setError("Please select a safety rating."); return; }
    if (!form.review.trim()) { setError("A review is required."); return; }
    setSaving(true);
    const optimistic = { id: "tmp-" + Date.now(), user_id: user.id, ...form, created_at: new Date().toISOString(), profiles: { full_name: user.user_metadata?.full_name || "You" } };
    setRatings(prev => [optimistic, ...prev]);
    setShowForm(false);
    try {
      const { data, error: err } = await sb().from("safety_ratings").insert([{ user_id: user.id, ...form }]).select("*, profiles(full_name)").single();
      if (err) throw err;
      if (data) setRatings(prev => prev.map(r => r.id === optimistic.id ? data : r));
      setForm({ destination: "", country: "", rating: 0, review: "", tips: "" });
      trackEvent("safety_review_submitted", { destination: form.destination, rating: form.rating });
      const prefs = loadNotifPrefs();
      if (prefs.new_safety_rating && prefs.email) {
        const dest = form.destination + (form.country ? `, ${form.country}` : "");
        await sendEmail({ to: prefs.email, subject: `🌿 WanderSafe: New safety review for ${dest}`, body: `A new safety review was posted for ${dest}.\n\nRating: ${"★".repeat(form.rating)}${"☆".repeat(5 - form.rating)}\n\nReview:\n${form.review}${form.tips ? `\n\nSafety Tips:\n${form.tips}` : ""}\n\n— WanderSafe` });
        onToast && onToast("Notification sent to " + prefs.email, "success");
      }
    } catch (err) {
      setRatings(prev => prev.filter(r => r.id !== optimistic.id));
      setError(err.message);
      setShowForm(true);
    } finally {
      setSaving(false);
    }
  }

  const doFilter = useCallback(() => { setPage(0); load(0, filter); }, [filter]);

  return (
    <div className="section">
      <div className="section-header">
        <h2>Safety Ratings</h2>
        <button className="btn btn-primary" onClick={() => setShowForm(true)}>+ Add Review</button>
      </div>
      <div className="search-row">
        <input type="search" placeholder="Search destinations..." value={filter} onChange={e => setFilter(e.target.value)} onKeyDown={e => e.key === "Enter" && doFilter()} aria-label="Search destinations" />
        <button className="btn btn-ghost" onClick={doFilter}>Search</button>
      </div>
      {error && <p className="field-error" role="alert">{error}</p>}
      {showForm && (
        <Modal title="Add Safety Review" onClose={() => setShowForm(false)}>
          <form onSubmit={save}>
            <div className="field"><label htmlFor="sr-dest">Destination *</label><input id="sr-dest" value={form.destination} onChange={e => setForm(f => ({ ...f, destination: e.target.value }))} placeholder="City or region" required /></div>
            <div className="field"><label htmlFor="sr-country">Country</label><input id="sr-country" value={form.country} onChange={e => setForm(f => ({ ...f, country: e.target.value }))} placeholder="Country" /></div>
            <div className="field"><label>Safety Rating *</label><StarRating value={form.rating} onChange={v => setForm(f => ({ ...f, rating: v }))} /></div>
            <div className="field"><label htmlFor="sr-review">Your Review *</label><textarea id="sr-review" value={form.review} onChange={e => setForm(f => ({ ...f, review: e.target.value }))} placeholder="How safe did you feel?" rows={4} required /></div>
            <div className="field"><label htmlFor="sr-tips">Safety Tips</label><textarea id="sr-tips" value={form.tips} onChange={e => setForm(f => ({ ...f, tips: e.target.value }))} placeholder="Tips for other solo female travelers..." rows={3} /></div>
            <div className="btn-row">
              <button type="button" className="btn btn-ghost" onClick={() => setShowForm(false)}>Cancel</button>
              <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? <Spinner size={14} /> : "Submit Review"}</button>
            </div>
          </form>
        </Modal>
      )}
      {loading && ratings.length === 0 ? <div className="centered"><Spinner /></div> :
        ratings.length === 0 ? <EmptyState icon="⭐" title="No ratings yet" body="Be the first to add a safety review for a destination." /> :
        <div className="card-list">
          {ratings.map(r => (
            <div key={r.id} className="card">
              <div className="card-header">
                <div>
                  <h3 className="card-title">{r.destination}{r.country ? `, ${r.country}` : ""}</h3>
                  <span className="card-sub">{r.profiles?.full_name || "Anonymous"} · {fmt(r.created_at)}</span>
                </div>
                <StarRating value={r.rating} readonly />
              </div>
              <p className="card-notes">{r.review}</p>
              {r.tips && <div className="tip-box"><strong>💡 Tips:</strong> {r.tips}</div>}
            </div>
          ))}
        </div>
      }
      {hasMore && <button className="btn btn-ghost load-more" onClick={() => { const p = page + 1; setPage(p); load(p, filter); }}>Load More</button>}
    </div>
  );
}

// ---- Packing List ----
const TRIP_TEMPLATES = {
  beach: ["Sunscreen SPF 50+","Swimsuit","Sarong / cover-up","Flip flops","Sunglasses","Hat","Aloe vera gel","Waterproof bag","Snorkel gear","Insect repellent"],
  city: ["Comfortable walking shoes","Day bag / crossbody","City map / offline maps","Portable charger","Rain jacket","Layers","Adapter plug","Travel journal","Reusable water bottle","Hand sanitizer"],
  adventure: ["Hiking boots","Quick-dry clothing","First aid kit","Water purification tablets","Headlamp","Emergency whistle","Trekking poles","Trail snacks","Satellite communicator","Multi-tool"],
  business: ["Business attire (×3)","Laptop + charger","Business cards","Portable battery","Wrinkle-release spray","Dress shoes","Presenter remote","Noise-cancelling headphones","Ethernet adapter","Backup USB drive"],
  winter: ["Thermal base layers","Heavy jacket","Waterproof boots","Gloves + hat + scarf","Thick socks (×5)","Hand warmers","Moisturizing lip balm","Boot waterproofing spray","Snow goggles","Emergency blanket"],
};

function PackingList({ user }) {
  const [lists, setLists] = useState([]);
  const [active, setActive] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showNew, setShowNew] = useState(false);
  const [newName, setNewName] = useState("");
  const [tripType, setTripType] = useState("city");
  const [newItem, setNewItem] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  async function load() {
    setLoading(true);
    try {
      const { data, error: err } = await sb().from("packing_lists").select("*, packing_items(*)").eq("user_id", user.id).order("created_at", { ascending: false });
      if (err) throw err;
      const rows = data || [];
      setLists(rows);
      if (!active && rows.length > 0) setActive(rows[0]);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  async function createList(e) {
    e.preventDefault();
    if (!newName.trim()) { setError("List name is required."); return; }
    setSaving(true);
    try {
      const { data: listData, error: e1 } = await sb().from("packing_lists").insert([{ user_id: user.id, name: newName, trip_type: tripType }]).select().single();
      if (e1) throw e1;
      if (listData) {
        const items = TRIP_TEMPLATES[tripType] || [];
        if (items.length > 0) {
          const rows = items.map(text => ({ list_id: listData.id, text, checked: false }));
          await sb().from("packing_items").insert(rows);
        }
      }
      trackEvent("packing_list_created", { trip_type: tripType });
      await load();
      setShowNew(false);
      setNewName("");
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  async function toggleItem(item) {
    const updated = { ...item, checked: !item.checked };
    setActive(prev => prev ? { ...prev, packing_items: prev.packing_items.map(i => i.id === item.id ? updated : i) } : prev);
    setLists(prev => prev.map(l => l.id === active?.id ? { ...l, packing_items: l.packing_items.map(i => i.id === item.id ? updated : i) } : l));
    try {
      await sb().from("packing_items").update({ checked: updated.checked }).eq("id", item.id);
    } catch (err) {
      setError(err.message);
      load();
    }
  }

  async function addItem(e) {
    e.preventDefault();
    if (!newItem.trim() || !active) return;
    const optimistic = { id: "tmp-" + Date.now(), list_id: active.id, text: newItem, checked: false };
    setActive(prev => ({ ...prev, packing_items: [...(prev.packing_items || []), optimistic] }));
    setNewItem("");
    try {
      const { data, error: err } = await sb().from("packing_items").insert([{ list_id: active.id, text: optimistic.text, checked: false }]).select().single();
      if (err) throw err;
      if (data) setActive(prev => ({ ...prev, packing_items: prev.packing_items.map(i => i.id === optimistic.id ? data : i) }));
      trackEvent("packing_item_added");
    } catch (err) {
      setError(err.message);
      load();
    }
  }

  async function delList(id) {
    setLists(prev => prev.filter(l => l.id !== id));
    if (active?.id === id) setActive(lists.find(l => l.id !== id) || null);
    trackEvent("packing_list_deleted");
    await sb().from("packing_lists").delete().eq("id", id);
  }

  const items = active?.packing_items || [];
  const done = items.filter(i => i.checked).length;

  return (
    <div className="section">
      <div className="section-header">
        <h2>Packing Lists</h2>
        <button className="btn btn-primary" onClick={() => setShowNew(true)}>+ New List</button>
      </div>
      {error && <p className="field-error" role="alert">{error}</p>}
      {showNew && (
        <Modal title="New Packing List" onClose={() => setShowNew(false)}>
          <form onSubmit={createList}>
            <div className="field"><label htmlFor="pl-name">List Name *</label><input id="pl-name" value={newName} onChange={e => setNewName(e.target.value)} placeholder="e.g. Bali Trip 2025" required /></div>
            <div className="field"><label htmlFor="pl-type">Trip Type</label>
              <select id="pl-type" value={tripType} onChange={e => setTripType(e.target.value)}>
                <option value="city">City Break</option>
                <option value="beach">Beach Holiday</option>
                <option value="adventure">Adventure / Hiking</option>
                <option value="business">Business Travel</option>
                <option value="winter">Winter Trip</option>
              </select>
            </div>
            <p className="hint">We'll pre-fill a starter list based on your trip type.</p>
            <div className="btn-row">
              <button type="button" className="btn btn-ghost" onClick={() => setShowNew(false)}>Cancel</button>
              <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? <Spinner size={14} /> : "Create"}</button>
            </div>
          </form>
        </Modal>
      )}
      {loading ? <div className="centered"><Spinner /></div> :
        lists.length === 0 ? <EmptyState icon="🧳" title="No packing lists yet" body="Create a packing list and we'll suggest essentials based on your trip type." /> :
        <div className="packing-layout">
          <div className="list-sidebar">
            {lists.map(l => (
              <div key={l.id} className={cls("sidebar-item", active?.id === l.id && "sidebar-active")} onClick={() => setActive(l)} role="button" tabIndex={0} onKeyDown={e => e.key === "Enter" && setActive(l)}>
                <span>{l.name}</span>
                <button className="icon-btn" onClick={ev => { ev.stopPropagation(); delList(l.id); }} aria-label={`Delete ${l.name}`} title={`Delete ${l.name}`}>🗑</button>
              </div>
            ))}
          </div>
          {active && (
            <div className="list-content">
              <div className="progress-bar-wrap"><div className="progress-bar" style={{ width: `${items.length ? (done / items.length) * 100 : 0}%` }} /></div>
              <p className="pack-progress">{done} / {items.length} packed</p>
              <form onSubmit={addItem} className="add-item-form">
                <input value={newItem} onChange={e => setNewItem(e.target.value)} placeholder="Add an item..." aria-label="New packing item" />
                <button type="submit" className="btn btn-primary" aria-label="Add item" title="Add item">+</button>
              </form>
              <ul className="pack-list">
                {items.map(item => (
                  <li key={item.id} className={cls("pack-item", item.checked && "pack-item-done")}>
                    <label><input type="checkbox" checked={item.checked} onChange={() => toggleItem(item)} /><span>{item.text}</span></label>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      }
    </div>
  );
}

// ---- AI Safety Tips ----
function AITips({ user }) {
  const [destination, setDestination] = useState("");
  const [tips, setTips] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [apiKey, setApiKey] = useState(() => localStorage.getItem("ws_anthropic_key") || "");
  const [showKey, setShowKey] = useState(false);

  async function getTips(e) {
    e.preventDefault();
    if (!destination.trim()) { setError("Please enter a destination."); return; }
    const key = apiKey.trim();
    if (!key) { setError("Please enter your Anthropic API key."); setShowKey(true); return; }
    setLoading(true); setError(""); setTips("");
    trackEvent("ai_tips_requested", { destination });
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "x-api-key": key, "anthropic-version": "2023-06-01", "content-type": "application/json", "anthropic-dangerous-direct-browser-access": "true" },
        body: JSON.stringify({ model: "claude-sonnet-4-5", max_tokens: 800, messages: [{ role: "user", content: `You are a safety advisor for solo female travelers. Provide practical, current safety tips for a woman traveling alone to ${destination}. Include: general safety level, areas to avoid, transport tips, cultural considerations, local emergency numbers, and recommended apps or resources. Be specific, honest, and empowering. Format as clear bullet points.` }] }),
      });
      if (!res.ok) { const body = await res.json(); throw new Error(body.error?.message || `API error ${res.status}`); }
      const data = await res.json();
      setTips(data.content[0].text);
      trackEvent("ai_tips_received", { destination });
    } catch (err) {
      setError(err.message || "Failed to get AI tips. Check your API key.");
      trackEvent("ai_tips_error", { destination });
    } finally {
      setLoading(false);
    }
  }

  function saveKey(e) { e.preventDefault(); localStorage.setItem("ws_anthropic_key", apiKey); setShowKey(false); }

  return (
    <div className="section">
      <div className="section-header">
        <h2>AI Safety Tips</h2>
        <button className="btn btn-ghost" onClick={() => setShowKey(true)} title="API Key Settings" aria-label="API Key Settings">🔑 API Key</button>
      </div>
      <div className="ai-badge">🤖 Powered by Claude AI (Anthropic) · Always verify information locally</div>
      {showKey && (
        <Modal title="Anthropic API Key" onClose={() => setShowKey(false)}>
          <form onSubmit={saveKey}>
            <div className="field">
              <label htmlFor="api-key">Your Anthropic API Key</label>
              <input id="api-key" type="password" value={apiKey} onChange={e => setApiKey(e.target.value)} placeholder="sk-ant-..." />
              <p className="hint">Stored locally on your device only. Get a key at <a href="https://console.anthropic.com" target="_blank" rel="noopener noreferrer">console.anthropic.com</a>.</p>
            </div>
            <div className="btn-row"><button type="submit" className="btn btn-primary">Save Key</button></div>
          </form>
        </Modal>
      )}
      <form onSubmit={getTips} className="ai-form">
        <div className="field">
          <label htmlFor="ai-dest">Where are you headed?</label>
          <input id="ai-dest" value={destination} onChange={e => setDestination(e.target.value)} placeholder="e.g. Tokyo, Japan" />
        </div>
        {error && <p className="field-error" role="alert">{error}</p>}
        <button type="submit" className="btn btn-primary" disabled={loading}>{loading ? <><Spinner size={14} /> Getting Tips...</> : "Get Safety Tips"}</button>
      </form>
      {loading && <div className="centered" style={{ marginTop: "2rem" }}><Spinner size={36} /><p style={{ marginTop: "1rem", color: "var(--color-text-light)" }}>Analyzing safety data for {destination}…</p></div>}
      {tips && (
        <div className="tips-output">
          <h3>Safety Tips for {destination}</h3>
          <div className="tips-content">{tips.split("\n").map((line, i) => <p key={i}>{line}</p>)}</div>
        </div>
      )}
    </div>
  );
}

// ---- Travel Connections ----
function Connections({ user, onToast }) {
  const [connections, setConnections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ destination: "", dates: "", looking_for: "", bio: "" });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const PAGE = 20;

  async function load(pageNum = 0) {
    setLoading(true);
    try {
      const { data, error: err } = await sb().from("connections").select("*, profiles(full_name)").order("created_at", { ascending: false }).range(pageNum * PAGE, pageNum * PAGE + PAGE - 1);
      if (err) throw err;
      const rows = data || [];
      if (pageNum === 0) setConnections(rows);
      else setConnections(prev => [...prev, ...rows]);
      setHasMore(rows.length === PAGE);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(0); }, []);

  async function post(e) {
    e.preventDefault();
    if (!form.destination.trim()) { setError("Destination is required."); return; }
    if (!form.bio.trim()) { setError("Please add a brief bio."); return; }
    setSaving(true);
    const optimistic = { id: "tmp-" + Date.now(), user_id: user.id, ...form, created_at: new Date().toISOString(), profiles: { full_name: user.user_metadata?.full_name || "You" } };
    setConnections(prev => [optimistic, ...prev]);
    setShowForm(false);
    try {
      const { data, error: err } = await sb().from("connections").insert([{ user_id: user.id, ...form }]).select("*, profiles(full_name)").single();
      if (err) throw err;
      if (data) setConnections(prev => prev.map(c => c.id === optimistic.id ? data : c));
      setForm({ destination: "", dates: "", looking_for: "", bio: "" });
      trackEvent("connection_posted", { destination: form.destination });
      const prefs = loadNotifPrefs();
      if (prefs.new_connection && prefs.email) {
        const posterName = user.user_metadata?.full_name || "A traveler";
        await sendEmail({ to: prefs.email, subject: `🌿 WanderSafe: New connection post for ${form.destination}`, body: `${posterName} is looking for a travel companion!\n\nDestination: ${form.destination}${form.dates ? `\nDates: ${form.dates}` : ""}${form.looking_for ? `\nLooking for: ${form.looking_for}` : ""}\n\nAbout them:\n${form.bio}\n\n— WanderSafe` });
        onToast && onToast("Notification sent to " + prefs.email, "success");
      }
    } catch (err) {
      setConnections(prev => prev.filter(c => c.id !== optimistic.id));
      setError(err.message);
      setShowForm(true);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="section">
      <div className="section-header">
        <h2>Travel Connections</h2>
        <button className="btn btn-primary" onClick={() => setShowForm(true)}>+ Post</button>
      </div>
      <p className="section-desc">Connect with other solo female travelers heading to the same destination.</p>
      {error && <p className="field-error" role="alert">{error}</p>}
      {showForm && (
        <Modal title="Find a Travel Connection" onClose={() => setShowForm(false)}>
          <form onSubmit={post}>
            <div className="field"><label htmlFor="cn-dest">Destination *</label><input id="cn-dest" value={form.destination} onChange={e => setForm(f => ({ ...f, destination: e.target.value }))} placeholder="Where are you going?" required /></div>
            <div className="field"><label htmlFor="cn-dates">Dates</label><input id="cn-dates" value={form.dates} onChange={e => setForm(f => ({ ...f, dates: e.target.value }))} placeholder="e.g. March 10–20, 2025" /></div>
            <div className="field"><label htmlFor="cn-looking">Looking For</label><input id="cn-looking" value={form.looking_for} onChange={e => setForm(f => ({ ...f, looking_for: e.target.value }))} placeholder="e.g. Day trip buddy, dinner companion" /></div>
            <div className="field"><label htmlFor="cn-bio">About You *</label><textarea id="cn-bio" value={form.bio} onChange={e => setForm(f => ({ ...f, bio: e.target.value }))} placeholder="A little about yourself and your travel style..." rows={3} required /></div>
            <div className="btn-row">
              <button type="button" className="btn btn-ghost" onClick={() => setShowForm(false)}>Cancel</button>
              <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? <Spinner size={14} /> : "Post"}</button>
            </div>
          </form>
        </Modal>
      )}
      {loading && connections.length === 0 ? <div className="centered"><Spinner /></div> :
        connections.length === 0 ? <EmptyState icon="👯‍♀️" title="No connections yet" body="Post your travel plans and find fellow solo travelers at your destination." /> :
        <div className="card-list">
          {connections.map(c => (
            <div key={c.id} className="card">
              <div className="card-header">
                <div>
                  <h3 className="card-title">{c.destination}</h3>
                  <span className="card-sub">{c.profiles?.full_name || "Anonymous"} · {fmt(c.created_at)}</span>
                </div>
              </div>
              {c.dates && <p className="card-meta">📅 {c.dates}</p>}
              {c.looking_for && <p className="card-meta">🔍 {c.looking_for}</p>}
              <p className="card-notes">{c.bio}</p>
            </div>
          ))}
        </div>
      }
      {hasMore && <button className="btn btn-ghost load-more" onClick={() => { const p = page + 1; setPage(p); load(p); }}>Load More</button>}
    </div>
  );
}

// ---- Location & Emergency ----
function LocationSafety({ user }) {
  const [contact, setContact] = useState(() => { try { return JSON.parse(localStorage.getItem("ws_contact") || "null") || { name: "", email: "", phone: "" }; } catch { return { name: "", email: "", phone: "" }; } });
  const [location, setLocation] = useState(null);
  const [sharing, setSharing] = useState(false);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);
  const watchRef = useRef(null);

  function saveContact(e) {
    e.preventDefault();
    localStorage.setItem("ws_contact", JSON.stringify(contact));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  function startSharing() {
    if (!navigator.geolocation) { setError("Geolocation is not supported by your browser."); return; }
    setError(""); setSharing(true);
    trackEvent("location_sharing_started");
    watchRef.current = navigator.geolocation.watchPosition(
      (pos) => { const loc = { lat: pos.coords.latitude, lng: pos.coords.longitude, ts: new Date().toISOString() }; setLocation(loc); localStorage.setItem("ws_last_location", JSON.stringify(loc)); },
      (err) => { setError("Location error: " + err.message); setSharing(false); },
      { enableHighAccuracy: true }
    );
  }

  function stopSharing() { if (watchRef.current) navigator.geolocation.clearWatch(watchRef.current); setSharing(false); trackEvent("location_sharing_stopped"); }

  function emergency() {
    trackEvent("emergency_alert_triggered");
    const loc = location || JSON.parse(localStorage.getItem("ws_last_location") || "null");
    const mapLink = loc ? `https://maps.google.com/maps?q=${loc.lat},${loc.lng}` : "Location unavailable";
    const body = `EMERGENCY ALERT from WanderSafe!\n\nI need help. My last known location: ${mapLink}\n\nPlease call emergency services immediately.`;
    if (contact.email) window.location.href = `mailto:${contact.email}?subject=🚨 EMERGENCY ALERT&body=${encodeURIComponent(body)}`;
    setTimeout(() => { window.location.href = "tel:911"; }, 500);
  }

  return (
    <div className="section">
      <div className="section-header"><h2>Location & Safety</h2></div>
      <div className="emergency-btn-wrap">
        <button className="emergency-btn" onClick={emergency} aria-label="Emergency Alert">🆘 EMERGENCY ALERT</button>
        <p className="emergency-note">Alerts your emergency contact and dials emergency services. Works offline using your last known location.</p>
      </div>
      <div className="card" style={{ marginBottom: "1.5rem" }}>
        <h3 style={{ marginBottom: "1rem" }}>Emergency Contact</h3>
        <form onSubmit={saveContact}>
          <div className="field"><label htmlFor="ec-name">Name</label><input id="ec-name" value={contact.name} onChange={e => setContact(c => ({ ...c, name: e.target.value }))} placeholder="Contact name" /></div>
          <div className="field"><label htmlFor="ec-email">Email</label><input id="ec-email" type="email" value={contact.email} onChange={e => setContact(c => ({ ...c, email: e.target.value }))} placeholder="contact@example.com" /></div>
          <div className="field"><label htmlFor="ec-phone">Phone</label><input id="ec-phone" type="tel" value={contact.phone} onChange={e => setContact(c => ({ ...c, phone: e.target.value }))} placeholder="+1 555 000 0000" /></div>
          <button type="submit" className="btn btn-primary">{saved ? "✓ Saved!" : "Save Contact"}</button>
        </form>
      </div>
      <div className="card">
        <h3 style={{ marginBottom: "0.5rem" }}>Live Location Sharing</h3>
        <p className="hint" style={{ marginBottom: "1rem" }}>Requires location permission. Location data is stored on your device and sent to your emergency contact only during an alert.</p>
        {error && <p className="field-error" role="alert">{error}</p>}
        {location && <p className="card-meta" style={{ marginBottom: "1rem" }}>📍 {location.lat.toFixed(5)}, {location.lng.toFixed(5)} · Updated {fmt(location.ts)}</p>}
        {!sharing ? <button className="btn btn-primary" onClick={startSharing}>Start Location Sharing</button> : (
          <div className="sharing-active">
            <span className="pulse-dot" aria-hidden="true" />
            <span>Sharing location…</span>
            <button className="btn btn-ghost" onClick={stopSharing}>Stop</button>
          </div>
        )}
      </div>
    </div>
  );
}

// ---- Stripe Checkout Modal ----
function StripeCheckoutModal({ plan, user, onClose, onSuccess }) {
  const [stripe, setStripe] = useState(null);
  const [elements, setElements] = useState(null);
  const [cardReady, setCardReady] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");
  const [name, setName] = useState(user?.user_metadata?.full_name || "");
  const [email, setEmail] = useState(user?.email || "");
  const cardRef = useRef(null);
  const stripeKeyConfigured = !STRIPE_PUBLISHABLE_KEY.includes("REPLACE");

  useEffect(() => {
    if (!stripeKeyConfigured) return;
    loadStripe().then(s => {
      setStripe(s);
      const els = s.elements();
      setElements(els);
      const card = els.create("card", {
        style: {
          base: { fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif", fontSize: "15px", color: "#2d2d2d", "::placeholder": { color: "#aaa" } },
          invalid: { color: "#c0392b" },
        },
      });
      card.mount(cardRef.current);
      card.on("ready", () => setCardReady(true));
      card.on("change", e => { if (e.error) setError(e.error.message); else setError(""); });
    }).catch(err => setError(err.message));
  }, [stripeKeyConfigured]);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!name.trim()) { setError("Name on card is required."); return; }
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setError("A valid email is required."); return; }
    if (!stripe || !elements) { setError("Stripe is not loaded yet. Please wait."); return; }

    setProcessing(true);
    setError("");

    try {
      const cardElement = elements.getElement("card");
      const { paymentMethod, error: pmError } = await stripe.createPaymentMethod({
        type: "card",
        card: cardElement,
        billing_details: { name, email },
      });
      if (pmError) throw new Error(pmError.message);

      const record = {
        id: "pm_" + paymentMethod.id,
        plan_id: plan.id,
        plan_name: plan.name,
        amount: plan.price,
        interval: plan.interval,
        status: "succeeded",
        card_brand: paymentMethod.card.brand,
        card_last4: paymentMethod.card.last4,
        created_at: new Date().toISOString(),
        email,
      };
      savePayment(record);
      trackEvent("payment_completed", { plan_id: plan.id, plan_name: plan.name, amount: plan.price });
      onSuccess(record);
    } catch (err) {
      setError(err.message || "Payment failed. Please try again.");
      trackEvent("payment_failed", { plan_id: plan.id, error: err.message });
    } finally {
      setProcessing(false);
    }
  }

  return (
    <Modal title={`Subscribe to ${plan.name}`} onClose={onClose}>
      {!stripeKeyConfigured ? (
        <div>
          <div className="stripe-key-hint">
            <strong>⚙️ Stripe not yet configured.</strong><br />
            Replace <code>STRIPE_PUBLISHABLE_KEY</code> at the top of App.jsx with your real Stripe publishable key (<code>pk_live_…</code> or <code>pk_test_…</code>), and set the correct Price IDs in the <code>PLANS</code> array. Then connect a backend endpoint to create PaymentIntents and fulfil subscriptions.<br /><br />
            See <a href="https://stripe.com/docs/payments/accept-a-payment" target="_blank" rel="noopener noreferrer">Stripe Docs</a> for full setup instructions.
          </div>
          <div className="btn-row"><button className="btn btn-ghost" onClick={onClose}>Close</button></div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} noValidate>
          <div style={{ background: "var(--color-primary-light)", borderRadius: "var(--radius-sm)", padding: ".625rem .75rem", marginBottom: "1rem", fontSize: ".875rem" }}>
            <strong>{plan.name}</strong> — {plan.interval ? `$${plan.price}/${plan.interval}` : `$${plan.price} one-time`}
          </div>
          <div className="field">
            <label htmlFor="chk-name">Name on Card</label>
            <input id="chk-name" type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Jane Smith" autoComplete="cc-name" required />
          </div>
          <div className="field">
            <label htmlFor="chk-email">Email</label>
            <input id="chk-email" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" autoComplete="email" required />
          </div>
          <div className="field">
            <label>Card Details</label>
            <div className="card-input-wrap" ref={cardRef} aria-label="Card details" />
          </div>
          {error && <p className="field-error" role="alert">{error}</p>}
          <button type="submit" className="btn btn-primary w-full" disabled={processing || !cardReady}>
            {processing ? <><Spinner size={14} /> Processing…</> : plan.interval ? `Subscribe — $${plan.price}/${plan.interval}` : `Pay $${plan.price}`}
          </button>
          <div style={{ textAlign: "center", marginTop: ".75rem" }}>
            <span className="stripe-badge">🔒 Secured by Stripe · Card data never touches our servers</span>
          </div>
          <p className="hint" style={{ textAlign: "center", marginTop: ".5rem" }}>
            {plan.interval === "month" && "Cancel anytime from your account settings."}
            {plan.interval === "year" && "Annual subscription. Cancel before renewal to avoid charges."}
            {!plan.interval && plan.price > 0 && "One-time payment. No recurring charges."}
          </p>
        </form>
      )}
    </Modal>
  );
}

// ---- Billing / Payments Section ----
function Billing({ user, onToast }) {
  const [currentPlan, setCurrentPlan] = useState(() => localStorage.getItem("ws_current_plan") || "free");
  const [payments, setPayments] = useState(loadPayments);
  const [checkoutPlan, setCheckoutPlan] = useState(null);
  const [page, setPage] = useState(0);
  const PAGE = 20;

  const visiblePayments = payments.slice(0, (page + 1) * PAGE);
  const hasMore = payments.length > visiblePayments.length;

  function handleSuccess(record) {
    setPayments(loadPayments());
    setCurrentPlan(record.plan_id);
    localStorage.setItem("ws_current_plan", record.plan_id);
    setCheckoutPlan(null);
    onToast && onToast(`🎉 ${record.plan_name} activated! Welcome to Pro.`, "success");
  }

  function planMeta(p) {
    if (p.id === "free") return null;
    return p.interval ? `$${p.price}/${p.interval}` : `$${p.price} one-time`;
  }

  return (
    <div className="section">
      <div className="section-header"><h2>Plans & Billing</h2></div>
      <p className="section-desc">Upgrade to Pro for unlimited destinations, AI tips, travel connections, and more.</p>

      <div className="pricing-grid">
        {PLANS.map(plan => {
          const isCurrent = currentPlan === plan.id;
          return (
            <div key={plan.id} className={cls("pricing-card", plan.featured && "pricing-card-featured")}>
              {plan.featured && <div className="pricing-label">⭐ Best Value</div>}
              <div className="pricing-name">{plan.name}</div>
              <div className="pricing-price">
                {plan.price === 0 ? "Free" : `$${plan.price}`}
                {plan.interval && <span> /{plan.interval}</span>}
              </div>
              <div className="pricing-desc">{plan.description}</div>
              <ul className="pricing-features">
                {plan.features.map(f => <li key={f}>{f}</li>)}
              </ul>
              <div className="pricing-cta">
                {isCurrent ? (
                  <div className="plan-current">✓ Current Plan</div>
                ) : plan.price === 0 ? (
                  <div className="plan-current" style={{ background: "var(--color-background)", color: "var(--color-text-light)", borderColor: "var(--color-border)" }}>Free Tier</div>
                ) : (
                  <button
                    className="btn btn-primary w-full"
                    onClick={() => { setCheckoutPlan(plan); trackEvent("checkout_initiated", { plan_id: plan.id }); }}
                    aria-label={`Subscribe to ${plan.name} for ${planMeta(plan)}`}
                    title={`Subscribe to ${plan.name}`}
                  >
                    {plan.interval ? "Subscribe" : "Buy Now"}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="payment-section">
        <h3>Payment History</h3>
        {payments.length === 0 ? (
          <EmptyState icon="🧾" title="No payments yet" body="Your purchase history will appear here after your first payment." />
        ) : (
          <div className="card">
            {visiblePayments.map(p => (
              <div key={p.id} className="order-row">
                <div>
                  <div style={{ fontWeight: 600, fontSize: ".875rem" }}>{p.plan_name}</div>
                  <div style={{ fontSize: ".78rem", color: "var(--color-text-light)" }}>
                    {fmt(p.created_at)} · {p.card_brand} ···· {p.card_last4}
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: ".5rem" }}>
                  <span className={cls("badge", p.status === "succeeded" ? "badge-visited" : p.status === "canceled" ? "badge-canceled" : "badge-planned")}>{p.status}</span>
                  <span className={cls("order-amount", p.amount < 0 && "order-amount-refund")}>
                    {p.amount < 0 ? "-" : ""}${Math.abs(p.amount).toFixed(2)}
                  </span>
                </div>
              </div>
            ))}
            {hasMore && <button className="btn btn-ghost load-more" style={{ marginTop: "1rem" }} onClick={() => setPage(pg => pg + 1)}>Load More</button>}
          </div>
        )}
        <div style={{ marginTop: ".75rem" }}>
          <span className="stripe-badge">🔒 Payments processed securely by Stripe. WanderSafe never stores card data.</span>
        </div>
      </div>

      {checkoutPlan && (
        <StripeCheckoutModal
          plan={checkoutPlan}
          user={user}
          onClose={() => setCheckoutPlan(null)}
          onSuccess={handleSuccess}
        />
      )}
    </div>
  );
}

// ---- Analytics Dashboard ----
// Summarises in-session events captured by trackEvent().
// If PostHog is configured, users can also view their PostHog dashboard via the link.
function AnalyticsDashboard() {
  const [, forceRender] = useState(0);

  // Refresh every 5 s so counts update if user acts in another tab
  useEffect(() => {
    const interval = setInterval(() => forceRender(n => n + 1), 5000);
    return () => clearInterval(interval);
  }, []);

  // Aggregate counts per event name
  const counts = {};
  for (const ev of _analyticsEvents) {
    counts[ev.name] = (counts[ev.name] || 0) + 1;
  }
  const totalEvents = _analyticsEvents.length;
  const uniqueEventNames = Object.keys(counts).length;
  const sessionStart = _analyticsEvents.length > 0 ? _analyticsEvents[0].ts : null;
  const sessionMins = sessionStart ? Math.max(1, Math.round((Date.now() - sessionStart) / 60000)) : 0;

  // Sorted by count descending
  const sortedEvents = Object.entries(counts).sort((a, b) => b[1] - a[1]);
  const maxCount = sortedEvents.length > 0 ? sortedEvents[0][1] : 1;

  // Friendly labels
  const EVENT_LABELS = {
    user_signed_in: "Sign-ins",
    user_signed_up: "Sign-ups",
    destination_added: "Destinations added",
    destination_deleted: "Destinations deleted",
    safety_review_submitted: "Safety reviews submitted",
    ai_tips_requested: "AI tips requested",
    ai_tips_received: "AI tips received",
    ai_tips_error: "AI tips errors",
    packing_list_created: "Packing lists created",
    packing_list_deleted: "Packing lists deleted",
    packing_item_added: "Packing items added",
    connection_posted: "Connection posts",
    location_sharing_started: "Location sharing started",
    location_sharing_stopped: "Location sharing stopped",
    emergency_alert_triggered: "Emergency alerts triggered",
    checkout_initiated: "Checkout initiated",
    payment_completed: "Payments completed",
    payment_failed: "Payment failures",
    tab_viewed: "Screen views",
  };

  const posthogConfigured = Boolean(POSTHOG_KEY);

  return (
    <div className="section">
      <div className="section-header">
        <h2>Analytics</h2>
        {posthogConfigured && (
          <a
            href="https://app.posthog.com"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-ghost"
            title="Open PostHog dashboard"
            aria-label="Open PostHog dashboard"
          >
            PostHog ↗
          </a>
        )}
      </div>

      <div className="analytics-provider">
        📊 {posthogConfigured
          ? "Events are being sent to PostHog and recorded in this session."
          : "Session analytics only. Configure PostHog key to persist data across sessions."}
      </div>

      {!posthogConfigured && (
        <div className="tip-box" style={{ marginBottom: "1rem" }}>
          <strong>To enable PostHog:</strong> set <code>POSTHOG_KEY</code> in App.jsx to your project API key from{" "}
          <a href="https://app.posthog.com" target="_blank" rel="noopener noreferrer">app.posthog.com</a>.
          It's free for up to 1 million events/month.
        </div>
      )}

      <div className="analytics-grid">
        <div className="analytics-stat">
          <div className="analytics-stat-value">{totalEvents}</div>
          <div className="analytics-stat-label">Total events</div>
        </div>
        <div className="analytics-stat">
          <div className="analytics-stat-value">{uniqueEventNames}</div>
          <div className="analytics-stat-label">Event types</div>
        </div>
        <div className="analytics-stat">
          <div className="analytics-stat-value">{sessionMins}</div>
          <div className="analytics-stat-label">Session mins</div>
        </div>
        <div className="analytics-stat">
          <div className="analytics-stat-value">{counts["tab_viewed"] || 0}</div>
          <div className="analytics-stat-label">Screen views</div>
        </div>
      </div>

      <h3 style={{ fontSize: "1rem", fontWeight: 600, marginBottom: ".75rem" }}>Event Breakdown</h3>

      {sortedEvents.length === 0 ? (
        <EmptyState icon="📊" title="No events yet" body="Interact with the app and events will appear here." />
      ) : (
        <div className="analytics-events">
          {sortedEvents.map(([name, count]) => (
            <div key={name} className="analytics-event-row">
              <span className="analytics-event-name">{EVENT_LABELS[name] || name}</span>
              <div className="analytics-bar-wrap">
                <div className="analytics-bar" style={{ width: `${(count / maxCount) * 100}%` }} />
              </div>
              <span className="analytics-event-count">{count}</span>
            </div>
          ))}
        </div>
      )}

      <p className="hint" style={{ marginTop: "1.25rem" }}>
        Analytics data is collected to improve WanderSafe. No personally identifiable information is included in events. See our <button className="link-btn" onClick={() => window.dispatchEvent(new CustomEvent("showPrivacy"))}>Privacy Policy</button> for details.
      </p>
    </div>
  );
}

// ---- Email Notifications Settings ----
function NotificationsSettings({ user, onToast }) {
  const [prefs, setPrefs] = useState(loadNotifPrefs);
  const [saved, setSaved] = useState(false);
  const [sending, setSending] = useState(false);
  const [emailError, setEmailError] = useState("");

  function update(key, value) {
    setPrefs(p => ({ ...p, [key]: value }));
    setSaved(false);
  }

  function validateEmail(email) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email); }

  function save(e) {
    e.preventDefault();
    setEmailError("");
    if (prefs.email && !validateEmail(prefs.email)) { setEmailError("Please enter a valid email address."); return; }
    saveNotifPrefs(prefs);
    setSaved(true);
    onToast && onToast("Notification preferences saved.", "success");
    setTimeout(() => setSaved(false), 2500);
  }

  async function sendTestEmail(e) {
    e.preventDefault();
    setEmailError("");
    if (!prefs.email) { setEmailError("Enter an email address first."); return; }
    if (!validateEmail(prefs.email)) { setEmailError("Please enter a valid email address."); return; }
    setSending(true);
    try {
      const result = await sendEmail({ to: prefs.email, subject: "🌿 WanderSafe — Test Notification", body: `Hi there!\n\nThis is a test notification from WanderSafe.\n\nEnabled:\n${prefs.new_safety_rating ? "✅ New safety reviews\n" : ""}${prefs.new_connection ? "✅ New travel connection posts\n" : ""}${prefs.weekly_digest ? `✅ ${prefs.digest_frequency === "daily" ? "Daily" : "Weekly"} digest\n` : ""}\n— WanderSafe` });
      if (result.ok) {
        onToast && onToast(result.mailto ? "Email client opened with test message." : "Test email sent to " + prefs.email, "success");
      } else {
        onToast && onToast("Failed to send test email: " + result.error, "error");
      }
    } finally {
      setSending(false);
    }
  }

  const anyEnabled = prefs.new_safety_rating || prefs.new_connection || prefs.weekly_digest;

  return (
    <div className="card" style={{ marginTop: "1rem" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1rem" }}>
        <h3>Email Notifications</h3>
        <span className={cls("notif-status-badge", anyEnabled && prefs.email ? "notif-status-enabled" : "notif-status-disabled")}>
          {anyEnabled && prefs.email ? "✓ Active" : "Off"}
        </span>
      </div>
      <form onSubmit={save} noValidate>
        <div className="field">
          <label htmlFor="notif-email">Notification Email</label>
          <input id="notif-email" type="email" value={prefs.email} onChange={e => update("email", e.target.value)} placeholder="you@example.com" autoComplete="email" />
          {emailError && <p className="field-error" role="alert">{emailError}</p>}
          <p className="hint">Where to send notifications. Only used for WanderSafe updates.</p>
        </div>
        <div className="notif-section">
          <h3>Activity Alerts</h3>
          <Toggle id="notif-safety" checked={prefs.new_safety_rating} onChange={v => update("new_safety_rating", v)} label="New safety reviews" hint="Get notified when someone posts a safety review" />
          <Toggle id="notif-connection" checked={prefs.new_connection} onChange={v => update("new_connection", v)} label="New travel connections" hint="Get notified when a traveler posts a connection request" />
        </div>
        <div className="notif-section">
          <h3>Digest</h3>
          <Toggle id="notif-digest" checked={prefs.weekly_digest} onChange={v => update("weekly_digest", v)} label="Activity digest" hint="A summary of new reviews and connections" />
          {prefs.weekly_digest && (
            <div className="field" style={{ marginTop: ".75rem" }}>
              <label htmlFor="notif-freq">Digest Frequency</label>
              <select id="notif-freq" value={prefs.digest_frequency} onChange={e => update("digest_frequency", e.target.value)}>
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
              </select>
            </div>
          )}
        </div>
        {anyEnabled && prefs.email && (
          <div className="notif-preview">📬 Notifications will be sent to <strong>{prefs.email}</strong> when enabled events occur.</div>
        )}
        <div className="btn-row" style={{ marginTop: "1.25rem" }}>
          <button type="button" className="btn btn-ghost" onClick={sendTestEmail} disabled={sending || !prefs.email}>{sending ? <Spinner size={14} /> : "Send Test Email"}</button>
          <button type="submit" className="btn btn-primary">{saved ? "✓ Saved!" : "Save Preferences"}</button>
        </div>
      </form>
      <p className="hint" style={{ marginTop: "1rem" }}>
        <strong>Note:</strong> Activity alerts fire when you or another user posts a review or connection while you have this tab open. For server-side notifications, configure EmailJS or a backend webhook.
      </p>
    </div>
  );
}

// ---- Settings ----
function Settings({ user, onToast }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [deleting, setDeleting] = useState(false);

  async function deleteAccount() {
    if (!window.confirm("Delete your account and all data? This cannot be undone.")) return;
    setDeleting(true);
    try {
      await Promise.all([
        sb().from("destinations").delete().eq("user_id", user.id),
        sb().from("safety_ratings").delete().eq("user_id", user.id),
        sb().from("packing_lists").delete().eq("user_id", user.id),
        sb().from("connections").delete().eq("user_id", user.id),
      ]);
      trackEvent("account_deleted");
      await sb().auth.signOut();
    } catch (err) {
      setError(err.message);
      setDeleting(false);
    }
  }

  async function signOut() { setLoading(true); trackEvent("user_signed_out"); await sb().auth.signOut(); }

  return (
    <div className="section">
      <div className="section-header"><h2>Settings</h2></div>
      <div className="card">
        <h3>Account</h3>
        <p className="card-meta">{user.email}</p>
        {error && <p className="field-error" role="alert">{error}</p>}
        <div className="btn-col">
          <button className="btn btn-ghost" onClick={signOut} disabled={loading}>{loading ? <Spinner size={14} /> : "Sign Out"}</button>
          <button className="btn btn-danger" onClick={deleteAccount} disabled={deleting}>{deleting ? <Spinner size={14} /> : "Delete Account & All Data"}</button>
        </div>
      </div>

      <NotificationsSettings user={user} onToast={onToast} />

      <div className="card" style={{ marginTop: "1rem" }}>
        <h3>Data & Privacy</h3>
        <p className="hint">All your data is stored securely and never shared with third parties. Deleting your account removes all data after a 30-day grace period.</p>
        <div className="btn-col" style={{ marginTop: "0.75rem" }}>
          <button className="link-btn" onClick={() => window.dispatchEvent(new CustomEvent("showPrivacy"))}>Privacy Policy</button>
          <button className="link-btn" onClick={() => window.dispatchEvent(new CustomEvent("showTos"))}>Terms of Service</button>
        </div>
      </div>
    </div>
  );
}

// ---- Legal ----
function PrivacyModal({ onClose }) {
  return (
    <Modal title="Privacy Policy" onClose={onClose}>
      <div className="legal-content">
        <p><strong>Last updated: 2025</strong></p>
        <h4>What we collect</h4><p>Your email, name, destinations, safety reviews, packing lists, travel connection posts, and emergency contact (stored locally on your device). Your notification email preference is stored locally on your device only.</p>
        <h4>Analytics</h4><p>We collect anonymous usage events (e.g. "destination added", "screen viewed") to understand how WanderSafe is used and improve the product. No personally identifiable information is included in analytics events. If PostHog is configured, events are sent to PostHog in accordance with their privacy policy.</p>
        <h4>Payment data</h4><p>Payments are processed by Stripe. WanderSafe never stores your card number, CVV, or full card details. We only store a record of your plan, payment status, card brand, and last 4 digits for your payment history.</p>
        <h4>How we use your data</h4><p>Solely to provide WanderSafe's features. Safety reviews and travel connections you post are visible to other signed-in users. All other data is private.</p>
        <h4>Email notifications</h4><p>If you opt in to email notifications, your email address is used solely to send WanderSafe activity updates. It is never shared with third parties or used for advertising.</p>
        <h4>What we do not do</h4><p>We do not sell, rent, or share your personal data with third parties. We do not use your data for advertising.</p>
        <h4>Location data</h4><p>Processed on your device only. Sent to your emergency contact only when you trigger the Emergency Alert.</p>
        <h4>AI features</h4><p>AI Safety Tips sends your destination query to Anthropic using your personal API key. WanderSafe does not retain this data.</p>
        <h4>Data deletion</h4><p>You can delete your account and all data at any time from Settings.</p>
      </div>
    </Modal>
  );
}

function TosModal({ onClose }) {
  return (
    <Modal title="Terms of Service" onClose={onClose}>
      <div className="legal-content">
        <p><strong>Last updated: 2025</strong></p>
        <p>By using WanderSafe, you agree to these terms.</p>
        <h4>Use of the service</h4><p>WanderSafe is for personal travel safety use. You must not post harmful, false, or misleading safety information.</p>
        <h4>Subscriptions & payments</h4><p>Pro subscriptions are billed in advance. You may cancel at any time. Refunds are handled on a case-by-case basis within 14 days of purchase. Lifetime purchases are non-refundable after 30 days.</p>
        <h4>Emergency features</h4><p>WanderSafe's emergency tools are supplementary aids only. Always call local emergency services directly in an emergency.</p>
        <h4>AI-generated content</h4><p>AI safety tips may not be accurate or current. Always verify with official local sources.</p>
        <h4>Limitation of liability</h4><p>WanderSafe is provided "as is." We are not liable for any harm arising from reliance on app features, community content, or AI-generated tips.</p>
      </div>
    </Modal>
  );
}

function CookieBanner({ onAccept }) {
  return (
    <div className="cookie-banner" role="alertdialog" aria-label="Cookie consent">
      <p>🍪 WanderSafe uses essential cookies for authentication and app functionality. Anonymous analytics are collected to improve the app. No advertising or tracking cookies are used.</p>
      <button className="btn btn-primary" onClick={onAccept}>Accept & Continue</button>
    </div>
  );
}

// ---- Main App ----
const TABS = [
  { id: "destinations", label: "Destinations", icon: "🗺️" },
  { id: "ratings", label: "Safety", icon: "⭐" },
  { id: "packing", label: "Packing", icon: "🧳" },
  { id: "ai", label: "AI Tips", icon: "🤖" },
  { id: "connections", label: "Connect", icon: "👯‍♀️" },
  { id: "location", label: "Emergency", icon: "📍" },
  { id: "billing", label: "Billing", icon: "💳" },
  { id: "analytics", label: "Analytics", icon: "📊" },
  { id: "settings", label: "Account", icon: "⚙️" },
];

function App() {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [tab, setTab] = useState(() => localStorage.getItem("ws_tab") || "destinations");
  const [showPrivacy, setShowPrivacy] = useState(false);
  const [showTos, setShowTos] = useState(false);
  const [cookieAccepted, setCookieAccepted] = useState(() => localStorage.getItem("ws_cookie") === "1");
  const [toast, setToast] = useState({ msg: "", type: "" });

  function showToast(msg, type = "success") { setToast({ msg, type }); }

  // Initialise PostHog once on mount
  useEffect(() => { initPostHog(); }, []);

  useEffect(() => {
    sb().auth.getSession().then(({ data }) => {
      setUser(data.session?.user || null);
      setAuthLoading(false);
    });
    const { data: sub } = sb().auth.onAuthStateChange((_e, session) => {
      setUser(session?.user || null);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    const p = () => setShowPrivacy(true);
    const t = () => setShowTos(true);
    window.addEventListener("showPrivacy", p);
    window.addEventListener("showTos", t);
    return () => { window.removeEventListener("showPrivacy", p); window.removeEventListener("showTos", t); };
  }, []);

  // Track tab (screen) views
  useEffect(() => {
    localStorage.setItem("ws_tab", tab);
    trackEvent("tab_viewed", { tab });
  }, [tab]);

  function acceptCookie() { localStorage.setItem("ws_cookie", "1"); setCookieAccepted(true); }

  if (authLoading) return (
    <>
      <style>{STYLES}</style>
      <div className="full-center"><Spinner size={40} /></div>
    </>
  );

  if (!user) return (
    <>
      <style>{STYLES}</style>
      <AuthScreen onAuth={setUser} />
      {!cookieAccepted && <CookieBanner onAccept={acceptCookie} />}
      {showPrivacy && <PrivacyModal onClose={() => setShowPrivacy(false)} />}
      {showTos && <TosModal onClose={() => setShowTos(false)} />}
    </>
  );

  return (
    <>
      <style>{STYLES}</style>
      <div className="app">
        <header className="app-header">
          <div className="header-inner">
            <span className="app-logo">🌿 WanderSafe</span>
            <button className="emergency-mini" onClick={() => setTab("location")} aria-label="Emergency" title="Go to Emergency">🆘</button>
          </div>
        </header>
        <main className="app-main">
          {tab === "destinations" && <DestinationLog user={user} />}
          {tab === "ratings" && <SafetyRatings user={user} onToast={showToast} />}
          {tab === "packing" && <PackingList user={user} />}
          {tab === "ai" && <AITips user={user} />}
          {tab === "connections" && <Connections user={user} onToast={showToast} />}
          {tab === "location" && <LocationSafety user={user} />}
          {tab === "billing" && <Billing user={user} onToast={showToast} />}
          {tab === "analytics" && <AnalyticsDashboard />}
          {tab === "settings" && <Settings user={user} onToast={showToast} />}
        </main>
        <nav className="bottom-nav" aria-label="Main navigation">
          {TABS.map(t => (
            <button key={t.id} className={cls("nav-btn", tab === t.id && "nav-btn-active")} onClick={() => setTab(t.id)} aria-label={t.label} aria-current={tab === t.id ? "page" : undefined} title={t.label}>
              <span className="nav-icon">{t.icon}</span>
              <span className="nav-label">{t.label}</span>
            </button>
          ))}
        </nav>
        <Toast msg={toast.msg} type={toast.type} onClose={() => setToast({ msg: "", type: "" })} />
        {!cookieAccepted && <CookieBanner onAccept={acceptCookie} />}
        {showPrivacy && <PrivacyModal onClose={() => setShowPrivacy(false)} />}
        {showTos && <TosModal onClose={() => setShowTos(false)} />}
        <footer className="app-footer">
          <button className="link-btn" onClick={() => setShowPrivacy(true)}>Privacy Policy</button>
          <span>·</span>
          <button className="link-btn" onClick={() => setShowTos(true)}>Terms of Service</button>
          <span>·</span>
          <span>© 2025 WanderSafe</span>
        </footer>
      </div>
    </>
  );
}

export default App;