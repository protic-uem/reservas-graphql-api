import * as jwt from 'jsonwebtoken';

import db from './../models';
import { RequestHandler, Request, Response, NextFunction } from "express";
import { JWT_SECRET } from '../utils/utils';
import { UsuarioInstance } from '../models/UsuarioModel';


export const extractJwtMiddleware = (): RequestHandler => {

    return (req: Request, res: Response, next: NextFunction): void => {
        //Authorization = Bearer asdasldjk...
        let authorization: string = req.get('authorization');
        let token: string = authorization?authorization.split(' ')[1] : undefined;

        req['context'] = {};
        req['context']['authorization'] = authorization;

        if(!token) { return next(); }

        //Faz a validação do token
        jwt.verify(token, JWT_SECRET, (err, decoded: any) => {

            if(err) { return next(); }

            db.Usuario.findById(decoded.sub, {
                attributes: ['id', 'email']
            }).then((user: UsuarioInstance) => {
                if(user) {
                    req['context']['authUsuario'] = {
                        id: user.get('id'),
                        email: user.get('email')
                    };
                }
                return next();
            });

        });

    };

};