export interface Friend {
  Username: string
  "Display Name": string
  "Creation Timestamp": string
  "Last Modified Timestamp": string
  Source: string
}

export interface FriendsJson {
  Friends: Friend[]
}

export interface ChatMessage {
  From: string
  "Media Type": 'TEXT' | 'IMAGE' | 'VIDEO' | 'STICKER' | 'AUDIO' | 'GIF' | 'ATTACHMENT'
  Created: string
  Content: string | null
  "Conversation Title": string | null
  IsSender: boolean
  "Created(microseconds)": number
  IsSaved: boolean
  "Media IDs": string
}

export type ChatThread = ChatMessage[]

export type ChatHistory = Record<string, ChatThread>

export interface SnapEntry {
  From: string
  "Media Type": 'IMAGE' | 'VIDEO' | 'UNKNOWN'
  Created: string
  "Conversation Title": string | null
  IsSender: boolean
  "Created(microseconds)": number
}

export type SnapHistory = Record<string, SnapEntry[]>

export interface Memory {
  Date: string
  "Media Type": 'Image' | 'Video'
  Location?: string
  "Download Link"?: string
  "Media Download Url"?: string
}

export interface MemoriesJson {
  "Saved Media": Memory[]
}

export interface Story {
  "Story Date": string
  "Story Views": number
  "Story Replies": number
}

export interface StoryHistoryJson {
  "Your Story Views": Story[]
}

export interface DeviceRecord {
  Make: string
  Model?: string
  "Start Time": string
  "Device Type": string
}

export interface Account {
  "Basic Information": {
    Username: string
    Name?: string
    "Creation Date"?: string
    "Last Active"?: string
  }
  "Device History"?: DeviceRecord[]
}

export interface ArchiveMetadata {
  account: Account | null
  friends: Friend[]
  stats: {
    friendCount: number
    hasChatHistory: boolean
    hasSnapHistory: boolean
    hasMemoriesHistory: boolean
    hasStoryHistory: boolean
  }
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

export type { Friend as SnapchatFriendRecord }
export type { ChatMessage as SnapchatChatMessageRecord }
export type { SnapEntry as SnapchatSnapHistoryEntry }
export type { Memory as SnapchatMemoryRecord }
export type { Story as SnapchatStoryHistoryRecord }
export type { Account as SnapchatAccountJson }
