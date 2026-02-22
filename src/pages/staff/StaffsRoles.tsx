"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Shield, Plus, Trash2, Users, Pencil, Check, X } from "lucide-react";
import { type LucideIcon } from "lucide-react";

interface Role {
  id: number;
  name: string;
  department: string;
  staffCount: number;
}

const MOCK_ROLES: Role[] = [
  { id: 1, name: "Accountant",    department: "Finance",        staffCount: 2 },
  { id: 2, name: "Librarian",     department: "Library",        staffCount: 1 },
  { id: 3, name: "Security Guard",department: "Security",       staffCount: 3 },
  { id: 4, name: "Receptionist",  department: "Administration", staffCount: 2 },
  { id: 5, name: "IT Support",    department: "IT",             staffCount: 1 },
  { id: 6, name: "Driver",        department: "Transport",      staffCount: 2 },
  { id: 7, name: "Cleaner",       department: "Housekeeping",   staffCount: 4 },
  { id: 8, name: "Cook",          department: "Kitchen",        staffCount: 2 },
];

export default function RolesPage() {
  const [roles, setRoles] = useState<Role[]>(MOCK_ROLES);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editName, setEditName] = useState("");
  const [editDept, setEditDept] = useState("");
  const [newName, setNewName] = useState("");
  const [newDept, setNewDept] = useState("");
  const [isAdding, setIsAdding] = useState(false);

  const totalRoles  = roles.length;
  const totalStaff  = roles.reduce((sum, r) => sum + r.staffCount, 0);
  const departments = new Set(roles.map((r) => r.department)).size;

  const handleStartEdit = (role: Role) => {
    setEditingId(role.id);
    setEditName(role.name);
    setEditDept(role.department);
  };

  const handleSaveEdit = (id: number) => {
    if (!editName.trim() || !editDept.trim()) return;
    setRoles(roles.map((r) => r.id === id ? { ...r, name: editName.trim(), department: editDept.trim() } : r));
    setEditingId(null);
  };

  const handleCancelEdit = () => setEditingId(null);

  const handleDelete = (id: number) => setRoles(roles.filter((r) => r.id !== id));

  const handleAddRole = () => {
    if (!newName.trim() || !newDept.trim()) return;
    setRoles([...roles, { id: Date.now(), name: newName.trim(), department: newDept.trim(), staffCount: 0 }]);
    setNewName("");
    setNewDept("");
    setIsAdding(false);
  };

  return (
    <div className="p-4 md:px-8 md:pt-2 md:pb-8 bg-muted/30 min-h-screen">
      <main className="space-y-8">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 ml-1 mt-2">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight text-foreground">Staff Roles</h1>
            <p className="text-muted-foreground text-base font-medium mt-1">Manage roles and departments for staff members</p>
          </div>
          <Button
            onClick={() => setIsAdding(true)}
            className="rounded-2xl bg-primary px-6 py-6 h-auto font-bold shadow-lg shadow-primary/20 hover:shadow-xl hover:-translate-y-1 transition-all gap-2"
          >
            <Plus className="w-5 h-5" />
            Add Role
          </Button>
        </div>

        {/* Stats */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <StatCard title="Total Roles"   value={String(totalRoles)}  icon={Shield} variant="blue"   />
          <StatCard title="Departments"   value={String(departments)} icon={Shield} variant="purple" />
          <StatCard title="Staff Covered" value={String(totalStaff)}  icon={Users}  variant="green"  />
        </div>

        {/* Roles Grid */}
        <Card className="rounded-[2.5rem] border-none shadow-sm overflow-hidden bg-card">
          <CardHeader className="px-8 pt-8 flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-xl font-bold tracking-tight">Role Directory</CardTitle>
            <div className="text-xs font-bold text-muted-foreground/50 uppercase tracking-widest">
              {roles.length} Roles
            </div>
          </CardHeader>
          <CardContent className="px-8 pb-8">

            {/* Add new role inline */}
            {isAdding && (
              <div className="flex gap-3 items-center mb-4 p-4 bg-primary/5 rounded-2xl">
                <Input
                  placeholder="Role name"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="rounded-xl border-muted-foreground/20 flex-1"
                  autoFocus
                />
                <Input
                  placeholder="Department"
                  value={newDept}
                  onChange={(e) => setNewDept(e.target.value)}
                  className="rounded-xl border-muted-foreground/20 flex-1"
                />
                <button
                  onClick={handleAddRole}
                  className="p-2 rounded-xl bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20 transition-colors"
                >
                  <Check className="w-4 h-4" />
                </button>
                <button
                  onClick={() => { setIsAdding(false); setNewName(""); setNewDept(""); }}
                  className="p-2 rounded-xl bg-rose-500/10 text-rose-500 hover:bg-rose-500/20 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {roles.map((role) => (
                <div
                  key={role.id}
                  className="group flex flex-col gap-3 p-5 rounded-2xl bg-muted/40 hover:bg-muted/60 transition-colors"
                >
                  {editingId === role.id ? (
                    // Edit mode
                    <div className="space-y-2">
                      <Input
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        className="rounded-xl border-muted-foreground/20 h-8 text-sm"
                        autoFocus
                      />
                      <Input
                        value={editDept}
                        onChange={(e) => setEditDept(e.target.value)}
                        className="rounded-xl border-muted-foreground/20 h-8 text-sm"
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleSaveEdit(role.id)}
                          className="flex-1 py-1.5 rounded-xl bg-emerald-500/10 text-emerald-600 text-xs font-black hover:bg-emerald-500/20 transition-colors flex items-center justify-center gap-1"
                        >
                          <Check className="w-3 h-3" /> Save
                        </button>
                        <button
                          onClick={handleCancelEdit}
                          className="flex-1 py-1.5 rounded-xl bg-rose-500/10 text-rose-500 text-xs font-black hover:bg-rose-500/20 transition-colors flex items-center justify-center gap-1"
                        >
                          <X className="w-3 h-3" /> Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    // View mode
                    <>
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-black text-foreground tracking-tight">{role.name}</p>
                          <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/40 mt-0.5">{role.department}</p>
                        </div>
                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => handleStartEdit(role)}
                            className="p-1.5 rounded-lg hover:bg-primary/10 text-muted-foreground hover:text-primary transition-colors"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDelete(role.id)}
                            className="p-1.5 rounded-lg hover:bg-rose-50 text-muted-foreground hover:text-rose-500 transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5 text-muted-foreground/50">
                        <Users className="w-3 h-3" />
                        <span className="text-[11px] font-bold">{role.staffCount} staff assigned</span>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
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