"use client";

import { useState } from "react";
import { GenericTable } from "@/components/GenericTable/generic-table";
import PayrollDetails from "@/components/hr&payroll/payroll-details";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Wallet, Clock, PauseCircle, Plus } from "lucide-react";
import { type LucideIcon } from "lucide-react";
import type { ColumnDef } from "@tanstack/react-table";
import type { Payroll } from "@/lib/types";

const MOCK_PAYROLL: Payroll[] = [
  {
    id: 1, employeeId: 101, employeeName: "Sita Rai", employeeType: "Teacher",
    month: "2024-03", basicSalary: 25000, allowances: 3000, deductions: 1500,
    netSalary: 26500, paymentDate: "2024-03-31", status: "Paid",
  },
  {
    id: 2, employeeId: 102, employeeName: "Ram Thapa", employeeType: "Staff",
    month: "2024-03", basicSalary: 18000, allowances: 2000, deductions: 1000,
    netSalary: 19000, status: "Pending",
  },
  {
    id: 3, employeeId: 103, employeeName: "Priya Shrestha", employeeType: "Teacher",
    month: "2024-03", basicSalary: 28000, allowances: 4000, deductions: 2000,
    netSalary: 30000, status: "On Hold",
  },
  {
    id: 4, employeeId: 104, employeeName: "Bikash Karki", employeeType: "Staff",
    month: "2024-03", basicSalary: 15000, allowances: 1500, deductions: 800,
    netSalary: 15700, status: "Pending",
  },
];

const columns: ColumnDef<Payroll>[] = [
  {
    accessorKey: "employeeName",
    header: "Employee",
    cell: (info) => (
      <div className="flex flex-col">
        <span className="font-bold text-foreground">{String(info.getValue())}</span>
        <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-tight">
          {info.row.original.employeeType}
        </span>
      </div>
    ),
  },
  {
    accessorKey: "month",
    header: "Month",
    cell: (info) => (
      <span className="text-sm font-bold text-muted-foreground">{String(info.getValue())}</span>
    ),
  },
  {
    accessorKey: "basicSalary",
    header: "Basic",
    cell: (info) => <span className="font-medium text-muted-foreground">Rs. {Number(info.getValue()).toLocaleString()}</span>,
  },
  {
    accessorKey: "allowances",
    header: "Allowances",
    cell: (info) => <span className="font-medium text-emerald-600">+Rs. {Number(info.getValue()).toLocaleString()}</span>,
  },
  {
    accessorKey: "deductions",
    header: "Deductions",
    cell: (info) => <span className="font-medium text-rose-500">-Rs. {Number(info.getValue()).toLocaleString()}</span>,
  },
  {
    accessorKey: "netSalary",
    header: "Net Salary",
    cell: (info) => <span className="font-black text-foreground">Rs. {Number(info.getValue()).toLocaleString()}</span>,
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: (info) => {
      const status = String(info.getValue());
      const styles: Record<string, string> = {
        Paid:      "bg-emerald-500/10 text-emerald-600",
        Pending:   "bg-[oklch(0.7686_0.1647_70.0804)]/10 text-[oklch(0.7686_0.1647_70.0804)]",
        "On Hold": "bg-[oklch(0.6056_0.2189_292.7172)]/10 text-[oklch(0.6056_0.2189_292.7172)]",
      };
      return (
        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${styles[status]}`}>
          {status}
        </span>
      );
    },
  },
];

export default function PayrollPage() {
  const [records, setRecords] = useState<Payroll[]>(MOCK_PAYROLL);
  const [selected, setSelected] = useState<Payroll | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const totalDisbursed = records.filter((r) => r.status === "Paid").reduce((sum, r) => sum + r.netSalary, 0);
  const totalPending   = records.filter((r) => r.status === "Pending").reduce((sum, r) => sum + r.netSalary, 0);
  const onHoldCount    = records.filter((r) => r.status === "On Hold").length;

  const handleEdit   = (row: Payroll) => { setSelected(row); setIsOpen(true); };
  const handleDelete = (row: Payroll) => setRecords(records.filter((r) => r.id !== row.id));

  const handleSave = (data: Payroll) => {
    setRecords(records.map((r) => r.id === data.id ? data : r));
  };

  const handleCreate = (data: Omit<Payroll, "id">) => {
    setRecords([...records, { ...data, id: Date.now() }]);
  };

  return (
    <div className="p-4 md:px-8 md:pt-2 md:pb-8 bg-muted/30 min-h-screen">
      <main className="space-y-8">

        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 ml-1 mt-2">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight text-foreground">Payroll</h1>
            <p className="text-muted-foreground text-base font-medium mt-1">Manage employee salaries and disbursements</p>
          </div>
          <Button
            onClick={() => { setSelected(null); setIsOpen(true); }}
            className="rounded-2xl bg-primary px-6 py-6 h-auto font-bold shadow-lg shadow-primary/20 hover:shadow-xl hover:-translate-y-1 transition-all gap-2"
          >
            <Plus className="w-5 h-5" />
            Add Payroll
          </Button>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <StatCard title="Total Disbursed"  value={`Rs. ${totalDisbursed.toLocaleString()}`} icon={Wallet}      variant="green"  />
          <StatCard title="Pending Salaries" value={`Rs. ${totalPending.toLocaleString()}`}   icon={Clock}       variant="amber"  />
          <StatCard title="On Hold"          value={String(onHoldCount)}                       icon={PauseCircle} variant="purple" />
        </div>

        <Card className="rounded-[2.5rem] border-none shadow-sm overflow-hidden bg-card">
          <CardHeader className="px-8 pt-8 flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-xl font-bold tracking-tight">Salary Register</CardTitle>
            <div className="text-xs font-bold text-muted-foreground/50 uppercase tracking-widest">
              Showing {records.length} Records
            </div>
          </CardHeader>
          <CardContent className="px-8 pb-8">
            <GenericTable
              data={records}
              columns={columns}
              onEdit={handleEdit}
              onDelete={handleDelete}
              searchKeys={["employeeName", "employeeType", "status"]}
            />
          </CardContent>
        </Card>
      </main>

      <PayrollDetails
        isOpen={isOpen}
        onOpenChange={setIsOpen}
        payroll={selected}
        onSave={handleSave}
        onCreate={handleCreate}
      />
    </div>
  );
}

function StatCard({ title, value, icon: Icon, variant }: { title: string; value: string; icon: LucideIcon; variant: "green" | "blue" | "amber" | "purple" }) {
  const styles = {
    green:  { bg: "bg-[oklch(0.6959_0.1491_162.4796)]/10 dark:bg-[oklch(0.6959_0.1491_162.4796)]/15", iconBg: "bg-[oklch(0.6959_0.1491_162.4796)]/20", iconColor: "text-[oklch(0.6959_0.1491_162.4796)]" },
    blue:   { bg: "bg-[oklch(0.6231_0.1880_259.8145)]/10 dark:bg-[oklch(0.6231_0.1880_259.8145)]/15", iconBg: "bg-[oklch(0.6231_0.1880_259.8145)]/20", iconColor: "text-[oklch(0.6231_0.1880_259.8145)]" },
    amber:  { bg: "bg-[oklch(0.7686_0.1647_70.0804)]/10 dark:bg-[oklch(0.7686_0.1647_70.0804)]/15",   iconBg: "bg-[oklch(0.7686_0.1647_70.0804)]/20",   iconColor: "text-[oklch(0.7686_0.1647_70.0804)]"   },
    purple: { bg: "bg-[oklch(0.6056_0.2189_292.7172)]/10 dark:bg-[oklch(0.6056_0.2189_292.7172)]/15", iconBg: "bg-[oklch(0.6056_0.2189_292.7172)]/20", iconColor: "text-[oklch(0.6056_0.2189_292.7172)]" },
  }[variant];

  return (
    <Card className={`rounded-[2.2rem] border-none shadow-sm p-7 transition-all hover:shadow-md group ${styles.bg}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-bold text-muted-foreground/70 uppercase tracking-widest">{title}</p>
          <p className="text-3xl font-black mt-1 tracking-tight text-foreground">{value}</p>
        </div>
        <div className={`p-4 rounded-2xl transition-transform group-hover:scale-110 group-hover:rotate-3 ${styles.iconBg}`}>
          <Icon className={`w-7 h-7 ${styles.iconColor}`} />
        </div>
      </div>
    </Card>
  );
}