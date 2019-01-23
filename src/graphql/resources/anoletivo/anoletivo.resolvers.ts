import * as graphqlFields from 'graphql-fields';
import { GraphQLResolveInfo, graphql } from "graphql";
import { Transaction } from "sequelize";

import { DbConnection } from "../../../interfaces/DbConnectionInterface";
import { AnoLetivoInstance } from "../../../models/AnoLetivoModel";
import { handleError, throwError } from "../../../utils/utils";
import { compose } from "../../composable/composable.resolver";
import { authResolvers } from "../../composable/auth.resolver";
import { AuthUsuario } from "../../../interfaces/AuthUsuarioInterface";
import { DataLoaders } from "../../../interfaces/DataLoadersInterface";
import { ResolverContext } from '../../../interfaces/ResolverContextInterface';
import { RequestedFields } from '../../ast/RequestedFields';

export const anoLetivoResolvers = {

    AnoLetivo: {
        
        departamento: (anoLetivo, args,{db, dataloaders: {departamentoLoader}} :{db: DbConnection, dataloaders: DataLoaders}, info: GraphQLResolveInfo) => {
            return departamentoLoader
                .load({key: anoLetivo.get('departamento'), info})
                .catch(handleError);
        }
    },

    Query: {

        anoLetivos: (parent, {first = 10, offset = 0}, context: ResolverContext, info: GraphQLResolveInfo) => {
            return context.db.AnoLetivo
                .findAll({
                    limit: first,
                    offset: offset,
                    attributes: context.requestedFields.getFields(info, {keep: ['id'], exclude: ['disciplinas']})
                })
                .catch(handleError);
        },

        anoLetivo: (parent, { id }, context: ResolverContext, info: GraphQLResolveInfo) => {
            id = parseInt(id);
            return context.db.AnoLetivo
                .findById(id, {
                    attributes: context.requestedFields.getFields(info, {keep: ['id'], exclude: ['disciplinas']})
                })
                .then((anoLetivo: AnoLetivoInstance) => {
                    throwError(!anoLetivo, `AnoLetivo with id ${id} not found!`);
                    return anoLetivo;
                }).catch(handleError);
        }
    },

    Mutation: {

        createAnoLetivo: compose(...authResolvers)((parent, { input }, {db, authUsuario}: {db: DbConnection, authUsuario: AuthUsuario}, info: GraphQLResolveInfo) => {
            input.author = authUsuario.id;
            return db.sequelize.transaction((t: Transaction) => {
                return db.AnoLetivo
                    .create(input, {transaction: t});
           }).catch(handleError);
        }),

        updateAnoLetivo: compose(...authResolvers)((parent, {id, input }, {db, authUsuario}: {db: DbConnection, authUsuario:AuthUsuario}, info: GraphQLResolveInfo) => {
            id = parseInt(id);
            return db.sequelize.transaction((t: Transaction) => {
                 return db.AnoLetivo
                    .findById(id)
                    .then((anoLetivo: AnoLetivoInstance) => {
                        throwError(!anoLetivo, `AnoLetivo with id ${id} not found!`);
                        //throwError(anoLetivo.get('author') != authUsuario.id, `Unauthorized! You can only edit anoLetivos by yourself`);
                        input.author = authUsuario.id;
                        return anoLetivo.update(input, {transaction: t});
                    });
            }).catch(handleError);
         }),

        deleteAnoLetivo: compose(...authResolvers)((parent, {id}, {db, authUsuario}: {db: DbConnection, authUsuario:AuthUsuario}, info: GraphQLResolveInfo) => {
            id = parseInt(id);
            return db.sequelize.transaction((t: Transaction) => {
                 return db.AnoLetivo
                    .findById(id)
                    .then((anoLetivo: AnoLetivoInstance) => {
                        throwError(!anoLetivo, `AnoLetivo with id ${id} not found!`);
                        //throwError(anoLetivo.get('author') != authUsuario.id, `Unauthorized! You can only delete anoLetivos by yourself`);
                        return anoLetivo.destroy({transaction: t})
                            .then(() => true)
                            .catch(() => false);
                    });
            }).catch(handleError);
        })
    }

};