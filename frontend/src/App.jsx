import {
  BrowserRouter  as Router,
  Redirect,
  Route
} from 'react-router-dom'

import { QueryClient, QueryClientProvider } from "@tanstack/react-query"

import './App.css'

import AddItem from './items/pages/AddItem'
import Authenticate from './users/pages/Authenticate'
import { Switch } from 'react-router-dom/cjs/react-router-dom.min'
import MainNavigation from './shared/components/MainNavigation/MainNavigation'

import { AuthContextProvider } from './shared/context/AuthContextProvider'
import { useAuthContext } from './shared/context/auth-context'
import EditItem from './items/pages/EditItem'
import Items from './items/pages/Items'
import MyItems from './items/pages/MyItems'
import ScrollToTop from './shared/components/ScrollToTop'

const queryClient = new QueryClient()

function AppContent() {
  const { token } = useAuthContext();
  let routes;

  if(token) {
    routes =(
        <Switch>
        <Route path="/" exact>
          <Items />
        </Route>
        <Route path="/items/myitems" exact>
          <MyItems />
        </Route>
        <Route path="/items/new" exact>
          <AddItem />
        </Route>
        <Route path="/items/edit/:id" component={EditItem}/>
        <Redirect to="/" />
      </Switch>
    );
  }
  else{
    routes = (
      <Switch>
        <Route path="/" exact>
          <Items />
        </Route>
        <Route path="/auth">
          <Authenticate />
        </Route>
        <Redirect to="/" />
      </Switch>
    )
  }
  return (
      <Router>
        <ScrollToTop />
        <MainNavigation />
        <main>
          {routes}
        </main>
      </Router>
  )
}

function App() {
  return (
    <AuthContextProvider>
      <QueryClientProvider client={queryClient}>
        <AppContent />
      </QueryClientProvider>
    </AuthContextProvider>
  )
}

export default App
