import React from 'react'

interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
  disabled?: boolean
  backgroundColor?: string
  textColor?: string
}


export const GlobalButton = ({disabled  = false, backgroundColor = 'primary', textColor = 'white', ...rest}: Props) => {


  const style = disabled ? `` : `border-${backgroundColor} bg-${backgroundColor} text-${textColor}`
  return (
    <input
      className="w-full cursor-pointer rounded-lg border p-4 transition hover:bg-opacity-90 border-"
      {...rest}
    />
  )
}


