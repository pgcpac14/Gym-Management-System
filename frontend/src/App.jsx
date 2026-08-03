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
import SubscriptionFlow from './components/SubscriptionFlow.jsx'
import MembersList from './components/pages/MembersList.jsx'
import TrainersList from './components/pages/TrainersList.jsx'
import GymEarnings from './components/pages/GymEarnings.jsx'
import AssignTrainer from './components/pages/AssignTrainer.jsx'
import CreateTrainer from './components/pages/CreateTrainer.jsx'
import MemberDashHome from './components/pages/MemberDashHome.jsx'
import SubscriptionMember from './components/pages/SubscriptionMember.jsx'
import TrainerDashHome from './components/pages/TrainerDashHome.jsx'
import MyMembers from './components/pages/MyMembers.jsx'
import TrainerWorkoutPlans from './components/pages/TrainerWorkoutPlans.jsx'
import TrainerDietPlans from './components/pages/TrainerDietPlans.jsx'
import TrainerProgressReports from './components/pages/TrainerProgressReports.jsx'
import WorkoutPlanMember from './components/pages/WorkoutPlanMember.jsx'
import DietPlanMember from './components/pages/DietPlanMember.jsx'
import ProgressReportMember from './components/pages/ProgressReportMember.jsx'
import AdminDashHome from './components/pages/AdminDashHome.jsx'
import Subscriptions from './components/pages/Subscriptions.jsx'

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
            <Route index element={<AdminDashHome/>}/>
            <Route path="members" element={<MembersList/>}/>
            <Route path="trainers" element={<TrainersList/>}/>
            <Route path="create-trainer" element={<CreateTrainer/>}/>
            <Route path="assign-trainer" element={<AssignTrainer/>}/>
            <Route path="subscriptions" element={<Subscriptions/>}/>
            <Route path="gym-earnings" element={<GymEarnings/>}/>
            <Route path="logout" element={<LogoutComp/>}/>
          </Route>

          {/* Trainer Routes */}
          <Route path="/trainer" element={<ProtectedRoutes role="TRAINER"><TrainerDashBoard/></ProtectedRoutes>}>
            <Route index element={<TrainerDashHome/>}/>
            <Route path="my-members" element={<MyMembers/>}/>
            <Route path="workout-plans" element={<TrainerWorkoutPlans/>}/>
            <Route path="diet-plans" element={<TrainerDietPlans/>}/>
            <Route path="progress-reports" element={<TrainerProgressReports/>}/>
            <Route path="logout" element={<LogoutComp/>}/>
          </Route>

          {/* Member Routes */}
          <Route path="/member" element={<ProtectedRoutes role="MEMBER"><UserDashBoard/></ProtectedRoutes>}>
            <Route index element={<MemberDashHome/>}/>
            <Route path="subscription" element={<SubscriptionMember/>}/>
            <Route path="workout-plan" element={<WorkoutPlanMember/>}/>
            <Route path="diet-plan" element={<DietPlanMember/>}/>
            <Route path="progress-report" element={<ProgressReportMember/>}/>
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