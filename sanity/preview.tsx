import { DefaultDocumentNodeResolver } from 'sanity/desk'

// Simple preview component
const BlogPreviewComponent = (props: any) => {
  const { document } = props
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3001'
  const previewUrl = `${baseUrl}/studio/preview/blog?id=${document.displayed._id}`
  
  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h3 style={{ marginBottom: '16px' }}>Blog Post Preview</h3>
      <p style={{ marginBottom: '16px', color: '#666' }}>
        Click the button below to open the preview in a new tab
      </p>
      <button
        onClick={() => window.open(previewUrl, '_blank')}
        style={{
          padding: '8px 16px',
          backgroundColor: '#0066cc',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          fontSize: '14px'
        }}
      >
        Open Preview
      </button>
    </div>
  )
}

// Default document node resolver
export const defaultDocumentNode: DefaultDocumentNodeResolver = (S, { schemaType }) => {
  // Only add preview pane for blog posts
  if (schemaType === 'blogPost') {
    return S.document().views([
      S.view.form(),
      S.view
        .component(BlogPreviewComponent)
        .title('Preview'),
    ])
  }

  return S.document().views([S.view.form()])
}