#Dicas gerais de ambiente
Ao instalar o Git no Windows, crie na pasta .ssh um arquivo `config` (se já não foi criado). Dentro dele você registra cada servidor ou todos os hosts:

```
Host *
 IdentityFile  ~/.ssh/poepc
```

Ou:

```
Host github.org
 IdentityFile  ~/.ssh/poepc

Host bitbucket.org
 IdentityFile  ~/.ssh/poepc
```

Para colocar um timeout e não ter que digitar a senha toda hora, adicione a configuração global do Git:


Permanently authenticating with Git repositories,

Run following command to enable credential caching.
```
$ git config credential.helper store
$ git push https://github.com/repo.git

Username for 'https://github.com': <USERNAME>
Password for 'https://USERNAME@github.com': <PASSWORD>


Use should also specify caching expire,
```
git config --global credential.helper 'cache --timeout 7200'
```

After enabling credential caching, it will be cached for 7200 seconds (2 hour).
