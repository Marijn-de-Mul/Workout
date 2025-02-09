import React, { useEffect, useState } from 'react';
import Cookies from 'js-cookie';

const RoutinesSettings = () => {
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState({ name: '', description: '', type: 'Routine', userId: '-1', routineCategories: [], exerciseCategories: [] });
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('/proxy', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            endpoint: '/api/Category',
            method: 'GET',
            authorization: Cookies.get('authToken'),
            body: null,
            contentType: 'application/json',
          }),
        });

        if (response.ok) {
          const data = await response.json();
          setCategories(data.filter(category => category.type === 'Routine'));
        } else {
          setError('Failed to fetch categories.');
        }
      } catch (error) {
        setError('Failed to fetch categories.');
      }
    };

    fetchCategories();
  }, []);

  const handleAddCategory = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch('/proxy', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          endpoint: '/api/Category',
          method: 'POST',
          authorization: Cookies.get('authToken'),
          body: newCategory,
          contentType: 'application/json',
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setCategories([...categories, data]);
        setNewCategory({ name: '', description: '', type: 'Routine', userId: '-1', routineCategories: [], exerciseCategories: [] });
      } else {
        setError('Failed to add category.');
      }
    } catch (error) {
      setError('Failed to add category.');
    }
  };

  const handleDeleteCategory = async (id) => {
    try {
      const response = await fetch('/proxy', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          endpoint: `/api/Category/${id}`,
          method: 'DELETE',
          authorization: Cookies.get('authToken'),
          body: null,
          contentType: 'application/json',
        }),
      });

      if (response.ok) {
        setCategories(categories.filter((category) => category.id !== id));
      } else {
        setError('Failed to delete category.');
      }
    } catch (error) {
      setError('Failed to delete category.');
    }
  };

  return (
    <div style={{ padding: '16px', backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)', width: '100%' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '16px', color: 'green' }}>Routines Settings</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleAddCategory} style={{ marginBottom: '16px' }}>
        <div style={{ marginBottom: '8px' }}>
          <label style={{ display: 'block', marginBottom: '4px', color: 'black' }}>Name:</label>
          <input
            type="text"
            placeholder="Enter category name"
            value={newCategory.name}
            onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
            required
            style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc', color: 'black', backgroundColor: 'white' }}
          />
        </div>
        <div style={{ marginBottom: '8px' }}>
          <label style={{ display: 'block', marginBottom: '4px', color: 'black' }}>Description:</label>
          <input
            type="text"
            placeholder="Enter category description"
            value={newCategory.description}
            onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })}
            required
            style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc', color: 'black', backgroundColor: 'white' }}
          />
        </div>
        <button type="submit" style={{ padding: '10px 20px', backgroundColor: 'green', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
          Add Category
        </button>
      </form>
      <ul style={{ listStyleType: 'none', padding: 0 }}>
        {categories.map((category) => (
          <li key={category.id} style={{ marginBottom: '8px', padding: '12px', backgroundColor: '#f9f9f9', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <p style={{ margin: 0, color: 'black' }}><strong>Name:</strong> {category.name}</p>
                <p style={{ margin: 0, color: 'black' }}><strong>Description:</strong> {category.description}</p>
              </div>
              <button onClick={() => handleDeleteCategory(category.id)} style={{ backgroundColor: 'red', color: 'white', padding: '8px 16px', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RoutinesSettings;