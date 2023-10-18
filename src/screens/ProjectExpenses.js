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
} from "firebase/firestore";
import { db } from "../firebase";
import Modal from "@mui/material/Modal";
import FormControl from "@mui/material/FormControl";
import "../App.css";
import { Snackbar, Stack } from "@mui/material";
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";
import MuiAlert from "@mui/material/Alert";

function ProjectExpenses() {
  const [projectExpensesData, setProjectExpensesData] = useState({
    title: "",
    custo: '',
    projectId: "", // Adicionei o campo projectId para relacionar com o projeto
  });
  const [projectExpense, setprojectExpense] = useState([]);
  const [projects, setProjects] = useState([]);
  const [editingProjectId, setEditingProjectId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [open, setOpen] = React.useState(false);
  const [openSuccessSnackbar, setOpenSuccessSnackbar] = useState(false);
  const [openErrorSnackbar, setOpenErrorSnackbar] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const projectsExpensesCollection = collection(db, "projectsExpenses");
  const projectsCollectionRef = collection(db, "projects"); // Referência à coleção 'projects'


const handleClickOpen = () => {
  setOpen(true);
};

const handleClose = () => {
  setOpen(false);
};

const handleSuccessSnackbarOpen = (message) => {
  setSuccessMessage(message);
  setOpenSuccessSnackbar(true);
};

const handleErrorSnackbarOpen = (message) => {
  setErrorMessage(message);
  setOpenErrorSnackbar(true);
};

const handleSnackbarClose = () => {
  setOpenSuccessSnackbar(false);
  setOpenErrorSnackbar(false);
};


  async function addProject() {
    try {
      const docRef = await addDoc(projectsExpensesCollection, projectExpensesData);
      console.log("Nova despesa adicionada com sucesso com o ID: ", docRef.id);
      setProjectExpensesData({
        title: "",
        custo: '',
        projectId: "", 
      });
      loadProjectsExpense();
      handleSuccessSnackbarOpen("Despesa adicionada com sucesso!" )

    } catch (error) {
      console.error("Erro ao adicionar nova despesa: ", error);
      handleErrorSnackbarOpen("Erro ao adicionar nova despesa")
    }
  }

  async function deleteProject(id) {
    try {
      const projectExpensesDocRef = doc(db, "projectsExpenses", id);
      await deleteDoc(projectExpensesDocRef);
      console.log("Despesa excluída com sucesso!");
      loadProjectsExpense();
      handleSuccessSnackbarOpen("Despesa excluída com sucesso!")
    } catch (error) {
      console.error("Erro ao excluir despesa: ", error);
      handleErrorSnackbarOpen("Erro ao excluir despesa")

    }
  }

  async function editProject(id) {
    try {
      setEditingProjectId(id);
      const projectExpensesDocRef = doc(db, "projectsExpenses", id);
      const projectExpenseDocSnapshot = await getDoc(projectExpensesDocRef);
      if (projectExpenseDocSnapshot.exists()) {
        const projectExpensesData = projectExpenseDocSnapshot.data();
        setProjectExpensesData({ ...projectExpensesData });
        handleClickOpen(); 
        
      }
    } catch (error) {
      console.error("Erro ao editar despesa: ", error);
    }
  }

  async function updateProject() {
    try {
      const projectExpensesDocRef = doc(db, "projectsExpenses", editingProjectId);
      const updatedFields = {
        title: projectExpensesData.title,
        custo: projectExpensesData.custo,
        projectId: projectExpensesData.projectId,
      };

      await updateDoc(projectExpensesDocRef, updatedFields);
      setEditingProjectId(null);
      setProjectExpensesData({
        title: "",
        custo: '',
        projectId: "", 
      });
      handleClose();
      console.log("Despesa atualizada com sucesso!");
      handleSuccessSnackbarOpen("Despesa atualizada com sucesso!" )

      loadProjectsExpense();
    } catch (error) {
      console.error("Erro ao atualizar despesa: ", error);
      handleErrorSnackbarOpen("Erro ao atualizar despesa.")
    }
  }

  async function loadProjectsExpense() {
    try {
      const querySnapshot = await getDocs(projectsExpensesCollection);
      const projectsExpensesData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setprojectExpense(projectsExpensesData);
    } catch (error) {
      console.error("Erro ao carregar despesas: ", error);
    }
  }

  async function loadProjects() {
    try {
      const querySnapshot = await getDocs(projectsCollectionRef);
      const projectsData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setProjects(projectsData);
    } catch (error) {
      console.error("Erro ao carregar projetos: ", error);
    }
  }
  

  useEffect(() => {
    loadProjectsExpense();
    loadProjects(); 
  }, []);

  return (
    <div className="App">
      <h1>Gerenciamento de Despesas</h1>
      <Stack spacing={2} className="">
      <TextField
        fullWidth
        type="text"
        label="Título"
        value={projectExpensesData.title}
        onChange={(e) =>
          setProjectExpensesData({ ...projectExpensesData, title: e.target.value })
        }
      />
      <TextField
        fullWidth
        type="text"
        label="Custo"
        value={projectExpensesData.custo}
        onChange={(e) =>
          setProjectExpensesData({ ...projectExpensesData, custo: e.target.value })
        }
      />
     
      
      <FormControl fullWidth>
        <label>Selecione um projeto</label>
        <Select
          label="Projeto"
          value={projectExpensesData.projectId}
          onChange={(e) =>
            setProjectExpensesData({ ...projectExpensesData, projectId: e.target.value })
          }
        >
          <MenuItem value="">Selecionar Projeto</MenuItem>
          {projects.map((project) => (
            <MenuItem key={project.id} value={project.id}>
              {project.title}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
        <Button 
         variant="outlined"
         size="large"
         color="primary"
         onClick={addProject}>
          Adicionar Despesa
        </Button>

      <div className="cards-list-container">
        {projectExpense.map((projectExpense) => (
          <div key={projectExpense.id} className="card-list">
            <p className="project-title">Despesa - {projectExpense.title}</p>
             <p><strong>Custo: </strong>R${projectExpense.custo} </p>
             <div className="">
                    {projects.map((project) =>
                      project.id === projectExpense.projectId ? (
                        <p key={project.id}><strong>Projeto: </strong>{project.title}</p>
                      ) : null
                    )}
                  </div>
            <Button
              variant="contained"
              className="button-actions-project"
              color="error"
              onClick={() => deleteProject(projectExpense.id)}
            >
              Excluir
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={() => editProject(projectExpense.id)}
            >
              Editar
            </Button>
          </div>
        ))}
      </div>

      <Dialog open={open} onClose={handleClose}>
            <DialogTitle>Editar - Despesa </DialogTitle>
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
            value={projectExpensesData.title}
            onChange={(e) =>
              setProjectExpensesData({ ...projectExpensesData, title: e.target.value })
            }
          />
               <TextField
            fullWidth
            type="text"
            label="Custo"
            value={projectExpensesData.custo}
            onChange={(e) =>
              setProjectExpensesData({ ...projectExpensesData, custo: e.target.value })
            }
          />
          <FormControl fullWidth>
            <Select
              label="Projeto"
              value={projectExpensesData.projectId}
              onChange={(e) =>
                setProjectExpensesData({ ...projectExpensesData, projectId: e.target.value })
              }
            >
              <MenuItem value="">Selecionar Projeto</MenuItem>
              {projects.map((project) => (
                <MenuItem key={project.id} value={project.id}>
                  {project.title}
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
      </Stack>

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
    </div>
  );
}

export default ProjectExpenses;
