export interface QueryResponse<T> {
  totalSize: number;
  records: T[];
  done: boolean;
  nextRecordsUrl?: string;
}

export interface SearchResponse<T> {
  searchRecords: T[];
}

export interface ApiLimit {
  used?: number;
  limit?: number;
}

export interface Limits {
  ConcurrentAsyncGetReportInstances: Limit;
  ConcurrentSyncReportRuns: Limit;
  DailyAnalyticsDataflowJobExecutions: Limit;
  DailyApiRequests: ComplexLimit;
  DailyAsyncApexExecutions: Limit;
  DailyBulkApiRequests: ComplexLimit;
  DailyDurableGenericStreamingApiEvents: Limit;
  DailyDurableStreamingApiEvents: Limit;
  DailyGenericStreamingApiEvents: ComplexLimit;
  DailyStandardVolumePlatformEvents: Limit;
  DailyStreamingApiEvents: ComplexLimit;
  DailyWorkflowEmails: Limit;
  DataStorageMB: Limit;
  DurableStreamingApiConcurrentClients: Limit;
  FileStorageMB: Limit;
  HourlyAsyncReportRuns: Limit;
  HourlyDashboardRefreshes: Limit;
  HourlyDashboardResults: Limit;
  HourlyDashboardStatuses: Limit;
  HourlyLongTermIdMapping: Limit;
  HourlyODataCallout: Limit;
  HourlyShortTermIdMapping: Limit;
  HourlySyncReportRuns: Limit;
  HourlyTimeBasedWorkflow: Limit;
  MassEmail: Limit;
  MonthlyPlatformEvents: Limit;
  Package2VersionCreates: Limit;
  PermissionSets: PermissionSets;
  SingleEmail: Limit;
  StreamingApiConcurrentClients: Limit;
}

export type InvokableResult<T> = Array<{
  actionName: string;
  errors?: InvokableError[];
  isSuccess: boolean;
  outputValues: { output: T };
}>;

export interface InvokableError {
  statusCode: string;
  message: string;
  fields: any[];
}

type ComplexLimit = AppLimits & Limit;

type AppLimits = {
  [key: string]: Limit
};

export interface Limit {
  Max: number;
  Remaining: number;
}

interface PermissionSets extends Limit {
  CreateCustom: Limit;
}
