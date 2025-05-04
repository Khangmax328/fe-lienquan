const initialState = {
    email: null,
    username: null,
    balance: 0,
  };
  
  export const userReducer = (state = initialState, action) => {
    switch (action.type) {
      case 'UPDATE_BALANCE':
        return {
          ...state,
          balance: action.payload,
        };
      default:
        return state;
    }
  };
  