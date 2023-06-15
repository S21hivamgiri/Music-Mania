export interface User {
  lastName: string;
  firstName: string;
  userId?: string;
  password: string;
  liked: Array<string>;
  contact: string;
  email: string;
  country: string;
  initials?: string;
  roles?: any;
}