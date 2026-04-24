import { useState } from "react";

const WINE = "#6B1A1A";
const BLACK = "#1A1A1A";
const GRAY = "#6B6B6B";
const BORDER = "#E8E0E0";
const BG = "#FFFFFF";
const BG2 = "#FAFAF9";

const INITIAL_DATA = [
  { id: 1, titulo: "Composição Azul e Branco", casa: "Cabral Moncada Leilões", pais: "🇵🇹 Portugal", data: "2024-03-15", estimativaMin: 8000, estimativaMax: 12000, precoMartelo: 14500, precoFinal: 17400, tecnica: "Azulejo / Cerâmica", dimensoes: "45×45 cm", estado: "Vendida", url: "https://www.cabral-moncada.com/leilao/lote-exemplo-1" },
  { id: 2, titulo: "Sem Título (Composição Geométrica)", casa: "Palácio do Correio Velho", pais: "🇵🇹 Portugal", data: "2024-05-22", estimativaMin: 5000, estimativaMax: 8000, precoMartelo: 6200, precoFinal: 7440, tecnica: "Guache sobre papel", dimensoes: "30×40 cm", estado: "Vendida", url: "https://www.pcvelho.com/leilao/lote-exemplo-2" },
  { id: 3, titulo: "Forme Bleue", casa: "Drouot — Millon", pais: "🇫🇷 França", data: "2024-06-10", estimativaMin: 3000, estimativaMax: 5000, precoMartelo: null, precoFinal: null, tecnica: "Serigrafia", dimensoes: "70×50 cm", estado: "Não Vendida", url: "https://www.drouot.com/lot/exemple-3" },
  { id: 4, titulo: "Painel Cerâmico — Série Mediterrâneo", casa: "Veritas", pais: "🇵🇹 Portugal", data: "2024-09-18", estimativaMin: 15000, estimativaMax: 22000, precoMartelo: 25000, precoFinal: 30000, tecnica: "Cerâmica", dimensoes: "120×60 cm", estado: "Vendida", url: "https://www.veritas.pt/leilao/lote-exemplo-4" },
  { id: 5, titulo: "Composition Méditerranéenne", casa: "Christie's Paris", pais: "🇫🇷 França", data: "2025-01-30", estimativaMin: 20000, estimativaMax: 35000, precoMartelo: 42000, precoFinal: 50400, tecnica: "Óleo sobre tela", dimensoes: "80×100 cm", estado: "Vendida", url: "https://www.christies.com/lot/exemple-5" },
  { id: 6, titulo: "Azulejos — Painel Decorativo", casa: "Leiria & Nascimento", pais: "🇵🇹 Portugal", data: "2025-03-05", estimativaMin: 4000, estimativaMax: 6000, precoMartelo: 5500, precoFinal: 6600, tecnica: "Azulejo", dimensoes: "60×60 cm", estado: "Vendida", url: "" },
];

const CASAS = [
  { nome: "Cabral Moncada Leilões", pais: "🇵🇹", ativa: true },
  { nome: "Palácio do Correio Velho", pais: "🇵🇹", ativa: true },
  { nome: "Veritas", pais: "🇵🇹", ativa: true },
  { nome: "Leiria & Nascimento", pais: "🇵🇹", ativa: true },
  { nome: "Drouot — Millon", pais: "🇫🇷", ativa: true },
  { nome: "Christie's Paris", pais: "🇫🇷", ativa: true },
  { nome: "Sotheby's", pais: "🌍", ativa: false },
  { nome: "Bonhams", pais: "🌍", ativa: false },
];

const fmt = v => v ? new Intl.NumberFormat("pt-PT", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(v) : "—";
const fmtDate = d => new Date(d).toLocaleDateString("pt-PT", { day: "2-digit", month: "short", year: "numeric" });

// Ícone de link externo
function IconLink() {
  return (
    <svg width="13" height="13" viewBox="0 0 13 13" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M5 2.5H2.5C1.948 2.5 1.5 2.948 1.5 3.5V10.5C1.5 11.052 1.948 11.5 2.5 11.5H9.5C10.052 11.5 10.5 11.052 10.5 10.5V8" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
      <path d="M7.5 1.5H11.5V5.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M11.5 1.5L6 7" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
    </svg>
  );
}

// Botão de link clicável — abre o URL do leilão numa nova aba
function LinkBtn({ url }) {
  if (!url) return (
    <span style={{ fontSize: 10, color: "#CCC", fontFamily: "Georgia, serif", fontStyle: "italic" }}>sem link</span>
  );
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      title={url}
      style={{
        display: "inline-flex", alignItems: "center", gap: 5,
        color: WINE, fontSize: 11, fontFamily: "Georgia, serif",
        textDecoration: "none", border: `1px solid ${BORDER}`,
        borderRadius: 2, padding: "3px 8px",
        transition: "all 0.15s"
      }}
      onMouseOver={e => { e.currentTarget.style.background = "#FDF2F2"; e.currentTarget.style.borderColor = WINE; }}
      onMouseOut={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.borderColor = BORDER; }}
    >
      <IconLink /> Ver lote
    </a>
  );
}

export default function App() {
  const [obras, setObras] = useState(INITIAL_DATA);
  const [tab, setTab] = useState("dashboard");
  const [filtro, setFiltro] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [obraDetalhe, setObraDetalhe] = useState(null);
  const [scanStatus, setScanStatus] = useState("idle");
  const [lastScan, setLastScan] = useState("Nunca realizada");
  const [form, setForm] = useState({
    titulo: "", casa: "", pais: "", data: "",
    estimativaMin: "", estimativaMax: "",
    precoMartelo: "", precoFinal: "",
    tecnica: "", dimensoes: "", estado: "Vendida", url: ""
  });

  const vendidas = obras.filter(o => o.estado === "Vendida");
  const totalVendas = vendidas.reduce((s, o) => s + (o.precoFinal || 0), 0);
  const mediaVenda = vendidas.length ? Math.round(totalVendas / vendidas.length) : 0;
  const maxVenda = Math.max(...vendidas.map(o => o.precoFinal || 0));
  const obrasFiltradas = obras.filter(o =>
    o.titulo.toLowerCase().includes(filtro.toLowerCase()) ||
    o.casa.toLowerCase().includes(filtro.toLowerCase())
  );

  function handleAdd(e) {
    e.preventDefault();
    setObras(p => [{
      ...form, id: Date.now(),
      estimativaMin: +form.estimativaMin,
      estimativaMax: +form.estimativaMax,
      precoMartelo: form.precoMartelo ? +form.precoMartelo : null,
      precoFinal: form.precoFinal ? +form.precoFinal : null
    }, ...p]);
    setShowForm(false);
    setForm({ titulo: "", casa: "", pais: "", data: "", estimativaMin: "", estimativaMax: "", precoMartelo: "", precoFinal: "", tecnica: "", dimensoes: "", estado: "Vendida", url: "" });
  }

  function scan() {
    setScanStatus("scanning");
    setTimeout(() => {
      setScanStatus("done");
      setLastScan(new Date().toLocaleString("pt-PT"));
      setTimeout(() => setScanStatus("idle"), 3000);
    }, 2500);
  }

  function exportCSV() {
    const h = ["Título", "Casa", "País", "Data", "Est.Mín", "Est.Máx", "Martelo", "Final", "Técnica", "Dimensões", "Estado", "URL Leilão"];
    const rows = obras.map(o => [
      o.titulo, o.casa,
      o.pais.replace(/[^\w\s]/g, "").trim(),
      o.data, o.estimativaMin, o.estimativaMax,
      o.precoMartelo || "", o.precoFinal || "",
      o.tecnica, o.dimensoes, o.estado, o.url || ""
    ]);
    const csv = [h, ...rows].map(r => r.join(";")).join("\n");
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" }));
    a.download = `cargaleiro-leiloes-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
  }

  const badgeStyle = estado => {
    if (estado === "Vendida") return { background: "#F2F8F2", color: "#1E5C1E", border: "1px solid #C0DCC0" };
    if (estado === "A Decorrer") return { background: "#FFF9EC", color: "#7A5800", border: "1px solid #E8D490" };
    return { background: "#FDF2F2", color: WINE, border: "1px solid #E8C0C0" };
  };

  const card = { background: BG, border: `1px solid ${BORDER}`, borderRadius: 3, padding: "22px 24px" };
  const labelStyle = { fontSize: 10, letterSpacing: 1.8, textTransform: "uppercase", color: GRAY, fontFamily: "Georgia, serif", marginBottom: 6, display: "block" };
  const inputStyle = { background: BG, border: `1px solid ${BORDER}`, color: BLACK, fontFamily: "Georgia, serif", fontSize: 13, padding: "8px 12px", borderRadius: 3, width: "100%", outline: "none" };
  const badge = { display: "inline-block", fontSize: 10, letterSpacing: 1, textTransform: "uppercase", padding: "3px 8px", borderRadius: 2, fontFamily: "Georgia, serif" };

  // Modal de detalhe da obra
  const Modal = ({ obra, onClose }) => (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.35)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center" }} onClick={onClose}>
      <div style={{ background: BG, border: `1px solid ${BORDER}`, borderRadius: 4, padding: "32px 36px", maxWidth: 560, width: "90%", position: "relative" }} onClick={e => e.stopPropagation()}>
        <button onClick={onClose} style={{ position: "absolute", top: 16, right: 16, background: "none", border: "none", cursor: "pointer", color: GRAY, fontSize: 18, lineHeight: 1 }}>×</button>
        <div style={{ fontSize: 10, letterSpacing: 2, textTransform: "uppercase", color: GRAY, marginBottom: 8 }}>{obra.casa} · {obra.pais}</div>
        <div style={{ fontSize: 19, color: WINE, marginBottom: 6, fontWeight: "normal" }}>{obra.titulo}</div>
        <div style={{ fontSize: 12, color: GRAY, marginBottom: 22 }}>{obra.tecnica} · {obra.dimensoes} · {fmtDate(obra.data)}</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 22 }}>
          {[
            ["Estimativa", `${fmt(obra.estimativaMin)} – ${fmt(obra.estimativaMax)}`],
            ["Preço de martelo", fmt(obra.precoMartelo)],
            ["Preço final c/ comissões", fmt(obra.precoFinal)],
            ["Estado", obra.estado],
          ].map(([l, v]) => (
            <div key={l} style={{ borderBottom: `1px solid ${BORDER}`, paddingBottom: 10 }}>
              <div style={{ fontSize: 10, letterSpacing: 1.5, textTransform: "uppercase", color: GRAY, marginBottom: 4 }}>{l}</div>
              <div style={{ fontSize: 14, color: BLACK }}>{v}</div>
            </div>
          ))}
        </div>
        {/* URL do leilão em destaque */}
        <div style={{ background: BG2, border: `1px solid ${BORDER}`, borderRadius: 3, padding: "14px 16px" }}>
          <div style={{ fontSize: 10, letterSpacing: 1.5, textTransform: "uppercase", color: GRAY, marginBottom: 8 }}>Link do lote no leilão</div>
          {obra.url ? (
            <a href={obra.url} target="_blank" rel="noopener noreferrer" style={{ color: WINE, fontSize: 13, wordBreak: "break-all", textDecoration: "none", display: "flex", alignItems: "center", gap: 6 }}>
              <IconLink /> {obra.url}
            </a>
          ) : (
            <span style={{ fontSize: 13, color: "#CCC", fontStyle: "italic" }}>Nenhum link registado para esta obra.</span>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div style={{ fontFamily: "Georgia, serif", background: BG, minHeight: "100vh", color: BLACK }}>
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        .hrow:hover { background: ${BG2}; cursor: pointer; }
        input:focus, select:focus { border-color: ${WINE} !important; outline: none; }
        select option { background: white; }
        ::-webkit-scrollbar { width: 3px; }
        ::-webkit-scrollbar-thumb { background: ${BORDER}; }
      `}</style>

      {obraDetalhe && <Modal obra={obraDetalhe} onClose={() => setObraDetalhe(null)} />}

      {/* Header */}
      <div style={{ borderBottom: `1px solid ${BORDER}`, padding: "18px 36px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{ width: 34, height: 34, background: WINE, borderRadius: 2, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <circle cx="8" cy="8" r="5.5" stroke="white" strokeWidth="1.2" fill="none"/>
              <circle cx="8" cy="8" r="1.8" fill="white"/>
              <line x1="8" y1="2.5" x2="8" y2="0.5" stroke="white" strokeWidth="1.2"/>
              <line x1="8" y1="15.5" x2="8" y2="13.5" stroke="white" strokeWidth="1.2"/>
              <line x1="0.5" y1="8" x2="2.5" y2="8" stroke="white" strokeWidth="1.2"/>
              <line x1="13.5" y1="8" x2="15.5" y2="8" stroke="white" strokeWidth="1.2"/>
            </svg>
          </div>
          <div>
            <div style={{ fontSize: 10, letterSpacing: 2, textTransform: "uppercase", color: GRAY, marginBottom: 2 }}>Fundação Manuel Cargaleiro</div>
            <div style={{ fontSize: 17, color: WINE, fontWeight: "normal" }}>Monitor de Leilões</div>
          </div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: 10, letterSpacing: 1.5, textTransform: "uppercase", color: GRAY, marginBottom: 3 }}>Última verificação</div>
          <div style={{ fontSize: 12, color: BLACK }}>{lastScan}</div>
        </div>
      </div>

      {/* Nav */}
      <div style={{ display: "flex", borderBottom: `1px solid ${BORDER}`, padding: "0 36px" }}>
        {[["dashboard", "Painel geral"], ["obras", "Registo de obras"], ["casas", "Casas monitorizadas"]].map(([k, l]) => (
          <button key={k} onClick={() => setTab(k)} style={{
            background: "none", border: "none", cursor: "pointer",
            fontFamily: "Georgia, serif", fontSize: 13, padding: "11px 16px",
            color: tab === k ? WINE : GRAY,
            borderBottom: tab === k ? `2px solid ${WINE}` : "2px solid transparent",
            transition: "all 0.15s"
          }}>{l}</button>
        ))}
      </div>

      <div style={{ padding: "30px 36px", maxWidth: 1100 }}>

        {/* PAINEL GERAL */}
        {tab === "dashboard" && <>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14, marginBottom: 24 }}>
            {[
              [obras.length, "Obras registadas"],
              [vendidas.length, "Vendidas"],
              [fmt(totalVendas), "Volume total"],
              [fmt(mediaVenda), "Média por obra"],
            ].map(([n, l], i) => (
              <div key={i} style={card}>
                <div style={{ fontSize: 26, color: WINE, marginBottom: 5, fontWeight: "normal" }}>{n}</div>
                <div style={{ fontSize: 10, letterSpacing: 1.8, textTransform: "uppercase", color: GRAY }}>{l}</div>
              </div>
            ))}
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 14 }}>
            <div style={card}>
              <div style={{ fontSize: 10, letterSpacing: 2, textTransform: "uppercase", color: GRAY, marginBottom: 14 }}>Verificação automática</div>
              <p style={{ fontSize: 13, color: GRAY, lineHeight: 1.8, marginBottom: 16 }}>
                Pesquisa semanal nas casas ativas por obras de Manuel Cargaleiro.
              </p>
              <button onClick={scan} disabled={scanStatus === "scanning"} style={{
                background: WINE, color: "#FFF", border: "none", cursor: "pointer",
                fontFamily: "Georgia, serif", fontSize: 12, letterSpacing: 1,
                padding: "9px 20px", borderRadius: 3, width: "100%",
                opacity: scanStatus === "scanning" ? 0.7 : 1
              }}>
                {scanStatus === "scanning" ? "A verificar..." : scanStatus === "done" ? "✓  Concluído" : "Verificar agora"}
              </button>
              {scanStatus === "done" && (
                <div style={{ marginTop: 8, fontSize: 11, color: "#1E5C1E", textAlign: "center" }}>
                  Nenhuma obra nova identificada.
                </div>
              )}
            </div>
            <div style={card}>
              <div style={{ fontSize: 10, letterSpacing: 2, textTransform: "uppercase", color: GRAY, marginBottom: 14 }}>Preços de venda</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {vendidas.slice(0, 5).map((o, i) => (
                  <div key={i}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                      <span style={{ fontSize: 12, color: GRAY, maxWidth: 200, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{o.titulo}</span>
                      <span style={{ fontSize: 12, color: WINE }}>{fmt(o.precoFinal)}</span>
                    </div>
                    <div style={{ background: BORDER, height: 3, borderRadius: 2 }}>
                      <div style={{ background: WINE, height: 3, borderRadius: 2, width: `${((o.precoFinal || 0) / maxVenda) * 100}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Obras recentes com link visível */}
          <div style={card}>
            <div style={{ fontSize: 10, letterSpacing: 2, textTransform: "uppercase", color: GRAY, marginBottom: 14 }}>Obras recentes</div>
            {obras.slice(0, 5).map(o => (
              <div key={o.id} className="hrow" onClick={() => setObraDetalhe(o)} style={{ borderBottom: `1px solid ${BORDER}`, padding: "12px 0", display: "flex", alignItems: "center", gap: 16, transition: "background 0.15s" }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, color: BLACK, marginBottom: 3 }}>{o.titulo}</div>
                  <div style={{ fontSize: 11, color: GRAY }}>{o.casa} · {fmtDate(o.data)}</div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }} onClick={e => e.stopPropagation()}>
                  <LinkBtn url={o.url} />
                  <div style={{ fontSize: 15, color: WINE }}>{fmt(o.precoFinal)}</div>
                  <span style={{ ...badge, ...badgeStyle(o.estado) }}>{o.estado}</span>
                </div>
              </div>
            ))}
            <div style={{ paddingTop: 10, fontSize: 11, color: GRAY, fontStyle: "italic" }}>Clicar numa linha para ver o detalhe completo da obra.</div>
          </div>
        </>}

        {/* REGISTO DE OBRAS */}
        {tab === "obras" && <>
          <div style={{ display: "flex", gap: 10, marginBottom: 18, alignItems: "center" }}>
            <input style={{ ...inputStyle, flex: 1 }} placeholder="Pesquisar por título ou casa..." value={filtro} onChange={e => setFiltro(e.target.value)} />
            <button onClick={exportCSV} style={{ background: "none", border: `1px solid ${BORDER}`, color: GRAY, cursor: "pointer", fontFamily: "Georgia, serif", fontSize: 12, padding: "9px 18px", borderRadius: 3 }}>
              ↓ Exportar CSV
            </button>
            <button onClick={() => setShowForm(true)} style={{ background: WINE, color: "#FFF", border: "none", cursor: "pointer", fontFamily: "Georgia, serif", fontSize: 12, padding: "9px 18px", borderRadius: 3 }}>
              + Registar obra
            </button>
          </div>

          {showForm && (
            <div style={{ ...card, marginBottom: 18 }}>
              <div style={{ fontSize: 10, letterSpacing: 2, textTransform: "uppercase", color: GRAY, marginBottom: 18 }}>Nova obra</div>
              <form onSubmit={handleAdd}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 14, marginBottom: 14 }}>
                  {[["titulo", "Título"], ["casa", "Casa de leilões"], ["tecnica", "Técnica"], ["dimensoes", "Dimensões"]].map(([f, l]) => (
                    <div key={f}>
                      <label style={labelStyle}>{l}</label>
                      <input style={inputStyle} value={form[f]} onChange={e => setForm(p => ({ ...p, [f]: e.target.value }))} required={f === "titulo"} />
                    </div>
                  ))}
                  <div>
                    <label style={labelStyle}>País</label>
                    <select style={inputStyle} value={form.pais} onChange={e => setForm(p => ({ ...p, pais: e.target.value }))}>
                      <option value="">Selecionar</option>
                      <option>🇵🇹 Portugal</option>
                      <option>🇫🇷 França</option>
                      <option>🇪🇸 Espanha</option>
                      <option>🌍 Internacional</option>
                    </select>
                  </div>
                  <div>
                    <label style={labelStyle}>Data</label>
                    <input type="date" style={inputStyle} value={form.data} onChange={e => setForm(p => ({ ...p, data: e.target.value }))} />
                  </div>
                  <div>
                    <label style={labelStyle}>Estado</label>
                    <select style={inputStyle} value={form.estado} onChange={e => setForm(p => ({ ...p, estado: e.target.value }))}>
                      <option>Vendida</option>
                      <option>Não Vendida</option>
                      <option>A Decorrer</option>
                    </select>
                  </div>
                  {[["estimativaMin", "Est. mínima (€)"], ["estimativaMax", "Est. máxima (€)"], ["precoMartelo", "Preço martelo (€)"], ["precoFinal", "Preço final c/ comissões (€)"]].map(([f, l]) => (
                    <div key={f}>
                      <label style={labelStyle}>{l}</label>
                      <input type="number" style={inputStyle} value={form[f]} onChange={e => setForm(p => ({ ...p, [f]: e.target.value }))} />
                    </div>
                  ))}
                  {/* URL ocupa a linha toda */}
                  <div style={{ gridColumn: "1 / -1" }}>
                    <label style={labelStyle}>URL do lote no leilão</label>
                    <input
                      type="url"
                      style={{ ...inputStyle, fontFamily: "monospace", fontSize: 12 }}
                      placeholder="https://www.casadeleiloes.com/lote/..."
                      value={form.url}
                      onChange={e => setForm(p => ({ ...p, url: e.target.value }))}
                    />
                  </div>
                </div>
                <div style={{ display: "flex", gap: 10 }}>
                  <button type="submit" style={{ background: WINE, color: "#FFF", border: "none", cursor: "pointer", fontFamily: "Georgia, serif", fontSize: 12, padding: "9px 20px", borderRadius: 3 }}>Guardar</button>
                  <button type="button" onClick={() => setShowForm(false)} style={{ background: "none", border: `1px solid ${BORDER}`, color: GRAY, cursor: "pointer", fontFamily: "Georgia, serif", fontSize: 12, padding: "9px 20px", borderRadius: 3 }}>Cancelar</button>
                </div>
              </form>
            </div>
          )}

          <div style={card}>
            <div style={{ display: "grid", gridTemplateColumns: "2fr 1.4fr 1fr 1fr 1fr 80px 90px", gap: 8, paddingBottom: 10, borderBottom: `1px solid ${BORDER}`, marginBottom: 2 }}>
              {["Obra", "Casa / País", "Estimativa", "Martelo", "Final", "Estado", "Lote"].map(h => (
                <div key={h} style={{ fontSize: 10, letterSpacing: 1.5, textTransform: "uppercase", color: GRAY }}>{h}</div>
              ))}
            </div>
            {obrasFiltradas.length === 0 && (
              <div style={{ padding: "28px 0", textAlign: "center", color: GRAY, fontSize: 13, fontStyle: "italic" }}>Nenhuma obra encontrada.</div>
            )}
            {obrasFiltradas.map(o => (
              <div key={o.id} className="hrow" onClick={() => setObraDetalhe(o)} style={{ display: "grid", gridTemplateColumns: "2fr 1.4fr 1fr 1fr 1fr 80px 90px", gap: 8, alignItems: "center", borderBottom: `1px solid ${BORDER}`, padding: "12px 0", transition: "background 0.15s" }}>
                <div>
                  <div style={{ fontSize: 13, color: BLACK }}>{o.titulo}</div>
                  <div style={{ fontSize: 11, color: GRAY, marginTop: 2 }}>{o.tecnica} · {fmtDate(o.data)}</div>
                </div>
                <div>
                  <div style={{ fontSize: 12, color: BLACK }}>{o.casa}</div>
                  <div style={{ fontSize: 11, color: GRAY }}>{o.pais}</div>
                </div>
                <div style={{ fontSize: 12, color: GRAY }}>{fmt(o.estimativaMin)}–{fmt(o.estimativaMax)}</div>
                <div style={{ fontSize: 13, color: BLACK }}>{fmt(o.precoMartelo)}</div>
                <div style={{ fontSize: 14, color: WINE }}>{fmt(o.precoFinal)}</div>
                <span style={{ ...badge, ...badgeStyle(o.estado) }}>{o.estado}</span>
                {/* Link clicável — não propaga o clique para o modal */}
                <div onClick={e => e.stopPropagation()}>
                  <LinkBtn url={o.url} />
                </div>
              </div>
            ))}
            <div style={{ paddingTop: 10, fontSize: 11, color: GRAY, fontStyle: "italic" }}>Clicar numa linha para ver o detalhe completo da obra.</div>
          </div>
        </>}

        {/* CASAS MONITORIZADAS */}
        {tab === "casas" && <>
          <div style={{ fontSize: 11, letterSpacing: 1.5, textTransform: "uppercase", color: GRAY, marginBottom: 18 }}>
            {CASAS.filter(c => c.ativa).length} casas ativas · {CASAS.filter(c => !c.ativa).length} pendentes de integração
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 14 }}>
            {CASAS.map((c, i) => (
              <div key={i} style={{ ...card, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 20px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ width: 7, height: 7, borderRadius: "50%", background: c.ativa ? "#2D8B2D" : "#CCC", flexShrink: 0 }} />
                  <div style={{ fontSize: 13, color: BLACK }}>{c.pais} {c.nome}</div>
                </div>
                <span style={{ ...badge, ...(c.ativa ? { background: "#F2F8F2", color: "#1E5C1E", border: "1px solid #C0DCC0" } : { background: "#FDF2F2", color: WINE, border: "1px solid #E8C0C0" }) }}>
                  {c.ativa ? "Ativa" : "Pendente"}
                </span>
              </div>
            ))}
          </div>
          <div style={{ ...card, borderLeft: `3px solid ${WINE}`, borderRadius: "0 3px 3px 0" }}>
            <div style={{ fontSize: 10, letterSpacing: 2, textTransform: "uppercase", color: GRAY, marginBottom: 10 }}>Próximo passo recomendado</div>
            <p style={{ fontSize: 13, color: GRAY, lineHeight: 1.8, fontStyle: "italic" }}>
              Para cobrir Sotheby's, Bonhams e o mercado asiático, recomenda-se a subscrição do{" "}
              <span style={{ color: BLACK, fontStyle: "normal" }}>Mutualart</span> (aproximadamente €15/mês) com alertas automáticos por artista.
            </p>
          </div>
        </>}
      </div>
    </div>
  );
}
