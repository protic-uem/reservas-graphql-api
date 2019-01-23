import { makeExecutableSchema } from 'graphql-tools';
import { merge } from 'lodash';

import { Query } from './query';
import { Mutation } from './mutation';

import { tokenTypes } from './resources/token/token.schema';

import { tokenResolvers } from './resources/token/token.resolvers';
import { departamentoResolvers } from './resources/departamento/departamento.resolvers';
import { reservaResolvers } from './resources/reserva/reserva.resolvers';
import { salaResolvers } from './resources/sala/sala.resolvers';
import { disciplinaResolvers } from './resources/disciplina/disciplina.resolvers';
import { usuarioResolvers } from './resources/usuario/usuario.resolvers';
import { disciplinaTypes } from './resources/disciplina/disciplina.schema';
import { reservaTypes } from './resources/reserva/reserva.schema';
import { usuarioTypes } from './resources/usuario/usuario.schema';
import { departamentoTypes } from './resources/departamento/departamento.schema';
import { cursoTypes } from './resources/curso/curso.schema';
import { salaTypes } from './resources/sala/sala.schema';
import { cursoResolvers } from './resources/curso/curso.resolvers';

//Fazendo a mesclagem dos resolvers
const resolvers = merge(
    departamentoResolvers,
    reservaResolvers,
    tokenResolvers,
    salaResolvers,
    disciplinaResolvers,
    usuarioResolvers,
    cursoResolvers
);

const SchemaDefinition = `
    type Schema {
        query: Query
        mutation: Mutation
    }
`;

//Schema executavel
export default makeExecutableSchema({
    typeDefs: [
        SchemaDefinition,
        Query,
        Mutation,
        disciplinaTypes,
        reservaTypes,
        departamentoTypes,
        cursoTypes,
        salaTypes,
        tokenTypes,
        usuarioTypes
    ],
    resolvers
});