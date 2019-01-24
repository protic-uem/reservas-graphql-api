import * as graphqlFields from 'graphql-fields';
import { GraphQLResolveInfo, graphql } from "graphql";
import { Transaction } from "sequelize";

import { DbConnection } from "../../../interfaces/DbConnectionInterface";
import { DisciplinaInstance } from "../../../models/DisciplinaModel";
import { handleError, throwError } from "../../../utils/utils";
import { compose } from "../../composable/composable.resolver";
import { authResolvers } from "../../composable/auth.resolver";
import { AuthUsuario } from "../../../interfaces/AuthUsuarioInterface";
import { DataLoaders } from "../../../interfaces/DataLoadersInterface";
import { ResolverContext } from '../../../interfaces/ResolverContextInterface';
import { RequestedFields } from '../../ast/RequestedFields';

export const disciplinaResolvers = {

    Disciplina: {

        usuario: (disciplina, args,{db, dataloaders: {usuarioLoader}} :{db: DbConnection, dataloaders: DataLoaders}, info: GraphQLResolveInfo) => {
            return usuarioLoader
                .load({key: disciplina.get('usuario'), info})
                .catch(handleError);
        },
        departamento: (disciplina, args,{db, dataloaders: {departamentoLoader}} :{db: DbConnection, dataloaders: DataLoaders}, info: GraphQLResolveInfo) => {
            return departamentoLoader
                .load({key: disciplina.get('departamento'), info})
                .catch(handleError);
        },
        curso: (disciplina, args,{db, dataloaders: {cursoLoader}} :{db: DbConnection, dataloaders: DataLoaders}, info: GraphQLResolveInfo) => {
            return cursoLoader
                .load({key: disciplina.get('curso'), info})
                .catch(handleError);
        }
       
    },

    Query: {

        disciplinas: (parent, {first = 10, offset = 0}, context: ResolverContext, info: GraphQLResolveInfo) => {
            return context.db.Disciplina
                .findAll({
                    //limit: first,
                    //offset: offset,
                    attributes: context.requestedFields.getFields(info, {keep: ['id']})
                })
                .catch(handleError);
        },

        disciplina: (parent, { id }, context: ResolverContext, info: GraphQLResolveInfo) => {
            id = parseInt(id);
            return context.db.Disciplina
                .findById(id, {
                    attributes: context.requestedFields.getFields(info, {keep: ['id']})
                })
                .then((disciplina: DisciplinaInstance) => {
                    throwError(!disciplina, `Disciplina com id ${id} não encontrada!`);
                    return disciplina;
                }).catch(handleError);
        },
        disciplinasPorDepartamento: (parent, { departamentoID, first = 10, offset = 0}, {db, requestedFields}: {db: DbConnection, requestedFields: RequestedFields}, info: GraphQLResolveInfo) => {
            departamentoID = parseInt(departamentoID);
            return db.Disciplina
                .findAll({
                    where: {id_departamento: departamentoID, status: 1},
                    //limit: first,
                    //offset: offset,
                    attributes: requestedFields.getFields(info),
                    order: [['nome', 'ASC']]
                })
                .catch(handleError);
        },
        disciplinasPorUsuario: (parent, {usuarioID, first = 10, offset = 0}, {db, requestedFields}: {db: DbConnection, requestedFields: RequestedFields}, info: GraphQLResolveInfo) => {
            usuarioID = parseInt(usuarioID);
            return db.Disciplina
                .findAll({
                    where: {usuario: usuarioID, status: 1},
                    //limit: first,
                    //offset: offset,
                    attributes: requestedFields.getFields(info),
                    order: [['nome', 'ASC']]
                })
                .catch(handleError);
        }
    },

    Mutation: {

        createDisciplina: compose(...authResolvers)((parent, { input }, {db, authUsuario}: {db: DbConnection, authUsuario: AuthUsuario}, info: GraphQLResolveInfo) => {
            input.usuario = authUsuario.id;
            return db.sequelize.transaction((t: Transaction) => {
                return db.Disciplina
                    .create(input, {transaction: t});
           }).catch(handleError);
        }),

        updateDisciplina: compose(...authResolvers)((parent, {id, input }, {db, authUsuario}: {db: DbConnection, authUsuario:AuthUsuario}, info: GraphQLResolveInfo) => {
            id = parseInt(id);
            return db.sequelize.transaction((t: Transaction) => {
                 return db.Disciplina
                    .findById(id)
                    .then((disciplina: DisciplinaInstance) => {
                        throwError(!disciplina, `Disciplina com id ${id} não encontrada!`);
                        throwError(disciplina.get('id_usuario') != authUsuario.id, `Sem autorização! Você só pode editar suas próprias disciplinas`);
                        input.usuario = authUsuario.id;
                        return disciplina.update(input, {transaction: t});
                    });
            }).catch(handleError);
         }),

        deleteDisciplina: compose(...authResolvers)((parent, {id}, {db, authUsuario}: {db: DbConnection, authUsuario:AuthUsuario}, info: GraphQLResolveInfo) => {
            id = parseInt(id);
            return db.sequelize.transaction((t: Transaction) => {
                 return db.Disciplina
                    .findById(id)
                    .then((disciplina: DisciplinaInstance) => {
                        throwError(!disciplina, `Disciplina com id ${id} não encontrada!`);
                        throwError(disciplina.get('id_usuario') != authUsuario.id, `Sem autorização! Você só pode editar suas próprias disciplinas`);
                        return disciplina.destroy({transaction: t})
                            .then(() => true)
                            .catch(() => false);
                    });
            }).catch(handleError);
        })
    }

};