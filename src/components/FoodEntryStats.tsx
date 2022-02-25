import { Paper, Stack, Typography } from "@mui/material";
import React, { useMemo } from "react";
import { compareAsc, endOfDay, endOfWeek, startOfWeek, sub } from "date-fns";
//
import { FoodEntry } from "../api/food-entries.service";

type FoodEntryStatsProps = {
  list: FoodEntry[];
};

export function FoodEntryStats(props: FoodEntryStatsProps) {
  const { list } = props;

  const entriesPastSevenDays = useMemo(() => {
    const startDate = sub(endOfDay(new Date()), { days: 7 });
    return list.filter((item) => compareAsc(startDate, item.timestamp) < 0);
  }, [list]);

  const entriesLastWeek = useMemo(() => {
    const startDate = sub(startOfWeek(new Date()), { days: 7 });
    const endDate = sub(endOfWeek(new Date()), { days: 7 });

    return list.filter(
      (item) =>
        compareAsc(startDate, item.timestamp) < 0 &&
        compareAsc(item.timestamp, endDate) < 0
    );
  }, [list]);

  const caloriesAddedPerUserPastSevenDays = useMemo(() => {
    const caloriesAddedPerUser = {};

    entriesPastSevenDays.forEach((entry) => {
      // init
      if (!caloriesAddedPerUser[entry.owner])
        caloriesAddedPerUser[entry.owner] = 0;
      // reduce
      caloriesAddedPerUser[entry.owner] += entry.calories;
    });

    return caloriesAddedPerUser;
  }, [entriesPastSevenDays]);

  const averageCaloriesAddedPerUserPastSevenDays = useMemo(() => {
    const listOfUsers = Object.keys(caloriesAddedPerUserPastSevenDays);

    return (
      listOfUsers.reduce(
        (prev, user) => prev + caloriesAddedPerUserPastSevenDays[user],
        0
      ) / listOfUsers.length
    );
  }, [caloriesAddedPerUserPastSevenDays]);

  return (
    <Stack direction="row" spacing={2}>
      <Paper sx={{ flex: 1, p: 4 }}>
        <Stack alignItems="center">
          <Typography variant="subtitle2" color="text.secondary">
            Number of entries in the last 7 days:
          </Typography>
          <Typography variant="h4">{entriesPastSevenDays.length}</Typography>
        </Stack>
      </Paper>
      <Paper sx={{ flex: 1, p: 4 }}>
        <Stack alignItems="center">
          <Typography variant="subtitle2" color="text.secondary">
            Number of entries last week:
          </Typography>
          <Typography variant="h4">{entriesLastWeek.length}</Typography>
        </Stack>
      </Paper>
      <Paper sx={{ flex: 1, p: 4 }}>
        <Stack alignItems="center">
          <Typography variant="subtitle2" color="text.secondary">
            Average number of calories per user in the last 7 days:
          </Typography>
          <Typography variant="h4">
            {averageCaloriesAddedPerUserPastSevenDays}
          </Typography>
        </Stack>
      </Paper>
    </Stack>
  );
}
