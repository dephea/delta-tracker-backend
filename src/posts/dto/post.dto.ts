import { authorDto } from "./author.dto";
import { Expose, Type } from "class-transformer";


export class postDto {
    @Expose()
    id: number;
    @Expose()
    text: string;

    @Expose()
    @Type(() => authorDto)
    user: authorDto;
}