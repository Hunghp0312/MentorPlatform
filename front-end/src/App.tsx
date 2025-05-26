import "./App.css";
import AppRouter from "./routers/app.router";
import { AuthProvider } from "./contexts/AuthContext";

function App() {
  return (
    <AuthProvider>
      <AppRouter></AppRouter>
    </AuthProvider>
  );
}

export default App;
