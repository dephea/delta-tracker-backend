import { IsString } from "class-validator";

export class UpdateUserDto{

    @IsString()
    currentPassword: string;

    @IsString()
    newPassword: string;
}
