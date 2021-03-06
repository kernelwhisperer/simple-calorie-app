import {
  DocumentData,
  Timestamp,
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  onSnapshot,
  orderBy,
  query,
  setDoc,
  where,
} from "firebase/firestore";

export interface FoodEntry {
  calories: number;
  cheatDay: boolean;
  id: string;
  name: string;
  owner: string;
  timestamp: Date;
}
export interface NewFoodEntry {
  calories: number;
  cheatDay?: boolean;
  name: string;
  owner?: string;
  timestamp: Date;
}

export async function getFoodEntries(userId?: string) {
  if (!userId) throw new Error("UserId missing");

  const db = getFirestore();
  const foodEntriesCol = collection(db, "food-entries");
  const q = query(foodEntriesCol, where("owner", "==", userId));
  const foodEntriesSnapshot = await getDocs(q);
  return foodEntriesSnapshot.docs.map(mapDocToFoodEntry);
}

export async function getFoodEntry(foodEntryId?: string) {
  if (!foodEntryId) throw new Error("FoodEntryId missing");

  const db = getFirestore();
  const foodEntryRef = doc(db, "food-entries", foodEntryId);
  const foodEntry = await getDoc(foodEntryRef);
  return mapDocToFoodEntry(foodEntry);
}

export async function createFoodEntry(newEntry: NewFoodEntry, userId?: string) {
  if (!userId) throw new Error("UserId missing");

  const data = {
    cheatDay: false,
    ...newEntry,
    owner: userId,
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

export async function subscribeToFoodEntries(
  onListUpdate: onListUpdateType,
  userId?: string
) {
  const db = getFirestore();
  const foodEntriesCol = collection(db, "food-entries");

  const constraints = [orderBy("timestamp", "desc")];
  if (userId) constraints.push(where("owner", "==", userId));

  const q = query(foodEntriesCol, ...constraints);

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
