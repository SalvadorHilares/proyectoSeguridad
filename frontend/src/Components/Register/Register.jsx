import { useState } from "react";
import { register } from "../../Redux/actions";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName1: "",
    lastName2: "",
    email: "",
    emailDomain: "@hotmail.com",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };

  const validate = () => {
    const errors = {};
    if (!formData.firstName.trim()) errors.firstName = "El nombre es obligatorio.";
    if (!formData.lastName1.trim()) errors.lastName1 = "El apellido paterno es obligatorio.";
    if (!formData.lastName2.trim()) errors.lastName2 = "El apellido materno es obligatorio.";
    if (!formData.email.trim()) errors.email = "El correo electrónico es obligatorio.";
    if (!/\S+@\S+\.\S+/.test(`${formData.email}${formData.emailDomain}`))
      errors.email = "El correo electrónico no es válido.";
    if (!formData.password.trim()) errors.password = "La contraseña es obligatoria.";
    if (formData.password.length < 8)
      errors.password = "La contraseña debe tener al menos 8 caracteres.";
    if (formData.password !== formData.confirmPassword)
      errors.confirmPassword = "Las contraseñas no coinciden.";
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);

    try {
      const user = {
        name: formData.firstName,
        lastName: `${formData.lastName1} ${formData.lastName2}`,
        email: `${formData.email}${formData.emailDomain}`,
        password: formData.password,
      };

      await dispatch(register(user));
      setShowSuccessMessage(true); // Mostrar mensaje de éxito
      setTimeout(() => {
        setShowSuccessMessage(false);
        navigate("/home"); // Navegar después de un pequeño retraso
      }, 2000);
    } catch (error) {
      setErrors({ server: "Ocurrió un error durante el registro. Inténtalo de nuevo." });
      console.error("Error during registration:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-center text-gray-800">Registro</h2>

        {/* Mensaje de éxito */}
        {showSuccessMessage && (
          <div
            className="p-4 mb-4 text-green-700 bg-green-100 border border-green-400 rounded-lg transition-transform duration-500 transform scale-100 animate-bounce"
          >
            ¡Registro exitoso! Redirigiendo al inicio...
          </div>
        )}

        {errors.server && (
          <div className="p-4 text-red-700 bg-red-100 border border-red-400 rounded">
            {errors.server}
          </div>
        )}

        <form className="space-y-4" onSubmit={handleSubmit}>
          {/* Nombre */}
          <div>
            <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
              Nombre
            </label>
            <input
              type="text"
              id="firstName"
              value={formData.firstName}
              onChange={handleChange}
              className="w-full px-4 py-2 mt-1 text-gray-700 bg-gray-100 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
            {errors.firstName && <p className="text-sm text-red-600">{errors.firstName}</p>}
          </div>

          {/* Apellido Paterno */}
          <div>
            <label htmlFor="lastName1" className="block text-sm font-medium text-gray-700">
              Apellido Paterno
            </label>
            <input
              type="text"
              id="lastName1"
              value={formData.lastName1}
              onChange={handleChange}
              className="w-full px-4 py-2 mt-1 text-gray-700 bg-gray-100 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
            {errors.lastName1 && <p className="text-sm text-red-600">{errors.lastName1}</p>}
          </div>

          {/* Apellido Materno */}
          <div>
            <label htmlFor="lastName2" className="block text-sm font-medium text-gray-700">
              Apellido Materno
            </label>
            <input
              type="text"
              id="lastName2"
              value={formData.lastName2}
              onChange={handleChange}
              className="w-full px-4 py-2 mt-1 text-gray-700 bg-gray-100 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
            {errors.lastName2 && <p className="text-sm text-red-600">{errors.lastName2}</p>}
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
                placeholder="tu-email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-2 mt-1 text-gray-700 bg-gray-100 border border-gray-300 rounded-l-md focus:ring-blue-500 focus:border-blue-500"
              />
              <select
                id="emailDomain"
                value={formData.emailDomain}
                onChange={(e) => setFormData({ ...formData, emailDomain: e.target.value })}
                className="px-2 py-2 mt-1 text-gray-700 bg-gray-100 border border-gray-300 rounded-r-md focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="@hotmail.com">@hotmail.com</option>
                <option value="@gmail.com">@gmail.com</option>
                <option value="@outlook.com">@outlook.com</option>
                <option value="@utec.edu.pe">@utec.edu.pe</option>
              </select>
            </div>
            {errors.email && <p className="text-sm text-red-600">{errors.email}</p>}
          </div>

          {/* Contraseña */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Contraseña
            </label>
            <input
              type="password"
              id="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-2 mt-1 text-gray-700 bg-gray-100 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
            {errors.password && <p className="text-sm text-red-600">{errors.password}</p>}
          </div>

          {/* Confirmar Contraseña */}
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
              Confirmar Contraseña
            </label>
            <input
              type="password"
              id="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full px-4 py-2 mt-1 text-gray-700 bg-gray-100 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
            {errors.confirmPassword && <p className="text-sm text-red-600">{errors.confirmPassword}</p>}
          </div>

          {/* Botón de registro */}
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full py-2 text-white ${
              isSubmitting ? "bg-gray-400" : "bg-green-600 hover:bg-green-700"
            } rounded-md focus:outline-none focus:ring-2 focus:ring-green-500`}
          >
            {isSubmitting ? "Registrando..." : "Registrarse"}
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
