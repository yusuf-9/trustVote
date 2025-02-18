import { CREDENTIALS_LOGIN_ERRORS } from "@/common/constants";

export type AUTHENTICATION_ERROR = (typeof CREDENTIALS_LOGIN_ERRORS)[keyof typeof CREDENTIALS_LOGIN_ERRORS];

export type UserInfo = {
  id: string;
  name: string;
  email: string;
  avatarUrl: string;
  authProvider: string;
};
