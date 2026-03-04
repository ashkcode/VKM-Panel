import { collection, addDoc } from "firebase/firestore";
import { db } from "../firebase";

const COL = "vkm_records";

<<<<<<< HEAD
/* ================= NORMALIZE ================= */
function normalize(v: any): string {
  if (!v) return "";
  return String(v)
    .toLowerCase()
    .replace(/\u00A0/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/* ================= GJENERO SEARCH TOKENS ================= */
function buildSearchTokens(record: any): string[] {
  const fields = [
    record.nr_rendor,
    record.emer1,
    record.atesi1,
    record.mbiemer1,
    record.leja_legalizimit_nr,
    record.emer2,
    record.atesi,
    record.mbiemer2,
    record.nr_pronave,
    record.nr_pasunise,
    record.zona_kadastrale,
  ];

  const tokens = new Set<string>();
  for (const f of fields) {
    const norm = normalize(f);
    if (norm) {
      for (const word of norm.split(" ")) {
        if (word) tokens.add(word);
      }
    }
  }
  return Array.from(tokens);
}

=======
>>>>>>> 2656b6b (Ndryshon text)
/* ================= SHTO REKORD ================= */
/*
  Çdo record ruhet me ID automatike nga Firestore.
  Nuk bëhet më kontroll dublikimi.
*/
export async function addVKMRecord(record: any) {
  await addDoc(collection(db, COL), {
    ...record,
<<<<<<< HEAD
    searchTokens: buildSearchTokens(record),
=======
>>>>>>> 2656b6b (Ndryshon text)
    createdAt: new Date(),
  });
}

/* ================= KONTROLL DUBLIKIMI ================= */
/*
  VKM nuk përdor më duplicate check.
  Ky funksion mbahet vetëm për kompatibilitet
  me kodin ekzistues të importit.
*/
export async function checkDuplicateVKM(): Promise<boolean> {
  return false;
}
