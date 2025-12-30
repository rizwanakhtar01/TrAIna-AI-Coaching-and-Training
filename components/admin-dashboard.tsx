"use client";

import type React from "react";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Bot,
  Plus,
  Upload,
  Edit,
  Trash2,
  LogOut,
  Target,
  CheckCircle,
  Clock,
  AlertCircle,
  Download,
  RefreshCw,
  Database,
  Brain,
  Activity,
  Network,
  Route,
  BarChart3,
  PieChart,
  ChevronLeft,
  ChevronRight,
  FileText,
  Lightbulb,
  Zap,
  Star,
  Users,
  CreditCard,
  Wrench,
  ShoppingCart,
  Settings,
  Play,
  Save,
  Check,
  Copy,
  UserPlus,
  Mail,
  Shield,
  Power,
  MoreHorizontal,
  UserMinus,
  Search,
  UsersRound,
  User,
} from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface AdminDashboardProps {
  onLogout: () => void;
}

// Enhanced interfaces for the Smart Agent Creation Wizard
interface AgentTemplate {
  id: string;
  name: string;
  category: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  suggestedFocusAreas: string[];
  suggestedCoachingStyle: string;
  instructionTemplate: InstructionTemplate;
}

interface InstructionTemplate {
  generalApproach: string;
  mustDoActions: string[];
  mustAvoidActions: string[];
  keyPhrases: {
    greeting: string[];
    empathy: string[];
    resolution: string[];
    closing: string[];
  };
  escalationRules: string[];
  complianceRequirements: string[];
}

interface UploadedDocument {
  id: string;
  name: string;
  size: string;
  type: "policy" | "procedure" | "script" | "faq" | "example";
  qualityScore: number;
  relevanceScore: number;
  analysisResults: {
    hasClearPolicies: boolean;
    hasExamples: boolean;
    hasEscalationRules: boolean;
    missingElements: string[];
  };
  suggestions: string[];
}

interface EnhancedAgentConfig {
  // Step 1: Quick Start
  useTemplate: boolean;
  selectedTemplate: string;

  // Step 2: Basic Config
  agentName: string;
  topicCategory: string;
  description: string;

  // Step 3: Documents
  documents: UploadedDocument[];

  // Step 4: Instructions
  instructions: InstructionTemplate;

  // Step 5: Test & Activate
  testResults: any[];
  readyToActivate: boolean;
}

// New interfaces for Overall LLM Agent (Orchestrator)
interface BusinessDocument {
  id: string;
  name: string;
  type: "pdf" | "docx" | "txt";
  size: string;
  uploadDate: string;
  status: "processing" | "ready" | "error";
  vectorEmbedded: boolean;
}

interface OrchestratorConfig {
  agentName: string;
  instructionSet: string;
  knowledgeSources: string[]; // document IDs
  isActive: boolean;
  lastUpdated: string;
  documentsCount: number;
}

interface RoutingAnalytics {
  totalContacts: number;
  routedToAgents: {
    agentName: string;
    count: number;
    percentage: number;
  }[];
  fallbackCases: {
    count: number;
    percentage: number;
  };
  intentDistribution: {
    intent: string;
    count: number;
    percentage: number;
  }[];
  dailyTrends: {
    date: string;
    totalContacts: number;
    routedSuccessfully: number;
    fallbacks: number;
  }[];
}

interface PlatformUser {
  id: string;
  fullName: string;
  email: string;
  role: "Agent" | "Supervisor" | "Admin";
  amazonConnectUserId: string;
  status: "Active" | "Inactive";
  createdAt: string;
}

interface TeamAssignment {
  supervisorId: string;
  agentIds: string[];
}

export function AdminDashboard({ onLogout }: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState("overview");
  const [isCreateWizardOpen, setIsCreateWizardOpen] = useState(false);
  const [wizardStep, setWizardStep] = useState(1);
  const [editingAgentId, setEditingAgentId] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string>
  >({});
  const [agentConfig, setAgentConfig] = useState<EnhancedAgentConfig>({
    useTemplate: false,
    selectedTemplate: "",
    agentName: "",
    topicCategory: "",
    description: "",
    documents: [],
    instructions: {
      generalApproach: "",
      mustDoActions: [],
      mustAvoidActions: [],
      keyPhrases: { greeting: [], empathy: [], resolution: [], closing: [] },
      escalationRules: [],
      complianceRequirements: [],
    },
    testResults: [],
    readyToActivate: false,
  });

  // Overall LLM Agent (Orchestrator) state
  const [businessDocuments, setBusinessDocuments] = useState<
    BusinessDocument[]
  >([]);
  const [orchestratorConfig, setOrchestratorConfig] =
    useState<OrchestratorConfig>({
      agentName: "OmniHive Orchestrator",
      instructionSet:
        "Always comply with refund policies first. Route contacts to the most appropriate specialized agent based on intent detection.",
      knowledgeSources: [],
      isActive: false,
      lastUpdated: new Date().toISOString(),
      documentsCount: 0,
    });
  const [isUploadingDoc, setIsUploadingDoc] = useState(false);
  const [documentToDelete, setDocumentToDelete] =
    useState<BusinessDocument | null>(null);

  // User Management State
  const [isCreateUserOpen, setIsCreateUserOpen] = useState(false);
  const [showUserCreatedSuccess, setShowUserCreatedSuccess] = useState(false);
  const [newUser, setNewUser] = useState({
    fullName: "",
    email: "",
    role: "Agent" as "Agent" | "Supervisor" | "Admin",
    amazonConnectUserId: "",
  });
  const [generatedPassword, setGeneratedPassword] = useState("");
  const [copiedPassword, setCopiedPassword] = useState(false);
  const [userToDelete, setUserToDelete] = useState<PlatformUser | null>(null);
  const [userToToggle, setUserToToggle] = useState<PlatformUser | null>(null);
  const [isEditUserOpen, setIsEditUserOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<PlatformUser | null>(null);
  const [users, setUsers] = useState<PlatformUser[]>([
    {
      id: "usr_001",
      fullName: "Sarah Johnson",
      email: "sarah.johnson@company.com",
      role: "Agent",
      amazonConnectUserId: "AC-001-SJ",
      status: "Active",
      createdAt: "2024-01-15",
    },
    {
      id: "usr_002",
      fullName: "Michael Chen",
      email: "michael.chen@company.com",
      role: "Agent",
      amazonConnectUserId: "AC-002-MC",
      status: "Active",
      createdAt: "2024-01-18",
    },
    {
      id: "usr_003",
      fullName: "Emily Rodriguez",
      email: "emily.rodriguez@company.com",
      role: "Supervisor",
      amazonConnectUserId: "AC-003-ER",
      status: "Active",
      createdAt: "2024-01-10",
    },
    {
      id: "usr_004",
      fullName: "David Kim",
      email: "david.kim@company.com",
      role: "Agent",
      amazonConnectUserId: "AC-004-DK",
      status: "Inactive",
      createdAt: "2024-02-01",
    },
    {
      id: "usr_005",
      fullName: "Jessica Thompson",
      email: "jessica.thompson@company.com",
      role: "Admin",
      amazonConnectUserId: "AC-005-JT",
      status: "Active",
      createdAt: "2024-01-05",
    },
    {
      id: "usr_006",
      fullName: "Robert Martinez",
      email: "robert.martinez@company.com",
      role: "Agent",
      amazonConnectUserId: "AC-006-RM",
      status: "Active",
      createdAt: "2024-02-05",
    },
    {
      id: "usr_007",
      fullName: "Amanda Wilson",
      email: "amanda.wilson@company.com",
      role: "Supervisor",
      amazonConnectUserId: "AC-007-AW",
      status: "Active",
      createdAt: "2024-01-12",
    },
    {
      id: "usr_008",
      fullName: "James Brown",
      email: "james.brown@company.com",
      role: "Agent",
      amazonConnectUserId: "AC-008-JB",
      status: "Active",
      createdAt: "2024-02-10",
    },
    {
      id: "usr_009",
      fullName: "Lisa Anderson",
      email: "lisa.anderson@company.com",
      role: "Agent",
      amazonConnectUserId: "AC-009-LA",
      status: "Active",
      createdAt: "2024-02-15",
    },
  ]);

  // Bulk Import State
  interface CsvValidationIssue {
    row: number;
    field: string;
    message: string;
    type: "error" | "warning";
  }
  interface CsvUserRow {
    fullName: string;
    email: string;
    role: string;
    amazonConnectUserId: string;
    isValid: boolean;
    hasWarning: boolean;
  }
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [importStep, setImportStep] = useState<
    "upload" | "validation" | "success"
  >("upload");
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [csvData, setCsvData] = useState<CsvUserRow[]>([]);
  const [validationIssues, setValidationIssues] = useState<
    CsvValidationIssue[]
  >([]);
  const [isProcessingCsv, setIsProcessingCsv] = useState(false);
  const [importedCount, setImportedCount] = useState(0);
  const [isDraggingCsv, setIsDraggingCsv] = useState(false);

  // Team Management State
  interface Team {
    id: string;
    name: string;
    supervisorId: string;
    agentIds: string[];
  }
  const [teams, setTeams] = useState<Team[]>([
    { id: "team_001", name: "Billing Support Team", supervisorId: "usr_003", agentIds: ["usr_001", "usr_002"] },
    { id: "team_002", name: "Technical Support Team", supervisorId: "usr_007", agentIds: ["usr_006", "usr_008"] },
  ]);
  const [teamListSearchQuery, setTeamListSearchQuery] = useState("");
  const [isCreateTeamOpen, setIsCreateTeamOpen] = useState(false);
  const [editingTeam, setEditingTeam] = useState<Team | null>(null);
  const [newTeamName, setNewTeamName] = useState("");
  const [newTeamSupervisorId, setNewTeamSupervisorId] = useState("");
  const [newTeamAgentIds, setNewTeamAgentIds] = useState<string[]>([]);
  const [createTeamAgentSearch, setCreateTeamAgentSearch] = useState("");

  // Sample routing analytics data (in a real app, this would come from API)
  const routingAnalytics: RoutingAnalytics = {
    totalContacts: 1247,
    routedToAgents: [
      { agentName: "Billing Support", count: 423, percentage: 33.9 },
      { agentName: "Technical Support", count: 312, percentage: 25.0 },
      { agentName: "Account Management", count: 198, percentage: 15.9 },
      { agentName: "Sales Support", count: 156, percentage: 12.5 },
    ],
    fallbackCases: { count: 158, percentage: 12.7 },
    intentDistribution: [
      { intent: "Billing Inquiry", count: 423, percentage: 33.9 },
      { intent: "Technical Issue", count: 312, percentage: 25.0 },
      { intent: "Account Changes", count: 198, percentage: 15.9 },
      { intent: "Sales Question", count: 156, percentage: 12.5 },
      { intent: "General Support", count: 158, percentage: 12.7 },
    ],
    dailyTrends: [
      {
        date: "2024-01-01",
        totalContacts: 89,
        routedSuccessfully: 78,
        fallbacks: 11,
      },
      {
        date: "2024-01-02",
        totalContacts: 92,
        routedSuccessfully: 81,
        fallbacks: 11,
      },
      {
        date: "2024-01-03",
        totalContacts: 87,
        routedSuccessfully: 76,
        fallbacks: 11,
      },
      {
        date: "2024-01-04",
        totalContacts: 95,
        routedSuccessfully: 83,
        fallbacks: 12,
      },
      {
        date: "2024-01-05",
        totalContacts: 98,
        routedSuccessfully: 86,
        fallbacks: 12,
      },
      {
        date: "2024-01-06",
        totalContacts: 103,
        routedSuccessfully: 91,
        fallbacks: 12,
      },
      {
        date: "2024-01-07",
        totalContacts: 91,
        routedSuccessfully: 80,
        fallbacks: 11,
      },
    ],
  };

  // Helper functions for orchestrator
  const handleBusinessDocumentUpload = (files: File[]) => {
    setIsUploadingDoc(true);

    // Simulate document processing
    setTimeout(() => {
      const newDocs: BusinessDocument[] = files.map((file) => ({
        id: Math.random().toString(36).substr(2, 9),
        name: file.name,
        type: file.name.endsWith(".pdf")
          ? "pdf"
          : file.name.endsWith(".docx")
            ? "docx"
            : "txt",
        size: (file.size / 1024).toFixed(1) + " KB",
        uploadDate: new Date().toLocaleDateString(),
        status: "processing",
        vectorEmbedded: false,
      }));

      setBusinessDocuments((prev) => [...prev, ...newDocs]);

      // Simulate processing completion
      setTimeout(() => {
        setBusinessDocuments((prev) =>
          prev.map((doc) =>
            newDocs.find((newDoc) => newDoc.id === doc.id)
              ? { ...doc, status: "ready", vectorEmbedded: true }
              : doc,
          ),
        );
        setOrchestratorConfig((prev) => ({
          ...prev,
          documentsCount: prev.documentsCount + newDocs.length,
          knowledgeSources: [
            ...prev.knowledgeSources,
            ...newDocs.map((doc) => doc.id),
          ],
          lastUpdated: new Date().toISOString(),
        }));
      }, 2000);

      setIsUploadingDoc(false);
    }, 1000);
  };

  const removeBusinessDocument = (docId: string) => {
    setBusinessDocuments((prev) => prev.filter((doc) => doc.id !== docId));
    setOrchestratorConfig((prev) => ({
      ...prev,
      documentsCount: prev.documentsCount - 1,
      knowledgeSources: prev.knowledgeSources.filter((id) => id !== docId),
      lastUpdated: new Date().toISOString(),
    }));
  };

  const saveOrchestratorConfig = () => {
    setOrchestratorConfig((prev) => ({
      ...prev,
      lastUpdated: new Date().toISOString(),
    }));
    // In real app, this would save to backend
    console.log("Orchestrator config saved:", orchestratorConfig);
  };

  const toggleOrchestratorStatus = () => {
    setOrchestratorConfig((prev) => ({
      ...prev,
      isActive: !prev.isActive,
      lastUpdated: new Date().toISOString(),
    }));
  };

  // User Management Helper Functions
  const generatePassword = () => {
    const chars =
      "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789!@#$%";
    let password = "";
    for (let i = 0; i < 12; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
  };

  const handleCreateUserOpen = () => {
    setNewUser({
      fullName: "",
      email: "",
      role: "Agent",
      amazonConnectUserId: "",
    });
    setGeneratedPassword(generatePassword());
    setCopiedPassword(false);
    setShowUserCreatedSuccess(false);
    setIsCreateUserOpen(true);
  };

  const handleCopyPassword = () => {
    navigator.clipboard.writeText(generatedPassword);
    setCopiedPassword(true);
    setTimeout(() => setCopiedPassword(false), 2000);
  };

  const handleCreateUser = () => {
    const newUserData: PlatformUser = {
      id: `usr_${Math.random().toString(36).substr(2, 9)}`,
      fullName: newUser.fullName,
      email: newUser.email,
      role: newUser.role,
      amazonConnectUserId: newUser.amazonConnectUserId,
      status: "Active",
      createdAt: new Date().toISOString().split("T")[0],
    };
    setUsers((prev) => [...prev, newUserData]);
    setShowUserCreatedSuccess(true);
  };

  const handleDeleteUser = () => {
    if (userToDelete) {
      setUsers((prev) => prev.filter((user) => user.id !== userToDelete.id));
      setUserToDelete(null);
    }
  };

  const handleToggleUserStatus = () => {
    if (userToToggle) {
      setUsers((prev) =>
        prev.map((user) =>
          user.id === userToToggle.id
            ? {
                ...user,
                status: user.status === "Active" ? "Inactive" : "Active",
              }
            : user,
        ),
      );
      setUserToToggle(null);
    }
  };

  const handleEditUserOpen = (user: PlatformUser) => {
    setEditingUser(user);
    setIsEditUserOpen(true);
  };

  const handleSaveEditUser = () => {
    if (editingUser) {
      setUsers((prev) =>
        prev.map((user) =>
          user.id === editingUser.id ? editingUser : user,
        ),
      );
      setIsEditUserOpen(false);
      setEditingUser(null);
    }
  };

  // Bulk Import Helper Functions
  const downloadCsvTemplate = () => {
    const template =
      "Full Name,Email,Role,Amazon Connect User ID\nJohn Doe,john.doe@company.com,Agent,AC-001-JD\nJane Smith,jane.smith@company.com,Supervisor,";
    const blob = new Blob([template], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "user_import_template.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const parseCsvLine = (line: string): string[] => {
    const result: string[] = [];
    let current = "";
    let inQuotes = false;
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      if (char === '"') {
        if (inQuotes && line[i + 1] === '"') {
          current += '"';
          i++;
        } else {
          inQuotes = !inQuotes;
        }
      } else if (char === "," && !inQuotes) {
        result.push(current.trim());
        current = "";
      } else {
        current += char;
      }
    }
    result.push(current.trim());
    return result;
  };

  const parseCsvFile = async (file: File) => {
    setIsProcessingCsv(true);
    try {
      const text = await file.text();
      const lines = text.split("\n").filter((line) => line.trim() !== "");
      const issues: CsvValidationIssue[] = [];
      const parsedRows: CsvUserRow[] = [];
      const existingEmails = users.map((u) => u.email.toLowerCase());
      const seenEmails = new Set<string>();

      for (let i = 1; i < lines.length; i++) {
        const values = parseCsvLine(lines[i]);
        const [fullName, email, role, amazonConnectUserId] = values;
        let isValid = true;
        let hasWarning = false;

        if (!fullName || fullName.trim() === "") {
          issues.push({
            row: i + 1,
            field: "Full Name",
            message: "Full Name is required",
            type: "error",
          });
          isValid = false;
        }

        if (!email || email.trim() === "") {
          issues.push({
            row: i + 1,
            field: "Email",
            message: "Email is required",
            type: "error",
          });
          isValid = false;
        } else if (!validateEmail(email)) {
          issues.push({
            row: i + 1,
            field: "Email",
            message: "Invalid email format",
            type: "error",
          });
          isValid = false;
        } else if (existingEmails.includes(email.toLowerCase())) {
          issues.push({
            row: i + 1,
            field: "Email",
            message: "Email already exists in the system",
            type: "error",
          });
          isValid = false;
        } else if (seenEmails.has(email.toLowerCase())) {
          issues.push({
            row: i + 1,
            field: "Email",
            message: "Duplicate email in CSV file",
            type: "error",
          });
          isValid = false;
        } else {
          seenEmails.add(email.toLowerCase());
        }

        const validRoles = ["Agent", "Supervisor", "Admin"];
        if (!role || !validRoles.includes(role)) {
          issues.push({
            row: i + 1,
            field: "Role",
            message: `Role must be one of: ${validRoles.join(", ")}`,
            type: "error",
          });
          isValid = false;
        }

        if (!amazonConnectUserId || amazonConnectUserId.trim() === "") {
          issues.push({
            row: i + 1,
            field: "Amazon Connect User ID",
            message: "Amazon Connect User ID is missing (will use default)",
            type: "warning",
          });
          hasWarning = true;
        }

        parsedRows.push({
          fullName: fullName || "",
          email: email || "",
          role: role || "",
          amazonConnectUserId: amazonConnectUserId || "",
          isValid,
          hasWarning,
        });
      }

      setCsvData(parsedRows);
      setValidationIssues(issues);
      setImportStep("validation");
    } catch (error) {
      alert(
        "Error parsing CSV file. Please check the file format and try again.",
      );
    } finally {
      setIsProcessingCsv(false);
    }
  };

  const handleCsvFileSelect = (file: File) => {
    if (file.size > 5 * 1024 * 1024) {
      alert("File size must be less than 5MB");
      return;
    }
    if (!file.name.endsWith(".csv")) {
      alert("Please upload a CSV file");
      return;
    }
    setCsvFile(file);
    parseCsvFile(file);
  };

  const handleImportUsers = () => {
    const validUsers = csvData.filter((row) => row.isValid);
    const newUsers: PlatformUser[] = validUsers.map((row) => ({
      id: `usr_${Math.random().toString(36).substr(2, 9)}`,
      fullName: row.fullName,
      email: row.email,
      role: row.role as "Agent" | "Supervisor" | "Admin",
      amazonConnectUserId:
        row.amazonConnectUserId ||
        `AC-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
      status: "Active" as const,
      createdAt: new Date().toISOString().split("T")[0],
    }));
    setUsers((prev) => [...prev, ...newUsers]);
    setImportedCount(newUsers.length);
    setImportStep("success");
  };

  const resetImportModal = () => {
    setIsImportModalOpen(false);
    setImportStep("upload");
    setCsvFile(null);
    setCsvData([]);
    setValidationIssues([]);
    setImportedCount(0);
  };

  const getValidCount = () => csvData.filter((r) => r.isValid).length;
  const getWarningCount = () =>
    csvData.filter((r) => r.isValid && r.hasWarning).length;
  const getErrorCount = () => csvData.filter((r) => !r.isValid).length;

  // Team Management Helper Functions
  const getSupervisors = () =>
    users.filter((u) => u.role === "Supervisor" && u.status === "Active");

  const getAgents = () =>
    users.filter((u) => u.role === "Agent" && u.status === "Active");

  const getFilteredTeams = () => {
    if (!teamListSearchQuery) return teams;
    const query = teamListSearchQuery.toLowerCase();
    return teams.filter((team) => {
      const supervisor = users.find((u) => u.id === team.supervisorId);
      return (
        team.name.toLowerCase().includes(query) ||
        (supervisor && supervisor.fullName.toLowerCase().includes(query))
      );
    });
  };

  const getSupervisorName = (supervisorId: string) => {
    const supervisor = users.find((u) => u.id === supervisorId);
    return supervisor ? supervisor.fullName : "Unknown";
  };

  const getFilteredAgentsForCreate = () => {
    const agents = getAgents();
    if (!createTeamAgentSearch) return agents;
    const query = createTeamAgentSearch.toLowerCase();
    return agents.filter(
      (agent) =>
        agent.fullName.toLowerCase().includes(query) ||
        agent.email.toLowerCase().includes(query)
    );
  };

  const handleOpenCreateTeam = () => {
    setEditingTeam(null);
    setNewTeamName("");
    setNewTeamSupervisorId("");
    setNewTeamAgentIds([]);
    setCreateTeamAgentSearch("");
    setIsCreateTeamOpen(true);
  };

  const handleOpenEditTeam = (team: Team) => {
    setEditingTeam(team);
    setNewTeamName(team.name);
    setNewTeamSupervisorId(team.supervisorId);
    setNewTeamAgentIds([...team.agentIds]);
    setCreateTeamAgentSearch("");
    setIsCreateTeamOpen(true);
  };

  const handleToggleAgent = (agentId: string) => {
    setNewTeamAgentIds((prev) =>
      prev.includes(agentId)
        ? prev.filter((id) => id !== agentId)
        : [...prev, agentId]
    );
  };

  const handleSaveTeam = () => {
    if (!newTeamName.trim() || !newTeamSupervisorId) return;

    if (editingTeam) {
      setTeams((prev) =>
        prev.map((t) =>
          t.id === editingTeam.id
            ? { ...t, name: newTeamName.trim(), supervisorId: newTeamSupervisorId, agentIds: newTeamAgentIds }
            : t
        )
      );
    } else {
      const newTeam: Team = {
        id: `team_${Date.now()}`,
        name: newTeamName.trim(),
        supervisorId: newTeamSupervisorId,
        agentIds: newTeamAgentIds,
      };
      setTeams((prev) => [...prev, newTeam]);
    }

    setIsCreateTeamOpen(false);
    setEditingTeam(null);
    setNewTeamName("");
    setNewTeamSupervisorId("");
    setNewTeamAgentIds([]);
  };

  // Agent Templates
  const agentTemplates: AgentTemplate[] = [
    {
      id: "billing",
      name: "Billing & Payments",
      category: "Financial Services",
      description:
        "Handle billing inquiries, payment issues, and subscription management",
      icon: CreditCard,
      suggestedFocusAreas: [
        "Payment processing",
        "Billing disputes",
        "Subscription changes",
        "Refund policies",
      ],
      suggestedCoachingStyle: "Empathetic but firm, policy-focused",
      instructionTemplate: {
        generalApproach:
          "Agents should prioritize accuracy and empathy when handling billing inquiries. Always verify customer identity first and explain charges clearly.",
        mustDoActions: [
          "Verify customer identity before discussing account details",
          "Explain all charges clearly and provide itemized breakdown",
          "Offer payment plans proactively for large balances",
          "Document all changes made to customer accounts",
          "Provide clear follow-up timeline for any pending actions",
        ],
        mustAvoidActions: [
          "Never promise refunds without proper authorization",
          "Do not discuss other customers' billing information",
          "Avoid using technical payment processing jargon",
          "Do not waive fees without supervisor approval",
        ],
        keyPhrases: {
          greeting: [
            "I'd be happy to help with your billing inquiry",
            "Let me review your account details",
          ],
          empathy: [
            "I understand your concern about these charges",
            "I can see why this would be confusing",
          ],
          resolution: [
            "Here's what I can do to resolve this",
            "Let me process this adjustment for you",
          ],
          closing: [
            "Is there anything else about your billing I can clarify?",
            "Your account has been updated successfully",
          ],
        },
        escalationRules: [
          "Disputes over $500 require supervisor approval",
          "Fraud claims must be escalated immediately",
          "Legal concerns mentioned by customer",
        ],
        complianceRequirements: [
          "PCI compliance for payment data handling",
          "Document all fee waivers and credits applied",
          "Maintain audit trail for account changes",
        ],
      },
    },
    {
      id: "technical",
      name: "Technical Support",
      category: "Product Support",
      description: "Provide technical assistance and troubleshooting guidance",
      icon: Wrench,
      suggestedFocusAreas: [
        "Troubleshooting",
        "Product features",
        "Integration support",
        "Bug reporting",
      ],
      suggestedCoachingStyle: "Patient and methodical, solution-oriented",
      instructionTemplate: {
        generalApproach:
          "Focus on systematic troubleshooting and clear step-by-step guidance. Always confirm customer understanding before proceeding.",
        mustDoActions: [
          "Gather detailed information about the issue",
          "Follow systematic troubleshooting steps",
          "Provide clear, step-by-step instructions",
          "Confirm each step is completed before proceeding",
          "Document resolution for knowledge base",
        ],
        mustAvoidActions: [
          "Do not skip diagnostic steps",
          "Avoid technical jargon without explanation",
          "Never assume customer technical expertise",
          "Do not provide workarounds for security features",
        ],
        keyPhrases: {
          greeting: [
            "I'll help you resolve this technical issue",
            "Let's work through this step by step",
          ],
          empathy: [
            "Technical issues can be frustrating",
            "I understand this is affecting your workflow",
          ],
          resolution: [
            "Let's try this solution",
            "This should resolve the issue",
          ],
          closing: [
            "Is everything working as expected now?",
            "Feel free to contact us if you need further assistance",
          ],
        },
        escalationRules: [
          "Hardware failures require level 2 support",
          "Security vulnerabilities need immediate escalation",
          "Product bugs affecting multiple customers",
        ],
        complianceRequirements: [
          "Follow security protocols for account access",
          "Document all troubleshooting steps taken",
          "Maintain customer data confidentiality",
        ],
      },
    },
    {
      id: "sales",
      name: "Sales & Product Info",
      category: "Sales Support",
      description: "Assist with product information and sales inquiries",
      icon: ShoppingCart,
      suggestedFocusAreas: [
        "Product features",
        "Pricing information",
        "Upselling",
        "Demo scheduling",
      ],
      suggestedCoachingStyle: "Consultative and informative, value-focused",
      instructionTemplate: {
        generalApproach:
          "Focus on understanding customer needs and matching them with appropriate solutions. Always prioritize value over features.",
        mustDoActions: [
          "Understand customer use case and requirements",
          "Present solutions that match customer needs",
          "Provide accurate pricing and feature information",
          "Offer demos or trials when appropriate",
          "Follow up on qualified leads",
        ],
        mustAvoidActions: [
          "Do not oversell features customer doesn't need",
          "Avoid pressure tactics or urgency without cause",
          "Never promise features not yet available",
          "Do not discount without authorization",
        ],
        keyPhrases: {
          greeting: [
            "I'd love to help you find the right solution",
            "Let me understand your requirements",
          ],
          empathy: [
            "I understand you want to make the right choice",
            "Finding the right fit is important",
          ],
          resolution: [
            "Based on your needs, I'd recommend",
            "This solution would address your requirements",
          ],
          closing: [
            "Would you like to see a demo?",
            "I'll send you the information we discussed",
          ],
        },
        escalationRules: [
          "Enterprise deals over $10,000 require sales manager",
          "Custom pricing requests need approval",
          "Competitive displacement situations",
        ],
        complianceRequirements: [
          "Maintain accurate lead tracking",
          "Follow GDPR guidelines for prospect data",
          "Document all pricing quotes provided",
        ],
      },
    },
    {
      id: "account",
      name: "Account Management",
      category: "Customer Success",
      description:
        "Handle account changes, upgrades, and general account inquiries",
      icon: Users,
      suggestedFocusAreas: [
        "Account updates",
        "Service changes",
        "User management",
        "Renewals",
      ],
      suggestedCoachingStyle:
        "Professional and efficient, relationship-focused",
      instructionTemplate: {
        generalApproach:
          "Prioritize customer satisfaction and long-term relationship building. Be proactive about identifying expansion opportunities.",
        mustDoActions: [
          "Verify account ownership before making changes",
          "Explain impact of any account modifications",
          "Identify opportunities for account growth",
          "Ensure smooth implementation of changes",
          "Follow up to confirm satisfaction",
        ],
        mustAvoidActions: [
          "Do not make account changes without proper verification",
          "Avoid downgrading without understanding reasons",
          "Never make promises about future product development",
          "Do not bypass security protocols",
        ],
        keyPhrases: {
          greeting: [
            "I'll help you with your account updates",
            "Let me review your current configuration",
          ],
          empathy: [
            "I want to make sure this works for your team",
            "Your account setup is important to us",
          ],
          resolution: [
            "I'll implement these changes for you",
            "This will optimize your account setup",
          ],
          closing: [
            "Your account has been updated successfully",
            "Let me know if you need any other adjustments",
          ],
        },
        escalationRules: [
          "Account downgrades require retention specialist",
          "Security concerns need immediate attention",
          "Bulk user changes over 100 users",
        ],
        complianceRequirements: [
          "Maintain detailed change logs",
          "Follow data retention policies",
          "Ensure proper authorization for account changes",
        ],
      },
    },
  ];

  // AI agents list
  const [aiAgents, setAiAgents] = useState([
    {
      id: "agent-001",
      intentName: "Refunds & Returns",
      description: "Handles customer refund requests and return processing",
      status: "active",
      lastUpdated: "2024-03-15",
      knowledgeBaseSize: "2.3 MB",
      trainingAccuracy: 94,
      usageCount: 1247,
    },
    {
      id: "agent-002",
      intentName: "Billing Inquiries",
      description: "Assists with billing questions and payment issues",
      status: "active",
      lastUpdated: "2024-03-14",
      knowledgeBaseSize: "1.8 MB",
      trainingAccuracy: 91,
      usageCount: 892,
    },
    {
      id: "agent-003",
      intentName: "Product Support",
      description: "Provides technical support and product guidance",
      status: "training",
      lastUpdated: "2024-03-16",
      knowledgeBaseSize: "3.1 MB",
      trainingAccuracy: 87,
      usageCount: 634,
    },
    {
      id: "agent-004",
      intentName: "Account Management",
      description: "Handles account changes and subscription management",
      status: "inactive",
      lastUpdated: "2024-03-10",
      knowledgeBaseSize: "1.5 MB",
      trainingAccuracy: 89,
      usageCount: 423,
    },
  ]);

  const systemStats = {
    totalAgents: aiAgents.length,
    activeAgents: aiAgents.filter((a) => a.status === "active").length,
    totalInteractions: aiAgents.reduce(
      (sum, agent) => sum + agent.usageCount,
      0,
    ),
    avgAccuracy: Math.round(
      aiAgents.reduce((sum, agent) => sum + agent.trainingAccuracy, 0) /
        aiAgents.length,
    ),
  };

  const handleCreateAgent = () => {
    // Handle agent creation logic here
    console.log("Creating new AI agent:", agentConfig);
    if (editingAgentId) {
      setAiAgents(
        aiAgents.map((a) =>
          a.id === editingAgentId
            ? {
                ...a,
                intentName: agentConfig.agentName || "Untitled Agent",
                description: agentConfig.description || "",
                lastUpdated: new Date().toISOString().slice(0, 10),
              }
            : a,
        ),
      );
    } else {
      // Append to agent list
      setAiAgents([
        ...aiAgents,
        {
          id: `agent-${Date.now()}`,
          intentName: agentConfig.agentName || "Untitled Agent",
          description: agentConfig.description || "",
          status: "inactive",
          lastUpdated: new Date().toISOString().slice(0, 10),
          knowledgeBaseSize: `${agentConfig.documents.length > 0 ? agentConfig.documents.length : 0} doc(s)`,
          trainingAccuracy: 0,
          usageCount: 0,
        },
      ]);
    }
    setIsCreateWizardOpen(false);
    setWizardStep(1);
    setEditingAgentId(null);
    setAgentConfig({
      useTemplate: false,
      selectedTemplate: "",
      agentName: "",
      topicCategory: "",
      description: "",
      documents: [],
      instructions: {
        generalApproach: "",
        mustDoActions: [],
        mustAvoidActions: [],
        keyPhrases: { greeting: [], empathy: [], resolution: [], closing: [] },
        escalationRules: [],
        complianceRequirements: [],
      },
      testResults: [],
      readyToActivate: false,
    });
  };

  const startEditAgent = (agentId: string) => {
    const agent = aiAgents.find((a) => a.id === agentId);
    if (!agent) return;
    setEditingAgentId(agentId);
    setAgentConfig({
      ...agentConfig,
      agentName: agent.intentName,
      topicCategory: "",
      description: agent.description,
      documents: [],
      instructions: { ...agentConfig.instructions },
    });
    setWizardStep(1);
    setIsCreateWizardOpen(true);
  };

  const toggleAgentStatus = (agentId: string) => {
    setAiAgents(
      aiAgents.map((a) =>
        a.id === agentId
          ? {
              ...a,
              status: a.status === "active" ? "inactive" : "active",
              lastUpdated: new Date().toISOString().slice(0, 10),
            }
          : a,
      ),
    );
  };

  // Validation functions for each step
  const validateStep = (step: number): boolean => {
    const errors: Record<string, string> = {};

    switch (step) {
      case 1:
        if (!agentConfig.agentName.trim()) {
          errors.agentName = "Agent name is required";
        }
        if (!agentConfig.description.trim()) {
          errors.description = "Description is required";
        }
        break;
      case 2:
        if (agentConfig.documents.length === 0) {
          errors.documents = "At least one document is required";
        }
        break;
      case 3:
        if (!agentConfig.instructions.generalApproach.trim()) {
          errors.instructions = "Instructions and Guidelines is required";
        }
        break;
      case 4:
        // No testing required; allow save
        break;
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const analyzeDocument = (file: File): UploadedDocument => {
    // Deterministic quality analysis based on file properties
    const fileExtension = file.name.split(".").pop()?.toLowerCase();
    const fileSizeKB = file.size / 1024;

    // Base quality score on file type and size
    let qualityScore = 70;
    let docType: UploadedDocument["type"] = "policy";

    // File type analysis
    switch (fileExtension) {
      case "pdf":
        qualityScore += 20;
        docType = "policy";
        break;
      case "docx":
        qualityScore += 15;
        docType = "procedure";
        break;
      case "txt":
        qualityScore += 10;
        docType = "script";
        break;
      case "csv":
        qualityScore += 5;
        docType = "faq";
        break;
    }

    // File size consideration (optimal range 100KB - 5MB)
    if (fileSizeKB >= 100 && fileSizeKB <= 5120) {
      qualityScore += 10;
    } else if (fileSizeKB < 50) {
      qualityScore -= 15;
    }

    // Relevance based on filename keywords
    const filename = file.name.toLowerCase();
    let relevanceScore = 60;
    const relevantKeywords = [
      "policy",
      "procedure",
      "guide",
      "script",
      "faq",
      "billing",
      "support",
      "customer",
    ];
    relevantKeywords.forEach((keyword) => {
      if (filename.includes(keyword)) relevanceScore += 8;
    });

    relevanceScore = Math.min(100, relevanceScore);
    qualityScore = Math.min(100, Math.max(30, qualityScore));

    const missingElements = [];
    const suggestions = [];

    if (qualityScore < 80) {
      suggestions.push("Consider using a more structured document format");
    }
    if (relevanceScore < 70) {
      suggestions.push(
        "Ensure document content is relevant to the agent's purpose",
      );
      missingElements.push("Topic-specific content");
    }
    if (fileSizeKB < 100) {
      suggestions.push("Document may be too brief for comprehensive training");
      missingElements.push("Detailed examples and procedures");
    }

    return {
      id: Date.now().toString(),
      name: file.name,
      size: `${(file.size / 1024 / 1024).toFixed(1)} MB`,
      type: docType,
      qualityScore,
      relevanceScore,
      analysisResults: {
        hasClearPolicies: qualityScore > 85,
        hasExamples: fileSizeKB > 200,
        hasEscalationRules:
          filename.includes("escalation") || filename.includes("policy"),
        missingElements,
      },
      suggestions,
    };
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);

    const newDocuments = files.map(analyzeDocument);

    setAgentConfig({
      ...agentConfig,
      documents: [...agentConfig.documents, ...newDocuments],
    });

    // Clear validation errors if documents are added
    if (validationErrors.documents) {
      setValidationErrors({ ...validationErrors, documents: "" });
    }
  };

  const removeDocument = (docId: string) => {
    setAgentConfig({
      ...agentConfig,
      documents: agentConfig.documents.filter((doc) => doc.id !== docId),
    });
  };

  const nextStep = () => {
    if (validateStep(wizardStep) && wizardStep < 4) {
      setWizardStep(wizardStep + 1);
      setValidationErrors({});
    }
  };

  const prevStep = () => {
    if (wizardStep > 1) {
      setWizardStep(wizardStep - 1);
    }
  };

  const selectTemplate = (templateId: string) => {
    const template = agentTemplates.find((t) => t.id === templateId);
    if (template) {
      setAgentConfig({
        ...agentConfig,
        selectedTemplate: templateId,
        topicCategory: template.category,
        description: template.description,
        instructions: template.instructionTemplate,
      });
      // Clear validation errors when template is selected
      if (validationErrors.template) {
        setValidationErrors({ ...validationErrors, template: "" });
      }
    }
  };

  const runAgentTest = async () => {
    // Simulate running tests
    const testScenarios = [
      "Customer requests refund",
      "Technical support inquiry",
      "Billing dispute escalation",
    ];

    const results = testScenarios.map((scenario) => ({
      scenario,
      passed: Math.random() > 0.2, // 80% pass rate
      response: `Agent handled ${scenario.toLowerCase()} appropriately with coaching guidelines`,
      score: Math.floor(Math.random() * 30) + 70,
    }));

    setAgentConfig({
      ...agentConfig,
      testResults: results,
      readyToActivate: results.every((r) => r.passed),
    });

    if (validationErrors.testing) {
      setValidationErrors({ ...validationErrors, testing: "" });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="flex h-16 items-center justify-between px-6">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="h-8 w-auto flex items-center justify-center">
                <img
                  src="/Omnitraina Logo.png/"
                  alt="Logo"
                  className="h-full w-auto object-contain"
                />
              </div>
              <h1 className="text-xl font-semibold text-foreground">
                AI Coaching and Training
              </h1>
            </div>
            <Badge
              variant="secondary"
              className="bg-purple-100 text-purple-800 font-medium"
            >
              Admin View
            </Badge>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>System Administrator</span>
              <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center">
                <span className="text-xs font-medium text-purple-800">SA</span>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={onLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="p-6">
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-6"
        >
          <div className="flex items-center justify-between">
            <TabsList className="grid w-full grid-cols-5 lg:w-[900px] bg-zinc-100">
              <TabsTrigger value="overview">System Overview</TabsTrigger>
              <TabsTrigger value="orchestrator">Overall LLM Agent</TabsTrigger>
              <TabsTrigger value="agents">AI Agent Management</TabsTrigger>
              <TabsTrigger value="users">User Management</TabsTrigger>
              <TabsTrigger value="teams">Team Management</TabsTrigger>
            </TabsList>

            <Dialog
              open={isCreateWizardOpen}
              onOpenChange={setIsCreateWizardOpen}
            >
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Create AI Agent
                </Button>
              </DialogTrigger>
              <DialogContent className="!max-w-[93.6rem] sm:!max-w-[93.6rem] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <Zap className="h-5 w-5 text-primary" />
                    Smart Agent Creation Wizard
                  </DialogTitle>
                  <DialogDescription>
                    Create and configure a new AI coaching agent with guided
                    templates and intelligent suggestions
                  </DialogDescription>

                  {/* Progress Indicator */}
                  <div className="flex items-center justify-center mt-4">
                    <div className="flex items-center space-x-2">
                      {[1, 2, 3, 4].map((step) => (
                        <div key={step} className="flex items-center">
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                              step === wizardStep
                                ? "bg-primary text-primary-foreground"
                                : step < wizardStep
                                  ? "bg-chart-4 text-white"
                                  : "bg-muted text-muted-foreground"
                            }`}
                          >
                            {step < wizardStep ? (
                              <Check className="h-4 w-4" />
                            ) : (
                              step
                            )}
                          </div>
                          {step < 4 && (
                            <div
                              className={`w-8 h-0.5 ${
                                step < wizardStep ? "bg-chart-4" : "bg-muted"
                              }`}
                            />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="text-center text-sm text-muted-foreground mt-2">
                    Step {wizardStep} of 4:{" "}
                    {wizardStep === 1
                      ? "Start from Scratch"
                      : wizardStep === 2
                        ? "Documents"
                        : wizardStep === 3
                          ? "Instructions"
                          : "Test & Activate"}
                  </div>
                </DialogHeader>

                <div className="py-6">
                  {/* Step 1: Quick Start (Start from Scratch only) */}
                  {wizardStep === 1 && (
                    <div className="space-y-6">
                      <div className="text-center">
                        <h3 className="text-lg font-semibold mb-2">
                          Start from Scratch
                        </h3>
                        <p className="text-muted-foreground">
                          Build a completely custom agent with full control over
                          all configurations.
                        </p>
                      </div>

                      <Card>
                        <CardContent className="p-6">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                              <Label htmlFor="agentName">Agent Name *</Label>
                              <Input
                                id="agentName"
                                placeholder="e.g., Billing Support Assistant"
                                value={agentConfig.agentName}
                                onChange={(e) => {
                                  setAgentConfig({
                                    ...agentConfig,
                                    agentName: e.target.value,
                                  });
                                  if (
                                    validationErrors.agentName &&
                                    e.target.value.trim()
                                  ) {
                                    setValidationErrors({
                                      ...validationErrors,
                                      agentName: "",
                                    });
                                  }
                                }}
                                className={
                                  validationErrors.agentName
                                    ? "border-destructive"
                                    : ""
                                }
                              />
                              {validationErrors.agentName && (
                                <p className="text-sm text-destructive">
                                  {validationErrors.agentName}
                                </p>
                              )}
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor="topicCategory">
                                Topic Category
                              </Label>
                              <Input
                                id="topicCategory"
                                placeholder="e.g., Financial Services"
                                value={agentConfig.topicCategory}
                                onChange={(e) =>
                                  setAgentConfig({
                                    ...agentConfig,
                                    topicCategory: e.target.value,
                                  })
                                }
                              />
                            </div>

                            <div className="space-y-2 md:col-span-2">
                              <Label htmlFor="description">Description *</Label>
                              <Textarea
                                id="description"
                                placeholder="Brief description of what this agent handles"
                                rows={3}
                                value={agentConfig.description}
                                onChange={(e) => {
                                  setAgentConfig({
                                    ...agentConfig,
                                    description: e.target.value,
                                  });
                                  if (
                                    validationErrors.description &&
                                    e.target.value.trim()
                                  ) {
                                    setValidationErrors({
                                      ...validationErrors,
                                      description: "",
                                    });
                                  }
                                }}
                                className={
                                  validationErrors.description
                                    ? "border-destructive"
                                    : ""
                                }
                              />
                              {validationErrors.description && (
                                <p className="text-sm text-destructive">
                                  {validationErrors.description}
                                </p>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  )}

                  {/* Step 2: Documents */}

                  {/* Step 2: Documents */}
                  {wizardStep === 2 && (
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-lg font-semibold mb-2">
                          Knowledge Base Documents
                        </h3>
                        <p className="text-muted-foreground">
                          Upload documents to train your agent with relevant
                          knowledge
                        </p>
                      </div>

                      <div className="space-y-4">
                        {validationErrors.documents && (
                          <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-md">
                            {validationErrors.documents}
                          </div>
                        )}
                        <div
                          className={`border-2 border-dashed rounded-lg p-8 text-center ${
                            validationErrors.documents
                              ? "border-destructive/50"
                              : "border-muted-foreground/25"
                          }`}
                        >
                          <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                          <Label
                            htmlFor="fileUpload"
                            className="cursor-pointer"
                          >
                            <span className="text-lg font-medium">
                              Upload Documents
                            </span>
                            <p className="text-sm text-muted-foreground mt-1">
                              Drag & drop files here, or click to browse
                            </p>
                            <p className="text-xs text-muted-foreground mt-2">
                              Supports PDF, CSV, TXT, DOCX files
                            </p>
                          </Label>
                          <Input
                            id="fileUpload"
                            type="file"
                            accept=".pdf,.csv,.txt,.docx"
                            onChange={handleFileUpload}
                            className="hidden"
                            multiple
                          />
                        </div>

                        {agentConfig.documents.length > 0 && (
                          <div className="space-y-3">
                            <h4 className="font-medium">Uploaded Documents</h4>
                            {agentConfig.documents.map((doc) => (
                              <Card key={doc.id}>
                                <CardContent className="p-4">
                                  <div className="flex items-start justify-between">
                                    <div className="flex items-start gap-3">
                                      <FileText className="h-5 w-5 text-primary mt-1" />
                                      <div className="flex-1">
                                        <h5 className="font-medium">
                                          {doc.name}
                                        </h5>
                                        <p className="text-sm text-muted-foreground">
                                          {doc.type.charAt(0).toUpperCase() +
                                            doc.type.slice(1)}{" "}
                                          • {doc.size}
                                        </p>

                                        <div className="flex items-center gap-4 mt-2">
                                          <div className="flex items-center gap-2">
                                            <span className="text-xs text-muted-foreground">
                                              Quality:
                                            </span>
                                            <Badge
                                              variant={
                                                doc.qualityScore >= 90
                                                  ? "default"
                                                  : doc.qualityScore >= 70
                                                    ? "secondary"
                                                    : "destructive"
                                              }
                                            >
                                              {doc.qualityScore}/100
                                            </Badge>
                                          </div>
                                          <div className="flex items-center gap-2">
                                            <span className="text-xs text-muted-foreground">
                                              Relevance:
                                            </span>
                                            <Badge
                                              variant={
                                                doc.relevanceScore >= 90
                                                  ? "default"
                                                  : doc.relevanceScore >= 70
                                                    ? "secondary"
                                                    : "destructive"
                                              }
                                            >
                                              {doc.relevanceScore}/100
                                            </Badge>
                                          </div>
                                        </div>

                                        {doc.suggestions.length > 0 && (
                                          <div className="mt-3">
                                            <div className="flex items-center gap-2 mb-2">
                                              <Lightbulb className="h-4 w-4 text-amber-500" />
                                              <span className="text-sm font-medium">
                                                Suggestions
                                              </span>
                                            </div>
                                            {doc.suggestions.map(
                                              (suggestion, index) => (
                                                <p
                                                  key={index}
                                                  className="text-sm text-muted-foreground"
                                                >
                                                  • {suggestion}
                                                </p>
                                              ),
                                            )}
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => removeDocument(doc.id)}
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </div>
                                </CardContent>
                              </Card>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Step 3: Instructions */}
                  {wizardStep === 3 && (
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-lg font-semibold mb-2">
                          Coaching Instructions
                        </h3>
                        <p className="text-muted-foreground">
                          Configure how your agent should coach and respond
                        </p>
                      </div>

                      <div className="space-y-6">
                        {validationErrors.instructions && (
                          <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-md">
                            {validationErrors.instructions}
                          </div>
                        )}
                        <div className="space-y-2">
                          <Label>Instructions and Guidelines *</Label>
                          <Textarea
                            placeholder="Provide clear guidance for how the agent should respond. Include tone, structure, must/avoid behaviors, compliance notes, escalation thresholds, and example phrasing."
                            rows={3}
                            value={agentConfig.instructions.generalApproach}
                            onChange={(e) => {
                              setAgentConfig({
                                ...agentConfig,
                                instructions: {
                                  ...agentConfig.instructions,
                                  generalApproach: e.target.value,
                                },
                              });
                              if (
                                validationErrors.instructions &&
                                e.target.value.trim()
                              ) {
                                setValidationErrors({
                                  ...validationErrors,
                                  instructions: "",
                                });
                              }
                            }}
                            className={
                              validationErrors.instructions
                                ? "border-destructive"
                                : ""
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <div className="rounded-md border bg-muted/20 p-3">
                            <p className="text-sm font-medium mb-1">
                              Sample instructions and guidelines
                            </p>
                            <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
                              <li>
                                Tone: empathetic, professional, concise. Avoid
                                jargon unless explained.
                              </li>
                              <li>
                                Structure: greet, confirm context, propose
                                solution, confirm resolution, close.
                              </li>
                              <li>
                                Must do: verify identity before account details;
                                summarize next steps.
                              </li>
                              <li>
                                Must avoid: promising refunds without approval;
                                sharing other customers' data.
                              </li>
                              <li>
                                Compliance: follow PCI/GDPR; never store full
                                card numbers.
                              </li>
                              <li>
                                Escalation: transfer if security concern or
                                out-of-policy request.
                              </li>
                              <li>
                                Example phrase: "I understand how frustrating
                                this is; here’s what I can do right now…"
                              </li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Step 4: Review & Save */}
                  {wizardStep === 4 && (
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-lg font-semibold mb-2">
                          Review & Save
                        </h3>
                        <p className="text-muted-foreground">
                          Review details and save the agent
                        </p>
                      </div>
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-base">
                            Agent Preview
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <Label className="text-sm font-medium">
                                Name
                              </Label>
                              <p className="text-sm">
                                {agentConfig.agentName || "Untitled Agent"}
                              </p>
                            </div>
                            <div>
                              <Label className="text-sm font-medium">
                                Category
                              </Label>
                              <p className="text-sm">
                                {agentConfig.topicCategory || "General"}
                              </p>
                            </div>
                            <div>
                              <Label className="text-sm font-medium">
                                Documents
                              </Label>
                              <p className="text-sm">
                                {agentConfig.documents.length} document(s)
                                uploaded
                              </p>
                            </div>
                            <div className="md:col-span-2">
                              <Label className="text-sm font-medium">
                                Instructions
                              </Label>
                              <p className="text-sm whitespace-pre-wrap">
                                {agentConfig.instructions.generalApproach ||
                                  "No instructions provided"}
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      {agentConfig.readyToActivate && (
                        <Card className="border-chart-4">
                          <CardContent className="p-6 text-center">
                            <CheckCircle className="h-12 w-12 text-chart-4 mx-auto mb-4" />
                            <h4 className="font-semibold mb-2 text-chart-4">
                              Ready for Activation
                            </h4>
                            <p className="text-muted-foreground mb-4">
                              All tests passed! Your agent is ready to be
                              activated and start coaching.
                            </p>
                          </CardContent>
                        </Card>
                      )}
                    </div>
                  )}
                </div>

                <DialogFooter className="flex justify-between">
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      onClick={() => setIsCreateWizardOpen(false)}
                    >
                      Cancel
                    </Button>
                    {wizardStep > 1 && (
                      <Button variant="outline" onClick={prevStep}>
                        <ChevronLeft className="h-4 w-4 mr-2" />
                        Previous
                      </Button>
                    )}
                  </div>

                  <div className="flex gap-2">
                    {wizardStep < 4 ? (
                      <Button onClick={nextStep}>
                        Next
                        <ChevronRight className="h-4 w-4 ml-2" />
                      </Button>
                    ) : (
                      <Button
                        onClick={handleCreateAgent}
                        disabled={
                          !agentConfig.agentName.trim() ||
                          !agentConfig.description.trim()
                        }
                      >
                        <Save className="h-4 w-4 mr-2" />
                        Save Agent
                      </Button>
                    )}
                  </div>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          <TabsContent value="overview" className="space-y-6">
            {/* System Stats */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total AI Agents
                  </CardTitle>
                  <Bot className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {systemStats.totalAgents}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {systemStats.activeAgents} active
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Interactions
                  </CardTitle>
                  <Activity className="h-4 w-4 text-chart-1" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {systemStats.totalInteractions.toLocaleString()}
                  </div>
                  <p className="text-xs text-muted-foreground">This month</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Average Accuracy
                  </CardTitle>
                  <Brain className="h-4 w-4 text-chart-4" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {systemStats.avgAccuracy}%
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Across all agents
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Knowledge Base Size
                  </CardTitle>
                  <Database className="h-4 w-4 text-chart-2" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">8.7 MB</div>
                  <p className="text-xs text-muted-foreground">
                    Total storage used
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Recent System Activity</CardTitle>
                <CardDescription>
                  Latest updates and training activities
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-chart-4/10 flex items-center justify-center">
                      <CheckCircle className="h-4 w-4 text-chart-4" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">
                        Product Support agent training completed
                      </p>
                      <p className="text-xs text-muted-foreground">
                        2 hours ago • Accuracy improved to 87%
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-chart-1/10 flex items-center justify-center">
                      <Upload className="h-4 w-4 text-chart-1" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">
                        New knowledge base uploaded for Billing Inquiries
                      </p>
                      <p className="text-xs text-muted-foreground">
                        1 day ago • 1.2 MB added
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-chart-2/10 flex items-center justify-center">
                      <Plus className="h-4 w-4 text-chart-2" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">
                        Refunds & Returns agent created
                      </p>
                      <p className="text-xs text-muted-foreground">
                        3 days ago • Initial training in progress
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="agents" className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-foreground">
                  AI Agent Management
                </h2>
                <p className="text-muted-foreground">
                  Manage your AI coaching agents and their configurations
                </p>
              </div>
            </div>

            <div className="grid gap-4">
              {aiAgents.map((agent) => (
                <Card key={agent.id}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                          <Bot className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-foreground">
                            {agent.intentName}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {agent.description}
                          </p>
                          <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                            <span>Last updated: {agent.lastUpdated}</span>
                            <span>
                              Knowledge base: {agent.knowledgeBaseSize}
                            </span>
                            <span>Usage: {agent.usageCount} interactions</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <Badge
                          variant={
                            agent.status === "active"
                              ? "default"
                              : agent.status === "training"
                                ? "secondary"
                                : "outline"
                          }
                        >
                          {agent.status === "active" && (
                            <CheckCircle className="h-3 w-3 mr-1" />
                          )}
                          {agent.status === "training" && (
                            <Clock className="h-3 w-3 mr-1" />
                          )}
                          {agent.status === "inactive" && (
                            <AlertCircle className="h-3 w-3 mr-1" />
                          )}
                          {agent.status.charAt(0).toUpperCase() +
                            agent.status.slice(1)}
                        </Badge>

                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => startEditAgent(agent.id)}
                          >
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => toggleAgentStatus(agent.id)}
                          >
                            {agent.status === "active"
                              ? "Deactivate"
                              : "Activate"}
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-destructive hover:text-destructive bg-transparent"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="orchestrator" className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-foreground">
                  Overall LLM Agent
                </h2>
                <p className="text-muted-foreground">
                  Configure and manage the orchestrator that routes contacts to
                  specialized agents
                </p>
              </div>
              {/* <div className="flex gap-2">
                <Button
                  variant={
                    orchestratorConfig.isActive ? "destructive" : "default"
                  }
                  onClick={toggleOrchestratorStatus}
                >
                  <Brain className="h-4 w-4 mr-2" />
                  {orchestratorConfig.isActive ? "Deactivate" : "Activate"}{" "}
                  Orchestrator
                </Button>
              </div> */}
            </div>

            {/* Orchestrator Configuration Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Orchestrator Configuration
                </CardTitle>
                <CardDescription>
                  Configure the overall agent that handles intent detection and
                  routing
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    {/* <div className="space-y-2">
                      <Label htmlFor="orchestrator-name">Agent Name</Label>
                      <Input
                        id="orchestrator-name"
                        value={orchestratorConfig.agentName}
                        onChange={(e) =>
                          setOrchestratorConfig({
                            ...orchestratorConfig,
                            agentName: e.target.value,
                          })
                        }
                        placeholder="OmniHive Orchestrator"
                      />
                    </div> */}

                    {/* <div className="space-y-2">
                      <Label>Status</Label>
                      <div className="flex items-center gap-2">
                        <Badge
                          variant={
                            orchestratorConfig.isActive
                              ? "default"
                              : "secondary"
                          }
                        >
                          {orchestratorConfig.isActive ? "Active" : "Inactive"}
                        </Badge>
                        <span className="text-sm text-muted-foreground">
                          Last updated:{" "}
                          {new Date(
                            orchestratorConfig.lastUpdated,
                          ).toLocaleString()}
                        </span>
                      </div>
                    </div> */}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="instruction-set">
                    Global Instruction Set
                  </Label>
                  <Textarea
                    id="instruction-set"
                    rows={4}
                    value={orchestratorConfig.instructionSet}
                    onChange={(e) =>
                      setOrchestratorConfig({
                        ...orchestratorConfig,
                        instructionSet: e.target.value,
                      })
                    }
                    placeholder="Define global rules and policies for the orchestrator..."
                  />
                  <p className="text-sm text-muted-foreground">
                    These instructions will guide how the orchestrator analyzes
                    contacts and makes routing decisions.
                  </p>
                </div>

                <div className="flex justify-end">
                  <Button onClick={saveOrchestratorConfig}>
                    <Save className="h-4 w-4 mr-2" />
                    Save Configuration
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Document Management Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Business Documents
                </CardTitle>
                <CardDescription>
                  Upload and manage business-wide documents for the
                  orchestrator's knowledge base
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6">
                  <div className="text-center space-y-2">
                    <Upload className="h-8 w-8 mx-auto text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">
                        Upload Business Documents
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Supports PDF, DOCX, and TXT files
                      </p>
                    </div>
                    <Input
                      type="file"
                      multiple
                      accept=".pdf,.docx,.txt"
                      onChange={(e) => {
                        const files = Array.from(e.target.files || []);
                        if (files.length > 0) {
                          handleBusinessDocumentUpload(files);
                        }
                      }}
                      className="hidden"
                      id="document-upload"
                    />
                    <Button
                      variant="outline"
                      onClick={() =>
                        document.getElementById("document-upload")?.click()
                      }
                      disabled={isUploadingDoc}
                    >
                      {isUploadingDoc ? (
                        <>
                          <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        <>
                          <Upload className="h-4 w-4 mr-2" />
                          Choose Files
                        </>
                      )}
                    </Button>
                  </div>
                </div>

                {businessDocuments.length > 0 && (
                  <div className="space-y-3">
                    <h4 className="font-medium">
                      Uploaded Documents ({businessDocuments.length})
                    </h4>
                    <div className="grid gap-3">
                      {businessDocuments.map((doc) => (
                        <div
                          key={doc.id}
                          className="flex items-center justify-between p-3 border rounded-lg"
                        >
                          <div className="flex items-center gap-3">
                            <FileText className="h-5 w-5 text-muted-foreground" />
                            <div>
                              <p className="font-medium">{doc.name}</p>
                              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <span>{doc.size}</span>
                                <span>•</span>
                                <span>Uploaded {doc.uploadDate}</span>
                                <span>•</span>
                                <Badge
                                  variant={
                                    doc.status === "ready"
                                      ? "default"
                                      : doc.status === "processing"
                                        ? "secondary"
                                        : "destructive"
                                  }
                                  className="text-xs"
                                >
                                  {doc.status === "ready"
                                    ? "Ready"
                                    : doc.status === "processing"
                                      ? "Processing"
                                      : "Error"}
                                </Badge>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {doc.vectorEmbedded && (
                              <Badge variant="outline" className="text-xs">
                                <Database className="h-3 w-3 mr-1" />
                                Embedded
                              </Badge>
                            )}
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setDocumentToDelete(doc)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Delete Document Confirmation Dialog */}
            <AlertDialog
              open={documentToDelete !== null}
              onOpenChange={(open) => !open && setDocumentToDelete(null)}
            >
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete Document</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to delete this file? This action
                    cannot be undone and will remove the document from the
                    knowledge base.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    className="bg-red-600 hover:bg-red-700"
                    onClick={() => {
                      if (documentToDelete) {
                        removeBusinessDocument(documentToDelete.id);
                        setDocumentToDelete(null);
                      }
                    }}
                  >
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>

            {/* Routing Analytics Dashboard */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Routing Analytics
                </CardTitle>
                <CardDescription>
                  Monitor how contacts are being routed and analyzed by the
                  orchestrator
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Quick Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="border rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-primary">
                      {routingAnalytics.totalContacts}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Total Contacts
                    </div>
                  </div>
                  <div className="border rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-chart-4">
                      {routingAnalytics.routedToAgents.reduce(
                        (sum, agent) => sum + agent.count,
                        0,
                      )}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Successfully Routed
                    </div>
                  </div>
                  <div className="border rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-amber-500">
                      {routingAnalytics.fallbackCases.count}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Fallback Cases
                    </div>
                  </div>
                  <div className="border rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-chart-2">
                      {(
                        ((routingAnalytics.totalContacts -
                          routingAnalytics.fallbackCases.count) /
                          routingAnalytics.totalContacts) *
                        100
                      ).toFixed(1)}
                      %
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Success Rate
                    </div>
                  </div>
                </div>

                {/* Agent Routing Distribution */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium mb-3">Routing by Agent</h4>
                    <div className="space-y-3">
                      {routingAnalytics.routedToAgents.map((agent, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between"
                        >
                          <span className="text-sm">{agent.agentName}</span>
                          <div className="flex items-center gap-2">
                            <div className="w-24 bg-muted rounded-full h-2">
                              <div
                                className="bg-primary rounded-full h-2"
                                style={{ width: `${agent.percentage}%` }}
                              />
                            </div>
                            <span className="text-sm font-medium w-12 text-right">
                              {agent.count}
                            </span>
                          </div>
                        </div>
                      ))}
                      <div className="flex items-center justify-between border-t pt-2">
                        <span className="text-sm text-amber-600">
                          Fallback Cases
                        </span>
                        <div className="flex items-center gap-2">
                          <div className="w-24 bg-muted rounded-full h-2">
                            <div
                              className="bg-amber-500 rounded-full h-2"
                              style={{
                                width: `${routingAnalytics.fallbackCases.percentage}%`,
                              }}
                            />
                          </div>
                          <span className="text-sm font-medium w-12 text-right">
                            {routingAnalytics.fallbackCases.count}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-3">Intent Distribution</h4>
                    <div className="space-y-3">
                      {routingAnalytics.intentDistribution.map(
                        (intent, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between"
                          >
                            <span className="text-sm">{intent.intent}</span>
                            <div className="flex items-center gap-2">
                              <div className="w-24 bg-muted rounded-full h-2">
                                <div
                                  className="bg-chart-4 rounded-full h-2"
                                  style={{ width: `${intent.percentage}%` }}
                                />
                              </div>
                              <span className="text-sm font-medium w-12 text-right">
                                {intent.count}
                              </span>
                            </div>
                          </div>
                        ),
                      )}
                    </div>
                  </div>
                </div>

                {/* Recent Activity Simulation */}
                <div>
                  <h4 className="font-medium mb-3">Recent Routing Activity</h4>
                  <div className="border rounded-lg p-4 space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <Route className="h-4 w-4 text-chart-4" />
                        <span>
                          Contact #12847 → <strong>Billing Support</strong>
                        </span>
                      </div>
                      <span className="text-muted-foreground">
                        2 minutes ago
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <Route className="h-4 w-4 text-chart-4" />
                        <span>
                          Contact #12846 → <strong>Technical Support</strong>
                        </span>
                      </div>
                      <span className="text-muted-foreground">
                        5 minutes ago
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <AlertCircle className="h-4 w-4 text-amber-500" />
                        <span>
                          Contact #12845 → <strong>Fallback (General)</strong>
                        </span>
                      </div>
                      <span className="text-muted-foreground">
                        8 minutes ago
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <Route className="h-4 w-4 text-chart-4" />
                        <span>
                          Contact #12844 → <strong>Account Management</strong>
                        </span>
                      </div>
                      <span className="text-muted-foreground">
                        12 minutes ago
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* User Management Tab */}
          <TabsContent value="users" className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-foreground">
                  User Management
                </h2>
                <p className="text-muted-foreground">
                  Manage platform users, roles, and access permissions
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => setIsImportModalOpen(true)}
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Import Users
                </Button>
                <Button onClick={handleCreateUserOpen}>
                  <UserPlus className="h-4 w-4 mr-2" />
                  Create New User
                </Button>
              </div>
            </div>

            {/* Users Table */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Platform Users
                </CardTitle>
                <CardDescription>
                  View and manage all users with access to the platform
                </CardDescription>
              </CardHeader>
              <CardContent>
                {users.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-4">
                      <Users className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <h3 className="text-lg font-medium mb-1">No users yet</h3>
                    <p className="text-sm text-muted-foreground mb-4 max-w-sm">
                      Get started by creating your first user or importing users from a CSV file.
                    </p>
                    <div className="flex gap-2">
                      <Button variant="outline" onClick={() => setIsImportModalOpen(true)}>
                        <Upload className="h-4 w-4 mr-2" />
                        Import Users
                      </Button>
                      <Button onClick={handleCreateUserOpen}>
                        <UserPlus className="h-4 w-4 mr-2" />
                        Create User
                      </Button>
                    </div>
                  </div>
                ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Full Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Amazon Connect User ID</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-2">
                            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                              <span className="text-xs font-medium text-primary">
                                {user.fullName
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </span>
                            </div>
                            {user.fullName}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Mail className="h-3 w-3 text-muted-foreground" />
                            {user.email}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              user.role === "Admin"
                                ? "default"
                                : user.role === "Supervisor"
                                  ? "secondary"
                                  : "outline"
                            }
                          >
                            <Shield className="h-3 w-3 mr-1" />
                            {user.role}
                          </Badge>
                        </TableCell>
                        <TableCell className="font-mono text-sm">
                          {user.amazonConnectUserId}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              user.status === "Active" ? "default" : "secondary"
                            }
                            className={
                              user.status === "Active"
                                ? "bg-green-100 text-green-800"
                                : "bg-gray-100 text-gray-800"
                            }
                          >
                            {user.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleEditUserOpen(user)}>
                                <Edit className="h-4 w-4 mr-2" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => setUserToToggle(user)}>
                                <Power className="h-4 w-4 mr-2" />
                                {user.status === "Active"
                                  ? "Deactivate"
                                  : "Activate"}
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                className="text-red-600"
                                onClick={() => setUserToDelete(user)}
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                )}
              </CardContent>
            </Card>

            {/* Create User Dialog */}
            <Dialog open={isCreateUserOpen} onOpenChange={setIsCreateUserOpen}>
              <DialogContent className="sm:max-w-[500px]">
                {!showUserCreatedSuccess ? (
                  <>
                    <DialogHeader>
                      <DialogTitle className="flex items-center gap-2">
                        <UserPlus className="h-5 w-5 text-primary" />
                        Create New User
                      </DialogTitle>
                      <DialogDescription>
                        Add a new user to the platform. They will receive login
                        details via email.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="fullName">Full Name*</Label>
                        <Input
                          id="fullName"
                          placeholder="Enter full name"
                          value={newUser.fullName}
                          onChange={(e) =>
                            setNewUser({ ...newUser, fullName: e.target.value })
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email*</Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="Enter email address"
                          value={newUser.email}
                          onChange={(e) =>
                            setNewUser({ ...newUser, email: e.target.value })
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="role">Role*</Label>
                        <Select
                          value={newUser.role}
                          onValueChange={(
                            value: "Agent" | "Supervisor" | "Admin",
                          ) => setNewUser({ ...newUser, role: value })}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select role" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Agent">Agent</SelectItem>
                            <SelectItem value="Supervisor">
                              Supervisor
                            </SelectItem>
                            <SelectItem value="Admin">Admin</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="amazonConnectId">
                          Amazon Connect User ID*
                        </Label>
                        <Input
                          id="amazonConnectId"
                          placeholder="e.g., AC-001-XX"
                          value={newUser.amazonConnectUserId}
                          onChange={(e) =>
                            setNewUser({
                              ...newUser,
                              amazonConnectUserId: e.target.value,
                            })
                          }
                        />
                      </div>
                      {/* <div className="space-y-2">
                        <Label>Auto-Generated Password</Label>
                        <div className="flex items-center gap-2">
                          <Input
                            readOnly
                            value={generatedPassword}
                            className="font-mono bg-muted"
                          />
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={handleCopyPassword}
                          >
                            {copiedPassword ? (
                              <Check className="h-4 w-4 text-green-600" />
                            ) : (
                              <Copy className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          This password will be sent to the user via email
                        </p>
                      </div> */}
                    </div>
                    <DialogFooter>
                      <Button
                        variant="outline"
                        onClick={() => setIsCreateUserOpen(false)}
                      >
                        Cancel
                      </Button>
                      <Button
                        onClick={handleCreateUser}
                        disabled={
                          !newUser.fullName ||
                          !newUser.email ||
                          !newUser.amazonConnectUserId
                        }
                      >
                        Create User
                      </Button>
                    </DialogFooter>
                  </>
                ) : (
                  <>
                    <DialogHeader>
                      <DialogTitle className="flex items-center gap-2 text-green-600">
                        <CheckCircle className="h-5 w-5" />
                        User Created Successfully
                      </DialogTitle>
                    </DialogHeader>
                    <div className="py-6 text-center space-y-4">
                      <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center mx-auto">
                        <CheckCircle className="h-8 w-8 text-green-600" />
                      </div>
                      <div>
                        <p className="font-medium">{newUser.fullName}</p>
                        <p className="text-sm text-muted-foreground">
                          {newUser.email}
                        </p>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        An email will be sent to the user with their login
                        details and temporary password.
                      </p>
                    </div>
                    <DialogFooter>
                      <Button onClick={() => setIsCreateUserOpen(false)}>
                        Done
                      </Button>
                    </DialogFooter>
                  </>
                )}
              </DialogContent>
            </Dialog>

            {/* Import Users Modal */}
            <Dialog
              open={isImportModalOpen}
              onOpenChange={(open) => !open && resetImportModal()}
            >
              <DialogContent className="sm:max-w-[600px]">
                {importStep === "upload" && (
                  <>
                    <DialogHeader>
                      <DialogTitle className="flex items-center gap-2">
                        <Upload className="h-5 w-5 text-primary" />
                        Import Users
                      </DialogTitle>
                      <DialogDescription>
                        Upload a CSV file to add multiple users at once
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-6 py-4">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-white text-sm font-medium">
                            1
                          </div>
                          <Label className="font-medium">
                            Download CSV Template
                          </Label>
                        </div>
                        <p className="text-sm text-muted-foreground ml-8">
                          Download and fill in the template with your user data
                        </p>
                        <div className="ml-8">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={downloadCsvTemplate}
                          >
                            <Download className="h-4 w-4 mr-2" />
                            Download Template
                          </Button>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-white text-sm font-medium">
                            2
                          </div>
                          <Label className="font-medium">
                            Upload Your File
                          </Label>
                        </div>
                        <p className="text-sm text-muted-foreground ml-8">
                          Accepts .csv files up to 5MB
                        </p>
                        <div
                          className={`ml-8 border-2 border-dashed rounded-lg p-8 text-center transition-colors ${isDraggingCsv ? "border-primary bg-primary/5" : "border-muted-foreground/25"}`}
                          onDragOver={(e) => {
                            e.preventDefault();
                            setIsDraggingCsv(true);
                          }}
                          onDragLeave={() => setIsDraggingCsv(false)}
                          onDrop={(e) => {
                            e.preventDefault();
                            setIsDraggingCsv(false);
                            const file = e.dataTransfer.files[0];
                            if (file) handleCsvFileSelect(file);
                          }}
                        >
                          <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                          <p className="text-sm text-muted-foreground mb-2">
                            Drag and drop your CSV file here, or
                          </p>
                          <label>
                            <input
                              type="file"
                              accept=".csv"
                              className="hidden"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) handleCsvFileSelect(file);
                              }}
                            />
                            <Button variant="outline" size="sm" asChild>
                              <span className="cursor-pointer">
                                Browse Files
                              </span>
                            </Button>
                          </label>
                        </div>
                      </div>

                      <div className="bg-muted/50 rounded-lg p-4 space-y-2">
                        <h4 className="font-medium text-sm">
                          CSV Format Requirements
                        </h4>
                        <ul className="text-xs text-muted-foreground space-y-1">
                          <li>
                            <strong>Required:</strong> Full Name, Email, Role
                          </li>
                          <li>
                            <strong>Required:</strong> Amazon Connect User ID
                          </li>
                          <li>
                            <strong>Roles:</strong> Agent, Supervisor, Admin
                          </li>
                        </ul>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={resetImportModal}>
                        Cancel
                      </Button>
                    </DialogFooter>
                  </>
                )}

                {importStep === "validation" && (
                  <>
                    <DialogHeader>
                      <DialogTitle className="flex items-center gap-2">
                        <FileText className="h-5 w-5 text-primary" />
                        Validation Results
                      </DialogTitle>
                      <DialogDescription>
                        Review the validation results before importing
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="grid grid-cols-3 gap-3">
                        <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-center">
                          <div className="text-2xl font-bold text-green-600">
                            {getValidCount()}
                          </div>
                          <div className="text-xs text-green-700">
                            Valid Users
                          </div>
                        </div>
                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-center">
                          <div className="text-2xl font-bold text-yellow-600">
                            {getWarningCount()}
                          </div>
                          <div className="text-xs text-yellow-700">
                            Warnings
                          </div>
                        </div>
                        <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-center">
                          <div className="text-2xl font-bold text-red-600">
                            {getErrorCount()}
                          </div>
                          <div className="text-xs text-red-700">Errors</div>
                        </div>
                      </div>

                      {validationIssues.length > 0 && (
                        <div className="border rounded-lg max-h-48 overflow-y-auto">
                          <div className="p-3 space-y-2">
                            {validationIssues.map((issue, idx) => (
                              <div
                                key={idx}
                                className={`flex items-start gap-2 text-sm p-2 rounded ${issue.type === "error" ? "bg-red-50" : "bg-yellow-50"}`}
                              >
                                <AlertCircle
                                  className={`h-4 w-4 mt-0.5 ${issue.type === "error" ? "text-red-500" : "text-yellow-500"}`}
                                />
                                <div>
                                  <span className="font-medium">
                                    Row {issue.row}
                                  </span>
                                  <span className="text-muted-foreground">
                                    {" "}
                                    - {issue.field}:{" "}
                                  </span>
                                  <span>{issue.message}</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      <p className="text-xs text-muted-foreground bg-muted/50 p-3 rounded">
                        Users with errors will be skipped. Users with warnings
                        will be imported with default values.
                      </p>
                    </div>
                    <DialogFooter className="gap-2">
                      <Button
                        variant="outline"
                        onClick={() => {
                          setImportStep("upload");
                          setCsvFile(null);
                          setCsvData([]);
                          setValidationIssues([]);
                        }}
                      >
                        Back
                      </Button>
                      <Button
                        onClick={handleImportUsers}
                        disabled={getValidCount() === 0}
                      >
                        Import {getValidCount()} Users
                      </Button>
                    </DialogFooter>
                  </>
                )}

                {importStep === "success" && (
                  <>
                    <DialogHeader>
                      <DialogTitle className="flex items-center gap-2 text-green-600">
                        <CheckCircle className="h-5 w-5" />
                        Import Successful
                      </DialogTitle>
                    </DialogHeader>
                    <div className="py-6 text-center space-y-4">
                      <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center mx-auto">
                        <CheckCircle className="h-8 w-8 text-green-600" />
                      </div>
                      <div>
                        <p className="text-lg font-medium">
                          {importedCount} users imported
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {importedCount} users have been successfully imported
                          to the platform
                        </p>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button onClick={resetImportModal}>Done</Button>
                    </DialogFooter>
                  </>
                )}
              </DialogContent>
            </Dialog>

            {/* Delete User Confirmation */}
            <AlertDialog open={userToDelete !== null} onOpenChange={(open) => !open && setUserToDelete(null)}>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete User</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to delete {userToDelete?.fullName}? This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction className="bg-red-600 hover:bg-red-700" onClick={handleDeleteUser}>
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>

            {/* Toggle Status Confirmation */}
            <AlertDialog open={userToToggle !== null} onOpenChange={(open) => !open && setUserToToggle(null)}>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>
                    {userToToggle?.status === "Active" ? "Deactivate" : "Activate"} User
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to {userToToggle?.status === "Active" ? "deactivate" : "activate"} {userToToggle?.fullName}?
                    {userToToggle?.status === "Active" 
                      ? " They will no longer be able to access the platform."
                      : " They will regain access to the platform."}
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleToggleUserStatus}>
                    {userToToggle?.status === "Active" ? "Deactivate" : "Activate"}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>

            {/* Edit User Dialog */}
            <Dialog open={isEditUserOpen} onOpenChange={(open) => { if (!open) { setIsEditUserOpen(false); setEditingUser(null); }}}>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <Edit className="h-5 w-5 text-primary" />
                    Edit User
                  </DialogTitle>
                  <DialogDescription>
                    Update user information
                  </DialogDescription>
                </DialogHeader>
                {editingUser && (
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="editFullName">Full Name*</Label>
                      <Input
                        id="editFullName"
                        placeholder="Enter full name"
                        value={editingUser.fullName}
                        onChange={(e) => setEditingUser({ ...editingUser, fullName: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="editEmail">Email*</Label>
                      <Input
                        id="editEmail"
                        type="email"
                        placeholder="Enter email address"
                        value={editingUser.email}
                        onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="editRole">Role*</Label>
                      <Select
                        value={editingUser.role}
                        onValueChange={(value: "Agent" | "Supervisor" | "Admin") => setEditingUser({ ...editingUser, role: value })}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select role" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Agent">Agent</SelectItem>
                          <SelectItem value="Supervisor">Supervisor</SelectItem>
                          <SelectItem value="Admin">Admin</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="editAmazonConnectId">Amazon Connect User ID</Label>
                      <Input
                        id="editAmazonConnectId"
                        placeholder="e.g., AC-001-XX"
                        value={editingUser.amazonConnectUserId}
                        onChange={(e) => setEditingUser({ ...editingUser, amazonConnectUserId: e.target.value })}
                      />
                    </div>
                  </div>
                )}
                <DialogFooter>
                  <Button variant="outline" onClick={() => { setIsEditUserOpen(false); setEditingUser(null); }}>
                    Cancel
                  </Button>
                  <Button onClick={handleSaveEditUser} disabled={!editingUser?.fullName || !editingUser?.email}>
                    Save Changes
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </TabsContent>

          {/* Team Management Tab */}
          <TabsContent value="teams" className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-foreground">
                  Team Management
                </h2>
                <p className="text-muted-foreground">
                  Create and manage teams with supervisors and agents
                </p>
              </div>
              <Button onClick={handleOpenCreateTeam}>
                <Plus className="h-4 w-4 mr-2" />
                Create Team
              </Button>
            </div>

            {/* Search Bar */}
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search teams..."
                value={teamListSearchQuery}
                onChange={(e) => setTeamListSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>

            {/* Teams List */}
            <Card>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Team Name</TableHead>
                    <TableHead>Supervisor</TableHead>
                    <TableHead>Agents</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {getFilteredTeams().map((team) => (
                    <TableRow key={team.id} className="hover:bg-blue-50/50">
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          <UsersRound className="h-4 w-4 text-primary" />
                          {team.name}
                        </div>
                      </TableCell>
                      <TableCell>{getSupervisorName(team.supervisorId)}</TableCell>
                      <TableCell>
                        <Badge variant="secondary">
                          {team.agentIds.length} {team.agentIds.length === 1 ? "Agent" : "Agents"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleOpenEditTeam(team)}
                        >
                          <Settings className="h-4 w-4 mr-2" />
                          Edit
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                  {getFilteredTeams().length === 0 && teams.length > 0 && (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-12">
                        <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-muted-foreground">
                          No Teams Found
                        </h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          No teams match your search criteria.
                        </p>
                      </TableCell>
                    </TableRow>
                  )}
                  {teams.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-12">
                        <UsersRound className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-muted-foreground">
                          No Teams Yet
                        </h3>
                        <p className="text-sm text-muted-foreground mt-1 mb-4">
                          Create your first team to start organizing agents.
                        </p>
                        <Button onClick={handleOpenCreateTeam}>
                          <Plus className="h-4 w-4 mr-2" />
                          Create Team
                        </Button>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </Card>

            {/* Create/Edit Team Modal */}
            <Dialog open={isCreateTeamOpen} onOpenChange={setIsCreateTeamOpen}>
              <DialogContent className="sm:max-w-[500px] max-h-[85vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <UsersRound className="h-5 w-5 text-primary" />
                    {editingTeam ? "Edit Team" : "Create Team"}
                  </DialogTitle>
                  <DialogDescription>
                    {editingTeam ? "Update team details and agent assignments" : "Set up a new team with a supervisor and agents"}
                  </DialogDescription>
                </DialogHeader>

                <div className="space-y-6 py-4">
                  {/* Team Name */}
                  <div className="space-y-2">
                    <Label htmlFor="teamName">Team Name</Label>
                    <Input
                      id="teamName"
                      placeholder="e.g., Billing Support Team"
                      value={newTeamName}
                      onChange={(e) => setNewTeamName(e.target.value)}
                    />
                  </div>

                  {/* Supervisor Dropdown */}
                  <div className="space-y-2">
                    <Label>Supervisor</Label>
                    <Select value={newTeamSupervisorId} onValueChange={setNewTeamSupervisorId}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a supervisor" />
                      </SelectTrigger>
                      <SelectContent>
                        {getSupervisors().map((supervisor) => (
                          <SelectItem key={supervisor.id} value={supervisor.id}>
                            {supervisor.fullName}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Add Agents Section */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label>Add Agents</Label>
                      <span className="text-sm text-muted-foreground">
                        {newTeamAgentIds.length} selected
                      </span>
                    </div>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search agents..."
                        value={createTeamAgentSearch}
                        onChange={(e) => setCreateTeamAgentSearch(e.target.value)}
                        className="pl-9"
                      />
                    </div>
                    <div className="border rounded-lg max-h-[200px] overflow-y-auto">
                      {getFilteredAgentsForCreate().length > 0 ? (
                        getFilteredAgentsForCreate().map((agent) => (
                          <div
                            key={agent.id}
                            className="flex items-center gap-3 p-3 hover:bg-muted border-b last:border-b-0 cursor-pointer transition-colors"
                            onClick={() => handleToggleAgent(agent.id)}
                          >
                            <Checkbox
                              checked={newTeamAgentIds.includes(agent.id)}
                              onCheckedChange={() => handleToggleAgent(agent.id)}
                            />
                            <div className="flex-1">
                              <p className="font-medium text-sm">{agent.fullName}</p>
                              <p className="text-xs text-muted-foreground">{agent.email}</p>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="p-6 text-center text-muted-foreground">
                          <Users className="h-8 w-8 mx-auto mb-2 opacity-50" />
                          <p className="text-sm">No agents available</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsCreateTeamOpen(false)}>
                    Cancel
                  </Button>
                  <Button
                    onClick={handleSaveTeam}
                    disabled={!newTeamName.trim() || !newTeamSupervisorId}
                  >
                    {editingTeam ? "Save Changes" : "Create Team"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </TabsContent>

          {/* <TabsContent value="training" className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-foreground">
                  Training History
                </h2>
                <p className="text-muted-foreground">
                  Track AI agent training sessions and performance improvements
                </p>
              </div>
              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Export History
              </Button>
            </div>

            <div className="grid gap-4">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Product Support Agent</CardTitle>
                      <CardDescription>
                        Training completed 2 hours ago
                      </CardDescription>
                    </div>
                    <Badge variant="default">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Completed
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-3">
                    <div>
                      <p className="text-sm font-medium">Training Duration</p>
                      <p className="text-2xl font-bold">2h 34m</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">
                        Accuracy Improvement
                      </p>
                      <p className="text-2xl font-bold text-chart-4">+3%</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">
                        Data Points Processed
                      </p>
                      <p className="text-2xl font-bold">1,247</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Billing Inquiries Agent</CardTitle>
                      <CardDescription>
                        Training completed 1 day ago
                      </CardDescription>
                    </div>
                    <Badge variant="default">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Completed
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-3">
                    <div>
                      <p className="text-sm font-medium">Training Duration</p>
                      <p className="text-2xl font-bold">1h 52m</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">
                        Accuracy Improvement
                      </p>
                      <p className="text-2xl font-bold text-chart-4">+5%</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">
                        Data Points Processed
                      </p>
                      <p className="text-2xl font-bold">892</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Refunds & Returns Agent</CardTitle>
                      <CardDescription>
                        Training failed 3 days ago
                      </CardDescription>
                    </div>
                    <Badge variant="destructive">
                      <AlertCircle className="h-3 w-3 mr-1" />
                      Failed
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">
                      Training failed due to insufficient data quality. Please
                      review and re-upload knowledge base.
                    </p>
                    <Button variant="outline" size="sm">
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Retry Training
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent> */}
        </Tabs>
      </div>
    </div>
  );
}
