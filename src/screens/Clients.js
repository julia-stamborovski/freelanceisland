import React, { useState, useEffect } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import {
  collection,
  addDoc,
  doc,
  updateDoc,
  getDocs,
  getDoc,
  deleteDoc,
  query,
  where,
} from "firebase/firestore";
import { db } from "../firebase";
import "../App.css";
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Stack } from "@mui/material";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import { getAuth } from 'firebase/auth';

function Clients() {
  const [clientData, setClientData] = useState({
    name: "",
    contact: "",
    notes: "",
  });
  const [clients, setClients] = useState([]);
  const [editingClientId, setEditingClientId] = useState(null);
  const [clientProjects, setClientProjects] = useState([]);
  const [open, setOpen] = React.useState(false);
  const [openSuccessSnackbar, setOpenSuccessSnackbar] = useState(false);
  const [openErrorSnackbar, setOpenErrorSnackbar] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const clientCollectionRef = collection(db, "clients");
  const projectHistoryCollectionRef = collection(db, "projectHistory");


  async function addClient() {
    try {
      const auth = getAuth();
      const user = auth.currentUser;
  
      if (!user) {
        handleErrorSnackbarOpen("Usuário não autenticado. Faça o login.");
        return;
      }
  
      const docRef = await addDoc(clientCollectionRef, {
        ...clientData,
        userId: user.uid,
      });
  
      console.log("Novo cliente adicionado com sucesso com o ID: ", docRef.id);
      setClientData({
        name: "",
        contact: "",
        notes: "",
      });
      handleSuccessSnackbarOpen("Novo cliente adicionado com sucesso!");
      loadClients();
    } catch (error) {
      handleErrorSnackbarOpen("Erro ao adicionar novo cliente.");
      console.error("Erro ao adicionar novo cliente: ", error);
    }
  }
  
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

  async function deleteClient(id) {
    try {
      const clientDocRef = doc(db, "clients", id);
      await deleteDoc(clientDocRef);
      console.log("Cliente excluído com sucesso!");
      handleSuccessSnackbarOpen("Cliente excluído com sucesso!")
      loadClients();
    } catch (error) {
      console.error("Erro ao excluir cliente: ", error);
      handleErrorSnackbarOpen("Erro ao excluir cliente.")
    }
  }

  async function editClient(id) {
    try {
      setEditingClientId(id);
      const clientDocRef = doc(db, "clients", id);
      const clientDocSnapshot = await getDoc(clientDocRef);
      if (clientDocSnapshot.exists()) {
        const clientData = clientDocSnapshot.data();
        setClientData({ ...clientData });
        handleClickOpen(); 
      }
    } catch (error) {
      console.error("Erro ao editar cliente: ", error);
    }
  }

  async function updateClient() {
    try {
      const clientDocRef = doc(db, "clients", editingClientId);
      const updatedFields = {};
      if (clientData.name !== "") updatedFields.name = clientData.name;
      if (clientData.contact !== "") updatedFields.contact = clientData.contact;
      if (clientData.notes !== "") updatedFields.notes = clientData.notes;

      await updateDoc(clientDocRef, updatedFields);
      setEditingClientId(null);
      setClientData({
        name: "",
        contact: "",
        notes: "",
      });
      handleClose();
      handleSuccessSnackbarOpen("Cliente atualizado com sucesso!")
      console.log("Cliente atualizado com sucesso!");
      loadClients();
    } catch (error) {
      handleErrorSnackbarOpen("Erro ao atualizar cliente.")
      console.error("Erro ao atualizar cliente: ", error);
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
    }
  }
  

  async function loadClientProjects(clientId) {
    try {
      const q = query(projectHistoryCollectionRef, where("clientId", "==", clientId));
      const querySnapshot = await getDocs(q);
      const clientProjectsData = querySnapshot.docs.map((doc) => doc.data());
      setClientProjects(clientProjectsData);
    } catch (error) {
      console.error("Erro ao carregar projetos do cliente: ", error);
    }
  }

  useEffect(() => {
    loadClients();
  }, []);
  return (
    <div className="App">
    <Stack spacing={2} className="">
    <h1>Gerenciamento de Clientes</h1>

      <TextField
        fullWidth
        type="text"
        label="Nome do Cliente"
        value={clientData.name}
        onChange={(e) =>
          setClientData({ ...clientData, name: e.target.value })
        }
      />
      <TextField
        fullWidth
        type="text"
        label="Detalhes de Contato"
        value={clientData.contact}
        onChange={(e) =>
          setClientData({ ...clientData, contact: e.target.value })
        }
      />
      <TextField
        fullWidth
        type="text"
        label="Anotações"
        multiline
        rows={4}
        value={clientData.notes}
        onChange={(e) =>
          setClientData({ ...clientData, notes: e.target.value })
        }
      />
        <Button
         variant="outlined"
         size="large"
         color="primary" 
         onClick={addClient}>
          Adicionar Cliente
        </Button>

<div className="cards-list-container">
        {clients.map((client) => (
          <div key={client.id} className="card-list">
            <p className="project-title">{client.name}</p>
            <p><strong>Dados de contato: </strong>{client.contact}</p>
            <p><strong>Notas: </strong>{client.notes}</p>
            <Button
              variant="contained"
              color="error"
              className="button-actions-project"
              onClick={() => deleteClient(client.id)}
            >
              Excluir
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={() => {
                editClient(client.id);
                loadClientProjects(client.id);
              }}
            >
              Editar
            </Button>
          
          </div>
        ))}
      </div>
      </Stack>
      <Dialog open={open} onClose={handleClose}>
            <DialogTitle>Editar - Cliente {clientData.name}</DialogTitle>
            <DialogContent>
              <Stack spacing={3}>
                <DialogContentText>
                  Se algo mudou no projeto, é hora de fazer as edições
                  necessárias!
                </DialogContentText>

                <TextField
            fullWidth
            type="text"
            label="Nome do Cliente"
            value={clientData.name}
            onChange={(e) =>
              setClientData({ ...clientData, name: e.target.value })
            }
          />
          <TextField
            fullWidth
            type="text"
            label="Detalhes de Contato"
            value={clientData.contact}
            onChange={(e) =>
              setClientData({ ...clientData, contact: e.target.value })
            }
          />
          <TextField
            fullWidth
            type="text"
            label="Anotações"
            multiline
            rows={4}
            value={clientData.notes}
            onChange={(e) =>
              setClientData({ ...clientData, notes: e.target.value })
            }
          />
              </Stack>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose}>Cancelar</Button>
              <Button onClick={updateClient}>Atualizar</Button>
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
   
    </div>
  );
}

export default Clients;
