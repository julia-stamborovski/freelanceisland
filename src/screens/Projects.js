import React, { useState, useEffect } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import {
  collection,
  addDoc,
  doc,
  deleteDoc,
  getDocs,
  getDoc,
  updateDoc,
  query,
  where,
} from "firebase/firestore";
import { auth, db } from "../firebase";
import Modal from "@mui/material/Modal";
import Clients from "./Clients";
import FormControl from "@mui/material/FormControl";
import ProjectExpenses from "./ProjectExpenses";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import { Chip, FormLabel } from "@mui/material";
import { Stack } from "@mui/system";
import "../App.css";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { CustomTabPanel, a11yProps } from "../components/CustomTabPanel";
import { getAuth } from 'firebase/auth';
import NavBar from "../components/NavBar";
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import ShowsCase from "../components/ShowsCase";
import Example from "../components/HorizontalScroll";

function Projects() {
  const [value, setValue] = React.useState(0);
  const auth = getAuth()
  const user = auth.currentUser 
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const [projectData, setProjectData] = useState({
    title: "",
    desc: "",
    prazo: "",
    orcamento: "",
    status: "Ativo",
    clientId: "", // Adicionando o campo clientId para relacionar com o cliente
  });
  const [clients, setClients] = useState([]);
  const [projects, setProjects] = useState([]);
  const [editingProjectId, setEditingProjectId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [openSuccessSnackbar, setOpenSuccessSnackbar] = useState(false);
  const [openErrorSnackbar, setOpenErrorSnackbar] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [open, setOpen] = React.useState(false);

  const handleSuccessSnackbarOpen = (message) => {
    setSuccessMessage(message);
    setOpenSuccessSnackbar(true);
  };

  const handleErrorSnackbarOpen = (message) => {
    setErrorMessage(message);
    setOpenErrorSnackbar(true);
  };
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSnackbarClose = () => {
    setOpenSuccessSnackbar(false);
    setOpenErrorSnackbar(false);
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };
 

  return (
    <div className="bg-black h-full App">
    <NavBar/>
    < Example/>

      {/* <Box sx={{ width: "100%" }}>
        <Box
          sx={{ borderBottom: 1, borderColor: "divider", bgcolor: "#fffffeb8" }}
          className="tabs-css"
        >
          <Tabs value={value} onChange={handleChange} aria-label="basic tabs">
            <Tab label="CATEGORIA 1" {...a11yProps(0)} />
            <Tab label="CATEGORIA 2" {...a11yProps(1)} />
            <Tab label="CATEGORIA 3" {...a11yProps(2)} />
          </Tabs>
        </Box>
        <CustomTabPanel value={value} index={0} className="form">
          categoria 1
        </CustomTabPanel>
        <CustomTabPanel value={value} index={1} className="form">
          categoria 2
        </CustomTabPanel>
        <CustomTabPanel value={value} index={2} className="form">
          categoria 3
        </CustomTabPanel>
      </Box> */}
    </div>
  );
}

export default Projects;
