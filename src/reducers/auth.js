export default (state = {}, action) => {
  switch (action.type) {
    case 'SET_USER_DETAILS':
      return {
        ...state,
        name: action.name,
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
