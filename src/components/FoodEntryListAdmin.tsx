import {
  AddRounded,
  CancelRounded,
  DeleteRounded,
  EditRounded,
  FilterListRounded,
} from "@mui/icons-material";
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
} from "@mui/material";
import React, { useMemo, useState } from "react";
import { add, compareAsc } from "date-fns";
import { animated, useSpring, useTransition } from "react-spring";
import { DateRangePicker } from "@mui/lab";
//
import { FoodEntry } from "../api/food-entries.service";
import { noop } from "../utils";

type FoodEntryListProps = {
  isLoading: boolean;
  list: FoodEntry[];
  onAddRequest?: () => void;
  onDelete?: (foodEntryId: string) => Promise<boolean>;
  onUpdateRequest?: (foodEntryId: string) => void;
};

const AnimatedTableRow = animated(TableRow);

export function FoodEntryListAdmin(props: FoodEntryListProps) {
  const {
    isLoading,
    list,
    onAddRequest = noop,
    onDelete = noop,
    onUpdateRequest = noop,
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

  const rows = transition((props, item) => {
    return (
      <AnimatedTableRow
        key={item.id}
        style={props}
        sx={{
          "&:last-child td, &:last-child th": { border: 0 },
        }}
      >
        <TableCell>
          <span>{item.timestamp.toLocaleString()}</span>
        </TableCell>
        <TableCell>{item.owner}</TableCell>
        <TableCell>{item.name}</TableCell>
        <TableCell align="right">{item.calories}</TableCell>
        <TableCell align="right">
          <Checkbox color="primary" checked={item.cheatDay} disabled />
        </TableCell>
        <TableCell align="right">
          <Stack direction="row">
            <IconButton
              aria-label="update"
              onClick={() => {
                onUpdateRequest(item.id);
              }}
            >
              <EditRounded />
            </IconButton>
            <IconButton
              aria-label="delete"
              onClick={() => {
                onDelete(item.id);
              }}
            >
              <DeleteRounded />
            </IconButton>
          </Stack>
        </TableCell>
      </AnimatedTableRow>
    );
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
                  <Stack
                    direction="row"
                    alignItems="baseline"
                    spacing={2}
                    sx={{ mr: 1 }}
                  >
                    <TextField size="small" {...startProps} />
                    <span>to</span>
                    <TextField size="small" {...endProps} sx={{ mr: 2 }} />
                  </Stack>
                </Fade>
              )}
            />
            {filtering ? (
              <Tooltip title="Cancel">
                <IconButton
                  aria-label="cancel filtering"
                  onClick={() => setFiltering(false)}
                >
                  <CancelRounded />
                </IconButton>
              </Tooltip>
            ) : (
              <Tooltip title="Filter list">
                <IconButton
                  aria-label="filter list"
                  onClick={() => setFiltering(true)}
                >
                  <FilterListRounded />
                </IconButton>
              </Tooltip>
            )}
            <Tooltip title="Add food entry">
              <IconButton aria-label="add food entry" onClick={onAddRequest}>
                <AddRounded />
              </IconButton>
            </Tooltip>
          </Toolbar>
          <TableContainer>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ width: "208px" }}>Date & time</TableCell>
                  <TableCell sx={{ width: "272px" }}>UserId</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell align="right">Calories</TableCell>
                  <TableCell align="right" sx={{ width: "120px" }}>
                    Cheat-day
                  </TableCell>
                  <TableCell align="right" sx={{ width: "72px" }}></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>{rows}</TableBody>
            </Table>
          </TableContainer>
          {rows.props.children.length === 0 && (
            <Stack alignItems="center" sx={{ p: 3 }}>
              <Fade in>
                <Typography variant="overline" color="text.secondary">
                  Nothing to see here!
                </Typography>
              </Fade>
            </Stack>
          )}
        </Paper>
      </animated.div>
    </>
  );
}
