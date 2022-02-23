import {
  Box,
  CircularProgress,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import DeleteIconRounded from "@mui/icons-material/DeleteRounded";
import React from "react";
//
import { animated, useSpring, useTransition } from "react-spring";
import { FoodEntry } from "../api/food-entries.service";
import { noop } from "../utils";

type FoodEntryListProps = {
  isLoading: boolean;
  list: FoodEntry[];
  onDelete?: (foodEntryId: string) => Promise<boolean>;
};

const AnimatedTableRow = animated(TableRow);

export function FoodEntryList(props: FoodEntryListProps) {
  const { isLoading, list, onDelete = noop } = props;

  const styles = useSpring({
    config: { friction: 20 },
    delay: 200,
    opacity: isLoading ? 0 : 1,
    transform: isLoading ? "scale(0.75, 0.75)" : "scale(1, 1)",
  });

  const transition = useTransition(list, {
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
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell sx={{ width: "200px" }}>Date & time</TableCell>
                <TableCell>Name</TableCell>
                <TableCell align="right">Calories</TableCell>
                <TableCell align="right" sx={{ width: "160px" }}></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {transition((props, item) => (
                <AnimatedTableRow
                  key={item.id}
                  style={props}
                  sx={{
                    overflow: "hidden",
                    "&:last-child td, &:last-child th": { border: 0 },
                  }}
                >
                  <TableCell>{item.timestamp.toLocaleString()}</TableCell>
                  <TableCell>{item.name}</TableCell>
                  <TableCell align="right">{item.calories}</TableCell>
                  <TableCell align="right">
                    <IconButton
                      aria-label="delete"
                      onClick={() => {
                        if (!item.id) return;
                        onDelete(item.id);
                      }}
                    >
                      <DeleteIconRounded />
                    </IconButton>
                  </TableCell>
                </AnimatedTableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </animated.div>
    </>
  );
}
