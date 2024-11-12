// app/page.tsx
"use client";

import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

export default function Home() {
  const [items, setItems] = useState<Array<{ id: string; name: string; description: string }>>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  // Fetch data whenever the searchTerm changes
  useEffect(() => {
    const fetchItems = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('proDemBusinesses')
        .select('*')
        .ilike('name', `%${searchTerm}%`);

      if (error) {
        console.error('Error fetching data:', error.message);
      } else {
        setItems(data ?? []);
      }
      setLoading(false);
    };

    fetchItems();
  }, [searchTerm]);

  return (
    <div className="container">
      <h1>Supabase Search App</h1>
      <input
        type="text"
        placeholder="Search items..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="search-input"
      />
      {loading ? (
        <p>Loading...</p>
      ) : (
        <ul>
          {items.length > 0 ? (
            items.map((item) => (
              <li key={item.id} className="item">
                <strong>{item.name}</strong>: {item.description}
              </li>
            ))
          ) : (
            <p>No items found</p>
          )}
        </ul>
      )}
    </div>
  );
}
