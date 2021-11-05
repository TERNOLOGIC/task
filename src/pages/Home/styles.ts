import { makeStyles } from "@material-ui/core/styles";

export const useStyles = makeStyles((theme) => ({
  headerRow: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  dialog: {
    display: "flex",
    flexDirection: "column",
    width: "55vw", 
    padding: "1.5em", 
    overflow: "hidden"
  }
}));
