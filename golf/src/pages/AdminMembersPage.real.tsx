import { useEffect, useState, useCallback, useMemo } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { ColDef, GridReadyEvent, GridApi } from 'ag-grid-community';
import {
  Plus,
  Search,
  Download,
  Edit,
  Trash2,
  User,
  AlertCircle,
  Loader2
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
import { Member, CreateMemberRequest } from '@/types/admin-member';
import { 
  backendTimestampToHtmlDate, 
  htmlDateToBackendTimestamp, 
  formatBackendTimestampForDisplay,
  getCurrentBackendTimestamp 
} from '@/utils/date-utils';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { memberService } from '@/services/member-service';

interface MemberFormData extends CreateMemberRequest {
  // Store dates in HTML format for form inputs
  dobHtml: string;
  dojHtml: string;
  dosHtml: string;
}


export function AdminMembersPage() {
   const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [gridApi, setGridApi] = useState<GridApi | null>(null);

  // Modal states
  const [showMemberModal, setShowMemberModal] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  // Form states
  const [editingMember, setEditingMember] = useState<Member | null>(null);
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [formData, setFormData] = useState<MemberFormData>({
    prefix: 'Mr.',
    name: '',
    addr1: '',
    addr2: '',
    addr3: '',
    city: '',
    pin: '',
    state: '',
    type: 'Regular',
    dob: '',
    doj: '',
    handicap: 0,
    pho: '',
    phr: '',
    phm: '',
    sex: 'M',
    ctcode: '',
    ccode: '',
    club: '',
    memberof: '',
    centre: '',
    fax: '',
    email: '',
    selflag: true,
    dos: '',
    updt: true,
    // HTML date formats for form inputs
    dobHtml: '',
    dojHtml: '',
    dosHtml: ''
  });

  // Load members
  const loadMembers = useCallback(async () => {
    try {
      setLoading(true);
      const data = await memberService.getAll();
      setMembers(data as Member[]);
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
    return members.filter((member: { name: string; email: string; city: string; type: string; }) =>
      member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.type.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [members, searchTerm]);

  // Status badge component
  const StatusBadge = ({ active }: { active: boolean }) => (
    <Badge variant={active ? 'default' : 'destructive'} className="flex items-center gap-1">
      {active ? <User className="h-3 w-3" /> : <AlertCircle className="h-3 w-3" />}
      {active ? 'Active' : 'Inactive'}
    </Badge>
  );

  // Gender badge component
  const GenderBadge = ({ sex }: { sex: string }) => (
    <Badge variant="outline">
      {sex === 'M' ? 'Male' : 'Female'}
    </Badge>
  );

  // Actions cell renderer
  const ActionsCellRenderer = ({ data }: { data: Member }) => {
    return (
      <div className="flex items-center gap-2">
        <button
          onClick={() => handleEdit(data)}
          className="p-1 hover:bg-gray-100 rounded"
          title="Edit Member"
        >
          <Edit className="h-4 w-4 text-blue-600" />
        </button>
        <button
          onClick={() => handleDelete(data)}
          className="p-1 hover:bg-gray-100 rounded"
          title="Delete Member"
        >
          <Trash2 className="h-4 w-4 text-red-600" />
        </button>
      </div>
    );
  };

  // Column definitions
  const columnDefs: ColDef[] = [
    { field: 'mId', headerName: 'ID', width: 100, hide: true },
    { field: 'prefix', headerName: 'Prefix', width: 80 },
    { field: 'name', headerName: 'Full Name', width: 200, pinned: 'left' },
    { field: 'email', headerName: 'Email', width: 250 },
    { field: 'pho', headerName: 'Office Phone', width: 140 },
    { field: 'phm', headerName: 'Mobile', width: 140 },
    {
      field: 'sex',
      headerName: 'Gender',
      width: 100,
      cellRenderer: ({ value }: { value: string }) => <GenderBadge sex={value} />
    },
    { field: 'city', headerName: 'City', width: 120 },
    { field: 'state', headerName: 'State', width: 100 },
    { field: 'type', headerName: 'Type', width: 120 },
    { field: 'handicap', headerName: 'Handicap', width: 100 },
    {
      field: 'dob',
      headerName: 'DOB',
      width: 120,
      valueFormatter: ({ value }: { value: string }) => 
        value ? formatBackendTimestampForDisplay(value) : ''
    },
    {
      field: 'doj',
      headerName: 'Join Date',
      width: 120,
      valueFormatter: ({ value }: { value: string }) => 
        value ? formatBackendTimestampForDisplay(value) : ''
    },
    {
      field: 'isDeleted',
      headerName: 'Status',
      width: 100,
      cellRenderer: ({ value }: { value: boolean }) => <StatusBadge active={!value} />
    },
    {
      headerName: 'Actions',
      width: 120,
      cellRenderer: ActionsCellRenderer,
      sortable: false,
      filter: false,
      pinned: 'right'
    }
  ];

  // Form handlers
  const resetForm = () => {
    setFormData({
      prefix: 'Mr.',
      name: '',
      addr1: '',
      addr2: '',
      addr3: '',
      city: '',
      pin: '',
      state: '',
      type: 'Regular',
      dob: '',
      doj: '',
      handicap: 0,
      pho: '',
      phr: '',
      phm: '',
      sex: 'M',
      ctcode: '',
      ccode: '',
      club: '',
      memberof: '',
      centre: '',
      fax: '',
      email: '',
      selflag: true,
      dos: '',
      updt: true,
      dobHtml: '',
      dojHtml: '',
      dosHtml: ''
    });
    setEditingMember(null);
  };

  const handleAdd = () => {
    resetForm();
    setShowMemberModal(true);
  };

  const handleEdit = (member: Member) => {
    setEditingMember(member);
    setFormData({
      prefix: member.prefix,
      name: member.name,
      addr1: member.addr1,
      addr2: member.addr2,
      addr3: member.addr3,
      city: member.city,
      pin: member.pin,
      state: member.state,
      type: member.type,
      dob: member.dob,
      doj: member.doj,
      handicap: member.handicap,
      pho: member.pho,
      phr: member.phr,
      phm: member.phm,
      sex: member.sex,
      ctcode: member.ctcode,
      ccode: member.ccode,
      club: member.club,
      memberof: member.memberof,
      centre: member.centre,
      fax: member.fax,
      email: member.email,
      selflag: member.selflag,
      dos: member.dos,
      updt: member.updt,
      // Convert backend timestamps to HTML date format for form inputs
      dobHtml: backendTimestampToHtmlDate(member.dob),
      dojHtml: backendTimestampToHtmlDate(member.doj),
      dosHtml: backendTimestampToHtmlDate(member.dos)
    });
    setShowMemberModal(true);
  };

  const handleSaveMember = async () => {
    try {
      // Convert HTML date inputs to backend timestamp format before sending
      const memberDataToSend: CreateMemberRequest = {
        prefix: formData.prefix,
        name: formData.name,
        addr1: formData.addr1,
        addr2: formData.addr2,
        addr3: formData.addr3,
        city: formData.city,
        pin: formData.pin,
        state: formData.state,
        type: formData.type,
        dob: formData.dobHtml ? htmlDateToBackendTimestamp(formData.dobHtml) : '',
        doj: formData.dojHtml ? htmlDateToBackendTimestamp(formData.dojHtml) : '',
        handicap: formData.handicap,
        pho: formData.pho,
        phr: formData.phr,
        phm: formData.phm,
        sex: formData.sex,
        ctcode: formData.ctcode,
        ccode: formData.ccode,
        club: formData.club,
        memberof: formData.memberof,
        centre: formData.centre,
        fax: formData.fax,
        email: formData.email,
        selflag: formData.selflag,
        dos: formData.dosHtml ? htmlDateToBackendTimestamp(formData.dosHtml) : getCurrentBackendTimestamp(),
        updt: formData.updt
      };

      if (editingMember) {
        await memberService.update(editingMember.mId, memberDataToSend);
        console.log('Member updated successfully');
      } else {
        await memberService.create({
          ...memberDataToSend,
          phone: formData.phm || '', // or another appropriate phone field
          role: 'member', // or another default/selected role
          status: 'active', // or another default/selected status
          joinDate: formData.dojHtml ? new Date(formData.dojHtml) : new Date()
        });
        console.log('Member created successfully');
      }
      setShowMemberModal(false);
      resetForm();
      loadMembers();
    } catch (error) {
      console.error('Failed to save member:', error);
    }
  };

  const handleDelete = (member: Member) => {
    setSelectedMember(member);
    setShowDeleteDialog(true);
  };

  const confirmDelete = async () => {
    if (!selectedMember) return;

    try {
      await memberService.delete(selectedMember.mId);
      console.log('Member deleted successfully');
      setShowDeleteDialog(false);
      setSelectedMember(null);
      loadMembers();
    } catch (error) {
      console.error('Failed to delete member:', error);
    }
  };

  // Export to CSV
  const handleExport = () => {
    if (gridApi) {
      gridApi.exportDataAsCsv({
        fileName: 'members.csv',
        columnKeys: ['mId', 'name', 'email', 'pho', 'phm', 'city', 'state', 'type', 'handicap']
      });
      console.log('Members exported to CSV');
    }
  };

  // Grid ready handler
  const onGridReady = (params: GridReadyEvent) => {
    setGridApi(params.api);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex items-center gap-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Loading members...</span>
        </div>
      </div>
    );
  }

  const pageActions = (
    <>
      <Button variant="outline" onClick={handleExport}>
        <Download className="h-4 w-4 mr-2" />
        Export CSV
      </Button>
      <Button onClick={handleAdd}>
        <Plus className="h-4 w-4 mr-2" />
        Add Member
      </Button>
    </>
  );

  return (
    <div className="space-y-6 p-6 max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Members Management</h1>
          <p className="text-muted-foreground">
            Manage golf club members and their information
          </p>
        </div>
        <div className="flex items-center gap-2">
          {pageActions}
        </div>
      </div>

      {/* Search and filters */}
      <div className="border rounded-lg p-6 shadow-sm">
        <div className="flex flex-col lg:flex-row items-start lg:items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search by name, email, city, or type..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div>
          <div className="text-sm text-gray-600">
            {filteredMembers.length} of {members.length} members
          </div>
        </div>
      </div>

      {/* AG Grid */}
      <div className="bg-white border rounded-lg overflow-hidden shadow-sm">
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
        <DialogContent className="sm:max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              {editingMember ? 'Edit Member' : 'Add New Member'}
            </DialogTitle>
            <DialogDescription>
              {editingMember ? 'Update member information' : 'Create a new member account'}
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Basic Information */}
            <div className="space-y-2">
              <Label htmlFor="prefix">Prefix</Label>
              <Select value={formData.prefix} onValueChange={(value) => setFormData({ ...formData, prefix: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Mr.">Mr.</SelectItem>
                  <SelectItem value="Mrs.">Mrs.</SelectItem>
                  <SelectItem value="Ms.">Ms.</SelectItem>
                  <SelectItem value="Dr.">Dr.</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="name">Full Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Enter full name"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="Enter email address"
                required
              />
            </div>

            {/* Contact Information */}
            <div className="space-y-2">
              <Label htmlFor="pho">Office Phone</Label>
              <Input
                id="pho"
                value={formData.pho}
                onChange={(e) => setFormData({ ...formData, pho: e.target.value })}
                placeholder="Enter office phone"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phr">Residence Phone</Label>
              <Input
                id="phr"
                value={formData.phr}
                onChange={(e) => setFormData({ ...formData, phr: e.target.value })}
                placeholder="Enter residence phone"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phm">Mobile Phone</Label>
              <Input
                id="phm"
                value={formData.phm}
                onChange={(e) => setFormData({ ...formData, phm: e.target.value })}
                placeholder="Enter mobile phone"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="fax">Fax</Label>
              <Input
                id="fax"
                value={formData.fax}
                onChange={(e) => setFormData({ ...formData, fax: e.target.value })}
                placeholder="Enter fax number"
              />
            </div>

            {/* Address Information */}
            <div className="space-y-2">
              <Label htmlFor="addr1">Address Line 1</Label>
              <Input
                id="addr1"
                value={formData.addr1}
                onChange={(e) => setFormData({ ...formData, addr1: e.target.value })}
                placeholder="Enter address line 1"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="addr2">Address Line 2</Label>
              <Input
                id="addr2"
                value={formData.addr2}
                onChange={(e) => setFormData({ ...formData, addr2: e.target.value })}
                placeholder="Enter address line 2"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="addr3">Address Line 3</Label>
              <Input
                id="addr3"
                value={formData.addr3}
                onChange={(e) => setFormData({ ...formData, addr3: e.target.value })}
                placeholder="Enter address line 3"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="city">City</Label>
              <Input
                id="city"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                placeholder="Enter city"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="state">State</Label>
              <Input
                id="state"
                value={formData.state}
                onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                placeholder="Enter state"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="pin">PIN Code</Label>
              <Input
                id="pin"
                value={formData.pin}
                onChange={(e) => setFormData({ ...formData, pin: e.target.value })}
                placeholder="Enter PIN code"
              />
            </div>

            {/* Personal Information */}
            <div className="space-y-2">
              <Label htmlFor="sex">Gender</Label>
              <Select value={formData.sex} onValueChange={(value) => setFormData({ ...formData, sex: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="M">Male</SelectItem>
                  <SelectItem value="F">Female</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="dob">Date of Birth</Label>
              <Input
                id="dob"
                type="date"
                value={formData.dobHtml}
                onChange={(e) => setFormData({ ...formData, dobHtml: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="doj">Date of Joining</Label>
              <Input
                id="doj"
                type="date"
                value={formData.dojHtml}
                onChange={(e) => setFormData({ ...formData, dojHtml: e.target.value })}
              />
            </div>

            {/* Golf Information */}
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

            <div className="space-y-2">
              <Label htmlFor="type">Member Type</Label>
              <Input
                id="type"
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                placeholder="Enter member type"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="club">Club</Label>
              <Input
                id="club"
                value={formData.club}
                onChange={(e) => setFormData({ ...formData, club: e.target.value })}
                placeholder="Enter club name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="memberof">Member Of</Label>
              <Input
                id="memberof"
                value={formData.memberof}
                onChange={(e) => setFormData({ ...formData, memberof: e.target.value })}
                placeholder="Enter organization"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="centre">Centre</Label>
              <Input
                id="centre"
                value={formData.centre}
                onChange={(e) => setFormData({ ...formData, centre: e.target.value })}
                placeholder="Enter centre"
              />
            </div>

            {/* Code Information */}
            <div className="space-y-2">
              <Label htmlFor="ctcode">City Code</Label>
              <Input
                id="ctcode"
                value={formData.ctcode}
                onChange={(e) => setFormData({ ...formData, ctcode: e.target.value })}
                placeholder="Enter city code"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="ccode">Country Code</Label>
              <Input
                id="ccode"
                value={formData.ccode}
                onChange={(e) => setFormData({ ...formData, ccode: e.target.value })}
                placeholder="Enter country code"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="dos">Date of Service</Label>
              <Input
                id="dos"
                type="date"
                value={formData.dosHtml}
                onChange={(e) => setFormData({ ...formData, dosHtml: e.target.value })}
              />
            </div>
          </div>

          <DialogFooter className="mt-6">
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
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-red-600" />
              Delete Member
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete <strong>{selectedMember?.name}</strong>? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmDelete} 
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Delete Member
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
