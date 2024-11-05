import React from 'react'
import { Link } from 'react-router-dom'

const CreateGroup = () => {
    
    const [selectedUsers, setSelectedUsers] = React.useState([]);

  // Lista de usuarios por defecto
  const users = [
    { id: 1, name: 'Dion Carlos', email: 'rodrigo.carlos@utec.edu.pe' },
    { id: 2, name: 'Mauricio Rodriguez', email: 'mauricio.rodriguez@utec.edu.pe' },
    { id: 3, name: 'Salvador Hilares', email: 'salvador.hilares@utec.edu.pe' },
  ];

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
    
    alert(`Enviando correo a: ${selectedEmails.join(', ')}`);
  };

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
                selectedUsers.includes(user.id) ? 'bg-green-200' : 'bg-white'
              }`}
            >
              <span className="font-semibold">{user.name}</span> - {user.email}
            </li>
          ))}
        </ul>

        {/* Botón de enviar */}
        <button
          onClick={handleSendEmails}
          disabled={selectedUsers.length === 0}
          className={`w-full mt-4 py-2 text-white rounded-md focus:outline-none ${
            selectedUsers.length > 0 ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-400 cursor-not-allowed'
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
  )
}

export default CreateGroup