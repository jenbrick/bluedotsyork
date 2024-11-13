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
      <h1>Business Directory</h1>

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
        <div className="styled-table-wrapper">
          <table className="styled-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Website</th>
                <th>Category</th>
              </tr>
            </thead>
            <tbody>
              {items.length > 0 ? (
                items.map((item) => (
                  <tr key={item.id}>
                    <td>{item.name}</td>
                    <td>
                      {item.website ? (
                        <a href={item.website} target="_blank" rel="noopener noreferrer">
                          {item.website}
                        </a>
                      ) : (
                        'N/A'
                      )}
                    </td>
                    <td>{item.category ?? 'N/A'}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={3} style={{ textAlign: 'center' }}>
                    No items found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
