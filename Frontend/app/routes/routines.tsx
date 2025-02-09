import React, { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import MobileNavbar from './components/MobileNavbar';
import ProtectedRoute from './components/ProtectedRoute';

const Routines = () => {
  const [routines, setRoutines] = useState([]);
  const [categories, setCategories] = useState([]);
  const [newRoutine, setNewRoutine] = useState({ name: '', description: '', categoryId: '' });
  const [error, setError] = useState('');

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

  return (
    <ProtectedRoute>
      <div
        style={{
          maxWidth: '400px',
          margin: '0 auto',
          padding: '16px',
          display: 'flex',
          flexDirection: 'column',
          height: '100vh',
          justifyContent: 'space-between',
          backgroundColor: '#f9f9f9',
        }}
      >
        <div
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            paddingBottom: '60px',
          }}
        >
          <h1 style={{ textAlign: 'center', marginBottom: '16px', color: 'green' }}>
            Routines
          </h1>
          <p style={{ textAlign: 'center', color: '#7D7D7D', marginBottom: '32px' }}>
            Your workout routines and schedules...
          </p>

          {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}

          <form onSubmit={handleAddRoutine} style={{ marginBottom: '16px' }}>
            <div style={{ marginBottom: '8px' }}>
              <label style={{ display: 'block', marginBottom: '4px', color: 'black' }}>Name:</label>
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
              <label style={{ display: 'block', marginBottom: '4px', color: 'black' }}>Description:</label>
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
            <button type="submit" style={{ padding: '10px 20px', backgroundColor: 'green', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
              Add Routine
            </button>
          </form>

          {routines.map((routine) => (
            <div
              key={routine.id}
              style={{
                textAlign: 'center',
                marginBottom: '16px',
                backgroundColor: 'white',
                borderRadius: '8px',
                padding: '12px',
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
              }}
            >
              <h2 style={{ color: 'green' }}>{routine.name}</h2>
              <p style={{ color: '#7D7D7D' }}>{routine.description}</p>
              <button onClick={() => handleDeleteRoutine(routine.id)} style={{ backgroundColor: 'red', color: 'white', padding: '8px 16px', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                Delete
              </button>
            </div>
          ))}
        </div>

        <MobileNavbar />
      </div>
    </ProtectedRoute>
  );
};

export default Routines;