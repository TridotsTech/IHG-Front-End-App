import { useState } from 'react';

const TypesensSearch = () => {

    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);

    const handleSearch = async () => {
        const response = await fetch(`/api/search?query=${query}`);
        const data = await response.json();
        setResults(data.hits || []);
    };

    return (
        <div>
            <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search..."
            />
            <button onClick={handleSearch}>Search</button>

            <ul>
                {results.map((result) => (
                    <li key={result.id}>
                        <strong>{result.title}</strong>
                        <p>{result.description}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default TypesensSearch





