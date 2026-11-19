import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import HomePage from './pages/Home/HomePage';
import ArticlePage from './pages/Article/ArticlePage';
import TestDID from './pages/TestDID';

export default function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/article/:id" element={<ArticlePage />} />
        <Route path="/test-did" element={<TestDID />} />
      </Routes>
    </>
  );
}