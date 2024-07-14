import { Route, Routes } from 'react-router-dom';
import './App.css';
import HomePage from './pages/HomePage';
import Register from './pages/auth/Register';
import Login from './pages/auth/Login';
import ForgotPassword from './pages/auth/ForgotPassword';
import PrivateRoute from './components/routes/PrivateRoute';
import AdminPrivateRoute from './components/routes/AdminPrivateRoute';

function App() {
  return (
    <>
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />

      <Route path="/user" element={<PrivateRoute />} >
        <Route path="home" element={<HomePage />} />
      </Route>

      <Route path="/admin" element={<AdminPrivateRoute />} >
        <Route path="home" element={<HomePage />} />
      </Route>
    </Routes>
    </>
  )
}

export default App;
