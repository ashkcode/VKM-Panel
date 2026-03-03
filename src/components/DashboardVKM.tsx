import { useState } from "react";
import { searchVKM } from "../services/vkmService";
import { importVKMWithRollback } from "../services/vkmImportService";

/**
 * ✅ VKM - Projekt i veçantë (pa Login / pa Dashboard kryesor)
 * - Hapet direkt paneli i VKM (si në foton tënde)
 * - Gati për t’u hostuar si shtojcë (iframe / subpath) në website zyrtar
 *
 * ⚠️ IMPORTANT (Security):
 * - Ky variant është "read-only" nga UI për përdoruesit normal.
 * - Importi (write) është i çaktivizuar default dhe aktivizohet vetëm nëse vendoset:
 *   VITE_VKM_ENABLE_IMPORT=true
 * - Edhe nëse e aktivizon, Firestore Rules duhet ta lejojnë vetëm role=admin (server-side).
 */

// MODEL FINAL SIPAS HEADER-IT REAL
type VKMRecord = {
  id?: string;

  nr_rendor?: string;

  emer1?: string;
  atesi1?: string;
  mbiemer1?: string;

  leja_legalizimit_nr?: string;
  leja_legalizimit_date?: string;

  gjendja_juridike?: string;

  pjesa_takuese_parcele?: string;
  siperfaqja_kalim_pronesie?: string;

  nr_pronareve_kompensohen?: string;

  // SEKSIONI I DYTË – KOMPENSIMI
  emer2?: string;
  atesi?: string;
  mbiemer2?: string;

  nr_pronave?: string;
  nr_pasunise?: string;

  masa_kompensimit?: string;
  cmimi_per_m2?: string;
  shuma_kompensimit?: string;

  seksioni_vecante?: string;
  zona_kadastrale?: string;
};

export default function DashboardVKM() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<VKMRecord[]>([]);

  // IMPORT (opsional) — shfaqet vetëm me ?admin=true në URL
  const isAdmin = new URLSearchParams(window.location.search).get("admin") === "true";
  const ENABLE_IMPORT = isAdmin && String(import.meta.env.VITE_VKM_ENABLE_IMPORT || "").toLowerCase() === "true";
  const [file, setFile] = useState<File | null>(null);
  const [importing, setImporting] = useState(false);

  /* ================= SEARCH ================= */
  const handleSearch = async () => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const data = await searchVKM(query);
    setResults(data);
  };

  /* ================= IMPORT (OPSIONAL) ================= */
  const handleImport = async () => {
    if (!file) {
      alert("Zgjidh një file Excel");
      return;
    }

    try {
      setImporting(true);
      const summary = await importVKMWithRollback(file);

      alert(
        `Import u krye me sukses\n\n` +
          `Rekorde të reja: ${summary.inserted}\n` +
          `Dublikime të anashkaluara: ${summary.duplicates}`
      );
    } catch (e) {
      console.error(e);
      alert("Import dështoi");
    } finally {
      setImporting(false);
    }
  };

  return (
    <div style={{ background: "#f6f7f9", minHeight: "100vh" }}>
      {/* HEADER */}
      <div
        style={{
          background: "linear-gradient(135deg, #0f172a, #020617)",
          color: "white",
          padding: "18px 32px",
          borderRadius: "0 0 16px 16px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h2 style={{ margin: 0 }}>VKM</h2>

        {/* Pa user/role/logout sepse do hostohet si shtojcë */}
        <div style={{ opacity: 0.9, fontSize: 13 }}>
          Panel Kërkimi • VKM
        </div>
      </div>

      {/* CONTENT */}
      <div style={{ padding: 32, maxWidth: 1400, margin: "0 auto" }}>
        {/* BACK BUTTON */}
        <button
          onClick={() => window.history.back()}
          style={{
            marginBottom: 28,
            background: "#334155",
            color: "white",
            border: "none",
            padding: "12px 22px",
            borderRadius: 14,
            cursor: "pointer",
            fontSize: 15,
            fontWeight: 700,
          }}
        >
          ← KTHEHU MBRAPA
        </button>

        {/* IMPORT (opsional) */}
        {ENABLE_IMPORT && (
          <div
            style={{
              background: "white",
              padding: 24,
              borderRadius: 16,
              marginBottom: 24,
            }}
          >
            <h3>Import Excel (Admin)</h3>

            <input
              type="file"
              onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)}
            />

            <button
              onClick={handleImport}
              disabled={importing}
              style={{
                marginLeft: 12,
                background: "#2563eb",
                color: "white",
                border: "none",
                padding: "6px 14px",
                borderRadius: 8,
                cursor: "pointer",
              }}
            >
              {importing ? "Duke importuar..." : "Import"}
            </button>

            <div style={{ marginTop: 10, fontSize: 12, color: "#64748b" }}>
              Aktivizohet vetëm nëse vendos VITE_VKM_ENABLE_IMPORT=true
            </div>
          </div>
        )}

        {/* SEARCH + TABLE */}
        <div
          style={{
            background: "white",
            padding: 24,
            borderRadius: 16,
            overflowX: "auto",
          }}
        >
          {/* SEARCH BAR – PA PREKUR */}
          <div style={{ display: "flex", gap: 10, marginBottom: 8 }}>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Kërko..."
              style={{
                padding: 8,
                flex: 1,
                borderRadius: 8,
                border: "1px solid #cbd5f5",
              }}
            />

            <button
              onClick={handleSearch}
              style={{
                padding: "8px 18px",
                borderRadius: 8,
                border: "none",
                background: "#334155",
                color: "white",
                cursor: "pointer",
                fontWeight: 600,
              }}
            >
              Kërko
            </button>
          </div>

          {/* DESCRIPTION I MADH SIPËR TABELËS */}
          <div
            style={{
              marginBottom: 12,
              marginTop: 6,
              fontSize: 14,
              fontWeight: 700,
              color: "#0f172a",
              textAlign: "center",
            }}
          >
            LISTA EMËRORE E SUBJEKTEVE QË PREKEN NGA NDËRTIMET INFORMALE TË KUALIFIKUARA,
            MASA DHE VLERA E SHPËRBLIMIT
          </div>

          {/* TABELA */}
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              minWidth: 2000,
            }}
          >
            <thead>
              {/* RRESHTI I NDARJES */}
              <tr style={{ background: "#e5e7eb" }}>
                <th
                  style={{ ...th, textAlign: "center", fontWeight: 700, fontSize: 15 }}
                  colSpan={10}
                >
                  Të dhënat e Pasurisë së Legalizuar
                </th>

                <th
                  style={{ ...th, textAlign: "center", fontWeight: 700, fontSize: 15 }}
                  colSpan={10}
                >
                  Kompensimi i Pronarëve
                </th>
              </tr>

              {/* HEADER-I REAL */}
              <tr style={{ background: "#f1f5f9" }}>
                <th style={th}>Nr. Rendor</th>
                <th style={th}>Emër</th>
                <th style={th}>Atësi</th>
                <th style={th}>Mbiemër</th>

                <th style={th}>Leja e legalizimit Nr</th>
                <th style={th}>Leja e legalizimit Date</th>
                <th style={th}>Gjendja juridike</th>
                <th style={th}>Pjesa takuese në parcelë (m²)</th>
                <th style={th}>Sipërfaqja për kalim pronësie (m²)</th>
                <th style={th}>Nr. i pronarëve që kompensohen</th>

                <th style={th}>Emër</th>
                <th style={th}>Atësi</th>
                <th style={th}>Mbiemër</th>
                <th style={th}>Nr. i pronave</th>
                <th style={th}>Nr. i pasurisë</th>
                <th style={th}>Masa e kompensimit (m²)</th>
                <th style={th}>Çmimi (lekë/m²)</th>
                <th style={th}>Shuma kompensimit (lek)</th>
                <th style={th}>Seksioni i veçantë</th>
                <th style={th}>Zona Kadastrale</th>
              </tr>
            </thead>

            <tbody>
              {results.length === 0 ? (
                <tr>
                  <td colSpan={20} style={{ padding: 12 }}>
                    Nuk u gjetën rezultate
                  </td>
                </tr>
              ) : (
                results.map((r, i) => (
                  <tr key={r.id || i}>
                    <td style={td}>{r.nr_rendor}</td>

                    <td style={td}>{r.emer1}</td>
                    <td style={td}>{r.atesi1}</td>
                    <td style={td}>{r.mbiemer1}</td>

                    <td style={td}>{r.leja_legalizimit_nr}</td>
                    <td style={td}>{r.leja_legalizimit_date}</td>
                    <td style={td}>{r.gjendja_juridike}</td>
                    <td style={td}>{r.pjesa_takuese_parcele}</td>
                    <td style={td}>{r.siperfaqja_kalim_pronesie}</td>
                    <td style={td}>{r.nr_pronareve_kompensohen}</td>

                    <td style={td}>{r.emer2}</td>
                    <td style={td}>{r.atesi}</td>
                    <td style={td}>{r.mbiemer2}</td>

                    <td style={td}>{r.nr_pronave}</td>
                    <td style={td}>{r.nr_pasunise}</td>

                    <td style={td}>{r.masa_kompensimit}</td>
                    <td style={td}>{r.cmimi_per_m2}</td>
                    <td style={td}>{r.shuma_kompensimit}</td>

                    <td style={td}>{r.seksioni_vecante}</td>
                    <td style={td}>{r.zona_kadastrale}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

const th = { border: "1px solid #ccc", padding: 8, textAlign: "left" as const };
const td = { border: "1px solid #ccc", padding: 8 };
