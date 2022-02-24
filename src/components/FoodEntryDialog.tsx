import {
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogProps,
  DialogTitle,
  FormControl,
  FormControlLabel,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
} from "@mui/material";
import { DateTimePicker, LoadingButton } from "@mui/lab";
import React, { useCallback, useEffect, useState } from "react";
import { SaveRounded, SendRounded } from "@mui/icons-material";
//
import {
  FoodEntry,
  NewFoodEntry,
  getFoodEntry,
} from "../api/food-entries.service";
import { noop } from "../utils";

type FoodEntryDialogProps = Omit<DialogProps, "onClose"> & {
  editId?: string;
  onAdd?: (newEntry: NewFoodEntry, owner: string) => Promise<boolean>;
  onCloseRequest: () => void;
  onUpdate?: (
    foodEntryId: string,
    update: Partial<FoodEntry>
  ) => Promise<boolean>;
  userIdList: string[];
};

export function FoodEntryDialog(props: FoodEntryDialogProps) {
  const {
    editId,
    open,
    onCloseRequest = noop,
    onAdd = noop,
    onUpdate = noop,
    userIdList,
    ...rest
  } = props;

  const [timestamp, setTimestamp] = useState<Date | null>(null);
  const [timestampHelper, setTimestampHelper] = useState("");
  const [name, setName] = useState("");
  const [nameHelper, setNameHelper] = useState("");
  const [calories, setCalories] = useState("");
  const [caloriesHelper, setCaloriesHelper] = useState("");
  const [userId, setUserId] = useState("");
  const [userIdHelper, setUserIdHelper] = useState("");
  const [cheatDay, setCheatDay] = useState(false);
  const [loading, setLoading] = useState(false);

  const editMode = !!editId;

  useEffect(() => {
    if (editId && open) {
      setLoading(true);

      getFoodEntry(editId).then(
        ({ name, calories, owner, timestamp, cheatDay }) => {
          setCalories(String(calories));
          setName(name);
          setUserId(owner);
          setTimestamp(timestamp);
          setCheatDay(cheatDay);

          setLoading(false);
        }
      );
    }
  }, [
    editId,
    open,
    setName,
    setCalories,
    setUserId,
    setTimestamp,
    setCheatDay,
  ]);

  const handleClick = useCallback(async () => {
    let isValid = true;

    if (!timestamp) {
      setTimestampHelper("Cannot be empty.");
      isValid = false;
    } else {
      setTimestampHelper("");
    }
    if (!calories) {
      setCaloriesHelper("Cannot be empty.");
      isValid = false;
    } else {
      setCaloriesHelper("");
    }
    if (!name) {
      setNameHelper("Cannot be empty.");
      isValid = false;
    } else {
      setNameHelper("");
    }
    if (!userId) {
      setUserIdHelper("Cannot be empty.");
      isValid = false;
    } else {
      setUserIdHelper("");
    }

    if (!isValid) return;

    const newEntry: NewFoodEntry = {
      calories: parseFloat(calories),
      cheatDay,
      name,
      owner: userId,
      timestamp: timestamp as Date,
    };

    setLoading(true);
    const editMode = !!editId;

    let success;

    if (editMode) {
      success = await onUpdate(editId, newEntry);
    } else {
      success = await onAdd(newEntry, userId);
    }
    setLoading(false);

    if (success) {
      setTimestamp(null);
      setName("");
      setCalories("");
      setUserId("");
      onCloseRequest();
    }
  }, [
    editId,
    cheatDay,
    userId,
    name,
    calories,
    timestamp,
    onAdd,
    onUpdate,
    setTimestampHelper,
    setCaloriesHelper,
    setNameHelper,
    setUserIdHelper,
    onCloseRequest,
  ]);

  useEffect(() => {
    if (!open) {
      setUserId("");
      setName("");
      setCalories("");
      setTimestamp(null);

      setUserIdHelper("");
      setTimestampHelper("");
      setCaloriesHelper("");
      setNameHelper("");
    }
  }, [
    open,
    setUserId,
    setName,
    setCalories,
    setTimestamp,
    setUserIdHelper,
    setTimestampHelper,
    setCaloriesHelper,
    setNameHelper,
  ]);

  return (
    <Dialog open={open} onClose={onCloseRequest} {...rest}>
      <DialogTitle>Food entry</DialogTitle>
      <DialogContent sx={{ width: 400 }}>
        <Stack spacing={2} sx={{ pt: 1 }}>
          <FormControl fullWidth error={!!userIdHelper}>
            <InputLabel id="food-entry-user-id">UserId</InputLabel>
            <Select
              labelId="food-entry-user-id"
              value={userId}
              disabled={loading}
              label="UserId"
              onChange={(event) => setUserId(event.target.value)}
            >
              {userIdList.map((userId) => (
                <MenuItem key={userId} value={userId}>
                  {userId}
                </MenuItem>
              ))}
            </Select>
            <FormHelperText>{userIdHelper}</FormHelperText>
          </FormControl>
          <DateTimePicker
            label="Date & time"
            value={timestamp}
            maxDate={new Date()}
            disabled={loading}
            onChange={setTimestamp}
            renderInput={(params) => (
              <TextField
                {...params}
                error={!!timestampHelper}
                required
                fullWidth
                helperText={timestampHelper}
              />
            )}
          />
          <TextField
            error={!!nameHelper}
            required
            disabled={loading}
            fullWidth
            label="Name"
            helperText={nameHelper}
            value={name}
            onChange={(event) => setName(event.target.value)}
          />
          <TextField
            error={!!caloriesHelper}
            required
            fullWidth
            disabled={loading}
            label="Calories"
            helperText={caloriesHelper}
            type="number"
            value={calories}
            onChange={(event) => setCalories(event.target.value)}
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={cheatDay}
                disabled={loading}
                onChange={() => setCheatDay(!cheatDay)}
              />
            }
            label="Cheat-day"
          />
        </Stack>
      </DialogContent>
      <DialogActions sx={{ mr: 2 }}>
        <Button onClick={onCloseRequest}>Cancel</Button>
        <LoadingButton
          onClick={handleClick}
          endIcon={
            editMode ? (
              <SaveRounded fontSize="small" />
            ) : (
              <SendRounded fontSize="small" />
            )
          }
          loading={loading}
          loadingPosition="end"
          sx={{ alignItems: "flex-start" }}
        >
          <span>{editMode ? "Update" : "Add"}</span>
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
}
