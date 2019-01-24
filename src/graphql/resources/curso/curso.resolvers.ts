import * as graphqlFields from 'graphql-fields';
import { GraphQLResolveInfo, graphql } from "graphql";
import { Transaction } from "sequelize";

import { DbConnection } from "../../../interfaces/DbConnectionInterface";
import { CursoInstance } from "../../../models/CursoModel";
import { handleError, throwError } from "../../../utils/utils";
import { compose } from "../../composable/composable.resolver";
import { authResolvers } from "../../composable/auth.resolver";
import { AuthUsuario } from "../../../interfaces/AuthUsuarioInterface";
import { DataLoaders } from "../../../interfaces/DataLoadersInterface";
import { ResolverContext } from '../../../interfaces/ResolverContextInterface';
import { RequestedFields } from '../../ast/RequestedFields';

export const cursoResolvers = {

    Curso: {

        departamento: (curso, args,{db, dataloaders: {departamentoLoader}} :{db: DbConnection, dataloaders: DataLoaders}, info: GraphQLResolveInfo) => {
            return departamentoLoader
                .load({key: curso.get('departamento'), info})
                .catch(handleError);
        },

        disciplinas: (curso, {first = 10, offset = 0}, {db, requestedFields}: {db: DbConnection, requestedFields:RequestedFields}, info: GraphQLResolveInfo) => {
            return db.Disciplina
                .findAll({
                    where: {curso: curso.get('id')},
                    //limit: first,
                    //offset: offset,
                    attributes: requestedFields.getFields(info, {keep: ['id'], exclude: ['disciplinas']})
                }).catch(handleError);
        }

    },

    Query: {

        cursos: (parent, {first = 10, offset = 0}, context: ResolverContext, info: GraphQLResolveInfo) => {
            return context.db.Curso
                .findAll({
                    //limit: first,
                    //offset: offset,
                    attributes: context.requestedFields.getFields(info, {keep: ['id'], exclude: ['disciplinas']})
                })
                .catch(handleError);
        },

        curso: (parent, { id }, context: ResolverContext, info: GraphQLResolveInfo) => {
            id = parseInt(id);
            return context.db.Curso
                .findById(id, {
                    attributes: context.requestedFields.getFields(info, {keep: ['id'], exclude: ['disciplinas']})
                })
                .then((curso: CursoInstance) => {
                    throwError(!curso, `Curso with id ${id} not found!`);
                    return curso;
                }).catch(handleError);
        }
    },

    Mutation: {

        createCurso: compose(...authResolvers)((parent, { input }, {db, authUsuario}: {db: DbConnection, authUsuario: AuthUsuario}, info: GraphQLResolveInfo) => {
            input.author = authUsuario.id;
            return db.sequelize.transaction((t: Transaction) => {
                return db.Curso
                    .create(input, {transaction: t});
           }).catch(handleError);
        }),

        updateCurso: compose(...authResolvers)((parent, {id, input }, {db, authUsuario}: {db: DbConnection, authUsuario:AuthUsuario}, info: GraphQLResolveInfo) => {
            id = parseInt(id);
            return db.sequelize.transaction((t: Transaction) => {
                 return db.Curso
                    .findById(id)
                    .then((curso: CursoInstance) => {
                        throwError(!curso, `Curso with id ${id} not found!`);
                        //throwError(curso.get('author') != authUsuario.id, `Unauthorized! You can only edit cursos by yourself`);
                        input.author = authUsuario.id;
                        return curso.update(input, {transaction: t});
                    });
            }).catch(handleError);
         }),

        deleteCurso: compose(...authResolvers)((parent, {id}, {db, authUsuario}: {db: DbConnection, authUsuario:AuthUsuario}, info: GraphQLResolveInfo) => {
            id = parseInt(id);
            return db.sequelize.transaction((t: Transaction) => {
                 return db.Curso
                    .findById(id)
                    .then((curso: CursoInstance) => {
                        throwError(!curso, `Curso with id ${id} not found!`);
                        //throwError(curso.get('author') != authUsuario.id, `Unauthorized! You can only delete cursos by yourself`);
                        return curso.destroy({transaction: t})
                            .then(() => true)
                            .catch(() => false);
                    });
            }).catch(handleError);
        })
    }

};