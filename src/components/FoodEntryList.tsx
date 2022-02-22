import {
  Box,
  CircularProgress,
  Fade,
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
import { FoodEntry } from "../api/food-entries.service";
import { noop } from "../utils";

type FoodEntryListProps = {
  isLoading: boolean;
  list: FoodEntry[];
  onDelete?: (foodEntryId: string) => Promise<boolean>;
};

export function FoodEntryList(props: FoodEntryListProps) {
  const { isLoading, list, onDelete = noop } = props;

  return (
    <>
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
                <TableCell align="right" sx={{ width: "160px" }}></TableCell>
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
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Fade>
    </>
  );
}
