import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Friend, Photo, Story, ComputedArchiveStats, ExportConfig, ChatHistory, SnapHistory, StoryHistoryJson, PhotosJson } from '../types'
import type { ArchiveSession, ArchiveProgressCallback } from '../lib/snapArchive'
import { createArchiveSession, SNAP_JSON_PATHS } from '../lib/snapArchive'
import { computeStats } from '../lib/computeStats'
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
  const photosList = ref<Photo[]>([])
  const storiesList = ref<Story[]>([])
  const archiveStats = ref<ComputedArchiveStats | null>(null)
  const isLoadingStats = ref(false)
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

  const totalPhotos = computed(() => photosList.value.length)
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
    friendsList.value = session.metadata.friends
    // Stats will be computed lazily when the dashboard calls loadStats()
    archiveStats.value = null
    initializeAnalyzers(session)
  }

  /**
   * Lazy-load the heavy JSON files and compute all stats.
   * Safe to call multiple times — returns immediately if stats are already loaded.
   * Called by the dashboard on mount.
   */
  async function loadStats(): Promise<void> {
    if (archiveStats.value !== null) return
    if (!archiveSession.value) return
    if (isLoadingStats.value) return

    isLoadingStats.value = true
    const { reader, metadata } = archiveSession.value

    try {
      updateProgress(10, 'Loading snap history')
      const snap = await reader.readJsonFile<SnapHistory>(SNAP_JSON_PATHS.snapHistory)
      snapHistory.value = snap

      updateProgress(35, 'Loading chat history')
      const chat = await reader.readJsonFile<ChatHistory>(SNAP_JSON_PATHS.chatHistory)
      chatHistory.value = chat

      updateProgress(60, 'Loading story history')
      const storyJson = await reader.readJsonFile<StoryHistoryJson>(SNAP_JSON_PATHS.storyHistory)
      storiesList.value = storyJson?.['Your Story Views'] ?? []

      updateProgress(75, 'Loading photos')
      const photosJson = await reader.readJsonFile<PhotosJson>(SNAP_JSON_PATHS.photosHistory)
      photosList.value = photosJson?.['Saved Media'] ?? []

      updateProgress(90, 'Computing stats')
      archiveStats.value = computeStats({
        account: metadata.account,
        friends: metadata.friends,
        snapHistory: snap,
        chatHistory: chat,
        storyHistory: storyJson,
      })

      updateProgress(100, 'Done')
    } finally {
      isLoadingStats.value = false
    }
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
    photosList.value = []
    storiesList.value = []
    archiveStats.value = null
    isLoadingStats.value = false
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
    photosList,
    storiesList,
    archiveStats,
    isLoadingStats,
    exportConfig,
    analysisResults,
    archiveSession,
    selectedFiles,
    importedDate,
    totalPhotos,
    totalFriends,
    totalChats,
    startProcessing,
    updateProgress,
    completeProcessing,
    prepareArchive,
    loadStats,
    runAnalyzer,
    setSelectedFiles,
    setAIConsent,
    updateExportConfig,
    resetArchive
  }
})
