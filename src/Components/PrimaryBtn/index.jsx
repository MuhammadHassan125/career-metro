import React from 'react'
import './index.scss'

const index = ({ text, onSubmit, onClick, icon, color }) => {
  return (
    <button 
    className="primary-btn"
     type='submit' 
    onSubmit={onSubmit}
    onClick={onClick}
    style={{backgroundColor: color}}
    >
      {icon ? icon : null}
      {text}
      </button>
  )
}

export default index