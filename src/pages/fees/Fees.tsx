"use client";

import { useState } from "react";
import { GenericTable } from "@/components/GenericTable/generic-table";
import ManageFeeDetails from "@/components/fees/fees-details";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { DollarSign, CheckCircle, AlertCircle } from "lucide-react";
import { type LucideIcon } from "lucide-react";
import type { ColumnDef } from "@tanstack/react-table";
import type { Fee } from "@/lib/types";

const mockFees: Fee[] = [
  {
    id: 1,
    studentName: "John Doe",
    amount: 5000,
    dueDate: "2025-02-15",
    status: "Paid",
  },
  {
    id: 2,
    studentName: "Jane Smith",
    amount: 5000,
    dueDate: "2025-02-15",
    status: "Pending",
  },
  {
    id: 3,
    studentName: "Rahul Sharma",
    amount: 5000,
    dueDate: "2025-01-15",
    status: "Overdue",
  },
];

const columns: ColumnDef<Fee>[] = [
  {
    accessorKey: "studentName",
    header: "Student Name",
  },
  {
    accessorKey: "amount",
    header: "Amount",
    cell: (info) => `₹${info.getValue()}`,
  },
  {
    accessorKey: "dueDate",
    header: "Due Date",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: (info) => {
      const status = String(info.getValue());
      return (
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${
            status === "Paid"
              ? "bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100"
              : status === "Pending"
                ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100"
                : "bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100"
          }`}
        >
          {status}
        </span>
      );
    },
  },
];

export default function Fees() {
  const [isManage, setIsManage] = useState(false);
  const [fees, setFees] = useState<Fee[]>(mockFees);
  const [selectedFee, setSelectedFee] = useState<Fee | null>(null);

  const handleEdit = (fee: Fee) => {
    setSelectedFee(fee);
    setIsManage(true);
  };

  const handleDelete = (fee: Fee) => {
    setFees(fees.filter((f) => f.id !== fee.id));
  };

  const totalAmount = fees.reduce((sum, f) => sum + f.amount, 0);
  const paidAmount = fees
    .filter((f) => f.status === "Paid")
    .reduce((sum, f) => sum + f.amount, 0);
  const pendingAmount = fees
    .filter((f) => f.status === "Pending" || f.status === "Overdue")
    .reduce((sum, f) => sum + f.amount, 0);

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1 p-6 space-y-6">
        {/* Top Action + Stats */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h1 className="text-2xl font-semibold">Fees</h1>
          <div className="flex gap-2">
            <Button
              className="flex items-center gap-2 bg-primary text-white hover:bg-primary/90"
              onClick={() => {
                setSelectedFee(null);
                setIsManage(true);
              }}
            >
              <DollarSign className="w-5 h-5" />
              Add Fee Record
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <StatCard
            title="Total Amount"
            value={`₹${totalAmount}`}
            icon={DollarSign}
            color="bg-blue-500/70 text-white"
          />
          <StatCard
            title="Paid Amount"
            value={`₹${paidAmount}`}
            icon={CheckCircle}
            color="bg-green-500/70 text-white"
          />
          <StatCard
            title="Pending Amount"
            value={`₹${pendingAmount}`}
            icon={AlertCircle}
            color="bg-red-500/70 text-white"
          />
        </div>

        {/* Fees Table */}
        <Card>
          <CardHeader>
            <CardTitle>Fee Records</CardTitle>
          </CardHeader>
          <CardContent>
            <GenericTable
              data={fees}
              columns={columns}
              onEdit={handleEdit}
              onDelete={handleDelete}
              searchKeys={["studentName", "status"]}
            />
          </CardContent>
        </Card>
      </main>

      {/* Manage Fee Modal */}
      <ManageFeeDetails
        isOpen={isManage}
        onOpenChange={setIsManage}
        fee={selectedFee}
      />
    </div>
  );
}

interface StatCardProps {
  title: string;
  value: string;
  icon: LucideIcon;
  color?: string;
}

function StatCard({ title, value, icon: Icon, color = "bg-white" }: StatCardProps) {
  return (
    <Card className={`rounded-lg shadow-lg p-0 overflow-hidden ${color}`}>
      <div className="flex items-center justify-between p-6 h-full">
        <div>
          <p className="text-sm font-medium">{title}</p>
          <p className="text-2xl font-bold">{value}</p>
        </div>
        <div className="p-3 rounded-full bg-white/20">
          <Icon className="w-5 h-5" />
        </div>
      </div>
    </Card>
  );
}