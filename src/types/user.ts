export interface IUser extends Document {
  _id: string;
  fullName: string;
  email: string;
  password: string;
  phoneNumber: string;
  role: "user" | "admin" | "employee";
  resetCode?: string;
  resetCodeExpires?: Date;
}
