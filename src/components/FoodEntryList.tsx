import {
  Box,
  Checkbox,
  CircularProgress,
  Fade,
  IconButton,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Toolbar,
  Tooltip,
  Typography,
  alpha,
} from "@mui/material";
import {
  CancelRounded,
  DeleteRounded,
  FilterListRounded,
  WarningRounded,
} from "@mui/icons-material";
import React, { useMemo, useState } from "react";
import { add, compareAsc, format } from "date-fns";
import { animated, useSpring, useTransition } from "react-spring";
import { DateRangePicker } from "@mui/lab";
//
import { FoodEntry } from "../api/food-entries.service";
import { noop } from "../utils";

type FoodEntryListProps = {
  calorieLimit?: number;
  calorieMap: Record<string, number>;
  isLoading: boolean;
  list: FoodEntry[];
  onDelete?: (foodEntryId: string) => Promise<boolean>;
  onUpdate?: (
    foodEntryId: string,
    update: Partial<FoodEntry>
  ) => Promise<boolean>;
};

const AnimatedTableRow = animated(TableRow);

const warningStyle = (theme) =>
  alpha(theme.palette.warning.main, theme.palette.action.activatedOpacity);

export function FoodEntryList(props: FoodEntryListProps) {
  const {
    calorieLimit = 0,
    calorieMap,
    isLoading,
    list,
    onDelete = noop,
    onUpdate = noop,
  } = props;

  const [filtering, setFiltering] = useState(false);
  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([
    null,
    null,
  ]);

  const filteredList = useMemo(() => {
    return list.filter((item) => {
      const [fromDate, toDate] = dateRange;

      if (fromDate && compareAsc(fromDate, item.timestamp) > 0) {
        return false;
      }
      if (toDate && compareAsc(item.timestamp, add(toDate, { days: 1 })) > 0) {
        return false;
      }
      return true;
    });
  }, [list, dateRange]);

  const styles = useSpring({
    config: { friction: 20 },
    delay: 200,
    opacity: isLoading ? 0 : 1,
    transform: isLoading ? "scale(0.75, 0.75)" : "scale(1, 1)",
  });

  const transition = useTransition(filtering ? filteredList : list, {
    config: { friction: 20 },
    delay: 200,
    enter: { opacity: 1 },
    from: { opacity: 0 },
    keys: (item) => item.id,
    leave: { opacity: 0 },
    trail: 400 / list.length,
  });

  return (
    <>
      {isLoading && (
        <Box sx={{ display: "flex", justifyContent: "center" }}>
          <CircularProgress />
        </Box>
      )}
      <animated.div style={styles}>
        <Paper>
          <Toolbar sx={{ p: { sm: 2 } }}>
            <Typography variant="h6" sx={{ flex: "1 1 100%" }}>
              Food entries
            </Typography>
            <DateRangePicker
              startText="From"
              endText="To"
              maxDate={new Date()}
              value={dateRange}
              onChange={setDateRange}
              renderInput={(startProps, endProps) => (
                <Fade in={filtering}>
                  <Stack direction="row" alignItems="baseline" spacing={2}>
                    <TextField size="small" {...startProps} />
                    <span>to</span>
                    <TextField size="small" {...endProps} sx={{ mr: 2 }} />
                  </Stack>
                </Fade>
              )}
            />
            {filtering ? (
              <Tooltip title="Cancel">
                <IconButton onClick={() => setFiltering(false)}>
                  <CancelRounded />
                </IconButton>
              </Tooltip>
            ) : (
              <Tooltip title="Filter list">
                <IconButton onClick={() => setFiltering(true)}>
                  <FilterListRounded />
                </IconButton>
              </Tooltip>
            )}
          </Toolbar>
          <TableContainer>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ width: "208px" }}>Date & time</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell align="right">Calories</TableCell>
                  <TableCell align="right" sx={{ width: "120px" }}>
                    Cheat-day
                  </TableCell>
                  <TableCell align="right" sx={{ width: "72px" }}></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {transition((props, item) => {
                  const calorieDelta =
                    calorieMap[format(item.timestamp, "yyyy-MM-dd")] -
                    calorieLimit;

                  return (
                    <AnimatedTableRow
                      key={item.id}
                      style={props}
                      sx={{
                        "&:last-child td, &:last-child th": { border: 0 },
                        bgcolor: calorieDelta > 0 ? warningStyle : "",
                      }}
                    >
                      <TableCell>
                        <Stack direction="row" alignItems="center" spacing={1}>
                          {calorieDelta > 0 && (
                            <Tooltip
                              title={`You have exceeded the calorie limit for the day by ${calorieDelta}`}
                            >
                              <WarningRounded
                                color="warning"
                                fontSize="small"
                              />
                            </Tooltip>
                          )}
                          <span>{item.timestamp.toLocaleString()}</span>
                        </Stack>
                      </TableCell>
                      <TableCell>{item.name}</TableCell>
                      <TableCell align="right">{item.calories}</TableCell>
                      <TableCell align="right">
                        <Checkbox
                          color="primary"
                          checked={item.cheatDay}
                          onChange={() => {
                            onUpdate(item.id, { cheatDay: !item.cheatDay });
                          }}
                          inputProps={{
                            "aria-label": "mark as cheat-day",
                          }}
                        />
                      </TableCell>
                      <TableCell align="right">
                        <IconButton
                          aria-label="delete"
                          onClick={() => {
                            if (!item.id) return;
                            onDelete(item.id);
                          }}
                        >
                          <DeleteRounded />
                        </IconButton>
                      </TableCell>
                    </AnimatedTableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </animated.div>
    </>
  );
}
