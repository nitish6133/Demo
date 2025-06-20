import { useEffect, useState, useCallback, useMemo } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { ColDef, GridReadyEvent, GridApi } from 'ag-grid-community';
import { 
  Plus, 
  Search, 
  Download, 
  Upload, 
  Edit, 
  Trash2, 
  Key, 
  Ban, 
  CheckCircle,
  X,
  FileText,
  AlertCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { memberService, type AdminMember } from '@/services/member-service';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';

interface MemberFormData {
  name: string;
  email: string;
  phone: string;
  role: 'admin' | 'member' | 'scorer';
  status: 'active' | 'blocked';
  handicap: number;
  password?: string;
  joinDate?: Date;
}

export function AdminMembersPage() {
  const [members, setMembers] = useState<AdminMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [gridApi, setGridApi] = useState<GridApi | null>(null);
  
  // Modal states
  const [showMemberModal, setShowMemberModal] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showResetPasswordDialog, setShowResetPasswordDialog] = useState(false);
  const [showToggleStatusDialog, setShowToggleStatusDialog] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  
  // Form states
  const [editingMember, setEditingMember] = useState<AdminMember | null>(null);
  const [selectedMember, setSelectedMember] = useState<AdminMember | null>(null);
  const [formData, setFormData] = useState<MemberFormData>({
    name: '',
    email: '',
    phone: '',
    role: 'member',
    status: 'active',
    handicap: 0,
    password: ''
  });
  const [csvData, setCsvData] = useState('');
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState('');
  const [importResult, setImportResult] = useState<{ success: number; duplicates: number; errors: number; } | null>(null);

  // Load members
  const loadMembers = useCallback(async () => {
    try {
      setLoading(true);
      const data = await memberService.getAll() as AdminMember[];
      setMembers(data);
    } catch (error) {
      console.error('Failed to load members:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadMembers();
  }, [loadMembers]);

  // Filter members based on search
  const filteredMembers = useMemo(() => {
    if (!searchTerm) return members;
    return members.filter(member =>
      member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.role.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [members, searchTerm]);

  // File handling functions
  const handleFileRead = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      setCsvData(content);
      setUploadedFileName(file.name);
    };
    reader.readAsText(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    const csvFile = files.find(file => 
      file.type === 'text/csv' || 
      file.name.toLowerCase().endsWith('.csv')
    );
    
    if (csvFile) {
      handleFileRead(csvFile);
    } else {
      console.error('Please upload a CSV file');
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileRead(file);
    }
  };

  const clearCsvData = () => {
    setCsvData('');
    setUploadedFileName('');
    setImportResult(null);
  };
  // Status badge component
  const StatusBadge = ({ status }: { status: 'active' | 'blocked' }) => (
    <Badge variant={status === 'active' ? 'default' : 'destructive'} className="flex items-center gap-1">
      {status === 'active' ? <CheckCircle className="h-3 w-3" /> : <Ban className="h-3 w-3" />}
      {status}
    </Badge>
  );

  // Role badge component
  const RoleBadge = ({ role }: { role: string }) => {
    const variant = role === 'admin' ? 'destructive' : role === 'scorer' ? 'default' : 'outline';
    return <Badge variant={variant}>{role}</Badge>;
  };

  // Actions cell renderer
  const ActionsCellRenderer = ({ data }: { data: AdminMember }) => {
    return (
      <div className="action-buttons">
        <button
          onClick={() => handleEdit(data)}
          title="Edit Member"
        >
          <Edit />
        </button>
        <button
          onClick={() => handleResetPassword(data)}
          title="Reset Password"
        >
          <Key />
        </button>
        <button
          onClick={() => handleToggleStatus(data)}
          title={data.status === 'active' ? 'Block Member' : 'Unblock Member'}
        >
          {data.status === 'active' ? <Ban /> : <CheckCircle />}
        </button>
        <button
          className="destructive"
          onClick={() => handleDelete(data)}
          title="Delete Member"
        >
          <Trash2 />
        </button>
      </div>
    );
  };

  // Column definitions
  const columnDefs: ColDef[] = [
    { field: 'id', headerName: 'Member ID', width: 120, pinned: 'left' },
    { field: 'name', headerName: 'Full Name', width: 200, pinned: 'left' },
    { field: 'email', headerName: 'Email', width: 250 },
    { field: 'phone', headerName: 'Phone', width: 150 },
    { 
      field: 'role', 
      headerName: 'Role', 
      width: 120,
      cellRenderer: ({ value }: { value: string }) => <RoleBadge role={value} />
    },
    { 
      field: 'status', 
      headerName: 'Status', 
      width: 120,
      cellRenderer: ({ value }: { value: 'active' | 'blocked' }) => <StatusBadge status={value} />
    },
    { field: 'handicap', headerName: 'Handicap', width: 100 },
    { 
      field: 'joinDate', 
      headerName: 'Join Date', 
      width: 120,
      valueFormatter: ({ value }: { value: Date }) => new Date(value).toLocaleDateString()
    },
    {
      headerName: 'Actions',
      width: 180,
      cellRenderer: ActionsCellRenderer,
      sortable: false,
      filter: false,
      pinned: 'right'
    }
  ];

  // Grid ready handler
  const onGridReady = (params: GridReadyEvent) => {
    setGridApi(params.api);
  };

  // Form handlers
  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      role: 'member',
      status: 'active',
      handicap: 0,
      password: ''
    });
    setEditingMember(null);
  };

  const handleAdd = () => {
    resetForm();
    setShowMemberModal(true);
  };

  const handleEdit = (member: AdminMember) => {
    setEditingMember(member);
    setFormData({
      name: member.name,
      email: member.email,
      phone: member.phone,
      role: member.role,
      status: member.status,
      handicap: member.handicap,
      password: ''
    });
    setShowMemberModal(true);
  };

  const handleSaveMember = async () => {
    try {
      if (editingMember) {
        // For updates, only send the changed fields
        const updateData: Partial<AdminMember> = {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          role: formData.role,
          status: formData.status,
          handicap: formData.handicap
        };
        await memberService.update!(editingMember.id, updateData);
        console.log('Member updated successfully');
      } else {
        // For creation, convert form data to the expected format
        const createData: Omit<AdminMember, 'id' | 'createdAt' | 'isActive'> = {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          role: formData.role,
          status: formData.status,
          handicap: formData.handicap,
          joinDate: formData.joinDate || new Date(),
          lastLogin: undefined
        };
        await memberService.create(createData);
        console.log('Member created successfully');
      }
      setShowMemberModal(false);
      resetForm();
      loadMembers();
    } catch (error) {
      console.error('Failed to save member:', error);
    }
  };

  const handleDelete = (member: AdminMember) => {
    setSelectedMember(member);
    setShowDeleteDialog(true);
  };

  const confirmDelete = async () => {
    if (!selectedMember) return;
    
    try {
      await memberService.delete(selectedMember.id);
      console.log('Member deleted successfully');
      setShowDeleteDialog(false);
      setSelectedMember(null);
      loadMembers();
    } catch (error) {
      console.error('Failed to delete member:', error);
    }
  };

  const handleResetPassword = (member: AdminMember) => {
    setSelectedMember(member);
    setShowResetPasswordDialog(true);
  };

  const confirmResetPassword = async () => {
    if (!selectedMember) return;
    
    try {
      await memberService.resetPassword!(selectedMember.id);
      console.log(`Password reset to phone number: ${selectedMember.phone}`);
      setShowResetPasswordDialog(false);
      setSelectedMember(null);
    } catch (error) {
      console.error('Failed to reset password:', error);
    }
  };

  const handleToggleStatus = (member: AdminMember) => {
    setSelectedMember(member);
    setShowToggleStatusDialog(true);
  };

  const confirmToggleStatus = async () => {
    if (!selectedMember) return;
    
    try {
      await memberService.toggleStatus!(selectedMember.id);
      const action = selectedMember.status === 'active' ? 'blocked' : 'unblocked';
      console.log(`Member ${action} successfully`);
      setShowToggleStatusDialog(false);
      setSelectedMember(null);
      loadMembers();
    } catch (error) {
      console.error('Failed to update member status:', error);
    }
  };

  // Export to CSV
  const handleExport = () => {
    if (gridApi) {
      gridApi.exportDataAsCsv({
        fileName: 'members.csv',
        columnKeys: ['id', 'name', 'email', 'phone', 'role', 'status', 'handicap', 'joinDate']
      });
      console.log('Members exported to CSV');
    }
  };

  // Import from CSV
  const handleImport = async () => {
    if (!csvData.trim()) {
      console.error('Please enter CSV data');
      return;
    }

    try {
      const result = await memberService.importFromCSV!(csvData);
      setImportResult(result);
      
      if (result.success > 0) {
        loadMembers();
        console.log(`Successfully imported ${result.success} members`);
      }
      
      if (result.duplicates > 0) {
        console.log(`${result.duplicates} duplicates skipped`);
      }
      
      if (result.errors > 0) {
        console.error(`${result.errors} errors encountered`);
      }
    } catch (error) {
      console.error('Failed to import members:', error);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6 p-4 lg:p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-muted rounded w-48 mb-2"></div>
          <div className="h-4 bg-muted rounded w-96"></div>
        </div>
        <div className="h-96 bg-muted rounded animate-pulse"></div>
      </div>
    );
  }

  const pageActions = (
    <>
      <Button variant="outline" onClick={() => setShowImportModal(true)}>
        <Upload className="mr-2 h-4 w-4" />
        Import CSV
      </Button>
      <Button variant="outline" onClick={handleExport}>
        <Download className="mr-2 h-4 w-4" />
        Export CSV
      </Button>
      <Button onClick={handleAdd}>
        <Plus className="mr-2 h-4 w-4" />
        Add Member
      </Button>
    </>
  );

  return (
    <div className="space-y-6 p-4 lg:p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Members Management</h1>
          <p className="text-muted-foreground">
            Manage golf club members, roles, and permissions
          </p>
        </div>
        <div className="flex items-center gap-2">
          {pageActions}
        </div>
      </div>

      {/* Search and filters */}
      <div className="bg-card border rounded-lg p-6">
        <div className="flex flex-col lg:flex-row items-start lg:items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name, email, or role..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div>
          <div className="text-sm text-muted-foreground">
            {filteredMembers.length} of {members.length} members
          </div>
        </div>
      </div>

      {/* AG Grid */}
      <div className="bg-card border rounded-lg overflow-hidden">
        <div className={`ag-theme-alpine${document.documentElement.classList.contains('dark') ? '-dark' : ''} h-[70vh]`} style={{ width: '100%', maxWidth: 'none' }}>
          <AgGridReact
            rowData={filteredMembers}
            columnDefs={columnDefs}
            onGridReady={onGridReady}
            pagination={true}
            paginationPageSize={20}
            domLayout="normal"
            suppressCellFocus={true}
            rowSelection="single"
            animateRows={true}
            suppressHorizontalScroll={false}
          />
        </div>
      </div>

      {/* Add/Edit Member Modal */}
      <Dialog open={showMemberModal} onOpenChange={setShowMemberModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingMember ? 'Edit Member' : 'Add New Member'}
            </DialogTitle>
            <DialogDescription>
              {editingMember ? 'Update member information' : 'Create a new member account'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Enter full name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="Enter email address"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="Enter phone number"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <Select value={formData.role} onValueChange={(value: any) => setFormData({ ...formData, role: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="member">Member</SelectItem>
                    <SelectItem value="scorer">Scorer</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select value={formData.status} onValueChange={(value: any) => setFormData({ ...formData, status: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="blocked">Blocked</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="handicap">Handicap</Label>
              <Input
                id="handicap"
                type="number"
                step="0.1"
                value={formData.handicap}
                onChange={(e) => setFormData({ ...formData, handicap: parseFloat(e.target.value) || 0 })}
                placeholder="Enter handicap"
              />
            </div>
            {!editingMember && (
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="Enter password"
                />
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowMemberModal(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveMember}>
              {editingMember ? 'Update' : 'Create'} Member
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Member</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete {selectedMember?.name}? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Reset Password Confirmation */}
      <AlertDialog open={showResetPasswordDialog} onOpenChange={setShowResetPasswordDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Reset Password</AlertDialogTitle>
            <AlertDialogDescription>
              Reset password for {selectedMember?.name} to their phone number ({selectedMember?.phone})?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmResetPassword}>
              Reset Password
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Toggle Status Confirmation */}
      <AlertDialog open={showToggleStatusDialog} onOpenChange={setShowToggleStatusDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {selectedMember?.status === 'active' ? 'Block' : 'Unblock'} Member
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to {selectedMember?.status === 'active' ? 'block' : 'unblock'} {selectedMember?.name}?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmToggleStatus}>
              {selectedMember?.status === 'active' ? 'Block' : 'Unblock'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Import CSV Modal */}
      <Dialog open={showImportModal} onOpenChange={setShowImportModal}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Import Members from CSV</DialogTitle>
            <DialogDescription>
              Paste CSV data with columns: name, email, phone, role, status, handicap
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
              <textarea
                id="csvData"
                className="w-full h-32 p-3 border rounded-md resize-none font-mono text-sm bg-background text-foreground border-border"
                value={csvData}
                onChange={(e) => setCsvData(e.target.value)}
                placeholder="Paste your CSV data here..."
              />

            {importResult && (
              <div className="p-4 bg-muted rounded-lg">
                <h4 className="font-medium mb-2">Import Results:</h4>
                <div className="space-y-1 text-sm">
                  <p className="text-green-600">✓ {importResult.success} members imported successfully</p>
                  {importResult.duplicates > 0 && (
                    <p className="text-yellow-600">⚠ {importResult.duplicates} duplicates skipped</p>
                  )}
                  {importResult.errors > 0 && (
                    <p className="text-red-600">✗ {importResult.errors} errors encountered</p>
                  )}
                </div>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setShowImportModal(false);
              clearCsvData();
            }}>
              Close
            </Button>
            <Button onClick={handleImport} disabled={!csvData.trim()}>
              Import Members
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}