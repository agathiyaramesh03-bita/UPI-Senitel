/* =========================================================
   UPI Sentinel — Data store (prototype)
   Browser storage stands in for the MySQL tables:
   users, transactions, notifications, messages.
   ========================================================= */
const Store = (() => {
  const PREFIX = "upisentinel.v3.";
  const mem = {};
  const read = (k, d) => {
    try { const v = localStorage.getItem(PREFIX + k); return v ? JSON.parse(v) : d; }
    catch { return k in mem ? mem[k] : d; }
  };
  const write = (k, v) => {
    mem[k] = v;
    try { localStorage.setItem(PREFIX + k, JSON.stringify(v)); } catch { /* memory fallback */ }
  };
  const uid = (p) => p + Date.now().toString(36) + Math.random().toString(36).slice(2, 7);

  // Prototype-only password hashing (backend phase uses werkzeug/bcrypt)
  function hash(pw, salt) {
    let h1 = 0xdeadbeef ^ salt.length, h2 = 0x41c6ce57;
    const s = salt + ":" + pw;
    for (let i = 0; i < s.length; i++) {
      const c = s.charCodeAt(i);
      h1 = Math.imul(h1 ^ c, 2654435761); h2 = Math.imul(h2 ^ c, 1597334677);
    }
    h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
    h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);
    return (h2 >>> 0).toString(16).padStart(8, "0") + (h1 >>> 0).toString(16).padStart(8, "0");
  }

  const pad = (n) => String(n).padStart(2, "0");
  const ymd = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

  /* ---------- Seed demo data ---------- */
  function seed() {
    if (read("seeded", false)) return;
    const mk = (name, email, pw, role, upi, city) => {
      const salt = Math.random().toString(36).slice(2, 10);
      return { id: uid("u_"), name, email, salt, pw: hash(pw, salt), role, upi, city, status: "active", created: new Date().toISOString() };
    };
    const users = [
      mk("Demo User", "demo@sentinel.test", "demo1234", "user", "demo.user@okaxis", "Chennai"),
      mk("Sentinel Admin", "admin@sentinel.test", "admin1234", "admin", "admin@oksbi", "Bengaluru"),
      mk("Priya Raman", "priya@sentinel.test", "priya1234", "user", "priya.r@okicici", "Coimbatore"),
      mk("Arjun Mehta", "arjun@sentinel.test", "arjun1234", "user", "arjun.m@ybl", "Mumbai"),
      mk("Rahul Sharma", "showcase@sentinel.test", "Sentinel@2026", "user", "rahul.sharma@okhdfc", "Chennai"),
    ];
    write("users", users);

    // Deterministic pseudo-random for repeatable demo
    let s = 42; const rnd = () => (s = (s * 16807) % 2147483647) / 2147483647;
    const pick = (a) => a[Math.floor(rnd() * a.length)];
    const normalRx = ["swiggy@icici", "zomato@hdfc", "amma.home@okaxis", "bigbasket@ybl", "ravi.kumar@okhdfc", "electricity.tneb@sbi", "jio.recharge@paytm", "meena.s@oksbi", "rent.owner@okicici", "irctc@hdfcbank"];
    const fraudRx = ["kyc.update.helpdesk@ybl", "refund.claim9876543@paytm", "lucky.winner2026@okaxis", "cashback.reward@ibl", "customercare.support@ybl"];
    const cities = ["Chennai", "Chennai", "Chennai", "Coimbatore", "Bengaluru"];
    const riskyCities = ["Jamtara", "Overseas", "Deoghar", "Unknown"];

    const txs = [], notes = [];
    const today = new Date();
    users.filter(u => u.role === "user").forEach((u, ui) => {
      const hist = [];
      const showcase = u.email === "showcase@sentinel.test";
      const count = showcase ? 140 : ui === 0 ? 34 : 14;
      // oldest first, so each check is scored against the history before it
      const offsets = [...Array(count)].map(() => Math.floor(rnd() * 14)).sort((a, b) => b - a);
      for (let i = 0; i < count; i++) {
        const d = new Date(today); d.setDate(d.getDate() - offsets[i]);
        const bad = rnd() < 0.13, mid = !bad && rnd() < 0.24;
        const tx = {
          id: uid("t_"), userId: u.id, sender: u.upi,
          receiver: bad ? pick(fraudRx) : pick(normalRx),
          amount: bad ? pick([25000, 49999, 75000, 120000, 15000]) : mid ? Math.round(15000 + rnd() * 30000) : Math.round(80 + rnd() * 4200),
          date: ymd(d),
          time: `${pad(bad ? Math.floor(rnd() * 5) : mid ? pick([22, 23, 5, 21]) : 8 + Math.floor(rnd() * 14))}:${pad(Math.floor(rnd() * 60))}`,
          location: bad && rnd() < .7 ? pick(riskyCities) : mid ? "Hyderabad" : (ui === 0 ? pick(cities) : u.city),
          note: "",
        };
        Object.assign(tx, Engine.analyze(tx, hist));
        tx.created = new Date(`${tx.date}T${tx.time}`).toISOString();
        if (showcase && tx.classification !== "safe" && i < count - 15) tx.review = pick(["Confirmed fraud", "False positive", "Escalated", "Pending"]);
        if (showcase && rnd() < .15) tx.note = pick(["Paid for groceries", "Caller said my KYC expired", "Rent for this month", "SMS promised cashback", "Friend asked for urgent help"]);
        hist.push(tx); txs.push(tx);
        if (tx.classification !== "safe") notes.push(noteFor(tx, (ui === 0 || showcase) && i > count - (showcase ? 12 : 6)));
      }
      if (showcase) notes.push({ id: uid("n_"), userId: u.id, type: "info", title: "Weekly security summary", body: "Sentinel reviewed your payments this week. Open the dashboard to see your risk trend.", read: false, created: new Date(today - 36e5 * 5).toISOString() },
        { id: uid("n_"), userId: u.id, type: "info", title: "Welcome to UPI Sentinel", body: "Your account is protected. Run your first check from the Fraud Detection page.", read: true, created: new Date(today - 864e5 * 14).toISOString() });
    });
    notes.push({ id: uid("n_"), userId: users[0].id, type: "info", title: "Welcome to UPI Sentinel", body: "Your account is protected. Run your first check from the Fraud Detection page.", read: true, created: new Date(today - 864e5 * 14).toISOString() });
    write("transactions", txs);
    write("notifications", notes);
    write("messages", [
      { id: uid("m_"), name: "Karthik", email: "karthik@example.com", subject: "Got a 'KYC expired' SMS", message: "Received a link asking me to update KYC via UPI collect request. Is this a scam?", created: new Date(today - 864e5 * 2).toISOString(), status: "open" },
      { id: uid("m_"), name: "Rahul Sharma", email: "showcase@sentinel.test", subject: "Question about a risk score", message: "A payment to my landlord was marked suspicious because it was late at night. Can I whitelist this receiver?", created: new Date(today - 864e5).toISOString(), status: "open" },
      { id: uid("m_"), name: "Divya", email: "divya@example.com", subject: "Report a suspected scam", message: "Someone sent me a collect request from 'lucky.winner2026@okaxis' saying I won a prize.", created: new Date(today - 864e5 * 4).toISOString(), status: "resolved" },
    ]);
    write("seeded", true);
  }

  function noteFor(tx, unread = true) {
    const fraud = tx.classification === "fraud";
    return {
      id: uid("n_"), userId: tx.userId, txId: tx.id, type: tx.classification,
      title: fraud ? "Potential fraud blocked for review" : "Suspicious payment flagged",
      body: `₹${Number(tx.amount).toLocaleString("en-IN")} to ${tx.receiver} scored ${tx.score}/100. ${tx.factors[0] ? tx.factors[0].title + "." : ""}`,
      read: !unread, created: tx.created || new Date().toISOString(),
    };
  }

  /* ---------- Auth ---------- */
  const session = () => {
    const id = read("session", null);
    return id ? read("users", []).find(u => u.id === id) || null : null;
  };
  function login(email, pw) {
    const u = read("users", []).find(x => x.email.toLowerCase() === email.trim().toLowerCase());
    if (!u || u.pw !== hash(pw, u.salt)) throw new Error("Incorrect email or password.");
    if (u.status === "blocked") throw new Error("This account has been suspended by an administrator.");
    write("session", u.id);
    return u;
  }
  function register({ name, email, pw, upi, city }) {
    const users = read("users", []);
    if (users.some(x => x.email.toLowerCase() === email.trim().toLowerCase())) throw new Error("An account with this email already exists.");
    const salt = Math.random().toString(36).slice(2, 10);
    const u = { id: uid("u_"), name: name.trim(), email: email.trim(), salt, pw: hash(pw, salt), role: "user", upi: upi.trim().toLowerCase(), city: city.trim(), status: "active", created: new Date().toISOString() };
    users.push(u); write("users", users); write("session", u.id);
    addNotification({ userId: u.id, type: "info", title: "Welcome to UPI Sentinel", body: "Your account is ready. Check your first transaction to start building your risk profile." });
    return u;
  }
  const logout = () => write("session", null);

  /* ---------- Data ---------- */
  const users = () => read("users", []);
  function updateUser(id, patch) {
    const all = users().map(u => u.id === id ? { ...u, ...patch } : u); write("users", all);
  }
  function deleteUser(id) {
    write("users", users().filter(u => u.id !== id));
    write("transactions", read("transactions", []).filter(t => t.userId !== id));
    write("notifications", read("notifications", []).filter(n => n.userId !== id));
  }
  const allTx = () => read("transactions", []).sort((a, b) => b.created.localeCompare(a.created));
  const txFor = (userId) => allTx().filter(t => t.userId === userId);
  function addTx(userId, input) {
    const history = txFor(userId);
    const tx = { id: uid("t_"), userId, ...input, amount: Number(input.amount), created: new Date(`${input.date}T${input.time}`).toISOString() };
    Object.assign(tx, Engine.analyze(tx, history));
    tx.analyzedAt = new Date().toISOString();
    const all = read("transactions", []); all.push(tx); write("transactions", all);
    if (tx.classification !== "safe") { const n = noteFor(tx); n.created = new Date().toISOString(); addNotification(n); }
    return tx;
  }
  const deleteTx = (id) => write("transactions", read("transactions", []).filter(t => t.id !== id));
  function updateTx(id, patch) { write("transactions", read("transactions", []).map(t => t.id === id ? { ...t, ...patch } : t)); }

  const notifFor = (userId) => read("notifications", []).filter(n => n.userId === userId).sort((a, b) => b.created.localeCompare(a.created));
  function addNotification(n) {
    const all = read("notifications", []);
    all.push({ id: uid("n_"), read: false, created: new Date().toISOString(), ...n });
    write("notifications", all);
  }
  function markRead(id, val = true) { write("notifications", read("notifications", []).map(n => n.id === id ? { ...n, read: val } : n)); }
  function markAllRead(userId) { write("notifications", read("notifications", []).map(n => n.userId === userId ? { ...n, read: true } : n)); }
  const deleteNotif = (id) => write("notifications", read("notifications", []).filter(n => n.id !== id));

  const messages = () => read("messages", []).sort((a, b) => b.created.localeCompare(a.created));
  function addMessage(m) { const all = read("messages", []); all.push({ id: uid("m_"), status: "open", created: new Date().toISOString(), ...m }); write("messages", all); }
  function updateMessage(id, patch) { write("messages", read("messages", []).map(m => m.id === id ? { ...m, ...patch } : m)); }

  function resetDemo() {
    ["users", "transactions", "notifications", "messages", "seeded", "session"].forEach(k => {
      delete mem[k]; try { localStorage.removeItem(PREFIX + k); } catch {}
    });
    seed();
  }

  seed();
  return { session, login, register, logout, users, updateUser, deleteUser, allTx, txFor, addTx, deleteTx, updateTx,
           notifFor, markRead, markAllRead, deleteNotif, messages, addMessage, updateMessage, resetDemo, ymd };
})();
