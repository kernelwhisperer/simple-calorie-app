import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Stack } from "@mui/material";
import { useSnackbar } from "notistack";
//
import {
  FoodEntry,
  NewFoodEntry,
  createFoodEntry,
  deleteFoodEntry,
  subscribeToFoodEntries,
} from "../api/food-entries.service";
import { FoodEntryForm } from "../components/FoodEntryForm";
import { FoodEntryList } from "../components/FoodEntryList";
import { format } from "date-fns";
import { useUserContext } from "../context/UserContext";

export function FrontPage() {
  const { enqueueSnackbar } = useSnackbar();

  const [isLoading, setIsLoading] = useState(true);
  const [list, setList] = useState<FoodEntry[]>([]);
  const unsubscribeRef = useRef<() => void>();

  const subscribe = useCallback(async () => {
    unsubscribeRef.current = await subscribeToFoodEntries((list) => {
      setList(list);
      setIsLoading(false);
    });
  }, [unsubscribeRef, setList, setIsLoading]);

  useEffect(() => {
    subscribe();

    return function cleanup() {
      console.log("Unmounting FrontPage");
      if (unsubscribeRef.current) unsubscribeRef.current();
    };
  }, [subscribe, unsubscribeRef]);

  const handleSubmit = useCallback(
    async (newEntry: NewFoodEntry) => {
      try {
        await createFoodEntry(newEntry);
        enqueueSnackbar("New food entry saved", {
          variant: "success",
        });
        return true;
      } catch (err) {
        if (err instanceof TypeError) {
          enqueueSnackbar(err.toString(), {
            variant: "error",
          });
        }
      }
      return false;
    },
    [enqueueSnackbar]
  );

  const handleDelete = useCallback(
    async (foodEntryId: string) => {
      try {
        await deleteFoodEntry(foodEntryId);
        enqueueSnackbar("Food entry deleted", {
          variant: "info",
        });
        return true;
      } catch (err) {
        if (err instanceof TypeError) {
          enqueueSnackbar(err.toString(), {
            variant: "error",
          });
        }
      }
      return false;
    },
    [enqueueSnackbar]
  );

  const calorieMap = useMemo(() => {
    const calorieMap = {};

    list.forEach((item) => {
      const date = format(item.timestamp, "yyyy-MM-dd");
      calorieMap[date] = (calorieMap[date] || 0) + item.calories;
    });

    return calorieMap;
  }, [list]);

  const [userState] = useUserContext();

  return (
    <Stack spacing={2} sx={{ p: 4 }}>
      <FoodEntryForm onSubmit={handleSubmit} />
      <FoodEntryList
        list={list}
        isLoading={isLoading}
        onDelete={handleDelete}
        calorieMap={calorieMap}
        calorieLimit={userState.profile?.calorieLimit}
      />
    </Stack>
  );
}
