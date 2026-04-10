import type {
  Account,
  Friend,
  SnapHistory,
  ChatHistory,
  StoryHistoryJson,
  ComputedArchiveStats,
  TopFriendEntry,
} from '../types'

export interface ComputeStatsInput {
  account: Account | null
  friends: Friend[]
  snapHistory: SnapHistory | null
  chatHistory: ChatHistory | null
  storyHistory: StoryHistoryJson | null
}

/**
 * Pure function — all stat computation lives here.
 * No IO, no zip reads. Takes parsed JSON data, returns computed stats.
 *
 * To change how any metric works, edit this function.
 * To add a new metric, add a field to ComputedArchiveStats and compute it here.
 */
export function computeStats(input: ComputeStatsInput): ComputedArchiveStats {
  const { account, friends, snapHistory, chatHistory, storyHistory } = input

  const totalSnaps = snapHistory
    ? Object.values(snapHistory).reduce((sum, entries) => sum + entries.length, 0)
    : 0

  const totalChats = chatHistory
    ? Object.values(chatHistory).reduce((sum, thread) => sum + thread.length, 0)
    : 0

  const totalStories = storyHistory?.['Your Story Views']?.length ?? 0

  const totalFriends = friends.length

  const accountInfo = account?.['Basic Information']
  const dateStart = accountInfo?.['Creation Date'] ?? ''
  const dateEnd = accountInfo?.['Last Active'] ?? ''
  const totalDays = dateStart && dateEnd ? Math.max(1, dayDiff(dateStart, dateEnd)) : 0

  const bestStreak = chatHistory ? computeBestStreak(chatHistory) : 0

  const topFriends = chatHistory
    ? computeTopFriends(chatHistory, friends)
    : []

  return {
    totalSnaps,
    totalChats,
    totalStories,
    totalFriends,
    bestStreak,
    dateRange: { start: dateStart, end: dateEnd },
    totalDays,
    topFriends,
    totalMediaSize: 'unknown',
  }
}

// ---------------------------------------------------------------------------
// Internal helpers — each implements one metric and is easy to swap out
// ---------------------------------------------------------------------------

/**
 * Best streak = the longest consecutive-day run where at least one chat
 * message was sent or received, across ALL conversation threads combined.
 * (A day counts if any conversation had activity.)
 */
function computeBestStreak(chatHistory: ChatHistory): number {
  const allDays = new Set<string>()

  for (const thread of Object.values(chatHistory)) {
    for (const message of thread) {
      const day = toISODate(message.Created)
      if (day) allDays.add(day)
    }
  }

  if (!allDays.size) return 0

  const sorted = Array.from(allDays).sort()
  let best = 1
  let current = 1

  for (let i = 1; i < sorted.length; i++) {
    const prev = new Date(sorted[i - 1])
    const curr = new Date(sorted[i])
    const diff = (curr.getTime() - prev.getTime()) / (1000 * 60 * 60 * 24)

    if (diff === 1) {
      current += 1
      if (current > best) best = current
    } else {
      current = 1
    }
  }

  return best
}

/**
 * Top friends = sorted by total message count (sent + received) descending.
 * Display name is resolved from the friends list by username.
 * Returns up to 8 entries.
 */
function computeTopFriends(chatHistory: ChatHistory, friends: Friend[]): TopFriendEntry[] {
  const displayNameByUsername = new Map<string, string>()
  for (const friend of friends) {
    displayNameByUsername.set(friend.Username, friend['Display Name'])
  }

  const entries: TopFriendEntry[] = []

  for (const [conversationKey, thread] of Object.entries(chatHistory)) {
    // conversation keys are usernames for 1:1 chats; UUIDs for group chats
    const sentMessages = thread.filter((m) => m.IsSender).length
    const receivedMessages = thread.length - sentMessages
    const totalMessages = thread.length

    entries.push({
      username: conversationKey,
      displayName: displayNameByUsername.get(conversationKey) ?? conversationKey,
      totalMessages,
      sentMessages,
      receivedMessages,
    })
  }

  return entries.sort((a, b) => b.totalMessages - a.totalMessages).slice(0, 8)
}

function dayDiff(start: string, end: string): number {
  const a = new Date(start)
  const b = new Date(end)
  if (Number.isNaN(a.getTime()) || Number.isNaN(b.getTime())) return 0
  return Math.ceil(Math.abs(b.getTime() - a.getTime()) / (1000 * 60 * 60 * 24))
}

function toISODate(input: string): string | null {
  const d = new Date(input)
  if (Number.isNaN(d.getTime())) return null
  return d.toISOString().slice(0, 10)
}
