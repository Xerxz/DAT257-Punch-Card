import React, {useState, useEffect} from 'react';
import {DataTable} from 'primereact/datatable';
import {Column} from 'primereact/column';
import BookingService from "../services/BookingService";
import {useHistory} from "react-router-dom";
import {Button} from 'primereact/button';
import {ToggleButton} from 'primereact/togglebutton';
import {InputText} from "primereact/inputtext";
import {Dialog} from "primereact/dialog";
import moment from 'moment'

/**
 * Creates the table that shows all bookings with customer info
 * @returns {JSX.Element}
 * @constructor
 */

export default function AllBookingsTable() {
    let [booking, setBookings] = useState([]);
    const [finishedBooking, setFinishedBooking] = useState([])
    const [archivedBooking, setArchivedBooking] = useState([])
    const [updateTable, setUpdateTable] = useState()
    const [selectedBooking, setSelectedBooking] = useState(null);
    const [globalFilter, setGlobalFilter] = useState(null);
    const [deletePaidDialog, setDeletePaidDialog] = useState(false);

    const history = useHistory();
    const bookingService = new BookingService();
    let data;

    useEffect(() => {
        setUpdateTable(updateTable + 1)
        bookingService.getAllBookings().then(data => {
            setBookings(data)

        });
    }, []);


    let nFinished = 0;
    let activeBookings = 0;
    let archivedBookings = 0;
    let active = booking;
    booking = []
    for (let i = 0; i < active.length; i++) {
        if (moment().isAfter(active[i].endTime) && !active[i].archived) {
            finishedBooking[nFinished] = active[i];
            nFinished++;
        } else if (!active[i].archived) {
            booking[activeBookings] = active[i]
            activeBookings++
        } else {
            archivedBooking[archivedBookings] = active[i]
            archivedBookings++
        }
    }

    const onClickButton = (event) => {
        history.push("/allabokningar/" + event.id);
    }

    const hidePaidDialog = () => {
        setDeletePaidDialog(false);
    }
    const confirmPaid = () => {
        setBookings(booking);
        setDeletePaidDialog(true);
    }

    /**
     * Function to handle a payment
     * @param event
     */

    const confirmDeletePayment = (event) => {
        setBookings(booking);
        setDeletePaidDialog(true);
    }

    const onClickPaid = (event) => {

        console.log(bookingService)
        bookingService.putPayment(event.id, !event.paid).then(() => {
            bookingService.getAllBookings().then(data => {
                setBookings(data)
            })
        })
        setDeletePaidDialog(false);
    }


    const deletePaymentDialogFooter = () => {
        return (
            <React.Fragment>
                <Button label="Nej" icon="pi pi-times" className="p-button-text" onClick={hidePaidDialog}/>
                <Button label="Ja" icon="pi pi-check" className="p-button-text" onClick={(data) => onClickPaid(data)}/>
            </React.Fragment>
        );
    }

    const actionTemplate = (rowData) => {
        return (
            <React.Fragment>
                <Button icon="pi pi-user-edit" className="p-button-rounded p-button-success p-mr-2"
                        onClick={() => onClickButton(rowData)}/>
                <ToggleButton onLabel="Betalt" offLabel="Ej betalt" onIcon="pi pi-check" offIcon="pi pi-times"
                              checked={rowData.paid} onChange={() => onClickPaid(rowData)}/>
            </React.Fragment>
        );
    }


    const renderHeader = (globalFilterKey, header) => {
        return (
            <div className="p-d-flex">
                <span className="p-input-icon-left">
                    <i className="pi pi-search"/>
                    <InputText type="search" onInput={(e) => setGlobalFilter(e.target.value)}
                               placeholder="Sök efter bokning"/>
                </span>
                <div style={{marginLeft: "50px", fontSize: "28px"}}>{header}


                </div>

            </div>
        );
    }

    let footerActive = `Det finns totalt aktiva ${booking ? booking.length : 0} bokningar.`;
    let footerInActive = `Det finns totalt inaktiva ${booking ? finishedBooking.length : 0} bokningar.`;

    return (
        <div className="p-shadow-3 p-m-5">
            <DataTable footer={footerActive} value={booking} scrollable scrollWidth="300px" style={{width: '100%'}}
                        dataKey="id"
                       header={renderHeader(globalFilter, "Alla aktiva bokiningar")} globalFilter={globalFilter}>
                <Column field="customer.name" header="Namn" headerStyle={{width: '110px'}} sortable></Column>
                <Column field="customer.phoneNr" header="Telefon" headerStyle={{width: '140px'}}></Column>
                <Column field="id" header="Boknings-Id" headerStyle={{width: '100px'}} sortable></Column>
                <Column field="groupSize" header="Antal personer" headerStyle={{width: '100px'}} sortable></Column>
                {/*<Column field="startTime" header="Start datum " headerStyle={{ width: '160px' }} sortable></Column>
                    <Column field="endTime" header="Slut datum" headerStyle={{ width: '160px' }} sortable></Column> */}
                <Column field="description" header="Övrigt" headerStyle={{width: '300px'}}></Column>
                <Column field="responsible" header="Ansvarig" headerStyle={{width: '160px'}} sortable></Column>
                <Column headerStyle={{width: '200px'}} body={actionTemplate}></Column>

            </DataTable>
            <DataTable footer={footerInActive} value={finishedBooking} scrollable scrollWidth="300px"
                       style={{width: '100%'}}
                       dataKey="id"
                       header={renderHeader(globalFilter, "Alla äldre bokningar")} globalFilter={globalFilter}>
                <Column field="customer.name" header="Namn" headerStyle={{width: '110px'}} sortable></Column>
                <Column field="customer.phoneNr" header="Telefon" headerStyle={{width: '140px'}}></Column>
                <Column field="id" header="Boknings-Id" headerStyle={{width: '100px'}} sortable></Column>
                <Column field="groupSize" header="Antal personer" headerStyle={{width: '100px'}} sortable></Column>
                {/*<Column field="startTime" header="Start datum " headerStyle={{ width: '160px' }} sortable></Column>
                    <Column field="endTime" header="Slut datum" headerStyle={{ width: '160px' }} sortable></Column> */}
                <Column field="description" header="Övrigt" headerStyle={{width: '300px'}}></Column>
                <Column field="responsible" header="Ansvarig" headerStyle={{width: '160px'}} sortable></Column>
                <Column headerStyle={{width: '200px'}} body={actionTemplate}></Column>
            </DataTable>

            <Dialog visible={deletePaidDialog} style={{width: '450px'}} header="Bekräfta ändring av betalning" modal
                    footer={deletePaymentDialogFooter} onHide={hidePaidDialog}>
                <div className="confirmation-content">
                    <i className="pi pi-exclamation-triangle p-mr-3" style={{fontSize: '2rem'}}/>
                    {booking && <span>Är du säker på att du vill ändra betalningen?</span>}
                </div>
            </Dialog>
        </div>

    );
}


