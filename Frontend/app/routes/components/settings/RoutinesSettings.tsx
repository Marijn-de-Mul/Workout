import React, { useEffect, useState } from 'react';
import Cookies from 'js-cookie';

const RoutinesSettings = () => {
  const [routines, setRoutines] = useState([]);
  const [categories, setCategories] = useState([]);
  const [newRoutine, setNewRoutine] = useState({ name: '', description: '', categoryId: '' });
  const [newCategory, setNewCategory] = useState({ name: '', description: '', type: 'Routine' });
  const [error, setError] = useState('');
  const [showRoutines, setShowRoutines] = useState(false);
  const [showCategories, setShowCategories] = useState(false);

  useEffect(() => {
    const fetchRoutines = async () => {
      try {
        const response = await fetch('/proxy', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            endpoint: '/api/Routine',
            method: 'GET',
            authorization: Cookies.get('authToken'),
            body: null,
            contentType: 'application/json',
          }),
        });

        if (response.ok) {
          const data = await response.json();
          const routines = data.$values ? data.$values : [];
          setRoutines(routines);
        } else {
          setError('Failed to fetch routines.');
        }
      } catch (error) {
        setError('Failed to fetch routines.');
      }
    };

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
          const categories = data.$values ? data.$values.filter(category => category.type === 'Routine') : [];
          setCategories(categories);
        } else {
          setError('Failed to fetch categories.');
        }
      } catch (error) {
        setError('Failed to fetch categories.');
      }
    };

    fetchRoutines();
    fetchCategories();
  }, []);

  const handleAddRoutine = async (event) => {
    event.preventDefault();

    const routineToAdd = {
      name: newRoutine.name,
      description: newRoutine.description,
      categoryId: parseInt(newRoutine.categoryId),
    };

    try {
      const response = await fetch('/proxy', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          endpoint: '/api/Routine',
          method: 'POST',
          authorization: Cookies.get('authToken'),
          body: routineToAdd,
          contentType: 'application/json',
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setRoutines([...routines, data]);
        setNewRoutine({ name: '', description: '', categoryId: '' });
      } else {
        setError('Failed to add routine.');
      }
    } catch (error) {
      setError('Failed to add routine.');
    }
  };

  const handleDeleteRoutine = async (id) => {
    try {
      const response = await fetch('/proxy', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          endpoint: `/api/Routine/${id}`,
          method: 'DELETE',
          authorization: Cookies.get('authToken'),
          body: null,
          contentType: 'application/json',
        }),
      });

      if (response.ok) {
        setRoutines(routines.filter((routine) => routine.id !== id));
      } else {
        setError('Failed to delete routine.');
      }
    } catch (error) {
      setError('Failed to delete routine.');
    }
  };

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
        setNewCategory({ name: '', description: '', type: 'Routine' });
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
    <div style={{ padding: '16px', backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)', width: '100%', overflowY: 'auto' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '16px', color: 'green' }}>Routines Settings</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <button onClick={() => setShowCategories(!showCategories)} style={{ padding: '10px 20px', backgroundColor: 'blue', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', width: '100%', marginBottom: '16px' }}>
        {showCategories ? 'Hide Categories' : 'Show Categories'}
      </button>

      {showCategories && (
        <div>
          <form onSubmit={handleAddCategory} style={{ marginBottom: '16px' }}>
            <div style={{ marginBottom: '8px' }}>
              <label style={{ display: 'block', marginBottom: '4px', color: 'black' }}>Category Name:</label>
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
              <label style={{ display: 'block', marginBottom: '4px', color: 'black' }}>Category Description:</label>
              <input
                type="text"
                placeholder="Enter category description"
                value={newCategory.description}
                onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })}
                required
                style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc', color: 'black', backgroundColor: 'white' }}
              />
            </div>
            <button type="submit" style={{ padding: '10px 20px', backgroundColor: 'green', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', width: '100%' }}>
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
      )}

      <button onClick={() => setShowRoutines(!showRoutines)} style={{ padding: '10px 20px', backgroundColor: 'blue', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', width: '100%', marginBottom: '16px' }}>
        {showRoutines ? 'Hide Routines' : 'Show Routines'}
      </button>

      {showRoutines && (
        <div>
          <form onSubmit={handleAddRoutine} style={{ marginBottom: '16px' }}>
            <div style={{ marginBottom: '8px' }}>
              <label style={{ display: 'block', marginBottom: '4px', color: 'black' }}>Routine Name:</label>
              <input
                type="text"
                placeholder="Enter routine name"
                value={newRoutine.name}
                onChange={(e) => setNewRoutine({ ...newRoutine, name: e.target.value })}
                required
                style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc', color: 'black', backgroundColor: 'white' }}
              />
            </div>
            <div style={{ marginBottom: '8px' }}>
              <label style={{ display: 'block', marginBottom: '4px', color: 'black' }}>Routine Description:</label>
              <input
                type="text"
                placeholder="Enter routine description"
                value={newRoutine.description}
                onChange={(e) => setNewRoutine({ ...newRoutine, description: e.target.value })}
                required
                style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc', color: 'black', backgroundColor: 'white' }}
              />
            </div>
            <div style={{ marginBottom: '8px' }}>
              <label style={{ display: 'block', marginBottom: '4px', color: 'black' }}>Category:</label>
              <select
                value={newRoutine.categoryId}
                onChange={(e) => setNewRoutine({ ...newRoutine, categoryId: e.target.value })}
                required
                style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc', color: 'black', backgroundColor: 'white' }}
              >
                <option value="" disabled>Select a category</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>{category.name}</option>
                ))}
              </select>
            </div>
            <button type="submit" style={{ padding: '10px 20px', backgroundColor: 'green', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', width: '100%' }}>
              Add Routine
            </button>
          </form>

          <ul style={{ listStyleType: 'none', padding: 0 }}>
            {routines.map((routine) => (
              <li key={routine.id} style={{ marginBottom: '8px', padding: '12px', backgroundColor: '#f9f9f9', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <p style={{ margin: 0, color: 'black' }}><strong>Name:</strong> {routine.name}</p>
                    <p style={{ margin: 0, color: 'black' }}><strong>Description:</strong> {routine.description}</p>
                  </div>
                  <button onClick={() => handleDeleteRoutine(routine.id)} style={{ backgroundColor: 'red', color: 'white', padding: '8px 16px', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default RoutinesSettings;