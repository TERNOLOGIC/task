import React, { useState, useEffect, useCallback, useMemo } from "react";
import { Dialog, Button, TextField, Grid } from "@material-ui/core";
import CircularProgress from "@material-ui/core/CircularProgress";
import { endpoints } from "../../constants";
import { Project } from ".";
import { useStyles } from './styles';

const inputLabelProps = {
  classes: {
    shrink: "text-black font-bold",
    focused: "text-primary",
  },
};

type Props = {
  open: boolean;
  onClose: () => void;
  id: number | null;
  onEditSuccess: (project: Project) => void;
};
const EditProjectDialog = ({ open, onEditSuccess, onClose, id }: Props) => {
  const classes = useStyles();
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [errored, setErrored] = useState(false);
  const [project, setProject] = useState<Project>({} as Project);

  const loadData = async () => {
    setLoading(true);
    setErrored(false);
    try {
      const labels = await fetch(`${endpoints.projects}/${id}`).then((res) =>
        res.json()
      );
      setProject(labels || {});
    } catch (error) {
      setErrored(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [id]);

  const onSaveClick = async () => {
    if (saving) return;
    setSaving(true);
    try {
      const response = await fetch(`${endpoints.projects}/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: project.name }),
      }).then((res) => res.json());
      onEditSuccess(response);
      onClose();
    } catch (error) {
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog maxWidth="xl" open={open} onClose={onClose}>
      <div className={classes.dialog} >
        <h2>Update project</h2>
        {loading ? (
          <CircularProgress />
        ) : errored ? (
          <span>Failed to load data</span>
        ) : (
          <Grid container spacing={4}>
            <Grid item sm={12}>
              <TextField
                label={"Name"}
                value={project.name}
                onChange={(event) => {
                  project.name = event.target.value;
                  setProject({ ...project });
                }}
                InputLabelProps={inputLabelProps}
                variant="outlined"
                size="small"
                fullWidth
              />
            </Grid>
          </Grid>
        )}

        <div style={{marginTop: "1em", display: "flex", justifyContent: "flex-end"}}>
          <Button
            className="rounded hover-bg-primary"
            variant="outlined"
            color="primary"
            disabled={saving}
            onClick={errored ? loadData : onSaveClick}
            startIcon={saving ? <CircularProgress size={16} /> : null}
            style={{marginRight: "1em"}}
          >
            {errored ? "Reload" : "Save"}
          </Button>
          <Button
            className="rounded hover-bg-error"
            variant="outlined"
            onClick={onClose}
          >
            Cancel
          </Button>
        </div>
      </div>
    </Dialog>
  );
};

export default EditProjectDialog;
