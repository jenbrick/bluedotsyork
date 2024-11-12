import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';

export default function Home() {
  const [items, setItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchItems();
  }, [searchTerm]);

  const fetchItems = async () => {
    let { data, error } = await supabase
      .from('items')
      .select('*')
      .ilike('name', `%${searchTerm}%`);

    if (error) {
      console.error('Error fetching data:', error.message);
    } else {
      setItems(data);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Supabase Search App</h1>
      <input
        type="text"
        placeholder="Search items..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{ padding: '10px', width: '100%', marginBottom: '20px' }}
      />
      <ul>
        {items.length > 0 ? (
          items.map((item) => (
            <li key={item.id} style={{ marginBottom: '10px' }}>
              <strong>{item.name}</strong>: {item.description}
            </li>
          ))
        ) : (
          <p>No items found</p>
        )}
      </ul>
    </div>
  );
}
