import React, { useState } from 'react'
import { ClipboardCopyIcon, ClipboardCheckIcon } from '@heroicons/react/solid'

const Clipboard: React.FC<{ children?: React.ReactNode; copyText: string; className?: string }> = (props) => {
  const [isCopied, setIsCopied] = useState(false)

  // This is the function we wrote earlier
  async function copyTextToClipboard() {
    if ('clipboard' in navigator) {
      return await navigator.clipboard.writeText(props.copyText)
    } else {
      return document.execCommand('copy', true, props.copyText)
    }
  }

  const handleCopyClick = () => {
    copyTextToClipboard()
      .then(() => {
        setIsCopied(true)
        setTimeout(() => {
          setIsCopied(false)
        }, 1500)
      })
      .catch((err) => {
        console.log(err)
      })
  }

  return (
    <button
      onClick={handleCopyClick}
      className={props.className ?? 'w-24 bg-blue-700 p-1 rounded shadow flex gap-1 items-center justify-between'}
    >
      <span className="text-white font-semibold">{isCopied ? 'Copied' : 'Copy'}</span>
      {isCopied ? (
        <ClipboardCheckIcon className="w-5 h-5 text-green-200/90"></ClipboardCheckIcon>
      ) : (
        <ClipboardCopyIcon className="w-5 h-5 text-white/90"></ClipboardCopyIcon>
      )}
    </button>
  )
}

export default Clipboard
