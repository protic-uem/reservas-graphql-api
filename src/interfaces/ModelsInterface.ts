import { DepartamentoModel } from "../models/DepartamentoModel";
import { SalaModel } from "../models/SalaModel";
import { CursoModel } from "../models/CursoModel";
import { DisciplinaModel } from "../models/DisciplinaModel";
import { UsuarioModel } from "../models/UsuarioModel";
import { ReservaModel } from "../models/ReservaModel";
import { AnoLetivoModel } from "../models/AnoLetivoModel";

export interface ModelsInterface {


    //Modelos API
    Departamento: DepartamentoModel;
    Sala: SalaModel;
    Curso: CursoModel;
    Disciplina: DisciplinaModel;
    Reserva: ReservaModel;
    Usuario: UsuarioModel;
    AnoLetivo: AnoLetivoModel;


}