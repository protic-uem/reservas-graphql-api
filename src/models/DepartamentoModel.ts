import * as Sequelize from "sequelize";
import { BaseModelInterface } from "../interfaces/BaseModelInterface";

export interface DepartamentoAttributes {
    id?:number;
    nome?: string;
    descricao?: string;
    status?: number;
}

export interface DepartamentoInstance extends Sequelize.Instance<DepartamentoAttributes> {}

export interface DepartamentoModel extends BaseModelInterface, Sequelize.Model<DepartamentoInstance, DepartamentoAttributes> {}

export default (sequelize: Sequelize.Sequelize, DataTypes: Sequelize.DataTypes): DepartamentoModel => {
   
    const Departamento: DepartamentoModel = sequelize.define<DepartamentoInstance, DepartamentoAttributes>('Departamento', {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        nome: {
            type: DataTypes.STRING(50),
            allowNull: false
        },
        descricao: {
            type: DataTypes.STRING,
            allowNull: false
        },
        status: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    }, {
        tableName: 'departamentos',
        timestamps: false
    });

    return Departamento;
}