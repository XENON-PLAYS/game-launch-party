export const getRedirectUrl = () => {
  // Use a fallback for local development or different environments
  const origin = window.location.origin;
  
  // For production on Hostinger, ensure we use the correct domain if needed
  // but window.location.origin should naturally be https://jogosgratisbr.com
  return origin;
};
