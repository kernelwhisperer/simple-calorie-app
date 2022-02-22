import React, { useCallback, useEffect, useState } from "react";
import { Stack } from "@mui/material";
import { useSnackbar } from "notistack";
//
import {
  FoodEntry,
  createFoodEntry,
  deleteFoodEntry,
  getFoodEntries,
} from "../api/food-entries.service";
import { FoodEntryForm } from "../components/FoodEntryForm";
import { FoodEntryList } from "../components/FoodEntryList";

export function FrontPage() {
  const { enqueueSnackbar } = useSnackbar();

  const [isLoading, setIsLoading] = useState(true);
  const [list, setList] = useState<FoodEntry[]>([]);

  const fetchFoodEntries = useCallback(async () => {
    setIsLoading(true);
    const foodEntries = await getFoodEntries();
    setList(foodEntries);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    fetchFoodEntries();
  }, [fetchFoodEntries]);

  const handleSubmit = useCallback(
    async (newEntry: FoodEntry) => {
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

  return (
    <Stack spacing={2} sx={{ p: 4 }}>
      <FoodEntryForm onSubmit={handleSubmit} />
      <FoodEntryList
        list={list}
        isLoading={isLoading}
        onDelete={handleDelete}
      />
    </Stack>
  );
}
