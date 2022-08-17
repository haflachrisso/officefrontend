import { Route, Routes } from '@solidjs/router';
import { Component, createEffect, createResource } from 'solid-js';
import Home from './pages/home';


const App: Component = () => {

  return (
    <div>
      <header class="text-xl text-center bg-white shadow-lg font-bold py-2">
        Office Climate Watcher 2.0 🤖
      </header>
      <main class="bg-gray-100 p-8">
        <Routes>
          <Route path="/" component={Home} />
        </Routes>
      </main>
    </div>
  );
};

export default App;
