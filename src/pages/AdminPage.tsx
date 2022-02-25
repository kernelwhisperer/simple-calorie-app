import React, { useCallback, useEffect, useRef, useState } from "react";
import { Stack } from "@mui/material";
import { useSnackbar } from "notistack";
//
import {
  FoodEntry,
  NewFoodEntry,
  createFoodEntry,
  deleteFoodEntry,
  subscribeToFoodEntries,
  updateFoodEntry,
} from "../api/food-entries.service";
import { FoodEntryDialog } from "../components/FoodEntryDialog";
import { FoodEntryListAdmin } from "../components/FoodEntryListAdmin";
import { FoodEntryStats } from "../components/FoodEntryStats";
import { getUserIdList } from "../api/user-profiles.service";
import { useUserContext } from "../context/UserContext";

export function AdminPage() {
  const { enqueueSnackbar } = useSnackbar();
  const [userState] = useUserContext();

  const [isLoading, setIsLoading] = useState(true);
  const [list, setList] = useState<FoodEntry[]>([]);
  const [userIdList, setUserIdList] = useState<string[]>([]);
  const unsubscribeRef = useRef<() => void>();

  useEffect(() => {
    getUserIdList().then(setUserIdList);
  }, []);

  const subscribe = useCallback(async () => {
    if (!userState.user) return;

    unsubscribeRef.current = await subscribeToFoodEntries((list) => {
      setList(list);
      setIsLoading(false);
    });
  }, [unsubscribeRef, setList, setIsLoading, userState]);

  useEffect(() => {
    subscribe();

    return function cleanup() {
      console.log("Unmounting FrontPage");
      if (unsubscribeRef.current) unsubscribeRef.current();
    };
  }, [subscribe, unsubscribeRef]);

  const handleAdd = useCallback(
    async (newEntry: NewFoodEntry, owner: string) => {
      try {
        await createFoodEntry(newEntry, owner);
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

  const handleUpdate = useCallback(
    async (foodEntryId: string, update: Partial<FoodEntry>) => {
      try {
        await updateFoodEntry(foodEntryId, update);
        enqueueSnackbar("Food entry updated", {
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
  const [modalOpen, setModalOpen] = useState(false);
  const [editId, setEditId] = useState("");

  const handleUpdateRequest = useCallback(
    (foodEntryId: string) => {
      setModalOpen(true);
      setEditId(foodEntryId);
    },
    [setModalOpen, setEditId]
  );

  const handleAddRequest = useCallback(() => {
    setModalOpen(true);
    setEditId("");
  }, [setModalOpen, setEditId]);

  return (
    <Stack spacing={2} sx={{ p: 4 }}>
      <FoodEntryStats list={list} />
      <FoodEntryDialog
        onCloseRequest={() => setModalOpen(false)}
        open={modalOpen}
        userIdList={userIdList}
        onAdd={handleAdd}
        editId={editId}
        onUpdate={handleUpdate}
      />
      <FoodEntryListAdmin
        list={list}
        isLoading={isLoading}
        onDelete={handleDelete}
        onUpdateRequest={handleUpdateRequest}
        onAddRequest={handleAddRequest}
      />
    </Stack>
  );
}
