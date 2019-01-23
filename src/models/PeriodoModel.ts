import * as Sequelize from "sequelize";
import { BaseModelInterface } from "../interfaces/BaseModelInterface";
import { ModelsInterface } from "../interfaces/ModelsInterface";

export interface PeriodoAttributes {
    id?: number;
    termino?:string;
}

export interface PeriodoInstance extends Sequelize.Instance<PeriodoAttributes> {}

export interface PeriodoModel extends BaseModelInterface, Sequelize.Model<PeriodoInstance, PeriodoAttributes> {}

export default (sequelize: Sequelize.Sequelize, DataTypes: Sequelize.DataTypes): PeriodoModel => {

    const Periodo: PeriodoModel = sequelize.define<PeriodoInstance, PeriodoAttributes>('Periodo',
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true
        },
        termino: {
            type: DataTypes.STRING,
            allowNull: false
        }
    }, {
        tableName: 'periodos',
        timestamps: false
    });

    return Periodo;

}