"use client";

import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import '@fortawesome/fontawesome-free/css/all.min.css';
import { FaGlobe } from 'react-icons/fa';

interface BusinessItem {
  id: string;
  name: string;
  website: string | null;
  category: string | null;
  subcategory: string | null;
  status: number | null;
}

export default function Home() {
  const [items, setItems] = useState<BusinessItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingMessage, setLoadingMessage] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [searchFilter, setSearchFilter] = useState<string>('name');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>('');
  const [categories, setCategories] = useState<string[]>([]);
  const [subcategories, setSubcategories] = useState<string[]>([]);
  const [categoryMap, setCategoryMap] = useState<Record<string, string[]>>({});
  const [cache, setCache] = useState<Record<string, BusinessItem[]>>({});
  const [showInfoBanner, setShowInfoBanner] = useState<boolean>(false);

  // Fetch categories and subcategories from the API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/categories');
        const data = await response.json();
        setCategoryMap(data);
        setCategories(Object.keys(data));
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };
    fetchCategories();
  }, []);

  // Update subcategories when selectedCategory changes
  useEffect(() => {
    if (selectedCategory && categoryMap[selectedCategory]) {
      setSubcategories(categoryMap[selectedCategory]);
    } else {
      setSubcategories([]);
    }
  }, [selectedCategory, categoryMap]);

  // Fetch items based on filters and cache
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      const cacheKey = `${selectedCategory || 'all'}-${selectedSubcategory || 'all'}`;
      if (cache[cacheKey]) {
        setItems(cache[cacheKey]);
        setLoading(false);
        setLoadingMessage('');
        return;
      }

      let query = supabase
        .from('blueDotsBizTable')
        .select('id, name, website, category, subcategory, status')
        .order('name', { ascending: true });

      if (searchTerm.trim() !== '') {
        if (searchFilter === 'all') {
          query = query.or(
            `name.ilike.%${searchTerm}%,website.ilike.%${searchTerm}%,category.ilike.%${searchTerm}%,subcategory.ilike.%${searchTerm}%`
          );
        } else {
          query = query.ilike(searchFilter, `%${searchTerm}%`);
        }
      }

      if (selectedCategory) {
        query = query.eq('category', selectedCategory);
      }

      if (selectedSubcategory) {
        query = query.eq('subcategory', selectedSubcategory);
      }

      setLoadingMessage('Fetching data from server...');
      const { data, error } = await query.limit(100);
      if (error) {
        console.error('Error fetching data:', error.message);
        setLoadingMessage('Error fetching data.');
      } else {
        setItems(data ?? []);
        setCache((prevCache) => ({
          ...prevCache,
          [cacheKey]: data ?? [],
        }));
        setLoadingMessage('');
      }
      setLoading(false);
    };

    fetchData();
  }, [selectedCategory, selectedSubcategory, searchTerm, searchFilter]);

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setSelectedCategory(value);
    setSelectedSubcategory('');
    setLoadingMessage('Loading...');

    if (value === '') {
      setSubcategories([]);
      setLoadingMessage('Loading all items...');
    } else {
      setSubcategories(categoryMap[value] || []);
      setLoadingMessage(`Loading items for ${value}...`);
    }
  };

  const handleSubcategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setSelectedSubcategory(value);

    setCache((prevCache) => {
      const newCache = { ...prevCache };
      delete newCache[`${selectedCategory || 'all'}-${selectedSubcategory || 'all'}`];
      return newCache;
    });

    setLoadingMessage('Loading items for selected subcategory...');
  };

  const getIcon = (status: number | null) => {
    if (status === 0) return <i className="fa-solid fa-circle icon-blue"></i>;
    if (status === 1) return <i className="fa-solid fa-circle-check icon-blue"></i>;
    return <i className="fa-solid fa-circle icon-blue"></i>;
  };

  const renderWebsiteLink = (website: string | null) => {
    if (!website) return 'N/A';
    return (
      <a href={website} target="_blank" rel="noopener noreferrer" aria-label="Visit Website">
        <FaGlobe size={20} style={{ color: '#007bff', cursor: 'pointer' }} />
      </a>
    );
  };

  return (
    <div className="container">
      {/* Info Banner */}
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
              Welcome to the <strong>Blue Dots York County - Business Directory</strong>. A growing directory that features a curated list of businesses known
              to promote equality, uphold human rights, and foster inclusivity.
            </p>
            <ul>
              <li><strong>Search:</strong> Use the search bar to find businesses by name, website, category, or subcategory.</li>
              <li><strong>Filter:</strong> Use the dropdown menus to refine your search by specific categories and subcategories.</li>
              <li><strong>Icons:</strong> Each business has an icon indicating recommended and verified:
                <ul>
                  <li><i className="fa-solid fa-circle icon-blue"></i> Member Recommended</li>
                  <li><i className="fa-solid fa-circle-check icon-blue"></i> Verified by Blue Dots of York County</li>
                </ul>
              </li>
            </ul>
          </div>
        )}
      </div>

      <h1 className="directory-title">Blue Dots York County - Business Directory</h1>

      <div className="dropdowns-container">
        <div className="search-controls">
          <label htmlFor="search-filter">Search by</label>
          <select id="search-filter" value={searchFilter} onChange={(e) => setSearchFilter(e.target.value)}>
            <option value="name">Name</option>
            <option value="website">Website</option>
            <option value="category">Category</option>
            <option value="subcategory">Subcategory</option>
            <option value="all">All Fields</option>
          </select>
        </div>

        <div className="search-controls">
          <label htmlFor="category-filter">Category</label>
          <select id="category-filter" value={selectedCategory} onChange={handleCategoryChange}>
            <option value="">All Categories</option>
            {categories.map((category) => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>

        <div className="search-controls">
          <label htmlFor="subcategory-filter">Subcategory</label>
          <select id="subcategory-filter" value={selectedSubcategory} onChange={handleSubcategoryChange} disabled={!selectedCategory}>
            <option value="">All Subcategories</option>
            {subcategories.map((subcategory) => (
              <option key={subcategory} value={subcategory}>{subcategory}</option>
            ))}
          </select>
        </div>
      </div>

      {loading ? <p>{loadingMessage}</p> : (
        <div className="styled-table-wrapper">
          <table className="styled-table">
            <thead>
              <tr>
                <th>Status</th>
                <th>Name</th>
                <th>Website</th>
                <th>Category</th>
                <th>Subcategory</th>
              </tr>
            </thead>
            <tbody>
              {items.length > 0 ? (
                items.map((item) => (
                  <tr key={item.id}>
                    <td>{getIcon(item.status)}</td>
                    <td>{item.website ? <a href={item.website} target="_blank" rel="noopener noreferrer">{item.name}</a> : item.name}</td>
                    <td>{renderWebsiteLink(item.website)}</td>
                    <td>{item.category ?? 'N/A'}</td>
                    <td>{item.subcategory ?? 'N/A'}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} style={{ textAlign: 'center' }}>No items found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
