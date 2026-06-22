import { IsString } from 'class-validator';

export class CompleteOnboardingDto {
    @IsString()
    onboardingToken!: string;

    @IsString()
    name!: string;
}
