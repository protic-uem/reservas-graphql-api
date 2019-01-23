import * as jwt from 'jsonwebtoken';
import { DbConnection } from "../../../interfaces/DbConnectionInterface";
import { UsuarioInstance } from "../../../models/UsuarioModel";
import { JWT_SECRET } from '../../../utils/utils';

export const tokenResolvers = {

    Mutation: {

        createToken: (parent, {email, senha}, {db}: {db: DbConnection}) => {
            return db.Usuario.findOne({
                where: {email: email},
                attributes: ['id', 'senha']
            }).then((user: UsuarioInstance) => {
                let errorMessage: string = 'Não autorizado, email ou senha incorreto!'
                if(!user || !user.isPassword(user.get('senha'), senha)) 
                    throw new Error(errorMessage);

                const payload = {sub: user.get('id')};

                return {
                    token: jwt.sign(payload, JWT_SECRET)
                }
            });
        },

        deleteToken: (parent, args, {db}: {db: DbConnection}) => {
                return {
                    token: null
                }
        }
    }
};