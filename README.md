
##Dashboard Seed v0.1.94093.72

Esse aplicativo tem como objetivo criar um boot para projetos que precisem de gerenciamento de usuários e área exclusiva. É quase que um "big snippet" de código para quem quiser começar um site ou serviço. É como um "trabalho de conclusão de curso" para mim, pois estou aplicando neles meus estudos em Node. Ele está sendo utilizado em outro projeto privado que estou fazendo, mas as coisas globais estou atualizando aqui e dividindo com quem tiver interesse.

Usaremos nesse projeto:
* Node.js
* mongoDB (servidor local)
* Express.js
* Diversos módulos
  * express-handlebars
  * passport
  * assert
  * mongoose
  * etc.

###Conceitos gerais

O projeto tem como objetivo ser crossbrowser e prover um pacote base para utilização também em responsivo, além de servir de laboratório para automatização de testes automatizados para ambas as áreas. Escolhemos utilizar alguns serviços online para isso e o [BrowserStack.com](https://www.browserstack.com) foi o que demonstrou possuir ótimas ferramentas, possibilidade de escalonamento e preços justos.

Você pode ver documentos detalhados em:
* [Escopo](https://github.com/bellentani/dashboard-seed/blob/master/SCOPE.md);
* [Perguntas Frequentes](https://github.com/bellentani/dashboard-seed/blob/master/FAQ.md);
* [Configuração básica do ambiente](https://github.com/bellentani/dashboard-seed/blob/master/CONFIG.md)
* [Referências: tutoriais, matérias e itens utilizados para criar cada funcionalidade](https://github.com/bellentani/dashboard-seed/blob/master/REF.md)
* [Projeto MVP em andamento](https://github.com/bellentani/dashboard-seed/projects/1)

Se quiser colaborar, tirar dúvidas ou afins, pode [abrir uma issue](https://github.com/bellentani/dashboard-seed/issues) que ela será respondida. Caso queira colaborar inserindo código, só mandar um pull request. ;)

##Escopo Geral para a versão 1.0
Você pode ver o escopo [detalhado aqui (com andamento de cada funcionalidade)](https://github.com/bellentani/dashboard-seed/blob/master/SCOPE.md).

O escopo de ferramentas que farão parte desse app são:
* Configuração inicial de servidor
* Cadastro de usuário
  * E-mail
  * Senha
  * Avatar (com Gravatar)
* Acesso do usuário
  * Login e Sign out
* Recuperação de senha (``/forgot``)
  * Reset password com token
* Área personalizada (``/profile``)
  * Avatar
  * Informações básicas
  * Edição de informações (``/profile/edit``)
  * Criar profile por user ID ou User name (``/profile/12313123`` || ``/profile/bellentani``)
    * Criar profile com apelido (quando o campo ``alias`` estiver preenchido no banco, senão usará o ID)
    * Quando criar o campo ``alias`` precisaremos checar se ele está sendo usado, porque ele também será um registro único (registros únicos são ``id``,``email`` e ``alias``).
* Tela de usuário
  * Pública
  * Escolha de itens que podem ser exibidos (privacidade)
* Área administrativa (``/profile/::user::admin``)
  * Níveis de usuário (user, admin, owner)
  * Relatório de atividade gerais dos usuários (logs)#Dashboard Seed v0.1.94093.72
Esse aplicativo tem como objetivo criar um boot para projetos que precisem de gerenciamento de usuários e área exclusiva. É quase que um "big snippet" de código para quem quiser começar um site ou serviço. É como um "trabalho de conclusão de curso" para mim, pois estou aplicando neles meus estudos em Node. Ele está sendo utilizado em outro projeto privado que estou fazendo, mas as coisas globais estou atualizando aqui e dividindo com quem tiver interesse.

Usaremos nesse projeto:
* Node.js
* mongoDB (servidor local)
* Express.js
* Diversos módulos
  * express-handlebars
  * passport
  * assert
  * mongoose
  * etc.

##Apoio

Alguns serviços que usamos de forma gratuíta e parceiros que fornecem espaço físico para nossas reuniões.

[![Browser Stack](docs/img/logo-browserstack.jpg)](https://www.browserstack.com) [![Space Sorocaba](docs/img/logo-space.jpg)](http://spacesorocaba.com.br/) [![GoHub Sorocaba](docs/img/logo-gohub.jpg)](http://gohub.com.br/) [![Developer School](docs/img/logo-developer-school.jpg)](http://developerschool.com.br/)

##Agradecimentos

A todos os interessados na proposta e envolvidos, desde aqueles que já brincaram colocando algumas linhas no código até aqueles que participaram dos bate papos iniciais.
