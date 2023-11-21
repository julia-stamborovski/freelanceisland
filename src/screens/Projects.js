import React, { useState, useEffect } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import logo from "../logo.png";
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
    status: "",
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

  const projectCollectionRef = collection(db, "projects");
  const clientCollectionRef = collection(db, "clients");

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
  async function addProject() {
    try {
      const auth = getAuth();
      const user = auth.currentUser;
  
      if (!user) {
        handleErrorSnackbarOpen("Usuário não autenticado. Faça o login.");
        return;
      }
  
      const docRef = await addDoc(projectCollectionRef, {
        ...projectData,
        userId: user.uid,
      });
  
      console.log("Novo projeto adicionado com sucesso com o ID: ", docRef.id);
      setProjectData({
        title: "",
        desc: "",
        prazo: "",
        orcamento: "",
        status: "",
        clientId: "",
      });
      loadProjects();
      handleSuccessSnackbarOpen("Projeto adicionado com sucesso!");
    } catch (error) {
      console.error("Erro ao adicionar novo projeto: ", error);
      handleErrorSnackbarOpen("Erro ao adicionar novo projeto.");
    }
  }
  
  async function deleteProject(id) {
    try {
      const projectDocRef = doc(db, "projects", id);
      await deleteDoc(projectDocRef);
      console.log("Projeto excluído com sucesso!");
      handleSuccessSnackbarOpen("Projeto excluído com sucesso!");
      loadProjects();
    } catch (error) {
      console.error("Erro ao excluir projeto: ", error);
      handleErrorSnackbarOpen("Erro ao excluir projeto");
    }
  }

  async function editProject(id) {
    try {
      setEditingProjectId(id);
      const projectDocRef = doc(db, "projects", id);
      const projectDocSnapshot = await getDoc(projectDocRef);
      if (projectDocSnapshot.exists()) {
        const projectData = projectDocSnapshot.data();
        setProjectData({ ...projectData });
        handleClickOpen();
      }
    } catch (error) {
      console.error("Erro ao editar projeto: ", error);
      handleErrorSnackbarOpen("Erro ao editar projeto");
    }
  }

  async function updateProject() {
    try {
      const projectDocRef = doc(db, "projects", editingProjectId);
      const updatedFields = {};
      if (projectData.title !== "") updatedFields.title = projectData.title;
      if (projectData.desc !== "") updatedFields.desc = projectData.desc;
      if (projectData.prazo !== "") updatedFields.prazo = projectData.prazo;
      if (projectData.orcamento !== "")
        updatedFields.orcamento = projectData.orcamento;
      if (projectData.status !== "") updatedFields.status = projectData.status;
      if (projectData.clientId !== "")
        updatedFields.clientId = projectData.clientId;

      await updateDoc(projectDocRef, updatedFields);
      setEditingProjectId(null);
      setProjectData({
        title: "",
        desc: "",
        prazo: "",
        orcamento: "",
        status: "",
        clientId: "",
      });
      handleCloseModal();
      console.log("Projeto atualizado com sucesso!");
      handleSuccessSnackbarOpen("Projeto atualizado com sucesso!");

      loadProjects();
    } catch (error) {
      console.error("Erro ao atualizar projeto: ", error);
      handleErrorSnackbarOpen("Erro ao atualizar projeto");
    }
  }

  async function loadProjects() {
    try {
      const auth = getAuth();
      const user = auth.currentUser;
  
      if (!user) {
        handleErrorSnackbarOpen("Usuário não autenticado. Faça o login.");
        return;
      }
  
      const querySnapshot = await getDocs(
        query(projectCollectionRef, where("userId", "==", user.uid))
      );
  
      const projectsData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
  
      setProjects(projectsData);
    } catch (error) {
      console.error("Erro ao carregar projetos: ", error);
      handleErrorSnackbarOpen("Erro ao carregar projetos. Tente novamente.");
    }
  }
  
  async function loadClients() {
    try {
      const auth = getAuth();
      const user = auth.currentUser;
      if (!user) {
        handleErrorSnackbarOpen("Usuário não autenticado. Faça o login.");
        return;
      }
  
      const querySnapshot = await getDocs(
        query(clientCollectionRef, where("userId", "==", user.uid))
      );
  
      const clientsData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
  
      setClients(clientsData);
    } catch (error) {
      console.error("Erro ao carregar clientes: ", error);
      handleErrorSnackbarOpen("Erro ao carregar clientes. Tente novamente.");
    }
  }
  

  useEffect(() => {
    loadProjects();
    loadClients();
  }, []);

  return (
    <div className="App">
      <img src={logo} alt="logo" style={{ height: 200 }} className="logo" />
    <NavBar/>
      <Box sx={{ width: "100%" }}>
        <Box
          sx={{ borderBottom: 1, borderColor: "divider", bgcolor: "#fffffeb8" }}
          className="tabs-css"
        >
          <Tabs value={value} onChange={handleChange} aria-label="basic tabs">
            <Tab label="Projetos" {...a11yProps(0)} />
            <Tab label="Clientes" {...a11yProps(1)} />
            <Tab label="Despesas" {...a11yProps(2)} />
          </Tabs>
        </Box>
        <CustomTabPanel value={value} index={0} className="form">
          <Stack spacing={2}>
            <h1>Gerenciamento de Projetos</h1>
            <FormLabel>Nome do Projeto</FormLabel>
            <TextField
              fullWidth
              type="text"
              value={projectData.title}
              onChange={(e) =>
                setProjectData({ ...projectData, title: e.target.value })
              }
            />
            <FormLabel>Descrição do Projeto</FormLabel>
            <TextField
              fullWidth
              type="text"
              multiline
              rows={2}
              value={projectData.desc}
              onChange={(e) =>
                setProjectData({ ...projectData, desc: e.target.value })
              }
            />
            <FormLabel>Prazo</FormLabel>
            <TextField
              fullWidth
              type="text"
              value={projectData.prazo}
              onChange={(e) =>
                setProjectData({ ...projectData, prazo: e.target.value })
              }
            />
            <FormLabel>Orçamento</FormLabel>
            <TextField
              fullWidth
              type="text"
              value={projectData.orcamento}
              onChange={(e) =>
                setProjectData({ ...projectData, orcamento: e.target.value })
              }
            />
            <FormLabel>Status</FormLabel>
            <TextField
              fullWidth
              type="text"
              value={projectData.status}
              onChange={(e) =>
                setProjectData({ ...projectData, status: e.target.value })
              }
            />
            <FormControl fullWidth>
              <FormLabel>Cliente</FormLabel>
              <Select
                label="Cliente"
                value={projectData.clientId}
                onChange={(e) =>
                  setProjectData({ ...projectData, clientId: e.target.value })
                }
              >
                <MenuItem value="">Selecionar Cliente</MenuItem>
                {clients.map((client) => (
                  <MenuItem key={client.id} value={client.id}>
                    {client.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <Button
              variant="outlined"
              size="large"
              color="primary"
              onClick={addProject}
            >
              Adicionar Projeto
            </Button>

            <div className="card-list-container">
              {projects.map((project) => (
                <div className="card-list" key={project.id}>
                  <p className="project-title">{project.title}</p>
                  <p className="project-desc"> <strong>Descrição:</strong> {project.desc}</p>
                  <div className="project-client">
                    {clients.map((client) =>
                      client.id === project.clientId ? (
                        <p key={client.id}><strong>Cliente: </strong>{client.name}</p>
                      ) : null
                    )}
                  </div>
                  <p className="project-prazo"><strong>Prazo:</strong> {project.prazo}</p>
                  <p className="project-status"><strong>Status:</strong> <Chip label={project.status} color="secondary" /></p>
                  <p className="project-orcamento"><strong>Orçamento:</strong> {project.orcamento}</p>

              <div>
                  <Button
                    variant="contained"
                    className="button-actions-project"
                    color="error"
                    onClick={() => deleteProject(project.id)}
                  >
                    Excluir
                  </Button>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => editProject(project.id)}
                  >
                    Editar
                  </Button>
              </div>
                </div>
              ))}
            </div>
          </Stack>

          <Dialog open={open} onClose={handleClose}>
            <DialogTitle>Editar - {projectData.title}</DialogTitle>
            <DialogContent>
              <Stack spacing={3}>
                <DialogContentText>
                  Se algo mudou no projeto, é hora de fazer as edições
                  necessárias!
                </DialogContentText>

                <TextField
                  fullWidth
                  type="text"
                  label="Título"
                  value={projectData.title}
                  onChange={(e) =>
                    setProjectData({ ...projectData, title: e.target.value })
                  }
                />
                <TextField
                  fullWidth
                  type="text"
                  multiline
                  rows={4}
                  label="Descrição"
                  value={projectData.desc}
                  onChange={(e) =>
                    setProjectData({ ...projectData, desc: e.target.value })
                  }
                />

                <TextField
                  fullWidth
                  type="text"
                  label="Prazo"
                  value={projectData.prazo}
                  onChange={(e) =>
                    setProjectData({ ...projectData, prazo: e.target.value })
                  }
                />

                <TextField
                  fullWidth
                  type="text"
                  label="Status"
                  value={projectData.status}
                  onChange={(e) =>
                    setProjectData({ ...projectData, status: e.target.value })
                  }
                />
                <FormControl fullWidth>
                  <Select
                    label="Cliente"
                    color="primary"
                    value={projectData.clientId}
                    onChange={(e) =>
                      setProjectData({
                        ...projectData,
                        clientId: e.target.value,
                      })
                    }
                  >
                    <MenuItem value="">Selecionar Cliente</MenuItem>
                    {clients.map((client) => (
                      <MenuItem key={client.id} value={client.id}>
                        {client.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Stack>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose}>Cancelar</Button>
              <Button onClick={updateProject}>Atualizar</Button>
            </DialogActions>
          </Dialog>

          <Snackbar
            open={openSuccessSnackbar}
            autoHideDuration={6000}
            onClose={handleSnackbarClose}
          >
            <MuiAlert
              elevation={6}
              variant="filled"
              severity="success"
              onClose={handleSnackbarClose}
            >
              {successMessage}
            </MuiAlert>
          </Snackbar>

          <Snackbar
            open={openErrorSnackbar}
            autoHideDuration={6000}
            onClose={handleSnackbarClose}
          >
            <MuiAlert
              elevation={6}
              variant="filled"
              severity="error"
              onClose={handleSnackbarClose}
            >
              {errorMessage}
            </MuiAlert>
          </Snackbar>
        </CustomTabPanel>
        <CustomTabPanel value={value} index={1} className="form">
          <Clients />
        </CustomTabPanel>
        <CustomTabPanel value={value} index={2} className="form">
          <ProjectExpenses projectId={projects.id} />
        </CustomTabPanel>
      </Box>
    </div>
  );
}

export default Projects;
