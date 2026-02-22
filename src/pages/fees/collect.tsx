"use client";

import { useState } from "react";
import { GenericTable } from "@/components/GenericTable/generic-table";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Wallet, Clock, AlertCircle, Plus, X, Receipt } from "lucide-react";
import { type LucideIcon } from "lucide-react";
import type { ColumnDef } from "@tanstack/react-table";
import type { FeeBill, FeeStructure } from "@/lib/types";
import ManageFeeDetails from "@/components/fees/collect-details";

const mockStructures: FeeStructure[] = [
  {
    id: 1, classId: "Class 5", className: "Class 5",
    recurringItems: [
      { id: 1, feeHead: "Tuition Fee", amount: 2500, feeType: "Recurring", frequency: "Monthly" },
      { id: 2, feeHead: "Exam Fee", amount: 500, feeType: "Recurring", frequency: "Quarterly" },
    ],
    oneTimeItems: [
      { id: 3, feeHead: "Tie Fee", amount: 200, feeType: "One-Time" },
      { id: 4, feeHead: "Belt Fee", amount: 150, feeType: "One-Time" },
    ],
    totalAmount: 3350, status: "Active",
  },
  {
    id: 2, classId: "Class 9", className: "Class 9",
    recurringItems: [
      { id: 5, feeHead: "Tuition Fee", amount: 4500, feeType: "Recurring", frequency: "Monthly" },
      { id: 6, feeHead: "Exam Fee", amount: 1000, feeType: "Recurring", frequency: "Quarterly" },
    ],
    oneTimeItems: [
      { id: 7, feeHead: "Admission Fee", amount: 1000, feeType: "One-Time" },
    ],
    totalAmount: 6500, status: "Active",
  },
];

const mockBills: FeeBill[] = [
  {
    id: 1, studentId: 101, studentName: "Rahul Sharma",
    classId: "Class 5", className: "Class 5",
    billDate: "2024-03-01", dueDate: "2024-03-15",
    feeItems: [
      { id: 1, feeHead: "Tuition Fee", amount: 2500, feeType: "Recurring", frequency: "Monthly" },
      { id: 2, feeHead: "Tie Fee", amount: 200, feeType: "One-Time" },
    ],
    totalAmount: 2700, paidAmount: 2700, balanceAmount: 0, status: "Paid",
  },
  {
    id: 2, studentId: 102, studentName: "Ananya Verma",
    classId: "Class 9", className: "Class 9",
    billDate: "2024-03-01", dueDate: "2024-03-15",
    feeItems: [
      { id: 5, feeHead: "Tuition Fee", amount: 4500, feeType: "Recurring", frequency: "Monthly" },
      { id: 6, feeHead: "Exam Fee", amount: 1000, feeType: "Recurring", frequency: "Quarterly" },
    ],
    totalAmount: 5500, paidAmount: 2000, balanceAmount: 3500, status: "Partial",
  },
];

const columns: ColumnDef<FeeBill>[] = [
  { accessorKey: "studentName", header: "Student" },
  { accessorKey: "className", header: "Class" },
  { accessorKey: "totalAmount", header: "Total", cell: (info) => `Rs. ${info.getValue()}` },
  {
    accessorKey: "balanceAmount",
    header: "Balance",
    cell: (info) => (
      <span className={Number(info.getValue()) > 0 ? "text-rose-600 font-bold" : "text-emerald-600 font-bold"}>
        Rs. {String(info.getValue())}
      </span>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: (info) => {
      const status = String(info.getValue());
      const styles: Record<string, string> = {
        Paid:    "bg-emerald-500/10 text-emerald-600",
        Partial: "bg-[oklch(0.6231_0.1880_259.8145)]/10 text-[oklch(0.6231_0.1880_259.8145)]",
        Pending: "bg-[oklch(0.7686_0.1647_70.0804)]/10 text-[oklch(0.7686_0.1647_70.0804)]",
        Overdue: "bg-rose-500/10 text-rose-600",
      };
      return (
        <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${styles[status]}`}>
          {status}
        </span>
      );
    },
  },
];

export default function FeeBilling() {
  const [bills, setBills] = useState<FeeBill[]>(mockBills);
  const [receiptBill, setReceiptBill] = useState<FeeBill | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedBill, setSelectedBill] = useState<FeeBill | null>(null);

  const handleEdit = (bill: FeeBill) => {
    setSelectedBill(bill);
    setIsOpen(true);
  };

  const handleDelete = (bill: FeeBill) => setBills(bills.filter((b) => b.id !== bill.id));

  const totalCollected = bills.reduce((sum, b) => sum + b.paidAmount, 0);
  const totalPending   = bills.reduce((sum, b) => sum + b.balanceAmount, 0);
  const overdueCount   = bills.filter((b) => b.status === "Overdue").length;

  return (
    <div className="p-4 md:px-8 md:pt-2 md:pb-8 bg-muted/30 min-h-screen">
      <main className="space-y-8">

        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 ml-1 mt-2">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight text-foreground">Collect Fees</h1>
            <p className="text-muted-foreground text-base font-medium mt-1">Manage student invoices and payments</p>
          </div>
          <Button
            onClick={() => { setSelectedBill(null); setIsOpen(true); }}
            className="rounded-2xl bg-primary px-6 py-6 h-auto font-bold shadow-lg shadow-primary/20 hover:shadow-xl hover:-translate-y-1 transition-all gap-2"
          >
            <Plus className="w-5 h-5" />
            Create Bill
          </Button>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <StatCard title="Total Collected" value={`Rs. ${totalCollected}`} icon={Wallet}      variant="green"  />
          <StatCard title="Pending Amount"  value={`Rs. ${totalPending}`}   icon={Clock}       variant="amber"  />
          <StatCard title="Overdue Bills"   value={String(overdueCount)}    icon={AlertCircle} variant="purple" />
        </div>

        <Card className="rounded-[2.5rem] border-none shadow-sm overflow-hidden bg-card">
          <CardHeader className="px-8 pt-8 flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-xl font-bold tracking-tight">Recent Invoices</CardTitle>
            <div className="text-xs font-bold text-muted-foreground/50 uppercase tracking-widest">
              Showing {bills.length} Bills
            </div>
          </CardHeader>
          <CardContent className="px-8 pb-8">
            <GenericTable
              data={bills}
              columns={columns}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onView={(bill) => setReceiptBill(bill)}
              searchKeys={["studentName", "className", "status"]}
            />
          </CardContent>
        </Card>
      </main>

      <ManageFeeDetails
        isOpen={isOpen}
        onOpenChange={setIsOpen}
        bill={selectedBill}
        structures={mockStructures}
      />

      {/* Receipt Modal */}
      {receiptBill && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-card rounded-[2.5rem] shadow-2xl p-8 w-full max-w-sm mx-4 relative">
            <button
              onClick={() => setReceiptBill(null)}
              className="absolute top-5 right-5 p-2 rounded-xl hover:bg-muted transition-colors"
            >
              <X className="w-4 h-4 text-muted-foreground" />
            </button>

            <div className="flex items-center gap-3 mb-6">
              <div className="p-2.5 bg-primary/10 rounded-xl">
                <Receipt className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h2 className="text-lg font-black tracking-tight">{receiptBill.studentName}</h2>
                <p className="text-xs font-bold text-muted-foreground/60 uppercase tracking-widest">{receiptBill.className}</p>
              </div>
            </div>

            <div className="space-y-2 mb-6">
              <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/40 mb-3">Fee Breakdown</p>
              {receiptBill.feeItems.map((item) => (
                <div key={item.id} className="flex items-center justify-between py-2 border-b border-border/40">
                  <span className="text-sm font-medium text-muted-foreground">
                    {item.feeHead}
                    {item.frequency && <span className="text-[10px] text-muted-foreground/40 ml-1">({item.frequency})</span>}
                  </span>
                  <span className="text-sm font-bold text-foreground">Rs. {item.amount}</span>
                </div>
              ))}
            </div>

            <div className="space-y-2 pt-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-muted-foreground">Total</span>
                <span className="text-sm font-black">Rs. {receiptBill.totalAmount}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-muted-foreground">Paid</span>
                <span className="text-sm font-black text-emerald-600">Rs. {receiptBill.paidAmount}</span>
              </div>
              <div className="flex items-center justify-between pt-2 border-t-2 border-foreground/10">
                <span className="text-base font-black">Balance Due</span>
                <span className={`text-xl font-black ${receiptBill.balanceAmount > 0 ? "text-rose-600" : "text-emerald-600"}`}>
                  Rs. {receiptBill.balanceAmount}
                </span>
              </div>
            </div>

            <div className="mt-6 flex justify-center">
              <span className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest ${
                receiptBill.status === "Paid"    ? "bg-emerald-500/10 text-emerald-600" :
                receiptBill.status === "Partial" ? "bg-blue-500/10 text-blue-600" :
                receiptBill.status === "Pending" ? "bg-amber-500/10 text-amber-600" :
                "bg-rose-500/10 text-rose-600"
              }`}>
                {receiptBill.status}
              </span>
            </div>
          </div>
        </div>
      )}
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