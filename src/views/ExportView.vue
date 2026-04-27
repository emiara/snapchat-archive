<script setup lang="ts">
import { computed, ref } from 'vue'
import { useArchiveStore } from '../stores/archive'

const archiveStore = useArchiveStore()

const isExporting = ref(false)
const exportComplete = ref(false)
const exportProgress = ref(0)

const config = computed(() => archiveStore.exportConfig)

function updateConfig(key: keyof typeof config.value, value: boolean | string) {
  archiveStore.updateExportConfig({ [key]: value })
}

async function startExport() {
  isExporting.value = true
  exportProgress.value = 0

  await new Promise((resolve) => setTimeout(resolve, 500))
  exportProgress.value = 20

  await new Promise((resolve) => setTimeout(resolve, 500))
  exportProgress.value = 50

  await new Promise((resolve) => setTimeout(resolve, 500))
  exportProgress.value = 80

  await new Promise((resolve) => setTimeout(resolve, 500))
  exportProgress.value = 100

  isExporting.value = false
  exportComplete.value = true
}
</script>

<template>
  <div class="page">
    <div class="container container-narrow">
      <header class="page-header">
        <span class="eyebrow">Exit with your files</span>
        <h1>Take the photos somewhere you control.</h1>
        <p class="page-subtitle">
          This screen packages the archive for the next home. Immich is the main handoff path, with JSON as the audit-friendly fallback.
        </p>
      </header>

      <div class="export-options card">
        <h2 class="option-heading">Export format</h2>

        <div class="format-options">
          <label class="format-option" :class="{ selected: config.format === 'immich' }">
            <input
              type="radio"
              name="format"
              value="immich"
              :checked="config.format === 'immich'"
              @change="updateConfig('format', 'immich')"
            />
            <div class="format-content">
              <span class="format-icon">⟶</span>
              <div class="format-info">
                <span class="format-name">Immich</span>
                <span class="format-desc">Best for moving photos and videos into a self-hosted library</span>
              </div>
            </div>
          </label>

          <label class="format-option" :class="{ selected: config.format === 'json' }">
            <input
              type="radio"
              name="format"
              value="json"
              :checked="config.format === 'json'"
              @change="updateConfig('format', 'json')"
            />
            <div class="format-content">
              <span class="format-icon">{}</span>
              <div class="format-info">
                <span class="format-name">JSON</span>
                <span class="format-desc">Structured metadata bundle for backup, scripting, or later migration</span>
              </div>
            </div>
          </label>
        </div>
      </div>

      <div class="export-options card">
        <h2 class="option-heading">Include in export</h2>

        <div class="checkbox-group">
          <label class="checkbox-item">
            <input
              type="checkbox"
              :checked="config.includeSnaps"
              @change="updateConfig('includeSnaps', !config.includeSnaps)"
            />
            <span class="checkbox-label">Snaps (photos and videos)</span>
          </label>

          <label class="checkbox-item">
            <input
              type="checkbox"
              :checked="config.includeChats"
              @change="updateConfig('includeChats', !config.includeChats)"
            />
            <span class="checkbox-label">Chat messages</span>
          </label>

          <label class="checkbox-item">
            <input
              type="checkbox"
              :checked="config.includeStories"
              @change="updateConfig('includeStories', !config.includeStories)"
            />
            <span class="checkbox-label">Stories</span>
          </label>

          <label class="checkbox-item">
            <input
              type="checkbox"
              :checked="config.includeMetadata"
              @change="updateConfig('includeMetadata', !config.includeMetadata)"
            />
            <span class="checkbox-label">Metadata (dates, locations, and people)</span>
          </label>
        </div>
      </div>

      <div class="export-info card">
        <h3>What happens next?</h3>
        <ol class="export-steps">
          <li>
            <strong>Package:</strong> The selected set is bundled for either gallery import or structured backup.
          </li>
          <li>
            <strong>Move to Immich:</strong> Use Immich import on the media package if you chose the gallery path.
          </li>
          <li>
            <strong>Stay local:</strong> The export step is presented as a browser-only handoff, with no server round-trip.
          </li>
        </ol>
      </div>

      <div v-if="exportComplete" class="export-success card">
        <div class="success-icon">✓</div>
        <h3>Export bundle ready.</h3>
        <p>The demo flow is complete. In a real implementation, this is where the packaged download would begin automatically.</p>
        <button class="btn btn-secondary" @click="exportComplete = false">
          Export again
        </button>
      </div>

      <div v-else-if="isExporting" class="export-progress">
        <div class="progress-bar">
          <div class="progress-fill" :style="{ width: exportProgress + '%' }"></div>
        </div>
        <p>Packaging your export... {{ exportProgress }}%</p>
      </div>

      <div v-else class="export-actions">
        <button class="btn btn-primary btn-lg" @click="startExport">
          Package export
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.container-narrow {
  max-width: 600px;
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
}

.export-options {
  margin-bottom: var(--space-lg);
  padding: var(--space-lg);
}

.option-heading {
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: var(--space-md);
}

.format-options {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--space-md);
}

.format-option {
  cursor: pointer;
}

.format-option input {
  position: absolute;
  opacity: 0;
}

.format-option .format-content {
  display: flex;
  align-items: center;
  gap: var(--space-md);
  padding: var(--space-md);
  border: 2px solid var(--border);
  border-radius: 18px;
  transition: all var(--transition-fast);
  background: rgba(255, 255, 255, 0.52);
}

.format-option.selected .format-content {
  border-color: var(--secondary);
  background: rgba(31, 105, 88, 0.08);
}

.format-icon {
  width: 40px;
  height: 40px;
  display: grid;
  place-items: center;
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.78);
  font-size: 1.1rem;
  font-weight: 700;
}

.format-info {
  display: flex;
  flex-direction: column;
}

.format-name {
  font-weight: 600;
  font-size: 0.95rem;
}

.format-desc {
  font-size: 0.8rem;
  color: var(--text-soft);
}

.checkbox-group {
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
}

.checkbox-item {
  display: flex;
  align-items: center;
  gap: var(--space-md);
  cursor: pointer;
  color: var(--text-soft);
}

.checkbox-label {
  font-size: 0.95rem;
}

.export-info {
  margin-bottom: var(--space-xl);
  padding: var(--space-lg);
  background: rgba(255, 255, 255, 0.5);
}

.export-info h3 {
  font-size: 1rem;
  margin-bottom: var(--space-md);
}

.export-steps {
  padding-left: var(--space-lg);
  color: var(--text-soft);
  line-height: 1.8;
  font-size: 0.9rem;
}

.export-success {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-md);
  padding: var(--space-xl);
  background: rgba(43, 138, 104, 0.08);
  border: 1px solid rgba(43, 138, 104, 0.22);
}

.success-icon {
  width: 52px;
  height: 52px;
  display: grid;
  place-items: center;
  border-radius: 18px;
  font-size: 1.5rem;
  background: rgba(43, 138, 104, 0.16);
  color: var(--success);
}

.export-progress {
  margin: var(--space-xl) 0;
}

.progress-bar {
  height: 8px;
  background: var(--border);
  border-radius: var(--radius-full);
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--secondary), var(--accent-strong));
  border-radius: var(--radius-full);
  transition: width 0.3s ease;
}

.export-progress p {
  text-align: center;
  color: var(--text-soft);
  margin-top: var(--space-sm);
}

.export-actions {
  display: flex;
  justify-content: center;
  margin-top: var(--space-xl);
}

@media (max-width: 640px) {
  .format-options {
    grid-template-columns: 1fr;
  }
}
</style>
