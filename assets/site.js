// sulkudata.com v4: real price lines, the window-length chart, the mobile menu and the copy button.
(function () {
  // Washington Capitals – New York Rangers, NHL, 9 October 2026, one sportsbook in our sample.
  // pts: [from, to, sportsbook price, fair price] (epoch s). The window opened 17:46 UTC and was fixed 18:58 UTC; puck drop 23:15 UTC.
  const K = { alkaa: 1791587700, ikkuna: [1791567969, 1791572287], sulku: 2.946, pts: [[1791565806, 1791567729, 3.1, 3.143], [1791567728, 1791567969, 3.15, 3.143], [1791567969, 1791568209, 3.15, 2.979], [1791568207, 1791570731, 3.1, 2.979], [1791570731, 1791572287, 3.1, 3.0], [1791572287, 1791572527, 3.0, 3.0], [1791572527, 1791573488, 3.0, 2.998], [1791573488, 1791575224, 3.0, 3.02], [1791575224, 1791580744, 3.0, 3.003], [1791580685, 1791581645, 2.9, 3.003], [1791581584, 1791584884, 2.85, 3.003], [1791584824, 1791585185, 2.8, 3.003], [1791585125, 1791585185, 2.85, 3.003], [1791585185, 1791585192, 2.8, 2.921], [1791585185, 1791585845, 2.85, 2.921], [1791585785, 1791586085, 2.8, 2.921], [1791586085, 1791587104, 2.8, 2.941], [1791587104, 1791587405, 2.8, 2.946]] };
  const NOW = K.ikkuna[0] + 54 * 60;            // the console's "now": the window has been open for 54 minutes
  // windows by sport, 37 sportsbook sites, 6 Sep – 9 Nov 2026
  const DUR = [["Football", 5300], ["Ice hockey", 1801], ["Basketball", 552], ["American football", 108], ["Other", 80]];
  const utc = new Intl.DateTimeFormat("en-GB", { timeZone: "UTC", hour: "2-digit", minute: "2-digit", hour12: false });
  const F = 'font-family="Schibsted Grotesk, Arial"';
  let pid = 0;
  const width = el => Math.round(el.getBoundingClientRect().width);

  // the window as a price line. mode: "console" (Night, up to NOW, open bracket) or "lake" (page openings, the whole story)
  function line(svg, mode) {
    const W = width(svg); if (!W) return;
    const con = mode === "console";
    const H = con ? (W < 420 ? 190 : 220) : (W < 500 ? 120 : 150);
    const T = con ? 46 : 40, B = con ? 28 : 6;
    const ink = con ? "#e9ebe7" : "#ffffff", soft = con ? "#8f978f" : "#a3b6ca", rule = con ? "#2a2e33" : "#2d4e70", red = "#ff5a3c";
    const t0 = K.pts[0][0], t1 = con ? NOW : K.alkaa, lo = con ? 2.9 : 2.75, hi = con ? 3.2 : 3.22;
    const x = t => (Math.min(t, t1) - t0) / (t1 - t0) * W, y = o => T + (hi - o) / (hi - lo) * (H - T - B);
    const step = k => K.pts.filter(p => p[0] < t1).map((p, i) => `${i ? "L" : "M"}${x(p[0]).toFixed(1)} ${y(p[k]).toFixed(1)}H${x(p[1]).toFixed(1)}`).join("");
    const id = "h" + pid++;
    let s = `<defs><pattern id="${id}" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><line x1="0" y1="0" x2="0" y2="6" stroke="${red}" stroke-width="1.3"/></pattern></defs>`;
    if (con) {
      [3.0, 3.15].forEach(o => { s += `<line x1="0" x2="${W}" y1="${y(o)}" y2="${y(o)}" stroke="${rule}"/><text x="${W}" y="${y(o) - 6}" text-anchor="end" font-size="11" fill="${soft}" ${F}>${o.toFixed(2)}</text>`; });
      [1791567000, 1791568800, 1791570600].forEach(t => { if (t > t0 && t < t1) s += `<text x="${x(t)}" y="${H - 8}" text-anchor="middle" font-size="11" fill="${soft}" ${F}>${utc.format(t * 1000)}</text>`; });
    }
    const end = con ? NOW : K.ikkuna[1];
    let r = "";
    K.pts.forEach(p => { const a = Math.max(p[0], K.ikkuna[0]), b = Math.min(p[1], end, t1); if (b > a && p[2] > p[3]) r += `<rect x="${x(a)}" y="${y(p[2])}" width="${x(b) - x(a)}" height="${y(p[3]) - y(p[2])}"/>`; });
    s += `<g fill="url(#${id})" opacity=".85">${r}</g>`;
    s += `<path d="${step(3)}" fill="none" stroke="${soft}" stroke-width="1.5" stroke-dasharray="4 4"/>`;
    s += `<path d="${step(2)}" fill="none" stroke="${ink}" stroke-width="2.25"/>`;
    const a = x(K.ikkuna[0]), b = x(end) - (con ? 1 : 0), by = T - (con ? 20 : 18), lg = con ? 10 : 9;
    s += con ? `<path d="M${a} ${by + lg}V${by}H${b}" fill="none" stroke="${red}" stroke-width="2.5"/>`
             : `<path d="M${a} ${by + lg}V${by}H${b}V${by + lg}" fill="none" stroke="${red}" stroke-width="2.5"/>`;
    s += `<text x="${a}" y="${by - 8}" font-size="${con ? 13 : 13}" font-weight="600" fill="${red}" ${F}>${con ? "Open 54 min" : "Open 72 min, 6.9 % edge"}</text>`;
    if (con) s += `<line x1="${W - 1}" x2="${W - 1}" y1="${T - 6}" y2="${H - B}" stroke="${soft}" stroke-dasharray="2 3"/>`;
    svg.setAttribute("viewBox", `0 0 ${W} ${H}`); svg.setAttribute("height", H); svg.innerHTML = s;
  }

  // the whole Rangers window on a light ground, from before it opened to puck drop, with the moments marked
  function anatomy(svg) {
    const W = width(svg); if (!W) return;
    const H = W < 600 ? 260 : 320, T = 64, B = 34, L = 0, ink = "#111316", soft = "#737b75", rule = "#dde6ef", red = "#d1391d";
    const t0 = K.pts[0][0], t1 = K.alkaa + 600, lo = 2.7, hi = 3.25;
    const x = t => L + (Math.min(t, t1) - t0) / (t1 - t0) * (W - L), y = o => T + (hi - o) / (hi - lo) * (H - T - B);
    const step = k => K.pts.map((p, i) => `${i ? "L" : "M"}${x(p[0]).toFixed(1)} ${y(p[k]).toFixed(1)}H${x(p[1]).toFixed(1)}`).join("");
    const id = "h" + pid++;
    let s = `<defs><pattern id="${id}" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><line x1="0" y1="0" x2="0" y2="6" stroke="${red}" stroke-width="1.3"/></pattern></defs>`;
    [2.8, 3.0, 3.15].forEach(o => { s += `<line x1="0" x2="${W}" y1="${y(o)}" y2="${y(o)}" stroke="${rule}"/><text x="${W}" y="${y(o) - 6}" text-anchor="end" font-size="12" fill="${soft}" ${F}>${o.toFixed(2)}</text>`; });
    const ticks = W < 600 ? [1791568800, 1791583200] : [1791568800, 1791576000, 1791583200];
    ticks.forEach(t => { s += `<text x="${x(t)}" y="${H - 10}" text-anchor="middle" font-size="12" fill="${soft}" ${F}>${utc.format(t * 1000)} UTC</text>`; });
    let r = "";
    K.pts.forEach(p => { const a = Math.max(p[0], K.ikkuna[0]), b = Math.min(p[1], K.ikkuna[1]); if (b > a && p[2] > p[3]) r += `<rect x="${x(a)}" y="${y(p[2])}" width="${x(b) - x(a)}" height="${y(p[3]) - y(p[2])}"/>`; });
    s += `<g fill="url(#${id})">${r}</g>`;
    s += `<path d="${step(3)}" fill="none" stroke="${soft}" stroke-width="1.5" stroke-dasharray="4 4"/>`;
    s += `<path d="${step(2)}" fill="none" stroke="${ink}" stroke-width="2.5"/>`;
    const a = x(K.ikkuna[0]), b = x(K.ikkuna[1]), by = T - 24;
    s += `<path d="M${a} ${by + 12}V${by}H${b}V${by + 12}" fill="none" stroke="${red}" stroke-width="3"/>`;
    s += `<text x="${a}" y="${by - 8}" font-size="${W < 600 ? 13 : 15}" font-weight="600" fill="${red}" ${F}>Open 72 min</text>`;
    [[K.ikkuna[0], red, ""], [K.ikkuna[1], ink, "2 3"], [K.alkaa, ink, "2 3"]].forEach(([t, c, d]) => { const xx = x(t); s += `<line x1="${xx}" x2="${xx}" y1="${T - 4}" y2="${H - B + 4}" stroke="${c}" stroke-width="1" ${d ? `stroke-dasharray="${d}"` : ""}/>`; });
    s += `<circle cx="${x(K.alkaa)}" cy="${y(K.sulku)}" r="4" fill="${ink}"/><text x="${x(K.alkaa) - 8}" y="${y(K.sulku) - 10}" text-anchor="end" font-size="12" fill="${ink}" ${F}>Fair at puck drop 2.95</text>`;
    svg.setAttribute("viewBox", `0 0 ${W} ${H}`); svg.setAttribute("height", H); svg.innerHTML = s;
  }

  // how long the windows stayed open, as bars (Night)
  function durations(svg) {
    const W = width(svg); if (!W) return;
    const rowH = 40, L = W < 400 ? 118 : 132, R = 56, H = DUR.length * rowH, max = Math.max(...DUR.map(d => d[1])), n = DUR.reduce((a, d) => a + d[1], 0);
    let s = "";
    DUR.forEach(([lab, v], i) => {
      const y0 = i * rowH, w = (W - L - R) * v / max;
      s += `<text x="0" y="${y0 + 24}" font-size="13" fill="#8f978f" ${F}>${lab}</text>`;
      s += `<rect x="${L}" y="${y0 + 9}" width="${w.toFixed(1)}" height="20" fill="${i ? "#5c6670" : "#e9ebe7"}"/>`;
      s += `<text x="${L + w + 8}" y="${y0 + 24}" font-size="13" font-weight="600" fill="#e9ebe7" ${F}>${Math.round(100 * v / n)} %</text>`;
    });
    svg.setAttribute("viewBox", `0 0 ${W} ${H}`); svg.setAttribute("height", H); svg.innerHTML = s;
  }

  const draw = () => {
    document.querySelectorAll("svg[data-line]").forEach(el => line(el, el.dataset.line));
    document.querySelectorAll("svg[data-dur]").forEach(durations);
    document.querySelectorAll("svg[data-anatomy]").forEach(anatomy);
  };
  draw();
  let tm; addEventListener("resize", () => { clearTimeout(tm); tm = setTimeout(draw, 120); });
  if (document.fonts) document.fonts.ready.then(draw);

  // mobile menu
  const head = document.querySelector(".site-head"), mb = document.querySelector(".menu-btn");
  if (head && mb) mb.addEventListener("click", () => { const o = head.classList.toggle("open"); mb.setAttribute("aria-expanded", o); mb.textContent = o ? "Close" : "Menu"; });

  // copy the address
  const btn = document.getElementById("copy"), msg = document.getElementById("copied"), addr = document.getElementById("addr");
  if (btn && addr) btn.addEventListener("click", () => {
    const sel = () => { const rg = document.createRange(); rg.selectNodeContents(addr); const g = getSelection(); g.removeAllRanges(); g.addRange(rg); msg.textContent = "Address selected. Press Ctrl+C to copy."; };
    try { navigator.clipboard.writeText(addr.textContent.trim()).then(() => { msg.textContent = "Copied."; }, sel); } catch (e) { sel(); }
  });
})();
