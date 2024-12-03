import Router from "./Components/Router"
import ProfileDetailsProvider from "./Providers/ProfileDetailsProvider"

function App() {
  return (
    <ProfileDetailsProvider>
      <Router />
    </ProfileDetailsProvider>
  )
};

export default App
 