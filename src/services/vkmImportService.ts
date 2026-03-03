import * as XLSX from "xlsx";
import { addVKMRecord, checkDuplicateVKM } from "./dbServiceVKM";

export async function importVKMWithRollback(file: File) {
  const buffer = await file.arrayBuffer();
  const workbook = XLSX.read(buffer, { type: "array" });

  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];

  // Lexo rreshtat si objekte sipas header-it
  const rows: any[] = XLSX.utils.sheet_to_json(sheet, { defval: "" });

  let inserted = 0;
  let duplicates = 0;

  for (const row of rows) {
    // Mapim 1-me-1 sipas strukturës finale
    const record = {
      // ===== SEKSIONI 1 =====
      nr_rendor: String(row["Nr. Rendor"] || "").trim(),

      emer1: String(row["Emër"] || "").trim(),
      atesi1: String(row["Atësi"] || "").trim(),          // 🆕
      mbiemer1: String(row["Mbiemër"] || "").trim(),

      leja_legalizimit_nr: String(row["Leja e legalizimit Nr"] || "").trim(),
      leja_legalizimit_date: formatDate(row["Leja e legalizimit Date"]),

      gjendja_juridike: String(row["Gjendja juridike (pronesia)"] || "").trim(),

      pjesa_takuese_parcele: String(row["Pjesa takuese në parcelë(m²)"] || "").trim(),
      siperfaqja_kalim_pronesie: String(row["Sipërfaqja për kalim pronësie(m²)"] || "").trim(),

      nr_pronareve_kompensohen: String(row["Numri I Pronareve qe kompensohen"] || "").trim(),

      // ===== SEKSIONI 2 =====
      emer2: String(row["Emër_1"] || row["Emër (2)"] || "").trim(),
      atesi: String(row["Atësi_1"] || row["Atësi (2)"] || "").trim(),
      mbiemer2: String(row["Mbiemër_1"] || row["Mbiemër (2)"] || "").trim(),

      nr_pronave: String(row["Nr. i pronave"] || "").trim(),
      nr_pasunise: String(row["Nr. i pasurisë"] || "").trim(),

      masa_kompensimit: String(row["Masa e kompensimit (m²)"] || "").trim(),
      cmimi_per_m2: String(row["Çmimi(leke/m²)"] || "").trim(),
      shuma_kompensimit: String(row["Shuma - Vlera e kompensimit(lek)"] || "").trim(),

      seksioni_vecante: String(row["Seksioni i veçante"] || "").trim(),
      zona_kadastrale: String(row["Zona Kadastrale"] || "").trim(),
    };

    // Kontroll dublikimi (p.sh sipas nr_rendor)
    const isDuplicate = await checkDuplicateVKM(record.nr_rendor);

    if (isDuplicate) {
      duplicates++;
      continue;
    }

    await addVKMRecord(record);
    inserted++;
  }

  return { inserted, duplicates };
}

/* ================= HELPER PËR FORMAT DATE ================= */
function formatDate(value: any): string {
  if (!value) return "";

  // Nëse është number (Excel date)
  if (typeof value === "number") {
    const date = XLSX.SSF.parse_date_code(value);
    if (!date) return "";
    return pad(date.d) + "." + pad(date.m) + "." + date.y;
  }

  // Nëse është string, përpiqu ta normalizosh
  const s = String(value).trim();

  // pranon 2024-02-01, 01/02/2024, 1.2.2024, etj
  const parts = s.replace(/[-/]/g, ".").split(".");
  if (parts.length === 3) {
    const d = pad(parts[0]);
    const m = pad(parts[1]);
    const y = parts[2];
    return `${d}.${m}.${y}`;
  }

  return s;
}

function pad(v: any) {
  return String(v).padStart(2, "0");
}
