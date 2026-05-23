import { createListenerMiddleware } from '@reduxjs/toolkit';

export const listenerMiddleware = createListenerMiddleware();

// Register side-effect listeners here as features are implemented, e.g.:
// listenerMiddleware.startListening({
//   actionCreator: logout,
//   effect: (_action, api) => { api.dispatch(clearCart()); },
// });
