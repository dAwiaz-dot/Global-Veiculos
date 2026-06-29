# Global Veiculos - servidor local

## Rodar o site com ADM real

```bash
npm start
```

Depois abra:

- Site: `http://localhost:3000`
- Login do ADM: `http://localhost:3000/login.html`
- ADM: `http://localhost:3000/admin.html`

## Login inicial

- Usuario: `pedro`
- Senha: `global123`

Para publicar, troque a senha usando variaveis de ambiente:

```bash
ADMIN_USER=pedro ADMIN_PASSWORD=uma-senha-forte npm start
```

## Onde o estoque fica salvo

O ADM grava os carros em:

```text
data/vehicles.json
```

O site publico le esse arquivo pela rota:

```text
/api/vehicles
```

## Paginas do ADM

- `admin.html`: resumo e estoque.
- `admin-cadastro.html`: cadastro, opcionais e fotos.
- `admin-financeiro.html`: entrada, parcelas e observacoes.
- `admin-meta.html`: controle manual de campanhas Meta Ads.
- `admin-publicacao.html`: importar, exportar, carregar exemplos ou zerar estoque.

As paginas do ADM sao protegidas por login quando acessadas pelo servidor local.

## Observacao

As fotos enviadas no ADM ficam dentro do JSON como imagens compactadas em base64. Para um estoque grande, o ideal depois e evoluir para upload de arquivos em pasta ou banco/storage.
