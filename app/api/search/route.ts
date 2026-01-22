import { NextRequest, NextResponse } from 'next/server'

// Simple AI-powered search using semantic matching
// In production, you'd use a service like AWS Kendra, Algolia, or OpenAI embeddings

interface SearchContent {
  id: string
  title: string
  content: string
  url: string
  keywords: string[]
}

// Content database - in production, this would come from a database or CMS
const contentDatabase: SearchContent[] = [
  {
    id: 'about',
    title: 'About Fighting Monk',
    content: 'Fighting Monk is a full-service commercial, film, and video content production company based in Austin and New York. Our first film production "Lemonade" was a project by and about those affected by layoffs during the great recession.',
    url: '#about',
    keywords: ['about', 'company', 'production', 'film', 'video', 'commercial', 'austin', 'new york', 'lemonade'],
  },
  {
    id: 'team',
    title: 'Our Team',
    content: 'Meet the talented team behind Fighting Monk. Our team includes experienced directors, producers, and creatives.',
    url: '#team',
    keywords: ['team', 'people', 'staff', 'directors', 'producers', 'creatives', 'ira brooks', 'paul raila', 'sara'],
  },
  {
    id: 'work',
    title: 'Our Work',
    content: 'We create international, award-winning advertising campaigns, feature films, and social good projects for partners of all sizes.',
    url: '#work',
    keywords: ['work', 'projects', 'campaigns', 'films', 'advertising', 'awards', 'portfolio'],
  },
  {
    id: 'directors',
    title: 'Directors',
    content: 'Our directors bring years of experience in commercial and film production.',
    url: '#directors',
    keywords: ['directors', 'filmmaking', 'production', 'commercial'],
  },
  {
    id: 'contact',
    title: 'Contact Us',
    content: 'Get in touch with Fighting Monk for your next project.',
    url: '#contact',
    keywords: ['contact', 'email', 'phone', 'reach out', 'get in touch'],
  },
]

function calculateRelevance(query: string, content: SearchContent): number {
  const queryLower = query.toLowerCase()
  const titleLower = content.title.toLowerCase()
  const contentLower = content.content.toLowerCase()
  
  let score = 0
  
  // Exact title match gets highest score
  if (titleLower.includes(queryLower)) {
    score += 10
  }
  
  // Content match
  if (contentLower.includes(queryLower)) {
    score += 5
  }
  
  // Keyword matching
  content.keywords.forEach(keyword => {
    if (queryLower.includes(keyword.toLowerCase()) || keyword.toLowerCase().includes(queryLower)) {
      score += 3
    }
  })
  
  // Word-by-word matching
  const queryWords = queryLower.split(/\s+/).filter(w => w.length > 2)
  queryWords.forEach(word => {
    if (titleLower.includes(word)) score += 2
    if (contentLower.includes(word)) score += 1
    if (content.keywords.some(k => k.toLowerCase().includes(word))) score += 1.5
  })
  
  return score
}

export async function POST(request: NextRequest) {
  try {
    const { query } = await request.json()
    
    if (!query || typeof query !== 'string') {
      return NextResponse.json(
        { error: 'Query is required' },
        { status: 400 }
      )
    }
    
    // Calculate relevance scores
    const scoredResults = contentDatabase.map(content => ({
      ...content,
      score: calculateRelevance(query, content),
    }))
    
    // Filter and sort by relevance
    const results = scoredResults
      .filter(item => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 10)
      .map(({ score, ...rest }) => rest)
    
    return NextResponse.json({ results })
  } catch (error) {
    console.error('Search error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
