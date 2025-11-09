function App() {
  return (
    <div className="pb-8 max-w-8xl text-primary mx-auto">
      {/* Main Content */}
      <section className="padding-x py-6 bg-subtle flex flex-col gap-6">
        <div className="flex flex-wrap justify-between items-center border-b border-solid-border pb-6">
          <h1 className="text-nowrap">Dashboard Overview</h1>
        </div>

        {/* Example dashboard cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { title: "Total Products", value: "1,248" },
            { title: "Low Stock", value: "23" },
            { title: "Categories", value: "14" },
          ].map((card) => (
            <div
              key={card.title}
              className="bg-el-bg border border-solid-border rounded-2xl p-6 hover:bg-el-hover-bg hover:transition"
            >
              <p className="text-tertiary text-sm">{card.title}</p>
              <p className="text-3xl font-semibold text-primary mt-2">
                {card.value}
              </p>
            </div>
          ))}
        </div>
        <button className="primary ml-auto">+ Add Item</button>
        <div>{ `${import.meta.env.VITE_API_URL}/categories`}</div>
      </section>
    </div>
  );
}

export default App;
