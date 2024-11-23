import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, Link } from "react-router-dom";
import {
  getNotificationsByUser,
  getUsersByNotification,
  desecryptKeyGroup,
} from "../../Redux/actions";

const JoinGroup = () => {
  const { notificationId } = useParams();
  const dispatch = useDispatch();
  const notifications = useSelector((state) => state.notifications);
  const [notification, setNotification] = useState(null);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [loading, setLoading] = useState(false); // Barra de carga global
  const [responseLoading, setResponseLoading] = useState(false); // Barra de carga específica para "Aceptar/Rechazar"
  const [error, setError] = useState(null);
  const [notificationStatus, setNotificationStatus] = useState(null); // Notificación de éxito/error

  useEffect(() => {
    try {
      dispatch(getNotificationsByUser());
    } catch (error) {
      setError("Error al cargar las notificaciones.");
    }
  }, [dispatch]);

  useEffect(() => {
    const fetchGroup = async () => {
      if (notificationId && notifications.length > 0) {
        try {
          const group = await dispatch(getUsersByNotification(notificationId));
          setNotification(notifications.find((n) => n.id === notificationId));
          if (group) setSelectedGroup(group);
        } catch (error) {
          console.error("Error fetching group:", error);
        }
      }
    };
    fetchGroup();
  }, [notificationId, notifications, dispatch]);

  const handleInvitationClick = async (notification) => {
    setLoading(true);
    try {
      const users = await dispatch(getUsersByNotification(notification.id));
      setNotification(notification);
      setSelectedGroup(users);
    } catch (error) {
      console.error("Error al seleccionar la invitación:", error);
    } finally {
      setLoading(false);
    }
  };

  const closePopup = () => {
    setSelectedGroup(null);
    setNotificationStatus(null); // Ocultar cualquier notificación activa
  };

  const handleResponse = async (response) => {
    setResponseLoading(true);
    try {
      const resp = await dispatch(
        desecryptKeyGroup({
          notificationId: notification.id,
          isAccept: response === "aceptado",
        })
      );

      if (resp.success) {
        setNotificationStatus("success");
        dispatch(getNotificationsByUser());
      } else {
        setNotificationStatus("error");
      }
    } catch (error) {
      setNotificationStatus("error");
      console.error("Error al procesar la respuesta:", error);
    } finally {
      setResponseLoading(false);
      setTimeout(() => setNotificationStatus(null), 3000); // Ocultar la notificación tras 3 segundos
    }
  };

  if (loading && notifications.length === 0) {
    return <div className="text-center">Cargando invitaciones...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-100 p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Invitaciones a Grupos</h2>

      {/* Lista de invitaciones */}
      <ul className="w-full max-w-md space-y-4">
        {notifications.filter((notification) => notification?.accept === "ESPERA").length > 0 ? (
          notifications
            .filter((notification) => notification?.accept === "ESPERA")
            .map((notification) => (
              <li
                key={notification.id}
                className="p-4 bg-white rounded-lg shadow-lg cursor-pointer hover:bg-blue-100"
                onClick={() => handleInvitationClick(notification)}
              >
                {notification.name}
              </li>
            ))
        ) : (
          <li className="text-center text-gray-600">No hay invitaciones pendientes</li>
        )}
      </ul>

      {/* Pop-up de detalles de la invitación */}
      {selectedGroup && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-10"
          onClick={closePopup}
        >
          <div
            className="relative bg-white w-full max-w-md p-6 rounded-lg shadow-lg transform transition-all duration-300 scale-95"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={closePopup}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 focus:outline-none"
            >
              ✕
            </button>

            <h3 className="text-xl font-bold text-center mb-4">{selectedGroup.name}</h3>

            <p className="font-medium text-gray-700 mb-2">Usuarios en el grupo:</p>
            <ul className="list-disc list-inside mb-4">
              {selectedGroup.map((user) => (
                <li key={user.user.id} className="text-gray-600">
                  {user.user.name} {user.user.lastName}
                </li>
              ))}
            </ul>

            {/* Botones de Aceptar y Rechazar */}
            <div className="flex justify-center space-x-4">
              <button
                onClick={() => handleResponse("aceptado")}
                className="px-4 py-2 bg-green-500 text-white font-bold rounded-md hover:bg-green-600 transition transform hover:scale-105"
                disabled={responseLoading}
              >
                {responseLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="w-4 h-4 border-2 border-white border-dotted rounded-full animate-spin mr-2"></div>
                    Procesando...
                  </div>
                ) : (
                  "Aceptar"
                )}
              </button>
              <button
                onClick={() => handleResponse("rechazado")}
                className="px-4 py-2 bg-red-500 text-white font-bold rounded-md hover:bg-red-600 transition transform hover:scale-105"
                disabled={responseLoading}
              >
                Rechazar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Notificación de éxito/error */}
      {notificationStatus && (
        <div
          className={`fixed bottom-4 right-4 p-4 rounded-lg shadow-lg transition transform ${
            notificationStatus === "success"
              ? "bg-green-500 text-white animate-bounce"
              : "bg-red-500 text-white animate-bounce"
          }`}
        >
          {notificationStatus === "success" ? "Acción realizada con éxito" : "Error al procesar la acción"}
        </div>
      )}

      <div className="text-center mt-4">
        <Link to="/home" className="text-sm font-medium text-gray-600 hover:text-gray-800">
          &larr; Volver al Inicio
        </Link>
      </div>
    </div>
  );
};

export default JoinGroup;
