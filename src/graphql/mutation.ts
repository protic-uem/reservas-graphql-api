import { tokenMutations } from './resources/token/token.schema';
import { usuarioMutations } from './resources/usuario/usuario.schema';
import { reservaMutations } from './resources/reserva/reserva.schema';
import { salaMutations } from './resources/sala/sala.schema';
import { disciplinaMutations } from './resources/disciplina/disciplina.schema';
import { cursoMutations } from './resources/curso/curso.schema';
import { departamentoMutations } from './resources/departamento/departamento.schema';


const Mutation = `
    type Mutation {
        ${usuarioMutations}
        ${reservaMutations}
        ${salaMutations}
        ${disciplinaMutations}
        ${cursoMutations}
        ${departamentoMutations}
        ${tokenMutations}
    }
`;

export {
    Mutation
}