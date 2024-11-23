import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getUsers, sendKeyGroup } from "../../Redux/actions";
import { Link } from "react-router-dom";

const CreateGroup = () => {
  const dispatch = useDispatch();
  const users = useSelector((state) => state.usersRegister);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [groupName, setGroupName] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState(null);
  const [notificationStatus, setNotificationStatus] = useState(null); // Notificación de éxito o error

  // Cargar usuarios al montar el componente
  useEffect(() => {
    try {
      dispatch(getUsers());
      setLoading(false);
    } catch (error) {
      setError("Error al cargar los usuarios.");
      setLoading(false);
    }
  }, [dispatch]);

  const handleUserSelect = (userId) => {
    if (selectedUsers.includes(userId)) {
      setSelectedUsers(selectedUsers.filter((id) => id !== userId));
    } else {
      setSelectedUsers([...selectedUsers, userId]);
    }
  };

  const handleSendEmails = async () => {
    const selectedEmails = users
      .filter((user) => selectedUsers.includes(user.id))
      .map((user) => user.email);

    setSending(true);
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

      setNotificationStatus("success"); // Notificación de éxito
    } catch (err) {
      setNotificationStatus("error"); // Notificación de error
    } finally {
      setSending(false);
      setTimeout(() => setNotificationStatus(null), 3000); // Ocultar notificación después de 3 segundos
    }
  };

  if (loading && users.length === 0) {
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

        {/* Botón de enviar correos */}
        <button
          onClick={handleSendEmails}
          disabled={selectedUsers.length === 0 || !groupName || sending}
          className={`w-full mt-4 py-2 text-white rounded-md focus:outline-none ${
            selectedUsers.length > 0 && groupName && !sending
              ? "bg-blue-600 hover:bg-blue-700"
              : "bg-gray-400 cursor-not-allowed"
          }`}
        >
          {sending ? (
            <div className="flex items-center justify-center">
              <div className="w-4 h-4 border-2 border-white border-dotted rounded-full animate-spin mr-2"></div>
              Enviando correos...
            </div>
          ) : (
            "Enviar Correos"
          )}
        </button>
      </div>

      {/* Notificación de éxito/error */}
      {notificationStatus && (
        <div
          className={`fixed bottom-4 right-4 p-4 rounded-lg shadow-lg transition transform ${
            notificationStatus === "success"
              ? "bg-green-500 text-white animate-bounce"
              : "bg-red-500 text-white animate-bounce"
          }`}
        >
          {notificationStatus === "success"
            ? "Correos enviados correctamente"
            : "Error al enviar los correos"}
        </div>
      )}

      {/* Regresar al Home */}
      <div className="text-center mt-4">
        <Link to="/home" className="text-sm font-medium text-gray-600 hover:text-gray-800">
          &larr; Volver al Home
        </Link>
      </div>
    </div>
  );
};

export default CreateGroup;
