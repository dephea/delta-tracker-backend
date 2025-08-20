import { authorDto } from "./author.dto";
import { Type } from "class-transformer";


export class postDto {
    id: number;
    text: string;

    @Type(() => authorDto)
    user: authorDto;
}