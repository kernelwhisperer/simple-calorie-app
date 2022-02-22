import { Button, Stack, TextField } from "@mui/material";
import React, { useCallback, useState } from "react";
import DateTimePicker from "@mui/lab/DateTimePicker";
import SendIcon from "@mui/icons-material/Send";
//
import { FoodEntry } from "../api/food-entries.service";
import { noop } from "../utils";

type FoodEntryFormProps = {
  onSubmit?: (newEntry: FoodEntry) => Promise<boolean>;
};

export function FoodEntryForm(props: FoodEntryFormProps) {
  const { onSubmit = noop } = props;

  const [timestamp, setTimestamp] = useState<Date | null>(null);
  const [timestampHelper, setTimestampHelper] = useState("");
  const [name, setName] = useState("");
  const [nameHelper, setNameHelper] = useState("");
  const [calories, setCalories] = useState("");
  const [caloriesHelper, setCaloriesHelper] = useState("");

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

    if (!isValid) return;

    const newEntry = {
      calories: parseFloat(calories),
      name,
      timestamp: timestamp as Date,
    };

    const success = await onSubmit(newEntry);

    if (success) {
      setTimestamp(null);
      setName("");
      setCalories("");
    }
  }, [
    onSubmit,
    name,
    calories,
    timestamp,
    setTimestampHelper,
    setCaloriesHelper,
    setNameHelper,
  ]);

  return (
    <Stack
      direction="row"
      spacing={2}
      justifyContent="center"
      alignItems="baseline"
    >
      <DateTimePicker
        label="Date & time"
        value={timestamp}
        onChange={setTimestamp}
        renderInput={(params) => (
          <TextField
            {...params}
            error={!!timestampHelper}
            required
            helperText={timestampHelper}
          />
        )}
      />
      <TextField
        error={!!nameHelper}
        required
        label="Name"
        helperText={nameHelper}
        value={name}
        onChange={(event) => setName(event.target.value)}
      />
      <TextField
        error={!!caloriesHelper}
        required
        label="Calories"
        helperText={caloriesHelper}
        type="number"
        value={calories}
        onChange={(event) => setCalories(event.target.value)}
      />
      <Button onClick={handleClick} endIcon={<SendIcon />}>
        Add food entry
      </Button>
    </Stack>
  );
}
