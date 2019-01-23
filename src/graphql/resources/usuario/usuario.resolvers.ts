import { GraphQLResolveInfo } from "graphql";
import { DbConnection } from "../../../interfaces/DbConnectionInterface";
import { UsuarioInstance } from "../../../models/UsuarioModel";
import { Transaction } from "sequelize";
import { handleError, throwError } from "../../../utils/utils";
import { compose } from "../../composable/composable.resolver";
import { authResolver, authResolvers } from "../../composable/auth.resolver";
import { verifyTokenResolver } from "../../composable/verify-token.resolver";
import { AuthUsuario } from "../../../interfaces/AuthUsuarioInterface";
import { RequestedFields } from "../../ast/RequestedFields";
import { ResolverContext } from "../../../interfaces/ResolverContextInterface";
import { DataLoaders } from "../../../interfaces/DataLoadersInterface";

export const usuarioResolvers = {

    Usuario: {

        reservas: (usuario, {first = 10, offset = 0}, {db, requestedFields}: {db: DbConnection, requestedFields:RequestedFields}, info: GraphQLResolveInfo) => {
            return db.Reserva
                .findAll({
                    where: {id_usuario: usuario.get('id')},
                    limit: first,
                    offset: offset,
                    attributes: requestedFields.getFields(info, {keep: ['id'], exclude: ['reservas']})
                }).catch(handleError);
        },

        disciplinas: (usuario, {first = 10, offset = 0}, {db, requestedFields}: {db: DbConnection, requestedFields:RequestedFields}, info: GraphQLResolveInfo) => {
            return db.Disciplina
                .findAll({
                    where: {id_usuario: usuario.get('id')},
                    limit: first,
                    offset: offset,
                    attributes: requestedFields.getFields(info, {keep: ['id'], exclude: ['disciplinas']})
                }).catch(handleError);
        },
        departamento: (usuario, args,{db, dataloaders: {departamentoLoader}} :{db: DbConnection, dataloaders: DataLoaders}, info: GraphQLResolveInfo) => {
            return departamentoLoader
                .load({key: usuario.get('departamento'), info})
                .catch(handleError);
        }

    },

    Query: {

        usuarios: (parent, {first = 10, offset = 0}, context: ResolverContext, info: GraphQLResolveInfo) => {
            return context.db.Usuario
                .findAll({
                    limit: first,
                    offset: offset,
                    attributes: context.requestedFields.getFields(info, {keep: ['id'], exclude: ['reservas', 'disciplinas']})
                }).catch(handleError);
        },

        usuario: (parent, {id}, context: ResolverContext, info: GraphQLResolveInfo) => {
            id = parseInt(id);
            return context.db.Usuario
                .findById(id, {
                    attributes: context.requestedFields.getFields(info, {keep: ['id'], exclude: ['reservas', 'disciplinas']})
                })
                .then((usuario: UsuarioInstance) => {
                    throwError(!usuario, `Usuario com id ${id} não encontrado!`);
                    return usuario;
                }).catch(handleError);
        }, 
        usuariosPorDepartamento: (parent, {departamentoID, first = 10, offset = 0}, {db, requestedFields}: {db: DbConnection, requestedFields: RequestedFields}, info: GraphQLResolveInfo) => {
            departamentoID = parseInt(departamentoID);
            return db.Usuario
                .findAll({
                    where: {id_departamento: departamentoID},
                    limit: first,
                    offset: offset,
                    attributes: requestedFields.getFields(info),
                    order: [['nome', 'ASC']]
                })
                .catch(handleError);
        },
        currentUsuario: compose(...authResolvers)((parent, args, context: ResolverContext, info: GraphQLResolveInfo) => {
            return context.db.Usuario
                    .findById(context.authUsuario.id, {
                        attributes: context.requestedFields.getFields(info, {keep: ['id'], exclude: ['reservas', 'disciplinas']})
                    })
                    .then((usuario: UsuarioInstance) => {
                        throwError(!usuario, `Usuario com id ${context.authUsuario.id} não encontrado!`);
                        return usuario;
                    }).catch(handleError);
        })
    },

    Mutation: {

        createUsuario: (parent, {input}, {db}: {db: DbConnection}, info: GraphQLResolveInfo) => {
            return db.sequelize.transaction((t: Transaction) => {
                return db.Usuario
                    .create(input, {transaction: t});
            }).catch(handleError);
        },

        updateUsuario: compose(...authResolvers)((parent, {input}, {db, authUsuario}: {db: DbConnection, authUsuario: AuthUsuario}, info: GraphQLResolveInfo) => {
            return db.sequelize.transaction((t: Transaction) => {
                return db.Usuario
                    .findById(authUsuario.id)
                    .then((usuario: UsuarioInstance) => {
                        throwError(!usuario, `Usuario com id ${authUsuario.id} não encontrado!`);
                        return usuario.update(input, {transaction: t});
                    });
            }).catch(handleError);
        }),

        updateUsuarioPassword: compose(...authResolvers)((parent, {input}, {db, authUsuario}: {db: DbConnection, authUsuario: AuthUsuario}, info: GraphQLResolveInfo) => {
            return db.sequelize.transaction((t: Transaction) => {
                return db.Usuario
                    .findById(authUsuario.id)
                    .then((usuario: UsuarioInstance) => {
                        throwError(!usuario, `Usuario com id ${authUsuario.id} não encontrado!`);
                        return usuario.update(input, {transaction: t})
                            .then((usuario: UsuarioInstance) => !!usuario);
                    });
            }).catch(handleError);
        }),

        deleteUsuario: compose(...authResolvers)((parent, args, {db, authUsuario}: {db: DbConnection, authUsuario: AuthUsuario}, info: GraphQLResolveInfo) => {
            return db.sequelize.transaction((t: Transaction) => {
                return db.Usuario
                    .findById(authUsuario.id)
                    .then((usuario: UsuarioInstance) => {
                        throwError(!usuario, `Usuario com id ${authUsuario.id} não encontrado!`);
                        return usuario.destroy({transaction: t})
                            .then(() => true)
                            .catch(() => false);
                    });
            }).catch(handleError);
        })

    }

};