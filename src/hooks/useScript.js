import { useEffect } from 'react'

// Borrowed from 
// https://github.com/bubbaspaarx/react-cloudinary-upload-widget/blob/master/src/_hooks_/useScript.js
const useScript = (url) => {
  useEffect(() => {
    const script = document.createElement('script')

    script.type = 'text/javascript'
    script.src = url
    script.async = true

    document.body.appendChild(script)

    return () => {
      document.body.removeChild(script)
    }
  }, [url])
}

export {
   useScript
}