import fs from 'fs'
import path from 'path'

export interface URLData {
  key: string
  url: string
  label: string
  icon?: string
}

let urlCache: URLData[] | null = null

export function getURLs(): URLData[] {
  if (urlCache) {
    return urlCache
  }

  const csvPath = path.join(process.cwd(), 'data', 'csv', 'urls.csv')
  
  try {
    const csvContent = fs.readFileSync(csvPath, 'utf-8')
    const lines = csvContent.trim().split('\n')
    
    const urls = lines.slice(1).map(line => {
      const values = line.split(',')
      const urlData: URLData = {
        key: values[0] || '',
        url: values[1] || '',
        label: values[2] || '',
        icon: values[3] || undefined
      }
      return urlData
    })
    
    urlCache = urls
    return urls
  } catch (error) {
    console.error('Failed to load URLs CSV:', error)
    return []
  }
}

export function getURL(key: string): URLData | undefined {
  const urls = getURLs()
  return urls.find(url => url.key === key)
}

export function getURLsByKeys(keys: string[]): URLData[] {
  const urls = getURLs()
  return urls.filter(url => keys.includes(url.key))
}