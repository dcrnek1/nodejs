import { Link } from "react-router";


export default function ErrorPage() {
  return (
    <>
    <div className="w-fit mx-auto flex flex-col gap-4 h-full justify-center items-center px-4">
      <div className="text-9xl font-semibold text-black">404</div>
      <div className="text-xl sm:text-2xl font-semibold text-center"> Oops! Looks like this page went on vacation. 🏖️</div>
      <div>Take me <Link to="/">home</Link>.</div>
    </div>
    </>
  )
}