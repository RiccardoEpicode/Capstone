export default interface UserDetails {
  id: string;
  fullName: string;
  email: string;
  agentType?: string | null;
  phoneNumber: string;
  role: string;
  agentDepartmen: string;
}
