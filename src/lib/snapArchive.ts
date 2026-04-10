import {
  buildSnapZipIndex,
  readSnapZipEntryContent,
  type SnapZipIndex,
  type SnapZipSource,
  type SnapZipEntryMeta,
} from './snapZip'
import {
  type ArchiveMetadata,
  type Account,
  type FriendsJson,
} from '../types'

export interface ArchiveSession {
  index: SnapZipIndex
  reader: SnapchatArchiveReader
  metadata: ArchiveMetadata
}

export type ArchiveProgressCallback = (progress: number, status: string) => void

export const SNAP_JSON_PATHS = {
  account: 'json/account.json',
  friends: 'json/friends.json',
  chatHistory: 'json/chat_history.json',
  snapHistory: 'json/snap_history.json',
  memoriesHistory: 'json/memories_history.json',
  storyHistory: 'json/story_history.json',
}

export class SnapchatArchiveReader {
  readonly index: SnapZipIndex

  constructor(index: SnapZipIndex) {
    this.index = index
  }

  async readJsonFile<T>(path: string): Promise<T | null> {
    const entry = findEntryByPath(this.index, path)
    if (!entry) return null
    const content = await readSnapZipEntryContent(this.index, entry.id)
    const buffer = await normalizeContentToArrayBuffer(content)
    const text = new TextDecoder('utf-8').decode(buffer)
    return JSON.parse(text) as T
  }
}

export async function createArchiveSession(
  files: File[],
  onProgress?: ArchiveProgressCallback,
): Promise<ArchiveSession> {
  if (!files.length) {
    throw new Error('No archive files selected')
  }

  onProgress?.(5, files.length === 1 ? `Indexing ${files[0].name}` : 'Indexing zip files')
  const sources: SnapZipSource[] = files.map((file, index) => ({ id: `source-${index}`, file }))
  const index = await buildSnapZipIndex(sources)

  onProgress?.(30, 'Reading account metadata')
  const reader = new SnapchatArchiveReader(index)
  const account = await reader.readJsonFile<Account>(SNAP_JSON_PATHS.account)

  onProgress?.(55, 'Reading friends list')
  const friendsJson = await reader.readJsonFile<FriendsJson>(SNAP_JSON_PATHS.friends)
  const friends = friendsJson?.Friends ?? []

  const metadata: ArchiveMetadata = {
    account: account ?? null,
    friends,
    stats: {
      friendCount: friends.length,
      hasChatHistory: Boolean(findEntryByPath(index, SNAP_JSON_PATHS.chatHistory)),
      hasSnapHistory: Boolean(findEntryByPath(index, SNAP_JSON_PATHS.snapHistory)),
      hasMemoriesHistory: Boolean(findEntryByPath(index, SNAP_JSON_PATHS.memoriesHistory)),
      hasStoryHistory: Boolean(findEntryByPath(index, SNAP_JSON_PATHS.storyHistory)),
    },
  }

  onProgress?.(80, 'Preparing archive session')

  return {
    index,
    reader,
    metadata,
  }
}

function findEntryByPath(index: SnapZipIndex, path: string): SnapZipEntryMeta | undefined {
  return index.entries.find((entry) => entry.id.path === path)
}

async function normalizeContentToArrayBuffer(
  content: ArrayBuffer | ReadableStream<Uint8Array>,
): Promise<ArrayBuffer> {
  if (content instanceof ArrayBuffer) {
    return content
  }

  const response = new Response(content)
  return response.arrayBuffer()
}
