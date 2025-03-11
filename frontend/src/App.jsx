import React from 'react';
import { Routes, Route } from 'react-router-dom';
import PrivateRoute from './components/PrivateRoute';
import ViewData from './pages/ViewData.jsx';
import DetailedView from './pages/DetailedView';
import InputForm from './pages/inputform.jsx';
import Login from './pages/Login';
import { Provider } from 'react-redux';
import { store } from './redux/store';
import Navbar from './components/layout/Navbar.jsx';


function App() {
    return (
        <Provider store={store}>
            <Navbar />
            <Routes>
                <Route path="/" element={<ViewData />} />
                <Route path="/admin" element={<Login />} />
                <Route path="/add" element={
                    <PrivateRoute>
                        <InputForm />
                    </PrivateRoute>
                } />
                <Route path="/edit/:id" element={
                    <PrivateRoute>
                        <InputForm />
                    </PrivateRoute>
                } />
                <Route path="/view/:id" element={<DetailedView />} />
            </Routes>
        </Provider>
    );
}

export default App;
