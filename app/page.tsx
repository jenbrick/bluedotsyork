"use client";

import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

export default function Home() {
  const [items, setItems] = useState<Array<{ id: string; name: string; website: string | null; category: string | null }>>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>('');

  // Fetch items based on the search term
  useEffect(() => {
    const fetchItems = async () => {
      setLoading(true);
      let query = supabase.from('proDemBusinesses').select('*').order('name', { ascending: true });

      // Apply search filter if searchTerm is not empty
      if (searchTerm.trim() !== '') {
        query = query.ilike('name', `%${searchTerm}%`);
      }

      const { data, error } = await query.limit(100);

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
      <h1>Supabase Items List</h1>

      {/* Search Input */}
      <input
        type="text"
        placeholder="Search by name..."
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
                <strong>{item.name}</strong>: {item.website ?? 'No website available'} : {item.category}
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
