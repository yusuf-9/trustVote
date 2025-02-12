import { CREDENTIALS_LOGIN_ERRORS } from "@/common/constants";

export type AUTHENTICATION_ERROR = (typeof CREDENTIALS_LOGIN_ERRORS)[keyof typeof CREDENTIALS_LOGIN_ERRORS];
