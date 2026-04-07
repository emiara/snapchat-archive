<template>
  <article class="memory-card card" :aria-label="memoryLabel">
    <div class="memory-header">
      <div class="memory-type">
        <span class="type-icon">{{ typeIcon }}</span>
        <span class="type-label">{{ memory.type }}</span>
      </div>
      <time :datetime="memory.date" class="memory-date">
        {{ formattedDate }}
      </time>
    </div>

    <div class="memory-content">
      <div class="memory-media">
        <div class="media-placeholder">
          <span class="media-icon">{{ mediaIcon }}</span>
        </div>
        <div v-if="memory.streak" class="streak-badge" title="Streak">
          🔥
        </div>
        <div v-if="memory.isSaved" class="saved-badge" title="Saved">
          <span>★</span>
        </div>
      </div>

      <div class="memory-meta">
        <p class="memory-sender">
          <span class="sender-label">From:</span>
          <strong>{{ formatSender(memory.sender) }}</strong>
        </p>
        <p v-if="memory.recipient && memory.recipient !== 'me'" class="memory-recipient">
          <span class="recipient-label">To:</span>
          <span>{{ formatSender(memory.recipient) }}</span>
        </p>
      </div>

      <p v-if="memory.caption" class="memory-caption">
        {{ memory.caption }}
      </p>
    </div>
  </article>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Memory } from '../types'

const props = defineProps<{
  memory: Memory
}>()

const typeIcon = computed(() => {
  const icons: Record<string, string> = {
    snap: '📸',
    chat: '💬',
    story: '📖',
    spotlight: '✨'
  }
  return icons[props.memory.type] || '📷'
})

const mediaIcon = computed(() => {
  if (!props.memory.mediaType) return '💭'
  const icons: Record<string, string> = {
    image: '🖼️',
    video: '🎬'
  }
  return icons[props.memory.mediaType] || '📷'
})

const formattedDate = computed(() => {
  return new Date(props.memory.date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  })
})

const memoryLabel = computed(() => {
  return `${props.memory.type} from ${props.memory.sender} on ${props.memory.date}`
})

function formatSender(sender: string): string {
  if (sender === 'me') return 'You'
  return sender.replace(/_/g, ' ').replace(/\./g, ' ')
}
</script>

<style scoped>
.memory-card {
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
  cursor: pointer;
  transition: all var(--transition-fast);
  min-height: 100%;
}

.memory-card:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

.memory-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.memory-type {
  display: flex;
  align-items: center;
  gap: var(--space-xs);
  font-size: 0.75rem;
  color: var(--text-soft);
  text-transform: capitalize;
}

.type-icon {
  font-size: 1rem;
}

.memory-date {
  font-size: 0.8rem;
  color: var(--text-soft);
}

.memory-content {
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
}

.memory-media {
  position: relative;
  aspect-ratio: 1;
  border-radius: var(--radius-md);
  overflow: hidden;
  background: var(--bg-subtle);
}

.media-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2.5rem;
  background: linear-gradient(135deg, rgba(243, 203, 69, 0.18) 0%, rgba(31, 105, 88, 0.08) 100%);
}

.streak-badge,
.saved-badge {
  position: absolute;
  top: var(--space-sm);
  padding: 2px 6px;
  border-radius: var(--radius-sm);
  font-size: 0.875rem;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(4px);
}

.streak-badge {
  right: var(--space-sm);
}

.saved-badge {
  left: var(--space-sm);
}

.memory-meta {
  display: flex;
  flex-direction: column;
  gap: var(--space-xs);
}

.memory-sender,
.memory-recipient {
  font-size: 0.875rem;
  color: var(--text-soft);
}

.sender-label,
.recipient-label {
  color: var(--text-soft);
  margin-right: var(--space-xs);
}

.memory-caption {
  font-size: 0.9rem;
  color: var(--text-h);
  line-height: 1.5;
  padding: var(--space-sm);
  background: rgba(255, 255, 255, 0.62);
  border-radius: 14px;
}
</style>
