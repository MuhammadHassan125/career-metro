import React from 'react'
import { CircularProgress } from '@mui/material';

const FormBtn = ({processing, text}) => {
  return (
    <div style={{ width: '100%' }}>
    <button
      type="submit"
      disabled={processing}
      style={{
        width: '100%',
        borderRadius: '10px',
        backgroundColor: '#879aad', 
        border: 'none',
        padding: '10px 20px',
        color: 'white',
        fontSize: '14px',
        fontWeight: '500',
        cursor: processing ? 'not-allowed' : 'pointer', 
        opacity: processing ? 0.6 : 1,
        transition: 'background-color 0.3s, opacity 0.3s',
      }}
    >
      {
        processing ? <CircularProgress size={20} /> : text
      }
    </button>
  </div>
  )
}

export default FormBtn