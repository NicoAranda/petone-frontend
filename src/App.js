import {BrowserRouter, Routes, Route} from 'react-router-dom';
import LoginRegister from './LoginRegister';

function App() {
  return (
    <BrowserRouter>
        <Routes>
            <Route path='/' element={<LoginRegister/>}> </Route>
        </Routes>
    </BrowserRouter>
  );
}

export default App;