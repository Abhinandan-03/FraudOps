/**
 * Retrieves the currently authenticated user from localStorage.
 * Returns the email/username string, or null if not authenticated.
 */
export function getAuthUser() {
  try {
    return localStorage.getItem('fraudOps_currentPlayer');
  } catch {
    return null;
  }
}

/**
 * Logs out the current user, optionally cleaning up multiplayer state,
 * and redirects to the login page.
 * 
 * @param {function} navigate - React Router navigate function
 * @param {object} mpHook - (Optional) The useMultiplayer hook object containing a disconnect method
 */
export function logoutUser(navigate, mpHook = null) {
  // If in a multiplayer room, forcefully close the socket cleanly
  if (mpHook && typeof mpHook.disconnect === 'function') {
    mpHook.disconnect();
  }
  
  // Clear auth session
  localStorage.removeItem('fraudOps_currentPlayer');
  
  // Navigate to login
  navigate('/login');
}
