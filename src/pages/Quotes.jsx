import { useEffect, useState } from "react";
import { getQuotes, getRandomQuote } from "../api/quotes";

function Quotes() {
  const [quotes, setQuotes] = useState([]);
  const [random, setRandom] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const data = await getQuotes();
      setQuotes(data.quotes || []);
      setLoading(false);
    };
    load();
  }, []);

  const loadRandom = async () => {
    const data = await getRandomQuote();
    setRandom(data);
  };

  return (
    <div>
      <div className="page-header">
        <h2 className="section-title">Quotes</h2>
        <button onClick={loadRandom}>Random quote</button>
      </div>
      {loading && <div className="loading">Loading quotes...</div>}
      {random ? (
        <div className="card">
          <h3>{random.quote}</h3>
          <div>{random.author}</div>
        </div>
      ) : null}
      <div className="grid grid-3">
        {quotes.map((quote) => (
          <div key={quote.id} className="card list-item">
            <div>{quote.quote}</div>
            <div><strong>{quote.author}</strong></div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Quotes;
