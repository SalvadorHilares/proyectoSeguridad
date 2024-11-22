import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, Link } from 'react-router-dom';
import { getNotificationsByUser, getUsersByNotification, desecryptKeyGroup } from '../../Redux/actions';

const JoinGroup = () => {
  const { notificationId } = useParams();
  const dispatch = useDispatch();
  const notifications = useSelector((state) => state.notifications);
  const [notification, setNotification] = useState(null);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [loading, setLoading] = useState(notificationId ? true : false);
  const [error, setError] = useState(null);

  // Cargar notificaciones al montar el componente
  useEffect(() => {
    try {
      dispatch(getNotificationsByUser());
      setLoading(false);
    } catch (error) {
      setError('Error al cargar las notificaciones.');
      setLoading(false);
    }
  }, [dispatch]);

  // Abrir automáticamente el pop-up si hay un `notificationId`
  useEffect(() => {
    const fetchGroup = async () => {
      if (notificationId && notifications.length > 0) {
        try {
          const group = await dispatch(getUsersByNotification(notificationId));
          setNotification(notifications.find((n) => n.id === notificationId));
          if (group) setSelectedGroup(group);
        } catch (error) {
          console.error('Error fetching group:', error);
        }
      }
    };
  
    fetchGroup();
  }, [notificationId, notifications, dispatch]);

  // Maneja la selección de una invitación
  const handleInvitationClick = async (notification) => {
    const users = await dispatch(getUsersByNotification(notification.id));
    setNotification(notification);
    setSelectedGroup(users);
  };

  // Cierra el pop-up
  const closePopup = () => {
    setSelectedGroup(null);
  };

  // Maneja la aceptación o rechazo de la invitación
  const handleResponse = async (response) => {
    const resp = await dispatch(desecryptKeyGroup( {
      'notificationId' : notification.id,
      'isAccept' : response === 'aceptado' ? true : false
    }));
    if (resp.success) {
      dispatch(getNotificationsByUser());
      alert(`Has ${response} la invitación para unirte al grupo ${selectedGroup[0].name}`);
      closePopup();
    }else{
      alert(`Error al ${response} la invitación. Por favor
      inténtalo de nuevo más tarde.`);
    }
  };

  // Renderizar mientras se cargan las notificaciones
  if (loading && notifications.length === 0) {
    return <div className="text-center">Cargando invitaciones...</div>;
  }

  // Renderizar si ocurre un error al cargar
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
          onClick={closePopup} // Cierra el pop-up si se hace clic fuera
        >
          <div
            className="relative bg-white w-full max-w-md p-6 rounded-lg shadow-lg transform transition-all duration-300 scale-95"
            onClick={(e) => e.stopPropagation()} // Evita cerrar el pop-up al hacer clic dentro
          >
            {/* Botón de cerrar */}
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

            {/* Botones de Aceptar y Rechazar */}
            <div className="flex justify-center space-x-4">
              <button
                onClick={() => handleResponse('aceptado')}
                className="px-4 py-2 bg-green-500 text-white font-bold rounded-md hover:bg-green-600 transform transition duration-150 hover:scale-105"
              >
                Aceptar
              </button>
              <button
                onClick={() => handleResponse('rechazado')}
                className="px-4 py-2 bg-red-500 text-white font-bold rounded-md hover:bg-red-600 transform transition duration-150 hover:scale-105"
              >
                Rechazar
              </button>
            </div>
          </div>
        </div>
      )}
      <div className="text-center mt-4">
        <Link
          to="/home"
          className="text-sm font-medium text-gray-600 hover:text-gray-800"
        >
          &larr; Volver al Inicio
        </Link>
      </div>
    </div>
  );
};

export default JoinGroup;
