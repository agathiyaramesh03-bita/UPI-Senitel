/* =========================================================
   UPI Sentinel — Risk engine (prototype)
   Explainable, feature-weighted scoring that mirrors the
   features the Random Forest model will use in the Flask
   backend phase. Every point added is shown to the user.
   ========================================================= */
const Engine = (() => {
  const HIGH_RISK_LOCATIONS = ["jamtara", "deoghar", "nuh", "mewat", "bharatpur", "alwar", "mathura", "overseas", "unknown", "vpn / proxy"];
  const SCAM_WORDS = /(refund|lottery|prize|reward|kyc|cashback|winner|lucky|helpdesk|support|offer|gift|claim|bonus|verify|customercare|care)/i;
  const UPI_RE = /^[a-z0-9._-]{2,256}@[a-z]{2,64}$/i;

  const classify = (score) =>
    score >= 70 ? { key: "fraud", label: "Potential Fraud" } :
    score >= 35 ? { key: "suspicious", label: "Suspicious" } :
                  { key: "safe", label: "Safe" };

  function mode(arr) {
    const c = {}; let best = null, n = 0;
    arr.forEach(v => { c[v] = (c[v] || 0) + 1; if (c[v] > n) { n = c[v]; best = v; } });
    return best;
  }

  /**
   * @param tx { sender, receiver, amount, date:'YYYY-MM-DD', time:'HH:MM', location }
   * @param history previous transactions of the same user (array)
   */
  function analyze(tx, history = []) {
    const factors = [];
    const add = (pts, title, detail) => factors.push({ pts, title, detail });

    const amount = Number(tx.amount) || 0;
    const hour = parseInt((tx.time || "12:00").split(":")[0], 10);
    const sender = (tx.sender || "").trim().toLowerCase();
    const receiver = (tx.receiver || "").trim().toLowerCase();
    const loc = (tx.location || "").trim().toLowerCase();
    const past = history.filter(h => h.id !== tx.id);

    // 1. Amount
    if (amount >= 100000) add(30, "Very high transfer amount", "₹1,00,000+ is above the typical UPI daily pattern.");
    else if (amount >= 50000) add(22, "High transfer amount", "Large transfers are a common target for social-engineering scams.");
    else if (amount >= 20000) add(12, "Elevated amount", "Amount is in the upper range for personal UPI payments.");
    else if (amount >= 10000) add(6, "Moderate amount", "Slightly above everyday spending.");

    if (amount >= 5000 && amount % 1000 === 0) add(5, "Round-figure amount", "Scam requests often ask for exact round sums.");

    // 2. Behaviour vs history
    if (past.length >= 3) {
      const avg = past.reduce((s, h) => s + Number(h.amount), 0) / past.length;
      if (amount > avg * 5 && amount > 5000) add(12, "Far above your usual spend", `About ${Math.round(amount / avg)}× your average of ₹${Math.round(avg).toLocaleString("en-IN")}.`);
    }

    // 3. Time of day
    if (hour >= 0 && hour < 5) add(18, "Late-night transaction", "Payments between 12 AM and 5 AM carry higher fraud rates.");
    else if (hour === 23 || hour === 5) add(8, "Off-hours transaction", "Outside common daytime activity.");

    // 4. Receiver checks
    if (!UPI_RE.test(receiver)) add(15, "Receiver UPI ID looks malformed", "Expected format: name@bank.");
    if (SCAM_WORDS.test(receiver)) add(25, "Scam keyword in receiver ID", "Words like ‘refund’, ‘kyc’, ‘prize’ are classic impersonation signals.");
    if (/\d{7,}/.test(receiver.split("@")[0] || "")) add(8, "Number-heavy receiver handle", "Long digit strings often indicate throwaway accounts.");
    if (receiver && sender && receiver === sender) add(10, "Sender and receiver are identical", "Self-transfer on the same ID is unusual.");
    if (past.length && !past.some(h => (h.receiver || "").toLowerCase() === receiver)) add(10, "First-time receiver", "You have never paid this UPI ID before.");

    // 5. Location
    if (HIGH_RISK_LOCATIONS.some(l => loc.includes(l))) add(20, "High-risk location", "This region is flagged in public cyber-crime advisories.");
    else if (past.length >= 3) {
      const usual = mode(past.map(h => (h.location || "").toLowerCase()));
      if (usual && loc && loc !== usual) add(8, "Unusual location", `Most of your payments are from ${usual.replace(/\b\w/g, c => c.toUpperCase())}.`);
    }

    // 6. Velocity (same day, within 60 minutes)
    if (tx.date) {
      const t = new Date(`${tx.date}T${tx.time || "12:00"}`).getTime();
      const burst = past.filter(h => Math.abs(new Date(`${h.date}T${h.time}`).getTime() - t) <= 3600000).length;
      if (burst >= 3) add(12, "Rapid burst of payments", `${burst} other payments within an hour.`);
      else if (burst === 2) add(5, "Several payments close together", "Multiple payments within an hour.");
    }

    const base = 4;
    const raw = base + factors.reduce((s, f) => s + f.pts, 0);
    const score = Math.max(0, Math.min(100, raw));
    const cls = classify(score);
    factors.sort((a, b) => b.pts - a.pts);

    const advice = {
      safe: "No strong warning signs. Still confirm the receiver’s name in your UPI app before paying.",
      suspicious: "Pause and verify. Call the receiver on a number you already know — never one sent in a message.",
      fraud: "Do not proceed. Never share your UPI PIN or OTP. Report at cybercrime.gov.in or call 1930.",
    }[cls.key];

    const confidence = Math.min(99, 72 + Math.round(Math.abs(score - 50) / 2));
    return { score, classification: cls.key, label: cls.label, factors, advice, confidence };
  }

  return { analyze, classify, HIGH_RISK_LOCATIONS };
})();
