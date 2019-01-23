const usuarioTypes = `



    type Usuario {
        id: ID!
        nome: String!
        email: String!
        senha: String!
        telefone: String!
        privilegio: String!
        ultimo_acesso: String
        status: Int!
        push: String
        codigo_dispositivo: String
        modelo_dispositivo: String
        sistema: String
        problema_locomocao: Int
        departamento: Departamento!
        reservas(first: Int, offeset: Int): [ Reserva! ]!
        disciplinas(first: Int, offset: Int): [ Disciplina! ]!
    }

    #Para crirar um usuário, é necessário inserir nome, email, senha, telefone, privilegio,
    input UsuarioCreateInput {
        nome: String!
        email: String!
        senha: String!
        telefone: String!
        privilegio: String!
        status: Int!
        id_departamento: Int!
    }

    #Quando o usuário alterar a sua conta
    input UsuarioUpdateInput {
        nome: String!
        email: String!
        telefone: String!
        privilegio: String!
        status: Int!
    }

    #Quando o usuário alterar o senha
    input UsuarioUpdatePasswordInput {
        senha: String!
    }


`;

const usuarioQueries = `
    #fazendo paginação
    usuarios(first: Int, offset: Int): [ Usuario! ]!
    usuariosPorDepartamento(departamentoID: ID!, first: Int, offset: Int): [ Usuario! ]!
    usuario(id: ID!): Usuario
    currentUsuario: Usuario
`;

const usuarioMutations = `
    createUsuario(input: UsuarioCreateInput!): Usuario
    updateUsuario(input: UsuarioUpdateInput): Usuario
    updateUsuarioPassword(input: UsuarioUpdatePasswordInput): Boolean
    deleteUsuario: Boolean
`;

export {
    usuarioTypes,
    usuarioQueries,
    usuarioMutations
}