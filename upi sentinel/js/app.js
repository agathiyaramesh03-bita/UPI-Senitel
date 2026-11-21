/* =========================================================
   UPI Sentinel — App shell: router, nav, UI utilities, charts
   ========================================================= */
const App = (() => {
  const appEl = document.getElementById("app");
  const charts = [];
  let redirect = null;

  /* ---------- Navigation ---------- */
  const NAV = [["home", "Home"], ["about", "About"], ["features", "Features"], ["detect", "Fraud Detection"], ["dashboard", "Dashboard"], ["history", "History"], ["contact", "Contact"]];

  function refreshNav() {
    const u = Store.session();
    const route = currentRoute();
    const links = [...NAV];
    if (u && u.role === "admin") links.splice(6, 0, ["admin", "Admin"]);
    document.getElementById("navLinks").innerHTML = links.map(([r, l]) => `<li><a href="#/${r}" class="${route === r ? "active" : ""}">${l}</a></li>`).join("");
    const unread = u ? Store.notifFor(u.id).filter(n => !n.read).length : 0;
    document.getElementById("navActions").innerHTML = u ? `
      <a href="#/notifications" class="bell" title="Notifications">${I.bell}${unread ? `<span class="badge">${unread > 99 ? "99+" : unread}</span>` : ""}</a>
      <div class="user-chip" id="userChip" role="button" tabindex="0" aria-haspopup="true"><span class="avatar">${esc(u.name[0] || "U")}</span><span class="user-name">${esc(u.name.split(" ")[0])}</span>
        <div class="dropdown" id="userMenu">
          <div style="padding:10px 12px"><div style="font-weight:700">${esc(u.name)}</div><div class="small muted">${esc(u.email)}</div></div><div class="sep"></div>
          <a href="#/dashboard">Dashboard</a><a href="#/history">Transaction history</a><a href="#/notifications">Notifications</a>
          ${u.role === "admin" ? '<a href="#/admin">Admin panel</a>' : ""}<div class="sep"></div>
          <button id="logoutBtn">Log out</button>
        </div></div>
      <button class="menu-toggle" id="menuToggle" aria-label="Menu">${I.menu}</button>` : `
      <a href="#/login" class="login-link">Log in</a>
      <a href="#/register" class="btn btn-gold">Get started ${I.arrow}</a>
      <button class="menu-toggle" id="menuToggle" aria-label="Menu">${I.menu}</button>`;

    document.getElementById("menuToggle").onclick = () => document.getElementById("navLinks").classList.toggle("open");
    const chip = document.getElementById("userChip");
    if (chip) {
      chip.onclick = (e) => { e.stopPropagation(); document.getElementById("userMenu").classList.toggle("open"); };
      document.getElementById("logoutBtn").onclick = (e) => {
        e.stopPropagation(); Store.logout(); toast("You have been logged out."); location.hash = "#/home"; render();
      };
    }
  }
  document.addEventListener("click", () => document.getElementById("userMenu")?.classList.remove("open"));

  /* ---------- Router ---------- */
  const currentRoute = () => (location.hash.replace(/^#\/?/, "").split("?")[0] || "home");

  function render() {
    let route = currentRoute();
    if (!Pages[route]) route = "home";
    const page = Pages[route];
    const u = Store.session();

    if (page.auth && !u) {
      redirect = "#/" + route;
      toast("Please log in to continue.");
      location.replace("#/login"); return;
    }
    if (page.admin && u.role !== "admin") {
      toast("Admin access only.", "error"); location.replace("#/dashboard"); return;
    }
    if ((route === "login" || route === "register") && u) { location.replace("#/dashboard"); return; }

    charts.splice(0).forEach(c => c.destroy());
    document.title = `${page.title} · UPI Sentinel`;
    appEl.innerHTML = page.html(u);
    refreshNav();
    document.getElementById("navLinks").classList.remove("open");
    window.scrollTo({ top: 0, behavior: "instant" });
    page.mount && page.mount(u);
    observeReveal();
    appEl.querySelectorAll("[data-scroll]").forEach(a => a.onclick = (e) => {
      e.preventDefault(); document.getElementById(a.dataset.scroll)?.scrollIntoView({ behavior: "smooth" });
    });
  }
  window.addEventListener("hashchange", render);

  const consumeRedirect = () => { const r = redirect; redirect = null; return r; };

  /* ---------- UI utilities ---------- */
  function toast(msg, type = "") {
    const el = document.createElement("div");
    el.className = `toast ${type}`; el.textContent = msg;
    document.getElementById("toasts").appendChild(el);
    setTimeout(() => { el.style.transition = "opacity .3s"; el.style.opacity = "0"; setTimeout(() => el.remove(), 300); }, 3200);
  }

  function modal(html) {
    const bg = document.createElement("div");
    bg.className = "modal-bg"; bg.innerHTML = `<div class="modal" role="dialog" aria-modal="true">${html}</div>`;
    bg.onclick = (e) => { if (e.target === bg) bg.remove(); };
    document.body.appendChild(bg);
    const onKey = (e) => { if (e.key === "Escape") { bg.remove(); document.removeEventListener("keydown", onKey); } };
    document.addEventListener("keydown", onKey);
    bg.querySelectorAll("[data-close]").forEach(b => b.onclick = () => bg.remove());
    return bg;
  }

  function confirm(title, body, okLabel, onOk) {
    const m = modal(`<h3>${esc(title)}</h3><p class="muted" style="margin-top:8px">${esc(body)}</p>
      <div style="display:flex;gap:10px;justify-content:flex-end;margin-top:26px"><button class="btn btn-outline btn-sm" data-close>Cancel</button><button class="btn btn-danger btn-sm" id="okBtn">${esc(okLabel)}</button></div>`);
    m.querySelector("#okBtn").onclick = () => { m.remove(); onOk(); };
  }

  function showTx(id) {
    const t = Store.allTx().find(x => x.id === id);
    if (!t) return toast("That transaction no longer exists.", "error");
    modal(`<div style="display:flex;justify-content:space-between;align-items:start;gap:10px"><div><span class="eyebrow">TRANSACTION DETAIL</span><h3 style="margin-top:10px">${inr(t.amount)}</h3></div>${pill(t.classification)}</div>
      <dl class="kv"><dt>Risk score</dt><dd>${scoreBar(t.score)}</dd><dt>Sender</dt><dd class="mono">${esc(t.sender)}</dd><dt>Receiver</dt><dd class="mono">${esc(t.receiver)}</dd>
        <dt>Date & time</dt><dd>${fmtDT(t.date, t.time)}</dd><dt>Location</dt><dd>${esc(t.location)}</dd>${t.note ? `<dt>Note</dt><dd>${esc(t.note)}</dd>` : ""}${t.review ? `<dt>Admin review</dt><dd>${esc(t.review)}</dd>` : ""}<dt>Reference</dt><dd class="mono">${esc(t.id.toUpperCase())}</dd></dl>
      <div class="eyebrow muted" style="margin-top:24px">INDICATORS</div>
      <div class="indicators" style="margin-top:14px">${t.factors.length ? t.factors.map(f => `<div class="ind"><div>${esc(f.title)}<small>${esc(f.detail)}</small></div><div class="bar"><i style="width:${Math.min(100, f.pts * 3.3)}%"></i></div><div class="pts">+${f.pts}</div></div>`).join("") : '<p class="muted small">No risk indicators triggered.</p>'}</div>
      <div class="advice">${esc(t.advice)}</div>
      <div style="display:flex;justify-content:flex-end;margin-top:24px"><button class="btn btn-outline btn-sm" data-close>Close</button></div>`);
  }

  function bindTxRows(after) {
    appEl.querySelectorAll("[data-view]").forEach(b => b.onclick = () => showTx(b.dataset.view));
    appEl.querySelectorAll("[data-del]").forEach(b => b.onclick = () =>
      confirm("Delete this transaction?", "It will be removed from your history, dashboard and statistics.", "Delete", () => {
        Store.deleteTx(b.dataset.del); toast("Transaction deleted."); after ? after() : render();
      }));
  }

  function exportCsv(rows, name) {
    if (!rows.length) return toast("Nothing to export.", "error");
    const cols = ["id", "date", "time", "sender", "receiver", "amount", "location", "score", "label", "review"];
    const q = (v) => `"${String(v ?? "").replace(/"/g, '""')}"`;
    const csv = [cols.join(","), ...rows.map(r => cols.map(c => q(r[c])).join(","))].join("\n");
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([csv], { type: "text/csv" })); a.download = name; a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
    toast(`Exported ${rows.length} rows.`, "success");
  }

  function countUp() {
    appEl.querySelectorAll("[data-count]").forEach(el => {
      const end = Number(el.dataset.count); const t0 = performance.now();
      const step = (t) => { const p = Math.min(1, (t - t0) / 900); el.textContent = Math.round(end * (1 - Math.pow(1 - p, 3))); if (p < 1) requestAnimationFrame(step); };
      requestAnimationFrame(step);
    });
  }

  function animateGauge(score) {
    requestAnimationFrame(() => {
      const arc = document.getElementById("gArc"); if (arc) arc.style.strokeDashoffset = 326.7 * (1 - score / 100);
      const num = document.getElementById("gNum"); const t0 = performance.now();
      const step = (t) => { const p = Math.min(1, (t - t0) / 1100); if (num) num.textContent = Math.round(score * (1 - Math.pow(1 - p, 3))); if (p < 1) requestAnimationFrame(step); };
      requestAnimationFrame(step);
    });
  }

  function observeReveal() {
    const els = appEl.querySelectorAll(".reveal");
    if (!("IntersectionObserver" in window)) return els.forEach(e => e.classList.add("in"));
    const io = new IntersectionObserver((entries) => entries.forEach(en => { if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); } }), { threshold: .12 });
    els.forEach(e => io.observe(e));
  }

  /* ---------- Charts ---------- */
  const C = { gold: "#e9b863", safe: "#5fd38a", warn: "#f5a524", danger: "#f0544f", grid: "rgba(255,255,255,.05)", text: "#9a958c", neutral: "#3a3a3a" };
  const hasChart = () => typeof Chart !== "undefined";
  if (hasChart()) {
    Chart.defaults.color = C.text;
    Chart.defaults.font.family = "Manrope, sans-serif";
    Chart.defaults.font.size = 11.5;
    Chart.defaults.plugins.tooltip.backgroundColor = "#1f1f1f";
    Chart.defaults.plugins.tooltip.borderColor = "#333";
    Chart.defaults.plugins.tooltip.borderWidth = 1;
    Chart.defaults.plugins.tooltip.padding = 10;
  }
  function mk(id, cfg) {
    const el = document.getElementById(id);
    if (!el) return;
    if (!hasChart()) { el.parentElement.innerHTML = '<p class="muted small">Charts need an internet connection to load Chart.js.</p>'; return; }
    charts.push(new Chart(el, cfg));
  }
  const axes = (stacked) => ({
    x: { stacked, grid: { display: false }, border: { color: "#2a2a2a" } },
    y: { stacked, grid: { color: C.grid }, border: { display: false }, beginAtZero: true, ticks: { precision: 0 } },
  });

  const chartApi = {
    trend(id, tx) {
      const days = [...Array(14)].map((_, i) => { const d = new Date(); d.setDate(d.getDate() - 13 + i); return Store.ymd(d); });
      const by = (d, k) => tx.filter(t => t.date === d && t.classification === k).length;
      const avg = days.map(d => { const a = tx.filter(t => t.date === d); return a.length ? Math.round(a.reduce((s, t) => s + t.score, 0) / a.length) : null; });
      mk(id, {
        data: {
          labels: days.map(d => new Date(d + "T00:00").toLocaleDateString("en-IN", { day: "2-digit", month: "short" })),
          datasets: [
            { type: "bar", label: "Safe", data: days.map(d => by(d, "safe")), backgroundColor: C.neutral, borderRadius: 3, stack: "s" },
            { type: "bar", label: "Suspicious", data: days.map(d => by(d, "suspicious")), backgroundColor: C.warn, borderRadius: 3, stack: "s" },
            { type: "bar", label: "Fraud", data: days.map(d => by(d, "fraud")), backgroundColor: C.danger, borderRadius: 3, stack: "s" },
            { type: "line", label: "Avg risk score", data: avg, yAxisID: "y2", borderColor: C.gold, backgroundColor: C.gold, tension: .35, pointRadius: 3, spanGaps: true, borderWidth: 2 },
          ],
        },
        options: {
          maintainAspectRatio: false, interaction: { mode: "index", intersect: false }, plugins: { legend: { display: false } },
          scales: { ...axes(true), y2: { position: "right", min: 0, max: 100, grid: { display: false }, border: { display: false } } },
        },
      });
    },
    split(id, tx) {
      const c = (k) => tx.filter(t => t.classification === k).length;
      mk(id, {
        type: "doughnut",
        data: { labels: ["Safe", "Suspicious", "Potential Fraud"], datasets: [{ data: [c("safe"), c("suspicious"), c("fraud")], backgroundColor: [C.safe, C.warn, C.danger], borderColor: "#161616", borderWidth: 3, hoverOffset: 6 }] },
        options: { maintainAspectRatio: false, cutout: "70%", plugins: { legend: { position: "bottom", labels: { boxWidth: 10, padding: 16 } } } },
      });
    },
    factors(id, tx) {
      const m = {};
      tx.forEach(t => t.factors.forEach(f => m[f.title] = (m[f.title] || 0) + 1));
      const top = Object.entries(m).sort((a, b) => b[1] - a[1]).slice(0, 6);
      mk(id, {
        type: "bar",
        data: { labels: top.map(x => x[0]), datasets: [{ label: "Times triggered", data: top.map(x => x[1]), backgroundColor: C.gold, borderRadius: 3, barThickness: 14 }] },
        options: { indexAxis: "y", maintainAspectRatio: false, plugins: { legend: { display: false } },
          scales: { x: { grid: { color: C.grid }, border: { display: false }, ticks: { precision: 0 } }, y: { grid: { display: false }, border: { color: "#2a2a2a" } } } },
      });
    },
    locations(id, tx) {
      const m = {};
      tx.filter(t => t.classification !== "safe").forEach(t => m[t.location] = (m[t.location] || 0) + 1);
      const top = Object.entries(m).sort((a, b) => b[1] - a[1]).slice(0, 7);
      mk(id, {
        type: "bar",
        data: { labels: top.map(x => x[0]), datasets: [{ label: "Flagged", data: top.map(x => x[1]), backgroundColor: top.map((_, i) => i === 0 ? C.danger : C.gold), borderRadius: 3, barThickness: 16 }] },
        options: { indexAxis: "y", maintainAspectRatio: false, plugins: { legend: { display: false } },
          scales: { x: { grid: { color: C.grid }, border: { display: false }, ticks: { precision: 0 } }, y: { grid: { display: false } } } },
      });
    },
  };

  return { render, refreshNav, toast, confirm, countUp, animateGauge, bindTxRows, exportCsv, consumeRedirect, charts: chartApi };
})();

App.render();
