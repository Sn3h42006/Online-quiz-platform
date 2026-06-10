'use client'

export function useToast() {
  return {
    toast: (props: {
      title?: string
      description?: string
      variant?: 'default' | 'destructive'
    }) => {
      // Simple browser notification
      const message = `${props.title || ''}${props.description ? ': ' + props.description : ''}`
      if (typeof window !== 'undefined') {
        console.log('[Toast]', message)
      }
    },
  }
}
