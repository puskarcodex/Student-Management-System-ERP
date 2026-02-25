"use client";

import { useState, useEffect, useCallback } from "react";
import { GenericTable } from "@/components/GenericTable/generic-table";
import RecordDetails from "@/components/fees/records-details";
import ManageFeeDetails from "@/components/fees/collect-details";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { History, TrendingUp, Calendar, AlertTriangle, Receipt, Loader2 } from "lucide-react";
import { type LucideIcon } from "lucide-react";
import type { ColumnDef } from "@tanstack/react-table";
import type { FeeBill, FeeStructure } from "@/lib/types";
import { feeBillsApi, feeStructureApi } from "@/lib/api";

export default function FeeRecords() {
  const [records, setRecords]         = useState<FeeBill[]>([]);
  const [structures, setStructures]   = useState<FeeStructure[]>([]);
  const [selectedBill, setSelectedBill] = useState<FeeBill | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isEditOpen, setIsEditOpen]   = useState(false);
  const [isLoading, setIsLoading]     = useState(true);
  const [error, setError]             = useState<string | null>(null);


  const mapStructures = (raw: FeeStructure[]) =>
    raw.map((s) => {
      const raw_s = s as unknown as Record<string, unknown>;
      const flatItems = (raw_s.feeItems ?? raw_s.FeeItems ?? []) as { feeHead?: string; FeeHead?: string; amount?: number; Amount?: number; feeType?: string; FeeType?: string; frequency?: string; Frequency?: string; id?: number; Id?: number }[];
      const hasFlat = flatItems.length > 0;
      return {
        ...s,
        recurringItems: hasFlat
          ? flatItems.filter((i) => (i.feeType ?? i.FeeType) === "Recurring").map((i) => ({
              id: i.id ?? i.Id ?? 0,
              feeHead: i.feeHead ?? i.FeeHead ?? "",
              amount: i.amount ?? i.Amount ?? 0,
              feeType: "Recurring" as const,
              frequency: ((i.frequency ?? i.Frequency) ?? "Monthly") as "Monthly" | "Quarterly" | "Yearly",
            }))
          : (s.recurringItems ?? []),
        oneTimeItems: hasFlat
          ? flatItems.filter((i) => (i.feeType ?? i.FeeType) === "One-Time").map((i) => ({
              id: i.id ?? i.Id ?? 0,
              feeHead: i.feeHead ?? i.FeeHead ?? "",
              amount: i.amount ?? i.Amount ?? 0,
              feeType: "One-Time" as const,
            }))
          : (s.oneTimeItems ?? []),
      };
    });
  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const [billsRes, structuresRes] = await Promise.all([
        feeBillsApi.getAll({ page: 1, limit: 200 }),
        feeStructureApi.getAll({ page: 1, limit: 100 }),
      ]);
      // Map Fee entity shape -> FeeBill shape
      const bills = (billsRes.data ?? []).map((b) => {
        const raw = b as unknown as Record<string, unknown>;
        return {
          ...b,
          // backend returns `amount` — map to totalAmount/balanceAmount
          totalAmount:   Number(raw.totalAmount   ?? raw.amount ?? 0),
          paidAmount:    Number(raw.paidAmount     ?? 0),
          balanceAmount: Number(raw.balanceAmount  ?? raw.amount ?? 0),
          className:     String(raw.className      ?? raw.classId ?? ""),
          billDate:      String(raw.billDate       ?? raw.createdAt ?? ""),
          feeItems:      (raw.feeItems as unknown[] ?? []),
        } as FeeBill;
      });
      setRecords(bills);
      setStructures(mapStructures(structuresRes.data ?? []));
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to load records");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const totalRevenue      = records.reduce((sum, r) => sum + r.totalAmount, 0);
  const totalOutstanding  = records.reduce((sum, r) => sum + r.balanceAmount, 0);
  const collectionRate    = totalRevenue > 0
    ? Math.round(((totalRevenue - totalOutstanding) / totalRevenue) * 100)
    : 0;

  const handleView = (bill: FeeBill) => { setSelectedBill(bill); setIsDetailOpen(true); };
  const handleEdit = (bill: FeeBill) => { setSelectedBill(bill); setIsEditOpen(true); };

  const handleDelete = async (row: FeeBill) => {
    try {
      await feeBillsApi.delete(row.id);
      setRecords((prev) => prev.filter((r) => r.id !== row.id));
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Failed to delete");
    }
  };

  const handlePaymentRecorded = async (billId: number, newPaidAmount: number) => {
    try {
      await feeBillsApi.recordPayment(billId, { paymentAmount: newPaidAmount });
      setRecords((prev) => prev.map((r) => {
        if (r.id !== billId) return r;
        const newBalance = Math.max(0, r.totalAmount - newPaidAmount);
        const newStatus: FeeBill["status"] = newBalance <= 0 ? "Paid" : "Partial";
        return { ...r, paidAmount: newPaidAmount, balanceAmount: newBalance, status: newStatus };
      }));
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Failed to record payment");
    }
  };

  const handleEditClose = (open: boolean) => {
    setIsEditOpen(open);
    if (!open) fetchData();
  };

  const columns: ColumnDef<FeeBill>[] = [
    {
      accessorKey: "studentName",
      header: "Student",
      cell: (info) => (
        <div className="flex flex-col">
          <span className="font-bold text-foreground">{String(info.getValue())}</span>
          <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-tight">ID: {info.row.original.studentId}</span>
        </div>
      ),
    },
    { accessorKey: "className", header: "Class" },
    {
      accessorKey: "totalAmount",
      header: "Billed",
      cell: (info) => <span className="font-medium text-muted-foreground">Rs. {String(info.getValue())}</span>,
    },
    {
      accessorKey: "balanceAmount",
      header: "Balance",
      cell: (info) => {
        const amount = Number(info.getValue());
        return <span className={`font-black ${amount > 0 ? "text-rose-600" : "text-emerald-600"}`}>Rs. {amount}</span>;
      },
    },
    {
      accessorKey: "dueDate",
      header: "Due Date",
      cell: (info) => (
        <div className="flex items-center gap-2 text-muted-foreground/70">
          <Calendar className="w-3 h-3" />
          <span className="text-xs font-bold">{String(info.getValue())}</span>
        </div>
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
          <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${styles[status] ?? ""}`}>
            {status}
          </span>
        );
      },
    },
  ];

  return (
    <div className="p-4 md:px-8 md:pt-2 md:pb-8 bg-muted/30 min-h-screen">
      <main className="space-y-8">

        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 ml-1 mt-2">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <History className="w-5 h-5 text-primary" />
              <span className="text-xs font-black uppercase tracking-[0.2em] text-primary">Financial Archives</span>
            </div>
            <h1 className="text-4xl font-extrabold tracking-tight text-foreground">Fee Records</h1>
            <p className="text-muted-foreground text-base font-medium mt-1">Audit and track historical payment data</p>
          </div>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <StatCard title="Overall Collection" value={isLoading ? "..." : `${collectionRate}%`}          icon={TrendingUp}    variant="green" />
          <StatCard title="Total Due"           value={isLoading ? "..." : `Rs. ${totalOutstanding}`}    icon={AlertTriangle}  variant="amber" />
          <StatCard title="Active Invoices"     value={isLoading ? "..." : String(records.length)}       icon={Receipt}        variant="blue"  />
        </div>

        <Card className="rounded-[2.5rem] border-none shadow-sm overflow-hidden bg-card">
          <CardHeader className="px-8 pt-8 flex flex-row items-center justify-between space-y-0">
            <div>
              <CardTitle className="text-xl font-bold tracking-tight">Payment Ledger</CardTitle>
              <p className="text-xs font-bold text-muted-foreground/50 mt-1 uppercase tracking-widest">All Transactions</p>
            </div>
            <div className="text-xs font-bold text-muted-foreground/50 uppercase tracking-widest">Showing {records.length} Records</div>
          </CardHeader>
          <CardContent className="px-8 pb-8">
            {isLoading ? (
              <div className="flex items-center justify-center py-20 gap-3 text-muted-foreground">
                <Loader2 className="w-5 h-5 animate-spin" />
                <span className="text-sm font-medium">Loading records...</span>
              </div>
            ) : error ? (
              <div className="flex flex-col items-center justify-center py-20 gap-3">
                <p className="text-sm font-bold text-rose-500">{error}</p>
                <Button variant="outline" onClick={fetchData} className="rounded-xl">Retry</Button>
              </div>
            ) : (
              <GenericTable
                data={records}
                columns={columns}
                onView={handleView}
                onEdit={handleEdit}
                onDelete={handleDelete}
                searchKeys={["studentName", "className", "status"]}
              />
            )}
          </CardContent>
        </Card>
      </main>

      <RecordDetails
        isOpen={isDetailOpen}
        onOpenChange={setIsDetailOpen}
        bill={selectedBill}
        onPaymentRecorded={handlePaymentRecorded}
      />

      <ManageFeeDetails
        isOpen={isEditOpen}
        onOpenChange={handleEditClose}
        bill={selectedBill}
        structures={structures}
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