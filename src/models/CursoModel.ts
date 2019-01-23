import * as Sequelize from "sequelize";
import { BaseModelInterface } from "../interfaces/BaseModelInterface";
import { ModelsInterface } from "../interfaces/ModelsInterface";

export interface CursoAttributes {
    id?: number;
    nome?: number;
    tipo?: string;
    status?: number;
    departamento?: number;
}

export interface CursoInstance extends Sequelize.Instance<CursoAttributes> {}

export interface CursoModel extends BaseModelInterface, Sequelize.Model<CursoInstance, CursoAttributes> {}

export default (sequelize: Sequelize.Sequelize, DataTypes: Sequelize.DataTypes): CursoModel => {

    const Curso: CursoModel = sequelize.define<CursoInstance, CursoAttributes>('Curso',
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true
        },
        nome: {
            type: DataTypes.STRING(50),
            allowNull: true
        },
        tipo: {
            type: DataTypes.ENUM('Graduação', 'Mestrado', 'Outros Cursos'),
            allowNull: false
        },
        status: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    }, {
        tableName: 'cursos',
        timestamps: false
    });

    //Associações
    Curso.associateBase =  (models: ModelsInterface): void => {
        
        //Um curso pertence a um departamento
        //Um departamento pode ter vários cursos
        Curso.belongsTo(models.Departamento, {
            foreignKey: {
                allowNull: false,
                field: 'id_departamento',
                name: 'departamento'
            }
        });
    };

    return Curso;

}