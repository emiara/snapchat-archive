<template>
  <article class="memory-card card" :aria-label="memoryLabel">
    <div class="memory-header">
      <div class="memory-type">
        <span class="type-icon">{{ typeIcon }}</span>
        <span class="type-label">{{ memory['Media Type'] }}</span>
      </div>
      <time :datetime="memory.Date" class="memory-date">
        {{ formattedDate }}
      </time>
    </div>

    <div class="memory-content">
      <div class="memory-media">
        <div class="media-placeholder">
          <span class="media-icon">{{ mediaIcon }}</span>
        </div>
      </div>

      <div class="memory-meta">
        <p v-if="memory.Location" class="memory-location">
          <span class="location-label">Location:</span>
          <span>{{ memory.Location }}</span>
        </p>
      </div>
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
  return props.memory['Media Type'] === 'Video' ? '🎬' : '🖼️'
})

const mediaIcon = computed(() => {
  return props.memory['Media Type'] === 'Video' ? '🎬' : '🖼️'
})

const formattedDate = computed(() => {
  return new Date(props.memory.Date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  })
})

const memoryLabel = computed(() => {
  return `Memory from ${props.memory.Date}`
})
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

.memory-meta {
  display: flex;
  flex-direction: column;
  gap: var(--space-xs);
}

.memory-location {
  font-size: 0.875rem;
  color: var(--text-soft);
}

.location-label {
  color: var(--text-soft);
  margin-right: var(--space-xs);
}
</style>
