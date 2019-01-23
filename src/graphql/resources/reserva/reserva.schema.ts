const reservaTypes = `
    type Reserva {
        id: ID!
        tipo_uso: String!
        tipo_reserva: String!
        data_solicitacao: String!
        data_reserva: String!
        dia_semana_reserva: Int
        periodo: Int!
        status: Int!
        departamento: Departamento!
        disciplina: Disciplina
        usuario: Usuario!
        sala: Sala!
    }

    input ReservaInput {
        tipo_uso: String!
        tipo_reserva: String!
        data_solicitacao: String!
        data_reserva: String!
        periodo: Int!
        status: Int!
        departamento: Int!
        usuario: Int!
        disciplina: Int
        sala: Int!
    }
`;

const reservaQueries = `
    reservas(first: Int, offset: Int): [ Reserva! ]!
    reserva(id: ID!): Reserva
    minhasReservas(usuarioID: ID!): [ Reserva! ]!
    reservasTelaHome(departamentoID: ID!, data_reserva: String!, periodo: Int!): [ Reserva! ]!
    reservasTelaSearch(departamentoID: ID!, salaID: ID!, data_reserva: String!): [ Reserva! ]!
    validarReservaMesmoHorario(usuarioID: ID!, data_reserva: String!, periodo: Int!): Boolean
    reservasPorDepartamentoDisciplina(departamentoID: ID!, disciplinaID: ID!): [ Reserva! ]!
`;

const reservaMutations = `
    createReserva(input: ReservaInput!): Reserva
    solicitarReserva(input: ReservaInput): Reserva
    updateReserva(id: ID!, input: ReservaInput): Reserva
    validarReserva(input: ReservaInput): Boolean
    deleteReserva(id: ID!): Boolean
    cancelarReserva(id: ID!): Boolean
`;

export {
    reservaTypes,
    reservaQueries,
    reservaMutations
}

