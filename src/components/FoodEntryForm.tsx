import { Button, Stack, TextField } from "@mui/material";
import React, { useCallback, useState } from "react";
import { Spring, animated } from "react-spring";
import DateTimePicker from "@mui/lab/DateTimePicker";
import SendRoundedIcon from "@mui/icons-material/SendRounded";
//
import { NewFoodEntry } from "../api/food-entries.service";
import { noop } from "../utils";

type FoodEntryFormProps = {
  onSubmit?: (newEntry: NewFoodEntry) => Promise<boolean>;
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

    const newEntry: NewFoodEntry = {
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
    <Spring
      config={{
        friction: 50,
        tension: 210,
        velocity: 0.033,
      }}
      delay={1000}
      from={{
        opacity: 0,
        transform: "translate3d(0,-500px,0)",
      }}
      to={{
        opacity: 1,
        transform: "translate3d(0,0px,0)",
      }}
    >
      {(styles) => (
        <animated.div style={styles}>
          <Stack
            direction="row"
            spacing={2}
            justifyContent="center"
            alignItems="baseline"
          >
            <DateTimePicker
              label="Date & time"
              value={timestamp}
              maxDate={new Date()}
              onChange={setTimestamp}
              renderInput={(params) => (
                <TextField
                  sx={{ width: 260 }}
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
            <Button onClick={handleClick} endIcon={<SendRoundedIcon />}>
              Add food entry
            </Button>
          </Stack>
        </animated.div>
      )}
    </Spring>
  );
}
