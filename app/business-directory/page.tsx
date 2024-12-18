"use client";

import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import '@fortawesome/fontawesome-free/css/all.min.css';
import Breadcrumb from '../components/Breadcrumb'; // Adjust the path as necessary
import Cookies from "js-cookie"; // Import js-cookie for cookie handling
import { useRouter } from "next/navigation"; // Use Next.js router for URL manipulation

interface BusinessItem {
    id: string;
    name: string;
    website: string | null;
    category: string | null;
    subcategory: string | null;
    status: number | null;
    keywords: string | null;
}

export default function Home() {
    const [items, setItems] = useState<BusinessItem[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [searchFilter, setSearchFilter] = useState<string>('all');
    const [selectedCategory, setSelectedCategory] = useState<string>('');
    const [selectedSubcategory, setSelectedSubcategory] = useState<string>('');
    const [categories, setCategories] = useState<string[]>([]);
    const [subcategories, setSubcategories] = useState<string[]>([]);
    const [categoryMap, setCategoryMap] = useState<Record<string, string[]>>({});
    const [sortOption, setSortOption] = useState<string>('name'); // New state for sorting
    const [showInfoBanner, setShowInfoBanner] = useState<boolean>(false); // Show banner by default
    const router = useRouter();

    useEffect(() => {
        const rtkn = Cookies.get("accessKey");

        if (rtkn) {
            const currentUrl = new URL(window.location.href);

            if (!currentUrl.searchParams.get("rtkn")) {
                currentUrl.searchParams.set("rtkn", rtkn);
                router.replace(currentUrl.toString());
            }
        }
    }, [router]);

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

    useEffect(() => {
        if (selectedCategory && categoryMap[selectedCategory]) {
            setSubcategories(categoryMap[selectedCategory]);
        } else {
            setSubcategories([]);
        }
    }, [selectedCategory, categoryMap]);

    const fetchItems = async () => {
        setLoading(true);

        let query = supabase
            .from('blueDotsBizTable')
            .select('id, name, website, category, subcategory, status, keywords');

        if (searchTerm.trim() !== '') {
            if (searchFilter === 'all') {
                query = query.or(
                    `name.ilike.%${searchTerm}%,website.ilike.%${searchTerm}%,category.ilike.%${searchTerm}%,subcategory.ilike.%${searchTerm}%,keywords.ilike.%${searchTerm}%`
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

        if (sortOption === 'name') {
            query = query.order('name', { ascending: true });
        } else if (sortOption === 'category') {
            query = query
                .order('category', { ascending: true })
                .order('subcategory', { ascending: true });
        }

        console.log("fetching data");
        const { data, error } = await query.limit(500);
        if (error) {
            console.error('Error fetching data:', error.message);
        } else {
            setItems(data ?? []);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchItems();
    }, [searchTerm, searchFilter, selectedCategory, selectedSubcategory, sortOption]);

    const handleCategoryChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
        const value = e.target.value;

        setSelectedCategory(value);
        setSelectedSubcategory('');
        setSubcategories([]);

        if (value === '') {
            await fetchItems();
        } else {
            setSubcategories(categoryMap[value] || []);
            await fetchItems();
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

    const getPlaceholderText = (filter: string) => {
        switch (filter) {
            case 'name':
                return 'Search by Name';
            case 'keywords':
                return 'Search by Keyword';
            case 'category':
                return 'Category';
            case 'subcategory':
                return 'Subcategory';
            case 'all':
            default:
                return 'Search across Name, Keyword, Category, Subcategory';
        }
    };
    
    return (
        <div className="container">
            {/* Add Breadcrumb */}
            <Breadcrumb />
           <div className="disclaimer-banner" style={{ textAlign: 'center', padding: '20px', backgroundColor: '#f9f9f9', borderRadius: '8px' }}>
                <p style={{ marginBottom: '20px', fontSize: '12px' }}>
                    This directory is a user-recommended, evolving list based on shared values of inclusivity, equity, diversity, and democracy. It is not comprehensive, and exclusion from this list does not imply disapproval.
                    <br />
                    <a href="/business-directory/disclaimer" style={{ color: '#007bff', textDecoration: 'underline' }}>
                        Read Full Disclaimer
                    </a>
                </p>
                <button
                    className="styled-add-button"
                    onClick={() =>
                        window.location.href = "/business-directory/request-form"
                    }
                >
                    <i className="fa-solid fa-plus"></i> Request Addition
                </button>
                <button
                    className="styled-remove-button"
                    onClick={() =>
                        window.location.href = "/business-directory/remove"
                    }
                >
                    <i className="fa-solid fa-trash"></i> Request Removal
                </button>
            </div>

            {/* Info Banner */}
            <div
                className={`info-banner ${showInfoBanner ? 'expanded' : ''}`}
                onClick={() => setShowInfoBanner(!showInfoBanner)}
            >
                <div className="info-banner-overlay">
                <span>
                    ℹ️ About / Usage -  {showInfoBanner ? "🔼 Click or Tap to Collapse" : "🔽 Click or Tap to Expand"}
                </span>
                </div>
                {showInfoBanner && (
                    <div className="info-content">
                         {/* Disclaimer Banner */}
                        <ul>
                            <li><strong>Sort <i className="fa-solid fa-sort"></i>:</strong> Use the dropdown to sort businesses by name or category.</li>
                            <li><strong>Filter <i className="fa-solid fa-filter"></i>:</strong> Use the dropdowns to filter by specific categories and subcategories.</li>
                            <li><strong>Search <i className="fa-solid fa-search"></i>:</strong> Use the search bar to find businesses or organizations by name, keyword, category, or subcategory.</li>
                            <li><strong>Icons:</strong> Each business has an icon indicating recommended and verified:
                                <ul>
                                    <li><i className="fa-solid fa-circle icon-blue"></i> Member Recommended</li>
                                    <li><i className="fa-solid fa-circle-check icon-blue"></i> Member Recommended + Owner Verified</li>

                                </ul>
                            </li>
                        </ul>
                    </div>
                )}
            </div>

            <h1 className="directory-title">Blue Dots York County - Business/Organization Directory</h1>

            <div className="dropdowns-container">
                {/* Sorting Options */}
                <div className="search-controls">
                    <select
                        id="sort-option"
                        value={sortOption}
                        onChange={(e) => setSortOption(e.target.value)}
                        className="search-filter-dropdown"
                    >
                        <option value="name">Name (A-Z)</option>
                        <option value="category">Category/Subcategory</option>
                    </select>
                    <label htmlFor="sort-option" className="search-label">
                        <i className="fa-solid fa-sort"></i>
                    </label>
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
                <label htmlFor="search-input">
                    <i className="fa-solid fa-search"></i>
                </label>
                <input
                    type="text"
                    placeholder={getPlaceholderText(searchFilter)}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="search-input"
                />
            </div>
            <div className="click-biz">
                <p>*Click on business name to go to website</p>
            </div>         
            {loading ? (
                <p>Loading...</p>
            ) : (
                <div className="styled-table-wrapper">
                    <table className="styled-table">
                        <thead> 
                            <tr>
                                <th>Status</th>
                                <th>Name*</th>
                                <th>Category</th>
                                <th>Subcategory</th>
                                <th>Keywords</th>
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
                                                <a
                                                    href="https://www.google.com"
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    style={{ color: '#007bff', textDecoration: 'none', cursor: 'pointer' }}
                                                >
                                                    {item.name}
                                                </a>
                                            )}
                                        </td>
                                        <td data-label="Category">{item.category ?? 'N/A'}</td>
                                        <td data-label="Subcategory">{item.subcategory ?? 'N/A'}</td>
                                        <td data-label="Keywords">{item.keywords ?? ''}</td>
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