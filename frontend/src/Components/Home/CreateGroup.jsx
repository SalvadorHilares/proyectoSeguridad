import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getUsers } from "../../Redux/actions";
import { Link } from "react-router-dom";

const CreateGroup = () => {
  const dispatch = useDispatch();
  const users = useSelector((state) => state.usersRegister); // Asegúrate de que el reducer almacene los usuarios
  const [selectedUsers, setSelectedUsers] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Cargar los usuarios al montar el componente
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        await dispatch(getUsers());
        setLoading(false);
      } catch (err) {
        setError("Error al cargar los usuarios");
        setLoading(false);
      }
    };

    fetchUsers();
  }, [dispatch]);

  // Manejar la selección de usuarios
  const handleUserSelect = (userId) => {
    if (selectedUsers.includes(userId)) {
      setSelectedUsers(selectedUsers.filter((id) => id !== userId));
    } else {
      setSelectedUsers([...selectedUsers, userId]);
    }
  };

  // Manejar el envío de correos
  const handleSendEmails = () => {
    const selectedEmails = users
      .filter((user) => selectedUsers.includes(user.id))
      .map((user) => user.email);

    alert(`Enviando correo a: ${selectedEmails.join(", ")}`);
  };

  if (loading) {
    return <div className="text-center">Cargando usuarios...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Usuarios</h2>

      <div className="w-full max-w-md">
        {/* Lista desplegable de usuarios */}
        <ul className="space-y-2">
          {users.map((user) => (
            <li
              key={user.id}
              onClick={() => handleUserSelect(user.id)}
              className={`cursor-pointer p-2 border rounded-md ${
                selectedUsers.includes(user.id) ? "bg-green-200" : "bg-white"
              }`}
            >
              <span className="font-semibold">{user.name} {user.lastName}</span> - {user.email}
            </li>
          ))}
        </ul>

        {/* Botón de enviar */}
        <button
          onClick={handleSendEmails}
          disabled={selectedUsers.length === 0}
          className={`w-full mt-4 py-2 text-white rounded-md focus:outline-none ${
            selectedUsers.length > 0
              ? "bg-blue-600 hover:bg-blue-700"
              : "bg-gray-400 cursor-not-allowed"
          }`}
        >
          Enviar Correo
        </button>
      </div>
      <div className="text-center mt-4">
        <Link
          to="/home"
          className="text-sm font-medium text-gray-600 hover:text-gray-800"
        >
          &larr; Volver al Home
        </Link>
      </div>
    </div>
  );
};

export default CreateGroup;
