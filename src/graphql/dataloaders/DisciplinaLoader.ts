import { DataLoaderParam } from "../../interfaces/DataLoaderParamInterface";
import { RequestedFields } from "../ast/RequestedFields";
import { DisciplinaModel, DisciplinaInstance } from "../../models/DisciplinaModel";

export class DisciplinaLoader {

    static batchDisciplinas(Disciplina: DisciplinaModel, params: DataLoaderParam<number>[], requestedFields: RequestedFields): Promise<DisciplinaInstance[]> {
        let ids: number[] = params.map(param => param.key);
        return Promise.resolve(
            Disciplina.findAll({
                where: { id: { $in: ids }},
                attributes: requestedFields.getFields(params[0].info, { keep: ['id']})
            })
        );
    }

}