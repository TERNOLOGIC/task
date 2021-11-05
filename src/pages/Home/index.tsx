import { useCallback, useEffect, useMemo, useState } from "react";
import { useStyles } from "./styles";
import SearchIcon from "@material-ui/icons/Search";
import MoreIcon from "@material-ui/icons/MoreHoriz";
import { endpoints, SCREEN_KEY } from "../../constants";
import {
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TableRow,
  TableCell,
  Paper,
  TableSortLabel,
  ButtonGroup,
  Button,
  TextField,
  Container,
  MenuItem,
  IconButton,
} from "@material-ui/core";
import { Loading, Menu } from "../../components";
import useDebounce from "../../hooks/useDebounce";
import EditProjectDialog from "./EditProjectDialog";
import useNavigationContext from "../../hooks/navigationContext";
import { deleteLocalStorageItem } from "../../utils";

type ProjectTypes = "MY" | "SAVED" | "ACQUIRED";

const CurrencySymbols = {
  USD: "$",
};

export interface Project {
  id: number;
  name: string;
  status: string;
  resources: number;
  price: number;
  currency: keyof typeof CurrencySymbols;
  complicity: number;
  startDate: string;
  endDate: string;
  offers: number;
  provider: string;
  type: ProjectTypes;
}

export default function Home() {
  const classes = useStyles();
  const [editProjectId, setEditProjectId] = useState<number | null>(null);
  const [searchValue, setSearchValue] = useState("");
  const [loading, setLoading] = useState(false);
  const {navigateToScreen} = useNavigationContext();
  const [list, setList] = useState<Project[]>([]);
  const [sort, setSort] = useState<{
    field: string;
    direction: "asc" | "desc";
  } | null>(null);
  const [typeFilter, setTypeFilter] = useState<ProjectTypes | null>(null);
  const debouncedSearchValue = useDebounce(searchValue, 250);

  const getData = async () => {
    setLoading(true);
    try {
      const sortText = sort
        ? `&_sort=${sort.field}&_order=${sort.direction}`
        : "";
      const typeText = typeFilter ? `&type=${typeFilter}` : "";
      const data = await fetch(
        `${endpoints.projects}?q=${searchValue}${sortText}${typeText}`
      ).then((res) => res.json());

      if (Array.isArray(data)) {
        setList(data);
      }
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getData();
  }, [debouncedSearchValue, sort, typeFilter]);

  const columns = useMemo(
    () => [
      { field: "id", label: "Id" },
      { field: "name", label: "Name" },
      { field: "status", label: "Status" },
      { field: "resources", label: "Resources" },
      {
        field: "price",
        label: "Price",
        renderValue: (value: any, item: Project) =>
          `${Math.round(value/1000)}${CurrencySymbols[item.currency]}`,
      },
      { field: "provider", label: "Provider" },
      {
        field: "complicity",
        label: "Complicity",
        renderValue: (value: any) => `${value}%`,
      },
      { field: "startDate", label: "Start date" },
      { field: "endDate", label: "Deadline" },
      { field: "offers", label: "Offers" },
    ],
    []
  );
  const handleDeleteProject = async (id: number) => {
    await fetch(`${endpoints.projects}/${id}`, {
      method: "DELETE",
    }).then((res) => res.json());
    setList((prev) => prev.filter((item) => item.id !== id));
  };
  const handleUpdateProject = async (project: Project) => {
    setList((prev) =>
      prev.map((item) => (item.id !== project.id ? item : project))
    );
  };
  const logOut = useCallback(() => { 
    deleteLocalStorageItem("token")
    navigateToScreen(SCREEN_KEY.SIGN_IN);
   },[]);
  
  return (
    <Container component="main">
      {loading && <Loading />}
      <div className={classes.headerRow}>
        <TextField
          style={{ width: "50%" }}
          variant="outlined"
          value={searchValue}
          onChange={(e) => {
            setSearchValue(e.target.value);
          }}
          placeholder="Search projects..."
          InputProps={{
            startAdornment: <SearchIcon />,
          }}
        />
        <ButtonGroup color="primary">
          {[
            { code: null, label: "All" },
            { code: "MY", label: "My" },
            { code: "ACQUIRED", label: "Acquired" },
            { code: "SAVED", label: "Saved" },
          ].map(({ code, label }) => {
            const selected = typeFilter == code;
            const onClick = () => {
              setTypeFilter(code as ProjectTypes);
            };
            return (
              <Button
                key={"type-" + code}
                variant={selected ? "contained" : "outlined"}
                onClick={onClick}
              >
                {label}
              </Button>
            );
          })}
          <Button color	="secondary" onClick={logOut}>
            Logout
          </Button>
        </ButtonGroup>
      </div>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              {columns.map(({ field, label }) => {
                const active = sort?.field === field;
                const direction = sort?.direction;
                const onClick = () => {
                  if (!active) {
                    setSort({ field, direction: "asc" });
                  } else if (direction === "asc") {
                    setSort({ field, direction: "desc" });
                  } else {
                    setSort(null);
                  }
                };
                return (
                  <TableCell key={`th-${field}`}>
                    <TableSortLabel
                      active={active}
                      direction={direction}
                      onClick={onClick}
                    >
                      {label}
                    </TableSortLabel>
                  </TableCell>
                );
              })}
              <TableCell>{/*Actions*/}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {list.map((row: any) => (
              <TableRow key={row.name}>
                {columns.map(({ field, renderValue }) => (
                  <TableCell key={`td-${field}`}>
                    {renderValue ? renderValue(row[field], row) : row[field]}
                  </TableCell>
                ))}
                <TableCell style={{ visibility: row.type !== "MY" ? "hidden" :"initial"}}>
                  <Menu
                    menuButton={
                      <IconButton>
                        <MoreIcon />
                      </IconButton>
                    }
                  >
                    <div onClick={() => setEditProjectId(row.id)}>
                      <MenuItem>Edit</MenuItem>
                    </div>
                    <div onClick={() => handleDeleteProject(row.id)}>
                      <MenuItem>Remove</MenuItem>
                    </div>
                  </Menu>
                  </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      {editProjectId !== null && (
        <EditProjectDialog
          id={editProjectId}
          open={true}
          onEditSuccess={handleUpdateProject}
          onClose={() => setEditProjectId(null)}
        />
      )}
    </Container>
  );
}
