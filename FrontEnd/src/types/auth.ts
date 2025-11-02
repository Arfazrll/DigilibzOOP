export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'student' | 'lecturer';
  phone?: string;
  nim?: string;
  nip?: string;
  year?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  id: string;
  email: string;
  name: string;
  role: string;
  token: string;
}

export interface RegisterStudentRequest {
  email: string;
  password: string;
  name: string;
  phone: string;
  nim: string;
  year: string;
}

export interface RegisterLecturerRequest {
  email: string;
  password: string;
  name: string;
  phone: string;
  nip: string;
}

export interface RegisterAdminRequest {
  email: string;
  password: string;
  name: string;
  phone: string;
}