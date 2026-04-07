<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useArchiveStore } from '../stores/archive'
import FileDropzone from '../components/FileDropzone.vue'

const router = useRouter()
const archiveStore = useArchiveStore()

const files = ref<File[]>([])
const isStarting = ref(false)

function handleFiles(selectedFiles: File[]) {
  files.value = selectedFiles
}

function resetFiles() {
  files.value = []
}

async function startImport() {
  if (!files.value.length) return

  isStarting.value = true
  archiveStore.startProcessing()
  archiveStore.updateProgress(
    8,
    files.value.length === 1
      ? `Opening ${files.value[0].name}`
      : `Opening ${files.value.length} zip files`
  )
  isStarting.value = false
  router.push('/processing')
}
</script>

<template>
  <div class="page">
    <div class="container import-shell">
      <header class="page-header">
        <span class="eyebrow">Import your takeout</span>
        <h1>Drop the Snapchat zip and start the goodbye flow.</h1>
        <p class="page-subtitle">
          This is the entry point for the recap: open the takeout locally, build a private session in the browser, and move toward export when you are ready.
        </p>
      </header>

      <div class="import-content">
        <section class="card import-panel">
          <FileDropzone @file="handleFiles" />

          <div v-if="files.length" class="import-actions">
            <button
              class="btn btn-primary"
              @click="startImport"
              :disabled="isStarting"
            >
              {{ isStarting ? 'Preparing session...' : 'Build my recap' }}
            </button>
            <button
              class="btn btn-secondary"
              @click="resetFiles"
            >
              Pick different zips
            </button>
          </div>
        </section>

        <aside class="import-sidebar">
          <section class="card info-card emphasis">
            <h3 class="info-title">What this session is for</h3>
            <ul class="info-list">
              <li>Turn a Snapchat takeout into a readable end-of-era recap.</li>
              <li>Review memories and saved media without leaving the browser.</li>
              <li>Package your images and videos for Immich or JSON export.</li>
            </ul>
          </section>

          <section class="card info-card">
            <h3 class="info-title">Where to get the zip</h3>
            <ol class="info-steps">
              <li>Open Snapchat and go to Settings.</li>
              <li>Find <strong>My Data</strong> under account actions.</li>
              <li>Request the archive download link by email.</li>
              <li>Download the zip once Snapchat sends it.</li>
            </ol>
          </section>

          <section class="card info-card">
            <h3 class="info-title">Privacy notes</h3>
            <ul class="info-list">
              <li>No sign-in wall.</li>
              <li>No analytics or background upload flow.</li>
              <li>Session data is meant to stay in-browser while you review.</li>
            </ul>
          </section>
        </aside>
      </div>

      <section class="import-footnote card">
        <div>
          <span class="footnote-label">After import</span>
          <p>The next screens focus on recap, review, and export, so the flow feels like leaving Snapchat with your history intact instead of just hoarding a zip file.</p>
        </div>
      </section>
    </div>
  </div>
</template>

<style scoped>
.page-header {
  max-width: 720px;
  margin-bottom: 28px;
}

.page-header h1 {
  margin: 16px 0 12px;
}

.page-subtitle {
  color: var(--text-soft);
  font-size: 1.05rem;
  max-width: 620px;
}

.import-content {
  display: grid;
  grid-template-columns: minmax(0, 1.1fr) 360px;
  gap: 24px;
  align-items: start;
}

.import-panel {
  padding: 18px;
}

.import-actions {
  display: flex;
  gap: 12px;
  justify-content: center;
  flex-wrap: wrap;
  margin-top: 18px;
}

.import-sidebar {
  display: grid;
  gap: 16px;
}

.info-card {
  display: grid;
  gap: 14px;
}

.info-card.emphasis {
  background:
    radial-gradient(circle at top left, rgba(243, 203, 69, 0.25), transparent 40%),
    rgba(255, 251, 245, 0.9);
}

.info-title {
  font-size: 1rem;
}

.info-list,
.info-steps {
  margin: 0;
  padding-left: 18px;
  color: var(--text-soft);
}

.info-list li,
.info-steps li {
  margin-bottom: 10px;
}

.footnote-label {
  display: inline-block;
  margin-bottom: 10px;
  font-size: 0.78rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--text-soft);
}

.import-footnote {
  margin-top: 24px;
  background: rgba(255, 255, 255, 0.48);
}

.import-footnote p {
  color: var(--text-soft);
}

@media (max-width: 960px) {
  .import-content {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 640px) {
  .import-actions {
    flex-direction: column;
  }
}
</style>
