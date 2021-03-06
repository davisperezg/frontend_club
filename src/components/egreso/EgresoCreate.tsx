import { IModal } from "../../interface/Modal";
import {
  DialogContent,
  DialogActions,
  Grid,
  TextField,
  Button,
  Box,
  Tab,
  Tabs,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Dialog,
  Toolbar,
  AppBar,
  IconButton,
  Typography,
} from "@mui/material";
import {
  a11yProps,
  formatDate,
  formatter,
} from "../../utils/helpers/functions";
import { BootstrapDialog, BootstrapDialogTitle } from "../modal";
import TabPanel from "../Tab/Index";
import { SyntheticEvent, useCallback, useState } from "react";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { Egreso } from "../../interface/Egreso";
import EgresoItemGasto from "./EgresoItemGasto";
import CloseIcon from "@mui/icons-material/Close";
import { Transition } from "../General/ComponentsIndex";
import { Table } from "../../views/IndexStyle";
import { useMutateEgreso } from "../hooks/useEgreso";
import { toast } from "react-toastify";

const initialEgreso: Egreso = {
  fecha: new Date(),
  partido_vs: "",
  fase_copaPeru: "",
  local_visita: "LOCAL",
  gastos: [],
};

const EgresoCreate = ({ handleClose, open }: IModal) => {
  const { mutateAsync, isLoading: isLoadingMutate } = useMutateEgreso();
  const [value, setValue] = useState<number>(0);
  const [valueDate, setValueDate] = useState<Date | null>(new Date());
  const [egreso, setEgreso] = useState<Egreso>(initialEgreso);
  const [gasto, setGasto] = useState<number[]>([]);
  const [itemsGasto, setItemsGasto] = useState<any[]>([]);
  const [openFull, setOpenFull] = useState(false);

  const clear = () => {
    setValue(0);
    setValueDate(new Date());
    setEgreso(initialEgreso);
    setGasto([]);
    setItemsGasto([]);
  };

  const handleChangeTab = (event: SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const handleChangeDate = (newValue: Date | null) => {
    setValueDate(newValue);
  };

  const handleChange = <P extends keyof Egreso>(prop: P, value: Egreso[P]) => {
    setEgreso({ ...egreso, [prop]: value });
  };

  const handleAddGasto = useCallback(() => {
    const getEndNumber = gasto[gasto.length - 1] || 0;
    setGasto([...gasto, Number(getEndNumber) + 1]);
    setItemsGasto([
      ...itemsGasto,
      {
        nro: Number(getEndNumber) + 1,
        gasto: "",
        monto: "",
      },
    ]);
  }, [gasto, itemsGasto]);

  const handleRemoveGasto = (item: number) => {
    const findNumber = itemsGasto.filter((a) => a.nro !== item);
    const reformatedNumbers = findNumber.map((_, i) => i + 1);
    const reformatedNumbersComponent = findNumber.map((a, i) => {
      return {
        ...a,
        nro: i + 1,
      };
    });
    setItemsGasto(reformatedNumbersComponent);
    setGasto(reformatedNumbers);
  };

  // const handleChange = <P extends keyof Role>(prop: P, value: Role[P]) => {
  //   setRole({ ...role, [prop]: value });
  // };

  const handleOk = async () => {
    try {
      await mutateAsync({
        dataEgreso: { ...egreso, gastos: itemsGasto, fecha: valueDate },
      });
      toast.success("Liquidaci??n de planilla en salida creada. !");
      closeModal();
    } catch (e: any) {
      const error: Error = JSON.parse(e.request.response);
      toast.error(error.message);
    }
  };

  const handlePrevia = () => {
    setOpenFull(true);
  };

  const handleCloseFull = () => {
    setOpenFull(false);
  };

  const closeModal = () => {
    handleClose();
    clear();
    handleCloseFull();
  };

  return (
    <>
      <Dialog
        fullScreen
        open={openFull}
        onClose={handleCloseFull}
        TransitionComponent={Transition}
      >
        <AppBar sx={{ position: "relative" }}>
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              onClick={handleCloseFull}
              aria-label="close"
            >
              <CloseIcon />
            </IconButton>
            <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
              VISTA PREVIA DE LIQUIDACION DE PLANILLA - SALIDA
            </Typography>
            <Button
              autoFocus
              color="inherit"
              onClick={handleOk}
              disabled={isLoadingMutate}
            >
              Guardar
            </Button>
          </Toolbar>
        </AppBar>
        <div style={{ display: "flex", flexDirection: "column", padding: 24 }}>
          <div style={{ display: "flex", flexDirection: "row" }}>
            <strong>Fecha de egreso:</strong>&nbsp;&nbsp;
            <label>{formatDate(new Date(String(valueDate)), false)}</label>
          </div>
          <div style={{ display: "flex", flexDirection: "row" }}>
            <strong>Fase de copa Per??:</strong>&nbsp;&nbsp;
            <label>{egreso?.fase_copaPeru}</label>
          </div>
          <div style={{ display: "flex", flexDirection: "row" }}>
            <strong>Partido VS:</strong>&nbsp;&nbsp;
            <label>{egreso?.partido_vs}</label>
          </div>
          <div style={{ display: "flex", flexDirection: "row" }}>
            <strong>El encuentro se jug?? de:</strong>&nbsp;&nbsp;
            <label>{egreso?.local_visita}</label>
          </div>
          <br />
          <br />
          <Table style={{ padding: 0 }}>
            <table>
              <thead>
                <tr>
                  <th>Nro</th>
                  <th>Detalle de gasto</th>
                  <th>Monto</th>
                </tr>
              </thead>
              <tbody>
                {itemsGasto.map((item) => (
                  <tr key={item.nro}>
                    <td>{item.nro}</td>
                    <td>{item.gasto}</td>
                    <td>S/{formatter.format(item.monto)}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot style={{ backgroundColor: "red", color: "#fff" }}>
                <tr>
                  <td colSpan={2}>Total</td>
                  <td>
                    S/
                    {formatter.format(
                      itemsGasto.reduce((a, b) => {
                        return Number(a) + Number(b.monto);
                      }, 0)
                    )}
                  </td>
                </tr>
              </tfoot>
            </table>
          </Table>
        </div>
      </Dialog>
      <BootstrapDialog
        onClose={closeModal}
        aria-labelledby="customized-dialog-title"
        open={open}
      >
        <BootstrapDialogTitle id="customized-dialog-title" onClose={closeModal}>
          Nuevo Egreso
        </BootstrapDialogTitle>
        <DialogContent dividers>
          {/* {isErrorListModules && (
            <Alert severity="error">
              {JSON.parse(String(errorListModules?.request.response)).message}
            </Alert>
          )} */}
          <Box sx={{ width: "100%", height: "100%" }}>
            <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
              <Tabs
                value={value}
                onChange={handleChangeTab}
                aria-label="basic tabs example"
              >
                <Tab label="General" {...a11yProps(0)} />
              </Tabs>
            </Box>
            <TabPanel value={value} index={0}>
              <Grid container spacing={2}>
                <Grid item md={12}>
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DesktopDatePicker
                      label="Fecha de ingreso"
                      inputFormat="dd/MM/yyyy"
                      value={valueDate}
                      onChange={handleChangeDate}
                      renderInput={(params: any) => (
                        <TextField {...params} style={{ width: "100%" }} />
                      )}
                    />
                  </LocalizationProvider>
                </Grid>
                <Grid item md={12}>
                  <TextField
                    fullWidth
                    required
                    value={egreso.partido_vs}
                    id="partidovs-required"
                    onChange={(e) => handleChange("partido_vs", e.target.value)}
                    label="??El partido se jug?? con?"
                    autoComplete="off"
                  />
                </Grid>
                <Grid item md={12}>
                  <TextField
                    fullWidth
                    required
                    value={egreso.fase_copaPeru}
                    id="fasecopa-required"
                    onChange={(e) =>
                      handleChange("fase_copaPeru", e.target.value)
                    }
                    label="Fase de copa Per??"
                    autoComplete="off"
                  />
                </Grid>
                <Grid item md={6}>
                  <FormControl>
                    <FormLabel id="lv-row-radio-buttons-group-label">
                      Modo de juego
                    </FormLabel>
                    <RadioGroup
                      row
                      aria-labelledby="lv-row-radio-buttons-group-label"
                      name="row-radio-buttons-group"
                      value={egreso.local_visita}
                      onChange={(e) =>
                        handleChange("local_visita", e.target.value)
                      }
                    >
                      <FormControlLabel
                        value="LOCAL"
                        control={<Radio />}
                        label="Local"
                      />
                      <FormControlLabel
                        value="VISITANTE"
                        control={<Radio />}
                        label="Visitante"
                      />
                    </RadioGroup>
                  </FormControl>
                </Grid>
                <Grid item md={12}>
                  <Button variant="contained" onClick={handleAddGasto}>
                    Agregar gasto
                  </Button>
                </Grid>
                {itemsGasto.map((item, i) => {
                  return (
                    <EgresoItemGasto
                      key={i + 1}
                      item={item}
                      handleRemoveGasto={handleRemoveGasto}
                      setItemsGasto={setItemsGasto}
                      itemsGasto={itemsGasto}
                    />
                  );
                })}
                <Grid item md={12}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <h1>Total:</h1>
                    <h3 style={{ color: "red" }}>
                      S/
                      {formatter.format(
                        itemsGasto.reduce((a, b) => {
                          return Number(a) + Number(b.monto);
                        }, 0)
                      )}
                    </h3>
                  </div>
                </Grid>
              </Grid>
            </TabPanel>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button variant="outlined" onClick={closeModal}>
            Cancelar
          </Button>
          <Button variant="contained" autoFocus onClick={handlePrevia}>
            Vista Previa
          </Button>
        </DialogActions>
      </BootstrapDialog>
    </>
  );
};

export default EgresoCreate;
