#Dashboard Seed v0.1.1606141427pb
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

Para frontend usaremos o Bootstrap, um bocado de CSS personalizado (usando Sass) e Javascript/JQuery, mas não será abordado a explição deles. O importante aqui é aplicativo em si.

Poderia ter feito ele usando Angular ou React, mas acredito que ele será mais universal se ficar um nível abaixo desses frameworks, permitindo estudos isolados de Node, mongoDB, Express e vários módulos correlatos.

Portanto, ao final do desenvolvimento da versão 1.0 teremos que ter uma área administrativa simples. Vocês podem solicitar forks ou mexer a vontade. Aceito colaboração. ;)

##Escopo Geral para a versão 1.0

O escopo de ferramentas que farão parte desse app são:
* ~~Configuração inicial de servidor~~
* Cadastro de usuário (/signup)
  * ~~E-mail~~
  * ~~Senha~~
  * Avatar
* ~~Acesso do usuário (/login)~~
  * ~~Login e Sign out~~
* ~~Recuperação de senha (/forgot)~~
  * ~~Reset password com token ~~
* ~~ Validação de formulários (via frontend) ~~
  * Validação de recuperar senha (se as senhas são iguais)
  * Validação de cadastro
    * ~~Validação de força de senha~~
    * ~~Validação de campos iguais~~
    * ~~Ajax de verificação de conta (se o e-mail já existe no sistema)~~
  * Validação de login
    * Verifica se o e-mail é válido
    * Verifica através de ajax se o usuário e senha estão corretos e imprime os erros
* Cadastro e login através de ferramentas de terceiros (Google, Twitter, etc) usando Passport
* Área personalizada (/profile)
  * Avatar
  * Informações básicas
  * Edição de informações (/profile/edit)
* Área administrativa (/profile/::user::admin)
  * Níveis de usuário (user, admin, owner)
  * Relatório de atividade gerais dos usuários (logs)
* Adição de ferramentas de frontend
  * ~~Grunt~~
  * ~~Bower~~

###Lista de frontend feito separado
Telas feitas em separado na pasta ``src``:
* Main
  * ~~Modal de login e signup~~
  * ~~Barra fixa~~
  * ~~About~~
  * ~~Página de recuperação de senha~~
  * ~~Validação dos forms~~
    * ~~login~~
    * ~~signup~~
* Tela de profile
  * ~~Landing Page (profile)~~
  * Edição de Profile
  * Tela de Signout
* Erro 404
* Erro 500

---
Aos poucos vamos tentar transformar isso em tutorial, explicando cada etapa. Por isso teremos comentários de montão nos códigos produzidos.

P.S.: Esse escopo pode ser alterado a qualquer momento.
