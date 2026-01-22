'use client'

import { useState, useCallback } from 'react'
import styles from './Search.module.css'

interface SearchResult {
  id: string
  title: string
  content: string
  url: string
}

export default function Search() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSearch = useCallback(async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([])
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      // Call API route for AI-powered search
      const response = await fetch('/api/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query: searchQuery }),
      })

      if (!response.ok) {
        throw new Error('Search failed')
      }

      const data = await response.json()
      setResults(data.results || [])
    } catch (err) {
      setError('Failed to perform search. Please try again.')
      setResults([])
    } finally {
      setIsLoading(false)
    }
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    handleSearch(query)
  }

  return (
    <div className={styles.searchContainer}>
      <form onSubmit={handleSubmit} className={styles.searchForm}>
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value)
            // Debounced search could be added here
          }}
          placeholder="Search for content, team members, work..."
          className={styles.searchInput}
        />
        <button type="submit" className={styles.searchButton} disabled={isLoading}>
          {isLoading ? 'Searching...' : 'Search'}
        </button>
      </form>

      {error && <div className={styles.error}>{error}</div>}

      {results.length > 0 && (
        <div className={styles.results}>
          <h3 className={styles.resultsTitle}>Search Results</h3>
          <ul className={styles.resultsList}>
            {results.map((result) => (
              <li key={result.id} className={styles.resultItem}>
                <a href={result.url} className={styles.resultLink}>
                  <h4 className={styles.resultTitle}>{result.title}</h4>
                  <p className={styles.resultContent}>{result.content}</p>
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}

      {query && results.length === 0 && !isLoading && !error && (
        <div className={styles.noResults}>No results found for "{query}"</div>
      )}
    </div>
  )
}
