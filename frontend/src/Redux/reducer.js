import { GET_MESSAGES, GET_NOTIFICATIONS, GET_GROUPS, GET_USERS, LOGIN, REGISTER, LOGOUT } from './actions';

const initialState = {
    token : null,
    usersRegister : [],
    notifications : [],
    groups : [],
    messages : [],
}

const rootReducer = (state = initialState, action) => {
    switch(action.type){
        case LOGIN:
            return {...state, token : action.payload};
        case REGISTER:
            return {...state, token : action.payload};
        case GET_MESSAGES:
            return {...state, messages : action.payload};
        case GET_NOTIFICATIONS:
            return {...state, notifications : action.payload};
        case GET_GROUPS:
            return {...state, groups : action.payload};
        case GET_USERS:
            return {...state, usersRegister : action.payload};
        case LOGOUT:
            return {...state, user : null};
        default:
            return {...state};
    }
};

export default rootReducer;