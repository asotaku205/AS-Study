import { Expose } from "class-transformer";

export class UserResponseDto {
@Expose() id: number;
  @Expose() name: string;
  @Expose() username: string;
  @Expose() email: string;
  @Expose() emailVerified: boolean;
  @Expose() role: string;
  @Expose() isBanned: boolean;
  @Expose() provider: string;
  @Expose() providerId: string;
  @Expose() hasPassword: boolean;
  @Expose() createdAt: Date;
  @Expose() updatedAt: Date;
}
