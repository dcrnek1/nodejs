import { toast } from "sonner"

function App() {

  return (
    <div className="px-2 max-w-8xl w-full mx-auto">
      <div className="w-full">Test</div>
      <button onClick={() => toast.success("test", {closeButton: true})}>Test 123</button>
    </div>
  )
}

export default App
