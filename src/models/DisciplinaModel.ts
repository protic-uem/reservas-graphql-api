import * as Sequelize from "sequelize";
import { BaseModelInterface } from "../interfaces/BaseModelInterface";
import { ModelsInterface } from "../interfaces/ModelsInterface";

export interface DisciplinaAttributes {
    id?: number;
    codigo?: number;
    nome?: string;
    periodo?: string;
    turma?: number;
    status?: number;
    tipo?: string;
    id_departamento?: number;
    id_usuario?: number;
    id_curso?: number;
}

export interface DisciplinaInstance extends Sequelize.Instance<DisciplinaAttributes> {}

export interface DisciplinaModel extends BaseModelInterface, Sequelize.Model<DisciplinaInstance, DisciplinaAttributes> {}

export default (sequelize: Sequelize.Sequelize, DataTypes: Sequelize.DataTypes): DisciplinaModel => {

    const Disciplina: DisciplinaModel = sequelize.define<DisciplinaInstance, DisciplinaAttributes>('Disciplina',
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true
        },
        codigo: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        nome: {
            type: DataTypes.STRING(128),
            allowNull: true
        },
        turma: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        status: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 1
        },
        tipo: {
            type: DataTypes.ENUM('Teórica', 'Prática', 'Teórico/Prática'),
            allowNull: false
        },
        periodo: {
            type: DataTypes.ENUM('S1', 'S2', 'Anual'),
            allowNull: false
        }
    }, {
        tableName: 'disciplinas',
        timestamps: false
    });

    //Associações
    Disciplina.associateBase =  (models: ModelsInterface): void => {
        
        Disciplina.belongsTo(models.Departamento, {
            foreignKey: {
                allowNull: false,
                field: 'id_departamento',
                name: 'departamento'
            }
        });

        Disciplina.belongsTo(models.Curso, {
            foreignKey: {
                allowNull: false,
                field: 'id_curso',
                name: 'curso'
            }
        });

        Disciplina.belongsTo(models.Usuario, {
            foreignKey: {
                allowNull: false,
                field: 'id_usuario',
                name: 'usuario'
            }
        });

    };

    return Disciplina;

}