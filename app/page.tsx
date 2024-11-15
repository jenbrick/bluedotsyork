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
  const [searchFilter, setSearchFilter] = useState<string>('all'); // New state for filter

  useEffect(() => {
    const fetchItems = async () => {
      setLoading(true);

      // Initialize the query
      let query = supabase.from('proDemBusinesses').select('*').order('name', { ascending: true });

      // Modify the query based on the search filter
      if (searchTerm.trim() !== '') {
        if (searchFilter === 'all') {
          query = query.or(
            `name.ilike.%${searchTerm}%,website.ilike.%${searchTerm}%,category.ilike.%${searchTerm}%`
          );
        } else if (searchFilter === 'name') {
          query = query.ilike('name', `%${searchTerm}%`);
        } else if (searchFilter === 'website') {
          query = query.ilike('website', `%${searchTerm}%`);
        } else if (searchFilter === 'category') {
          query = query.ilike('category', `%${searchTerm}%`);
        }
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
  }, [searchTerm, searchFilter]);

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
        <div className="search-controls">
          <label htmlFor="search-filter" className="search-label">
            Search by:
          </label>
          <select
            id="search-filter"
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            className="search-filter-dropdown"
          >
            <option value="all">All</option>
            <option value="name">Name</option>
            <option value="website">Website</option>
            <option value="category">Category</option>
          </select>

          <input
            type="text"
            placeholder={`Search by ${searchFilter}...`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>

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
                            {item.website}
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
