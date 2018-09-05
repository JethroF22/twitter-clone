export default (state = {}, action) => {
  switch (action.type) {
    case 'SET_ACTION_STATUS':
      return {
        actionStatus: action.status
      };
    default:
      return state;
  }
};
