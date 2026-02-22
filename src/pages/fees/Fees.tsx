"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BookOpen, Plus, Trash2, Save, Wallet, RefreshCw, Star } from "lucide-react";
import { type LucideIcon } from "lucide-react";
import { CLASS_OPTIONS, FEE_HEAD_OPTIONS } from "@/lib/dropdown-options";
import type { FeeStructure, FeeItem } from "@/lib/types";

type EditableFeeItem = { feeHead: string; amount: string; frequency?: string };

const FREQUENCY_OPTIONS = [
  { value: "Monthly", label: "Monthly" },
  { value: "Quarterly", label: "Quarterly" },
  { value: "Yearly", label: "Yearly" },
];

// One-time fee heads (preset suggestions)
const ONE_TIME_FEE_HEADS = ["Admission Fee", "ID Card Fee", "Tie Fee", "Belt Fee", "Uniform Fee"];

const mockStructures: FeeStructure[] = [
  {
    id: 1,
    classId: "Class 5", className: "Class 5",
    recurringItems: [
      { id: 1, feeHead: "Tuition Fee", amount: 2500, feeType: "Recurring", frequency: "Monthly" },
      { id: 2, feeHead: "Exam Fee", amount: 500, feeType: "Recurring", frequency: "Quarterly" },
    ],
    oneTimeItems: [
      { id: 3, feeHead: "Admission Fee", amount: 1000, feeType: "One-Time" },
      { id: 4, feeHead: "Tie Fee", amount: 200, feeType: "One-Time" },
      { id: 5, feeHead: "Belt Fee", amount: 150, feeType: "One-Time" },
    ],
    totalAmount: 4350, status: "Active",
  },
];

export default function FeeSetup() {
  const [structures, setStructures] = useState<FeeStructure[]>(mockStructures);
  const [selectedClass, setSelectedClass] = useState<string>("");
  const [recurringItems, setRecurringItems] = useState<EditableFeeItem[]>([]);
  const [oneTimeItems, setOneTimeItems] = useState<EditableFeeItem[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);

  const handleClassSelect = (classId: string) => {
    setSelectedClass(classId);
    const existing = structures.find((s) => s.classId === classId);
    if (existing) {
      setRecurringItems(existing.recurringItems.map((i) => ({ feeHead: i.feeHead, amount: String(i.amount), frequency: i.frequency })));
      setOneTimeItems(existing.oneTimeItems.map((i) => ({ feeHead: i.feeHead, amount: String(i.amount) })));
      setEditingId(existing.id);
    } else {
      setRecurringItems([]);
      setOneTimeItems([]);
      setEditingId(null);
    }
  };

  const addRecurring = () => setRecurringItems([...recurringItems, { feeHead: "", amount: "", frequency: "Monthly" }]);
  const addOneTime = () => setOneTimeItems([...oneTimeItems, { feeHead: "", amount: "" }]);

  const removeRecurring = (i: number) => setRecurringItems(recurringItems.filter((_, idx) => idx !== i));
  const removeOneTime = (i: number) => setOneTimeItems(oneTimeItems.filter((_, idx) => idx !== i));

  const updateRecurring = (index: number, field: keyof EditableFeeItem, value: string) => {
    const updated = [...recurringItems];
    updated[index] = { ...updated[index], [field]: value };
    setRecurringItems(updated);
  };

  const updateOneTime = (index: number, field: keyof EditableFeeItem, value: string) => {
    const updated = [...oneTimeItems];
    updated[index] = { ...updated[index], [field]: value };
    setOneTimeItems(updated);
  };

  const totalAmount =
    recurringItems.reduce((s, i) => s + (Number(i.amount) || 0), 0) +
    oneTimeItems.reduce((s, i) => s + (Number(i.amount) || 0), 0);

  const handleSave = () => {
    if (!selectedClass) return;
    const className = CLASS_OPTIONS.find((c) => c.value === selectedClass)?.label ?? selectedClass;

    const recurring: FeeItem[] = recurringItems
      .filter((i) => i.feeHead && i.amount)
      .map((i, idx) => ({ id: idx + 1, feeHead: i.feeHead, amount: Number(i.amount), feeType: "Recurring", frequency: i.frequency as FeeItem["frequency"] }));

    const oneTime: FeeItem[] = oneTimeItems
      .filter((i) => i.feeHead && i.amount)
      .map((i, idx) => ({ id: idx + 100, feeHead: i.feeHead, amount: Number(i.amount), feeType: "One-Time" }));

    if (editingId) {
      setStructures(structures.map((s) =>
        s.id === editingId ? { ...s, recurringItems: recurring, oneTimeItems: oneTime, totalAmount, className } : s
      ));
    } else {
      setStructures([...structures, {
        id: Date.now(), classId: selectedClass, className,
        recurringItems: recurring, oneTimeItems: oneTime, totalAmount, status: "Active",
      }]);
    }

    console.log("Saved structure for", className);
  };

  const handleDelete = (id: number) => {
    setStructures(structures.filter((s) => s.id !== id));
    if (editingId === id) {
      setSelectedClass("");
      setRecurringItems([]);
      setOneTimeItems([]);
      setEditingId(null);
    }
  };

  return (
    <div className="p-4 md:px-8 md:pt-2 md:pb-8 bg-muted/30 min-h-screen">
      <main className="space-y-8">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 ml-1 mt-2">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight text-foreground">Fee Setup</h1>
            <p className="text-muted-foreground text-base font-medium mt-1">Configure fee structures per class</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <StatCard title="Configured Classes" value={String(structures.length)} icon={BookOpen} variant="green" />
          <StatCard title="Avg. Total Fee" value={`Rs. ${Math.round(structures.reduce((s, x) => s + x.totalAmount, 0) / (structures.length || 1))}`} icon={Wallet} variant="blue" />
          <StatCard title="Active Structures" value={String(structures.filter((s) => s.status === "Active").length)} icon={Save} variant="amber" />
        </div>

        <div className="grid gap-6 lg:grid-cols-2">

          {/* Left: Editor */}
          <Card className="rounded-[2.5rem] border-none shadow-sm bg-card">
            <CardHeader className="px-8 pt-8 pb-4">
              <CardTitle className="text-xl font-bold tracking-tight">Configure Structure</CardTitle>
              <p className="text-sm text-muted-foreground font-medium mt-1">Select a class and define its fees</p>
            </CardHeader>
            <CardContent className="px-8 pb-8 space-y-6">

              {/* Class Selector */}
              <div className="space-y-2">
                <p className="text-[11px] font-black uppercase tracking-widest text-muted-foreground/50">Select Class</p>
                <Select value={selectedClass} onValueChange={handleClassSelect}>
                  <SelectTrigger className="rounded-xl h-11">
                    <SelectValue placeholder="Choose a class..." />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl">
                    {CLASS_OPTIONS.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {editingId && (
                  <p className="text-[11px] font-bold text-primary ml-1">✓ Existing structure loaded — editing mode</p>
                )}
              </div>

              {selectedClass && (
                <>
                  {/* Recurring Fees Section */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <RefreshCw className="w-3.5 h-3.5 text-[oklch(0.6959_0.1491_162.4796)]" />
                        <p className="text-[11px] font-black uppercase tracking-widest text-muted-foreground/60">Recurring Fees</p>
                      </div>
                      <Button type="button" onClick={addRecurring} variant="outline" className="rounded-xl h-8 px-3 text-xs font-bold gap-1.5">
                        <Plus className="w-3.5 h-3.5" /> Add
                      </Button>
                    </div>

                    {recurringItems.length === 0 && (
                      <div className="text-center py-5 text-muted-foreground/30 text-xs font-bold border-2 border-dashed border-muted rounded-2xl">
                        No recurring fees yet
                      </div>
                    )}

                    {recurringItems.map((item, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <Select value={item.feeHead} onValueChange={(v) => updateRecurring(index, "feeHead", v)}>
                          <SelectTrigger className="rounded-xl flex-1 text-sm">
                            <SelectValue placeholder="Fee Head" />
                          </SelectTrigger>
                          <SelectContent className="rounded-xl">
                            {FEE_HEAD_OPTIONS.filter(o => !ONE_TIME_FEE_HEADS.includes(o.label)).map((opt) => (
                              <SelectItem key={opt.value} value={opt.label}>{opt.label}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <Select value={item.frequency ?? "Monthly"} onValueChange={(v) => updateRecurring(index, "frequency", v)}>
                          <SelectTrigger className="rounded-xl w-32 text-sm">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="rounded-xl">
                            {FREQUENCY_OPTIONS.map((opt) => (
                              <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <Input
                          type="number"
                          placeholder="Rs."
                          value={item.amount}
                          onChange={(e) => updateRecurring(index, "amount", e.target.value)}
                          className="rounded-xl w-24"
                        />
                        <button type="button" onClick={() => removeRecurring(index)} className="p-2 rounded-xl text-rose-400 hover:bg-rose-50 hover:text-rose-600 transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>

                  {/* One-Time Fees Section */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Star className="w-3.5 h-3.5 text-[oklch(0.7686_0.1647_70.0804)]" />
                        <p className="text-[11px] font-black uppercase tracking-widest text-muted-foreground/60">One-Time Fees</p>
                        <span className="text-[9px] font-black text-muted-foreground/30 uppercase tracking-widest">(Admission / Belt / Tie...)</span>
                      </div>
                      <Button type="button" onClick={addOneTime} variant="outline" className="rounded-xl h-8 px-3 text-xs font-bold gap-1.5">
                        <Plus className="w-3.5 h-3.5" /> Add
                      </Button>
                    </div>

                    {oneTimeItems.length === 0 && (
                      <div className="text-center py-5 text-muted-foreground/30 text-xs font-bold border-2 border-dashed border-muted rounded-2xl">
                        No one-time fees yet
                      </div>
                    )}

                    {oneTimeItems.map((item, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <Select value={item.feeHead} onValueChange={(v) => updateOneTime(index, "feeHead", v)}>
                          <SelectTrigger className="rounded-xl flex-1 text-sm">
                            <SelectValue placeholder="Fee Head" />
                          </SelectTrigger>
                          <SelectContent className="rounded-xl">
                            {FEE_HEAD_OPTIONS.map((opt) => (
                              <SelectItem key={opt.value} value={opt.label}>{opt.label}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <Input
                          type="number"
                          placeholder="Rs."
                          value={item.amount}
                          onChange={(e) => updateOneTime(index, "amount", e.target.value)}
                          className="rounded-xl w-24"
                        />
                        <button type="button" onClick={() => removeOneTime(index)} className="p-2 rounded-xl text-rose-400 hover:bg-rose-50 hover:text-rose-600 transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>

                  {/* Total + Save */}
                  {(recurringItems.length > 0 || oneTimeItems.length > 0) && (
                    <div className="pt-4 border-t space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-black text-muted-foreground uppercase tracking-widest">Total</span>
                        <span className="text-2xl font-black text-foreground">Rs. {totalAmount}</span>
                      </div>
                      <Button
                        onClick={handleSave}
                        className="w-full rounded-xl bg-primary font-black shadow-lg shadow-primary/20 hover:shadow-xl transition-all gap-2"
                      >
                        <Save className="w-4 h-4" />
                        {editingId ? "Update Structure" : "Save Structure"}
                      </Button>
                    </div>
                  )}
                </>
              )}
            </CardContent>
          </Card>

          {/* Right: Saved Structures */}
          <Card className="rounded-[2.5rem] border-none shadow-sm bg-card">
            <CardHeader className="px-8 pt-8 pb-4 flex flex-row items-center justify-between space-y-0">
              <CardTitle className="text-xl font-bold tracking-tight">Saved Structures</CardTitle>
              <div className="text-xs font-bold text-muted-foreground/50 uppercase tracking-widest">{structures.length} Classes</div>
            </CardHeader>
            <CardContent className="px-8 pb-8 space-y-4">
              {structures.length === 0 && (
                <div className="text-center py-12 text-muted-foreground/40 text-sm font-bold">No structures configured yet.</div>
              )}
              {structures.map((structure) => (
                <div
                  key={structure.id}
                  onClick={() => handleClassSelect(structure.classId)}
                  className={`p-5 rounded-2xl border-2 cursor-pointer transition-all hover:shadow-md ${
                    selectedClass === structure.classId ? "border-primary bg-primary/5" : "border-border/50 hover:border-primary/30"
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-black text-foreground">{structure.className}</span>
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); handleDelete(structure.id); }}
                      className="p-1.5 rounded-lg text-rose-400 hover:bg-rose-50 hover:text-rose-600 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Recurring */}
                  {structure.recurringItems.length > 0 && (
                    <div className="mb-2">
                      <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/40 mb-1 flex items-center gap-1">
                        <RefreshCw className="w-2.5 h-2.5" /> Recurring
                      </p>
                      {structure.recurringItems.map((item) => (
                        <div key={item.id} className="flex items-center justify-between text-sm py-0.5">
                          <span className="text-muted-foreground font-medium">{item.feeHead} <span className="text-[10px] text-muted-foreground/40">({item.frequency})</span></span>
                          <span className="font-bold text-foreground">Rs. {item.amount}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* One-Time */}
                  {structure.oneTimeItems.length > 0 && (
                    <div className="mb-2">
                      <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/40 mb-1 flex items-center gap-1">
                        <Star className="w-2.5 h-2.5" /> One-Time
                      </p>
                      {structure.oneTimeItems.map((item) => (
                        <div key={item.id} className="flex items-center justify-between text-sm py-0.5">
                          <span className="text-muted-foreground font-medium">{item.feeHead}</span>
                          <span className="font-bold text-foreground">Rs. {item.amount}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-border/50">
                    <span className="text-xs font-black uppercase tracking-widest text-muted-foreground/50">Total</span>
                    <span className="font-black text-primary">Rs. {structure.totalAmount}</span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

        </div>
      </main>
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