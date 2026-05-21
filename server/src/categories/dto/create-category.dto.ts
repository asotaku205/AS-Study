import { IsEnum, IsNotEmpty, IsString } from "class-validator";
import { CategoriesStatus } from "../entities/category.entity";

export class CreateCategoryDto {
    @IsNotEmpty()
    @IsString()
    name: string;
    @IsNotEmpty()
    @IsString()
    slug: string;
    @IsNotEmpty()
    @IsEnum(CategoriesStatus)
    status: CategoriesStatus;
}
