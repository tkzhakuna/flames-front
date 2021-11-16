import React, {Component} from "react";
import axios from "axios";
import Select from "react-select";
import {CircularProgress} from '@material-ui/core';


const FileDownload = require('js-file-download');

class Home extends Component {
    constructor() {
        super()
        this.state = {
            paymentMethod: "",
            status: "",
            sbu: "",
            policyStatus: [{label: "Active", value: "A"}, {label: "Accepted", value: "AC"}, {
                label: "Domant",
                value: "D"
            }, {label: "New", value: "N"}, {label: "Ceased", value: "X"}, {label: "Matured", value: "M"}],
            sbus: [{label: "Legal", value: "LG"}, {label: "Funeral", value: "FN"}],
            paymentMethods: [],
            buttonState: ''

        };
        this.findPaymentMethods = this.findPaymentMethods.bind(this);
        this.handlePMChange = this.handlePMChange.bind(this);
        this.handleStatusChange = this.handleStatusChange.bind(this);
        this.handleSbuChange = this.handleSbuChange.bind(this);
        this.submit = this.submit.bind(this);
        this.downloadCSV = this.downloadCSV.bind(this);
    }

    componentDidMount() {
        this.findPaymentMethods();
    }

    findPaymentMethods() {

        const url = "/flames-admin/paymentmethods/getall";

        axios.get(url).then((response) => {
            const data = response.data;

            this.setState({paymentMethods: data});
        }).catch(
            function (error) {

                alert('An Error occrured please try again')
            }
        );

    }

    handlePMChange(val) {
        this.setState({paymentMethod: val});
    }

    handleStatusChange(val) {
        this.setState({status: val});
    }

    handleSbuChange(val) {
        this.setState({sbu: val});
    }

    submit() {
        this.setState({buttonState: "loading"})
        const policyStatus = this.state.status.value;
        const sbu = this.state.sbu.value;
        const paymentMethod = this.state.paymentMethod.id;

        if (!(policyStatus && sbu && paymentMethod)) {
            alert("Please Select all options")
        } else {


            const url = "/flames-admin/reports/csv/" + policyStatus + "/" + sbu + "/" + paymentMethod;

            axios.get(url, {responseType: 'blob'}).then((response) => {
                //const data = response.data;

                //Create a Blob from the PDF Stream
                const file = new Blob(
                    [response.data]
                    , {type: 'application/csv'});

                FileDownload(response.data, 'report.csv');
                //Build a URL from the file
                // const fileURL = URL.createObjectURL(file);
                this.setState({buttonState: "complete"})
                //Open the URL on new Window
                //window.open(fileURL);
                alert("Download completed!")

            }).catch(
                function (error) {

                    alert('An Error occrured please try again')
                }
            );
        }
    }

    downloadCSV() {
        this.setState({buttonState: "loading"})
        const paymentMethod = this.state.paymentMethod.id;

        if (!(paymentMethod)) {
            alert("Please Select payment method")
        } else {


            const url = "/flames-admin/reports/csv-report/" + paymentMethod;

            axios.get(url, {responseType: 'blob'}).then((response) => {
                //const data = response.data;

                //Create a Blob from the PDF Stream
                const file = new Blob(
                    [response.data]
                    , {type: 'application/csv'});

                FileDownload(response.data, 'report1.csv');
                //Build a URL from the file
                // const fileURL = URL.createObjectURL(file);

                //Open the URL on new Window
                // window.open(fileURL);
                // alert("Download completed!")
                this.setState({buttonState: "complete"})
            }).catch(
                function (error) {
                    console.log(error.response)
                    alert('An Error occrured please try again')
                }
            );
        }
    }


    render() {
        const paymentMs = (this.state.paymentMethods)

        return (
            <div className="container">
                <form>
                    <div className="row">

                        <div className="col sm-3">
                            <div className="form-group  ">
                                <label>Payment Method</label>
                                <Select options={paymentMs}
                                        value={this.state.paymentMethod}
                                        getOptionLabel={(paymentMethod) => `${paymentMethod.methodOfPayment}`}
                                        onChange={this.handlePMChange}/>
                            </div>

                        </div>


                        <div className="col sm-3">
                            <div className="form-group  ">
                                <label>Policy Status</label>
                                <Select options={this.state.policyStatus}
                                        value={this.state.status}
                                        getOptionLabel={(status) => `${status.label}`}
                                        onChange={this.handleStatusChange}/>

                            </div>

                        </div>

                        <div className="col sm-3">
                            <div className="form-group  ">
                                <label>Business Unit</label>
                                <Select options={this.state.sbus}
                                        value={this.state.sbu}
                                        getOptionLabel={(sbu) => `${sbu.label}`}
                                        onChange={this.handleSbuChange}/>

                            </div>

                        </div>

                    </div>
                    <div className="row">
                        <button
                            type="button"
                            className="btn btn-primary btn-block mt-4"
                            onClick={this.submit}
                        >
                            Submit
                        </button>
                    </div>
                    {this.state.buttonState === "loading" && <CircularProgress/>}
                    <div className="row">
                        <button
                            type="button"
                            className="btn btn-primary btn-block mt-4"
                            onClick={this.downloadCSV}
                        >
                            Download CSV For Bank Submission
                        </button>
                    </div>

                </form>
            </div>
        );
    }
}

export default Home;