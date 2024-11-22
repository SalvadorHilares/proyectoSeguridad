import { GET_MESSAGES, 
        GET_NOTIFICATIONS, 
        GET_GROUPS, 
        GET_USERS,
        GET_USERS_BY_GROUP,
        LOGIN, 
        REGISTER, 
        LOGOUT } from './actions';

const initialState = {
    usersRegister : [],
    notifications : [],
    selectedGroup : [],
    groups : [],
    messages : [],
}

const rootReducer = (state = initialState, action) => {
    switch(action.type){
        case LOGIN:
        case REGISTER:
            localStorage.setItem('token', action.payload);
            return {...state};
        case GET_MESSAGES:
            return {...state, messages : action.payload};
        case GET_NOTIFICATIONS:
            return {...state, notifications : action.payload};
        case GET_GROUPS:
            return {...state, groups : action.payload};
        case GET_USERS:
            return {...state, usersRegister : action.payload};
        case GET_USERS_BY_GROUP:
            return {...state, selectedGroup : action.payload};
        case LOGOUT:
            localStorage.removeItem('token');
            state = initialState;
            return {...state};
        default:
            return {...state};
    }
};

export default rootReducer;