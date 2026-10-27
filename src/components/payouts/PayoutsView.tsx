import React, { useState, useMemo } from 'react';
import {
  Wallet,
  DollarSign,
  TrendingUp,
  Download,
  Building,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  ShieldCheck,
  AlertCircle,
  Search,
  ChevronDown
} from 'lucide-react';
import type { PayoutTransaction } from '../../types';
import { Table, type Column } from '../common/Table';
import { Pagination } from '../common/Pagination';
import { MetricCard } from '../common/MetricCard';
import { Modal } from '../common/Modal';
import { mockVendorProfile } from '../../data/mockVendorData';

interface PayoutsViewProps {
  payouts: PayoutTransaction[];
  onRequestPayout: (amount: number) => void;
  onShowToast: (msg: string) => void;
}

export const PayoutsView: React.FC<PayoutsViewProps> = ({
  payouts,
  onRequestPayout,
  onShowToast
}) => {
  const [isWithdrawOpen, setIsWithdrawOpen] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState('5000000');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'completed' | 'processing' | 'pending'>('all');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const totalGross = payouts.reduce((sum, p) => sum + p.grossRevenue, 0);
  const totalPlatformFees = payouts.reduce((sum, p) => sum + p.platformFee, 0);
  const totalSettled = payouts
    .filter(p => p.status === 'completed')
    .reduce((sum, p) => sum + p.amount, 0);

  const pendingSettlement = payouts
    .filter(p => p.status === 'processing' || p.status === 'pending')
    .reduce((sum, p) => sum + p.amount, 0);

  const formatCurrency = (val: number) => {
    if (val >= 10000000) return `₹${(val / 10000000).toFixed(2)} Cr`;
    if (val >= 100000) return `₹${(val / 100000).toFixed(1)} L`;
    return `₹${val.toLocaleString()}`;
  };

  const filteredPayouts = useMemo(() => {
    return payouts.filter((p) => {
      if (statusFilter !== 'all' && p.status !== statusFilter) return false;
      if (search.trim()) {
        const q = search.toLowerCase();
        const matchesRef = p.referenceId?.toLowerCase().includes(q);
        const matchesTitle = p.concertTitle.toLowerCase().includes(q);
        const matchesMethod = p.method.toLowerCase().includes(q);
        if (!matchesRef && !matchesTitle && !matchesMethod) return false;
      }
      return true;
    });
  }, [payouts, statusFilter, search]);

  const totalPages = Math.max(1, Math.ceil(filteredPayouts.length / pageSize));
  const safePage = Math.min(page, totalPages);
  const startIdx = (safePage - 1) * pageSize;
  const paginatedPayouts = filteredPayouts.slice(startIdx, startIdx + pageSize);

  const handleWithdrawSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amt = Number(withdrawAmount);
    if (!amt || amt <= 0) return;

    onRequestPayout(amt);
    setIsWithdrawOpen(false);
    onShowToast(`Payout request of ₹${amt.toLocaleString()} initiated to ${mockVendorProfile.bankName}!`);
  };

  const columns: Column<PayoutTransaction>[] = [
    {
      key: 'referenceId',
      header: 'Reference ID',
      render: (item) => (
        <span className="font-mono text-xs font-semibold text-slate-800 bg-slate-100/90 border border-slate-200/80 px-2.5 py-1 rounded-md whitespace-nowrap">
          {item.referenceId}
        </span>
      )
    },
    {
      key: 'concertTitle',
      header: 'Concert & Details',
      render: (item) => (
        <div className="min-w-0 max-w-xs sm:max-w-sm">
          <span className="font-semibold text-slate-900 block truncate text-xs sm:text-[13px]" title={item.concertTitle}>
            {item.concertTitle}
          </span>
          <span className="text-[11px] text-slate-500 block truncate mt-0.5">
            {item.method}
          </span>
        </div>
      )
    },
    {
      key: 'date',
      header: 'Date',
      render: (item) => (
        <span className="text-xs text-slate-600 whitespace-nowrap">
          {new Date(item.date).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
          })}
        </span>
      )
    },
    {
      key: 'grossRevenue',
      header: 'Gross Sales',
      render: (item) => (
        <span className="text-xs font-semibold text-slate-800 whitespace-nowrap">
          {formatCurrency(item.grossRevenue)}
        </span>
      )
    },
    {
      key: 'platformFee',
      header: 'Platform Fee (5%)',
      render: (item) => (
        <span className="text-xs text-slate-500 whitespace-nowrap">
          - {formatCurrency(item.platformFee)}
        </span>
      )
    },
    {
      key: 'amount',
      header: 'Net Payout',
      render: (item) => (
        <span className="text-sm font-semibold text-slate-900 whitespace-nowrap">
          {formatCurrency(item.amount)}
        </span>
      )
    },
    {
      key: 'status',
      header: 'Status',
      render: (item) => {
        if (item.status === 'completed') {
          return (
            <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200/80 whitespace-nowrap">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              Completed
            </span>
          );
        }
        if (item.status === 'processing') {
          return (
            <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-amber-700 bg-amber-50 px-2.5 py-1 rounded-md border border-amber-200/80 whitespace-nowrap">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse" />
              Processing
            </span>
          );
        }
        return (
          <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-slate-600 bg-slate-100 px-2.5 py-1 rounded-md border border-slate-200 whitespace-nowrap">
            <span className="h-1.5 w-1.5 rounded-full bg-slate-400" />
            In Escrow
          </span>
        );
      }
    }
  ];

  return (
    <div className="space-y-4">
      {/* Top Banner */}
      <div className="rounded-lg border border-slate-200/90 bg-white p-4 sm:p-5 shadow-2xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-slate-900">
            Earnings & Payouts
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Track ticket earnings, platform fees, and withdraw funds directly to your bank account.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsWithdrawOpen(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-md text-xs font-semibold bg-purple-600 text-white hover:bg-purple-700 shadow-xs shadow-purple-200 transition-all cursor-pointer self-start sm:self-auto shrink-0"
        >
          <ArrowUpRight className="h-4 w-4" />
          <span>Request Payout</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          label="Total Gross Box Office"
          value={formatCurrency(totalGross)}
          isPositive={true}
          // change="All Tours"
          icon={TrendingUp}
          accentColor="purple"
        />

        <MetricCard
          label="Settled to Bank Account"
          value={formatCurrency(totalSettled)}
          isPositive={true}
          // change="Paid out"
          icon={CheckCircle2}
          accentColor="emerald"
        />

        <MetricCard
          label="In Transit / Escrow"
          value={formatCurrency(pendingSettlement)}
          isPositive={true}
          // change="Processing"
          icon={Clock}
          accentColor="amber"
        />

        <MetricCard
          label="Platform Fee Deducted (5%)"
          value={formatCurrency(totalPlatformFees)}
          isPositive={true}
          // change="DigitalRaiz Net"
          icon={DollarSign}
          accentColor="cyan"
        />
      </div>

      {/* Settlements Table Card */}
      <div className="rounded-lg border border-slate-200/90 bg-white shadow-2xs overflow-hidden">
        {/* Card Header: Search & Filter Toolbar */}
        <div className="p-4 sm:p-5 border-b border-slate-200/80 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-semibold text-slate-900">
              Payout History
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Recent payouts, platform fee breakdown, and bank transfer logs.
            </p>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap sm:flex-nowrap">
            {/* Search */}
            <div className="relative w-full sm:w-60">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
              <input
                type="text"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                placeholder="Search reference or event..."
                className="w-full rounded-md border border-slate-200 bg-slate-50/70 pl-8.5 pr-3 py-1.5 text-xs text-slate-800 placeholder:text-slate-400 outline-none focus:border-purple-500 focus:bg-white transition-all shadow-2xs"
              />
            </div>

            {/* Status Filter Dropdown */}
            <div className="relative">
              <select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value as 'all' | 'completed' | 'processing' | 'pending');
                  setPage(1);
                }}
                className="appearance-none rounded-md border border-slate-200 bg-white pl-3 pr-8 py-1.5 text-xs font-semibold text-slate-700 outline-none focus:border-purple-500 cursor-pointer shadow-2xs transition-all hover:border-slate-300 min-w-[125px]"
              >
                <option value="all">All Statuses</option>
                <option value="completed">Completed</option>
                <option value="processing">Processing</option>
                <option value="pending">In Escrow</option>
              </select>
              <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Table with Attached Pagination */}
        <Table
          columns={columns}
          data={paginatedPayouts}
          keyExtractor={(p) => p.id}
          showPagination={false}
          containerClassName="border-0 rounded-none shadow-none bg-transparent"
          emptyMessage="No payout records found matching your filter."
          footer={
            filteredPayouts.length > 0 ? (
              <Pagination
                variant="attached"
                currentPage={safePage}
                totalItems={filteredPayouts.length}
                pageSize={pageSize}
                onPageChange={setPage}
                onPageSizeChange={(sz) => {
                  setPageSize(sz);
                  setPage(1);
                }}
                pageSizeOptions={[5, 10, 20]}
                itemName="payouts"
              />
            ) : undefined
          }
        />
      </div>

      {/* Request Payout Modal */}
      <Modal
        isOpen={isWithdrawOpen}
        onClose={() => setIsWithdrawOpen(false)}
        title="Request Corporate RTGS Payout"
        subtitle="Transfer box office proceeds directly to your verified bank account"
        maxWidth="md"
      >
        <form onSubmit={handleWithdrawSubmit} className="space-y-4 text-xs">
          <div className="p-3 rounded-xl border border-slate-200 bg-slate-50 space-y-1">
            <span className="text-[10px] uppercase font-semibold text-slate-400">Destination Account</span>
            <p className="font-semibold text-slate-900">{mockVendorProfile.companyName}</p>
            <p className="text-slate-500">{mockVendorProfile.bankName} (A/C {mockVendorProfile.bankAccountNumber})</p>
          </div>

          <div className="space-y-1">
            <label className="font-semibold text-slate-700">Withdrawal Amount (INR) *</label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-semibold">₹</span>
              <input
                type="number"
                required
                value={withdrawAmount}
                onChange={(e) => setWithdrawAmount(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-8 pr-3.5 py-2 text-sm font-semibold text-slate-800 focus:outline-none focus:border-purple-500"
              />
            </div>
            <p className="text-[10px] text-slate-400">Available cleared balance: ₹24.50 Cr</p>
          </div>

          <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsWithdrawOpen(false)}
              className="px-4 py-2 rounded-md text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-md text-xs font-semibold bg-purple-600 text-white hover:bg-purple-700 shadow-sm shadow-purple-200 transition-all cursor-pointer"
            >
              Initiate Bank Settlement
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
