import { Method } from "@/types/method";

export type User = {
  id: string;
  name: string;
  email: string;
  email_verified_at?: string;
  avatar: string;
  active_status: boolean;
  is_online: boolean;
  last_seen: string;
  created_at: string;
  updated_at: string;
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
