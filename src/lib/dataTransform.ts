import type { ArchiveStats, Friend, ArchiveMetadata } from '../types'

export interface ArchiveSnapshot {
  friends: Friend[]
  stats: ArchiveStats
}

export function buildArchiveSnapshot(metadata: ArchiveMetadata): ArchiveSnapshot {
  return {
    friends: metadata.friends,
    stats: deriveStats(metadata),
  }
}

function deriveStats(metadata: ArchiveMetadata): ArchiveStats {
  const accountInfo = metadata.account?.['Basic Information']
  const start = accountInfo?.['Creation Date'] ?? ''
  const end = accountInfo?.['Last Active'] ?? ''
  const totalDays = start && end ? Math.max(1, calculateDayDiff(start, end)) : 0

  return {
    totalSnaps: 0,
    totalChats: 0,
    totalStories: metadata.stats.hasStoryHistory ? 1 : 0,
    totalFriends: metadata.stats.friendCount,
    dateRange: {
      start,
      end,
    },
    totalDays,
    bestStreak: 0,
    totalMediaSize: 'unknown',
  }
}

function calculateDayDiff(start: string, end: string): number {
  const startDate = new Date(start)
  const endDate = new Date(end)
  if (Number.isNaN(startDate.getTime()) || Number.isNaN(endDate.getTime())) {
    return 0
  }
  const diffMs = Math.abs(endDate.getTime() - startDate.getTime())
  return Math.ceil(diffMs / (1000 * 60 * 60 * 24))
}
