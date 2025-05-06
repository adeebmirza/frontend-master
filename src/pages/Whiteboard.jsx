// src/pages/Whiteboard.jsx
import React from 'react'
import { Tldraw } from 'tldraw'
import 'tldraw/tldraw.css'

const Whiteboard = () => {
  return (
    <div style={{ position: 'fixed', inset: 0 }}>
      <Tldraw />
    </div>
  )
}

export default Whiteboard
