"use client";

import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import '@fortawesome/fontawesome-free/css/all.min.css';

export default function Home() {
  const [items, setItems] = useState<
    Array<{ id: string; name: string; website: string | null; category: string | null; rank: number | null }>
  >([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>('');

  useEffect(() => {
    const fetchItems = async () => {
      setLoading(true);
      let query = supabase.from('proDemBusinesses').select('*').order('name', { ascending: true });

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

  // Function to get the icon based on the rank
  const getIcon = (rank: number | null) => {
    if (rank === -2 || rank === -1) {
      return <i className="fa-solid fa-circle-xmark icon-red"></i>;
    }
    if (rank === 1) {
      return <i className="fa-solid fa-circle-check icon-blue"></i>;
    }
    return <i className="fa-solid fa-circle-question icon-grey"></i>;
  };

  return (
    <div className="container">
      <h1>Business Directory</h1>

      <div className="content-wrapper">
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
                      <td data-label="Name" className="name-cell">
                        {getIcon(item.rank)}
                        <span className="business-name">{item.name}</span>
                      </td>
                      <td data-label="Website">
                        {item.website ? (
                          <a href={item.website} target="_blank" rel="noopener noreferrer">
                            Hello Mama
                          </a>
                        ) : (
                          'N/A'
                        )}
                      </td>
                      <td data-label="Category">{item.category ?? 'N/A'}</td>
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
    </div>
  );
}
