export interface Memory {
  id: string
  type: 'snap' | 'chat' | 'story' | 'spotlight'
  date: string
  timestamp: number
  sender: string
  recipient?: string
  mediaType?: 'image' | 'video'
  mediaUrl?: string
  thumbnailUrl?: string
  caption?: string
  duration?: number
  location?: string
  isSaved: boolean
  streak?: boolean
}

export interface Chat {
  id: string
  friendId: string
  friendName: string
  friendDisplayName?: string
  friendAvatar?: string
  messages: ChatMessage[]
  lastMessageDate: string
  messageCount: number
  isBestFriend: boolean
  streak?: number
}

export interface ChatMessage {
  id: string
  sender: 'me' | 'friend'
  content: string
  timestamp: number
  date: string
  type: 'text' | 'media' | 'sticker'
}

export interface Friend {
  id: string
  name: string
  displayName: string
  avatar?: string
  isBestFriend: boolean
  streak?: number
  snapCount: number
  chatCount: number
  firstInteraction: string
  lastInteraction: string
}

export interface Story {
  id: string
  date: string
  timestamp: number
  snapCount: number
  viewCount?: number
  screenshotCount?: number
}

export interface ArchiveStats {
  totalSnaps: number
  totalChats: number
  totalStories: number
  totalFriends: number
  dateRange: {
    start: string
    end: string
  }
  totalDays: number
  bestStreak: number
  totalMediaSize: string
}

export interface AIHighlight {
  id: string
  category: 'relationship' | 'milestone' | 'memory' | 'stat'
  title: string
  description: string
  confidence: 'high' | 'medium' | 'low'
  relatedMemories?: string[]
}

export interface ExportConfig {
  includeSnaps: boolean
  includeChats: boolean
  includeStories: boolean
  includeMetadata: boolean
  format: 'immich' | 'json'
  dateRange?: {
    start: string
    end: string
  }
}
