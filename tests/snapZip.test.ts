/// <reference types="vitest" />

import { describe, it, expect } from 'vitest'
import { BlobWriter, TextReader, ZipWriter } from '@zip.js/zip.js'

import {
  buildSnapZipIndex,
  readSnapZipEntryContent,
  type SnapZipSource,
  type SnapZipEntryContent,
  type SnapZipIndex,
} from '../src/lib/snapZip'

const decoder = new TextDecoder()

describe('snapZip library', () => {
  it('indexes and reads entries from a single zip source', async () => {
    const source = await createSource('single', {
      'memories/alpha.txt': 'Alpha memory',
      'notes/info.json': '{"hello":true}',
    })

    const index = await buildSnapZipIndex([source])
    const fileEntries = index.entries.filter((entry) => !entry.isDirectory)

    expect(fileEntries.map((entry) => entry.id.path)).toEqual(
      expect.arrayContaining(['memories/alpha.txt', 'notes/info.json']),
    )

    const alphaContent = await readSnapZipEntryContent(index, {
      sourceId: source.id,
      path: 'memories/alpha.txt',
    })

    expect(await contentToString(alphaContent)).toBe('Alpha memory')

    const infoContent = await readSnapZipEntryContent(
      index,
      { sourceId: source.id, path: 'notes/info.json' },
      { asStream: true },
    )

    if (typeof ReadableStream !== 'undefined') {
      expect(isReadableStream(infoContent)).toBe(true)
    } else {
      expect(infoContent).toBeInstanceOf(ArrayBuffer)
    }
    expect(await contentToString(infoContent)).toBe('{"hello":true}')
  }, 10000)

  it('combines entries from multiple zip sources', async () => {
    const sourceA = await createSource('zip-a', {
      'a/first.txt': 'one',
    })
    const sourceB = await createSource('zip-b', {
      'b/second.txt': 'two',
      'b/third.txt': 'three',
    })

    const index = await buildSnapZipIndex([sourceA, sourceB])
    const bySource = groupPathsBySource(index)

    expect(bySource.get('zip-a')).toEqual(['a/first.txt'])
    expect(bySource.get('zip-b')).toEqual(expect.arrayContaining(['b/second.txt', 'b/third.txt']))

    const second = await readSnapZipEntryContent(index, {
      sourceId: 'zip-b',
      path: 'b/second.txt',
    })
    expect(await contentToString(second)).toBe('two')
  }, 10000)

  it('applies entry filters during indexing', async () => {
    const source = await createSource('filtered', {
      'keep/me.json': 'good',
      'drop/me.txt': 'bad',
    })

    const index = await buildSnapZipIndex([source], {
      entryFilter: (meta) => meta.id.path.endsWith('.json'),
    })

    expect(index.entries.every((entry) => entry.id.path.endsWith('.json'))).toBe(true)
    expect(index.entries.map((entry) => entry.id.path)).toEqual(['keep/me.json'])
  }, 10000)
})

async function createSource(id: string, files: Record<string, string>): Promise<SnapZipSource> {
  const writer = new ZipWriter(new BlobWriter('application/zip'))
  for (const [path, content] of Object.entries(files)) {
    await writer.add(path, new TextReader(content))
  }
  const blob = (await writer.close()) as Blob
  return { id, file: blob }
}

function groupPathsBySource(index: SnapZipIndex) {
  const map = new Map<string, string[]>()
  for (const entry of index.entries) {
    if (entry.isDirectory) continue
    const list = map.get(entry.id.sourceId) ?? []
    list.push(entry.id.path)
    map.set(entry.id.sourceId, list)
  }
  return map
}

async function contentToString(content: SnapZipEntryContent): Promise<string> {
  if (isReadableStream(content)) {
    const bytes = await readableToUint8Array(content)
    return decoder.decode(bytes)
  }
  return decoder.decode(new Uint8Array(content))
}

function isReadableStream(value: SnapZipEntryContent): value is ReadableStream<Uint8Array> {
  return typeof (value as ReadableStream).getReader === 'function'
}

async function readableToUint8Array(stream: ReadableStream<Uint8Array>): Promise<Uint8Array> {
  const reader = stream.getReader()
  const chunks: Uint8Array[] = []
  let size = 0
  while (true) {
    const { done, value } = await reader.read()
    if (done) break
    if (value) {
      chunks.push(value)
      size += value.length
    }
  }

  const merged = new Uint8Array(size)
  let offset = 0
  for (const chunk of chunks) {
    merged.set(chunk, offset)
    offset += chunk.length
  }
  return merged
}
