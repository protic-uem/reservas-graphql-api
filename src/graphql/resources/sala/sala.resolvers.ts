import * as graphqlFields from 'graphql-fields';
import { GraphQLResolveInfo, graphql } from "graphql";
import { Transaction } from "sequelize";

import { DbConnection } from "../../../interfaces/DbConnectionInterface";
import { SalaInstance } from "../../../models/SalaModel";
import { handleError, throwError } from "../../../utils/utils";
import { compose } from "../../composable/composable.resolver";
import { authResolvers } from "../../composable/auth.resolver";
import { AuthUsuario } from "../../../interfaces/AuthUsuarioInterface";
import { DataLoaders } from "../../../interfaces/DataLoadersInterface";
import { ResolverContext } from '../../../interfaces/ResolverContextInterface';
import { RequestedFields } from '../../ast/RequestedFields';
import sequelize = require('sequelize');

export const salaResolvers = {

    Sala: {

        departamento: (sala, args,{db, dataloaders: {departamentoLoader}} :{db: DbConnection, dataloaders: DataLoaders}, info: GraphQLResolveInfo) => {
            return departamentoLoader
                .load({key: sala.get('departamento'), info})
                .catch(handleError);
        }
    },

    Query: {

        salas: (parent, {first = 10, offset = 0}, context: ResolverContext, info: GraphQLResolveInfo) => {
            return context.db.Sala
                .findAll({
                    limit: first,
                    offset: offset,
                    attributes: context.requestedFields.getFields(info, {keep: ['id']})
                })
                .catch(handleError);
        },

        sala: (parent, { id }, context: ResolverContext, info: GraphQLResolveInfo) => {
            id = parseInt(id);
            return context.db.Sala
                .findById(id, {
                    attributes: context.requestedFields.getFields(info, {keep: ['id']})
                })
                .then((sala: SalaInstance) => {
                    throwError(!sala, `Sala com id ${id} não encontrada!`);
                    return sala;
                }).catch(handleError);
        },
        salasPorDepartamento: (parent, {departamentoID, first = 10, offset = 0}, {db, requestedFields}: {db: DbConnection, requestedFields: RequestedFields}, info: GraphQLResolveInfo) => {
            departamentoID = parseInt(departamentoID);
            return db.Sala
                .findAll({
                    where: {id_departamento: departamentoID},
                    limit: first,
                    offset: offset,
                    attributes: requestedFields.getFields(info),
                    order: [['numero', 'ASC']]
                })
                .catch(handleError);
        },
        salasDisponiveisPorDepartamentoDiaPeriodo : (parent, {departamentoID, data, periodo,tipo, first = 10, offset = 0}, {db, requestedFields}: {db: DbConnection, requestedFields: RequestedFields}, info: GraphQLResolveInfo) => {
            departamentoID = parseInt(departamentoID);
            periodo = parseInt(periodo);
            let ids: number[] = new Array();
            


            db.sequelize.query("select DISTINCT id_sala from reservas WHERE id_departamento=? AND (data_reserva=? || (DAYOFWEEK(data_reserva)=? AND tipo_reserva='Fixo')) AND periodo=? AND status=1",
                {   replacements: [departamentoID, data, data, periodo],
                    type: sequelize.QueryTypes.SELECT}).then(
                    salas => {
                        salas.forEach(id => {
                            ids.push(id);
                        });
                    }
                );

            let where = {
                id: {$notIn: ids}, status: 1
            };
            if(tipo != null && tipo != undefined)
                if(tipo == "Prática")
                    where["tipo"] = "Laboratório";

            
            return  db.Sala
            .findAll({
                where,
                limit: first,
                offset: offset,
                attributes: requestedFields.getFields(info),
                order: [["numero", "ASC"]]
            })
            .catch(handleError);
        }
    },

    Mutation: {

        createSala: compose(...authResolvers)((parent, { input }, {db, authUsuario}: {db: DbConnection, authUsuario: AuthUsuario}, info: GraphQLResolveInfo) => {
            return db.sequelize.transaction((t: Transaction) => {
                return db.Sala
                    .create(input, {transaction: t});
           }).catch(handleError);
        }),

        updateSala: compose(...authResolvers)((parent, {id, input }, {db, authUsuario}: {db: DbConnection, authUsuario:AuthUsuario}, info: GraphQLResolveInfo) => {
            id = parseInt(id);
            return db.sequelize.transaction((t: Transaction) => {
                 return db.Sala
                    .findById(id)
                    .then((sala: SalaInstance) => {
                        throwError(!sala, `Sala com id ${id} não encontrada!`);
                        //throwError(sala.get('departamento') != authUsuario.id, `Unauthorized! You can only edit salas by yourself`);
                        return sala.update(input, {transaction: t});
                    });
            }).catch(handleError);
         }),

        deleteSala: compose(...authResolvers)((parent, {id}, {db, authUsuario}: {db: DbConnection, authUsuario:AuthUsuario}, info: GraphQLResolveInfo) => {
            id = parseInt(id);
            return db.sequelize.transaction((t: Transaction) => {
                 return db.Sala
                    .findById(id)
                    .then((sala: SalaInstance) => {
                        throwError(!sala, `Sala com id ${id} não encontrada!`);
                        //throwError(sala.get('author') != authUsuario.id, `Unauthorized! You can only delete salas by yourself`);
                        return sala.destroy({transaction: t})
                            .then(() => true)
                            .catch(() => false);
                    });
            }).catch(handleError);
        })
    }

};