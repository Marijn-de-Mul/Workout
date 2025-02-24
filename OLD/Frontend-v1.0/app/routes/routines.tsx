import React, { useEffect, useState, Suspense } from 'react';
import Cookies from 'js-cookie';
import MobileNavbar from './components/MobileNavbar';
import ProtectedRoute from './components/ProtectedRoute';

const ExerciseList = React.lazy(() => import('./components/routines/ExerciseList'));
const RoutineSettings = React.lazy(() => import('./components/settings/RoutinesSettings'));

const Routines = () => {
  const [routines, setRoutines] = useState([]);
  const [selectedRoutine, setSelectedRoutine] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
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

    fetchRoutines();
  }, []);

  const handleRoutineClick = (routine) => {
    setSelectedRoutine(routine);
  };

  const handleBackClick = () => {
    setSelectedRoutine(null);
  };

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleEditBackClick = () => {
    setIsEditing(false);
  };

  const renderContent = () => {
    if (isEditing) {
      return <RoutineSettings />;
    } else if (selectedRoutine) {
      return <ExerciseList routine={selectedRoutine} />;
    } else {
      return (
        <>
          <div style={{ position: 'sticky', top: 0, backgroundColor: '#f9f9f9', zIndex: 1, paddingBottom: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h1 style={{ textAlign: 'center', marginBottom: '16px', color: 'green', marginRight: '60vw' }}>
                Routines
              </h1>
              <button onClick={handleEditClick} style={{ padding: '8px 16px', backgroundColor: 'blue', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                Edit
              </button>
            </div>
          </div>

          {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}

          <div style={{ flex: 1, overflowY: 'auto' }}>
            {routines.map((routine) => (
              <div
                key={routine.id}
                onClick={() => handleRoutineClick(routine)}
                style={{
                  textAlign: 'center',
                  marginBottom: '16px',
                  backgroundColor: 'white',
                  borderRadius: '8px',
                  padding: '12px',
                  boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
                  cursor: 'pointer',
                }}
              >
                <h2 style={{ color: 'green' }}>{routine.name}</h2>
                <p style={{ color: '#7D7D7D' }}>{routine.description}</p>
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
        {(isEditing || selectedRoutine) && (
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

export default Routines;