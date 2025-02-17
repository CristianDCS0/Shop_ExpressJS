/*Model:User*/
export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  birthdate: Date;
  gender: string;
  password: string;
  address_id: string;
  role: string;
  created_at: Date;
  updated_at: Date;
}