import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { friends, memories, chats, stories, stats, aiHighlights } from '../data/mockData'
import type { Friend, Memory, Chat, Story, ArchiveStats, AIHighlight, ExportConfig } from '../types'

export const useArchiveStore = defineStore('archive', () => {
  const isImported = ref(false)
  const isProcessing = ref(false)
  const processingProgress = ref(0)
  const processingStatus = ref('')
  const hasAIConsent = ref(false)

  const friendsList = ref<Friend[]>([])
  const memoriesList = ref<Memory[]>([])
  const chatsList = ref<Chat[]>([])
  const storiesList = ref<Story[]>([])
  const archiveStats = ref<ArchiveStats | null>(null)
  const highlights = ref<AIHighlight[]>([])
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
  const totalChats = computed(() => chatsList.value.length)

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

  function loadArchive() {
    friendsList.value = friends
    memoriesList.value = memories
    chatsList.value = chats
    storiesList.value = stories
    archiveStats.value = stats
    highlights.value = aiHighlights
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
    memoriesList.value = []
    chatsList.value = []
    storiesList.value = []
    archiveStats.value = null
    highlights.value = []
    importedDate.value = null
  }

  return {
    isImported,
    isProcessing,
    processingProgress,
    processingStatus,
    hasAIConsent,
    friendsList,
    memoriesList,
    chatsList,
    storiesList,
    archiveStats,
    highlights,
    exportConfig,
    importedDate,
    totalMemories,
    totalFriends,
    totalChats,
    startProcessing,
    updateProgress,
    completeProcessing,
    loadArchive,
    setAIConsent,
    updateExportConfig,
    resetArchive
  }
})
