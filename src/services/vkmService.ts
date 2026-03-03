import {
  collection,
  getDocs,
  query,
  where,
  limit
} from "firebase/firestore";
import { db } from "../firebase";

/* =======================================================
   SEARCH VKM
   ======================================================= */

export async function searchVKM(text: string) {
  const term = normalize(text);

  if (!term) return [];

  // ndajmë tekstin e kërkimit në fjalë
  const tokens = term.split(" ").filter(Boolean);

  // Firestore kërkon vetëm me token e parë
  // (ul reads nga 88k -> disa dhjetra)
  const firstToken = tokens[0];

  const q = query(
    collection(db, "vkm_records"),
    where("searchTokens", "array-contains", firstToken),
    limit(200)
  );

  const snap = await getDocs(q);

  const results: any[] = [];

  snap.forEach((docSnap) => {
    const d = docSnap.data();

    // krijojmë tekstin për filtrimin final
    const haystack = normalize([
      d.nr_rendor,
      d.leja_legalizimit_nr,

      d.emer1,
      d.atesi1,
      d.mbiemer1,

      d.emer2,
      d.atesi,
      d.mbiemer2,

      d.nr_pronave,
      d.nr_pasunise,
      d.zona_kadastrale
    ].join(" "));

    // kontrollojmë që të gjitha fjalët ekzistojnë
    const allMatch = tokens.every(t =>
      haystack.includes(t)
    );

    if (allMatch) {
      results.push({
        id: docSnap.id,
        ...d
      });
    }
  });

  return results;
}

/* =======================================================
   NORMALIZE
   ======================================================= */

function normalize(v: any): string {
  if (!v) return "";

  return String(v)
    .toLowerCase()
    .replace(/\u00A0/g, " ") // excel non-breaking space
    .replace(/\n/g, " ")
    .replace(/\r/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}
