import React from 'react';
import { Link } from 'react-router-dom';

const Landing = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 space-y-6">
      <h1 className="text-4xl font-bold text-gray-800">Bienvenido a la Página Principal</h1>

      {/* Link para redirigir al inicio de sesión */}
      <Link
        to="/login"
        className="px-6 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        Iniciar Sesión
      </Link>

      {/* Botón de registro */}
      <Link
        to="/register"
        className="px-6 py-2 text-white bg-green-600 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
      >
        Registrarse
      </Link>
    </div>
  );
};

export default Landing;
