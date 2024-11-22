import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { LOGOUT } from "../../Redux/actions";
import { Link, useNavigate } from "react-router-dom";
import MyGroups from "./MyGroups";
import { getGroupsByUser } from "../../Redux/actions"; // Asegúrate de importar la acción para obtener los grupos

const Home = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Manejar logout
  const handleLogout = () => {
    dispatch({ type: LOGOUT });
    navigate("/login");
  };

  useEffect(() => {
    dispatch(getGroupsByUser());
  }, [dispatch]);

  return (
    <div className="text-center mt-8 space-y-4">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">BIENVENIDO USUARIO</h2>

      <div className="flex justify-center space-x-4">
        {/* Botón de Crear Grupo */}
        <Link
          to="/create-group"
          className="flex items-center bg-blue-500 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg"
        >
          <span className="text-2xl mr-2">➕</span>
          Crear Grupo
        </Link>

        {/* Botón de Unirse a Grupo */}
        <Link
          to="/join-group"
          className="flex items-center bg-green-500 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg"
        >
          <span className="text-2xl mr-2">👥</span>
          Invitaciones Pendientes
        </Link>
      </div>

      {/* Botón de Logout */}
      <button
        onClick={handleLogout}
        className="mt-6 bg-red-500 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-lg"
      >
        Cerrar Sesión
      </button>

      {/* Mostrar los grupos */}

        <MyGroups />
    </div>
  );
};

export default Home;
