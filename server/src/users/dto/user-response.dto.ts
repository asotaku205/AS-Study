import { Expose } from "class-transformer";

export class UserResponseDto {
@Expose() id: number;
  @Expose() name: string;
  @Expose() email: string;
  @Expose() role: string;
  @Expose() isBanned: boolean;
  @Expose() createdAt: Date;
  @Expose() updatedAt: Date;
}
