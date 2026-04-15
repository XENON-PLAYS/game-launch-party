# Guia de Deploy na Hostinger (React + Vite + Supabase)

Este guia explica como colocar seu projeto Lovable em produção na Hostinger de forma 100% funcional.

## 1. O Banco de Dados
O projeto utiliza **Supabase** (PostgreSQL) como banco de dados e autenticação.
* **Não é necessário migrar para MySQL.** O Supabase é um serviço externo e seu site na Hostinger se conectará a ele via API.
* Seus dados e usuários continuarão seguros no Supabase.

## 2. Configuração das Variáveis de Ambiente
As variáveis de ambiente no Vite são "congeladas" no momento do build. Você tem duas opções:

### Opção A: Build Local (Recomendado se não tiver GitHub Actions)
1. Crie ou edite o arquivo `.env` na raiz do seu projeto localmente com suas chaves:
   ```env
   VITE_SUPABASE_URL=SUA_URL_DO_SUPABASE
   VITE_SUPABASE_ANON_KEY=SUA_ANON_KEY_DO_SUPABASE
   ```
2. Execute o comando: `npm run build`
3. A pasta `dist` será gerada com as chaves já inseridas no código.
4. Suba o conteúdo da pasta `dist` para o `public_html` da Hostinger.

### Opção B: Deploy via GitHub (Recomendado para automação)
Se você conectou o GitHub à Hostinger:
1. Vá no seu repositório no GitHub -> **Settings** -> **Secrets and variables** -> **Actions**.
2. Adicione as variáveis `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY`.
3. Configure sua Action de build para usar essas variáveis.

## 3. Configuração do Servidor (Hostinger)
Para que as rotas do React (React Router) funcionem corretamente na Hostinger (Apache/Litespeed), é necessário um arquivo `.htaccess`.

**Este arquivo já foi criado na pasta `public/` deste repositório.** 
Quando você rodar `npm run build`, ele será copiado automaticamente para a pasta `dist`.

Conteúdo do `.htaccess`:
```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteCond %{REQUEST_FILENAME} !-y
  RewriteRule . /index.html [L]
</IfModule>
```

## 4. Backend e Serverless (Edge Functions)
As funções de backend (como `create-checkout` e `stripe-webhook`) estão localizadas na pasta `supabase/functions`.
* Elas **não rodam na Hostinger**. Elas devem ser publicadas no Supabase.
* Certifique-se de que as Edge Functions estão deployadas:
  ```bash
  supabase functions deploy create-checkout
  supabase functions deploy stripe-webhook
  ```
* Seu frontend na Hostinger fará chamadas HTTP para essas funções no domínio do Supabase.

## 5. Passo a Passo do Deploy Final
1. **Prepare o código**: Certifique-se de que o `.htaccess` está em `public/`.
2. **Gere o build**: `npm run build`.
3. **Acesse o Gerenciador de Arquivos da Hostinger**:
   * Vá em `public_html`.
   * Limpe arquivos antigos.
   * Faça o upload de **todo o conteúdo** da pasta `dist`.
4. **Verifique o SSL**: Certifique-se de que o HTTPS está ativo na Hostinger para evitar erros de segurança com a API do Supabase.

---
Se precisar de ajuda com erros específicos, verifique o Console do Navegador (F12) para ver se há erros de conexão com o Supabase.
