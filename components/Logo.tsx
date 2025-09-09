import React from 'react'

interface LogoProps {
  width?: number | string
  height?: number | string
  className?: string
}

export const Logo: React.FC<LogoProps> = ({
  width = 400,
  height = 'auto',
  className = '',
}) => {
  return (
    <div className={`inline-flex items-center gap-2 ${className}`}>
      <img
        src="https://uploadthingy.s3.us-west-1.amazonaws.com/7U1p2v7EFJRh6yKibmGvHn/Black_logo_-_no_background.svg"
        alt="Bagster Logo"
        width={width}
        height={height}
        className="max-w-full"
        style={{
          filter: 'brightness(1.1) contrast(1.05)',
          letterSpacing: '0.5px'
        }}
      />
    </div>
  )
}
