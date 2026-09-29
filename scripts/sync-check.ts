import { createPinia, setActivePinia } from 'pinia'
import { useScriptStore, LANGUAGES } from './stores/script'

// --- 最小 localStorage shim ---
const mem = new Map<string, string>()
;(globalThis as any).localStorage = {
  getItem: (k: string) => (mem.has(k) ? mem.get(k)! : null),
  setItem: (k: string, v: string) => void mem.set(k, v),
  removeItem: (k: string) => void mem.delete(k),
  clear: () => mem.clear()
}

let failures = 0
function assert(cond: boolean, msg: string) {
  if (cond) console.log('  ✅', msg)
  else { failures++; console.error('  ❌', msg) }
}

setActivePinia(createPinia())
const store = useScriptStore()
store.hydrate()

const exhibit = store.exhibits.find(e => e.id === 'exhibit-jade')!
const zh = () => exhibit.drafts.find(d => d.languageId === 'zh')!
const en = () => exhibit.drafts.find(d => d.languageId === 'en')!
const ja = () => exhibit.drafts.find(d => d.languageId === 'ja')!

console.log('初始状态')
assert(exhibit.masterVersion === 1, `主稿版本 v1（实际 v${exhibit.masterVersion}）`)
assert(zh().status === 'approved', '中文主稿已定稿')
assert(en().status === 'approved', '英文已定稿')
assert(en().sync !== undefined, '英文已建立同步基线')
assert(store.analyzeSync(exhibit, en()).outOfSync === false, '英文与主稿一致，非待同步')

console.log('修改中文讲解词（非锁定字段）')
store.selectExhibit('exhibit-jade')
store.selectLanguage('zh')
const newNarration = zh().narration + '玉琮在墓葬中往往置于墓主腰腹一侧。'
store.updateDraft({ narration: newNarration })
assert(exhibit.masterVersion === 2, `主稿版本升到 v2（实际 v${exhibit.masterVersion}）`)
assert(zh().status === 'review', '中文主稿已定稿→回到待审')
assert(en().status === 'review', '英文原定稿→回到待审（译文不丢）')
assert(store.analyzeSync(exhibit, en()).outOfSync === true, '英文转为待同步')
const a1 = store.analyzeSync(exhibit, en())
assert(a1.pendingFields.some(f => f.field === 'narration'), '列出不一致字段：讲解词')
assert(a1.pendingCount === 1, `只有 1 处待处理（实际 ${a1.pendingCount}）`)
assert(store.outOfSyncCount(exhibit) === 1, `展项有 1 个待同步语言（实际 ${store.outOfSyncCount(exhibit)}，日文无基线不受影响）`)
assert(en().narration.includes('Liangzhu'), '英文译文内容保留未丢')

console.log('未确认完不能定稿')
store.selectLanguage('en')
store.setStatus('approved')
assert(en().status === 'review', '有待同步项时无法直接定稿')

console.log('逐段/逐字段确认')
store.confirmField('narration')
const a2 = store.analyzeSync(exhibit, en())
assert(a2.pendingCount === 0, '确认后待处理清零')
assert(en().sync!.outOfSync === false, '退出待同步状态')
assert(en().status === 'review', '回到待审，等待重新定稿')

console.log('重新定稿')
store.setStatus('approved')
assert(en().status === 'approved', '英文重新定稿')
assert(en().sync!.baseline.masterVersion === 2, `基线刷新到 v2（实际 v${en().sync!.baseline.masterVersion}）`)
assert(store.analyzeSync(exhibit, en()).outOfSync === false, '定稿后不再待同步')

console.log('锁定段落保护：改中文第 1 段（对应英文第 1 段已锁定）')
store.selectLanguage('zh')
const zhSeg1 = zh().segments.find(s => s.id === 'jade-zh-1')!
store.toggleLock(zhSeg1.id) // 解锁中文主稿段（英文对应段仍锁定）
store.updateSegment(zhSeg1.id, { content: '这件玉琮出自五千年前的良渚文化高等级墓葬。' })
assert(exhibit.masterVersion === 3, `主稿版本升到 v3（实际 v${exhibit.masterVersion}）`)
const a3 = store.analyzeSync(exhibit, en())
const protectedSeg = a3.protectedSegments.find(p => p.sourceSegmentId === 'jade-zh-1')
assert(Boolean(protectedSeg), '锁定段未列入待处理，但在保留区可见')
assert(a3.pendingSegments.every(p => p.sourceSegmentId !== 'jade-zh-1'), '待处理清单不含锁定段')
const enSeg1 = en().segments.find(s => s.sourceSegmentId === 'jade-zh-1')!
assert(enSeg1.content === 'This jade cong is about five thousand years old.', '锁定译文保留原内容')
assert(enSeg1.locked === true, '锁定状态保留')

console.log('主稿新增段落 → 译文待补')
store.selectLanguage('zh')
store.addSegment()
const newest = zh().segments[zh().segments.length - 1]
store.updateSegment(newest.id, { label: '结语', content: '玉琮见证了中国早期文明的宇宙观。' })
const a4 = store.analyzeSync(exhibit, en())
const newPending = a4.pendingSources.find(p => p.sourceLabel === '结语')
assert(Boolean(newPending), '主稿新增段落在待同步中列为缺失段落')
const beforeCount = en().segments.length
store.selectLanguage('en')
store.adoptSource(newPending!.sourceSegmentId)
assert(en().segments.length === beforeCount + 1, '采纳后译文中新增对应段落')
assert(en().segments.some(s => s.content === '玉琮见证了中国早期文明的宇宙观。'), '采纳段落带入主稿内容并建立链接')

console.log('忽略不适用于该译文的主稿段落')
store.selectLanguage('zh')
store.addSegment()
const extra = zh().segments[zh().segments.length - 1]
store.updateSegment(extra.id, { label: '方言注音', content: '琮（cóng）。' })
store.selectLanguage('en')
const a5 = store.analyzeSync(exhibit, en())
const ignorePending = a5.pendingSources.find(p => p.sourceSegmentId === extra.id)
assert(Boolean(ignorePending), '新增注音段落出现在待同步')
store.ignoreSource(extra.id)
const a6 = store.analyzeSync(exhibit, en())
assert(!a6.pendingSources.some(p => p.sourceSegmentId === extra.id), '忽略后不再要求同步')

console.log('持久化：重新 hydrate 后关系仍在')
const raw = (localStorage as any).getItem('museum-script-studio-v1')
const parsed = JSON.parse(raw)
const persistedEx = parsed.exhibits.find((e: any) => e.id === 'exhibit-jade')
assert(persistedEx.masterVersion >= 4, `主稿版本已持久化（v${persistedEx.masterVersion}）`)
const persistedEn = persistedEx.drafts.find((d: any) => d.languageId === 'en')
assert(persistedEn.sync && Array.isArray(persistedEn.sync.ignoredSources), '译文同步关系（含忽略记录）已持久化')

console.log(failures === 0 ? '\n全部通过 ✅' : `\n${failures} 项失败 ❌`)
process.exit(failures === 0 ? 0 : 1)
