import * as Sequelize from "sequelize";
import { genSaltSync, hashSync, compareSync } from 'bcryptjs';
import { BaseModelInterface } from "../interfaces/BaseModelInterface";
import { ModelsInterface } from "../interfaces/ModelsInterface";

export interface UsuarioAttributes {
    id?: number;
    nome?: string;
    email?: string;
    telefone?: string;
    senha?: string;
    codigo_confirmacao?: string;
    privilegio?: string;
    ultimo_acesso?: string;
    push?: string;
    codigo_dispositivo: string;
    modelo_dispositivo: string;
    problema_locomocao: number;
    sistema?: string;
    status?: number;
    id_departamento?: number;
}

export interface UsuarioInstance extends Sequelize.Instance<UsuarioAttributes>, UsuarioAttributes{
    isPassword(encodedSenha: string, senha: string): boolean;
}

export interface UsuarioModel extends BaseModelInterface, Sequelize.Model<UsuarioInstance, UsuarioAttributes> {}

export default (sequelize: Sequelize.Sequelize, DataTypes: Sequelize.DataTypes): UsuarioModel => {

    const Usuario: UsuarioModel = sequelize.define<UsuarioInstance, UsuarioAttributes>('Usuario',
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true
        },
        nome: {
            type: DataTypes.STRING(128),
            allowNull: false
        },
        email: {
            type: DataTypes.STRING(128),
            allowNull: true,
            unique: true
        },
        telefone: {
            type: DataTypes.STRING(128),
            allowNull: true
        },
        senha: {
            type: DataTypes.STRING(128),
            allowNull: true,
            validate: {
                notEmpty: true
            }
        },
        privilegio: {
            type: DataTypes.ENUM('Docente', 'Secretário', 'Administrador', 'Supremo'),
            allowNull: false
        },
        ultimo_acesso: {
            type: DataTypes.STRING,
            allowNull: true
        },
        codigo_dispositivo: {
            type: DataTypes.STRING,
            allowNull: true
        },
        codigo_confirmacao:{
            type: DataTypes.STRING,
            allowNull: true
        },
        push: {
            type: DataTypes.STRING,
            allowNull: true
        },
        sistema: {
            type: DataTypes.STRING,
            allowNull: true
        },
        modelo_dispositivo: {
            type: DataTypes.STRING,
            allowNull: true
        },
        problema_locomocao: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: 0
        },
        status: {
            type: DataTypes.INTEGER,
            allowNull: false ,
            defaultValue: 0
        }
    }, {
        tableName: 'usuarios',
        timestamps: false,
        hooks: {
            beforeCreate: (user: UsuarioInstance, options: Sequelize.CreateOptions): void => {
                const salt = genSaltSync();
                user.senha = hashSync(user.senha, salt);
                
            },
            beforeUpdate: (user: UsuarioInstance, options: Sequelize.CreateOptions): void => {
                if(user.changed('senha')) {
                    const salt = genSaltSync();
                    user.senha = hashSync(user.senha, salt);
                }
            }
        }
    });

    Usuario.associateBase = (models: ModelsInterface): void => {

        Usuario.belongsTo(models.Departamento, {
            foreignKey: {
                allowNull: false,
                field: 'id_departamento',
                name: 'departamento',
                
            }
        });

    };

    Usuario.prototype.isPassword = (encodedSenha: string, senha: string): boolean => {
        return compareSync(senha, encodedSenha);
    }

    return Usuario;

}