import ReactModal from 'react-modal'
import React from 'react'

interface ModalRightSideProps {
  isOpen: boolean
  onRequestClose: () => void
  children: React.ReactNode
}

const customStyles = {
  content: {
    width: '40%',
    padding: '20px',
    border: 'none',
    left: 'auto',
    right: 0,
    top: 0,
    bottom: 0
  },
  overlay: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.2)'
  }
}
ReactModal.setAppElement('#root')

const ModalRightSide = ({
  isOpen,
  onRequestClose,
  children
}: ModalRightSideProps) => {
  return (
    <ReactModal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      style={customStyles}
    >
      {children}
    </ReactModal>
  )
}

export default ModalRightSide
