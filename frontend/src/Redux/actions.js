import axios from 'axios';

// Action types
export const GET_MESSAGES = 'GET_MESSAGES';
export const GET_NOTIFICATIONS = 'GET_NOTIFICATIONS';
export const GET_GROUPS = 'GET_GROUPS';
export const GET_USERS = 'GET_USERS';
export const GET_USERS_BY_GROUP = 'GET_USERS_BY_GROUP';
export const LOGIN = 'LOGIN';
export const REGISTER = 'REGISTER';
export const LOGOUT = 'LOGOUT';

// Base URL de la API
const API_BASE_URL = 'http://localhost:8000';

// Action creators with Thunk (para peticiones asíncronas)

export const getMessagesByUser = (userId) => async (dispatch) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/message/${userId}`);
    dispatch({ type: GET_MESSAGES, payload: response.data });
  } catch (error) {
    console.error('Error fetching messages:', error.response?.data?.message || error.message);
  }
};

export const getNotificationsByUser = () => async (dispatch, getState) => {
    const { notifications } = getState();
    if (notifications.length > 0) return;
    try {
      const response = await axios.get(`${API_BASE_URL}/notification/users`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      dispatch({ type: GET_NOTIFICATIONS, payload: response.data });
    } catch (error) {
      console.error('Error fetching notifications:', error.response?.data?.message || error.message);
    }
};

export const getGroupsByUser = () => async (dispatch, getState) => {
    const { groups } = getState();
    if (groups.length > 0) return;
    try {
      const response = await axios.get(`${API_BASE_URL}/group/getGroupsByUser`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      dispatch({ type: GET_GROUPS, payload: response.data });
    } catch (error) {
      console.error('Error fetching groups:', error.response?.data?.message || error.message);
    }
};

export const getUsers = () => async (dispatch, getState) => {
  try {
    const { usersRegister } = getState(); // Revisar si ya están cargados los usuarios
    if (usersRegister.length > 0) return;
    const response = await axios.get(`${API_BASE_URL}/user/`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    dispatch({ type: GET_USERS, payload: response.data });
  } catch (error) {
    console.error('Error fetching users:', error.response?.data?.message || error.message);
  }
};

export const getUsersByNotification = (notificationId) => async (dispatch) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/notification/users/${notificationId}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    dispatch({ type: GET_USERS_BY_GROUP, payload: response.data });
    return response.data;
  }
  catch (error) {
    console.error('Error fetching users by notification:', error.response?.data?.message || error.message);
  }
};

// Login action (asynchronous)
export const login = (user) => async (dispatch) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/user/login`, user);
    dispatch({ type: LOGIN, payload: response.data });
    return { success: true };
  } catch (error) {
    console.error('Error during login:', error.response?.data?.message || error.message);
    return { success: false, error: error.response?.data?.message || error.message };
  }
};

// Register action (asynchronous)
export const register = (user) => async (dispatch) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/user/register`, user);
    dispatch({ type: REGISTER, payload: response.data });
  } catch (error) {
    console.error('Error during registration:', error.response?.data?.message || error.message);
    throw error;
  }
};

// Send invitation to group
export const sendKeyGroup = (body) => async () => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/group/sendKeyGroup`,
      body,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      }
    );
    return { success: true, data: response.data };
  } catch (error) {
    console.error('Error sending key group:', error.response?.data?.message || error.message);
  }
};

export const desecryptKeyGroup = (body) => async () => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/group/desecryptKeyGroup`,
      body,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        }
    );
    return { success: true, data: response.data };
    }
    catch (error) {
    console.error('Error desecrypting key group:', error.response?.data?.message || error.message);
    }
};

// Logout action
export const logout = () => {
  return { type: LOGOUT };
};
