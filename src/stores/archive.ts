import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Friend, Memory, Story, ArchiveStats, ExportConfig, ChatHistory, SnapHistory } from '../types'
import type { ArchiveSession, ArchiveProgressCallback } from '../lib/snapArchive'
import { createArchiveSession } from '../lib/snapArchive'
import { buildArchiveSnapshot } from '../lib/dataTransform'
import {
  AnalysisManager,
  StreakAnalyzer,
  BestFriendsAnalyzer,
  SentimentAnalyzer,
  WordCloudAnalyzer,
  TimelineAnalyzer,
} from '../lib/analyzers'

export const useArchiveStore = defineStore('archive', () => {
  const isImported = ref(false)
  const isProcessing = ref(false)
  const processingProgress = ref(0)
  const processingStatus = ref('')
  const hasAIConsent = ref(false)

  const friendsList = ref<Friend[]>([])
  const chatHistory = ref<ChatHistory | null>(null)
  const snapHistory = ref<SnapHistory | null>(null)
  const memoriesList = ref<Memory[]>([])
  const storiesList = ref<Story[]>([])
  const archiveStats = ref<ArchiveStats | null>(null)
  const analysisManager = ref<AnalysisManager | null>(null)
  const analysisResults = ref<Map<string, unknown>>(new Map())
  const archiveSession = ref<ArchiveSession | null>(null)
  const selectedFiles = ref<File[]>([])

  const exportConfig = ref<ExportConfig>({
    includeSnaps: true,
    includeChats: true,
    includeStories: true,
    includeMetadata: true,
    format: 'immich'
  })

  const importedDate = ref<string | null>(null)

  const totalMemories = computed(() => memoriesList.value.length)
  const totalFriends = computed(() => friendsList.value.length)
  const totalChats = computed(() => {
    if (!chatHistory.value) return 0
    return Object.values(chatHistory.value).reduce((sum, thread) => sum + thread.length, 0)
  })

  function startProcessing() {
    isProcessing.value = true
    processingProgress.value = 0
  }

  function updateProgress(progress: number, status: string) {
    processingProgress.value = progress
    processingStatus.value = status
  }

  function completeProcessing() {
    isProcessing.value = false
    isImported.value = true
    processingProgress.value = 100
    importedDate.value = new Date().toISOString()
  }

  async function prepareArchive(files: File[], onProgress?: ArchiveProgressCallback): Promise<void> {
    const session = await createArchiveSession(files, (progress, status) => {
      updateProgress(progress, status)
      onProgress?.(progress, status)
    })

    archiveSession.value = session
    const snapshot = buildArchiveSnapshot(session.metadata)
    friendsList.value = snapshot.friends
    archiveStats.value = snapshot.stats
    initializeAnalyzers(session)
  }

  function initializeAnalyzers(session: ArchiveSession) {
    const manager = new AnalysisManager({ reader: session.reader, metadata: session.metadata })
    manager.registerAll([
      new StreakAnalyzer(),
      new BestFriendsAnalyzer(),
      new SentimentAnalyzer(),
      new WordCloudAnalyzer(),
      new TimelineAnalyzer(),
    ])
    analysisManager.value = manager
    analysisResults.value = manager.getCachedResults()
  }

  async function runAnalyzer(id: string) {
    if (!analysisManager.value) return undefined
    const result = await analysisManager.value.runOne(id)
    analysisResults.value = new Map(analysisManager.value.getCachedResults())
    return result
  }

  function setSelectedFiles(files: File[]) {
    selectedFiles.value = files
  }

  function setAIConsent(consent: boolean) {
    hasAIConsent.value = consent
  }

  function updateExportConfig(config: Partial<ExportConfig>) {
    exportConfig.value = { ...exportConfig.value, ...config }
  }

  function resetArchive() {
    isImported.value = false
    isProcessing.value = false
    processingProgress.value = 0
    processingStatus.value = ''
    hasAIConsent.value = false
    friendsList.value = []
    chatHistory.value = null
    snapHistory.value = null
    memoriesList.value = []
    storiesList.value = []
    archiveStats.value = null
    analysisManager.value = null
    analysisResults.value = new Map()
    archiveSession.value = null
    selectedFiles.value = []
    importedDate.value = null
  }

  return {
    isImported,
    isProcessing,
    processingProgress,
    processingStatus,
    hasAIConsent,
    friendsList,
    chatHistory,
    snapHistory,
    memoriesList,
    storiesList,
    archiveStats,
    exportConfig,
    analysisResults,
    archiveSession,
    selectedFiles,
    importedDate,
    totalMemories,
    totalFriends,
    totalChats,
    startProcessing,
    updateProgress,
    completeProcessing,
    prepareArchive,
    runAnalyzer,
    setSelectedFiles,
    setAIConsent,
    updateExportConfig,
    resetArchive
  }
})
