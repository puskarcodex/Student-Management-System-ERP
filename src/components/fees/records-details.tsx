"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Receipt, RefreshCw, Star, Wallet, Printer, Loader2 } from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Sheet, SheetClose, SheetContent, SheetDescription,
  SheetFooter, SheetHeader, SheetTitle,
} from "@/components/ui/sheet";
import type { FeeBill } from "@/lib/types";
import { feeBillsApi } from "@/lib/api";

interface RecordDetailsProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  bill?: FeeBill | null;
  onPaymentRecorded?: (billId: number, newPaidAmount: number) => void;
}

const schema = yup.object({
  paymentAmount: yup.number()
    .transform((v) => (isNaN(v) ? 0 : v))
    .required("Amount is required")
    .min(1, "Amount must be greater than 0"),
}).required();

type FormData = yup.InferType<typeof schema>;

const handlePrint = (bill: FeeBill) => {
  const recurringItems = (bill.feeItems ?? []).filter((i) => i.feeType === "Recurring");
  const oneTimeItems   = (bill.feeItems ?? []).filter((i) => i.feeType === "One-Time");

  const feeRowsHtml = [
    ...(recurringItems.length > 0 ? [
      `<tr><td colspan="2" style="padding:10px 0 4px; font-size:9px; font-weight:900; letter-spacing:0.15em; text-transform:uppercase; color:#9ca3af;">Recurring</td></tr>`,
      ...recurringItems.map((item) => `
        <tr>
          <td style="padding:6px 0; font-size:13px; color:#374151;">
            ${item.feeHead}${item.frequency ? `<span style="font-size:10px; color:#9ca3af; margin-left:4px;">(${item.frequency})</span>` : ""}
          </td>
          <td style="padding:6px 0; font-size:13px; font-weight:700; text-align:right; color:#111827;">Rs. ${item.amount.toLocaleString()}</td>
        </tr>
      `),
    ] : []),
    ...(oneTimeItems.length > 0 ? [
      `<tr><td colspan="2" style="padding:10px 0 4px; font-size:9px; font-weight:900; letter-spacing:0.15em; text-transform:uppercase; color:#9ca3af;">One-Time</td></tr>`,
      ...oneTimeItems.map((item) => `
        <tr>
          <td style="padding:6px 0; font-size:13px; color:#374151;">${item.feeHead}</td>
          <td style="padding:6px 0; font-size:13px; font-weight:700; text-align:right; color:#111827;">Rs. ${item.amount.toLocaleString()}</td>
        </tr>
      `),
    ] : []),
  ].join("");

  const statusColor =
    bill.status === "Paid"    ? "#059669" :
    bill.status === "Partial" ? "#2563eb" :
    bill.status === "Pending" ? "#d97706" : "#dc2626";

  const printContent = `
    <!DOCTYPE html><html><head><meta charset="utf-8" /><title>Receipt — ${bill.studentName}</title>
    <style>
      * { margin: 0; padding: 0; box-sizing: border-box; }
      body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; background: #fff; color: #111827; }
      .receipt { max-width: 420px; margin: 40px auto; padding: 0 24px; }
      .header { text-align: center; padding-bottom: 20px; border-bottom: 1.5px solid #f3f4f6; margin-bottom: 20px; }
      .header h1 { font-size: 22px; font-weight: 900; letter-spacing: -0.5px; }
      .header p  { font-size: 11px; color: #9ca3af; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; margin-top: 3px; }
      .meta { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 20px; }
      .meta-tile { background: #f9fafb; border-radius: 10px; padding: 10px 12px; }
      .meta-tile .meta-label { font-size: 9px; font-weight: 900; text-transform: uppercase; letter-spacing: 0.12em; color: #9ca3af; margin-bottom: 3px; }
      .meta-tile .meta-value { font-size: 13px; font-weight: 800; color: #111827; }
      .fee-table { width: 100%; border-collapse: collapse; margin-bottom: 16px; }
      .totals { border-top: 2px solid #111827; padding-top: 12px; margin-top: 4px; }
      .total-row { display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px; }
      .total-row .label { font-size: 12px; color: #6b7280; font-weight: 600; }
      .total-row .value { font-size: 13px; font-weight: 800; }
      .total-row.grand .label { font-size: 14px; font-weight: 900; color: #111827; }
      .total-row.grand .value { font-size: 20px; font-weight: 900; color: ${bill.balanceAmount > 0 ? "#dc2626" : "#059669"}; }
      .status-badge { display: inline-block; margin-top: 20px; padding: 5px 16px; border-radius: 999px; font-size: 10px; font-weight: 900; text-transform: uppercase; letter-spacing: 0.15em; color: ${statusColor}; border: 1.5px solid ${statusColor}; }
      .status-wrap { text-align: center; }
      .footer { margin-top: 28px; padding-top: 16px; border-top: 1px dashed #e5e7eb; text-align: center; }
      .footer p { font-size: 10px; color: #d1d5db; font-weight: 600; letter-spacing: 0.05em; }
      @media print { body { -webkit-print-color-adjust: exact; print-color-adjust: exact; } }
    </style></head>
    <body><div class="receipt">
      <div class="header"><h1>${bill.studentName}</h1><p>${bill.className} &nbsp;·&nbsp; Invoice #${bill.id}</p></div>
      <div class="meta">
        <div class="meta-tile"><div class="meta-label">Bill Date</div><div class="meta-value">${bill.billDate}</div></div>
        <div class="meta-tile"><div class="meta-label">Due Date</div><div class="meta-value">${bill.dueDate}</div></div>
        <div class="meta-tile"><div class="meta-label">Total Billed</div><div class="meta-value">Rs. ${bill.totalAmount.toLocaleString()}</div></div>
        <div class="meta-tile"><div class="meta-label">Amount Paid</div><div class="meta-value" style="color:#059669;">Rs. ${bill.paidAmount.toLocaleString()}</div></div>
      </div>
      ${(bill.feeItems ?? []).length > 0 ? `<table class="fee-table"><tbody>${feeRowsHtml}</tbody></table>` : ""}
      <div class="totals">
        <div class="total-row"><span class="label">Total Billed</span><span class="value">Rs. ${bill.totalAmount.toLocaleString()}</span></div>
        <div class="total-row"><span class="label">Paid</span><span class="value" style="color:#059669;">Rs. ${bill.paidAmount.toLocaleString()}</span></div>
        <div class="total-row grand"><span class="label">Balance Due</span><span class="value">Rs. ${bill.balanceAmount.toLocaleString()}</span></div>
      </div>
      <div class="status-wrap"><span class="status-badge">${bill.status}</span></div>
      <div class="footer"><p>Printed on ${new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</p></div>
    </div></body></html>
  `;

  const printWindow = window.open("", "_blank", "width=520,height=700");
  if (!printWindow) return;
  printWindow.document.write(printContent);
  printWindow.document.close();
  printWindow.focus();
  setTimeout(() => { printWindow.print(); printWindow.close(); }, 250);
};

export default function RecordDetails({
  isOpen, onOpenChange, bill, onPaymentRecorded,
}: RecordDetailsProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError]   = useState<string | null>(null);

  const { register, handleSubmit, formState: { errors }, reset, watch } = useForm<FormData>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: yupResolver(schema) as any,
    defaultValues: { paymentAmount: 0 },
  });

  const watchedAmount = watch("paymentAmount");
  const newBalance    = bill ? Math.max(0, bill.balanceAmount - (Number(watchedAmount) || 0)) : 0;
  const newStatus: FeeBill["status"] = newBalance <= 0 ? "Paid" : "Partial";

  useEffect(() => {
    if (!isOpen) return;
    setSubmitError(null);
    reset({ paymentAmount: bill?.balanceAmount ?? 0 });
  }, [isOpen, bill, reset]);

  const onSubmit = async (data: FormData) => {
    if (!bill) return;
    setIsSubmitting(true);
    setSubmitError(null);
    try {
      const newPaidAmount = bill.paidAmount + data.paymentAmount;
      await feeBillsApi.recordPayment(bill.id, { paymentAmount: newPaidAmount });
      onPaymentRecorded?.(bill.id, newPaidAmount);
      onOpenChange(false);
    } catch (err: unknown) {
      setSubmitError(err instanceof Error ? err.message : "Failed to record payment");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!bill) return null;

  const recurringItems = (bill.feeItems ?? []).filter((i) => i.feeType === "Recurring");
  const oneTimeItems   = (bill.feeItems ?? []).filter((i) => i.feeType === "One-Time");
  const hasBreakdown   = (bill.feeItems ?? []).length > 0;

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-md border-none shadow-2xl p-0 flex flex-col">
        <SheetHeader className="p-8 bg-primary/5">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-primary/10 rounded-xl"><Receipt className="w-5 h-5 text-primary" /></div>
            <div>
              <SheetTitle className="text-2xl font-black tracking-tight text-foreground">{bill.studentName}</SheetTitle>
              <p className="text-xs font-black uppercase tracking-widest text-muted-foreground/50 mt-0.5">{bill.className} · Bill #{bill.id}</p>
            </div>
          </div>
          <SheetDescription className="text-muted-foreground font-medium">View invoice details and record a payment</SheetDescription>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto px-8 py-6 space-y-8">

          <div className="space-y-4">
            <SectionLabel title="Bill Summary" icon={Receipt} />
            <div className="grid grid-cols-2 gap-3">
              <InfoTile label="Bill Date" value={bill.billDate} />
              <InfoTile label="Due Date"  value={bill.dueDate} />
              <InfoTile label="Total"     value={`Rs. ${bill.totalAmount.toLocaleString()}`} />
              <InfoTile label="Paid"      value={`Rs. ${bill.paidAmount.toLocaleString()}`} highlight="green" />
            </div>
            <div className={`flex items-center justify-between p-4 rounded-2xl ${bill.balanceAmount > 0 ? "bg-rose-500/5" : "bg-emerald-500/5"}`}>
              <span className="text-sm font-black text-muted-foreground">Current Balance</span>
              <span className={`text-2xl font-black ${bill.balanceAmount > 0 ? "text-rose-600" : "text-emerald-600"}`}>
                Rs. {bill.balanceAmount.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-center">
              <span className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest ${
                bill.status === "Paid"    ? "bg-emerald-500/10 text-emerald-600" :
                bill.status === "Partial" ? "bg-blue-500/10 text-blue-600"       :
                bill.status === "Pending" ? "bg-amber-500/10 text-amber-600"     :
                                            "bg-rose-500/10 text-rose-600"
              }`}>{bill.status}</span>
            </div>
          </div>

          {hasBreakdown && (
            <div className="space-y-4">
              <SectionLabel title="Fee Breakdown" icon={Wallet} />
              {recurringItems.length > 0 && (
                <div className="space-y-1">
                  <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/30 flex items-center gap-1 mb-2">
                    <RefreshCw className="w-2.5 h-2.5" /> Recurring
                  </p>
                  {recurringItems.map((item) => (
                    <div key={item.id} className="flex items-center justify-between py-2 border-b border-border/40">
                      <span className="text-sm font-medium text-muted-foreground">
                        {item.feeHead}
                        {item.frequency && <span className="text-[10px] text-muted-foreground/40 ml-1">({item.frequency})</span>}
                      </span>
                      <span className="text-sm font-bold text-foreground">Rs. {item.amount}</span>
                    </div>
                  ))}
                </div>
              )}
              {oneTimeItems.length > 0 && (
                <div className="space-y-1 mt-2">
                  <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/30 flex items-center gap-1 mb-2">
                    <Star className="w-2.5 h-2.5" /> One-Time
                  </p>
                  {oneTimeItems.map((item) => (
                    <div key={item.id} className="flex items-center justify-between py-2 border-b border-border/40">
                      <span className="text-sm font-medium text-muted-foreground">{item.feeHead}</span>
                      <span className="text-sm font-bold text-foreground">Rs. {item.amount}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {bill.balanceAmount > 0 && (
            <div className="space-y-4">
              <SectionLabel title="Record Payment" icon={Wallet} />
              <form id="payment-form" onSubmit={handleSubmit(onSubmit)}>
                <div className="bg-muted/40 rounded-2xl p-5 space-y-4">
                  <div className="grid gap-2">
                    <Label className="text-[13px] font-bold text-foreground/70 ml-1">
                      Payment Amount <span className="text-muted-foreground/40">(max Rs. {bill.balanceAmount})</span>
                    </Label>
                    <Input type="number" {...register("paymentAmount")} placeholder="0"
                      className="rounded-xl border-muted-foreground/20 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" />
                    {errors.paymentAmount && (
                      <p className="text-[11px] font-bold text-rose-500 ml-1">{errors.paymentAmount.message}</p>
                    )}
                  </div>
                  {Number(watchedAmount) > 0 && (
                    <div className="space-y-2 pt-2 border-t border-border/40">
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-bold text-muted-foreground">New Balance</span>
                        <span className={`font-black ${newBalance > 0 ? "text-rose-600" : "text-emerald-600"}`}>Rs. {newBalance.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-bold text-muted-foreground">New Status</span>
                        <span className={`text-xs font-black uppercase tracking-widest px-2 py-0.5 rounded-full ${newStatus === "Paid" ? "bg-emerald-500/10 text-emerald-600" : "bg-blue-500/10 text-blue-600"}`}>
                          {newStatus}
                        </span>
                      </div>
                    </div>
                  )}
                  {submitError && <p className="text-[11px] font-bold text-rose-500 text-center">{submitError}</p>}
                </div>
              </form>
            </div>
          )}

          {bill.balanceAmount <= 0 && (
            <div className="flex items-center justify-center gap-2 py-4 text-emerald-600">
              <Receipt className="w-4 h-4" />
              <span className="text-sm font-black">This invoice is fully paid</span>
            </div>
          )}
        </div>

        <SheetFooter className="p-8 bg-card border-t flex flex-row items-center justify-end gap-3">
          <SheetClose asChild>
            <Button type="button" variant="ghost" className="rounded-xl font-bold text-muted-foreground">Close</Button>
          </SheetClose>
          <Button type="button" variant="outline" onClick={() => handlePrint(bill)}
            className="rounded-xl font-bold gap-2 border-muted-foreground/20 hover:bg-muted/50">
            <Printer className="w-4 h-4" /> Print Bill
          </Button>
          {bill.balanceAmount > 0 && (
            <Button type="submit" form="payment-form" disabled={isSubmitting}
              className="rounded-xl bg-primary px-8 font-black shadow-lg shadow-primary/20 hover:shadow-xl transition-all">
              {isSubmitting ? (
                <span className="flex items-center gap-2"><Loader2 className="w-4 h-4 animate-spin" /> Recording...</span>
              ) : "Record Payment"}
            </Button>
          )}
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

function SectionLabel({ title, icon: Icon }: { title: string; icon: LucideIcon }) {
  return (
    <div className="flex items-center gap-2">
      <Icon className="w-4 h-4 text-primary/60" />
      <h3 className="text-sm font-black uppercase tracking-widest text-muted-foreground/40">{title}</h3>
    </div>
  );
}

function InfoTile({ label, value, highlight }: { label: string; value: string; highlight?: "green" | "rose" }) {
  return (
    <div className="bg-muted/30 rounded-xl p-3">
      <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/40 mb-1">{label}</p>
      <p className={`text-sm font-black ${highlight === "green" ? "text-emerald-600" : highlight === "rose" ? "text-rose-600" : "text-foreground"}`}>{value}</p>
    </div>
  );
}