export const getAuthErrorMessage = (error: any): string => {
  if (!error) return "";
  
  const message = typeof error === 'string' ? error : error.message || "";
  const code = error.code || "";

  // Common Supabase Auth error codes and messages
  if (message.includes("Invalid login credentials") || code === "invalid_credentials") {
    return "E-mail ou senha incorretos. Por favor, verifique seus dados.";
  }
  
  if (message.includes("Email not confirmed") || code === "email_not_confirmed") {
    return "E-mail ainda não confirmado. Verifique sua caixa de entrada para ativar sua conta.";
  }
  
  if (message.includes("User already registered") || code === "user_already_exists") {
    return "Este endereço de e-mail já está cadastrado em nosso sistema.";
  }
  
  if (message.includes("Password should be at least 6 characters") || code === "password_too_short") {
    return "A senha deve conter no mínimo 6 caracteres para sua segurança.";
  }
  
  if (message.includes("rate limit") || code === "over_query_limit" || code === "too_many_requests") {
    return "Muitas tentativas em pouco tempo. Por favor, aguarde alguns minutos antes de tentar novamente.";
  }
  
  if (message.includes("Invalid Email") || code === "invalid_email") {
    return "O formato do e-mail informado é inválido. Verifique se digitou corretamente.";
  }
  
  if (message.includes("User not found") || code === "user_not_found") {
    return "Usuário não encontrado em nossa base de dados.";
  }

  if (message.includes("Confirm your email") || message.includes("Confirmation link")) {
    return "Por favor, confirme seu e-mail através do link enviado para sua caixa de entrada.";
  }

  if (message.includes("New password should be different")) {
    return "A nova senha deve ser diferente da senha atual.";
  }

  if (message.includes("Signup is disabled")) {
    return "O cadastro de novos usuários está temporariamente desativado.";
  }

  if (message.includes("Provider is not enabled")) {
    return "Este método de login não está disponível no momento.";
  }

  if (message.includes("Identity provider not found")) {
    return "Não foi possível encontrar este provedor de identidade.";
  }

  // Generic errors
  if (message === "Network request failed") {
    return "Erro de conexão. Verifique sua internet e tente novamente.";
  }

  return message; // Return original if no translation is found
};
