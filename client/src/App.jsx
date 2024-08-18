import { useState, useEffect } from "react";
import jwtDecode from "jwt-decode";
import { useAuth } from "./contexts/authentication";
import AuthenticatedApp from "./pages/AuthenticatedApp";
import UnauthenticatedApp from "./pages/UnauthenticatedApp";
import { useNavigate } from "react-router-dom";
import AdminAuthenticated from "./pages/AdminAuthenticated";


function App() {
  const auth = useAuth();
  const navigate = useNavigate();
  const [tokenValid, setTokenValid] = useState(true);
  const [state, setState] = useState({})


  const isTokenValid = (token) => {
    try {
      const decodedToken = jwtDecode(token);
      setState({ ...state, admins: decodedToken, loading: false });
      const currentTime = Date.now() / 1000;
      return decodedToken.exp > currentTime;
    } catch (error) {
      return false;
    }
  };

  useEffect(() => {
    if (auth.isAuthenticated) {
      const token = localStorage.getItem("token");

      if (!isTokenValid(token)) {
        alert("Your session has expired. Please log in again.");
        setTokenValid(false);
        auth.logout();
        navigate("/login");
      }
    }
  }, [auth, navigate]);

  return state?.admins?.role === "admin" ? (
    <AdminAuthenticated />
  ) : auth.isAuthenticated && tokenValid ? (
    <AuthenticatedApp />
  ) : (
    <UnauthenticatedApp />
  );

}

export default App;


