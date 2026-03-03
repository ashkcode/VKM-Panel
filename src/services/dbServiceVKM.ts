import { collection, addDoc } from "firebase/firestore";
import { db } from "../firebase";

const COL = "vkm_records";

/* ================= SHTO REKORD ================= */
/*
  Çdo record ruhet me ID automatike nga Firestore.
  Nuk bëhet më kontroll dublikimi.
*/
export async function addVKMRecord(record: any) {
  await addDoc(collection(db, COL), {
    ...record,
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
