import * as Sequelize from "sequelize";
import { BaseModelInterface } from "../interfaces/BaseModelInterface";
import { ModelsInterface } from "../interfaces/ModelsInterface";

export interface AnoLetivoAttributes {
    id?: number;
    inicio_primeiro_semestre?: string;
    fim_primeiro_semestre?: string;
    inicio_segundo_semestre?: string;
    fim_segundo_semestre?: string;
    status?: number;
    id_departamento?: number;
}

export interface AnoLetivoInstance extends Sequelize.Instance<AnoLetivoAttributes> {}

export interface AnoLetivoModel extends BaseModelInterface, Sequelize.Model<AnoLetivoInstance, AnoLetivoAttributes> {}

export default (sequelize: Sequelize.Sequelize, DataTypes: Sequelize.DataTypes): AnoLetivoModel => {

    const AnoLetivo: AnoLetivoModel = sequelize.define<AnoLetivoInstance, AnoLetivoAttributes>('AnoLetivo',
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true
        },
        inicio_primeiro_semestre: {
            type: DataTypes.STRING(50),
            allowNull: false
        },
        fim_primeiro_semestre: {
            type: DataTypes.STRING(50),
            allowNull: true
        },
        inicio_segundo_semestre: {
            type: DataTypes.STRING(50),
            allowNull: false
        },
        fim_segundo_semestre: {
            type: DataTypes.STRING(58),
            allowNull: false
        },
        status: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    }, {
        tableName: 'anoletivo',
        timestamps: false
    });

    //Associações
    AnoLetivo.associateBase =  (models: ModelsInterface): void => {
        
        AnoLetivo.belongsTo(models.Departamento, {
            foreignKey: {
                allowNull: false,
                field: 'id_departamento',
                name: 'departamento'
            }
        });

    };

    return AnoLetivo;

}