import { Link } from "react-router";


export default function ErrorPage() {
  return (
    <>
    <div className="w-fit mx-auto flex flex-col gap-4 h-full justify-center items-center px-4 text-secondary">
      <div className="text-9xl font-semibold text-primary">404</div>
      <div className="text-xl sm:text-2xl font-regular text-center text-primary "> Oops! Looks like this page went on vacation. 🏖️</div>
      <div>Take me <Link to="/" className="text-textLink">home</Link>.</div>
    </div>
    </>
  )
}