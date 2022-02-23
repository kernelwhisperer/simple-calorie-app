import {
  DocumentData,
  Timestamp,
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  getFirestore,
  onSnapshot,
  orderBy,
  query,
  setDoc,
} from "firebase/firestore";

export interface FoodEntry {
  calories: number;
  cheatDay: boolean;
  id: string;
  name: string;
  timestamp: Date;
}
export interface NewFoodEntry {
  calories: number;
  name: string;
  timestamp: Date;
}

export async function getFoodEntries() {
  const db = getFirestore();
  const foodEntriesCol = collection(db, "food-entries");
  const foodEntriesSnapshot = await getDocs(foodEntriesCol);
  return foodEntriesSnapshot.docs.map(mapDocToFoodEntry);
}

export async function createFoodEntry(newEntry: NewFoodEntry) {
  const data = {
    ...newEntry,
    cheatDay: false,
    timestamp: Timestamp.fromDate(newEntry.timestamp),
  };

  const db = getFirestore();
  const docRef = await addDoc(collection(db, "food-entries"), data);
  console.log("Document written with ID: ", docRef.id);
  return docRef.id;
}

export async function updateFoodEntry(
  foodEntryId: string,
  update: Partial<FoodEntry>
) {
  const db = getFirestore();
  const foodEntryRef = doc(db, "food-entries", foodEntryId);
  await setDoc(foodEntryRef, update, { merge: true });
  console.log("Document updated with ID: ", foodEntryId);
  return foodEntryId;
}

export async function deleteFoodEntry(foodEntryId: string) {
  const db = getFirestore();
  const foodEntryRef = doc(db, "food-entries", foodEntryId);
  await deleteDoc(foodEntryRef);
  console.log("Document deleted with ID: ", foodEntryId);
  return foodEntryId;
}

export type onListUpdateType = (list: FoodEntry[]) => void;

export async function subscribeToFoodEntries(onListUpdate: onListUpdateType) {
  const db = getFirestore();
  const foodEntriesCol = collection(db, "food-entries");
  const q = query(foodEntriesCol, orderBy("timestamp", "desc"));

  const unsubscribe = onSnapshot(q, (querySnapshot) => {
    onListUpdate(querySnapshot.docs.map(mapDocToFoodEntry));
  });

  return unsubscribe;
}

export function mapDocToFoodEntry(doc: DocumentData) {
  const foodEntry = doc.data();

  return {
    id: doc.id,
    ...foodEntry,
    timestamp: foodEntry.timestamp.toDate(),
  } as FoodEntry;
}
