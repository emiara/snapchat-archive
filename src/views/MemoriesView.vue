<script setup lang="ts">
import { computed, ref } from 'vue'
import { useArchiveStore } from '../stores/archive'
import MemoryCard from '../components/MemoryCard.vue'
import type { Memory } from '../types'

const archiveStore = useArchiveStore()

const selectedType = ref<string>('all')
const selectedYear = ref<string>('all')
const selectedMemory = ref<Memory | null>(null)

const types = ['all', 'Image', 'Video']

const years = computed(() => {
  const yearSet = new Set<string>()
  archiveStore.memoriesList.forEach((memory) => {
    yearSet.add(memory.Date.substring(0, 4))
  })
  return ['all', ...Array.from(yearSet).sort().reverse()]
})

const filteredMemories = computed(() => {
  return archiveStore.memoriesList
    .filter((memory) => {
      if (selectedType.value !== 'all' && memory['Media Type'] !== selectedType.value) return false
      if (selectedYear.value !== 'all' && !memory.Date.startsWith(selectedYear.value)) return false
      return true
    })
    .sort((a, b) => new Date(b.Date).getTime() - new Date(a.Date).getTime())
})

function selectMemory(memory: Memory) {
  selectedMemory.value = memory
}

function closeDetail() {
  selectedMemory.value = null
}
</script>

<template>
  <div class="page">
    <div class="container">
      <header class="page-header">
        <span class="eyebrow">Review room</span>
        <h1>Review the memories before you move them.</h1>
        <p class="page-subtitle">
          {{ filteredMemories.length }} items in the current filter set.
        </p>
      </header>

      <div class="filters-bar">
        <div class="filter-group">
          <label for="type-filter" class="filter-label">Type</label>
          <select id="type-filter" v-model="selectedType" class="filter-select">
            <option v-for="type in types" :key="type" :value="type">{{ type === 'all' ? 'All types' : type }}</option>
          </select>
        </div>

        <div class="filter-group">
          <label for="year-filter" class="filter-label">Year</label>
          <select id="year-filter" v-model="selectedYear" class="filter-select">
            <option v-for="year in years" :key="year" :value="year">{{ year === 'all' ? 'All years' : year }}</option>
          </select>
        </div>
      </div>

      <div class="memories-grid" v-if="filteredMemories.length > 0">
        <MemoryCard
          v-for="(memory, index) in filteredMemories"
          :key="index"
          :memory="memory"
          @click="selectMemory(memory)"
        />
      </div>

      <div v-else class="empty-state">
        <p>No memories match those filters.</p>
        <button class="btn btn-secondary" @click="selectedType = 'all'; selectedYear = 'all'">
          Clear filters
        </button>
      </div>
    </div>

    <Transition name="slide">
      <div v-if="selectedMemory" class="detail-overlay" @click.self="closeDetail">
        <div class="detail-drawer card">
          <button class="close-btn" @click="closeDetail" aria-label="Close">×</button>

          <div class="detail-header">
            <span class="detail-type badge">{{ selectedMemory['Media Type'] }}</span>
            <span class="detail-date">{{ selectedMemory.Date }}</span>
          </div>

          <div class="detail-content">
            <div class="detail-preview">
              <div class="preview-placeholder">
                <span>{{ selectedMemory['Media Type'] === 'Video' ? '🎬' : '🖼️' }}</span>
              </div>
            </div>

            <div class="detail-info">
              <p v-if="selectedMemory.Location"><strong>Location:</strong> {{ selectedMemory.Location }}</p>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.page-header {
  margin-bottom: var(--space-lg);
}

.page-header h1 {
  margin: 16px 0 12px;
}

.page-subtitle {
  color: var(--text-soft);
}

.filters-bar {
  display: flex;
  gap: var(--space-md);
  margin-bottom: var(--space-xl);
  flex-wrap: wrap;
  padding: var(--space-md);
  background: rgba(255, 255, 255, 0.56);
  border: 1px solid var(--border);
  border-radius: 24px;
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: var(--space-xs);
}

.filter-label {
  font-size: 0.75rem;
  font-weight: 500;
  color: var(--text-soft);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.filter-select {
  padding: var(--space-sm) var(--space-md);
  font-size: 0.9rem;
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  background: rgba(255, 255, 255, 0.82);
  color: var(--text-h);
  min-width: 140px;
  cursor: pointer;
}

.filter-select:focus {
  outline: none;
  border-color: var(--accent);
}

.memories-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: var(--space-md);
}

.empty-state {
  text-align: center;
  padding: var(--space-3xl);
  color: var(--text-soft);
}

.empty-state p {
  margin-bottom: var(--space-md);
}

.detail-overlay {
  position: fixed;
  inset: 0;
  background: rgba(16, 12, 10, 0.42);
  display: flex;
  justify-content: flex-end;
  z-index: 200;
}

.detail-drawer {
  width: 100%;
  max-width: 400px;
  height: 100%;
  border-radius: 0;
  border-left: 1px solid var(--border);
  padding: var(--space-xl);
  overflow-y: auto;
  position: relative;
}

.close-btn {
  position: absolute;
  top: var(--space-md);
  right: var(--space-md);
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.68);
  border: none;
  border-radius: var(--radius-sm);
  font-size: 1.5rem;
  cursor: pointer;
  color: var(--text-h);
}

.close-btn:hover {
  background: rgba(89, 69, 48, 0.16);
}

.detail-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--space-lg);
}

.detail-type {
  text-transform: capitalize;
}

.detail-date {
  color: var(--text-soft);
  font-size: 0.875rem;
}

.detail-content {
  display: flex;
  flex-direction: column;
  gap: var(--space-lg);
}

.preview-placeholder {
  width: 100%;
  aspect-ratio: 1;
  border-radius: var(--radius-md);
  background: linear-gradient(145deg, rgba(243, 203, 69, 0.12), rgba(31, 105, 88, 0.08));
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 3rem;
}

.detail-info p {
  color: var(--text-soft);
  margin-bottom: var(--space-sm);
}

.detail-info strong {
  color: var(--text-h);
}
</style>
