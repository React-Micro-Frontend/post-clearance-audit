# Post-Clearance Audit - Remote Application

## 🏛️ Overview

The **Post-Clearance Audit** micro frontend manages customs post-clearance audit processes, including audit planning, execution, findings management, and compliance tracking.

### Role in Architecture
- **Remote Application**: Consumed by shell application
- **Domain**: Post-clearance audit operations
- **Shared Modules**: Exposes audit components

---

## 🏗️ Architecture

### Folder Structure
```
src/
├── components/
│   ├── AuditList.tsx           # Audit listing with filters
│   ├── AuditDetail.tsx         # Audit details and timeline
│   ├── CreateAudit.tsx         # Create audit form
│   ├── FindingsList.tsx        # Audit findings table
│   ├── FindingForm.tsx         # Add/edit finding form
│   ├── AuditCard.tsx           # Audit preview card
│   ├── AuditStatus.tsx         # Status badge component
│   ├── ComplianceScore.tsx     # Compliance score display
│   └── index.ts                # Component exports
├── config/
│   └── module.config.ts        # Module configuration
│       - Audit types
│       - Risk levels
│       - Compliance thresholds
├── data/
│   ├── mockAudits.ts           # Mock audit data
│   ├── auditTypes.ts           # Audit type definitions
│   ├── riskLevels.ts           # Risk level configurations
│   └── auditColumns.ts         # Table column definitions
├── services/
│   ├── auditService.ts         # Audit operations
│   │   - getAudits()
│   │   - getAuditById()
│   │   - createAudit()
│   │   - updateAudit()
│   │   - closeAudit()
│   ├── findingService.ts       # Finding operations
│   │   - getFindings()
│   │   - createFinding()
│   │   - updateFinding()
│   │   - resolveFinding()
│   ├── complianceService.ts    # Compliance scoring
│   │   - calculateScore()
│   │   - getComplianceHistory()
│   └── index.ts                # Service exports
├── types/
│   ├── Audit.ts                # Audit type definitions
│   │   interface Audit {
│   │     id: string;
│   │     auditNumber: string;
│   │     type: AuditType;
│   │     status: AuditStatus;
│   │     targetCompany: Company;
│   │     startDate: Date;
│   │     endDate: Date;
│   │     findings: Finding[];
│   │     complianceScore: number;
│   │   }
│   ├── Finding.ts              # Finding type definitions
│   ├── Compliance.ts           # Compliance type definitions
│   └── index.ts                # Type exports
├── utils/
│   ├── auditValidation.ts      # Audit validation rules
│   ├── complianceCalculation.ts # Score calculations
│   ├── riskAssessment.ts       # Risk assessment utilities
│   └── index.ts                # Utility exports
├── App.tsx                     # Main application component
├── Bootstrap.tsx               # Module initialization
├── index.tsx                   # Entry point
└── remotes.d.ts                # Remote type definitions
```

---

## 🔌 Module Federation

### Exposed Modules
```javascript
exposes: {
  "./PostClearanceAudit": "./src/App.tsx",
  "./AuditList": "./src/components/AuditList.tsx",
  "./AuditCard": "./src/components/AuditCard.tsx"
}
```

### Consumed Modules (from Shell)
```javascript
// Shared components
import { PageHeader, Card, Button, StatCard } from 'customMain/components/shared';

// Shared store
import { useAppSelector } from 'customMain/store/hooks';

// Services
import { apiService } from 'customMain/services';

// Styles
import 'customMain/TailwindStyles';
```

---

## 💡 Implementation Examples

### Audit List Component
```typescript
// src/components/AuditList.tsx
import React, { useEffect, useState } from 'react';
import { PageHeader, Card, StatCard, Button } from 'customMain/components/shared';
import { auditService, complianceService } from '../services';
import type { Audit, AuditStatus } from '../types';
import AuditCard from './AuditCard';

const AuditList: React.FC = () => {
  const [audits, setAudits] = useState<Audit[]>([]);
  const [filter, setFilter] = useState<AuditStatus | 'ALL'>('ALL');
  const [avgCompliance, setAvgCompliance] = useState(0);

  useEffect(() => {
    loadAudits();
    loadComplianceMetrics();
  }, [filter]);

  const loadAudits = async () => {
    const data = await auditService.getAudits(filter);
    setAudits(data);
  };

  const loadComplianceMetrics = async () => {
    const metrics = await complianceService.getComplianceHistory();
    const avg = metrics.reduce((sum, m) => sum + m.score, 0) / metrics.length;
    setAvgCompliance(avg);
  };

  const activeCount = audits.filter(a => a.status === 'IN_PROGRESS').length;
  const completedCount = audits.filter(a => a.status === 'COMPLETED').length;
  const highRiskCount = audits.filter(a => 
    a.findings.some(f => f.severity === 'HIGH')
  ).length;

  return (
    <div className="p-6">
      <PageHeader 
        title="Post-Clearance Audit" 
        subtitle="Monitor and manage post-clearance audits"
      />

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
        <StatCard
          title="Active Audits"
          value={activeCount}
          description="Currently in progress"
          bgColor="bg-blue-50"
          textColor="text-blue-600"
        />
        <StatCard
          title="Completed"
          value={completedCount}
          description="This quarter"
          bgColor="bg-green-50"
          textColor="text-green-600"
        />
        <StatCard
          title="High Risk"
          value={highRiskCount}
          description="Requires attention"
          bgColor="bg-red-50"
          textColor="text-red-600"
        />
        <StatCard
          title="Avg Compliance"
          value={`${avgCompliance.toFixed(1)}%`}
          description="Overall score"
          bgColor="bg-purple-50"
          textColor="text-purple-600"
        />
      </div>

      <Card className="mt-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">All Audits</h2>
          <Button variant="primary" onClick={() => {}}>
            Create Audit
          </Button>
        </div>

        <div className="space-y-4">
          {audits.map(audit => (
            <AuditCard key={audit.id} audit={audit} />
          ))}
        </div>
      </Card>
    </div>
  );
};

export default AuditList;
```

### Audit Service Implementation
```typescript
// src/services/auditService.ts
import { apiService } from 'customMain/services';
import type { Audit, CreateAuditDTO, AuditStatus } from '../types';

export const auditService = {
  async getAudits(status?: AuditStatus | 'ALL'): Promise<Audit[]> {
    const params = status !== 'ALL' ? { status } : {};
    const response = await apiService.get('/audits', { params });
    return response.data;
  },

  async getAuditById(id: string): Promise<Audit> {
    const response = await apiService.get(`/audits/${id}`);
    return response.data;
  },

  async getAuditByNumber(auditNumber: string): Promise<Audit> {
    const response = await apiService.get(`/audits/number/${auditNumber}`);
    return response.data;
  },

  async createAudit(audit: CreateAuditDTO): Promise<Audit> {
    const response = await apiService.post('/audits', audit);
    return response.data;
  },

  async updateAudit(id: string, updates: Partial<Audit>): Promise<Audit> {
    const response = await apiService.put(`/audits/${id}`, updates);
    return response.data;
  },

  async closeAudit(id: string, summary: string): Promise<Audit> {
    const response = await apiService.post(`/audits/${id}/close`, { summary });
    return response.data;
  }
};
```

### Finding Service Implementation
```typescript
// src/services/findingService.ts
import { apiService } from 'customMain/services';
import type { Finding, CreateFindingDTO } from '../types';

export const findingService = {
  async getFindings(auditId: string): Promise<Finding[]> {
    const response = await apiService.get(`/audits/${auditId}/findings`);
    return response.data;
  },

  async createFinding(finding: CreateFindingDTO): Promise<Finding> {
    const response = await apiService.post('/findings', finding);
    return response.data;
  },

  async updateFinding(id: string, updates: Partial<Finding>): Promise<Finding> {
    const response = await apiService.put(`/findings/${id}`, updates);
    return response.data;
  },

  async resolveFinding(id: string, resolution: string): Promise<Finding> {
    const response = await apiService.post(`/findings/${id}/resolve`, { 
      resolution 
    });
    return response.data;
  }
};
```

### Compliance Service Implementation
```typescript
// src/services/complianceService.ts
import { apiService } from 'customMain/services';
import type { ComplianceMetrics, ComplianceHistory } from '../types';

export const complianceService = {
  async calculateScore(auditId: string): Promise<number> {
    const response = await apiService.get(`/audits/${auditId}/compliance-score`);
    return response.data.score;
  },

  async getComplianceHistory(
    startDate?: Date, 
    endDate?: Date
  ): Promise<ComplianceHistory[]> {
    const params = { startDate, endDate };
    const response = await apiService.get('/compliance/history', { params });
    return response.data;
  },

  async getComplianceMetrics(companyId: string): Promise<ComplianceMetrics> {
    const response = await apiService.get(`/compliance/metrics/${companyId}`);
    return response.data;
  }
};
```

### Type Definitions
```typescript
// src/types/Audit.ts
export enum AuditType {
  ROUTINE = 'ROUTINE',
  TARGETED = 'TARGETED',
  RISK_BASED = 'RISK_BASED',
  COMPLAINT_BASED = 'COMPLAINT_BASED'
}

export enum AuditStatus {
  PLANNED = 'PLANNED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED'
}

export interface Company {
  id: string;
  name: string;
  taxId: string;
  address: string;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
}

export interface Audit {
  id: string;
  auditNumber: string;
  type: AuditType;
  status: AuditStatus;
  targetCompany: Company;
  auditor: string;
  startDate: Date;
  endDate: Date;
  findings: Finding[];
  complianceScore: number;
  summary?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Finding {
  id: string;
  auditId: string;
  title: string;
  description: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  category: string;
  status: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED';
  identifiedDate: Date;
  resolvedDate?: Date;
  resolution?: string;
}

export interface CreateAuditDTO {
  type: AuditType;
  targetCompanyId: string;
  auditorId: string;
  startDate: Date;
  endDate: Date;
}

export interface CreateFindingDTO {
  auditId: string;
  title: string;
  description: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  category: string;
}

export interface ComplianceMetrics {
  companyId: string;
  overallScore: number;
  totalAudits: number;
  totalFindings: number;
  resolvedFindings: number;
  averageResolutionTime: number; // days
}

export interface ComplianceHistory {
  date: Date;
  score: number;
  auditCount: number;
}
```

### Compliance Score Component
```typescript
// src/components/ComplianceScore.tsx
import React from 'react';

interface Props {
  score: number; // 0-100
  size?: 'sm' | 'md' | 'lg';
}

const ComplianceScore: React.FC<Props> = ({ score, size = 'md' }) => {
  const getColor = (score: number) => {
    if (score >= 80) return 'text-green-600 bg-green-50';
    if (score >= 60) return 'text-yellow-600 bg-yellow-50';
    if (score >= 40) return 'text-orange-600 bg-orange-50';
    return 'text-red-600 bg-red-50';
  };

  const getSizeClass = () => {
    switch (size) {
      case 'sm': return 'text-sm p-2';
      case 'lg': return 'text-2xl p-4';
      default: return 'text-lg p-3';
    }
  };

  const getLabel = (score: number) => {
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Good';
    if (score >= 40) return 'Fair';
    return 'Poor';
  };

  return (
    <div className={`inline-flex items-center rounded-lg ${getColor(score)} ${getSizeClass()}`}>
      <div className="text-center">
        <div className="font-bold">{score.toFixed(1)}%</div>
        <div className="text-xs opacity-75">{getLabel(score)}</div>
      </div>
    </div>
  );
};

export default ComplianceScore;
```

### Risk Assessment Utility
```typescript
// src/utils/riskAssessment.ts
import type { Finding } from '../types';

export const calculateRiskScore = (findings: Finding[]): number => {
  if (findings.length === 0) return 0;

  const severityWeights = {
    CRITICAL: 10,
    HIGH: 7,
    MEDIUM: 4,
    LOW: 1
  };

  const totalWeight = findings.reduce((sum, finding) => {
    return sum + severityWeights[finding.severity];
  }, 0);

  const maxPossibleWeight = findings.length * 10;
  return (totalWeight / maxPossibleWeight) * 100;
};

export const getRiskLevel = (score: number): 'LOW' | 'MEDIUM' | 'HIGH' => {
  if (score >= 70) return 'HIGH';
  if (score >= 40) return 'MEDIUM';
  return 'LOW';
};

export const prioritizeFindings = (findings: Finding[]): Finding[] => {
  const severityOrder = { CRITICAL: 0, HIGH: 1, MEDIUM: 2, LOW: 3 };
  
  return [...findings].sort((a, b) => {
    // First by severity
    if (severityOrder[a.severity] !== severityOrder[b.severity]) {
      return severityOrder[a.severity] - severityOrder[b.severity];
    }
    // Then by date (newest first)
    return new Date(b.identifiedDate).getTime() - new Date(a.identifiedDate).getTime();
  });
};
```

### Compliance Calculation Utility
```typescript
// src/utils/complianceCalculation.ts
import type { Audit, Finding } from '../types';

export const calculateComplianceScore = (audit: Audit): number => {
  if (audit.findings.length === 0) return 100;

  const severityDeductions = {
    CRITICAL: 15,
    HIGH: 10,
    MEDIUM: 5,
    LOW: 2
  };

  const totalDeductions = audit.findings.reduce((sum, finding) => {
    return sum + severityDeductions[finding.severity];
  }, 0);

  const score = Math.max(0, 100 - totalDeductions);
  return score;
};

export const getComplianceGrade = (score: number): string => {
  if (score >= 90) return 'A';
  if (score >= 80) return 'B';
  if (score >= 70) return 'C';
  if (score >= 60) return 'D';
  return 'F';
};

export const isCompliant = (score: number, threshold: number = 70): boolean => {
  return score >= threshold;
};
```

---

## 🚀 Getting Started

### Development
```bash
npm install
npm start
# Runs on http://localhost:5004
```

### Build
```bash
npm run build
```

---

## 🔗 Integration with Shell

### Routing
```typescript
// Shell loads at /audit
<Route path="/audit" element={<PostClearanceAudit />} />
```

### State Sharing
```typescript
// Access current user
const currentUser = useAppSelector(state => state.user);
```

---

## 📦 Dependencies

### Remote Dependencies
- `customMain/components/shared` - UI components
- `customMain/store` - Redux store
- `customMain/services` - API service
- `customMain/TailwindStyles` - Styles

---

## 🔗 Related Documentation

- [ARCHITECTURE.md](../ARCHITECTURE.md) - Overall architecture
- [custom-main README](../custom-main/README.md) - Shell documentation

