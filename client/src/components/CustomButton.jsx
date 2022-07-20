import React from 'react'

export default function CustomButton({label,clickable,onClick = null}) {
  
    const className = clickable ? `text-highlight dark:text-highlight-dark hover:underline ` : 
    `text-highlight dark:text-highlight-dark cursor-default`

    return (
    <button onClick={onClick} className={className} type="button">{label}</button>
  )
}
