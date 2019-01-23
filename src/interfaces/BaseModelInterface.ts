import { ModelsInterface } from "./ModelsInterface";

export interface BaseModelInterface {

    prototype?;//métodos de instancia em nosso models
    //Associa um model com outro
    associateBase?(models: ModelsInterface): void;//método muito utilizado no sequelize.

}