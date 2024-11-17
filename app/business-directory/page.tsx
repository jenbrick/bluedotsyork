"use client";

import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import '@fortawesome/fontawesome-free/css/all.min.css';

interface BusinessItem {
  id: string;
  name: string;
  website: string | null;
  category: string | null;
  rank: number | null;
}

export default function Home() {
  const [items, setItems] = useState<BusinessItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [searchFilter, setSearchFilter] = useState<string>('name');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [showInfoBanner, setShowInfoBanner] = useState<boolean>(false);

  const categories: string[] = ['Food and Drink', 'Goods and Services', 'Realtors'];

  useEffect(() => {
    const fetchItems = async () => {
      setLoading(true);

      let query = supabase.from('proDemBusinesses').select('*').order('name', { ascending: true });

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

      if (selectedCategory) {
        query = query.eq('category', selectedCategory);
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
  }, [searchTerm, searchFilter, selectedCategory]);

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
{/* Clickable Info Banner */}
<div
  className={`info-banner ${showInfoBanner ? 'expanded' : ''}`}
  onClick={() => setShowInfoBanner(!showInfoBanner)}
>
  <div className="info-banner-overlay">
    <span>ℹ️ About This Directory</span>
  </div>
  {showInfoBanner && (
    <div className="info-content">
      <p>
        Welcome to the <strong>Blue Dots York - Business Directory</strong>. A growing directory that features a curated list of businesses known
        to promote equality, uphold human rights, and foster inclusivity.
      </p>
      <ul>
        <li><strong>Search:</strong> Use the search bar to find businesses by name, website, or category.</li>
        <li><strong>Filter:</strong> Use the dropdown menus to refine your search by specific categories (e.g., Food and Drink, Goods and Services, Realtors).</li>
        <li><strong>Status Icons:</strong> Each business has a status icon indicating its standing:
          <ul>
            <li><i className="fa-solid fa-circle-check icon-blue"></i> Verified: Actively supports community values.</li>
            <li><i className="fa-solid fa-circle-question icon-grey"></i> Unverified: Pending further verification.</li>
            <li><i className="fa-solid fa-circle-xmark icon-red"></i> Not Recommended: Does not meet our standards.</li>
          </ul>
        </li>
      </ul>
    </div>
  )}
</div>
      <h1 className="directory-title">
        Blue Dots York - Business Directory
      </h1>

      <div className="content-wrapper">
        <div className="dropdowns-container">
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
              <option value="all">All Elements</option>
              <option value="name">Name</option>
              <option value="website">Website</option>
              <option value="category">Category</option>
            </select>
          </div>
          <div className="search-controls">
            <label htmlFor="category-filter" className="search-label">
              Filter by:
            </label>
            <select
              id="category-filter"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="category-filter-dropdown"
            >
              <option value="">All Categories</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="search-controls">
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
                  <th>Status</th>
                  <th>Name</th>
                  <th>Website</th>
                  <th>Category</th>
                </tr>
              </thead>
              <tbody>
                {items.length > 0 ? (
                  items.map((item) => (
                    <tr key={item.id}>
                      <td data-label="Status">{getIcon(item.rank)}</td>
                      <td data-label="Name" className="name-cell">
                        {item.name}
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
                    <td colSpan={4} style={{ textAlign: 'center' }}>
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
