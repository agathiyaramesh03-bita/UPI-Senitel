/* =========================================================
   UPI Sentinel — Shared helpers, icons and page templates
   ========================================================= */
const esc = (s) => String(s ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const inr = (n) => "₹" + Number(n || 0).toLocaleString("en-IN");
const fmtDate = (iso) => new Date(iso).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
const fmtDT = (d, t) => `${new Date(d + "T00:00").toLocaleDateString("en-IN", { day: "2-digit", month: "short" })}, ${t}`;
const ago = (iso) => {
  const s = (Date.now() - new Date(iso)) / 1000;
  if (s < 60) return "just now";
  if (s < 3600) return Math.floor(s / 60) + " min ago";
  if (s < 86400) return Math.floor(s / 3600) + " h ago";
  return Math.floor(s / 86400) + " d ago";
};
const scoreColor = (s) => s >= 70 ? "var(--danger)" : s >= 35 ? "var(--warn)" : "var(--safe)";
const pill = (cls) => `<span class="pill ${cls}">${{ safe: "Safe", suspicious: "Suspicious", fraud: "Potential Fraud" }[cls] || esc(cls)}</span>`;
const scoreBar = (s) => `<span class="score-bar"><span class="num" style="color:${scoreColor(s)}">${s}</span><span class="track"><i style="width:${s}%;background:${scoreColor(s)}"></i></span></span>`;

const I = {
  arrow: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M7 17L17 7M8 7h9v9"/></svg>',
  right: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M4 12h16M14 6l6 6-6 6"/></svg>',
  down: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M12 4v16M6 14l6 6 6-6"/></svg>',
  shield: '<svg viewBox="0 0 24 26" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"><path d="M12 1.5l9 3.4v7.3c0 5.8-3.9 10.6-9 12.3-5.1-1.7-9-6.5-9-12.3V4.9z"/><path d="M8 13l3 3 5-6" stroke-linecap="round"/></svg>',
  shieldSm: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"><path d="M12 2l8 3v6c0 5-3.5 9.5-8 11-4.5-1.5-8-6-8-11V5z"/><path d="M8.5 12l2.5 2.5 4.5-5" stroke-linecap="round"/></svg>',
  scan: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M4 8V5a1 1 0 011-1h3M16 4h3a1 1 0 011 1v3M20 16v3a1 1 0 01-1 1h-3M8 20H5a1 1 0 01-1-1v-3M8 12h8"/></svg>',
  chart: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M4 20v-4M8 20v-7M12 20v-9M16 20v-6M20 20V9M4 11l5-5 4 3 7-6"/></svg>',
  bell: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M6 8a6 6 0 1112 0c0 7 3 8 3 8H3s3-1 3-8M10 20a2 2 0 004 0M3 5l2-2M21 5l-2-2"/></svg>',
  lock: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V7a4 4 0 018 0v4"/></svg>',
  check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="9"/><path d="M8 12l3 3 5-5"/></svg>',
  finger: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"><path d="M12 11v4M8.5 8.5A5 5 0 0117 12v1M7 12c0 3 .7 5.3 2 7M17 16c-.3 1.8-.9 3.2-1.6 4.3M12 3a9 9 0 019 9M3 12a9 9 0 013.5-7.1M12 15c0 2-.4 4-1.4 5.5"/></svg>',
  alert: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M12 3l10 18H2z"/><path d="M12 10v4M12 17.5v.5"/></svg>',
  info: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="9"/><path d="M12 11v6M12 7.5v.5"/></svg>',
  trash: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13"/></svg>',
  eye: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/></svg>',
  users: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><circle cx="9" cy="8" r="4"/><path d="M2 21c0-4 3-6 7-6s7 2 7 6M16 4a4 4 0 010 8M22 21c0-3-1.5-5-4-5.7"/></svg>',
  pulse: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M3 12h4l3-8 4 16 3-8h4"/></svg>',
  rupee: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M6 4h12M6 9h12M14 4c3 0 4 2.5 4 5s-2 5-6 5H7l8 7"/></svg>',
  menu: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M4 7h16M4 12h16M4 17h16"/></svg>',
  mail: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/></svg>',
  phone: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M5 3h4l2 5-2.5 1.5a11 11 0 006 6L16 13l5 2v4a2 2 0 01-2 2A16 16 0 013 5a2 2 0 012-2z"/></svg>',
  pin: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 22s7-6.2 7-12a7 7 0 10-14 0c0 5.8 7 12 7 12z"/><circle cx="12" cy="10" r="2.5"/></svg>',
  download: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M12 4v11M7 10l5 5 5-5M4 20h16"/></svg>',
  cpu: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="6" y="6" width="12" height="12" rx="1.5"/><path d="M9 2v4M15 2v4M9 18v4M15 18v4M2 9h4M2 15h4M18 9h4M18 15h4"/></svg>',
  db: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><ellipse cx="12" cy="5" rx="8" ry="3"/><path d="M4 5v14c0 1.7 3.6 3 8 3s8-1.3 8-3V5M4 12c0 1.7 3.6 3 8 3s8-1.3 8-3"/></svg>',
  history: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M3 12a9 9 0 109-9 9 9 0 00-7 3.3M3 4v4h4M12 7v5l3 2"/></svg>',
};

const engineVisual = (withCard = true) => `
  <div class="engine" aria-hidden="true">
    <div class="engine-label">${I.finger} SENTINEL SECURITY ENGINE</div>
    <div class="engine-grid"></div>
    <div class="ring r1"></div><div class="ring r2"></div><div class="ring r3"></div>
    <div class="sweep"></div><div class="glow-orb"></div>
    <div class="shield-core">${I.shield}</div>
    <span class="blip" style="left:84%;top:21%"></span>
    <span class="blip" style="left:26%;top:43%;animation-delay:.8s"></span>
    <span class="blip" style="left:86%;top:69%;animation-delay:1.5s"></span>
    ${withCard ? `<div class="example-card">
      <span class="live-dot"></span>
      <div class="tiny">EXAMPLE ANALYSIS</div>
      <div class="row"><div class="icon-box">${I.scan}</div>
        <div><div class="ttl">Transaction screened</div><div class="ok">${I.check} Safe · Risk score 08 / 100</div></div></div>
    </div>` : ""}
    <div class="engine-foot">TRANSACTION INTELLIGENCE / 01</div>
  </div>`;

/* =========================================================
   Pages. Each: { title, auth?, admin?, html(user), mount?(user) }
   ========================================================= */
const Pages = {};

/* ---------------- HOME ---------------- */
Pages.home = {
  title: "Home",
  html: (u) => `
  <section class="hero">
    <div class="container">
      <div class="hero-top">
        <span class="eyebrow muted"><span class="dot"></span>YOUR PAYMENTS. OUR WATCH.</span>
        <span class="eyebrow muted">BUILT FOR A SAFER DIGITAL INDIA</span>
      </div>
      <div class="hero-grid">
        <div class="page-enter">
          <span class="eyebrow">INTELLIGENT FRAUD DETECTION</span>
          <h1 class="display">Trust your payments.<br><span class="gold">Not the unknown.</span></h1>
          <p class="lead">Every transaction tells a story. UPI Sentinel helps you spot the warning signs, understand the risk, and make your next move with confidence.</p>
          <div class="hero-ctas">
            <a href="#/detect" class="btn btn-gold">Check a transaction ${I.arrow}</a>
            <a href="#/features" class="btn btn-ghost">Explore the system <span style="width:16px;height:16px">${I.right}</span></a>
          </div>
          <div class="trust-row">
            <span>${I.lock} Private by design</span>
            <span>${I.shieldSm} Explainable risk scores</span>
          </div>
        </div>
        ${engineVisual()}
      </div>
      <div class="divider-row">
        <span class="eyebrow muted">ANALYZE. UNDERSTAND. STAY AHEAD.</span>
        <a href="#features-sec" class="scroll-hint" data-scroll="features-sec">SCROLL TO EXPLORE ${I.down}</a>
      </div>
    </div>
  </section>

  <section class="section" id="features-sec">
    <div class="container container-narrow">
      <div class="section-head reveal">
        <div><span class="eyebrow">A CLEARER VIEW OF EVERY PAYMENT</span><h2 class="h2">One system. A stronger defense.</h2></div>
        <a href="#/features" class="link-arrow" style="color:var(--text)">All capabilities ${I.arrow}</a>
      </div>
      <div class="feature-grid reveal">
        <div class="feature"><div class="f-icon">${I.scan}</div><div class="f-kicker">01 / DETECT</div><h3>Spot the warning signs</h3>
          <p>Screen UPI IDs, transfer amounts, timing, and location with an explainable risk engine.</p><a href="#/detect" class="link-arrow">Analyze a transaction ${I.arrow}</a></div>
        <div class="feature"><div class="f-icon">${I.chart}</div><div class="f-kicker">02 / UNDERSTAND</div><h3>See the bigger picture</h3>
          <p>Turn your transaction history into a visual overview of safe payments and emerging risk.</p><a href="#/dashboard" class="link-arrow">Open your dashboard ${I.arrow}</a></div>
        <div class="feature"><div class="f-icon">${I.bell}</div><div class="f-kicker">03 / RESPOND</div><h3>Keep risk in sight</h3>
          <p>Review flagged transactions in one place, understand each alert, and track what needs attention.</p><a href="#/notifications" class="link-arrow">View notifications ${I.arrow}</a></div>
      </div>
    </div>
  </section>

  <section class="section-sm">
    <div class="container container-narrow">
      <div class="grid g-4 reveal" id="liveStats"></div>
    </div>
  </section>

  <section class="section">
    <div class="container container-narrow">
      <div class="split reveal">
        <div>
          <span class="eyebrow">FROM DETAILS TO DECISIONS</span>
          <h2 class="h2" style="margin:22px 0 14px;font-size:clamp(34px,4vw,48px)">Less guesswork.<br>More peace of mind.</h2>
          <p class="muted" style="margin-bottom:24px">A simple checkpoint before you put trust in a payment.</p>
          <a href="${u ? "#/detect" : "#/register"}" class="btn btn-gold">${u ? "Run a check now" : "Create your account"} ${I.arrow}</a>
        </div>
        <div class="steps">
          <div class="step"><span class="n">01</span><div><h4>Enter the transaction</h4><p>Add the sender, receiver, amount, date, time, and location. Never share your UPI PIN.</p></div></div>
          <div class="step"><span class="n">02</span><div><h4>Understand the risk</h4><p>Get a 0–100 score, a clear classification, and the indicators behind the result.</p></div></div>
          <div class="step"><span class="n">03</span><div><h4>Stay informed</h4><p>Your analysis is saved privately, ready to review in your dashboard and history.</p></div></div>
        </div>
      </div>
      <div class="notice reveal" style="margin-top:90px">${I.shieldSm}<div><b>Transparency comes first.</b> This prototype scores transactions with an explainable feature-weighted engine; the Random Forest model runs in the Flask backend phase. Results are advisory and cannot guarantee fraud prevention.</div></div>
    </div>
  </section>`,
  mount() {
    const tx = Store.allTx();
    const c = (k) => tx.filter(t => t.classification === k).length;
    const tiles = [
      ["Transactions screened", tx.length, ""], ["Marked safe", c("safe"), "safe"],
      ["Flagged suspicious", c("suspicious"), "warn"], ["Potential fraud", c("fraud"), "danger"],
    ];
    document.getElementById("liveStats").innerHTML = tiles.map(([l, v, k]) =>
      `<div class="card stat ${k}"><div class="label">${l}</div><div class="value" data-count="${v}">0</div><div class="delta">Across all demo accounts</div></div>`).join("");
    App.countUp();
  },
};

/* ---------------- ABOUT ---------------- */
Pages.about = {
  title: "About",
  html: () => `
  <div class="container container-narrow">
    <div class="page-head page-enter"><span class="eyebrow">ABOUT THE PROJECT</span>
      <h1 class="h2">A checkpoint between you<br>and the next UPI scam.</h1>
      <p class="lead">UPI Sentinel is a final-year cybersecurity project that screens digital payment details and explains, in plain language, why a transaction looks safe or risky.</p></div>
    <div class="page-body">
      <div class="grid g-2-1 reveal" style="align-items:start">
        <div>
          <p class="big-quote">India processes <span class="gold">billions of UPI payments</span> a month. Fraudsters rely on speed and pressure. Sentinel adds a <span class="gold">moment of clarity</span> before money moves.</p>
          <p class="muted" style="margin-top:26px">Fake KYC links, “refund” collect requests, lottery wins and impersonated customer-care handles all leave patterns: odd hours, round amounts, first-time receivers, unusual locations, bursts of payments. Sentinel turns those signals into a 0–100 score and shows every indicator that contributed.</p>
        </div>
        <div class="card">
          <div class="card-title" style="margin-bottom:12px">Project objectives</div>
          <div class="steps" style="gap:18px">
            ${["Detect suspicious UPI transactions from user-entered details", "Explain each risk score with transparent indicators", "Visualise history, trends and alerts on a dashboard", "Give admins oversight of users, alerts and reports"].map((t, i) => `<div class="step" style="grid-template-columns:40px 1fr"><span class="n" style="font-size:20px">0${i + 1}</span><p style="color:var(--text)">${t}</p></div>`).join("")}
          </div>
        </div>
      </div>

      <div class="section-sm reveal"><span class="eyebrow">SYSTEM ARCHITECTURE</span><h3 class="h3" style="margin:14px 0 26px">How a transaction flows through Sentinel</h3>
        <div class="arch">
          <div class="arch-node"><div class="k">01 · CLIENT</div><div class="v">Web interface</div><div class="d">HTML, CSS, JS, Bootstrap, Chart.js</div></div>
          <div class="arch-node"><div class="k">02 · API</div><div class="v">Python Flask</div><div class="d">Auth, sessions, REST endpoints</div></div>
          <div class="arch-node"><div class="k">03 · FEATURES</div><div class="v">Pandas + NumPy</div><div class="d">Amount, hour, receiver, location, velocity</div></div>
          <div class="arch-node"><div class="k">04 · MODEL</div><div class="v">Random Forest</div><div class="d">Scikit-learn classifier → 0–100 score</div></div>
          <div class="arch-node"><div class="k">05 · STORAGE</div><div class="v">MySQL</div><div class="d">Users, transactions, alerts, messages</div></div>
        </div>
      </div>

      <div class="grid g-2 reveal">
        <div class="card"><div class="card-title" style="margin-bottom:16px">Technology stack</div>
          <div class="tech-chips">${["HTML5", "CSS3", "JavaScript", "Bootstrap", "Chart.js", "Python", "Flask", "MySQL", "Pandas", "NumPy", "Scikit-learn", "Random Forest"].map(t => `<span class="chip">${t}</span>`).join("")}</div></div>
        <div class="card"><div class="card-title" style="margin-bottom:16px">Model features</div>
          <div class="tech-chips">${["Transaction amount", "Amount vs user average", "Hour of day", "Receiver ID pattern", "Scam keywords", "First-time receiver", "Location risk", "Payment velocity"].map(t => `<span class="chip">${t}</span>`).join("")}</div></div>
      </div>
    </div>
  </div>`,
};

/* ---------------- FEATURES ---------------- */
Pages.features = {
  title: "Features",
  html: () => {
    const f = [
      [I.scan, "DETECT", "Real-time screening", "Enter sender, receiver, amount, date, time and location. Get a verdict in under a second.", "#/detect", "Analyze a transaction"],
      [I.cpu, "MODEL", "Explainable risk score", "Each 0–100 score lists the indicators that drove it, so users learn the warning signs.", "#/detect", "See it in action"],
      [I.chart, "UNDERSTAND", "Interactive dashboard", "Trend lines, classification split and top risk factors across your history.", "#/dashboard", "Open dashboard"],
      [I.history, "REVIEW", "Transaction history", "Search, filter, inspect and export every screened transaction to CSV.", "#/history", "View history"],
      [I.bell, "RESPOND", "Fraud alerts", "Suspicious and fraud verdicts create alerts you can review and mark as handled.", "#/notifications", "View notifications"],
      [I.users, "GOVERN", "Admin panel", "Manage users, monitor all flagged activity and answer support messages.", "#/admin", "Admin panel"],
      [I.lock, "PROTECT", "Secure authentication", "Hashed passwords, session handling and role-based access for user and admin.", "#/login", "Log in"],
      [I.pin, "LOCATE", "Location intelligence", "Flags regions listed in public cyber-crime advisories and departures from your usual city.", "#/detect", "Try a location check"],
      [I.pulse, "WATCH", "Velocity tracking", "Detects bursts of payments within an hour, a classic sign of account takeover.", "#/detect", "Test velocity"],
    ];
    return `
  <div class="container container-narrow">
    <div class="page-head page-enter"><span class="eyebrow">CAPABILITIES</span><h1 class="h2">Everything you need to<br>question a payment.</h1>
      <p class="lead">Nine capabilities, one goal: catch the warning signs before money leaves your account.</p></div>
    <div class="page-body">
      <div class="feature-grid wrap reveal">${f.map(([ic, k, t, d, h, l], i) =>
        `<div class="feature"><div class="f-icon">${ic}</div><div class="f-kicker">${String(i + 1).padStart(2, "0")} / ${k}</div><h3>${t}</h3><p>${d}</p><a href="${h}" class="link-arrow">${l} ${I.arrow}</a></div>`).join("")}</div>
      <div class="section-sm reveal"><span class="eyebrow">RISK CLASSIFICATION</span><h3 class="h3" style="margin:14px 0 24px">Three clear outcomes</h3>
        <div class="grid g-3">
          <div class="card stat safe"><div class="label">Safe ${pill("safe")}</div><div class="value">0 – 34</div><div class="delta">No strong warning signs. Verify the receiver name and proceed.</div></div>
          <div class="card stat warn"><div class="label">Suspicious ${pill("suspicious")}</div><div class="value">35 – 69</div><div class="delta">Pause and verify through a channel you already trust.</div></div>
          <div class="card stat danger"><div class="label">Potential fraud ${pill("fraud")}</div><div class="value">70 – 100</div><div class="delta">Do not pay. Report at cybercrime.gov.in or call 1930.</div></div>
        </div></div>
    </div>
  </div>`;
  },
};

/* ---------------- LOGIN ---------------- */
Pages.login = {
  title: "Log in",
  html: () => `
  <div class="auth-wrap container" style="padding:0">
    <div class="auth-side"><div><span class="eyebrow">WELCOME BACK</span><h2 class="h2" style="margin-top:16px">Your watch<br><span class="gold">continues.</span></h2></div>${engineVisual(false)}</div>
    <div class="auth-form page-enter">
      <span class="eyebrow">LOG IN</span><h1>Sign in to Sentinel</h1>
      <p class="muted">New here? <a href="#/register" class="gold">Create an account</a></p>
      <form id="loginForm" novalidate>
        <div class="field"><label for="le">Email</label><input class="input" id="le" type="email" autocomplete="email" placeholder="you@example.com" required></div>
        <div class="field"><label for="lp">Password</label><input class="input" id="lp" type="password" autocomplete="current-password" placeholder="••••••••" required></div>
        <div style="display:flex;justify-content:space-between;align-items:center;gap:10px;flex-wrap:wrap">
          <label class="check"><input type="checkbox" checked> Keep me signed in</label>
          <a href="#/contact" class="small gold">Forgot password?</a></div>
        <div class="err" id="loginErr"></div>
        <button class="btn btn-gold btn-block" type="submit">Log in ${I.arrow}</button>
      </form>
      <div class="demo-box">Demo accounts for the presentation:<br>
        User — <button data-demo="demo@sentinel.test|demo1234">demo@sentinel.test / demo1234</button><br>
        Showcase — <button data-demo="showcase@sentinel.test|Sentinel@2026">showcase@sentinel.test / Sentinel@2026</button><br>
        Admin — <button data-demo="admin@sentinel.test|admin1234">admin@sentinel.test / admin1234</button></div>
    </div>
  </div>`,
  mount() {
    document.querySelectorAll("[data-demo]").forEach(b => b.onclick = () => {
      const [e, p] = b.dataset.demo.split("|"); document.getElementById("le").value = e; document.getElementById("lp").value = p;
    });
    document.getElementById("loginForm").onsubmit = (ev) => {
      ev.preventDefault();
      const err = document.getElementById("loginErr");
      try {
        const u = Store.login(document.getElementById("le").value, document.getElementById("lp").value);
        App.toast(`Welcome back, ${u.name.split(" ")[0]}.`, "success");
        location.hash = App.consumeRedirect() || (u.role === "admin" ? "#/admin" : "#/dashboard");
      } catch (e) { err.textContent = e.message; }
    };
  },
};

/* ---------------- REGISTER ---------------- */
Pages.register = {
  title: "Register",
  html: () => `
  <div class="auth-wrap container" style="padding:0">
    <div class="auth-side"><div><span class="eyebrow">JOIN SENTINEL</span><h2 class="h2" style="margin-top:16px">Less guesswork.<br><span class="gold">More peace of mind.</span></h2></div>${engineVisual(false)}</div>
    <div class="auth-form page-enter">
      <span class="eyebrow">CREATE ACCOUNT</span><h1>Start protecting payments</h1>
      <p class="muted">Already registered? <a href="#/login" class="gold">Log in</a></p>
      <form id="regForm" novalidate>
        <div class="form-grid">
          <div class="field full"><label for="rn">Full name</label><input class="input" id="rn" autocomplete="name" placeholder="Your name" required></div>
          <div class="field full"><label for="re">Email</label><input class="input" id="re" type="email" autocomplete="email" placeholder="you@example.com" required></div>
          <div class="field"><label for="ru">Your UPI ID</label><input class="input" id="ru" placeholder="name@okaxis" required></div>
          <div class="field"><label for="rc">Home city</label><input class="input" id="rc" placeholder="Chennai" required></div>
          <div class="field"><label for="rp">Password</label><input class="input" id="rp" type="password" autocomplete="new-password" placeholder="Min. 8 characters" required></div>
          <div class="field"><label for="rp2">Confirm password</label><input class="input" id="rp2" type="password" autocomplete="new-password" placeholder="Repeat password" required></div>
        </div>
        <label class="check"><input type="checkbox" id="rt"> I understand results are advisory and I will never share my UPI PIN.</label>
        <div class="err" id="regErr"></div>
        <button class="btn btn-gold btn-block" type="submit">Create account ${I.arrow}</button>
      </form>
    </div>
  </div>`,
  mount() {
    document.getElementById("regForm").onsubmit = (ev) => {
      ev.preventDefault();
      const v = (id) => document.getElementById(id).value.trim();
      const err = document.getElementById("regErr");
      if (!v("rn") || !v("re") || !v("ru") || !v("rc")) return err.textContent = "Please fill in every field.";
      if (!/^\S+@\S+\.\S+$/.test(v("re"))) return err.textContent = "Enter a valid email address.";
      if (!/^[a-z0-9._-]{2,}@[a-z]{2,}$/i.test(v("ru"))) return err.textContent = "UPI ID should look like name@bank.";
      if (v("rp").length < 8) return err.textContent = "Password must be at least 8 characters.";
      if (v("rp") !== v("rp2")) return err.textContent = "Passwords do not match.";
      if (!document.getElementById("rt").checked) return err.textContent = "Please accept the acknowledgement.";
      try {
        Store.register({ name: v("rn"), email: v("re"), pw: v("rp"), upi: v("ru"), city: v("rc") });
        App.toast("Account created. You’re signed in.", "success");
        location.hash = "#/detect";
      } catch (e) { err.textContent = e.message; }
    };
  },
};

/* ---------------- FRAUD DETECTION ---------------- */
Pages.detect = {
  title: "Fraud Detection", auth: true,
  html: (u) => {
    const now = new Date();
    const t = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
    return `
  <div class="container container-narrow">
    <div class="page-head page-enter"><div class="row"><div><span class="eyebrow">FRAUD DETECTION</span><h1 class="h2">Check a transaction</h1>
      <p class="lead">Enter the payment details. Sentinel scores the risk and shows you exactly why.</p></div>
      <div class="tabs" id="presets"><button class="tab" data-p="safe">Sample: safe</button><button class="tab" data-p="sus">Sample: suspicious</button><button class="tab" data-p="fraud">Sample: fraud</button></div></div></div>
    <div class="page-body">
      <div class="grid g-1-1-2" style="align-items:start">
        <form class="card" id="detectForm" novalidate>
          <div class="card-head"><div class="card-title">Transaction details</div><span class="pill neutral">Never enter your UPI PIN</span></div>
          <div class="form-grid">
            <div class="field full"><label for="ds">Sender UPI ID</label><input class="input" id="ds" value="${esc(u.upi)}" placeholder="you@okaxis" required></div>
            <div class="field full"><label for="dr">Receiver UPI ID</label><input class="input" id="dr" placeholder="receiver@bank" required list="rxList">
              <datalist id="rxList">${[...new Set(Store.txFor(u.id).map(x => x.receiver))].slice(0, 12).map(r => `<option value="${esc(r)}">`).join("")}</datalist></div>
            <div class="field"><label for="da">Amount (₹)</label><input class="input" id="da" type="number" min="1" step="1" placeholder="2500" required></div>
            <div class="field"><label for="dl">Location</label><input class="input" id="dl" value="${esc(u.city)}" placeholder="City" required list="locList">
              <datalist id="locList">${["Chennai", "Coimbatore", "Bengaluru", "Mumbai", "Delhi", "Hyderabad", "Jamtara", "Overseas", "Unknown"].map(c => `<option value="${c}">`).join("")}</datalist></div>
            <div class="field"><label for="dd">Date</label><input class="input" id="dd" type="date" value="${Store.ymd(now)}" required></div>
            <div class="field"><label for="dt">Time</label><input class="input" id="dt" type="time" value="${t}" required></div>
            <div class="field full"><label for="dn">Note (optional)</label><input class="input" id="dn" placeholder="e.g. Received a call asking for refund"></div>
          </div>
          <div class="err" id="detErr" style="margin-top:14px"></div>
          <div style="display:flex;gap:12px;margin-top:6px;flex-wrap:wrap">
            <button class="btn btn-gold" type="submit" style="flex:1">Analyze transaction ${I.arrow}</button>
            <button class="btn btn-outline" type="reset">Clear</button>
          </div>
        </form>
        <div class="card" id="resultPanel">
          <div class="result-empty">${I.shield}<div><div style="color:var(--text);font-weight:700;margin-bottom:6px">Awaiting a transaction</div><p class="small">Fill in the details or load a sample to see the risk analysis.</p></div></div>
        </div>
      </div>
    </div>
  </div>`;
  },
  mount(u) {
    const $ = (id) => document.getElementById(id);
    const presets = {
      safe: { dr: "swiggy@icici", da: 450, dl: u.city || "Chennai", dt: "13:20" },
      sus: { dr: "ravi.k98@okhdfc", da: 18000, dl: "Hyderabad", dt: "23:15" },
      fraud: { dr: "kyc.update.helpdesk@ybl", da: 49999, dl: "Jamtara", dt: "02:40" },
    };
    document.querySelectorAll("#presets .tab").forEach(b => b.onclick = () => {
      document.querySelectorAll("#presets .tab").forEach(x => x.classList.remove("active")); b.classList.add("active");
      const p = presets[b.dataset.p]; Object.entries(p).forEach(([k, v]) => $(k).value = v); $("dd").value = Store.ymd(new Date());
    });
    $("detectForm").onreset = () => setTimeout(() => { $("ds").value = u.upi; $("dd").value = Store.ymd(new Date()); });
    $("detectForm").onsubmit = (ev) => {
      ev.preventDefault();
      const err = $("detErr"); err.textContent = "";
      const data = { sender: $("ds").value.trim(), receiver: $("dr").value.trim(), amount: $("da").value, date: $("dd").value, time: $("dt").value, location: $("dl").value.trim(), note: $("dn").value.trim() };
      if (!data.sender || !data.receiver || !data.amount || !data.date || !data.time || !data.location) return err.textContent = "Please complete all required fields.";
      if (Number(data.amount) <= 0) return err.textContent = "Amount must be greater than zero.";
      if (Number(data.amount) > 1000000) return err.textContent = "UPI limit exceeded: amount must be ₹10,00,000 or less.";
      const panel = $("resultPanel");
      const msgs = ["Validating UPI IDs…", "Extracting features…", "Comparing with your history…", "Scoring risk…"];
      panel.innerHTML = `<div class="scan-anim"><div class="ring-load"></div><div class="scan-steps" id="scanMsg">${msgs[0]}</div></div>`;
      let i = 0; const iv = setInterval(() => { i++; const m = document.getElementById("scanMsg"); if (m && msgs[i]) m.textContent = msgs[i]; }, 300);
      setTimeout(() => {
        clearInterval(iv);
        const tx = Store.addTx(u.id, data);
        App.refreshNav();
        panel.innerHTML = Pages.detect.result(tx);
        App.animateGauge(tx.score);
        if (tx.classification === "fraud") App.toast("Potential fraud detected. An alert was added to your notifications.", "error");
        else if (tx.classification === "suspicious") App.toast("Suspicious transaction flagged for review.");
        else App.toast("Transaction screened: Safe.", "success");
      }, 1300);
    };
  },
  result(tx) {
    const color = scoreColor(tx.score);
    return `
      <div class="card-head"><div class="card-title">Risk analysis</div><span class="small muted mono">${esc(tx.id.slice(2, 12).toUpperCase())}</span></div>
      <div class="gauge-wrap">
        <div class="gauge"><svg viewBox="0 0 120 120"><circle cx="60" cy="60" r="52" fill="none" stroke="#262626" stroke-width="9"/>
          <circle id="gArc" cx="60" cy="60" r="52" fill="none" stroke="${color}" stroke-width="9" stroke-linecap="round" stroke-dasharray="326.7" stroke-dashoffset="326.7" style="transition:stroke-dashoffset 1.1s ease;filter:drop-shadow(0 0 6px ${color})"/></svg>
          <div class="center"><div><div class="score" id="gNum" style="color:${color}">0</div><div class="of">/ 100</div></div></div></div>
        <div style="flex:1;min-width:200px">
          ${pill(tx.classification)}
          <div class="verdict" style="margin:12px 0 6px;color:${color}">${esc(tx.label)}</div>
          <div class="small muted">${inr(tx.amount)} → <span class="mono">${esc(tx.receiver)}</span><br>${esc(tx.location)} · ${fmtDT(tx.date, tx.time)} · Confidence ${tx.confidence}%</div>
        </div>
      </div>
      <div class="advice">${esc(tx.advice)}</div>
      <div style="margin-top:26px" class="eyebrow muted">INDICATORS BEHIND THIS SCORE</div>
      <div class="indicators">${tx.factors.length ? tx.factors.map(f => `
        <div class="ind"><div>${esc(f.title)}<small>${esc(f.detail)}</small></div><div class="bar"><i style="width:${Math.min(100, f.pts * 3.3)}%"></i></div><div class="pts">+${f.pts}</div></div>`).join("")
        : `<div class="ind"><div>No risk indicators triggered<small>Amount, timing, receiver and location all look normal.</small></div><div class="bar"><i style="width:4%"></i></div><div class="pts">+0</div></div>`}</div>
      <div style="display:flex;gap:12px;margin-top:28px;flex-wrap:wrap">
        <a href="#/history" class="btn btn-outline btn-sm">View in history ${I.arrow}</a>
        <a href="#/dashboard" class="btn btn-outline btn-sm">Open dashboard ${I.arrow}</a>
      </div>`;
  },
};

/* ---------------- DASHBOARD ---------------- */
Pages.dashboard = {
  title: "Dashboard", auth: true,
  html: (u) => {
    const tx = Store.txFor(u.id);
    const c = (k) => tx.filter(t => t.classification === k).length;
    const avg = tx.length ? Math.round(tx.reduce((s, t) => s + t.score, 0) / tx.length) : 0;
    const vol = tx.reduce((s, t) => s + Number(t.amount), 0);
    const flagged = tx.filter(t => t.classification !== "safe").slice(0, 6);
    return `
  <div class="container">
    <div class="page-head page-enter"><div class="row"><div><span class="eyebrow">DASHBOARD</span><h1 class="h2">Hello, ${esc(u.name.split(" ")[0])}.</h1>
      <p class="muted">Here’s how your payments look across the last 14 days.</p></div>
      <a href="#/detect" class="btn btn-gold">New check ${I.arrow}</a></div></div>
    <div class="page-body">
      <div class="grid g-5">
        <div class="card stat"><div class="label">Total screened ${I.scan}</div><div class="value" data-count="${tx.length}">0</div><div class="delta">${inr(vol)} volume</div></div>
        <div class="card stat safe"><div class="label">Safe ${I.check}</div><div class="value" data-count="${c("safe")}">0</div><div class="delta">${tx.length ? Math.round(c("safe") / tx.length * 100) : 0}% of payments</div></div>
        <div class="card stat warn"><div class="label">Suspicious ${I.alert}</div><div class="value" data-count="${c("suspicious")}">0</div><div class="delta">Needs verification</div></div>
        <div class="card stat danger"><div class="label">Potential fraud ${I.shieldSm}</div><div class="value" data-count="${c("fraud")}">0</div><div class="delta">Do not pay</div></div>
        <div class="card stat"><div class="label">Avg. risk ${I.pulse}</div><div class="value" data-count="${avg}">0</div><div class="delta">out of 100</div></div>
      </div>
      <div class="grid g-2-1" style="margin-top:20px">
        <div class="card"><div class="card-head"><div class="card-title">Daily activity & risk</div>
          <div class="legend"><span><i style="background:#3a3a3a"></i>Safe</span><span><i style="background:var(--warn)"></i>Suspicious</span><span><i style="background:var(--danger)"></i>Fraud</span><span><i style="background:var(--gold);height:2px"></i>Avg score</span></div></div>
          <div class="chart-box"><canvas id="cTrend"></canvas></div></div>
        <div class="card"><div class="card-head"><div class="card-title">Classification split</div></div>
          <div class="chart-box sm"><canvas id="cSplit"></canvas></div></div>
      </div>
      <div class="grid g-2" style="margin-top:20px">
        <div class="card"><div class="card-head"><div class="card-title">Top risk indicators</div></div><div class="chart-box sm"><canvas id="cFactors"></canvas></div></div>
        <div class="card"><div class="card-head"><div class="card-title">Fraud alerts</div><a href="#/notifications" class="link-arrow">All alerts ${I.arrow}</a></div>
          <div class="alert-list">${flagged.length ? flagged.map(t => `
            <div class="alert-item"><div class="alert-ic ${t.classification}">${t.classification === "fraud" ? I.shieldSm : I.alert}</div>
              <div><div class="t">${inr(t.amount)} → <span class="mono">${esc(t.receiver)}</span></div><div class="s">${esc(t.factors[0]?.title || "")} · ${fmtDT(t.date, t.time)}</div></div>
              <div>${scoreBar(t.score)}</div></div>`).join("") : `<p class="muted small">No alerts. All your payments look safe.</p>`}</div></div>
      </div>
      <div class="card" style="margin-top:20px"><div class="card-head"><div class="card-title">Recent transactions</div><a href="#/history" class="link-arrow">Full history ${I.arrow}</a></div>
        ${Pages.history.table(tx.slice(0, 6), false)}</div>
    </div>
  </div>`;
  },
  mount(u) {
    App.countUp();
    const tx = Store.txFor(u.id);
    App.charts.trend("cTrend", tx); App.charts.split("cSplit", tx); App.charts.factors("cFactors", tx);
    App.bindTxRows();
  },
};

/* ---------------- HISTORY ---------------- */
Pages.history = {
  title: "Transaction History", auth: true,
  html: (u) => `
  <div class="container">
    <div class="page-head page-enter"><div class="row"><div><span class="eyebrow">TRANSACTION HISTORY</span><h1 class="h2">Every check, on record.</h1>
      <p class="muted">Search, filter, inspect and export your screened transactions.</p></div>
      <button class="btn btn-outline" id="exportCsv">${I.download} Export CSV</button></div></div>
    <div class="page-body">
      <div class="toolbar">
        <input class="input grow" id="hSearch" placeholder="Search receiver, location or ID…">
        <select class="input" id="hClass"><option value="">All classifications</option><option value="safe">Safe</option><option value="suspicious">Suspicious</option><option value="fraud">Potential Fraud</option></select>
        <select class="input" id="hSort"><option value="new">Newest first</option><option value="old">Oldest first</option><option value="risk">Highest risk</option><option value="amt">Highest amount</option></select>
      </div>
      <div id="hTable"></div>
      <p class="small muted" id="hCount" style="margin-top:12px"></p>
    </div>
  </div>`,
  table(rows, actions = true) {
    return `<div class="table-wrap"><table><thead><tr><th>Date & time</th><th>Receiver</th><th>Amount</th><th>Location</th><th>Risk</th><th>Result</th>${actions ? "<th></th>" : ""}</tr></thead><tbody>
      ${rows.length ? rows.map(t => `<tr>
        <td>${fmtDT(t.date, t.time)}</td><td class="mono">${esc(t.receiver)}</td><td>${inr(t.amount)}</td><td>${esc(t.location)}</td>
        <td>${scoreBar(t.score)}</td><td>${pill(t.classification)}</td>
        ${actions ? `<td style="text-align:right"><button class="icon-btn" title="View details" data-view="${t.id}">${I.eye}</button> <button class="icon-btn del" title="Delete" data-del="${t.id}">${I.trash}</button></td>` : ""}
      </tr>`).join("") : `<tr><td colspan="7" class="empty-row">No transactions match.</td></tr>`}
    </tbody></table></div>`;
  },
  mount(u) {
    const $ = (id) => document.getElementById(id);
    const draw = () => {
      const q = $("hSearch").value.toLowerCase(), cls = $("hClass").value, sort = $("hSort").value;
      let rows = Store.txFor(u.id).filter(t => (!cls || t.classification === cls) && (!q || [t.receiver, t.location, t.id, t.sender].join(" ").toLowerCase().includes(q)));
      if (sort === "old") rows.reverse();
      if (sort === "risk") rows.sort((a, b) => b.score - a.score);
      if (sort === "amt") rows.sort((a, b) => b.amount - a.amount);
      $("hTable").innerHTML = Pages.history.table(rows);
      $("hCount").textContent = `${rows.length} transaction${rows.length === 1 ? "" : "s"}`;
      App.bindTxRows(draw);
      Pages.history._rows = rows;
    };
    ["hSearch", "hClass", "hSort"].forEach(id => $(id).addEventListener("input", draw));
    $("exportCsv").onclick = () => App.exportCsv(Pages.history._rows || [], "upi-sentinel-history.csv");
    draw();
  },
};

/* ---------------- NOTIFICATIONS ---------------- */
Pages.notifications = {
  title: "Notifications", auth: true,
  html: () => `
  <div class="container container-narrow">
    <div class="page-head page-enter"><div class="row"><div><span class="eyebrow">NOTIFICATIONS</span><h1 class="h2">Alerts that need your eyes.</h1>
      <p class="muted">Suspicious and fraudulent verdicts land here automatically.</p></div>
      <button class="btn btn-outline" id="markAll">Mark all as read</button></div></div>
    <div class="page-body">
      <div class="tabs" id="nTabs" style="margin-bottom:22px"><button class="tab active" data-f="all">All</button><button class="tab" data-f="unread">Unread</button><button class="tab" data-f="fraud">Fraud</button><button class="tab" data-f="suspicious">Suspicious</button></div>
      <div id="nList" class="grid" style="gap:12px"></div>
    </div>
  </div>`,
  mount(u) {
    let filter = "all";
    const draw = () => {
      let list = Store.notifFor(u.id);
      if (filter === "unread") list = list.filter(n => !n.read);
      else if (filter !== "all") list = list.filter(n => n.type === filter);
      document.getElementById("nList").innerHTML = list.length ? list.map(n => `
        <div class="notif ${n.read ? "" : "unread"}">
          <div class="alert-ic ${n.type}">${n.type === "fraud" ? I.shieldSm : n.type === "suspicious" ? I.alert : I.info}</div>
          <div><div class="t">${esc(n.title)}</div><div class="s">${esc(n.body)}</div><div class="time">${ago(n.created)}</div></div>
          <div class="notif-actions">
            ${n.txId ? `<button class="icon-btn" title="View transaction" data-view="${n.txId}">${I.eye}</button>` : ""}
            <button class="btn btn-outline btn-sm" data-toggle="${n.id}">${n.read ? "Mark unread" : "Mark read"}</button>
            <button class="icon-btn del" title="Dismiss" data-ndel="${n.id}">${I.trash}</button>
          </div></div>`).join("") : `<div class="card result-empty" style="min-height:240px">${I.bell}<p>You’re all caught up.</p></div>`;
      document.querySelectorAll("[data-toggle]").forEach(b => b.onclick = () => {
        const n = Store.notifFor(u.id).find(x => x.id === b.dataset.toggle); Store.markRead(n.id, !n.read); App.refreshNav(); draw();
      });
      document.querySelectorAll("[data-ndel]").forEach(b => b.onclick = () => { Store.deleteNotif(b.dataset.ndel); App.refreshNav(); draw(); App.toast("Notification dismissed."); });
      App.bindTxRows(draw);
    };
    document.querySelectorAll("#nTabs .tab").forEach(b => b.onclick = () => {
      document.querySelectorAll("#nTabs .tab").forEach(x => x.classList.remove("active")); b.classList.add("active"); filter = b.dataset.f; draw();
    });
    document.getElementById("markAll").onclick = () => { Store.markAllRead(u.id); App.refreshNav(); draw(); App.toast("All notifications marked as read.", "success"); };
    draw();
  },
};

/* ---------------- ADMIN ---------------- */
Pages.admin = {
  title: "Admin Panel", auth: true, admin: true,
  html: () => {
    const users = Store.users(), tx = Store.allTx(), msgs = Store.messages();
    const c = (k) => tx.filter(t => t.classification === k).length;
    return `
  <div class="container">
    <div class="page-head page-enter"><div class="row"><div><span class="eyebrow">ADMIN PANEL</span><h1 class="h2">System overview</h1>
      <p class="muted">Monitor users, flagged activity and support requests across UPI Sentinel.</p></div>
      <div style="display:flex;gap:10px;flex-wrap:wrap"><button class="btn btn-outline" id="admExport">${I.download} Export all</button><button class="btn btn-danger" id="admReset">Reset demo data</button></div></div></div>
    <div class="page-body">
      <div class="grid g-5">
        <div class="card stat"><div class="label">Users ${I.users}</div><div class="value" data-count="${users.length}">0</div><div class="delta">${users.filter(x => x.status === "blocked").length} suspended</div></div>
        <div class="card stat"><div class="label">Transactions ${I.scan}</div><div class="value" data-count="${tx.length}">0</div><div class="delta">${inr(tx.reduce((s, t) => s + Number(t.amount), 0))}</div></div>
        <div class="card stat warn"><div class="label">Suspicious ${I.alert}</div><div class="value" data-count="${c("suspicious")}">0</div><div class="delta">System-wide</div></div>
        <div class="card stat danger"><div class="label">Fraud ${I.shieldSm}</div><div class="value" data-count="${c("fraud")}">0</div><div class="delta">${tx.length ? (c("fraud") / tx.length * 100).toFixed(1) : 0}% fraud rate</div></div>
        <div class="card stat"><div class="label">Open tickets ${I.mail}</div><div class="value" data-count="${msgs.filter(m => m.status === "open").length}">0</div><div class="delta">${msgs.length} total</div></div>
      </div>
      <div class="grid g-2-1" style="margin-top:20px">
        <div class="card"><div class="card-head"><div class="card-title">Platform risk trend</div></div><div class="chart-box"><canvas id="aTrend"></canvas></div></div>
        <div class="card"><div class="card-head"><div class="card-title">Fraud by location</div></div><div class="chart-box"><canvas id="aLoc"></canvas></div></div>
      </div>
      <div class="tabs" id="aTabs" style="margin:34px 0 18px"><button class="tab active" data-t="users">Users</button><button class="tab" data-t="flagged">Flagged transactions</button><button class="tab" data-t="msgs">Support messages</button></div>
      <div id="aPane"></div>
    </div>
  </div>`;
  },
  mount(me) {
    App.countUp();
    const tx = Store.allTx();
    App.charts.trend("aTrend", tx); App.charts.locations("aLoc", tx);
    let tab = "users";
    const draw = () => {
      const pane = document.getElementById("aPane");
      if (tab === "users") {
        const users = Store.users();
        pane.innerHTML = `<div class="table-wrap"><table><thead><tr><th>Name</th><th>Email</th><th>UPI ID</th><th>Role</th><th>Checks</th><th>Flagged</th><th>Status</th><th></th></tr></thead><tbody>
          ${users.map(x => { const t = Store.txFor(x.id); return `<tr><td><b>${esc(x.name)}</b></td><td>${esc(x.email)}</td><td class="mono">${esc(x.upi)}</td>
            <td>${x.role === "admin" ? '<span class="pill neutral" style="color:var(--gold)">Admin</span>' : '<span class="pill neutral">User</span>'}</td>
            <td>${t.length}</td><td>${t.filter(z => z.classification !== "safe").length}</td>
            <td>${x.status === "active" ? '<span class="pill safe">Active</span>' : '<span class="pill fraud">Suspended</span>'}</td>
            <td style="text-align:right">${x.id === me.id ? '<span class="small muted">You</span>' : `<button class="btn btn-outline btn-sm" data-block="${x.id}">${x.status === "active" ? "Suspend" : "Restore"}</button> <button class="icon-btn del" title="Delete user" data-udel="${x.id}">${I.trash}</button>`}</td></tr>`; }).join("")}
          </tbody></table></div>`;
        pane.querySelectorAll("[data-block]").forEach(b => b.onclick = () => {
          const x = Store.users().find(z => z.id === b.dataset.block);
          Store.updateUser(x.id, { status: x.status === "active" ? "blocked" : "active" });
          App.toast(`${x.name} ${x.status === "active" ? "suspended" : "restored"}.`); draw();
        });
        pane.querySelectorAll("[data-udel]").forEach(b => b.onclick = () => {
          const x = Store.users().find(z => z.id === b.dataset.udel);
          App.confirm(`Delete ${x.name}?`, "This removes the user and all of their transactions and alerts from the demo database.", "Delete user", () => { Store.deleteUser(x.id); App.toast("User deleted."); App.render(); });
        });
      } else if (tab === "flagged") {
        const rows = Store.allTx().filter(t => t.classification !== "safe");
        const users = Object.fromEntries(Store.users().map(x => [x.id, x.name]));
        pane.innerHTML = `<div class="table-wrap"><table><thead><tr><th>User</th><th>Date & time</th><th>Receiver</th><th>Amount</th><th>Location</th><th>Risk</th><th>Result</th><th>Review</th><th></th></tr></thead><tbody>
          ${rows.map(t => `<tr><td>${esc(users[t.userId] || "—")}</td><td>${fmtDT(t.date, t.time)}</td><td class="mono">${esc(t.receiver)}</td><td>${inr(t.amount)}</td><td>${esc(t.location)}</td><td>${scoreBar(t.score)}</td><td>${pill(t.classification)}</td>
            <td><select class="input" style="padding:6px 30px 6px 10px;font-size:12.5px;min-width:130px" data-review="${t.id}">${["Pending", "Confirmed fraud", "False positive", "Escalated"].map(s => `<option ${t.review === s ? "selected" : ""}>${s}</option>`).join("")}</select></td>
            <td><button class="icon-btn" data-view="${t.id}">${I.eye}</button></td></tr>`).join("")}</tbody></table></div>`;
        pane.querySelectorAll("[data-review]").forEach(s => s.onchange = () => { Store.updateTx(s.dataset.review, { review: s.value }); App.toast(`Review status set to “${s.value}”.`, "success"); });
        App.bindTxRows(draw);
      } else {
        const msgs = Store.messages();
        pane.innerHTML = msgs.length ? `<div class="grid" style="gap:12px">${msgs.map(m => `
          <div class="notif ${m.status === "open" ? "unread" : ""}"><div class="alert-ic info">${I.mail}</div>
            <div><div class="t">${esc(m.subject)}</div><div class="s">${esc(m.message)}</div><div class="time">${esc(m.name)} · ${esc(m.email)} · ${ago(m.created)}</div></div>
            <div class="notif-actions"><button class="btn btn-outline btn-sm" data-msg="${m.id}">${m.status === "open" ? "Mark resolved" : "Reopen"}</button></div></div>`).join("")}</div>`
          : `<div class="card result-empty" style="min-height:200px">${I.mail}<p>No messages yet.</p></div>`;
        pane.querySelectorAll("[data-msg]").forEach(b => b.onclick = () => {
          const m = Store.messages().find(x => x.id === b.dataset.msg); Store.updateMessage(m.id, { status: m.status === "open" ? "resolved" : "open" }); draw();
        });
      }
    };
    document.querySelectorAll("#aTabs .tab").forEach(b => b.onclick = () => {
      document.querySelectorAll("#aTabs .tab").forEach(x => x.classList.remove("active")); b.classList.add("active"); tab = b.dataset.t; draw();
    });
    document.getElementById("admExport").onclick = () => App.exportCsv(Store.allTx(), "upi-sentinel-all-transactions.csv");
    document.getElementById("admReset").onclick = () => App.confirm("Reset demo data?", "All accounts, transactions, alerts and messages return to the original demo set. You will be signed out.", "Reset", () => { Store.resetDemo(); App.toast("Demo data restored."); location.hash = "#/login"; App.render(); });
    draw();
  },
};

/* ---------------- CONTACT ---------------- */
Pages.contact = {
  title: "Contact",
  html: (u) => `
  <div class="container container-narrow">
    <div class="page-head page-enter"><span class="eyebrow">CONTACT</span><h1 class="h2">Spotted something odd?<br>Tell us.</h1>
      <p class="lead">Questions about a payment, the project, or a suspected scam — send a message and the admin team will review it.</p></div>
    <div class="page-body">
      <div class="grid g-1-1-2" style="align-items:start">
        <div>
          <div class="card">
            <div class="contact-item"><div class="icon-box">${I.phone}</div><div><div class="k">NATIONAL CYBER CRIME HELPLINE</div><div class="v">1930</div></div></div>
            <div class="contact-item"><div class="icon-box">${I.shieldSm}</div><div><div class="k">REPORT ONLINE</div><div class="v">cybercrime.gov.in</div></div></div>
            <div class="contact-item"><div class="icon-box">${I.mail}</div><div><div class="k">PROJECT TEAM</div><div class="v">support@upisentinel.test</div></div></div>
            <div class="contact-item"><div class="icon-box">${I.pin}</div><div><div class="k">DEPARTMENT</div><div class="v">Cybersecurity &amp; Digital Forensics</div></div></div>
          </div>
          <div class="faq" style="margin-top:26px">
            <details><summary>Does Sentinel stop the payment?</summary><p>No. Sentinel is an advisory checkpoint. You run a check before paying; your bank or UPI app still processes the payment.</p></details>
            <details><summary>Will you ever ask for my UPI PIN?</summary><p>Never. No legitimate service needs your PIN to send you money. Anyone asking for it is attempting fraud.</p></details>
            <details><summary>How is the risk score calculated?</summary><p>The score combines amount, timing, receiver patterns, location and payment velocity. Every contributing indicator is shown with the result.</p></details>
          </div>
        </div>
        <form class="card" id="contactForm" novalidate>
          <div class="card-head"><div class="card-title">Send a message</div></div>
          <div class="form-grid">
            <div class="field"><label for="cn">Name</label><input class="input" id="cn" value="${u ? esc(u.name) : ""}" required></div>
            <div class="field"><label for="ce">Email</label><input class="input" id="ce" type="email" value="${u ? esc(u.email) : ""}" required></div>
            <div class="field full"><label for="cs">Topic</label><select class="input" id="cs"><option>Report a suspected scam</option><option>Question about a risk score</option><option>Account &amp; login help</option><option>Project enquiry</option></select></div>
            <div class="field full"><label for="cm">Message</label><textarea class="input" id="cm" placeholder="Describe what happened…" required></textarea></div>
          </div>
          <div class="err" id="cErr" style="margin-top:12px"></div>
          <button class="btn btn-gold btn-block" type="submit" style="margin-top:6px">Send message ${I.arrow}</button>
        </form>
      </div>
    </div>
  </div>`,
  mount() {
    document.getElementById("contactForm").onsubmit = (ev) => {
      ev.preventDefault();
      const v = (id) => document.getElementById(id).value.trim();
      const err = document.getElementById("cErr");
      if (!v("cn") || !v("ce") || !v("cm")) return err.textContent = "Please fill in your name, email and message.";
      if (!/^\S+@\S+\.\S+$/.test(v("ce"))) return err.textContent = "Enter a valid email address.";
      Store.addMessage({ name: v("cn"), email: v("ce"), subject: v("cs"), message: v("cm") });
      err.textContent = ""; document.getElementById("cm").value = "";
      App.toast("Message sent. The admin team will review it shortly.", "success");
    };
  },
};
