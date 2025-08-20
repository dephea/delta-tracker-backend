import { Expose } from "class-transformer";

export class authorDto {

    @Expose()
    id: number;

    @Expose()
    username: string;


}