import { collection, getDocs, getFirestore } from "firebase/firestore";

export interface FoodEntry {
  calories: number;
  name: string;
  timestamp: {
    nanoseconds: number;
    seconds: number;
  };
}

export async function getFoodEntries() {
  const db = getFirestore();
  const foodEntriesCol = collection(db, "food-entries");
  const foodEntriesSnapshot = await getDocs(foodEntriesCol);
  return foodEntriesSnapshot.docs.map((doc) => doc.data() as FoodEntry);
}
