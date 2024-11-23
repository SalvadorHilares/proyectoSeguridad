import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { sendEmailToGroup, getMessagesByUser } from "../../Redux/actions";

const MyGroups = () => {
  const dispatch = useDispatch();
  const groups = useSelector((state) => state.groups);
  const messageByGroup = useSelector((state) => state.messages);
  const [showPopup, setShowPopup] = useState(false); // Pop-up para enviar mensajes
  const [showMessages, setShowMessages] = useState(false); // Mostrar correos recibidos
  const [selectedGroup, setSelectedGroup] = useState(null); // Grupo seleccionado
  const [message, setMessage] = useState(""); // Mensaje escrito por el usuario
  const [isLoading, setIsLoading] = useState(false); // Barra de carga
  const [notification, setNotification] = useState(null); // Notificación de éxito/error

  // Cargar los mensajes al montar el componente
  useEffect(() => {
    dispatch(getMessagesByUser());
  }, [dispatch]);

  // Filtrar los mensajes "NO VISTOS" para cada grupo
  const getUnreadMessagesCount = (groupId) => {
    return messageByGroup.filter(
      (msg) => msg.groupId === groupId && msg.state === "NO VISTO"
    ).length;
  };

  // Manejar la vista de correos recibidos
  const handleViewReceivedEmails = (groupId) => {
    setSelectedGroup(groupId);
    setShowMessages(true); // Mostrar los correos recibidos
  };

  // Cerrar la vista de correos
  const closeMessagesView = () => {
    setShowMessages(false);
    setSelectedGroup(null);
  };

  const handleSendEmail = async () => {
    setIsLoading(true);
    try {
      const response = await dispatch(
        sendEmailToGroup({
          groupId: selectedGroup,
          message: message,
        })
      );
      if (response.success) {
        setNotification("success");
        setShowPopup(false);
      } else {
        setNotification("error");
      }
    } catch (error) {
      setNotification("error");
    } finally {
      setIsLoading(false);
      setTimeout(() => setNotification(null), 3000);
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen p-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Tus Grupos</h1>

      {groups.length > 0 ? (
        <ul className="space-y-4">
          {groups.map((group) => (
            <li
              key={group.id}
              className="flex justify-between items-center p-4 bg-white rounded-lg shadow hover:bg-gray-50 transition duration-200"
            >
              {/* Nombre del grupo */}
              <span className="text-lg font-medium text-gray-700">{group.name}</span>

              <div className="flex space-x-2">
                {/* Botón para enviar mensajes */}
                <button
                  onClick={() => {
                    setSelectedGroup(group.id);
                    setShowPopup(true);
                  }}
                  className="px-4 py-2 bg-blue-500 text-white font-bold rounded-md hover:bg-blue-600 transition duration-150"
                >
                  Enviar correo
                </button>

                {/* Botón para correos recibidos */}
                <button
                  onClick={() => handleViewReceivedEmails(group.id)}
                  className="flex items-center px-4 py-2 bg-gray-500 text-white font-bold rounded-md hover:bg-gray-600 transition duration-150"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                    className="w-5 h-5 mr-2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3 8l7.39 5.26a2 2 0 002.22 0L20 8m-17 8h17a2 2 0 002-2V8a2 2 0 00-2-2H4a2 2 0 00-2 2v6a2 2 0 002 2z"
                    />
                  </svg>
                  Correos recibidos
                  {/* Mostrar cantidad de mensajes NO VISTOS */}
                  <span className="ml-2 bg-red-500 text-white text-sm font-bold px-2 py-1 rounded-full">
                    {getUnreadMessagesCount(group.id)}
                  </span>
                </button>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-600">No perteneces a ningún grupo.</p>
      )}

      {/* Pop-up para enviar mensajes */}
      {showPopup && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-10"
          onClick={() => setShowPopup(false)}
        >
          <div
            className="bg-white w-full max-w-md p-6 rounded-lg shadow-lg relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowPopup(false)}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
            >
              ✕
            </button>

            <h2 className="text-xl font-bold mb-4 text-center">Escribe tu mensaje</h2>

            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg"
              placeholder="Escribe tu mensaje aquí..."
              rows={5}
              disabled={isLoading}
            ></textarea>

            <button
              onClick={handleSendEmail}
              disabled={isLoading}
              className={`mt-4 w-full ${
                isLoading ? "bg-gray-400" : "bg-blue-500"
              } text-white font-bold py-2 rounded-md ${
                isLoading ? "cursor-not-allowed" : "hover:bg-blue-600"
              }`}
            >
              {isLoading ? "Enviando..." : "Enviar mensaje"}
            </button>
          </div>
        </div>
      )}

      {/* Vista de correos recibidos */}
      {showMessages && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-10">
          <div className="bg-white p-6 rounded-lg w-full max-w-2xl">
            <button
              onClick={closeMessagesView}
              className="absolute top-4 right-6 text-gray-600 hover:text-gray-800"
            >
              ✕
            </button>
            <h2 className="text-xl font-bold mb-4">Correos recibidos</h2>
            <ul className="space-y-2">
              {messageByGroup
                .filter((msg) => msg.groupId === selectedGroup)
                .map((msg) => (
                  <li key={msg.id} className="p-4 bg-gray-100 rounded-lg shadow">
                    <span className="font-bold">De: {msg.senderName}</span>
                    <p>{msg.content}</p>
                    <span className="text-sm text-gray-500">{msg.state}</span>
                  </li>
                ))}
            </ul>
          </div>
        </div>
      )}

      {/* Notificación de éxito/error */}
      {notification && (
        <div
          className={`fixed bottom-4 right-4 p-4 rounded-lg shadow-lg ${
            notification === "success" ? "bg-green-500" : "bg-red-500"
          } text-white`}
        >
          {notification === "success" ? "Mensaje enviado" : "Mensaje no enviado"}
        </div>
      )}
    </div>
  );
};

export default MyGroups;
