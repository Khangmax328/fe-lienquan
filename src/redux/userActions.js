// actions/userActions.js
export const updateBalance = (newBalance) => {
    return {
      type: 'UPDATE_BALANCE',
      payload: newBalance,
    };
  };
  