import React, { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import MobileNavbar from './components/MobileNavbar';
import ProtectedRoute from './components/ProtectedRoute';

const Exercises = () => {
  const [exercises, setExercises] = useState([]);
  const [routines, setRoutines] = useState([]);
  const [categories, setCategories] = useState([]);
  const [newExercise, setNewExercise] = useState({ name: '', description: '', routineId: '', categoryId: '' });
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchExercises = async () => {
      try {
        const response = await fetch('/proxy', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            endpoint: '/api/Exercise',
            method: 'GET',
            authorization: Cookies.get('authToken'),
            body: null,
            contentType: 'application/json',
          }),
        });

        if (response.ok) {
          const data = await response.json();
          const exercises = data.$values ? data.$values : [];
          setExercises(exercises);
        } else {
          setError('Failed to fetch exercises.');
        }
      } catch (error) {
        setError('Failed to fetch exercises.');
      }
    };

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
          const categories = data.$values ? data.$values.filter(category => category.type === 'Exercise') : [];
          setCategories(categories);
        } else {
          setError('Failed to fetch categories.');
        }
      } catch (error) {
        setError('Failed to fetch categories.');
      }
    };

    fetchExercises();
    fetchRoutines();
    fetchCategories();
  }, []);

  const handleAddExercise = async (event) => {
    event.preventDefault();

    const exerciseToAdd = {
      name: newExercise.name,
      description: newExercise.description,
      routineId: parseInt(newExercise.routineId),
      categoryId: parseInt(newExercise.categoryId),
    };

    try {
      const response = await fetch('/proxy', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          endpoint: '/api/Exercise',
          method: 'POST',
          authorization: Cookies.get('authToken'),
          body: exerciseToAdd,
          contentType: 'application/json',
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setExercises([...exercises, data]);
        setNewExercise({ name: '', description: '', routineId: '', categoryId: '' });
      } else {
        setError('Failed to add exercise.');
      }
    } catch (error) {
      setError('Failed to add exercise.');
    }
  };

  const handleDeleteExercise = async (id) => {
    try {
      const response = await fetch('/proxy', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          endpoint: `/api/Exercise/${id}`,
          method: 'DELETE',
          authorization: Cookies.get('authToken'),
          body: null,
          contentType: 'application/json',
        }),
      });

      if (response.ok) {
        setExercises(exercises.filter((exercise) => exercise.id !== id));
      } else {
        setError('Failed to delete exercise.');
      }
    } catch (error) {
      setError('Failed to delete exercise.');
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
            Exercises
          </h1>
          <p style={{ textAlign: 'center', color: '#7D7D7D', marginBottom: '32px' }}>
            Your exercise routines and details...
          </p>

          {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}

          <form onSubmit={handleAddExercise} style={{ marginBottom: '16px' }}>
            <div style={{ marginBottom: '8px' }}>
              <label style={{ display: 'block', marginBottom: '4px', color: 'black' }}>Name:</label>
              <input
                type="text"
                placeholder="Enter exercise name"
                value={newExercise.name}
                onChange={(e) => setNewExercise({ ...newExercise, name: e.target.value })}
                required
                style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc', color: 'black', backgroundColor: 'white' }}
              />
            </div>
            <div style={{ marginBottom: '8px' }}>
              <label style={{ display: 'block', marginBottom: '4px', color: 'black' }}>Description:</label>
              <input
                type="text"
                placeholder="Enter exercise description"
                value={newExercise.description}
                onChange={(e) => setNewExercise({ ...newExercise, description: e.target.value })}
                required
                style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc', color: 'black', backgroundColor: 'white' }}
              />
            </div>
            <div style={{ marginBottom: '8px' }}>
              <label style={{ display: 'block', marginBottom: '4px', color: 'black' }}>Routine:</label>
              <select
                value={newExercise.routineId}
                onChange={(e) => setNewExercise({ ...newExercise, routineId: e.target.value })}
                required
                style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc', color: 'black', backgroundColor: 'white' }}
              >
                <option value="" disabled>Select a routine</option>
                {routines.map((routine) => (
                  <option key={routine.id} value={routine.id}>{routine.name}</option>
                ))}
              </select>
            </div>
            <div style={{ marginBottom: '8px' }}>
              <label style={{ display: 'block', marginBottom: '4px', color: 'black' }}>Category:</label>
              <select
                value={newExercise.categoryId}
                onChange={(e) => setNewExercise({ ...newExercise, categoryId: e.target.value })}
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
              Add Exercise
            </button>
          </form>

          {exercises.map((exercise) => (
            <div
              key={exercise.id}
              style={{
                textAlign: 'center',
                marginBottom: '16px',
                backgroundColor: 'white',
                borderRadius: '8px',
                padding: '12px',
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
              }}
            >
              <h2 style={{ color: 'green' }}>{exercise.name}</h2>
              <p style={{ color: '#7D7D7D' }}>{exercise.description}</p>
              <button onClick={() => handleDeleteExercise(exercise.id)} style={{ backgroundColor: 'red', color: 'white', padding: '8px 16px', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
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

export default Exercises;