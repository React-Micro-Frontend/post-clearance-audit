export interface AuditRecord {
  id: string;
  declarationNumber: string;
  importer: string;
  auditDate: string;
  status: 'Pending' | 'In Progress' | 'Completed' | 'Failed';
  auditor: string;
  findings: number;
}

export const mockAudits: AuditRecord[] = [
  {
    id: '1',
    declarationNumber: 'DCL-2024-001234',
    importer: 'ABC Trading Co.',
    auditDate: '2024-12-20',
    status: 'Completed',
    auditor: 'John Smith',
    findings: 2
  },
  {
    id: '2',
    declarationNumber: 'DCL-2024-001235',
    importer: 'XYZ Imports Ltd.',
    auditDate: '2024-12-21',
    status: 'In Progress',
    auditor: 'Jane Doe',
    findings: 0
  },
  {
    id: '3',
    declarationNumber: 'DCL-2024-001236',
    importer: 'Global Trade Inc.',
    auditDate: '2024-12-22',
    status: 'Pending',
    auditor: 'Mike Johnson',
    findings: 0
  },
  {
    id: '4',
    declarationNumber: 'DCL-2024-001237',
    importer: 'International Goods Corp.',
    auditDate: '2024-12-23',
    status: 'Completed',
    auditor: 'Sarah Williams',
    findings: 5
  },
  {
    id: '5',
    declarationNumber: 'DCL-2024-001238',
    importer: 'FastShip Logistics',
    auditDate: '2024-12-24',
    status: 'Failed',
    auditor: 'Tom Brown',
    findings: 12
  }
];

export interface AuditActivity {
  id: string;
  description: string;
  timestamp: Date;
  type: 'audit' | 'finding' | 'resolution';
}

export const mockActivities: AuditActivity[] = [
  {
    id: '1',
    description: 'Audit completed for DCL-2024-001234',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    type: 'audit'
  },
  {
    id: '2',
    description: 'New finding reported in DCL-2024-001237',
    timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000),
    type: 'finding'
  },
  {
    id: '3',
    description: 'Finding resolved for DCL-2024-001230',
    timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    type: 'resolution'
  },
  {
    id: '4',
    description: 'Audit started for DCL-2024-001235',
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    type: 'audit'
  }
];
