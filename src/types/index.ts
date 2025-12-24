export interface AuditRecord {
  id: string;
  declarationNumber: string;
  importer: string;
  auditDate: string;
  status: 'Pending' | 'In Progress' | 'Completed' | 'Failed';
  auditor: string;
  findings: number;
}

export interface AuditActivity {
  id: string;
  description: string;
  timestamp: Date;
  type: 'audit' | 'finding' | 'resolution';
}
