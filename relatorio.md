<sup>Esse é um feedback gerado por IA, ele pode conter erros.</sup>

Você tem 4 créditos restantes para usar o sistema de feedback AI.

# Feedback para afernandesabreu:

Nota final: **64.7/100**

Olá, Alexandre! 👋 Que bom ver você se dedicando a esse desafio do Departamento de Polícia! 🚓🔍 Vamos juntos analisar seu código para destravar seu projeto e deixá-lo tinindo? 💪✨

---

## 🎉 Primeiramente, parabéns pelos acertos!

- Você estruturou seu projeto muito bem, com pastas separadas para `routes`, `controllers`, `repositories`, `utils` e `docs`. Isso é essencial para manter o código organizado e escalável! 👏  
- As rotas para `/agentes` e `/casos` estão todas criadas e parecem cobrir os métodos HTTP esperados (GET, POST, PUT, PATCH, DELETE).  
- Sua validação dos dados em `controllers/agentesController.js` e `controllers/casosController.js` está muito bem feita, com checagens de formato de data, campos obrigatórios e até validação parcial para PATCH. Isso mostra cuidado com a integridade dos dados! 🧐  
- O tratamento de erros com status HTTP adequados (400, 404, 500) está presente e consistente, o que é ótimo para uma API que quer ser robusta.  
- Você conseguiu implementar filtros simples nos endpoints GET, como filtragem por `cargo` e `nome` nos agentes, e por `status` e `agente_id` nos casos.  
- A documentação Swagger está configurada, o que é um diferencial para qualquer API hoje em dia! 📚  
- Também vi que você cuidou para que o ID do agente seja validado antes de criar ou atualizar um caso, o que evita inconsistências.  

Esses pontos mostram que você já tem uma base sólida e está no caminho certo! 🚀

---

## 🔎 Agora, vamos analisar os pontos que ainda precisam de atenção para melhorar seu código e fazer tudo funcionar perfeitamente.

### 1. Penalidade: **Permite alterar o ID do agente via PUT**

Ao analisar seu `agentesController.js`, na função `updateAgente`, você faz isso:

```js
validarAgente(req.body);
const { id, ...dadosSemID } = req.body;
const agente = await Agente.update(req.params.id, req.body);
```

Aqui, você extrai `id` para `dadosSemID`, mas no momento de passar os dados para o `Agente.update`, está enviando `req.body` **com o campo `id` intacto**. Ou seja, seu repositório está atualizando o agente com um novo `id` vindo do corpo da requisição, o que não deveria acontecer.

No seu `agentesRepository.js`, a função `update` faz:

```js
const { id: _, ...dadosSemID } = dados;

agentes[idx] = {
    ...agentes[idx],
    ...dadosSemID
};
```

Ou seja, ela ignora o `id` do corpo, mas só se o `update` receber um objeto com `id` dentro. No seu controller, você está passando `req.body` que tem `id`, então essa linha do repositório funciona. Porém, para garantir que o `id` não seja alterado, você deve passar explicitamente o objeto sem o `id`, ou seja, `dadosSemID`.

**Correção recomendada:**

No `updateAgente`, substitua:

```js
const agente = await Agente.update(req.params.id, req.body);
```

por

```js
const { id, ...dadosSemID } = req.body;
const agente = await Agente.update(req.params.id, dadosSemID);
```

Assim, você garante que o `id` do agente não será alterado.

---

### 2. Penalidade: **ID utilizado para casos não é UUID**

No seu `repositories/casosRepository.js`, você define o array inicial assim:

```js
const agente_id = 'a1b2c3d4-e5f6-7890-abcd-1234567890ab';

const casos = [
    {
        "id": uuidv4(),
        "titulo": "homicidio",
        //...
        "agente_id": agente_id 
    }
]
```

Aqui o `id` do caso é criado com `uuidv4()`, o que é correto. Porém, o `agente_id` que você usa é uma string fixa `'a1b2c3d4-e5f6-7890-abcd-1234567890ab'`. Isso está ok, desde que este `agente_id` exista mesmo no repositório de agentes.

No `repositories/agentesRepository.js`, o agente inicial tem exatamente esse ID:

```js
const agente_id = 'a1b2c3d4-e5f6-7890-abcd-1234567890ab';

const agentes = [
    {
        "id": agente_id,
        "nome": "Rommel Carneiro",
        //...
    }
];
```

Então o ID do agente é um UUID válido? Na verdade, esse ID fixo não é um UUID válido, pois um UUID tem 36 caracteres, incluindo hífens, e esse ID tem 36 caracteres, mas não é gerado via `uuidv4()`. Isso pode gerar problemas se o sistema espera que IDs sejam UUIDs válidos.

**Por que isso importa?**  
Se algum teste ou validação espera que o ID seja um UUID válido, usar um ID fixo manual pode causar falhas.

**Sugestão:**  
Gere o ID do agente inicial com `uuidv4()` para garantir que ele seja um UUID válido, assim:

```js
const { v4: uuidv4 } = require('uuid');
const agente_id = uuidv4();

const agentes = [
    {
        id: agente_id,
        nome: "Rommel Carneiro",
        dataDeIncorporacao: "1992-10-04",
        cargo: "delegado"
    }
];
```

E mantenha o mesmo `agente_id` para os casos, importando ou passando essa variável para o arquivo de casos.

Se quiser manter o ID fixo, certifique-se de que ele seja um UUID válido (exemplo: `f47ac10b-58cc-4372-a567-0e02b2c3d479`).

---

### 3. Falhas nos testes relacionados a `/casos` — principalmente PATCH, DELETE, e validações

Você implementou os endpoints de `/casos` com todos os métodos, mas alguns testes falharam em:

- Atualizar dados do caso com PATCH (atualização parcial)  
- Deletar casos  
- Atualizar casos com PUT (com validação de payload)  
- Filtros mais complexos (filtros por keywords no título/descrição, ordenação por data, etc)  

Ao analisar seu código, vejo que você fez filtros simples por `status` e `agente_id` no GET `/casos`, mas não implementou filtros mais avançados, como:

- Filtrar casos por palavras-chave no título e descrição  
- Ordenar agentes por data de incorporação (cres/desc)  
- Filtros com mensagens de erro customizadas para argumentos inválidos  

Esses são os bônus que ainda não foram implementados, e que explicam as falhas nos testes bônus.

**Sobre os endpoints PATCH e DELETE de casos:**  
Seu controller `patchCaso` e `deleteCaso` parecem corretos à primeira vista. Porém, vale revisar se o repositório está implementando corretamente os métodos `patch` e `delete`.

No seu `repositories/casosRepository.js`, você tem:

- `update` (para PUT)  
- `deleteCaso` (para DELETE)  

Mas não existe um método `patch` implementado para casos! Isso é um problema fundamental, pois seu controller chama:

```js
const caso = await Caso.patch(req.params.id, req.body);
```

mas o método `patch` não existe no repositório.

**Solução:**  
Você precisa implementar o método `patch` no `casosRepository.js`, similar ao `update`, mas que atualize parcialmente os campos recebidos.

Exemplo:

```js
const patch = async (id, dadosParciais) => {
    const idx = casos.findIndex(caso => caso.id === id);
    if (idx === -1) return null;

    casos[idx] = {
        ...casos[idx],
        ...dadosParciais
    };

    return casos[idx];
};

module.exports = { findAll, findById, create, update, patch, delete: deleteCaso };
```

Sem esse método, o PATCH não funciona, e isso explica as falhas nos testes de atualização parcial e possivelmente na deleção se houver alguma dependência.

---

### 4. Sobre os filtros avançados e mensagens de erro customizadas (Bônus)

Você implementou filtros simples, como:

```js
const { status, agente_id } = req.query;
let casos = await require('../repositories/casosRepository').findAll();

if (status) {
  casos = casos.filter(caso => caso.status === status);
}
if (agente_id) {
  casos = casos.filter(caso => caso.agente_id === agente_id);
}
```

Mas faltam filtros mais sofisticados, como:

- Busca por palavras-chave no título e descrição dos casos  
- Ordenação dos agentes por data de incorporação (ascendente e descendente)  
- Mensagens de erro customizadas para argumentos inválidos  

Essas funcionalidades são opcionais, mas ajudam muito na usabilidade da API e na nota final.

Para implementar busca por keywords, você pode fazer algo assim:

```js
const { keywords } = req.query;
if (keywords) {
  const termos = keywords.toLowerCase().split(' ');
  casos = casos.filter(caso =>
    termos.every(termo =>
      caso.titulo.toLowerCase().includes(termo) ||
      caso.descricao.toLowerCase().includes(termo)
    )
  );
}
```

E para ordenação de agentes por data de incorporação:

```js
const { sort } = req.query; // 'asc' ou 'desc'
if (sort === 'asc') {
  agentes.sort((a, b) => new Date(a.dataDeIncorporacao) - new Date(b.dataDeIncorporacao));
} else if (sort === 'desc') {
  agentes.sort((a, b) => new Date(b.dataDeIncorporacao) - new Date(a.dataDeIncorporacao));
}
```

Esses detalhes vão deixar sua API muito mais completa! 😉

---

### 5. Organização da Estrutura de Diretórios

Sua estrutura está perfeita e de acordo com o esperado! 🎉  
Você tem:

```
├── routes/
├── controllers/
├── repositories/
├── docs/
├── utils/
├── server.js
├── package.json
```

Parabéns por manter essa organização, isso facilita muito a manutenção e evolução do código.

---

## 📚 Recursos para você aprofundar e corrigir esses pontos

- Para garantir que o ID não seja alterado e entender melhor manipulação de objetos e parâmetros em Express:  
  https://youtu.be/RSZHvQomeKE (Fundamentos de API REST e Express.js)  
  https://expressjs.com/pt-br/guide/routing.html (Roteamento e manipulação de parâmetros)

- Para entender como validar dados e impedir alterações indevidas (como IDs):  
  https://youtu.be/yNDCRAz7CM8?si=Lh5u3j27j_a4w3A_ (Validação de dados em APIs Node.js/Express)  
  https://developer.mozilla.org/pt-BR/docs/Web/HTTP/Status/400 (Status 400 para payloads inválidos)

- Para implementar PATCH corretamente e manipular arrays em memória:  
  https://youtu.be/glSgUKA5LjE?si=t9G2NsC8InYAU9cI (Manipulação de arrays em JS)  
  https://youtu.be/Bn8gcSQH-bc?si=Df4htGoVrV0NR7ri (Fluxo de Requisição e Resposta no Express)

- Para implementar filtros avançados e ordenação:  
  https://youtu.be/--TQwiNIw28 (Manipulação de query params e filtros)

---

## 📝 Resumo dos principais pontos para focar:

- ⚠️ **Corrigir o updateAgente para não permitir alteração do campo `id`** (passar objeto sem `id` para o repositório).  
- ⚠️ **Garantir que os IDs usados sejam UUIDs válidos**, especialmente o ID fixo do agente inicial (gerar com `uuidv4()` ou usar um UUID válido).  
- ⚠️ **Implementar o método `patch` no `casosRepository.js`**, para que o PATCH funcione corretamente.  
- ⚠️ **Implementar filtros avançados nos endpoints GET**, como busca por keywords e ordenação por datas.  
- ⚠️ **Aprimorar mensagens de erro customizadas para argumentos inválidos** para melhorar a experiência da API.  
- 🎯 Manter a organização da estrutura de diretórios, que já está ótima!  

---

Alexandre, você está com uma base muito boa e com alguns ajustes vai conseguir entregar uma API robusta, completa e alinhada com as melhores práticas! 🚀✨ Continue focado, revise esses pontos com calma e não hesite em testar cada endpoint com ferramentas como Postman ou Insomnia para garantir que tudo está funcionando como esperado.

Qualquer dúvida, estou aqui para te ajudar! Vamos juntos nessa jornada! 💙👨‍💻👩‍💻

Grande abraço e até a próxima! 🤗👊

> Caso queira tirar uma dúvida específica, entre em contato com o Chapter no nosso [discord](https://discord.gg/DryuHVnz).



---
<sup>Made By the Autograder Team.</sup><br>&nbsp;&nbsp;&nbsp;&nbsp;<sup><sup>- [Arthur Carvalho](https://github.com/ArthurCRodrigues)</sup></sup><br>&nbsp;&nbsp;&nbsp;&nbsp;<sup><sup>- [Arthur Drumond](https://github.com/drumondpucminas)</sup></sup><br>&nbsp;&nbsp;&nbsp;&nbsp;<sup><sup>- [Gabriel Resende](https://github.com/gnvr29)</sup></sup>