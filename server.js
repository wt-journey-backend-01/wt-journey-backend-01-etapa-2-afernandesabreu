const express = require('express')
const app = express();
const agenteRoutes = require('./routes/agentesRoutes');
const casosRoutes = require('./routes/casosRoutes');
const PORT = 3000;

app.use(express.json());
app.use('/agentes', agenteRoutes);
app.use('/casos', casosRoutes);

app.listen(PORT, () => {
	console.log(`Servidor do Departamento de Polícia rodando em localhost:${PORT}`);
});
