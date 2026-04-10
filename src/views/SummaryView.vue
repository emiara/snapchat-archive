<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useArchiveStore } from '../stores/archive'

const archiveStore = useArchiveStore()

const stats = computed(() => archiveStore.archiveStats)
const isLoadingStats = computed(() => archiveStore.isLoadingStats)
const hasAIConsent = computed(() => archiveStore.hasAIConsent)
const analysisResults = computed(() => archiveStore.analysisResults)

onMounted(() => {
  archiveStore.loadStats()
})
</script>

<template>
  <div class="page">
    <div class="container container-narrow">
      <header class="page-header">
        <span class="eyebrow">Narrative recap</span>
        <h1>The short version of your Snapchat years.</h1>
        <p class="page-subtitle">
          This page turns the archive into a readable chapter summary. The framing is reflective on purpose: who mattered, when the peaks happened, and what kind of history you are actually leaving with.
        </p>
      </header>

      <div class="consent-banner card" v-if="!hasAIConsent">
        <div class="consent-content">
          <h3>Run the local recap layer</h3>
          <p>
            This demo uses local heuristics and mock patterns to present the recap view. No external AI service is called from this screen.
          </p>
        </div>
        <button class="btn btn-primary" @click="archiveStore.setAIConsent(true)">
          Show recap cards
        </button>
      </div>

      <template v-if="hasAIConsent">
        <section class="stats-summary">
          <h2 class="section-heading">Your archive in numbers</h2>
          <p v-if="isLoadingStats" class="section-subtitle">Computing stats…</p>
          <div v-else class="stats-grid-simple">
            <div class="stat-item">
              <span class="stat-value">{{ (stats?.totalSnaps ?? 0).toLocaleString() }}</span>
              <span class="stat-label">snaps sent and received</span>
            </div>
            <div class="stat-item">
              <span class="stat-value">{{ (stats?.totalChats ?? 0).toLocaleString() }}</span>
              <span class="stat-label">chat messages</span>
            </div>
            <div class="stat-item">
              <span class="stat-value">{{ (stats?.totalDays ?? 0).toLocaleString() }}</span>
              <span class="stat-label">days of memories</span>
            </div>
            <div class="stat-item">
              <span class="stat-value">{{ stats?.totalFriends ?? 0 }}</span>
              <span class="stat-label">friends</span>
            </div>
          </div>
        </section>

        <section class="analysis-section">
          <h2 class="section-heading">Analysis Results</h2>
          <p class="section-subtitle">
            Run analyzers from the archive store to see insights about your Snapchat history.
          </p>
          <div v-if="analysisResults.size > 0" class="analysis-results">
            <div v-for="[key, value] in Array.from(analysisResults.entries())" :key="key" class="analysis-item card">
              <h3>{{ key }}</h3>
              <pre>{{ JSON.stringify(value, null, 2) }}</pre>
            </div>
          </div>
          <div v-else class="empty-state">
            <p>No analysis results yet. Run analyzers to generate insights.</p>
          </div>
        </section>

        <section class="disclaimer card">
          <h3>How to read this page</h3>
          <p>
            These recap cards are assistive, not authoritative. They are here to make the archive legible and emotionally navigable, not to tell you what your life meant.
          </p>
          <p>
            If something feels off, trust the raw memories more than the summary layer and jump into the review screens.
          </p>
        </section>
      </template>
    </div>
  </div>
</template>

<style scoped>
.container-narrow {
  max-width: 800px;
}

.page-header {
  text-align: center;
  margin-bottom: var(--space-xl);
}

.page-header h1 {
  margin: 16px 0 12px;
}

.page-subtitle {
  color: var(--text-soft);
  font-size: 1.05rem;
  line-height: 1.6;
}

.consent-banner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-lg);
  margin-bottom: var(--space-xl);
  padding: var(--space-lg);
  background: rgba(255, 251, 245, 0.92);
  border: 1px solid var(--border-strong);
}

.consent-content h3 {
  font-size: 1rem;
  margin-bottom: var(--space-xs);
}

.consent-content p {
  font-size: 0.9rem;
  color: var(--text-soft);
  max-width: 500px;
}

.stats-summary {
  margin-bottom: var(--space-2xl);
}

.section-heading {
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: var(--space-lg);
}

.stats-grid-simple {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--space-lg);
}

.stat-item {
  text-align: center;
  padding: var(--space-lg);
  background: rgba(255, 255, 255, 0.56);
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
}

.stat-item .stat-value {
  display: block;
  font-size: 1.75rem;
  font-weight: 700;
  color: var(--text-h);
}

.stat-item .stat-label {
  font-size: 0.85rem;
  color: var(--text-soft);
}

.highlight-section {
  margin-bottom: var(--space-2xl);
}

.highlights-list {
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
}

.disclaimer {
  padding: var(--space-lg);
  background: rgba(255, 255, 255, 0.44);
  border: 1px solid var(--border);
}

.disclaimer h3 {
  font-size: 1rem;
  margin-bottom: var(--space-sm);
}

.disclaimer p {
  font-size: 0.9rem;
  color: var(--text-soft);
  line-height: 1.6;
  margin-bottom: var(--space-sm);
}

.disclaimer p:last-child {
  margin-bottom: 0;
}

@media (max-width: 640px) {
  .consent-banner {
    flex-direction: column;
    text-align: center;
  }

  .stats-grid-simple {
    grid-template-columns: 1fr;
  }
}
</style>
