import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { FoodEntry, getFoodEntries } from "../api/food-entries.service";
import React, { useCallback, useEffect, useState } from "react";

export function FrontPage() {
  const [list, setList] = useState<FoodEntry[]>([]);

  const fetchFoodEntries = useCallback(async () => {
    const foodEntries = await getFoodEntries();
    setList(foodEntries);
  }, []);

  useEffect(() => {
    fetchFoodEntries();
  }, [fetchFoodEntries]);

  return (
    <Box sx={{ p: 4 }}>
      {/* <Button>Hello world</Button> */}
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell sx={{ width: "200px" }}>Datetime</TableCell>
              <TableCell>Name</TableCell>
              <TableCell align="right">Calories</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {list.map((item) => (
              <TableRow
                key={item.name}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell>
                  {new Date(item.timestamp.seconds).toLocaleString()}
                </TableCell>
                <TableCell>{item.name}</TableCell>
                <TableCell align="right">{item.calories}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
