## Objetivo
Fazer o cabeçalho exibir sempre o seu nome de exibição (`display_name`) — por exemplo "DONO" — e nunca mais o prefixo do e-mail (`varaver90`).

## Causa
Hoje o cabeçalho usa esta lógica:
`profile?.display_name || user.email?.split('@')[0]`

Quando o perfil ainda não terminou de carregar (`profile` está vazio por uma fração de segundo logo após o login/refresh), ele cai no fallback `user.email?.split('@')[0]`, que resulta em **"varaver90"**. Seu `display_name` real é "DONO".

## Mudança (somente `src/components/Header.tsx`)
1. **Nome no botão do avatar (topo, ~linha 186-188):** trocar a expressão para priorizar `display_name` → `username` e, enquanto o perfil carrega, mostrar um texto neutro como "Conta" em vez do prefixo do e-mail. O texto "Entrar" continua aparecendo para quem não está logado.
2. **Nome dentro do menu suspenso "Minha Conta" (~linha 205):** aplicar a mesma regra, usando `display_name` → `username` → "Conta", sem expor o e-mail/prefixo.

Resultado: o e-mail (e seu prefixo) nunca mais é mostrado como nome no cabeçalho.

## Verificação
- Conferir no preview, já logado como `varaver90@gmail.com`, que o cabeçalho mostra "DONO".
- Confirmar que, deslogado, aparece "Entrar".
