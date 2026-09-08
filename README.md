# Bora Bebê — MVP com pedidos privados via Telegram

React + Vite + Tailwind. O cliente escolhe bebidas, informa o endereço e toca em **Enviar pedido**.

O pedido é enviado pelo backend para um Telegram privado. O cliente não abre WhatsApp/Telegram e não vê seu número ou chat.

## 1. Rodar localmente

```bash
npm install
npm run dev
```

## 2. Criar seu bot no Telegram

No Telegram, procure **@BotFather** e crie um bot com `/newbot`.

Ele vai entregar um token parecido com:

```text
123456789:AA...
```

**Não coloque esse token no React.**

## 3. Descobrir seu Chat ID

Abra uma conversa com o bot que você criou e mande qualquer mensagem para ele, por exemplo:

```text
teste
```

Depois, abra no navegador:

```text
https://api.telegram.org/botSEU_TOKEN/getUpdates
```

Procure por:

```json
"chat": {
  "id": 123456789
}
```

Esse número é o seu `TELEGRAM_CHAT_ID`.

## 4. Configurar na Vercel

No projeto da Vercel, vá em:

**Settings → Environment Variables**

Adicione:

```text
TELEGRAM_BOT_TOKEN = seu_token
TELEGRAM_CHAT_ID = seu_chat_id
```

Depois faça um novo deploy.

## 5. Importante

O navegador do cliente **não recebe o token do Telegram**. O React chama `/api/send-order` e essa função de backend usa as variáveis secretas para mandar a mensagem.

Assim:

```text
Cliente
   ↓
Site React
   ↓
/api/send-order
   ↓
Telegram Bot
   ↓
Seu Telegram
```

O cliente só vê:

**Pedido enviado com sucesso ✅**

## 6. Taxa e produtos

No `src/main.jsx`:

```js
const DELIVERY_FEE = 8;
```

Os produtos estão no array `PRODUCTS`.

## 7. Desenvolvimento local com Vercel

Para testar a função `/api` localmente, instale a CLI:

```bash
npm i -g vercel
```

Na pasta do projeto:

```bash
vercel dev
```

Depois abra a URL informada pela Vercel.

Você também pode simplesmente publicar o projeto na Vercel e testar por lá.
