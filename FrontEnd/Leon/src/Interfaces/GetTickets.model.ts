export default interface GetTicketsModel {
  id: number;
  title: string;
  description: string;
  status: string;
  targetDepartment: string;
  createdByAgentId: string;
  customerId: string | null;
  customerName?: string;
  ticketNoteContent?: string;
  assignedAgent: string | null;
  createdAt?: string;
  priority?: string;
}
