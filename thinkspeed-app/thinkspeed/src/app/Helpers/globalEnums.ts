export module ENUMS {
  export class GlobalEnums {
    static fetchOrgNames(organization: number): string {
      return OrganizationName[organization];
    }
    static fetchRoleName(role: number) {
      return RoleNames[role];
    }
    static fetchProductNames(product: number): string {
      return Products[product];
    }
    static fetchInstallTypes(installType: number): string {
      return InstalationType[installType];
    }
    static fetchISPImages(isp: number): string {
      return ISP[isp];
    }
    static fetchOrderStatusName(orderStatus: number) {
      return OrderStatus[orderStatus];
    }
    static fetchServiceStatusNames(serviceStatus: number) {
      return ServiceStatus[serviceStatus];
    }
    static fetchFaultNames(faultID: number) {
      return FaultTypes[faultID];
    }
    static fetchRegradeStatus(regradeID: number) {
      return RegradeStatus[regradeID];
    }
    static fetchServiceChangeNames(requestID: number) {
      return ServiceChanges[requestID];
    }
    static fetchTicketStatus(statusID: number) {
      return TicketStatus[statusID];
    }
    static fetchIncidentType(incidentID: number) {
      return IncidentType[incidentID];
    }
    static fetchIncidentSeverity(severityID: number) {
      return IncidentSeverity[severityID];
    }
    static fetchIncidentStatus(statusID: number) {
      return IncidentStatus[statusID];
    }
  }
}
enum OrderStatus {
  'Pending' = 1,
  'Awaiting Installation' = 2,
  'Cancelled' = 3,
  'Active' = 4,
}
enum Products {
  'FTTH- 25/25Mbps' = 1,
  'FTTH- 50/50Mbps' = 2,
  'FTTH- 100/100Mbps' = 3,
  'FTTH- 200/200Mbps' = 4,
}
enum OrganizationName {
  'Afrihost' = 1,
  'Mweb' = 2,
  'Clear Access' = 3,
}
enum RoleNames {
  'Super_User' = 1,
  'Admin' = 2,
  'Technician' = 3,
  'HR-User' = 4,
  'HR-Admin' = 5,
  'Creator' = 6,
  'ISP-User' = 7,
}
enum InstalationType {
  ' New Install' = 1,
  'Migration' = 2,
}

enum ISP {
  'https://royalteas.co.za/resources/Afrihost.jpg' = 1,
  'https://royalteas.co.za/resources/Mweb.jpg' = 2,
}

enum ServiceStatus {
  'Pending' = 1,
  'Active' = 2,
  'Pending Cancellation' = 3,
  'Cancelled' = 4,
}

enum Faults {
  'Connectivity' = 1,
  'Installation' = 2,
}

enum ServiceChanges {
  'Regrade' = 1,
  'Cancellation' = 2,
}

enum RegradeStatus {
  'Pending' = 1,
  'Failed' = 2,
  'Cancelled by ISP' = 3,
  'Complete' = 4,
}

enum FaultTypes {
  'No Connectivity' = 1,
  'ONT Speed Issues' = 2,
  'Installation Incomplete' = 3,
  'Incorrectly Patched' = 4,
}
enum TicketStatus {
  'Open' = 1,
  'Assigned To Tech' = 2,
  'Resolved- ISP To Confirm' = 3,
  'Disputed' = 4,
  'Closed' = 5,
}

enum IncidentType {
  'Network Outage' = 1,
  'Maintenance' = 2,
}
enum IncidentSeverity {
  'No Connecitivity' = 1,
  'Intermittent Connecitivity' = 2,
}
enum IncidentStatus {
  'Under Investigation' = 1,
  'Resolved' = 2,
}
