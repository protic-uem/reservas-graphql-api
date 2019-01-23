import * as graphqlFields from 'graphql-fields';
import { GraphQLResolveInfo, graphql } from "graphql";
import { Transaction } from "sequelize";

import { DbConnection } from "../../../interfaces/DbConnectionInterface";
import { DepartamentoInstance } from "../../../models/DepartamentoModel";
import { handleError, throwError } from "../../../utils/utils";
import { compose } from "../../composable/composable.resolver";
import { authResolvers } from "../../composable/auth.resolver";
import { AuthUsuario } from "../../../interfaces/AuthUsuarioInterface";
import { ResolverContext } from '../../../interfaces/ResolverContextInterface';

export const departamentoResolvers = {

    Departamento: {

        salas: (departamento, {first = 10, offset = 0}, context: ResolverContext, info: GraphQLResolveInfo) => {
            return context.db.Sala
                .findAll({
                    where: {departamento: departamento.get('id')},
                    limit: first,
                    offset: offset,
                    attributes: context.requestedFields.getFields(info, {keep: ['id'], exclude: ['salas']})
                })
                .catch(handleError);
        },

        disciplinas: (departamento, {first = 10, offset = 0}, context: ResolverContext, info: GraphQLResolveInfo) => {
            return context.db.Disciplina
                .findAll({
                    where: {departamento: departamento.get('id')},
                    limit: first,
                    offset: offset,
                    attributes: context.requestedFields.getFields(info, {keep: ['id'], exclude: ['disciplinas']})
                })
                .catch(handleError);
        },
        cursos: (departamento, {first = 10, offset = 0}, context: ResolverContext, info: GraphQLResolveInfo) => {
            return context.db.Curso
                .findAll({
                    where: {departamento: departamento.get('id')},
                    limit: first,
                    offset: offset,
                    attributes: context.requestedFields.getFields(info, {keep: ['id'], exclude: ['cursos']})
                })
                .catch(handleError);
        },
        usuarios: (departamento, {first = 10, offset = 0}, context: ResolverContext, info: GraphQLResolveInfo) => {
            return context.db.Usuario
                .findAll({
                    where: {departamento: departamento.get('id')},
                    limit: first,
                    offset: offset,
                    attributes: context.requestedFields.getFields(info, {keep: ['id'], exclude: ['usuarios']})
                })
                .catch(handleError);
        },
        reservas: (departamento, {first = 10, offset = 0}, context: ResolverContext, info: GraphQLResolveInfo) => {
            return context.db.Reserva
                .findAll({
                    where: {departamento: departamento.get('id')},
                    limit: first,
                    offset: offset,
                    attributes: context.requestedFields.getFields(info, {keep: ['id'], exclude: ['reservas']})
                })
                .catch(handleError);
        },

    },

    Query: {

        departamentos: (parent, {first = 10, offset = 0}, context: ResolverContext, info: GraphQLResolveInfo) => {
            return context.db.Departamento
                .findAll({
                    limit: first,
                    offset: offset,
                    attributes: context.requestedFields.getFields(info, {keep: ['id'], exclude: ['salas', 'disciplinas', 'cursos', 'usuarios', 'reservas']})
                })
                .catch(handleError);
        },

        departamento: (parent, { id }, context: ResolverContext, info: GraphQLResolveInfo) => {
            id = parseInt(id);
            return context.db.Departamento
                .findById(id, {
                    attributes: context.requestedFields.getFields(info, {keep: ['id'], exclude: ['salas', 'disciplinas', 'cursos', 'usuarios', 'reservas']})
                })
                .then((departamento: DepartamentoInstance) => {
                    throwError(!departamento, `Departamento with id ${id} not found!`);
                    return departamento;
                }).catch(handleError);
        }
    },

    Mutation: {

        createDepartamento: compose(...authResolvers)((parent, { input }, {db, authUsuario}: {db: DbConnection, authUsuario: AuthUsuario}, info: GraphQLResolveInfo) => {
            input.author = authUsuario.id;
            return db.sequelize.transaction((t: Transaction) => {
                return db.Departamento
                    .create(input, {transaction: t});
           }).catch(handleError);
        }),

        updateDepartamento: compose(...authResolvers)((parent, {id, input }, {db, authUsuario}: {db: DbConnection, authUsuario:AuthUsuario}, info: GraphQLResolveInfo) => {
            id = parseInt(id);
            return db.sequelize.transaction((t: Transaction) => {
                 return db.Departamento
                    .findById(id)
                    .then((departamento: DepartamentoInstance) => {
                        throwError(!departamento, `Departamento with id ${id} not found!`);
                        //throwError(departamento.get('author') != authUsuario.id, `Unauthorized! You can only edit departamentos by yourself`);
                        input.author = authUsuario.id;
                        return departamento.update(input, {transaction: t});
                    });
            }).catch(handleError);
         }),

        deleteDepartamento: compose(...authResolvers)((parent, {id}, {db, authUsuario}: {db: DbConnection, authUsuario:AuthUsuario}, info: GraphQLResolveInfo) => {
            id = parseInt(id);
            return db.sequelize.transaction((t: Transaction) => {
                 return db.Departamento
                    .findById(id)
                    .then((departamento: DepartamentoInstance) => {
                        throwError(!departamento, `Departamento with id ${id} not found!`);
                        //throwError(departamento.get('author') != authUsuario.id, `Unauthorized! You can only delete departamentos by yourself`);
                        return departamento.destroy({transaction: t})
                            .then(() => true)
                            .catch(() => false);
                    });
            }).catch(handleError);
        })
    }

};