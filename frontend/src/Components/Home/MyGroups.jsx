import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { sendEmailToGroup, getMessagesByUser, showMessagesToGroup, getUsersByGroup } from "../../Redux/actions";

const MyGroups = () => {
  const dispatch = useDispatch();
  const groups = useSelector((state) => state.groups);
  const messageByGroup = useSelector((state) => state.messages);
  const [usersGroup, setUsersGroup] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [showMessages, setShowMessages] = useState(false);
  const [showUsersByGroup, setShowUsersByGroup] = useState(false);
  const [highlightedMessage, setHighlightedMessage] = useState(null); // Animar mensaje seleccionado
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState(null);
  const [messageDetails, setMessageDetails] = useState({}); // Detalles del mensaje seleccionado

  useEffect(() => {
    dispatch(getMessagesByUser());
  }, [dispatch]);

  const getUnreadMessagesCount = (groupId) =>
    messageByGroup.filter((msg) => msg.groupId === groupId && msg.state === "NO VISTO").length;

  const handleViewReceivedEmails = (groupId) => {
    setSelectedGroup(groupId);
    setShowMessages(true);
  };

  const closeMessagesView = () => {
    setShowMessages(false);
    setSelectedGroup(null);
    setHighlightedMessage(null);
    setMessageDetails({});
  };

  const handleSendEmail = async () => {
    setIsLoading(true);
    try {
      const response = await dispatch(sendEmailToGroup({ groupId: selectedGroup, message }));
      setNotification(response.success ? "success" : "error");
      setShowPopup(false);
    } catch (error) {
      setNotification("error");
    } finally {
      setIsLoading(false);
      setTimeout(() => setNotification(null), 3000);
    }
  };

  const handleShowMessage = async (messageId, groupId) => {
    try {
      const response = await dispatch(showMessagesToGroup({ messageId, groupId }));
      if (response.success) {
        setHighlightedMessage(messageId);
        setMessageDetails((prev) => ({
          ...prev,
          [messageId]: response.data.message,
        }));
        setTimeout(() => setHighlightedMessage(null), 2000); // Resaltar el mensaje por 2 segundos
      } else {
        alert("Error al mostrar mensaje");
      }
    } catch (error) {
      console.error("Error al mostrar mensaje:", error.message);
    }
  };

  const handleGetUsersByGroup = async () => {
    try {
      const response = await dispatch(getUsersByGroup(selectedGroup));
      if (response.success) {
        setUsersGroup(response.data);
        setShowUsersByGroup(true);
      } else {
        alert("Error al obtener usuarios del grupo");
      }
    } catch (error) {
      console.error("Error al obtener usuarios del grupo:", error.message);
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
              className="flex justify-between items-center p-4 bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-200"
            >
              <span className="text-lg font-medium text-gray-700">{group.name}</span>

              <div className="flex space-x-3">
                {group.isAdmin && (
                  <button
                    onClick={() => {
                      setSelectedGroup(group.id);
                      handleGetUsersByGroup();
                    }}
                    className="px-4 py-2 bg-green-500 text-white font-bold rounded-md hover:bg-green-600 transition duration-150">
                    Administrar
                  </button>
                )}

                <button
                  onClick={() => {
                    setSelectedGroup(group.id);
                    setShowPopup(true);
                  }}
                  className="px-4 py-2 bg-blue-500 text-white font-bold rounded-md hover:bg-blue-600 transition duration-150"
                >
                  Enviar correo
                </button>

                <button
                  onClick={() => handleViewReceivedEmails(group.id)}
                  className="flex items-center px-4 py-2 bg-gray-500 text-white font-bold rounded-md hover:bg-gray-600 transition duration-150"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-5 h-5 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3 8l7.39 5.26a2 2 0 002.22 0L20 8m-17 8h17a2 2 0 002-2V8a2 2 0 00-2-2H4a2 2 0 00-2 2v6a2 2 0 002 2z"
                    />
                  </svg>
                  Correos recibidos
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

      {showPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-10">
          <div className="bg-white w-full max-w-md p-6 rounded-lg shadow-lg relative transform transition-transform scale-95 animate-fade-in">
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
              className={`mt-4 w-full ${isLoading ? "bg-gray-400" : "bg-blue-500"} text-white font-bold py-2 rounded-md`}
            >
              {isLoading ? "Enviando..." : "Enviar mensaje"}
            </button>
          </div>
        </div>
      )}

      {showUsersByGroup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-10">
          <div className="bg-white w-full max-w-md p-6 rounded-lg shadow-lg relative transform transition-transform scale-95 animate-fade-in">
            <button
              onClick={() => setShowUsersByGroup(false)}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
            >
              ✕
            </button>
            <h2 className="text-xl font-bold mb-4 text-center">Usuarios del grupo</h2>
            <ul className="list-disc list-inside mb-4">
              {usersGroup.map((user) => (
                <li key={user.user.id} className="text-gray-600 flex items-center">
                <span className="mr-2">{user.user.name}</span>
                <span className="mr-2">{user.user.lastName}</span>
                {user.accept === "ACEPTADO" && (
                  <span className="text-green-500 text-lg">✔ ACEPTADO</span> // Check verde
                )}
                {user.accept === "ESPERA" && (
                  <span className="text-yellow-500 text-lg">⏳ ESPERA</span> // Reloj amarillo (espera)
                )}
                {user.accept === "RECHAZADO" && (
                  <span className="text-red-500 text-lg">✖ RECHAZADO</span> // X roja
                )}
              </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {showMessages && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-10">
          <div className="bg-white p-6 rounded-lg w-full max-w-2xl relative transform transition-transform animate-slide-up">
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
                  <li
                    key={msg.id}
                    className={`p-4 bg-gray-100 rounded-lg shadow ${
                      highlightedMessage === msg.id ? "ring-2 ring-blue-500 animate-pulse" : ""
                    }`}
                  >
                    <span className="font-bold">De: {msg.senderName}</span>
                    <span className="ml-2 text-sm text-gray-500">{msg.state}</span>
                    <button
                      onClick={() => handleShowMessage(msg.id, msg.groupId)}
                      className="ml-4 bg-blue-500 text-white px-2 py-1 rounded-md"
                    >
                      Mostrar mensaje
                    </button>
                    {messageDetails[msg.id] && (
                      <div className="mt-2 p-2 bg-gray-200 rounded-md">
                        <p className="text-gray-700">{messageDetails[msg.id]}</p>
                      </div>
                    )}
                  </li>
                ))}
            </ul>
          </div>
        </div>
      )}

      {notification && (
        <div
          className={`fixed bottom-4 right-4 p-4 rounded-lg shadow-lg ${
            notification === "success" ? "bg-green-500" : "bg-red-500"
          } text-white animate-slide-in`}
        >
          {notification === "success" ? "Mensaje enviado" : "Mensaje no enviado"}
        </div>
      )}
    </div>
  );
};

export default MyGroups;
