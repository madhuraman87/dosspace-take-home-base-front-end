import React, { ReactNode, useEffect, useState } from 'react'
import '../style/WorkspaceList.css'

export default function InlineEdit({
  childRef,
  text,
  type,
  placeholder,
  children,
  ...props
}: {
  text: string
  placeholder: string
  type: string
  children: ReactNode
  childRef: React.MutableRefObject<any>
}) {
  // Manage the state whether to show the label or the input box. By default, label will be shown.
  const [isEditing, setEditing] = useState(false)

  useEffect(() => {
    if (childRef && childRef.current && isEditing === true) {
      childRef.current.focus()
    }
  }, [isEditing, childRef])

  const handleKeyDown = (event: React.KeyboardEvent) => {
    const { key } = event
    const keys = ['Escape', 'Tab']
    const enterKey = 'Enter'
    const allKeys = [...keys, enterKey] // All keys array

    if (allKeys.indexOf(key) > -1) {
      setEditing(false)
    }
  }

  return (
    <section {...props}>
      {isEditing ? (
        <div onBlur={() => setEditing(false)} onKeyDown={(e) => handleKeyDown(e)}>
          {children}
        </div>
      ) : (
        <div onClick={() => setEditing(true)}>
          <div className="WorkspaceList__header">{text || placeholder}</div>
        </div>
      )}
    </section>
  )
}
