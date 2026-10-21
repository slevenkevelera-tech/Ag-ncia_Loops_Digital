# Guia de Sincronização GitHub & Deploy no Render

Este projeto já está 100% configurado e pronto para deploy automático no **Render** com integração contínua via **GitHub**.

---

### 1. Sincronizar com seu Repositório GitHub

Se você já criou um repositório no seu GitHub (ex: `loops-digital`):

```bash
# 1. Adicione a URL do seu repositório remoto:
git remote add origin https://github.com/SEU_USUARIO/loops-digital.git

# 2. Envie o código para a branch principal:
git branch -M main
git push -u origin main
```

> **Dica:** Se você quiser que o assistente envie diretamente daqui, você pode nos informar a URL do seu repositório com o seu token de acesso pessoal (Personal Access Token):
> `https://<TOKEN>@github.com/<SEU_USUARIO>/<REPOSITORIO>.git`

---

### 2. Deploy Automático no Render (1-Clique)

O arquivo `render.yaml` na raiz do projeto já define toda a infraestrutura necessária:

1. Acesse **[dashboard.render.com](https://dashboard.render.com)**.
2. Clique em **"New +"** no canto superior direito e selecione **"Web Service"** (ou **"Blueprint"**).
3. Conecte sua conta do GitHub e selecione o repositório `loops-digital`.
4. As configurações já serão detectadas automaticamente:
   - **Environment:** `Node`
   - **Build Command:** `npm install && npm run build`
   - **Start Command:** `npm start`
   - **Plan:** `Free`
5. Em **Environment Variables**, adicione (se for utilizar a inteligência artificial do Gemini):
   - `GEMINI_API_KEY`: sua chave de API do Google AI Studio.
6. Clique em **"Create Web Service"**.

Em cerca de 2 minutos, sua aplicação estará online com certificado SSL (HTTPS) gratuito e endereço global ativo!
