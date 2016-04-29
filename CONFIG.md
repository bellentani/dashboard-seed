#Informações sobre o app

É preciso criar a pasta ``/data/db`` para rodar o banco.
Rodar usando o comando mongod --dbpath data/db

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
