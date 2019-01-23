import { usuarioQueries } from "./resources/usuario/usuario.schema";
import { departamentoQueries } from "./resources/departamento/departamento.schema";
import { disciplinaQueries } from "./resources/disciplina/disciplina.schema";
import { salaQueries } from "./resources/sala/sala.schema";
import { cursoQueries } from "./resources/curso/curso.schema";
import { reservaQueries } from "./resources/reserva/reserva.schema";

const Query = `
    type Query {
        ${usuarioQueries}
        ${departamentoQueries}
        ${disciplinaQueries}
        ${salaQueries}
        ${cursoQueries}
        ${reservaQueries}
    }
`;

export {
    Query
}