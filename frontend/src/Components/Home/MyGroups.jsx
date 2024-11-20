import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getGroupsByUser } from "../../Redux/actions";

const MyGroups = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const groups = useSelector((state) => state.groups); // Reducer para grupos del usuario

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        await dispatch(getGroupsByUser());
        setLoading(false);
      } catch (err) {
        setError("Error al cargar los grupos.");
        setLoading(false);
      }
    };

    fetchGroups();
  }, [dispatch]);

  if (loading) {
    return <div className="text-center">Cargando grupos...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Mis Grupos</h2>
      {groups.length > 0 ? (
        <ul className="w-full max-w-md space-y-4">
          {groups.map((group) => (
            <li
              key={group.id}
              className="p-4 border rounded-md bg-white shadow-md"
            >
              <h3 className="font-semibold text-lg">{group.name}</h3>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-600">No tienes grupos asignados.</p>
      )}
    </div>
  );
};

export default MyGroups;
