import React from 'react'

interface LogoProps {
  width?: number
  height?: number
  color?: 'blue' | 'white' | 'black'
  className?: string
}

export default function Logo({ 
  width = 160, 
  height = 40, 
  color = 'blue',
  className = '' 
}: LogoProps) {
  const getColor = () => {
    switch (color) {
      case 'white':
        return '#ffffff'
      case 'black':
        return '#000000'
      case 'blue':
      default:
        return '#1e40af'
    }
  }

  const fillColor = getColor()

  return (
    <div className={`${className}`} style={{ height }}>
      <svg 
        className="w-full h-full" 
        viewBox="0 0 1000 400" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Luggage Icon Group */}
        <g transform="translate(50, 80)">
          {/* Main Suitcase */}
          <rect 
            x="0" 
            y="40" 
            width="80" 
            height="120" 
            rx="8" 
            ry="8" 
            stroke={fillColor} 
            strokeWidth="4" 
            fill="none"
          />
          
          {/* Suitcase Handle */}
          <rect 
            x="20" 
            y="20" 
            width="40" 
            height="25" 
            rx="4" 
            ry="4" 
            stroke={fillColor} 
            strokeWidth="4" 
            fill="none"
          />
          
          {/* Suitcase Details */}
          <rect x="15" y="80" width="50" height="15" rx="2" ry="2" fill={fillColor}/>
          <circle cx="25" cy="110" r="4" fill={fillColor}/>
          <circle cx="55" cy="110" r="4" fill={fillColor}/>
          <circle cx="25" cy="130" r="4" fill={fillColor}/>
          <circle cx="55" cy="130" r="4" fill={fillColor}/>
          
          {/* Second Suitcase */}
          <rect 
            x="70" 
            y="60" 
            width="60" 
            height="100" 
            rx="6" 
            ry="6" 
            stroke={fillColor} 
            strokeWidth="4" 
            fill="none"
          />
          <rect 
            x="85" 
            y="45" 
            width="30" 
            height="20" 
            rx="3" 
            ry="3" 
            stroke={fillColor} 
            strokeWidth="4" 
            fill="none"
          />
          
          {/* Second Suitcase Details */}
          <rect x="80" y="90" width="40" height="8" rx="1" ry="1" fill={fillColor}/>
          <circle cx="90" cy="120" r="3" fill={fillColor}/>
          <circle cx="110" cy="120" r="3" fill={fillColor}/>
          
          {/* Airplane */}
          <path 
            d="M20 20 L40 30 L50 20 L60 30 L40 40 L30 50 L20 40 Z" 
            stroke={fillColor} 
            strokeWidth="3" 
            fill="none"
          />
          
          {/* Airplane Trail */}
          <path 
            d="M60 30 Q90 20 120 40" 
            stroke={fillColor} 
            strokeWidth="3" 
            fill="none" 
            strokeDasharray="6,3"
          />
        </g>
        
        {/* Bagster Text */}
        <g transform="translate(300, 80)">
          {/* B */}
          <path d="M0 0 L0 240 L120 240 Q165 240 165 195 Q165 150 120 150 L120 150 Q150 150 150 105 Q150 60 105 60 L0 60 Z M45 105 L105 105 Q120 105 120 127.5 Q120 150 105 150 L45 150 Z M45 60 L90 60 Q105 60 105 82.5 Q105 105 90 105 L45 105 Z" fill={fillColor}/>
          
          {/* a */}
          <path d="M210 90 Q255 75 300 90 Q330 105 330 150 L330 240 L285 240 L285 225 Q270 240 240 240 Q195 240 195 195 Q195 150 240 150 L285 150 L285 135 Q285 120 255 120 Q225 120 210 135 Z M240 195 Q255 195 270 187.5 Q285 180 285 165 L285 180 L255 180 Q240 180 240 195 Z" fill={fillColor}/>
          
          {/* g */}
          <path d="M375 90 Q420 75 465 90 Q495 105 495 150 L495 285 Q495 330 450 330 Q405 330 375 315 L375 285 Q390 300 435 300 Q450 300 450 285 L450 255 Q435 270 405 270 Q360 270 360 225 Q360 180 405 180 Q435 180 450 195 L450 150 Q450 135 420 135 Q390 135 375 150 Z M405 225 Q420 225 435 217.5 Q450 210 450 195 L450 210 Q450 225 435 225 Q420 225 405 225 Z" fill={fillColor}/>
          
          {/* s */}
          <path d="M540 105 Q555 90 585 90 Q630 90 645 120 L615 135 Q607.5 120 585 120 Q570 120 555 127.5 Q540 135 540 150 Q540 165 555 172.5 Q570 180 600 180 Q645 180 660 210 Q660 240 615 240 Q555 240 540 210 L570 195 Q577.5 210 600 210 Q615 210 630 202.5 Q645 195 645 180 Q645 165 630 157.5 Q615 150 585 150 Q540 150 540 127.5 Q540 105 540 105 Z" fill={fillColor}/>
          
          {/* t */}
          <path d="M705 45 L705 90 L750 90 L750 120 L705 120 L705 195 Q705 210 720 210 L750 210 L750 240 L705 240 Q660 240 660 195 L660 120 L630 120 L630 90 L660 90 L660 45 Z" fill={fillColor}/>
          
          {/* e */}
          <path d="M795 90 Q840 75 885 90 Q915 105 915 150 Q915 165 900 165 L840 165 Q840 180 855 187.5 Q870 195 885 195 Q915 195 930 180 L945 210 Q930 225 900 232.5 Q870 240 840 240 Q795 240 795 195 Q795 150 840 150 Q885 150 885 135 Q885 120 855 120 Q825 120 795 135 Z M840 150 L870 150 Q870 135 855 135 Q840 135 840 150 Z" fill={fillColor}/>
          
          {/* r */}
          <path d="M990 90 L990 240 L945 240 L945 90 L990 90 Z M990 135 Q1005 120 1035 120 Q1080 120 1095 150 L1065 165 Q1057.5 150 1035 150 Q1020 150 1005 157.5 Q990 165 990 180 Z" fill={fillColor}/>
        </g>
      </svg>
    </div>
  )
}

// Icon-only version for smaller spaces
export function LogoIcon({ 
  size = 32, 
  color = 'blue',
  className = '' 
}: { 
  size?: number
  color?: 'blue' | 'white' | 'black'
  className?: string 
}) {
  const getColor = () => {
    switch (color) {
      case 'white':
        return '#ffffff'
      case 'black':
        return '#000000'
      case 'blue':
      default:
        return '#1e40af'
    }
  }

  const fillColor = getColor()

  return (
    <div className={`${className}`} style={{ width: size, height: size }}>
      <svg 
        width={size} 
        height={size} 
        viewBox="0 0 64 64" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Main suitcase */}
        <rect 
          x="8" 
          y="20" 
          width="20" 
          height="30" 
          rx="2" 
          ry="2" 
          stroke={fillColor} 
          strokeWidth="2.5" 
          fill="none"
        />
        
        {/* Suitcase handle */}
        <rect 
          x="13" 
          y="15" 
          width="10" 
          height="6" 
          rx="1" 
          ry="1" 
          stroke={fillColor} 
          strokeWidth="2.5" 
          fill="none"
        />
        
        {/* Suitcase details */}
        <rect x="11" y="30" width="14" height="4" rx="1" ry="1" fill={fillColor}/>
        <circle cx="14" cy="38" r="1.5" fill={fillColor}/>
        <circle cx="22" cy="38" r="1.5" fill={fillColor}/>
        <circle cx="14" cy="43" r="1.5" fill={fillColor}/>
        <circle cx="22" cy="43" r="1.5" fill={fillColor}/>
        
        {/* Second smaller suitcase */}
        <rect 
          x="25" 
          y="25" 
          width="16" 
          height="25" 
          rx="2" 
          ry="2" 
          stroke={fillColor} 
          strokeWidth="2.5" 
          fill="none"
        />
        <rect 
          x="29" 
          y="21" 
          width="8" 
          height="5" 
          rx="1" 
          ry="1" 
          stroke={fillColor} 
          strokeWidth="2.5" 
          fill="none"
        />
        
        {/* Tag on second suitcase */}
        <rect x="28" y="32" width="10" height="2" rx="0.5" ry="0.5" fill={fillColor}/>
        <circle cx="31" cy="40" r="1" fill={fillColor}/>
        <circle cx="36" cy="40" r="1" fill={fillColor}/>
        
        {/* Airplane */}
        <path 
          d="M6 6 L12 9 L15 6 L18 9 L12 12 L9 15 L6 12 Z" 
          stroke={fillColor} 
          strokeWidth="2" 
          fill="none"
        />
        
        {/* Airplane trail */}
        <path 
          d="M18 9 Q26 6 34 12" 
          stroke={fillColor} 
          strokeWidth="2" 
          fill="none" 
          strokeDasharray="3,2"
        />
      </svg>
    </div>
  )
}
