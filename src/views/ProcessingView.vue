<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useArchiveStore } from '../stores/archive'

const router = useRouter()
const archiveStore = useArchiveStore()

let timer: ReturnType<typeof setTimeout> | null = null

async function runProcessingSequence() {
  const steps = [
    { progress: 18, status: 'Reading the takeout zip' },
    { progress: 34, status: 'Mapping memories and saved media' },
    { progress: 58, status: 'Indexing chats, streaks, and story history' },
    { progress: 82, status: 'Building the recap view' },
    { progress: 100, status: 'Recap ready' },
  ]

  for (const step of steps) {
    await new Promise((resolve) => {
      timer = setTimeout(resolve, 650)
    })
    archiveStore.updateProgress(step.progress, step.status)
  }

  archiveStore.loadArchive()
  archiveStore.completeProcessing()

  timer = setTimeout(() => {
    router.push('/dashboard')
  }, 700)
}

onMounted(() => {
  if (archiveStore.isImported) {
    router.push('/dashboard')
    return
  }

  if (!archiveStore.isProcessing) {
    router.push('/import')
    return
  }

  runProcessingSequence()
})

onUnmounted(() => {
  if (timer) clearTimeout(timer)
})
</script>

<template>
  <div class="page">
    <div class="container processing-shell">
      <div class="processing-content card">
        <div class="processing-icon">
          <div class="spinner"></div>
        </div>

        <span class="eyebrow">Private processing</span>
        <h1>Building your Snapchat recap.</h1>
        <p class="processing-subtitle">
          The flow is staged like a local recap session: open the takeout, index the history, and prepare the archive for review and export.
        </p>

        <div class="progress-container">
          <div class="progress-bar">
            <div
              class="progress-fill"
              :style="{ width: `${archiveStore.processingProgress}%` }"
            ></div>
          </div>
          <div class="progress-info">
            <span class="progress-percentage">{{ archiveStore.processingProgress }}%</span>
            <span class="progress-status">{{ archiveStore.processingStatus }}</span>
          </div>
        </div>

        <div class="processing-details">
          <div class="detail-item">
            <span class="detail-icon" :class="{ complete: archiveStore.processingProgress >= 20 }">✓</span>
            <span>Open the zip locally</span>
          </div>
          <div class="detail-item">
            <span class="detail-icon" :class="{ complete: archiveStore.processingProgress >= 40 }">✓</span>
            <span>Map memories and saved media</span>
          </div>
          <div class="detail-item">
            <span class="detail-icon" :class="{ complete: archiveStore.processingProgress >= 60 }">✓</span>
            <span>Read conversations and streaks</span>
          </div>
          <div class="detail-item">
            <span class="detail-icon" :class="{ complete: archiveStore.processingProgress >= 80 }">✓</span>
            <span>Assemble the recap cards</span>
          </div>
          <div class="detail-item">
            <span class="detail-icon" :class="{ complete: archiveStore.processingProgress >= 100 }">✓</span>
            <span>Open review and export views</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.processing-shell {
  display: flex;
  justify-content: center;
}

.processing-content {
  max-width: 720px;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  padding: 28px;
}

.processing-icon {
  width: 88px;
  height: 88px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 28px;
  background: linear-gradient(145deg, rgba(243, 203, 69, 0.22), rgba(31, 105, 88, 0.08));
}

.spinner {
  width: 64px;
  height: 64px;
  border: 4px solid rgba(89, 69, 48, 0.12);
  border-top-color: var(--secondary);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.processing-subtitle {
  color: var(--text-soft);
  font-size: 1rem;
  max-width: 520px;
}

.progress-container {
  width: 100%;
  max-width: 560px;
  margin-top: var(--space-md);
}

.progress-bar {
  height: 10px;
  background: rgba(89, 69, 48, 0.12);
  border-radius: var(--radius-full);
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--secondary), var(--accent-strong));
  border-radius: var(--radius-full);
  transition: width 0.3s ease;
}

.progress-info {
  display: flex;
  justify-content: space-between;
  margin-top: var(--space-sm);
  font-size: 0.875rem;
}

.progress-percentage {
  font-weight: 600;
  color: var(--text-h);
}

.progress-status {
  color: var(--text-soft);
}

.processing-details {
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
  margin-top: var(--space-lg);
  text-align: left;
  width: 100%;
  max-width: 420px;
}

.detail-item {
  display: flex;
  align-items: center;
  gap: var(--space-md);
  color: var(--text-soft);
  font-size: 0.9rem;
}

.detail-icon {
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: rgba(89, 69, 48, 0.12);
  color: var(--text-soft);
  font-size: 0.75rem;
  flex-shrink: 0;
  transition: all 0.2s;
}

.detail-icon.complete {
  background: var(--success);
  color: white;
}
</style>
