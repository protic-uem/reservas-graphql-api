import { DataLoaderParam } from "../../interfaces/DataLoaderParamInterface";
import { RequestedFields } from "../ast/RequestedFields";
import { CursoModel, CursoInstance } from "../../models/CursoModel";

export class CursoLoader {

    static batchCursos(Curso: CursoModel, params: DataLoaderParam<number>[], requestedFields: RequestedFields): Promise<CursoInstance[]> {
        let ids: number[] = params.map(param => param.key);
        return Promise.resolve(
            Curso.findAll({
                where: { id: { $in: ids }},
                attributes: requestedFields.getFields(params[0].info, { keep: ['id']})
            })
        );
    }

}