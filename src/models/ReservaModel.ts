import * as Sequelize from "sequelize";
import { BaseModelInterface } from "../interfaces/BaseModelInterface";
import { ModelsInterface } from "../interfaces/ModelsInterface";

export interface ReservaAttributes {
    id?: number;
    tipo_uso?: string;
    tipo_reserva?: string;
    data_solicitacao?: string;
    data_reserva?: string;
    dia_semana_reserva?: number;
    periodo?: number;
    status?: number;
    id_departamento?: number;
    id_usuario?: number;
    id_disciplina?: number;
    id_sala?: number;
}

export interface ReservaInstance extends Sequelize.Instance<ReservaAttributes> {}

export interface ReservaModel extends BaseModelInterface, Sequelize.Model<ReservaInstance, ReservaAttributes> {}

export default (sequelize: Sequelize.Sequelize, DataTypes: Sequelize.DataTypes): ReservaModel => {

    const Reserva: ReservaModel = sequelize.define<ReservaInstance, ReservaAttributes>('Reserva',
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true
        },
        tipo_uso: {
            type: DataTypes.ENUM('Prática', 'Teórica', 'Mestrado', 'Especialização', 'Defesa', 'Minicurso', 'Reunião'),
            allowNull: false
        },
        tipo_reserva: {
            type: DataTypes.ENUM('Eventual', 'Fixo'),
            allowNull: true,
            defaultValue: 'Eventual'
        },
        data_solicitacao: {
            type: DataTypes.STRING(128),
            allowNull: false
        },
        data_reserva: {
            type: DataTypes.STRING(128),
            allowNull: false
        },
        dia_semana_reserva: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        periodo: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        status: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 1
        }
    }, {
        tableName: 'reservas',
        timestamps: false
    });

    //Associações
    Reserva.associateBase =  (models: ModelsInterface): void => {
        
        Reserva.belongsTo(models.Departamento, {
            foreignKey: {
                allowNull: false,
                field: 'id_departamento',
                name: 'departamento'
            }
        });

        Reserva.belongsTo(models.Usuario, {
            foreignKey: {
                allowNull: false,
                field: 'id_usuario',
                name: 'usuario'
            }
        });

        Reserva.belongsTo(models.Disciplina, {
            foreignKey: {
                allowNull: true,
                field: 'id_disciplina',
                name: 'disciplina'
            }
        });

        Reserva.belongsTo(models.Sala, {
            foreignKey: {
                allowNull: false,
                field: 'id_sala',
                name: 'sala'
            }
        });

    };

    return Reserva;

}