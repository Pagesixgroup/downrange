import Head from 'next/head'

export default function DownRange() {
  return (
    <>
      <Head>
        <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=Source+Serif+4:wght@300;400;600&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet" />
      </Head>
      <DownRangeApp />
    </>
  )
}

function DownRangeApp() {
  if (typeof window === 'undefined') return null
  return <AppShell />
}

import { useEffect, useRef } from 'react'

function AppShell() {
  const ref = useRef(null)

  useEffect(() => {
    if (!ref.current) return
    buildDB()
    calcWind()
  }, [])

  return (
    <div ref={ref} style={{ minHeight: '100vh', background: '#1a1510' }}>
      <style>{CSS}</style>
      <nav>
        <div className="nav-brand">
          <div className="nav-logo">
            <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M10 2L10 18M2 10H18M4 4L16 16M16 4L4 16" stroke="#2c2416" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </div>
          <div>
            <div className="nav-title">DownRange</div>
            <div className="nav-sub">Precision Ballistics</div>
          </div>
        </div>
        <div className="nav-tabs">
          <button className="nav-tab active" onClick={() => showPanel('calculator')}>Calculator</button>
          <button className="nav-tab" onClick={() => showPanel('database')}>Bullet Database</button>
          <button className="nav-tab" onClick={() => showPanel('wind')}>Wind Calls</button>
        </div>
      </nav>

      <div className="app">
        <div id="panel-calculator" className="panel active">
          <div className="calc-grid">
            <div>
              <div className="card">
                <div className="section-title">Bullet</div>
                <div className="field-group">
                  <div className="field">
                    <label>Bullet / Load</label>
                    <select id="bullet-select" onChange={() => loadBullet()}>
                      <option value="">— Select from database —</option>
                    </select>
                  </div>
                  <div className="field-row">
                    <div className="field"><label>Diameter (in)</label><input type="number" id="diameter" defaultValue="0.308" step="0.001" /></div>
                    <div className="field"><label>Weight (gr)</label><input type="number" id="weight" defaultValue="175" step="1" /></div>
                  </div>
                  <div className="field-row">
                    <div className="field"><label>BC Type</label><select id="bc-type"><option value="G7">G7</option><option value="G1">G1</option></select></div>
                    <div className="field"><label>BC Value</label><input type="number" id="bc-value" defaultValue="0.301" step="0.001" /></div>
                  </div>
                </div>
              </div>
              <div className="card">
                <div className="section-title">Rifle & Zero</div>
                <div className="field-group">
                  <div className="field-row">
                    <div className="field"><label>Muzzle Velocity (fps)</label><input type="number" id="mv" defaultValue="2650" step="10" /></div>
                    <div className="field"><label>Zero Range (yds)</label><input type="number" id="zero" defaultValue="100" step="25" /></div>
                  </div>
                  <div className="field"><label>Sight Height (in)</label><input type="number" id="sight-height" defaultValue="1.5" step="0.1" /></div>
                </div>
              </div>
              <div className="card">
                <div className="section-title">Environment</div>
                <div className="field-group">
                  <div className="field-row">
                    <div className="field"><label>Temperature (°F)</label><input type="number" id="temp" defaultValue="59" step="1" /></div>
                    <div className="field"><label>Altitude (ft)</label><input type="number" id="altitude" defaultValue="0" step="100" /></div>
                  </div>
                  <div className="field-row">
                    <div className="field"><label>Wind Speed (mph)</label><input type="number" id="wind-speed" defaultValue="10" step="1" /></div>
                    <div className="field">
                      <label>Wind Direction</label>
                      <select id="wind-dir">
                        <option value="3">3 o&apos;clock (full)</option>
                        <option value="9">9 o&apos;clock (full)</option>
                        <option value="1.5">1:30 / 4:30 (half)</option>
                        <option value="0">12 / 6 o&apos;clock (none)</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
              <div className="card">
                <div className="section-title">Range Card</div>
                <div className="field-group">
                  <div className="field-row">
                    <div className="field"><label>Start (yds)</label><input type="number" id="range-start" defaultValue="100" step="50" /></div>
                    <div className="field"><label>Stop (yds)</label><input type="number" id="range-stop" defaultValue="1000" step="50" /></div>
                  </div>
                  <div className="field-row">
                    <div className="field"><label>Step (yds)</label><input type="number" id="range-step" defaultValue="100" step="25" /></div>
                    <div className="field">
                      <label>Output Units</label>
                      <select id="output-units"><option value="moa">MOA</option><option value="mils">MILS</option><option value="inches">Inches</option></select>
                    </div>
                  </div>
                </div>
              </div>
              <button className="btn-calc" onClick={() => calculate()}>Calculate Range Card</button>
            </div>
            <div id="results">
              <div className="empty-state">
                <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <circle cx="24" cy="24" r="20"/><path d="M24 4v20M4 24h20"/><circle cx="24" cy="24" r="3" fill="currentColor"/>
                </svg>
                <div className="empty-title">Enter your data and calculate</div>
                <div style={{fontSize:'13px',marginTop:'8px',color:'#6b6358'}}>Your range card will appear here</div>
              </div>
            </div>
          </div>
        </div>

        <div id="panel-database" className="panel">
          <div className="db-header">
            <input type="text" className="db-search" id="db-search" placeholder="Search bullets..." onInput={() => filterBullets()} />
            <div className="filter-row" id="mfr-filters"></div>
          </div>
          <div className="filter-row" id="cal-filters" style={{marginBottom:'20px'}}></div>
          <div className="bullet-grid" id="bullet-grid"></div>
        </div>

        <div id="panel-wind" className="panel">
          <div className="wind-grid">
            <div className="card">
              <div className="section-title">Wind Parameters</div>
              <div className="field-group">
                <div className="field"><label>Wind Speed (mph)</label><input type="number" id="w-speed" defaultValue="10" step="1" onInput={() => calcWind()} /></div>
                <div className="field"><label>Wind Direction (o&apos;clock)</label><input type="number" id="w-clock" defaultValue="3" step="0.5" min="1" max="12" onInput={() => calcWind()} /></div>
                <div className="field"><label>Target Range (yds)</label><input type="number" id="w-range" defaultValue="500" step="50" onInput={() => calcWind()} /></div>
                <div className="field"><label>Muzzle Velocity (fps)</label><input type="number" id="w-mv" defaultValue="2650" step="10" onInput={() => calcWind()} /></div>
              </div>
              <div style={{marginTop:'20px'}}>
                <div className="section-title">Wind Clock</div>
                <div className="clock-face" id="clock-face">
                  <div className="clock-labels">
                    <span className="clock-label" style={{top:'10%',left:'50%'}}>12</span>
                    <span className="clock-label" style={{top:'50%',left:'90%'}}>3</span>
                    <span className="clock-label" style={{top:'90%',left:'50%'}}>6</span>
                    <span className="clock-label" style={{top:'50%',left:'10%'}}>9</span>
                  </div>
                  <div className="wind-arrow" id="wind-arrow"></div>
                </div>
              </div>
            </div>
            <div style={{display:'flex',flexDirection:'column',gap:'16px'}}>
              <div className="card">
                <div className="section-title">Wind Value</div>
                <div className="wind-result">
                  <div className="wind-val" id="wind-value-pct">100%</div>
                  <div className="wind-unit" id="wind-value-label">Full Value Wind</div>
                </div>
              </div>
              <div className="card">
                <div className="section-title">Wind Drift at Range</div>
                <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'12px',marginTop:'4px'}}>
                  <div className="stat-box"><div className="stat-val" id="drift-inches">—</div><div className="stat-label">Inches</div></div>
                  <div className="stat-box"><div className="stat-val" id="drift-moa">—</div><div className="stat-label">MOA</div></div>
                  <div className="stat-box"><div className="stat-val" id="drift-mils">—</div><div className="stat-label">MILS</div></div>
                  <div className="stat-box"><div className="stat-val" id="drift-clicks">—</div><div className="stat-label">¼ MOA Clicks</div></div>
                </div>
              </div>
              <div className="card">
                <div className="section-title">Wind Speed Table</div>
                <table className="range-card-table">
                  <thead><tr><th style={{textAlign:'left'}}>Wind (mph)</th><th>Inches</th><th>MOA</th><th>MILS</th></tr></thead>
                  <tbody id="wind-table"></tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

const CSS = `
:root{--bark:#2c2416;--soil:#3d3020;--moss:#4a5240;--sage:#7a8c6e;--wheat:#c4a96b;--amber:#d4883a;--cream:#f2ead8;--parchment:#e8ddc4;--fog:#b8ae9c;--stone:#6b6358;--bg:#1a1510;--card:#231e16;--border:rgba(196,169,107,0.15);--border-bright:rgba(196,169,107,0.35)}
*{margin:0;padding:0;box-sizing:border-box}
body{background:var(--bg);color:var(--cream);font-family:'Source Serif 4',serif;font-size:15px;line-height:1.6;min-height:100vh}
nav{position:sticky;top:0;z-index:100;background:rgba(26,21,16,0.95);backdrop-filter:blur(12px);border-bottom:1px solid var(--border);padding:0 32px;display:flex;align-items:center;justify-content:space-between;height:60px}
.nav-brand{display:flex;align-items:center;gap:12px}
.nav-logo{width:36px;height:36px;background:var(--wheat);border-radius:4px;display:flex;align-items:center;justify-content:center}
.nav-logo svg{width:20px;height:20px}
.nav-title{font-family:'Playfair Display',serif;font-size:20px;font-weight:900;color:var(--cream);letter-spacing:0.02em}
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
.btn-calc{width:100%;padding:13px;background:var(--wheat);color:var(--bark);border:none;border-radius:6px;font-family:'Playfair Display',serif;font-size:14px;font-weight:700;letter-spacing:0.05em;cursor:pointer;transition:all 0.2s;margin-top:8px}
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
.db-search:focus{border-color:var(--border-bright)}
.filter-row{display:flex;gap:8px;flex-wrap:wrap}
.filter-btn{padding:6px 14px;background:none;border:1px solid var(--border);border-radius:20px;color:var(--stone);font-family:'JetBrains Mono',monospace;font-size:10px;letter-spacing:0.08em;cursor:pointer;transition:all 0.2s;text-transform:uppercase}
.filter-btn.active,.filter-btn:hover{border-color:var(--wheat);color:var(--wheat);background:rgba(196,169,107,0.08)}
.bullet-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:14px}
.bullet-card{background:var(--card);border:1px solid var(--border);border-radius:8px;padding:16px;cursor:pointer;transition:all 0.2s}
.bullet-card:hover{border-color:var(--border-bright);transform:translateY(-2px)}
.bullet-mfr{font-family:'JetBrains Mono',monospace;font-size:9px;letter-spacing:0.15em;text-transform:uppercase;color:var(--amber);margin-bottom:4px}
.bullet-name{font-family:'Playfair Display',serif;font-size:15px;font-weight:700;color:var(--cream);margin-bottom:8px;line-height:1.3}
.bullet-specs{display:flex;gap:10px;flex-wrap:wrap}
.spec-tag{font-family:'JetBrains Mono',monospace;font-size:10px;padding:2px 8px;background:rgba(196,169,107,0.07);border:1px solid var(--border);border-radius:3px;color:var(--fog)}
.spec-tag.bc{color:var(--sage);border-color:rgba(122,140,110,0.3)}
.use-bullet-btn{margin-top:10px;padding:6px 14px;background:none;border:1px solid var(--border-bright);border-radius:4px;color:var(--wheat);font-family:'JetBrains Mono',monospace;font-size:10px;letter-spacing:0.08em;text-transform:uppercase;cursor:pointer;transition:all 0.2s}
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
@media(max-width:768px){.calc-grid{grid-template-columns:1fr}.stat-grid{grid-template-columns:repeat(2,1fr)}.wind-grid{grid-template-columns:1fr}nav{padding:0 16px}.nav-tabs{display:none}}
`

const BULLETS = [
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
]

let activeMfr = 'All', activeCal = 'All'

function g(id){ return typeof document !== 'undefined' ? document.getElementById(id) : null }
function gv(id){ const el = g(id); return el ? parseFloat(el.value) : 0 }
function gs(id){ const el = g(id); return el ? el.value : '' }

function showPanel(id) {
  if (typeof document === 'undefined') return
  document.querySelectorAll('.panel').forEach(p => p.classList.remove('active'))
  document.querySelectorAll('.nav-tab').forEach(t => t.classList.remove('active'))
  const panel = document.getElementById('panel-' + id)
  if (panel) panel.classList.add('active')
  document.querySelectorAll('.nav-tab').forEach(t => {
    const txt = t.textContent.toLowerCase()
    if ((id === 'calculator' && txt.includes('calc')) || (id === 'database' && txt.includes('bullet')) || (id === 'wind' && txt.includes('wind'))) {
      t.classList.add('active')
    }
  })
}

function airDensityRatio(altFt, tempF) {
  const tempR = tempF + 459.67, stdTempR = 518.67
  return Math.exp(-altFt * 0.3048 / 8435) * (stdTempR / tempR)
}

function g7Cd(mach) {
  if (mach > 1.8) return 0.2303
  if (mach > 1.4) return 0.2303 + (1.8 - mach) * 0.04
  if (mach > 1.2) return 0.2700 + (1.4 - mach) * 0.12
  if (mach > 0.8) return 0.2950 + (1.2 - mach) * 0.09
  return 0.3350
}

function calculateTrajectory(p) {
  const rho = airDensityRatio(p.altFt, p.tempF)
  const bcG7 = p.bcType === 'G1' ? p.bc * 0.505 : p.bc
  const sos = 1116.45 * Math.sqrt((p.tempF + 459.67) / 518.67)
  const windFactor = Math.abs(Math.sin(p.windClock * Math.PI / 6))
  const windMs = p.windMph * 0.44704 * windFactor
  const dt = 0.001
  let tx = p.mv * 0.3048, ty = 0, tx2 = 0, ty2 = -p.sightHt * 0.0254, zeroCorr = 0

  for (let s = 0; s < 80000; s++) {
    const v = Math.sqrt(tx*tx+ty*ty), mach = v/sos
    const cd = g7Cd(mach)/bcG7*rho
    const ax = -cd*tx*v, ay = -9.80665-cd*ty*v
    tx+=ax*dt; ty+=ay*dt; tx2+=tx*dt; ty2+=ty*dt+0.5*ay*dt*dt
    if (tx2/0.9144 >= p.zeroYds) { zeroCorr = ty2; break }
  }

  let vx=p.mv*0.3048,vy=0,x=0,y=-p.sightHt*0.0254,t=0,drift=0
  const results=[], nextRec=[p.startYd]

  for (let s = 0; s < 200000; s++) {
    const v=Math.sqrt(vx*vx+vy*vy),mach=v/sos
    const cd=g7Cd(mach)/bcG7*rho
    const ax=-cd*vx*v,ay=-9.80665-cd*vy*v
    vx+=ax*dt; vy+=ay*dt; x+=vx*dt; y+=vy*dt+0.5*ay*dt*dt
    drift+=windMs*dt; t+=dt
    const xYds=x/0.9144
    if (xYds>=nextRec[0]) {
      const sightY=(xYds/p.zeroYds)*zeroCorr
      const dropIn=(y-sightY)*(1/0.0254)
      const driftIn=drift*(1/0.0254)
      const moa=val=>val/(xYds*1.047/100)
      const mils=val=>val/(xYds*0.09144)
      const velFps=v/0.3048
      const energy=0.5*(p.wt/7000)*velFps*velFps/32.174*2
      let dd,dr
      if(p.units==='moa'){dd=moa(dropIn).toFixed(2);dr=moa(driftIn).toFixed(2)}
      else if(p.units==='mils'){dd=mils(dropIn*0.0254).toFixed(2);dr=mils(driftIn*0.0254).toFixed(2)}
      else{dd=dropIn.toFixed(1);dr=driftIn.toFixed(1)}
      results.push({range:xYds.toFixed(0),drop:dropIn,dropDisp:dd,driftDisp:dr,vel:velFps.toFixed(0),energy:energy.toFixed(0),time:t.toFixed(3),isZero:Math.abs(xYds-p.zeroYds)<(p.stepYd/2)})
      nextRec[0]+=p.stepYd
      if(xYds>=p.stopYd) break
    }
  }
  return results
}

function calculate() {
  const units=gs('output-units')
  const rows=calculateTrajectory({bc:gv('bc-value'),bcType:gs('bc-type'),wt:gv('weight'),mv:gv('mv'),zeroYds:gv('zero'),sightHt:gv('sight-height'),tempF:gv('temp'),altFt:gv('altitude'),windMph:gv('wind-speed'),windClock:gv('wind-dir'),startYd:gv('range-start'),stopYd:gv('range-stop'),stepYd:gv('range-step'),units,dia:gv('diameter')})
  if(!rows.length) return
  const ul=units==='moa'?'MOA':units==='mils'?'MILS':'IN'
  const lr=rows[rows.length-1]
  const res=g('results')
  if(!res) return
  res.innerHTML=`<div class="stat-grid"><div class="stat-box"><div class="stat-val">${gv('mv')}</div><div class="stat-label">MV (fps)</div></div><div class="stat-box"><div class="stat-val">${gv('bc-value')}</div><div class="stat-label">BC (${gs('bc-type')})</div></div><div class="stat-box"><div class="stat-val">${lr.vel}</div><div class="stat-label">Vel @ ${lr.range}yds</div></div><div class="stat-box"><div class="stat-val">${lr.energy}</div><div class="stat-label">Energy @ ${lr.range}yds</div></div></div><div class="card" style="padding:0;overflow:hidden"><table class="range-card-table"><thead><tr><th>Range (yds)</th><th>Drop (${ul})</th><th>Wind (${ul})</th><th>Vel (fps)</th><th>Energy (ft·lbf)</th><th>ToF (s)</th></tr></thead><tbody>${rows.map(r=>`<tr><td class="${r.isZero?'zero':''}">${r.range}</td><td class="${r.drop<-0.5?'neg':r.drop>0.5?'pos':'zero'}">${r.dropDisp}</td><td class="neg">${r.driftDisp}</td><td>${r.vel}</td><td>${r.energy}</td><td>${r.time}</td></tr>`).join('')}</tbody></table></div>`
}

function buildDB() {
  const sel=g('bullet-select')
  if(sel){BULLETS.forEach((b,i)=>{const o=document.createElement('option');o.value=i;o.textContent=`${b.mfr} – ${b.name}`;sel.appendChild(o)})}
  const mfrs=['All',...new Set(BULLETS.map(b=>b.mfr))]
  const cals=['All',...new Set(BULLETS.map(b=>b.cal))]
  const mfrDiv=g('mfr-filters')
  if(mfrDiv){mfrs.forEach(m=>{const btn=document.createElement('button');btn.className='filter-btn'+(m==='All'?' active':'');btn.textContent=m;btn.onclick=()=>{activeMfr=m;document.querySelectorAll('#mfr-filters .filter-btn').forEach(b=>b.classList.remove('active'));btn.classList.add('active');renderBullets()};mfrDiv.appendChild(btn)})}
  const calDiv=g('cal-filters')
  if(calDiv){cals.forEach(c=>{const btn=document.createElement('button');btn.className='filter-btn'+(c==='All'?' active':'');btn.textContent=c;btn.onclick=()=>{activeCal=c;document.querySelectorAll('#cal-filters .filter-btn').forEach(b=>b.classList.remove('active'));btn.classList.add('active');renderBullets()};calDiv.appendChild(btn)})}
  renderBullets()
}

function filterBullets(){renderBullets()}

function renderBullets(){
  const q=(g('db-search')||{}).value?.toLowerCase()||''
  const grid=g('bullet-grid')
  if(!grid) return
  const filtered=BULLETS.filter(b=>{
    const mm=activeMfr==='All'||b.mfr===activeMfr
    const mc=activeCal==='All'||b.cal===activeCal
    const mq=!q||b.name.toLowerCase().includes(q)||b.mfr.toLowerCase().includes(q)
    return mm&&mc&&mq
  })
  grid.innerHTML=filtered.map(b=>`<div class="bullet-card"><div class="bullet-mfr">${b.mfr}</div><div class="bullet-name">${b.name}</div><div class="bullet-specs"><span class="spec-tag">${b.cal}</span><span class="spec-tag">${b.wt} gr</span><span class="spec-tag bc">${b.bcType} ${b.bc}</span><span class="spec-tag">${b.type}</span></div><button class="use-bullet-btn" onclick="useBullet(${BULLETS.indexOf(b)})">Use in Calculator →</button></div>`).join('')
}

function useBullet(i){
  const b=BULLETS[i]
  const setVal=(id,v)=>{const el=g(id);if(el)el.value=v}
  setVal('diameter',b.dia);setVal('weight',b.wt);setVal('bc-type',b.bcType);setVal('bc-value',b.bc)
  const sel=g('bullet-select');if(sel)sel.value=i
  showPanel('calculator')
}

function loadBullet(){
  const i=gs('bullet-select')
  if(i==='') return
  useBullet(parseInt(i))
}

function calcWind(){
  const speed=gv('w-speed')||0,clock=gv('w-clock')||3,range=gv('w-range')||500,mv=gv('w-mv')||2650
  const value=Math.abs(Math.sin(clock*Math.PI/6))
  const pct=Math.round(value*100)
  const vp=g('wind-value-pct');if(vp)vp.textContent=pct+'%'
  const vl=g('wind-value-label');if(vl)vl.textContent=pct===100?'Full Value Wind':pct===50?'Half Value Wind':pct===0?'No Wind Value':'Partial Value Wind'
  const arrow=g('wind-arrow');if(arrow)arrow.style.transform=`translateX(-50%) rotate(${(clock-12)*30}deg)`
  const tof=range/(mv*0.8),windMs=speed*0.44704
  const dIn=windMs*value*tof*(1/0.0254)
  const dMoa=dIn/(range*1.047/100)
  const dMil=dIn*0.0254/(range*0.0009144)
  const setT=(id,v)=>{const el=g(id);if(el)el.textContent=v}
  setT('drift-inches',dIn.toFixed(1));setT('drift-moa',dMoa.toFixed(2));setT('drift-mils',dMil.toFixed(2));setT('drift-clicks',Math.round(dMoa*4))
  const tbody=g('wind-table')
  if(tbody)tbody.innerHTML=[5,10,15,20,25,30].map(s=>{const wm=s*0.44704,di=wm*value*tof*(1/0.0254),dm=di/(range*1.047/100),dmil=di*0.0254/(range*0.0009144);return`<tr><td>${s} mph</td><td>${di.toFixed(1)}"</td><td>${dm.toFixed(2)}</td><td>${dmil.toFixed(2)}</td></tr>`}).join('')
}

if (typeof window !== 'undefined') {
  window.showPanel = showPanel
  window.calculate = calculate
  window.buildDB = buildDB
  window.filterBullets = filterBullets
  window.useBullet = useBullet
  window.loadBullet = loadBullet
  window.calcWind = calcWind
}
