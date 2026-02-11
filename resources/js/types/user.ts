import { Method } from "@/types/method";

export type User = {
  id: number;
  name: string;
  email: string;
  email_verified_at?: string;
  avatar: string;
};

export type UpdateProfileType = {
  _method: Method;
  name: string;
  email: string;
  avatar: File | null;
};

export type UpdatePasswordType = {
  current_password: string;
  password: string;
  password_confirmation: string;
};

export type ResetPasswordType = {
  token: string;
  email: string;
  password: string;
  password_confirmation: string;
};

export type RegisterUserType = {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
};

export type LoginUserType = {
  email: string;
  password: string;
  remember: boolean;
};
