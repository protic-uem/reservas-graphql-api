import * as graphqlFields from 'graphql-fields';
import { GraphQLResolveInfo, graphql } from "graphql";
import { Transaction } from "sequelize";

import { DbConnection } from "../../../interfaces/DbConnectionInterface";
import { ReservaInstance } from "../../../models/ReservaModel";
import { handleError, throwError } from "../../../utils/utils";
import { compose } from "../../composable/composable.resolver";
import { authResolvers } from "../../composable/auth.resolver";
import { AuthUsuario } from "../../../interfaces/AuthUsuarioInterface";
import { DataLoaders } from "../../../interfaces/DataLoadersInterface";
import { ResolverContext } from '../../../interfaces/ResolverContextInterface';
import { union } from 'lodash';
import { DisciplinaInstance } from '../../../models/DisciplinaModel';


export const reservaResolvers = {

    Reserva: {

        usuario: (reserva, args,{db, dataloaders: {usuarioLoader}} :{db: DbConnection, dataloaders: DataLoaders}, info: GraphQLResolveInfo) => {
            return usuarioLoader
                .load({key: reserva.get('usuario'), info})
                .catch(handleError);
        },
        departamento: (reserva, args,{db, dataloaders: {departamentoLoader}} :{db: DbConnection, dataloaders: DataLoaders}, info: GraphQLResolveInfo) => {
            return departamentoLoader
                .load({key: reserva.get('departamento'), info})
                .catch(handleError);
        },
        sala: (reserva, args,{db, dataloaders: {salaLoader}} :{db: DbConnection, dataloaders: DataLoaders}, info: GraphQLResolveInfo) => {
            return salaLoader
                .load({key: reserva.get('sala'), info})
                .catch(handleError);
        },
        
        disciplina: (reserva, args,{db, dataloaders: {disciplinaLoader}} :{db: DbConnection, dataloaders: DataLoaders}, info: GraphQLResolveInfo) => {
            return db.Disciplina
                .findById(reserva.get('disciplina'))
                .then((disciplina:DisciplinaInstance) => {
                    return disciplina;
                });
        }
    },

    Query: {

        reservas: (parent, {first = 10, offset = 0}, context: ResolverContext, info: GraphQLResolveInfo) => {
            return context.db.Reserva
                .findAll({
                    //limit: first,
                    //offset: offset,
                    attributes: context.requestedFields.getFields(info, {keep: ['id']})
                })
                .catch(handleError);
        },

        minhasReservas: (parent, {usuarioID, first = 10, offset = 0}, context: ResolverContext, info: GraphQLResolveInfo) => {
            usuarioID = parseInt(usuarioID);
            return context.db.Reserva
                .findAll({
                    where: {id_usuario : usuarioID, 
                        data_reserva: {[context.db.sequelize.Op.gte]: context.db.sequelize.fn('DATE', context.db.sequelize.fn('NOW'))}, 
                        status: {[context.db.sequelize.Op.or]: [0,1]}},
                    
                    attributes: context.requestedFields.getFields(info, {keep: ['id']})
                })
                .catch(handleError);
        },

        reservasTelaHome: (parent, {departamentoID, data_reserva, periodo, first = 10, offset = 0}, context: ResolverContext, info: GraphQLResolveInfo) => {
            return context.db.Reserva
                .findAll({
                    where: {id_departamento : departamentoID, 
                        [context.db.sequelize.Op.or]:[
                         {data_reserva: data_reserva},
                         {[context.db.sequelize.Op.and]: [
                            {dia_semana_reserva:context.db.sequelize.fn('DAYOFWEEK', data_reserva)}, 
                            {tipo_reserva: 'Fixo'}]}],
                            periodo: periodo,
                            status:  1},
                    //limit: first,
                    //offset: offset,
                    attributes: context.requestedFields.getFields(info, {keep: ['id']}),
                    order: [['data_solicitacao', 'DESC']],
                })
                .catch(handleError);
        },

        reservasTelaSearch: (parent, {departamentoID, salaID, data_reserva, first = 10, offset = 0}, context: ResolverContext, info: GraphQLResolveInfo) => {
            return context.db.Reserva
                .findAll({
                    where: {id_departamento : departamentoID, 
                        id_sala: salaID,
                        [context.db.sequelize.Op.or]:[
                         {data_reserva: data_reserva},
                         {[context.db.sequelize.Op.and]: [
                            {dia_semana_reserva:context.db.sequelize.fn('DAYOFWEEK', data_reserva)}, 
                            {tipo_reserva: 'Fixo'}]}],
                            status:  1},
                    //limit: first,
                    //offset: offset,
                    attributes: context.requestedFields.getFields(info, {keep: ['id']}),
                    order: [['periodo', 'ASC']],
                })
                .catch(handleError);
        },

        reservasPorDepartamentoDisciplina: (parent, {departamentoID, disciplinaID}, context: ResolverContext, info: GraphQLResolveInfo) => {
            return context.db.Reserva
                .findAll({
                    where: {id_departamento : departamentoID, 
                        id_disciplina: disciplinaID,
                        data_reserva: {[context.db.sequelize.Op.gte]: context.db.sequelize.fn('NOW')}
                    },
                    attributes: context.requestedFields.getFields(info, {keep: ['id']}),
                    order: [['data_reserva', 'ASC']],
                })
                .catch(handleError);
        },

        validarReservaMesmoHorario: (parent, {usuarioID, data_reserva, periodo, first = 10, offset = 0}, context: ResolverContext, info: GraphQLResolveInfo) => {
            usuarioID = parseInt(usuarioID); 
            periodo = parseInt(periodo);
            
            return context.db.sequelize.query("SELECT id FROM reservas WHERE id_usuario=? AND (data_reserva=? || (DAYOFWEEK(data_reserva)=? AND tipo_reserva='Fixo')) AND periodo=? AND status=1",
            {   replacements: [usuarioID, data_reserva, data_reserva, periodo],
                type: context.db.sequelize.QueryTypes.SELECT}).then(
                reservas => {
                    throwError((reservas != undefined && reservas.length > 0), `Reserva já existe`);
                    if(reservas != undefined && reservas.length > 0)
                        return  false;
                    else
                        return true;
                }
            ).catch(handleError); 
        },

        reserva: (parent, { id }, context: ResolverContext, info: GraphQLResolveInfo) => {
            id = parseInt(id);
            return context.db.Reserva
                .findById(id, {
                    attributes: context.requestedFields.getFields(info, {keep: ['id']})
                })
                .then((reserva: ReservaInstance) => {
                    throwError(!reserva, `Reserva com id ${id} não encontrada!`);
                    return reserva;
                }).catch(handleError);
        }
    },

    Mutation: {

        createReserva: compose(...authResolvers)((parent, { input }, {db, authUsuario}: {db: DbConnection, authUsuario: AuthUsuario}, info: GraphQLResolveInfo) => {
            input.id_usuario = authUsuario.id;
            var result = input.data_reserva.split("-");
            var dia_semana = new Date(result[1]+'/'+result[2]+'/'+result[0]).getDay();
            dia_semana = dia_semana + 1;
            input.dia_semana_reserva = dia_semana;
            return db.sequelize.transaction((t: Transaction) => {
                return db.Reserva
                    .create(input, {transaction: t});
           }).catch(handleError);
        }),

        solicitarReserva:compose(...authResolvers)((parent, { input }, {db, authUsuario}: {db: DbConnection, authUsuario: AuthUsuario}, info: GraphQLResolveInfo) => {
            input.id_usuario = authUsuario.id;
            
            input.status = 1;

            db.sequelize.query("SELECT id FROM reservas WHERE id_departamento=? AND id_sala=? AND (data_reserva=? || (DAYOFWEEK(data_reserva)=? AND tipo_reserva='Fixo')) AND periodo=? AND status=1",
                {   replacements: [input.departamento, input.sala, input.data_reserva, input.data_reserva, input.periodo],
                    type: db.sequelize.QueryTypes.SELECT}).then(
                    reservas => {
                        if(reservas){
                            input.status = 2;
                        }
                    }
                );
            

            return db.sequelize.transaction((t: Transaction) => {
                return db.Reserva
                    .create(input, {transaction: t});
           }).catch(handleError);
        }),

        validarReserva:compose(...authResolvers)((parent, { input }, {db, authUsuario}: {db: DbConnection, authUsuario: AuthUsuario}, info: GraphQLResolveInfo) => {
            input.id_usuario = authUsuario.id;
            
            return db.sequelize.query("SELECT id FROM reservas WHERE id_usuario=? AND (data_reserva=? || (DAYOFWEEK(data_reserva)=? AND tipo_reserva='Fixo')) AND periodo=? AND status=1",
                {   replacements: [input.id_usuario, input.data_reserva, input.data_reserva, input.periodo],
                    type: db.sequelize.QueryTypes.SELECT}).then(
                    reservas => {
                        throwError((reservas != undefined && reservas.length > 0), `Reservas já existe`);
                        if(reservas != undefined && reservas.length > 0)
                            return  false;
                        else
                            return true;
                    }
                ).catch(handleError); 
        }),

        updateReserva: compose(...authResolvers)((parent, {id, input }, {db, authUsuario}: {db: DbConnection, authUsuario:AuthUsuario}, info: GraphQLResolveInfo) => {
            id = parseInt(id);
            return db.sequelize.transaction((t: Transaction) => {
                 return db.Reserva
                    .findById(id)
                    .then((reserva: ReservaInstance) => {
                        throwError(!reserva, `Reserva com id ${id} não encontrado!`);
                        throwError(reserva.get('id_usuario') != authUsuario.id, `Sem autorização! Você só pode editar suas reservas`);
                        input.id_usuario = authUsuario.id;
                        return reserva.update(input, {transaction: t});
                    });
            }).catch(handleError);
         }),

         cancelarReserva:compose(...authResolvers)((parent, { id }, {db, authUsuario}: {db: DbConnection, authUsuario: AuthUsuario}, info: GraphQLResolveInfo) => {
            
            return db.sequelize.query("UPDATE reservas SET status=3 WHERE id=?",
                {   replacements: [id],
                    type: db.sequelize.QueryTypes.UPDATE}).then(
                    reserva => {
                        throwError((reserva == undefined), `Houve um problema ao cancelar a reserva. Por favor, tente novamente.`);
                        
                        return  true;
                       
                    }
                ).catch(handleError); 
        }),

        deleteReserva: compose(...authResolvers)((parent, {id}, {db, authUsuario}: {db: DbConnection, authUsuario:AuthUsuario}, info: GraphQLResolveInfo) => {
            id = parseInt(id);
            return db.sequelize.transaction((t: Transaction) => {
                 return db.Reserva
                    .findById(id)
                    .then((reserva: ReservaInstance) => {
                        throwError(!reserva, `Reserva com id ${id} não encontrada!`);
                        throwError(reserva.get('id_usuario') != authUsuario.id, `Sem autorização! Você só pode editar suas reservas`);
                        return reserva.destroy({transaction: t})
                            .then(() => true)
                            .catch(() => false);
                    });
            }).catch(handleError);
        })
    }

};