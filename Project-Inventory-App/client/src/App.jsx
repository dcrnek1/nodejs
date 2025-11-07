import { toast } from "sonner";

function App() {
  return (
    <div className="px-2 max-w-8xl w-full mx-auto">
      <button
        onClick={() =>
          toast.success("This is title", {
            duration: Infinity,
            description: "This is description of a success toast.",
          })
        }
      >
        Success
      </button>
      <br></br><button
        onClick={() =>
          toast.error("This is title", {
            duration: Infinity,
            description: "This is description of a success toast.",
          })
        }
      >
        error
      </button>
      <br></br>
      <button
        onClick={() =>
          toast.info("This is title", {
            duration: Infinity,
            description: "This is description of a success toast.",
          })
        }
      >
        info
      </button>
      <br></br>
      <button
        onClick={() =>
          toast.warning("This is title", {
            duration: Infinity,
            description: "This is description of a success toast.",
          })
        }
      >
        warning
      </button>
      <br></br>
      <button
        onClick={() =>
          toast.loading("This is title", {
            duration: Infinity,
            description: "This is description of a success toast.",
          })
        }
      >
        Loading
      </button>
      <br></br>
      <button
        className="toast-button"
        onClick={() => {
          const myPromise = new Promise((resolve) => {
            setTimeout(() => {
              resolve({ name: "My toast" });
            }, 3000);
          });

          toast.promise(myPromise, {
            loading: "Loading...",
            success: (data) => {
              return {
                message: `${data.name} toast has been added`,
                description: "Custom description for the success state",
              };
            },
            error: "Error",
          });
        }}
      >
        Promise
      </button>
    </div>
  );
}

export default App;
