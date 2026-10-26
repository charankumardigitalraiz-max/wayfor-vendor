import type { ConcertEvent, AttendeeBooking, GateScanLog, PayoutTransaction, Venue } from '../types';
import {
  mockVendorConcerts,
  mockAttendees,
  mockGateScanLogs,
  mockPayouts,
  mockVenues
} from '../data/mockVendorData';

const CONCERTS_STORAGE_KEY = 'digitalraiz_vendor_concerts';
const ATTENDEES_STORAGE_KEY = 'digitalraiz_vendor_attendees';
const SCAN_LOGS_STORAGE_KEY = 'digitalraiz_vendor_scan_logs';

class VendorConcertService {
  private getStoredConcerts(): ConcertEvent[] {
    const raw = localStorage.getItem(CONCERTS_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(CONCERTS_STORAGE_KEY, JSON.stringify(mockVendorConcerts));
      return mockVendorConcerts;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return mockVendorConcerts;
    }
  }

  private saveConcerts(concerts: ConcertEvent[]) {
    localStorage.setItem(CONCERTS_STORAGE_KEY, JSON.stringify(concerts));
  }

  async getConcerts(): Promise<ConcertEvent[]> {
    return this.getStoredConcerts();
  }

  async getConcertById(id: string): Promise<ConcertEvent | undefined> {
    const concerts = this.getStoredConcerts();
    return concerts.find(c => c.id === id);
  }

  async createConcert(concert: Omit<ConcertEvent, 'id' | 'ticketsSold' | 'connectedRidesCount'>): Promise<ConcertEvent> {
    const concerts = this.getStoredConcerts();
    const newConcert: ConcertEvent = {
      ...concert,
      id: `cnc-${Date.now().toString().slice(-4)}`,
      ticketsSold: 0,
      connectedRidesCount: 0
    };
    const updated = [newConcert, ...concerts];
    this.saveConcerts(updated);
    return newConcert;
  }

  async updateConcert(id: string, updates: Partial<ConcertEvent>): Promise<ConcertEvent> {
    const concerts = this.getStoredConcerts();
    const index = concerts.findIndex(c => c.id === id);
    if (index === -1) throw new Error('Concert not found');

    const updatedConcert = { ...concerts[index], ...updates };
    concerts[index] = updatedConcert;
    this.saveConcerts(concerts);
    return updatedConcert;
  }

  async updateStatus(id: string, status: ConcertEvent['status']): Promise<ConcertEvent> {
    return this.updateConcert(id, { status });
  }

  async deleteConcert(id: string): Promise<boolean> {
    const concerts = this.getStoredConcerts();
    const filtered = concerts.filter(c => c.id !== id);
    this.saveConcerts(filtered);
    return true;
  }

  // Attendees & Gate Scanning
  getAttendees(): AttendeeBooking[] {
    const raw = localStorage.getItem(ATTENDEES_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(ATTENDEES_STORAGE_KEY, JSON.stringify(mockAttendees));
      return mockAttendees;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return mockAttendees;
    }
  }

  saveAttendees(attendees: AttendeeBooking[]) {
    localStorage.setItem(ATTENDEES_STORAGE_KEY, JSON.stringify(attendees));
  }

  getScanLogs(): GateScanLog[] {
    const raw = localStorage.getItem(SCAN_LOGS_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(SCAN_LOGS_STORAGE_KEY, JSON.stringify(mockGateScanLogs));
      return mockGateScanLogs;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return mockGateScanLogs;
    }
  }

  saveScanLogs(logs: GateScanLog[]) {
    localStorage.setItem(SCAN_LOGS_STORAGE_KEY, JSON.stringify(logs));
  }

  validateAndCheckInTicket(
    ticketCode: string,
    gateNumber: string = 'Gate 1 (Main Entrance)',
    staffName: string = 'Staff Check-in'
  ): { status: 'granted' | 'duplicate' | 'invalid'; attendee?: AttendeeBooking; message: string } {
    const attendees = this.getAttendees();
    const cleanCode = ticketCode.trim().toUpperCase();

    const attendeeIndex = attendees.findIndex(
      a => a.ticketCode.toUpperCase() === cleanCode || a.orderNumber.toUpperCase() === cleanCode
    );

    if (attendeeIndex === -1) {
      const newLog: GateScanLog = {
        id: `scan-${Date.now().toString().slice(-4)}`,
        timestamp: new Date().toISOString(),
        ticketCode: cleanCode,
        attendeeName: 'Unknown Ticket Holder',
        ticketTier: 'N/A',
        concertTitle: 'Unknown Event',
        status: 'invalid',
        gateNumber
      };
      this.saveScanLogs([newLog, ...this.getScanLogs()]);
      return { status: 'invalid', message: 'Invalid ticket barcode or order number not found.' };
    }

    const attendee = attendees[attendeeIndex];

    if (attendee.checkedIn) {
      const newLog: GateScanLog = {
        id: `scan-${Date.now().toString().slice(-4)}`,
        timestamp: new Date().toISOString(),
        ticketCode: attendee.ticketCode,
        attendeeName: `${attendee.customerName} (DUPLICATE ENTRY)`,
        ticketTier: attendee.ticketTier,
        concertTitle: attendee.concertTitle,
        status: 'duplicate',
        gateNumber
      };
      this.saveScanLogs([newLog, ...this.getScanLogs()]);
      return {
        status: 'duplicate',
        attendee,
        message: `TICKET ALREADY SCANNED at ${new Date(attendee.checkedInAt || '').toLocaleTimeString()} by ${attendee.gateStaff || 'Gate Staff'}. Duplicate entry prohibited!`
      };
    }

    // Grant entry
    attendee.checkedIn = true;
    attendee.checkedInAt = new Date().toISOString();
    attendee.gateStaff = `${staffName} (${gateNumber})`;
    attendees[attendeeIndex] = attendee;
    this.saveAttendees(attendees);

    const newLog: GateScanLog = {
      id: `scan-${Date.now().toString().slice(-4)}`,
      timestamp: new Date().toISOString(),
      ticketCode: attendee.ticketCode,
      attendeeName: attendee.customerName,
      ticketTier: attendee.ticketTier,
      concertTitle: attendee.concertTitle,
      status: 'granted',
      gateNumber
    };
    this.saveScanLogs([newLog, ...this.getScanLogs()]);

    return {
      status: 'granted',
      attendee,
      message: `Access Granted! Welcome ${attendee.customerName} (${attendee.ticketTier}).`
    };
  }

  toggleCheckInManual(bookingId: string): AttendeeBooking | undefined {
    const attendees = this.getAttendees();
    const index = attendees.findIndex(a => a.id === bookingId);
    if (index === -1) return undefined;

    const current = attendees[index];
    const newChecked = !current.checkedIn;
    attendees[index] = {
      ...current,
      checkedIn: newChecked,
      checkedInAt: newChecked ? new Date().toISOString() : undefined,
      gateStaff: newChecked ? 'Manual Console Override' : undefined
    };
    this.saveAttendees(attendees);
    return attendees[index];
  }

  getVenues(): Venue[] {
    return mockVenues;
  }

  getPayouts(): PayoutTransaction[] {
    return mockPayouts;
  }
}

export const vendorConcertService = new VendorConcertService();
