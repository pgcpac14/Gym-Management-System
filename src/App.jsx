import './App.css'
import LoginComp from './components/LoginComp'
import RegisterComp from './components/RegisterComp'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import HomeComp from './components/HomeComp.jsx'
import ProtectedRoutes from './components/ProtectedRoutes.jsx'
import UserDashBoard from './components/UserDashBoard.jsx'
import AdminDashBoard from './components/AdminDashBoard.jsx'
import TrainerDashBoard from './components/TrainerDashBoard.jsx'
import LogoutComp from './components/Logout.jsx'
import DummyPage from './components/pages/DummyPage.jsx'
import SubscriptionFlow from './components/SubscriptionFlow.jsx'
import MembersList from './components/pages/MembersList.jsx'
import TrainersList from './components/pages/TrainersList.jsx'
import GymEarnings from './components/pages/GymEarnings.jsx'
import AssignTrainer from './components/pages/AssignTrainer.jsx'

function App() {
  return (
    <>
     <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomeComp/>}/>
          <Route path="login" element={<LoginComp/>}/>
          <Route path="register" element={<RegisterComp/>}/>

          {/* Subscription Flow */}
          <Route path="/subscribe" element={<ProtectedRoutes role="MEMBER"><SubscriptionFlow/></ProtectedRoutes>}/>

          {/* Admin Routes */}
          <Route path="/admin" element={<ProtectedRoutes role="ADMIN"><AdminDashBoard/></ProtectedRoutes>}>
            <Route index element={<DummyPage title="Admin Dashboard"/>}/>
            <Route path="members" element={<MembersList/>}/>
            <Route path="trainers" element={<TrainersList/>}/>
            <Route path="assign-trainer" element={<AssignTrainer/>}/>
            <Route path="subscriptions" element={<DummyPage title="Subscriptions"/>}/>
            <Route path="gym-earnings" element={<GymEarnings/>}/>
            <Route path="logout" element={<LogoutComp/>}/>
          </Route>

          {/* Trainer Routes */}
          <Route path="/trainer" element={<ProtectedRoutes role="TRAINER"><TrainerDashBoard/></ProtectedRoutes>}>
            <Route index element={<DummyPage title="Trainer Dashboard"/>}/>
            <Route path="my-members" element={<DummyPage title="My Members"/>}/>
            <Route path="workout-plans" element={<DummyPage title="Members Workout Plan"/>}/>
            <Route path="diet-plans" element={<DummyPage title="Members Diet Plan"/>}/>
            <Route path="progress-reports" element={<DummyPage title="Members Progress"/>}/>
            <Route path="logout" element={<LogoutComp/>}/>
          </Route>

          {/* Member Routes */}
          <Route path="/member" element={<ProtectedRoutes role="MEMBER"><UserDashBoard/></ProtectedRoutes>}>
            <Route index element={<DummyPage title="Member Dashboard"/>}/>
            <Route path="subscription" element={<DummyPage title="Subscription"/>}/>
            <Route path="workout-plan" element={<DummyPage title="Workout Plan"/>}/>
            <Route path="diet-plan" element={<DummyPage title="Diet Plan"/>}/>
            <Route path="progress-report" element={<DummyPage title="Progress Report"/>}/>
            <Route path="logout" element={<LogoutComp/>}/>
          </Route>

          {/* Unauthorized */}
          <Route path="/unauthorized" element={<h2>Unauthorized Access</h2>}/>
        </Routes>
     </BrowserRouter>
    </>
  )
}

export default App