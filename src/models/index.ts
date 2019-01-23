import * as fs from 'fs';
import * as path from 'path';
import * as Sequelize from 'sequelize';
import { DbConnection } from '../interfaces/DbConnectionInterface';

const basename: string = path.basename(module.filename);
const env: string = process.env.NODE_ENV || 'development';
let config = require(path.resolve(`${__dirname}./../config/config.json`))[env];
let db = null;

if(!db){
    db = {};
    //Operadores do mysql que queira utilizar
    const operatorsAliases = {
        $in: Sequelize.Op.in, //permitir o uso do IN no MYSQL
        $notIn: Sequelize.Op.notIn,
        $or: Sequelize.Op.or,
        $lte: Sequelize.Op.lte
    };

    config = Object.assign({operatorsAliases}, config);

    const sequelize: Sequelize.Sequelize = new Sequelize(
        config.database,
        config.username,
        config.password,
        config
    );

    fs
        .readdirSync(__dirname)
        .filter((file: string) => {
            const fileSlice: string = file.slice(-3);
            return (file.indexOf('.') !== 0) && (file !== basename) && ( (fileSlice === '.js') || (fileSlice === '.ts'));
        })
        .forEach((file: string) => {
            const model = sequelize.import(path.join(__dirname, file));
            db[model['name']] = model;
        });

    Object.keys(db).forEach((modelName: string) => {
        if(db[modelName].associateBase){
            db[modelName].associateBase(db);
        }
    });

    db['sequelize'] = sequelize;//Sincroniza o Sequelize com o Mysql
}

export default <DbConnection>db;