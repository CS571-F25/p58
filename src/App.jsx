import './App.css'
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom'
import { NavigationProvider } from './contexts/NavigationContext'
import NavBar from './components/NavBar'
import Home from './components/Home'
import Decks from './components/Decks'
import Leaderboards from './components/Leaderboards'
import Search from './components/Search'
import Build from './components/Build'
import Cache from './components/Cache'

function App() {
  return (
    <HashRouter>
      <NavigationProvider>
        <NavBar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/decks" element={<Decks />}>
            <Route index element={<Navigate to="build" replace />} />
            <Route path="search" element={<Search />} />
            <Route path="build" element={<Build />} />
            <Route path="cache" element={<Cache />} />
          </Route>
          <Route path="/leaderboards" element={<Leaderboards />} />
        </Routes>
      </NavigationProvider>
    </HashRouter>
  )
}

export default App
