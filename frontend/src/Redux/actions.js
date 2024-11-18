import axios from 'axios';

export const GET_MESSAGES = 'GET_MESSAGES';
export const GET_NOTIFICATIONS = 'GET_NOTIFICATIONS';
export const GET_GROUPS = 'GET_GROUPS';
export const GET_USERS = 'GET_USERS';
export const LOGIN = 'LOGIN';
export const REGISTER = 'REGISTER';
export const LOGOUT = 'LOGOUT';

export const getMessagesByUser = (userId) => {
    return async dispatch => {
        try {
            const response = await axios.get(`http://localhost:8000/message/${userId}`);
            const data = response.data;
            dispatch({ type: GET_MESSAGES, payload: data });
        } catch (error) {
            console.error('Error fetching messages:', error.message);
        }
    };
};

export const getNotificationsByUser = (userId) => {
    return async dispatch => {
        try {
            const response = await axios.get(`http://localhost:8000/notification/${userId}`);
            const data = response.data;
            dispatch({ type: GET_NOTIFICATIONS, payload: data });
        } catch (error) {
            console.error('Error fetching notifications:', error.message);
        }
    };
};

export const getGroupsByUser = (userId) => {
    return async dispatch => {
        try {
            const response = await axios.get(`http://localhost:8000/group/getGroupsByUser/${userId}`);
            const data = response.data;
            dispatch({ type: GET_GROUPS, payload: data });
        } catch (error) {
            console.error('Error fetching groups:', error.message);
        }
    };
};

export const getUsers = () => {
    return async dispatch => {
        try {
            const response = await axios.get('http://localhost:8000/user/');
            const data = response.data;
            dispatch({ type: GET_USERS, payload: data });
        } catch (error) {
            console.error('Error fetching users:', error.message);
        }
    };
};

export const login = (user) => {
    return async (dispatch) => {
        try {
            const response = await axios.post('http://localhost:8000/user/login', user);
            const data = response.data;
            dispatch({ type: LOGIN, payload: data });
            return { success: true, data };
        } catch (error) {
            console.error('Error during login:', error.message);
            return { success: false, error: error.response?.data?.message || error.message };
        }
    };
};

export const register = (user) => {
    return async dispatch => {
        try {
            const response = await axios.post('http://localhost:8000/user/register', user);
            const data = response.data;
            dispatch({ type: REGISTER, payload: data });
        } catch (error) {
            console.error('Error during registration:', error.message);
            throw error; // Re-lanzar el error si lo necesitas manejar en el componente
        }
    };
};

export const sendKeyGroup = (body) => {
    return async () => {
        try {
            const response = await axios.post('http://localhost:8000/group/sendKeyGroup', body);
            const data = response.data;
            return { success: true, data };
        } catch (error) {
            console.error('Error sending key group:', error.message);
        }
    };
}

export const logout = () => {
    return { type: LOGOUT };
};
