const restify = require('restify');
const err = require('restify-errors');

const server = restify.createServer({
  name: 'myapp',
  version: '1.0.0'
});

const knex = require('knex')({
  client: 'mysql',
  connection: {
    host: 'localhost',
    user: 'root',
    password: 'dinfopower',
    database: 'node-spa',
    insecureAuth: true
  }
});

server.use(restify.plugins.acceptParser(server.acceptable));
server.use(restify.plugins.queryParser());
server.use(restify.plugins.bodyParser());

server.listen(8080, function () {
  console.log('%s listening at %s', server.name, server.url);
});

server.get('/', function (req, res, next) {

  knex('rest').then((data) => {
    res.send(data);
  }, next);

  return next();
});

server.post('/add', function (req, res, next) {

  knex('rest')
    .insert(req.body)
    .then((data) => {
      res.send(data);
    }, next);

  return next();
});

server.get('/view/:id', function (req, res, next) {
  const { id } = req.params;

  knex('rest')
    .where('id', id)
    .first()
    .then((data) => {
      if (!data) {
        return res.send(new err.BadRequestError('Usuário não encontrado.'))
      }
      res.send(data);
    }, next);
});

server.put('/edit/:id', function (req, res, next) {
  const { id } = req.params;

  knex('rest')
    .where('id', id)
    .update(req.body)
    .then((data) => {
      if (!data) {
        return res.send(new err.BadRequestError('Usuário não encontrado.'))
      }
      res.send('Usuário atualizado com sucesso!');
    }, next);
});

server.del('/remove/:id', function (req, res, next) {
  const { id } = req.params;

  knex('rest')
    .where('id', id)
    .delete()
    .then((data) => {
      if (!data) {
        return res.send(new err.BadRequestError('Usuário não encontrado.'))
      }
      res.send('Usuário excluído com sucesso!');
    }, next);
});