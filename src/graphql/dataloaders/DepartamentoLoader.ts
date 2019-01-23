import { DataLoaderParam } from "../../interfaces/DataLoaderParamInterface";
import { RequestedFields } from "../ast/RequestedFields";
import { DepartamentoModel, DepartamentoInstance } from "../../models/DepartamentoModel";

export class DepartamentoLoader {

    static batchDepartamentos(Departamento: DepartamentoModel, params: DataLoaderParam<number>[], requestedFields: RequestedFields): Promise<DepartamentoInstance[]> {
        let ids: number[] = params.map(param => param.key);
        return Promise.resolve(
            Departamento.findAll({
                where: { id: { $in: ids }},
                attributes: requestedFields.getFields(params[0].info, { keep: ['id']})
            })
        );
    }

}