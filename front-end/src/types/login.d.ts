export type LoginRequest = {
  email: string;
  password: string;
};

export type ForgotPasswordRequest = {
  email: string;
};

export type ResetPasswordRequest = {
  newPassword: string;
  email: string;
  token: string;
};

export type RefreshTokenRequest = {
  accessToken: string;
  refreshToken: string;
};

export type codeThirdParty = {
  code: string;
};
