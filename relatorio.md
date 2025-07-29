<sup>Esse é um feedback gerado por IA, ele pode conter erros.</sup>

Você tem 3 créditos restantes para usar o sistema de feedback AI.

# Feedback para afernandesabreu:

Nota final: **64.7/100**

# Feedback para Alexandre Fernandes Abreu 🚓✨

Olá, Alexandre! Primeiro, parabéns pelo esforço e pelo código bem organizado! 🎉 Você estruturou seu projeto direitinho, com os arquivos separados em controllers, repositories, routes e utils, exatamente como esperado. Isso já é meio caminho andado para construir uma API escalável e fácil de manter! 👏

Também é super legal ver que você implementou várias validações, tratamento de erros e usou o Swagger para documentação. Além disso, você conseguiu fazer funcionar bem o CRUD completo para os agentes, com status codes corretos e mensagens claras. Isso é um baita avanço! 🚀

---

## Vamos analisar juntos os pontos que podem ser melhorados para deixar sua API tinindo? 🕵️‍♂️

---

### 1. Falha na atualização parcial do agente via PATCH e na exclusão de agentes

Você implementou o método `patchAgente` no controller e a rota correspondente em `agentesRoutes.js`, o que é ótimo! Porém, percebi que o teste de atualização parcial com PATCH do agente não passou, assim como a exclusão do agente.

Olhando seu `agentesRepository.js`, você tem a função para deletar agentes exportada como `delete: deleteAgente`:

```js
const deleteAgente = async (id) => {
    const idx = agentes.findIndex((agente) => agente.id === id);
    if (idx === -1) return null;

    const agenteRemovido = agentes.splice(idx, 1);
    return agenteRemovido[0];
};

module.exports = { agentes, findAll, findById, create, update, delete: deleteAgente }
```

No controller, você chama:

```js
const agente = await Agente.delete(req.params.id);
```

Isso está correto, mas o problema pode estar no fato de que o método `patch` para agentes não está implementado no repository! Você tem o método `patch` implementado para casos (`casosRepository.js`), mas não para agentes.

**Por quê isso é importante?**

- O controller `patchAgente` chama `Agente.patch`, mas essa função não existe! Isso causa erro e faz o PATCH do agente falhar.

**Como corrigir?**

Você deve implementar o método `patch` no `agentesRepository.js`, assim como fez no `casosRepository.js`. Exemplo:

```js
const patch = async (id, dadosParciais) => {
    const idx = agentes.findIndex(agente => agente.id === id);
    if (idx === -1) return null;

    agentes[idx] = {
        ...agentes[idx],
        ...dadosParciais
    };

    return agentes[idx];
};

module.exports = { agentes, findAll, findById, create, update, patch, delete: deleteAgente }
```

Depois, no controller, o `patchAgente` vai funcionar corretamente.

---

### 2. Falhas relacionadas aos endpoints de `/casos`

Você implementou todas as rotas e controllers de casos, mas notei que alguns testes importantes de criação, leitura, atualização e exclusão de casos falharam.

Ao investigar seu arquivo `routes/casosRoutes.js`, no método GET `/casos`, você usa o parâmetro `sort` para ordenação, porém ele não está declarado na desestruturação dos query params:

```js
router.get('/', async (req, res) => {
  const { status, agente_id, keywords } = req.query;

  if (sort && sort !== 'asc' && sort !== 'desc') {
    return res.status(400).json({ message: 'Parâmetro sort deve ser "asc" ou "desc".' });
  }
  // ...
});
```

Aqui, `sort` está sendo usado, mas não foi extraído de `req.query`, o que causará erro e fará seu filtro e ordenação falharem.

**Solução:**

Adicione `sort` na desestruturação:

```js
const { status, agente_id, keywords, sort } = req.query;
```

Além disso, percebi que você não implementou ordenação para os casos (por data ou outro campo), apenas para agentes. Se o requisito pede ordenação para casos, vale implementar.

Outro ponto importante é que seu filtro por `agente_id` e `status` está correto, mas o filtro por keywords está ok, só cuidado para validar se `titulo` e `descricao` existem em todos os casos (pois no schema, `descricao` não está listado no swagger). Isso pode causar erro se tentar acessar `.toLowerCase()` de `undefined`.

---

### 3. Penalidade: ID dos casos não é UUID e possibilidade de alteração do ID do agente via PUT

Você recebeu uma penalidade porque:

- O ID utilizado para casos não é UUID.
- Consegue alterar o ID do agente com método PUT.

Analisando seu `repositories/casosRepository.js`, você cria os casos com UUID, mas o objeto inicial tem:

```js
{
    "id": uuidv4(),
    "titulo": "homicidio",
    "descricao": "...",
    "status": "aberto",
    "agente_id": agente_id
}
```

Isso está correto, mas no controller de update (`updateCaso`), você não remove o campo `id` do payload antes de atualizar, o que permite alterar o ID do caso.

No `updateAgente` você faz:

```js
const { id, ...dadosSemID } = req.body;
const agente = await Agente.update(req.params.id, dadosSemID);
```

Mas no `updateCaso` não faz isso:

```js
const caso = await Caso.update(req.params.id, req.body);
```

**Por que isso é importante?**

Permitir que o cliente altere o ID de um recurso é um problema grave, pois o ID é a chave única que identifica o recurso no sistema. Ele deve ser imutável.

**Como corrigir?**

No `updateCaso`, faça o mesmo que no agente:

```js
const { id, ...dadosSemID } = req.body;
const caso = await Caso.update(req.params.id, dadosSemID);
```

E no `updateAgente` você já faz isso, então está correto.

---

### 4. Validação e mensagens de erro customizadas para filtros e query params

Nos testes bônus, você não conseguiu passar os testes que verificam a implementação de filtros avançados e mensagens de erro customizadas para argumentos inválidos.

Por exemplo, no filtro de agentes por data de incorporação e ordenação, não vi essa funcionalidade implementada no seu `agentesRoutes.js`. Você filtra por `cargo` e `nome`, e faz ordenação por data, mas não filtra por data de incorporação em si.

No filtro de casos, você não implementou ordenação, nem filtros mais complexos.

Além disso, as mensagens de erro para parâmetros inválidos são simples, mas poderiam ser mais detalhadas e consistentes para todos os filtros.

**Dica para melhorar:**

- Implemente validações explícitas para os parâmetros query, com mensagens claras e status 400.
- Adicione filtros por datas, ordenação por vários campos.
- Use middleware para validar query params e evitar repetição.
- Personalize o formato da resposta de erro para ficar uniforme.

---

### 5. Pequenos detalhes que podem melhorar ainda mais seu código

- No `routes/agentesRoutes.js`, você implementou o filtro por nome com `includes`, mas ele é case sensitive. Para uma busca mais amigável, use:

```js
agentes = agentes.filter(agente => agente.nome.toLowerCase().includes(nome.toLowerCase()));
```

- No `routes/casosRoutes.js`, verifique se `titulo` e `descricao` existem antes de usar `.toLowerCase()` para evitar erros inesperados.

- Sempre que possível, extraia a lógica de filtros para funções auxiliares para deixar as rotas mais limpas.

---

## Recursos para você aprofundar e corrigir esses pontos 💡

- **Validação de dados em APIs Node.js/Express** (para melhorar validações e mensagens de erro):  
  https://youtu.be/yNDCRAz7CM8?si=Lh5u3j27j_a4w3A_

- **Manipulação de arrays em JS (filter, find, map, etc.)** (para filtros e ordenação):  
  https://youtu.be/glSgUKA5LjE?si=t9G2NsC8InYAU9cI

- **Documentação oficial do Express.js sobre roteamento** (para organizar rotas e middlewares):  
  https://expressjs.com/pt-br/guide/routing.html

- **Conceitos de status codes HTTP e tratamento de erros** (para mensagens e status corretos):  
  https://developer.mozilla.org/pt-BR/docs/Web/HTTP/Status/400  
  https://developer.mozilla.org/pt-BR/docs/Web/HTTP/Status/404

---

## Resumo dos principais pontos para focar agora 🎯

- [ ] **Implemente o método `patch` no `agentesRepository.js`** para que o PATCH de agentes funcione corretamente.  
- [ ] **Corrija o uso do parâmetro `sort` no filtro de casos**, adicionando-o na desestruturação e implementando ordenação se necessário.  
- [ ] **Impeça alteração do campo `id` em update de casos**, removendo o `id` do payload antes de atualizar.  
- [ ] **Implemente filtros avançados e mensagens de erro customizadas para query params** nos endpoints de agentes e casos.  
- [ ] **Revise o uso de `.toLowerCase()` para evitar erros de campos undefined** e torne os filtros de texto case insensitive.  
- [ ] **Mantenha a organização modular e continue aprimorando a arquitetura MVC** que você já começou muito bem!  

---

Alexandre, você está no caminho certo! Seu projeto está estruturado de forma muito boa e com funcionalidades importantes já implementadas. Agora, com esses ajustes, sua API vai ficar muito mais robusta e completa. Continue assim, aprendendo e ajustando! 🚀

Se precisar, volte nos vídeos e documentações que indiquei para reforçar os conceitos. E lembre-se: cada erro é uma oportunidade de aprender e crescer. Estou torcendo pelo seu sucesso! 💪✨

Abraço e até a próxima revisão! 👋😊

> Caso queira tirar uma dúvida específica, entre em contato com o Chapter no nosso [discord](https://discord.gg/DryuHVnz).



---
<sup>Made By the Autograder Team.</sup><br>&nbsp;&nbsp;&nbsp;&nbsp;<sup><sup>- [Arthur Carvalho](https://github.com/ArthurCRodrigues)</sup></sup><br>&nbsp;&nbsp;&nbsp;&nbsp;<sup><sup>- [Arthur Drumond](https://github.com/drumondpucminas)</sup></sup><br>&nbsp;&nbsp;&nbsp;&nbsp;<sup><sup>- [Gabriel Resende](https://github.com/gnvr29)</sup></sup>