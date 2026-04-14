export const getRedirectUrl = () => {
  // Use window.location.origin for the base URL
  const origin = window.location.origin;
  
  // For production on Hostinger, ensure we handle potential subdirectories
  // while window.location.origin is usually enough, adding the current path can help
  // if the user is using a non-root deployment.
  return `${origin}/`;
};
