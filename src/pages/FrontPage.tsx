import {
  Box,
  CircularProgress,
  Fade,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import React, { useCallback, useEffect, useState } from "react";
import { useSnackbar } from "notistack";
//
import {
  FoodEntry,
  createFoodEntry,
  getFoodEntries,
} from "../api/food-entries.service";
import { FoodEntryForm } from "../components/FoodEntryForm";

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

  return (
    <Stack spacing={2} sx={{ p: 4 }}>
      <FoodEntryForm onSubmit={handleSubmit} />
      {isLoading && (
        <Box sx={{ display: "flex", justifyContent: "center" }}>
          <CircularProgress />
        </Box>
      )}
      <Fade in={!isLoading}>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell sx={{ width: "200px" }}>Date & time</TableCell>
                <TableCell>Name</TableCell>
                <TableCell align="right">Calories</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {list.map((item) => (
                <TableRow
                  key={item.id}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell>{item.timestamp.toLocaleString()}</TableCell>
                  <TableCell>{item.name}</TableCell>
                  <TableCell align="right">{item.calories}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Fade>
    </Stack>
  );
}
