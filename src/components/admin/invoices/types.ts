
export interface Client {
  id: string;
  name: string;
  email: string;
}

export interface Project {
  id: string;
  title: string;
  client_id: string;
}

export interface Invoice {
  id: string;
  client: string;
  client_id?: string;
  project_id?: string;
  description?: string;
  amount: string;
  date: string;
  due_date: string;
  status: string;
  has_receipt: boolean;
  invoice_pdf?: string;
}
