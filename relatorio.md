<sup>Esse é um feedback gerado por IA, ele pode conter erros.</sup>

Você tem 8 créditos restantes para usar o sistema de feedback AI.

# Feedback para afernandesabreu:

Nota final: **33.8/100**

Olá, Alexandre! 👋 Que bom te ver por aqui! Antes de qualquer coisa, quero te parabenizar pelo esforço e organização que você já colocou no seu projeto. 🎉 Você estruturou seu código de forma modular, separando rotas, controllers e repositories, o que é fundamental para manter o código limpo e escalável. Além disso, já implementou validações importantes e tratamento de erros, o que mostra que está no caminho certo para construir uma API robusta. 👏

---

## 🚀 Pontos que você mandou muito bem

- **Arquitetura modular:** Seu `server.js` está enxuto e bem organizado, usando `express.json()` e importando as rotas corretamente:

```js
app.use('/agentes', agenteRoutes);
app.use('/casos', casosRoutes);
```

- **Separação clara entre camadas:** Você tem arquivos dedicados para controllers e repositories tanto para agentes quanto para casos, seguindo o padrão esperado.

- **Validações básicas implementadas:** As funções `validarAgente` e `validarCaso` já fazem checagens importantes como campos obrigatórios e formato de datas.

- **Tratamento de erros:** Você está usando `try/catch` para capturar erros e retornando status HTTP adequados para diversas situações (400, 404, 500).

- **Bônus que você tentou:** Vi que você tentou implementar filtros e ordenações (mesmo que ainda não estejam funcionando 100%), além de mensagens de erro personalizadas, o que é ótimo para evoluir sua API!

---

## 🔍 O que precisa de atenção para destravar seu projeto

### 1. **IDs devem ser UUID no formato correto**

Você recebeu uma penalidade porque os IDs usados para agentes e casos não estão no formato UUID esperado. Isso acontece porque no seu array inicial, você tem:

```js
const agentes = [
    {
        "id": "401bccf5-cf9e-489d-8412-446cd169a0f1",
        ...
    }
]
```

e 

```js
casos = [
    {
        "id": "f5fb2ad5-22a8-4cb4-90f2-8733517a0d46",
        ...
    }
]
```

Mas percebi que a data de incorporação do agente está no formato `"1992-10-04"`, e na validação você espera `"YYYY/MM/DD"` (com barras):

```js
if (!/^\d{4}\/\d{2}\/\d{2}$/.test(dataDeIncorporacao)) {
    throw new Error('Data de incorporação deve estar no formato YYYY/MM/DD.');
}
```

Isso causa conflito porque seus dados iniciais não seguem o formato validado. Para resolver:

- Alinhe o formato dos dados iniciais com o esperado na validação, ou ajuste a validação para aceitar o formato com hífens (`-`), que é o padrão ISO e mais comum no JavaScript:

```js
if (!/^\d{4}-\d{2}-\d{2}$/.test(dataDeIncorporacao)) {
    throw new Error('Data de incorporação deve estar no formato YYYY-MM-DD.');
}
```

- O mesmo vale para a data de registro do caso.

**Recomendo este vídeo para entender melhor validação de dados e datas em APIs:**  
[yNDCRAz7CM8 - Validação de dados em APIs Node.js/Express](https://youtu.be/yNDCRAz7CM8?si=Lh5u3j27j_a4w3A_)

---

### 2. **Inconsistência no uso de `async` e `await` nos repositories**

No seu `casosRepository.js`, a função `findAll` não é assíncrona, diferente das outras funções:

```js
const findAll = () => {
    return casos;
};
```

Enquanto outras são `async`:

```js
const findById = async (id) => { ... };
```

Essa inconsistência pode causar problemas na hora de usar `await` no controller, porque ele espera uma Promise. Para manter a uniformidade, declare todas as funções que retornam dados como `async`:

```js
const findAll = async () => {
    return casos;
};
```

Isso evita comportamentos inesperados quando você usa `await` nos controllers.

---

### 3. **Erro na atualização do caso no repository**

No método `update` do `casosRepository.js`, você está sobrescrevendo os dados com o objeto `dados` inteiro, ignorando a remoção do `id`:

```js
const update = async (id, dados) => {
    const idx = casos.findIndex((caso) => caso.id ===id);
    if (idx === -1) return null;
    
    const { id: _, ...dadosSemID } = dados;

    casos[idx] = {
        ...casos[idx],
        ...dados
    };
    
    return casos[idx];
};
```

Aqui, você extrai `dadosSemID` mas não o usa, usando `...dados` direto. Isso pode permitir que o `id` seja sobrescrito, o que não é desejado.

Corrija para:

```js
casos[idx] = {
    ...casos[idx],
    ...dadosSemID
};
```

Assim, você protege o `id` de ser alterado.

---

### 4. **Variável `casos` declarada sem `const` ou `let`**

No início do seu `casosRepository.js`, você declarou o array `casos` sem `const` ou `let`:

```js
casos = [
    {
        ...
    }
]
```

Isso cria uma variável global, podendo causar problemas. Sempre declare suas variáveis com `const` ou `let`:

```js
const casos = [
    {
        ...
    }
];
```

---

### 5. **Falta de importação do `Agente` no `casosController.js`**

No seu `casosController.js`, você faz várias verificações com `Agente.findById`, mas não importou o repositório `Agente`:

```js
if (!await Agente.findById(agente_id)) {
    return res.status(404).json({ message: 'Agente não encontrado' });
};
```

Por isso, essas linhas vão falhar em tempo de execução. Para corrigir, importe o `Agente` no topo do arquivo:

```js
const Agente = require('../repositories/agentesRepository');
```

---

### 6. **Validação rígida para PATCH**

No seu controller de agentes e casos, o método PATCH está usando a mesma função de validação completa (`validarAgente` e `validarCaso`), o que obriga o usuário a enviar todos os campos, mesmo que queira atualizar só um deles.

Para o PATCH, o ideal é validar apenas os campos que vierem no corpo da requisição, permitindo atualizações parciais.

Você pode criar uma função de validação parcial, por exemplo:

```js
function validarAgenteParcial(dados) {
    if (dados.nome !== undefined && dados.nome.trim() === '') {
        throw new Error('Nome do agente não pode ser vazio.');
    }
    if (dados.dataDeIncorporacao !== undefined) {
        if (!/^\d{4}-\d{2}-\d{2}$/.test(dados.dataDeIncorporacao)) {
            throw new Error('Data de incorporação deve estar no formato YYYY-MM-DD.');
        }
        const data = new Date(dados.dataDeIncorporacao);
        const hoje = new Date();
        if (data > hoje) {
            throw new Error('Data de incorporação não pode ser no futuro.');
        }
    }
    if (dados.cargo !== undefined && dados.cargo.trim() === '') {
        throw new Error('Cargo não pode ser vazio.');
    }
}
```

E usar essa função no PATCH, para não exigir todos os campos.

---

### 7. **Status HTTP para DELETE**

Nos seus métodos de DELETE, você está retornando status `200` com mensagem de sucesso:

```js
res.status(200).json({ message: 'Agente removido com sucesso' });
```

O mais indicado para DELETE que deu certo e não retorna conteúdo é usar o status `204 No Content` sem corpo de resposta:

```js
res.status(204).send();
```

Isso é mais alinhado com as boas práticas REST.

---

### 8. **Filtros e ordenações bônus ainda não implementados**

Percebi que os filtros e ordenações para agentes e casos (como filtrar por status, data de incorporação, palavras-chave) ainda não estão funcionando. Para destravar esses bônus, você pode implementar query params nos seus endpoints GET, por exemplo:

```js
router.get('/', getAllAgentes);
```

No controller:

```js
const getAllAgentes = async (req, res) => {
    const { dataIncorporacao, sort } = req.query;
    let agentes = await Agente.findAll();

    if (dataIncorporacao) {
        agentes = agentes.filter(a => a.dataDeIncorporacao === dataIncorporacao);
    }

    if (sort === 'asc') {
        agentes.sort((a, b) => new Date(a.dataDeIncorporacao) - new Date(b.dataDeIncorporacao));
    } else if (sort === 'desc') {
        agentes.sort((a, b) => new Date(b.dataDeIncorporacao) - new Date(a.dataDeIncorporacao));
    }

    res.status(200).json(agentes);
};
```

---

## 📚 Recursos que vão te ajudar a corrigir e evoluir seu projeto

- Para entender melhor a arquitetura MVC e organização do projeto:  
  https://youtu.be/bGN_xNc4A1k?si=Nj38J_8RpgsdQ-QH

- Para aprofundar em validação de dados e tratamento de erros:  
  https://youtu.be/yNDCRAz7CM8?si=Lh5u3j27j_a4w3A_

- Para aprender mais sobre manipulação de arrays e filtros:  
  https://youtu.be/glSgUKA5LjE?si=t9G2NsC8InYAU9cI

- Para entender status HTTP e métodos REST:  
  https://youtu.be/RSZHvQomeKE

---

## 🗺️ Resumo rápido para você focar e avançar:

- Ajustar o formato das datas no array inicial ou na validação para ficarem consistentes (usar `YYYY-MM-DD` é mais prático).  
- Declarar `const casos = [...]` corretamente para evitar variáveis globais.  
- Corrigir o método `update` do `casosRepository` para não sobrescrever o `id`.  
- Importar o `Agente` no `casosController.js` para validar o `agente_id`.  
- Criar validação parcial para PATCH, permitindo atualizações parciais sem exigir todos os campos.  
- Usar status HTTP 204 para DELETE que não retornam conteúdo.  
- Tornar todas as funções do repository `async` para manter padrão e evitar problemas com `await`.  
- Implementar filtros e ordenações para os endpoints GET para destravar os bônus.

---

Alexandre, você está no caminho certo e com algumas correções vai conseguir fazer sua API brilhar! 🌟 Continue praticando, ajustando os detalhes e aprendendo com cada desafio. Estou aqui torcendo por você! 💪🚓

Se precisar de ajuda para entender algum ponto, não hesite em pedir. Vamos juntos nessa jornada!

Abraço forte e até a próxima! 🤗👨‍💻

> Caso queira tirar uma dúvida específica, entre em contato com o Chapter no nosso [discord](https://discord.gg/DryuHVnz).



---
<sup>Made By the Autograder Team.</sup><br>&nbsp;&nbsp;&nbsp;&nbsp;<sup><sup>- [Arthur Carvalho](https://github.com/ArthurCRodrigues)</sup></sup><br>&nbsp;&nbsp;&nbsp;&nbsp;<sup><sup>- [Arthur Drumond](https://github.com/drumondpucminas)</sup></sup><br>&nbsp;&nbsp;&nbsp;&nbsp;<sup><sup>- [Gabriel Resende](https://github.com/gnvr29)</sup></sup>