import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getUsers, sendKeyGroup } from "../../Redux/actions";
import { Link } from "react-router-dom";

const CreateGroup = () => {
  const dispatch = useDispatch();
  const users = useSelector((state) => state.usersRegister); // Asegúrate de que el reducer almacene los usuarios
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [groupName, setGroupName] = useState(""); // Estado para el nombre del grupo
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false); // Estado para el envío
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
  const handleSendEmails = async () => {
    const selectedEmails = users
      .filter((user) => selectedUsers.includes(user.id))
      .map((user) => user.email);

    setSending(true); // Activar el estado de "enviando"
    try {
      const resp = await dispatch(
        sendKeyGroup({
          usersEmail: selectedEmails,
          nameNotification: groupName,
        })
      );
      if (!resp.success) {
        throw new Error("Error al enviar los correos.");
      }
      alert("Correos enviados correctamente.");
    } catch (err) {
      alert("Error al enviar los correos.");
    } finally {
      setSending(false); // Desactivar el estado de "enviando"
    }
  };

  if (loading) {
    return <div className="text-center">Cargando usuarios...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Crear Grupo</h2>

      {/* Input para el nombre del grupo */}
      <div className="w-full max-w-md mb-4">
        <label htmlFor="groupName" className="block text-sm font-medium text-gray-700">
          Nombre del Grupo
        </label>
        <input
          id="groupName"
          type="text"
          value={groupName}
          onChange={(e) => setGroupName(e.target.value)}
          className="w-full px-4 py-2 mt-1 text-gray-700 bg-gray-100 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          placeholder="Ingresa el nombre del grupo"
          required
        />
      </div>

      <div className="w-full max-w-md">
        {/* Lista de usuarios */}
        <ul className="space-y-2">
          {users.map((user) => (
            <li
              key={user.id}
              onClick={() => handleUserSelect(user.id)}
              className={`cursor-pointer p-2 border rounded-md ${
                selectedUsers.includes(user.id) ? "bg-green-200" : "bg-white"
              }`}
            >
              <span className="font-semibold">
                {user.name} {user.lastName}
              </span>{" "}
              - {user.email}
            </li>
          ))}
        </ul>

        {/* Botón de enviar */}
        <button
          onClick={handleSendEmails}
          disabled={selectedUsers.length === 0 || !groupName || sending}
          className={`w-full mt-4 py-2 text-white rounded-md focus:outline-none ${
            selectedUsers.length > 0 && groupName && !sending
              ? "bg-blue-600 hover:bg-blue-700"
              : "bg-gray-400 cursor-not-allowed"
          }`}
        >
          {sending ? "Enviando correos..." : "Enviar Correos"}
        </button>
      </div>

      {/* Regresar al Home */}
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
