"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Building2,
  Users,
  BookOpen,
  Brain,
  Database,
  LayoutDashboard,
  Shield,
  Plus,
  Eye,
  Edit3,
  Ban,
  CheckCircle,
  XCircle,
  LogOut,
  ChevronRight,
  ArrowLeft,
  UserCheck,
  GraduationCap,
  Percent,
} from "lucide-react";

interface SuperAdminDashboardProps {
  onLogout: () => void;
}

interface Customer {
  id: string;
  companyName: string;
  amazonConnectId: string;
  llmApiKey: string;
  status: "active" | "inactive";
  primaryAdminEmail: string;
  region: string;
  numberOfAgents: number;
  licenseEndDate: string;
  enabledModules: {
    aiCoachingTier: "none" | "base" | "standard" | "advanced";
    training: boolean;
  };
  onboarding: {
    adminCreated: boolean;
    knowledgeBaseUploaded: boolean;
    trainingContentAdded: boolean;
    agentsOnboarded: boolean;
    firstTrainingCompleted: boolean;
  };
  agentsCount: number;
  trainingModulesCount: number;
}

const mockCustomers: Customer[] = [
  {
    id: "1",
    companyName: "Acme Corp",
    amazonConnectId: "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    llmApiKey: "sk-acme-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
    status: "active",
    primaryAdminEmail: "admin@acmecorp.com",
    region: "us-east-1",
    numberOfAgents: 45,
    licenseEndDate: "2025-12-31",
    enabledModules: {
      aiCoachingTier: "advanced",
      training: true,
    },
    onboarding: {
      adminCreated: true,
      knowledgeBaseUploaded: true,
      trainingContentAdded: true,
      agentsOnboarded: true,
      firstTrainingCompleted: true,
    },
    agentsCount: 45,
    trainingModulesCount: 12,
  },
  {
    id: "2",
    companyName: "Nova Support",
    amazonConnectId: "b2c3d4e5-f6a7-8901-bcde-f23456789012",
    llmApiKey: "sk-nova-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
    status: "active",
    primaryAdminEmail: "admin@novasupport.io",
    region: "eu-west-2",
    numberOfAgents: 28,
    licenseEndDate: "2025-09-30",
    enabledModules: {
      aiCoachingTier: "standard",
      training: true,
    },
    onboarding: {
      adminCreated: true,
      knowledgeBaseUploaded: false,
      trainingContentAdded: true,
      agentsOnboarded: true,
      firstTrainingCompleted: false,
    },
    agentsCount: 28,
    trainingModulesCount: 8,
  },
  {
    id: "3",
    companyName: "ZenRetail",
    amazonConnectId: "c3d4e5f6-a7b8-9012-cdef-345678901234",
    llmApiKey: "sk-zen-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
    status: "inactive",
    primaryAdminEmail: "admin@zenretail.com",
    region: "ap-southeast-1",
    numberOfAgents: 15,
    licenseEndDate: "2024-06-30",
    enabledModules: {
      aiCoachingTier: "base",
      training: true,
    },
    onboarding: {
      adminCreated: true,
      knowledgeBaseUploaded: true,
      trainingContentAdded: false,
      agentsOnboarded: false,
      firstTrainingCompleted: false,
    },
    agentsCount: 15,
    trainingModulesCount: 3,
  },
  {
    id: "4",
    companyName: "TechFlow Solutions",
    amazonConnectId: "d4e5f6a7-b8c9-0123-defa-456789012345",
    llmApiKey: "sk-tech-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
    status: "active",
    primaryAdminEmail: "admin@techflow.com",
    region: "us-west-2",
    numberOfAgents: 62,
    licenseEndDate: "2026-03-15",
    enabledModules: {
      aiCoachingTier: "advanced",
      training: true,
    },
    onboarding: {
      adminCreated: true,
      knowledgeBaseUploaded: true,
      trainingContentAdded: true,
      agentsOnboarded: true,
      firstTrainingCompleted: true,
    },
    agentsCount: 62,
    trainingModulesCount: 18,
  },
  {
    id: "5",
    companyName: "Global Services Inc",
    amazonConnectId: "e5f6a7b8-c9d0-1234-efab-567890123456",
    llmApiKey: "sk-global-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
    status: "active",
    primaryAdminEmail: "admin@globalservices.com",
    region: "eu-central-1",
    numberOfAgents: 35,
    licenseEndDate: "2025-08-20",
    enabledModules: {
      aiCoachingTier: "none",
      training: true,
    },
    onboarding: {
      adminCreated: true,
      knowledgeBaseUploaded: false,
      trainingContentAdded: true,
      agentsOnboarded: false,
      firstTrainingCompleted: false,
    },
    agentsCount: 0,
    trainingModulesCount: 5,
  },
];

const mockAdmins = [
  { name: "John Smith", email: "admin@acmecorp.com", company: "Acme Corp", lastLogin: "2 hours ago" },
  { name: "Sarah Connor", email: "admin@novasupport.io", company: "Nova Support", lastLogin: "1 day ago" },
  { name: "Mike Chen", email: "admin@zenretail.com", company: "ZenRetail", lastLogin: "5 days ago" },
  { name: "Emily Davis", email: "admin@techflow.com", company: "TechFlow Solutions", lastLogin: "3 hours ago" },
  { name: "Robert Wilson", email: "admin@globalservices.com", company: "Global Services Inc", lastLogin: "1 week ago" },
];

type ActiveSection = "overview" | "customers" | "access";

export function SuperAdminDashboard({ onLogout }: SuperAdminDashboardProps) {
  const [activeSection, setActiveSection] = useState<ActiveSection>("overview");
  const [customers, setCustomers] = useState<Customer[]>(mockCustomers);
  const [showCreateCustomer, setShowCreateCustomer] = useState(false);
  const [showCustomerProfile, setShowCustomerProfile] = useState<Customer | null>(null);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [showEditCustomer, setShowEditCustomer] = useState<Customer | null>(null);
  const [showStatusConfirm, setShowStatusConfirm] = useState<Customer | null>(null);

  const [newCustomer, setNewCustomer] = useState({
    companyName: "",
    primaryAdminEmail: "",
    amazonConnectInstanceId: "",
    llmApiKey: "",
    numberOfAgents: "",
    region: "",
    licenseEndDate: "",
    enabledModules: {
      aiCoachingTier: "none" as "none" | "base" | "standard" | "advanced",
      training: false,
    },
  });

  const totalAgents = customers.reduce((sum, c) => sum + c.agentsCount, 0);
  const totalTrainingModules = customers.reduce((sum, c) => sum + c.trainingModulesCount, 0);
  const customersWithKB = customers.filter(c => c.onboarding.knowledgeBaseUploaded).length;
  const customersWithActiveTraining = customers.filter(c => c.onboarding.trainingContentAdded && c.status === "active").length;
  const kbPercentage = Math.round((customersWithKB / customers.length) * 100);
  const trainingPercentage = Math.round((customersWithActiveTraining / customers.length) * 100);

  const handleCreateCustomer = () => {
    const newId = (customers.length + 1).toString();
    const customer: Customer = {
      id: newId,
      companyName: newCustomer.companyName,
      amazonConnectId: newCustomer.amazonConnectInstanceId,
      llmApiKey: newCustomer.llmApiKey,
      status: "active",
      primaryAdminEmail: newCustomer.primaryAdminEmail,
      region: newCustomer.region,
      numberOfAgents: parseInt(newCustomer.numberOfAgents) || 0,
      licenseEndDate: newCustomer.licenseEndDate,
      enabledModules: newCustomer.enabledModules,
      onboarding: {
        adminCreated: false,
        knowledgeBaseUploaded: false,
        trainingContentAdded: false,
        agentsOnboarded: false,
        firstTrainingCompleted: false,
      },
      agentsCount: parseInt(newCustomer.numberOfAgents) || 0,
      trainingModulesCount: 0,
    };
    setCustomers([...customers, customer]);
    setNewCustomer({
      companyName: "",
      primaryAdminEmail: "",
      amazonConnectInstanceId: "",
      llmApiKey: "",
      numberOfAgents: "",
      region: "",
      licenseEndDate: "",
      enabledModules: { aiCoachingTier: "none" as "none" | "base" | "standard" | "advanced", training: false },
    });
    setShowCreateCustomer(false);
    setShowSuccessDialog(true);
  };

  const handleConfirmStatusChange = () => {
    if (showStatusConfirm) {
      setCustomers(customers.map(c => 
        c.id === showStatusConfirm.id ? { ...c, status: c.status === "active" ? "inactive" : "active" } : c
      ));
      setShowStatusConfirm(null);
    }
  };

  const handleEditCustomer = () => {
    if (showEditCustomer) {
      setCustomers(customers.map(c => 
        c.id === showEditCustomer.id ? showEditCustomer : c
      ));
      setShowEditCustomer(null);
    }
  };

  const sidebarItems = [
    { id: "overview" as const, label: "Platform Overview", icon: LayoutDashboard },
    { id: "customers" as const, label: "Customers", icon: Building2 },
    { id: "access" as const, label: "Access & Roles", icon: Shield },
  ];

  const renderOnboardingChecklist = (customer: Customer) => {
    const items = [
      { label: "Admin created", completed: customer.onboarding.adminCreated },
      { label: "Knowledge base uploaded", completed: customer.onboarding.knowledgeBaseUploaded },
      { label: "Training content added", completed: customer.onboarding.trainingContentAdded },
      { label: "Agents onboarded", completed: customer.onboarding.agentsOnboarded },
      { label: "First training session completed", completed: customer.onboarding.firstTrainingCompleted },
    ];

    return (
      <div className="space-y-2">
        {items.map((item, index) => (
          <div key={index} className="flex items-center gap-2">
            {item.completed ? (
              <CheckCircle className="h-4 w-4 text-green-500" />
            ) : (
              <XCircle className="h-4 w-4 text-gray-300" />
            )}
            <span className={`text-sm ${item.completed ? "text-foreground" : "text-muted-foreground"}`}>
              {item.label}
            </span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="flex h-screen bg-background">
      <aside className="w-64 border-r bg-card flex flex-col">
        <div className="p-4 border-b">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center">
              <Shield className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-lg">Super Admin</h1>
              <p className="text-xs text-muted-foreground">OmniTrAina</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {sidebarItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                activeSection === item.id
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-muted text-muted-foreground hover:text-foreground"
              }`}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t">
          <Button variant="ghost" className="w-full justify-start" onClick={onLogout}>
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
      </aside>

      <main className="flex-1 overflow-auto">
        <header className="border-b bg-card px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold">
                {activeSection === "overview" && "Platform Overview"}
                {activeSection === "customers" && "Customer Management"}
                {activeSection === "access" && "Access & Roles"}
              </h2>
              <p className="text-sm text-muted-foreground">
                {activeSection === "overview" && "Monitor platform-wide metrics and usage"}
                {activeSection === "customers" && "Manage tenant organizations and their settings"}
                {activeSection === "access" && "View roles and permissions information"}
              </p>
            </div>
            <Badge variant="secondary" className="bg-indigo-100 text-indigo-800">
              Super Admin
            </Badge>
          </div>
        </header>

        <div className="p-6">
          {activeSection === "overview" && (
            <div className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
                    <Building2 className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{customers.length}</div>
                    <p className="text-xs text-muted-foreground">
                      {customers.filter(c => c.status === "active").length} active
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">Agents Onboarded</CardTitle>
                    <UserCheck className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{totalAgents}</div>
                    <p className="text-xs text-muted-foreground">Across all tenants</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">Training Modules</CardTitle>
                    <GraduationCap className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{totalTrainingModules}</div>
                    <p className="text-xs text-muted-foreground">Total created</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">KB Uploaded</CardTitle>
                    <Database className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{kbPercentage}%</div>
                    <p className="text-xs text-muted-foreground">
                      {customersWithKB} of {customers.length} customers
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">Active Training</CardTitle>
                    <Percent className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{trainingPercentage}%</div>
                    <p className="text-xs text-muted-foreground">
                      {customersWithActiveTraining} of {customers.length} customers
                    </p>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Recent Customer Activity</CardTitle>
                  <CardDescription>Latest updates from tenant organizations</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {customers.slice(0, 4).map((customer) => (
                      <div key={customer.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                            <Building2 className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <p className="font-medium">{customer.companyName}</p>
                            <p className="text-sm text-muted-foreground">{customer.region}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <p className="text-sm font-medium">{customer.agentsCount} agents</p>
                            <p className="text-xs text-muted-foreground">{customer.trainingModulesCount} modules</p>
                          </div>
                          <Badge variant={customer.status === "active" ? "default" : "secondary"}>
                            {customer.status}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeSection === "customers" && !showCustomerProfile && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-semibold">All Customers</h3>
                  <p className="text-sm text-muted-foreground">Manage tenant organizations</p>
                </div>
                <Button onClick={() => setShowCreateCustomer(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Customer
                </Button>
              </div>

              <Card>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Company Name</TableHead>
                      <TableHead>Amazon Connect ID</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Enabled Modules</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {customers.map((customer) => (
                      <TableRow key={customer.id}>
                        <TableCell className="font-medium">{customer.companyName}</TableCell>
                        <TableCell className="text-muted-foreground text-sm font-mono text-xs">{customer.amazonConnectId}</TableCell>
                        <TableCell>
                          <Badge variant={customer.status === "active" ? "default" : "secondary"}>
                            {customer.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-1 flex-wrap">
                            {customer.enabledModules.aiCoachingTier !== "none" && (
                              <Badge variant="outline" className="text-xs capitalize">AI Coaching ({customer.enabledModules.aiCoachingTier})</Badge>
                            )}
                            {customer.enabledModules.training && (
                              <Badge variant="outline" className="text-xs">AI Training</Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setShowCustomerProfile(customer)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => setShowEditCustomer(customer)}
                            >
                              <Edit3 className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setShowStatusConfirm(customer)}
                            >
                              <Ban className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Card>
            </div>
          )}

          {activeSection === "customers" && showCustomerProfile && (
            <div className="space-y-6">
              <Button
                variant="ghost"
                onClick={() => setShowCustomerProfile(null)}
                className="mb-4"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Customers
              </Button>

              <div className="grid gap-6 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Building2 className="h-5 w-5" />
                      Customer Profile
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid gap-4">
                      <div>
                        <Label className="text-muted-foreground">Company Name</Label>
                        <p className="font-medium">{showCustomerProfile.companyName}</p>
                      </div>
                      <div>
                        <Label className="text-muted-foreground">Amazon Connect ID</Label>
                        <p className="font-mono text-sm">{showCustomerProfile.amazonConnectId}</p>
                      </div>
                      <div>
                        <Label className="text-muted-foreground">Primary Admin</Label>
                        <p className="font-medium">{showCustomerProfile.primaryAdminEmail}</p>
                      </div>
                      <div>
                        <Label className="text-muted-foreground">Region</Label>
                        <p className="font-medium">{showCustomerProfile.region}</p>
                      </div>
                      <div>
                        <Label className="text-muted-foreground">Status</Label>
                        <Badge variant={showCustomerProfile.status === "active" ? "default" : "secondary"} className="mt-1">
                          {showCustomerProfile.status}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Subscribed Modules</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center gap-3 p-3 border rounded-lg">
                      <Brain className={`h-5 w-5 ${showCustomerProfile.enabledModules.aiCoachingTier !== "none" ? "text-green-500" : "text-gray-300"}`} />
                      <div className="flex-1">
                        <p className="font-medium">AI Coaching</p>
                        <p className="text-sm text-muted-foreground">
                          {showCustomerProfile.enabledModules.aiCoachingTier === "base" && "Consolidated daily feedback, message-by-message coaching, KB accuracy checks"}
                          {showCustomerProfile.enabledModules.aiCoachingTier === "standard" && "Base features + Advanced insights and recommendations"}
                          {showCustomerProfile.enabledModules.aiCoachingTier === "advanced" && "Standard features + Personalized coaching plans"}
                          {showCustomerProfile.enabledModules.aiCoachingTier === "none" && "No AI coaching features enabled"}
                        </p>
                      </div>
                      <Badge variant={showCustomerProfile.enabledModules.aiCoachingTier !== "none" ? "default" : "secondary"} className="capitalize">
                        {showCustomerProfile.enabledModules.aiCoachingTier === "none" ? "Disabled" : showCustomerProfile.enabledModules.aiCoachingTier}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-3 p-3 border rounded-lg">
                      <BookOpen className={`h-5 w-5 ${showCustomerProfile.enabledModules.training ? "text-green-500" : "text-gray-300"}`} />
                      <div className="flex-1">
                        <p className="font-medium">AI based Agent Training</p>
                        <p className="text-sm text-muted-foreground">Interactive training modules and assessments</p>
                      </div>
                      <Badge variant={showCustomerProfile.enabledModules.training ? "default" : "secondary"}>
                        {showCustomerProfile.enabledModules.training ? "Enabled" : "Disabled"}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>

                <Card className="md:col-span-2">
                  <CardHeader>
                    <CardTitle>Onboarding Readiness Checklist</CardTitle>
                    <CardDescription>Track customer setup progress</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-4 md:grid-cols-5">
                      {[
                        { label: "Admin created", completed: showCustomerProfile.onboarding.adminCreated },
                        { label: "Knowledge base uploaded", completed: showCustomerProfile.onboarding.knowledgeBaseUploaded },
                        { label: "Training content added", completed: showCustomerProfile.onboarding.trainingContentAdded },
                        { label: "Agents onboarded", completed: showCustomerProfile.onboarding.agentsOnboarded },
                        { label: "First training completed", completed: showCustomerProfile.onboarding.firstTrainingCompleted },
                      ].map((item, index) => (
                        <div
                          key={index}
                          className={`p-4 rounded-lg border text-center ${
                            item.completed ? "bg-green-50 border-green-200" : "bg-gray-50 border-gray-200"
                          }`}
                        >
                          {item.completed ? (
                            <CheckCircle className="h-8 w-8 text-green-500 mx-auto mb-2" />
                          ) : (
                            <XCircle className="h-8 w-8 text-gray-300 mx-auto mb-2" />
                          )}
                          <p className={`text-sm font-medium ${item.completed ? "text-green-700" : "text-gray-500"}`}>
                            {item.label}
                          </p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {activeSection === "access" && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    Super Admin Role
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground">
                    The Super Admin role has platform-wide access to manage all tenant organizations,
                    view aggregated metrics, and oversee the OmniTrAina platform operations.
                  </p>
                  <div className="grid gap-3 md:grid-cols-2">
                    <div className="p-3 border rounded-lg">
                      <p className="font-medium">Tenant Management</p>
                      <p className="text-sm text-muted-foreground">Create, view, edit, and suspend customer tenants</p>
                    </div>
                    <div className="p-3 border rounded-lg">
                      <p className="font-medium">Platform Metrics</p>
                      <p className="text-sm text-muted-foreground">View aggregated usage and adoption metrics</p>
                    </div>
                    <div className="p-3 border rounded-lg">
                      <p className="font-medium">Onboarding Oversight</p>
                      <p className="text-sm text-muted-foreground">Monitor customer onboarding progress</p>
                    </div>
                    <div className="p-3 border rounded-lg">
                      <p className="font-medium">Module Configuration</p>
                      <p className="text-sm text-muted-foreground">Enable/disable modules per tenant</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Customer Admins</CardTitle>
                  <CardDescription>Read-only view of tenant administrators</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Company</TableHead>
                        <TableHead>Last Login</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {mockAdmins.map((admin, index) => (
                        <TableRow key={index}>
                          <TableCell className="font-medium">{admin.name}</TableCell>
                          <TableCell>{admin.email}</TableCell>
                          <TableCell>{admin.company}</TableCell>
                          <TableCell className="text-muted-foreground">{admin.lastLogin}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </main>

      <Dialog open={showCreateCustomer} onOpenChange={setShowCreateCustomer}>
        <DialogContent className="sm:max-w-xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create New Customer</DialogTitle>
            <DialogDescription>Add a new tenant organization to the platform</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="companyName">Business Name</Label>
              <Input
                id="companyName"
                value={newCustomer.companyName}
                onChange={(e) => setNewCustomer({ ...newCustomer, companyName: e.target.value })}
                placeholder="Enter business name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="adminEmail">Email Address</Label>
              <Input
                id="adminEmail"
                type="email"
                value={newCustomer.primaryAdminEmail}
                onChange={(e) => setNewCustomer({ ...newCustomer, primaryAdminEmail: e.target.value })}
                placeholder="admin@company.com"
              />
              <p className="text-xs text-muted-foreground">An email will be sent with Admin Portal Credentials</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="connectInstanceId">Amazon Connect Instance ID</Label>
              <Input
                id="connectInstanceId"
                value={newCustomer.amazonConnectInstanceId}
                onChange={(e) => setNewCustomer({ ...newCustomer, amazonConnectInstanceId: e.target.value })}
                placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="llmApiKey">LLM API Key</Label>
              <Input
                id="llmApiKey"
                type="password"
                value={newCustomer.llmApiKey}
                onChange={(e) => setNewCustomer({ ...newCustomer, llmApiKey: e.target.value })}
                placeholder="sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="numberOfAgents">No. of Agents</Label>
                <Input
                  id="numberOfAgents"
                  type="number"
                  value={newCustomer.numberOfAgents}
                  onChange={(e) => setNewCustomer({ ...newCustomer, numberOfAgents: e.target.value })}
                  placeholder="e.g., 50"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="region">Region (Amazon Connect)</Label>
                <Select
                  value={newCustomer.region}
                  onValueChange={(value) => setNewCustomer({ ...newCustomer, region: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select region" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="us-east-1">US East (N. Virginia)</SelectItem>
                    <SelectItem value="us-west-2">US West (Oregon)</SelectItem>
                    <SelectItem value="eu-west-2">Europe (London)</SelectItem>
                    <SelectItem value="eu-central-1">Europe (Frankfurt)</SelectItem>
                    <SelectItem value="ap-southeast-1">Asia Pacific (Singapore)</SelectItem>
                    <SelectItem value="ap-southeast-2">Asia Pacific (Sydney)</SelectItem>
                    <SelectItem value="ap-northeast-1">Asia Pacific (Tokyo)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="licenseEndDate">License End Date</Label>
              <Input
                id="licenseEndDate"
                type="date"
                value={newCustomer.licenseEndDate}
                onChange={(e) => setNewCustomer({ ...newCustomer, licenseEndDate: e.target.value })}
              />
            </div>
            <div className="space-y-3">
              <Label>AI Coaching (select one)</Label>
              <div className="space-y-3 border rounded-lg p-3">
                <label className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${newCustomer.enabledModules.aiCoachingTier === "base" ? "border-primary bg-primary/5" : "border-gray-200 hover:bg-gray-50"}`}>
                  <input
                    type="radio"
                    name="aiCoachingTier"
                    value="base"
                    checked={newCustomer.enabledModules.aiCoachingTier === "base"}
                    onChange={() => setNewCustomer({ ...newCustomer, enabledModules: { ...newCustomer.enabledModules, aiCoachingTier: "base" } })}
                    className="mt-1"
                  />
                  <div className="flex-1">
                    <p className="font-medium">Base</p>
                    <ul className="text-xs text-muted-foreground mt-1 space-y-0.5">
                      <li>• Consolidated daily feedback per agent</li>
                      <li>• Message-by-message coaching: Included</li>
                      <li>• Knowledge Base accuracy checks: Included</li>
                    </ul>
                  </div>
                </label>
                <label className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${newCustomer.enabledModules.aiCoachingTier === "standard" ? "border-primary bg-primary/5" : "border-gray-200 hover:bg-gray-50"}`}>
                  <input
                    type="radio"
                    name="aiCoachingTier"
                    value="standard"
                    checked={newCustomer.enabledModules.aiCoachingTier === "standard"}
                    onChange={() => setNewCustomer({ ...newCustomer, enabledModules: { ...newCustomer.enabledModules, aiCoachingTier: "standard" } })}
                    className="mt-1"
                  />
                  <div className="flex-1">
                    <p className="font-medium">Standard</p>
                    <ul className="text-xs text-muted-foreground mt-1 space-y-0.5">
                      <li>• All Base features included</li>
                      <li>• Advanced insights and recommendations</li>
                    </ul>
                  </div>
                </label>
                <label className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${newCustomer.enabledModules.aiCoachingTier === "advanced" ? "border-primary bg-primary/5" : "border-gray-200 hover:bg-gray-50"}`}>
                  <input
                    type="radio"
                    name="aiCoachingTier"
                    value="advanced"
                    checked={newCustomer.enabledModules.aiCoachingTier === "advanced"}
                    onChange={() => setNewCustomer({ ...newCustomer, enabledModules: { ...newCustomer.enabledModules, aiCoachingTier: "advanced" } })}
                    className="mt-1"
                  />
                  <div className="flex-1">
                    <p className="font-medium">Advanced</p>
                    <ul className="text-xs text-muted-foreground mt-1 space-y-0.5">
                      <li>• All Standard features included</li>
                      <li>• Personalized coaching plans</li>
                    </ul>
                  </div>
                </label>
                <label className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${newCustomer.enabledModules.aiCoachingTier === "none" ? "border-primary bg-primary/5" : "border-gray-200 hover:bg-gray-50"}`}>
                  <input
                    type="radio"
                    name="aiCoachingTier"
                    value="none"
                    checked={newCustomer.enabledModules.aiCoachingTier === "none"}
                    onChange={() => setNewCustomer({ ...newCustomer, enabledModules: { ...newCustomer.enabledModules, aiCoachingTier: "none" } })}
                    className="mt-1"
                  />
                  <div className="flex-1">
                    <p className="font-medium">None</p>
                    <p className="text-xs text-muted-foreground mt-1">No AI Coaching features</p>
                  </div>
                </label>
              </div>
            </div>
            <div className="space-y-3">
              <Label>Additional Modules</Label>
              <div className="border rounded-lg p-3">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newCustomer.enabledModules.training}
                    onChange={() => setNewCustomer({ ...newCustomer, enabledModules: { ...newCustomer.enabledModules, training: !newCustomer.enabledModules.training } })}
                    className="h-4 w-4 rounded border-gray-300"
                  />
                  <div>
                    <p className="font-medium text-sm">AI based Agent Training</p>
                    <p className="text-xs text-muted-foreground">Interactive training modules and assessments</p>
                  </div>
                </label>
              </div>
            </div>
            {(newCustomer.enabledModules.aiCoachingTier !== "none" || newCustomer.enabledModules.training) && (
              <div className="bg-muted/50 rounded-lg p-3 space-y-1">
                <p className="text-sm font-medium">Selection Summary</p>
                <p className="text-sm text-muted-foreground">
                  AI Coaching: <span className="font-medium text-foreground capitalize">{newCustomer.enabledModules.aiCoachingTier === "none" ? "Not selected" : newCustomer.enabledModules.aiCoachingTier}</span>
                </p>
                <p className="text-sm text-muted-foreground">
                  Training: <span className="font-medium text-foreground">{newCustomer.enabledModules.training ? "Enabled" : "Not selected"}</span>
                </p>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreateCustomer(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleCreateCustomer}
              disabled={!newCustomer.companyName || !newCustomer.primaryAdminEmail || !newCustomer.region || !newCustomer.amazonConnectInstanceId}
            >
              Create Customer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              Customer Created Successfully
            </DialogTitle>
            <DialogDescription>
              The new customer has been added to the platform. They will receive an invitation email to set up their account.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button onClick={() => setShowSuccessDialog(false)}>
              Done
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!showStatusConfirm} onOpenChange={() => setShowStatusConfirm(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Confirm Status Change</DialogTitle>
            <DialogDescription>
              Are you sure you want to {showStatusConfirm?.status === "active" ? "deactivate" : "activate"} <span className="font-semibold">{showStatusConfirm?.companyName}</span>?
              {showStatusConfirm?.status === "active" 
                ? " This will suspend their access to the platform."
                : " This will restore their access to the platform."}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowStatusConfirm(null)}>
              Cancel
            </Button>
            <Button 
              variant={showStatusConfirm?.status === "active" ? "destructive" : "default"}
              onClick={handleConfirmStatusChange}
            >
              {showStatusConfirm?.status === "active" ? "Deactivate" : "Activate"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!showEditCustomer} onOpenChange={() => setShowEditCustomer(null)}>
        <DialogContent className="sm:max-w-xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Customer</DialogTitle>
            <DialogDescription>Update customer information</DialogDescription>
          </DialogHeader>
          {showEditCustomer && (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="editCompanyName">Business Name</Label>
                <Input
                  id="editCompanyName"
                  value={showEditCustomer.companyName}
                  onChange={(e) => setShowEditCustomer({ ...showEditCustomer, companyName: e.target.value })}
                  placeholder="Enter business name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="editAdminEmail">Email Address</Label>
                <Input
                  id="editAdminEmail"
                  type="email"
                  value={showEditCustomer.primaryAdminEmail}
                  onChange={(e) => setShowEditCustomer({ ...showEditCustomer, primaryAdminEmail: e.target.value })}
                  placeholder="admin@company.com"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="editConnectInstanceId">Amazon Connect Instance ID</Label>
                <Input
                  id="editConnectInstanceId"
                  value={showEditCustomer.amazonConnectId}
                  onChange={(e) => setShowEditCustomer({ ...showEditCustomer, amazonConnectId: e.target.value })}
                  placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="editLlmApiKey">LLM API Key</Label>
                <Input
                  id="editLlmApiKey"
                  type="password"
                  value={showEditCustomer.llmApiKey}
                  onChange={(e) => setShowEditCustomer({ ...showEditCustomer, llmApiKey: e.target.value })}
                  placeholder="sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="editNumberOfAgents">No. of Agents</Label>
                  <Input
                    id="editNumberOfAgents"
                    type="number"
                    value={showEditCustomer.numberOfAgents}
                    onChange={(e) => setShowEditCustomer({ ...showEditCustomer, numberOfAgents: parseInt(e.target.value) || 0 })}
                    placeholder="e.g., 50"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="editRegion">Region (Amazon Connect)</Label>
                  <Select
                    value={showEditCustomer.region}
                    onValueChange={(value) => setShowEditCustomer({ ...showEditCustomer, region: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select region" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="us-east-1">US East (N. Virginia)</SelectItem>
                      <SelectItem value="us-west-2">US West (Oregon)</SelectItem>
                      <SelectItem value="eu-west-2">Europe (London)</SelectItem>
                      <SelectItem value="eu-central-1">Europe (Frankfurt)</SelectItem>
                      <SelectItem value="ap-southeast-1">Asia Pacific (Singapore)</SelectItem>
                      <SelectItem value="ap-southeast-2">Asia Pacific (Sydney)</SelectItem>
                      <SelectItem value="ap-northeast-1">Asia Pacific (Tokyo)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="editLicenseEndDate">License End Date</Label>
                <Input
                  id="editLicenseEndDate"
                  type="date"
                  value={showEditCustomer.licenseEndDate}
                  onChange={(e) => setShowEditCustomer({ ...showEditCustomer, licenseEndDate: e.target.value })}
                />
              </div>
              <div className="space-y-3">
                <Label>AI Coaching (select one)</Label>
                <div className="space-y-3 border rounded-lg p-3">
                  <label className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${showEditCustomer.enabledModules.aiCoachingTier === "base" ? "border-primary bg-primary/5" : "border-gray-200 hover:bg-gray-50"}`}>
                    <input
                      type="radio"
                      name="editAiCoachingTier"
                      value="base"
                      checked={showEditCustomer.enabledModules.aiCoachingTier === "base"}
                      onChange={() => setShowEditCustomer({ ...showEditCustomer, enabledModules: { ...showEditCustomer.enabledModules, aiCoachingTier: "base" } })}
                      className="mt-1"
                    />
                    <div className="flex-1">
                      <p className="font-medium">Base</p>
                      <ul className="text-xs text-muted-foreground mt-1 space-y-0.5">
                        <li>• Consolidated daily feedback per agent</li>
                        <li>• Message-by-message coaching: Included</li>
                        <li>• Knowledge Base accuracy checks: Included</li>
                      </ul>
                    </div>
                  </label>
                  <label className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${showEditCustomer.enabledModules.aiCoachingTier === "standard" ? "border-primary bg-primary/5" : "border-gray-200 hover:bg-gray-50"}`}>
                    <input
                      type="radio"
                      name="editAiCoachingTier"
                      value="standard"
                      checked={showEditCustomer.enabledModules.aiCoachingTier === "standard"}
                      onChange={() => setShowEditCustomer({ ...showEditCustomer, enabledModules: { ...showEditCustomer.enabledModules, aiCoachingTier: "standard" } })}
                      className="mt-1"
                    />
                    <div className="flex-1">
                      <p className="font-medium">Standard</p>
                      <ul className="text-xs text-muted-foreground mt-1 space-y-0.5">
                        <li>• All Base features included</li>
                        <li>• Advanced insights and recommendations</li>
                      </ul>
                    </div>
                  </label>
                  <label className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${showEditCustomer.enabledModules.aiCoachingTier === "advanced" ? "border-primary bg-primary/5" : "border-gray-200 hover:bg-gray-50"}`}>
                    <input
                      type="radio"
                      name="editAiCoachingTier"
                      value="advanced"
                      checked={showEditCustomer.enabledModules.aiCoachingTier === "advanced"}
                      onChange={() => setShowEditCustomer({ ...showEditCustomer, enabledModules: { ...showEditCustomer.enabledModules, aiCoachingTier: "advanced" } })}
                      className="mt-1"
                    />
                    <div className="flex-1">
                      <p className="font-medium">Advanced</p>
                      <ul className="text-xs text-muted-foreground mt-1 space-y-0.5">
                        <li>• All Standard features included</li>
                        <li>• Personalized coaching plans</li>
                      </ul>
                    </div>
                  </label>
                  <label className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${showEditCustomer.enabledModules.aiCoachingTier === "none" ? "border-primary bg-primary/5" : "border-gray-200 hover:bg-gray-50"}`}>
                    <input
                      type="radio"
                      name="editAiCoachingTier"
                      value="none"
                      checked={showEditCustomer.enabledModules.aiCoachingTier === "none"}
                      onChange={() => setShowEditCustomer({ ...showEditCustomer, enabledModules: { ...showEditCustomer.enabledModules, aiCoachingTier: "none" } })}
                      className="mt-1"
                    />
                    <div className="flex-1">
                      <p className="font-medium">None</p>
                      <p className="text-xs text-muted-foreground mt-1">No AI Coaching features</p>
                    </div>
                  </label>
                </div>
              </div>
              <div className="space-y-3">
                <Label>Additional Modules</Label>
                <div className="border rounded-lg p-3">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={showEditCustomer.enabledModules.training}
                      onChange={() => setShowEditCustomer({ ...showEditCustomer, enabledModules: { ...showEditCustomer.enabledModules, training: !showEditCustomer.enabledModules.training } })}
                      className="h-4 w-4 rounded border-gray-300"
                    />
                    <div>
                      <p className="font-medium text-sm">AI based Agent Training</p>
                      <p className="text-xs text-muted-foreground">Interactive training modules and assessments</p>
                    </div>
                  </label>
                </div>
              </div>
              {(showEditCustomer.enabledModules.aiCoachingTier !== "none" || showEditCustomer.enabledModules.training) && (
                <div className="bg-muted/50 rounded-lg p-3 space-y-1">
                  <p className="text-sm font-medium">Selection Summary</p>
                  <p className="text-sm text-muted-foreground">
                    AI Coaching: <span className="font-medium text-foreground capitalize">{showEditCustomer.enabledModules.aiCoachingTier === "none" ? "Not selected" : showEditCustomer.enabledModules.aiCoachingTier}</span>
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Training: <span className="font-medium text-foreground">{showEditCustomer.enabledModules.training ? "Enabled" : "Not selected"}</span>
                  </p>
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditCustomer(null)}>
              Cancel
            </Button>
            <Button
              onClick={handleEditCustomer}
              disabled={!showEditCustomer?.companyName || !showEditCustomer?.primaryAdminEmail || !showEditCustomer?.region || !showEditCustomer?.amazonConnectId}
            >
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
