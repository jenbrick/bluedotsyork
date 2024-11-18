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
        .order('category', { ascending: true }) // Sort by category first
        .order('subcategory', { ascending: true }) // Then sort by subcategory
        .order('name', { ascending: true }); // Optionally, sort by name after

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
        setSubcategories([]); // Clear subcategories immediately

        if (value === '') {
            // Fetch all items when "All Categories" is selected
            fetchItems();
        } else {
            // Update subcategories based on the selected category
            setSubcategories(categoryMap[value] || []);
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
                            to promote equality, uphold human rights, foster inclusivity, and promote democracy.
                        </p>
                        <ul>
                            <li><strong>Search:</strong> Use the search bar to find businesses by name, website, category, or subcategory.</li>
                            <li><strong>Filter:</strong> Use the dropdown menus to refine your search by specific categories and subcategories.</li>
                            <li><strong>Icons:</strong> Each business has an icon indicating recommended and verified:
                                <ul>
                                    <li><i className="fa-solid fa-circle icon-blue"></i> Member Recommended</li>
                                    <li><i className="fa-solid fa-circle-check icon-blue"></i> Member Recommended and Verified by Blue Dots of York County</li>

                                </ul>
                            </li>
                        </ul>
                    </div>
                )}
            </div>

            <h1 className="directory-title">Blue Dots York County - Business Directory</h1>

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
                    <label htmlFor="category-filter" className="search-label">
                        <i className="fa-solid fa-filter"></i>
                    </label>
                </div>

                {/* Filter by Subcategory */}
                <div className="search-controls">
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
                    <label htmlFor="subcategory-filter" className="search-label">
                        <i className="fa-solid fa-filter"></i>
                    </label>
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
                                        <td data-label="Name">
                                            {item.website ? (
                                                <a
                                                    href={item.website.startsWith('http') ? item.website : `https://${item.website}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    style={{ color: '#007bff', textDecoration: 'none', cursor: 'pointer' }}
                                                >
                                                    {item.name}
                                                </a>
                                            ) : (
                                                item.name
                                            )}
                                        </td>
                                        <td data-label="Website">
                                            {item.website ? (
                                                <a
                                                    href={item.website.startsWith('http') ? item.website : `https://${item.website}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    aria-label="Visit Website"
                                                >
                                                    <i className="fa-solid fa-globe" style={{ color: '#007bff', cursor: 'pointer' }}></i>
                                                </a>
                                            ) : (
                                                'N/A'
                                            )}
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