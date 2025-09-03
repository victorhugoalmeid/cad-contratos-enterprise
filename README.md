
# Cadastro de Contratos — Enterprise (Angular 17)

Inclui:
- Steps completos (Identificação, Partes, Obrigações, Valores, Fiscalização)
- Serviços (HTTP + mocks)
- Mocks (`json-server` e Prism/OpenAPI)
- Patches aplicados: guards `*ngIf`, inicialização defensiva, `matInput` em todos os inputs, tipagem dos controles, `formArrayName` fixo.
- **Persistência**: `POST /contratos` e `GET /contratos` via json-server (porta 3001)

## Rodar
```bash
npm install
npm run dev
# App: http://localhost:4200
# JSON Server: http://localhost:3001
# Prism/OpenAPI: http://localhost:4010
```
> Use Node 20 LTS para uma experiência estável.
