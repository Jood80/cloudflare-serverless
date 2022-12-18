import { useState } from "react";
import "./App.css";

const getImages = async (query: string) => {
  const url = "https://serverless.shawar-nujood.workers.dev";

  const res = await fetch(url, {
    method: "POST",
    mode: "cors",
    cache: "no-cache",
    credentials: "same-origin",
    headers: { "Content-Type": "application/json" },
    redirect: "follow",
    referrerPolicy: "no-referrer",
    body: JSON.stringify({ query }),
  });

  return res.json();
};

function App() {
  const [query, setQuery] = useState("");
  const [images, setImages] = useState([]);

  const handleSubmit = async (event: any) => {
    event.preventDefault();
    const results = await getImages(query);
    setImages(results);
    setQuery(" ");
  };


  return (
    <div className="App">
      <div className="form">
        <form onSubmit={handleSubmit}>
          <input
            type="search"
            value={query}
            placeholder="Search"
            onChange={(e) => setQuery(e.target.value)}
          />
          <input type="submit" value="Submit" />
        </form>
      </div>

      {images.length ? (
        images.map((image: any) => (
          <a key={image.id} href={image.link} target="_blank">
            <img src={image.image} />
          </a>
        ))
      ) : (
        <div>
          <a href="https://vitejs.dev" target="_blank">
            <img src="/vite.svg" className="logo" alt="Vite logo" />
          </a>
        </div>
      )}
    </div>
  );
}

export default App;
