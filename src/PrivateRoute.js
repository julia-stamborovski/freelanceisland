import { Navigate } from "react-router-dom";
import { useContext } from "react";
import { Context } from "./context/AuthContext";

export default function PrivateRoute({ children, allowedRoles }) {
    const { user } = useContext(Context);
  
    // Verificar se o usuário está autenticado
    if (!user) {
      return <Navigate to="/login" replace />;
    }
  
    // Verificar se a função do usuário está entre as permitidas
    if (allowedRoles && !allowedRoles.includes(user.role)) {
      // Redirecionar para uma página de acesso negado ou página padrão
      return <Navigate to="/access-denied" replace />;
    }
  
    return children;
  }