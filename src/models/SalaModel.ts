import * as Sequelize from "sequelize";
import { BaseModelInterface } from "../interfaces/BaseModelInterface";
import { ModelsInterface } from "../interfaces/ModelsInterface";

export interface SalaAttributes {
    id?: number;
    numero?: number;
    descricao?: string;
    tipo?: string;
    status?: number;
    capacidade?: number;
    id_departamento?: number;
}

export interface SalaInstance extends Sequelize.Instance<SalaAttributes> {}

export interface SalaModel extends BaseModelInterface, Sequelize.Model<SalaInstance, SalaAttributes> {}

export default (sequelize: Sequelize.Sequelize, DataTypes: Sequelize.DataTypes): SalaModel => {

    const Sala: SalaModel = sequelize.define<SalaInstance, SalaAttributes>('Sala',
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true
        },
        numero: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        descricao: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        tipo: {
            type: DataTypes.ENUM('Projeção', 'Laboratório', 'Simples'),
            allowNull: false
        },
        status: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 1
        },
        capacidade: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    }, {
        tableName: 'salas',
        timestamps: false
    });

    //Associações
    Sala.associateBase =  (models: ModelsInterface): void => {
        
        Sala.belongsTo(models.Departamento, {
            foreignKey: {
                allowNull: false,
                field: 'id_departamento',
                name: 'departamento'
            }
        });
    };

    return Sala;

}