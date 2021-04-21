import {
    BrowserRouter as Router,
    Route,
    Switch,
    Redirect
} from 'react-router-dom';
import ExampleRouter from './example-router/ExampleRouter'
import Bookings from "./components/bookings/Bookings";
import NavBar from "./components/navbar/Navbar"
import NewBooking from "./components/new_booking/NewBooking"
import Prices from "./components/prices/Prices";
import AllBookingsTable from "./components/allBookingsView/AllBookingsTable";

const newBooking = 'Här kommer man kunna skapa nya bokningar!'
const prices = 'Priser'
const settings = 'Inställningar'

function App() {
    return (
        <Router>
            <Switch>
                <Route path="/kalender">
                    <NavBar/>
                    <Bookings/>
                </Route>
                <Route path="/allabokningar">
                    <NavBar/>
                    <AllBookingsTable/>
                </Route>
                <Route path='/nybokning'>
                    <NavBar/>
                    <NewBooking/>
                </Route>
                <Route path='/priser'>
                    <NavBar/>
                    <Prices/>
                </Route>
                <Route path='/installningar'>
                    <NavBar/>
                    <ExampleRouter title={settings}/>
                </Route>
                <Route exact path="*" render={() => (
                    <Redirect to='/kalender'/>
                )}/>
            </Switch>
        </Router>
    );
}

export default App;
