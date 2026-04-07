import type { Memory, Chat, Friend, Story, ArchiveStats, AIHighlight } from '../types'

const friends: Friend[] = [
  {
    id: 'f1',
    name: 'sarah_m',
    displayName: 'Sarah',
    isBestFriend: true,
    streak: 847,
    snapCount: 2341,
    chatCount: 892,
    firstInteraction: '2019-03-15',
    lastInteraction: '2024-11-20'
  },
  {
    id: 'f2',
    name: 'jake_thompson',
    displayName: 'Jake',
    isBestFriend: true,
    streak: 623,
    snapCount: 1876,
    chatCount: 543,
    firstInteraction: '2020-01-08',
    lastInteraction: '2024-11-19'
  },
  {
    id: 'f3',
    name: 'emma.wilson',
    displayName: 'Emma',
    isBestFriend: false,
    streak: 156,
    snapCount: 432,
    chatCount: 201,
    firstInteraction: '2021-06-22',
    lastInteraction: '2024-11-15'
  },
  {
    id: 'f4',
    name: 'mike_rodriguez',
    displayName: 'Mike',
    isBestFriend: false,
    streak: 89,
    snapCount: 287,
    chatCount: 156,
    firstInteraction: '2022-02-14',
    lastInteraction: '2024-10-30'
  },
  {
    id: 'f5',
    name: 'olivia_chen',
    displayName: 'Olivia',
    isBestFriend: true,
    streak: 412,
    snapCount: 1203,
    chatCount: 678,
    firstInteraction: '2020-09-01',
    lastInteraction: '2024-11-20'
  }
]

const memories: Memory[] = [
  {
    id: 'm1',
    type: 'snap',
    date: '2024-11-20',
    timestamp: 1732118400000,
    sender: 'sarah_m',
    recipient: 'me',
    mediaType: 'image',
    caption: 'coffee date ☕',
    isSaved: true,
    streak: true
  },
  {
    id: 'm2',
    type: 'snap',
    date: '2024-11-19',
    timestamp: 1732032000000,
    sender: 'me',
    recipient: 'jake_thompson',
    mediaType: 'video',
    caption: 'game night!',
    duration: 15,
    isSaved: true,
    streak: true
  },
  {
    id: 'm3',
    type: 'story',
    date: '2024-11-18',
    timestamp: 1731945600000,
    sender: 'emma.wilson',
    mediaType: 'image',
    caption: 'sunset hike 🌄',
    isSaved: false
  },
  {
    id: 'm4',
    type: 'chat',
    date: '2024-11-17',
    timestamp: 1731859200000,
    sender: 'olivia_chen',
    recipient: 'me',
    isSaved: true
  },
  {
    id: 'm5',
    type: 'snap',
    date: '2024-11-15',
    timestamp: 1731686400000,
    sender: 'mike_rodriguez',
    recipient: 'me',
    mediaType: 'image',
    caption: 'birthday vibes 🎂',
    isSaved: true
  },
  {
    id: 'm6',
    type: 'story',
    date: '2024-11-10',
    timestamp: 1731254400000,
    sender: 'me',
    mediaType: 'video',
    caption: 'concert night',
    duration: 30,
    isSaved: true
  },
  {
    id: 'm7',
    type: 'snap',
    date: '2024-11-05',
    timestamp: 1730822400000,
    sender: 'sarah_m',
    recipient: 'me',
    mediaType: 'image',
    caption: 'halloween prep 🎃',
    isSaved: true,
    streak: true
  },
  {
    id: 'm8',
    type: 'chat',
    date: '2024-11-01',
    timestamp: 1730476800000,
    sender: 'jake_thompson',
    recipient: 'me',
    isSaved: false
  },
  {
    id: 'm9',
    type: 'snap',
    date: '2024-10-28',
    timestamp: 1730131200000,
    sender: 'olivia_chen',
    recipient: 'me',
    mediaType: 'video',
    caption: 'fall colors 🍂',
    duration: 10,
    isSaved: true,
    streak: true
  },
  {
    id: 'm10',
    type: 'story',
    date: '2024-10-20',
    timestamp: 1729440000000,
    sender: 'emma.wilson',
    mediaType: 'image',
    caption: 'new apartment tour',
    isSaved: false
  },
  {
    id: 'm11',
    type: 'snap',
    date: '2023-12-31',
    timestamp: 1704067200000,
    sender: 'me',
    recipient: 'sarah_m',
    mediaType: 'video',
    caption: 'happy new year!! 🎉',
    duration: 20,
    isSaved: true,
    streak: true
  },
  {
    id: 'm12',
    type: 'snap',
    date: '2023-06-15',
    timestamp: 1686787200000,
    sender: 'jake_thompson',
    recipient: 'me',
    mediaType: 'image',
    caption: 'graduation day 🎓',
    isSaved: true
  }
]

const chats: Chat[] = [
  {
    id: 'c1',
    friendId: 'f1',
    friendName: 'sarah_m',
    friendDisplayName: 'Sarah',
    isBestFriend: true,
    streak: 847,
    lastMessageDate: '2024-11-20',
    messageCount: 892,
    messages: [
      {
        id: 'msg1',
        sender: 'friend',
        content: 'hey! are we still on for coffee tomorrow?',
        timestamp: 1732118100000,
        date: '2024-11-20',
        type: 'text'
      },
      {
        id: 'msg2',
        sender: 'me',
        content: 'yes!! so excited to catch up ☕',
        timestamp: 1732118200000,
        date: '2024-11-20',
        type: 'text'
      },
      {
        id: 'msg3',
        sender: 'friend',
        content: 'same place as always?',
        timestamp: 1732118300000,
        date: '2024-11-20',
        type: 'text'
      },
      {
        id: 'msg4',
        sender: 'me',
        content: 'perfect 👌',
        timestamp: 1732118400000,
        date: '2024-11-20',
        type: 'text'
      }
    ]
  },
  {
    id: 'c2',
    friendId: 'f2',
    friendName: 'jake_thompson',
    friendDisplayName: 'Jake',
    isBestFriend: true,
    streak: 623,
    lastMessageDate: '2024-11-19',
    messageCount: 543,
    messages: [
      {
        id: 'msg5',
        sender: 'friend',
        content: 'game night at my place tonight?',
        timestamp: 1732031700000,
        date: '2024-11-19',
        type: 'text'
      },
      {
        id: 'msg6',
        sender: 'me',
        content: 'absolutely! what time?',
        timestamp: 1732031800000,
        date: '2024-11-19',
        type: 'text'
      },
      {
        id: 'msg7',
        sender: 'friend',
        content: 'come over around 7',
        timestamp: 1732031900000,
        date: '2024-11-19',
        type: 'text'
      }
    ]
  },
  {
    id: 'c3',
    friendId: 'f5',
    friendName: 'olivia_chen',
    friendDisplayName: 'Olivia',
    isBestFriend: true,
    streak: 412,
    lastMessageDate: '2024-11-17',
    messageCount: 678,
    messages: [
      {
        id: 'msg8',
        sender: 'me',
        content: 'how was your trip??',
        timestamp: 1731858900000,
        date: '2024-11-17',
        type: 'text'
      },
      {
        id: 'msg9',
        sender: 'friend',
        content: 'it was amazing! so much to tell you',
        timestamp: 1731859000000,
        date: '2024-11-17',
        type: 'text'
      },
      {
        id: 'msg10',
        sender: 'friend',
        content: 'we need to hang out soon',
        timestamp: 1731859100000,
        date: '2024-11-17',
        type: 'text'
      }
    ]
  }
]

const stories: Story[] = [
  {
    id: 's1',
    date: '2024-11-18',
    timestamp: 1731945600000,
    snapCount: 5,
    viewCount: 47,
    screenshotCount: 3
  },
  {
    id: 's2',
    date: '2024-11-10',
    timestamp: 1731254400000,
    snapCount: 8,
    viewCount: 89,
    screenshotCount: 7
  },
  {
    id: 's3',
    date: '2024-11-01',
    timestamp: 1730476800000,
    snapCount: 3,
    viewCount: 34,
    screenshotCount: 1
  },
  {
    id: 's4',
    date: '2024-10-31',
    timestamp: 1730390400000,
    snapCount: 12,
    viewCount: 156,
    screenshotCount: 12
  },
  {
    id: 's5',
    date: '2024-10-15',
    timestamp: 1729008000000,
    snapCount: 4,
    viewCount: 52,
    screenshotCount: 2
  }
]

const stats: ArchiveStats = {
  totalSnaps: 8934,
  totalChats: 3421,
  totalStories: 287,
  totalFriends: 156,
  dateRange: {
    start: '2019-03-15',
    end: '2024-11-20'
  },
  totalDays: 2077,
  bestStreak: 847,
  totalMediaSize: '4.2 GB'
}

const aiHighlights: AIHighlight[] = [
  {
    id: 'h1',
    category: 'relationship',
    title: 'The longest-running thread in the archive',
    description: 'You and Sarah held onto an 847 day streak starting in March 2019. The archive reads like a friendship that stayed active through multiple life phases.',
    confidence: 'high',
    relatedMemories: ['m1', 'm7', 'm11']
  },
  {
    id: 'h2',
    category: 'milestone',
    title: 'Graduation season became a memory anchor',
    description: 'June 2023 stands out as one of the archive’s clearer milestone clusters. Jake’s graduation snap was saved, revisited, and preserved like a marker of the era.',
    confidence: 'high',
    relatedMemories: ['m12']
  },
  {
    id: 'h3',
    category: 'memory',
    title: 'One conversation clearly dominated',
    description: 'Your chat with Sarah holds 892 messages, making it the busiest thread in the archive and the clearest signal of day-to-day continuity.',
    confidence: 'high',
    relatedMemories: ['m1', 'm4']
  },
  {
    id: 'h4',
    category: 'stat',
    title: 'This was a real chapter, not a throwaway app',
    description: 'Across more than five years, the archive logs 8,934 snaps, 3,421 chat messages, and 287 stories shared across 156 friends.',
    confidence: 'high'
  },
  {
    id: 'h5',
    category: 'milestone',
    title: 'Emma’s new apartment marks a late-era shift',
    description: 'In October 2024, Emma’s apartment tour shows up as one of the archive’s more obvious “new chapter” moments near the end of the timeline.',
    confidence: 'medium',
    relatedMemories: ['m10']
  },
  {
    id: 'h6',
    category: 'memory',
    title: 'Traditions are visible in the archive',
    description: 'Halloween prep photos with Sarah suggest the archive was not just random chatter; it kept recurring rituals and seasonal habits too.',
    confidence: 'medium',
    relatedMemories: ['m7']
  }
]

export { friends, memories, chats, stories, stats, aiHighlights }
