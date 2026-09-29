export type ScriptStatus = 'draft' | 'review' | 'returned' | 'approved'
export type DeviceKind = 'desktop' | 'tablet' | 'mobile' | 'kiosk'

export interface Hall {
  id: string
  name: string
  description: string
}

export interface Segment {
  id: string
  label: string
  content: string
  locked: boolean
  /** 该段对应中文主稿段落的 id；中文主稿自身不需要 */
  sourceSegmentId?: string
}

/** 随译文同步状态变化、需要逐段确认的字段 */
export type SyncFieldKey = 'title' | 'narration' | 'accessibility'

export interface ResolvedSegment {
  sourceSegmentId: string
  sourceLabel: string
  sourceContent: string
  at: string
}

export interface ResolvedField {
  field: SyncFieldKey
  sourceValue: string
  at: string
}

export interface IgnoredSource {
  sourceSegmentId: string
  sourceContent: string
  at: string
}

/** 译文定稿/对齐时所依据的中文主稿快照 */
export interface SourceSnapshot {
  masterVersion: number
  title: string
  narration: string
  accessibility: string
  segments: Array<{ id: string; label: string; content: string }>
}

/** 译文与中文主稿的同步关系，随本地数据持久化 */
export interface DraftSync {
  baseline: SourceSnapshot
  resolvedSegments: ResolvedSegment[]
  resolvedFields: ResolvedField[]
  ignoredSources: IgnoredSource[]
  /** 是否处在待同步状态（中文主稿变动后置为 true） */
  outOfSync: boolean
}

export interface LanguageDraft {
  id: string
  languageId: string
  title: string
  narration: string
  accessibility: string
  durationMinutes: number
  sources: string
  status: ScriptStatus
  segments: Segment[]
  updatedAt: string
  /** 中文主稿以外的译文记录与主稿的同步关系 */
  sync?: DraftSync
}

export interface Exhibit {
  id: string
  hallId: string
  code: string
  title: string
  order: number
  drafts: LanguageDraft[]
  /** 中文主稿当前版本号，中文实质内容变动时 +1 */
  masterVersion: number
  /** 中文主稿最近一次定稿时的版本号 */
  masterApprovedVersion: number
}

export interface Language {
  id: string
  code: string
  label: string
  shortLabel: string
}

export interface VersionSnapshot {
  id: string
  exhibitId: string
  languageId: string
  name: string
  createdAt: string
  draft: LanguageDraft
}

export interface PersistedState {
  halls: Hall[]
  exhibits: Exhibit[]
  versions: VersionSnapshot[]
  selectedHallId: string
  selectedExhibitId: string
  selectedLanguageId: string
  lastSavedAt: string
}

export interface DiffLine {
  type: 'same' | 'add' | 'remove'
  text: string
}

export interface PendingSegment {
  segmentId: string
  label: string
  content: string
  sourceSegmentId: string
  sourceLabel: string
  sourceContent: string
  locked: boolean
}

export interface PendingSource {
  sourceSegmentId: string
  sourceLabel: string
  sourceContent: string
}

export interface PendingField {
  field: SyncFieldKey
  label: string
  baselineValue: string
  currentValue: string
}

/** 一份译文相对当前中文主稿的同步分析结果（每次实时计算） */
export interface SyncAnalysis {
  hasBaseline: boolean
  masterVersion: number
  baselineVersion: number
  outOfSync: boolean
  pendingSegments: PendingSegment[]
  pendingSources: PendingSource[]
  pendingFields: PendingField[]
  /** 主稿已变、但译文段落锁定而保留原内容（不列为待处理，仅提示） */
  protectedSegments: PendingSegment[]
  protectedCount: number
  pendingCount: number
}
