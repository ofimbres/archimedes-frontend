// Auth and profile types per docs/shared/contracts/auth-and-profile-contract.md

export type UserType = 'students' | 'teachers' | 'admin' | null;

export interface StudentProfile {
  id: string;
  school_id: string;
  first_name: string;
  last_name: string;
  full_name: string;
  email: string;
  username: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  cognito_user_id?: string;
}

export interface TeacherProfile {
  id: string;
  school_id: string;
  first_name: string;
  last_name: string;
  full_name: string;
  email: string;
  username: string;
  max_classes: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  cognito_user_id?: string;
}

export type Profile = StudentProfile | TeacherProfile;

export interface MeResponse {
  user_type: UserType;
  profile: Profile | null;
}

export interface LoginUser {
  username: string;
  email: string | null;
  given_name: string | null;
  family_name: string | null;
  sub: string | null;
}

export interface LoginResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  refresh_token: string | null;
  id_token: string | null;
  user: LoginUser;
}

export interface CompleteProfileStudentJoinCode {
  userType: 'students';
  joinCode: string;
}

export interface CompleteProfileStudentSchool {
  userType: 'students';
  schoolId: string;
}

export interface CompleteProfileTeacher {
  userType: 'teachers';
  schoolId: string;
}

export type CompleteProfileBody =
  | CompleteProfileStudentJoinCode
  | CompleteProfileStudentSchool
  | CompleteProfileTeacher;
