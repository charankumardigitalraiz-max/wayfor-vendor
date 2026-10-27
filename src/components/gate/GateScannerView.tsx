import React, { useState, useEffect } from 'react';
import {
  Scan,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Camera,
  Radio,
  Users,
  ShieldCheck,
  RefreshCw,
  Search,
  Volume2
} from 'lucide-react';
import type { AttendeeBooking, GateScanLog, ConcertEvent } from '../../types';
import { vendorConcertService } from '../../services/vendorConcertService';
import { Table, type Column } from '../common/Table';

interface GateScannerViewProps {
  concerts: ConcertEvent[];
  attendees: AttendeeBooking[];
  onRefreshData: () => void;
  onShowToast: (msg: string) => void;
}

export const GateScannerView: React.FC<GateScannerViewProps> = ({
  concerts,
  attendees,
  onRefreshData,
  onShowToast
}) => {
  const [selectedConcertId, setSelectedConcertId] = useState<string>(concerts[0]?.id || '');
  const [selectedGate, setSelectedGate] = useState<string>('Gate 1 (VIP & Express Lane)');
  const [ticketInput, setTicketInput] = useState('');
  const [scanResult, setScanResult] = useState<{
    status: 'granted' | 'duplicate' | 'invalid' | null;
    message: string;
    attendee?: AttendeeBooking;
  }>({ status: null, message: '' });

  const [scanLogs, setScanLogs] = useState<GateScanLog[]>([]);

  useEffect(() => {
    setScanLogs(vendorConcertService.getScanLogs());
  }, []);

  const activeConcert = concerts.find(c => c.id === selectedConcertId) || concerts[0];
  const concertAttendees = attendees.filter(
    a => a.concertId === activeConcert?.id || a.concertTitle === activeConcert?.title
  );

  const scannedCount = concertAttendees.filter(a => a.checkedIn).length;
  const totalExpected = concertAttendees.length || 1;
  const scanRate = Math.round((scannedCount / totalExpected) * 100);

  const handleValidateTicket = (codeToTest?: string) => {
    const code = (codeToTest || ticketInput).trim();
    if (!code) return;

    const result = vendorConcertService.validateAndCheckInTicket(
      code,
      selectedGate,
      'Vikram (Gate Sup.)'
    );

    setScanResult({
      status: result.status,
      message: result.message,
      attendee: result.attendee
    });

    setScanLogs(vendorConcertService.getScanLogs());
    setTicketInput('');
    onRefreshData();

    if (result.status === 'granted') {
      onShowToast(`Gate Access Granted: ${result.attendee?.customerName}`);
    } else if (result.status === 'duplicate') {
      onShowToast(`WARNING: Duplicate ticket entry attempted!`);
    } else {
      onShowToast(`ERROR: Invalid ticket barcode!`);
    }
  };

  const logColumns: Column<GateScanLog>[] = [
    {
      key: 'timestamp',
      header: 'Time',
      render: (log) => (
        <span className="font-mono text-slate-500">
          {new Date(log.timestamp).toLocaleTimeString()}
        </span>
      )
    },
    {
      key: 'ticketCode',
      header: 'Barcode / Code',
      render: (log) => (
        <span className="font-mono font-semibold text-slate-800 bg-slate-100 px-2 py-0.5 rounded">
          {log.ticketCode}
        </span>
      )
    },
    {
      key: 'attendeeName',
      header: 'Ticket Holder',
      render: (log) => (
        <div>
          <span className="font-semibold text-slate-900 block">{log.attendeeName}</span>
          <span className="text-[10px] text-slate-400">{log.ticketTier}</span>
        </div>
      )
    },
    {
      key: 'gateNumber',
      header: 'Gate',
      render: (log) => <span className="text-slate-600">{log.gateNumber}</span>
    },
    {
      key: 'status',
      header: 'Result',
      render: (log) => {
        if (log.status === 'granted') {
          return (
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              <CheckCircle2 className="h-3 w-3" /> Granted
            </span>
          );
        }
        if (log.status === 'duplicate') {
          return (
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
              <AlertTriangle className="h-3 w-3" /> Duplicate
            </span>
          );
        }
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200">
            <XCircle className="h-3 w-3" /> Invalid
          </span>
        );
      }
    }
  ];

  return (
    <div className="space-y-5">
      {/* Top Banner */}
      <div className="rounded-xl border border-slate-200/90 bg-white p-5 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-semibold tracking-tight text-slate-900">
              Live Gate Entry & Barcode Scanner Console
            </h1>
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
              Gate Live
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Validate attendee QR codes & barcodes, prevent duplicate gate re-entry, and monitor real-time arena headcount.
          </p>
        </div>

        {/* Concert Selector */}
        <div className="flex items-center gap-3">
          <select
            value={selectedConcertId}
            onChange={(e) => setSelectedConcertId(e.target.value)}
            className="rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs font-semibold text-slate-800 focus:outline-none focus:border-purple-500"
          >
            {concerts.map((c) => (
              <option key={c.id} value={c.id}>
                {c.title} ({c.city})
              </option>
            ))}
          </select>

          <select
            value={selectedGate}
            onChange={(e) => setSelectedGate(e.target.value)}
            className="rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs font-semibold text-slate-800 focus:outline-none focus:border-purple-500"
          >
            <option value="Gate 1 (VIP & Express Lane)">Gate 1 (VIP & Express Lane)</option>
            <option value="Gate 2 (General West Lawn)">Gate 2 (General West Lawn)</option>
            <option value="Gate 3 (East Grandstand)">Gate 3 (East Grandstand)</option>
            <option value="Gate 4 (Kinetic Standing Pit)">Gate 4 (Kinetic Standing Pit)</option>
          </select>
        </div>
      </div>

      {/* Main Scanner Dashboard */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Left 2 Cols: Optical Scanner Viewfinder & Input */}
        <div className="lg:col-span-2 space-y-4">
          <div className="rounded-2xl border border-slate-200 bg-slate-950 p-6 text-white shadow-xl space-y-5">
            {/* Viewfinder Graphic */}
            <div className="relative h-64 w-full rounded-xl bg-slate-900 border border-slate-800 flex flex-col items-center justify-center overflow-hidden">
              {/* Scan Laser Animation */}
              <div className="absolute inset-x-8 top-1/2 -translate-y-1/2 h-0.5 bg-gradient-to-r from-transparent via-purple-500 to-transparent shadow-[0_0_15px_#9333EA] animate-pulse" />

              {/* Reticle corners */}
              <div className="absolute top-8 left-8 h-8 w-8 border-t-2 border-l-2 border-purple-400" />
              <div className="absolute top-8 right-8 h-8 w-8 border-t-2 border-r-2 border-purple-400" />
              <div className="absolute bottom-8 left-8 h-8 w-8 border-b-2 border-l-2 border-purple-400" />
              <div className="absolute bottom-8 right-8 h-8 w-8 border-b-2 border-r-2 border-purple-400" />

              <div className="text-center space-y-2 z-10">
                <Camera className="h-10 w-10 text-purple-400 mx-auto animate-pulse" />
                <p className="text-xs font-semibold text-slate-300">
                  Ready for Optical Barcode / QR Scan
                </p>
                <p className="text-[11px] text-slate-500">
                  Active Station: <span className="text-purple-300 font-semibold">{selectedGate}</span>
                </p>
              </div>
            </div>

            {/* Manual Ticket Input Field */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-300">
                Fast Barcode / Ticket Code Input
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={ticketInput}
                  onChange={(e) => setTicketInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleValidateTicket()}
                  placeholder="Scan or type barcode (e.g. TKT-9821-VIP)..."
                  className="flex-1 rounded-xl border border-slate-700 bg-slate-900 px-4 py-2.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-purple-500 font-mono"
                />
                <button
                  type="button"
                  onClick={() => handleValidateTicket()}
                  className="px-5 py-2.5 rounded-md text-xs font-semibold bg-purple-600 text-white hover:bg-purple-700 transition-colors cursor-pointer"
                >
                  Verify Ticket
                </button>
              </div>

              {/* Sample Quick Test Buttons */}
              <div className="flex items-center gap-2 pt-1 flex-wrap">
                <span className="text-[10px] text-slate-400 font-medium">Test Codes:</span>
                {['TKT-9821-VIP', 'TKT-9823-VVIP', 'TKT-9824-COLD', 'TKT-9826-DIL'].map((code) => (
                  <button
                    key={code}
                    type="button"
                    onClick={() => handleValidateTicket(code)}
                    className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] font-mono cursor-pointer border border-slate-700"
                  >
                    {code}
                  </button>
                ))}
              </div>
            </div>

            {/* Verification Result Banner */}
            {scanResult.status && (
              <div
                className={`p-4 rounded-xl border animate-in fade-in duration-200 ${scanResult.status === 'granted'
                    ? 'bg-emerald-950/80 border-emerald-500 text-emerald-200'
                    : scanResult.status === 'duplicate'
                      ? 'bg-amber-950/80 border-amber-500 text-amber-200'
                      : 'bg-rose-950/80 border-rose-500 text-rose-200'
                  }`}
              >
                <div className="flex items-start gap-3">
                  {scanResult.status === 'granted' && (
                    <CheckCircle2 className="h-6 w-6 text-emerald-400 shrink-0 mt-0.5" />
                  )}
                  {scanResult.status === 'duplicate' && (
                    <AlertTriangle className="h-6 w-6 text-amber-400 shrink-0 mt-0.5" />
                  )}
                  {scanResult.status === 'invalid' && (
                    <XCircle className="h-6 w-6 text-rose-400 shrink-0 mt-0.5" />
                  )}

                  <div className="space-y-1">
                    <h4 className="text-sm font-semibold uppercase tracking-wider">
                      {scanResult.status === 'granted'
                        ? 'Admission Granted'
                        : scanResult.status === 'duplicate'
                          ? 'Duplicate Scan Detected'
                          : 'Invalid Ticket Barcode'}
                    </h4>
                    <p className="text-xs font-medium leading-relaxed">
                      {scanResult.message}
                    </p>
                    {scanResult.attendee && (
                      <div className="pt-2 text-xs text-white/90 space-y-0.5">
                        <p>
                          Holder: <span className="font-semibold">{scanResult.attendee.customerName}</span> ({scanResult.attendee.ticketTier})
                        </p>
                        <p>
                          Order: <span className="font-mono">{scanResult.attendee.orderNumber}</span> • {scanResult.attendee.seatsCount} Pax
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right 1 Col: Live Headcount & Gate Telemetry */}
        <div className="space-y-4">
          <div className="rounded-xl border border-slate-200/90 bg-white p-5 shadow-2xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-semibold text-slate-900">
                Gate Headcount Telemetry
              </h3>
              <Radio className="h-4 w-4 text-emerald-500 animate-pulse" />
            </div>

            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-slate-500">Admitted / Manifest</span>
                  <span className="text-purple-700 font-semibold">
                    {scannedCount} / {totalExpected} ({scanRate}%)
                  </span>
                </div>
                <div className="h-2.5 w-full rounded-full bg-slate-100 overflow-hidden mt-1.5">
                  <div
                    className="h-full rounded-full bg-emerald-500 transition-all duration-300"
                    style={{ width: `${scanRate}%` }}
                  />
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-1 text-xs">
                <span className="text-slate-400 font-semibold uppercase text-[10px]">
                  Current Arena Occupancy
                </span>
                <p className="text-lg font-semibold text-slate-900">
                  {scannedCount.toLocaleString()} Fans In-Venue
                </p>
                <p className="text-[11px] text-slate-500">
                  Flow velocity: ~24 scans per min across all gates.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-purple-50 border border-purple-100 space-y-1 text-xs">
                <span className="text-purple-700 font-semibold uppercase text-[10px]">
                  Emergency Egress Status
                </span>
                <p className="text-xs font-semibold text-purple-900">
                  All 12 Stadium Exit Turnstiles Unlocked
                </p>
                <p className="text-[11px] text-purple-700">
                  Security Supervisor on duty at FOH Master Console.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Live Scan Log Stream */}
      <div className="rounded-xl border border-slate-200/90 bg-white p-5 shadow-2xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h3 className="text-sm font-semibold text-slate-900">
              Live Gate Entry Audit Stream
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Auditable log of every scanned ticket code, gate number, and verification outcome.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setScanLogs(vendorConcertService.getScanLogs())}
            className="flex items-center gap-1.5 text-xs font-semibold text-purple-700 hover:text-purple-800 cursor-pointer"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            <span>Refresh Stream</span>
          </button>
        </div>

        <Table
          columns={logColumns}
          data={scanLogs}
          keyExtractor={(l) => l.id}
          pageSize={10}
          emptyMessage="No gate scans logged yet."
        />
      </div>
    </div>
  );
};
