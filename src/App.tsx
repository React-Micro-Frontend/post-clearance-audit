import React from "react";
import { Card, PageHeader, StatCard, Button } from "customMain/components/shared";
import { useAppDispatch, useAppSelector } from "customMain/store/hooks";
import { increment, decrement, reset } from "customMain/store/slices/counterSlice";
import { addUser } from "customMain/store/slices/userSlice";
import { mockAudits, mockActivities } from "./data/mockData";
import { formatRelativeTime, formatDate } from "./utils";

export default function App() {
  const dispatch = useAppDispatch();
  const counter = useAppSelector((state) => state.counter);
  const users = useAppSelector((state) => state.users);

  const handleAddAuditor = () => {
    const randomId = Math.random().toString(36).substr(2, 9);
    dispatch(addUser({
      id: randomId,
      name: `Auditor ${randomId}`,
      email: `auditor${randomId}@customs.gov`,
      role: 'Auditor',
    }));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed': return 'text-green-600 bg-green-100';
      case 'In Progress': return 'text-blue-600 bg-blue-100';
      case 'Pending': return 'text-yellow-600 bg-yellow-100';
      case 'Failed': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <PageHeader 
        title="Post Clearance Audit Module" 
        description="Track and manage customs audits with shared Redux state management" 
      />
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <StatCard title="Total Audits" value={mockAudits.length.toString()} icon="📋" color="blue" />
        <StatCard title="Completed" value={mockAudits.filter(a => a.status === 'Completed').length.toString()} icon="✅" color="emerald" />
        <StatCard title="In Progress" value={mockAudits.filter(a => a.status === 'In Progress').length.toString()} icon="⏳" color="orange" />
        <StatCard title="Counter (Shared)" value={counter.value.toString()} icon="🔢" color="purple" />
      </div>

      {/* Shared Redux Counter Demo */}
      <Card className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4 bg-violet-200">🔗 Shared Redux Counter</h2>
        <p className="text-gray-600 mb-4">
          This counter is shared across all micro-frontends via Module Federation!
          <br />
          <span className="font-semibold text-purple-600">Current Count: {counter.value}</span>
        </p>
        <div className="flex gap-4">
          <Button variant="primary" onClick={() => dispatch(increment())}>
            Increment from Audit Module
          </Button>
          <Button variant="secondary" onClick={() => dispatch(decrement())}>
            Decrement
          </Button>
          <Button variant="danger" onClick={() => dispatch(reset())}>
            Reset
          </Button>
        </div>
        <p className="mt-4 text-sm text-gray-500 italic">
          💡 Changes here sync with Home and User Management modules!
        </p>
      </Card>

      {/* Shared Redux Users Demo */}
      <Card className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">🔗 Shared User Store</h2>
        <p className="text-gray-600 mb-4">
          Total Users in System: <span className="font-semibold text-emerald-600">{users.totalCount}</span>
        </p>
        <Button variant="success" onClick={handleAddAuditor}>
          Add Auditor to Shared Store
        </Button>
        <p className="mt-4 text-sm text-gray-500 italic">
          💡 Auditors added here appear in all modules instantly!
        </p>
      </Card>

      {/* Audit Records Table */}
      <Card className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Audit Records</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-100 border-b">
              <tr>
                <th className="text-left p-3 font-semibold text-gray-700">Declaration No.</th>
                <th className="text-left p-3 font-semibold text-gray-700">Importer</th>
                <th className="text-left p-3 font-semibold text-gray-700">Audit Date</th>
                <th className="text-left p-3 font-semibold text-gray-700">Status</th>
                <th className="text-left p-3 font-semibold text-gray-700">Auditor</th>
                <th className="text-left p-3 font-semibold text-gray-700">Findings</th>
              </tr>
            </thead>
            <tbody>
              {mockAudits.map((audit) => (
                <tr key={audit.id} className="border-b hover:bg-gray-50">
                  <td className="p-3 font-mono text-sm">{audit.declarationNumber}</td>
                  <td className="p-3">{audit.importer}</td>
                  <td className="p-3">{formatDate(audit.auditDate)}</td>
                  <td className="p-3">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(audit.status)}`}>
                      {audit.status}
                    </span>
                  </td>
                  <td className="p-3">{audit.auditor}</td>
                  <td className="p-3">
                    <span className={`font-semibold ${audit.findings > 5 ? 'text-red-600' : audit.findings > 0 ? 'text-orange-600' : 'text-green-600'}`}>
                      {audit.findings}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Recent Activity */}
      <Card>
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Recent Audit Activity</h3>
        <div className="space-y-3">
          {mockActivities.map((activity) => (
            <div key={activity.id} className="flex items-center justify-between py-2 border-b last:border-b-0">
              <div className="flex items-center gap-3">
                <span className="text-2xl">
                  {activity.type === 'audit' ? '📋' : activity.type === 'finding' ? '⚠️' : '✅'}
                </span>
                <span className="text-gray-700">{activity.description}</span>
              </div>
              <span className="text-sm text-gray-500">{formatRelativeTime(activity.timestamp)}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
