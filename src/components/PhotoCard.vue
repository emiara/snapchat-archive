<template>
  <article class="photo-card card" :aria-label="photoLabel">
    <div class="photo-header">
      <div class="photo-type">
        <span class="type-icon">{{ typeIcon }}</span>
        <span class="type-label">{{ photo['Media Type'] }}</span>
      </div>
      <time :datetime="photo.Date" class="photo-date">
        {{ formattedDate }}
      </time>
    </div>

    <div class="photo-content">
      <div class="photo-media">
        <div class="media-placeholder">
          <span class="media-icon">{{ mediaIcon }}</span>
        </div>
      </div>

      <div class="photo-meta">
        <p v-if="photo.Location" class="photo-location">
          <span class="location-label">Location:</span>
          <span>{{ photo.Location }}</span>
        </p>
      </div>
    </div>
  </article>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Photo } from '../types'

const props = defineProps<{
  photo: Photo
}>()

const typeIcon = computed(() => {
  return props.photo['Media Type'] === 'Video' ? '🎬' : '🖼️'
})

const mediaIcon = computed(() => {
  return props.photo['Media Type'] === 'Video' ? '🎬' : '🖼️'
})

const formattedDate = computed(() => {
  return new Date(props.photo.Date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  })
})

const photoLabel = computed(() => {
  return `Photo from ${props.photo.Date}`
})
</script>

<style scoped>
.photo-card {
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
  cursor: pointer;
  transition: all var(--transition-fast);
  min-height: 100%;
}

.photo-card:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

.photo-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.photo-type {
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

.photo-date {
  font-size: 0.8rem;
  color: var(--text-soft);
}

.photo-content {
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
}

.photo-media {
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

.photo-meta {
  display: flex;
  flex-direction: column;
  gap: var(--space-xs);
}

.photo-location {
  font-size: 0.875rem;
  color: var(--text-soft);
}

.location-label {
  color: var(--text-soft);
  margin-right: var(--space-xs);
}
</style>
