import React, { useEffect, useState, Suspense } from 'react';
import Cookies from 'js-cookie';
import MobileNavbar from './components/MobileNavbar';
import ProtectedRoute from './components/ProtectedRoute';
import ExerciseDetails from './components/exercises/ExerciseDetails';

const ExerciseSettings = React.lazy(() => import('./components/settings/ExercisesSettings'));

const Exercises = () => {
  const [exercises, setExercises] = useState([]);
  const [routines, setRoutines] = useState([]);
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
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

    fetchExercises();
    fetchRoutines();
  }, []);

  const handleExerciseClick = (exercise) => {
    setSelectedExercise(exercise);
  };

  const handleBackClick = () => {
    setSelectedExercise(null);
  };

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleEditBackClick = () => {
    setIsEditing(false);
  };

  const renderContent = () => {
    if (isEditing) {
      return <ExerciseSettings />;
    } else if (selectedExercise) {
      const routine = routines.find(routine => routine.id === selectedExercise.routineId);
      return <ExerciseDetails exercise={selectedExercise} routine={routine} error={error} />;
    } else {
      return (
        <>
          <div style={{ position: 'sticky', top: 0, backgroundColor: '#f9f9f9', zIndex: 1, paddingBottom: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h1 style={{ textAlign: 'center', marginBottom: '16px', color: 'green', marginRight: '60vw' }}>
                Exercises
              </h1>
              <button onClick={handleEditClick} style={{ padding: '8px 16px', backgroundColor: 'blue', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                Edit
              </button>
            </div>
          </div>

          {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}

          <div style={{ flex: 1, overflowY: 'auto' }}>
            {exercises.map((exercise) => (
              <div
                key={exercise.id}
                onClick={() => handleExerciseClick(exercise)}
                style={{
                  textAlign: 'center',
                  marginBottom: '16px',
                  backgroundColor: 'white',
                  borderRadius: '8px',
                  padding: '12px',
                  width: '90%',
                  margin: '0 auto',
                  boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
                  cursor: 'pointer',
                }}
              >
                <h2 style={{ color: 'green' }}>{exercise.name}</h2>
                <p style={{ color: '#7D7D7D' }}>{exercise.description}</p>
              </div>
            ))}
          </div>
        </>
      );
    }
  };

  return (
    <ProtectedRoute>
      <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', alignItems: 'center', padding: '16px', backgroundColor: '#f9f9f9' }}>
        {(isEditing || selectedExercise) && (
          <button onClick={isEditing ? handleEditBackClick : handleBackClick} style={{ position: 'absolute', top: '16px', left: '16px', background: 'none', border: 'none', color: 'green' }}>
            <svg width="24px" height="24px" viewBox="-5.5 0 26 26" xmlns="http://www.w3.org/2000/svg">
              <path d="M428.115,1209 L437.371,1200.6 C438.202,1199.77 438.202,1198.43 437.371,1197.6 C436.541,1196.76 435.194,1196.76 434.363,1197.6 L423.596,1207.36 C423.146,1207.81 422.948,1208.41 422.985,1209 C422.948,1209.59 423.146,1210.19 423.596,1210.64 L434.363,1220.4 C435.194,1221.24 436.541,1221.24 437.371,1220.4 C438.202,1219.57 438.202,1218.23 437.371,1217.4 L428.115,1209" fill="#000000"/>
            </svg>
            Back
          </button>
        )}

        <Suspense fallback={<div>Loading...</div>}>
          {renderContent()}
        </Suspense>

        <MobileNavbar />
      </div>
    </ProtectedRoute>
  );
};

export default Exercises;