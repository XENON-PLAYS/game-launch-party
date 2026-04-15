# Guia de Deploy na Hostinger (React + Vite + Supabase)

Este guia explica como colocar seu projeto Lovable em produção na Hostinger de forma 100% funcional.

## 1. O Banco de Dados
O projeto utiliza **Supabase** (PostgreSQL) como banco de dados e autenticação.
* **Compatibilidade:** O Supabase é um banco de dados externo. Seu site na Hostinger se conectará a ele via API (HTTP/HTTPS). 
* **MySQL:** Não recomendamos a migração para MySQL, pois isso exigiria a reescrita de todo o sistema de Autenticação, Segurança (RLS) e Sincronização em tempo real. O Supabase funciona perfeitamente em qualquer servidor Hostinger.

## 2. Configuração das Variáveis de Ambiente (.env)
As variáveis de ambiente no Vite são "congeladas" no momento do build.

1. **Localmente:** Crie um arquivo `.env` na raiz com:
   ```env
   VITE_SUPABASE_URL=SUA_URL_AQUI
   VITE_SUPABASE_ANON_KEY=SUA_KEY_AQUI
   ```
2. **Importante:** Essas variáveis **precisam** estar presentes no momento em que você rodar o comando `npm run build`. Se você buildar no computador e subir a pasta `dist`, o código já terá os links corretos.

## 3. Configuração do Servidor (Hostinger)
Já incluímos um arquivo `.htaccess` na pasta `public/`. Ele é essencial para:
* **React Router:** Garante que ao atualizar a página (F5) em sub-rotas como `/dashboard`, o servidor não retorne erro 404.
* **HTTPS Forçado:** Redireciona automaticamente para navegação segura.
* **Performance:** Ativa compressão Gzip e cache de arquivos estáticos.

## 4. Backend e APIs Internas (Edge Functions)
As funcionalidades de checkout e webhooks (pasta `supabase/functions`) são **Serverless**.
* Elas continuam rodando no **Supabase**.
* Para que funcionem, você deve fazer o deploy das funções usando a CLI do Supabase:
  ```bash
  supabase functions deploy create-checkout
  supabase functions deploy stripe-webhook
  ```
* Seu site na Hostinger chamará automaticamente essas URLs do Supabase.

## 5. Passo a Passo do Deploy (Hostinger Business)
1. **Gere o Build:** No seu terminal local, rode `npm run build`.
2. **Pasta Dist:** Será criada a pasta `dist`. Ela contém tudo o que o site precisa.
3. **Gerenciador de Arquivos:** No Painel da Hostinger, vá em **Gerenciador de Arquivos** -> `public_html`.
4. **Upload:** Limpe o que houver lá e suba todo o conteúdo **de dentro** da pasta `dist`.
5. **Teste:** Acesse seu domínio. Se o site carregar mas não mostrar dados, verifique se as chaves no seu `.env` local estavam corretas durante o build.

## Solução de Erros Comuns
* **404 ao atualizar página:** Verifique se o arquivo `.htaccess` foi enviado para o servidor.
* **Erro de conexão API:** Verifique se o `VITE_SUPABASE_URL` está correto e começa com `https://`.
* **CORS Error:** No painel do Supabase, em **API Settings**, adicione seu domínio da Hostinger à lista de "Allowed Origins".
