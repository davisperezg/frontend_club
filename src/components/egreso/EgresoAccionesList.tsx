import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  MenuItem,
  TextField,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { StyledMenu } from "../General/CSSIndex";
import { toast } from "react-toastify";
import { useState, MouseEvent } from "react";
import { useDeleteEgreso, useRestoreEgreso } from "../hooks/useEgreso";

const EgresoAccionsList = ({ ...rest }) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const [openAnular, setOpenAnular] = useState(false);
  const [motivo, setMotivo] = useState("");
  const [openRestore, setOpenRestore] = useState(false);

  const { mutate: mutateDelete, isLoading: isLoadingDelete } =
    useDeleteEgreso();

  const { mutate: mutateRestore, isLoading: isLoadingRestore } =
    useRestoreEgreso();

  const handleClick = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleClickOpenAnular = () => {
    setOpenAnular(true);
    handleClose();
  };

  const handleClickRestore = () => {
    setOpenRestore(true);
    handleClose();
  };

  const handleCloseAnular = () => {
    setOpenAnular(false);
  };

  const handleCloseRestore = () => {
    setOpenRestore(false);
  };

  const restoreEgres = (id: string) => {
    mutateRestore(
      {
        id: id,
        motivo: motivo,
      },
      {
        onSuccess: () => {
          handleClose();
          handleCloseRestore();
        },
        onError: (e) => {
          const error: Error = JSON.parse(e.request.response);
          toast.error(error.message);
        },
      }
    );
  };

  const desactivateEgres = async (id: string) => {
    mutateDelete(
      {
        id: id,
        motivo: motivo,
      },
      {
        onSuccess: () => {
          handleClose();
          handleCloseAnular();
        },
        onError: (e) => {
          const error: Error = JSON.parse(e.request.response);
          toast.error(error.message);
        },
      }
    );
  };

  const handleChange = (e: any) => {
    setMotivo(e.target.value);
  };

  const openEdit = (id: string) => {
    rest.handleClickOpen(id);
    handleClose();
  };

  const openDetails = (id: string) => {
    rest.handleClickDetails(id);
    handleClose();
  };

  return (
    <div style={{ textAlign: "center" }}>
      <Dialog
        open={openAnular}
        onClose={handleCloseAnular}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Anular SALIDA?"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            ??Esta seguro que desea anular la salida?
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="motivo"
            label="Escribe el motivo de la anulaci??n"
            type="text"
            onChange={handleChange}
            fullWidth
            required
            variant="standard"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => desactivateEgres(rest.row._id)} autoFocus>
            Anular de todas formas
          </Button>
          <Button variant="contained" onClick={handleCloseAnular}>
            Cancelar
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={openRestore}
        onClose={handleCloseRestore}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Restaurar SALIDA?"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            ??Esta seguro que desea restaurar la salida?
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="motivo"
            label="Escribe el motivo de la restauraci??n"
            type="text"
            onChange={handleChange}
            fullWidth
            required
            variant="standard"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => restoreEgres(rest.row._id)} autoFocus>
            Restaurar de todas formas
          </Button>
          <Button variant="contained" onClick={handleCloseRestore}>
            Cancelar
          </Button>
        </DialogActions>
      </Dialog>

      <Button
        id="demo-customized-button"
        aria-controls={open ? "demo-customized-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        variant="contained"
        disableElevation
        onClick={handleClick}
      >
        <MoreVertIcon />
      </Button>
      <StyledMenu
        id="demo-customized-menu"
        MenuListProps={{
          "aria-labelledby": "demo-customized-button",
        }}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
      >
        {rest.row.status && (
          <MenuItem onClick={() => openEdit(rest.row._id)} disableRipple>
            Editar
          </MenuItem>
        )}
        <MenuItem
          onClick={() => {
            if (rest.row.status) {
              return handleClickOpenAnular();
            } else {
              return handleClickRestore();
            }
          }}
          disableRipple
        >
          {rest.row.status
            ? isLoadingDelete
              ? "Anulando..."
              : "Anular"
            : isLoadingRestore
            ? "Restaurando..."
            : "Restaurar"}
        </MenuItem>
        <MenuItem onClick={() => openDetails(rest.row._id)} disableRipple>
          M??s detalle
        </MenuItem>
      </StyledMenu>
    </div>
  );
};

export default EgresoAccionsList;
