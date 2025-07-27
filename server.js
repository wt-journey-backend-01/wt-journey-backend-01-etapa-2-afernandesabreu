const express = require('express')
const app = express();
const agenteRoutes = require('./routes/agentesRoutes');
const casosRoutes = require('./routes/casosRoutes');
const { errorHandler } = require('./utils/errorHandler');
const { AppError } = require('./utils/errorHandler');
const { swaggerUi, swaggerDocs } = require('./docs/swagger');
const PORT = 3000;

app.use(express.json());
app.use('/agentes', agenteRoutes);
app.use('/casos', casosRoutes);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));


app.get('/api/error-demo', (req, res, next) => {
  next(new AppError(404, 'Resource not found'));
});

app.use(errorHandler);

app.listen(PORT, () => {
	console.log(`Servidor do Departamento de Polícia rodando em localhost:${PORT}`);
});
