import { defineStore } from 'pinia'
import type {
  Exhibit, Hall, Language, LanguageDraft, PendingSegment, PersistedState, ScriptStatus, Segment,
  SyncAnalysis, SyncFieldKey, VersionSnapshot
} from '~/types'

export const LANGUAGES: Language[] = [
  { id: 'zh', code: 'zh-CN', label: '简体中文', shortLabel: '中' },
  { id: 'en', code: 'en-US', label: 'English', shortLabel: 'EN' },
  { id: 'ja', code: 'ja-JP', label: '日本語', shortLabel: '日' }
]

const MASTER_LANGUAGE = 'zh'
const STORAGE_KEY = 'museum-script-studio-v1'
export const SYNC_FIELDS: Array<{ key: SyncFieldKey; label: string }> = [
  { key: 'title', label: '展项标题' },
  { key: 'narration', label: '完整讲解词' },
  { key: 'accessibility', label: '无障碍描述' }
]

const segments = (prefix: string, values: Array<[string, string, boolean?]>): Segment[] => values.map(([label, content, locked], index) => ({
  id: `${prefix}-${index + 1}`,
  label,
  content,
  locked: Boolean(locked)
}))

function demoState(): PersistedState {
  const halls: Hall[] = [
    { id: 'hall-ancient', name: '文明肇始厅', description: '史前至先秦文明，共 18 个展项' },
    { id: 'hall-silk', name: '丝路交融厅', description: '丝绸之路上的器物、信仰与生活' },
    { id: 'hall-city', name: '城市记忆厅', description: '近现代城市空间与市民生活' }
  ]
  const exhibits: Exhibit[] = [
    {
      id: 'exhibit-jade', hallId: 'hall-ancient', code: 'A-03', title: '玉琮：沟通天地的礼器', order: 3,
      masterVersion: 1, masterApprovedVersion: 1,
      drafts: [
        {
          id: 'draft-jade-zh', languageId: 'zh', title: '玉琮：沟通天地的礼器',
          narration: '这件玉琮出土于长江下游的良渚遗址。它外方内圆，四角雕刻神人兽面纹，体现了新石器时代晚期精湛的玉器工艺。',
          accessibility: '玉琮为深青色，高约二十厘米。触摸模型可感受方形四角与中央圆孔；圆孔贯穿器身。',
          durationMinutes: 2.5, sources: '《中国玉器全集》第一卷；本馆藏品档案 1987-J-042',
          status: 'approved', updatedAt: '2026-09-23T08:35:00.000Z',
          segments: segments('jade-zh', [
            ['开场定位', '这件玉琮来自距今约五千年的良渚文化。', true],
            ['器物观察', '它外方内圆，四角雕刻神人兽面纹。', true],
            ['文化含义', '玉琮常被看作沟通天地的礼器，也象征权力与身份。'],
            ['参观提示', '请沿展柜顺时针观察，触摸复制品前先使用免洗消毒液。']
          ])
        },
        {
          id: 'draft-jade-en', languageId: 'en', title: 'Jade Cong: A Ritual Object Between Heaven and Earth',
          narration: 'This jade cong was made by the Liangzhu culture. Its square exterior and circular bore embody an early Chinese vision of the cosmos.',
          accessibility: 'The object is dark green. A tactile model shows four corners, carved faces, and a central circular opening.',
          durationMinutes: 2.3, sources: 'Complete Collection of Chinese Jades, Vol. 1; Museum accession 1987-J-042',
          status: 'approved', updatedAt: '2026-09-24T02:15:00.000Z',
          segments: segments('jade-en', [
            ['Introduction', 'This jade cong is about five thousand years old.', true],
            ['Visual description', 'Its square body encloses a circular opening, while spirit-and-animal motifs cover the corners.'],
            ['Meaning', 'Jade cong is understood as a ritual link between heaven and earth.']
          ])
        },
        {
          id: 'draft-jade-ja', languageId: 'ja', title: '玉琮：天と地を結ぶ礼器',
          narration: 'こちらは良渚文化の玉琮です。外側は方形、中央は円形で、四隅には神人獣面文が刻まれています。',
          accessibility: '暗い青緑色の玉製です。複製模型では四つの角と中央の円孔を触って確認できます。',
          durationMinutes: 2.6, sources: '『中国玉器全集』第一巻；収蔵資料 1987-J-042',
          status: 'draft', updatedAt: '2026-09-21T06:10:00.000Z',
          segments: segments('jade-ja', [
            ['導入', '約五千年前の良渚文化を代表する玉琮です。'],
            ['観察', '外側は方形、中央は円形で、四隅に精緻な文様があります。'],
            ['意味', '天地を結ぶ礼器として、力と身分を象徴しました。']
          ])
        }
      ]
    },
    {
      id: 'exhibit-bronze', hallId: 'hall-ancient', code: 'A-08', title: '青铜爵与礼制', order: 8,
      masterVersion: 1, masterApprovedVersion: 0,
      drafts: [
        {
          id: 'draft-bronze-zh', languageId: 'zh', title: '青铜爵与礼制',
          narration: '爵是最早的青铜酒器之一。三足稳定器身，长流便于倾倒，柱饰则与商周礼仪密切相关。',
          accessibility: '器物为青铜色，器口一侧有长流，底部三足支撑。复制件配有可触摸的局部纹样。',
          durationMinutes: 3, sources: '《殷周青铜器通论》；展品说明卡 A-08',
          status: 'returned', updatedAt: '2026-09-23T11:20:00.000Z',
          segments: segments('bronze-zh', [
            ['器物介绍', '这是一件商代青铜爵，用于温酒和饮酒。'],
            ['结构说明', '三足使器身稳定，前端的流便于倾倒。'],
            ['礼制背景', '青铜器数量与形制反映了使用者的身份。'],
            ['修改说明', '审校意见：补充“柱饰”的用途，并核对年代。']
          ])
        },
        {
          id: 'draft-bronze-en', languageId: 'en', title: 'Bronze Jue and Ritual Order',
          narration: 'The jue was among the earliest bronze drinking vessels. Its tripod base, pouring spout, and posts were closely tied to Shang and Zhou ritual.',
          accessibility: 'The tactile replica includes the long spout, tripod feet, and raised posts.',
          durationMinutes: 2.8, sources: 'A General Survey of Yin-Zhou Bronzes; Gallery label A-08',
          status: 'draft', updatedAt: '2026-09-22T09:00:00.000Z',
          segments: segments('bronze-en', [['Object', 'This bronze jue dates to the Shang dynasty.'], ['Structure', 'Three legs support the body; the long spout guides the pour.']])
        }
      ]
    },
    {
      id: 'exhibit-silk', hallId: 'hall-silk', code: 'B-02', title: '织机与丝路纹样', order: 2,
      masterVersion: 1, masterApprovedVersion: 0,
      drafts: [{
        id: 'draft-silk-zh', languageId: 'zh', title: '织机与丝路纹样',
        narration: '织机把一根根丝线组织成布匹，也把不同地区的图案与故事连接在一起。',
        accessibility: '体验区提供放大纹样、凸点经纬结构以及可操作的小型织机模型。',
        durationMinutes: 4, sources: '馆内教育活动资料；丝绸之路纺织史专题',
        status: 'draft', updatedAt: '2026-09-20T03:00:00.000Z',
        segments: segments('silk-zh', [['序言', '丝绸不只是一种材料，也是交流的媒介。'], ['互动', '请试着推动梭子，观察经纬线如何交会。']])
      }]
    }
  ]
  // 示例中：玉琮中文已定稿，英文此前已逐段对齐并定稿（基线 v1）；其余译文尚无基线
  const jade = exhibits[0]!
  const jadeZh = jade.drafts.find(d => d.languageId === 'zh')!
  const jadeEn = jade.drafts.find(d => d.languageId === 'en')!
  const jadeJa = jade.drafts.find(d => d.languageId === 'ja')!
  const zhIds = ['jade-zh-1', 'jade-zh-2', 'jade-zh-3']
  jadeEn.segments.forEach((segment, index) => { segment.sourceSegmentId = zhIds[index] })
  jadeJa.segments.forEach((segment, index) => { segment.sourceSegmentId = zhIds[index] })
  jadeEn.sync = { baseline: snapshotMaster(jadeZh, jade.masterVersion), resolvedSegments: [], resolvedFields: [], ignoredSources: [], outOfSync: false }
  return {
    halls,
    exhibits,
    versions: [],
    selectedHallId: halls[0].id,
    selectedExhibitId: exhibits[0].id,
    selectedLanguageId: 'zh',
    lastSavedAt: new Date().toISOString()
  }
}

function masterDraftOf(exhibit: Exhibit): LanguageDraft | undefined {
  return exhibit.drafts.find(draft => draft.languageId === MASTER_LANGUAGE)
}

function snapshotMaster(master: LanguageDraft, version: number) {
  return {
    masterVersion: version,
    title: master.title,
    narration: master.narration,
    accessibility: master.accessibility,
    segments: master.segments.map(segment => ({ id: segment.id, label: segment.label, content: segment.content }))
  }
}

/** 兼容旧数据：补齐展项主稿版本号与译文结构 */
function migrateExhibit(exhibit: Exhibit) {
  if (typeof exhibit.masterVersion !== 'number') exhibit.masterVersion = 1
  if (typeof exhibit.masterApprovedVersion !== 'number') {
    exhibit.masterApprovedVersion = masterDraftOf(exhibit)?.status === 'approved' ? exhibit.masterVersion : 0
  }
  for (const draft of exhibit.drafts) {
    for (const segment of draft.segments) {
      if (draft.languageId !== MASTER_LANGUAGE && !segment.sourceSegmentId) segment.sourceSegmentId = ''
    }
  }
}

/** 中文主稿实质内容（标题/讲解词/无障碍/段落）是否发生变化 */
function masterChanged(before: LanguageDraft, after: LanguageDraft): boolean {
  return before.title !== after.title ||
    before.narration !== after.narration ||
    before.accessibility !== after.accessibility ||
    before.segments.length !== after.segments.length ||
    before.segments.some((segment, index) => {
      const next = after.segments[index]
      return !next || segment.id !== next.id || segment.label !== next.label || segment.content !== next.content
    })
}

export const useScriptStore = defineStore('museum-script', {
  state: () => ({
    halls: [] as Hall[],
    exhibits: [] as Exhibit[],
    versions: [] as VersionSnapshot[],
    selectedHallId: '',
    selectedExhibitId: '',
    selectedLanguageId: 'zh',
    lastSavedAt: '',
    hydrated: false,
    past: [] as string[],
    future: [] as string[],
    notice: ''
  }),
  getters: {
    selectedHall(state): Hall | undefined {
      return state.halls.find(hall => hall.id === state.selectedHallId)
    },
    hallExhibits(state): Exhibit[] {
      return state.exhibits.filter(exhibit => exhibit.hallId === state.selectedHallId).sort((a, b) => a.order - b.order)
    },
    selectedExhibit(state): Exhibit | undefined {
      return state.exhibits.find(exhibit => exhibit.id === state.selectedExhibitId)
    },
    selectedDraft(): LanguageDraft | undefined {
      return this.selectedExhibit?.drafts.find(draft => draft.languageId === this.selectedLanguageId)
    },
    wordCount(): number {
      return (this.selectedDraft?.narration || '').replace(/\s/g, '').length
    },
    canUndo(state): boolean { return state.past.length > 0 },
    canRedo(state): boolean { return state.future.length > 0 }
  },
  actions: {
    hydrate() {
      if (this.hydrated || typeof localStorage === 'undefined') return
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        try {
          const data = JSON.parse(saved) as PersistedState
          this.$patch({ ...data, hydrated: true })
          if (!this.halls.length || !this.exhibits.length) this.resetDemo()
          else this.exhibits.forEach(migrateExhibit)
        } catch {
          this.resetDemo()
        }
      } else {
        this.resetDemo()
      }
      this.ensureSelection()
      this.hydrated = true
      this.persist()
    },
    resetDemo() {
      this.$patch({ ...demoState(), hydrated: true, past: [], future: [] })
      this.persist()
      this.notice = '示例数据已就绪，可直接开始编辑。'
    },
    snapshot(): string {
      return JSON.stringify({ halls: this.halls, exhibits: this.exhibits, versions: this.versions })
    },
    commit(mutator: () => void) {
      this.past.push(this.snapshot())
      if (this.past.length > 50) this.past.shift()
      this.future = []
      mutator()
      this.lastSavedAt = new Date().toISOString()
      this.persist()
    },
    persist() {
      if (typeof localStorage === 'undefined') return
      const data: PersistedState = {
        halls: this.halls, exhibits: this.exhibits, versions: this.versions,
        selectedHallId: this.selectedHallId, selectedExhibitId: this.selectedExhibitId,
        selectedLanguageId: this.selectedLanguageId, lastSavedAt: this.lastSavedAt
      }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
    },
    ensureSelection() {
      if (!this.halls.some(hall => hall.id === this.selectedHallId)) this.selectedHallId = this.halls[0]?.id || ''
      const inHall = this.exhibits.filter(exhibit => exhibit.hallId === this.selectedHallId)
      if (!inHall.some(exhibit => exhibit.id === this.selectedExhibitId)) this.selectedExhibitId = inHall[0]?.id || ''
      const exhibit = this.selectedExhibit
      if (!exhibit?.drafts.some(draft => draft.languageId === this.selectedLanguageId)) this.selectedLanguageId = exhibit?.drafts[0]?.languageId || 'zh'
    },
    selectHall(id: string) {
      this.selectedHallId = id
      const exhibit = this.exhibits.find(item => item.hallId === id)
      this.selectedExhibitId = exhibit?.id || ''
      this.ensureSelection()
      this.persist()
    },
    selectExhibit(id: string) {
      this.selectedExhibitId = id
      this.ensureSelection()
      this.persist()
    },
    selectLanguage(id: string) {
      this.selectedLanguageId = id
      this.persist()
    },

    // ---------- 中文主稿版本 ----------

    /** 中文主稿内容变动：版本号 +1，已定稿主稿退回待审，并把已对齐译文置为待同步 */
    bumpMaster(exhibit: Exhibit, before: LanguageDraft, after: LanguageDraft) {
      if (!masterChanged(before, after)) return
      exhibit.masterVersion = (exhibit.masterVersion || 1) + 1
      if (after.status === 'approved') {
        after.status = 'review'
        this.notice = '中文主稿已修改：版本号 +1，原定稿状态回到待审；已对齐译文转为待同步。'
      } else {
        this.notice = '中文主稿已修改：版本号 +1，已对齐译文转为待同步。'
      }
      for (const draft of exhibit.drafts) {
        if (draft.languageId === MASTER_LANGUAGE || !draft.sync) continue
        if (draft.sync.baseline.masterVersion < exhibit.masterVersion) {
          draft.sync.outOfSync = true
          // 已定稿译文回到待审；其余状态（草稿/待审/退回）保持不变
          if (draft.status === 'approved') draft.status = 'review'
        }
      }
    },

    updateDraft(patch: Partial<Pick<LanguageDraft, 'title' | 'narration' | 'accessibility' | 'durationMinutes' | 'sources'>>) {
      const exhibit = this.selectedExhibit
      const draft = this.selectedDraft
      if (!exhibit || !draft) return
      const before = JSON.parse(JSON.stringify(draft)) as LanguageDraft
      this.commit(() => {
        Object.assign(draft, patch, { updatedAt: new Date().toISOString() })
        if (draft.languageId === MASTER_LANGUAGE) this.bumpMaster(exhibit, before, draft)
      })
      if (draft.languageId !== MASTER_LANGUAGE) this.notice = '改动已自动保存到浏览器。'
    },
    updateSegment(id: string, patch: Partial<Pick<Segment, 'label' | 'content'>>) {
      const exhibit = this.selectedExhibit
      const draft = this.selectedDraft
      const segment = draft?.segments.find(item => item.id === id)
      if (!exhibit || !draft || !segment || segment.locked) return
      const before = JSON.parse(JSON.stringify(draft)) as LanguageDraft
      this.commit(() => {
        Object.assign(segment, patch)
        if (draft.languageId === MASTER_LANGUAGE) this.bumpMaster(exhibit, before, draft)
      })
    },
    toggleLock(id: string) {
      const segment = this.selectedDraft?.segments.find(item => item.id === id)
      if (!segment) return
      this.commit(() => { segment.locked = !segment.locked })
      this.notice = segment.locked ? '段落已锁定，避免误改。' : '段落已解锁。'
    },
    addSegment() {
      const exhibit = this.selectedExhibit
      const draft = this.selectedDraft
      if (!exhibit || !draft) return
      const before = JSON.parse(JSON.stringify(draft)) as LanguageDraft
      this.commit(() => {
        draft.segments.push({
          id: `segment-${Date.now()}`,
          label: `${draft.languageId === MASTER_LANGUAGE ? '新段落' : '新译段'} ${draft.segments.length + 1}`,
          content: '',
          locked: false,
          ...(draft.languageId === MASTER_LANGUAGE ? {} : { sourceSegmentId: '' })
        })
        if (draft.languageId === MASTER_LANGUAGE) this.bumpMaster(exhibit, before, draft)
      })
    },
    removeSegment(id: string) {
      const exhibit = this.selectedExhibit
      const draft = this.selectedDraft
      const segment = draft?.segments.find(item => item.id === id)
      if (!exhibit || !draft || !segment || segment.locked) return
      const before = JSON.parse(JSON.stringify(draft)) as LanguageDraft
      this.commit(() => {
        draft.segments = draft.segments.filter(item => item.id !== id)
        if (draft.languageId === MASTER_LANGUAGE) this.bumpMaster(exhibit, before, draft)
      })
    },
    setStatus(status: ScriptStatus) {
      const exhibit = this.selectedExhibit
      const draft = this.selectedDraft
      if (!exhibit || !draft) return
      // 译文有待同步项时不能直接定稿
      if (draft.languageId !== MASTER_LANGUAGE && status === 'approved') {
        const analysis = this.analyzeSync(exhibit, draft)
        if (analysis.outOfSync && analysis.pendingCount > 0) {
          this.notice = `还有 ${analysis.pendingCount} 处与中文主稿不一致，逐段确认后才能重新定稿。`
          return
        }
        this.commit(() => {
          this.alignTranslation(exhibit, draft)
          draft.status = 'approved'
          draft.updatedAt = new Date().toISOString()
        })
        this.notice = analysis.hasBaseline ? '所有不一致均已处理，译文重新定稿。' : '译文已与当前中文主稿建立同步并定稿。'
        return
      }
      this.commit(() => {
        draft.status = status
        draft.updatedAt = new Date().toISOString()
        if (draft.languageId === MASTER_LANGUAGE && status === 'approved') {
          exhibit.masterApprovedVersion = exhibit.masterVersion
        }
      })
      this.notice = `状态已更新为“${this.statusLabel(status)}”。`
    },
    statusLabel(status: ScriptStatus) {
      return ({ draft: '草稿', review: '待审', returned: '退回', approved: '已定稿' })[status]
    },

    // ---------- 译文同步 ----------

    /** 计算一份译文相对当前中文主稿的差异（实时、不落库） */
    analyzeSync(exhibit: Exhibit, draft: LanguageDraft): SyncAnalysis {
      const master = masterDraftOf(exhibit)
      const empty: SyncAnalysis = {
        hasBaseline: false, masterVersion: exhibit.masterVersion || 1, baselineVersion: 0,
        outOfSync: false, pendingSegments: [], pendingSources: [], pendingFields: [],
        protectedSegments: [], protectedCount: 0, pendingCount: 0
      }
      if (!master || draft.languageId === MASTER_LANGUAGE) return empty
      const sync = draft.sync
      if (!sync) {
        return { ...empty, masterVersion: exhibit.masterVersion || 1 }
      }
      const baseline = sync.baseline
      // 仅当主稿当前内容与确认时一致，该确认才仍有效；主稿再次修改后需重新确认
      const activeResolved = sync.resolvedSegments.filter(item => {
        const now = master.segments.find(segment => segment.id === item.sourceSegmentId)
        return now && now.label === item.sourceLabel && now.content === item.sourceContent
      })
      const resolvedSegIds = new Set(activeResolved.map(item => item.sourceSegmentId))
      const activeIgnored = sync.ignoredSources.filter(item => {
        const now = master.segments.find(segment => segment.id === item.sourceSegmentId)
        return now && now.content === item.sourceContent
      })
      const ignoredIds = new Set(activeIgnored.map(item => item.sourceSegmentId))
      const resolvedFields = new Map(sync.resolvedFields.map(item => [item.field, item.sourceValue]))

      // 相对基线发生变化的主稿段落
      const changedSourceIds = new Set<string>()
      baseline.segments.forEach(old => {
        const now = master.segments.find(item => item.id === old.id)
        if (!now || now.label !== old.label || now.content !== old.content) changedSourceIds.add(old.id)
      })
      const newSourceIds = new Set<string>()
      master.segments.forEach(now => {
        if (!baseline.segments.some(old => old.id === now.id)) newSourceIds.add(now.id)
      })

      const linked = new Map<string, Segment>()
      for (const segment of draft.segments) {
        const sid = segment.sourceSegmentId
        if (sid) linked.set(sid, segment)
      }

      const toPending = (segment: Segment, sid: string, source: { label: string; content: string }): PendingSegment => ({
        segmentId: segment.id,
        label: segment.label,
        content: segment.content,
        sourceSegmentId: sid,
        sourceLabel: source.label,
        sourceContent: source.content,
        locked: segment.locked
      })

      // 译文段落：链接的主稿段落已变。锁定段保留原译文、只提示；其余列为待处理
      const changedLinked = draft.segments.flatMap(segment => {
        const sid = segment.sourceSegmentId
        if (!sid) return []
        const source = master.segments.find(item => item.id === sid)
        const isChanged = changedSourceIds.has(sid) || newSourceIds.has(sid)
        if (!source || !isChanged || resolvedSegIds.has(sid)) return []
        return [toPending(segment, sid, source)]
      })
      const pendingSegments = changedLinked.filter(item => !item.locked)
      const protectedSegments = changedLinked.filter(item => item.locked)

      // 主稿新增、译文尚未链接的段落
      const pendingSources = master.segments.flatMap(source => {
        if (!newSourceIds.has(source.id)) return []
        if (resolvedSegIds.has(source.id) || ignoredIds.has(source.id) || linked.has(source.id)) return []
        return [{ sourceSegmentId: source.id, sourceLabel: source.label, sourceContent: source.content }]
      })

      // 主稿整体字段变化
      const pendingFields = SYNC_FIELDS.flatMap(({ key, label }) => {
        if (baseline[key] === master[key]) return []
        if (resolvedFields.get(key) === master[key]) return []
        return [{ field: key, label, baselineValue: baseline[key], currentValue: master[key] }]
      })

      const pendingCount = pendingSegments.length + pendingSources.length + pendingFields.length
      const outOfSync = Boolean(sync.outOfSync) && (baseline.masterVersion < (exhibit.masterVersion || 1))

      return {
        hasBaseline: true,
        masterVersion: exhibit.masterVersion || 1,
        baselineVersion: baseline.masterVersion,
        outOfSync: outOfSync && pendingCount > 0,
        pendingSegments,
        pendingSources,
        pendingFields,
        protectedSegments,
        protectedCount: protectedSegments.length,
        pendingCount
      }
    },

    /** 确认单个译文段落：记录对当前主稿段落的处理结果 */
    confirmSegment(segmentId: string) {
      const exhibit = this.selectedExhibit
      const draft = this.selectedDraft
      const segment = draft?.segments.find(item => item.id === segmentId)
      const master = exhibit ? masterDraftOf(exhibit) : undefined
      if (!exhibit || !draft || !segment || !master || !segment.sourceSegmentId) return
      const source = master.segments.find(item => item.id === segment.sourceSegmentId)
      if (!source || !draft.sync) return
      this.commit(() => {
        const list = draft.sync!.resolvedSegments
        list.push({ sourceSegmentId: source.id, sourceLabel: source.label, sourceContent: source.content, at: new Date().toISOString() })
        this.afterSyncReview(exhibit, draft)
      })
      this.notice = '段落已确认同步。'
    },

    /** 采纳主稿段落：未锁定则替换内容并建立链接，随后记为已确认；锁定段仅确认不覆盖 */
    adoptSource(sourceSegmentId: string) {
      const exhibit = this.selectedExhibit
      const draft = this.selectedDraft
      const master = exhibit ? masterDraftOf(exhibit) : undefined
      const source = master?.segments.find(item => item.id === sourceSegmentId)
      if (!exhibit || !draft || !source) return
      this.commit(() => {
        if (!draft.sync) draft.sync = { baseline: snapshotMaster(master!, 0), resolvedSegments: [], resolvedFields: [], ignoredSources: [], outOfSync: true }
        let segment = draft.segments.find(item => item.sourceSegmentId === sourceSegmentId)
        if (!segment) {
          segment = {
            id: `segment-${Date.now()}`,
            label: source.label,
            content: '',
            locked: false,
            sourceSegmentId
          }
          draft.segments.push(segment)
        }
        if (!segment.locked) {
          segment.label = source.label
          segment.content = source.content
        }
        const list = draft.sync!.resolvedSegments
        if (!list.some(item => item.sourceSegmentId === sourceSegmentId)) {
          list.push({ sourceSegmentId, sourceLabel: source.label, sourceContent: source.content, at: new Date().toISOString() })
        }
        draft.sync!.ignoredSources = draft.sync!.ignoredSources.filter(item => item.sourceSegmentId !== sourceSegmentId)
        this.afterSyncReview(exhibit, draft)
      })
      this.notice = '已采纳中文主稿段落并确认。'
    },

    /** 主稿新增段落不适用于该译文（如语言/版本差异），跳过并记录 */
    ignoreSource(sourceSegmentId: string) {
      const exhibit = this.selectedExhibit
      const draft = this.selectedDraft
      const master = exhibit ? masterDraftOf(exhibit) : undefined
      const source = master?.segments.find(item => item.id === sourceSegmentId)
      if (!exhibit || !draft || !source || !draft.sync) return
      this.commit(() => {
        if (!draft.sync!.ignoredSources.some(item => item.sourceSegmentId === sourceSegmentId)) {
          draft.sync!.ignoredSources.push({ sourceSegmentId, sourceContent: source.content, at: new Date().toISOString() })
        }
        this.afterSyncReview(exhibit, draft)
      })
      this.notice = '该主稿段落已标记为不适用于本译文。'
    },

    /** 确认主稿整体字段（标题/讲解词/无障碍）已在译文中处理，不覆盖译文内容 */
    confirmField(field: SyncFieldKey) {
      const exhibit = this.selectedExhibit
      const draft = this.selectedDraft
      const master = exhibit ? masterDraftOf(exhibit) : undefined
      if (!exhibit || !draft || !master || !draft.sync) return
      this.commit(() => {
        const list = draft.sync!.resolvedFields.filter(item => item.field !== field)
        list.push({ field, sourceValue: master[field], at: new Date().toISOString() })
        draft.sync!.resolvedFields = list
        this.afterSyncReview(exhibit, draft)
      })
      this.notice = '已确认该字段与最新中文主稿一致。'
    },

    /** 每处理完一项：全部一致后退出待同步，回到待审等待重新定稿 */
    afterSyncReview(exhibit: Exhibit, draft: LanguageDraft) {
      if (!draft.sync) return
      const analysis = this.analyzeSync(exhibit, draft)
      if (analysis.pendingCount === 0) {
        draft.sync.outOfSync = false
        if (draft.status === 'returned') draft.status = 'review'
        this.notice = '所有不一致段落均已处理，文稿回到待审，可重新定稿。'
      }
    },

    /** 以当前中文主稿建立/刷新译文基线（对齐） */
    alignTranslation(exhibit: Exhibit, draft: LanguageDraft) {
      const master = masterDraftOf(exhibit)
      if (!master) return
      if (!draft.sync) {
        draft.sync = { baseline: snapshotMaster(master, exhibit.masterVersion), resolvedSegments: [], resolvedFields: [], ignoredSources: [], outOfSync: false }
      } else {
        draft.sync.baseline = snapshotMaster(master, exhibit.masterVersion)
        draft.sync.resolvedSegments = []
        draft.sync.resolvedFields = []
        draft.sync.ignoredSources = []
        draft.sync.outOfSync = false
      }
    },

    /** 手动让当前译文与最新中文主稿建立/刷新同步关系 */
    establishBaseline() {
      const exhibit = this.selectedExhibit
      const draft = this.selectedDraft
      const master = exhibit ? masterDraftOf(exhibit) : undefined
      if (!exhibit || !draft || !master || draft.languageId === MASTER_LANGUAGE) return
      this.commit(() => {
        this.alignTranslation(exhibit, draft)
        draft.updatedAt = new Date().toISOString()
      })
      this.notice = `已按中文主稿 v${exhibit.masterVersion} 建立同步关系，之后中文稿变动会标记待同步。`
    },

    // ---------- 版本快照 ----------

    createVersion(name?: string) {
      const draft = this.selectedDraft
      if (!draft) return
      const version: VersionSnapshot = {
        id: `version-${Date.now()}`,
        exhibitId: this.selectedExhibitId,
        languageId: this.selectedLanguageId,
        name: name || `${new Date().toLocaleString('zh-CN', { hour12: false })} 快照`,
        createdAt: new Date().toISOString(),
        draft: JSON.parse(JSON.stringify(draft))
      }
      this.commit(() => this.versions.unshift(version))
      this.notice = '已保存当前版本，可在版本页比较或恢复。'
    },
    restoreVersion(id: string) {
      const version = this.versions.find(item => item.id === id)
      if (!version) return
      this.commit(() => {
        const exhibit = this.exhibits.find(item => item.id === version.exhibitId)
        if (!exhibit) return
        const index = exhibit.drafts.findIndex(item => item.languageId === version.languageId)
        const restored = JSON.parse(JSON.stringify(version.draft)) as LanguageDraft
        if (index >= 0) exhibit.drafts[index] = restored
        else exhibit.drafts.push(restored)
        if (restored.languageId === MASTER_LANGUAGE) migrateExhibit(exhibit)
      })
      this.selectedExhibitId = version.exhibitId
      this.selectedLanguageId = version.languageId
      this.notice = '版本已恢复，并作为一次可撤销操作保存。'
    },
    undo() {
      const state = this.past.pop()
      if (!state) return
      this.future.push(this.snapshot())
      this.$patch(JSON.parse(state))
      this.lastSavedAt = new Date().toISOString()
      this.ensureSelection()
      this.persist()
      this.notice = '已撤销上一步。'
    },
    redo() {
      const state = this.future.pop()
      if (!state) return
      this.past.push(this.snapshot())
      this.$patch(JSON.parse(state))
      this.lastSavedAt = new Date().toISOString()
      this.ensureSelection()
      this.persist()
      this.notice = '已重做。'
    },
    completionFor(exhibit: Exhibit, languageId: string): number {
      const draft = exhibit.drafts.find(item => item.languageId === languageId)
      if (!draft) return 0
      const checks = [draft.title, draft.narration, draft.accessibility, draft.sources, draft.segments.length > 0 ? 'segments' : '']
      return Math.round(checks.filter(Boolean).length / checks.length * 100)
    },
    /** 某展项某语言是否处于待同步 */
    isOutOfSync(exhibit: Exhibit, languageId: string): boolean {
      const draft = exhibit.drafts.find(item => item.languageId === languageId)
      if (!draft || languageId === MASTER_LANGUAGE || !draft.sync) return false
      return this.analyzeSync(exhibit, draft).outOfSync
    },
    /** 某展项待同步语言数量（左侧进度用） */
    outOfSyncCount(exhibit: Exhibit): number {
      return LANGUAGES.filter(lang => lang.id !== MASTER_LANGUAGE && this.isOutOfSync(exhibit, lang.id)).length
    },
    masterVersionOf(exhibit: Exhibit): number {
      return exhibit.masterVersion || 1
    }
  }
})
