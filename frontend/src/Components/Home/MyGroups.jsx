import { useSelector } from "react-redux";

const MyGroups = () => {
  const groups = useSelector((state) => state.groups);
  if (groups.length === 0) {
    return <p>No tienes grupos asignados.</p>;
  }

  const handleSendMessage = (groupId) => {
    console.log("Enviando mensaje al grupo:", groupId);
  }

  const handleViewReceivedEmails = (groupId) => {
    console.log("Viendo correos recibidos del grupo:", groupId);
  }

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
                  onClick={() => handleSendMessage(group.id)}
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
                </button>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-600">No perteneces a ningún grupo.</p>
      )}
    </div>
  );  
};

export default MyGroups;
