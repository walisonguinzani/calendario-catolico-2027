# Calendário Católico 2027 · Lar de Fé

Landing page estática (HTML + CSS + JS, sem build) para vender o Calendário Católico 2027 em Portugal.

- `index.html`: a página inteira.
- `assets/`: logótipo e pré-visualizações geradas a partir dos PDFs do produto.

## Antes de publicar

1. Abre `index.html` e preenche os links de pagamento no topo do `<script>`:

   ```js
   const CHECKOUT = {
     essencial: "https://...", // 7,90 €
     completo:  "https://..."  // 14,90 €
   };
   ```

   Enquanto estiverem vazios, os botões levam à secção de planos.

2. Publica em qualquer alojamento estático (Vercel, Netlify, GitHub Pages). Não há passo de build.

## Ver localmente

```sh
python3 -m http.server 8000
# abre http://localhost:8000
```

## Medição (pixel)

Coloca o ID do pixel da Meta em `META_PIXEL_ID`, no topo do `<script>` do `index.html`. O pixel só é carregado depois de o visitante clicar em "Permitir medição" no aviso. Clicar num plano envia o evento `InitiateCheckout`.

## Páginas legais

- `privacidade.html`: Política de Privacidade
- `termos.html`: Termos de Uso
