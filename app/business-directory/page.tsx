"use client";

import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import '@fortawesome/fontawesome-free/css/all.min.css';

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
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [searchFilter, setSearchFilter] = useState<string>('name');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>('');
  const [categories, setCategories] = useState<string[]>([]);
  const [subcategories, setSubcategories] = useState<string[]>([]);
  const [categoryMap, setCategoryMap] = useState<Record<string, string[]>>({});
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

  // Fetch items based on search filters
  const fetchItems = async () => {
    setLoading(true);

    let query = supabase
      .from('proDemBusinesses')
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

    const { data, error } = await query.limit(100);
    if (error) {
      console.error('Error fetching data:', error.message);
    } else {
      setItems(data ?? []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchItems();
  }, [searchTerm, searchFilter, selectedCategory, selectedSubcategory]);

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setSelectedCategory(value);
    setSelectedSubcategory('');

    if (value === '') {
      fetchItems();
    }
  };

  const getIcon = (status: number | null) => {
    if (status === 0) {
      return <i className="fa-solid fa-circle icon-blue"></i>;
    }
    if (status === 1) {
      return <i className="fa-solid fa-circle-check icon-blue"></i>;
    }
    return <i className="fa-solid fa-circle icon-blue"></i>;
  };

  return (
    <div className="container">
      <h1 className="directory-title">Blue Dots York - Business Directory</h1>

      <div className="dropdowns-container">
        {/* Search By Dropdown */}
        <div className="search-controls">
          <label htmlFor="search-filter" className="search-label">
            Search by
          </label>
          <select
            id="search-filter"
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            className="search-filter-dropdown"
          >
            <option value="name">Name</option>
            <option value="website">Website</option>
            <option value="category">Category</option>
            <option value="subcategory">Subcategory</option>
            <option value="all">All Fields</option>
          </select>
        </div>

        {/* Filter by Category */}
        <div className="search-controls">
          <label htmlFor="category-filter" className="search-label">
            <i className="fa-solid fa-filter"></i> Category
          </label>
          <select
            id="category-filter"
            value={selectedCategory}
            onChange={handleCategoryChange}
            className="category-filter-dropdown"
          >
            <option value="">All Categories</option>
            {categories.map((category) => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>

        {/* Filter by Subcategory */}
        <div className="search-controls">
          <label htmlFor="subcategory-filter" className="search-label">
            <i className="fa-solid fa-filter"></i> Subcategory
          </label>
          <select
            id="subcategory-filter"
            value={selectedSubcategory}
            onChange={(e) => setSelectedSubcategory(e.target.value)}
            className="subcategory-filter-dropdown"
            disabled={!selectedCategory}
          >
            <option value="">All Subcategories</option>
            {subcategories.map((subcategory) => (
              <option key={subcategory} value={subcategory}>{subcategory}</option>
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
                <th>Subcategory</th>
              </tr>
            </thead>
            <tbody>
              {items.length > 0 ? (
                items.map((item) => (
                  <tr key={item.id}>
                    <td data-label="Status">{getIcon(item.status)}</td>
                    <td data-label="Name">{item.name}</td>
                    <td data-label="Website">
                      {item.website ? (
                        <a href={item.website} target="_blank" rel="noopener noreferrer">{item.website}</a>
                      ) : 'N/A'}
                    </td>
                    <td data-label="Category">{item.category ?? 'N/A'}</td>
                    <td data-label="Subcategory">{item.subcategory ?? 'N/A'}</td>
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