import {
  Timestamp,
  addDoc,
  collection,
  getDocs,
  getFirestore,
} from "firebase/firestore";

export interface FoodEntry {
  calories: number;
  id?: string;
  name: string;
  timestamp: Date;
}

export async function getFoodEntries() {
  const db = getFirestore();
  const foodEntriesCol = collection(db, "food-entries");
  const foodEntriesSnapshot = await getDocs(foodEntriesCol);
  return foodEntriesSnapshot.docs.map((doc) => {
    const foodEntry = doc.data();

    return {
      id: doc.id,
      ...foodEntry,
      timestamp: foodEntry.timestamp.toDate(),
    } as FoodEntry;
  });
}

export async function createFoodEntry(newEntry: FoodEntry) {
  const data = {
    ...newEntry,
    timestamp: Timestamp.fromDate(newEntry.timestamp),
  };

  const db = getFirestore();
  const docRef = await addDoc(collection(db, "food-entries"), data);
  console.log("Document written with ID: ", docRef.id);
  return docRef.id;
}
