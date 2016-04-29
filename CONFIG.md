#Informações sobre o app

Como este aplicativo está usando mongoDB, é preciso conhecer um pouco sobre o banco. Estamos rodando localmente, mas existe a possibilidade de você utilizar um serviço em Cloud. Vou listar dois serviços gratuitos que possam vir a interessar.

##Configuração inicial do banco local

É preciso criar a pasta: ``/data/db`` para rodar o banco.

Rodar usando o comando: ``mongod --dbpath data/db``

Usar para inserir o primeiro registro:

```javascript
db.user.insert({
  'email': 'email@example.com.br',
  'name': 'John Doe'
});
```
É preciso criar um arquivo ``config/db.js``:

```javascript
module.exports = {
  'url' : 'mongodb://{{seuservidor}}/dashboard-node'
};
```
