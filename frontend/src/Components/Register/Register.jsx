import React from 'react';
import { Link } from 'react-router-dom';

const Register = () => {
  const [emailDomain, setEmailDomain] = React.useState('@hotmail.com');

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-center text-gray-800">Registro</h2>
        
        <form className="space-y-4">
          {/* Nombre */}
          <div>
            <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
              Nombre
            </label>
            <input
              type="text"
              id="firstName"
              className="w-full px-4 py-2 mt-1 text-gray-700 bg-gray-100 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          {/* Apellido Paterno */}
          <div>
            <label htmlFor="lastName1" className="block text-sm font-medium text-gray-700">
              Apellido Paterno
            </label>
            <input
              type="text"
              id="lastName1"
              className="w-full px-4 py-2 mt-1 text-gray-700 bg-gray-100 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          {/* Apellido Materno */}
          <div>
            <label htmlFor="lastName2" className="block text-sm font-medium text-gray-700">
              Apellido Materno
            </label>
            <input
              type="text"
              id="lastName2"
              className="w-full px-4 py-2 mt-1 text-gray-700 bg-gray-100 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          {/* Email con dominio seleccionable */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Correo electrónico
            </label>
            <div className="flex">
              <input
                type="text"
                id="email"
                placeholder="your-email"
                className="w-full px-4 py-2 mt-1 text-gray-700 bg-gray-100 border border-gray-300 rounded-l-md focus:ring-blue-500 focus:border-blue-500"
                required
              />
              <select
                value={emailDomain}
                onChange={(e) => setEmailDomain(e.target.value)}
                className="px-2 py-2 mt-1 text-gray-700 bg-gray-100 border border-gray-300 rounded-r-md focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="@hotmail.com">@hotmail.com</option>
                <option value="@gmail.com">@gmail.com</option>
                <option value="@outlook.com">@outlook.com</option>
              </select>
            </div>
          </div>

          {/* Contraseña */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Contraseña
            </label>
            <input
              type="password"
              id="password"
              className="w-full px-4 py-2 mt-1 text-gray-700 bg-gray-100 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          {/* Confirmar Contraseña */}
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
              Confirmar Contraseña
            </label>
            <input
              type="password"
              id="confirmPassword"
              className="w-full px-4 py-2 mt-1 text-gray-700 bg-gray-100 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          {/* Botón de registro */}
          <button
            type="submit"
            className="w-full py-2 text-white bg-green-600 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            Registrarse
          </button>
        </form>

        {/* Botón para regresar al Home */}
        <div className="text-center mt-4">
          <Link
            to="/"
            className="text-sm font-medium text-gray-600 hover:text-gray-800"
          >
            &larr; Volver al Inicio
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
