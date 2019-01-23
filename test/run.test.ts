import { db } from './test-utils';

//force: força o mysql limpar os dados do banco sempre que iniciar
db.sequelize.sync( {force: true})
    .then(() => run());