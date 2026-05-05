export default function Home() {
  return null
}

export async function getServerSideProps({ res }) {
  res.setHeader('Content-Type', 'text/html')
  res.setHeader('Cache-Control', 'public, s-maxage=3600')
  res.end(getHTML())
  return { props: {} }
}

function getHTML() {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>DownRange — Precision Ballistics Calculator</title>
<meta name="description" content="Precision ballistics calculator with bullet database, trajectory calculator, and wind calls for long range shooters.">
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=Source+Serif+4:wght@300;400;600&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
<style>
:root{--bark:#2c2416;--soil:#3d3020;--sage:#7a8c6e;--wheat:#c4a96b;--amber:#d4883a;--cream:#f2ead8;--fog:#b8ae9c;--stone:#6b6358;--bg:#1a1510;--card:#231e16;--border:rgba(196,169,107,0.15);--border-bright:rgba(196,169,107,0.35)}
*{margin:0;padding:0;box-sizing:border-box}
body{background:var(--bg);color:var(--cream);font-family:'Source Serif 4',serif;font-size:15px;line-height:1.6;min-height:100vh}
nav{position:sticky;top:0;z-index:100;background:rgba(26,21,16,0.95);backdrop-filter:blur(12px);border-bottom:1px solid var(--border);padding:0 32px;display:flex;align-items:center;justify-content:space-between;height:60px}
.nav-brand{display:flex;align-items:center;gap:12px}
.nav-logo{width:36px;height:36px;background:var(--wheat);border-radius:4px;display:flex;align-items:center;justify-content:center}
.nav-title{font-family:'Playfair Display',serif;font-size:20px;font-weight:900;color:var(--cream)}
.nav-sub{font-family:'JetBrains Mono',monospace;font-size:9px;color:var(--sage);letter-spacing:0.15em;text-transform:uppercase}
.nav-tabs{display:flex;gap:4px}
.nav-tab{padding:6px 16px;background:none;border:none;cursor:pointer;font-family:'JetBrains Mono',monospace;font-size:10px;letter-spacing:0.1em;text-transform:uppercase;color:var(--stone);border-radius:4px;transition:all 0.2s}
.nav-tab.active,.nav-tab:hover{color:var(--wheat);background:rgba(196,169,107,0.08)}
.nav-tab.active{border-bottom:2px solid var(--wheat);border-radius:4px 4px 0 0}
.app{max-width:1200px;margin:0 auto;padding:32px 24px}
.panel{display:none}.panel.active{display:block}
.calc-grid{display:grid;grid-template-columns:340px 1fr;gap:24px;align-items:start}
.section-title{font-family:'JetBrains Mono',monospace;font-size:11px;font-weight:700;color:var(--wheat);letter-spacing:0.15em;text-transform:uppercase;margin-bottom:16px;padding-bottom:8px;border-bottom:1px solid var(--border);display:flex;align-items:center;gap:8px}
.section-title::before{content:'';width:3px;height:14px;background:var(--amber);border-radius:2px}
.card{background:var(--card);border:1px solid var(--border);border-radius:8px;padding:20px;margin-bottom:16px}
.field-group{display:flex;flex-direction:column;gap:12px}
.field{display:flex;flex-direction:column;gap:4px}
.field label{font-family:'JetBrains Mono',monospace;font-size:10px;letter-spacing:0.1em;text-transform:uppercase;color:var(--stone)}
.field input,.field select{background:rgba(0,0,0,0.3);border:1px solid var(--border);border-radius:5px;padding:8px 12px;color:var(--cream);font-family:'JetBrains Mono',monospace;font-size:13px;outline:none;transition:border-color 0.2s;width:100%}
.field input:focus,.field select:focus{border-color:var(--border-bright)}
.field select option{background:var(--bark)}
.field-row{display:grid;grid-template-columns:1fr 1fr;gap:10px}
.btn-calc{width:100%;padding:13px;background:var(--wheat);color:var(--bark);border:none;border-radius:6px;font-family:'Playfair Display',serif;font-size:14px;font-weight:700;cursor:pointer;transition:all 0.2s;margin-top:8px}
.btn-calc:hover{background:var(--amber);transform:translateY(-1px)}
.range-card-table{width:100%;border-collapse:collapse;font-family:'JetBrains Mono',monospace;font-size:12px}
.range-card-table th{background:rgba(196,169,107,0.08);color:var(--wheat);font-size:9px;letter-spacing:0.12em;text-transform:uppercase;padding:10px 12px;text-align:right;border-bottom:1px solid var(--border)}
.range-card-table th:first-child{text-align:left}
.range-card-table td{padding:9px 12px;text-align:right;border-bottom:1px solid rgba(196,169,107,0.06);color:var(--fog)}
.range-card-table td:first-child{text-align:left;color:var(--cream);font-weight:500}
.range-card-table tr:hover td{background:rgba(196,169,107,0.04)}
.range-card-table td.neg{color:#c97b7b}.range-card-table td.pos{color:var(--sage)}.range-card-table td.zero{color:var(--wheat);font-weight:500}
.stat-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin-bottom:20px}
.stat-box{background:rgba(0,0,0,0.2);border:1px solid var(--border);border-radius:6px;padding:14px;text-align:center}
.stat-val{font-family:'Playfair Display',serif;font-size:22px;font-weight:700;color:var(--wheat);line-height:1;margin-bottom:4px}
.stat-label{font-family:'JetBrains Mono',monospace;font-size:9px;letter-spacing:0.1em;text-transform:uppercase;color:var(--stone)}
.db-header{display:flex;align-items:center;gap:16px;margin-bottom:16px;flex-wrap:wrap}
.db-search{flex:1;min-width:200px;background:rgba(0,0,0,0.3);border:1px solid var(--border);border-radius:6px;padding:10px 16px;color:var(--cream);font-family:'JetBrains Mono',monospace;font-size:13px;outline:none}
.filter-row{display:flex;gap:8px;flex-wrap:wrap}
.filter-btn{padding:6px 14px;background:none;border:1px solid var(--border);border-radius:20px;color:var(--stone);font-family:'JetBrains Mono',monospace;font-size:10px;cursor:pointer;transition:all 0.2s;text-transform:uppercase}
.filter-btn.active,.filter-btn:hover{border-color:var(--wheat);color:var(--wheat);background:rgba(196,169,107,0.08)}
.bullet-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:14px}
.bullet-card{background:var(--card);border:1px solid var(--border);border-radius:8px;padding:16px;transition:all 0.2s}
.bullet-card:hover{border-color:var(--border-bright);transform:translateY(-2px)}
.bullet-mfr{font-family:'JetBrains Mono',monospace;font-size:9px;letter-spacing:0.15em;text-transform:uppercase;color:var(--amber);margin-bottom:4px}
.bullet-name{font-family:'Playfair Display',serif;font-size:15px;font-weight:700;color:var(--cream);margin-bottom:8px;line-height:1.3}
.bullet-specs{display:flex;gap:10px;flex-wrap:wrap}
.spec-tag{font-family:'JetBrains Mono',monospace;font-size:10px;padding:2px 8px;background:rgba(196,169,107,0.07);border:1px solid var(--border);border-radius:3px;color:var(--fog)}
.spec-tag.bc{color:var(--sage);border-color:rgba(122,140,110,0.3)}
.use-bullet-btn{margin-top:10px;padding:6px 14px;background:none;border:1px solid var(--border-bright);border-radius:4px;color:var(--wheat);font-family:'JetBrains Mono',monospace;font-size:10px;text-transform:uppercase;cursor:pointer;transition:all 0.2s}
.use-bullet-btn:hover{background:rgba(196,169,107,0.1)}
.wind-grid{display:grid;grid-template-columns:1fr 1fr;gap:20px}
.wind-result{background:rgba(0,0,0,0.3);border:1px solid var(--border);border-radius:8px;padding:20px;text-align:center}
.wind-val{font-family:'Playfair Display',serif;font-size:48px;font-weight:900;color:var(--wheat);line-height:1}
.wind-unit{font-family:'JetBrains Mono',monospace;font-size:11px;color:var(--stone);letter-spacing:0.1em;text-transform:uppercase;margin-top:4px}
.clock-face{width:160px;height:160px;border:2px solid var(--border-bright);border-radius:50%;margin:0 auto;position:relative;display:flex;align-items:center;justify-content:center}
.clock-labels{position:absolute;inset:0}
.clock-label{position:absolute;font-family:'JetBrains Mono',monospace;font-size:11px;color:var(--stone);transform:translate(-50%,-50%)}
.wind-arrow{width:3px;height:55px;background:var(--amber);border-radius:2px;position:absolute;bottom:50%;left:50%;transform-origin:bottom center;transform:translateX(-50%) rotate(0deg);transition:transform 0.5s ease}
.empty-state{text-align:center;padding:60px 20px;color:var(--stone)}
.empty-state svg{width:48px;height:48px;opacity:0.3;margin-bottom:16px}
.empty-title{font-family:'Playfair Display',serif;font-size:18px;color:var(--fog);margin-bottom:8px}
::-webkit-scrollbar{width:5px}::-webkit-scrollbar-track{background:var(--bg)}::-webkit-scrollbar-thumb{background:var(--soil);border-radius:3px}
@media(max-width:768px){.calc-grid{grid-template-columns:1fr}.stat-grid{grid-template-columns:repeat(2,1fr)}.wind-grid{grid-template-columns:1fr}nav{padding:0 16px}.nav-tabs{display:none}}
</style>
</head>
<body>
<nav>
  <div class="nav-brand">
    <div class="nav-logo">
      <svg viewBox="0 0 20 20" fill="none" style="width:20px;height:20px">
        <path d="M10 2L10 18M2 10H18M4 4L16 16M16 4L4 16" stroke="#2c2416" stroke-width="1.5" stroke-linecap="round"/>
      </svg>
    </div>
    <div>
      <div class="nav-title">DownRange</div>
      <div class="nav-sub">Precision Ballistics</div>
    </div>
  </div>
  <div class="nav-tabs">
    <button class="nav-tab active" onclick="showPanel('calculator')">Calculator</button>
    <button class="nav-tab" onclick="showPanel('database')">Bullet Database</button>
    <button class="nav-tab" onclick="showPanel('wind')">Wind Calls</button>
  </div>
</nav>

<div class="app">
  <div id="panel-calculator" class="panel active">
    <div class="calc-grid">
      <div>
        <div class="card">
          <div class="section-title">Bullet</div>
          <div class="field-group">
            <div class="field"><label>Bullet / Load</label><select id="bullet-select" onchange="loadBullet()"><option value="">— Select from database —</option></select></div>
            <div class="field-row">
              <div class="field"><label>Diameter (in)</label><input type="number" id="diameter" value="0.308" step="0.001"></div>
              <div class="field"><label>Weight (gr)</label><input type="number" id="weight" value="175" step="1"></div>
            </div>
            <div class="field-row">
              <div class="field"><label>BC Type</label><select id="bc-type"><option value="G7">G7</option><option value="G1">G1</option></select></div>
              <div class="field"><label>BC Value</label><input type="number" id="bc-value" value="0.301" step="0.001"></div>
            </div>
          </div>
        </div>
        <div class="card">
          <div class="section-title">Rifle & Zero</div>
          <div class="field-group">
            <div class="field-row">
              <div class="field"><label>Muzzle Velocity (fps)</label><input type="number" id="mv" value="2650" step="10"></div>
              <div class="field"><label>Zero Range (yds)</label><input type="number" id="zero" value="100" step="25"></div>
            </div>
            <div class="field"><label>Sight Height (in)</label><input type="number" id="sight-height" value="1.5" step="0.1"></div>
          </div>
        </div>
        <div class="card">
          <div class="section-title">Environment</div>
          <div class="field-group">
            <div class="field-row">
              <div class="field"><label>Temperature (F)</label><input type="number" id="temp" value="59" step="1"></div>
              <div class="field"><label>Altitude (ft)</label><input type="number" id="altitude" value="0" step="100"></div>
            </div>
            <div class="field-row">
              <div class="field"><label>Wind Speed (mph)</label><input type="number" id="wind-speed" value="10" step="1"></div>
              <div class="field"><label>Wind Direction</label>
                <select id="wind-dir">
                  <option value="3">3 o'clock (full)</option>
                  <option value="9">9 o'clock (full)</option>
                  <option value="1.5">1:30 / 4:30 (half)</option>
                  <option value="0">12 / 6 o'clock (none)</option>
                </select>
              </div>
            </div>
          </div>
        </div>
        <div class="card">
          <div class="section-title">Range Card</div>
          <div class="field-group">
            <div class="field-row">
              <div class="field"><label>Start (yds)</label><input type="number" id="range-start" value="100" step="50"></div>
              <div class="field"><label>Stop (yds)</label><input type="number" id="range-stop" value="1000" step="50"></div>
            </div>
            <div class="field-row">
              <div class="field"><label>Step (yds)</label><input type="number" id="range-step" value="100" step="25"></div>
              <div class="field"><label>Output Units</label>
                <select id="output-units"><option value="moa">MOA</option><option value="mils">MILS</option><option value="inches">Inches</option></select>
              </div>
            </div>
          </div>
        </div>
        <button class="btn-calc" onclick="calculate()">Calculate Range Card</button>
      </div>
      <div id="results">
        <div class="empty-state">
          <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="1.5">
            <circle cx="24" cy="24" r="20"/><path d="M24 4v20M4 24h20"/><circle cx="24" cy="24" r="3" fill="currentColor"/>
          </svg>
          <div class="empty-title">Enter your data and calculate</div>
          <div style="font-size:13px;margin-top:8px;color:#6b6358">Your range card will appear here</div>
        </div>
      </div>
    </div>
  </div>

  <div id="panel-database" class="panel">
    <div class="db-header">
      <input type="text" class="db-search" id="db-search" placeholder="Search bullets..." oninput="filterBullets()">
      <div class="filter-row" id="mfr-filters"></div>
    </div>
    <div class="filter-row" id="cal-filters" style="margin-bottom:20px"></div>
    <div class="bullet-grid" id="bullet-grid"></div>
  </div>

  <div id="panel-wind" class="panel">
    <div class="wind-grid">
      <div class="card">
        <div class="section-title">Wind Parameters</div>
        <div class="field-group">
          <div class="field"><label>Wind Speed (mph)</label><input type="number" id="w-speed" value="10" step="1" oninput="calcWind()"></div>
          <div class="field"><label>Wind Direction (o'clock)</label><input type="number" id="w-clock" value="3" step="0.5" min="1" max="12" oninput="calcWind()"></div>
          <div class="field"><label>Target Range (yds)</label><input type="number" id="w-range" value="500" step="50" oninput="calcWind()"></div>
          <div class="field"><label>Muzzle Velocity (fps)</label><input type="number" id="w-mv" value="2650" step="10" oninput="calcWind()"></div>
        </div>
        <div style="margin-top:20px">
          <div class="section-title">Wind Clock</div>
          <div class="clock-face">
            <div class="clock-labels">
              <span class="clock-label" style="top:10%;left:50%">12</span>
              <span class="clock-label" style="top:50%;left:90%">3</span>
              <span class="clock-label" style="top:90%;left:50%">6</span>
              <span class="clock-label" style="top:50%;left:10%">9</span>
            </div>
            <div class="wind-arrow" id="wind-arrow"></div>
          </div>
        </div>
      </div>
      <div style="display:flex;flex-direction:column;gap:16px">
        <div class="card">
          <div class="section-title">Wind Value</div>
          <div class="wind-result">
            <div class="wind-val" id="wind-value-pct">100%</div>
            <div class="wind-unit" id="wind-value-label">Full Value Wind</div>
          </div>
        </div>
        <div class="card">
          <div class="section-title">Wind Drift at Range</div>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-top:4px">
            <div class="stat-box"><div class="stat-val" id="drift-inches">—</div><div class="stat-label">Inches</div></div>
            <div class="stat-box"><div class="stat-val" id="drift-moa">—</div><div class="stat-label">MOA</div></div>
            <div class="stat-box"><div class="stat-val" id="drift-mils">—</div><div class="stat-label">MILS</div></div>
            <div class="stat-box"><div class="stat-val" id="drift-clicks">—</div><div class="stat-label">1/4 MOA Clicks</div></div>
          </div>
        </div>
        <div class="card">
          <div class="section-title">Wind Speed Table</div>
          <table class="range-card-table">
            <thead><tr><th style="text-align:left">Wind (mph)</th><th>Inches</th><th>MOA</th><th>MILS</th></tr></thead>
            <tbody id="wind-table"></tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</div>

<script>
const BULLETS=[
  {mfr:"Berger",name:"6.5mm 140gr Hybrid Target",cal:"6.5mm",wt:140,bc:0.301,bcType:"G7",dia:0.264,type:"Target"},
  {mfr:"Berger",name:"6.5mm 153.5gr LR Hybrid Target",cal:"6.5mm",wt:153.5,bc:0.335,bcType:"G7",dia:0.264,type:"Target"},
  {mfr:"Berger",name:"6.5mm 140gr Elite Hunter",cal:"6.5mm",wt:140,bc:0.289,bcType:"G7",dia:0.264,type:"Hunting"},
  {mfr:"Berger",name:"30 Cal 175gr OTM Tactical",cal:"30 Cal",wt:175,bc:0.280,bcType:"G7",dia:0.308,type:"Tactical"},
  {mfr:"Berger",name:"30 Cal 185gr Hybrid Target",cal:"30 Cal",wt:185,bc:0.296,bcType:"G7",dia:0.308,type:"Target"},
  {mfr:"Berger",name:"30 Cal 215gr Hybrid Target",cal:"30 Cal",wt:215,bc:0.334,bcType:"G7",dia:0.308,type:"Target"},
  {mfr:"Berger",name:"7mm 180gr Hybrid Target",cal:"7mm",wt:180,bc:0.337,bcType:"G7",dia:0.284,type:"Target"},
  {mfr:"Berger",name:"7mm 195gr Elite Hunter",cal:"7mm",wt:195,bc:0.391,bcType:"G7",dia:0.284,type:"Hunting"},
  {mfr:"Berger",name:"6mm 105gr Hybrid Target",cal:"6mm",wt:105,bc:0.271,bcType:"G7",dia:0.243,type:"Target"},
  {mfr:"Hornady",name:"6.5mm 140gr ELD-M",cal:"6.5mm",wt:140,bc:0.315,bcType:"G7",dia:0.264,type:"Target"},
  {mfr:"Hornady",name:"6.5mm 147gr ELD-M",cal:"6.5mm",wt:147,bc:0.330,bcType:"G7",dia:0.264,type:"Target"},
  {mfr:"Hornady",name:"6.5mm 143gr ELD-X",cal:"6.5mm",wt:143,bc:0.315,bcType:"G7",dia:0.264,type:"Hunting"},
  {mfr:"Hornady",name:"30 Cal 168gr ELD-M",cal:"30 Cal",wt:168,bc:0.257,bcType:"G7",dia:0.308,type:"Target"},
  {mfr:"Hornady",name:"30 Cal 178gr ELD-M",cal:"30 Cal",wt:178,bc:0.274,bcType:"G7",dia:0.308,type:"Target"},
  {mfr:"Hornady",name:"30 Cal 208gr ELD-M",cal:"30 Cal",wt:208,bc:0.330,bcType:"G7",dia:0.308,type:"Target"},
  {mfr:"Hornady",name:"7mm 180gr ELD-M",cal:"7mm",wt:180,bc:0.368,bcType:"G7",dia:0.284,type:"Target"},
  {mfr:"Hornady",name:"6mm 108gr ELD-M",cal:"6mm",wt:108,bc:0.276,bcType:"G7",dia:0.243,type:"Target"},
  {mfr:"Hornady",name:"22 Cal 75gr ELD-M",cal:"22 Cal",wt:75,bc:0.230,bcType:"G7",dia:0.224,type:"Target"},
  {mfr:"Hornady",name:"338 Cal 285gr ELD-M",cal:"338 Cal",wt:285,bc:0.417,bcType:"G7",dia:0.338,type:"Target"},
  {mfr:"Sierra",name:"6.5mm 142gr MatchKing",cal:"6.5mm",wt:142,bc:0.289,bcType:"G7",dia:0.264,type:"Target"},
  {mfr:"Sierra",name:"30 Cal 175gr MatchKing",cal:"30 Cal",wt:175,bc:0.264,bcType:"G7",dia:0.308,type:"Target"},
  {mfr:"Sierra",name:"30 Cal 220gr MatchKing",cal:"30 Cal",wt:220,bc:0.350,bcType:"G7",dia:0.308,type:"Target"},
  {mfr:"Sierra",name:"7mm 183gr MatchKing",cal:"7mm",wt:183,bc:0.356,bcType:"G7",dia:0.284,type:"Target"},
  {mfr:"Sierra",name:"6mm 107gr MatchKing",cal:"6mm",wt:107,bc:0.261,bcType:"G7",dia:0.243,type:"Target"},
  {mfr:"Nosler",name:"6.5mm 140gr RDF",cal:"6.5mm",wt:140,bc:0.301,bcType:"G7",dia:0.264,type:"Target"},
  {mfr:"Nosler",name:"30 Cal 175gr RDF",cal:"30 Cal",wt:175,bc:0.275,bcType:"G7",dia:0.308,type:"Target"},
  {mfr:"Nosler",name:"6.5mm 140gr AccuBond LR",cal:"6.5mm",wt:140,bc:0.276,bcType:"G7",dia:0.264,type:"Hunting"},
  {mfr:"Federal",name:"6.5mm 130gr Berger Hybrid",cal:"6.5mm",wt:130,bc:0.274,bcType:"G7",dia:0.264,type:"Target"},
  {mfr:"Federal",name:"30 Cal 175gr Sierra MatchKing",cal:"30 Cal",wt:175,bc:0.264,bcType:"G7",dia:0.308,type:"Target"},
  {mfr:"Barnes",name:"6.5mm 127gr LRX",cal:"6.5mm",wt:127,bc:0.257,bcType:"G7",dia:0.264,type:"Hunting"},
  {mfr:"Barnes",name:"30 Cal 175gr LRX",cal:"30 Cal",wt:175,bc:0.279,bcType:"G7",dia:0.308,type:"Hunting"},
  {mfr:"Barnes",name:"7mm 168gr LRX",cal:"7mm",wt:168,bc:0.317,bcType:"G7",dia:0.284,type:"Hunting"},
  {mfr:"Lapua",name:"6.5mm 139gr Scenar-L",cal:"6.5mm",wt:139,bc:0.279,bcType:"G7",dia:0.264,type:"Target"},
  {mfr:"Lapua",name:"30 Cal 175gr Scenar-L",cal:"30 Cal",wt:175,bc:0.269,bcType:"G7",dia:0.308,type:"Target"},
  {mfr:"Lapua",name:"30 Cal 185gr Scenar-L",cal:"30 Cal",wt:185,bc:0.287,bcType:"G7",dia:0.308,type:"Target"},
  {mfr:"Lapua",name:"338 Cal 300gr Scenar-L",cal:"338 Cal",wt:300,bc:0.417,bcType:"G7",dia:0.338,type:"Target"},
  {mfr:"Cutting Edge",name:"6.5mm 130gr MTAC",cal:"6.5mm",wt:130,bc:0.285,bcType:"G7",dia:0.264,type:"Tactical"},
  {mfr:"Cutting Edge",name:"30 Cal 185gr MTAC",cal:"30 Cal",wt:185,bc:0.310,bcType:"G7",dia:0.308,type:"Tactical"},
  {mfr:"Hammer",name:"6.5mm 135gr Hunter",cal:"6.5mm",wt:135,bc:0.276,bcType:"G7",dia:0.264,type:"Hunting"},
  {mfr:"Hammer",name:"30 Cal 168gr Hunter",cal:"30 Cal",wt:168,bc:0.262,bcType:"G7",dia:0.308,type:"Hunting"},
  {mfr:"Peterson",name:"6.5mm 140gr Match",cal:"6.5mm",wt:140,bc:0.301,bcType:"G7",dia:0.264,type:"Target"},
  {mfr:"Peterson",name:"30 Cal 175gr Match",cal:"30 Cal",wt:175,bc:0.280,bcType:"G7",dia:0.308,type:"Target"},
];

let activeMfr='All',activeCal='All';
const g=id=>document.getElementById(id);
const gv=id=>{const el=g(id);return el?parseFloat(el.value)||0:0};
const gs=id=>{const el=g(id);return el?el.value:''};

function showPanel(id){
  document.querySelectorAll('.panel').forEach(p=>p.classList.remove('active'));
  document.querySelectorAll('.nav-tab').forEach(t=>t.classList.remove('active'));
  g('panel-'+id).classList.add('active');
  document.querySelectorAll('.nav-tab').forEach(t=>{
    const txt=t.textContent.toLowerCase();
    if((id==='calculator'&&txt.includes('calc'))||(id==='database'&&txt.includes('bullet'))||(id==='wind'&&txt.includes('wind')))t.classList.add('active');
  });
}

function calculateTrajectory(p){
  const mv=p.mv*0.3048,G=9.80665;
  const sos=1116.45*Math.sqrt((p.tempF+459.67)/518.67)*0.3048;
  const rhoRatio=Math.exp(-p.altFt*0.3048/8435)*(518.67/(p.tempF+459.67));
  const bcG7=(p.bcType==='G1'?p.bc*0.505:p.bc)*703.07;
  const windMs=p.windMph*0.44704*Math.abs(Math.sin(p.windClock*Math.PI/6));
  const sightM=p.sightHt*0.0254;
  const dt=0.001;
  function retard(v){
    const mach=v/sos;
    let cd;
    if(mach>=1.8)cd=0.2303;
    else if(mach>=1.4)cd=0.2303+(1.8-mach)/0.4*0.0348;
    else if(mach>=1.2)cd=0.2651+(1.4-mach)/0.2*0.0304;
    else if(mach>=0.9)cd=0.2955+(1.2-mach)/0.3*0.0055;
    else cd=0.3010;
    return 1.2250*rhoRatio*cd*v*v/(2*bcG7);
  }
  let lo=-0.01,hi=0.05;
  for(let iter=0;iter<50;iter++){
    const mid=(lo+hi)/2;
    let vx=mv*Math.cos(mid),vy=mv*Math.sin(mid),x=0,y=-sightM;
    for(let i=0;i<100000;i++){
      const v=Math.sqrt(vx*vx+vy*vy);if(v<100)break;
      const a=retard(v);
      vx+=-a*vx/v*dt;vy+=(-G-a*vy/v)*dt;x+=vx*dt;y+=vy*dt;
      if(x/0.9144>=p.zeroYds){if(y>0)hi=mid;else lo=mid;break;}
    }
  }
  const ang=(lo+hi)/2;
  let vx=mv*Math.cos(ang),vy=mv*Math.sin(ang),x=0,y=-sightM,t=0,drift=0;
  const results=[],next=[p.startYd];
  for(let i=0;i<200000;i++){
    const v=Math.sqrt(vx*vx+vy*vy);if(v<100)break;
    const a=retard(v);
    vx+=-a*vx/v*dt;vy+=(-G-a*vy/v)*dt;x+=vx*dt;y+=vy*dt;t+=dt;drift+=windMs*dt;
    const xYds=x/0.9144;
    if(xYds>=next[0]){
      const dropIn=-y/0.0254,driftIn=drift/0.0254;
      const velFps=v/0.3048;
      const energy=(0.5*(p.wt/7000/2.20462)*v*v/1.35582).toFixed(0);
      const moa=xYds*1.047/100;
      let dd,dr;
      if(p.units==='moa'){dd=(dropIn/moa).toFixed(2);dr=(driftIn/moa).toFixed(2);}
      else if(p.units==='mils'){dd=(dropIn*0.0254/(xYds*0.0009144)).toFixed(2);dr=(driftIn*0.0254/(xYds*0.0009144)).toFixed(2);}
      else{dd=dropIn.toFixed(1);dr=driftIn.toFixed(1);}
      results.push({range:Math.round(xYds),drop:dropIn,dropDisp:dd,driftDisp:dr,vel:velFps.toFixed(0),energy,time:t.toFixed(3),isZero:Math.abs(xYds-p.zeroYds)<p.stepYd/2});
      next[0]+=p.stepYd;
      if(xYds>=p.stopYd)break;
    }
  }
  return results;
}

function calculate(){
  const units=gs('output-units');
  const rows=calculateTrajectory({bc:gv('bc-value'),bcType:gs('bc-type'),wt:gv('weight'),mv:gv('mv'),zeroYds:gv('zero'),sightHt:gv('sight-height'),tempF:gv('temp'),altFt:gv('altitude'),windMph:gv('wind-speed'),windClock:parseFloat(gs('wind-dir'))||3,startYd:gv('range-start'),stopYd:gv('range-stop'),stepYd:gv('range-step'),units});
  if(!rows.length)return;
  const ul=units==='moa'?'MOA':units==='mils'?'MILS':'IN',lr=rows[rows.length-1];
  g('results').innerHTML='<div class="stat-grid"><div class="stat-box"><div class="stat-val">'+gv('mv')+'</div><div class="stat-label">MV (fps)</div></div><div class="stat-box"><div class="stat-val">'+gv('bc-value')+'</div><div class="stat-label">BC ('+gs('bc-type')+')</div></div><div class="stat-box"><div class="stat-val">'+lr.vel+'</div><div class="stat-label">Vel @ '+lr.range+'yds</div></div><div class="stat-box"><div class="stat-val">'+lr.energy+'</div><div class="stat-label">Energy @ '+lr.range+'yds</div></div></div><div class="card" style="padding:0;overflow:hidden"><table class="range-card-table"><thead><tr><th>Range (yds)</th><th>Drop ('+ul+')</th><th>Wind ('+ul+')</th><th>Vel (fps)</th><th>Energy (ft-lbf)</th><th>ToF (s)</th></tr></thead><tbody>'+rows.map(r=>'<tr><td class="'+(r.isZero?'zero':'')+'">'+r.range+'</td><td class="'+(r.drop<-0.5?'neg':r.drop>0.5?'pos':'zero')+'">'+r.dropDisp+'</td><td class="neg">'+r.driftDisp+'</td><td>'+r.vel+'</td><td>'+r.energy+'</td><td>'+r.time+'</td></tr>').join('')+'</tbody></table></div>';
}

function buildDB(){
  const sel=g('bullet-select');
  BULLETS.forEach((b,i)=>{const o=document.createElement('option');o.value=i;o.textContent=b.mfr+' - '+b.name;sel.appendChild(o);});
  const mfrs=['All',...new Set(BULLETS.map(b=>b.mfr))];
  const cals=['All',...new Set(BULLETS.map(b=>b.cal))];
  const mDiv=g('mfr-filters'),cDiv=g('cal-filters');
  mfrs.forEach(m=>{const btn=document.createElement('button');btn.className='filter-btn'+(m==='All'?' active':'');btn.textContent=m;btn.onclick=()=>{activeMfr=m;document.querySelectorAll('#mfr-filters .filter-btn').forEach(b=>b.classList.remove('active'));btn.classList.add('active');renderBullets();};mDiv.appendChild(btn);});
  cals.forEach(c=>{const btn=document.createElement('button');btn.className='filter-btn'+(c==='All'?' active':'');btn.textContent=c;btn.onclick=()=>{activeCal=c;document.querySelectorAll('#cal-filters .filter-btn').forEach(b=>b.classList.remove('active'));btn.classList.add('active');renderBullets();};cDiv.appendChild(btn);});
  renderBullets();
}

function filterBullets(){renderBullets();}

function renderBullets(){
  const q=(g('db-search').value||'').toLowerCase();
  const filtered=BULLETS.filter(b=>(activeMfr==='All'||b.mfr===activeMfr)&&(activeCal==='All'||b.cal===activeCal)&&(!q||b.name.toLowerCase().includes(q)||b.mfr.toLowerCase().includes(q)));
  g('bullet-grid').innerHTML=filtered.map(b=>'<div class="bullet-card"><div class="bullet-mfr">'+b.mfr+'</div><div class="bullet-name">'+b.name+'</div><div class="bullet-specs"><span class="spec-tag">'+b.cal+'</span><span class="spec-tag">'+b.wt+' gr</span><span class="spec-tag bc">'+b.bcType+' '+b.bc+'</span><span class="spec-tag">'+b.type+'</span></div><button class="use-bullet-btn" onclick="useBullet('+BULLETS.indexOf(b)+')">Use in Calculator</button></div>').join('');
}

function useBullet(i){
  const b=BULLETS[i];
  g('diameter').value=b.dia;g('weight').value=b.wt;g('bc-type').value=b.bcType;g('bc-value').value=b.bc;g('bullet-select').value=i;
  showPanel('calculator');
}

function loadBullet(){const i=gs('bullet-select');if(i)useBullet(parseInt(i));}

function calcWind(){
  const speed=gv('w-speed'),clock=gv('w-clock')||3,range=gv('w-range')||500,mv=gv('w-mv')||2650;
  const value=Math.abs(Math.sin(clock*Math.PI/6)),pct=Math.round(value*100);
  g('wind-value-pct').textContent=pct+'%';
  g('wind-value-label').textContent=pct===100?'Full Value Wind':pct===50?'Half Value Wind':pct===0?'No Wind Value':'Partial Value Wind';
  g('wind-arrow').style.transform='translateX(-50%) rotate('+(clock-12)*30+'deg)';
  const tof=range/(mv*0.8),dIn=speed*0.44704*value*tof*(1/0.0254);
  const dMoa=dIn/(range*1.047/100),dMil=dIn*0.0254/(range*0.0009144);
  g('drift-inches').textContent=dIn.toFixed(1);g('drift-moa').textContent=dMoa.toFixed(2);
  g('drift-mils').textContent=dMil.toFixed(2);g('drift-clicks').textContent=Math.round(dMoa*4);
  g('wind-table').innerHTML=[5,10,15,20,25,30].map(s=>{const wm=s*0.44704,di=wm*value*tof*(1/0.0254),dm=di/(range*1.047/100),dmil=di*0.0254/(range*0.0009144);return'<tr><td>'+s+' mph</td><td>'+di.toFixed(1)+'"</td><td>'+dm.toFixed(2)+'</td><td>'+dmil.toFixed(2)+'</td></tr>';}).join('');
}

buildDB();calcWind();
</script>
</body>
</html>`
}
