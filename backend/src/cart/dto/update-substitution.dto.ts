import { IsString, IsIn } from 'class-validator';

export type SubstitutionPreferenceType = 'ALLOW_SUBSTITUTION' | 'CONTACT_ME' | 'NO_SUBSTITUTION';

export class UpdateSubstitutionDto {
  @IsString()
  @IsIn(['ALLOW_SUBSTITUTION', 'CONTACT_ME', 'NO_SUBSTITUTION'])
  preference: SubstitutionPreferenceType;
}
