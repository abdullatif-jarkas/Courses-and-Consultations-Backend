export interface IUser extends Document {
  _id: string;
  fullName: string;
  email: string;
  password: string;
  role: "user" | "admin" | "employee";
}