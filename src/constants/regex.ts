export const USER_REGEX = {
  USER_ID: /^[a-zA-Z0-9.]{5,30}$/,
  USER_NAME: /^[a-zA-Z0-9가-힣\s.-]{1,30}$/,
  EMAIL: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
  PASSWORD: /^(?=.*[a-zA-Z])(?=.*[0-9])[a-zA-Z0-9!@.]{5,30}$/,
};
