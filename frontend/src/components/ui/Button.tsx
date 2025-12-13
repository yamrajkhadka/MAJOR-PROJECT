
interface ButtonProps {
    content: String;
    className: String;
}

const ButtonScale = ({content, className}: ButtonProps) => {

  return (
        <div  className={`cursor-pointer inline-block rounded-sm bg-primary-light px-8 py-3 text-sm font-medium text-white transition hover:scale-110 hover:shadow-xl ${className}`}>
  {content}
</div>
  )
}

export const ButtonFill = ({content, className}: ButtonProps) => {

  return (
        <button
  className={`px-6 py-2 rounded-full border-2 border-primary 
    text-white 
    transition-all duration-300 
    hover:bg-primary-light font-semibold hover:text-white ${className}`}
>
{content}</button>

  )
}

export default ButtonScale