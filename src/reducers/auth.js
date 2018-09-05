export default (state = {}, action) => {
  switch (action.tyep) {
    case 'SET_USER_DETAILS':
      return {
        ...state,
        username: action.username,
        handle: action.handle
      };
    case 'SET_TOKEN':
      return {
        ...state,
        token: action.token
      };
    default:
      return state;
  }
};
