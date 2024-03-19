import React from 'react'
import Image, { StaticImageData } from 'next/image'

interface IconType {
  className?: string;
  styleObject?: React.CSSProperties;
  imgSrc: StaticImageData;
  alt?: string;
  width?: number;
  height?: number;
}
export function Icon({ className, styleObject, imgSrc, alt = "icon", width = 100, height = 100 }: IconType) {
  return (
    <Image alt={alt} className={className} style={styleObject} src={imgSrc} width={width} height={height} />
  )
}
